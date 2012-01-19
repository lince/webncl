// <simpleAction>
function parseSimpleAction (parent) {
	var parentData = $(parent).find("> simpleAction");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["role"],
		optional: ["delay","eventType","actionType","value","min","max","qualifier","repeat","repeatDelay","duration","by"],
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
			actionType: $(this).attr("actionType"),	// ?
			value: $(this).attr("value"),					// ?
			min: $(this).attr("min"),						// ?
			max: $(this).attr("max"),						// ?
			qualifier: $(this).attr("qualifier"),		// ?
			repeat: $(this).attr("repeat"),				// ?
			repeatDelay: $(this).attr("repeatDelay"),	// ?
			duration: $(this).attr("duration"),			// ?
			by: $(this).attr("by")							// ?
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}