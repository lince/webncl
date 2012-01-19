// <regionBase>
function debugRegionBase (obj,debug,parent,tree) {
	// device
	values = ["systemScreen(i)","systemAudio(i)"];
	patt = /^\s*systemScreen\s*\(\s*\d+\s*\)\s*$|^\s*systemAudio\s*\(\s*\d+\s*\)\s*$/;
	if (obj.device!=null && !patt.test(obj.device)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["device",obj.device,values]);
	}	
}