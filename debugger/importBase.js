// <importBase>
function debugImportBase (obj,debug,parent,tree) {
	// # region
	if (obj.region!=null) {
		var reference = debug.refTable.pop(obj.region);
		if (!reference || reference.type!="region") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["region",obj.region,["region"]]);
		}
	}
	// alias
	if (!debug.uniqueTable["alias"]) {
		debug.uniqueTable["alias"] = [];
	}
	if (debug.uniqueTable["alias"][obj.alias]) {
		if (!debug.uniqueTable["alias"][obj.alias].duplicated) {
			debug.uniqueTable["alias"][obj.alias].duplicated = true;
			debug.error(debug.ERR_DUPLICATED_ALIAS,"importBase",[obj.alias]);
		}
	} else {
		debug.uniqueTable["alias"][obj.alias] = {
			duplicated: false
		};
	}	
}