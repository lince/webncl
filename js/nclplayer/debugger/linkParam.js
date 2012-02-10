// <linkParam>
function debugLinkParam (obj,tag,parent,tree) {
	// # name
	if (obj.name!=null) {
		var reference = Debugger.refTable.pop(obj.name);
		if (!reference || reference.type!="connectorParam") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["name",obj.name,["connectorParam"]]);
		} else {
			obj.name = reference.obj;
		}
	}	
}