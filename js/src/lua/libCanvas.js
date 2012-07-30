function libCanvas(ctx){
	
	this.ctx = ctx;
	this.x = 0;
	this.y = 0;
	this.inicioX = 0;
	this.inicioY = 0;
	this.tamanhoX = ctx.canvas.width;
	this.tamanhoY = ctx.canvas.height;
	this.fimX = ctx.canvas.width;
	this.fimY = ctx.canvas.height;
	
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
	this.tamanhoX = w;
	this.tamanhoY = h; 
	
	
	this.ctx.lineWidth = "1";
	this.ctx.strokeRect(this.x,this.y,this.tamanhoX,this.tamanhoY);
	
}

libCanvas.prototype.iniVerifClip = function(x1,y1,x2,y2){	
	console.log("IniVerifClip");
	
	this.inicioX = this.x + x1;
	this.inicioY = this.y + y1;
	this.fimX = this.x + x2;
	this.fimY = this.y + y2;
	var verifica = true;	
	
	
	if(this.fimX > this.tamanhoX+this.x)
		this.fimX = this.tamanhoX+this.x;
		
	if(this.fimY > this.tamanhoY+this.y)
		this.fimY = this.tamanhoY+this.y;
		
	if(this.inicioX > this.tamanhoX+this.x)
		this.inicioX = this.tamanhoX+this.x;
		
	if(this.inicioY > this.tamanhoY+this.y)
		this.inicioY = this.tamanhoY+this.y;
		
	if(this.inicioX >= this.tamanhoX+this.x && this.fimX >this.tamanhoX+this.x || this.inicioY >= this.tamanhoY+this.y && this.fimY >= this.tamanhoY+this.y){
		verifica = false;
		
	}
		
	return verifica;
}

libCanvas.prototype.iniVerifClip2 =  function(x1, y1, x2, y2){
	console.log("IniVerifClip2");
	
	this.inicioX = this.x + x1;
	this.inicioY = this.y + y1;
	this.fimX = x2;
	this.fimY = y2;
	var verifica = true;
	var sub= 0;
	
	if(this.inicioX+this.fimX > this.x+this.tamanhoX){
		sub = (this.inicioX+this.fimX) - (this.x+this.tamanhoX);
		this.fimX = this.fimX-sub;	
	}
	
	if(this.inicioY+this.fimY > this.y+this.tamanhoY){
		sub = (this.inicioY+this.fimY) - (this.y+this.tamanhoY);
		this.fimY = this.fimY-sub;	
	}
		
	
	if(this.inicioX >= this.tamanhoX+this.x || this.inicioY >= this.tamanhoY+this.y){
		verifica = false;
	}
	
	return verifica;	
}

libCanvas.prototype.drawLine =  function(x1, y1, x2, y2){
	console.log("drawLine");
		
	var verifica = this.iniVerifClip(x1, y1, x2, y2);
		
	if(verifica){
		this.ctx.beginPath();
		this.ctx.moveTo(this.inicioX,this.inicioY);
		this.ctx.lineTo(this.fimX,this.fimY);
						
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
			this.ctx.fillRect(this.inicioX, this.inicioY, this.fimX, this.fimY);
		}
		
		else if(mode == "frame"){
			this.ctx.strokeRect(this.inicioX, this.inicioY, this.fimX, this.fimY);
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

libCanvas.prototype.drawText =  function(xx, yy, text){
	console.log("drawText");
	
	dimensao = this.measureTextLua(text);
	
	altura = parseInt(dimensao.h);
	largura = parseInt(dimensao.w);
	
	this.inicioX = this.x+xx;
	this.inicioY = this.y+yy+altura;
	
	if(this.inicioX+largura > this.x+this.tamanhoX || this.inicioY+altura > this.y+this.tamanhoY)
		console.log("Text exceeds the dimentions limited by canvas");
	else
		this.ctx.fillText(text,this.inicioX,this.inicioY);
	 
}

libCanvas.prototype.measureTextLua =  function(text){
	console.log("measureTextLua");
	
	var textWidth = this.ctx.measureText(text);
	
	height = this.ctx.font[0] + this.ctx.font[1];
			
	return {w:textWidth.width,h:height};	
} 

libCanvas.prototype.image_path = function(caminho,x,y,w,h){
	console.log("image_path");
	
	this.inicioX = this.x + x;
	this.inicioY = this.y + y;
		
	var img = new Image();
	img.src = caminho;
	
	if(this.inicioX+w > this.x+this.tamanhoX || this.inicioY+h > this.y+this.tamanhoY)
		
		console.log("Image exceeds the dimentions limited by canvas");
	else
		this.ctx.drawImage(img, this.inicioX,this.inicioY,w,h);
	
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
