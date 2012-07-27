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
		switch(nodeInterface){
			// On dynamic repositioning, the % value for position is calculated based on the media's current dimension.
				// (top/bottom values are calculated based on the current height value and left/right values are calculated based on the current width value).
			case "top":
			case "bottom":
			case "height": {
					value = this.calculatePercentageValue("height", value);
					this.setProperty(nodeInterface,value);
					break;
			}
			case "left":
			case "right": 
			case "width": {
					value = this.calculatePercentageValue("width", value);
					this.setProperty(nodeInterface,value);
					break;
			}
			case "bounds": {
					var bounds = value.split(",");
					this.setProperty("left", this.calculatePercentageValue("width",bounds[0]));
					this.setProperty("top", this.calculatePercentageValue("height",bounds[1]));
					this.setProperty("width", this.calculatePercentageValue("width",bounds[2]));
					this.setProperty("height", this.calculatePercentageValue("height",bounds[3]));
					break;
			}
			default: 
					this.setProperty(nodeInterface,value);
		}
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

// function to get the current value of a property from css and to return its absolute value, given a % value.
Player.prototype.calculatePercentageValue = function(propertyName, value){
	var buffer = value.toString().split("%");
	if (buffer.length > 1) {
			var currentValue = $(this.htmlPlayerBkg).css(propertyName);
			value = parseInt(parseInt(currentValue)*parseFloat(buffer[0])/100);
	}
	return value;
}

// getProperty
Player.prototype.getProperty = function(name)
{
	//tries to get a system property
	var v = this.presentation.systemSettings.getPropertyValue(name);

	if(v)
	{
		return v;
	} else {
		var p = $(this.htmlPlayer).data("property");
		
		//can return undefined
		return p[name];
	}
        
    
}

// setProperty
Player.prototype.setProperty = function (name, value) {
    
	// TODO: verify events
	$(this.htmlPlayer).trigger("attribution.onBeginAttribution",[name]);

        //save property data
	var property = $(this.htmlPlayer).data("property");
	property[name] = value ? value : "";
	$(this.htmlPlayer).data("property",property);

        var p = undefined;
        // handle user defined player
        if(this.player && this.player.propertyMap)
            p = this.player.propertyMap[name];
         
        //if media player does not override default property set function (or if media
        //player doesn't define information related to property 'name')
        
	if(!p)
        {
            if (value != null) {

                    switch (name) {
                            // POSITION/DIMENSION

                            case "top":
                            case "left":
                            case "bottom":
                            case "right": {
									var buffer=value.toString().split("%");
									if (buffer.length > 1)
										console.warn("Warning: Percentage position value was passed to 'setProperty' function. The value is being ignored.");
									else{
										if(name=="right")
											$(this.htmlPlayerBkg).css("left","auto");
										if(name=="bottom")
											$(this.htmlPlayerBkg).css("top","auto");									
										$(this.htmlPlayerBkg).css(name,value);
									}
                                    break;
                            }
                            case "height":
                            case "width": {
                                    var buffer = value.toString().split("%");
                                    if (buffer.length > 1) {
											console.warn("Warning: Percentage size value being calculated in 'setProperty' function.");
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
                                    Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
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
                                            if(this.node.descriptor){
                                                    this.presentation.inputManager.addMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
                                            }
                                            $(this.htmlPlayerBkg).css("display","inline");
                                    } else {
                                            if(this.node.descriptor){
                                                    this.presentation.inputManager.removeMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
                                            }
                                            $(this.htmlPlayerBkg).css("display","none");
                                    }
                                    break;
                            }
                            case "scroll": {
                                    // TODO: ver norma (p.44)
                                    Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
                                    break;
                            }
                            case "fit": {
							
                                    // TODO: passar esse tratamento para o Html5Player
									
									if (value=='meetBest') {
										Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
									}									
									var fit = {
										fill: 'fill',
										hidden: 'none',
										meet: 'contain',
										meetBest: 'scaleDown',
										slice: 'cover'
									};
									
									// TODO:
									// CSS3 property "object-fit" is currently supported by Opera only.
									// Uncomment the 3 lines below to make it work for IE, Firefox, Chrome
									// and Safari when they release a version that supports it.
									// Also, the CSS3 value 'scaleDown' ('meetBest' on NCL) for the 'fit' property is not supported yet.
									// Note: check if the property names (their prefixes) are correct on these browsers!
									console.log("Property 'fit' works only on Opera 10.6+");
									
									$(this.htmlPlayer).css('-o-object-fit',fit[value]);			// Opera
									//$(this.htmlPlayer).css('-webkit-object-fit',fit[value]); 	// Chrome/Safari
									//$(this.htmlPlayer).css('-moz-object-fit',fit[value]);		// Firefox
									//$(this.htmlPlayer).css('object-fit',fit[value]);			// IE

                                    break;
                            }
                            case "style": {
                                    // TODO: url de um arquivo css
                                    Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
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
									if (p == undefined)
										this.player.setProperty(name,value);
                                    break;
                            }
                            case "baseDeviceRegion":
                            case "deviceClass":
                            case "plan":
                            case "player":
                            case "playerLife":		// keep/close
                            case "reusePlayer": {	// true/false
                                    // TODO
                                    Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"property",[name]);
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
                                    Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"property",[name]);
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
        }
        
        //user defined 
        if(p != undefined)
        {
            if(this.player.setProperty)
                this.player.setProperty(name,value);
            else
                Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['setProperty',name,value]);
        }
        
        $(this.htmlPlayer).trigger("attribution.onEndAttribution",[name]);
        


};