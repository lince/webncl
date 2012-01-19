// <descriptorBase>
function parseDescriptorBase (parent) {
	var parentData = $(parent).find("> descriptorBase");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: [],
		optional: ["id"],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: [],
		one: [],
		plus: [],
		plusOneOf: ["importBase","descriptor","descriptorSwitch"],
		star: [],
		custom: []
	};
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			id: $(this).attr("id"),									// ?
			importBase: parseImportBase(this),					// |+
			descriptor: parseDescriptor(this),					// |+
			descriptorSwitch: parseDescriptorSwitch(this)	// |+
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);
	});
	return data;
}