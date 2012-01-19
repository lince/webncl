// <descriptorSwitch>
function parseDescriptorSwitch (parent) {
	var parentData = $(parent).find("> descriptorSwitch");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: ["id"],
		optional: [],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: ["defaultDescriptor"],
		one: [],
		plus: [],
		plusOneOf: [],
		star: ["bindRule","descriptor"],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),											// !
			defaultDescriptor: parseDefaultDescriptor(this)[0],	// ?
			bindRule: parseBindRule(this),								// *
			descriptor: parseDescriptor(this)							// *
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}