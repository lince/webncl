// <region>
Parser.prototype.parseRegion = function (obj,tag,parent,tree) {
	// left, right, top, bottom, height, width
	attrs = ["left","right","top","bottom","height","width"];
	values = ["(número inteiro)","(número inteiro)px","(número real)%"];
	for (var i in attrs) {
		attr = attrs[i]
		value = obj[attr];
		if (value != null) {
			patt = /^(\d+|\d*\.\d+)px$|^(\d+|\d*\.\d+)%$|^(\d+|\d*\.\d+)$/;
			if (!patt.test(value)) {
				Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,[attr,value,values]);
			}
		}
	}
	if (obj.left && obj.right && obj.width) {
		// TODO: verificar a soma de dimensões relativas (%)
		if (isFinite(obj.left) && isFinite(obj.right) && isFinite(obj.width) && isFinite(parent.width)) {
			var soma = parseInt(obj.left) + parseInt(obj.right) + parseInt(obj.width);
			if (soma!=parent.width) {
				Debugger.warning(Debugger.WARN_INVALID_REGION_DIMENSIONS,"region",[["left","right","width"],soma,parent.width]);
			}
		}
	}
	if (obj.top && obj.bottom && obj.height) {
		// TODO: verificar a soma de dimensões relativas (%)
		if (isFinite(obj.top) && isFinite(obj.bottom) && isFinite(obj.height) && isFinite(parent.height)) {
			var soma = parseInt(obj.top) + parseInt(obj.bottom) + parseInt(obj.height);
			if (soma!=parent.height) {
				Debugger.warning(Debugger.WARN_INVALID_REGION_DIMENSIONS,"region",[["top","bottom","height"],soma,parent.height]);
			}
		}
	}
	// zIndex
	values = ["número inteiro entre 0 e 255"];
	patt = /^\d+$/;
	if (obj.zIndex!=null && (!patt.test(obj.zIndex) || obj.zIndex<0 || obj.zIndex>255)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["zIndex",obj.zIndex,values]);
	} else {
		if (!this.uniqueTable["zIndex"]) {
			this.uniqueTable["zIndex"] = [];
		}
		if (this.uniqueTable["zIndex"][obj.zIndex]) {
			if (!this.uniqueTable["zIndex"][obj.zIndex].duplicated) {
				this.uniqueTable["zIndex"][obj.zIndex].duplicated = true;
				Debugger.warning(Debugger.WARN_DUPLICATED_ZINDEX,"region",[obj.zIndex]);
			}
		} else {
			this.uniqueTable["zIndex"][obj.zIndex] = {
				id: obj.id,
				duplicated: false
			};
		}
	}	
};