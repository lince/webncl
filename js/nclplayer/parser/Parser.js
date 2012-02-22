function Parser () {

	this.referenceMap = {
		// Tabela de IDs que podem ser referenciados por outros objetos
		map: [],
		addSource: function (obj,attr,type) {
			// TODO
			// - salvar todos os sources e todos os targets e, no final do parse, ligar as referências
			// - resolver o problema do transition (id1;id2;...)
			if (!this.map[obj[attr]]) {
				this.map[obj[attr]] = {
					sources: []
				};
			}
			this.map[obj[attr]].sources.push({
				obj: obj,
				attr: attr,
				type: type
			});
		},
		addTarget: function (ref,id,pid,refType) {
			var newTarget = false;
			if (this.map[id]) {
				if (this.map[id].target) {
					if (refType=="property" || refType=="connectorParam") {
						// não pode repetir no mesmo pai
						if (this.map[id].target.parents[pid]) {
							return false;
						}
					} else {
						// não pode repetir nunca
						return false;
					}
				} else {
					newTarget = true;
				}
			} else {
				this.map[id] = {
					sources: []
				};
				newTarget = true;
			}
			if (newTarget) {
				this.map[id].target = {
					obj: ref,
					type: refType,
					parents: []
				};
			}
			this.map[id].target.parents[pid] = true;
			return true;
		},
		pop: function (id) {
			return (this.map[id] ? this.map[id].target : false);
		},
		createReferences: function () {
			for (id in this.map) {
				for (i in this.map[id].sources) {
					var src = this.map[id].sources[i];
					if (this.map[id].target && this.map[id].target.obj && $.inArray(this.map[id].target.type,src.type)!=-1) {
						src.obj[src.attr] = this.map[id].target.obj;
					} else {
						Debugger.error(Debugger.ERR_INVALID_ID_REFERENCE,src.type,[src.attr,src.obj[src.attr],src.type]);
					}
				}
			}
		}
	};

	this.uniqueTable = [];
	
};

Parser.prototype.parse = function (ncl) {
	this.ncl = this.createNode(ncl);
	this.referenceMap.createReferences();
	return this.ncl;
};

Parser.prototype.createNode = function (parent, tagName, parentNode, tree) {
	tagName = tagName || "ncl";
	var data = $(parent).find(tagName=="ncl"?"ncl":"> "+tagName);
	if (data.length==0) return false;
	var nodes = [];
	// attributes
	var attrs = Parser.nclStructureMap[tagName].attrs;
	attrs.required || (attrs.required=[]);
	attrs.optional || (attrs.optional=[]);
	attrs.oneOf || (attrs.oneOf=[]);
	var allAttrs = [].concat(attrs.required,attrs.optional,attrs.oneOf);
	// content
	var content = Parser.nclStructureMap[tagName].content;
	content.optional || (content.optional=[]);
	content.one || (content.one=[]);
	content.plus || (content.plus=[]);
	content.plusOneOf || (content.plusOneOf=[]);
	content.star || (content.star=[]);
	content.custom || (content.custom=[]);
	var allTags = [].concat(content.optional,content.one,content.plus,content.plusOneOf,content.star,content.custom);
	// cria o objeto
	var parser = this;
	$(data).each(function() {
		var node = {
			"_type": tagName
		};
		for (i in allAttrs) {
			node[allAttrs[i]] = $(this).attr(allAttrs[i]);
		}
		var newTree = tree + ">" + tagName;
		if (node.id) {
			newTree += "#" + node.id;
		}
		parser.parseAttributes(this,node);
		parser.parseContent(this,node);
		for (i in allTags) {
			node[allTags[i]=="interface" ? "nodeInterface" : allTags[i]] = parser.createNode(this,allTags[i],node,newTree);
		}
		nodes.push(node);
		if (tagName == "ncl") {
			parser.parseNCL(node,tagName,parentNode,tree);
		} else {
			parser["parse"+tagName[0].toUpperCase()+tagName.slice(1,tagName.length)](node,tagName,parentNode,tree);
		}
	});
	return ($.inArray(tagName,Parser.isNotArray)==-1 ? nodes : nodes[0]);
};

Parser.prototype.parseAttributes = function (nodeXml, nodeObj) {
	var attrObj = $(nodeXml).get(0).attributes;
	var nodeType = nodeObj["_type"];
	var attrs = Parser.nclStructureMap[nodeType].attrs;
	var foundAttrs = [];
	for (var i=0; i<attrObj.length; i++) {
		foundAttrs.push(attrObj.item(i).name);
	}
	// # (source)
	for (i in attrs.reference_source) {
		for (attr in attrs.reference_source[i][0]) {
			if ($(nodeXml).attr(attrs.reference_source[i][0][attr])) {
				this.referenceMap.addSource(nodeObj,attrs.reference_source[i][0][attr],attrs.reference_source[i][1]);
			}
		}
	}
	// # (target)
	for (attr in attrs.reference_target) {
		if ($(nodeXml).attr(attrs.reference_target[attr])) {
			var type = attrs.reference_target[attr]=="focusIndex" ? "focusIndex" : nodeType;
			if (!this.referenceMap.addTarget(nodeObj,$(nodeXml).attr(attrs.reference_target[attr]),$(nodeXml).parent().attr("id"),type)) {
				Debugger.error(Debugger.ERR_DUPLICATED_ID,nodeType,[attrs.reference_target[attr],$(nodeXml).attr(attrs.reference_target[attr]),$(nodeXml).parent().attr("id")]);
			}
		}
	}
	// !
	for (attr in attrs.required) {
		var index = foundAttrs.indexOf(attrs.required[attr]);
		if (index == -1) {
			Debugger.error(Debugger.ERR_MISSING_ATTR,nodeType,[attrs.required[attr]]);
		} else {
			foundAttrs[index] = 0;
			while (index = foundAttrs.indexOf(attrs.required[attr]) != -1) {
				Debugger.error(Debugger.ERR_TOO_MANY_ATTRS,nodeType,[attrs.required[attr]]);
				foundAttrs[index] = 0;
			}
		}
	}
	// ?
	for (attr in attrs.optional) {
		var index = foundAttrs.indexOf(attrs.optional[attr]);
		if (index != -1) {
			foundAttrs[index] = 0;
			while (index = foundAttrs.indexOf(attrs.required[attr]) != -1) {
				Debugger.error(Debugger.ERR_TOO_MANY_ATTRS,nodeType,[attrs.required[attr]]);
				foundAttrs[index] = 0;
			}
		}
	}
	// !1
	var oneFound = attrs.oneOf.length==0;
	for (attr in attrs.oneOf) {
		var index = foundAttrs.indexOf(attrs.oneOf[attr]);
		if (index != -1) {
			oneFound = true;
			foundAttrs[index] = 0;
			while (index = foundAttrs.indexOf(attrs.oneOf[attr]) != -1) {
				Debugger.error(Debugger.ERR_TOO_MANY_ATTRS,nodeType,[attrs.oneOf[attr]]);
				foundAttrs[index] = 0;
			}
		}
	}
	if (!oneFound) {
		Debugger.error(Debugger.ERR_MISSING_ATTR_ONEOF,nodeType,attrs.oneOf);
	}
	// Atributos inválidos
	for (attr in foundAttrs) {
		if (foundAttrs[attr] != 0) {
			Debugger.warning(Debugger.WARN_INVALID_ATTR,nodeType,[foundAttrs[attr]]);
		}
	}
};
	
Parser.prototype.parseContent = function (nodeXml,nodeObj) {
	var nodeType = nodeObj["_type"];
	var tags = Parser.nclStructureMap[nodeType].content;
	var tagCount = [];
	var validTags = [];
	validTags = validTags.concat(tags.one,tags.optional,tags.plus,tags.plusOneOf,tags.star,tags.custom);
	for (var tag in validTags) {
		tagCount[validTags[tag]] = 0;
	}
	$(nodeXml).find("> *").each(function() {
		var tagName = $(this).get(0).tagName;
		if (tagCount[tagName]) {
			tagCount[tagName]++;
		} else {
			tagCount[tagName] = 1;
		}
	});
	// ?
	for (var tag in tags.optional) {
		if (tagCount[tags.optional[tag]] > 1) {
			Debugger.error(Debugger.ERR_TOO_MANY_TAGS,nodeType,[tags.optional[tag]]);
		}
		tagCount[tags.optional[tag]] = 0;
	}
	// 1
	for (var tag in tags.one) {
		if (tagCount[tags.one[tag]] > 1) {
			Debugger.error(Debugger.ERR_TOO_MANY_TAGS,nodeType,[tags.one[tag]]);
		}
		if (tagCount[tags.one[tag]] == 0) {
			Debugger.error(Debugger.ERR_MISSING_TAG,nodeType,[tags.one[tag]]);
		}
		tagCount[tags.one[tag]] = 0;
	}
	// +
	for (var tag in tags.plus) {
		if (tagCount[tags.plus[tag]] == 0) {
			Debugger.error(Debugger.ERR_MISSING_TAG,nodeType,[tags.plus[tag]]);
		}
		tagCount[tags.plus[tag]] = 0;
	}
	// |+
	var atLeastOne = tags.plusOneOf.length==0;
	for (var tag in tags.plusOneOf) {
		if (tagCount[tags.plusOneOf[tag]] > 0) {
			atLeastOne = true;
		}
		tagCount[tags.plusOneOf[tag]] = 0;
	}
	if (!atLeastOne) {
		Debugger.error(Debugger.ERR_MISSING_TAG_ONEOF,nodeType,tags.plusOneOf);
	}
	// *
	for (var tag in tags.star) {
		tagCount[tags.star[tag]] = 0;
	}
	// custom
	if (tags.custom.length > 0) {
		tags.validate(tagCount,errors=[]);
		for (err in errors) {
			Debugger.error(errors[err].code,nodeType,errors[err].params);
		}
		for (var tag in tags.custom) {
			tagCount[tags.custom[tag]] = 0;
		}			
	}
	// Tags inválidas
	for (var tag in tagCount) {
		if (tagCount[tag] > 0) {
			Debugger.warning(Debugger.WARN_INVALID_TAG,nodeType,[tag]);
		}
	}
};