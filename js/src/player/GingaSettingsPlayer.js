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
 * @fileoverview Define GingaSettingsPlayer class. [WIP]
 */

/**
 * Player used for handle system properties node.
 * @constructor
 */
function GingaSettingsPlayer(p) {
    this.p = p;
    this.htmlPlayer = "#" + p.id;
    this.flowPlayer = undefined;
    
	p.createElement("<div class='player' id='" + p.id + "'></div>");	
	
	p.onChangeProperty = {};
	p.onChangeProperty.defaultAction = Player.propertyAction.OVERRIDE;
	p.onChangeProperty.propertyMap = {};
};

/**
 * setProperty
 */
GingaSettingsPlayer.prototype.setProperty = function(name, value) {
	switch(name) {
		case "service.currentFocus":
		case "service.currentKeyMaster":
		case "default.focusBorderColor":
		case "default.selBorderColor":
		case "default.focusBorderWidth":
		case "default.focusBorderTransparency": 
			this.p.systemSettings.setPropertyValue(name,value);
		default:
	}
	
	$(this.htmlPlayer).trigger("attribution.onEndAttribution",[name]);
}
