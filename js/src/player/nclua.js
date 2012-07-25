function runLua(path){
  $.get(path, function(data){
    var luajscode = lua_load(data);
    lua_call(luajscode);
  });
}


lua_libs["canvas"] = {
	
	"initialize" : function(ctx){
		var canvas = new libCanvas(ctx);
	},
	
	"attrSize": function(){
		canvas.attrSize();
	},
	
	"attrColor" : function(r,g,b,mode){
		canvas.attrColor(r,g,b,mode);
	},
	
	"attrClip" : function(x,y,w,h){
		canvas.attrClip(x,y,w,h);
		
	},
	
	"drawLine" : function(x1,y1,x2,y2){
		canvas.drawLine(x1,y1,x2,y2);
		
	},
	
	"drawRect" : function(x,y,w,h){
		canvas.drawRect(x,y,w,h);
		
	},
	
	"attrText" : function(face,size,style){
		canvas.attrText(face,size,style);
		
	},
	
	"drawText" : function(x, y, text){
		canvas.drawText(x, y, text);
		
	},
	
	"measureText" : function(text){
		canvas.measureTextLua(text);
		
	},
	
	"attrCrop" : function(ctxDestiny, x, y, w, h){
		canvas.attrCrop(ctxDestiny, x, y, w, h);
		
	},
	
	"compose" : function(ctxDestiny){
		canvas.compose(ctxDestiny);
		
	}
	
};

lua_libs["persistent"] = {
	
	"initializate": function(readOnly){
		var persist = new libPersistent(readOnly);
		
	},
	
	"set" : function(prefix, key, value){
		persist.setField(prefix, key, value);
	},
	
	"get" : function(key){
		persist.recoverField(key);
	}
	
};
