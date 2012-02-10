function NclPlayer (file, div) {

	this.presentation = {
		TIME_LIMIT: 1000,
		playerId: ++NclPlayer.playerCount,
		playerDiv: div,
		getDivId: function (nodeId, type) {
			return "ncl" + this.playerId + (type||"") + "_" + nodeId;
		}
	};
	this.presentation.bodyDiv = "body" + this.presentation.playerId;
	this.presentation.settingsDiv = "settings" + this.presentation.playerId;
	this.presentation.contextsDiv = "contexts" + this.presentation.playerId;
	
	$.ajax({
		type: "GET",
		url: file,
		dataType: "xml",
		success: $.proxy(function (data) {
			// TODO: checar a sintaxe do arquivo XML
			//Debugger.checkFile(file); ???
			this.execute(data);
		},this)
		// TODO: checar se o arquivo XML foi aberto com sucesso
	});
	
};

// execute
NclPlayer.prototype.execute = function (data) {
	// cria o objeto NCL
	this.presentation.ncl = Parser.parse(data);
	this.presentation.focusManager = new FocusManager(this.presentation);
	this.presentation.systemSettings = new SystemSettings(this.presentation);
	// cálculo da posição real de cada região
	for (rb in this.presentation.ncl.head.regionBase) {
		for (i in this.presentation.ncl.head.regionBase[rb].region) {
			var bounds = {
				left: 0,
				top: 0,
				width: parseInt($("#"+this.presentation.playerDiv).css("width").split("px")[0]),
				height: parseInt($("#"+this.presentation.playerDiv).css("height").split("px")[0])
			};
			this.fixRegionBounds(this.presentation.ncl.head.regionBase[rb].region[i],bounds);
		}
	}
	// cria as divs iniciais
	$("#"+this.presentation.playerDiv).append("<div id='" + this.presentation.settingsDiv + "'></div>");
	$("#"+this.presentation.playerDiv).append("<div id='" + this.presentation.contextsDiv + "'></div>");
	// cria o primeiro contexto (body)
	new ContextPlayer(this.presentation.ncl.body,this.presentation).start();
};

// fixRegionBounds
NclPlayer.prototype.fixRegionBounds = function (node, parentBounds) {

	var relativeBounds = {
		left: node.left || null,
		right: node.right || null,
		top: node.top || null,
		bottom: node.bottom || null,
		width: node.width || null,
		height: node.height || null
	};

	var absoluteBounds = {
		left: 0,
		top: 0,
		width: 0,
		height: 0
	};

	// Converte px em valor númerico
	for (i in relativeBounds) {
		if (relativeBounds[i] != null) {
			relativeBounds[i] = parseInt(relativeBounds[i].split("px")[0]);
		}
	}
	
	// Converte % em valor numérico
	var attrs, buffer;
	// left, right, width
	attrs = ["left","right","width"];
	for (i in attrs) {
		if (relativeBounds[attrs[i]]!=null && isNaN(relativeBounds[attrs[i]])) {
			buffer = relativeBounds[attrs[i]].split("%");
			if (buffer.length > 1) {
				relativeBounds[attrs[i]] = parseInt(parentBounds.width*parseFloat(buffer[0])/100);
			}
		}
	}
	// top, bottom, height
	attrs = ["top","bottom","height"];
	for (i in attrs) {
		if (relativeBounds[attrs[i]]!=null && isNaN(relativeBounds[attrs[i]])) {
			buffer = relativeBounds[attrs[i]].split("%");
			if (buffer.length > 1) {
				relativeBounds[attrs[i]] = parseInt(parentBounds.height*parseInt(buffer[0])/100);
			}
		}
	}
	
	// Calcula left e width de acordo com os atributos left/right/width
	if (relativeBounds.left != null) {
		if (relativeBounds.right != null) {
			if (relativeBounds.width != null) {
				// left, right, width -> nothing
			} else {
				// left, right -> width calculado
				relativeBounds.width = parentBounds.width - relativeBounds.left - relativeBounds.right;
			}
		} else if (relativeBounds.width != null) {
			// left, width -> nothing
		} else {
			// left -> width herdado
			relativeBounds.width = parentBounds.width;
		}
	} else if (relativeBounds.width != null) {
		if (relativeBounds.right != null) {
			// right, width -> left calculado
			relativeBounds.left = parentBounds.width - relativeBounds.right - relativeBounds.width;
		} else {
			// width -> left zero
			relativeBounds.left = 0;
		}
	} else if (relativeBounds.right != null) {
		// right -> left 0, width calculado
		relativeBounds.left = 0;
		relativeBounds.width = parentBounds.width - relativeBounds.right;
	} else {
		// nada -> left 0, width herdado
		relativeBounds.left = 0;
		relativeBounds.width = parentBounds.width;
	}
	
	// Calcula top e bottom de acordo com os atributos top/bottom/height
	if (relativeBounds.top != null) {
		if (relativeBounds.bottom != null) {
			if (relativeBounds.height != null) {
				// top, bottom, height -> nothing
			} else {
				// top, bottom -> height calculado
				relativeBounds.height = parentBounds.height - relativeBounds.top - relativeBounds.bottom;
			}
		} else if (relativeBounds.height != null) {
			// top, height -> nothing
		} else {
			// top -> height herdado
			relativeBounds.height = parentBounds.height;
		}
	} else if (relativeBounds.height != null) {
		if (relativeBounds.bottom != null) {
			// bottom, height -> top calculado
			relativeBounds.top = parentBounds.height - relativeBounds.bottom - relativeBounds.height;
		} else {
			// height -> top zero
			relativeBounds.top = 0;
		}
	} else if (relativeBounds.bottom != null) {
		// bottom -> top 0, height calculado
		relativeBounds.top = 0;
		relativeBounds.height = parentBounds.height - relativeBounds.bottom;
	} else {
		// nada -> top 0, height herdado
		relativeBounds.top = 0;
		relativeBounds.height = parentBounds.height;
	}
	
	// Calcula os valores absolutos
	absoluteBounds.left = parentBounds.left + relativeBounds.left;
	absoluteBounds.top = parentBounds.top + relativeBounds.top;
	absoluteBounds.width = relativeBounds.width;
	absoluteBounds.height = relativeBounds.height;
	
	// Salva os valores calculados na própria região
	node.left = absoluteBounds.left + "px";
	node.top = absoluteBounds.top + "px";
	node.width = absoluteBounds.width + "px";
	node.height = absoluteBounds.height + "px";
	node.right = null;
	node.bottom = null;
	
	// Calcula as posições absolutas das regiões filhas
	for (i in node.region) {
		this.fixRegionBounds(node.region[i],absoluteBounds);
	}
	
};

NclPlayer.prototype.triggerEvent = function (event,nodeId,nodeInterface) {
	$("#"+this.presentation.getDivId(nodeId)).trigger(event,[nodeInterface]);
};

NclPlayer.playerCount = 0;