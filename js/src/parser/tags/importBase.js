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

Parser.prototype.parseImportBase = function (obj,tag,parent,tree) {
	// alias
	if (!this.uniqueTable["alias"]) {
		this.uniqueTable["alias"] = {};
		this.uniqueTable["aliasList"] = [];
	}
	
	if (this.uniqueTable["alias"][obj.alias]) {
		if (!this.uniqueTable["alias"][obj.alias].duplicated) {
			this.uniqueTable["alias"][obj.alias].duplicated = true;
			Logger.error(Logger.ERR_DUPLICATED_ALIAS,"importBase",[obj.alias]);
		}
	} else {
		this.uniqueTable["alias"][obj.alias] = {
			duplicated: false,
			url : obj.documentURI,
			//(imported flag can be implemented later for
			//dinamic importing. Eg.: importing only when needed
			//imported: false,
			parser : new Parser(this.path),
			//by what base this element is acessible
			allBases: false,
			base : parent._type
		};
		this.uniqueTable['aliasList'].push(this.uniqueTable["alias"][obj.alias]);
	}	

	// 
};