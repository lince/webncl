/*Classe Controle:*/
function RemoteControl(player, divId, top, left, p_areaPowerEject, p_areaNumbers, p_areaVolumeChannel, p_areaInteractive, p_areaColorful, p_areaMultimedia) 
{
	this.player = player;
	this.divId = divId;
	this.p_areaPowerEject = p_areaPowerEject;
	this.p_areaNumbers = p_areaNumbers;
	this.p_areaVolumeChannel = p_areaVolumeChannel;
	this.p_areaInteractive = p_areaInteractive;
	this.p_areaColorful = p_areaColorful;
	this.p_areaMultimedia = p_areaMultimedia;
	this.top = top;
	this.left = left;


	//flags para controle visual de cada área
	var controlPowerEject = 0;
	var controlNumbers = 0;
	var controlVolumeChannel = 0;
	var controlInteractive = 0;
	var controlColorful = 0;
	var controlMultimedia = 0;		

	style="\
	/*==================== Divs das áreas do Controle =====================*/\
		\
		/*--- Área Geral do Controle ---*/\
		#areaRemoteControl{\
		position:absolute;\
		width:134.74px;\
		height:600px;\
		top:" + this.top + "px;\
		left:" + this.left + "px;\
		}\
		\
		/*--- Área do Espaçamento 1 ---*/\
		#areaSpace1{\
		position:relative;\
		background-image:url(images/control/space.png);\
		height:1%;\
		width:100%;\
		background-size:134.74px 6px;\
		}\
		\
		/*--- Área do Espaçamento 2 ---*/\
		#areaSpace2{\
		position:relative;\
		background-image:url(images/control/space.png);\
		height:1%;\
		width:100%;\
		background-size:134.74px 6px;\
		}\
		\
		/*--- Área do Espaçamento 3 ---*/\
		#areaSpace3{\
		position:relative;\
		background-image:url(images/control/space.png);\
		height:1%;\
		width:100%;\
		background-size:134.74px 6px;\
		}\
		\
		/*--- Área do Espaçamento 4 ---*/\
		#areaSpace4{\
		position:relative;\
		background-image:url(images/control/space.png);\
		height:1%;\
		width:100%;\
		background-size:134.74px 6px;\
		}\
		\
		/*--- Área do Espaçamento 5 ---*/\
		#areaSpace5{\
		position:relative;\
		background-image:url(images/control/space.png);\
		height:1%;\
		width:100%;\
		background-size:134.74px 6px;\
		}\
		\
		/*--- Área do Espaçamento 6 ---*/\
		#areaSpace6{\
		position:relative;\
		background-image:url(images/control/space.png);\
		height:1%;\
		width:100%;\
		background-size:134.74px 6px;\
		}\
		\
		/*--- Área do Espaçamento 7 ---*/\
		#areaSpace7{\
		position:relative;\
		background-image:url(images/control/space.png);\
		height:1%;\
		width:100%;\
		background-size:134.74px 6px;\
		}\
		\
		/*--- Área do Espaçamento 8 ---*/\
		#areaSpace8{\
		position:relative;\
		background-image:url(images/control/space.png);\
		height:1%;\
		width:100%;\
		background-size:134.74px 6px;\
		}\
		\
		/*--- Área do Power e Eject ---*/\
		#areaPowerEject{\
		position:relative;\
		height:6%;\
		width:100%;\
		background-image:url(images/control/power_eject.png);\
		background-size:134.74px 36px;\
		}\
		\
		/*--- Área dos Alfanuméricos ---*/\
		#areaNumbers{\
		position:relative;\
		height:21%;\
		width:100%;\
		background-image:url(images/control/numbers.png);\
		background-size:134.74px 126px;\
		}\
		\
		/*--- Área do Volume e do Channel ---*/\
		#areaVolumeChannel{\
		position:relative;\
		height:20%;\
		width:100%;\
		background-image:url(images/control/volume_channel.png);\
		background-size:134.74px 120px;\
		}\
		\
		/*--- Área dos Interativos ---*/\
		#areaInteractive{\
		position:relative;\
		height:21%;\
		width:100%;\
		background-image:url(images/control/interactive.png);\
		background-size:134.74px 126px;\
		}\
		\
		/*--- Área dos Coloridos ---*/\
		#areaColorful{\
		position:relative;\
		height:5%;\
		width:100%;\
		background-image:url(images/control/colorful.png);\
		background-size:134.74px 30px;\
		}\
		\
		/*--- Área Multimídia ---*/\
		#areaMultimedia{\
		position:relative;\
		height:14%;\
		width:100%;\
		background-image:url(images/control/multimedia.png);\
		background-size:134.74px 84px;\
		}\
		\
		/*--- Área do Logo ---*/\
		#areaLogo{\
		position:relative;\
		height:5%;\
		width:100%;\
		background-image:url(images/control/multimedia.png);\
		background-size:134.74px 30px;\
		}\
		\
		\
		/*======================== Divs dos Botões =========================*/\
		\
		/*--- Botão Power ---*/\
		#ButtonPower{\
		position: absolute;\
		width: 28px;\
		height: 27px;\
		top: 6.5px;\
		left:12.8px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Power.png);\
		background-size:28px 27px;\
		}\
		\
		#ButtonPower:hover{\
		opacity:1;\
		}\
		\
		#ButtonPower:active{\
		background-image:url(images/control/Buttons/press/png/Power.png);\
		}\
		\
		/*--- Botão Eject ---*/\
		#ButtonEject{\
		position: absolute;\
		width: 20.7px;\
		height: 19.7px;\
		top: 13.4px;\
		left:101.7px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Eject.png);\
		background-size:20.7px 19.7px;\
		}\
		\
		#ButtonEject:hover{\
		opacity:1;\
		}\
		\
		#ButtonEject:active{\
		background-image:url(images/control/Buttons/press/png/Eject.png);\
		}\
		\
		/*--- Botão Key_1 ---*/\
		#ButtonKey_1{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 4px;\
		left:12px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_1.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_1:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_1:active{\
		background-image:url(images/control/Buttons/press/png/Key_1.png);\
		}\
		\
		/*--- Botão Key_2 ---*/\
		#ButtonKey_2{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 4px;\
		left:52.5px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_2.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_2:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_2:active{\
		background-image:url(images/control/Buttons/press/png/Key_2.png);\
		}\
		\
		/*--- Botão Key_3 ---*/\
		#ButtonKey_3{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 4.5px;\
		left:94px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_3.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_3:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_3:active{\
		background-image:url(images/control/Buttons/press/png/Key_3.png);\
		}\
		\
		/*--- Botão Key_4 ---*/\
		#ButtonKey_4{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 35.5px;\
		left:12px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_4.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_4:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_4:active{\
		background-image:url(images/control/Buttons/press/png/Key_4.png);\
		}\
		\
		/*--- Botão Key_5 ---*/\
		#ButtonKey_5{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 35.5px;\
		left:52.5px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_5.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_5:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_5:active{\
		background-image:url(images/control/Buttons/press/png/Key_5.png);\
		}\
		\
		/*--- Botão Key_6 ---*/\
		#ButtonKey_6{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 35.5px;\
		left:94px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_6.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_6:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_6:active{\
		background-image:url(images/control/Buttons/press/png/Key_6.png);\
		}\
		\
		/*--- Botão Key_7 ---*/\
		#ButtonKey_7{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 66.7px;\
		left:12px;\
		cursor:pointer;;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_7.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_7:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_7:active{\
		background-image:url(images/control/Buttons/press/png/Key_7.png);\
		}\
		\
		\
		/*--- Botão Key_8 ---*/\
		#ButtonKey_8{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 66.7px;\
		left:52.5px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_8.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_8:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_8:active{\
		background-image:url(images/control/Buttons/press/png/Key_8.png);\
		}\
		\
		/*--- Botão Key_9 ---*/\
		#ButtonKey_9{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 66.7px;\
		left:94px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_9.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_9:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_9:active{\
		background-image:url(images/control/Buttons/press/png/Key_9.png);\
		}\
		\
		/*--- Botão Key_Hash ---*/\
		#ButtonKey_Hash{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 98px;\
		left:12px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_Hash.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_Hash:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_Hash:active{\
		background-image:url(images/control/Buttons/press/png/Key_Hash.png);\
		}\
		\
		/*--- Botão Key_0 ---*/\
		#ButtonKey_0{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 98px;\
		left:52.6px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_0.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_0:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_0:active{\
		background-image:url(images/control/Buttons/press/png/Key_0.png);\
		}\
		\
		/*--- Botão Key_Star ---*/\
		#ButtonKey_Star{\
		position: absolute;\
		width: 30px;\
		height: 24px;\
		top: 98px;\
		left:94px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Key_Star.png);\
		background-size:30px 24px;\
		}\
		\
		#ButtonKey_Star:hover{\
		opacity:1;\
		}\
		\
		#ButtonKey_Star:active{\
		background-image:url(images/control/Buttons/press/png/Key_Star.png);\
		}\
		\
		/*--- Botão Volume_Up ---*/\
		#ButtonVolume_Up{\
		position: absolute;\
		width: 29px;\
		height: 27px;\
		top: 4.7px;\
		left:11px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Volume_Up.png);\
		background-size:29px 27px;\
		}\
		\
		#ButtonVolume_Up:hover{\
		opacity:1;\
		}\
		\
		#ButtonVolume_Up:active{\
		background-image:url(images/control/Buttons/press/png/Volume_Up.png);\
		}\
		\
		/*--- Botão Volume_Down ---*/\
		#ButtonVolume_Down{\
		position: absolute;\
		width: 29px;\
		height: 26.5px;\
		top: 49px;\
		left:11px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Volume_Down.png);\
		background-size:29px 26.5px;\
		}\
		\
		#ButtonVolume_Down:hover{\
		opacity:1;\
		}\
		\
		#ButtonVolume_Down:active{\
		background-image:url(images/control/Buttons/press/png/Volume_Down.png);\
		}\
		\
		/*--- Botão Channel_Up ---*/\
		#ButtonChannel_Up{\
		position: absolute;\
		width: 29px;\
		height: 27px;\
		top: 5px;\
		left:94px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Volume_Up.png);\
		background-size:29px 27px;\
		}\
		\
		#ButtonChannel_Up:hover{\
		opacity:1;\
		}\
		\
		#ButtonChannel_Up:active{\
		background-image:url(images/control/Buttons/press/png/Volume_Up.png);\
		}\
		\
		/*--- Botão Channel_Down ---*/\
		#ButtonChannel_Down{\
		position: absolute;\
		width: 29px;\
		height: 27px;\
		top: 49px;\
		left:95px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Volume_Down.png);\
		background-size:29px 27px;\
		}\
		\
		#ButtonChannel_Down:hover{\
		opacity:1;\
		}\
		\
		#ButtonChannel_Down:active{\
		background-image:url(images/control/Buttons/press/png/Volume_Down.png);\
		}\
		\
		/*--- Botão Menu ---*/\
		#ButtonMenu{\
		position: absolute;\
		width: 30.9px;\
		height: 34.7px;\
		top: 21px;\
		left:51px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Menu.png);\
		background-size:30.9px 34.7px;\
		}\
		\
		#ButtonMenu:hover{\
		opacity:1;\
		}\
		\
		#ButtonMenu:active{\
		background-image:url(images/control/Buttons/press/png/Menu.png);\
		}\
		\
		/*--- Botão Mute ---*/\
		#ButtonMute{\
		position: absolute;\
		width: 26.4px;\
		height: 29.5px;\
		top: 86px;\
		left:12.3px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Mute.png);\
		background-size:26.4px 29.5px;\
		}\
		\
		#ButtonMute:hover{\
		opacity:1;\
		}\
		\
		#ButtonMute:active{\
		background-image:url(images/control/Buttons/press/png/Mute.png);\
		}\
		\
		/*--- Botão Help ---*/\
		#ButtonHelp{\
		position: absolute;\
		width: 26.9px;\
		height: 29.9px;\
		top: 86.1px;\
		left:95.6px;\
		cursor:pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Help.png);\
		background-size:26.9px 30px\
		}\
		\
		#ButtonHelp:hover{\
		opacity:1;\
		}\
		\
		#ButtonHelp:active{\
		background-image:url(images/control/Buttons/press/png/Help.png);\
		}\
		\
		/*--- Botão Info ---*/\
		#ButtonInfo{\
		position: absolute;\
		width: 26px;\
		height: 26px;\
		top: 4px;\
		left: 12.5px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Info.png);\
		background-size:26px 26px;\
		}\
		\
		#ButtonInfo:hover{\
		opacity:1;\
		}\
		\
		#ButtonInfo:active{\
		background-image:url(images/control/Buttons/press/png/Info.png);\
		}\
		\
		/*--- Botão Exit ---*/\
		#ButtonExit{\
		position: absolute;\
		width: 25.7px;\
		height: 26.1px;\
		top: 95px;\
		left: 13px;\
		cursor: pointer;;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Exit.png);\
		background-size:25.7px 26.1px;\
		}\
		\
		#ButtonExit:hover{\
		opacity:1;\
		}\
		\
		#ButtonExit:active{\
		background-image:url(images/control/Buttons/press/png/Exit.png);\
		}\
		\
		/*--- Botão Guide ---*/\
		#ButtonGuide{\
		position: absolute;\
		width: 25.8px;\
		height: 26px;\
		top: 4px;\
		left: 96.3px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Guide.png);\
		background-size:25.8px 26px;\
		}\
		\
		#ButtonGuide:hover{\
		opacity:1;\
		}\
		\
		#ButtonGuide:active{\
		background-image:url(images/control/Buttons/press/png/Guide.png);\
		}\
		\
		/*--- Botão Back ---*/\
		#ButtonBack{\
		position: absolute;\
		width: 25.6px;\
		height: 25.4px;\
		top: 96px;\
		left: 97px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Back.png);\
		background-size:25.6px 25.4px;\
		}\
		\
		#ButtonBack:hover{\
		opacity:1;\
		}\
		\
		#ButtonBack:active{\
		background-image:url(images/control/Buttons/press/png/Back.png);\
		}\
		\
		/*--- Botão Enter ---*/\
		#ButtonEnter{\
		position: absolute;\
		width: 42.5px;\
		height: 43px;\
		top: 42px;\
		left: 46px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Enter.png);\
		background-size:42.5px 43px;\
		}\
		\
		#ButtonEnter:hover{\
		opacity:1;\
		}\
		\
		#ButtonEnter:active{\
		background-image:url(images/control/Buttons/press/png/Enter.png);\
		}\
		\
		/*--- Botão Cursor_Up ---*/\
		#ButtonCursor_Up{\
		position: absolute;\
		width: 53px;\
		height: 21px;\
		top: 16.5px;\
		left: 41.5px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Cursor_Up.png);\
		background-size:53px 21px;\
		}\
		\
		#ButtonCursor_Up:hover{\
		opacity:1;\
		}\
		\
		#ButtonCursor_Up:active{\
		background-image:url(images/control/Buttons/press/png/Cursor_Up.png);\
		}\
		\
		/*--- Botão Cursor_Down ---*/\
		#ButtonCursor_Down{\
		position: absolute;\
		width: 52px;\
		height: 20px;\
		top: 90px;\
		left: 41px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Cursor_Down.png);\
		background-size:52px 20px;\
		}\
		\
		#ButtonCursor_Down:hover{\
		opacity:1;\
		}\
		\
		#ButtonCursor_Down:active{\
		background-image:url(images/control/Buttons/press/png/Cursor_Down.png);\
		}\
		\
		/*--- Botão Cursor_Left ---*/\
		#ButtonCursor_Left{\
		position: absolute;\
		width: 20px;\
		height: 55px;\
		top: 36px;\
		left: 21px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Cursor_Left.png);\
		background-size:20px 55px;\
		}\
		\
		#ButtonCursor_Left:hover{\
		opacity:1;\
		}\
		\
		#ButtonCursor_Left:active{\
		background-image:url(images/control/Buttons/press/png/Cursor_Left.png);\
		}\
		\
		/*--- Botão Cursor_Right ---*/\
		#ButtonCursor_Right{\
		position: absolute;\
		width: 20px;\
		height: 54px;\
		top: 36px;\
		left: 93.5px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Cursor_Right.png);\
		background-size:20px 54px;\
		}\
		\
		#ButtonCursor_Right:hover{\
		opacity:1;\
		}\
		\
		#ButtonCursor_Right:active{\
		background-image:url(images/control/Buttons/press/png/Cursor_Right.png);\
		}\
		\
		/*--- Botão Red ---*/\
		#ButtonRed{\
		position: absolute;\
		width: 22px;\
		height: 21px;\
		top: 4.5px;\
		left: 14.5px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Red.png);\
		background-size:22px 21px;\
		}\
		\
		#ButtonRed:hover{\
		opacity:1;\
		}\
		\
		#ButtonRed:active{\
		background-image:url(images/control/Buttons/press/png/Red.png);\
		}\
		\
		/*--- Botão Green ---*/\
		#ButtonGreen{\
		position: absolute;\
		width: 21px;\
		height: 21px;\
		top: 4px;\
		left: 42.5px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Green.png);\
		background-size:21px 21px;\
		}\
		\
		#ButtonGreen:hover{\
		opacity:1;\
		}\
		\
		#ButtonGreen:active{\
		background-image:url(images/control/Buttons/press/png/Green.png);\
		}\
		\
		/*--- Botão Yellow ---*/\
		#ButtonYellow{\
		position: absolute;\
		width: 21px;\
		height: 20px;\
		top: 4.5px;\
		left: 70.5px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Yellow.png);\
		background-size:21px 20px;\
		}\
		\
		#ButtonYellow:hover{\
		opacity:1;\
		}\
		\
		#ButtonYellow:active{\
		background-image:url(images/control/Buttons/press/png/Yellow.png);\
		}\
		\
		/*--- Botão Blue ---*/\
		#ButtonBlue{\
		position: absolute;\
		width: 22px;\
		height: 21px;\
		top: 5px;\
		left: 98px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Blue.png);\
		background-size:22px 21px;\
		}\
		\
		#ButtonBlue:hover{\
		opacity:1;\
		}\
		\
		#ButtonBlue:active{\
		background-image:url(images/control/Buttons/press/png/Blue.png);\
		}\
		\
		/*--- Botão Rewind ---*/\
		#ButtonRewind{\
		position: absolute;\
		width: 30.2px;\
		height: 25.5px;\
		top: 11px;\
		left: 12.6px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Rewind.png);\
		background-size:30.2px 25.5px;\
		}\
		\
		#ButtonRewind:hover{\
		opacity:1;\
		}\
		\
		#ButtonRewind:active{\
		background-image:url(images/control/Buttons/press/png/Rewind.png);\
		}\
		\
		/*--- Botão Play ---*/\
		#ButtonPlay{\
		position: absolute;\
		width: 22px;\
		height: 37.8px;\
		top: 5px;\
		left: 58.5px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Play.png);\
		background-size:22px 38px;\
		}\
		\
		#ButtonPlay:hover{\
		opacity:1;\
		}\
		\
		#ButtonPlay:active{\
		background-image:url(images/control/Buttons/press/png/Play.png);\
		}\
		\
		/*--- Botão Forward ---*/\
		#ButtonForward{\
		position: absolute;\
		width: 31.7px;\
		height: 26.7px;\
		top: 12.1px;\
		left: 91.5px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Forward.png);\
		background-size:31.7px 26.7px;\
		}\
		\
		#ButtonForward:hover{\
		opacity:1;\
		}\
		\
		#ButtonForward:active{\
		background-image:url(images/control/Buttons/press/png/Forward.png);\
		}\
		\
		/*--- Botão Record ---*/\
		#ButtonRecord{\
		position: absolute;\
		width: 26px;\
		height: 27px;\
		top: 52px;\
		left: 16px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Record.png);\
		background-size:26px 27px;\
		}\
		\
		#ButtonRecord:hover{\
		opacity:1;\
		}\
		\
		#ButtonRecord:active{\
		background-image:url(images/control/Buttons/press/png/Record.png);\
		}\
		\
		/*--- Botão Pause ---*/\
		#ButtonPause{\
		position: absolute;\
		width: 15.2px;\
		height: 24.8px;\
		top: 54.5px;\
		left: 59.2px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Pause.png);\
		background-size:15.2px 24.8px;\
		}\
		\
		#ButtonPause:hover{\
		opacity:1;\
		}\
		\
		#ButtonPause:active{\
		background-image:url(images/control/Buttons/press/png/Pause.png);\
		}\
		\
		/*--- Botão Stop ---*/\
		#ButtonStop{\
		position: absolute;\
		width: 25px;\
		height: 27.1px;\
		top: 52.2px;\
		left: 93px;\
		cursor: pointer;\
		opacity:0;\
		background-image:url(images/control/Buttons/hover/png/Stop.png);\
		background-size:25px 27.1px;\
		}\
		\
		#ButtonStop:hover{\
		opacity:1;\
		}\
		\
		#ButtonStop:active{\
		background-image:url(images/control/Buttons/press/png/Stop.png);\
		}"

		$('<style>').text(style).appendTo('head');


	//Ao criar um objeto Controle todas as áreas e botões serão criados...
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
		<img src='images/control/logo.png' width='100%' height='100%' />\
		</div>\
		<div id='areaSpace8'>\
		</div>";

	//... porém iniciarão todos escondidos:
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

	//e finalmente haverá o tratamento correto para inicialização das áreas:	
	this.setAreas();					

	//Pressionando o botão quando hover (Chamada da Função apropriada para o botão)
	var imgButtons = ['STart', 'Stop', 'Pause', 'Eject', 'Power', 'Key_1', 'Key_2', 'Key_3', 'Key_4', 'Key_5', 'Key_6', 'Key_7', 'Key_8', 'Key_9', 'Key_Hash', 'Key_0', 'Key_Star', 'Volume_Up', 'Channel_Up', 'Volume_Down', 'Channel_Down', 'Menu', 'Mute', 'Help', 'Info','Guide', 'Exit', 'Back', 'Enter', 'Cursor_Up', 'Cursor_Down', 'Cursor_Left', 'Cursor_Right', 'Red', 'Green', 'Yellow', 'Blue', 'Rewind', 'Play', 'Forward', 'Pause', 'Record', 'Stop'];

	for(button in imgButtons){		
		eval("$('#Button' + imgButtons[button]).click($.proxy(function(){"+
				"this.functionButton('"+ imgButtons[button].toUpperCase() + "');" +		
				"},this));"
		);
	}

}			

//Habilita as áreas pré-definidas pelo criador do controle:
RemoteControl.prototype.setAreas = function(){
	var areas = ['PowerEject', 'Numbers', 'VolumeChannel', 'Interactive', 'Colorful', 'Multimedia'];

	for (area in areas){				
		if(this['p_area'+areas[area]])
			this['setArea'+areas[area]]();
	}
}

//Chamada da função específica de cada botão			
RemoteControl.prototype.functionButton = function(b){
	console.log(b);
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

//Para habilitar/desabilitar as áreas
var areas = ['PowerEject', 'Numbers', 'VolumeChannel', 'Interactive', 'Colorful', 'Multimedia'];

for(area in areas){
	eval("RemoteControl.prototype['setArea" +areas[area]+ "'] = function(){"+
			//sinaliza a flag de controle da área
			"this['control" +areas[area]+ "'] = !(this['control" +areas[area]+ "']);"+

			//a área sempre será visualizada juntamente com o seu espaçamento acima
			"$('#areaSpace"+(area+1)+"').toggle();"+
			"$('#area" +areas[area]+ "').toggle();"+

			//o último espaçamento e os logos serão visíveis enquanto qualquer outra área for visível:
			"if((this.controlPowerEject)||(this.controlNumbers)||(this.controlVolumeChannel)||(this.controlInteractive)||(this.controlColorful)||(this.controlMultimedia)){"+
			"$('#areaSpace7').show();"+
			"$('#areaLogo').show();"+
			"$('#areaSpace8').show();"+
			"}"+
			"else{ "+
			"$('#areaSpace7').hide();"+
			"$('#areaLogo').hide();"+
			"$('#areaSpace8').hide();"+
			"}"+			
	"}");
}