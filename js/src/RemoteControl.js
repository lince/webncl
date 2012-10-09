/*Classe Controle:*/
function RemoteControl(player, divId, initialAreas) {
	this.player = player;
	this.divId = divId;	
	this.allAreas = ['powerEject', 'numbers', 'volumeChannel', 'interactive', 'colorful', 'multimedia'];
	
	
	if (initialAreas) {
		this.areas = {};
		for (index in initialAreas) {
			area = initialAreas[index];
			if ($.inArray(area, this.allAreas) >= 0) {
				this.areas[area] = true;
			} else {
				console.error("RemoteControl: There is no area called '" + area + "'.");
			}
		}
	} else {
		this.areas = {}
		for (index in this.allAreas) {
			this.areas[this.allAreas[index]] = true;
		}
	}
	
	this.createDivs();
	this.createSetAreas();	
	this.bindButtonFunctions();	
	this.listeners = []
}

RemoteControl.prototype.addListener = function(listener) {
	this.listeners.push(listener)
}

RemoteControl.prototype.removeListener = function(listener) {
	this.listeners.splice( $.inArray(listener, this.listeners), 1);
}

RemoteControl.prototype.bindButtonFunctions = function() {
	var imgButtons = ['Start', 'Stop', 'Pause', 'Eject', 'Power', 'Key_1', 'Key_2', 'Key_3', 'Key_4', 'Key_5', 
					'Key_6', 'Key_7', 'Key_8', 'Key_9', 'Key_Hash', 'Key_0', 'Key_Star', 'Volume_Up', 'Channel_Up', 
					'Volume_Down', 'Channel_Down', 'Menu', 'Mute', 'Help', 'Info','Guide', 'Exit', 'Back', 'Enter', 
					'Cursor_Up', 'Cursor_Down', 'Cursor_Left', 'Cursor_Right', 'Red', 'Green', 'Yellow', 'Blue', 
					'Rewind', 'Play', 'Forward', 'Pause', 'Record', 'Stop'];

	for(button in imgButtons){		
		eval("$('#Button' + imgButtons[button]).click($.proxy(function(){"+
				"this.functionButton('"+ imgButtons[button].toUpperCase() + "');" +		
				"},this));"
		);
	}
}



RemoteControl.prototype.createDivs = function() {
	document.getElementById(this.divId).innerHTML = 
		"<div id='areaSpace1'>\
		</div>\
		<div id='areaPowerEject'>\
		<div 	id='ButtonPower'>\
		</div>\
		<div 	id='ButtonEject'>\
		</div>\
		</div>\
		<div id='areaSpace2'>\
		</div>\
		<div id='areaNumbers'>\
		<div 	id='ButtonKey_1'>\
		</div>\
		<div 	id='ButtonKey_2'>\
		</div>\
		<div 	id='ButtonKey_3'>\
		</div>\
		<div 	id='ButtonKey_4'>\
		</div>\
		<div 	id='ButtonKey_5'>\
		</div>\
		<div 	id='ButtonKey_6'>\
		</div>\
		<div 	id='ButtonKey_7'>\
		</div>\
		<div 	id='ButtonKey_8'>\
		</div>\
		<div 	id='ButtonKey_9'>\
		</div>\
		<div 	id='ButtonKey_Hash'>\
		</div>\
		<div 	id='ButtonKey_0'>\
		</div>\
		<div 	id='ButtonKey_Star'>\
		</div>\
		</div>\
		<div id='areaSpace3'>\
		</div>\
		<div id='areaVolumeChannel'>\
		<div 	id='ButtonVolume_Up'>\
		</div>\
		<div 	id='ButtonVolume_Down'>\
		</div>\
		<div 	id='ButtonChannel_Up'>\
		</div>\
		<div 	id='ButtonChannel_Down'>\
		</div>\
		<div 	id='ButtonMenu'>\
		</div>\
		<div 	id='ButtonMute'>\
		</div>\
		<div 	id='ButtonHelp'>\
		</div>\
		</div>\
		<div id='areaSpace4'>\
		</div>\
		<div id='areaInteractive'>\
		<div 	id='ButtonCursor_Up'>\
		</div>\
		<div 	id='ButtonCursor_Down'>\
		</div>\
		<div 	id='ButtonCursor_Left'>\
		</div>\
		<div 	id='ButtonCursor_Right'>\
		</div>\
		<div 	id='ButtonEnter'>\
		</div>\
		<div 	id='ButtonInfo'>\
		</div>\
		<div 	id='ButtonGuide'>\
		</div>\
		<div 	id='ButtonBack'>\
		</div>\
		<div 	id='ButtonExit'>\
		</div>\
		</div>\
		<div id='areaSpace5'>\
		</div>\
		<div id='areaColorful'>\
		<div 	id='ButtonRed'>\
		</div>\
		<div 	id='ButtonGreen'>\
		</div>\
		<div 	id='ButtonYellow'>\
		</div>\
		<div 	id='ButtonBlue'>\
		</div>\
		</div>\
		<div id='areaSpace6'>\
		</div>\
		<div id='areaMultimedia'>\
		<div 	id='ButtonRewind'>\
		</div>\
		<div 	id='ButtonPlay'>\
		</div>\
		<div 	id='ButtonForward'>\
		</div>\
		<div 	id='ButtonRecord'>\
		</div>\
		<div 	id='ButtonPause'>\
		</div>\
		<div 	id='ButtonStop'>\
		</div>\
		</div>\
		<div id='areaSpace7'>\
		</div>\
		<div id='areaLogo'>\
		<div/>\
		</div>\
		<div id='areaSpace8'>\
		</div>";
		
	$('#areaSpace1').hide();
	$('#areaPowerEject').hide();
	$('#areaSpace2').hide();
	$('#areaNumbers').hide();
	$('#areaSpace3').hide();
	$('#areaVolumeChannel').hide();
	$('#areaSpace4').hide();
	$('#areaInteractive').hide();
	$('#areaSpace5').hide();
	$('#areaColorful').hide();
	$('#areaSpace6').hide();
	$('#areaMultimedia').hide();
	$('#areaSpace7').hide();
	$('#areaLogo').hide();
	$('#areaSpace8').hide();	
}

//Habilita as áreas pré-definidas pelo criador do controle:
RemoteControl.prototype.createSetAreas = function(){
	for (index in this.allAreas){			
		var name = 	this.allAreas[index];
		var capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
		//this[ 'setArea'+ capitalizedName ];

		eval("RemoteControl.prototype['setArea" + capitalizedName + "'] = function(value){\n"+
			//sinaliza a flag de controle da área
			"this.areas['" +name+ "'] = value;\n"+

			//a área sempre será visualizada juntamente com o seu espaçamento acima
			"if (value) {\n"+
			"$('#areaSpace" +(index+1)+ "').show();\n"+
			"$('#area" +capitalizedName+ "').show();\n"+
			"} else {\n"+
			"$('#areaSpace" +(index+1)+ "').hide();\n"+
			"$('#area" +capitalizedName+ "').hide();\n"+
			"}\n"+

			//o último espaçamento e os logos serão visíveis enquanto qualquer outra área for visível
			"if((this.areas.powerEject)||(this.areas.numbers)||(this.areas.volumeChannel)\n"+
					"||(this.areas.interactive)||(this.areas.colorful)||(this.areas.multimedia)){\n"+
				"$('#areaSpace7').show();\n"+
				"$('#areaLogo').show();\n"+
				"$('#areaSpace8').show();\n"+
			"}\n"+
			"else{\n"+
				"$('#areaSpace7').hide();\n"+
				"$('#areaLogo').hide();\n"+
				"$('#areaSpace8').hide();\n"+		
			"}\n"+
		"}");
		
		if (this.areas[name]) {
			this['setArea' + capitalizedName](true);
		}
	}
}

//Chamada da função específica de cada botão			
RemoteControl.prototype.functionButton = function(b){
	for (index in this.listeners) {
		this.listeners[index](b)
	}
	switch(b) {
	case 'PLAY':
		if (this.isPause) {
			this.player.resume();
		} else {
			this.player.start();
		}
		break;
	case 'STOP':
		this.player.stop();
		break;
	case 'PAUSE':
		this.player.pause();
		this.isPause = true;
		break;
	default:
		this.player.keyPress(b);
		break;
	}
	
}