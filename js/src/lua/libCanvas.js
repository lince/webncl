function libCanvas(ctx) {

	this.iniCropX = 0;
	this.iniCropY = 0;
	this.endCropX = ctx.canvas.width;
	this.endCropY = ctx.canvas.height;

	//context
	this.ctx2 = ctx;
	this.width = ctx.canvas.width;
	this.height = ctx.canvas.height;
	
	var canvas = document.createElement("canvas");
	canvas.id = "canvasCopy";
	canvas.width = ctx.canvas.width;
	canvas.height = ctx.canvas.height;
	
	this.ctx = canvas.getContext("2d");
	

	//variables for attrClip
	this.x = 0;
	this.y = 0;
	this.initX = 0;
	this.initY = 0;
	this.sizeX = ctx.canvas.width;
	this.sizeY = ctx.canvas.height;
	this.endX = ctx.canvas.width;
	this.endY = ctx.canvas.height;
	
	//variable for return the values of color from attrColor
	this.color = [];
	this.color[0] = 0;
	this.color[1] = 0;
	this.color[2] = 0;
	this.color[3] = 1;
	
	this.attrFont = [];
	console.log("libCanvas");

};

libCanvas.prototype.attrSize = function() {
	
	console.log("attrSize");
	return [this.width, this.height];

}

libCanvas.prototype.newCanvas = function(width, height) {

	newObject = new libCanvas(this.ctx);
	
	newObject.setData(width, height);
	
	return newObject;

}

//TODO use function onload to first load the image then execute de code
libCanvas.prototype.newImage = function(caminho) {
	console.log("newImage");
	
	var img = new Image();
	img.src = caminho;
	if (!img.complete){
		console.log('Please press F5');
	}
	
	newObject = new libCanvas(this.ctx);
	newObject.isSon = true;
	newObject.setData(img.width, img.height);
	newObject.image_path(img, 0, 0, img.width, img.height);
	return newObject;

}


libCanvas.prototype.image_path = function(img, x, y, w, h) {
	console.log("image_path");

	this.initX = this.x + x;
	this.initY = this.y + y;

	if (this.initX + w > this.x + this.sizeX || this.initY + h > this.y + this.sizeY)

		console.log("Image exceeds the dimentions limited by canvas");
	else{
		this.ctx.drawImage(img, this.initX, this.initY, w, h);
		
	}
		

}

libCanvas.prototype.setData = function(x, y) {
	
	this.width = x;
	this.height = y;
	this.endCropX = x;
	this.endCropY = y;
	
	
}

libCanvas.prototype.getColor = function(){
		
	return [this.color[0], this.color[1], this.color[2], this.color[3]];
	
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
				this.ctx.strokeStyle = "rgba(0,255,0," + g + ")";
				this.color[0] = 0;
				this.color[1] = 255;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'white':
				this.ctx.fillStyle = "rgba(255,255,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,255,255," + g + ")";
				this.color[0] = 255;
				this.color[1] = 255;
				this.color[2] = 255;
				this.color[3] = g;
				break;

			case 'aqua':
				this.ctx.fillStyle = "rgba(0,255,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,255,255," + g + ")";
				this.color[0] = 0;
				this.color[1] = 255;
				this.color[2] = 255;
				this.color[3] = g;
				break;

			case 'yellow':
				this.ctx.fillStyle = "rgba(255,255,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,255,0," + g + ")";
				this.color[0] = 255;
				this.color[1] = 255;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'red':
				this.ctx.fillStyle = "rgba(255,0,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,0,0," + g + ")";
				this.color[0] = 255;
				this.color[1] = 0;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'fuchsia':
				this.ctx.fillStyle = "rgba(255,0,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,0,255," + g + ")";
				this.color[0] = 255;
				this.color[1] = 0;
				this.color[2] = 255;
				this.color[3] = g;
				break;

			case 'purple':
				this.ctx.fillStyle = "rgba(128,0,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,0,128," + g + ")";
				this.color[0] = 128;
				this.color[1] = 0;
				this.color[2] = 128;
				this.color[3] = g;
				break;

			case 'maroon':
				this.ctx.fillStyle = "rgba(128,0,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,0,0," + g + ")";
				this.color[0] = 128;
				this.color[1] = 0;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'blue':
				this.ctx.fillStyle = "rgba(0,0,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,0,255," + g + ")";
				this.color[0] = 0;
				this.color[1] = 0;
				this.color[2] = 255;
				this.color[3] = g;

				break;

			case 'navy':
				this.ctx.fillStyle = "rgba(0,0,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,0,128," + g + ")";
				this.color[0] = 0;
				this.color[1] = 0;
				this.color[2] = 128;
				this.color[3] = g;
				break;

			case 'teal':
				this.ctx.fillStyle = "rgba(0,128,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,128,128," + g + ")";
				this.color[0] = 0;
				this.color[1] = 128;
				this.color[2] = 128;
				this.color[3] = g;
				break;

			case 'green':
				this.ctx.fillStyle = "rgba(0,128,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,128,0," + g + ")";
				this.color[0] = 0;
				this.color[1] = 128;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'olive':
				this.ctx.fillStyle = "rgba(128,128,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,128,0," + g + ")";
				this.color[0] = 128;
				this.color[1] = 128;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'silver':
				this.ctx.fillStyle = "rgba(192,192,192," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(192,192,192," + g + ")";
				this.color[0] = 192;
				this.color[1] = 192;
				this.color[2] = 192;
				this.color[3] = g;
				break;

			case 'gray':
				this.ctx.fillStyle = "rgba(128,128,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,128,128," + g + ")";
				this.color[0] = 128;
				this.color[1] = 128;
				this.color[2] = 128;
				this.color[3] = g;
				break;

			case 'black':
				this.ctx.fillStyle = "rgba(0,0,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,0,0," + g + ")";
				this.color[0] = 0;
				this.color[1] = 0;
				this.color[2] = 0;
				this.color[3] = g;
				break;

		}

	}

	
	else {

		this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
		this.ctx.lineWidth = "2";
		this.ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
		this.color[0] = r;
		this.color[1] = g;
		this.color[2] = b;
		this.color[3] = a;
	}

	

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

libCanvas.prototype.getClip = function(){
	
	return [this.x, this.y, this.sizeX, this.sizeY];
	
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
	

	return verifica;
}

libCanvas.prototype.drawLine = function(x1, y1, x2, y2) {
	console.log("drawLine");

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

libCanvas.prototype.getFont = function(){
	
	return [this.attrFont[0], this.attrFont[1], this.attrFont[2]];
}

libCanvas.prototype.attrText = function(face, size, style) {
	console.log("attrFont");

	if (style === undefined)
		style = "none";
		
	this.attrFont[0] = face;
	this.attrFont[1] = size;
	this.attrFont[2] = style;
	
	this.ctx.font = size + " " + face + " " + style;
}

libCanvas.prototype.drawText = function(x, y, text) {
	console.log("drawText");

	dimension = this.measureTextLua(text);

	width = dimension[0];
	height = dimension[1];

	this.initX = this.x + x;
	this.initY = this.y + y + height;
	
	//console.log('Texto:', text)
	this.ctx.fillText(text, this.initX, this.initY);

}

libCanvas.prototype.measureTextLua = function(text) {
	console.log("measureTextLua");

	var textWidth = this.ctx.measureText(text);

	height = parseInt(this.ctx.font[0] + this.ctx.font[1]);

	return [textWidth.width, height];
}

libCanvas.prototype.getContext = function(){
	
	return this.ctx;
}

libCanvas.prototype.getCrop = function(){
	return [this.iniCropX, this.iniCropY, this.endCropX, this.endCropY];
}

libCanvas.prototype.attrCrop = function(x, y, w, h) {
	console.log("attrCrop");
	
	this.iniCropX = x;
	this.iniCropY = y;
	this.endCropX = x+w;
	this.endCropY = y+h;
	
	if(this.endCropX + this.iniCropX> this.width)
		this.endCropX = this.endCropX - x;
		
	if(this.endCropY + this.iniCropY> this.height)
		this.endCropY = this.endCropY - y;
	
}


libCanvas.prototype.compose = function(x, y, img) {
	
	console.log("compose");

	var context = img.getContext();
	var imageData = context.getImageData(img.iniCropX, img.iniCropY, img.endCropX, img.endCropY);
	this.ctx.putImageData(imageData, x, y);
	
}

libCanvas.prototype.flush = function() {
	console.log('flush');
	var dimension = this.attrSize();
	var imageData = this.ctx.getImageData(0,0,dimension[0],dimension[1]);
	//this.ctx2.clearRect(0,0,dimension[0],dimension[1]);
	//this.ctx.clearRect(0,0,dimension[0],dimension[1]);
	this.ctx2.putImageData(imageData, 0,0);
}

