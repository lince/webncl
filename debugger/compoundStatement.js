// <compoundStatement>
function debugCompoundStatement (obj,debug,parent,tree) {
	// operator
	values = ["or","and"];
	if (obj.operator!=null && jQuery.inArray(obj.operator,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["operator",obj.operator,values]);
	}
	// isNegated
	values = ["true","false"];
	if (obj.isNegated!=null && jQuery.inArray(obj.isNegated,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["isNegated",obj.isNegated,values]);
	}
}