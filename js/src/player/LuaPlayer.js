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

	this.p = p;
	this.htmlPlayer = "#" + p.id;
	this.luajscode = undefined;
	this.persitent = new libPersistent(false);
	this.http = new libHttp();
	this.canvas_objects = [];
	this.events = new libEvents(this);
    
    //instance of broker controller
	this.broker = new libBroker(this);
    
	this.id = 0;
	this.arrayUsers = [];
	this.isHandlingEvent = false;
	p.createElement("<div class='player' id='" + p.id + "'></div>");
	
	this.isRunning = false;
	this.p.onChangeProperty = {};
	this.p.onChangeProperty.defaultAction = Player.propertyAction.OVERRIDE;
  	this.p.onChangeProperty.propertyMap = {}
  	this.p.onChangeProperty.propertyMap['width'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['height'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['left'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['right'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['bottom'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['top'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['title'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['zIndex'] = Player.propertyAction.IGNORE;
  	
  	//path to load images correctly in .lua files
  	this.pathlua = '';
  		
	var tbl = document.createElement('table');
	tbl.setAttribute('id', 'myTable');
	tbl.setAttribute('class', 'panel');
	var tblBody = document.createElement('tbody');
	tbl.appendChild(tblBody);
	$('#content').append(tbl);
    p.enableKeyEvents();
    

	
	
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
	
	var breakPath = source.split('/');
	this.pathLua = "";
	for (i = 0; i < breakPath.length-1; i++) {
		this.pathLua = this.pathLua + breakPath[i] + '/'
	}
	
	$.ajax({
		type : "GET",
		url : source,
		dataType : "text",
		async : false,
		success : $.proxy(function(data) {
			data = 'canvas = libCanvas.init();\n' + data;
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
	//console.log('exec lua: ' + time);
}
/**
 * Start
 */
LuaPlayer.prototype.start = function(nodeInterface) {
	console.log('LuaPlayer.prototype.start', nodeInterface, this.isRunning);
	
	if (this.isRunning === false) {
		this.isRunning = true;
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'start';
		this.eventQueue(evt, true);

		lua_call(this.luajscode);

		if (this.events.handlers) {
			this.callHandlers();
		}
	}
	
	if (nodeInterface != undefined) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'start';
		evt.str['label'] = nodeInterface;
		this.eventQueue(evt);
	}

	
}
/**
 * Stop
 */
LuaPlayer.prototype.stop = function() {
	console.log('LuaPlayer.prototype.stop', this.isRunning);
	this.isRunning = false;

	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'stop';
		this.eventQueue(evt);
	}
}
/**
 * Pause
 */
LuaPlayer.prototype.pause = function() {
	console.log('LuaPlayer.prototype.pause');

	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'pause';
		this.eventQueue(evt);
	}
}
/**
 * Resume
 */
LuaPlayer.prototype.resume = function() {
	console.log('LuaPlayer.prototype.resume');

	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'resume';
		this.eventQueue(evt);
	}
}
/**
 * Abort
 */
LuaPlayer.prototype.abort = function() {
	console.log('LuaPlayer.prototype.abort', this.isRunning);
	this.isRunning = false;

	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'abort';
		this.eventQueue(evt);
	}
}
/**
 * Seek
 */
LuaPlayer.prototype.seek = function(newTime) {
	
	this.eventQueue(evt);
}
/**
 * SeekAndPLay
 */
LuaPlayer.prototype.seekAndPlay = function(newTime) {

}

LuaPlayer.prototype.keyEventHandler = function(kevent){
	
	if(this.events.handlers){
		var evt = lua_newtable();
		evt.str['class'] = 'key';
		evt.str['type'] = kevent.type;
        evt.str['key']  = kevent.key.split('KEY_')[1] || kevent.key;
		this.eventQueue(evt);
	}	
	
}

LuaPlayer.prototype.setProperty = function(name, value) {
	console.log('LuaPlayer.prototype.setProperty', name, value)

	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'attribution';
		evt.str['action'] = 'start';
		evt.str['name'] = name;
		evt.str['value'] = value;
		this.eventQueue(evt);
	}
}



LuaPlayer.prototype.bindlibs = function() {

	lua_libs["libCanvas"] = {
		'variable' : {
			id : this.id,
			p : this.p,
			canvas_objects : this.canvas_objects,
			pathLua : this.pathLua
		}
	};

	lua_libs["libCanvas"]["init"] = $.proxy(function() {

		
		
		
		try {
			var canvas = document.createElement("canvas");
			canvas.id = "mycanvas_" + this.variable.id;
			canvas.width = this.variable.p.getProperty('width').split('px')[0];
			canvas.height = this.variable.p.getProperty('height').split('px')[0];
			$('#' + this.variable.p.id).append(canvas);

			var ctx = canvas.getContext("2d");

			var object = new libCanvas(ctx);
			
			this.variable.canvas_objects[this.variable.id] = object;

		} catch(err) {

			console.warn('region has to be defined');
		}

		

		var luaObject = lua_newtable();
		luaObject.str['id'] = this.variable.id; 


		

		luaObject.str['new'] = $.proxy(function(self, attr0, attr1) {

			var url;
			var w, h;

			if (attr1 === undefined) {
				url = attr0;

				objCanvas = this.variable.canvas_objects[self.str['id']];
				
				newObject = objCanvas.newImage(this.variable.pathLua + url);
				this.variable.id = this.variable.id + 1;
				this.variable.canvas_objects[this.variable.id] = newObject;
				var newLuaObjet = $.extend(true, {}, self);
				newLuaObjet.str['id'] = this.variable.id;

				return [newLuaObjet];

			} else {
				w = attr0;
				h = attr1;

				objCanvas = this.variable.canvas_objects[self.str['id']];
				newObject = objCanvas.newCanvas(w, h);
				this.variable.id = this.variable.id + 1;
				var newLuaObjet = $.extend(true, {}, self);

				newLuaObjet.str['id'] = this.variable.id;
				this.variable.canvas_objects[this.variable.id] = newObject;
				return [newLuaObjet];
			}

		}, this);

		luaObject.str['attrSize'] = $.proxy(function(self) {
			
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return [0,0];
			}
			
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			return objCanvas.attrSize();
		}, this);

		luaObject.str['attrColor'] = $.proxy(function(self, r, g, b, a) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			if(r === undefined & g === undefined & b === undefined & a === undefined)
				return [objCanvas.getColor()];
			
			else
				objCanvas.attrColor(r, g, b, a);

		}, this);

		luaObject.str['drawLine'] = $.proxy(function(self, x1, y1, x2, y2) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			objCanvas.drawLine(x1, y1, x2, y2);
		}, this);

		luaObject.str['drawRect'] = $.proxy(function(self, mode, x, y, w, h) {
			
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			objCanvas.drawRect(mode, x, y, w, h);
		}, this);

		luaObject.str['drawText'] = $.proxy(function(self, x, y, text) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			objCanvas.drawText(x, y, text);
		}, this);

		luaObject.str['measureText'] = $.proxy(function(self, text) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return [0,0];
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			return objCanvas.measureTextLua(text);
		}, this);

		luaObject.str['attrFont'] = $.proxy(function(self, face, size, style) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			if(face === undefined & size === undefined & style === undefined)
				return [objCanvas.getFont()];
			
			else
				objCanvas.attrText(face, size, style);
		}, this);

		luaObject.str['attrCrop'] = $.proxy(function(self, x, y, w, h) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			if(x === undefined & y === undefined & w === undefined & h === undefined)
				return [objCanvas.getCrop()];
			else
				objCanvas.attrCrop(x, y, w, h);
			
		}, this);

		luaObject.str['compose'] = $.proxy(function(self, x, y, img) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			var objImg = this.variable.canvas_objects[img.str['id']];
			objCanvas.compose(x, y, objImg); 			
			
		}, this);
		
		luaObject.str['flush'] = $.proxy(function(self) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			objCanvas.flush();
		}, this);
		

		luaObject.str['attrClip'] = $.proxy(function(self, x, y, w, h) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			if(x === undefined & y === undefined & w === undefined & h === undefined)
				return [objCanvas.getClip()];
			else
				objCanvas.attrClip(x, y, w, h);
		}, this);
		
		return [luaObject];
				
	}, lua_libs["libCanvas"]);

	lua_libs["persistent"] = {
		"set" : $.proxy(function(prefix, key, value) {
			this.persitent.storeField(prefix, key, value);

		}, this),

		"get" : $.proxy(function(key) {
			return [this.persitent.recoverField(key)];
		}, this)
		
	};

	lua_libs["event"] = {
		"post" : $.proxy(function(mode,evnt) {
			this.events.post(mode,evnt);
		}, this),
		"register" : $.proxy(function(handler) {
			this.events.register(handler);
		}, this),
		"unregister" : $.proxy(function(handler) {
			this.events.unregister(handler);
		}, this),
		"timer" : $.proxy(function(timeout, fct) {
			this.events.timer(timeout, fct);
		}, this),
		"uptime" : $.proxy(function() {
			return [this.events.uptime()];
		}, this)
	}
	
	lua_libs["http"] = {
		"request" : $.proxy(function(param){
			return [this.http.request(param)];
		}, this)
	}

	lua_libs["broker"] = {
		"init" : $.proxy(function(strURI, fnOptCallback) {
			this.broker.init(strURI, fnOptCallback);
		},this),
		"post" : $.proxy(function(strDestination, strMessage) {
			this.broker.post(strDestination, strMessage);
		},this),
		"register" : $.proxy(function(strDestination, fnHandler) {
			this.broker.register(strDestination, fnHandler);
		},this),
		"unregister" : $.proxy(function(strDestination) {
			this.broker.unregister(strDestination);
		},this)
	}

}
//

LuaPlayer.prototype.callHandlers = function() {
	
	if (this.isHandlingEvent) {
		return;
	} else {
		this.isHandlingEvent = true;
		var evnt = this.arrayUsers.splice(0, 1);
		while (evnt.length >= 1) {

			for ( i = 0; i < this.events.handlers.length; i++) {
				if (this.events.handlers[i] === undefined) {

				} else {

					var obj = {
						handler : this.events.handlers[i],
						evnt : evnt[0]

					};

					setTimeout($.proxy(function() {
						this.handler(this.evnt);
					}, obj), 0);

				}
			}
			
			evnt = this.arrayUsers.splice(0, 1);
		}
		this.isHandlingEvent = false;

	}

}



LuaPlayer.prototype.eventQueue = function(evt, notcallhandlers){
	
	this.arrayUsers.push(evt);
	
	if (notcallhandlers == undefined) {
		this.callHandlers();
	}
	
	
}

//Functions to console lua
lua_core["print"] = function () {
  try {
  	
    console.log.apply(console, arguments);
    addCell(Array.prototype.slice.call(arguments));
    
   
  } catch (e) {
    // do nothing
  }
  return [];
};


function addCell(info){
	var tbl = document.getElementById('myTable');
	var row = tbl.insertRow(-1);
	var cell = row.insertCell(0);
	cell.innerHTML = info;
}

