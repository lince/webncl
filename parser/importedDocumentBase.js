// <importedDocumentBase>
function parseImportedDocumentBase (parent) {
	var parentData = $(parent).find("> importedDocumentBase");
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
		plus: ["importNCL"],
		plusOneOf: [],
		star: [],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),				// ?
			importNCL: parseImportNCL(this)	// +
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}