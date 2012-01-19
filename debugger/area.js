// <area>
function debugArea (obj,debug,parent,tree) {
	// begin, end
	values = ["(número inteiro)s"];
	patt = /^\s*\d+\s*s\s*$/;
	if (obj.begin!=null && !patt.test(obj.begin)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["begin",obj.begin,values]);
	}
	if (obj.end!=null && !patt.test(obj.end)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["end",obj.end,values]);
	}
	if (parent.type=="application/x-ginga-time" && (obj.begin==null && obj.end==null)) {
		debug.error(debug.ERR_MISSING_ATTR,tag,["begin","end"]);
	}
	// first, last
	values = ["(número inteiro)"];
	patt = /^\s*\d+\s*$/;
	if (obj.first!=null && !patt.test(obj.first)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["first",obj.first,values]);
	}
	if (obj.last!=null && !patt.test(obj.last)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["last",obj.last,values]);
	}
}