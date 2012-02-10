// <context>
function debugContext (obj,tag,parent,tree) {
	// # refer
	if (obj.refer!=null) {
		var reference = Debugger.refTable.pop(obj.refer);
		if (!reference || (reference.type!="body" && reference.type!="context")) {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["refer",obj.refer,["body","context"]]);
		} else {
			obj.refer = reference.obj;
		}
	}
}