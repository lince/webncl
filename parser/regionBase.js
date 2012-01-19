// <regionBase>
function parseRegionBase (parent) {
	var parentData = $(parent).find("> regionBase");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: [],
		optional: ["id","device"],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: ["importBase","region"],
		star: [],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),					// ?
			device: $(this).attr("device"),		// ?
			importBase: parseImportBase(this),	// |+
			region: parseRegion(this)				// |+
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}