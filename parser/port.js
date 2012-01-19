// <port>
function parsePort (parent) {
	var parentData = $(parent).find("> port");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["id","component"],
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
			id: $(this).attr("id"),						// !
			component: $(this).attr("component"),	// !
			interface: $(this).attr("interface")	// ?
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}