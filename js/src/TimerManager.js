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

// Classes Timer and TimerManager are used to create "pausable timers".
// How to use:
//    myTimers = new TimerManager();
//    myTimers.add (timeout1, callback1)
//    myTimers.add (timeout2, callback2);
//    myTimers.pauseAll();
//    myTimers.resumeAll();
//    ...
 
function Timer (t,callback,manager) {

	if (manager) this.manager = manager;
	this.callback = callback;
	this.timeLeft = t;
	this.startTime = null;
	this.id = null;
	
	this.timeout = function() {
		if (this.manager) this.manager.remove(this);
		this.callback();
	};
	
	this.resume = function() {
		this.startTime = new Date();
		this.id = setTimeout($.proxy(function() {
			this.timeout();
		},this),this.timeLeft);
	};
	
	this.pause = function() {
		clearTimeout(this.id);
		this.timeLeft -= (new Date() - this.startTime);
	};
	
	this.stop = function() {
		clearTimeout(this.id);
	};
	
	this.resume();
	
};

function TimerManager () {

	this.timers = [];
	
	this.add = function(t,callback) {
		this.timers.push(new Timer(t,callback,this));
	};
	
	this.remove = function(timer) {
		this.timers.splice(this.timers.indexOf(timer),1);
	};
	
	this.pauseAll = function() {
		for (i in this.timers) {
			this.timers[i].pause();
		}
	}

	this.resumeAll = function() {
		for (i in this.timers) {
			this.timers[i].resume();
		}
	}

	this.stopAll = function() {
		for (i in this.timers) {
			this.timers[i].stop();
		}
		this.timers = [];
	}

}
