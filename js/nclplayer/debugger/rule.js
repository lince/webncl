// <rule>
function debugRule (obj,tag,parent,tree) {
	// # var
	if (obj['var']!=null) {
		var reference = Debugger.refTable.pop(obj['var']);
		if (!reference || reference.type!="property") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["var",obj['var'],["property"]]);
		} else {
			obj['var'] = reference.obj;
		}
	}
	// comparator
	values = ["eq","ne","gt","lt","gte","lte"];
	if (obj.comparator!=null && jQuery.inArray(obj.comparator,values)==-1) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["comparator",obj.comparator,values]);
	}	
}
