function libHttp(){
	
	
	
};

libHttp.prototype.request = function(attr0){
	var req = attr0;
	var data = req.str['data'] || '';	
	
	
	if (data != undefined || data != '') {
		data = data.str;
	}
	
	
	
	//var result = $.ajax(jsonParam);
	
	
	var http_response = '';

	var result = $.ajax({
		type : req.str['type'],
		url : req.str['url'],
		dataType : req.str['dataType'],
		data: data,
		async : false,
		/*success : $.proxy(function(data) {
			///console.log (data);
			//http_response = data.toString();
			

		}, this),
		error : function() {
			//console.log('erro');
			//http_response='error';
		}*/
	});
	

	return [result.responseText];
}
