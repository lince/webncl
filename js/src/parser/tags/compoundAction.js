// <compoundAction>
Parser.prototype.parseCompoundAction = function (obj,tag,parent,tree) {
	// operator
	values = ["par","seq"];
	if (obj.operator!=null && jQuery.inArray(obj.operator,values)==-1) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["operator",obj.operator,values]);
	}	
};