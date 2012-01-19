// <transition>
function debugTransition (obj,debug,parent,tree) {
	// type
	values = ["barWipe","irisWipe","clockWipe","snackWipe","fade"];
	if (obj.type!=null && jQuery.inArray(obj.type,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["type",obj.type,values]);
	}
	// dur
	values = ["(número inteiro positivo)s"];
	patt = /^\s*\d+\s*s\s*$/;
	if (obj.dur!=null && !patt.test(obj.dur)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["dur",obj.dur,values]);
	}
	// startProgress, endProgress
	values = ["(número real entre 0 e 1)"];
	patt = /^\s*(0*\.\d+|1\.0)\s*$/;
	if (obj.startProgress!=null && !patt.test(obj.startProgress)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["startProgress",obj.startProgress,values]);
	}
	if (obj.endProgress!=null && !patt.test(obj.endProgress)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["endProgress",obj.endProgress,values]);
	}
	// direction
	values = ["forward","reverse"];
	if (obj.direction!=null && jQuery.inArray(obj.direction,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["direction",obj.direction,values]);
	}
	// fadeColor
	values = [
		"white","black","silver","gray","red","maroon","fuchsia","purple","lime",
		"green","yellow","olive","blue","navy","aqua","teal"
	];
	if (obj.fadeColor!=null && jQuery.inArray(obj.fadeColor,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["fadeColor",obj.fadeColor,values]);
	}
	// horRepeat
	values = ["(número inteiro não negativo)"];
	patt = /^\s*\d+\s*$/;
	if (obj.horRepeat!=null && patt.test(obj.horRepeat,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["horRepeat",obj.horRepeat,values]);
	}
	// vertRepeat
	values = ["(número inteiro não negativo)"];
	patt = /^\s*\d+\s*$/;
	if (obj.vertRepeat!=null && patt.test(obj.vertRepeat,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["vertRepeat",obj.vertRepeat,values]);
	}
	// borderWidth
	values = ["(número inteiro não negativo)"];
	patt = /^\s*\d+\s*$/;
	if (obj.borderWidth!=null && patt.test(obj.borderWidth,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["borderWidth",obj.borderWidth,values]);
	}
	// borderColor
	values = [
		"white","black","silver","gray","red","maroon","fuchsia","purple","lime",
		"green","yellow","olive","blue","navy","aqua","teal","blend"
	];
	if (obj.borderColor!=null && jQuery.inArray(obj.borderColor,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["borderColor",obj.borderColor,values]);
	}	
}