<?xml version="1.0" encoding="ISO-8859-1"?>
<ncl id="sample" xmlns="http://www.ncl.org.br/NCL3.0/EDTVProfile">
	<head>
		<regionBase>
			<region id="rgVideo" width="100%" height="80%" zIndex="1" />
			<region id="rgText" width="60%" left="20%" height="20%" top="80%" zIndex="2" />
			<region id="rgIcon" top="3%" right="3%" width="8%" height="10%" zIndex="3" />
		</regionBase>
		
		
		<descriptorBase>
			<descriptor id="dVideo" region="rgVideo" />
			<descriptor id="dText" region="rgText" />
			<descriptor id="dIcon" region="rgIcon" />
		</descriptorBase>
		
		<connectorBase>
			<causalConnector id="onKeySelectionAbortNStopN">
				<connectorParam name="keyCode"/>					
				<simpleCondition role="onSelection" key="$keyCode"/>
				<compoundAction operator="seq">
					<simpleAction role="abort" max="unbounded" qualifier="par"/>	
					<simpleAction role="stop" max="unbounded" qualifier="par"/>							
				</compoundAction>				
			</causalConnector>
			
			<causalConnector id="onEndStart">
				<simpleCondition role="onEnd" />
				<simpleAction role="start" />	
			</causalConnector>
		</connectorBase>
	</head>
	
	<body>
		
		<port id="pVideo" component="video" />
		<port id="pText" component="text" />
		<port id="pIcon" component="icon" />
		
		<media id="video" descriptor="dVideo" src="video1.webm"/>
		<media id="text" descriptor="dText" src="text1.txt"/>
		<media id="icon" descriptor="dIcon" src="redbutton.png"/>
		
		
		<link xconnector="onEndStart">
			<bind role="onEnd" component="video" />
			<bind role="start" component="video" />
		</link>
		
		
		<link xconnector="onKeySelectionAbortNStopN">
			<bind role="onSelection" component="icon">
				<bindParam name="keyCode" value="RED"/>
			</bind>	
			<bind role="abort" component="video" />
			<bind role="stop" component="text" />
			<bind role="stop" component="icon" />
		</link>
		
	</body>
</ncl>