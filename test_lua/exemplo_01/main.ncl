<?xml version="1.0" encoding="ISO-8859-1"?>
<ncl id="nclClicks" xmlns="http://www.ncl.org.br/NCL3.0/EDTVProfile">

<head>

<regionBase>
    <region width="20%" height="20%" left="10%" top="40%" id="rg1"/>
    <region width="20%" height="20%" left="40%" top="40%" id="rg2"/>
    <region width="20%" height="20%" left="70%" top="40%" id="rg3"/>
</regionBase>

<descriptorBase>
    <descriptor id="ds1" region="rg1"/>
    <descriptor id="ds2" region="rg2"/>
    <descriptor id="ds3" region="rg3"/>
</descriptorBase>

<connectorBase>
	<causalConnector id="onBeginStart">
		<simpleCondition role="onBegin"/>
		<simpleAction role="start" max="unbounded"/>
	</causalConnector>

	<causalConnector id="onEndStopStart">
		<simpleCondition role="onEnd"/>
		<compoundAction>
			<simpleAction role="stop"/>
			<simpleAction role="start"/>
		</compoundAction>
	</causalConnector>
</connectorBase>

</head>

<body>
    <port id="entryPoint" component="lua1"/>

	<!-- MEDIAS -->
    <media id="lua1"  src="1.lua"/>
	<media id="lua2"  src="2.lua"/>
	<media id="lua3"  src="3.lua"/>

	<media id="bt1_green" src="buttons/1_green.png" descriptor="ds1"/>
	<media id="bt1_red"   src="buttons/1_red.png"   descriptor="ds1"/>
	<media id="bt2_green" src="buttons/2_green.png" descriptor="ds2"/>
	<media id="bt2_red"   src="buttons/2_red.png"   descriptor="ds2"/>
	<media id="bt3_green" src="buttons/3_green.png" descriptor="ds3"/>
	<media id="bt3_red"   src="buttons/3_red.png"   descriptor="ds3"/>
	
	<!-- BEGIN VIDEO: STARTS LUA_NODES -->
    <link xconnector="onBeginStart">
        <bind role="onBegin" component="lua1"/>
        <bind role="start"   component="lua2"/>
		<bind role="start"   component="lua3"/>
	</link>

	<!-- BEGIN LUA: STARTS RUN_BUTTON -->
	<link xconnector="onBeginStart">
		<bind role="onBegin" component="lua1"/>
		<bind role="start"   component="bt1_green"/>
	</link>
	<link xconnector="onBeginStart">
		<bind role="onBegin" component="lua2"/>
		<bind role="start"   component="bt2_green"/>
	</link>
	<link xconnector="onBeginStart">
		<bind role="onBegin" component="lua3"/>
		<bind role="start"   component="bt3_green"/>
	</link>

	<!-- END LUA: STOPS RUN_BUTTON, STARTS END_BUTTON -->
	<link xconnector="onEndStopStart">
		<bind role="onEnd" component="lua1"/>
		<bind role="stop"  component="bt1_green"/>
		<bind role="start" component="bt1_red"/>
	</link>
	<link xconnector="onEndStopStart">
		<bind role="onEnd" component="lua2"/>
		<bind role="stop"  component="bt2_green"/>
		<bind role="start" component="bt2_red"/>
	</link>
	<link xconnector="onEndStopStart">
		<bind role="onEnd" component="lua3"/>
		<bind role="stop"  component="bt3_green"/>
		<bind role="start" component="bt3_red"/>
	</link>

</body>

</ncl>
