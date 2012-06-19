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

function Player () {

	this.create = function() {};
	this.start = function() {};
	this.stop = function() {};
	this.pause = function() {};
	this.resume = function() {};
	this.abort = function() {};
	this.seekAndPlay = function() {};
	this.selection = function() {};

}

// bindEvents
Player.prototype.bindEvents = function () {
	$(this.htmlPlayer).on("start",$.proxy(function(event,nodeInterface,callback,args) {
		this.start(nodeInterface);
		if (callback) {
			callback(args);
		}
	},this));
	$(this.htmlPlayer).on("stop",$.proxy(function(event,nodeInterface,callback,args) {
		this.stop(nodeInterface);
		if (callback) {
			callback(args);
		}
	},this));
	$(this.htmlPlayer).on("pause",$.proxy(function(event,nodeInterface,callback,args) {
		this.pause(nodeInterface);
		if (callback) {
			callback(args);
		}
	},this));
	$(this.htmlPlayer).on("resume",$.proxy(function(event,nodeInterface,callback,args) {
		this.resume(nodeInterface);
		if (callback) {
			callback(args);
		}
	},this));
	$(this.htmlPlayer).on("abort",$.proxy(function(event,nodeInterface,callback,args) {
		this.abort(nodeInterface);
		if (callback) {
			callback(args);
		}
	},this));
	$(this.htmlPlayer).on("set",$.proxy(function(event,nodeInterface,callback,args,value) {
		this.setProperty(nodeInterface,value);
		if (callback) {
			callback(args);
		}
	},this));
	$(this.htmlPlayer).on("focus",$.proxy(function() {
		this.focus();
	},this));
	$(this.htmlPlayer).on("blur",$.proxy(function() {
		this.blur();
	},this));
	$(this.htmlPlayer).on("selection.onSelection",$.proxy(function() {
		this.selection();
	},this));
};

// setProperty
Player.prototype.setProperty = function (name, value) {

	var property = $(this.htmlPlayer).data("property");
	property[name] = value ? value : "";
	$(this.htmlPlayer).data("property",property);
	
	// TODO: verificar os eventos
	$(this.htmlPlayer).trigger("attribution.onBeginAttribution",[name]);
	
	if (value != null) {
	
		switch (name) {
		
			// POSITION/DIMENSION
			
			case "top":
			case "left":
			case "bottom":
			case "right": {
				// TODO: %
				$(this.htmlPlayerBkg).css(name,value);
				break;
			}
			case "height":
			case "width": {
				var buffer = value.split("%");
				if (buffer.length > 1) {
					var currentValue = $(this.htmlPlayerBkg).css(name);
					value = parseInt(parseInt(currentValue)*parseFloat(buffer[0])/100);
				}
				$(this.htmlPlayer).css(name,value);
				$(this.htmlPlayerBkg).css(name,value);
				break;
			}
			case "location": {
				var location = value.split(",");
				this.setProperty("left",bounds[0]);
				this.setProperty("top",bounds[1]);
				return;
			}
			case "size": {
				var size = value.split(",");
				this.setProperty("width",bounds[0]);
				this.setProperty("height",bounds[1]);
				return;
			}
			case "bounds": {
				var bounds = value.split(",");
				this.setProperty("left",bounds[0]);
				this.setProperty("top",bounds[1]);
				this.setProperty("width",bounds[2]);
				this.setProperty("height",bounds[3]);
				return;
			}
			case "zIndex": {
				$(this.htmlPlayer).css("z-index",value)
				$(this.htmlPlayerBkg).css("z-index",value)
				break;
			}
			
			// SOUND
			
			case "soundLevel": {
				if (this.checkType(["video","audio"])) {
					var buffer = value.split("%");
					if (buffer.length > 1) {
						value = buffer[0] / 100;
					}
					this.popcornPlayer.volume(value);
				}
				break;
			}
			case "balanceLevel":
			case "bassLevel":
			case "trebleLevel": {
				var buffer = value.split("%");
				if (buffer.length > 1) {
					value = buffer[0] / 100;
				}
				// TODO (0.0-1.0)
				Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
				break;
			}
			
			// VISIBILITY
			
			case "background": {
				$(this.htmlPlayerBkg).css("background-color",value);
				break;
			}
			case "transparency": {
				var buffer = value.split("%");
				if (buffer.length > 1) {
					value = parseInt(buffer[0]) / 100;
				} else {
					value = parseFloat(buffer[0]);
				}
				this.opacity = 1 - value;
				$(this.htmlPlayer).css("opacity",this.opacity);
				break;
			}
			case "visible": {
				this.isVisible = value=="true"?true:false;
				if (this.isVisible) {
					this.presentation.focusManager.addMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
					$(this.htmlPlayerBkg).css("display","inline");
				} else {
					this.presentation.focusManager.removeMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
					$(this.htmlPlayerBkg).css("display","none");
				}
				break;
			}
			case "scroll": {
				// TODO: ver norma (p.44)
				Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
				break;
			}
			case "fit": {
				// TODO: ver norma (p.44)
				Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
				break;
			}
			case "style": {
				// TODO: url de um arquivo css
				Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
				break;
			}
			
			// FONT
			
			case "fontColor": {
				$(this.htmlPlayer).css("color",value);
				break;
			}
			case "fontFamily": {
				$(this.htmlPlayer).css("font-family",value);
				break;
			}
			case "fontStyle": {
				$(this.htmlPlayer).css("font-style",value);
				break;
			}
			case "fontSize": {
				$(this.htmlPlayer).css("font-size",value);
				break;
			}
			case "fontVariant": {
				$(this.htmlPlayer).css("font-variant",value);
				break;
			}
			case "fontWeight": {
				$(this.htmlPlayer).css("font-weight",value);
				break;
			}
			
			// ???
			
			case "explicitDur": {
				var buffer = value.split("s");
				this.explicitDur = parseInt(buffer[0]);
				break;
			}
			case "baseDeviceRegion":
			case "deviceClass":
			case "plan":
			case "player":
			case "playerLife":		// keep/close
			case "reusePlayer": {	// true/false
				// TODO
				Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"property",[name]);
				break;
			}
			
			// TRANSITION
			
			case "transInBorderColor":
			case "transInBorderWidth":
			case "transInDirection":
			case "transInDur":
			case "transInEndProgress":
			case "transInFadeColor":
			case "transInHorRepeat":
			case "transInStartProgress":
			case "transInSubtype":
			case "transInType":
			case "transInVertRepeat":
			case "transBorderColor":
			case "transOutBorderWidth":
			case "transOutDirection":
			case "transOutDur":
			case "transOutEndProgress":
			case "transOutFadeColor":
			case "transOutHorRepeat":
			case "transOutType":
			case "transOutStartProgress":
			case "transOutSubtype":
			case "transOutVertRepeat": {
				// TODO
				Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"property",[name]);
				break;
			}
			
			// SETTINGS
			
			case "service.currentFocus":
			case "default.focusBorderColor":
			case "default.selBorderColor":
			case "default.focusBorderWidth":
			case "default.focusBorderTransparency": {
				if (this.checkType(["application"])) {
					this.presentation.systemSettings.setPropertyValue(name,value);
				}
			}

		}

	}

};