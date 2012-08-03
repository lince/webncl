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
 * @fileoverview Define Html5Player class. [WIP]
 */

/**
 * Default player for video, image, text/plain, text/html and text/htm.
 * @constructor
 */
function Html5Player(p) {
    this.p = p;
    this.popcornPlayer  = undefined;
    this.htmlPlayer = "#" + p.id;

	// flags and callbacks for explicitDur treatment
	this.duration = undefined;
	this.durationBind = undefined;
	this.durationBinded = false;
	this.durationMap = {};
	this.endCallbacks = [];

	// property map
    p.onChangeProperty.propertyMap =
	{
		'soundLevel': Player.propertyAction.OVERLOAD,
		'fit': Player.propertyAction.OVERLOAD
	};
    // overloading we don't need to trigger onEndAttribution event
	
	// creates the media
    switch (p.source.type.split("/")[0]) {
		case "video": 
			// type = video/*
			p.createElement("<video class='player' poster='images/loading.gif' id='" + p.id + "'></video>");	
			break;
		
		case "audio": 
			// type = audio/*
			p.createElement("<audio class='player' id='" + p.id+ "'></audio>");
			break;
		
		case "image": 
			// type = image/*
			p.createElement("<img class='player' id='" + p.id + "'></img>");
			break;
		
		case "application": 
			switch (p.source.type) {
				case "application/x-ginga-settings":
					// type = application/x-ginga-settings
					 p.createElement("<div class='player' id='" + p.id + "'></div>");
					break;
				case "application/x-ginga-NCLua":
					// type = application/x-ginga-NCLua
					Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"media",[p.source.type]);
					break;
				case "application/x-ginga-NCLet":
					// type = application/x-ginga-NCLet
					Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"media",[p.source.type]);
					break;
				case "application/x-ginga-time":
					// type = application/x-ginga-time
					Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"media",[p.source.type]);
					break;
			}
			break;
		
		case "text": 
			switch (p.source.type) {
				case "text/plain":
				case "text/html":
					// type = text/plain, text/html
					p.createElement("<div class='player' id='" + p.id + "'></div>");
					break;
				case "text/css":
					// type = text/css
					Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"media",[p.source.type]);
					break;
				case "text/xml":
					// type = text/xml
					Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"media",[p.source.type]);
					break;
			}
		break;
	}

	// creates the popcorn player
	if (p.checkType(["video","audio"]))
	{
		do {	
			this.popcornPlayer = new Popcorn(this.htmlPlayer);
		} while (!this.popcornPlayer);
	} else if(p.checkType(["image","text"])){
		do {
			Popcorn.player("baseplayer");
			this.popcornPlayer = new Popcorn.baseplayer(this.htmlPlayer);
		} while (!this.popcornPlayer);
	}

	/***** Areas *****/
	
	this.playing = false;
	this.playingArea = undefined;
	this.anchors = [];
	
	for (i in p.area) {
	
		var id = p.area[i].id;
		this.anchors[id] = p.area[i];
		
		// anchor type flags
		this.anchors[id].temporal = p.area[i].begin || p.area[i].end || p.area[i].first || p.area[i].last ? true : false;
		this.anchors[id].textual = p.area[i].beginText || p.area[i].endText || p.area[i].beginPosition || p.area[i].endPosition ? true : false;
		this.anchors[id].spatial = p.area[i].coords ? true : false;

		// temporal anchors
		if (this.anchors[id].temporal) {
			eval("this.exec(this.anchors[id].beginTime,$.proxy(function() {"+
				"$(this.htmlPlayer).trigger('presentation.onBegin',['"+id+"']);"+
			"},this));");
			eval("this.exec(this.anchors[id].endTime,$.proxy(function() {"+
				"this.stopArea('" + id + "');"+
			"},this));");
		}
		
	}
	
	// When the media ends, we need to set every area to stopped
	this.exec('end',$.proxy(function() {
		for (i in this.anchors) {
			if (this.anchors[i].temporal)
				this.stopArea(i);
		}
	},this));

	/*****************/
	
}

Html5Player.prototype.stopArea = function (nodeInterface) {
	if (this.anchors[nodeInterface].started) {
		this.anchors[nodeInterface].started = false;
		$(this.htmlPlayer).trigger('stop',[nodeInterface]);
	} else {
		$(this.htmlPlayer).trigger('presentation.onEnd',[nodeInterface]);
	}
}

/**
 * Called when the player needs to unload its sources
 * (Precedes calls to unload, excepting the first call)
 */
Html5Player.prototype.unload = function()
{
	//erases older content
	$(this.htmlPlayer).empty();
};

/**
 * Called when the player need to load (or reload) it sources 
 * After the first time it's called, MediaPlayer.js will precede
 * every call to load() with a call to unload() 
 * 
 */
Html5Player.prototype.load = function(source)
{

	var filename = source.substr(0, source.lastIndexOf('.'));
    
	// load a new content base on file type
	switch (this.p.source.type.split("/")[0]) {
	
		case "video": 
			// type = video/*
			$(this.htmlPlayer).append("<source type='video/webm' src='" + filename + ".webm'></source>");
			$(this.htmlPlayer).append("<source type='video/ogg' src='" + filename + ".ogg'></source>");
			$(this.htmlPlayer).append("<source type='video/mp4' src='" + filename + ".mp4'></source>");
			break;
		
		case "audio": 
			// type = audio/*
			$(this.htmlPlayer).append("<source type='audio/mpeg' src='" + filename + ".mp3'></source>");
			$(this.htmlPlayer).append("<source type='audio/ogg' src='" + filename + ".ogg'></source>");
			break;

		case "image": 
			// type = image/*
			$(this.htmlPlayer).attr("src",source);
			break;
		
		case "application": 
			// type = application/*
			// não faz nada
            break;
		
		case "text": 
			if (this.p.checkType(["text/plain","text/html"])) {
				// type = text/plain, text/html
				$.ajax({
					type: "GET",
					url: source,
					dataType: "text",
					success: $.proxy(function (data) {
						$(this.htmlPlayer).append(data);
					},this)
				});
			}// else {
				// TODO
			//}
			break;
		
	}
    
};

/**
 * This function should be called to set function calls based on
 * the video progress in time 
 */
Html5Player.prototype.exec = function(time,callback)
{
	//This function can be called more than
	//once with the times 'begin' and 'end'.
	//This way, the handlbinder for these times
	//must set a new event listener for each
	//call
	
    //if popcornPlayer is defined then player type is in the list ['video','audio','image','text']
    if(this.popcornPlayer) {
		if (time == 'begin') {
			$(this.htmlPlayer).on('play',callback);
		} else if (time == 'end') {
			this.endCallbacks.push(callback);
			$(this.htmlPlayer).on('ended',callback);
		} else {
			this.popcornPlayer.cue(time,callback);
		}
	}
};

/**
 * Start
 */
Html5Player.prototype.start =  function (nodeInterface)
{
	
	/***** Areas *****/
	
	if (this.playingArea) {
		this.anchors[this.playingArea].started = false;
	}
	
	if (nodeInterface) {
		if (this.anchors[nodeInterface].temporal) {
			this.anchors[nodeInterface].started = true;
			this.playingArea = nodeInterface;
			var t = this.anchors[nodeInterface].beginTime;
			if (t != 'begin' && !(t > this.getDuration()))
				this.seekAndPlay(t);
			else {
				if (t != 'begin') {
					Logger.warning(Logger.WARN_INVALID_AREA,'area',['begin','end']);
				}
				if (this.playing) {
					this.seek(0);
					return;
				} else {
					//this.start();
				}
			}
		}
	} else {
		this.playingArea = undefined;
		if (this.playing) {
			this.seek(0);
			return;
		} else {
			//this.start();
		}
	}
	
	/*****************/
	
   if (this.popcornPlayer) {
		this.popcornPlayer.play();
		if (this.durationBind && !this.durationBinded && this.p.checkType(['image','text'])) {
			// Bind the explicitDur callback again
			eval(this.durationBind);
		}
    }
	
};

/**
 * Stop
 */
Html5Player.prototype.stop = function()
{
	this.playing = false;
    if (this.popcornPlayer) {
		this.popcornPlayer.pause(0);
    }
	if (this.p.checkType(['image','text'])) {
		this.durationBinded = false;
	}
};

/**
 * Pause
 */
Html5Player.prototype.pause = function()
{
	this.playing = false;
    if (this.popcornPlayer) {
		this.popcornPlayer.pause();
    }
};

/**
 * Resume
 */
Html5Player.prototype.resume = function()
{
	this.playing = true;
    if (this.popcornPlayer) {
		this.popcornPlayer.play();
    }
};




/**
 * Abort
 */
Html5Player.prototype.abort = function()
{
    this.stop();
};


/**
 * Seek
 */
Html5Player.prototype.seek = function(newTime)
{
    if (this.popcornPlayer) {
		try {
			this.popcornPlayer.currentTime(newTime);
		} catch(e) {
			eval("$(this.htmlPlayer).one('loadedmetadata',$.proxy(function() {"+
				"this.popcornPlayer.currentTime("+newTime+");"+
			"},this));");
		}
	}
};



/**
 * SeekAndPlay
 */
Html5Player.prototype.seekAndPlay = function(newTime)
{
    if (this.p.checkType(["video","audio"])) {
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
	} else if(this.p.checkType(["image","text"])) {
		this.popcornPlayer.currentTime(newTime);
	}
};


/**
 * setProperty
 */

Html5Player.prototype.stopCallback = function (t) {
	if (this.duration == t) {
		var i;
		for (i in this.endCallbacks) {
			this.endCallbacks[i]();
		}
	}
};

Html5Player.prototype.setProperty = function(name,value) {
    switch(name)
    {
		case 'explicitDur':
			this.duration = value;
			if (!this.durationMap[value]) {
				this.durationMap[value] = true;
				// For some reason, our baseplayer's cue method seems to work only once.
				// Every time it starts again, this callback needs to be binded again.
				this.durationBind = 'this.exec(' + value + ',$.proxy(function() {'+
				'this.stopCallback(' + value + ');'+
				'},this));';
				eval(this.durationBind);
				this.durationBinded = true;
			}
		break;

		case 'soundLevel':
			if (this.p.checkType(["video","audio"])) {
				this.popcornPlayer.volume(value);
			}       
		break;

		case "fontColor": 
				$(this.htmlPlayer).css("color",value);
				break;

		case "fontFamily": 
				$(this.htmlPlayer).css("font-family",value);
				break;

		case "fontStyle": 
				$(this.htmlPlayer).css("font-style",value);
				break;

		case "fontSize": 
				$(this.htmlPlayer).css("font-size",value);
				break;

		case "fontVariant": 
				$(this.htmlPlayer).css("font-variant",value);
				break;

		case "fontWeight": 
				$(this.htmlPlayer).css("font-weight",value);
				break;

		case "style": 
				// TODO: url de um arquivo css
				Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
				break;



		case 'fit':
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
			//$(this.htmlPlayer).css('-webkit-object-fit',fit[value]);	// Chrome/Safari
			//$(this.htmlPlayer).css('-moz-object-fit',fit[value]);		// Firefox
			//$(this.htmlPlayer).css('object-fit',fit[value]);			// IE
		break;

    }
	
};

/**
 * getDuration
 */
Html5Player.prototype.getDuration = function() {
	if (this.duration && this.popcornPlayer.duration)
		return Math.min(this.duration,this.popcornPlayer.duration());
	else
		return this.duration || this.popcornPlayer.duration();
}
