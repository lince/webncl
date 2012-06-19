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

Parser.prototype.parseProperty = function (obj,tag,parent,tree) {
	// name
	values = [
		"system.language","system.caption","system.subtitle","system.returnBitRate(i)","system.screenSize",
		"system.screenGraphicSize","system.audioType","system.screenSize(i)","system.screenGraphicSize(i)",
		"system.audioType(i)","system.devNumber(i)","system.classType(i)","system.info(i)","system.classNumber",
		"system.CPU","system.memory","system.operatingSystem","system.javaConfiguration","system.javaProfile",
		"system.luaVersion","user.age","user.location","user.genre","default.focusBorderColor",
		"default.selBorderColor","default.focusBorderWidth","default.focusBorderTransparency",
		"service.currentFocus","service.currentKeyMaster","si.numberOfServices","si.numberOfPartialServices",
		"si.channelNumber","channel.keyCapture","channel.virtualKeyBoard","channel.keyboardBounds"
	];
	if (obj.name!=null && jQuery.inArray(obj.name,values)==-1) {
		patt = /^system\.(returnBitRate|screenSize|screenGraphicSize|audioType|devNumber|classType|info)\(\d+\)$/;
		if (!patt.test(obj.name)) {
			//Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["name",obj.name,values]);
		}
	}	
};