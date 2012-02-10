// <compositeRule>
function debugCompositeRule (obj,tag,parent,tree) {
	// operator
	values = ["and","or"];
	if (obj.operator!=null && jQuery.inArray(obj.operator,values)==-1) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["operator",obj.operator,values]);
	}	
}