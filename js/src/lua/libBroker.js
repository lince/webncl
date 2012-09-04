function libBroker(luaplayer){
  
   this.amq = org.activemq.Amq;
   this.luaHandler = '';
};

libBroker.prototype.init = function(strURI, fnOptCallback){
	console.log('libBroker.init()');
    //optional callback when receiving first polling answer
    if (fnOptCallback === undefined) fnOptCallback = function(){};
    //initialize activemq object
	this.amq.init({ 
        uri                         : strURI,                   //Broker
        logging                     : false,                    //Debug log
        timeout                     : 60,                       //Connection timeout (s)
        pollDelay                   : 500,                      //Polling interval (ms)
        clientId                    : (new Date).getTime(),     //Client unique identification
        sessionInitializedCallback  : function(){               //First 'GET' received
            //First polling message received
            fnOptCallback();
        }
    });
}

libBroker.prototype.fnHandler = function(param) {
	this.luaHandler(param.textContent);	
}

libBroker.prototype.register = function(strDestination, handler){
	console.log('libBroker.register()');
	
	this.luaHandler = handler;
    
   //Add listener to handle received messages
   this.amq.addListener( 
        "hdlBroker"+strDestination, //Handler name
        strDestination,             //Destination Topic
        $.proxy(function(param) {
        	this.luaHandler(param.textContent);
        }, this)                   
    );
}

libBroker.prototype.unregister = function(strDestination){
	console.log('libBroker.unregister()');
    
    //Remove listener
    this.amq.removeListener( 
        "hdlBroker"+strDestination, 
        strDestination 
    );
}

libBroker.prototype.post = function(strDestination, strMessage){
	console.log('libBroker.post()')
    
    //send message to activemq using destination uri
	this.amq.sendMessage(
        strDestination,         //Destination string like 'topic://TOPICNAME'
        strMessage              //Message
    );
}
