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
	this.data = undefined;
	this.htmlPlayer = "";
	this.isPlaying = false;
	this.isStopped = true;

}


// constants
Player.propertyAction =
{
    IGNORE:0,
    OVERRIDE:1,
    OVERLOAD:2
};

// notify new action
// args should be an array
Player.prototype.trigger = function(event,args)
{
	//control parent context lists
	var b;
	switch(event)
	{
		case 'presentation.onBegin':
		case 'presentation.onResume':		
			if ($.inArray(this,this.parentContext.playingElem) < 0) {
				this.parentContext.playingElem.push(this);
			}
			
			b = $.inArray(this,this.parentContext.pausedElem);
			if(b > -1)
				this.parentContext.pausedElem.splice(b,1);	
		break;

		case 'presentation.onPause':
			this.parentContext.pausedElem.push(this);
						
			b = $.inArray(this,this.parentContext.playingElem);
			if(b > -1)
				this.parentContext.playingElem.splice(b,1);		
		break;


		case 'presentation.onEnd':
		case 'presentation.onAbort':
			b = $.inArray(this,this.parentContext.playingElem);
			if(b > -1)
				this.parentContext.playingElem.splice(b,1);	
			else
			{
				b = $.inArray(this,this.parentContext.pausedElem);
				if(b > -1)
					this.parentContext.pausedElem.splice(b,1);					
			}
			

		break;

	}
	 
	if(event === 'presentation.onAbort')
		this.parentContext.lastMediaAborted = true;
	else
		this.parentContext.lastMediaAborted = false;
	
	var callback = false;

	//if there is an event handler defined for this player than no callbacks are necessary
	/*if(this.data[event])
	{
		//if this player is a port than ports triggers are processed before
		//context inner links. This way attaching it only here will be enough
		callback = true;
		args.push($.proxy(this.__ecallback,this));
	}*/
	
	$(this.htmlPlayer).trigger(event,args);
	
	
	//if no events are being raised
	if(!callback)
		this.parentContext.notifyLink(0, event);
	
}

// callback used  for function above
Player.prototype.__ecallback = function(event)
{
	this.parentContext.notifyLink(0, event);
}

// bindEvents
Player.prototype.bindEvents = function () {
	$(this.htmlPlayer).on("start",{
			player : this
		},function(event,nodeInterface,callback,args) {
		
		//if not triggered by jQuery
		if(!event.originalEvent)
		{
			event.data.player.start(nodeInterface);
			if (callback) {
				callback(args);
			}

		}
		
	});
	
	$(this.htmlPlayer).on("stop",{
			player : this
		},function(event,nodeInterface,callback,args) {
		
		//if not triggered by jQuery
		if(!event.originalEvent)
		{
			event.data.player.stop(nodeInterface);
			if (callback) {
				callback(args);
			}

		}
		
	});
	$(this.htmlPlayer).on("pause",{
			player : this
		},function(event,nodeInterface,callback,args) {
			//if not triggered by jQuery
			if(!event.originalEvent)
			{
				event.data.player.pause(nodeInterface);
				if (callback) {
					callback(args);
				}				
			}

		
	});
	$(this.htmlPlayer).on("resume",{
			player : this
		},function(event,nodeInterface,callback,args) {
		
			//if not triggered by jQuery
			if(!event.originalEvent)
			{
				event.data.player.resume(nodeInterface);
				if (callback) {
					callback(args);
				}

			}
		
	});
	
	$(this.htmlPlayer).on("abort",{
			player : this
		},function(event,nodeInterface,callback,args) {
		
			//if not triggered by jQuery
			if(!event.originalEvent)
			{
				event.data.player.abort(nodeInterface);
				if (callback) {
					callback(args);
				}

			}
		
	});
	$(this.htmlPlayer).on("set",
	{
		player: this
	},
	function(event,nodeInterface,callback,args,value) {
		//if not triggered by jQuery
		if(!event.originalEvent)
		{
			event.stopPropagation();
			var player = event.data.player;
			switch(nodeInterface){
				// On dynamic repositioning, the % value for position is calculated based on the media's current dimension.
					// (top/bottom values are calculated based on the current height value and left/right values are calculated based on the current width value).
				case "top":
				case "bottom":
				case "height": 
						value = player.calculatePercentageValue("height", value);
						player.setProperty(nodeInterface,value);
						break;

				case "left":
				case "right": 
				case "width": 
						value = player.calculatePercentageValue("width", value);
						player.setProperty(nodeInterface,value);
						break;

				case "bounds": 
						var bounds = value.split(",");
						player.setProperty("left", player.calculatePercentageValue("width",bounds[0]));
						player.setProperty("top", player.calculatePercentageValue("height",bounds[1]));
						player.setProperty("width", player.calculatePercentageValue("width",bounds[2]));
						player.setProperty("height", player.calculatePercentageValue("height",bounds[3]));
						break;

				default: 
						player.setProperty(nodeInterface,value);
			}
			if (callback) {
				callback(args);
			}
		}
	});
	
	$(this.htmlPlayer).on("focus",
	{ player : this},
	function(e) {
//		if(this == e.target)
			e.data.player.focus();
	});
	
	$(this.htmlPlayer).on("blur",
	{ player : this},
	function(e) {
//		if(this == e.target)		
			e.data.player.blur();
	});
	$(this.htmlPlayer).on("selection.onSelection",
	{ player : this},
	function(e) {
//		if(this == e.target)		
			e.data.player.selection();
	});

};

// function to get the current value of a property from css and to return its absolute value, given a % value.
Player.prototype.calculatePercentageValue = function(propertyName, value){
	var buffer = value.toString().split("%");
	if (buffer.length > 1) {
			var currentValue = $(this.htmlPlayerBkg).css(propertyName);
			value = parseInt(parseInt(currentValue)*parseFloat(buffer[0])/100);
	}
	return value;
};

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

};

// setProperty
Player.prototype.setProperty = function (name, value, ignoreEvents) {
    
	if (!ignoreEvents) {
		// TODO: verify events
		$(this.htmlPlayer).trigger("attribution.onBeginAttribution",[name]);
	}

    //save property data
	var property = $(this.htmlPlayer).data("property");
	property[name] = value ? value : "";
	$(this.htmlPlayer).data("property",property);

	if (!ignoreEvents) {
		//handle user defined player
		var p = this.playerSettings.onChangeProperty || undefined;
		var p_action = Player.propertyAction.IGNORE;
		if(p)
			p_action = (p.propertyMap[name] != undefined) ? p.propertyMap[name] : p.defaultAction;

		//if media player does not override default property set function (or if media
		//player doesn't define information related to property 'name')
			
		//as Player.propertyAction.IGNORE = 0
		//its ok to test p_action
	}

	if(!p_action || p_action == Player.propertyAction.OVERLOAD) {
            
		if (value != null) {

			switch (name) {
					// POSITION/DIMENSION

					case "top":
					case "left":
					case "bottom":
					case "right": 
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
					
					case "height":
					case "width": 
						var buffer = value.toString().split("%");
						if (buffer.length > 1) {
								console.warn("Warning: Percentage size value being calculated in 'setProperty' function.");
								var currentValue = $(this.htmlPlayerBkg).css(name);
								value = parseInt(parseInt(currentValue)*parseFloat(buffer[0])/100);
						}
						$(this.htmlPlayer).css(name,value);
						$(this.htmlPlayerBkg).css(name,value);
						break;
					
					case "zIndex": 
						$(this.htmlPlayer).css("z-index",value)
						$(this.htmlPlayerBkg).css("z-index",value)
						break;
					

					// SOUND

					case "soundLevel":
						var buffer = value.split("%");
							if (buffer.length > 1) {
								value = buffer[0] / 100;
							}

						break;
					
					case "balanceLevel":
					case "bassLevel":
					case "trebleLevel": 
						var buffer = value.split("%");
						if (buffer.length > 1) {
								value = buffer[0] / 100;
						}
						// TODO (0.0-1.0)
						Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
						break;
					
					// VISIBILITY

					case "background": 
						$(this.htmlPlayerBkg).css("background-color",value);
						break;
					
					case "transparency": 
						var buffer = value.split("%");
						if (buffer.length > 1) {
								value = parseInt(buffer[0]) / 100;
						} else {
								value = parseFloat(buffer[0]);
						}
						this.opacity = 1 - value;
						$(this.htmlPlayer).css("opacity",this.opacity);
						break;

					case "visible": 
						this.isVisible = value==="true"?true:false;

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
					
					case "scroll": 
						// TODO: ver norma (p.44)
						Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
						break;

					case "explicitDur": 
						if (!p_action)
							this.player.setProperty(name,value);
						break;
					
					case "baseDeviceRegion":
					case "deviceClass":
					case "plan":
					//case "player": //Not possible to change player during presentation yet
					case "playerLife":		// keep/close
					case "reusePlayer": 	// true/false
						// TODO
						Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"property",[name]);
						break;					

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
					case "transOutVertRepeat":
						// TODO
						Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"property",[name]);
						break;
					

					// SETTINGS

					/*case "service.currentFocus":
					case "default.focusBorderColor":
					case "default.selBorderColor":
					case "default.focusBorderWidth":
					case "default.focusBorderTransparency": 
						if (this.checkType(["application"])) {
							this.presentation.systemSettings.setPropertyValue(name,value);
						}
					break;*/
				
			}


			if (!ignoreEvents) {
			
				//user defined 
				if (p_action == Player.propertyAction.OVERLOAD) {
					this.player.setProperty(name,value);
				}
			
				//onEndAttribution is triggered automatically 
				$(this.htmlPlayer).trigger("attribution.onEndAttribution",[name]);
			}
			
		}
	} else if (!ignoreEvents) {
			//override case
			this.player.setProperty(name,value);
	}
        
};
