// Copyright 2012 Lince (dc.ufscar.br). All Rights Reserved.

/**
 * @fileoverview Define a classe SystemSettings
 */

/**
 * Classe que mantem as configuracoes gerais do NCl sendo tocado.
 * Deve ser instanciada somente depois que o FocusManager e outras
 * classes foram instanciadas
 * @param {Object} presentation Estrutura que contem objetos 
 * 							    como FocusManager, o proprio SystemSettings,
 * 				 			    entre outras configuracoes.
 * @constructor
 */
function SystemSettings(presentation)
{
	//Propriedades que nao precisam de funcoes de get e set
	this.settings = {
		'default.focusBorderColor' 		 : 'blue',
		'default.selBorderColor'   		 : 'yellow',
		'default.focusBorderWidth'		 : 2,
		'default.focusBorderTransparency': 0,
		
		'service.currentKeyMaster'       : ''
	}
	
	//Mapa das funcoes de set de algumas propriedadees
	this.setMap=	{
		'service.currentFocus': $.proxy(presentation.focusManager.setCurrentFocus,presentation.focusManager)
	}
	
	//Mapa das funcoes de get de algumas propriedades
	//(devem ser as mesmas que possuem funcao de set)
	this.getMap= {
		'service.currentFocus': $.proxy(presentation.focusManager.getCurrentFocus,presentation.focusManager)
	}
	

	
};


/**
 *  Funcao que define uma propriedade de sistema
 *  @param {String} property Propriedade de sistema
 *  @param {String} value    Valor a ser definido
 *  @return {boolean} Verdadeiro caso a propriedade modificada eh uma
 * 					  propriedade de sistema
 * 
 */
SystemSettings.prototype.setPropertyValue = function(property, value)
{
	
    if(property in this.settings)
    {
    	this.settings[property] = value;
    } else if(property in this.setMap)
    {
    	this.setMap[property](value);
    } else {
    	return false;
    }
    return true;
	
};


/**
 *  Funcao utilizada para retornar uma propridade de sistema
 *  @param {String} property Propriedade de sistema que deseja-se definer
 *  @return {Boolean} Valor da propriedade de sistema.
 * 					  Caso ela nao exista retorna vazio
 * 
 */
SystemSettings.prototype.getPropertyValue = function(property)
{
	if(property in this.settings)
    {
    	return this.settings[property];
    } else if(property in this.setMap)
    {
    	return this.getMap[property]();
    } else {
    	return ''
    }
	
};
