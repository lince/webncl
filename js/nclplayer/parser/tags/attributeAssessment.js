// <attributeAssessment>
Parser.prototype.parseAttributeAssessment = function (obj,tag,parent,tree) {
	// role
	if (obj.role!=null) {
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
	// eventType
	values = ["selection","presentation","attribution"];
	if (obj.eventType!=null && jQuery.inArray(obj.eventType,values)==-1) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["eventType",obj.eventType,values]);
	}
	// key
	values = [
		"0-9","A-Z","*","#","MENU","INFO","GUIDE","CURSOR_DOWN","CURSOR_LEFT","CURSOR_RIGHT",
		"CURSOR_UP","CHANNEL_DOWN","CHANNEL_UP","VOLUME_DOWN","VOLUME_UP","ENTER","RED","GREEN",
		"YELLOW","BLUE","BACK","EXIT","POWER","REWIND","STOP","EJECT","PLAY","RECORD","PAUSE"
	];
	patt = /^([0-9A-Z]|\*|#|MENU|INFO|GUIDE|CURSOR_DOWN|CURSOR_LEFT|CURSOR_RIGHT|CURSOR_UP|CHANNEL_DOWN|CHANNEL_UP|VOLUME_DOWN|VOLUME_UP|ENTER|RED|GREEN|YELLOW|BLUE|BACK|EXIT|POWER|REWIND|STOP|EJECT|PLAY|RECORD|PAUSE)$/;
	if (obj.key==null) {
		if (obj.eventType=="selection") {
			Debugger.error(Debugger.ERR_MISSING_ATTR,tag,["key"]);
		}
	} else if (!patt.test(obj.key)) {
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["key",obj.key,values]);
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
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["attributeType",obj.attributeType,values]);
	}
};