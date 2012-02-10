// <simpleCondition>
function debugSimpleCondition (obj,tag,parent,tree) {
	// role
	values = ["onBegin","onEnd","onAbort","onPause","onResume","onSelection","onBeginAttribution","onEndAttribution"];
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
	// transition
	values = ["starts","stops","pauses","resumes","aborts"];
	if (obj.transition!=null && jQuery.inArray(obj.transition,values)==-1) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["transition",obj.transition,values]);
	}
	// eventType
	values = ["presentation","selection","attribution"];
	if (obj.eventType!=null && jQuery.inArray(obj.eventType,values)==-1) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["eventType",obj.eventType,values]);
	}
	// key
	values = [
		"0-9","A-Z","*","#","MENU","INFO","GUIDE","CURSOR_DOWN","CURSOR_LEFT","CURSOR_RIGHT",
		"CURSOR_UP","CHANNEL_DOWN","CHANNEL_UP","VOLUME_DOWN","VOLUME_UP","ENTER","RED","GREEN",
		"YELLOW","BLUE","BACK","EXIT","POWER","REWIND","STOP","EJECT","PLAY","RECORD","PAUSE"
	];
	patt = /^([0-9A-Z]|\*|#|MENU|INFO|GUIDE|CURSOR_DOWN|CURSOR_LEFT|CURSOR_RIGHT|CURSOR_UP|CHANNEL_DOWN|CHANNEL_UP|VOLUME_DOWN|VOLUME_UP|ENTER|RED|GREEN|YELLOW|BLUE|BACK|EXIT|POWER|REWIND|STOP|EJECT|PLAY|RECORD|PAUSE)$/;
	if (obj.key!=null && !patt.test(obj.key)) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["key",obj.key,values]);
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
	values = ["and","or"];
	if (obj.qualifier==null) {
		if (obj.min!=null && parseInt(obj.min)>1) {
			Debugger.error(Debugger.ERR_MISSING_ATTR,tag,["qualifier"]);
		} else if (obj.max!=null && (obj.max=="unbounded" || parseInt(obj.max)>1)) {
			Debugger.error(Debugger.ERR_MISSING_ATTR,tag,["qualifier"]);
		}
	} else if (jQuery.inArray(obj.qualifier,values)==-1) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["qualifier",obj.qualifier,values]);
	}
}