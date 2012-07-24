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

var Logger = {

	// Warnings
	WARN_INVALID_ATTR:					100,	// Atributo inválido
	WARN_INVALID_TAG:						101,	// Tag inválida
	WARN_INVALID_HEAD_STRUCTURE:		102,	// Estrutura do cabeçalho inválida
	WARN_INVALID_REGION_DIMENSIONS:	103,	// Dimensões de região inválidas
	WARN_DUPLICATED_ZINDEX:				104,	// zIndex duplicado
	WARN_INVALID_AREA:					105,		// Area invalida
	WARN_NOT_IMPLEMENTED_YET:			106,	// Recurso não implementado ainda
	
	// Errors
	ERR_MISSING_ATTR:						201,	// Atributo obrigatório faltando
	ERR_MISSING_ATTR_ONEOF:				202,	// Atributo obrigatório faltando (um desses)
	ERR_MISSING_ATTR_DEP:				203,	// Atributo dependente faltando
	ERR_TOO_MANY_ATTRS:					204,	// Excesso de atributos repetidos
	ERR_MISSING_TAG:						205,	// Tag obrigatória faltando (+,1)
	ERR_MISSING_TAG_ONEOF:				206,	// Tag obrigatória faltando (|+,|1)
	ERR_TOO_MANY_TAGS:					207,	// Excesso de tags repetidas (?,1)
	ERR_TOO_MANY_TAGS_ONEOF:			208,	// Excesso de tags (apenas uma permitida)
	ERR_INVALID_ATTR_VALUE:				209,	// Valor de atributo inválido
	ERR_INVALID_ID_REFERENCE:			210,	// Referência a um ID inválido
	ERR_DUPLICATED_ID:					211,	// ID duplicado
	ERR_INCOMPATIBLE_FILE_EXT:			212,	// Extensão de arquivo incompatível com o MIMETYPE
	ERR_INVALID_URI:						213,	// URI inválida
	ERR_DUPLICATED_ATTR:					214,	// Atributo duplicado
	ERR_DUPLICATED_ALIAS:				215,	// Alias duplicado
	ERR_INVALID_CONTEXT_REFERENCE:	216,	// Objeto referenciado em outro contexto
	
        ERR_MEDIAPLAYER_METHOD_NOTFOUND: 301,               // User defined media player has not a necessary method
        ERR_MEDIAPLAYER_NOPLAYER: 302,                      // No player was defined for current mime type or file extension
        
	MESSAGES: {
		100: "Atributo inválido",
		101: "Tag inválida",
		102: "Estrutura do cabeçalho inválida",
		103: "Dimensões de região inválidas",
		104: "zIndex duplicado",
		105: "Areaa invalida",
		106: "Recurso não implementado ainda",
                
		201: "Atributo obrigatório faltando",
		202: "Atributo obrigatório faltando (um desses)",
		203: "Atributo dependente faltando",
		204: "Excesso de atributos repetidos",
		205: "Tag obrigatória faltando",
		206: "Tag obrigatória faltando (uma dessas)",
		207: "Excesso de tags repetidas",
		208: "Excesso de tags (apenas uma permitida)",
		209: "Valor de atributo inválido",
		210: "Referência a ID inválido",
		211: "ID duplicado",
		212: "Extensão de arquivo incompatível com o MIMETYPE",
		213: "URI inválida",
		214: "Atributo duplicado",
		215: "Alias duplicado",
		216: "Objeto referenciado em outro contexto",
                
                301: "Método não encontrado no media player",
                302: "Nenhum player foi definido para este mime type/extensão"
	},
	
	abort: false,
	
	error: function (id, tag, params) {
		// Error
		console.error("[" + id + "] " + this.MESSAGES[id] + "\n" + tag + ": " + params.join(","));
		this.abort = true;
	},
	
	warning: function (id, tag, params) {
		// Warning
		console.warn("[" + id + "] " + this.MESSAGES[id] + "\n" + tag + ": " + params.join(","));
	}
	
};
