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

// TODO: Tratar sincronizacao das imagens e dos textos
//

MediaPlayer.prototype = new Player();

function MediaPlayer (node, parentContext) {

	this.region = "";
	this.type = "";
	this.htmlPlayer = "";
	this.htmlPlayerBkg = ""; 
    this.player = undefined;
    this.playerName = undefined;
    this.playerSettings = undefined;
	this.area = [];
	this.transIn = [];
	this.transOut = [];
	this.isPlaying = false;
	this.isStopped = true;
	this.isVisible = true;
	this.isFocused = false;
	this.playingArea = undefined;
	this.explicitDur = undefined;
	this.opacity = 1;	
	this.node = node;
	this.presentation = parentContext.presentation;
	this.parentContext = parentContext;
    this.divId =  this.presentation.getDivId(node.id);
	this.create(node);


}

//Class specific constants

MediaPlayer.prototype.colorValues = {
	'white': "255,255,255",
	'black': "0,0,0",
	'silver': "192,192,192",
	'gray': "128,128,128",
	'red': "255,0,0",
	'maroon': "128,0,0",
	'fuchsia': "255,0,255",
	'purple': "128,0,128",
	'lime': "0,255,0",
	'green': "0,128,0",
	'yellow': "255,255,0",
	'olive': "128,128,0",
	'blue': "0,0,255",
	'navy': "0,0,128",
	'aqua': "0,255,255",
	'teal': "0,128,128"
};

MediaPlayer.prototype.mediaTypes = {
	'htm': "text/htm",	'html': "text/html",	'txt': "text/plain",	'css': "text/css",	'xml': "text/xml",	'bmp': "image",	'png': "image",
	'gif': "image",		'jpg': "image",			'jpeg': "image",			'wav': "audio",		'mp3': "audio",		'mp2': "audio",	'mp4': "video",
	'mpg4': "video",		'mpeg': "video",			'mpg': "video",			'webm': "video",	'ogg': "audio"	, 'ogv': "video", 'flv': "video/x-flv", 
	'lua': "application/x-ginga-NCLua",		'class': "application/x-ginga-NCLet",		'jar': "application/x-ginga-NCLet"		
};



// checkType
MediaPlayer.prototype.checkType = function (typeList) {
	var thisType = this.type.split("/");
	for (var i in typeList) {
		var type = typeList[i].split("/");
		if (type[0]==thisType[0]) {
			if (!type[1] || (thisType[1] && type[1]==thisType[1])) {
				return true;
			}
		}
	}
	return false;
};

// createElement
// (used by user defined players to create their own html)
MediaPlayer.prototype.createElement =  function(htmlText)
{
    $(this.htmlPlayerBkg).append(htmlText);
}

// create
MediaPlayer.prototype.create = function (node) {
	// Cria as transições
	if (node.descriptor) {
		this.transIn = node.descriptor.transIn;
		this.transOut = node.descriptor.transOut;
		
		//Seta o valor de expliticDur
		this.explicitDur = node.descriptor.explicitDur;
	}
	
	// Cria as áreas
	for (i in node.area) {
		if (!node.area[i]._ignore) {
			this.area[node.area[i].id] = node.area[i];
			this.area[node.area[i].id].started = false;
		}
	}
	// Verifica o tipo da mídia
	if (node.type) {
		this.type = node.type;
	} else {
		var buffer = node.src.split(".");
		this.type = this.mediaTypes[buffer[buffer.length-1]];
	}
	// Cria os IDs (região e mídia)
	this.htmlPlayer = "#" + this.divId;
	this.htmlPlayerBkg = "#" + this.presentation.getDivId(node.id,"bkg");
	if (this.checkType(["application"])) {
		this.region = "#" + this.presentation.settingsDiv;
	} else {
		this.region = "#" + this.presentation.playerDiv;
	}
	
//HACK_FOCUS (begin)
	if (this.type == 'application/x-ginga-settings') {
		this.presentation.settingsNode = this;
	}
//HACK_FOCUS (end)

	// ----- REFER -----	
	if (node.refer && (node.instance!="new")) {
		return;
	} else {
	// -----------------
		// Creates media background div
		$(this.region).append("<div class='playerBkg' id='" + this.presentation.getDivId(node.id,"bkg") + "'></div>");
		
                // Creates media player
                var mediaPlayers = this.presentation.mediaPlayers;
                if(mediaPlayers[this.type])
                    {
                        //creates the playerSettings data structure
                        this.playerSettings = 
                        {
                             source: 
                                {
                                    type: this.type,
                                    ext: node._ext,
                                    url: this.presentation.path + node.src
                                },


                                id : this.divId,
                                parentId: this.presentation.getDivId(node.id,"bkg"),

                                createElement: $.proxy(this.createElement,this),
                                checkType: $.proxy(this.checkType,this),
								getProperty: $.proxy(this.getProperty,this),
								setProperty: $.proxy(this.setProperty,this),
                                
                              media:{
                                areas: this.area  
                              }

                        }
                       
                        
                        var playerClass = mediaPlayers[this.type][node._ext] || mediaPlayers[this.type].defaultPlayer;
                        if(playerClass)
                            {
                                this.player = new playerClass(this.playerSettings);
                                this.playerName = playerClass.name;
                            }
                        else
                            {
                                Logger.error(Logger.ERR_MEDIAPLAYER_NOPLAYER,this.type,['no defaultPlayer or extension player']);
                                this.player = {};
                            }
                    }
                else
                    {
                        Logger.error(Logger.ERR_MEDIAPLAYER_NOPLAYER,this.type);
                        this.player = {};
                    }
                
		
		$(this.htmlPlayerBkg).css("display","none");
                
                //presetup (construtor)
		this.load(node.src);
                //possetup( needed ?? )
                
                //if player supports area
                if(this.player.exec)
                {
					
					//onEnd trigger
					this.player.exec('end',$.proxy(function() {
						if(!this.playingArea)
							this.stop();
						else
						{
							$(this.htmlPlayer).trigger('presentation.onEnd');
							this.playingArea = undefined;
						}
						//the stop action is going to be dealed by the area event listener
                },this));
					
                    for (i in this.area) {
					
						eval("this.player.exec(this.area[i].endTime,$.proxy(function() {"+
							"if (this.area['"+i+"'].started) {"+
								"this.area['"+i+"'].started = false;"+
								"$(this.htmlPlayer).trigger('stop',[this.area['"+i+"'].id]);"+
							"} else {"+
								"$(this.htmlPlayer).trigger('presentation.onEnd',[this.area['"+i+"'].id]); "+
							"}" +
						"},this));");

						eval("this.player.exec(this.area[i].beginTime,$.proxy(function() {"+
							"$(this.htmlPlayer).trigger('presentation.onBegin',[this.area['"+i+"'].id]);"+
						"},this));");
						
						// TODO: area definida por frames ao invés de tempo
						
					}
				} else {
						Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['exec']);
				}


	
	// ---- REFER ----
	}
	// ---------------

	// Cria as propriedades
	$(this.htmlPlayer).data("property",[]);
	if (node.descriptor) {
		if (node.descriptor.explicitDur)
			this.setProperty("explicitDur",node.descriptor.explicitDur);
		if (node.descriptor.region) {
			// Propriedades da tag <region> (atributos)
			this.setProperty("zIndex",node.descriptor.region.zIndex);
			this.setProperty("width",node.descriptor.region.width);
			this.setProperty("height",node.descriptor.region.height);
			this.setProperty("bottom",node.descriptor.region.bottom);
			this.setProperty("top",node.descriptor.region.top);
			this.setProperty("right",node.descriptor.region.right);
			this.setProperty("left",node.descriptor.region.left);
			this.setProperty("title",node.descriptor.region.title);
		}
		for (i in node.descriptor.descriptorParam) {
			// Propriedades da tag <descriptor> (descriptorParam)
			this.setProperty(node.descriptor.descriptorParam[i].name,node.descriptor.descriptorParam[i].value);
		}
	}
	
	
	/* --- Property tags (under <media>) treatment --- */

	var boundsProperties = [];
	for(i in node.property)
	{
		if(node.property[i].value){
			switch(node.property[i].name){ 
				case "bounds":
				case "top":
				case "left":
				case "bottom":
				case "right": 
				case "height":
				case "width": {
					//save in boundProperties for later use
					boundsProperties.push({
						name: node.property[i].name, 
						value: node.property[i].value
					});
					break;
				}
				default:
					//set other properties
					this.setProperty(node.property[i].name,node.property[i].value);
			}
		}
		
	}
	// if there is at least one bound property, there is a lot of work to do
	if(boundsProperties.length > 0) {
		
		// Preparing to recalculate positions and size due to the presence of property tags of these type.
		
		// Create structures to pass as arguments to the fixRegionBounds function
		var parentBounds = {
			left: 0,
			top: 0,
			width: parseInt($("#"+this.presentation.playerDiv).css("width").split("px")[0]),
			height: parseInt($("#"+this.presentation.playerDiv).css("height").split("px")[0])
		};
		var regionBounds = {
			left: null,
			right: null,
			top: null,
			bottom: null,
			width: null,
			height: null
		};
		
		// Set initial values as found on region and region._parent
		if(this.node.descriptor && this.node.descriptor.region) {
				parentBounds.left = (this.node.descriptor.region._parent.left) ? parseInt(this.node.descriptor.region._parent.left.split("px")[0]) : 0;
				parentBounds.top = (this.node.descriptor.region._parent.top) ? parseInt(this.node.descriptor.region._parent.top.split("px")[0]) : 0;				
				parentBounds.width = (this.node.descriptor.region._parent.width) ? parseInt(this.node.descriptor.region._parent.width.split("px")[0]) : parseInt($("#"+this.presentation.playerDiv).css("width").split("px")[0]);
				parentBounds.height = (this.node.descriptor.region._parent.height) ? parseInt(this.node.descriptor.region._parent.height.split("px")[0]) : parseInt($("#"+this.presentation.playerDiv).css("height").split("px")[0]);		
				
				// In this case, the region is already fixed, so we should get the relative value for left and top as initial values, so we can fix the bounds again
				regionBounds.left = (this.node.descriptor.region.left.split("px")[0] - parentBounds.left).toString();
				regionBounds.top = (this.node.descriptor.region.top.split("px")[0] - parentBounds.top).toString();
				regionBounds.width = this.node.descriptor.region.width,
				regionBounds.height = this.node.descriptor.region.height
				
		}
		// Overwrite the regionBounds structure with values found in the property tags
		for (i in boundsProperties) {
			var name = boundsProperties[i].name;
			var value = boundsProperties[i].value;
			switch(name){ 
				case "bounds": {
					var bounds = value.split(",");
					regionBounds.left = bounds[0];
					regionBounds.top = bounds[1];
					regionBounds.width = bounds[2];
					regionBounds.height = bounds[3];
					break;
				}
				case "top":
				case "left":
				case "bottom":
				case "right": 
				case "height":
				case "width": {
					regionBounds[name] = value;
					break;
				}
			}
		}
		// Call the same function that is called in the begining for checking region attributes
		WebNclPlayer.prototype.fixRegionBounds(regionBounds,parentBounds);
		
		// Finally, call the setProperty function for each property
		for(name in regionBounds)
		{
			value=regionBounds[name];
			if(value && value!=null){
				this.setProperty(name, value);
			}
		}
	
	}
	/* ----------------------------------------------- */
	
	/* REMOVER
	// explicitDur treatment
	if(this.explicitDur)
	{
                //explicitDur will not work unless player implements exec
				//TODO: All areas that don't define an end should
				//have the same end defined by explicitDur. This seens
				//to be ignored here
		if(this.player.exec)
                    this.player.exec(this.explicitDur,$.proxy(function() {
                         this.stop();
                    },this));
	}
	*/
	
	// Bind events
	this.bindEvents();
	// Saves the media player using jQuery data function
	$(this.htmlPlayer).data("player",this);
};

// load
MediaPlayer.prototype.load = function (source) {


        //Recalculates the url based on presentation path
		source = this.presentation.path + source;
        //TODO: Needs to deal with other types (create a new media player )

        //Calls specific player unload function
        if(this.player.unload)
            this.player.unload(source);
        else
            Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['load',source]);


        //Calls specific player load function
        if(this.player.load)
            this.player.load(source);
        else
            Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['load',source]);
};



// focus
MediaPlayer.prototype.focus = function () {
	if (!this.isFocused) {
		this.isFocused = true;
		if (this.node.descriptor) {
			var borderWidth = parseInt(this.node.descriptor.focusBorderWidth || this.presentation.systemSettings.getPropertyValue("default.focusBorderWidth"));
			if (borderWidth > 0) {
				var color = this.node.descriptor.focusBorderColor || this.presentation.systemSettings.getPropertyValue("default.focusBorderColor");
				var alpha = 1 - parseInt(this.node.descriptor.focusBorderTransparency || 0);
				var border = borderWidth + "px solid rgba(" + this.colorValues[color] + "," + alpha + ")";
				$(this.htmlPlayerBkg).css("left","-="+borderWidth);
				$(this.htmlPlayerBkg).css("top","-="+borderWidth);
				$(this.htmlPlayerBkg).css("border",border);
			} else if (borderWidth < 0) {
				// TODO
				Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"border",[borderWidth]);
			}
			if (this.node.descriptor.focusSrc) {
				this.load(this.node.descriptor.focusSrc);
			}
		}
	}
};

// blur
MediaPlayer.prototype.blur = function () {
	this.isFocused = false;
	$(this.htmlPlayerBkg).css("left",$(this.htmlPlayer).data("property").left);
	$(this.htmlPlayerBkg).css("top",$(this.htmlPlayer).data("property").top);
	$(this.htmlPlayerBkg).css("width",$(this.htmlPlayer).data("property").width);
	$(this.htmlPlayerBkg).css("height",$(this.htmlPlayer).data("property").height);
	$(this.htmlPlayerBkg).css("border","none");
	if (this.node.descriptor.focusSrc) {
		this.load(this.node.src);
	}
};

// selection
MediaPlayer.prototype.selection = function () {
	if (this.node.descriptor) {
		var callback;
		var color = this.node.descriptor.selBorderColor || this.presentation.systemSettings.getPropertyValue("default.selBorderColor");
		$(this.htmlPlayer).css("border-color",color);
		callback = "var p=$('"+this.htmlPlayer+"').data('player'); if (p.isFocused) p.focus(); else p.blur();"
		if (this.node.descriptor.focusSelSrc) {
			this.load(this.node.descriptor.focusSelSrc);
			if (!this.node.descriptor.focusSrc) {
				callback += "$('"+this.htmlPlayer+"').data('player').load('"+this.node.src+"');";
			}
		}
		setTimeout(callback,200);
	}
};

// applyTransition
MediaPlayer.prototype.applyTransition = function (transition, flagInOut) {
	var duration = transition.dur ? parseFloat(transition.dur.split("s")[0])*1000 : 1000;
	var cssBegin={}, cssEnd={}, target="";
	switch (transition.type) {
		case "fade": {
			// fade
			transition.subtype = transition.subtype || "crossfade";
			target = this.htmlPlayer;
			cssBegin.opacity = transition.startProgress || 0;
			cssEnd.opacity = transition.endProgress || 1;
			if (transition.subtype=="fadeToColor" || transition.subtype=="fadeFromColor") {
				$(this.htmlPlayerBkg).css("background-color",transition.fadeColor||"black");
				if (transition.subtype=="fadeToColor") {
					flagInOut = "out";
				} else {
					flagInOut = "in";
				}
			}
			if (flagInOut=="out") {
				var aux = cssBegin.opacity;
				cssBegin.opacity = cssEnd.opacity;
				cssEnd.opacity = aux;
			}
			this.opacity = cssEnd.opacity;
			break;
		}
		case "barWipe": {
			// barWipe
			transition.subtype = transition.subtype || "leftToRight";
			target = this.htmlPlayerBkg;
			var reverse = (transition.direction=="reverse"?1:0) + (flagInOut=="out"?1:0) == 1;
			switch (transition.subtype) {
				case "leftToRight": {
					cssBegin.width = "0px";
					cssEnd.width = $(this.htmlPlayer).css("width");
					if (reverse) {
						cssBegin.left = (parseInt($(this.htmlPlayer).css("left").split("px")[0]) + parseInt($(this.htmlPlayer).css("width").split("px")[0])) + "px";
						cssEnd.left = $(this.htmlPlayer).css("left");
					}
					break;
				}
				case "topToBottom": {
					cssBegin.height = "0px";
					cssEnd.height = $(this.htmlPlayer).css("height");
					if (reverse) {
						cssBegin.top = (parseInt($(this.htmlPlayer).css("top").split("px")[0]) + parseInt($(this.htmlPlayer).css("height").split("px")[0])) + "px";
						cssEnd.top = $(this.htmlPlayer).css("top");
					}
					break;
				}
			}
			if (flagInOut=="out") {
				var aux;
				for (i in cssBegin) {
					aux = cssBegin[i];
					cssBegin[i] = cssEnd[i];
					cssEnd[i] = aux;
				}
			}
			break;
		}
		case "irisWipe": {
			// irisWipe
			transition.subtype = transition.subtype || "rectangle";
			target = this.htmlPlayerBkg;
			if (transition.subtype == "rectangle") {
				var left = parseInt($(this.htmlPlayer).css("left").split("px")[0]);
				var top = parseInt($(this.htmlPlayer).css("top").split("px")[0]);
				var width = parseInt($(this.htmlPlayer).css("width").split("px")[0]);
				var height = parseInt($(this.htmlPlayer).css("height").split("px")[0]);
				cssBegin.width = "0px";
				cssBegin.height = "0px";
				cssBegin.left = (left+(width/2)) + "px";
				cssBegin.top = (top+(height/2)) + "px";
				cssEnd.width = width + "px";
				cssEnd.height = height + "px";
				cssEnd.left = left + "px";
				cssEnd.top = top + "px";
				if (flagInOut=="out") {
					var aux;
					for (i in cssBegin) {
						aux = cssBegin[i];
						cssBegin[i] = cssEnd[i];
						cssEnd[i] = aux;
					}
				}
			} else {
				// diamond
				// TODO
				Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"transition",[transition.type,transition.subtype]);
			}
			break;
		}
		case "snakeWipe":
		case "clockWipe": {
			// snakeWipe, clockWipe
			// TODO
			Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"transition",[transition.type]);
			break;
		}
	}
	$(target).css(cssBegin);
	$(target).animate(cssEnd,duration);
	$(target).dequeue();
}

// show
MediaPlayer.prototype.show = function () {
	if (this.isVisible) {
		// TODO: múltiplas transições (transIn e transOut podem receber vários IDs separados por ponto e vírgula)
		// (retirar a gambiarra abaixo, que foi feita para transformar uma transição em um vetor com uma transição)
		if (this.transIn && this.transIn._type) this.transIn = [this.transIn];
		if (this.transOut && this.transOut._type) this.transOut = [this.transOut];
		// ---
		for (i in this.transIn) {
			this.applyTransition(this.transIn[i],"in");
		}
		$(this.htmlPlayerBkg).css("display","inline");
		$(this.htmlPlayer).css("opacity",this.opacity);
	}
};

// hide
MediaPlayer.prototype.hide = function () {
	for (i in this.transOut) {
		this.applyTransition(this.transOut[i],"out");
	}
	$(this.htmlPlayerBkg).css("display","none");
};

// start
MediaPlayer.prototype.start = function (nodeInterface) {
// (danilo): Sugiro que quando o start for dado,
// caso o player esteja tocando ele seja parado
// e iniciado do lugar onde foi pedido (A maquina virtual
// comporta-se assim no caso de ancoras), nao sei se eh o funcionamento oficial
	if (this.isStopped) {
        this.presentation.inputManager.enableKeys(this.htmlPlayer);
		if(this.node.descriptor){
			this.presentation.inputManager.addMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
		}
		this.isPlaying = true;
		this.isStopped = false;
		this.show();


		if (nodeInterface) {
			if (this.area[nodeInterface]._type=="area") {
				this.area[this.area[nodeInterface].id].started = true;
				this.playingArea = nodeInterface;
				var t =  this.area[this.area[nodeInterface].id].beginTime;
				if(t != 'begin')
					this.seekAndPlay(this.area[this.area[nodeInterface].id].beginTime);
				else
					{
						if(this.player.start)
							this.player.start();
						else
							Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['start',nodeInterface]);
					}
				
				

			} else {
				// TODO (frames)
			}
		} else {
			
			this.playingArea = undefined;
			if(this.player.start)
				this.player.start();
			else
				Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['start',nodeInterface]);

			
		}
			
		$(this.htmlPlayer).trigger("presentation.onBegin",[nodeInterface]);
	}
};

// stop
MediaPlayer.prototype.stop = function (nodeInterface) {
	if (!this.isStopped) {

                this.presentation.inputManager.disableKeys(this.htmlPlayer);
		if(this.node.descriptor){
			this.presentation.inputManager.removeMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
		}

		this.isPlaying = false;
		this.isStopped = true;
		this.hide();
                
                if(this.player.stop)
                    this.player.stop();
                else
                    Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['stop',nodeInterface]);
                
		$(this.htmlPlayer).trigger("presentation.onEnd",[nodeInterface]);
	}
};

// pause
MediaPlayer.prototype.pause = function (nodeInterface) {
	if (this.isPlaying) {
		this.isPlaying = false;
		this.isStopped = false;
		
                if(this.player.pause)
                    this.player.pause()
                else
                    Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['pause',nodeInterface]);
                
		$(this.htmlPlayer).trigger("presentation.onPause",[nodeInterface]);
	}
};

// resume
MediaPlayer.prototype.resume = function (nodeInterface) {
	if (!this.isStopped && !this.isPlaying) {
		this.isPlaying = true;
		this.isStopped = false;
		
                if(this.player.resume)
                    this.player.resume();
                else
                    Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['resume',nodeInterface]);
                
		$(this.htmlPlayer).trigger("presentation.onResume",[nodeInterface]);
	}
};

// abort
MediaPlayer.prototype.abort = function (nodeInterface) {
	if (!this.isStopped) {
		if(this.node.descriptor){
			this.presentation.inputManager.removeMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
		}
		this.isPlaying = false;
		this.isStopped = true;
		this.hide();
		
                if(this.player.abort)
                    this.player.abort();
                else
                    Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['abort',nodeInterface]);
                        
                
		$(this.htmlPlayer).trigger("presentation.onAbort",[nodeInterface]);
	}
};

MediaPlayer.prototype.seek = function (newTime) {
        if(this.player.seek)
            this.player.seek(newTime);
        else
            Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['seek',newTime]);
                
};

// seekAndPlay
MediaPlayer.prototype.seekAndPlay = function (newTime) {
//	if (this.isStopped) {
                if(this.player.seekAndPlay)
                	this.player.seekAndPlay(newTime);
                else
                        Logger.error(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,['seekAndPlay',newTime]);
                
//	}
};
