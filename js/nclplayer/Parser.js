var Parser = {

	eventType: {
		"onBegin": "presentation",
		"onEnd": "presentation",
		"onAbort": "presentation",
		"onPause": "presentation",
		"onResume": "presentation",
		"onSelection": "selection",
		"onBeginAttribution": "attribution",
		"onEndAttribution": "attribution"
	},

	mediaTypes: {
		htm: "text/htm",	html: "text/html",	txt: "text/plain",	css: "text/css",	xml: "text/xml",	bmp: "image",	png: "image",
		gif: "image",		jpg: "image",			jpeg: "image",			wav: "audio",		mp3: "audio",		mp2: "audio",	mp4: "video",
		mpg4: "video",		mpeg: "video",			mpg: "video",			webm: "video",
		lua: "application/x-ginga-NCLua",		'class': "application/x-ginga-NCLet",		jar: "application/x-ginga-NCLet"	
	},
	
	colorValues: {
		white: "255,255,255",
		black: "0,0,0",
		silver: "192,192,192",
		gray: "128,128,128",
		red: "255,0,0",
		maroon: "128,0,0",
		fuchsia: "255,0,255",
		purple: "128,0,128",
		lime: "0,255,0",
		green: "0,128,0",
		yellow: "255,255,0",
		olive: "128,128,0",
		blue: "0,0,255",
		navy: "0,0,128",
		aqua: "0,255,255",
		teal: "0,128,128"
	},
	
	parseAttrs: function (obj,tag,tree,parent) {
		var isVector = true;
		if (obj && typeof(obj)!="string") {
			// obj = {...} | [...]
			for (var element in obj) {
				var newTree = tree;
				if (isNaN(element)) {
					isVector = false;
					newTree += ">" + tag;
					if (obj.id) {
						newTree += "#" + obj.id;
					}
				}
				this.parseAttrs(obj[element],isVector?tag:element,newTree,obj);
			}
			if (!isVector) {
				// obj = {...}
				Debugger.debugTag(tag,obj,parent,tree);
			}
		}
	},	
	
	isNotArray: [
		"ncl","head","body","importedDocumentBase","ruleBase","transitionBase","descriptorBase",
		"connectorBase","defaultDescriptor","valueAssessment","defaultComponent"
	],
	
	parse: function (ncl) {
		var nclObj = Parser.createNode(ncl,"ncl");
		Parser.parseAttrs(nclObj,"ncl");
		return nclObj;
	},
	
	createNode: function (parent, tagName) {
		var data = $(parent).find(tagName=="ncl" ? "ncl" : "> "+tagName);
		if (data.length==0) return false;
		var nodes = [];
		// atributos
		var attr = Parser.nclStructureMap[tagName].attrs;
		attr.required || (attr.required=[]);
		attr.optional || (attr.optional=[]);
		attr.oneOf || (attr.oneOf=[]);
		var allAttrs = [].concat(attr.required,attr.optional,attr.oneOf);
		// tags
		var tags = Parser.nclStructureMap[tagName].tags;
		tags.optional || (tags.optional=[]);
		tags.one || (tags.one=[]);
		tags.plus || (tags.plus=[]);
		tags.plusOneOf || (tags.plusOneOf=[]);
		tags.star || (tags.star=[]);
		tags.custom || (tags.custom=[]);
		var allTags = [].concat(tags.optional,tags.one,tags.plus,tags.plusOneOf,tags.star,tags.custom);
		// cria o objeto
		$(data).each(function() {
			var node = {};
			node["_type"] = tagName;
			for (i in allAttrs) {
				node[allAttrs[i]!="interface"?allAttrs[i]:"nodeInterface"] = $(this).attr(allAttrs[i]);
			}
			for (i in allTags) {
				node[allTags[i]] = Parser.createNode(this,allTags[i]);
			}
			nodes.push(node);
			Debugger.checkAll(this,attr,tags,node);
		});
		if ($.inArray(tagName,Parser.isNotArray)==-1) {
			return nodes;
		} else {
			return nodes[0];
		}
	},
	
	nclStructureMap: {
		"area": {
			attrs: {
				reference: ["id"],
				required: ["id"],
				optional: ["coords","begin","end","text","position","first","last","label"]
			},
			tags: {}
		},
		"assessmentStatement": {
			attrs: {
				required: ["comparator"]
			},
			tags: {
				custom: ["attributeAssessment","valueAssessment"],
				validate: function (count,errors) {
					var c1 = count["attributeAssessment"];
					var c2 = count["valueAssessment"];
					if (c1 == 0) {
						errors.push({
							code: Debugger.ERR_MISSING_TAG,
							params: ["attributeAssessment"]
						});
					}
					if (c1 < 2 && c2 == 0) {
						errors.push({
							code: Debugger.ERR_MISSING_TAG_ONEOF,
							params: ["attributeAssessment","valueAssessment"]
						});
					}
					if (c1 == 2 && c2 > 0) {
						errors.push({
							code: Debugger.ERR_TOO_MANY_TAGS_ONEOF,
							params: ["attributeAssessment","valueAssessment"]
						});
					}
					if (c1 > 2) {
						errors.push({
							code: Debugger.ERR_TOO_MANY_TAGS,
							params: ["attributeAssessment"]
						});
					}
					if (c2 > 1) {
						errors.push({
							code: Debugger.ERR_TOO_MANY_TAGS,
							params: ["valueAssessment"]
						});
					}
				}
			}
		},
		"attributeAssessment": {
			attrs: {
				required: ["role","eventType","attributeType"],
				optional: ["key","offset"]
			},
			tags: {}
		},
		"bind": {
			attrs: {
				required: ["role","component"],
				optional: ["interface","descriptor"]
			},
			tags: {
				star: ["bindParam"]
			}
		},
		"bindParam": {
			attrs: {
				required: ["name","value"]
			},
			tags: {}
		},
		"bindRule": {
			attrs: {
				required: ["constituent","rule"]
			},
			tags: {}
		},
		"body": {
			attrs: {
				reference: ["id"],
				optional: ["id"]
			},
			tags: {
				star: ["port","property","media","context","switch","link"]
			}
		},
		"causalConnector": {
			attrs: {
				reference: ["id"],
				required: ["id"]
			},
			tags: {
				star: ["connectorParam"],
				custom: ["simpleCondition","compoundCondition","simpleAction","compoundAction"],
				validate: function (count,errors) {
					// Condições
					if (count["simpleCondition"]==0 && count["compoundCondition"]==0) {
						errors.push({
							code: Debugger.ERR_MISSING_TAG_ONEOF,
							params: ["simpleCondition","compoundCondition"]
						});
					} else if (count["simpleCondition"]>0 && count["compoundCondition"]>0) {
						errors.push({
							code: Debugger.ERR_TOO_MANY_TAGS_ONEOF,
							params: ["simpleCondition","compoundCondition"]
						});
					} else if (count["simpleCondition"]>1) {
						errors.push({
							code: Debugger.ERR_TOO_MANY_TAGS,
							params: ["simpleCondition"]
						});
					} else if (count["compoundCondition"]>1) {
						errors.push({
							code: Debugger.ERR_TOO_MANY_TAGS,
							params: ["compoundCondition"]
						});
					}
					// Ações
					if (count["simpleAction"]==0 && count["compoundAction"]==0) {
						errors.push({
							code: Debugger.ERR_MISSING_TAG_ONEOF,
							params: ["simpleAction","compoundAction"]
						});
					} else if (count["simpleAction"]>0 && count["compoundAction"]>0) {
						errors.push({
							code: Debugger.ERR_TOO_MANY_TAGS_ONEOF,
							params: ["simpleAction","compoundAction"]
						});
					} else if (count["simpleAction"]>1) {
						errors.push({
							code: Debugger.ERR_TOO_MANY_TAGS,
							params: ["simpleAction"]
						});
					} else if (count["compoundAction"]>1) {
						errors.push({
							code: Debugger.ERR_TOO_MANY_TAGS,
							params: ["compoundAction"]
						});
					}
				}
			}
		},
		"compositeRule": {
			attrs: {
				required: ["id","operator"]
			},
			tags: {
				plusOneOf: ["rule","compositeRule"]
			}
		},
		"compoundAction": {
			attrs: {
				required: ["operator"],
				optional: ["delay"]
			},
			tags: {
				plusOneOf: ["simpleAction","compoundAction"]
			}
		},
		"compoundCondition": {
			attrs: {
				required: ["operator"],
				optional: ["delay"]
			},
			tags: {
				plusOneOf: ["simpleCondition","compoundCondition"],
				star: ["assessmentStatement","compoundStatement"]
			}
		},
		"compoundStatement": {
			attrs: {
				required: ["operator"],
				optional: ["isNegated"]
			},
			tags: {
				plusOneOf: ["assessmentStatement","compoundStatement"]
			}
		},
		"connectorBase": {
			attrs: {
				optional: ["id"]
			},
			tags: {
				star: ["importBase","causalConnector"]
			}
		},
		"connectorParam": {
			attrs: {
				reference: ["name"],
				ref_group: true,
				required: ["name"],
				optional: ["type"]
			},
			tags: {}
		},
		"context": {
			attrs: {
				reference: ["id"],
				required: ["id"],
				optional: ["refer"]
			},
			tags: {
				star: ["port","property","media","context","switch","link"]
			}
		},
		"defaultComponent": {
			attrs: {
				required: ["component"]
			},
			tags: {}
		},
		"defaultDescriptor": {
			attrs: {
				required: ["descriptor"]
			},
			tags: {}
		},
		"descriptor": {
			attrs: {
				reference: ["id","focusIndex"],
				required: ["id"],
				optional: [
				"player","explicitDur","region","freeze","moveLeft","moveRight","moveUp","moveDown","focusIndex","focusBorderColor",
				"focusBorderWidth","focusBorderTransparency","focusSrc","focusSelSrc","selBorderColor","transIn","transOut"
			]
			},
			tags: {
				star: ["descriptorParam"]
			}
		},
		"descriptorBase": {
			attrs: {
				optional: ["id"]
			},
			tags: {
				plusOneOf: ["importBase","descriptor","descriptorSwitch"]
			}
		},
		"descriptorParam": {
			attrs: {
				required: ["name","value"]
			},
			tags: {}
		},
		"descriptorSwitch": {
			attrs: {
				required: ["id"]
			},
			tags: {
				optional: ["defaultDescriptor"],
				star: ["bindRule","descriptor"]
			}
		},
		"head": {
			attrs: {},
			tags: {
				optional: ["importedDocumentBase","ruleBase","transitionBase","descriptorBase","connectorBase"],
				star: ["regionBase","meta","metadata"]
			}
		},
		"importBase": {
			attrs: {
				required: ["alias","documentURI"],
				optional: ["region"]
			},
			tags: {}
		},
		"importedDocumentBase": {
			attrs: {
				optional: ["id"]
			},
			tags: {
				plus: ["importNCL"]
			}
		},
		"importNCL": {
			attrs: {
				required: ["alias","documentURI"]
			},
			tags: {}
		},
		"link": {
			attrs: {
				required: ["xconnector"],
				optional: ["id"]
			},
			tags: {
				plus: ["bind"],
				star: ["linkParam"]
			}
		},
		"linkParam": {
			attrs: {
				required: ["name","value"]
			},
			tags: {}
		},
		"mapping": {
			attrs: {
				required: ["component"],
				optional: ["interface"]
			},
			tags: {}
		},
		"media": {
			attrs: {
				reference: ["id"],
				required: ["id"],
				optional: ["refer","instance","descriptor"],
				oneOf: ["type","src"]
			},
			tags: {
				star: ["area","property"]
			}
		},
		"meta": {
			attrs: {
				required: ["name","content"]
			},
			tags: {}
		},
		"metadata": {
			attrs: {},
			tags: {}
		},
		"ncl": {
			attrs: {
				optional: ["id","title","xmlns"]
			},
			tags: {
				optional: ["head","body"]
			}
		},
		"port": {
			attrs: {
				reference: ["id"],
				required: ["id","component"],
				optional: ["interface"]
			},
			tags: {}
		},
		"property": {
			attrs: {
				reference: ["name"],
				ref_group: true,
				required: ["name"],
				optional: ["value"]
			},
			tags: {}
		},
		"region": {
			attrs: {
				reference: ["id"],
				required: ["id"],
				optional: ["title","left","right","top","bottom","height","width","zIndex"]
			},
			tags: {
				star: ["region"]
			}
		},
		"regionBase": {
			attrs: {
				optional: ["id","device"]
			},
			tags: {
				plusOneOf: ["importBase","region"]
			}
		},
		"rule": {
			attrs: {
				required: ["id","var","comparator","value"]
			},
			tags: {}
		},
		"ruleBase": {
			attrs: {
				optional: ["id"]
			},
			tags: {
				plusOneOf: ["importBase","rule","compositeRule"]
			}
		},
		"simpleAction": {
			attrs: {
				required: ["role"],
				optional: ["delay","eventType","actionType","value","min","max","qualifier","repeat","repeatDelay","duration","by"]
			},
			tags: {}
		},
		"simpleCondition": {
			attrs: {
				required: ["role"],
				optional: ["delay","eventType","key","transition","min","max","qualifier"]
			},
			tags: {}
		},
		"switch": {
			attrs: {
				reference: ["id"],
				required: ["id"],
				optional: ["refer"]
			},
			tags: {
				optional: ["defaultComponent"]
			}
		},
		"switchPort": {
			attrs: {
				required: ["id"]
			},
			tags: {
				plus: ["mapping"]
			}
		},
		"transition": {
			attrs: {
				reference: ["id"],
				required: ["id","type"],
				optional: ["subtype","dur","startProgress","endProgress","direction","fadeColor","horRepeat","vertRepeat","borderWidth","borderColor"]
			},
			tags: {}
		},
		"transitionBase": {
			attrs: {
				optional: ["id"]
			},
			tags: {
				plusOneOf: ["importBase","transition"]
			}
		},
		"valueAssessment": {
			attrs: {
				required: ["value"]
			},
			tags: {}
		}
	}
	
};
