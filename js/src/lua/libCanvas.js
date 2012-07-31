function libCanvas(ctx){
	
	this.ctx = ctx;
	this.x = 0;
	this.y = 0;
	this.initX = 0;
	this.initY = 0;
	this.sizeX = ctx.canvas.width;
	this.sizeY = ctx.canvas.height;
	this.endX = ctx.canvas.width;
	this.endY = ctx.canvas.height;
	
	console.log("libCanvas");
	
	
};

libCanvas.prototype.attrSize = function(){
	console.log("attrSize");
	
	var canvas = document.getElementById(ctx.canvas.id);
	
	w = this.ctx.canvas.width;
	h = this.ctx.canvas.height;
	
	return {w:w,h:h};
	
}

libCanvas.prototype.attrColor = function(r, g, b, a, mode){
	console.log("attrColor");
	
	if(mode == "fill")
		this.ctx.fillStyle = "rgba(" + r + ","+ g + "," + b + "," + a + ")";
		
	else if(mode == "frame"){
		this.ctx.lineWidth = "5";
		this.ctx.strokeStyle = "rgba(" + r + ","+ g + "," + b + "," + a + ")";
		
	} else
		console.log("mode doesn't exists");	
	
				
}


libCanvas.prototype.attrClip= function(xx,yy,w,h){
	console.log("attrClip");
	
	this.x = xx;
	this.y= yy;
	this.sizeX = w;
	this.sizeY = h; 
	
	
	this.ctx.lineWidth = "1";
	this.ctx.strokeRect(this.x,this.y,this.sizeX,this.sizeY);
	
}

libCanvas.prototype.iniVerifClip = function(x1,y1,x2,y2){	
	console.log("IniVerifClip");
	
	this.initX = this.x + x1;
	this.initY = this.y + y1;
	this.endX = this.x + x2;
	this.endY = this.y + y2;
	var verifica = true;	
	
	
	if(this.endX > this.sizeX+this.x)
		this.endX = this.sizeX+this.x;
		
	if(this.endY > this.sizeY+this.y)
		this.endY = this.sizeY+this.y;
		
	if(this.initX > this.sizeX+this.x)
		this.initX = this.sizeX+this.x;
		
	if(this.initY > this.sizeY+this.y)
		this.initY = this.sizeY+this.y;
		
	if(this.initX >= this.sizeX+this.x && this.endX >this.sizeX+this.x || this.initY >= this.sizeY+this.y && this.endY >= this.sizeY+this.y){
		verifica = false;
		
	}
		
	return verifica;
}

libCanvas.prototype.iniVerifClip2 =  function(x1, y1, x2, y2){
	console.log("IniVerifClip2");
	
	this.initX = this.x + x1;
	this.initY = this.y + y1;
	this.endX = x2;
	this.endY = y2;
	var verifica = true;
	var sub= 0;
	
	if(this.initX+this.endX > this.x+this.sizeX){
		sub = (this.initX+this.endX) - (this.x+this.sizeX);
		this.endX = this.endX-sub;	
	}
	
	if(this.initY+this.endY > this.y+this.sizeY){
		sub = (this.initY+this.endY) - (this.y+this.sizeY);
		this.endY = this.endY-sub;	
	}
		
	
	if(this.initX >= this.sizeX+this.x || this.initY >= this.sizeY+this.y){
		verifica = false;
	}
	
	return verifica;	
}

libCanvas.prototype.drawLine =  function(x1, y1, x2, y2){
	console.log("drawLine");
		
	var verifica = this.iniVerifClip(x1, y1, x2, y2);
		
	if(verifica){
		this.ctx.beginPath();
		this.ctx.moveTo(this.initX,this.initY);
		this.ctx.lineTo(this.endX,this.endY);
						
		this.ctx.stroke(); 
		this.ctx.save();
		
	}
	
	else{
		console.log("Coordinates out of area selected to draw")
	}
		
}

libCanvas.prototype.drawRect =  function(x1, y1, x2, y2, mode){
	console.log("drawRect");
	
	var verifica = this.iniVerifClip2(x1,y1,x2,y2);
		
	if(verifica){
		if(mode == "fill"){
			this.ctx.fillRect(this.initX, this.initY, this.endX, this.endY);
		}
		
		else if(mode == "frame"){
			this.ctx.strokeRect(this.initX, this.initY, this.endX, this.endY);
		}
		
		else{
			console.log("mode doesn't exists - Please choise 'fill' or 'frame'");
			
		}
	}
	
	else{
		console.log("Coordinates out of area selected to draw")
	}
			
}

libCanvas.prototype.attrText =  function(face, size, style){
	console.log("attrText");
	
	this.ctx.font = size + " " + face + " " + style;
}

libCanvas.prototype.drawText =  function(x, y, text){
	console.log("drawText");
	
	dimension = this.measureTextLua(text);
	
	height = parseInt(dimension.h);
	width = parseInt(dimension.w);
	
	this.initX = this.x+x;
	this.initY = this.y+y+height;
	
	if(this.initX+width > this.x+this.sizeX || this.initY+height > this.y+this.sizeY)
		console.log("Text exceeds the dimentions limited by canvas");
	else
		this.ctx.fillText(text,this.initX,this.initY);
	 
}

libCanvas.prototype.measureTextLua =  function(text){
	console.log("measureTextLua");
	
	var textWidth = this.ctx.measureText(text);
	
	height = this.ctx.font[0] + this.ctx.font[1];
			
	return {w:textWidth.width,h:height};	
} 

libCanvas.prototype.image_path = function(caminho,x,y,w,h){
	console.log("image_path");
	
	this.initX = this.x + x;
	this.initY = this.y + y;
		
	var img = new Image();
	img.src = caminho;
	
	if(this.initX+w > this.x+this.sizeX || this.initY+h > this.y+this.sizeY)
		
		console.log("Image exceeds the dimentions limited by canvas");
	else
		this.ctx.drawImage(img, this.initX,this.initY,w,h);
	
}

libCanvas.prototype.attrCrop = function(ctxDestiny, x, y, w, h){
	console.log("attrCrop");
	
	canvasData = this.ctx.getImageData(x, y, w, h);
	
	ctxDestino.putImageData(canvasData, x, y);
}



libCanvas.prototype.compose = function(ctxDestino){
	console.log("compose");
	
	canvasData = this.ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	ctxDestino.putImageData(canvasData, 0, 0);
}

libCanvas.prototype.save = function(){
	console.log("save");
	
	ctx.save();
}

libCanvas.prototype.flush = function(){
	console.log("restore");
	
	ctx.restore();
	
}
