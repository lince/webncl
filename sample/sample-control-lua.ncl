<?xml version="1.0" encoding="ISO-8859-1"?>
<ncl id="sample" xmlns="http://www.ncl.org.br/NCL3.0/EDTVProfile">
	<head>
		<regionBase>
			<region id="rgTV" width="100%" height="100%" zIndex="1">
				<region id="rgLua" width="100%" height="20%" zIndex="2" />
				<region id="rgImage" top="20%" width="100%" height="80%" zIndex="3" />
			</region>
		</regionBase>
		
		
		<descriptorBase>
			<descriptor id="dImage" region="rgImage" />
			<descriptor id="dLua" region="rgLua" />
		</descriptorBase>
		
		<connectorBase>
			<causalConnector id="onBeginStart">
				<simpleCondition role="onBegin"/>	
				<simpleAction role="start"/>
			</causalConnector>
			
			<causalConnector id="onEndAttributionTestBiggerStart">
				<connectorParam name="testValue"/>
				<compoundCondition operator="and">
					<simpleCondition role="onEndAttribution" />
					<assessmentStatement comparator="gte">
						<attributeAssessment role="test" eventType="attribution" 
												attributeType="nodeProperty"/>
						<valueAssessment value="$value"/>
					</assessmentStatement>
				</compoundCondition>
				<simpleAction role="start"/>
			</causalConnector>
			
			
			<causalConnector id="onEndAttributionTestLesserStart">
				<connectorParam name="testValue"/>
				<compoundCondition operator="and">
					<simpleCondition role="onEndAttribution" />
					<assessmentStatement comparator="lt">
						<attributeAssessment role="test" eventType="attribution" 
												attributeType="nodeProperty"/>
						<valueAssessment value="$value"/>
					</assessmentStatement>
				</compoundCondition>
				<simpleAction role="start"/>
			</causalConnector>
		</connectorBase>
			
		</head>
	
	<body>
		
		<port id="pLua" component="lua" />
		
		<media id="lua" descriptor="dLua" src="sample-control.lua">
			<property name="age" />
		</media>
		
		<media id="image1" descriptor="dImage" src="text2.html" />
		
		<media id="image2" descriptor="dImage" src="text3.html" />
		
		<link xconnector="onEndAttributionTestLesserStart">
				<bind role="onEndAttribution" component="lua" interface="age"/>
				<bind role="test" component="lua" interface="age">
					<bindParam name="value" value="18"/>
				</bind>
				<bind role="start" component="image1" />
		</link>
		
		<link xconnector="onEndAttributionTestBiggerStart">
				<bind role="onEndAttribution" component="lua" interface="age"/>
				<bind role="test" component="lua" interface="age">
					<bindParam name="value" value="18"/>
				</bind>
				<bind role="start" component="image2" />
		</link>
		
	</body>
</ncl>