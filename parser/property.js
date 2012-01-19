// <property>
function parseProperty (parent) {
	var parentData = $(parent).find("> property");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: ["name"],
		ref_group: true,
		required: ["name"],
		optional: ["value"],
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
			name: $(this).attr("name"),	// !
			value: $(this).attr("value")	// ?
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}