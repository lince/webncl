<?xml version="1.0" encoding="ISO-8859-1"?>
<ncl id="sample" xmlns="http://www.ncl.org.br/NCL3.0/EDTVProfile">
	<head>
		<regionBase>
			<region id="rTV" width="100%" height="100%" zIndex="1"/>		
		</regionBase>
		
		
		<descriptorBase>
			<descriptor id="dTV" region="rTV" />
		</descriptorBase>
		</head>
	
	<body>
		
		<port id="plua" component="luascript" />
		
		<media id="luascript" descriptor="dTV" src="test.lua" />
		
	</body>
</ncl>