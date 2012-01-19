// <port>
function debugPort (obj,debug,parent,tree) {
	// # component
	if (obj.component!=null) {
		var reference = debug.refTable.pop(obj.component);
		if (!reference || (reference.type!="context" && reference.type!="media")) {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["component",obj.component,["context","media"]]);
		}
	}
	// # interface
	if (obj.component!=null && obj.interface!=null) {
		var reference = debug.refTable.pop(obj.interface);
		var component = debug.refTable.pop(obj.component);
		if (component && reference) {
			if (component.type=="context") {
				if (reference.type!="media") {
					debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["interface",obj.interface,["context"]]);
				}
			} else if (component.type=="media") {
				if (reference.type!="area" && reference.type!="property") {
					debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["interface",obj.interface,["area","property"]]);
				}
			}
		}
	}	
}