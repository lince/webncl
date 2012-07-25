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
 * @fileoverview Define FlowPlayer class. [WIP]
 */

/**
 * Default player for video/flv.
 * This is a Work in Progress. All players are still handled by MediaPlayer.js
 * @constructor
 */
function FlowPlayer(p) {
    this.p = p;
    this.htmlPlayer = "#" + p.id;
    this.flowPlayer = undefined;
    
	p.createElement("<div class='player' id='" + p.id + "'></div>");	


};

/**
 * Called when the player needs to unload its sources
 * (Precedes calls to unload, excepting the first call)
 */
Html5Player.prototype.unload = function()
{
	     //erases older content
        $(this.htmlPlayer).empty();   
}

/**
 * Called when the player need to load (or reload) it sources 
 * After the first time it's called, MediaPlayer.js will precede
 * every call to load() with a call to unload() 
 * 
 */
FlowPlayer.prototype.load = function(source)
{
	console.log (this.p)

      this.flowPlayer = $f(this.p.id, "http://releases.flowplayer.org/swf/flowplayer-3.2.12.swf", {
    	  clip: { autoPlay: false, autoBuffering: true, url: source, scaling: 'scale'},
    	  play: {replayLabel: null, label: null, opacity: 0 },
    	  canvas: { background: '#000000', backgroundGradient: 'none',},
    	  plugins: {controls: null}
      });
  
      //$(this.htmlPlayer).append("<script language='JavaScript'> $f('" + p.id + "', 'http://releases.flowplayer.org/swf/flowplayer-3.2.12.swf','" + source + "'); </script>");
        
}

/**
 * This function should be called to set function calls based on
 * the video progress in time 
 */
FlowPlayer.prototype.exec = function(time,callback)
{	
	//This function can be called more than
	//once with the times 'begin' and 'end'.
	//This way, the handler for these times
	//must set a new event listener for each
	//call
	//As documented bellow:
	//http://flowplayer.org/documentation/api/index.html#events
	//the calls onStart and onFinish works 
	//the way we need
	
	if (time=='begin'){
		this.flowPlayer.onStart(callback);
	}
	else if (time == 'end'){
		this.flowPlayer.onFinish(callback);
	}
	else{
		this.flowPlayer.onCuepoint(time,callback);

	}
}

/**
 * Start
 */
FlowPlayer.prototype.start =  function()
{
    this.flowPlayer.play();
    console.log(this.flowPlayer);
}

/**
 * Stop
 */
FlowPlayer.prototype.stop = function()
{
	this.flowPlayer.stop();
}

/**
 * Pause
 */
FlowPlayer.prototype.pause = function()
{
	this.flowPlayer.pause();
}

/**
 * Resume
 */
FlowPlayer.prototype.resume = function()
{
    this.flowPlayer.resume();
}


/**
 * Abort
 */
FlowPlayer.prototype.abort = function()
{
    this.stop();
}


/**
 * Seek
 */
FlowPlayer.prototype.seek = function(newTime)
{
    this.flowPlayer.seek(newTime);
    this.flowPlayer.pause();
}



/**
 * SeekAndPLay
 */
FlowPlayer.prototype.seekAndPlay = function(newTime)
{
    this.flowPlayer.seek(newTime);
    this.flowPlayer.resume();
}
