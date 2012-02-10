// <descriptor>
function debugDescriptor (obj,tag,parent,tree) {
	// # region
	if (obj.region!=null) {
		var reference = Debugger.refTable.pop(obj.region);
		if (!reference || reference.type!="region") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["region",obj.region,["region"]]);
		} else {
			obj.region = reference.obj;
		}
	}
	// # moveLeft
	if (obj.moveLeft!=null) {
		var reference = Debugger.refTable.pop(obj.moveLeft);
		if (!reference || reference.type!="focusIndex") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["moveLeft",obj.moveLeft,["focusIndex"]]);
		} else {
			obj.moveLeft = reference.obj;
		}
	}
	// # moveRight
	if (obj.moveRight!=null) {
		var reference = Debugger.refTable.pop(obj.moveRight);
		if (!reference || reference.type!="focusIndex") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["moveRight",obj.moveRight,["focusIndex"]]);
		} else {
			obj.moveRight = reference.obj;
		}
	}
	// # moveUp
	if (obj.moveUp!=null) {
		var reference = Debugger.refTable.pop(obj.moveUp);
		if (!reference || reference.type!="focusIndex") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["moveUp",obj.moveUp,["focusIndex"]]);
		} else {
			obj.moveUp = reference.obj;
		}
	}
	// # moveDown
	if (obj.moveDown!=null) {
		var reference = Debugger.refTable.pop(obj.moveDown);
		if (!reference || reference.type!="focusIndex") {
			Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["moveDown",obj.moveDown,["focusIndex"]]);
		} else {
			obj.moveDown = reference.obj;
		}
	}
	// # transIn
	if (obj.transIn!=null) {
		var list = obj.transIn.split(";");
		var refList = [];
		for (id in list) {
			var reference = Debugger.refTable.pop(list[id]);
			if (!reference || reference.type!="transition") {
				Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["transIn",list[id],["transition"]]);
			} else {
				refList.push(reference.obj);
			}
		}
		obj.transIn = refList;
	}
	// # transOut
	if (obj.transOut!=null) {
		var list = obj.transOut.split(";");
		var refList = [];
		for (id in list) {
			var reference = Debugger.refTable.pop(list[id]);
			if (!reference || reference.type!="transition") {
				Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,tag,["transOut",list[id],["transition"]]);
			} else {
				refList.push(reference.obj);
			}
		}
		obj.transIn = refList;
	}
	// explicitDur
	values = ["(número inteiro)s"];
	patt = /^\d+s$/;
	if (obj.explicitDur!=null && !patt.test(obj.explicitDur)) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["explicitDur",obj.explicitDur,values]);
	}
	// freeze
	values = ["true","false"];
	if (obj.freeze!=null && jQuery.inArray(obj.freeze,values)==-1) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["freeze",obj.freeze,values]);
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
				Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,[attr,value,values]);
			}
		}
	}
	// focusBorderWidth
	values = ["(número inteiro)"];
	patt = /^-?\d+$/;
	if (obj.focusBorderWidth!=null && !patt.test(obj.focusBorderWidth)) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["focusBorderWidth",obj.focusBorderWidth,values]);
	}
	// focusBorderTransparency
	values = ["(número real entre 0 e 1)","(número real entre 0 e 100)%"];
	patt = /^((0?\.\d+|1(\.0+)?)|(\d?\d?\.\d+|100(\.0+)?)%)$/;
	if (obj.focusBorderTransparency!=null && !patt.test(obj.focusBorderTransparency)) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["focusBorderTransparency",obj.focusBorderTransparency,values]);
	}	
}