// <context>
function debugContext (obj,debug,parent,tree) {
	// # refer
	if (obj.refer!=null) {
		var reference = debug.refTable.pop(obj.refer);
		if (!reference || (reference.type!="body" && reference.type!="context")) {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["refer",obj.refer,["body","context"]]);
		}
	}
}