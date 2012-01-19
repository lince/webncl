// <rule>
function debugRule (obj,debug,parent,tree) {
	// # var
	if (obj.var!=null) {
		var reference = debug.refTable.pop(obj.var);
		if (!reference || reference.type!="property") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["var",obj.var,["property"]]);
		}
	}
	// comparator
	values = ["eq","ne","gt","lt","gte","lte"];
	if (obj.comparator!=null && jQuery.inArray(obj.comparator,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["comparator",obj.comparator,values]);
	}	
}