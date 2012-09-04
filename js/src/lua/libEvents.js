function libEvents(luaplayer){
	this.luaplayer = luaplayer;
	this.player = luaplayer.p;
	this.handlers = [];
	this.handlers[0] = undefined;
	this.counter = 0;
	tmp = this.player.id;
	this.nodeId = tmp.substring(tmp.indexOf('_')+1);
	var d = new Date();
	this.t = d.getTime();
	
};

libEvents.prototype.register = function(fct){
	
	this.handlers[this.counter] = fct;
	this.counter = this.counter + 1;
}

libEvents.prototype.unregister = function(fct){
	
	this.handlers[this.counter] = undefined;
	if(!this.counter)
		this.counter = this.counter - 1;
}

libEvents.prototype.post = function(attr0, attr1){
	
	var out;
	var evt;
	if(attr0 === 'in'){
		evt = attr1;
		out = false;
	} else if(attr1 == undefined){
		evt = attr0;
		out = false;
	}
	if(attr0 == 'out'){
		evt = attr1;
		out = true;
	}
	
	if(!out){
		if (evt.str['class'] == 'key') {
		this.player.postEvent(evt.str);
	} else if (evt.str['class'] == 'ncl') {
		var json = undefined;
		if (evt.str['type'] == 'presentation') {
			console.log('label:' + evt.str['label']);
			if (evt.str['label'] != undefined) {
				json = {
					'class' : 'ncl',
					'type' : evt.str['type'],
					'action' : evt.str['action'],
					'component' : this.nodeId,
					'area' : evt.str['label']

				};

			} else {
				json = {
					'class' : 'ncl',
					'type' : evt.str['type'],
					'action' : evt.str['action'],
					'component' : this.nodeId
				};
			}
		} else if (evt.str['type'] == 'attribution') {
			if (evt.str['action'] == 'stop') {
				$('#' + this.player.id).trigger("attribution.onEndAttribution", [evt.str['name']]);
			}

			json = {
				'class' : 'ncl',
				'type' : evt.str['type'],
				'action' : evt.str['action'],
				'component' : this.nodeId,
				'name' : evt.str['name'],
				'value' : evt.str['value']
			};
		}
		console.log(json);
		this.player.postEvent(json);
	} else if (evt.str['class'] == 'user') {
		this.luaplayer.eventQueue(evt);

	}
	}
	
	if(out){
		if (evt.str['class'] == 'key') {
		this.player.postEvent(evt.str);
	} else if (evt.str['class'] == 'ncl') {
		var json = undefined;
		if (evt.str['type'] == 'presentation') {
			console.log('label:' + evt.str['label']);
			if (evt.str['label'] != undefined) {
				json = {
					'class' : 'ncl',
					'type' : evt.str['type'],
					'action' : evt.str['action'],
					
					'area' : evt.str['label']

				};

			} else {
				json = {
					'class' : 'ncl',
					'type' : evt.str['type'],
					'action' : evt.str['action'],
					
				};
			}
		} else if (evt.str['type'] == 'attribution') {
			if (evt.str['action'] == 'stop') {
				$('#' + this.player.id).trigger("attribution.onEndAttribution", [evt.str['name']]);
			}

			json = {
				'class' : 'ncl',
				'type' : evt.str['type'],
				'action' : evt.str['action'],
				
				'name' : evt.str['name'],
				'value' : evt.str['value']
			};
		}
		console.log(json);
		this.player.postEvent(json);
	} 
	}
	
}


libEvents.prototype.timer = function(timeout, fct){
	setTimeout(fct, timeout);
}

libEvents.prototype.uptime = function(){
	
	var d = new Date();
	return(d.getTime() - this.t); 
}

