// <importBase>
function parseImportBase (parent) {
	var parentData = $(parent).find("> importBase");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["alias","documentURI"],
		optional: ["region"],
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
			alias: $(this).attr("alias"),					// !
			documentURI: $(this).attr("documentURI"),	// !
			region: $(this).attr("region")				// ?
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}