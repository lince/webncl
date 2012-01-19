// <region>
function parseRegion (parent) {
	var parentData = $(parent).find("> region");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: ["id"],
		required: ["id"],
		optional: ["title","left","right","top","bottom","height","width","zIndex"],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: [],
		star: ["region"],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),				// !
			title: $(this).attr("title"),		// ?
			left: $(this).attr("left"),		// ?
			right: $(this).attr("right"),		// ?
			top: $(this).attr("top"),			// ?
			bottom: $(this).attr("bottom"),	// ?
			height: $(this).attr("height"),	// ?
			width: $(this).attr("width"),		// ?
			zIndex: $(this).attr("zIndex"),	// ?
			region: parseRegion(this),			// *
			parent: null
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}