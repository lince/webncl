// <importNCL>
function debugImportNCL (obj,debug,parent,tree) {
	// alias
	if (!debug.uniqueTable["alias"]) {
		debug.uniqueTable["alias"] = [];
	}
	if (debug.uniqueTable["alias"][obj.alias]) {
		if (!debug.uniqueTable["alias"][obj.alias].duplicated) {
			debug.uniqueTable["alias"][obj.alias].duplicated = true;
			debug.error(debug.ERR_DUPLICATED_ALIAS,"importNCL",[obj.alias]);
		}
	} else {
		debug.uniqueTable["alias"][obj.alias] = {
			duplicated: false
		};
	}	
}