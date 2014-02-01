var cvn, context, displayHeight = 600, displayWidth = 800, offset = new Point();
var inFocus = false, initResize = false, showGrid = true, snapToGrid = false;
displayName="CADDisplay";

var tooltip = "JSCAD";
function SetTooltip(t){tooltip=t;}

var pi = Math.PI;

function Distance(ax, ay, bx, by){return Math.sqrt((ax-bx)*(ax-bx) + (ay-by)*(ay-by));}

function PV_Distance(a, b){return Distance(a.x, a.y, b.x, b.y);}

function PV_AngleFromXAxis(point, origin){
	var o = new Point();
	if(origin != undefined){o.x = origin.x; o.y = origin.y;}
	
	var p = new Point(point.x, point.y);
	
	if(p.x == o.x){
		if(p.y > o.y)
			return pi/2;
		else if(p.y < o.y)
			return 3*pi/2;
		else
			return undefined;
	}else{
		var k = (p.y - o.y)/(p.x - o.x);
		var theta = Math.atan(k);
		if(p.x < o.x)
			theta += pi;
		if(theta<0 && p.x > o.x){
			theta += 2*pi;
		}
		return theta;
	}
}

function OnCanvasOver(){inFocus = true;}

function OnCanvasLeave(){inFocus = false;}

//global stuff that will be defined later.

var scene; //da big guy. contains all point, line, etc. data