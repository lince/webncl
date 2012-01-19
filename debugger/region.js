// <region>
function debugRegion (obj,debug,parent,tree) {
	// left, right, top, bottom, height, width
	attrs = ["left","right","top","bottom","height","width"];
	values = ["(número inteiro)","(número inteiro)px","(número real)%"];
	for (var i in attrs) {
		attr = attrs[i]
		value = obj[attr];
		if (value != null) {
			patt = /^\s*(\d+|\d*\.\d+)\s*px\s*$|^\s*(\d+|\d*\.\d+)\s*%\s*$|^\s*(\d+|\d*\.\d+)\s*$/;
			if (!patt.test(value)) {
				debug.error(this.ERR_INVALID_ATTR_VALUE,tag,[attr,value,values]);
			}
		}
	}
	if (obj.left && obj.right && obj.width) {
		// TODO: verificar a soma de dimensões relativas (%)
		if (isFinite(obj.left) && isFinite(obj.right) && isFinite(obj.width) && isFinite(parent.width)) {
			var soma = parseInt(obj.left) + parseInt(obj.right) + parseInt(obj.width);
			if (soma!=parent.width) {
				debug.warning(debug.WARN_INVALID_REGION_DIMENSIONS,"region",[["left","right","width"],soma,parent.width]);
			}
		}
	}
	if (obj.top && obj.bottom && obj.height) {
		// TODO: verificar a soma de dimensões relativas (%)
		if (isFinite(obj.top) && isFinite(obj.bottom) && isFinite(obj.height) && isFinite(parent.height)) {
			var soma = parseInt(obj.top) + parseInt(obj.bottom) + parseInt(obj.height);
			if (soma!=parent.height) {
				debug.warning(debug.WARN_INVALID_REGION_DIMENSIONS,"region",[["top","bottom","height"],soma,parent.height]);
			}
		}
	}
	// zIndex
	values = ["número inteiro entre 0 e 255"];
	patt = /^\s*\d+\s*$/;
	if (obj.zIndex!=null && (!patt.test(obj.zIndex) || obj.zIndex<0 || obj.zIndex>255)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["zIndex",obj.zIndex,values]);
	} else {
		if (!debug.uniqueTable["zIndex"]) {
			debug.uniqueTable["zIndex"] = [];
		}
		if (debug.uniqueTable["zIndex"][obj.zIndex]) {
			if (!debug.uniqueTable["zIndex"][obj.zIndex].duplicated) {
				debug.uniqueTable["zIndex"][obj.zIndex].duplicated = true;
				debug.warning(debug.WARN_DUPLICATED_ZINDEX,"region",[obj.zIndex]);
			}
		} else {
			debug.uniqueTable["zIndex"][obj.zIndex] = {
				id: obj.id,
				duplicated: false
			};
		}
	}	
}