// <meta>
function parseMeta (parent) {
	var parentData = $(parent).find("> meta");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["name","content"],
		optional: [],
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
			name: $(this).attr("name"),		// !
			content: $(this).attr("content")	// !
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}