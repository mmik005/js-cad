function Scene(){
	this.points = new Array();
	this.circles = new Array();
	this.lines = new Array();
	this.arcs = new Array();
	
	this.gridSpacing = 100;
	
	this.DrawAxes = function(c){
		var b = camera.GetViewBounds();
		
		c.beginPath();
		c.moveTo(0,b.top);
		c.lineTo(0,b.bottom);
		c.closePath();
		
		c.lineWidth = 3;
		c.strokeStyle = "white";
		c.stroke();
		
		c.beginPath();
		c.moveTo(b.left, 0);
		c.lineTo(b.right, 0);
		c.closePath();
		c.stroke();
	}
	
	this.DrawGrid = function(c){
		var b = camera.GetViewBounds();
		c.lineWidth = 1;
		c.strokeStyle = "gray";
		//console.log(b);
		
		for(var x = b.left - b.left % this.gridSpacing; x <= b.right; x += this.gridSpacing){	
			c.beginPath();
			c.moveTo(x, b.top);
			c.lineTo(x, b.bottom);
			c.closePath();
			c.stroke();
		}for(var y = b.bottom - b.bottom % this.gridSpacing; y <= b.top; y += this.gridSpacing){
			c.beginPath();
			c.moveTo(b.right, y);
			c.lineTo(b.left, y);
			c.closePath();
			c.stroke();
		}
	}
	
	this.Render = function(c){
		if(c==undefined)
			c = context;
		
		var viewBounds = camera.GetViewBounds();
		
		this.DrawGrid(c);
		this.DrawAxes(c);
		
		for(var q = this.points.length-1; q>=0; q--){
			var p = this.points[q];
			c.beginPath();
			c.arc(p.x, p.y, p.radius, 0, pi*2);
			c.closePath();
			c.strokeStyle = p.color;
			c.lineWidth = p.thickness;
			c.stroke();
		}for(var q = this.lines.length-1; q>=0; q--){
			var l = this.lines[q];
			c.beginPath();
			if(l.type == 'segment'){
				c.moveTo(this.points[l.pointA].x, this.points[l.pointA].y);
				c.lineTo(this.points[l.pointB].x, this.points[l.pointB].y);
			}else if(l.type == 'ray'){
				if(l.positive){

if(l.a!=0 && l.b!=0){ //non-vertical and non-horizontal
	if(this.points[l.pointA].x < viewBounds.right){ // check if you should actually do it
		if(-l.a/l.b <= 1){
			c.moveTo(this.points[l.pointA].x, this.points[l.pointA].y);
			c.lineTo(viewBounds.right, (l.c-l.a*viewBounds.right)/l.b);
		}else{
			c.moveTo(this.points[l.pointA].x, this.points[l.pointA].y);
			c.lineTo(viewBounds.top, (l.c-l.b*viewBounds.top)/l.a);
		}
	}
}else if(l.b == 0 && this.points[l.pointA].y < viewBounds.top){ // vertical
	c.moveTo(this.points[l.pointA].x, this.points[l.pointA].y);
	c.lineTo(this.points[l.pointA].x, viewBounds.top);
}else if(l.a == 0 && this.points[l.pointA].x < viewBounds.right){ //horizontal
	c.moveTo(this.points[l.pointA].x, this.points[l.pointA].y);
	c.lineTo(viewBounds.right, this.points[l.pointA].y);
}
				}else{ // negative
					
if(l.a!=0 && l.b!=0){ //non-vertical and non-horizontal
	if(this.points[l.pointA].x > viewBounds.left){ // check if you should actually do it
		if(-l.a/l.b <= 1){
			c.moveTo(this.points[l.pointA].x, this.points[l.pointA].y);
			c.lineTo(viewBounds.left, (l.c-l.a*viewBounds.left)/l.b);
		}else{
			c.moveTo(this.points[l.pointA].x, this.points[l.pointA].y);
			c.lineTo(viewBounds.bottom, (l.c-l.b*viewBounds.bottom)/l.a);
		}
	}
}else if(l.b == 0 && this.points[l.pointA].y > viewBounds.bottom){ // vertical
	c.moveTo(this.points[l.pointA].x, this.points[l.pointA].y);
	c.lineTo(this.points[l.pointA].x, viewBounds.bottom);
}else if(l.a == 0 && this.points[l.pointA].x > viewBounds.left){ //horizontal
	c.moveTo(this.points[l.pointA].x, this.points[l.pointA].y);
	c.lineTo(viewBounds.left, this.points[l.pointA].y);
}
					
				}
			}else if(l.type=='infinite'){
if(l.a!=0 && l.b!=0){
	if(-l.a/l.b <= 1){
		c.moveTo(viewBounds.left, (l.c-l.a*viewBounds.left)/l.b);
		c.lineTo(viewBounds.right, (l.c-l.a*viewBounds.right)/l.b);
	}else{
		c.moveTo(viewBounds.bottom, (l.c-l.b*viewBounds.bottom)/l.a);
		c.lineTo(viewBounds.top, (l.c-l.b*viewBounds.top)/l.a);
	}
}else if(l.b == 0){ // vertical
	c.moveTo(this.points[l.pointA].x, l.a/l.c);
	c.lineTo(this.points[l.pointA].x, l.a/l.c);
}else if(l.a == 0){ //horizontal
	c.moveTo(viewBounds.right, l.b/l.c);
	c.lineTo(viewBounds.left, l.b/l.c);
}

//end infinite
			}
			c.closePath();
			c.strokeStyle = l.color;
			c.lineWidth = l.thickness;
			c.stroke();
		}for(var q = this.circles.length-1; q >= 0; q--){
			var cr = this.circles[q], p = this.points[cr.center];
			
			c.beginPath();
			c.arc(p.x, p.y, cr.radius, 0, 2*pi);
			c.closePath();
			
			c.strokeStyle = cr.color;
			c.lineWidth = cr.thickness;
			c.stroke();
		}for(var q = this.arcs.length-1; q>=0; q--){
			var a = this.arcs[q], p = this.points[a.cIdx];
			
			c.beginPath();
			c.arc(p.x, p.y, a.radius, a.a, a.b, !a.ccw);
			//c.closePath();
			
			c.strokeStyle = a.color;
			c.lineWidth = a.thickness;
			c.stroke();
		}
		
		if(currentTool!=undefined)
			currentTool.Draw(c);
	}
	
	this.RecalculateIntersections = function(){
		
	}
}

scene = new Scene();