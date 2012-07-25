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
	

	
};

libCanvas.prototype.attrSize = function(){
	
	var canvas = document.getElementById(ctx.canvas.id);
	
	w = ctx.canvas.width;
	h = ctx.canvas.height;
	
	return {w:w,h:h};
	
}

libCanvas.prototype.attrColor = function(r, g, b, a, mode){
	
	if(modo == "fill")
		ctx.fillStyle = "rgba(" + r + ","+ g + "," + b + "," + a + ")";
		
	else if(modo == "frame"){
		ctx.lineWidth = "5";
		ctx.strokeStyle = "rgba(" + r + ","+ g + "," + b + "," + a + ")";
	}				
}


libCanvas.prototype.attrClip= function(xx,yy,w,h){
	
	this.x = xx;
	this.y= yy;
	this.tamanhoX = w;
	this.tamanhoY = h; 
	
	
	ctx.lineWidth = "1";
	ctx.strokeRect(this.x,this.y,this.tamanhoX,this.tamanhoY);
	
}

libCanvas.prototype.iniVerifClip = function(x1,y1,x2,y2){	
	
	
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
		
	var verifica = this.iniVerifClip(x1, y1, x2, y2);
		
	if(verifica){
		ctx.beginPath();
		ctx.moveTo(this.inicioX,this.inicioY);
		ctx.lineTo(this.fimX,this.fimY);
						
		ctx.stroke(); 
		ctx.save();
		
	}
	
	else{
		console.log("Coordinates out of area selected to draw")
	}
		
}

libCanvas.prototype.drawRect =  function(x1, y1, x2, y2, mode){
	
	var verifica = this.iniVerifClip2(x1,y1,x2,y2);
		
	if(verifica){
		if(modo == "fill"){
			ctx.fillRect(this.inicioX, this.inicioY, this.fimX, this.fimY);
		}
		
		else if(modo == "frame"){
			ctx.strokeRect(this.inicioX, this.inicioY, this.fimX, this.fimY);
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
	
	ctx.font = size + " " + face + " " + style;
}

libCanvas.prototype.drawText =  function(xx, yy, text){
	
	dimensao = this.measureTextLua(text);
	
	altura = parseInt(dimensao.h);
	largura = parseInt(dimensao.w);
	
	this.inicioX = this.x+xx;
	this.inicioY = this.y+yy+altura;
	
	if(this.inicioX+largura > this.x+this.tamanhoX || this.inicioY+altura > this.y+this.tamanhoY)
		console.log("Text exceeds the dimentions limited by canvas");
	else
		ctx.fillText(text,this.inicioX,this.inicioY);
	 
}

libCanvas.prototype.measureTextLua =  function(text){
	
	var textWidth = ctx.measureText (text);
	
	height = ctx.font[0] + ctx.font[1];
			
	return {w:textWidth.width,h:height};	
} 

libCanvas.prototype.image_path = function(caminho,x,y,w,h){
	
	this.inicioX = this.x + x;
	this.inicioY = this.y + y;
		
	var img = new Image();
	img.src = caminho;
	
	if(this.inicioX+w > this.x+this.tamanhoX || this.inicioY+h > this.y+this.tamanhoY)
		
		console.log("Image exceeds the dimentions limited by canvas");
	else
		ctx.drawImage(img, this.inicioX,this.inicioY,w,h);
	
}

libCanvas.prototype.attrCrop = function(ctxDestiny, x, y, w, h){
	
	canvasData = ctx.getImageData(x, y, w, h);
	
	ctxDestino.putImageData(canvasData, x, y);
}



libCanvas.prototype.compose = function(ctxDestino){
	
	canvasData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	ctxDestino.putImageData(canvasData, 0, 0);
}

libCanvas.prototype.save = function(){
	
	ctx.save();
}

libCanvas.prototype.flush = function(){
	
	ctx.restore();
	
}
