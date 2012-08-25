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

Parser.prototype.parseMedia = function (obj,tag,parent,tree) {
	// instance
	values = ["new","instSame","gradSame"];
	if (obj.instance!=null && jQuery.inArray(obj.instance,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["instance",obj.instance,values]);
	}
	// type
	if (obj.type!=null) {
		obj.type = obj.type.toLowerCase();
	}
	// _ext
	var ext = obj.src ? obj.src.split('.') : [];
	var type = obj.type ? obj.type.split('/') : [];
	if (ext.length > 1) {
		obj._ext = ext[ext.length-1];
	} else if (type.length > 1) {
		obj._ext = type[type.length-1];
	} else {
		obj._ext = undefined;
	}
	
};