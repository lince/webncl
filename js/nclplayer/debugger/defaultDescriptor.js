// <defaultDescriptor>
function debugDefaultDescriptor (obj,tag,parent,tree) {
	// # descriptor
	if (obj.descriptor!=null) {
		var reference = Debugger.refTable.pop(obj.descriptor);
		if (!reference || reference.type!="descriptor") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["descriptor",obj.descriptor,["descriptor"]]);
		} else {
			obj.descriptor = reference.obj;
		}
	}	
}