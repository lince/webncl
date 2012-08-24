<?xml version="1.0" encoding="ISO-8859-1"?>
<ncl id="sample" xmlns="http://www.ncl.org.br/NCL3.0/EDTVProfile">
	<head>
		<regionBase>
			<region id="rTV" width="100%" height="100%" zIndex="1" />
			<region id="rImage" width="20%" height="20%" zIndex="1" />		
		</regionBase>
		
		
		<descriptorBase>
			<descriptor id="dTV" region="rTV" />
			<descriptor id="dImage" region="rImage" />
		</descriptorBase>
		
		<connectorBase>
			<causalConnector id="onKeySelectionStart">
				<connectorParam name="keyCode" />
				<simpleCondition role="onSelection" key="$keyCode"/>	
				<simpleAction role="start" />
			</causalConnector>
				
		</connectorBase>
			
		</head>
	
	<body>
		
		<port id="plua" component="luascript" />
		
		<media id="audio" descriptor="dImage" src="audio1.mp3" />
		
		<media id="luascript" descriptor="dTV" src="test.lua" />
		
		<!--link xconnector="onKeySelectionStart">
			<bind role="onSelection" component="luascript">
				<bindParam name="keyCode" value="BLUE"/>
			</bind>
			<bind role="start" component="audio" />
		</link-->
		
	</body>
</ncl>