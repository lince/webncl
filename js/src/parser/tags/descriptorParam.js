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

Parser.prototype.parseDescriptorParam = function (obj,tag,parent,tree) {
	// name
	values = [
		"background","balanceLevel","baseDeviceRegion","bassLevel","bottom","bounds","deviceClass","fit","fontColor","fontFamily",
		"fontStyle","fontSize","fontVariant","fontWeight","height","left","location","plan","player","playerLife","reusePlayer",
		"right","scroll","size","soundLevel","style","top","transInBorderColor","transInBorderWidth","transInDirection",
		"transInDur","transInEndProgress","transInFadeColor","transInHorRepeat","transInStartProgress","transInSubtype",
		"transInType","transInVertRepeat","transBorderColor","transOutBorderWidth","transOutDirection","transOutDur",
		"transOutEndProgress","transOutFadeColor","transOutHorRepeat","transOutType","transOutStartProgress","transOutSubtype",
		"transOutVertRepeat","transparency","trebleLevel","visible","width","zIndex"
	];
	if (obj.name!=null && jQuery.inArray(obj.name,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["name",obj.name,values]);
	}	
};