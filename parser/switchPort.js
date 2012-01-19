// <switchPort>
function parseSwitchPort (parent) {
	var parentData = $(parent).find("> switchPort");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["id"],
		optional: [],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: ["mapping"],
		plusOneOf: [],
		star: [],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),			// !
			mapping: parseMapping(this)	// +
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}