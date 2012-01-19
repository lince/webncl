// <mapping>
function parseMapping (parent) {
	var parentData = $(parent).find("> mapping");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["component"],
		optional: ["interface"],
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
			component: $(this).attr("component"),	// !
			interface: $(this).attr("interface")	// ?
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}