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

Parser.isNotArray = [
	"ncl","head","body","importedDocumentBase","ruleBase","transitionBase","descriptorBase",
	"connectorBase","defaultDescriptor","valueAssessment","defaultComponent"
];

Parser.nclStructureMap = {
	"area": {
		attrs: {
			reference_target: ["id"],
			required: ["id"],
			optional: ["coords","begin","end","text","position","first","last","label"]
		},
		content: {}
	},
	"assessmentStatement": {
		attrs: {
			required: ["comparator"]
		},
		content: {
			custom: ["attributeAssessment","valueAssessment"],
			validate: function (count,errors) {
				var c1 = count["attributeAssessment"];
				var c2 = count["valueAssessment"];
				if (c1 == 0) {
					errors.push({
						code: Logger.ERR_MISSING_TAG,
						params: ["attributeAssessment"]
					});
				}
				if (c1 < 2 && c2 == 0) {
					errors.push({
						code: Logger.ERR_MISSING_TAG_ONEOF,
						params: ["attributeAssessment","valueAssessment"]
					});
				}
				if (c1 == 2 && c2 > 0) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS_ONEOF,
						params: ["attributeAssessment","valueAssessment"]
					});
				}
				if (c1 > 2) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
						params: ["attributeAssessment"]
					});
				}
				if (c2 > 1) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
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
		content: {}
	},
	"bind": {
		attrs: {
			reference_source: [
				[["descriptor"],["descriptor"]],
				[["component"],["context","media"]],
				[["nodeInterface"],["port","area","property"]]
			],
			required: ["role","component"],
			optional: ["interface","descriptor"]
		},
		content: {
			star: ["bindParam"]
		}
	},
	"bindParam": {
		attrs: {
			required: ["name","value"]
		},
		content: {}
	},
	"bindRule": {
		attrs: {
			reference_source: [
				[["constituent"],["media"]],
				[["rule"],["rule"]]
			],
			required: ["constituent","rule"]
		},
		content: {}
	},
	"body": {
		attrs: {
			reference_target: ["id"],
			optional: ["id"]
		},
		content: {
			star: ["port","property","media","context","switch","link"]
		}
	},
	"causalConnector": {
		attrs: {
			reference_target: ["id"],
			required: ["id"]
		},
		content: {
			star: ["connectorParam"],
			custom: ["simpleCondition","compoundCondition","simpleAction","compoundAction"],
			validate: function (count,errors) {
				// Condições
				if (count["simpleCondition"]==0 && count["compoundCondition"]==0) {
					errors.push({
						code: Logger.ERR_MISSING_TAG_ONEOF,
						params: ["simpleCondition","compoundCondition"]
					});
				} else if (count["simpleCondition"]>0 && count["compoundCondition"]>0) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS_ONEOF,
						params: ["simpleCondition","compoundCondition"]
					});
				} else if (count["simpleCondition"]>1) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
						params: ["simpleCondition"]
					});
				} else if (count["compoundCondition"]>1) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
						params: ["compoundCondition"]
					});
				}
				// Ações
				if (count["simpleAction"]==0 && count["compoundAction"]==0) {
					errors.push({
						code: Logger.ERR_MISSING_TAG_ONEOF,
						params: ["simpleAction","compoundAction"]
					});
				} else if (count["simpleAction"]>0 && count["compoundAction"]>0) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS_ONEOF,
						params: ["simpleAction","compoundAction"]
					});
				} else if (count["simpleAction"]>1) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
						params: ["simpleAction"]
					});
				} else if (count["compoundAction"]>1) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
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
		content: {
			plusOneOf: ["rule","compositeRule"]
		}
	},
	"compoundAction": {
		attrs: {
			required: ["operator"],
			optional: ["delay"]
		},
		content: {
			plusOneOf: ["simpleAction","compoundAction"]
		}
	},
	"compoundCondition": {
		attrs: {
			required: ["operator"],
			optional: ["delay"]
		},
		content: {
			plusOneOf: ["simpleCondition","compoundCondition"],
			star: ["assessmentStatement","compoundStatement"]
		}
	},
	"compoundStatement": {
		attrs: {
			required: ["operator"],
			optional: ["isNegated"]
		},
		content: {
			plusOneOf: ["assessmentStatement","compoundStatement"]
		}
	},
	"connectorBase": {
		attrs: {
			optional: ["id"]
		},
		content: {
			star: ["importBase","causalConnector"]
		}
	},
	"connectorParam": {
		attrs: {
			reference_target: ["name"],
			ref_group: true,
			required: ["name"],
			optional: ["type"]
		},
		content: {}
	},
	"context": {
		attrs: {
			reference_source: [[["refer"],["body","context"]]],
			reference_target: ["id"],
			required: ["id"],
			optional: ["refer"]
		},
		content: {
			star: ["port","property","media","context","switch","link"]
		}
	},
	"defaultComponent": {
		attrs: {
			reference_source: [[["component"],["context","media"]]],
			required: ["component"]
		},
		content: {}
	},
	"defaultDescriptor": {
		attrs: {
			reference_source: [[["descriptor"],["descriptor"]]],
			required: ["descriptor"]
		},
		content: {}
	},
	"descriptor": {
		attrs: {
			reference_source: [
				[["region"],["region"]],
				[["moveLeft","moveRight","moveUp","moveDown"],["focusIndex"]],
				[["transIn","transOut"],["transition"]]
			],
			reference_target: ["id","focusIndex"],
			required: ["id"],
			optional: [
			"player","explicitDur","region","freeze","moveLeft","moveRight","moveUp","moveDown","focusIndex","focusBorderColor",
			"focusBorderWidth","focusBorderTransparency","focusSrc","focusSelSrc","selBorderColor","transIn","transOut"
		]
		},
		content: {
			star: ["descriptorParam"]
		}
	},
	"descriptorBase": {
		attrs: {
			optional: ["id"]
		},
		content: {
			plusOneOf: ["importBase","descriptor","descriptorSwitch"]
		}
	},
	"descriptorParam": {
		attrs: {
			required: ["name","value"]
		},
		content: {}
	},
	"descriptorSwitch": {
		attrs: {
			required: ["id"]
		},
		content: {
			optional: ["defaultDescriptor"],
			star: ["bindRule","descriptor"]
		}
	},
	"head": {
		attrs: {},
		content: {
			optional: ["importedDocumentBase","ruleBase","transitionBase","descriptorBase","connectorBase"],
			star: ["regionBase","meta","metadata"]
		}
	},
	"importBase": {
		attrs: {
			reference_source: [[["region"],["region"]]],
			required: ["alias","documentURI"],
			optional: ["region"]
		},
		content: {}
	},
	"importedDocumentBase": {
		attrs: {
			optional: ["id"]
		},
		content: {
			plus: ["importNCL"]
		}
	},
	"importNCL": {
		attrs: {
			required: ["alias","documentURI"]
		},
		content: {}
	},
	"link": {
		attrs: {
			reference_source: [[["xconnector"],["causalConnector"]]],
			required: ["xconnector"],
			optional: ["id"]
		},
		content: {
			plus: ["bind"],
			star: ["linkParam"]
		}
	},
	"linkParam": {
		attrs: {
			required: ["name","value"]
		},
		content: {}
	},
	"mapping": {
		attrs: {
			reference_source: [
				[["component"],["context","media"]],
				[["nodeInterface"],["port","area","property"]]
			],
			required: ["component"],
			optional: ["interface"]
		},
		content: {}
	},
	"media": {
		attrs: {
			reference_source: [
				[["refer"],["media"]],
				[["descriptor"],["descriptor"]]
			],
			reference_target: ["id"],
			required: ["id"],
			optional: ["instance","descriptor"],
			oneOf: ["type","src","refer"]
		},
		content: {
			star: ["area","property"]
		}
	},
	"meta": {
		attrs: {
			required: ["name","content"]
		},
		content: {}
	},
	"metadata": {
		attrs: {},
		content: {}
	},
	"ncl": {
		attrs: {
			optional: ["id","title","xmlns"]
		},
		content: {
			optional: ["head","body"]
		}
	},
	"port": {
		attrs: {
			reference_source: [
				[["component"],["context","media"]],
				[["nodeInterface"],["port","area","property"]]
			],
			reference_target: ["id"],
			required: ["id","component"],
			optional: ["interface"]
		},
		content: {}
	},
	"property": {
		attrs: {
			reference_target: ["name"],
			ref_group: true,
			required: ["name"],
			optional: ["value"]
		},
		content: {}
	},
	"region": {
		attrs: {
			reference_target: ["id"],
			required: ["id"],
			optional: ["title","left","right","top","bottom","height","width","zIndex"]
		},
		content: {
			star: ["region"]
		}
	},
	"regionBase": {
		attrs: {
			optional: ["id","device"]
		},
		content: {
			plusOneOf: ["importBase","region"]
		}
	},
	"rule": {
		attrs: {
			reference_source: [[["var"],["property"]]],
			required: ["id","var","comparator","value"]
		},
		content: {}
	},
	"ruleBase": {
		attrs: {
			optional: ["id"]
		},
		content: {
			plusOneOf: ["importBase","rule","compositeRule"]
		}
	},
	"simpleAction": {
		attrs: {
			required: ["role"],
			optional: ["delay","eventType","actionType","value","min","max","qualifier","repeat","repeatDelay","duration","by"]
		},
		content: {}
	},
	"simpleCondition": {
		attrs: {
			required: ["role"],
			optional: ["delay","eventType","key","transition","min","max","qualifier"]
		},
		content: {}
	},
	"switch": {
		attrs: {
			reference_source: [[["refer"],["switch"]]],
			reference_target: ["id"],
			required: ["id"],
			optional: ["refer"]
		},
		content: {
			optional: ["defaultComponent"]
		}
	},
	"switchPort": {
		attrs: {
			required: ["id"]
		},
		content: {
			plus: ["mapping"]
		}
	},
	"transition": {
		attrs: {
			ref_multiple: true,
			reference_target: ["id"],
			required: ["id","type"],
			optional: ["subtype","dur","startProgress","endProgress","direction","fadeColor","horRepeat","vertRepeat","borderWidth","borderColor"]
		},
		content: {}
	},
	"transitionBase": {
		attrs: {
			optional: ["id"]
		},
		content: {
			plusOneOf: ["importBase","transition"]
		}
	},
	"valueAssessment": {
		attrs: {
			required: ["value"]
		},
		content: {}
	}
};
