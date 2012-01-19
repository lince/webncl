// <compoundCondition>
function parseCompoundCondition (parent) {
	var parentData = $(parent).find("> compoundCondition");
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
		plusOneOf: ["simpleCondition","compoundCondition"],
		star: ["assessmentStatement","compoundStatement"],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			operator: $(this).attr("operator"),							// !
			delay: $(this).attr("delay"),									// ?
			simpleCondition: parseSimpleCondition(this),				// |+
			compoundCondition: parseCompoundCondition(this),		// |+
			assessmentStatement: parseAssessmentStatement(this),	// *
			compoundStatement: parseCompoundStatement(this)			// *
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}