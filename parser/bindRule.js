// <bindRule>
function parseBindRule (parent) {
	var parentData = $(parent).find("> bindRule");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["constituent","rule"],
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
			constituent: $(this).attr("constituent"),	// !
			rule: $(this).attr("rule")						// !
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}