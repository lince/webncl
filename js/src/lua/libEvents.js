function libEvents(player){
	this.player = player;
	
};


libEvents.prototype.register = function(selector, evt, fct){

$(selector).bind(evt,fct);

}

libEvents.prototype.unregister = function(selector, evt, fct){

$(selector).unbind(evt,fct);
}

libEvents.prototype.post = function(evt){

	//importing from webncl.js
	console.log(evt);
	if (evt.str['class'] == 'key') {
		this.player.postEvent(evt);	
	}

}

libEvents.prototype.timer = function(t,callback,manager){

//importing from Timer.js
manager.add(t,callback);	

}

