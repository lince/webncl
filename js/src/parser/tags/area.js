// <area>
Parser.prototype.parseArea = function (obj,tag,parent,tree) {
	// begin, end
	values = ["(número inteiro)s"];
	patt = /^\d+s$/;
	if (obj.begin!=null && !patt.test(obj.begin)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["begin",obj.begin,values]);
	}
	if (obj.end!=null && !patt.test(obj.end)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["end",obj.end,values]);
	}
	if (parent.type=="application/x-ginga-time" && (obj.begin==null && obj.end==null)) {
		Debugger.error(Debugger.ERR_MISSING_ATTR,tag,["begin","end"]);
	}
	// first, last
	values = ["(número inteiro)"];
	patt = /^\d+$/;
	if (obj.first!=null && !patt.test(obj.first)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["first",obj.first,values]);
	}
	if (obj.last!=null && !patt.test(obj.last)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["last",obj.last,values]);
	}
};