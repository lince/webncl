// <media>
function parseMedia (parent) {
	var parentData = $(parent).find("> media");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: ["id"],
		required: ["id"],
		optional: ["refer","instance","descriptor"],
		oneOf: ["type","src"],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: [],
		star: ["area","property"],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),							// !
			src: $(this).attr("src"),						// ?
			refer: $(this).attr("refer"),					// ?
			instance: $(this).attr("instance"),			// ?
			type: $(this).attr("type"),					// ?
			descriptor: $(this).attr("descriptor"),	// ?
			area: parseArea(this),							// *
			property: parseProperty(this)					// *
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}