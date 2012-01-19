document.write('<script type="text/javascript" src="jquery.js"></script>');

var NclDocument = {
	load: function (file) {
		var t1,t2;
		var tagList = [
			"ncl","head","body","regionBase","region","media","context","area","port","property","switch","switchPort","mapping","descriptor",
			"descriptorParam","descriptorBase","link","bind","linkParam","bindParam","connectorParam","assessmentStatement","attributeAssessment",
			"valueAssessment","compoundStatement","simpleCondition","compoundCondition","simpleAction","compoundAction","causalConnector",
			"connectorBase","ruleBase","rule","compositeRule","bindRule","defaultComponent","descriptorSwitch","defaultDescriptor","importBase",
			"importedDocumentBase","importNCL","transitionBase","transition","meta","metadata"
		];
		t1 = new Date();
		$.getScript("debugger.js");
		for (i in tagList) {
			$.getScript("debugger/"+tagList[i]+".js");
			if (i == tagList.length-1) {
				$.getScript("parser/"+tagList[i]+".js", function() {
					t2 = new Date();
					console.log("Script loading time: " + (t2-t1) + "ms");
					$(document).ready(function() {
						t1 = new Date();
						$.ajax({
							type: "GET",
							url: file,
							dataType: "xml",
							success: function (xml) {
								t2 = new Date();
								console.log("NCL loading time: " + (t2-t1) + "ms");
								t1 = new Date();
								var ncl = parseNCL(xml);
								t2 = new Date();
								console.log("Parsing time: " + (t2-t1) + "ms");
								$.ajax({
									type: "GET",
									url: file,
									dataType: "txt",
									success: function (data) {
										console.log("NCL lines: " + data.split("\n").length);
									}
								});
							}
						});
					});
				});
			} else {
				$.getScript("parser/"+tagList[i]+".js");
			}
		}
	}
};