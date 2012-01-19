// <link>
function parseLink (parent) {
	var parentData = $(parent).find("> link");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["xconnector"],
		optional: ["id"],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: ["bind"],
		plusOneOf: [],
		star: ["linkParam"],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),							// ?
			xconnector: $(this).attr("xconnector"),	// !
			linkParam: parseLinkParam(this),				// *
			bind: parseBind(this)							// +
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}