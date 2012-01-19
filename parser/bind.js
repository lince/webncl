// <bind>
function parseBind (parent) {
	var parentData = $(parent).find("> bind");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["role","component"],
		optional: ["interface","descriptor"],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: [],
		star: ["bindParam"],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			role: $(this).attr("role"),					// !
			component: $(this).attr("component"),		// !
			interface: $(this).attr("interface"),		// ?
			descriptor: $(this).attr("descriptor"),	// ?
			bindParam: parseBindParam(this)				// *
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}