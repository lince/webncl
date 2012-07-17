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
	this.popcornPlayer = {};
	this.area = [];
	this.transIn = [];
	this.transOut = [];
	this.isPlaying = false;
	this.isStopped = true;
	this.isVisible = true;
	this.isFocused = false;
	this.explicitDur = undefined;
	this.opacity = 1;	
	this.node = node;
	this.presentation = parentContext.presentation;
	this.parentContext = parentContext;
	
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
	'mpg4': "video",		'mpeg': "video",			'mpg': "video",			'webm': "video",	'ogg': "audio"	, 'ogv': "video",
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

// create
MediaPlayer.prototype.create = function (node) {
	// Cria as transições
	if (node.descriptor) {
		this.transIn = node.descriptor.transIn;
		this.transOut = node.descriptor.transOut;
		
		//Seta o valor de expliticDur
		if (node.descriptor.explicitDur) {
			vector = node.descriptor.explicitDur.split("s");
			this.explicitDur = vector[0];
		}
	}
	
	// Cria as áreas
	for (i in node.area) {
		this.area[node.area[i].id] = node.area[i];
		if (node.area[i].begin) {
			this.area[node.area[i].id].beginTime = parseInt(node.area[i].begin.split('s')[0]);
		}
		if (node.area[i].end) {
			this.area[node.area[i].id].endTime = parseInt(node.area[i].end.split('s')[0]);
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
	this.htmlPlayer = "#" + this.presentation.getDivId(node.id);
	this.htmlPlayerBkg = "#" + this.presentation.getDivId(node.id,"bkg");
	if (this.checkType(["application"])) {
		this.region = "#" + this.presentation.settingsDiv;
	} else {
		this.region = "#" + this.presentation.playerDiv;
	}
	
	
	
	// ----- REFER -----	
	if (node.refer && (node.instance!="new")) {
		return;
	} else {
	// -----------------
		// Cria o fundo da mídia
		$(this.region).append("<div class='playerBkg' id='" + this.presentation.getDivId(node.id,"bkg") + "'></div>");
		// Cria a mídia
		switch (this.type.split("/")[0]) {
			case "video": {
				// type = video/*
				$(this.htmlPlayerBkg).append("<video class='player' poster='images/loading.gif' id='" + this.presentation.getDivId(node.id) + "'></video>");	
				break;
			}
			case "audio": {
				// type = audio/*
				$(this.htmlPlayerBkg).append("<audio class='player' id='" + this.presentation.getDivId(node.id) + "'></audio>");
				break;
			}
			case "image": {
				// type = image/*
				$(this.htmlPlayerBkg).append("<img class='player' id='" + this.presentation.getDivId(node.id) + "'></img>");
				break;
			}
			case "application": {
				switch (this.type) {
					case "application/x-ginga-settings": {
						// type = application/x-ginga-settings
						$(this.htmlPlayerBkg).append("<div class='player' id='" + this.presentation.getDivId(node.id) + "'></div>");
						break;
					}
					case "application/x-ginga-NCLua": {
						// type = application/x-ginga-NCLua
						Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"media",[this.type]);
						break;
					}
					case "application/x-ginga-NCLet": {
						// type = application/x-ginga-NCLet
						Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"media",[this.type]);
						break;
					}
					case "application/x-ginga-time": {
						// type = application/x-ginga-time
						Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"media",[this.type]);
						break;
					}
				}
				break;
			}
			case "text": {
				switch (this.type) {
					case "text/plain":
					case "text/html": {
						// type = text/plain, text/html
						$(this.htmlPlayerBkg).append("<div class='player' id='" + this.presentation.getDivId(node.id) + "'></div>");
						break;
					}
					case "text/css": {
						// type = text/css
						Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"media",[this.type]);
						break;
					}
					case "text/xml": {
						// type = text/xml
						Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"media",[this.type]);
						break;
					}
				}
				break;
			}
		}
		$(this.htmlPlayerBkg).css("display","none");
		this.load(node.src);

		//Tenta criar o popCorn player de acordo com o tipo d emedia
		if (this.checkType(["video","audio"]))
		{
			do {	
					//this.popcornPlayer = new Popcorn(this.htmlPlayer, { frameAnimation: true });
					this.popcornPlayer = new Popcorn(this.htmlPlayer);	
			} while (!this.popcornPlayer);
		} else if(this.checkType(["image","text"])){
			do {	
					Popcorn.player("baseplayer");
					this.popcornPlayer = new Popcorn.baseplayer(this.htmlPlayer);
					
			} while (!this.popcornPlayer);
		} 
		//Caso um popcornPlayer tenta sido criado (media do tipo video, audio,image ou text)
		// 'equivale' a trocar this.popcornPlayer por this.checkType(["video","audio","image","text"])
		// sendo o usado o mais eficiente
		if(this.checkType(["video","audio","image","text"]))
		{
			$(this.htmlPlayer).on("ended",$.proxy(function() {
				this.stop();
			},this));
			for (i in this.area) {
				if (this.area[i].end) {
					eval("this.popcornPlayer.exec(this.area[i].endTime,$.proxy(function() {"+
						"if (this.area['"+i+"'].started) {"+
							"this.area['"+i+"'].started = false;"+
							"$(this.htmlPlayer).trigger('stop',[this.area['"+i+"'].id]);"+
						"} else {"+
						"$(this.htmlPlayer).trigger('presentation.onEnd',[this.area['"+i+"'].id]); "+
						"}" +
					"},this));");
				}				
				if (this.area[i].begin) {
					eval("this.popcornPlayer.exec(this.area[i].beginTime,$.proxy(function() {"+
						"$(this.htmlPlayer).trigger('presentation.onBegin',[this.area['"+i+"'].id]);"+
					"},this));");
				}
				// TODO: area definida por frames ao invés de tempo
			}
		}
	
	// ---- REFER ----
	}
	// ---------------

	// Cria as propriedades
	$(this.htmlPlayer).data("property",[]);
	if (node.descriptor) {
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
	for (i in node.property) {
		// Propriedades da tag <media> (property)
		var name = node.property[i].name;
		var value = node.property[i].value;
		if(value){
		// Aqui, se a propriedade for de tamanho, deve ocorrer um tratamento específico, para o caso de o valor ser em porcentagem.
			// Isto se deve ao fato que o "setProperty" trata valores com porcentagem de uma forma que não é a que desejamos neste caso. 
			// Por isso, ao final deste bloco de código, "setProperty" é chamado com valores absolutos.
			if(name == "width" || name == "height"){
				value = this.__fixPercentageSize(name, value);
			}
			else if(name == "bounds")
			{
				var bounds = value.split(",");
				bounds[2] = this.__fixPercentageSize("width",bounds[2]);
				bounds[3] = this.__fixPercentageSize("height",bounds[3]);
				value = bounds.join();
			}
			this.setProperty(name,value);
		}
	}
	
	// Tratamento do explicitDur
	if(this.explicitDur)
	{
		this.popcornPlayer.exec(this.explicitDur,$.proxy(function() {
			this.stop();
		},this));
	}
	
	// Faz o bind dos eventos
	this.bindEvents();
	// Salva o player no elemento HTML via JQuery
	$(this.htmlPlayer).data("player",this);
};

// Esta função é utilizada para auxiliar no tratamento dos valores em porcentagem de propriedades, retornando um valor absoluto para ser mandado para o "setProperty".
MediaPlayer.prototype.__fixPercentageSize = function(name, value){
	if(name == "width" || name == "height"){		
		var buffer = value.split("%");
		if (buffer.length > 1) {
			var playerDivValue = (name=="width") ? parseInt($("#"+this.presentation.playerDiv).css("width").split("px")[0]) : parseInt($("#"+this.presentation.playerDiv).css("height").split("px")[0]);
			var parentValue;
			if(this.node.descriptor && this.node.descriptor.region){
				var pai = this.node.descriptor.region._parent;
				
				if (name == "width"){
					parentValue = (pai.width) ? pai.width : playerDivValue;
				}
				else if (name == "height"){
					parentValue = (pai.height) ? pai.height : playerDivValue;
				}
			}
			else parentValue = playerDivValue;
			return (parseInt(parentValue)*parseFloat(buffer[0])/100).toString();
		}
	}
	return value;
}

// load
MediaPlayer.prototype.load = function (source) {
	$(this.htmlPlayer).empty();
	source = this.presentation.path + source;
	switch (this.type.split("/")[0]) {
		case "video": {
			// type = video/*
			$(this.htmlPlayer).append("<source src='" + source + "'></source>");
			break;
		}
		case "audio": {
			// type = audio/*
			$(this.htmlPlayer).append("<source src='" + source + "'></source>");
			break;
		}
		case "image": {
			// type = image/*
			$(this.htmlPlayer).attr("src",source);
			break;
		}
		case "application": {
			// type = application/*
			// não faz nada
            break;
		}
		case "text": {
			if (this.checkType(["text/plain","text/html"])) {
				// type = text/plain, text/html
				$.ajax({
					type: "GET",
					url: source,
					dataType: "text",
					success: $.proxy(function (data) {
						$(this.htmlPlayer).append(data);
					},this)
				});
			} else {
				// TODO?
			}
			break;
		}
	}
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
				Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"border",[borderWidth]);
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
	var duration = transition.dur ? parseInt(transition.dur.split("s")[0])*1000 : 1000;
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
				Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"transition",[transition.type,transition.subtype]);
			}
			break;
		}
		case "snakeWipe":
		case "clockWipe": {
			// snakeWipe, clockWipe
			// TODO
			Debugger.warning(Debugger.WARN_NOT_IMPLEMENTED_YET,"transition",[transition.type]);
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
        this.presentation.focusManager.enableKeys(this.htmlPlayer);
		if(this.node.descriptor){
			this.presentation.focusManager.addMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
		}
		this.isPlaying = true;
		this.isStopped = false;
		this.show();
		if (this.checkType(["video","audio","image","text"])) {
            if(this.checkType(["video","audio"]))
			    this.parentContext.syncPlayer(this);

            this.popcornPlayer.play();
			if (nodeInterface && this.area[nodeInterface]._type=="area") {
				if (this.area[this.area[nodeInterface].id].begin) {
                    this.area[this.area[nodeInterface].id].started = true;
					this.seek(this.area[this.area[nodeInterface].id].beginTime);
					$(this.htmlPlayer).one("seeked",$.proxy(function() {
						this.parentContext.notify(this);
						//TODO: Quando for resolvida a sincronização, remover esse play.
						this.popcornPlayer.play();
					},this));
				} else {
					// TODO (frames)
				}
			} else {
				this.parentContext.notify(this);
			}
		}
		$(this.htmlPlayer).trigger("presentation.onBegin",[nodeInterface]);
	}
};

// stop
MediaPlayer.prototype.stop = function (nodeInterface) {
	if (!this.isStopped) {
        this.presentation.focusManager.disableKeys(this.htmlPlayer);
		if(this.node.descriptor){
			this.presentation.focusManager.removeMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
		}
		this.isPlaying = false;
		this.isStopped = true;
		this.hide();
		if (this.checkType(["video","audio","image","text"])) {
			this.popcornPlayer.pause(0);
		}
		$(this.htmlPlayer).trigger("presentation.onEnd",[nodeInterface]);
	}
};

// pause
MediaPlayer.prototype.pause = function (nodeInterface) {
	if (this.isPlaying) {
		this.isPlaying = false;
		this.isStopped = false;
		if (this.checkType(["video","audio","image","text"])) {
			this.popcornPlayer.pause();
		}
		$(this.htmlPlayer).trigger("presentation.onPause",[nodeInterface]);
	}
};

// resume
MediaPlayer.prototype.resume = function (nodeInterface) {
	if (!this.isStopped && !this.isPlaying) {
		this.isPlaying = true;
		this.isStopped = false;
		if (this.checkType(["video","audio","image","text"])) {
			this.popcornPlayer.play();
		}
		$(this.htmlPlayer).trigger("presentation.onResume",[nodeInterface]);
	}
};

// abort
MediaPlayer.prototype.abort = function (nodeInterface) {
	if (!this.isStopped) {
		if(this.node.descriptor){
			this.presentation.focusManager.removeMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
		}
		this.isPlaying = false;
		this.isStopped = true;
		this.hide();
		if (this.checkType(["video","audio","image","text"])) {
			this.popcornPlayer.pause(0);
		}
		$(this.htmlPlayer).trigger("presentation.onAbort",[nodeInterface]);
	}
};

MediaPlayer.prototype.seek = function (newTime) {
	if (this.checkType(["video","audio","image","text"])) {
		try {
			this.popcornPlayer.currentTime(newTime);
		} catch(e) {
			eval("$(this.htmlPlayer).one('loadedmetadata',$.proxy(function() {"+
				"this.popcornPlayer.currentTime("+newTime+");"+
			"},this));");
		}
	}
};

// seekAndPlay
MediaPlayer.prototype.seekAndPlay = function (newTime) {
	if (!this.isStopped) {
		if (this.checkType(["video","audio"])) {
			try {
				this.popcornPlayer.currentTime(newTime);
			} catch(e) {
				eval("$(this.htmlPlayer).one('loadedmetadata',$.proxy(function() {"+
					"this.popcornPlayer.currentTime("+newTime+");"+
				"},this));");
			}
			$(this.htmlPlayer).one("seeked",$.proxy(function() {
				this.popcornPlayer.play();
			},this));
		} else if(this.checkType(["image","text"])) {
				this.popcornPlayer.currentTime(newTime);
		}
	}
};
