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

Parser.prototype.parseRegion = function (obj,tag,parent,tree) {
	obj._parent = parent;
	// left, right, top, bottom, height, width
	attrs = ["left","right","top","bottom","height","width"];
	values = ["(n�mero inteiro)","(n�mero inteiro)px","(n�mero real)%"];
	for (var i in attrs) {
		attr = attrs[i]
		value = obj[attr];
		if (value != null) {
			patt = /^(\d+|\d*\.\d+)px$|^(\d+|\d*\.\d+)%$|^(\d+|\d*\.\d+)$/;
			if (!patt.test(value)) {
				Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,[attr,value,values]);
			}
		}
	}
	if (obj.left && obj.right && obj.width) {
		// TODO: verificar a soma de dimens�es relativas (%)
		if (isFinite(obj.left) && isFinite(obj.right) && isFinite(obj.width) && isFinite(parent.width)) {
			var soma = parseInt(obj.left) + parseInt(obj.right) + parseInt(obj.width);
			if (soma!=parent.width) {
				Logger.warning(Logger.WARN_INVALID_REGION_DIMENSIONS,"region",[["left","right","width"],soma,parent.width]);
			}
		}
	}
	if (obj.top && obj.bottom && obj.height) {
		// TODO: verificar a soma de dimens�es relativas (%)
		if (isFinite(obj.top) && isFinite(obj.bottom) && isFinite(obj.height) && isFinite(parent.height)) {
			var soma = parseInt(obj.top) + parseInt(obj.bottom) + parseInt(obj.height);
			if (soma!=parent.height) {
				Logger.warning(Logger.WARN_INVALID_REGION_DIMENSIONS,"region",[["top","bottom","height"],soma,parent.height]);
			}
		}
	}
	// zIndex
	values = ["n�mero inteiro entre 0 e 255"];
	patt = /^\d+$/;
	if (obj.zIndex!=null && (!patt.test(obj.zIndex) || obj.zIndex<0 || obj.zIndex>255)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["zIndex",obj.zIndex,values]);
	} else {
		if (!this.uniqueTable["zIndex"]) {
			this.uniqueTable["zIndex"] = [];
		}
		if (this.uniqueTable["zIndex"][obj.zIndex]) {
			if (!this.uniqueTable["zIndex"][obj.zIndex].duplicated) {
				this.uniqueTable["zIndex"][obj.zIndex].duplicated = true;
				Logger.warning(Logger.WARN_DUPLICATED_ZINDEX,"region",[obj.zIndex]);
			}
		} else {
			this.uniqueTable["zIndex"][obj.zIndex] = {
				id: obj.id,
				duplicated: false
			};
		}
	}	
};