function ContentLoader()
{
	this.i = 0;
	
	this.images = new Array();
	this.loaded = false;

	this.imgPaths = new Array();
	this.loadedImageCount = 0;
	
	this.LoadImages = function()
	{
		this.i = 0;
		while(this.i < this.imgPaths.length)
		{
			this.images.push(new Image());
			this.images[this.i].src = this.imgPaths[this.i];
			this.images[this.i].onload = function(){this.loaded=true;}			
			
			this.i += 1;
		}
	}
	
	this.AddPath = function(p)
	{
		this.imgPaths.push(p);
		return this.imgPaths.length-1;
	}
	
	this.CheckLoadStatus = function(){
		//console.log(this.loadedImageCount);if(this.loadedImageCount==this.imgPaths.length){return true;}return false;}
		var b = 0;
		
		for(var q = this.imgPaths.length-1; q>=0; q--){
			if(this.images[q].loaded)
				b++;
		}
		
		if(b==this.imgPaths.length)
			return true;
		
		return false;
	}
	
	this.Dispose = function(){for(var q=this.imgPaths.length-1; q>=0; q--){this.images.pop();}}
}

var content = new ContentLoader();