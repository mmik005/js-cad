var shiftLockStart = new Point();
var shiftLock = false;

/*function ShiftLock(){shiftLock=true;}

function ShiftUnlock(){shiftLock=false;}*/

function ShiftLockStart(x,y){shiftLockStart.x = x; shiftLockStart.y = y;}


function SnapRule(point, line, circle, arc, mid, intersection, gridPoint, gridLine){
	this.point = point;
	this.line = line;
	this.circle = circle;
	this.arc = arc;
	this.mid = mid;
	this.gridPoint = gridPoint;
	this.gridLine = gridLine;
	this.intersection = intersection;
	
	this.cRadius = 8;
	this.cColor = "#60A0FF";
}
var defaultSnapRule = new SnapRule(16, 15, 14, 14, 12, 13, 10, 8);
var currentSnapRule = defaultSnapRule;

function SnapToPoint(distance, ix, iy){
	var nearest = -1, delta = distance;
	
	for(var q = scene.points.length-1; q>=0; q--){
		var k = Distance(ix, iy, scene.points[q].x, scene.points[q].y);
		if(k < delta){
			k=delta; nearest=q;
		}
	}
	
	if(nearest==-1)
		return {'index':-1, 'delta':0, 'location':new Point(ix, iy)};
	
	return {'index':nearest, 'delta':delta, 
		'location':new Point(scene.points[nearest].x, scene.points[nearest].y)};
}

function SnapToLineObject(distance, ix, iy, line){
	if(distance==0)
		return {'index':-1, 'delta':0, 'location':new Point(ix, iy)};
	
	var delta=distance, location=new Point();
	
	var k = line.PointDistance(new Point(ix, iy));
	
	if(Math.abs(k) < delta){
		if(line.b==0){
			location.x = ix - k;
			location.y = iy;
		}
		if(line.a==0){
			location.x = ix;
			location.y = iy-k;
		}
		else{
			var moveVec = {'x' : 1, 'y' : 0};
			
			var m = line.b / -line.a;
			
			if(m>0)
				k*=-1;
			
			var n = Math.sqrt(1 + m*m);
			
			moveVec = {'x' : 1/n, 'y' : m/n};
			
			location.x = ix - moveVec.x * k;
			location.y = iy + moveVec.y * k;
		}
		
		if(line.IsBetweenEndpoints(location))
			delta=Math.abs(k);
	}
	
	return {'delta':delta, 'location':location};
}

function SnapToLine(distance, ix, iy){
	if(distance==0)
		return {'index':-1, 'delta':0, 'location':new Point(ix, iy)};
	var nearest = -1;
	var delta = distance;
	var location = new Point();
	
	for(var q = scene.lines.length-1; q>=0; q--){
		var k = SnapToLineObject(delta, ix, iy, scene.lines[q]);
		if(k.delta<delta){
			delta=k.delta;
			nearest=q;
			location.x=k.location.x;
			location.y=k.location.y;
		}
	}
	
	return {'index':nearest, 'delta':delta, 'location':location};
}

function SnapToCircle(distance, ix, iy){
	if(distance==0)
		return {'index':-1, 'delta':0, 'location':new Point(ix, iy)};
	var nearest = -1, delta = distance, location = new Point();
	
	for(var q = scene.circles.length-1; q>=0; q--){
		var center = scene.points[scene.circles[q].center];
		
		var offsetVector = new Vector(ix - center.x, iy - center.y);
		
		var l = offsetVector.Length(), nd=Math.abs(l-scene.circles[q].radius);
		
		if(nd < delta){
			location.x = offsetVector.x/l*scene.circles[q].radius + center.x;
			location.y = offsetVector.y/l*scene.circles[q].radius + center.y;
			delta = nd;
			nearest = q;
		}
	}
	
	return {'index':nearest, 'delta':delta, 'location':location};
}

function SnapToArc(distance, ix, iy){
	if(distance==0)
		return {'index':-1, 'delta':0, 'location':new Point(ix, iy)};
	var nearest = -1, delta = distance, location = new Point();
	
	for(var q = scene.arcs.length-1; q>=0; q--){
		var ac = scene.arcs[q], center = scene.points[ac.cIdx];
		
		var offsetVector = new Vector(ix - center.x, iy - center.y);
		
		var l = offsetVector.Length(), nd = Math.abs(l-ac.radius);
		
		var theta = PV_AngleFromXAxis(new Point(ix, iy), center);
		
		if(nd < delta){
			if(ac.ccw){
				if(ac.a<0){
					var a = ac.a + 2*pi , b = ac.b + 2*pi;
					//console.log("a = " + a + ", b = " +  b + ", theta = " + theta);
					if(theta < a)
						theta += 2*pi;
					if(theta <= b && theta >= a){
						location.x = offsetVector.x/l*ac.radius + center.x;
						location.y = offsetVector.y/l*ac.radius + center.y;
						delta = nd;
						nearest = q;
					}
				}else if(theta <= ac.b && theta >= ac.a){
					location.x = offsetVector.x/l*ac.radius + center.x;
					location.y = offsetVector.y/l*ac.radius + center.y;
					delta = nd;
					nearest = q;
				}
			}else{
				if(ac.a >= 2*pi && theta < ac.b){
					theta += 2*pi;
				}if(theta <= ac.a && theta >= ac.b){
					location.x = offsetVector.x/l*ac.radius + center.x;
					location.y = offsetVector.y/l*ac.radius + center.y;
					delta = nd;
					nearest = q;
				}
			}
		}
	}
	
	return {'index':nearest, 'delta':delta, 'location':location};
}

function Multisnap(sr, _ix, _iy){
	var ix = _ix / camera.zoom, iy = _iy / camera.zoom;
	/*if(shiftLock){
		if(Math.abs(ix-shiftLockStart.x)<=Math.abs(iy-shiftLockStart.y))
			ix=shiftLockStart.x;
		else
			iy=shiftLockStart.y;
	}*/
	
	var point = SnapToPoint(sr.point/camera.zoom, ix, iy);
	var line = SnapToLine(sr.line/camera.zoom, ix, iy);
	var circle = SnapToCircle(sr.circle/camera.zoom, ix, iy);
	var arc = SnapToArc(sr.arc/camera.zoom, ix, iy);
	
	var output = {'index':-1, 'delta':1000, 
		'location':new Point(ix, iy), 'type':'none'};
	
	if(point.index >=0 && point.delta < output.delta)
		output = {'index':point.index, 'delta':point.delta, 
			'location':new Point(point.location.x, point.location.y), 'type':'point'};
	else if(line.delta < output.delta && line.index >= 0)
		output = {'index':line.index, 'delta':line.delta, 
		'location':new Point(line.location.x, line.location.y), 'type':'line'};
	else if(circle.delta < output.delta && circle.index >= 0)
		output = {'index':circle.index, 'delta':circle.delta,
			'location':new Point(circle.location.x, circle.location.y), 'type':'circle'};
	else if(arc.delta < output.delta && arc.index >= 0)
		output = {'index':arc.index, 'delta':arc.delta,
			'location':new Point(arc.location.x, arc.location.y), 'type':'arc'};
	
	if(shiftLock){
		if(Math.abs(output.location.x-shiftLockStart.x)<=Math.abs(output.location.y-shiftLockStart.y)){
			output.location.x=shiftLockStart.x;
			output.type = 'none';
		}else{
			output.location.y=shiftLockStart.y;
			output.type = 'none';
		}
	}
	
	return output;
}