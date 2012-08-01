function runLua(path){
	var luacode = undefined;
	$.ajax({
		type : "GET",
		url : source,
		dataType : "text",
		async : false,
		success : $.proxy(function(path) {
			luacode = lua_load(path);
		}, this),
		error : function() {
			console.log('error to load file');
		}
	});
	lua_call(luacode);
}


lua_libs["canvas"] = {
		
	"test" : function() {
		console.log('running canvas.test');
	},
	
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

var persist;

lua_libs["persistent"] = {
	
	"initialize": function(readOnly){
		persist = new libPersistent(readOnly);
		
	},
	
	"set" : function(prefix, key, value){
		persist.storeField(prefix, key, value);
	},
	
	"get" : function(key){
		persist.recoverField(key);
	}
	
};

lua_libs["event"] = {
		
	"post" : function(evt) {
		
	}
}
