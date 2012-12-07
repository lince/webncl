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

function Parser (path,alias) {

	this.referenceMap =  new ReferenceMap(this);
	this.uniqueTable = {};
	this.path = path;
	this.alias = alias;
	this.url = '';
	this.ncl = undefined;
	this.parsers = {
		/*
		 alias#url: {
			loadTime: 0,
		    xmlParse: 0,
			parseTime: 0,
		    parser: new Parser(),
		 }
		 
		 */
	}
	
	this.__callback = undefined;
	this.loading = false;

	
};

Parser.prototype.loadFile = function(url,parseCallback,div) {
	if(this.loading)
		return false;
	
	this.loading = true;
	this.url = url;
	this.parsers[url] = {
		parser: this, 
		loadTime: 0,
		parseTime : 0,
		xmlParse : 0
	};
	this.info = this.parsers[url];
	this.__callback = parseCallback;
	
	this.__load(url,$.proxy(this.parse,this),div);
	
	return true;
}

Parser.prototype.loadString = function(nclCode, url, parseCallback) {
	if(this.loading)
		return false;
	
	this.loading = true;
	this.url = url;
	this.parsers[url] = {
		parser: this, 
		loadTime: 0,
		parseTime : 0,
		xmlParse : 0
	};
	this.info = this.parsers[url];
	this.__callback = parseCallback;
	
	this.info.loadTime = 0;
	this.info.parseTime = new Date();
	var xmlData = $($.parseXML(nclCode));
	this.info.parseTime = new Date() - this.info.parseTime;
	this.parse(xmlData);
	
	return true;
}



//__load
Parser.prototype.__load = function(url, callback, div)
{
	var datatype = div ? 'text' : 'xml';
	this.info.loadTime = new Date();

	$.ajax({
		type: "GET",
		url: url,
		context: {times: this.info,
				   callback: callback,
				   div: div},
		dataType: datatype,
		success: function (data) {
			var tm = this.times;
			tm.loadTime = new Date() - tm.loadTime;
			tm.xmlParse = new Date();
			var d = div ? $($.parseXML(data)).find("#"+this.div)[0] : data;
			tm.xmlParse = new Date() - tm.xmlParse;
			this.callback(d);
		},
		error: function(jqXHR,textStatus, errorThrown)
		{
			var tm = this.times;
			tm.loadTime = new Date() - tm.loadTime;
			Logger.error('PARSER',[textStatus,errorThrown]);
		}
	});	
}

Parser.prototype.parse = function (data) {
	if(!this.loading)
		return;
	
	var i = this.info;
	i.parseTime = new Date();	
	this.ncl = this.createNode(data);

	
	if(!this.uniqueTable['aliasList'])
	{
	
		this.referenceMap.createReferences();
		i.parseTime = new Date() - i.parseTime;
		
		if(this.__callback)
			this.__callback(this);

		this.loading = false;		
	} else {
		//start importing ncls
		i.parseTime = new Date() - i.parseTime;
		this.importNcl();
	}
	//this.importNcl(nclstruct.importList,0);
	

};

Parser.prototype.importNcl = function(lastParser)
{
	if(lastParser)
		for(var k in lastParser.parsers)
			this.parsers[[lastParser.alias,'#',k].join('')] = lastParser.parsers[k];

	var i = this.uniqueTable['aliasList'].splice(0,1);
	if(i.length > 0)
	{
		i[0].parser.load(this.path + i[0].url, $.proxy(this.importNcl,this));
	} else {
		var x = new Date(),f,o;
		
		//create references
		this.referenceMap.createReferences();
		
		//process regionBase importation
		if (this.importBaseList) {
			o = this.importBaseList.length;
		} else {
			o = 0;
		}
		
		for (f =0; f < o; f++)
		{
			var importBaseInfo = this.importBaseList[f];
			var ibiObj = importBaseInfo.obj;

			if(ibiObj.__parent._type === 'regionBase' && ibiObj.baseId)
			{//consider 'baseId' attribute (other methods of importation
			 //will import all regionBases)
				var rBase;
				if((rBase = importBaseInfo.parser.referenceMap.map[ibiObj.baseId]) && rBase.target)
				{
					
					rBase = rBase.target.obj;
					ibiObj.baseId = rBase;						//x reference
					rBase._alias = ibiObj.alias;				//
					
					if(rBase.region)	//regions exist to be imported
					{
						if(ibiObj.region)
						{
							if(!ibiObj.region.region)
								ibiObj.region.region  = [];
							
							$.merge(ibiObj.region.region,rBase.region);
						} else {
							this.ncl.head.regionBase.push(rBase);
						}						
					}

					
				} else {
					Logger.error(Logger.ERR_INVALID_ID_REFERENCE,[ibiObj.alias,'#',ibiObj.baseId].join(''),['importBase']);
					return;
				}
			} else {
				if(ibiObj.region)
				{
					//merge
					var l,u,v;
					v = importBaseInfo.parser.ncl.head.regionBase;
					u = v.length;
					if(!ibiObj.region.region)
						ibiObj.region.region  = [];
					for(l = 0; l < u; l++)
					{
						$.merge(ibiObj.region.region,v[l].region);
					}
				} else {
					if(importBaseInfo.parser.ncl.head.regionBase)
						$.merge(this.ncl.head.regionBase,importBaseInfo.parser.ncl.head.regionBase);
				}
			}
		}
		
		x = new Date() - x;
		this.info.parseTime += x;
		this.loading = false;
		if(this.__callback)
			this.__callback(this);
	}
}

Parser.prototype.createNode = function (parent, tagName, parentNode, tree) {
	tagName = tagName || "ncl";
	var data = $(parent).find(tagName==="ncl"?"ncl":"> "+tagName);
	if (data.length===0) return false;
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
		parser.parseAttributes(this,node,parentNode);
		parser.parseContent(this,node);
		for (i in allTags) {
			node[allTags[i]] = parser.createNode(this,allTags[i],node,newTree);
		}
		nodes.push(node);
		if (tagName === "ncl") {
			parser.parseNCL(node,tagName,parentNode,tree);
		} else {
			// TODO check why tagName[0] is undefined
			if (tagName[0]){
				parser["parse"+tagName[0].toUpperCase()+tagName.slice(1,tagName.length)](node,tagName,parentNode,tree);
			}
		}
	});
	return ($.inArray(tagName,Parser.isNotArray)===-1 ? nodes : nodes[0]);
};

Parser.prototype.parseAttributes = function (nodeXml, nodeObj,parentNode) {
	var attrObj = $(nodeXml).get(0).attributes;
	var nodeType = nodeObj["_type"];
	var attrs = Parser.nclStructureMap[nodeType].attrs;
	var attr,i;
	var foundAttrs = [];
	for ( i=0; i<attrObj.length; i++) {
		foundAttrs.push(attrObj.item(i).name);
	}
	// # (source)
	for ( i in attrs.reference_source) {
		for (attr in attrs.reference_source[i][0]) {
			if ($(nodeXml).attr(attrs.reference_source[i][0][attr])) {
				this.referenceMap.addSource(nodeObj,attrs.reference_source[i][0][attr],attrs.reference_source[i][1]);
			}
		}
	}
	// # (target)
	for ( attr in attrs.reference_target) {
		if ($(nodeXml).attr(attrs.reference_target[attr])) {
			var type = attrs.reference_target[attr]==="focusIndex" ? "focusIndex" : nodeType;
			if (!this.referenceMap.addTarget(nodeObj,$(nodeXml).attr(attrs.reference_target[attr]),parentNode,type)) {
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
		var errors;
		tags.validate(tagCount,errors=[]);
		for (var err in errors) {
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


/**
 * Class ReferenceMap
 *
 */

function ReferenceMap(parser)
{
		// Tabela de IDs que podem ser referenciados por outros objetos
		this.map= {};
		// ----- REFER -----
		this.instReuse = [];
		// -----------------	
		this.parser = parser;
}

ReferenceMap.prototype.addSource = function (obj,attr,type) {
	var rid = obj[attr];
	// TODO
	// - salvar todos os sources e todos os targets e, no final do parse, ligar as referências
	// - resolver o problema do transition (id1;id2;...)
	if (!this.map[rid]) {
		this.map[rid] = {
			sources: []
		};
	}

	this.map[rid].sources.push({
		obj: obj,
		attr: attr,
		type: type
	});
	
	if(rid.indexOf('#') !== -1)
	{
		//if alias was defined
		var t = rid.split('#');
		if(!this.map[rid].target)
		{
			this.map[rid].target = 
			{
				alias: t[0],
				id: t[1],
				obj: undefined,//ref,
				type: undefined,//refType,
				parents: []
			}
		}
	}
	
};

ReferenceMap.prototype.addTarget= function (ref,id,parent,refType) {
	var pid = parent.id;
	var newTarget = false;
	if (this.map[id]) {
		if (this.map[id].target) {
			if (refType==="property" || refType==="connectorParam") {
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
			parents: [],
			ptype: parent._type
		};
	}
	this.map[id].target.parents[pid] = true;
	return true;
};


ReferenceMap.prototype.pop= function (id) {
	return (this.map[id] ? this.map[id].target : false);
};
		
ReferenceMap.prototype.createReferences= function () {
	for (var id in this.map) {
		for (var i in this.map[id].sources) {
			var src = this.map[id].sources[i];
			var tg = this.map[id].target;
			if(tg && tg.alias)
			{
				var a = this.parser.uniqueTable.alias;
				if(a && a[tg.alias])
				{
					var o = a[tg.alias].parser.referenceMap.map[tg.id];
					if(a[tg.alias].allBases || a[tg.alias][o.target.ptype])
					if(o)
					{
						tg.obj = o.target.obj;
						tg.type = o.target.type;
						tg.ptype = o.target.ptype;
					}
				} else {
					Logger.error(ERR_INVALID_ALIAS,tg.alias,[src.attr,src.obj[src.attr],src.type]);
				}
			}
			if (tg && tg.obj && $.inArray(this.map[id].target.type,src.type)!=-1) {
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