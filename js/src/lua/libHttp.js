function libHttp(){
		
};

libHttp.prototype.request = function(attr0){
	var req = attr0;
	var data = req.str['data'] || '';	
	
	
	if (data != undefined || data != '') {
		data = data.str;
	}
		
	var http_response = '';

	var result = $.ajax({
		type : req.str['type'],
		url : req.str['url'],
		dataType : req.str['dataType'],
		data: data,
		async : false,
		});
	
	return [result.responseText];
}
