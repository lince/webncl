// <bindRule>
function debugBindRule (obj,debug,parent,tree) {
	// # constituent
	if (obj.constituent!=null) {
		var reference = debug.refTable.pop(obj.constituent);
		if (!reference || reference.type!="media") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["constituent",obj.constituent,["media"]]);
		}
	}
	// # rule
	if (obj.rule!=null) {
		var reference = debug.refTable.pop(obj.rule);
		if (!reference || reference.type!="rule") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["rule",obj.rule,["rule"]]);
		}
	}	
}