// <metadata>
function parseMetadata (parent) {
	var parentData = $(parent).find("> metadata");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: [],
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
		// do something here
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}