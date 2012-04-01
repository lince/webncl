// Copyright 2012 Lince (dc.ufscar.br). All Rights Reserved.

/**
 * @fileoverview Define a classe Listener
 */


// TODO : Delay de eventos
// TODO : Tratar condicoes encadeadas

/**
 * Classe que representa um Link do NCL. A classe executa as acoes somente quando
 * todos as condicoes foram satisfeitas
 * CompoundCondition encadeado com outros compoundCondition nao sao aceitos
 * @constructor
 */
function Listener(listenerType, actionOperator, actionMap, flagMap, assessmentStatements, presentation)
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
};

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
		case Listener.listenerType.SIMPLE:
			if (this.__verifyAssessmentStatements())
				this.__executeActions();
			break;
			
		case Listener.listenerType.AND:
			if((new Date().valueOf() - this.last.valueOf()) > presentation.TIME_LIMIT)
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
		
		case NclPlayer.listenerType.OR:
			if((new Date().valueOf() - this.last.valueOf()) > presentation.TIME_LIMIT)
			{
				this.last = new Date();
				this.__executeActions();
			}	
			break;
	}
	

};


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
};

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
};


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
};


/*	
 *  __executeActionsPar()
 * 		Funcao auxiliar da funcao executeActions(). Responsavel por executar 
 *  acoes diferentes de um mesmo evento paralelamente
 */
Listener.prototype.__executeActionsPar = function()
{
	for (var actionName in this.actionMap)
		this.__callTriggers([actionName,-1]);
};




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
};


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
        //console.log("__callTriggerSeq", actionName, actionIndex, triggerIndex, bindsArray, bindsArray.length);
    
    /*
     * Se o conjunto de diferentes acoes tem que ser executado de maneira sequencial
     */
    if(actionIndex >= 0)
    {
    	/*
    	    Se eh a primeira chamada, da primeira acao sequencial, entao esta acao
    	  vai para o triggerBuffer (triggerArray) 
    	 * */
        if(triggerIndex == 0 && actionIndex == 0)
        {
        	//Se alem de ser o primeiro, eh o ultimo daquela acao
        	if (triggerIndex == bindsArray.length - 1)
            	this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface,  $.proxy(this.__executeActionsSeq,this), [actionIndex+1], target.value]]);
            else
            	this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]]);
        }
        /*
            Se nao for o primeiro triggerIndex ou nao for a primeira acao
            verifica se o triggerIndex nao eh o ultimo
            (pois o ultimo tem que chamar a funcao que inicia a proxima acao no seu callback)
         * */
        else if (triggerIndex < bindsArray.length - 1)
            $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]);
        /*
            Caso seja o ultimo triggerIndex
            (quando nao eh a primeira)
          
         */
        else
            $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__executeActionsSeq,this), [actionIndex+1], target.value]);
    }
    else
    {
    	//caso seja o primeiro
        if(triggerIndex == 0)
        {
        	//caso tambem seja o ultimo
        	if (triggerIndex == bindsArray.length - 1)
            	this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface,  null, null, target.value]]);            
            else
            	this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]]);
        }
        else if (triggerIndex < bindsArray.length - 1)
            $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]);
        else
            $(target.bindComponent).trigger(actionName,[target.bindInterface, null, null, target.value]);
    }
};


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

};


Listener.listenerType = {
						"SIMPLE": 0,
						"AND" : 1,
						"OR" : 2
						}

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
