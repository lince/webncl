// <defaultDescriptor>
function parseDefaultDescriptor (parent) {
	var parentData = $(parent).find("> defaultDescriptor");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["descriptor"],
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
			descriptor: $(this).attr("descriptor")		// !
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}