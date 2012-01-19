// <valueAssessment>
function parseValueAssessment (parent) {
	var parentData = $(parent).find("> valueAssessment");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["value"],
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
			value: $(this).attr("value")	// !
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}