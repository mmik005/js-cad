var Tool_DrawPoint = new Tool();

Tool_DrawPoint.name = "Draw Point";
Tool_DrawPoint.toolTip = "Draw Point";

Tool_DrawPoint.numSteps = 1;

Tool_DrawPoint.Steps.push(function(lmb){
	if(lmb)
		scene.points.push(new Point(cursor.location.x, cursor.location.y));
	else
		ResetTool();
});

function Select_Tool_DrawPoint(){
	currentTool = Tool_DrawPoint;
}