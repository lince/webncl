// <descriptorParam>
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
		Debugger.error(Debugger.ERR_INVALID_ATTR_VALUE,tag,["name",obj.name,values]);
	}	
};