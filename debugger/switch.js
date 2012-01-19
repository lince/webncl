// <switch>
function debugSwitch (obj,debug,parent,tree) {
	// # refer
	if (obj.refer!=null) {
		var reference = debug.refTable.pop(obj.refer);
		if (!reference || reference.type!="switch") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["refer",obj.refer,["switch"]]);
		}
	}	
}