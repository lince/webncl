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
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["instance",obj.instance,values]);
	}
	// type, src
	values = [
		"text/html","text/plain","text/css","text/xml","image/bmp","image/png","image/mng","image/gif","image/jpeg",
		"audio/basic","audio/mp3","audio/mp2","audio/mpeg","audio/mpeg4","video/mpeg","application/x-ginga-NCLua",
		"application/x-ginga-NCLet","application/x-ginga-settings","application/x-ginga-time","applications/x-ginga-NCL",
		"application/x-ncl-NCL","application/x-ncl-NCLua","application/x-ncl-NCLet","application/x-ncl-settings",
		"application/x-ncl-time"
	];
	// TODO: verificar o atributo "src" para os tipos "image/mng", "application/x-ncl-*", "applications/x-ginga-NCL"
	// "application/x-ginga-settings" e "application/x-ginga-time"
	if (obj.type!=null) {

                obj.type = obj.type.toLowerCase();

		if (jQuery.inArray(obj.type,values)==-1) {
			Debugger.error(ERR_INVALID_ATTR_VALUE,tag,["type",obj.type,values]);
		} else if (obj.src!=null) {
			var ext = obj.src.split(".");

                        obj._ext = ext[ext.length-1].toLowerCase();
                        ext = obj._ext;
                        //TODO: Verify attributes below using a dinamic table
			switch (obj.type) {
				case "text/html": {
					if (ext!="htm" && ext!="html") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"text/html",["htm","html"]]);
					}
					break;
				}
				case "text/plain": {
					if (ext!="txt") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"text/plain",["txt"]]);
					}
					break;
				}
				case "text/css": {
					if (ext!="css") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"text/css",["css"]]);
					}
					break;
				}
				case "text/xml": {
					if (ext!="xml") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"text/xml",["xml"]]);
					}
					break;
				}
				case "image/bmp": {
					if (ext!="bmp") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"image/bmp",["bmp"]]);
					}
					break;
				}
				case "image/png": {
					if (ext!="png") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"image/png",["png"]]);
					}
					break;
				}
				case "image/gif": {
					if (ext!="gif") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"image/gif",["gif"]]);
					}
					break;
				}
				case "image/jpeg": {
					if (ext!="jpg" && ext!="jpeg") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"image/jpeg",["jpg","jpeg"]]);
					}
					break;
				}
				case "audio/basic": {
					if (ext!="wav") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"audio/basic",["wav"]]);
					}
					break;
				}
				case "audio/mp3": {
					if (ext!="mp3") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"audio/mp3",["mp3"]]);
					}
					break;
				}
				case "audio/mp2": {
					if (ext!="mp2") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"audio/mp2",["mp2"]]);
					}
					break;
				}
				case "audio/mpeg": {
					if (ext!="mpeg" && ext!="mpg") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"audio/mpeg",["mpeg","mpg"]]);
					}
					break;
				}
				case "audio/mpeg4": {
					if (ext!="mp4" && ext!="mpg4") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"audio/mpeg4",["mp4","mpg4"]]);
					}
					break;
				}
				case "video/mpeg": {
					if (ext!="mpeg" && ext!="mpg") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"video/mpeg",["mpeg","mpg"]]);
					}
					break;
				}
				case "application/x-ginga-NCLua": {
					if (ext!="lua") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"application/x-ginga-NCLua",["lua"]]);
					}
					break;
				}
				case "application/x-ginga-NCLet": {
					if (ext!="class" && ext!="jar") {
						Debugger.error(Debugger.ERR_INCOMPATIBLE_FILE_EXT,tag,[ext,"application/x-ginga-NCLet",["class","jar"]]);
					}
					break;
				}
			}
		}
	}
};