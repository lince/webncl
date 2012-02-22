// <descriptor>
Parser.prototype.parseDescriptor = function (obj,tag,parent,tree) {
	// explicitDur
	values = ["(número inteiro)s"];
	patt = /^\d+s$/;
	if (obj.explicitDur!=null && !patt.test(obj.explicitDur)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["explicitDur",obj.explicitDur,values]);
	}
	// freeze
	values = ["true","false"];
	if (obj.freeze!=null && jQuery.inArray(obj.freeze,values)==-1) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["freeze",obj.freeze,values]);
	}
	// focusBorderColor, selBorderColor
	attrs = ["focusBorderColor","selBorderColor"];
	values = [
		"white","black","silver","gray","red","maroon","fuchsia","purple","lime",
		"green","yellow","olive","blue","navy","aqua","teal"
	];
	for (var i in attrs) {
		attr = attrs[i];
		value = obj[attr];
		if (value != null) {
			if (jQuery.inArray(value,values)==-1) {
				Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,[attr,value,values]);
			}
		}
	}
	// focusBorderWidth
	values = ["(número inteiro)"];
	patt = /^-?\d+$/;
	if (obj.focusBorderWidth!=null && !patt.test(obj.focusBorderWidth)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["focusBorderWidth",obj.focusBorderWidth,values]);
	}
	// focusBorderTransparency
	values = ["(número real entre 0 e 1)","(número real entre 0 e 100)%"];
	patt = /^((0?\.\d+|1(\.0+)?)|(\d?\d?\.\d+|100(\.0+)?)%)$/;
	if (obj.focusBorderTransparency!=null && !patt.test(obj.focusBorderTransparency)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["focusBorderTransparency",obj.focusBorderTransparency,values]);
	}	
};