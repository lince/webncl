// <defaultDescriptor>
function debugDefaultDescriptor (obj,debug,parent,tree) {
	// # descriptor
	if (obj.descriptor!=null) {
		var reference = debug.refTable.pop(obj.descriptor);
		if (!reference || reference.type!="descriptor") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["descriptor",obj.descriptor,["descriptor"]]);
		}
	}	
}