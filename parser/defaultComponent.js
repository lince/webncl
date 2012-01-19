// <defaultComponent>
function parseDefaultComponent (parent) {
	var parentData = $(parent).find("> defaultComponent");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["component"],
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
			component: $(this).attr("component")	// !
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}