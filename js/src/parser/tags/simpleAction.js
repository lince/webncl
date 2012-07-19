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

Parser.prototype.parseSimpleAction = function (obj,tag,parent,tree) {
	// role
	values = ["start","stop","abort","pause","resume","set"];
	if (obj.role!=null && jQuery.inArray(obj.role,values)==-1) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["role",obj.role,values]);
	}
	if (obj.role!=null) {
		if (jQuery.inArray(obj.role,values)==-1) {
			Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["role",obj.role,values]);
		} else {
			var connectorID = tree.split("causalConnector#")[1].split(">")[0];
			if (!this.uniqueTable["id#"+connectorID]) {
				this.uniqueTable["id#"+connectorID] = [];
			}
			if (this.uniqueTable["id#"+connectorID][obj.role]) {
				if (!this.uniqueTable["id#"+connectorID][obj.role].duplicated) {
					this.uniqueTable["id#"+connectorID][obj.role].duplicated = true;
					Debugger.error(Debugger.ERR_DUPLICATED_ATTR,"role",[obj.role,connectorID,["simpleAction","simpleCondition","attributeAssessment"]]);
				}
			} else {
				this.uniqueTable["id#"+connectorID][obj.role] = {
					duplicated: false
				};
			}
		}
	}
	// actionType
	values = ["start","stop","abort","pause","resume"];
	if (obj.actionType!=null && jQuery.inArray(obj.actionType,values)==-1) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["actionType",obj.actionType,values]);
	}
	// eventType
	values = ["presentation","selection","attribution"];
	if (obj.eventType!=null && jQuery.inArray(obj.eventType,values)==-1) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["eventType",obj.eventType,values]);
	}
	// value
	if (obj.value==null) {
		if (obj.eventType=="attribution" || obj.role=="set") {
			Debugger.error(Debugger.ERR_MISSING_ATTR,tag,["value"]);
		}
	}
	// min
	values = ["(n�mero inteiro entre 1 e max)"];
	patt = /^\d+$/;
	if (obj.min!=null) {
		if (!patt.test(obj.min)) {
			Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["min",obj.min,values]);
		} else {
			if (parseInt(obj.min)<1 || (obj.max!=null && obj.max!="unbounded" && parseInt(obj.max)<parseInt(obj.min))) {
				Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["min",obj.min,values]);
			}
		}
	}
	// max
	values = ["(n�mero inteiro maior ou igual a min)","unbounded"];
	patt = /^(\d+|unbounded)$/;
	if (obj.max!=null) {
		if (!patt.test(obj.max)) {
			Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["max",obj.max,values]);
		} else {
			if (obj.max!="unbounded") {
				if (parseInt(obj.max)<1 || (obj.min!=null && parseInt(obj.max)<parseInt(obj.min))) {
					Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["max",obj.max,values]);
				}
			}
		}
	}
	// qualifier
	values = ["par","seq"];
	if (obj.qualifier==null) {
		if (obj.min!=null && parseInt(obj.min)>1) {
			Debugger.error(Debugger.ERR_MISSING_ATTR,tag,["qualifier"]);
		} else if (obj.max!=null && (obj.max=="unbounded" || parseInt(obj.max)>1)) {
			Debugger.error(Debugger.ERR_MISSING_ATTR,tag,["qualifier"]);
		}
	} else if (jQuery.inArray(obj.qualifier,values)==-1) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["qualifier",obj.qualifier,values]);
	}
	// repeat
	values = ["(n�mero inteiro positivo)"];
	patt = /^\d+$/;
	if (obj.repeat!=null && !patt.test(obj.repeat)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["repeat",obj.repeat,values]);
	}
	// duration
	values = ["(n�mero real positivo)s"];
	patt = /^(\d+|\d*\.\d+)s$/;
	if (obj.duration!=null && !patt.test(obj.duration)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["duration",obj.duration,values]);
	}
};