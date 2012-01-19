// <transition>
function parseTransition (parent) {
	var parentData = $(parent).find("> transition");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: ["id"],
		required: ["id","type"],
		optional: ["subtype","dur","startProgress","endProgress","direction","fadeColor","horRepeat","vertRepeat","borderWidth","borderColor"],
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
			id: $(this).attr("id"),									// !
			type: $(this).attr("type"),							// !
			subtype: $(this).attr("subtype"),					// ?
			dur: $(this).attr("dur"),								// ?
			startProgress: $(this).attr("startProgress"),	// ?
			endProgress: $(this).attr("endProgress"),			// ?
			direction: $(this).attr("direction"),				// ?
			fadeColor: $(this).attr("fadeColor"),				// ?
			horRepeat: $(this).attr("horRepeat"),				// ?
			vertRepeat: $(this).attr("vertRepeat"),			// ?
			borderWidth: $(this).attr("borderWidth"),			// ?
			borderColor: $(this).attr("borderColor")			// ?
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}