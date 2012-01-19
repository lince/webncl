// <connectorBase>
function parseConnectorBase (parent) {
	var parentData = $(parent).find("> connectorBase");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: [],
		optional: ["id"],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: [],
		star: ["importBase","causalConnector"],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),								// ?
			importBase: parseImportBase(this),				// *
			causalConnector: parseCausalConnector(this)	// *
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}