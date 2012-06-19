// <importNCL>
Parser.prototype.parseImportNCL = function (obj,tag,parent,tree) {
	// alias
	if (!this.uniqueTable["alias"]) {
		this.uniqueTable["alias"] = [];
	}
	if (this.uniqueTable["alias"][obj.alias]) {
		if (!this.uniqueTable["alias"][obj.alias].duplicated) {
			this.uniqueTable["alias"][obj.alias].duplicated = true;
			Debugger.error(Debugger.ERR_DUPLICATED_ALIAS,"importNCL",[obj.alias]);
		}
	} else {
		this.uniqueTable["alias"][obj.alias] = {
			duplicated: false
		};
	}	
};