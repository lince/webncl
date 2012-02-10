// <importNCL>
function debugImportNCL (obj,tag,parent,tree) {
	// alias
	if (!Debugger.uniqueTable["alias"]) {
		Debugger.uniqueTable["alias"] = [];
	}
	if (Debugger.uniqueTable["alias"][obj.alias]) {
		if (!Debugger.uniqueTable["alias"][obj.alias].duplicated) {
			Debugger.uniqueTable["alias"][obj.alias].duplicated = true;
			Debugger.error(Debugger.ERR_DUPLICATED_ALIAS,"importNCL",[obj.alias]);
		}
	} else {
		Debugger.uniqueTable["alias"][obj.alias] = {
			duplicated: false
		};
	}	
}