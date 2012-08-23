<?xml version="1.0" encoding="ISO-8859-1"?>
<ncl id="nclClicks" xmlns="http://www.ncl.org.br/NCL3.0/EDTVProfile">

<head>

<regionBase>
    <region width="90%" height="20%" left="5%" top="40%" id="rgLua"/>
</regionBase>

<descriptorBase>
    <descriptor id="dsLua" region="rgLua" border="true"/>
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
    <media id="lua" src="anim.lua" descriptor="dsLua"/>
</body>

</ncl>
