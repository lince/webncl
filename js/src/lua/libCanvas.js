function libCanvas(ctx) {

	//context
	this.ctx = ctx;

	//variables for attrClip
	this.x = 0;
	this.y = 0;
	this.initX = 0;
	this.initY = 0;
	this.sizeX = ctx.canvas.width;
	this.sizeY = ctx.canvas.height;
	this.endX = ctx.canvas.width;
	this.endY = ctx.canvas.height;

	//variables for new
	this.w = 0;
	this.h = 0;
	this.initW = 0;
	this.initH = 0;
	this.sizeW = ctx.canvas.width;
	this.sizeH = ctx.canvas.height;
	this.widthEnd = ctx.canvas.width;
	this.heightEnd = ctx.canvas.height;

	this.ultimo = true;
	this.compositeTypes = ['source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'darker', 'copy', 'xor'];

	console.log("libCanvas");

};

libCanvas.prototype.attrSize = function() {
	console.log("attrSize");

	var canvas = document.getElementById(ctx.canvas.id);

	w = this.ctx.canvas.width;
	h = this.ctx.canvas.height;

	return [w, h];

}

libCanvas.prototype.newCanvas = function(width, height) {
	newObject = new libCanvas(this.ctx);

	this.ultimo = false;

	newObject.setData(0, 0, width, height);

	return newObject;

}

//TODO use function onload to first load the image then execute de code
libCanvas.prototype.newImage = function(caminho) {
	console.log("newImage");

	var img = new Image();
	img.src = caminho;

	newObject = new libCanvas(this.ctx);
	newObject.setData(0, 0, img.width, img.height);
	newObject.image_path(caminho, 0, 0, img.width, img.height);
	
	return newObject;

}

libCanvas.prototype.image_path = function(caminho, x, y, w, h) {
	console.log("image_path");

	this.initX = this.x + x;
	this.initY = this.y + y;

	var img = new Image();
	img.src = caminho;

	if (this.initX + w > this.x + this.sizeX || this.initY + h > this.y + this.sizeY)

		console.log("Image exceeds the dimentions limited by canvas");
	else
		this.ctx.drawImage(img, this.initX, this.initY, w, h);

}

libCanvas.prototype.setData = function(x1, y1, x2, y2) {

	this.initW = this.w + x1;
	this.initH = this.h + y1;
	this.endW = x2;
	this.endH = y2;

	if (this.initW + this.endW > this.w + this.sizeW) {
		sub = (this.initW + this.endW) - (this.w + this.sizeW);
		this.endW = this.endW - sub;
	}

	if (this.initH + this.endH > this.h + this.sizeH) {
		sub = (this.initH + this.endH) - (this.h + this.sizeH);
		this.endH = this.endH - sub;
	}

	if (this.initW >= this.sizeW + this.w) {
		this.initW = this.w;
		console.log("width exceeds limit permissed");
	}
	if (this.initH >= this.sizeH + this.h) {
		this.initH = this.h;
		console.log("height exceeds limit permissed");
	}

	this.ctx.canvas.width = this.endW;
	this.ctx.canvas.height = this.endH;

}

libCanvas.prototype.attrColor = function(r, g, b, a) {
	console.log("attrColor");

	if (b === undefined && a === undefined) {

		if (g === undefined) {
			g = 1;
		}

		switch(r) {

			case 'lime' :
				this.ctx.fillStyle = "rgba(0,255,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,255,0,0.8)";
				break;

			case 'white':
				this.ctx.fillStyle = "rgba(255,255,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,255,255," + g + ")";
				break;

			case 'aqua':
				this.ctx.fillStyle = "rgba(0,255,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,255,255," + g + ")";
				break;

			case 'yellow':
				this.ctx.fillStyle = "rgba(255,255,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,255,0," + g + ")";
				break;

			case 'red':
				this.ctx.fillStyle = "rgba(255,0,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,0,0," + g + ")";
				break;

			case 'fuchsia':
				this.ctx.fillStyle = "rgba(255,0,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,0,255," + g + ")";
				break;

			case 'purple':
				this.ctx.fillStyle = "rgba(128,0,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,0,128," + g + ")";
				break;

			case 'maroon':
				this.ctx.fillStyle = "rgba(128,0,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,0,0," + g + ")";
				break;

			case 'blue':
				this.ctx.fillStyle = "rgba(0,0,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,0,255," + g + ")";

				break;

			case 'navy':
				this.ctx.fillStyle = "rgba(0,0,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,0,128," + g + ")";
				break;

			case 'teal':
				this.ctx.fillStyle = "rgba(0,128,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,128,128," + g + ")";
				break;

			case 'green':
				this.ctx.fillStyle = "rgba(0,128,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,128,0," + g + ")";
				break;

			case 'olive':
				this.ctx.fillStyle = "rgba(128,128,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,128,0," + g + ")";
				break;

			case 'silver':
				this.ctx.fillStyle = "rgba(192,192,192," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(192,192,192," + g + ")";
				break;

			case 'gray':
				this.ctx.fillStyle = "rgba(128,128,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,128,128," + g + ")";
				break;

			case 'black':
				this.ctx.fillStyle = "rgba(0,0,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,0,0," + g + ")";
				break;

		}

	}

	this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
	this.ctx.lineWidth = "2";
	this.ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";

}

libCanvas.prototype.attrClip = function(x, y, w, h) {
	console.log("attrClip");

	this.x = x;
	this.y = y;
	this.sizeX = w;
	this.sizeY = h;

	this.ctx.lineWidth = "1";
	this.ctx.strokeRect(this.x, this.y, this.sizeX, this.sizeY);

}

libCanvas.prototype.iniVerifClip = function(x1, y1, x2, y2) {
	console.log("IniVerifClip");

	this.initX = this.x + x1;
	this.initY = this.y + y1;
	this.endX = this.x + x2;
	this.endY = this.y + y2;
	var verifica = true;

	if (this.endX > this.sizeX + this.x)
		this.endX = this.sizeX + this.x;

	if (this.endY > this.sizeY + this.y)
		this.endY = this.sizeY + this.y;

	if (this.initX > this.sizeX + this.x)
		this.initX = this.sizeX + this.x;

	if (this.initY > this.sizeY + this.y)
		this.initY = this.sizeY + this.y;

	if (this.initX >= this.sizeX + this.x && this.endX > this.sizeX + this.x || this.initY >= this.sizeY + this.y && this.endY >= this.sizeY + this.y) {
		verifica = false;

	}

	return verifica;
}

libCanvas.prototype.iniVerifClip2 = function(x1, y1, x2, y2) {
	console.log("IniVerifClip2");

	//set for attrClip
	this.initX = this.x + x1;
	this.initY = this.y + y1;
	this.endX = x2;
	this.endY = y2;
	var verifica = true;
	var sub = 0;
	console.log("x: " + this.x);
	console.log("y: " + this.y);
	console.log("initX: " + this.initX);
	console.log("initY: " + this.initY);
	console.log("endX: " + this.endX);
	console.log("endY: " + this.endY);

	//#------------------------------------------------------------------------------#
	//verifications for attrClip
	if (this.initX + this.endX > this.x + this.sizeX) {
		sub = (this.initX + this.endX) - (this.x + this.sizeX);
		this.endX = this.endX - sub;
	}

	if (this.initY + this.endY > this.y + this.sizeY) {
		sub = (this.initY + this.endY) - (this.y + this.sizeY);
		this.endY = this.endY - sub;
	}

	if (this.initX >= this.sizeX + this.x || this.initY >= this.sizeY + this.y) {
		verifica = false;
	}
	//end of verifications for attrClip
	//#-------------------------------------------------------------------------------#
	console.log("endX: " + this.endX);
	console.log("endY: " + this.endY);

	return verifica;
}

libCanvas.prototype.drawLine = function(x1, y1, x2, y2) {
	console.log("drawLine");

	if (this.ultimo)
		this.ctx.globalCompostion = this.compositeTypes[0];
	
else
		this.ctx.globalCompostion = this.compositeTypes[4];

	verifica = this.iniVerifClip(x1, y1, x2, y2);

	if (verifica) {
		this.ctx.beginPath();
		this.ctx.moveTo(this.initX, this.initY);
		this.ctx.lineTo(this.endX, this.endY);

		this.ctx.stroke();
		this.ctx.save();

	} else {
		console.log("Coordinates out of area selected to draw")
	}

}

libCanvas.prototype.drawRect = function(mode, x1, y1, x2, y2) {
	console.log("drawRect");

	if (this.ultimo)
		this.ctx.globalCompostion = this.compositeTypes[0];
	
else
		this.ctx.globalCompostion = this.compositeTypes[4];

	var verifica = this.iniVerifClip2(x1, y1, x2, y2);

	if (verifica) {
		if (mode == "fill") {
			this.ctx.fillRect(this.initX, this.initY, this.endX, this.endY);
		} else if (mode == "frame") {
			this.ctx.strokeRect(this.initX, this.initY, this.endX, this.endY);
		} else {
			console.log("mode doesn't exists - Please choise 'fill' or 'frame'");

		}
	} else {
		console.log("Coordinates out of area selected to draw")
	}

}

libCanvas.prototype.attrText = function(face, size, style) {
	console.log("attrText");

	if (style === undefined)
		style = "none";

	this.ctx.font = size + " " + face + " " + style;
}

libCanvas.prototype.drawText = function(x, y, text) {
	console.log("drawText");

	dimension = this.measureTextLua(text);

	console.log(dimension);

	width = dimension[0];
	height = dimension[1];

	this.initX = this.x + x;
	this.initY = this.y + y + height;

	/*if (this.initX + width > this.x + this.sizeX || this.initY + height > this.y + this.sizeY)
	 console.log("Text exceeds the dimentions limited by canvas");
	 else {
	 this.ctx.fillText(text, this.initX, this.initY);
	 console.log("final attrText");
	 }*/
	this.ctx.fillText(text, this.initX, this.initY);

}

libCanvas.prototype.measureTextLua = function(text) {
	console.log("measureTextLua");

	var textWidth = this.ctx.measureText(text);

	height = parseInt(this.ctx.font[0] + this.ctx.font[1]);

	return [textWidth.width, height];
}

libCanvas.prototype.image_path = function(caminho, x, y, w, h) {
	console.log("image_path");

	this.initX = this.x + x;
	this.initY = this.y + y;

	var img = new Image();
	img.src = caminho;

	if (this.initX + w > this.x + this.sizeX || this.initY + h > this.y + this.sizeY)

		console.log("Image exceeds the dimentions limited by canvas");
	else
		this.ctx.drawImage(img, this.initX, this.initY, w, h);

}

libCanvas.prototype.attrCrop = function(ctxDestiny, x, y, w, h) {
	console.log("attrCrop");

	canvasData = this.ctx.getImageData(x, y, w, h);

	ctxDestino.putImageData(canvasData, x, y);
}

libCanvas.prototype.compose = function(ctxDestino) {
	console.log("compose");

	canvasData = this.ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

	ctxDestino.putImageData(canvasData, 0, 0);
}

libCanvas.prototype.save = function() {
	console.log("save");

	ctx.save();
}

libCanvas.prototype.flush = function() {
	console.log("restore");

	ctx.restore();

}

