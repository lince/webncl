// <bindParam>
function debugBindParam (obj,debug,parent,tree) {
	// # name
	if (obj.name!=null) {
		var reference = debug.refTable.pop(obj.name);
		if (!reference || reference.type!="connectorParam") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["name",obj.name,["connectorParam"]]);
		}
	}	
}