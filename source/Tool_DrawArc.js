var SR_DrawArc = new SnapRule(16, 15, 14, 14, 12, 13, 10, 8);

var Tool_DrawArcCenterTwoPt = new Tool();

Tool_DrawArcCenterTwoPt.name = "Draw Arc Center Two Point";
Tool_DrawArcCenterTwoPt.toolTip = "Draw Circle (center, point, point)"

Tool_DrawArcCenterTwoPt.numSteps = 3;

Tool_DrawArcCenterTwoPt.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		ShiftLockStart(s.location.x, s.location.y);
		
		if(s.index != 1 && s.type == 'point'){
			Tool_DrawArcCenterTwoPt.cIdx = s.index;
			Tool_DrawArcCenterTwoPt.c = scene.points[s.index];
		}else{
			Tool_DrawArcCenterTwoPt.cIdx = scene.points.length;
			scene.points.push(new Point(s.location.x, s.location.y));
			Tool_DrawArcCenterTwoPt.c = scene.points[Tool_DrawArcCenterTwoPt.cIdx];
		}
		
		console.log(Tool_DrawArcCenterTwoPt.c);
		
		Tool_DrawArcCenterTwoPt.step = 1;
	}else
		ResetTool();
});

Tool_DrawArcCenterTwoPt.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		
		if(s.index != -1 && s.type == 'point'){
			Tool_DrawArcCenterTwoPt.a = scene.points[s.index];
			Tool_DrawArcCenterTwoPt.aIdx = s.index;
		}
		else{
			Tool_DrawArcCenterTwoPt.aIdx = scene.points.length;
			scene.points.push(new Point(s.location.x, s.location.y));
			Tool_DrawArcCenterTwoPt.a = scene.points[Tool_DrawArcCenterTwoPt.aIdx];
		}
		
		Tool_DrawArcCenterTwoPt.r = 
				PV_Distance(Tool_DrawArcCenterTwoPt.a, Tool_DrawArcCenterTwoPt.c);
		
		Tool_DrawArcCenterTwoPt.step = 2;
	}else
		ResetTool();
});

Tool_DrawArcCenterTwoPt.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		
		var theta = 0, phi = 0;
		
		var d = PV_Distance(s.location, Tool_DrawArcCenterTwoPt.c);
		
		if(s.index != -1 && s.type == 'point' && d == Tool_DrawArcCenterTwoPt.r){
				Tool_DrawArcCenterTwoPt.b = scene.points[s.index];
				Tool_DrawArcCenterTwoPt.bIdx = s.index;
		}else{
			Tool_DrawArcCenterTwoPt.bIdx = scene.points.length;
			var k = new Point(s.location.x - Tool_DrawArcCenterTwoPt.c.x, s.location.y - Tool_DrawArcCenterTwoPt.c.y);
			k.x = k.x/d*Tool_DrawArcCenterTwoPt.r + Tool_DrawArcCenterTwoPt.c.x; 
			k.y = k.y/d*Tool_DrawArcCenterTwoPt.r + Tool_DrawArcCenterTwoPt.c.y;
			scene.points.push(new Point(k.x, k.y));
			Tool_DrawArcCenterTwoPt.b = scene.points[Tool_DrawArcCenterTwoPt.bIdx];
			
			theta = PV_AngleFromXAxis(Tool_DrawArcCenterTwoPt.a, Tool_DrawArcCenterTwoPt.c);
			console.log("theta = " + theta);
			phi = PV_AngleFromXAxis(Tool_DrawArcCenterTwoPt.b, Tool_DrawArcCenterTwoPt.c);
			
			/*if(theta > phi)
				phi += 2*pi;*/
			
			if(!ctrlKey){
				if(theta > phi)
					theta -= 2*pi;
			}else{
				if(theta < phi)
					theta += 2*pi;
			}
			
			k = new Arc();
			k.a = theta;// + 2*pi;
			k.b = phi;// + 2*pi;
			k.aIdx = Tool_DrawArcCenterTwoPt.aIdx;
			k.bIdx = Tool_DrawArcCenterTwoPt.bIdx;
			k.cIdx = Tool_DrawArcCenterTwoPt.cIdx;
			k.ccw = !ctrlKey;
			k.radius = Tool_DrawArcCenterTwoPt.r;
			
			scene.arcs.push(new Arc(k));
		}
		
		Tool_DrawArcCenterTwoPt.step = 0;
	}else
		ResetTool();
});

Tool_DrawArcCenterTwoPt.Draw = function(c){
	if(Tool_DrawArcCenterTwoPt.step != 2)
		return;
	if(c==undefined)
		c=context;
	var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
	theta = PV_AngleFromXAxis(Tool_DrawArcCenterTwoPt.a, Tool_DrawArcCenterTwoPt.c);
	phi = PV_AngleFromXAxis(s.location, Tool_DrawArcCenterTwoPt.c);
	
	c.beginPath();
	c.arc(Tool_DrawArcCenterTwoPt.c.x, Tool_DrawArcCenterTwoPt.c.y, Tool_DrawArcCenterTwoPt.r, 
	      theta, phi, ctrlKey);
	c.strokeStyle = "white";
	c.lineWidth = 2;
	c.stroke();
}

function SelectTool_DrawArcCenterTwoPt(){
	currentTool = Tool_DrawArcCenterTwoPt;
	currentSnapRule = SR_DrawArc;
}
