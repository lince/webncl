// <compoundCondition>
Parser.prototype.parseCompoundCondition = function (obj,tag,parent,tree) {
	// operator
	values = ["and","or"];
	if (obj.operator!=null && jQuery.inArray(obj.operator,values)==-1) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["operator",obj.operator,values]);
	}
	// delay
	values = ["(número inteiro positivo)s"];
	patt = /^\d+s$/;
	if (obj.delay!=null && !patt.test(obj.delay)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["delay",obj.delay,values]);
	}
};