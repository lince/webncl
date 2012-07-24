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
	values = ["(número real)s"];
	patt = /^(\d+|\d*\.\d+)s$/;
	if (obj.begin!=null && !patt.test(obj.begin)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["begin",obj.begin,values]);
	}
	if (obj.end!=null && !patt.test(obj.end)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["end",obj.end,values]);
	}
	if (parent.type=="application/x-ginga-time" && (obj.begin==null && obj.end==null)) {
		Logger.error(Logger.ERR_MISSING_ATTR,tag,["begin","end"]);
	}
	if (obj.begin!=null && obj.end!=null) {
		var begin = parseFloat(obj.begin.split('s')[0]);
		var end = parseFloat(obj.end.split('s')[0]);
		if (begin > end) {
			Logger.warning(Logger.WARN_INVALID_AREA,tag,["begin","end"]);
			obj._ignore = true;
		}
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