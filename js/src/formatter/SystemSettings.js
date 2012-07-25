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

/**
 * @fileoverview Define a classe SystemSettings
 */

/**
 * Classe que mantem as configuracoes gerais do NCl sendo tocado.
 * Deve ser instanciada somente depois que o InputManager e outras
 * classes foram instanciadas
 * @param {Object} presentation Estrutura que contem objetos 
 * 							    como InputManager, o proprio SystemSettings,
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
		'service.currentFocus': $.proxy(presentation.inputManager.setCurrentFocus,presentation.inputManager)
	}
	
	//Mapa das funcoes de get de algumas propriedades
	//(devem ser as mesmas que possuem funcao de set)
	this.getMap= {
		'service.currentFocus': $.proxy(presentation.inputManager.getCurrentFocus,presentation.inputManager)
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
    	return undefined;
    }
	
};
