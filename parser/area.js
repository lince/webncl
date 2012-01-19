// <area>
function parseArea (parent) {
	var parentData = $(parent).find("> area");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: ["id"],
		required: ["id"],
		optional: ["coords","begin","end","text","position","first","last","label"],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: [],
		star: [],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),					// !
			coords: $(this).attr("coords"),		// ?
			begin: $(this).attr("begin"),			// ?
			end: $(this).attr("end"),				// ?
			text: $(this).attr("text"),			// ?
			position: $(this).attr("position"),	// ?
			first: $(this).attr("first"),			// ?
			last: $(this).attr("last"),			// ?
			label: $(this).attr("label")			// ?
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}