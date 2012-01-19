// <head>
function parseHead (parent) {
	var parentData = $(parent).find("> head");
	if ($(parentData).length == 0) return false;
	// Debug
	var attr = {
		reference: [],
		required: [],
		optional: [],
		oneOf: [],
		custom: []
	};
	var tags = {
		optional: ["importedDocumentBase","ruleBase","transitionBase","descriptorBase"],
		one: [],
		plus: ["connectorBase"],
		plusOneOf: [],
		star: ["regionBase","meta","metadata"],
		custom: []
	};
	var headChildren = ["importedDocumentBase","ruleBase","transitionBase","regionBase","descriptorBase","connectorBase","meta","metadata"];
	var hc = [];
	$(parentData).find("> *").each(function() {
		while (headChildren.length>0 && $(this).get(0).tagName!=headChildren[0]) {
			hc.push(headChildren.splice(0,1));
			if (headChildren.length==0) {
				debug.warning(debug.WARN_INVALID_HEAD_STRUCTURE,"head",hc);
			}
		}
	});
	// Parse
	var data = [];
	$(parentData).each(function() {
		data.push({
			importedDocumentBase: parseImportedDocumentBase(this)[0],	// ?
			ruleBase: parseRuleBase(this)[0],									// ?
			transitionBase: parseTransitionBase(this)[0],					// ?
			regionBase: parseRegionBase(this),									// *
			descriptorBase: parseDescriptorBase(this)[0],					// ?
			connectorBase: parseConnectorBase(this)[0],						// +
			meta: parseMeta(this),													// *
			metadata: parseMetadata(this)											// *
		});
		debug.checkAll(this,attr,tags,data[data.length-1]);		
	});
	return data[0];
}