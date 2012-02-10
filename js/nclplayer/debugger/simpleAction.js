// <simpleAction>
function debugSimpleAction (obj,tag,parent,tree) {
	// role
	values = ["start","stop","abort","pause","resume","set"];
	if (obj.role!=null && jQuery.inArray(obj.role,values)==-1) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["role",obj.role,values]);
	}
	if (obj.role!=null) {
		if (jQuery.inArray(obj.role,values)==-1) {
			Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["role",obj.role,values]);
		} else {
			var connectorID = tree.split("causalConnector#")[1].split(">")[0];
			if (!Debugger.uniqueTable["id#"+connectorID]) {
				Debugger.uniqueTable["id#"+connectorID] = [];
			}
			if (Debugger.uniqueTable["id#"+connectorID][obj.role]) {
				if (!Debugger.uniqueTable["id#"+connectorID][obj.role].duplicated) {
					Debugger.uniqueTable["id#"+connectorID][obj.role].duplicated = true;
					Debugger.error(Debugger.ERR_DUPLICATED_ATTR,"role",[obj.role,connectorID,["simpleAction","simpleCondition","attributeAssessment"]]);
				}
			} else {
				Debugger.uniqueTable["id#"+connectorID][obj.role] = {
					duplicated: false
				};
			}
		}
	}
	// actionType
	values = ["start","stop","abort","pause","resume"];
	if (obj.actionType!=null && jQuery.inArray(obj.actionType,values)==-1) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["actionType",obj.actionType,values]);
	}
	// eventType
	values = ["presentation","selection","attribution"];
	if (obj.eventType!=null && jQuery.inArray(obj.eventType,values)==-1) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["eventType",obj.eventType,values]);
	}
	// value
	if (obj.value==null) {
		if (obj.eventType=="attribution" || obj.role=="set") {
			Debugger.error(Debugger.ERR_MISSING_ATTR,tag,["value"]);
		}
	}
	// min
	values = ["(número inteiro entre 1 e max)"];
	patt = /^\d+$/;
	if (obj.min!=null) {
		if (!patt.test(obj.min)) {
			Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["min",obj.min,values]);
		} else {
			if (parseInt(obj.min)<1 || (obj.max!=null && obj.max!="unbounded" && parseInt(obj.max)<parseInt(obj.min))) {
				Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["min",obj.min,values]);
			}
		}
	}
	// max
	values = ["(número inteiro maior ou igual a min)","unbounded"];
	patt = /^(\d+|unbounded)$/;
	if (obj.max!=null) {
		if (!patt.test(obj.max)) {
			Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["max",obj.max,values]);
		} else {
			if (obj.max!="unbounded") {
				if (parseInt(obj.max)<1 || (obj.min!=null && parseInt(obj.max)<parseInt(obj.min))) {
					Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["max",obj.max,values]);
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
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["qualifier",obj.qualifier,values]);
	}
	// repeat
	values = ["(número inteiro positivo)"];
	patt = /^\d+$/;
	if (obj.repeat!=null && !patt.test(obj.repeat)) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["repeat",obj.repeat,values]);
	}
	// duration
	values = ["(número inteiro positivo)s"];
	patt = /^\d+s$/;
	if (obj.duration!=null && !patt.test(obj.duration)) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["duration",obj.duration,values]);
	}
}