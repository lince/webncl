// <assessmentStatement>
function debugAssessmentStatement (obj,tag,parent,tree) {
	// comparator
	values = ["eq","ne","gt","lt","gte","lte"];
	if (obj.comparator!=null && jQuery.inArray(obj.comparator,values)==-1) {
		Debugger.error(this.ERR_INVALID_ATTR_VALUE,tag,["comparator",obj.comparator,values]);
	}	
}