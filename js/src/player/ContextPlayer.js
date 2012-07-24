/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

ContextPlayer.prototype = new Player();

function ContextPlayer (node, p) {

	this.timerManager = new TimerManager();
	
	this.handlers = {};
	this.node = node;
	this.media = [];
	this.context = [];
	this.port = [];
        this.presentation = p.presentation || p;
        this.parentContext = p;

        
	//this.synchronizedPlayers = [];
	//this.loadingPlayers = 0;
        
    this.syncingMediaList = [];
    this.syncingContextList = [];
    this.syncingObjects = 0;
        
    this.playingMediaList = [];
    this.playingContextList = [];
	
    this.pausedMediaList = [];
	this.pausedContextList = [];
        
	this.isCreated = false;
	this.htmlPlayer = "";
	this.isPlaying = false;
	this.isStopped = true;

	
	if (node.id) {
		this.htmlPlayer = this.presentation.getDivId(node.id);
	} else {
		this.htmlPlayer = this.presentation.bodyDiv;
	}
	$("#"+this.presentation.contextsDiv).append("<div class='context' id='"+this.htmlPlayer+"'></div>");
	this.htmlPlayer = "#" + this.htmlPlayer;
	$(this.htmlPlayer).data("player",this);
	$(this.htmlPlayer).data("property",[]);	
	this.bindEvents();

}

//ContextPlayer specific constants
ContextPlayer.prototype.eventType = {
	"onBegin": "presentation",
	"onEnd": "presentation",
	"onAbort": "presentation",
	"onPause": "presentation",
	"onResume": "presentation",
	"onSelection": "selection",
	"onBeginAttribution": "attribution",
	"onEndAttribution": "attribution"
};

//== Synchronization Functions Start ==

/*ContextPlayer.prototype.syncPlayer = function (mediaPlayer) {
	this.synchronizedPlayers.push(mediaPlayer.popcornPlayer);
	this.loadingPlayers++;
};

ContextPlayer.prototype.notify = function (mediaPlayer) {
	if (mediaPlayer) {
		if (mediaPlayer.popcornPlayer.readyState() >= 2) {
			this.notify();
		} else {
			$(mediaPlayer.htmlPlayer).one("canplaythrough",$.proxy(function() {
				this.notify();
			},this));
		}
	} else {
		if (--this.loadingPlayers == 0) {
			for (i in this.synchronizedPlayers) {
				this.synchronizedPlayers[i].play();
			}
		}
	}
};
*/
//== Synchronization Functions End ==

// create
ContextPlayer.prototype.create = function () {
	if (!this.isCreated) {
		this.isCreated = true;
		for (i in this.node.media) {
			this.media[this.node.media[i].id] = new MediaPlayer(this.node.media[i],this);
		}
		for (i in this.node.context) {
			this.context[this.node.context[i].id] = new ContextPlayer(this.node.context[i],this);
		}
		for (i in this.node.port) {
			this.port[this.node.port[i].id] = this.node.port[i];
		}
		for (i in this.node.property) {
			this.setProperty(this.node.property[i].name,this.node.property[i].value);
		}
		this.bindLinks();
	}
	return this;
};

// start
ContextPlayer.prototype.start = function (nodeInterface) {
	if (this.isStopped) {
		if (!this.isCreated) {
			this.create();
		}
		this.isPlaying = true;
		this.isStopped = false;
		if (nodeInterface) {
			this.startPort(this.port[nodeInterface]);
		} else {
			for (i in this.port) {
				this.startPort(this.port[i]);
			}
		}
		$(this.htmlPlayer).trigger("presentation.onBegin",[nodeInterface]);
	}
}

// startPort
ContextPlayer.prototype.startPort = function (port) {
	switch (port.component._type) {
		case "context": {
			// component = context -> nodeInterface = port
			if (!this.context[port.component.id]) {
				Logger.error(Logger.ERR_INVALID_CONTEXT_REFERENCE,"port",[port.id,"component",port.component.id]);
			} else if (port.nodeInterface) {
				this.context[port.component.id].create();
				if (!this.context[port.component.id].port[port.nodeInterface.id]) {
					Logger.error(Logger.ERR_INVALID_CONTEXT_REFERENCE,"port",[port.id,"interface",port.nodeInterface.id]);
				} else {
					this.context[port.component.id].start(port.nodeInterface.id);
				}
			} else {
				this.context[port.component.id].start();
			}
			break;
		}
		case "media": {
			// component = media -> nodeInterface = area, property
			nodeInterface = port["interface"];
			if (nodeInterface) {
				this.media[port.component.id].start(nodeInterface);
			} else {
				this.media[port.component.id].start();
			}
			break;
		}
	}
};

// stop
ContextPlayer.prototype.stop = function (nodeInterface) {
	if (!this.isStopped) {
		this.isPlaying = false;
		this.isStopped = true;
		for (i in this.context) {
			this.context[i].stop();
		}	
		for (i in this.media) {
			this.media[i].stop();
		}
		this.pausedMediaList = [];
		this.pausedContextList = [];
		$(this.htmlPlayer).trigger("presentation.onEnd",[nodeInterface]);
		this.timerManager.stopAll();
	}
};

// pause
ContextPlayer.prototype.pause = function (nodeInterface) {
	if (this.isPlaying) {
		this.isPlaying = false;
		this.isStopped = false;
		for (i in this.context) {
			if (this.context[i].isPlaying) {
				this.pausedContextList.push(i);
				this.context[i].pause();
			}
		}	
		for (i in this.media) {
			if (this.media[i].isPlaying) {
				this.pausedMediaList.push(i);
				this.media[i].pause();
			}
		}
		$(this.htmlPlayer).trigger("presentation.onPause",[nodeInterface]);
		this.timerManager.pauseAll();
	}
};

// resume
ContextPlayer.prototype.resume = function (nodeInterface) {
	if (!this.isPlaying && !this.isStopped) {
		this.isPlaying = true;
		this.isStopped = false;
		for (i in this.pausedContextList) {
			this.context[this.pausedContextList[i]].resume();
		}		
		for (i in this.pausedMediaList) {
			this.media[this.pausedMediaList[i]].resume();
		}
		this.pausedContextList = [];
		this.pausedMediaList = [];
		$(this.htmlPlayer).trigger("presentation.onResume",[nodeInterface]);
		this.timerManager.resumeAll();
	}
};

// abort
ContextPlayer.prototype.abort = function (nodeInterface) {
	if (!this.isStopped) {
		this.isPlaying = false;
		this.isStopped = true;
		for (i in this.context) {
			this.context[i].abort();
		}	
		for (i in this.media) {
			this.media[i].abort();
		}
		this.pausedMediaList = [];
		this.pausedContextList = [];
		$(this.htmlPlayer).trigger("presentation.onAbort",[nodeInterface]);
		this.timerManager.stopAll();
	}
};

// isVariable
ContextPlayer.isVariable = function (str) {
	return str.substring(0,1)=='$';
};

// createLocalParamMap
ContextPlayer.createLocalParamMap = function (bindParam) {
	var map = {};
	for (i in bindParam) {
		currentBindParam = bindParam[i];
		map['$'+currentBindParam.name] = currentBindParam.value;
	}
	return map;
};

// executeTriggerArray
// triggerArray[i][0] = bindComponent
// triggerArray[i][1] = actionName
// triggerArray[i][2] = parâmetros do trigger
ContextPlayer.executeTriggerArray = function (triggerArray) {
	var currentTrigger;
	while ((currentTrigger = triggerArray.shift()) != undefined) {
		$(currentTrigger[0]).trigger(currentTrigger[1],currentTrigger[2]);
	}
};

/*  Cria os handlers e listeners dos links do ncl
 * 
 * TODO(danilo): Mandar delays para a Listener
 * TODO(danilo): Tratar compoundConditions encadeados
 * TODO(danilo): Tratar argumento key do onSelection
 *  
 */
ContextPlayer.prototype.bindLinks = function()
{
	var ports = this.node.port;
	var links = this.node.link;
	var handlers = this.handlers;
	
	/*
	  Faz o bind das portas
	 * */
	
	for (var i in ports)
	{
		var currentPort = ports[i];
		var interfaceDefined = currentPort['interface'] || undefined;

		//if(currentPort.component._type == 'media' && interfaceDefined)
		//{
			/*
			 	 TODO: encadear eventos de atribuicao quando a nodeInterface da media esta definida
				 attribution.onBeginAttribution
				 attribution.onEndAttribution
			 */
			//console.warn("Eventos de atribuicao para propriedades referenciadas por portas nao foi implementado");
	
			
		//} else {
			
			//Caso contrario (componente eh contexto) ou a nodeInterface nao esta definida
			var currentComponentElement  = "#"+this.presentation.getDivId(currentPort.component.id);
			var interfaceId = currentPort.id;
			
			for(var j in this.eventType)
			{
				var eventType = this.eventType[j];
				if(eventType != 'attribution')
				{
					var eventName = [eventType,j].join('.');
					
					/*
					  Ouve o evento instanciado pelo elemento
					  e lanca o mesmo evento soh que instanciado pelo contexto
					*/
					$(currentComponentElement).on(eventName, 
					{
						contextElement : this.htmlPlayer,
						interfaceId : interfaceId,
						eventName: eventName,
						portInterface: currentPort["interface"]
					},
					function(e, nclInterface)
					{
						if (nclInterface == e.data.portInterface) {
							var evento = $.Event(e.data.eventName);
                        	evento.which = e.which;
							$(e.data.contextElement).trigger(evento,[e.data.interfaceId])
						}
					
					});
							
				}
			}
			
		//}
		
	}
	
	/*
	 Faz o bind dos links
	 * */
	for ( i in links)
	{
	
		//causalConnector
		var link = links[i];
	    var linkConnector = link.xconnector;
	    var actionMap = new Object();
	    var flagMap = new Object();
	    var lType = 0;
	    var aOperator= 'par';

		//Verifica os tipos de condicoes
		var conditions = linkConnector.simpleCondition;
		var assessmentsStatements = [];
		var connectorParam = new Object();
		var assessmentsMap = new Object();
		var assessmentsArray = new Array();

		

		/*
		   Cada parametro do link eh associado a um valor padrao vazio
		 * */			
		if(linkConnector.connectorParam)
		{
			for ( var i in linkConnector.connectorParam)
			{
				currentConnectorParam = linkConnector.connectorParam[i];
				//Inicializa o parametro do link vazio
				connectorParam['$'+currentConnectorParam.name] = '';
				//TODO: Verificar se o valor eh mesmo vazio
			}	
		}
		
		
		/*
		 
			assessmentsMap['role'] =
			{
				bindComponent: (Component)
				bindInterface: 	(Component nodeInterface)
				operator:  (eq, etc.. )
				value: ,
				variable: verdadeiro se o valor eh uma variavel
			}

		 */
		
		if (linkConnector.compoundCondition)
		{
			//Tipo do listener
			conditions = linkConnector.compoundCondition[0].simpleCondition;
			
			/*
			   Pode ocorrer de um compoundCondition conter apenas um simpleCondition
			(quando ele contem tambem um assessmentStatement). 
			*/
			if(conditions.length > 1)
				lType = Listener.listenerType[linkConnector.compoundCondition[0].operator.toUpperCase()];
			
			//Verifica se assessmentStatements (só ocorre no compoundCondition)
			//Para cada assessmentStatement
			for (var i in linkConnector.compoundCondition[0].assessmentStatement)
			{
				var currentAssessmentStatement =  linkConnector.compoundCondition[0].assessmentStatement[i];
				//Para cada attributeAssessment
				for (var j in currentAssessmentStatement.attributeAssessment)
				{
					var currentAttributeAssessment = currentAssessmentStatement.attributeAssessment[j];
					
					//Por enquanto aceitamos apenas eventos do tipo attribution
					if(currentAttributeAssessment.eventType == 'attribution')
						if (!currentAttributeAssessment.attributeType || currentAttributeAssessment.attributeType == 'nodeProperty')
						{
							assessmentsMap[currentAttributeAssessment.role] = {
								bindComponent: '',
								bindInterface: '',
								operator: currentAssessmentStatement.comparator,
								value: currentAssessmentStatement.valueAssessment.value,
								variable: ContextPlayer.isVariable(currentAssessmentStatement.valueAssessment.value)
								
							}
							
					} else {
						console.warn('Eventos de tipos diferentes de attribution nao foram implementados para elementos do tipo AttributeAssessment');
					}			
				}
			}
		}
		
		
		//Cria o assessmentsArray que eh passado para o listener
		for(var j in assessmentsMap)
			assessmentsArray.push(assessmentsMap[j]);
		
		
		
		//Inicializa o flagMap de acordo com a estrutura do conector
		for (var i in conditions)
		{

            var currentCondition = conditions[i];
			var conditionUseVariable = false;
			var conditionDefaultValue = '';
			var conditionUseKey = false;

			if (currentCondition.role == 'onSelection')
			{
				if(currentCondition.key)
				{
					if (ContextPlayer.isVariable(currentCondition.key))
					 	conditionUseVariable = true;
						
					conditionDefaultValue = currentCondition.key;
					conditionUseKey = true;
				}
			}

			flagMap[currentCondition.role] = {
				bindComponent: "",
				bindInterface: null,
				eventType: this.eventType[currentCondition.role],
				flag: false,
				keyUseVariable : conditionUseVariable,
				keyDefaultValue: conditionDefaultValue,
				useKey : conditionUseKey
				
			}

		}
		
		

        //obtem um array das acoes
	    var actions = linkConnector.simpleAction;
	    if(linkConnector.compoundAction)
	    {
	    	aOperator = linkConnector.compoundAction[0].operator.toLowerCase();
	    	actions = linkConnector.compoundAction[0].simpleAction; 
	    }

		//inicializa o actionMap de acordo com a estrutura do conector
	    for (var i in actions)
	    {

			currentAction = actions[i];
			
	    	// Se a acao eh de atribuicao entao possui um valor de envio
	    	if  (currentAction.role == 'set')
	    	{

		    	var actionUseVariable = false;
		    	var actionDefaultValue = '';
		    
		    	//verifica se o atributo value esta definido
		    	if(currentAction.value)
		    	{
		    	 //caso esteja definido e seja do tipo variavel

		    	 if (ContextPlayer.isVariable(currentAction.value))
				  	actionUseVariable = true;


					// O valor do actionDefaultValue eh dado pelo parametro
					// value da acao, mesmo que este seja o nome de um parametro linkParam
 				    actionDefaultValue = currentAction.value; 					
				}
				
				//o action map para eventos de atribuicao sao um pouco diferentes
				actionMap[currentAction.role]= {
		    		binds: new Array(),
		    		qualifier: actions[i].qualifier,
		    		actionUseVariable: actionUseVariable,
		    		actionDefaultValue: actionDefaultValue
	    		}

	    	} else {
	    		
	    		actionMap[currentAction.role]= {
	    		binds: new Array(),
	    		qualifier: actions[i].qualifier
	    		}
	    		
	    	}
	    	

	    	
				    	 
	    	
	    	 
	    }


		//Como o tipo de listener e o tipo de action (operator) ja estao definidos,posso criar o listener
		var listener = new Listener(lType,aOperator,actionMap,flagMap,assessmentsArray,this.presentation);
		/*
		 * Note que o flagMap e o actionMap ainda nao estao completos
		 * entranto, como o objeto listener referencia os objetos que 
		 * ele recebe no construtor estaremos modificando o interior
		 * do listener ao modificar as nossas variaveis locais
		 * actionMap e flagMap
		 */

        
        /*
            Todo o codigo abaixo eh de exclusividade do link
            O codigo acima eh o mesmo para conectores iguais
         * */
        
        /* Preenche o mapa de parametros 
		   com os valores globais (isto eh, os valores
		   	definidos pelos elementos linkParam)
		 * */
		if(link.linkParam)
		{
			for (var i in link.linkParam)
			{
				currentLinkParam = link.linkParam[i];
				connectorParam['$' + currentLinkParam.name] = currentLinkParam.value;
			}
		}
		
        
        //percorre todos os binds do link		
		for (var i in link.bind)
		{
			
			var currentBind = link.bind[i];
			
			var currentBindComponent = currentBind.component.id;
			var currentBindComponentSelector = "#"+this.presentation.getDivId(currentBindComponent);
			var currentInterface = currentBind['interface'];

			//Se o bind eh do tipo de acao
			if(actionMap[currentBind.role])
			{
			  var actionValue = null;
			  var currentAction = actionMap[currentBind.role];
			  
			  //verifica se a acao eh do tipo de atribuicao
			  if(currentBind.role == 'set')
			  {
			  	//Se esta acao utiliza parametro de link 
			  	if(currentAction.actionUseVariable)
			  	{
			  		//obtem as variveis locais do bind atual
			  		localParamMap = ContextPlayer.createLocalParamMap(currentBind.bindParam);
			  			
			  	    //obtem atraves das variaveis o valor do action value
			  	    actionValue = localParamMap[currentAction.actionDefaultValue] ? localParamMap[currentAction.actionDefaultValue] : connectorParam[currentAction.actionDefaultValue];
			  	} else
			  	    //caso nao use variavel entao possui um valor padrao
			  		actionValue = currentAction.actionDefaultValue;	
			  	
			  }
			  
				
			  currentAction.binds.push(
			  	{
			  		bindComponent: currentBindComponentSelector,
			  		bindInterface: currentInterface,
			  		value: actionValue
			  	}
			  	);
			  	
			  
			  
			//Se o bind for do tipo de condicao (attributeAssessment)
			} else if (flagMap[currentBind.role]){
			   var currentFlag = flagMap[currentBind.role];
			   //associa o component no flagMap do listener para este link				   			   
			   currentFlag.bindComponent = currentBindComponentSelector;
			   currentFlag.bindInterface = currentInterface;
			   
			   var hinterface = currentInterface ? 'i'+currentInterface: 'none'; 			   		
			   
			   

			   var componentDivId = currentBindComponentSelector;
			   var eventType = this.eventType[currentBind.role];
			   var eventName = currentBind.role;
			   var bindName = [eventType,eventName].join('.');
			   var handlerName =  [currentBindComponent,bindName].join('.');
			   
			   var triggerArrayName = bindName+'.triggerArray';
			   
			   //TODO: Melhorar sistema que trata 'key' do onSelection
			   //Se o key deste condition provem de uma variavel 
			   if(currentFlag.useKey)
			   {
			   	 var localParamMap = ContextPlayer.createLocalParamMap(currentBind.bindParam);
			   	 currentFlag.keyDefaultValue =  localParamMap[currentFlag.keyDefaultValue] || connectorParam[currentFlag.keyDefaultValue];	
				 var tempKey = currentFlag.keyDefaultValue
				 if ($.isNumeric(tempKey)) 
				 {
					 tempKey = 'KEY_' + tempKey;
				 }
			   	 if (tempKey in this.presentation.keys)
				 {
					currentFlag.keyDefaultValue = this.presentation.keys[tempKey];
				 }
				 
				 var port = 'undefined';
				 var triggerMedia = componentDivId;
				 
				 //Caso o componente seja um contexto e possua uma interface (uma porta para uma media)
				 //Deve-se usar a media para realizar o trigger da ação de teclas
				 //TODO: usei um loop para encontrar a porta, deve existir uma solução melhor
				 if (currentBind.component._type == "context" && currentInterface) {
				 	for (var i in currentBind.component.port) {
				 		currentPort = currentBind.component.port[i]
				 		portId = currentBind.component.port[i].id;
				 		if (portId == currentInterface) {
				 			port = currentPort;
				 			break;
				 		}
				 	}
				 	triggerMedia = "#"+this.presentation.getDivId(port.component.id);
				 }
				 
				 this.presentation.keyEvents[triggerMedia] = false;
			   }


			   //Caso um handler ainda nao foi criado para este link
			   if(!handlers[ handlerName ])
			   {
			     
			      // Cria o handler e salva essa informacao no handlers map
			      handlers[ handlerName ] = true;
			      
			      // Cria o buffer de triggers caso o mesmo nao exista
			      if(!$(componentDivId).data(triggerArrayName))
			      	$(componentDivId).data(triggerArrayName,[]);
			      
	 
	 			  // Cria uma array vazia para os listeners
	 			  if(!$(componentDivId).data(bindName))
	 			   	  $(componentDivId).data(bindName,[]);

				  // Instancia o handler para eventos do tipo 'eventType.eventName'
				  $(componentDivId).on(bindName,
				  	{
				  		componentDivId: componentDivId,
				  		bindName: bindName,
				  		eventName: eventName,
				  		triggerArrayName : triggerArrayName
				  	},
					function(e, nclInterface)
					{
						var cdata = $(e.data.componentDivId).data(e.data.bindName);
						for(var listener in cdata)
						{
							var clistener = cdata[listener];
							var flag = clistener.flagMap[e.data.eventName]
							if(nclInterface == flag.bindInterface)
								// For selection conditions we need to check the key
								// This code maybe redundant
								if(e.type == 'selection' && flag.useKey) {
									if (flag.useKey) {
										if (e.which && flag.keyDefaultValue == e.which) {
											clistener.notifyEvent(e.data.eventName);
										}
									}
								} else {
									clistener.notifyEvent(e.data.eventName);
								}
							
						}
						ContextPlayer.executeTriggerArray($(e.data.componentDivId).data(e.data.triggerArrayName))
					  	
					}	
				  	
				  );

        
			   } 
			   
			   //Obtem o triggerArray do evento e coloca no listener
			   listener.triggerBuffer = $(componentDivId).data(triggerArrayName);
			   //Adiciona um listener ao objeto
	    	   $(componentDivId).data(bindName).push(listener);
			      
			   
			} else {
			  //attributeAssessment
			   currentAssessment = assessmentsMap[currentBind.role];
			   currentAssessment.bindComponent = currentBindComponentSelector;
			   currentAssessment.bindInterface = currentInterface;
			   
			   //Trata os parametros do link
			   //Se o value deste attributeAssessment provem de uma variavel 
			   if(currentAssessment.variable)
			   {
			   	 localParamMap = ContextPlayer.createLocalParamMap(currentBind.bindParam);
		/*1*/    currentAssessment.value = localParamMap[currentAssessment.value] ? localParamMap[currentAssessment.value] : connectorParam[currentAssessment.value];		
			   }
			   /* 
			    * As variáveis definidas via linkParam tem o identificaro (dentro do dicionário connectorParam) sem o '$'.
			    * No if-inline (1), é procurado no connectorParam por currentAssessment.value, que o $ no nome da variável.
			    * Na minha correção, eu fiz o linkParam adquirir o $ quando ele é criado lá em cima.
			    * Nâo sei se está minha correção vai acarretar outros bugs, se for, podem reverté-la.
			    * 
			    * Sugestão: sempre utilizar $ nos nomes das variáveis.
			    * 
			    * */
			   
			}
		}
		
			
	}	

};
