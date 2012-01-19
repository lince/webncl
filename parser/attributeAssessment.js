// <attributeAssessment>
function parseAttributeAssessment (parent) {
	var parentData = $(parent).find("> attributeAssessment");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["role","eventType","attributeType"],
		optional: ["key","offset"],
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
			role: $(this).attr("role"),							// !
			eventType: $(this).attr("eventType"),				// !
			key: $(this).attr("key"),								// ?
			attributeType: $(this).attr("attributeType"),	// !
			offset: $(this).attr("offset")						// ?
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}