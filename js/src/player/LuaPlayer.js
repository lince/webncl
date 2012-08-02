/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @fileoverview Define LuaPlayer class. [WIP]
 */

/**
 * Default player for video/flv. This is a Work in Progress. All players are
 * still handled by MediaPlayer.js
 * 
 * @constructor
 */
function LuaPlayer(p) {

	console.log('constructor lua: ' + p.id);

	this.p = p;
	this.htmlPlayer = "#" + p.id;
	this.luajscode = undefined;
	this.persitent = new libPersistent(false);
	this.canvas_objects = [];
	this.events = new libEvents(p);
	this.id = 0;
	
	
	console.log(p.id);

};

/**
 * Called when the player needs to unload its sources (Precedes calls to unload,
 * excepting the first call)
 */
LuaPlayer.prototype.unload = function() {
	// erases older content
	$(this.htmlPlayer).empty();
}

/**
 * Called when the player need to load (or reload) it sources After the first
 * time it's called, MediaPlayer.js will precede every call to load() with a
 * call to unload()
 * 
 */
LuaPlayer.prototype.load = function(source) {
	console.log('load lua: ' + source);

	$.ajax({
		type : "GET",
		url : source,
		dataType : "text",
		async : false,
		success : $.proxy(function(data) {
			this.luajscode = lua_load(data);
		}, this),
		error : function() {
			console.log('error to load file');
		}
	});
	
	this.bindlibs();

}

/**
 * This function should be called to set function calls based on the video
 * progress in time
 */
LuaPlayer.prototype.exec = function(time, callback) {
	console.log('exec lua: ' + time);
}

/**
 * Start
 */
LuaPlayer.prototype.start = function() {
	console.log('start lua');
	lua_call(this.luajscode);
	
	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'start';
		this.callHandlers(evt);
	}
}

/**
 * Stop
 */
LuaPlayer.prototype.stop = function() {
	console.log('stop lua');
	
	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'stop';
		this.callHandlers(evt);
	}
}

/**
 * Pause
 */
LuaPlayer.prototype.pause = function() {
	console.log('pause lua');
	
	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'pause';
		this.callHandlers(evt);
	}
}

/**
 * Resume
 */
LuaPlayer.prototype.resume = function() {
	console.log('resume lua');
	
	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'resume';
		this.callHandlers(evt);
	}
}

/**
 * Abort
 */
LuaPlayer.prototype.abort = function() {
	console.log('abort lua');
	
	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'abort';
		this.callHandlers(evt);
	}
}

/**
 * Seek
 */
LuaPlayer.prototype.seek = function(newTime) {
	console.log('seek lua');
	this.callHandlers();
}

/**
 * SeekAndPLay
 */
LuaPlayer.prototype.seekAndPlay = function(newTime) {
	console.log('seek and play lua');

}

LuaPlayer.prototype.setProperty = function(name,value) {
	
	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'attribution';
		evt.str['action'] = 'start';
		evt.str['property'] = name;
		evt.str['value'] = value;
		this.callHandlers(evt);
	}
} 

LuaPlayer.prototype.bindlibs = function() {
	
	canvas_objects = this.canvas_objects;
	p = this.p;
	id = this.id;
	
	lua_libs["canvas"] = {
		
			"init": function(){
				
				p.createElement("<canvas id='" + p.id + id + "'></canvas>");
				$("#"+p.id).css('border','1px solid black');
				
				var a = document.getElementById(p.id);
				console.log(a);
								
				ctx = a.getContext("2d");
				console.log(ctx);
				
				object = new libCanvas(ctx);
				canvas_objects[id] = object;
				luaObject = lua_newtable();
				luaObject.str['id'] = id;
				id = id + 1;
				return luaObject;
			},

			"attrSize": function(self){
				objCanvas = canvas_objects[self.str[id]];
				objCanvas.attrSize();
			},

			"attrColor" : function(self,r,g,b,a,mode){
				objCanvas = canvas_objects[self.str[id]];
				objCanvas.attrColor(r,g,b,a,mode);
			},

			"attrClip" : function(self,x,y,w,h){
				objCanvas = canvas_objects[self.str[id]];
				objCanvas.attrClip(x,y,w,h);

			},

			"drawLine" : function(self,x1,y1,x2,y2){
				objCanvas = canvas_objects[self.str[id]];
				objCanvas.drawLine(x1,y1,x2,y2);

			},

			"drawRect" : function(self,x,y,w,h, mode){
				objCanvas = canvas_objects[self.str[id]];
				objCanvas.drawRect(x,y,w,h, mode);

			},

			"attrText" : function(self,face,size,style){
				objCanvas = canvas_objects[self.str[id]];
				objCanvas.attrText(face,size,style);

			},

			"drawText" : function(self,x, y, text){
				objCanvas = canvas_objects[self.str[id]];
				objCanvas.drawText(x, y, text);

			},

			"measureText" : function(self,text){
				objCanvas = canvas_objects[self.str[id]];
				objCanvas.measureTextLua(text);

			},

			"attrCrop" : function(self,ctxDestiny, x, y, w, h){
				objCanvas = canvas_objects[self.str[id]];
				objCanvas.attrCrop(ctxDestiny, x, y, w, h);

			},

			"compose" : function(self,ctxDestiny){
				objCanvas = canvas_objects[self.str[id]];
				objCanvas.compose(ctxDestiny);

			}

	};
	
	persist = this.persitent;

	lua_libs["persistent"] = {

			"set" : function(prefix, key, value){
				persist.storeField(prefix, key, value);
				
			},

			"get" : function(key){
				return persist.recoverField(key);
			}

	};
	
	events = this.events;
	
	lua_libs["event"] = {
			"post" : function(evnt) {
				events.post(evnt);
			},
			"register" : function(handler) {
				events.register(handler);
			},
			"unregister" : function(handler) {
				events.unregister(handler);
			},
			"timer" : function(timeout, fct){
				events.timer(timeout, fct);
			},
			"uptime" : function(){
				return events.uptime();
			}
	}
	
	
}
//

//TODO call all the handlers registered in their correct positions
LuaPlayer.prototype.callHandlers = function (evt) {
	for(i =0; i < this.events.handlers.length; i++){
		this.events.handlers[i](evt);
	}
	
}