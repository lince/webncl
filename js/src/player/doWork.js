self.addEventListener('message', function(e) {
	var data = e.data;
	
	switch (data.operation){
		case 0: self.postMessage('operation is newCanvas!');
		break;
		case 1: self.postMessage('operation is newCanvasImage!');
		break;
		
	}
  
}, false);