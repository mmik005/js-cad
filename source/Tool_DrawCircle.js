var SR_DrawCircle = new SnapRule(16, 15, 14, 14, 12, 13, 10, 8);

var Tool_DrawCircleCenterRadius = new Tool();

Tool_DrawCircleCenterRadius.name = "Draw Circle Center Radius";
Tool_DrawCircleCenterRadius.toolTip = "Draw Circle (center, radius)"

Tool_DrawCircleCenterRadius.numSteps = 2;
Tool_DrawCircleCenterRadius.centerIdx = -1;

Tool_DrawCircleCenterRadius.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		ShiftLockStart(s.location.x, s.location.y);
		
		if(s.index != -1 && s.type == 'point')
			Tool_DrawCircleCenterRadius.centerIdx = s.index;
		else{
			Tool_DrawCircleCenterRadius.centerIdx = scene.points.length;
			scene.points.push(new Point(s.location.x, s.location.y));
		}
		
		Tool_DrawCircleCenterRadius.p = scene.points[Tool_DrawCircleCenterRadius.centerIdx];
		
		Tool_DrawCircleCenterRadius.step = 1;
	}else
		ResetTool();
});

Tool_DrawCircleCenterRadius.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		ShiftLockStart(s.location.x, s.location.y);
		
		var c = new Circle();
		c.center = Tool_DrawCircleCenterRadius.centerIdx;
		c.radius = Distance(Tool_DrawCircleCenterRadius.p.x, Tool_DrawCircleCenterRadius.p.y, 
				    s.location.x, s.location.y);
		
		scene.circles.push(new Circle(c));
		
		Tool_DrawCircleCenterRadius.step = 0;
	}else
		ResetTool();
});

Tool_DrawCircleCenterRadius.Draw = function(c){
	if(Tool_DrawCircleCenterRadius.step != 1)
		return;
	if(c==undefined)
		c=context;
	
	var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
	
	c.beginPath();
	c.arc(Tool_DrawCircleCenterRadius.p.x, Tool_DrawCircleCenterRadius.p.y, 
	      PV_Distance(Tool_DrawCircleCenterRadius.p, s.location), 0, 2*pi);
	c.closePath();
	
	c.strokeStyle = "white";
	c.lineWidth = 2;
	c.stroke();
}

function SelectTool_DrawCircleCenterRadius(){
	currentTool = Tool_DrawCircleCenterRadius;
	currentSnapRule = SR_DrawCircle;
}