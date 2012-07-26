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

Parser.prototype.parseArea = function (obj,tag,parent,tree) {

	// begin, end
	
	attrs = ["begin","end"]; 
	values = ["(número real)s","HH:MM:SS"];
	patt1 = /^(\d+|\d*\.\d+)s$/;
	patt2 = /^\d+:\d+:\d+(\.\d+)?$/;
	var format = 0;
	// 'attrs' array is used to parse both 'begin' and 'end' in a loop, since they are very similar:
	// 1. validates 'begin' and 'end' properties
	// 2. creates 'beginTime' and 'endTime' properties, which are used by MediaPlayer
	for (i in attrs) {
		var attr = attrs[i];
		obj[attr+'Time'] = ''; // beginTime and endTime
		if (obj[attr] != null) {
			// format: 0=invalid, 1='real number', 2='HH:MM:SS'
			format = patt1.test(obj[attr]) ? 1 : (patt2.test(obj[attr]) ? 2 : 0);
			if (format == 0) {
				Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,[attr,obj[attr],values]);
				obj[attr+'Time'] = 'invalid'; // just for debugging, it's not used
				obj._ignore = true;
			} else {
				if (format == 1) {
					// removes the 's' from the end of the string
					obj[attr+'Time'] = parseFloat(obj[attr].split('s')[0]);
				} else {
					// calculates the number of seconds from the 'HH:MM:SS' format
					var arr = obj[attr].split(':');
					var h = parseFloat(arr[0]);
					var m = parseFloat(arr[1]);
					var s = parseFloat(arr[2]);
					if (m>=60 || s>=60) { // ncl handbook also says that hours must be in [0,23] interval, but it's not necessary
						Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,[attr,obj[attr],values]);
						obj[attr+'Time'] = 'invalid'; // just for debugging, it's not used
						obj._ignore = true;
					} else {
						obj[attr+'Time'] = parseFloat(h)*3600 + parseFloat(m)*60 + parseFloat(s);
					}
				}
			}
		} else {
			// beginTime='begin' means that the area has no 'begin' property, so the area starts at the beginning of the media
			// endTime='end' means that the area has no 'end' property, so the area ends at the end of the media
			obj[attr+'Time'] = attr;
		}
	}
	// area is ignored if begin > end
	if (obj.begin!=null && obj.end!=null && obj.beginTime>obj.endTime) {
		Logger.warning(Logger.WARN_INVALID_AREA,tag,["begin","end"]);
		obj._ignore = true;
	}
	
	// first, last
	
	values = ["(número inteiro)"];
	patt = /^\d+$/;
	if (obj.first!=null && !patt.test(obj.first)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["first",obj.first,values]);
	}
	if (obj.last!=null && !patt.test(obj.last)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["last",obj.last,values]);
	}
};