// <causalConnector>
function parseCausalConnector (parent) {
	var parentData = $(parent).find("> causalConnector");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["id"],
		optional: [],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: [],
		star: ["connectorParam"],
		custom: ["simpleCondition","compoundCondition","simpleAction","compoundAction"],
		validate: function (count,errors) {
			// Condições
			if (count["simpleCondition"]==0 && count["compoundCondition"]==0) {
				errors.push({
					code: debug.ERR_MISSING_TAG_ONEOF,
					params: ["simpleCondition","compoundCondition"]
				});
			} else if (count["simpleCondition"]>0 && count["compoundCondition"]>0) {
				errors.push({
					code: debug.ERR_TOO_MANY_TAGS_ONEOF,
					params: ["simpleCondition","compoundCondition"]
				});
			} else if (count["simpleCondition"]>1) {
				errors.push({
					code: debug.ERR_TOO_MANY_TAGS,
					params: ["simpleCondition"]
				});
			} else if (count["compoundCondition"]>1) {
				errors.push({
					code: debug.ERR_TOO_MANY_TAGS,
					params: ["compoundCondition"]
				});
			}
			// Ações
			if (count["simpleAction"]==0 && count["compoundAction"]==0) {
				errors.push({
					code: debug.ERR_MISSING_TAG_ONEOF,
					params: ["simpleAction","compoundAction"]
				});
			} else if (count["simpleAction"]>0 && count["compoundAction"]>0) {
				errors.push({
					code: debug.ERR_TOO_MANY_TAGS_ONEOF,
					params: ["simpleAction","compoundAction"]
				});
			} else if (count["simpleAction"]>1) {
				errors.push({
					code: debug.ERR_TOO_MANY_TAGS,
					params: ["simpleAction"]
				});
			} else if (count["compoundAction"]>1) {
				errors.push({
					code: debug.ERR_TOO_MANY_TAGS,
					params: ["compoundAction"]
				});
			}
		}
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),											// !
			connectorParam: parseConnectorParam(this),				// *
			simpleCondition: parseSimpleCondition(this)[0],			// |1(1)
			compoundCondition: parseCompoundCondition(this)[0],	// |1(1)
			simpleAction: parseSimpleAction(this)[0],					// |1(2)
			compoundAction: parseCompoundAction(this)[0]				// |1(2)
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}