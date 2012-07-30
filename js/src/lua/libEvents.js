//TODO: implement the handler as vector ok
//TODO: add the position arg for register() ok
//TODO: add the destination arg for post

function libEvents(player){
	this.player = player;
	this.handlers[0] = undefined;
	this.counter = 0;
	tmp = player.id;
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
	console.log('libEvents.post()')

	if (evt.str['class'] == 'key') {
		this.player.postEvent(evt.str);	
	} else if (evt.str['class'] == 'ncl') {
		var json = {'class' : 'ncl', 'type' : evt.str['type'], 'action' : evt.str['action'], 'component' : this.nodeId};
		this.player.postEvent(json);
	}
	var d = new Date();
	this.t = d.getTime();
}

/*libEvents.prototype.timer = function(t,callback,manager){
	manager.add(t,callback);	
}*/
libEvents.prototype.timer = function(timeout, fct){
	setTimeout(fct, timeout);
}

libEvents.prototype.uptime = function(){
	
	var d = new Date();
	return(d.getTime() - this.t); 
}

