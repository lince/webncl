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
 * This is a Work in Progress. All players are still handled by MediaPlayer.js
 * @constructor
 */
function Html5Player(p) {
    this.p = p;
    this.popcornPlayer  = undefined;
    this.htmlPlayer = "#" + p.id;
	
	this.durationMap = {};
	this.endCallbacks = [];

    p.onChangeProperty.propertyMap =
	{

		'soundLevel' : Player.propertyAction.OVERLOAD,
		'fit': Player.propertyAction.OVERLOAD

	};
    //overloading we don't need to trigger onEndAttribution event

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


	//Tenta criar o popCorn player de acordo com o tipo de media
	if (p.checkType(["video","audio"]))
	{
		do {	
				//this.popcornPlayer = new Popcorn(this.htmlPlayer, { frameAnimation: true });
				this.popcornPlayer = new Popcorn(this.htmlPlayer);	
		} while (!this.popcornPlayer);
	} else if(p.checkType(["image","text"])){
		do {	
				Popcorn.player("baseplayer");
				this.popcornPlayer = new Popcorn.baseplayer(this.htmlPlayer);
				
		} while (!this.popcornPlayer);
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

        
        //load a new content base on file type
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
			}// else {
				// TODO?
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
Html5Player.prototype.start =  function()
{
    if (this.popcornPlayer) {
         this.popcornPlayer.play();
    }
};

/**
 * Stop
 */
Html5Player.prototype.stop = function()
{
    if (this.popcornPlayer) {
	this.popcornPlayer.pause(0);
    }
};

/**
 * Pause
 */
Html5Player.prototype.pause = function()
{
    if (this.popcornPlayer) {
	this.popcornPlayer.pause();
    }
};

/**
 * Resume
 */
Html5Player.prototype.resume = function()
{
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
 * SeekAndPLay
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
		this.stop();
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
			/*
			eval('this.exec(value,$.proxy(function() {'+
			'if (this.duration == ' + value + ')'+
			'this.stop();'+
			'},this));');
			*/
			eval('this.exec(value,$.proxy(function() {'+
			'this.stopCallback(' + value + ');'+
			'},this));');
		}

		break;

		case 'soundLevel':
			if (this.p.checkType(["video","audio"])) {
				this.popcornPlayer.volume(value);
			}       
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
