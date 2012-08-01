var id = 0;

lua_libs["canvas"] = {
		
			"init": function(ctx){
				object = new libCanvas(ctx);
				objCanvas_objects[id] = object;
				id = id + 1;
				return objCanvas_object;
			},

			"attrSize": function(self){
				objCanvas = self.str[id];
				objCanvas.attrSize();
			},

			"attrColor" : function(self,r,g,b,a,mode){
				objCanvas = self.str[id];
				objCanvas.attrColor(r,g,b,a,mode);
			},

			"attrClip" : function(self,x,y,w,h){
				objCanvas = self.str[id];
				objCanvas.attrClip(x,y,w,h);

			},

			"drawLine" : function(self,x1,y1,x2,y2){
				objCanvas = self.str[id];
				objCanvas.drawLine(x1,y1,x2,y2);

			},

			"drawRect" : function(self,x,y,w,h, mode){
				objCanvas = self.str[id];
				objCanvas.drawRect(x,y,w,h, mode);

			},

			"attrText" : function(self,face,size,style){
				objCanvas = self.str[id];
				objCanvas.attrText(face,size,style);

			},

			"drawText" : function(self,x, y, text){
				objCanvas = self.str[id];
				objCanvas.drawText(x, y, text);

			},

			"measureText" : function(self,text){
				objCanvas = self.str[id];
				objCanvas.measureTextLua(text);

			},

			"attrCrop" : function(self,ctxDestiny, x, y, w, h){
				objCanvas = self.str[id];
				objCanvas.attrCrop(ctxDestiny, x, y, w, h);

			},

			"compose" : function(self,ctxDestiny){
				objCanvas = self.str[id];
				objCanvas.compose(ctxDestiny);

			}

	};