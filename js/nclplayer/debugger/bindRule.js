// <bindRule>
function debugBindRule (obj,tag,parent,tree) {
	// # constituent
	if (obj.constituent!=null) {
		var reference = Debugger.refTable.pop(obj.constituent);
		if (!reference || reference.type!="media") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["constituent",obj.constituent,["media"]]);
		} else {
			obj.constituent = reference.obj;
		}
	}
	// # rule
	if (obj.rule!=null) {
		var reference = Debugger.refTable.pop(obj.rule);
		if (!reference || reference.type!="rule") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["rule",obj.rule,["rule"]]);
		} else {
			obj.rule = reference.obj;
		}
	}	
}