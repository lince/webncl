// <body>
function parseBody (parent) {
	var parentData = $(parent).find("> body");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: ["id"],
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
		star: ["port","property","media","context","switch","link"],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),				// ?
			port: parsePort(this),				// *
			property: parseProperty(this),	// *
			media: parseMedia(this),			// *
			context: parseContext(this),		// *
			switch: parseSwitch(this),			// *
			link: parseLink(this)				// *
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data[0];
}