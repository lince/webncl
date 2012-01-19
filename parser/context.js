// <context>
function parseContext (parent) {
	var parentData = $(parent).find("> context");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: ["id"],
		required: ["id"],
		optional: ["refer"],
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
			id: $(this).attr("id"),				// !
			refer: $(this).attr("refer"),		// ?
			port: parsePort(this),				// *
			property: parseProperty(this),	// *
			media: parseMedia(this),			// *
			context: parseContext(this),		// *
			switch: parseSwitch(this),			// *
			link: parseLink(this)				// *
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}