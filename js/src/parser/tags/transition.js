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

Parser.prototype.parseTransition = function (obj,tag,parent,tree) {
	// type
	values = ["barWipe","irisWipe","clockWipe","snakeWipe","fade"];
	if (obj.type!=null && jQuery.inArray(obj.type,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["type",obj.type,values]);
	}
	// dur
	values = ["(número real positivo)s"];
	patt = /^(\d+|\d*\.\d+)s$/;
	if (obj.dur!=null && !patt.test(obj.dur)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["dur",obj.dur,values]);
	}
	// startProgress, endProgress
	values = ["(número real entre 0 e 1)"];
	patt = /^(0*\.\d+|1\.0)$/;
	if (obj.startProgress!=null && !patt.test(obj.startProgress)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["startProgress",obj.startProgress,values]);
	}
	if (obj.endProgress!=null && !patt.test(obj.endProgress)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["endProgress",obj.endProgress,values]);
	}
	// direction
	values = ["forward","reverse"];
	if (obj.direction!=null && jQuery.inArray(obj.direction,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["direction",obj.direction,values]);
	}
	// fadeColor
	values = [
		"white","black","silver","gray","red","maroon","fuchsia","purple","lime",
		"green","yellow","olive","blue","navy","aqua","teal"
	];
	if (obj.fadeColor!=null && jQuery.inArray(obj.fadeColor,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["fadeColor",obj.fadeColor,values]);
	}
	// horRepeat
	values = ["(número inteiro não negativo)"];
	patt = /^\d+$/;
	if (obj.horRepeat!=null && patt.test(obj.horRepeat,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["horRepeat",obj.horRepeat,values]);
	}
	// vertRepeat
	values = ["(número inteiro não negativo)"];
	patt = /^\d+$/;
	if (obj.vertRepeat!=null && patt.test(obj.vertRepeat,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["vertRepeat",obj.vertRepeat,values]);
	}
	// borderWidth
	values = ["(número inteiro não negativo)"];
	patt = /^\d+$/;
	if (obj.borderWidth!=null && patt.test(obj.borderWidth,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["borderWidth",obj.borderWidth,values]);
	}
	// borderColor
	values = [
		"white","black","silver","gray","red","maroon","fuchsia","purple","lime",
		"green","yellow","olive","blue","navy","aqua","teal","blend"
	];
	if (obj.borderColor!=null && jQuery.inArray(obj.borderColor,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["borderColor",obj.borderColor,values]);
	}	
};