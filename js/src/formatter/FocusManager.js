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
 * @fileoverview Define a classe FocusManager
 */

/**
 * Gerenciador de foco da aplicacao NCL. Trata os eventos do teclado e do mouse
 * Deve ser instanciada somente depois que o objeto presentation recebeu o objeto ncl
 * classes foram instanciadas
 * Tambem eh responsavel por tratar os eventos de tecla nao relacionados com o foco
 * @param {Object} presentation Estrutura que contem objetos 
 * 				   como FocusManager, o proprio SystemSettings,
 * 				   entre outras configuracoes.
 * @constructor
 */
function FocusManager(presentation) {

    this.presentation = presentation;

	var descriptors = presentation.ncl.head.descriptorBase.descriptor;
    var keyEventsObject = presentation.keyEvents;
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
	
};

/*
    addMedia
 
 	Adiciona uma media a lista de medias de um descritor. Um descritor soh pode
 	receber foco se possui medias ativas. Ao invez do descriptor, deve ser passado
 	o seu focusIndex

  */
FocusManager.prototype.addMedia = function(focusIndex, mediaId)
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
};

/*
 
 	removeMedia
 	
 	Remove uma media do array de medias de um descriptor
 	  Caso essa seja a ultima media o descriptor perde o seu foco
 	e currentFocusIndex eh setado com undefined
 
 */
FocusManager.prototype.removeMedia = function(focusIndex, mediaId)
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
	
	
};

/*
   Define o foco nas medias do descriptor com focusIndex
 * */
FocusManager.prototype.setCurrentFocus = function(focusIndex)
{
	
	//Verificamos em focusIndexArray pois um descritor soh pode receber foco
	//se tiver medias ativas
	if(focusIndex == undefined)
	{
		this.currentFocusIndex = focusIndex;
	} else	if(this.focusIndexArray.indexOf(focusIndex) != -1)
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
};

/*
   Retorna o descriptor que esta atualmente com o foco
 * */
FocusManager.prototype.getCurrentFocus = function()
{
	return this.currentFocusIndex;
};

/*  setMediaFocus
 
 	Chama a funcao que define o foco em uma media
 * */
FocusManager.prototype.setMediaFocus = function(mediaId)
{
	$(mediaId).trigger('focus');
};

/*  removeMediaFocus
 
 	Chama a funcao que retira o foco de uma media
 * */
FocusManager.prototype.removeMediaFocus = function(mediaId)
{
	$(mediaId).trigger('blur');
};


/*
 	bindKeyDown
 	
 	Funcao que faz o bind do evento keydown
 * */
FocusManager.prototype.bindKeyDown = function()
{
	$('#'+this.presentation.playerDiv).on('keydown', $.proxy(function(event){
	
		if(Keys.allCodes.indexOf(event.which) != -1)
		{
			event.preventDefault();
			this.keyEvent(event.which);
		}

	},this));
};

/*
 	unbindKeyDown
 	
 	Funcao que faz o unbind do evento keydown
 * */	

FocusManager.prototype.unbindKeyDown=  function()
{
	$(window).off('keydown');
};


/*
    keyEvent
    
    Trata eventos de teclas realizando a movimentacao entre os Descriptors
 * */

FocusManager.prototype.keyEvent = function(keyCode)
{
    this.triggerKeyEvents(keyCode);

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
};

/*
    bindMouseEvents
    
    Funcao que faz os binds dos evento click e mouseenter
 * */
FocusManager.prototype.bindMouseEvents = function(focusIndex, mediaId)
{
    $(mediaId).css("cursor","pointer");
    
    $(mediaId).on('click', $.proxy(function(event){            
        if (event.which == 1)
            this.keyEvent(Keys.ENTER);
    },this))
    
    $(mediaId).on('mouseover',{focusIndex: focusIndex}, $.proxy(function(event){
        this.setCurrentFocus(event.data.focusIndex);
    },this))
};

/*
    unbindMouseevents
    
    Funcao que faz o unbind dos eventos click e mouseenter
 * */   

FocusManager.prototype.unbindMouseEvents=  function(mediaId)
{
    $(mediaId).off('click');
    $(mediaId).off('mouseover');
    $(mediaId).css("cursor","default");
};

FocusManager.prototype.enableKeys = function(mediaId)
{
    if(mediaId)
        if(mediaId in this.presentation.keyEvents)
            this.presentation.keyEvents[mediaId] = true;
};

FocusManager.prototype.disableKeys = function(mediaId)
{
    if(mediaId)
        if(mediaId in this.presentation.keyEvents)
            this.presentation.keyEvents[mediaId] = false;
};

FocusManager.prototype.triggerKeyEvents = function(whichKey)
{
	var enabledMedias = [];
    for(var mediaId in this.presentation.keyEvents)
    {
        if(this.presentation.keyEvents[mediaId])
        {
        	enabledMedias.push(mediaId);
        }
    }
    
    for (var i in enabledMedias) {
    	mediaId = enabledMedias[i];
        var e = $.Event('selection.onSelection');
        e.which = whichKey;
        $(mediaId).trigger(e);
    }
};


//Mantem a informacao de qual objeto possui o foco atualmente
FocusManager.prototype.currentFocusIndex = undefined;

//Mantem referencias para os descritores que possuem focusIndex
FocusManager.prototype.descriptors = {};

//Mantem informacao dos descriptors com medias ativas
FocusManager.prototype.focusIndexArray = [];



/*
 * Funcoes estaticas da classe FocusManager
 * */

/*
  Rotina de ordenacao utilizada no metodo array.sort()
 * */
FocusManager.sortFunction=  function(a,b)
{
	a  = String(a).toLowerCase();
	b  = String(b).toLowerCase();
	
	if (a > b) return 1;
	if (a < b) return -1;
	return 0;
};
