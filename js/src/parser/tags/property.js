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

Parser.prototype.parseProperty = function (obj,tag,parent,tree) {
	// explicitDur
	values = ["(número real)s","HH:MM:SS"];
	patt1 = /^(\d+|\d*\.\d+)s$/;
	patt2 = /^\d+:\d+:\d+(\.\d+)?$/;
	// format: 0=invalid, 1='real number', 2='HH:MM:SS', 4=''
	var format;
    
    //get rids of whitespace
    obj.value =  obj.value.replace(/\s/g, '');
     

    if(obj.value.length == 0)
        format = 4;
    else
        format = patt1.test(obj.value) ? 1 : (patt2.test(obj.value) ? 2 : 0);

	if (format == 0) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["value",obj.value,values]);
	} else {
        switch(format)
        {
            case 1:
			    // removes the 's' from the end of the string
			    obj.value = parseFloat(obj.value.split('s')[0]);
            break;

            case 2:
                 // calculates the number of seconds from the 'HH:MM:SS' format
			    var arr = obj.value.split(':');
			    var h = parseFloat(arr[0]);
			    var m = parseFloat(arr[1]);
			    var s = parseFloat(arr[2]);
			    if (m>=60 || s>=60) { // ncl handbook also says that hours must be in [0,23] interval, but it's not necessary
				    Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["value",obj.value,values]);
			    } else {
				    obj.value = parseFloat(h)*3600 + parseFloat(m)*60 + parseFloat(s);
			    }
            break;

        }

	}
};
