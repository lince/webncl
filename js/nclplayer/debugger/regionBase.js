// <regionBase>
function debugRegionBase (obj,tag,parent,tree) {
	// device
	values = ["systemScreen(i)","systemAudio(i)"];
	patt = /^systemScreen\(\d+\)$|^systemAudio\(\d+\)$/;
	if (obj.device!=null && !patt.test(obj.device)) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["device",obj.device,values]);
	}	
}