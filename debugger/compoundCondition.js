// <compoundCondition>
function debugCompoundCondition (obj,debug,parent,tree) {
	// operator
	values = ["and","or"];
	if (obj.operator!=null && jQuery.inArray(obj.operator,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["operator",obj.operator,values]);
	}
	// delay
	values = ["(número inteiro positivo)s"];
	patt = /^\s*\d+\s*s\s*$/;
	if (obj.delay!=null && !patt.test(obj.delay)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["delay",obj.delay,values]);
	}
}