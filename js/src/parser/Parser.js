/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function Parser () {

	this.referenceMap = {
		// Tabela de IDs que podem ser referenciados por outros objetos
		map: [],
		// ----- REFER -----
		instReuse: [],
		// -----------------
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
						// --- REFER ---
						if (src.attr=="refer") {
							if (src.obj._type=="media") {
								// TODO: é só DESCRIPTOR, SRC e TYPE que "herdam" do refer?
								// (area, property, ... ?)
								src.obj.descriptor = this.map[id].target.obj.descriptor;
								src.obj.src = this.map[id].target.obj.src;
								src.obj.type = this.map[id].target.obj.type;
								if (src.obj.instance!="new") {
									// instSame ou gradSame
									this.instReuse[src.obj.id] = id;
								}
							} else if (src.obj._type=="context") {
								// TODO
							}
						} else {
						// -------------
							src.obj[src.attr] = this.map[id].target.obj;
						}
					} else {
						Logger.error(Logger.ERR_INVALID_ID_REFERENCE,src.type,[src.attr,src.obj[src.attr],src.type]);
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
			//node[allAttrs[i]=="interface"?"nodeInterface":allAttrs[i]] = $(this).attr(allAttrs[i]);
		}
		var newTree = tree + ">" + tagName;
		if (node.id) {
			newTree += "#" + node.id;
		}
		parser.parseAttributes(this,node);
		parser.parseContent(this,node);
		for (i in allTags) {
			node[allTags[i]] = parser.createNode(this,allTags[i],node,newTree);
		}
		nodes.push(node);
		if (tagName == "ncl") {
			parser.parseNCL(node,tagName,parentNode,tree);
		} else {
			// TODO check why tagName[0] is undefined
			if (tagName[0]){
				parser["parse"+tagName[0].toUpperCase()+tagName.slice(1,tagName.length)](node,tagName,parentNode,tree);
			}
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
				Logger.error(Logger.ERR_DUPLICATED_ID,nodeType,[attrs.reference_target[attr],$(nodeXml).attr(attrs.reference_target[attr]),$(nodeXml).parent().attr("id")]);
			}
		}
	}
	// !
	for (attr in attrs.required) {
		var index = $.inArray(attrs.required[attr],foundAttrs); 
		if (index == -1) {
			Logger.error(Logger.ERR_MISSING_ATTR,nodeType,[attrs.required[attr]]);
		} else {
			foundAttrs[index] = 0;
			while (index = $.inArray(attrs.required[attr],foundAttrs) != -1) {
				Logger.error(Logger.ERR_TOO_MANY_ATTRS,nodeType,[attrs.required[attr]]);
				foundAttrs[index] = 0;
			}
		}
	}
	// ?
	for (attr in attrs.optional) {
		var index = $.inArray(attrs.optional[attr],foundAttrs); 
		if (index != -1) {
			foundAttrs[index] = 0;
			while (index = $.inArray(attrs.optional[attr],foundAttrs) != -1) {
				Logger.error(Logger.ERR_TOO_MANY_ATTRS,nodeType,[attrs.required[attr]]);
				foundAttrs[index] = 0;
			}
		}
	}
	// !1
	var oneFound = attrs.oneOf.length==0;
	for (attr in attrs.oneOf) {
		var index = $.inArray(attrs.oneOf[attr],foundAttrs);
		if (index != -1) {
			oneFound = true;
			foundAttrs[index] = 0;
			while (index = $.inArray(attrs.oneOf[attr],foundAttrs) != -1) {
				Logger.error(Logger.ERR_TOO_MANY_ATTRS,nodeType,[attrs.oneOf[attr]]);
				foundAttrs[index] = 0;
			}
		}
	}
	if (!oneFound) {
		Logger.error(Logger.ERR_MISSING_ATTR_ONEOF,nodeType,attrs.oneOf);
	}
	// Atributos inválidos
	for (attr in foundAttrs) {
		if (foundAttrs[attr] != 0) {
			Logger.warning(Logger.WARN_INVALID_ATTR,nodeType,[foundAttrs[attr]]);
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
			Logger.error(Logger.ERR_TOO_MANY_TAGS,nodeType,[tags.optional[tag]]);
		}
		tagCount[tags.optional[tag]] = 0;
	}
	// 1
	for (var tag in tags.one) {
		if (tagCount[tags.one[tag]] > 1) {
			Logger.error(Logger.ERR_TOO_MANY_TAGS,nodeType,[tags.one[tag]]);
		}
		if (tagCount[tags.one[tag]] == 0) {
			Logger.error(Logger.ERR_MISSING_TAG,nodeType,[tags.one[tag]]);
		}
		tagCount[tags.one[tag]] = 0;
	}
	// +
	for (var tag in tags.plus) {
		if (tagCount[tags.plus[tag]] == 0) {
			Logger.error(Logger.ERR_MISSING_TAG,nodeType,[tags.plus[tag]]);
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
		Logger.error(Logger.ERR_MISSING_TAG_ONEOF,nodeType,tags.plusOneOf);
	}
	// *
	for (var tag in tags.star) {
		tagCount[tags.star[tag]] = 0;
	}
	// custom
	if (tags.custom.length > 0) {
		tags.validate(tagCount,errors=[]);
		for (err in errors) {
			Logger.error(errors[err].code,nodeType,errors[err].params);
		}
		for (var tag in tags.custom) {
			tagCount[tags.custom[tag]] = 0;
		}			
	}
	// Tags inválidas
	for (var tag in tagCount) {
		if (tagCount[tag] > 0) {
			Logger.warning(Logger.WARN_INVALID_TAG,nodeType,[tag]);
		}
	}
};