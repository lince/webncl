<?xml version="1.0" encoding="ISO-8859-1"?>
<ncl id="nclClicks" xmlns="http://www.ncl.org.br/NCL3.0/EDTVProfile">

<head>

<regionBase>
    <region width="20%"  height="20%"  left="10%"  top="40%" id="rgWin"/>
    <region width="50%"  height="50%"  right="10%" top="25%" id="rgLua"/>
</regionBase>

<descriptorBase>
    <descriptor id="dsLua" region="rgLua" focusIndex="luaIdx"/>
    <descriptor id="dsWin" region="rgWin"/>
</descriptorBase>

<connectorBase>
	<causalConnector id="onBeginStart">
		<simpleCondition role="onBegin"/>
		<simpleAction role="start"/>
	</causalConnector>
</connectorBase>

</head>

<body>
    <port id="entryPoint" component="lua"/>

	<media type="application/x-ginga-settings" id="programSettings">
        <property name="service.currentKeyMaster" value="luaIdx"/>
	</media>

    <media id="lua" src="monkey.lua" descriptor="dsLua">
        <area id="fim"/>
    </media>

    <media id="win" src="win.jpg" descriptor="dsWin"/>

    <link xconnector="onBeginStart">
        <bind role="onBegin" component="lua" interface="fim"/>
		<bind role="start" component="win"/>
	</link>
</body>

</ncl>
