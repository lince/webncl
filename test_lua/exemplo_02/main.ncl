<?xml version="1.0" encoding="ISO-8859-1"?>
<ncl id="nclClicks" xmlns="http://www.ncl.org.br/NCL3.0/EDTVProfile">

<head>

<!-- TODO: explicitDur -->

<regionBase>
    <region width="20%" height="20%" left="40%" top="40%" id="rgButton"/>
</regionBase>

<descriptorBase>
    <descriptor id="dsButton" region="rgButton" focusIndex="0"/>
</descriptorBase>

<connectorBase>
	<causalConnector id="onBeginStart">
		<simpleCondition role="onBegin"/>
		<simpleAction role="start"/>
	</causalConnector>

	<causalConnector id="onEndStop">
		<simpleCondition role="onEnd"/>
		<simpleAction role="stop" max="unbounded"/>
	</causalConnector>

	<causalConnector id="onSelectionStopSet">
		<simpleCondition role="onSelection"/>
		<connectorParam name="var"/>
		<compoundAction operator="seq">
			<simpleAction role="stop"/>
			<simpleAction role="set" value="$var"/>
		</compoundAction>
	</causalConnector>

	<causalConnector id="onCondGteBeginStart">
		<connectorParam name="var"/>
		<compoundCondition operator="and">
			<simpleCondition role="onBegin" />
			<assessmentStatement comparator="gte">
				<attributeAssessment role="attNodeTest" eventType="attribution" attributeType="nodeProperty"/>
				<valueAssessment value="$var"/>
			</assessmentStatement>
		</compoundCondition>
		<simpleAction role="start"/>
	</causalConnector>

	<causalConnector id="onCondLtBeginStart">
		<connectorParam name="var"/>
		<compoundCondition operator="and">
			<simpleCondition role="onBegin" />
			<assessmentStatement comparator="lt">
				<attributeAssessment role="attNodeTest" eventType="attribution" attributeType="nodeProperty"/>
				<valueAssessment value="$var"/>
			</assessmentStatement>
		</compoundCondition>
		<simpleAction role="start"/>
	</causalConnector>
</connectorBase>

</head>

<body>
    <!-- the document starts by playing the timer node -->
    <port id="entryPoint" component="timer"/>

    <!-- timer node -->
    <media id="timer" explicitDur="4s" src="media/button.jpg">
		<!-- anchors to exhibit the "Click it" button -->
		<area id="area01" begin="3s" end="6s"/>
		<area id="area02" begin="10s" end="13s"/>
		<area id="area03" begin="17s" end="20s"/>
		<area id="area04" begin="24s" end="27s"/>
		<!-- anchor to display the final score -->
		<area id="areaTotal" begin="35s"/>
	</media>

	<!-- lua node -->
	<media id="clicks" src="clicks.lua">
		<!-- inc function -->
		<property name="inc"/>
		<!-- counter variable -->
		<property name="counter"/>
	</media>
	
	<!-- button "Click it" -->
	<media id="button" descriptor="dsButton" src="media/button.jpg"/>
	
	<!-- button "You won" -->
	<media id="win" descriptor="dsButton" src="media/win.jpg"/>
	
	<!-- button "You lose"-->
	<media id="lose" descriptor="dsButton" src="media/lose.jpg"/>

	<!-- initialization of the lua node -->
	<link xconnector="onBeginStart">
        <bind role="onBegin" component="timer"/>
        <bind role="start"   component="clicks"/>
	</link>

	<!-- exhibition of the "Click it" button in the start of the six time intervals -->
	<link xconnector="onBeginStart">
        <bind role="onBegin" component="timer" interface="area01"/>
		<bind role="start" component="button"/>
	</link>
	<link xconnector="onBeginStart">
        <bind role="onBegin" component="timer" interface="area02"/>
		<bind role="start" component="button"/>
	</link>
	<link xconnector="onBeginStart">
        <bind role="onBegin" component="timer" interface="area03"/>
		<bind role="start" component="button"/>
	</link>
	<link xconnector="onBeginStart">
        <bind role="onBegin" component="timer" interface="area04"/>
		<bind role="start" component="button"/>
	</link>

	<!-- stopping the "Click it" button in the end of the six time intervals -->
	<link xconnector="onEndStop">
        <bind role="onEnd" component="timer" interface="area01"/>
		<bind role="stop" component="button"/>
	</link>
	<link xconnector="onEndStop">
        <bind role="onEnd" component="timer" interface="area02"/>
		<bind role="stop" component="button"/>
	</link>
	<link xconnector="onEndStop">
        <bind role="onEnd" component="timer" interface="area03"/>
		<bind role="stop" component="button"/>
	</link>
	<link xconnector="onEndStop">
        <bind role="onEnd" component="timer" interface="area04"/>
		<bind role="stop" component="button"/>
	</link>
	<link xconnector="onEndStop">
        <bind role="onEnd" component="timer"/>
		<bind role="stop" component="button"/>
		<bind role="stop" component="win"/>
		<bind role="stop" component="lose"/>
		<bind role="stop" component="clicks"/>
	</link>

	<!-- call to inc function when the "Click it" button is pressed -->
	<link xconnector="onSelectionStopSet">
		<bind role="onSelection" component="button"/>
		<bind role="stop" component="button"/>
		<bind role="set" component="clicks" interface="inc">
			<bindParam name="var" value="1"/>
		</bind>
	</link>

	<!-- exhibition of the final score: "You won" when the button is clicked more than 3 times or "You lose" otherwise -->   
	<link xconnector="onCondGteBeginStart">
		<linkParam name="var" value="3"/>
        <bind role="onBegin" component="timer" interface="areaTotal"/>
		<bind role="attNodeTest" component="clicks" interface="counter"/>
		<bind role="start" component="win"/>
	</link>
	<link xconnector="onCondLtBeginStart">
		<linkParam name="var" value="3"/>
        <bind role="onBegin" component="timer" interface="areaTotal"/>
		<bind role="attNodeTest" component="clicks" interface="counter"/>
		<bind role="start" component="lose"/>
	</link>
	
</body>

</ncl>
