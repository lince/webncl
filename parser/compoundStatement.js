// <compoundStatement>
function parseCompoundStatement (parent) {
	var parentData = $(parent).find("> compoundStatement");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["operator"],
		optional: ["isNegated"],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: ["assessmentStatement","compoundStatement"],
		star: [],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			operator: $(this).attr("operator"),							// !
			isNegated: $(this).attr("isNegated"),						// ?
			assessmentStatement: parseAssessmentStatement(this),	// |+
			compoundStatement: parseCompoundStatement(this)			// |+
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}