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

Parser.prototype.parseDescriptor = function (obj,tag,parent,tree) {
	// explicitDur
	values = ["(número inteiro)s"];
	patt = /^\d+s$/;
	if (obj.explicitDur!=null && !patt.test(obj.explicitDur)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["explicitDur",obj.explicitDur,values]);
	}
	// freeze
	values = ["true","false"];
	if (obj.freeze!=null && jQuery.inArray(obj.freeze,values)==-1) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["freeze",obj.freeze,values]);
	}
	// focusBorderColor, selBorderColor
	attrs = ["focusBorderColor","selBorderColor"];
	values = [
		"white","black","silver","gray","red","maroon","fuchsia","purple","lime",
		"green","yellow","olive","blue","navy","aqua","teal"
	];
	for (var i in attrs) {
		attr = attrs[i];
		value = obj[attr];
		if (value != null) {
			if (jQuery.inArray(value,values)==-1) {
				Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,[attr,value,values]);
			}
		}
	}
	// focusBorderWidth
	values = ["(número inteiro)"];
	patt = /^-?\d+$/;
	if (obj.focusBorderWidth!=null && !patt.test(obj.focusBorderWidth)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["focusBorderWidth",obj.focusBorderWidth,values]);
	}
	// focusBorderTransparency
	values = ["(número real entre 0 e 1)","(número real entre 0 e 100)%"];
	patt = /^((0?\.\d+|1(\.0+)?)|(\d?\d?\.\d+|100(\.0+)?)%)$/;
	if (obj.focusBorderTransparency!=null && !patt.test(obj.focusBorderTransparency)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["focusBorderTransparency",obj.focusBorderTransparency,values]);
	}	
};