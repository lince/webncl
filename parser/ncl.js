// <ncl>
function parseNCL (xml) {
	var parentData = $(xml).find("ncl");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: [],
		optional: ["id","title","xmlns"],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: ["head","body"],
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
			id: $(this).attr("id"),			// ?
			title: $(this).attr("title"),	// ?
			xmlns: $(this).attr("xmlns"),	// ?
			head: parseHead(this),			// ?
			body: parseBody(this)			// ?
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	debug.checkObj(data[0],"ncl","");
	return data[0];
}