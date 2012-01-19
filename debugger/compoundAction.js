// <compoundAction>
function debugCompoundAction (obj,debug,parent,tree) {
	// operator
	values = ["par","seq"];
	if (obj.operator!=null && jQuery.inArray(obj.operator,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["operator",obj.operator,values]);
	}	
}