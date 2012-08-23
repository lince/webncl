function libBroker(luaplayer){
    /*
	this.luaplayer = luaplayer;
	this.player = luaplayer.p;
	this.handlers = [];
	this.handlers[0] = undefined;
	this.counter = 0;
	tmp = this.player.id;
	this.nodeId = tmp.substring(tmp.indexOf('_')+1);
	var d = new Date();
	this.t = d.getTime();
	*/
   this.amq = org.activemq.Amq;
};

libBroker.prototype.init = function(strURI, fnOptCallback){
	console.log('libBroker.init()');
    //optional callback when receiving first polling answer
    if (fnOptCallback === undefined) fnOptCallback = function(){};
    //initialize activemq object
	amq.init({ 
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

libBroker.prototype.register = function(strDestination, fnHandler){
	console.log('libBroker.register()');
    
   //Add listener to handle received messages
   amq.addListener( 
        "hdlBroker"+strDestination, //Handler name
        strDestination,             //Destination Topic
        fnHandler                   //Handler Function
    );
}

libBroker.prototype.unregister = function(strDestination){
	console.log('libBroker.unregister()');
    
    //Remove listener
    amq.removeListener( 
        "hdlBroker"+strDestination, 
        strDestination 
    );
}

libBroker.prototype.post = function(strDestination, strMessage){
	console.log('libBroker.post()')
    
    //send message to activemq using destination uri
	amq.sendMessage(
        strDestination,         //Destination string like 'topic://TOPICNAME'
        strMessage              //Message
    );
}
