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

	p.createElement("<div class='player' id='" + p.id + "'></div>");

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
}

/**
 * Stop
 */
LuaPlayer.prototype.stop = function() {
	console.log('stop lua');
}

/**
 * Pause
 */
LuaPlayer.prototype.pause = function() {
	console.log('pause lua');
}

/**
 * Resume
 */
LuaPlayer.prototype.resume = function() {
	console.log('resume lua');
}

/**
 * Abort
 */
LuaPlayer.prototype.abort = function() {
	console.log('abort lua');
}

/**
 * Seek
 */
LuaPlayer.prototype.seek = function(newTime) {
	console.log('seek lua');

}

/**
 * SeekAndPLay
 */
LuaPlayer.prototype.seekAndPlay = function(newTime) {
	console.log('seek and play lua');

}
