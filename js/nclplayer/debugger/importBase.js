// <importBase>
function debugImportBase (obj,tag,parent,tree) {
	// # region
	if (obj.region!=null) {
		var reference = Debugger.refTable.pop(obj.region);
		if (!reference || reference.type!="region") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["region",obj.region,["region"]]);
		} else {
			obj.region = reference.obj;
		}
	}
	// alias
	if (!Debugger.uniqueTable["alias"]) {
		Debugger.uniqueTable["alias"] = [];
	}
	if (Debugger.uniqueTable["alias"][obj.alias]) {
		if (!Debugger.uniqueTable["alias"][obj.alias].duplicated) {
			Debugger.uniqueTable["alias"][obj.alias].duplicated = true;
			Debugger.error(Debugger.ERR_DUPLICATED_ALIAS,"importBase",[obj.alias]);
		}
	} else {
		Debugger.uniqueTable["alias"][obj.alias] = {
			duplicated: false
		};
	}	
}