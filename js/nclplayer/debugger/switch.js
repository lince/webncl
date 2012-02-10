// <switch>
function debugSwitch (obj,tag,parent,tree) {
	// # refer
	if (obj.refer!=null) {
		var reference = Debugger.refTable.pop(obj.refer);
		if (!reference || reference.type!="switch") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["refer",obj.refer,["switch"]]);
		} else {
			obj.refer = reference.obj;
		}
	}	
}