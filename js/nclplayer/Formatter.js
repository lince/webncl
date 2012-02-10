/*
 	Formater, um singleton
 	
 	Lembrando que o padrao para nomear as divs referentes as Medias ncl
 	eh ncl_(media ID)
 	
 	
 * */
var Formatter =
{
	/*
	      Verifica se a string recebida como parametro eh uma variavel
	      Ou seja, inicia com $
	 * */
	isVariable:function (str)
	{
		if (str.substring(0,1) == '$')
			return true
		else
			return false
	},
	
	
	/*
	 	  Como os parametros passado para um conector podem ser passados
	 	  atraves dos elementos linkParam e bindParam, sendo que o funcionamento
	 	  do linkParam eh semelhante a uma variavel global para o link
	 	  enquanto o bindParam eh semelhante uma variavel local eh necessario
	 	  percorrer o bindParam para saber quais sao os valores locais.
	 	  Isto eh implementado por esta funcao
	 	  
	 	  Args:
	 	  		 bindParam: Ncl30.ncl.body.link.bind.bindParam array
	 	  		 			ou semelhante
	 	  Returns:
	 	         Mapa relacionando nome do argumento e valor obtido atraves
	 	       do bindParam
	 * */
	createLocalParamMap: function(bindParam)
	{
		var a = new Object();
		for(var i in bindParam)
		{
			currentBindParam = bindParam[i];
			a['$'+currentBindParam.name.name]  =currentBindParam.value;
		}
		
		return a;
	},
	
	
	
	
	//Tipos dos listeners
	listenerType :	{
					"SIMPLE": 0,
					"AND" : 1,
					"OR" : 2
			},
			
	//Tipos dos eventos	
	eventType:	{
					"onBegin": "presentation",
					"onEnd": "presentation",
					"onAbort": "presentation",
					"onPause": "presentation",
					"onResume": "presentation",
					"onSelection": "selection",
					"onBeginAttribution":  "attribution",
					"onEndAttribution": "attribution"
		},
	
	
	TIME_LIMIT: 1000, // Limite 1s
	

    handlers: new Object(),
    
    
    
    /*
        Executa uma array de triggers preenchida pelo Listener
        
        Args: 
        	triggerArray: Deve ser do seguinte formato:
        	triggerArray[i][0] - bindComponent
        	triggerArray[i][1] - actionName
        	triggerArray[i][2] - parametros do trigger
     * */
    executeTriggerArray: function( triggerArray )
    {
    	var currentTrigger;

    	while( (currentTrigger = triggerArray.shift()) != undefined )
    		$(currentTrigger[0]).trigger(currentTrigger[1],currentTrigger[2]);
    	
    	
    },
    
    
    /*  Cria os handlers e listeners dos links do ncl
     * 
     *  Args:
     *       contextid: Id do contexto
     *       links: Array de nos do tipo link
     * 
     * TODO(danilo): Mandar delays para a Listener
     * TODO(danilo): Tratar compoundConditions encadeados
     *  
     */
	bind : function(context)
	{
		var ports = context.port;
		var links = context.link;
		var contextid = context.id ? context.id : "body";
		
		//Salva a lista de handlers para este contexto
		if(!this.handlers[contextid])
			this.handlers[contextid] = new Object()
		else
			console.warn('O contexto '+ contextid + ' nao foi unbinded!')
		
		var handlers = this.handlers[contextid];
		
		/*
		  Faz o bind das portas
		 * */
		
		for (var i in ports)
		{
			var currentPort = ports[i];
			var interfaceType = currentPort.nodeInterface ? currentPort.nodeInterface._type : undefined; 	
			
			if(currentPort.component._type == 'media' && interfaceType)
			{
				/*
				 	 TODO: encadear eventos de atribuicao quando a nodeInterface da media esta definida
					 attribution.onBeginAttribution
					 attribution.onEndAttribution
				 */
				
			} else {
				
				//Caso contrario (componente eh contexto) ou a nodeInterface nao esta definida
				var currentComponentId = currentPort.component.id;
				var interfaceId = currentPort.id;
				
				for(var j in Formatter.eventType)
				{
					var eventType = Formatter.eventType[j];
					if(eventType != 'attribution')
					{
						var eventName = [eventType,j].join('.');
						
						$('#ncl_'+currentComponentId).on(eventName, 
						{
							contextId : contextid,
							interfaceId : interfaceId,
							eventName: eventName
							
						},
						function(e)
						{
							$('#ncl_'+e.data.contextId).trigger(e.data.eventName,[e.data.interfaceId])
						
						});
								
							}
						}
				
			}
			
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
			var conditions = [linkConnector.simpleCondition];
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
				conditions = linkConnector.compoundCondition.simpleCondition;
				
				/*
				   Pode ocorrer de um compoundCondition conter apenas um simpleCondition
				(quando ele contem tambem um assessmentStatement). 
				*/
				if(conditions.length > 1)
					lType = this.listenerType[linkConnector.compoundCondition.operator.toUpperCase()];
				
				//Verifica se assessmentStatements (só ocorre no compoundCondition)
				//Para cada assessmentStatement
				for (var i in linkConnector.compoundCondition.assessmentStatement)
				{
					var currentAssessmentStatement =  linkConnector.compoundCondition.assessmentStatement[i];
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
									variable: Formatter.isVariable(currentAssessmentStatement.valueAssessment.value)
									
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

				flagMap[conditions[i].role] = {
					bindComponent: "",
					bindInterface: null,
					eventType: this.eventType[conditions[i].role],
					flag: false
				}
			}
			
			

            //obtem um array das acoes
		    var actions = [linkConnector.simpleAction];
		    if(linkConnector.compoundAction)
		    {
		    	aOperator = linkConnector.compoundAction.operator.toLowerCase();
		    	actions = linkConnector.compoundAction.simpleAction; 
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

			    	 if (Formatter.isVariable(currentAction.value))
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
			var listener = new Listener(lType,aOperator,actionMap,flagMap,assessmentsArray);
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
					connectorParam[currentLinkParam.name] = currentLinkParam.value;
				}
			}
			
            
	        //percorre todos os binds do link		
			for (var i in link.bind)
			{
				
				var currentBind = link.bind[i];
				
				var currentBindComponent = (currentBind.component.id) ? (currentBind.component.id) : (currentBind.component.name);
				var currentInterface = currentBind.nodeInterface;


				/* Caso o component for do tipo "context"
				 * e possuir uma nodeInterface definida, isto quer dizer
				 * que estamos associando eventos ou acoes a sua nodeInterface
				 * 
				 * E logo, podemos aplicar diretamente no id da media
				 * tanto a acao, quanto o evento
				 */
//				if (currentInterface && currentBind.component._type == 'context' && currentBind.nodeInterface._type == 'port')
//				{
//					currentBindComponent = (currentBind.nodeInterface.component.id) ? currentBind.nodeInterface.component.id : currentBind.nodeInterface.component.name;
//					currentInterface = currentBind.nodeInterface.nodeInterface;
//				} 


				// se uma nodeInterface está definida
				if (currentInterface)
				{

					//Caso a nodeInterface seja uma property
					if(currentInterface.name)
						currentInterface = currentInterface.name;
					//Todos os outros casos
					else if(currentInterface.id)
					 	currentInterface = currentInterface.id;
					// ??
					else
					    console.warn('Undefined nodeInterface')

				} 
				
				


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
				  		localParamMap = Formatter.createLocalParamMap(currentBind.bindParam);
				  			
				  	    //obtem atraves das variaveis o valor do action value
				  	    actionValue = localParamMap[currentAction.actionDefaultValue] ? localParamMap[currentAction.actionDefaultValue] : connectorParam[currentAction.actionDefaultValue];
				  	} else
				  	    //caso nao use variavel entao possui um valor padrao
				  		actionValue = currentAction.actionDefaultValue;	
				  	
				  }
				  
					
				  currentAction.binds.push(
				  	{
				  		bindComponent: '#ncl_'+currentBindComponent,
				  		bindInterface: currentInterface,
				  		value: actionValue
				  	}
				  	);
				  	
				  
				  
				//Se o bind for do tipo de condicao (attributeAssessment)
				} else if (flagMap[currentBind.role]){
				   //associa o component no flagMap do listener para este link				   			   
				   flagMap[currentBind.role].bindComponent = currentBindComponent;
				   flagMap[currentBind.role].bindInterface = currentInterface;
				   
				   //TODO: Tratar 'key' do evento selection.onSeletion
				   var componentDivId = "#ncl_"+currentBindComponent;
				   var eventType = this.eventType[currentBind.role];
				   var eventName = currentBind.role;
				   var handlerName =  [currentBindComponent,eventType,eventName].join('.');
				   var bindName = [eventType,eventName].join('.');
				   var triggerArrayName = bindName+'.triggerArray';
				   
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
								if(nclInterface == clistener.flagMap[e.data.eventName].bindInterface)
									clistener.notifyEvent(e.data.eventName);
							}
							Formatter.executeTriggerArray($(e.data.componentDivId).data(e.data.triggerArrayName))
						  	
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
				   currentAssessment.bindComponent = '#ncl_'+currentBindComponent;
				   currentAssessment.bindInterface = currentInterface;
				   
				   //Trata os parametros do link
				   //Se o value deste attributeAssessment provem de uma variavel 
				   if(currentAssessment.variable)
				   {
				   	 localParamMap = Formatter.createLocalParamMap(currentBind.bindParam);
				   	 currentAssessment.value = localParamMap[currentAssessment.value] ? localParamMap[currentAssessment.value] : connectorParam[currentAssessment.value];			   	 
				   }
				   
				}
			}
			
				
		}	
		
		

	},
	
	/*
	    Inicializa o formatter.
	 
	 * */
	initialize: function()
	{
		SystemSettings.initialize()
		Descriptor.initialize()

	},
	
	
	
}


/*
 
 * 
 *  Parte do formatter que cuida os descriptors e do calculo
 * do currentFocus deles
 * 
 * */	
	
var Descriptor ={
	
	//Mantem a informacao de qual objeto possui o foco atualmente
	currentFocusIndex : undefined,
	
	//Mantem referencias para os descritores que possuem focusIndex
	descriptors : new Object(),
	
	//Mantem informacao dos descriptors com medias ativas
	focusIndexArray: new Array(),
	
	/*
	    initialize
	 
	 	Inicializa este modulo do Formatter.
	 	
	 	 Basicamente, sao obtidos todos os descritores do documento
	 	que possuem focusIndex
	
	  */
	initialize: function()
	{
		var descriptors = Ncl30.ncl.head.descriptorBase.descriptor;
		var focusIndexArray = [];
		
		for (var i in descriptors)
		{
			var currentDescriptor = descriptors[i];
			
			if(currentDescriptor.focusIndex)
			{
				focusIndexArray.push(currentDescriptor.focusIndex)

				this.descriptors[currentDescriptor.focusIndex] =
				{
					self: currentDescriptor,			//referencia para o descritor
					mediaArray: []						//array de medias
				}
				
			}
		}
		
		this.bindKeyDown();
					
	},
	
	/*
	    addMedia
	 
	 	Adiciona uma media a lista de medias de um descritor. Um descritor soh pode
	 	receber foco se possui medias ativas. Ao invez do descriptor, deve ser passado
	 	o seu focusIndex
	
	  */
	addMedia: function(focusIndex, mediaId)
	{

		if(focusIndex in this.descriptors)
		{
			var currentDescriptor = this.descriptors[focusIndex];
			
			if(currentDescriptor.mediaArray.indexOf(mediaId) == -1)
			{ 
				currentDescriptor.mediaArray.push(mediaId);
				this.bindMouseEvents(focusIndex, mediaId);
			}

			if (! (focusIndex in this.focusIndexArray))
				this.focusIndexArray.push(focusIndex);
			
			if (!this.currentFocusIndex)
				this.setCurrentFocus(focusIndex);			
		    else if (this.currentFocusIndex == focusIndex)
				this.setMediaFocus(mediaId);
			
		}
	},
	
	/*
	 
	 	removeMedia
	 	
	 	Remove uma media do array de medias de um descriptor
	 	  Caso essa seja a ultima media o descriptor perde o seu foco
	 	e currentFocusIndex eh setado com undefined
	 
	 */
	removeMedia: function(focusIndex, mediaId)
	{
		if(focusIndex in this.descriptors)
		{
			var currentDescriptor = this.descriptors[focusIndex];
			var mediaIndex = currentDescriptor.mediaArray.indexOf(mediaId);
			if(mediaIndex != -1)
			{
				currentDescriptor.mediaArray.splice(mediaIndex,1);
				this.unbindMouseEvents(mediaId);
			}
			else
				console.warn('Removendo uma media que nao esta no mediaArray do descriptor: ' + currentDescriptor.self.id + ' ' +mediaId);
							
			if(focusIndex == this.currentFocusIndex)
				if(currentDescriptor.mediaArray.length == 0)
					{
						this.focusIndexArray.splice(this.focusIndexArray.indexOf(focusIndex),1);
						
						if(this.focusIndexArray.length == 0)
							this.setCurrentFocus(undefined);
						else
							{
								this.focusIndexArray.sort(this.sortFunction);
								this.setCurrentFocus(this.focusIndexArray[0])
							}
						
					}
		}
		
		
	},
	
	/*
	  Rotina de ordenacao utilizada no metodo array.sort()
	 * */
	sortFunction: function(a,b)
	{
		a  = String(a).toLowerCase();
		b  = String(b).toLowerCase();
		
		if (a > b) return 1;
		if (a < b) return -1;
		return 0;
	},
	
	/*
	   Define o foco nas medias do descriptor com focusIndex
	 * */
	setCurrentFocus: function(focusIndex)
	{
		
		//Verificamos em focusIndexArray pois um descritor soh pode receber foco
		//se tiver medias ativas
		if(focusIndex == undefined)
		{
			this.currentFocusIndex = focusIndex;
		} else	if(Descriptor.focusIndexArray.indexOf(focusIndex) != -1)
		{
			if(this.currentFocusIndex)
			{
				var oldDescriptor = this.descriptors[this.currentFocusIndex];
				for(var j in oldDescriptor.mediaArray)
				{
					var currentMedia = currentDescriptor.mediaArray[j];
					this.removeMediaFocus(currentMedia);
				}
			}
			
			
			currentDescriptor = this.descriptors[focusIndex];
			for(var j in currentDescriptor.mediaArray)
			{
				var currentMedia = currentDescriptor.mediaArray[j];
				this.setMediaFocus(currentMedia);
			}
			this.currentFocusIndex = focusIndex;
			
			return true;
		} 
		
		return false;
	},
	
	/*
	   Retorna o descriptor que esta atualmente com o foco
	 * */
	getCurrentFocus: function()
	{
		return this.currentFocusIndex;
	},
	
	/*  setMediaFocus
	 
	 	Chama a funcao que define o foco em uma media
	 * */
	setMediaFocus: function(mediaId)
	{
		$(mediaId).trigger('focus');
	},
	
	/*  removeMediaFocus
	 
	 	Chama a funcao que retira o foco de uma media
	 * */
	removeMediaFocus: function(mediaId)
	{
		$(mediaId).trigger('blur');
	},
	

	/*
	 	bindKeyDown
	 	
	 	Funcao que faz o bind do evento keydown
	 * */
	bindKeyDown: function()
	{
		$(window).on('keydown', function(event){
		
			if(Keys.allCodes.indexOf(event.which) != -1)
			{
				event.preventDefault();
				Descriptor.keyEvent(event.which);
			}
	
		})
	},
	
	/*
	 	bindKeyDown
	 	
	 	Funcao que faz o unbind do evento keydown
	 * */	
	
	unbindKeyDown: function()
	{
		$(window).off('keydown');
	},
	

	/*
	    keyEvent
	    
	    Trata eventos de teclas realizando a movimentacao entre os Descriptors
	 * */
	
	keyEvent: function(keyCode)
	{
		if(this.currentFocusIndex)
		{
			currentDescriptor = this.descriptors[this.currentFocusIndex];
			switch (keyCode)
			{

				case Keys.CURSOR_UP:
					if(currentDescriptor.self.moveUp)
						this.setCurrentFocus(currentDescriptor.self.moveUp.focusIndex)
				break;		
				
				case Keys.CURSOR_DOWN:
					if(currentDescriptor.self.moveDown)
						this.setCurrentFocus(currentDescriptor.self.moveDown.focusIndex)


				break;
				
				case Keys.CURSOR_LEFT:
					if(currentDescriptor.self.moveLeft)
						this.setCurrentFocus(currentDescriptor.self.moveLeft.focusIndex)
						
				break;
				
				case Keys.CURSOR_RIGHT:
					if(currentDescriptor.self.moveRight)
						this.setCurrentFocus(currentDescriptor.self.moveRight.focusIndex)
					
				break;					
				
				case Keys.ENTER:
					for(var i in currentDescriptor.mediaArray)
					{
						currentMedia = currentDescriptor.mediaArray[i];
						$(currentMedia).trigger('selection.onSelection');
					}
					
				break;
				
			}
		}
	},
	
	/*
	    bindMouseEvents
        
        Funcao que faz os binds dos evento click e mouseenter
     * */
    bindMouseEvents: function(focusIndex, mediaId)
    {
        $(mediaId).css("cursor","pointer");
        
        $(mediaId).on('click', $.proxy(function(event){            
            if (event.which == 1)
                this.keyEvent(Keys.ENTER);
        },this))
        
        $(mediaId).on('mouseover',{focusIndex: focusIndex}, $.proxy(function(event){
            this.setCurrentFocus(event.data.focusIndex);
        },this))
    },
    
    /*
        unbindMouseevents
        
        Funcao que faz o unbind dos eventos click e mouseenter
     * */   
    
    unbindMouseEvents: function(mediaId)
    {
        $(mediaId).off('click');
        $(mediaId).off('mouseover');
        $(mediaId).css("cursor","default");
    }
	
}
	
	


/*
     Parte do formatter que cuida das variaveis reservadas pelo sistema
 * */

var SystemSettings = {
	
	//Propriedades que nao precisam de funcoes de get e set
	settings : {
		'default.focusBorderColor' 		 : 'blue',
		'default.selBorderColor'   		 : 'yellow',
		'default.focusBorderWidth'		 : 2,
		'default.focusBorderTransparency': 0,
		
		'service.currentKeyMaster'       : ''
	},
	
	//Mapa das funcoes de set de algumas propriedadees
	setMap:	{
		'service.currentFocus': $.proxy(Descriptor.setCurrentFocus,Descriptor)
	},
	
	//Mapa das funcoes de get de algumas propriedades
	//(devem ser as mesmas que possuem funcao de set)
	getMap: {
		'service.currentFocus': $.proxy(Descriptor.getCurrentFocus,Descriptor)
	},
	
	//Funcao que inicializa o modulo SystemSettings
	initialize: function()
	{
			//Do nothing at all			
			
	},
	
	/*
	    Funcao que define uma propriedade de sistema
	 * */
	setProperty: function(property, value)
	{
		
	    if(property in this.settings)
	    {
	    	this.settings[property] = value;
	    } else if(property in this.setMap)
	    {
	    	this.setMap[property](value);
	    }
		
	},
	
	/*
	 *  Funcao utilizada para retornar uma propridade de sistema
	 */
	getProperty: function(property)
	{
		if(property in this.settings)
	    {
	    	return this.settings[property];
	    } else if(property in this.setMap)
	    {
	    	return this.getMap[property]();
	    }
		
	}
	
	
}
	




/*
 *    Classe Listener
 * */



/*
      Formato do flagMap
      -------------------
	  flagMap['onBegin'] = {
	  	 bindComponent: "",
	  	 bindInterface: null,
	  	 eventType: "",
	  	 flag: false
	  	
	   }
	   
	   
	   assessmentStatements = [
	   {
	       bindComponent,
	       bindInterface,
	       operator,
	       value
	   }
	   ]

 
	actionMap['start'] =
	{
		binds: [ 
		{
		    bindComponent:
		    bindInterface:
		    value:
		}
		],
		qualifier: "par"
	}
	
	
 * 
 * */

/*     
 * Classe Listener
 * 
 * TODO(danilo) : Delay de eventos
 * TODO(danilo) : Tratar condicoes encadeadas
 * 
 */

function Listener(listenerType, actionOperator, actionMap, flagMap, assessmentStatements)
{
	this.listenerType = listenerType;
	this.actionOperator = actionOperator;
	this.actionMap = actionMap;
	this.flagMap = flagMap;
	this.assessmentStatements = assessmentStatements;
	this.last = new Date();
	this.triggerBuffer = undefined;
	
	/*
	 * actionNamesArray
	 *     Array gerado com os nomes das acoes no actionMap. Sua utilizacao eh 
	 * necessaria para possibilitar encadeamento sequencial de acoes diferentes
	 * relacionadas a uma mesma condicao.
	 */
	this.actionNamesArray = new Array();
	for(actionName in actionMap)
	{
	    this.actionNamesArray.push(actionName)
	}
}

/* 
 *  notifyEvent(conditionName)
 * 		Funcao responsavel por tratar um evento quando uma condicao eh 
 *  satisfeita, decidindo se as acoes associadas devem ser disparadas ou se
 *  devem esperar que outra(s) condicao(oes) seja(m) satisfeita(s)
 * 
 *  TODO: conditions aninhados
 *  TODO: compoundStatement
 */
Listener.prototype.notifyEvent = function(conditionName)
{
	
	switch(this.listenerType)
	{
		case Formatter.listenerType.SIMPLE:
			if (this.__verifyAssessmentStatements())
				this.__executeActions();
			break;
			
		case Formatter.listenerType.AND:
			if((new Date().valueOf() - this.last.valueOf()) > Formatter.TIME_LIMIT)
			{
				//Reseta todas as flags
				for(var index in this.flagMap)
					this.flagMap[index].flag = false;
				//Seta a flag do evento recebido
				this.flagMap[conditionName].flag = true;
				this.last = new Date();
			}
			else
			{				
				//Seta a flag do evento recebido
				this.flagMap[conditionName].flag = true;
				var tempFlag = true;
				
				//Verifica se todas as flags estao setadas
				for (var index in this.flagMap)
				{
					if( ! (this.flagMap[index].flag))
					{
						tempFlag=false;
						break;
					}
				}
				//caso estejam, executa a acao
				if(tempFlag) 
				{
					//Limpa todas as flags
					for(var index in this.flagMap)
						this.flagMap[index].flag = false;
					this.last = 0;
					if (this.__verifyAssessmentStatements())
					   this.__executeActions();
				}
			}
			break;
		
		case Formatter.listenerType.OR:
			if((new Date().valueOf() - this.last.valueOf()) > Formatter.TIME_LIMIT)
			{
				this.last = new Date();
				this.__executeActions();
			}	
			break;
	}
	

}


/*  
 *  __verifyAsessmentStatements()
 *      Realiza os testes de comparacao presentes no vetor assessmentStatements
 * 
 *  Retorna:
 *      - false, se alguma condicao do vetor nao for satisfeita
 *      - true, se o vetor estiver vazio ou se todas as condicoes no vetor forem
 *  satisfeitas
 * 
 *  TODO: compoundStatement
 */
Listener.prototype.__verifyAssessmentStatements = function()
{

    for (var i in this.assessmentStatements)
    {
        var thisAssessment = this.assessmentStatements[i];
        var propertyValue = $(thisAssessment.bindComponent).data('property')[thisAssessment.bindInterface];
        switch(thisAssessment.operator)
        {
            case "eq":

                if(!(propertyValue == thisAssessment.value))
                    return false;
                break;
            
            case "ne":
                if(!(propertyValue != thisAssessment.value))
                    return false;
                break;
            
            case "lt":
                if(!(propertyValue < thisAssessment.value))
                    return false;
                break;
            
            case "lte":
                if(!(propertyValue <= thisAssessment.value))
                    return false;
                break;
            
            case "gt":
                if(!(propertyValue > thisAssessment.value))
                    return false;
                break;
            
            case "gte":
                if(!(propertyValue >= thisAssessment.value))
                    return false;
                break;
        }
    }

    return true;
}

/*	
 *  __executeActions()
 *  	Funcao responsavel por executar as acoes de um dado evento quando as 
 *  condicoes foram satisfeitas
 */
Listener.prototype.__executeActions = function()
{
	if(this.actionOperator == 'seq')
		this.__executeActionsSeq([0]);
	else // if (this.actionOerator == 'par')
		this.__executeActionsPar();
}


/*	
 *  __executeActionsSeq(args)
 * 		Funcao auxiliar da funcao executeActions(). Responsavel por executar 
 *  acoes diferentes de um mesmo evento sequencialmente
 * 
 *  Argumentos
 *      args[0] = actionIndex: Indice do nome da acao no vetor actionNamesArray.
 *          Seu valor eh -1 quando a execucao de diferentes acoes eh paralela
 */
Listener.prototype.__executeActionsSeq = function(args)
{
    var actionIndex = args[0];
    if(actionIndex < this.actionNamesArray.length)
    	this.__callTriggers([this.actionNamesArray[actionIndex],actionIndex]);
}


/*	
 *  __executeActionsPar()
 * 		Funcao auxiliar da funcao executeActions(). Responsavel por executar 
 *  acoes diferentes de um mesmo evento paralelamente
 */
Listener.prototype.__executeActionsPar = function()
{
	for (var actionName in this.actionMap)
		this.__callTriggers([actionName,-1]);
}




/*	
 *  __callTriggers(args)
 *  	Funcao responsavel por executar as multiplas instancias de uma acao de 
 *  um evento
 * 
 * Argumentos:
 *      args[0] = actionName: Nome da acao
 *      args[1] = actionIndex: Indice do nome da acao no vetor actionNamesArray.
 *          Seu valor eh -1 quando a execucao de diferentes acoes eh paralela
 *      
 */
Listener.prototype.__callTriggers = function(args)
{
    var actionName = args[0],
        actionIndex = args[1];
        
	if (this.actionMap[actionName].qualifier == 'seq')
		this.__callTriggersSeq([actionName,actionIndex, 0]);
	else // if (this.actionMap[actionName] == 'par')
		this.__callTriggersPar([actionName,actionIndex]);
}


/*	
 *  __callTriggersSeq(args)
 * 		Funcao auxiliar da funcao callTriggers(actionName). Responsavel por
 *  executar uma instancia de uma acao. Eh chamada repetidamente para eventos 
 *  de acoes sequenciais.
 *      
 *  Argumentos:
 *      args[0] = actionName:  Nome da acao
 *      args[1] = actionIndex: Indice do nome da acao no vetor actionNamesArray.
 *          Seu valor eh -1 quando a execucao de diferentes acoes eh paralela
 *      args[2] = triggerIndex: Indice da instancia na sequencia de chamadas 
 *          desta acao.
 */
Listener.prototype.__callTriggersSeq = function(args)
{
    var actionName = args[0], 
        actionIndex = args[1], 
        triggerIndex = args[2],
        bindsArray = this.actionMap[actionName].binds,
        target = bindsArray[triggerIndex];
        
    
    if(actionIndex >= 0)
    {
        if(triggerIndex == 0 && actionIndex == 0)
            this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]]);
        else if (triggerIndex < bindsArray.length - 1)
            $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]);
        else
            $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__executeActionsSeq,this), [actionIndex+1], target.value]);
    }
    else
    {
        if(triggerIndex == 0)
            this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]]);
        else if (triggerIndex < bindsArray.length - 1)
            $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]);
        else
            $(target.bindComponent).trigger(actionName,[target.bindInterface, null, null, target.value]);
    }
}


/*	
 *  __callTriggersPar(args)
 * 		Funcao auxiliar da funcao callTriggers(actionName). Responsavel por
 *  executar diferentes instancias de uma mesma acao paralelamente
 *      
 *  Argumentos:
 *      args[0] = actionName:  Nome da acao
 *      args[1] = actionIndex: Indice do nome da acao no vetor actionNamesArray.
 *          Seu valor eh -1 quando a execucao de diferentes acoes eh paralela
 */
Listener.prototype.__callTriggersPar = function(args)
{
    var actionName = args[0], 
        actionIndex = args[1],
        actionMapElement = this.actionMap[actionName],
        target;
        
    for (var targetIndex in actionMapElement.binds)
    {
        target = actionMapElement.binds[targetIndex];
        
        
        // se for o ultimo trigger e a execucao dos diferentes tipos de acao for sequencial, chama a execucao do proximo tipo de acao
        if( (targetIndex == actionMapElement.binds.length - 1) && (actionIndex >= 0) )
        {
            if(actionIndex == 0)
                this.triggerBuffer.push([target.bindComponent, actionName,[target.bindInterface,  $.proxy(this.__executeActionsSeq,this), [actionIndex+1],target.value]]);
            else
                $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__executeActionsSeq,this), [actionIndex+1],target.value]);
        	//$('#logger').append('<p class="formatter"> <b>'+target.bindComponent+'</b>['+target.bindInterface+']: <i>'+actionName+'</i>['+(actionIndex+1)+']() <a class="data">'+Ncl30.getDateString()+'</a></p>');
            // before buffer: $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__executeActionsSeq,this), [actionIndex+1],target.value]);
        }        
		else
		{
		    if(actionIndex <= 0)
		        this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface, null, null, target.value]]);
		 	
		 
		    else
		        $(target.bindComponent).trigger(actionName,[target.bindInterface, null, null, target.value]);
			//$('#logger').append('<p class="formatter"> <b>'+target.bindComponent+'</b>['+target.bindInterface+']: <i>'+actionName+'</i>[]() <a class="data">'+Ncl30.getDateString()+'</a></p>');
		    // before buffer: $(target.bindComponent).trigger(actionName,[target.bindInterface, null, null, target.value]);
		}
}

}

/*
 
 
 * 
 * */



