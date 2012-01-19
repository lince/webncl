// <compoundAction>
function parseCompoundAction (parent) {
	var parentData = $(parent).find("> compoundAction");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["operator"],
		optional: ["delay"],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: ["simpleAction","compoundAction"],
		star: [],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			operator: $(this).attr("operator"),			// !
			delay: $(this).attr("delay"),					// ?
			simpleAction: parseSimpleAction(this),		// |+
			compoundAction: parseCompoundAction(this)	// |+
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}