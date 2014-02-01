function Camera(){
	this.location = new Point(0, 0);
	
	this.zoom = 1;
	
	this.Zoom = function(zoomFactor){this.zoom *= zoomFactor;}
	
	this.GetViewBounds = function(){
		return {'left':this.location.x - displayWidth/(2*this.zoom),
			'right':this.location.x + displayWidth/(2*this.zoom),
			'top':this.location.y  + displayHeight/(2*this.zoom),
			'bottom':this.location.y - displayHeight/(2*this.zoom)};
	}
};

var camera = new Camera;