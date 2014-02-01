var cursorXGlobal = 5;
var cursorYGlobal = 5;

function MState()
{
	this.cLMB = false;
	this.cRMB = false;
	
	this.pLMB = false;
	this.pRMB = false;
	
	var AdditionalLMBOps = function (e) {AddItem();DeleteItem();EditItem();}
	var AdditionalRMBOps = function(e){}
	
	this.OnMouseMove = function(e)
	{
		//alert(e.pageX);
		cursorXGlobal = e.pageX;
		cursorYGlobal = e.pageY;
	}
	
	this.OnMouseDown = function(e)
	{
		if(e.which==1)
		{
			this.cLMB = true;
			RunCurrentTool(true);
		}
		else if(e.which==3){
			this.cRMB = true;
			RunCurrentTool(false);
		}
	}
	
	this.OnMouseUp = function(e)
	{
		if(e.which==1)
		{
			this.cLMB = false;
			//AdditionalLMBOps(e);
		}
		else if(e.which==3)
		{
			this.cRMB = false;
			AdditionalRMBOps(e);
		}
	}
	
	this.BufferShift = function(){this.pLMB = this.cLMB; this.pRMB = this.cRMB;}
	
	/*this.cursorXLocal = function(){return (cursorXGlobal-offsetX-camX - displayWidth/2)/zoom;}
	this.cursorYLocal = function(){return (cursorYGlobal-offsetY-camY - displayHeight/2)/zoom;}*/
	
	this.cursorXLocal = function(){return (cursorXGlobal-offset.x-displayWidth/2)/zoom - camX;}
	this.cursorYLocal = function(){return (cursorYGlobal-offset.y-displayHeight/2)/zoom - camY;}
	
	this.cursorXInFrame = function(){return cursorXGlobal-offset.x-displayWidth/2;}
	this.cursorYInFrame = function(){return cursorYGlobal-offset.y-displayHeight/2;}
}

var mouseState = new MState();

$(document).ready(function(){
	document.getElementById(displayName).addEventListener('mousemove', mouseState.OnMouseMove, false);
	document.getElementById(displayName).addEventListener('mousedown', mouseState.OnMouseDown, false);
	document.getElementById(displayName).addEventListener('mouseup', mouseState.OnMouseUp, false);
});

//$("#myCanvas").mousemove(mouseState.OnMouseMove);
//$("#myCanvas").mousedown(mouseState.OnMouseDown);
//$("#myCanvas").mouseup(mouseState.OnMouseUp);

/*$(document).mousemove(function(e){
	mouseState.cursorXGlobal = e.pageX;
	mouseState.cursorYGlobal = e.pageY;
	}
);*/