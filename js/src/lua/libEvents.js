function libEvents(luaplayer){
	this.luaplayer = luaplayer;
	this.player = luaplayer.p;
	this.handlers = [];
	this.handlers[0] = undefined;
	this.counter = 0;
	tmp = this.player.id;
	this.nodeId = tmp.substring(tmp.indexOf('_')+1);
	this.t = 0;
	
};

libEvents.prototype.register = function(fct){
	console.log('libEvents.register()');
	this.handlers[this.counter] = fct;
	this.counter = this.counter + 1;
}

libEvents.prototype.unregister = function(fct){
	console.log('libEvents.unregister()');
	this.handlers[this.counter] = undefined;
	if(!this.counter)
		this.counter = this.counter - 1;
}

libEvents.prototype.post = function(evt){
	//console.log('libEvents.post()')

	if (evt.str['class'] == 'key') {
		this.player.postEvent(evt.str);	
	} else if (evt.str['class'] == 'ncl') {
		var json = undefined;
		if (evt.str['type'] == 'presentation') {
			json = {'class' : 'ncl', 'type' : evt.str['type'], 
			       'action' : evt.str['action'], 'component' : this.nodeId};
		} else if (evt.str['type'] == 'attribution') {
			if (evt.str['action'] == 'stop') {
				$('#' + this.player.id).trigger(
					"attribution.onEndAttribution",[evt.str['name']]);
			}
			
			json = {'class' : 'ncl', 
			     'type' : evt.str['type'], 
			     'action' : evt.str['action'], 
			     'component' : this.nodeId,
			     'name' : evt.str['name'],
			     'value' : evt.str['value']};
		}
		this.player.postEvent(json);
	} else if (evt.str['class'] == 'user') {
		this.luaplayer.eventQueue(evt);
		
	}
	var d = new Date();
	this.t = d.getTime();
}

/*libEvents.prototype.timer = function(t, callback, manager){
	manager.add(t,callback);	
}*/
libEvents.prototype.timer = function(timeout, fct){
	setTimeout(fct, timeout);
}

libEvents.prototype.uptime = function(){
	
	var d = new Date();
	return(d.getTime() - this.t); 
}

