// <property>
function debugProperty (obj,tag,parent,tree) {
	// name
	values = [
		"system.language","system.caption","system.subtitle","system.returnBitRate(i)","system.screenSize",
		"system.screenGraphicSize","system.audioType","system.screenSize(i)","system.screenGraphicSize(i)",
		"system.audioType(i)","system.devNumber(i)","system.classType(i)","system.info(i)","system.classNumber",
		"system.CPU","system.memory","system.operatingSystem","system.javaConfiguration","system.javaProfile",
		"system.luaVersion","user.age","user.location","user.genre","default.focusBorderColor",
		"default.selBorderColor","default.focusBorderWidth","default.focusBorderTransparency",
		"service.currentFocus","service.currentKeyMaster","si.numberOfServices","si.numberOfPartialServices",
		"si.channelNumber","channel.keyCapture","channel.virtualKeyBoard","channel.keyboardBounds"
	];
	if (obj.name!=null && jQuery.inArray(obj.name,values)==-1) {
		patt = /^system\.(returnBitRate|screenSize|screenGraphicSize|audioType|devNumber|classType|info)\(\d+\)$/;
		if (!patt.test(obj.name)) {
			//Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["name",obj.name,values]);
		}
	}	
}