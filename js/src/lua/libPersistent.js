function libPersistent(readOnly){
	this.readOnly=readOnly;
};

libPersistent.prototype.changeMode = function(readOnly){
	this.readOnly = readOnly;
	
}

libPersistent.prototype.storeField = function(prefix, key, value){
	
	if (this.readOnly){
		console.log('error');
	}
	
	else{
		if(prefix == "settings" && typeof(value) == 'number'){
			console.log('error');
		}
		else{
			var storageKey = "webncl." + prefix+ "." + key;
			localStorage.setItem(storageKey, value);	
		}	
	}
}


libPersistent.prototype.clear = function(){
	
	localStorage.clear();
}

libPersistent.prototype.recoverField = function(key){
	
	key = "webncl." + key;
	
	var content = localStorage.getItem(key);
	return content;
	
}
