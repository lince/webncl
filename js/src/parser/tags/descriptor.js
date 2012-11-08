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
	values = ["(número real)s","HH:MM:SS"];
	patt1 = /^(\d+|\d*\.\d+)s$/;
	patt2 = /^\d+:\d+:\d+(\.\d+)?$/;
	if (obj.explicitDur != null) {
		// format: 0=invalid, 1='real number', 2='HH:MM:SS'
		var format = patt1.test(obj.explicitDur) ? 1 : (patt2.test(obj.explicitDur) ? 2 : 0);
		if (format == 0) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["explicitDur",obj.explicitDur,values]);
		} else {
			if (format == 1) {
				// removes the 's' from the end of the string
				obj.explicitDur = parseFloat(obj.explicitDur.split('s')[0]);
			} else {
				// calculates the number of seconds from the 'HH:MM:SS' format
				var arr = obj.explicitDur.split(':');
				var h = parseFloat(arr[0]);
				var m = parseFloat(arr[1]);
				var s = parseFloat(arr[2]);
				if (m>=60 || s>=60) { // ncl handbook also says that hours must be in [0,23] interval, but it's not necessary
					Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["explicitDur",obj.explicitDur,values]);
				} else {
					obj.explicitDur = parseFloat(h)*3600 + parseFloat(m)*60 + parseFloat(s);
				}
			}
		}
	}
	
	// freeze
	values = ["true","false"];
	if (obj.freeze!=null && jQuery.inArray(obj.freeze,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["freeze",obj.freeze,values]);
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
		patt = /^\d+,\d+,\d+$/;
		if (value != null) {
			if (jQuery.inArray(value,values)==-1 &&
					!patt.test(value)) {
				Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,[attr,value,values]);
			}
		}
	}
	// focusBorderWidth
	values = ["(número inteiro)"];
	patt = /^-?\d+$/;
	if (obj.focusBorderWidth!=null && !patt.test(obj.focusBorderWidth)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["focusBorderWidth",obj.focusBorderWidth,values]);
	}
	// focusBorderTransparency
	values = ["(número real entre 0 e 1)","(número real entre 0 e 100)%"];
	patt = /^((0?\.\d+|1(\.0+)?)|(\d?\d?\.\d+|100(\.0+)?)%)$/;
	if (obj.focusBorderTransparency!=null && !patt.test(obj.focusBorderTransparency)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["focusBorderTransparency",obj.focusBorderTransparency,values]);
	}	
};