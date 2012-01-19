// <compositeRule>
function parseCompositeRule (parent) {
	var parentData = $(parent).find("> compositeRule");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["id","operator"],
		optional: [],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: ["rule","compositeRule"],
		star: [],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),							// !
			operator: $(this).attr("operator"),			// !
			rule: parseRule(this),							// |+
			compositeRule: parseCompositeRule(this)	//	|+
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}