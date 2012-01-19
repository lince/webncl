// <attributeAssessment>
function debugAttributeAssessment (obj,debug,parent,tree) {
	// role
	if (obj.role!=null) {
		var connectorID = tree.split("causalConnector#")[1].split(">")[0];
		if (!debug.uniqueTable["id#"+connectorID]) {
			debug.uniqueTable["id#"+connectorID] = [];
		}
		if (debug.uniqueTable["id#"+connectorID][obj.role]) {
			if (!debug.uniqueTable["id#"+connectorID][obj.role].duplicated) {
				debug.uniqueTable["id#"+connectorID][obj.role].duplicated = true;
				debug.error(debug.ERR_DUPLICATED_ATTR,"role",[obj.role,connectorID,["simpleAction","simpleCondition","attributeAssessment"]]);
			}
		} else {
			debug.uniqueTable["id#"+connectorID][obj.role] = {
				duplicated: false
			};
		}
	}
	// eventType
	values = ["selection","presentation","attribution"];
	if (obj.eventType!=null && jQuery.inArray(obj.eventType,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["eventType",obj.eventType,values]);
	}
	// key
	values = [
		"0-9","A-Z","*","#","MENU","INFO","GUIDE","CURSOR_DOWN","CURSOR_LEFT","CURSOR_RIGHT",
		"CURSOR_UP","CHANNEL_DOWN","CHANNEL_UP","VOLUME_DOWN","VOLUME_UP","ENTER","RED","GREEN",
		"YELLOW","BLUE","BACK","EXIT","POWER","REWIND","STOP","EJECT","PLAY","RECORD","PAUSE"
	];
	patt = /^\s*([0-9A-Z]|\*|#|MENU|INFO|GUIDE|CURSOR_DOWN|CURSOR_LEFT|CURSOR_RIGHT|CURSOR_UP|CHANNEL_DOWN|CHANNEL_UP|VOLUME_DOWN|VOLUME_UP|ENTER|RED|GREEN|YELLOW|BLUE|BACK|EXIT|POWER|REWIND|STOP|EJECT|PLAY|RECORD|PAUSE)\s*$/;
	if (obj.key==null) {
		if (obj.eventType=="selection") {
			debug.error(debug.ERR_MISSING_ATTR,tag,["key"]);
		}
	} else if (!patt.test(obj.key)) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["key",obj.key,values]);
	}
	// attributeType
	switch (obj.eventType) {
		case "selection": {
			values = ["occurences","state"];
			break;
		}
		case "presentation": {
			values = ["occurences","state","repetitions"];
			break;
		}
		case "attribution": {
			values = ["occurences","state","repetitions","nodeProperty"];
			break;
		}
	}
	if (obj.attributeType!=null && jQuery.inArray(obj.attributeType,values)==-1) {
		debug.error(this.ERR_INVALID_ATTR_VALUE,tag,["attributeType",obj.attributeType,values]);
	}
}