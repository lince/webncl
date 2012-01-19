// <defaultComponent>
function debugDefaultComponent (obj,debug,parent,tree) {
	// # component
	if (obj.component!=null) {
		var reference = debug.refTable.pop(obj.component);
		if (!reference || (reference.type!="context" && reference.type!="media")) {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["component",obj.component,["context","media"]]);
		}
	}	
}