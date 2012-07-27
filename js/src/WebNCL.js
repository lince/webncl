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

function WebNclPlayer (file, div) {

	var patt=/[\/]*.+\//g;
	this.div = div;
       
	this.presentation = {
				
		 readyToPlay : false,
		 playRequested : false,
                                
        //Time limit used by events, can be changed by the user
		TIME_LIMIT: 1000,
		
//HACK_FOCUS (begin)
		settingsNode : undefined,
//HACK_FOCUS (end)
                
		playerId: ++WebNclPlayer.playerCount,
		playerDiv: div,
		getDivId: function (nodeId, type) {
			// ----- REFER -----
			var mediaId = this.parser.referenceMap.instReuse[nodeId] || nodeId;
			return "ncl" + this.playerId + (type||"") + "_" + mediaId;
			// -----------------
			// return "ncl" + this.playerId + (type||"") + "_" + nodeId;
		},
		path: (file && patt.exec(file)[0]) || '',
                
                //Default media players
                //TODO: Future webncl versions should
                //inspect browser features and choose the
                //best players for the browser
                //MediaPlayers can be changed by the user
                mediaPlayers: {
                "text/htm" : 
                    {
                            defaultPlayer: Html5Player
                    },
                "image" :
                    {
                            defaultPlayer: Html5Player
                    },
                "audio": 
                    {
                            defaultPlayer: Html5Player
                    },
                "video" : 
                    {
                            defaultPlayer: Html5Player
                            //Its possible to choose players for specific file formats
                    },
                "video/x-flv": {defaultPlayer: FlowPlayer},
                "text/css" : undefined,                 //No player - Issue Debbuger.Warning
                "text/html" : 
                    {
                            defaultPlayer: Html5Player
                    },
                "text/plain": 
                    {
                            defaultPlayer: Html5Player
                    },
                "application/x-ginga-NCLua" : { defaultPlayer: LuaPlayer},
                "application/x-ginga-NCLet" : undefined,
                "application/x-ginga-settings" : {
                            defaultPlayer: Html5Player
                    },
                "text/xml" : undefined

                },
                
                keyEvents : {}
                
                

	};
	
	var a = this.presentation.playerId;
	this.presentation.bodyDiv = "wncl_body" + a;
	this.presentation.settingsDiv = "wncl_settings" + a;
	this.presentation.contextsDiv = "wncl_contexts" + a;
	this.presentation.loadingDiv = "wncl_loading" + a;
	this.presentation.playDiv = 'wncl_play'+a;
	this.presentation.endDiv = 'wncl_end'+a;
        
	/*
	 * Keys mapping declaration
	 * They can be redefined by the user
	 **/
	
	this.presentation.keys = {
		CURSOR_UP           :	38, 	/* arrow up */
		CURSOR_DOWN         : 	40,		/* arrow down */
		CURSOR_LEFT         :	37,		/* arrow left */
		CURSOR_RIGHT        :	39,		/* arrow right */
		ENTER               :	13,		/* enter */
		RED                 :   81,  	/* q */
		GREEN               :   87,		/* w */
		YELLOW              :   69,		/* e */
		BLUE                :   82,		/* r */
		KEY_0               :   96,		/* 0 */
		KEY_1               :   97,		/* 1 */
		KEY_2               :   98,		/* 2 */
		KEY_3               :   99,		/* 3 */
		KEY_4               :   100,	/* 4 */
		KEY_5               :   101,	/* 5 */
		KEY_6               :   102,	/* 6 */
		KEY_7               :   103,	/* 7 */
		KEY_8               :   104,	/* 8 */
		KEY_9               :   105,	/* 9 */

		BACK                :	90,		/* z */
		EXIT                :	88,		/* x */
		PLAY                :	67,		/* c */
		STOP                :	86,		/* v */
		PAUSE               :	66,		/* b */
		RECORD              :	78,		/* n */

		POWER               :	65,		/* a */
		REWIND              :	83,		/* s */
		EJECT               :	68,		/* d */
		MENU				:   77
	};
	
	//Despite the key codes defined above, an array should be defined
	//with the codes that are going to be processed by the event handler
	//User can redefine this array to avoid player from processing some key events
	this.presentation.keys.allCodes = [13,37,38,39,40,81,87,69,82,96,97,98,99,100,101,102,103,104,105,90,88,67,86,66,78,65,83,68];


    //postEvent
    this.presentation.postEvent = $.proxy(this.postEvent,this); 


	/*
        Comentar efeito do ajax!
    */
	
	if (file) {
	
		$.ajax({
			type: "GET",
			url: file,
			dataType: "xml",
			success: $.proxy(function (data) {
				// TODO: checar a sintaxe do arquivo XML
				//Logger.checkFile(file); ???
				this.execute(data);
			},this)
			// TODO: checar se o arquivo XML foi aberto com sucesso
		});
	
	} else {
	    
		file = document.URL.split('/');
		file = file[file.length-1];
		
		$.ajax({
			type: "GET",
			url: file,
			dataType: "text",
			success: $.proxy(function (data) {
				// TODO: checar a sintaxe do arquivo XML
				this.execute($($.parseXML(data)).find("#"+this.div)[0]);
			},this)
			// TODO: checar se o arquivo XML foi aberto com sucesso
		});
		
	}
	
};

// execute
WebNclPlayer.prototype.execute = function (data) {
	// cria o objeto NCL
	var t = new Date();
    var rb,i;
	this.presentation.parser = new Parser();
	this.presentation.ncl = this.presentation.parser.parse(data);
	console.log('Player "'+this.div+'" loaded in ' + (new Date() - t) + 'ms');
	this.presentation.inputManager = new InputManager(this.presentation);
	this.presentation.systemSettings = new SystemSettings(this.presentation);
	
	var $playerDiv = $("#"+this.presentation.playerDiv);
	// cálculo da posição real de cada região
	for (rb in this.presentation.ncl.head.regionBase) {
		for (i in this.presentation.ncl.head.regionBase[rb].region) {
			var bounds = {
				left: 0,
				top: 0,
				width: parseInt($playerDiv.css("width").split("px")[0]),
				height: parseInt($playerDiv.css("height").split("px")[0])
			};
			this.fixRegionBounds(this.presentation.ncl.head.regionBase[rb].region[i],bounds);
		}
	}
        
        // torna a div selecionavel
        $playerDiv.attr('tabindex',this.presentation.playerId);

        // cria as divs de interface 
        $playerDiv.append("<div id='" + this.presentation.loadingDiv + "' class='wncl_BlackDiv' style='display:none;'><image src='images/loader1.gif' width='32' height='32' style='position:relative; left: 50%; top: 50%; margin-top: -16px; margin-left:-16px'/></div>");
        $playerDiv.append("<div id='" + this.presentation.playDiv + "' class='wncl_BlackDiv wncl_clickMe' ><image src='images/play.png' width='48' height='48' style='position:relative; left: 50%; top: 50%; margin-top: -24px; margin-left:-24px'/></div>");
        $playerDiv.append("<div id='" + this.presentation.endDiv + "' class='wncl_BlackDiv wncl_clickMe' style='display:none;'><image src='images/replay.png' width='48' height='48' style='position:relative; left: 50%; top: 50%; margin-top: -24px; margin-left:-24px'/></div>");
       
        
	// cria as divs iniciais
	$playerDiv.append("<div id='" + this.presentation.settingsDiv + "'></div>");
	$playerDiv.append("<div id='" + this.presentation.contextsDiv + "'></div>");
        
	// cria o primeiro contexto (body)
	this.presentation.context = new ContextPlayer(this.presentation.ncl.body,this.presentation);

	// TODO: tratar evento de onEnd do contexto
	
	//$(this.presentation.context.htmlPlayer).on('presentation.onEnd presentation.onAbort',$.proxy(function(){
	//    this.presentation.stop();
	//},this));

	// eventos para cada div de interface
	
	//start div
	$('#'+this.presentation.playDiv).on("click",$.proxy(function(){
		if (this.presentation.context.isStopped) {
			this.start();
		} else if (!this.presentation.context.isPlaying) {
			this.resume();
		}
	},this));
	
	//end div
	$('#'+this.presentation.endDiv).on("click",$.proxy(function(){
		this.start();
	},this));
	
	
	// inicia a apresentação
	this.presentation.readyToPlay = true;
	
	if (this.presentation.playRequested)
    {
		this.start();
    }
};

// fixRegionBounds
WebNclPlayer.prototype.fixRegionBounds = function (node, parentBounds) {

	var relativeBounds = {
		left: node.left || null,
		right: node.right || null,
		top: node.top || null,
		bottom: node.bottom || null,
		width: node.width || null,
		height: node.height || null
	};

	var absoluteBounds = {
		left: 0,
		top: 0,
		width: 0,
		height: 0
	};

	// Converte px em valor númerico
	for (i in relativeBounds) {
		if (relativeBounds[i] != null) {
			if (relativeBounds[i].split("%").length == 1)
            {
				relativeBounds[i] = parseInt(relativeBounds[i].split("px")[0]);
            }
		}
	}
	
	// Converte % em valor numérico
	var attrs, buffer;
	// left, right, width
	attrs = ["left","right","width"];
	for (i in attrs) {
		if (relativeBounds[attrs[i]]!=null && isNaN(relativeBounds[attrs[i]])) {
			buffer = relativeBounds[attrs[i]].split("%");
			if (buffer.length > 0) {
				relativeBounds[attrs[i]] = parseInt(parentBounds.width*parseFloat(buffer[0])/100);
			}
		}
	}
	// top, bottom, height
	attrs = ["top","bottom","height"];
	for (i in attrs) {
		if (relativeBounds[attrs[i]]!=null && isNaN(relativeBounds[attrs[i]])) {
			buffer = relativeBounds[attrs[i]].split("%");
			if (buffer.length > 1) {
				relativeBounds[attrs[i]] = parseInt(parentBounds.height*parseInt(buffer[0])/100);
			}
		}
	}
	
	// Calcula left e width de acordo com os atributos left/right/width
	if (relativeBounds.left != null) {
		if (relativeBounds.right != null) {
			if (relativeBounds.width != null) {
				// left, right, width -> nothing
			} else {
				// left, right -> width calculado
				relativeBounds.width = parentBounds.width - relativeBounds.left - relativeBounds.right;
			}
		} else if (relativeBounds.width != null) {
			// left, width -> nothing
		} else {
			// left -> width herdado
			relativeBounds.width = parentBounds.width;
		}
	} else if (relativeBounds.width != null) {
		if (relativeBounds.right != null) {
			// right, width -> left calculado
			relativeBounds.left = parentBounds.width - relativeBounds.right - relativeBounds.width;
		} else {
			// width -> left zero
			relativeBounds.left = 0;
		}
	} else if (relativeBounds.right != null) {
		// right -> left 0, width calculado
		relativeBounds.left = 0;
		relativeBounds.width = parentBounds.width - relativeBounds.right;
	} else {
		// nada -> left 0, width herdado
		relativeBounds.left = 0;
		relativeBounds.width = parentBounds.width;
	}
	
	// Calcula top e bottom de acordo com os atributos top/bottom/height
	if (relativeBounds.top != null) {
		if (relativeBounds.bottom != null) {
			if (relativeBounds.height != null) {
				// top, bottom, height -> nothing
			} else {
				// top, bottom -> height calculado
				relativeBounds.height = parentBounds.height - relativeBounds.top - relativeBounds.bottom;
			}
		} else if (relativeBounds.height != null) {
			// top, height -> nothing
		} else {
			// top -> height herdado
			relativeBounds.height = parentBounds.height;
		}
	} else if (relativeBounds.height != null) {
		if (relativeBounds.bottom != null) {
			// bottom, height -> top calculado
			relativeBounds.top = parentBounds.height - relativeBounds.bottom - relativeBounds.height;
		} else {
			// height -> top zero
			relativeBounds.top = 0;
		}
	} else if (relativeBounds.bottom != null) {
		// bottom -> top 0, height calculado
		relativeBounds.top = 0;
		relativeBounds.height = parentBounds.height - relativeBounds.bottom;
	} else {
		// nada -> top 0, height herdado
		relativeBounds.top = 0;
		relativeBounds.height = parentBounds.height;
	}
	
	// Calcula os valores absolutos
	absoluteBounds.left = parentBounds.left + relativeBounds.left;
	absoluteBounds.top = parentBounds.top + relativeBounds.top;
	absoluteBounds.width = relativeBounds.width;
	absoluteBounds.height = relativeBounds.height;
	
	// Salva os valores calculados na própria região
	node.left = absoluteBounds.left + "px";
	node.top = absoluteBounds.top + "px";
	node.width = absoluteBounds.width + "px";
	node.height = absoluteBounds.height + "px";
	node.right = null;
	node.bottom = null;
	
	// Calcula as posições absolutas das regiões filhas
	for (i in node.region) {
		this.fixRegionBounds(node.region[i],absoluteBounds);
	}
	
};

/****** PLAYER CONTROL API *****/

// destroy
WebNclPlayer.prototype.destroy = function() {
	document.getElementById(this.div).outerHTML = '';
}

// start
WebNclPlayer.prototype.start = function() {
	if (this.presentation.readyToPlay) {
		this.presentation.context.start();
		$('#'+this.presentation.playDiv).hide();
		$('#'+this.presentation.endDiv).hide();	
	} else {
		this.presentation.playRequested = true;
	}
}

// pause
WebNclPlayer.prototype.pause = function() {
	this.presentation.context.pause();
	$('#'+this.presentation.playDiv).show();
}

// resume
WebNclPlayer.prototype.resume = function() {
	this.presentation.context.resume();
	$('#'+this.presentation.playDiv).hide();
	$('#'+this.presentation.endDiv).hide();
}
        
// abort
WebNclPlayer.prototype.abort = function() {
	this.presentation.context.abort();
	$('#'+this.presentation.endDiv).show();
}

// stop
WebNclPlayer.prototype.stop = function() {
	this.presentation.context.stop();
	this.presentation.playRequested = false;
	$('#'+this.presentation.endDiv).show();
}

// triggerEvent
WebNclPlayer.prototype.triggerEvent = function (event,nodeId,nodeInterface) {
	$("#"+this.presentation.getDivId(nodeId)).trigger(event,[nodeInterface]);
};

// setProperty
WebNclPlayer.prototype.setProperty = function (nodeId,name,value) {
	$("#"+this.presentation.getDivId(nodeId)).trigger('set',[name,null,null,value]);
};

// keyPress
WebNclPlayer.prototype.keyPress = function (key) {
    if(this.presentation.keys[key])
	    this.presentation.inputManager.keyEvent(this.presentation.keys[key]);
    else
        this.presentation.inputManager.keyEvent(key);
};

// postEvent
WebNclPlayer.prototype.postEvent = function (event) {
	if (!event['class'] || event['class'] == 'ncl') {
		if (!event.type || event.type == 'presentation') {
			// presentation event
			if (event.component) {
				this.triggerEvent(event.action,event.component,event.area);
			} else {
				switch (event.action) {
					case 'start': this.start(); break;
					case 'pause': this.pause(); break;
					case 'resume': this.resume(); break;
					case 'abort': this.abort(); break;
					case 'stop': this.stop(); break;
					case 'destroy': this.destroy(); break;
				}
			}
		} else if (event.type == 'attribution') {
			// attribution event
			this.setProperty(event.component,event.property,event.value);
		}
	} else if (event['class'] == 'key') {
		if (!event.type || event.type == 'press') {
			// key press
			this.keyPress(event.key);
		}
		/*
		else if (event.type == 'release')
		{
			// key release
			// nothing?
		}
		*/
	}
};

/******************************/

WebNclPlayer.prototype.triggerEvent = function (event,nodeId,nodeInterface) {
	$("#"+this.presentation.getDivId(nodeId)).trigger(event,[nodeInterface]);
};

WebNclPlayer.playerCount = 0;

$(document).ready(function() {

	var style = '';

	$("nclplayer").each(function() {
	
		// todo: demais atributos
		var src = $(this).attr("src");
		var id = $(this).attr("id");
		var autoplay = $(this).attr("autoplay");
		
		this.outerHTML = '<div id="'+id+'" class="nclPlayer_'+id+'"> </div>';
		
		style +=
			 '.nclPlayer_' + id + ' {'
			+'	position: relative;'
			+'	left: ' + ($(this).attr('left') || '0px') + ';'
			+'	top: ' + ($(this).attr('top') || '0px') + ';'
			+'	width: ' + ($(this).attr('width') || '854px') + ';'
			+'	height: ' + ($(this).attr('height') || '480px') + ';'
			+'}';

		webNclPlayers.push(new WebNclPlayer(src,id));
                
		if (autoplay) {
			webNclPlayers[webNclPlayers.length-1].start();   
		}
			
	});
	
	// TODO:
	// CSS3 property "object-position" is currently supported by Opera only.
	// Uncomment the 3 lines below to make it work for IE, Firefox, Chrome
	// and Safari when they release a version that supports it.
	// Note: check if the property names (their prefixes) are correct on these browsers!
	
	style +=
		 '.context, #contexts, #settings {'
		+'	display: none;'
		+'}'
		+'.player {'
		+'	position: absolute;'
		+'	left: 0px;'
		+'	top: 0px;'
		+'	overflow: hidden;'
		+'	display: inline;'
		+'	-o-object-position: 0 0;'		// Opera
		//+'	-moz-object-position: 0 0;'		// Firefox
		//+'	-webkit-object-position: 0 0;'	// Chrome/Safari
		//+'	object-position: 0 0;'			// IE
		+'}'
		+'.playerBkg {'
		+'	position: absolute;'
		+'	overflow: hidden;'
		+'	display: none;'
		+'}'
		+'.wncl_BlackDiv {'
		+'    position:absolute;'
		+'    width:100%;'
		+'    height:100%;'
		+'    z-index: 999;'
		+'    background-color:rgba(0,0,0,0.8);'
		+'}'
		+'.wncl_clickMe {'
		+'    cursor:pointer;'
		+'}'
		;
		
	$('<style>').text(style).appendTo('head');

});

webNclPlayers = [];
