ctrlKey = false;

function ResizeDisplay(){
	var widthShift = 0;
	/*if(showHelp)
		widthShift=helpWidth;*/
	cvn.width = document.body.clientWidth-widthShift;
	displayWidth = cvn.width;
	cvn.height = window.innerHeight-60-32-1;
	displayHeight = cvn.height;
}

keyboard.DisableKey(keys.space);

/*keyboard.AddKeyEvent(true, keys.a, function(){moveLeft=true;});
keyboard.AddKeyEvent(false, keys.a, function(){moveLeft=false;});*/

keyboard.AddKeyEvent(true, keys.closeBracket, function(){Zoom(2);});
keyboard.AddKeyEvent(true, keys.openBracket, function(){Zoom(0.5);});

keyboard.AddKeyEvent(true, keys.control, function(){ctrlKey=true;});
keyboard.AddKeyEvent(false, keys.control, function(){ctrlKey=false;});

keyboard.AddKeyEvent(true, keys.enter, function(){ToolKeyboardOverride();});

keyboard.AddKeyEvent(true, keys.shift, function(){shiftLock=true;});
keyboard.AddKeyEvent(false, keys.shift, function(){shiftLock=false;});

function Display(){
	this.cursor_colorOverride = 0;
	this.cursor_radiusOverride = -1;
	
	this.Render = function(){
		offset.x = $('#CADDisplay').offset().left;
		offset.y = $('#CADDisplay').offset().top;
		
		cvn = document.getElementById("CADDisplay");
		cvn.style.cursor='crosshair';
		
		if(!initResize)
			ResizeDisplay();
		
		offsetX = $('#CADDisplay').offset().left;
		offsetY = $('#CADDisplay').offset().top;
		
		context = cvn.getContext('2d');
		
		context.fillStyle = "#202020";
		context.fillRect(0,0,displayWidth,displayHeight);
		
		context.restore();
		context.save();
		
		context.translate(displayWidth/2, displayHeight/2);
		
		context.scale(camera.zoom, -camera.zoom);
		//context.scale(1, -1);
		context.translate(-camera.location.x, -camera.location.y);
		
		scene.Render();
		
		this.DrawCursor();
	}
	
	this.DrawCursor = function(){
		var s = Multisnap(currentSnapRule, cursor.location.x, cursor.location.y);
		
		if(this.cursor_colorOverride != 0)
			context.strokeStyle = this.cursor_colorOverride;
		else
			context.strokeStyle = cursor.default_color;
		
		
		var r = cursor.default_radius;
		if(this.cursor_radiusOverride >= 0)
			r = this.cursor_radiusOverride;
		var th = cursor.default_thickness;
		if(this.cursor_thicknessOverride > 0)
			th = this.cursor_thicknessOverride;
		
		
		context.lineWidth = th;
		
		context.beginPath();
		context.arc(s.location.x*camera.zoom, s.location.y*camera.zoom, r, 0, pi*2);
		context.closePath();
		context.stroke();
	}
}

var masterDisplay = new Display(); 

function Run(){
	cursor.Refresh();
	masterDisplay.Render();
}

setInterval(Run,20); 

function NewFile(){
	$("#fileSaveNoCancel" ).dialog("open");
}
