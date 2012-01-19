// <assessmentStatement>
function parseAssessmentStatement (parent) {
	var parentData = $(parent).find("> assessmentStatement");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["comparator"],
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
		custom: ["attributeAssessment","valueAssessment"],
		validate: function (count,errors) {
			var c1 = count["attributeAssessment"];
			var c2 = count["valueAssessment"];
			if (c1 == 0) {
				errors.push({
					code: debug.ERR_MISSING_TAG,
					params: ["attributeAssessment"]
				});
			}
			if (c1 < 2 && c2 == 0) {
				errors.push({
					code: debug.ERR_MISSING_TAG_ONEOF,
					params: ["attributeAssessment","valueAssessment"]
				});
			}
			if (c1 == 2 && c2 > 0) {
				errors.push({
					code: debug.ERR_TOO_MANY_TAGS_ONEOF,
					params: ["attributeAssessment","valueAssessment"]
				});
			}
			if (c1 > 2) {
				errors.push({
					code: debug.ERR_TOO_MANY_TAGS,
					params: ["attributeAssessment"]
				});
			}
			if (c2 > 1) {
				errors.push({
					code: debug.ERR_TOO_MANY_TAGS,
					params: ["valueAssessment"]
				});
			}
		}
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			comparator: $(this).attr("comparator"),					// !
			attributeAssessment: parseAttributeAssessment(this),	// 1 | 2
			valueAssessment: parseValueAssessment(this)[0]			// 0 | 1
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}