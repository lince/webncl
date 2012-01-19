var debug = {

	// Warnings
	WARN_INVALID_ATTR:					100,	// Atributo inválido
	WARN_INVALID_TAG:						101,	// Tag inválida
	WARN_INVALID_HEAD_STRUCTURE:		102,	// Estrutura do cabeçalho inválida
	WARN_INVALID_REGION_DIMENSIONS:	103,	// Dimensões de região inválidas
	WARN_DUPLICATED_ZINDEX:				104,	// zIndex duplicado
	
	// Errors
	ERR_MISSING_ATTR:						201,	// Atributo obrigatório faltando
	ERR_MISSING_ATTR_ONEOF:				202,	// Atributo obrigatório faltando (um desses)
	ERR_MISSING_ATTR_DEP:				203,	// Atributo dependente faltando
	ERR_TOO_MANY_ATTRS:					204,	// Excesso de atributos repetidos
	ERR_MISSING_TAG:						205,	// Tag obrigatória faltando (+,1)
	ERR_MISSING_TAG_ONEOF:				206,	// Tag obrigatória faltando (|+,|1)
	ERR_TOO_MANY_TAGS:					207,	// Excesso de tags repetidas (?,1)
	ERR_TOO_MANY_TAGS_ONEOF:			208,	// Excesso de tags (apenas uma permitida)
	ERR_INVALID_ATTR_VALUE:				209,	// Valor de atributo inválido
	ERR_INVALID_ID_REFERENCE:			210,	// Referência a um ID inválido
	ERR_DUPLICATED_ID:					211,	// ID duplicado
	ERR_INCOMPATIBLE_FILE_EXT:			212,	// Extensão de arquivo incompatível com o MIMETYPE
	ERR_INVALID_URI:						213,	// URI inválida
	ERR_DUPLICATED_ATTR:					214,	// Atributo duplicado
	ERR_DUPLICATED_ALIAS:				215,	// Alias duplicado
	
	MESSAGES: {
		100: "Atributo inválido",
		101: "Tag inválida",
		102: "Estrutura do cabeçalho inválida",
		103: "Dimensões de região inválidas",
		104: "zIndex duplicado",
		201: "Atributo obrigatório faltando",
		202: "Atributo obrigatório faltando (um desses)",
		203: "Atributo dependente faltando",
		204: "Excesso de atributos repetidos",
		205: "Tag obrigatória faltando",
		206: "Tag obrigatória faltando (uma dessas)",
		207: "Excesso de tags repetidas",
		208: "Excesso de tags (apenas uma permitida)",
		209: "Valor de atributo inválido",
		210: "Referência a ID inválido",
		211: "ID duplicado",
		212: "Extensão de arquivo incompatível com o MIMETYPE",
		213: "URI inválida",
		214: "Atributo duplicado",
		215: "Alias duplicado"
	},
	
	abort: false,
	
	uniqueTable: [],
	
	refTable: {
		// Tabela de IDs que podem ser referenciados por outros objetos
		table: [],
		push: function (id,objType,obj,pid) {
			if (this.table[id]) {
				if (objType=="property" || objType=="connectorParam") {
					// name: não pode repetir no mesmo pai
					if (this.table[id][pid]) {
						return false;
					}
				} else {
					// id: não pode repetir nunca
					return false;
				}
			} else {
				this.table[id] = [];
			}
			this.table[id][pid] = {
				type: objType,
				reference: obj
			};
			return true;
		},
		pop: function (id,pid) {
			if (pid) {
				return this.table[id][pid];
			} else {
				for (parent in this.table[id]) {
					return this.table[id][parent];
				}
				return false;
			}
		}
	},
	
	checkAll: function (parent,attr,tags,obj) {
		// Checa todos os erros antes da criação do objeto
		this.checkSyntax(parent);
		this.checkAttributes(parent,attr,obj);
		this.checkChildrenTags(parent,tags);
	},
	
	checkObj: function (obj,tag,tree,parent) {
		// Checa todos os erros depois da criação do objeto
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
				this.checkObj(obj[element],isVector?tag:element,newTree,obj);
			}
			if (!isVector) {
				// obj = {...}
				this.checkAttrValues(obj,tag,parent,tree);
			}
		}
	},
	
	checkAttrValues: function (obj,tag,parent,tree) {
		if (tag == "ncl") {
			debugNCL(obj,this);
		} else {
			var functionCall = "debug" + tag[0].toUpperCase() + tag.slice(1,tag.length) + "(obj,this,parent,tree);";
			eval(functionCall);
		}
	},
	
	checkSyntax: function (parent) {
		// Sintaxe XML
		// TODO: verificar a sintaxe do arquivo XML
	},
	
	checkAttributes: function (parent, attrs, obj) {
		// Atributos inválidos
		// O parâmetro attrs deve ter o seguinte formato:
		// attr = {
		//		reference: [...],	// Atributos que podem ser referenciados (IDs)
		//		required: [...],	// Atributos obrigatórios
		//		optional: [...],	// Atributos opcionais
		//		custom: [...],		// Atributos com validação customizada pela função validate
		//		// A função validate é obrigatória apenas se custom não for vazio
		//		validate: function (attrs,errors) {
		//    	...
		//		}
		// }
		//	O parâmetro errors da função validate tem o seguinte formato:
		//	errors = [{
		//		code: N				// Código do erro
		//		params: [...]		// Parâmetros do erro
		//	}]
		var attrObj = $(parent).get(0).attributes;
		var parentName = $(parent).get(0).tagName;
		var foundAttrs = [];
		for (var i=0; i<attrObj.length; i++) {
			foundAttrs.push(attrObj.item(i).name);
		}
		// #
		for (attr in attrs.reference) {
			if ($(parent).attr(attrs.reference[attr])) {
				var type = attrs.reference[attr]=="focusIndex" ? "focusIndex" : parentName;
				if (!this.refTable.push($(parent).attr(attrs.reference[attr]),type,obj,$(parent).parent().attr("id"))) {
					this.error(this.ERR_DUPLICATED_ID,parentName,[attrs.reference[attr],$(parent).attr(attrs.reference[attr]),$(parent).parent().attr("id")]);
				}
			}
		}
		// !
		for (attr in attrs.required) {
			var index = foundAttrs.indexOf(attrs.required[attr]);
			if (index == -1) {
				this.error(this.ERR_MISSING_ATTR,parentName,[attrs.required[attr]]);
			} else {
				foundAttrs[index] = 0;
				while (index = foundAttrs.indexOf(attrs.required[attr]) != -1) {
					this.error(this.ERR_TOO_MANY_ATTRS,parentName,[attrs.required[attr]]);
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
					this.error(this.ERR_TOO_MANY_ATTRS,parentName,[attrs.required[attr]]);
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
					this.error(this.ERR_TOO_MANY_ATTRS,parentName,[attrs.oneOf[attr]]);
					foundAttrs[index] = 0;
				}
			}
		}
		if (!oneFound) {
			this.error(this.ERR_MISSING_ATTR_ONEOF,parentName,attrs.oneOf);
		}
		// custom
		if (attrs.custom.length > 0) {
			attrs.validate(foundAttrs,errors=[]);
			for (err in errors) {
				this.error(errors[err].code,parentName,errors[err].params);
			}
			for (attr in attrs.custom) {
				while ((index = foundAttrs.indexOf(attrs.custom[attr])) != -1) {
					foundAttrs[index] = 0;
				}
			}
		}
		// Atributos inválidos
		for (attr in foundAttrs) {
			if (foundAttrs[attr] != 0) {
				this.warning(this.WARN_INVALID_ATTR,parentName,[foundAttrs[attr]]);
			}
		}
	},
	
	checkChildrenTags: function (parent,tags) {
		// Tags inválidas
		// O parâmetro tags deve ter o seguinte formato:
		// tags = {
		//		optional: [...],	// Tags opcionais
		//		one: [...],			// Tags obrigatórias e únicas
		//		plus: [...],		// Tags obrigatórias e múltiplas
		//		plusOneOf: [...],	// Tags obrigatórias e múltiplas (pelo menos uma)
		//		star: [...],		// Tags opcionais e múltiplas
		//		custom: [...],		// Tags com validação customizada pela função validate
		//		// A função validate é obrigatória apenas se custom não for vazio
		//		validate: function (count,errors) {
		//    	...
		//		}
		// }
		//	O parâmetro errors da função validate tem o seguinte formato:
		//	errors = [{
		//		code: N				// Código do erro
		//		params: [...]		// Parâmetros do erro
		//	}]
		var parentName = $(parent).get(0).tagName;
		var tagCount = [];
		var validTags = [];
		validTags = validTags.concat(tags.one,tags.optional,tags.plus,tags.plusOneOf,tags.star,tags.custom);
		for (var tag in validTags) {
			tagCount[validTags[tag]] = 0;
		}
		$(parent).find("> *").each(function() {
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
				this.error(this.ERR_TOO_MANY_TAGS,parentName,[tags.optional[tag]]);
			}
			tagCount[tags.optional[tag]] = 0;
		}
		// 1
		for (var tag in tags.one) {
			if (tagCount[tags.one[tag]] > 1) {
				this.error(this.ERR_TOO_MANY_TAGS,parentName,[tags.one[tag]]);
			}
			if (tagCount[tags.one[tag]] == 0) {
				this.error(this.ERR_MISSING_TAG,parentName,[tags.one[tag]]);
			}
			tagCount[tags.one[tag]] = 0;
		}
		// +
		for (var tag in tags.plus) {
			if (tagCount[tags.plus[tag]] == 0) {
				this.error(this.ERR_MISSING_TAG,parentName,[tags.plus[tag]]);
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
			this.error(this.ERR_MISSING_TAG_ONEOF,parentName,tags.plusOneOf);
		}
		// *
		for (var tag in tags.star) {
			tagCount[tags.star[tag]] = 0;
		}
		// custom
		if (tags.custom.length > 0) {
			tags.validate(tagCount,errors=[]);
			for (err in errors) {
				this.error(errors[err].code,parentName,errors[err].params);
			}
			for (var tag in tags.custom) {
				tagCount[tags.custom[tag]] = 0;
			}			
		}
		// Tags inválidas
		for (var tag in tagCount) {
			if (tagCount[tag] > 0) {
				this.warning(this.WARN_INVALID_TAG,parentName,[tag]);
			}
		}
	},
	
	error: function (id, tag, params) {
		// Error
		console.error("[" + id + "] " + this.MESSAGES[id] + "\n" + tag + ": " + params.join(","));
		this.abort = true;
	},
	
	warning: function (id, tag, params) {
		// Warning
		console.warn("[" + id + "] " + this.MESSAGES[id] + "\n" + tag + ": " + params.join(","));
	}
};