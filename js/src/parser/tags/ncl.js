// <ncl>
Parser.prototype.parseNCL = function (obj,tag,parent,tree) {
	// xmlns
	values = [
		"http://www.ncl.org.br/NCL3.0/EDTVProfile",
		"http://www.ncl.org.br/NCL3.0/BDTVProfile",
		"http://www.ncl.org.br/NCL3.0/CausalConnectorProfile"
	];
	if (obj.xmlns!=null && jQuery.inArray(obj.xmlns,values)==-1) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["xmlns",obj.xmlns,values]);
	}
};