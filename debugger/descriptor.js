// <descriptor>
function debugDescriptor (obj,debug,parent,tree) {
	// # region
	if (obj.region!=null) {
		var reference = debug.refTable.pop(obj.region);
		if (!reference || reference.type!="region") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["region",obj.region,["region"]]);
		}
	}
	// # moveLeft
	if (obj.moveLeft!=null) {
		var reference = debug.refTable.pop(obj.moveLeft);
		if (!reference || reference.type!="focusIndex") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["moveLeft",obj.moveLeft,["focusIndex"]]);
		}
	}
	// # moveRight
	if (obj.moveRight!=null) {
		var reference = debug.refTable.pop(obj.moveRight);
		if (!reference || reference.type!="focusIndex") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["moveRight",obj.moveRight,["focusIndex"]]);
		}
	}
	// # moveUp
	if (obj.moveUp!=null) {
		var reference = debug.refTable.pop(obj.moveUp);
		if (!reference || reference.type!="focusIndex") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["moveUp",obj.moveUp,["focusIndex"]]);
		}
	}
	// # moveDown
	if (obj.moveDown!=null) {
		var reference = debug.refTable.pop(obj.moveDown);
		if (!reference || reference.type!="focusIndex") {
			debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["moveDown",obj.moveDown,["focusIndex"]]);
		}
	}
	// # transIn
	if (obj.transIn!=null) {
		var list = obj.transIn.split(";");
		for (id in list) {
			var reference = debug.refTable.pop(list[id]);
			if (!reference || reference.type!="transition") {
				debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["transIn",list[id],["transition"]]);
			}
		}
	}
	// # transOut
	if (obj.transOut!=null) {
		var list = obj.transOut.split(";");
		for (id in list) {
			var reference = debug.refTable.pop(list[id]);
			if (!reference || reference.type!="transition") {
				debug.error(debug.ERR_INVALID_ID_REFERENCE,tag,["transOut",list[id],["transition"]]);
			}
		}
	}
	// explicitDur
	values = ["(número inteiro)s"];
	patt = /^\s*\d+\s*s\s*$/;
	if (obj.explicitDur!=null && !patt.test(obj.explicitDur)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["explicitDur",obj.explicitDur,values]);
	}
	// freeze
	values = ["true","false"];
	if (obj.freeze!=null && jQuery.inArray(obj.freeze,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["freeze",obj.freeze,values]);
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
				debug.error(this.ERR_INVALID_ATTR_VALUE,tag,[attr,value,values]);
			}
		}
	}
	// focusBorderWidth
	values = ["(número inteiro)"];
	patt = /^\s*-?\d+\s*$/;
	if (obj.focusBorderWidth!=null && !patt.test(obj.focusBorderWidth)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["focusBorderWidth",obj.focusBorderWidth,values]);
	}
	// focusBorderTransparency
	values = ["(número real entre 0 e 1)","(número real entre 0 e 100)%"];
	patt = /^\s*((0?\.\d+|1(\.0+)?)|(\d?\d?\.\d+|100(\.0+)?)%)\s*$/;
	if (obj.focusBorderTransparency!=null && !patt.test(obj.focusBorderTransparency)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["focusBorderTransparency",obj.focusBorderTransparency,values]);
	}	
}