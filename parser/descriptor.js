// <descriptor>
function parseDescriptor (parent) {
	var parentData = $(parent).find("> descriptor");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: ["id","focusIndex"],
		required: ["id"],
		optional: [
			"player","explicitDur","region","freeze","moveLeft","moveRight","moveUp","moveDown","focusIndex","focusBorderColor",
			"focusBorderWidth","focusBorderTransparency","focusSrc","focusSelSrc","selBorderColor","transIn","transOut"
		],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: [],
		star: ["descriptorParam"],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),															// !
			player: $(this).attr("player"),												// ?
			explicitDur: $(this).attr("explicitDur"),									// ?
			region: $(this).attr("region"),												// ?
			freeze: $(this).attr("freeze"),												// ?
			moveLeft: $(this).attr("moveLeft"),											// ?
			moveRight: $(this).attr(""),													// ?
			moveUp: $(this).attr("moveUp"),												// ?
			moveDown: $(this).attr("moveDown"),											// ?
			focusIndex: $(this).attr("focusIndex"),									// ?
			focusBorderColor: $(this).attr("focusBorderColor"),					// ?
			focusBorderWidth: $(this).attr("focusBorderWidth"),					// ?
			focusBorderTransparency: $(this).attr("focusBorderTransparency"),	// ?
			focusSrc: $(this).attr("focusSrc"),											// ?
			focusSelSrc: $(this).attr("focusSelSrc"),									// ?
			selBorderColor: $(this).attr("selBorderColor"),							// ?
			transIn: $(this).attr("transIn"),											// ?
			transOut: $(this).attr("transOut"),											// ?
			descriptorParam: parseDescriptorParam(this)								// *
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}