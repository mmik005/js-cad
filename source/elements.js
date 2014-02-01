function Point(x, y){
	this.x = 0; this.y = 0;
	
	if(x != undefined && y != undefined){this.x = x; this.y = y;}
	
	this.color = "white";
	this.radius = 4;
	this.thickness = 3;
}

function Vector(x, y){
	this.x = 0; this.y = 0;
	
	if(x != undefined && y != undefined){this.x = x; this.y = y;}
	
	this.Length=function(){return Math.sqrt(this.x*this.x + this.y*this.y);}
	
	this.Normalize=function(){var l = this.Length(); this.x/=l; this.y/=l}
}

function Line(base){
	if(base != undefined){
		this.pointA = base.pointA;
		this.pointB = base.pointB;
		this.a = base.a;
		this.b = base.b;
		this.c = base.c;
		this.type = base.type;
		this.color = base.color;
		this.thickness = base.thickness;
		this.positive = base.positive;
	}else{	
		this.pointA = -1;
		this.pointB = -1;
		
		//ax + by = c
		
		this.a = 0;
		this.b = 1;
		this.c = 1;
		
		this.type = 'segment';
		this.color = "white";
		this.thickness = 2;
		this.positive = true;
	}
	
	this.FromPtIndices = function(pA, pB){
		this.pointA = pA;
		this.pointB = pB;
		
		var d = -(scene.points[pB].x - scene.points[pA].x);
		
		if(d != 0){
			var m = (scene.points[pB].y - scene.points[pA].y)/-(scene.points[pB].x - scene.points[pA].x);
			this.a = m;
			this.c = scene.points[pB].y + m * scene.points[pB].x;
		}else{
			c = scene.points[pB].x; b = 0; a = 1;
		}
	}
	
	this.IsBetweenEndpoints = function(point){
		if(this.type=='infinite')
			return true;
		
		//Returns true if line is infinite
		
		var gx = 0, sx = 0, gy = 0, sy = 0;
		
		var vert = false, horiz = false;
		
		//Begin code for rays...
		
		if(this.type=='ray'){
			if(this.a==0)
				horiz=true;
			if(this.b==0)
				vert=true;
			if(vert&&horiz)
				return false;
			
			if(this.positive){
				if(vert && point.y > scene.points[this.pointA].y)
					return true;
				else if(point.x > scene.points[this.pointA].x)
					return true;
				return false;
			}else{
				if(vert && point.y < scene.points[this.pointA].y)
					return true;
				else if(point.x < scene.points[this.pointA].x)
					return true;
				return false;
			}
		}
		
		//end code for rays. is bound to return a value by now.
		//begin code for line segments...
		
		if(scene.points[this.pointA].x==scene.points[this.pointB].x)
			vert=true;
		else if(scene.points[this.pointA].x>scene.points[this.pointB].x){
			gx = this.pointA; sx = this.pointB;
		}
		else{
			sx = this.pointA; gx = this.pointB;
		}
		
		if(scene.points[this.pointA].y==scene.points[this.pointB].y)
			horiz=true;
		else if(scene.points[this.pointA].y>scene.points[this.pointB].y){
			gy = this.pointA; sy = this.pointB;
		}
		else{
			sy = this.pointA; gy = this.pointB;
		}
		
		if(horiz&&vert)
			return false;
		
		if(horiz && point.x > scene.points[sx].x && point.x < scene.points[gx].x)
			return true;
		else if(vert && point.y > scene.points[sy].y && point.y < scene.points[gy].y)
			return true;
		else if(point.x > scene.points[sx].x && point.x < scene.points[gx].x && 
			point.y > scene.points[sy].y && point.y < scene.points[gy].y)
			return true;
		
		return false;
	}
	
	this.PointDistance = function(point, rounding){
		if(rounding!=undefined)
			return RoundNumber((this.a*point.x + this.b*point.y - this.c)/ Math.sqrt(this.a*this.a + this.b*this.b), rounding);
		else
			return (this.a*point.x + this.b*point.y - this.c)/ Math.sqrt(this.a*this.a + this.b*this.b)
	}
	
	
}

function TwoPointLine(pA, pB){
	var rv = new Line();
	rv.type = 'infinite';
	rv.pointA = -1;
	rv.pointB = -1;
	
	var m = (pB.y - pA.y)/-(pB.x - pA.x);
	rv.a = m;
	rv.c = pB.y + m * pB.x;
	
	if(pA.x == pB.x){
		rv.a = 1; rv.b = 0; rv.c = pA.x;
	}
	
	return rv;
}

function Circle(base){
	if(base != undefined){
		this.center = base.center;
		this.radius = base.radius;
		this.color = base.color;
		this.thickness = base.thickness;
	}else{
		this.center = -1;
		this.radius = 100;
		this.color = "white";
		this.thickness = 2;
	}
	
}

function Arc(base){
	if(base != undefined){
		this.cIdx = base.cIdx;
		this.a = base.a;
		this.aIdx = base.aIdx;
		this.b = base.b;
		this.bIdx = base.bIdx;
		this.radius = base.radius;
		this.color = base.color;
		this.thickness = base.thickness;
		this.ccw = base.ccw;
	}else{
		this.cIdx = -1;
		this.a = 0;
		this.aIdx = -1;
		this.b = 0;
		this.bIdx = -1;
		this.radius = 0;
		this.color = "white";
		this.thickness = 2;
		this.ccw = true;
	}
}

function Tool(){
	this.name = "undefined_tool";
	
	this.toolTip = "undefined_tool";
	
	this.step = 0;
	this.numSteps = -1;
	
	this.Steps = new Array();
	
	this.Draw = function(){}
}

function Cursor(){
	this.location = new Point();
	this.default_color = "#60A0FF";
	this.default_radius = 4;
	this.default_thickness = 2;
	
	this.Refresh = function(){
		this.location.x = mouseState.cursorXInFrame() + camera.location.x;
		this.location.y = -mouseState.cursorYInFrame() + camera.location.y;
	}
}

var cursor = new Cursor();

var currentTool;

function RunCurrentTool(lmb){
	if(currentTool!=undefined)
		currentTool.Steps[currentTool.step](lmb);
}

function ResetTool(){
	currentTool=undefined;
	currentSnapRule=defaultSnapRule;
}

















