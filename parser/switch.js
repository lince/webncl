// <switch>
function parseSwitch (parent) {
	var parentData = $(parent).find("> parseSwitch");
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
		optional: ["defaultComponent"],
		one: [],
		plus: [],
		plusOneOf: [],
		star: ["switchPort","bindRule","media","context","switch"],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),										// !
			refer: $(this).attr("refer"),								// ?
			defaultComponent: parseDefaultComponent(this)[0],	// ?
			switchPort: parseSwitchPort(this),						// *
			bindRule: parseBindRule(this),							// *
			media: parseMedia(this),									// *
			context: parseContext(this),								// *
			switch: parseSwitch(this)									// *
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}