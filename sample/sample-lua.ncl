<?xml version="1.0" encoding="ISO-8859-1"?>
<ncl id="sample" xmlns="http://www.ncl.org.br/NCL3.0/EDTVProfile">
	<head>
		<regionBase>
			<region id="rgTV" width="100%" height="100%" zIndex="1">
				<region id="rgVideo" width="100%" height="80%" zIndex="2" />
				<region id="rgLua" top="80%" width="100%" height="20%" zIndex="3" />
			</region>
		</regionBase>
		
		
		<descriptorBase>
			<descriptor id="dVideo" region="rgVideo" />
			<descriptor id="dLua" region="rgLua" />
		</descriptorBase>
		
		<connectorBase>
			<causalConnector id="onBeginStart">
				<simpleCondition role="onBegin"/>	
				<simpleAction role="start"/>
			</causalConnector>
			
			
			<causalConnector id="onEndStop">
				<simpleCondition role="onEnd"/>	
				<simpleAction role="stop"/>
			</causalConnector>
		</connectorBase>
			
		</head>
	
	<body>
		
		<port id="pVideo" component="video" />
		<port id="pLua" component="lua" />
		
		<media id="video" descriptor="dVideo" src="video1.webm">
			<area id="videoArea1" begin="4s" />
			<area id="videoArea2" begin="8s" />
			<area id="videoArea3" begin="12s" end="16s" />
		</media>
		
		<media id="lua" descriptor="dLua" src="sample.lua">
			<area id="luaArea1" />
			<area id="luaArea2" />
			<area id="luaArea3" />
		</media>
		
		<link xconnector="onBeginStart">
			<bind role="onBegin" component="video" interface="videoArea1" />
			<bind role="start" component="lua" interface="luaArea1" />
		</link>
		
		<link xconnector="onBeginStart">
			<bind role="onBegin" component="video" interface="videoArea2" />
			<bind role="start" component="lua" interface="luaArea2" />
		</link>
		
		<link xconnector="onBeginStart">
			<bind role="onBegin" component="video" interface="videoArea3" />
			<bind role="start" component="lua" interface="luaArea3" />
		</link>
		
		<link xconnector="onEndStop">
			<bind role="onEnd" component="video" interface="videoArea3" />
			<bind role="stop" component="lua" interface="luaArea3" />
			<bind role="stop" component="video" />
		</link>
		
	</body>
</ncl>