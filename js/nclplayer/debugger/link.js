// <link>
function debugLink (obj,tag,parent,tree) {
	// # xconnector
	if (obj.xconnector!=null) {
		var reference = Debugger.refTable.pop(obj.xconnector);
		if (!reference || reference.type!="causalConnector") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["xconnector",obj.xconnector,["causalConnector"]]);
		} else {
			obj.xconnector = reference.obj;
		}
	}
}