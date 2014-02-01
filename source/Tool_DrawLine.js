var SR_DrawLine = new SnapRule(16, 15, 14, 14, 12, 13, 10, 8);

var Tool_DrawLine = new Tool();

Tool_DrawLine.name = "Draw Point";
Tool_DrawLine.toolTip = "Draw Point";

Tool_DrawLine.numSteps = 2;

Tool_DrawLine.startIdx = -1;

Tool_DrawLine.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		
		ShiftLockStart(s.location.x, s.location.y);
		
		if(s.index != -1 && s.type == 'point')
			Tool_DrawLine.startIdx = s.index;
		else{
			Tool_DrawLine.startIdx = scene.points.length;
			scene.points.push(new Point(s.location.x, s.location.y));
		}
		
		Tool_DrawLine.step=1;
	}else
		ResetTool();
});

/* Step 1: if there is no point to snap to, you create said point.
 * you set the start point index */

Tool_DrawLine.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(SR_DrawLine, cursor.location.x, cursor.location.y);
		var l = new Line();
		ShiftLockStart(s.location.x, s.location.y);
		
		if(s.index != -1 && s.type == 'point'){
			if(s.index == Tool_DrawLine.startIdx)
				return;
			endIdx = s.index;
		}else{
			endIdx = scene.points.length;
			scene.points.push(new Point(s.location.x, s.location.y));
			
		}
		
		l.FromPtIndices(Tool_DrawLine.startIdx, endIdx);
		
		scene.lines.push(new Line(l));
		
		Tool_DrawLine.startIdx = endIdx;
	}else
		ResetTool();
});

function Select_Tool_DrawLine(){
	currentTool = Tool_DrawLine;
	currentSnapRule = SR_DrawLine;
}

Tool_DrawLine.Draw = function(c){
	if(ctrlKey)
		Tool_DrawLine.step = 0;
	
	if(Tool_DrawLine.step != 1)
		return;
	
	if(c==undefined)
		c=context;
	
	var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
	
	c.beginPath();
	c.moveTo(scene.points[Tool_DrawLine.startIdx].x, scene.points[Tool_DrawLine.startIdx].y);
	c.lineTo(s.location.x, s.location.y);
	c.closePath();
	c.strokeStyle = "white";
	c.lineWidth = 2;
	c.stroke();
}

/////////--------------------------------------------

var Tool_DrawRay = new Tool();

Tool_DrawRay.name = "Draw Ray";
Tool_DrawRay.toolTip = "Draw Ray";

Tool_DrawRay.numSteps = 2;

Tool_DrawRay.startIdx = -1;

Tool_DrawRay.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		ShiftLockStart(s.location.x, s.location.y);
		if(s.index != -1 && s.type == 'point')
			Tool_DrawRay.startIdx = s.index;
		else{
			Tool_DrawRay.startIdx = scene.points.length;
			scene.points.push(new Point(s.location.x, s.location.y));
		}
		
		Tool_DrawRay.step=1;
	}else
		ResetTool();
});

Tool_DrawRay.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		var l = new Line();
		ShiftLockStart(s.location.x, s.location.y);
		if(s.index != -1 && s.type == 'point'){
			if(s.index == Tool_DrawRay.startIdx)
				return;
			endIdx = s.index;
		}else if(s.index == -1){
			endIdx = scene.points.length;
			scene.points.push(new Point(s.location.x, s.location.y));
			
		}
		
		l.type="ray";
		if(s.location.x < scene.points[Tool_DrawRay.startIdx].x)
			l.positive = false;
		else if(s.location.y < scene.points[Tool_DrawRay.startIdx].y && 
			s.location.x == scene.points[Tool_DrawRay.startIdx].x)
			l.positive = false;
		
		l.FromPtIndices(Tool_DrawRay.startIdx, endIdx);
		scene.points.pop();
		scene.lines.push(new Line(l));
		
		Tool_DrawRay.startIdx = endIdx;
		
		Tool_DrawRay.step = 0;
	}else
		ResetTool();
});

Tool_DrawRay.Draw = function(c){
	if(Tool_DrawRay.step != 1)
		return;
	
	if(c==undefined)
		c=context;
	
	var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
	
	c.beginPath();
	c.moveTo(scene.points[Tool_DrawRay.startIdx].x, scene.points[Tool_DrawRay.startIdx].y);
	c.lineTo(s.location.x, s.location.y);
	c.closePath();
	c.strokeStyle = "white";
	c.lineWidth = 2;
	c.stroke();
}

function Select_Tool_DrawRay(){
	currentTool = Tool_DrawRay;
	currentSnapRule = SR_DrawLine;
}

///------------------------------

var Tool_DrawInfiniteLine = new Tool();

Tool_DrawInfiniteLine.name = "Draw Infinite Line";
Tool_DrawInfiniteLine.toolTip = "Draw Infinite Line";

Tool_DrawInfiniteLine.numSteps = 2;
Tool_DrawInfiniteLine.startPt;

Tool_DrawInfiniteLine.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		ShiftLockStart(s.location.x, s.location.y);
		Tool_DrawInfiniteLine.startPt = new Point(s.location.x, s.location.y);
		Tool_DrawInfiniteLine.step = 1;
	}else
		ResetTool();
});

Tool_DrawInfiniteLine.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		ShiftLockStart(s.location.x, s.location.y);
		if(s.index == Tool_DrawInfiniteLine.startIdx)
			return;
		Tool_DrawInfiniteLine.endPt = new Point(s.location.x, s.location.y);
		Tool_DrawInfiniteLine.step = 0;
		
		scene.lines.push(new Line(TwoPointLine(Tool_DrawInfiniteLine.startPt, Tool_DrawInfiniteLine.endPt)));
	}else
		ResetTool();
});

Tool_DrawInfiniteLine.Draw = function(c){
	if(Tool_DrawInfiniteLine.step != 1)
		return;
	
	if(c==undefined)
		c=context;
	
	var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
	c.beginPath();
	c.moveTo(Tool_DrawInfiniteLine.startPt.x, Tool_DrawInfiniteLine.startPt.y);
	c.lineTo(s.location.x, s.location.y);
	c.closePath();
	c.strokeStyle = "white";
	c.lineWidth = 2;
	c.stroke();
}

function Select_Tool_DrawInfiniteLine(){
	currentTool = Tool_DrawInfiniteLine;
	currentSnapRule = SR_DrawLine;
}



