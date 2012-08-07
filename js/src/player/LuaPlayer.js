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
	p.createElement("<div class='player' id='" + p.id + "'></div>");

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

LuaPlayer.prototype.setProperty = function(name, value) {

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

LuaPlayer.prototype.createCanvasObject = function() {

}

LuaPlayer.prototype.bindlibs = function() {

	canvas_objects = this.canvas_objects;
	p = this.p;
	id = this.id;

	lua_libs["libCanvas"] = {
		'variable' : {
			id : this.id,
			p : this.p
		},
	};

	lua_libs["libCanvas"]["init"] = $.proxy(function() {

		var canvas = document.createElement("canvas");
		canvas.id = "mycanvas_" + this.variable.id;
		canvas.width = 500;
		canvas.height = 500;

		$('#' + this.variable.p.id).append(canvas);

		ctx = canvas.getContext("2d");

		object = new libCanvas(ctx);
		canvas_objects[id] = object;
		var luaObject = lua_newtable();
		luaObject.str['id'] = this.variable.id;

		

		luaObject.str['new'] = $.proxy(function(self, attr0, attr1) {

			var url;
			var w, h;

			if (attr1 === undefined) {
				url = attr0;

				objCanvas = canvas_objects[self.str['id']];

				newObject = objCanvas.newImage(url);
				this.variable.id = this.variable.id + 1;
				canvas_objects[this.variable.id] = newObject;
				var newLuaObjet = $.extend(true, {}, self);
				newLuaObjet.str['id'] = this.variable.id;

				return [newLuaObjet];

			} else {
				w = attr0;
				h = attr1;

				objCanvas = canvas_objects[self.str['id']];
				newObject = objCanvas.newCanvas(w, h);
				this.variable.id = this.variable.id + 1;
				var newLuaObjet = $.extend(true, {}, self);

				newLuaObjet.str['id'] = this.variable.id;
				canvas_objects[this.variable.id] = newObject;
				return [newLuaObjet];
			}

		}, this);

		luaObject.str['attrSize'] = function(self) {
			objCanvas = canvas_objects[self.str['id']];
			return objCanvas.attrSize();

		};

		luaObject.str['attrColor'] = function(self, r, g, b, a) {
			
			objCanvas = canvas_objects[self.str['id']];
			objCanvas.attrColor(r, g, b, a);
			
			
		};

		luaObject.str['drawLine'] = function(self, x1, y1, x2, y2) {
			objCanvas = canvas_objects[self.str['id']];
			objCanvas.drawLine(x1, y1, x2, y2);
		};

		luaObject.str['drawRect'] = function(self, mode, x, y, w, h) {
			objCanvas = canvas_objects[self.str['id']];
			objCanvas.drawRect(mode, x, y, w, h);
		};

		luaObject.str['drawText'] = function(self, x, y, text) {
			objCanvas = canvas_objects[self.str['id']];
			objCanvas.drawText(x, y, text);
		};

		luaObject.str['measureText'] = function(self, text) {
			objCanvas = canvas_objects[self.str['id']];
			return objCanvas.measureTextLua(text);
		};

		luaObject.str['attrText'] = function(self, text) {
			objCanvas = canvas_objects[self.str['id']];
			objCanvas.attrText(face, size, style);
		};

		luaObject.str['compose'] = function(self, ctxDestiny) {
			objCanvas = canvas_objects[self.str['id']];
			objCanvas.compose(ctxDestiny);
		};

		luaObject.str['attrCrop'] = function(self, x, y, w, h) {
			objCanvas = canvas_objects[self.str['id']];
			return [objCanvas.attrCrop(x, y, w, h)];
		};

		luaObject.str['attrClip'] = function(self, x, y, w, h) {
			objCanvas = canvas_objects[self.str['id']];
			objCanvas.attrClip(x, y, w, h);
		};
		return [luaObject];

	}, lua_libs["libCanvas"]);

	persist = this.persitent;

	lua_libs["persistent"] = {

		"set" : function(prefix, key, value) {
			persist.storeField(prefix, key, value);

		},

		"get" : function(key) {
			return [persist.recoverField(key)];
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
		"timer" : function(timeout, fct) {
			events.timer(timeout, fct);
		},
		"uptime" : function() {
			return events.uptime();
		}
	}

}
//

LuaPlayer.prototype.callHandlers = function(evt) {
	for ( i = 0; i < this.events.handlers.length; i++) {
		if (this.events.handlers[i] === undefined) {

		} else
			this.events.handlers[i](evt);
	}

}
