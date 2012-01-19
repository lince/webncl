// <rule>
function parseRule (parent) {
	var parentData = $(parent).find("> rule");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["id","var","comparator","value"],
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
			id: $(this).attr("id"),							// !
			var: $(this).attr("var"),						// !
			comparator: $(this).attr("comparator"),	// !
			value: $(this).attr("value")					// !
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}