// <simpleCondition>
function parseSimpleCondition (parent) {
	var parentData = $(parent).find("> simpleCondition");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["role"],
		optional: ["delay","eventType","key","transition","min","max","qualifier"],
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
			role: $(this).attr("role"),					// !
			delay: $(this).attr("delay"),					// ?
			eventType: $(this).attr("eventType"),		// ?
			key: $(this).attr("key"),						// ?
			transition: $(this).attr("transition"),	// ?
			min: $(this).attr("min"),						// ?
			max: $(this).attr("max"),						// ?
			qualifier: $(this).attr("qualifier")		// ?
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}