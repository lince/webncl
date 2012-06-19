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

Parser.prototype.parseRegionBase = function (obj,tag,parent,tree) {
	// device
	values = ["systemScreen(i)","systemAudio(i)"];
	patt = /^systemScreen\(\d+\)$|^systemAudio\(\d+\)$/;
	if (obj.device!=null && !patt.test(obj.device)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["device",obj.device,values]);
	}	
};