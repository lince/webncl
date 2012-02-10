// <defaultComponent>
function debugDefaultComponent (obj,tag,parent,tree) {
	// # component
	if (obj.component!=null) {
		var reference = Debugger.refTable.pop(obj.component);
		if (!reference || (reference.type!="context" && reference.type!="media")) {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["component",obj.component,["context","media"]]);
		} else {
			obj.component = reference.obj;
		}
	}	
}