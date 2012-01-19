// <ncl>
function debugNCL (obj,debug,parent,tree) {
	values = [
		"http://www.ncl.org.br/NCL3.0/EDTVProfile",
		"http://www.ncl.org.br/NCL3.0/BDTVProfile",
		"http://www.ncl.org.br/NCL3.0/CausalConnectorProfile"
	];
	if (obj.xmlns!=null && jQuery.inArray(obj.xmlns,values)==-1) {
		debug.error(debug.ERR_INVALID_ATTR_VALUE,tag,["xmlns",obj.xmlns,values]);
	}
}