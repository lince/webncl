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
    this.popcornPlayer = undefined;
    this.htmlPlayer = "#" + p.id;
	this.loadTries = 1;

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
			p.createElement("<video class='player' id='" + p.id + "'></video>");
			document.getElementById(this.p.id).addEventListener('error',$.proxy(this.mediaNotFound,this),true);
			break;
		
		case "audio": 
			// type = audio/*
			p.createElement("<audio class='player' id='" + p.id+ "'></audio>");
			document.getElementById(this.p.id).addEventListener('error',$.proxy(this.mediaNotFound,this),true);
			break;
		
		case "image": 
			// type = image/*
			p.createElement("<img class='player' id='" + p.id + "'></img>");
			$(this.htmlPlayer).error($.proxy(this.mediaNotFound,this));
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
		
		// spatial anchors
		if (this.anchors[id].spatial && !this.anchors[id]._ignore) {
			var coords = this.anchors[id].coords.split(',');
			// makes it ready to evaluate when the media starts, because
			// width and height are still undefined here
			for (i in coords) {
				var coord = coords[i].split('%');
				if (coord.length > 1) {
					coords[i] = 'Math.round(parseInt($(this.htmlPlayer).css("' + (i%2?'height':'width') + '").split("px")[0]) * ' + parseFloat(coord[0])/100 + ')';
				}
			}
			this.anchors[id].calculatedCoords = coords;
			// 'coords' is only supported by images
			if (!this.p.checkType(['image'])) {
				Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,'area',['coords',p.source.type]);
			}
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

    //p.enableKeyEvents();

	
}

//Html5Player.prototype.keyEventHandler = function(e)
//{
//   console.log(this.htmlPlayer,e.key,e);
//}

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
 * (Precedes calls to load, excepting the first call)
 */
Html5Player.prototype.unload = function()
{
	//erases older content
	$(this.htmlPlayer).empty();
};

/**
 * Callback for error events (media not found)
 */
 Html5Player.prototype.mediaNotFound = function() {
	this.loadTries--;
	if (this.loadTries <= 0) {
		Logger.warning(Logger.WARN_MEDIA_NOT_FOUND,this.p.id,[this.p.source.url]);
	}
};
 
/**
 * Called when the player need to load (or reload) it sources 
 * After the first time it's called, MediaPlayer.js will precede
 * every call to load() with a call to unload() 
 * 
 */
Html5Player.prototype.load = function (source) {
	
	this.p.source.url = source;
	this.loadTries = 1;
	
	// load a new content based on file type
	var type = this.p.source.type.split("/")[0];
	switch (type) {
	
		case "video":
		case "audio":
			// type = video/*, audio/*
			var filename = source.substr(0,source.lastIndexOf('.'));
			var ext = source.substr(source.lastIndexOf('.')+1);
			var exts = type=='video' ? ['webm','mp4','ogg'] : ['mp3','ogg'];
			// sorts the array so that the real file extension (ext) is moved to the first position
			exts.sort(function(a,b) {
				return b==ext;
			});
			this.loadTries = exts.length;
			for (i in exts) {
				$(this.htmlPlayer).append('<source type="'+type+'/'+exts[i]+'" src="'+filename+'.'+exts[i]+'"></source>');
			}
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
						this.textData = data;
						this.loadTextData();
					},this),
					error: $.proxy(this.mediaNotFound,this)
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
	var alreadyPlaying = false;
	
	/***** Areas *****/
	
	if (this.playingArea) {
		this.anchors[this.playingArea].started = false;
	}
	
	if (nodeInterface) {
	
		// temporal anchors
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
					alreadyPlaying = true;
				}
			}
		}
		
		// textual anchors
		if (this.anchors[nodeInterface].textual && this.p.checkType(['text'])) {
			this.textualAnchor = this.anchors[nodeInterface];
			if (this.textData) {
				this.loadTextData();
			}
		}
		
		// spatial anchors
		if (this.anchors[nodeInterface].spatial && !this.anchors[nodeInterface]._ignore && this.p.checkType(['image'])) {
			var clip = 'rect(' +
				eval(this.anchors[nodeInterface].calculatedCoords[1]) + 'px,' +
				eval(this.anchors[nodeInterface].calculatedCoords[2]) + 'px,' +
				eval(this.anchors[nodeInterface].calculatedCoords[3]) + 'px,' +
				eval(this.anchors[nodeInterface].calculatedCoords[0]) + 'px)';
			$(this.htmlPlayer).css('clip',clip);
		}
		
	} else {
		// no anchor defined
		this.playingArea = undefined;
		if (this.playing) {
			alreadyPlaying = true;
		}
	}
	
	// restores full text if no textual anchor defined
	if ((!nodeInterface || !this.anchors[nodeInterface].textual) && this.p.checkType(['text'])) {
		this.textualAnchor = undefined;
	}
	
	// restores full image if no spatial anchor defined
	if ((!nodeInterface || !this.anchors[nodeInterface].spatial) && this.p.checkType(['image'])) {
		$(this.htmlPlayer).css('clip','auto');
	}
	
	/*****************/
	
	// if it wasn't playing yet, do it
   if (!alreadyPlaying && this.popcornPlayer) {
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
	$(this.htmlPlayer).css('clip','auto');
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

/**
 * loadTextData
 */
Html5Player.prototype.loadTextData = function() {
	var beginText='', endText='', beginPosition='', endPosition='';
	if (this.textualAnchor) {
		beginText = this.textualAnchor.beginText || '';
		endText = this.textualAnchor.endText || '';
		beginPosition = this.textualAnchor.beginPosition || 1;
		endPosition = this.textualAnchor.endPosition || 1;
	}
	var data = this.textData;

	if (beginText) {
		var bdata = data;
		data = data.split(beginText);
		if (data.length > beginPosition) {
			data = beginText + data.slice(beginPosition).join(beginText);
		} else {
			data = bdata;
			Logger.warning(Logger.WARN_INVALID_AREA,'area',['beginText','beginPosition']);
		}
	}
	
	if (endText) {
		var edata = data;
		data = data.split(endText);
		endPosition -= this.textData.split(endText).length - data.length;
		if (data.length > endPosition && endPosition > 0) {
			data = data.slice(0,endPosition).join(endText) + endText;
		} else {
			data = edata;
			Logger.warning(Logger.WARN_INVALID_AREA,'area',['endText','endPosition']);
		}
	}
	
	if (data) {
		$(this.htmlPlayer).append(data.replace(/\n/g,'<br/>'));
	}
}
