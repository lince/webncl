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

Parser.prototype.parseSimpleCondition = function (obj,tag,parent,tree) {
	// role
	values = ["onBegin","onEnd","onAbort","onPause","onResume","onSelection","onBeginAttribution","onEndAttribution"];
	if (obj.role!=null && jQuery.inArray(obj.role,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["role",obj.role,values]);
	}
	if (obj.role!=null) {
		if (jQuery.inArray(obj.role,values)==-1) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["role",obj.role,values]);
		} else {
			var connectorID = tree.split("causalConnector#")[1].split(">")[0];
			if (!this.uniqueTable["id#"+connectorID]) {
				this.uniqueTable["id#"+connectorID] = [];
			}
			if (this.uniqueTable["id#"+connectorID][obj.role]) {
				if (!this.uniqueTable["id#"+connectorID][obj.role].duplicated) {
					this.uniqueTable["id#"+connectorID][obj.role].duplicated = true;
					Logger.error(Logger.ERR_DUPLICATED_ATTR,"role",[obj.role,connectorID,["simpleAction","simpleCondition","attributeAssessment"]]);
				}
			} else {
				this.uniqueTable["id#"+connectorID][obj.role] = {
					duplicated: false
				};
			}
		}
	}
	// transition
	values = ["starts","stops","pauses","resumes","aborts"];
	if (obj.transition!=null && jQuery.inArray(obj.transition,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["transition",obj.transition,values]);
	}
	// eventType
	values = ["presentation","selection","attribution"];
	if (obj.eventType!=null && jQuery.inArray(obj.eventType,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["eventType",obj.eventType,values]);
	}
	// key
	values = [
		"VARIAVEL","0-9","A-Z","*","#","MENU","INFO","GUIDE","CURSOR_DOWN","CURSOR_LEFT","CURSOR_RIGHT",
		"CURSOR_UP","CHANNEL_DOWN","CHANNEL_UP","VOLUME_DOWN","VOLUME_UP","ENTER","RED","GREEN",
		"YELLOW","BLUE","BACK","EXIT","POWER","REWIND","STOP","EJECT","PLAY","RECORD","PAUSE"
	];
	patt = /^([0-9A-Z]|\*|\$[A-Za-z_][0-9A-Za-z_]*|#|MENU|INFO|GUIDE|CURSOR_DOWN|CURSOR_LEFT|CURSOR_RIGHT|CURSOR_UP|CHANNEL_DOWN|CHANNEL_UP|VOLUME_DOWN|VOLUME_UP|ENTER|RED|GREEN|YELLOW|BLUE|BACK|EXIT|POWER|REWIND|STOP|EJECT|PLAY|RECORD|PAUSE)$/;
	if (obj.key!=null && !patt.test(obj.key)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["key",obj.key,values]);
	}
	// min
	values = ["(n�mero inteiro entre 1 e max)"];
	patt = /^\d+$/;
	if (obj.min!=null) {
		if (!patt.test(obj.min)) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["min",obj.min,values]);
		} else {
			if (parseInt(obj.min)<1 || (obj.max!=null && obj.max!="unbounded" && parseInt(obj.max)<parseInt(obj.min))) {
				Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["min",obj.min,values]);
			}
		}
	}
	// max
	values = ["(n�mero inteiro maior ou igual a min)","unbounded"];
	patt = /^(\d+|unbounded)$/;
	if (obj.max!=null) {
		if (!patt.test(obj.max)) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["max",obj.max,values]);
		} else {
			if (obj.max!="unbounded") {
				if (parseInt(obj.max)<1 || (obj.min!=null && parseInt(obj.max)<parseInt(obj.min))) {
					Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["max",obj.max,values]);
				}
			}
		}
	}
	// qualifier
	values = ["and","or"];
	if (obj.qualifier==null) {
		if (obj.min!=null && parseInt(obj.min)>1) {
			Logger.error(Logger.ERR_MISSING_ATTR,tag,["qualifier"]);
		} else if (obj.max!=null && (obj.max=="unbounded" || parseInt(obj.max)>1)) {
			Logger.error(Logger.ERR_MISSING_ATTR,tag,["qualifier"]);
		}
	} else if (jQuery.inArray(obj.qualifier,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["qualifier",obj.qualifier,values]);
	}
};
