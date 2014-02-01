var Tool_Measure = new Tool();

Tool_Measure.name = "Measure";
Tool_Measure.toolTip = "Measure";

Tool_Measure.numSteps = 1;

Tool_Measure.location = new Point();

Tool_Measure.Steps.push(function(lmb){
	if(lmb){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		Tool_Measure.location.x = s.location.x;
		Tool_Measure.location.y = s.location.y;
	}
	else
		ResetTool();
});

Tool_Measure.Draw = function(c){
	if(c==undefined)
		c=context;
	
	var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
	
	c.beginPath();
	c.moveTo(Tool_Measure.location.x, Tool_Measure.location.y);
	c.lineTo(s.location.x, s.location.y);
	c.closePath();
	c.strokeStyle = "yellow";
	c.fillStyle = "yellow";
	c.lineWidth = 2;
	c.stroke();
	
	c.font = "16px sans-serif";
	var xoff = 4;
	if(s.location.x < Tool_Measure.location.x){
		c.textAlign = "right";
		xoff=-4;
	}
	else
		c.textAlign = "start";
	c.fillText("" + PV_Distance(s.location, Tool_Measure.location).toFixed(3), s.location.x+xoff, s.location.y-4);
}

function Select_Tool_Measure(){
	currentTool = Tool_Measure;
}