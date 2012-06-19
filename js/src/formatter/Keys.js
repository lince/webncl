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


Keys = {
	allCodes : [13,37,38,39,40,81,87,69,82,96,97,98,99,100,101,102,103,104,105,90,88,67,86,66,78,65,83,68],
	
	CURSOR_UP	    :	38, 	/* arrow up */
	CURSOR_DOWN 	: 	40,		/* arrow down */
	CURSOR_LEFT     :	37,		/* arrow left */
	CURSOR_RIGHT    :	39,		/* arrow right */
	ENTER			:	13,		/* enter */
	RED             :   81,  	/* q */
    GREEN           :   87,		/* w */
    YELLOW          :   69,		/* e */
    BLUE            :   82,		/* r */
    
    KEY_0			:   96,		/* 0 */
    KEY_1			:   97,		/* 1 */
    KEY_2			:   98,		/* 2 */
    KEY_3			:   99,		/* 3 */
    KEY_4			:   100,	/* 4 */
    KEY_5			:   101,	/* 5 */
    KEY_6			:   102,	/* 6 */
    KEY_7			:   103,	/* 7 */
    KEY_8			:   104,	/* 8 */
    KEY_9			:   105,	/* 9 */
    
    BACK			:	90,		/* z */
    EXIT			:	88,		/* x */
    PLAY			:	67,		/* c */
    STOP			:	86,		/* v */
    PAUSE			:	66,		/* b */
    RECORD			:	78,		/* n */
    	
    POWER			:	65,		/* a */
    REWIND			:	83,		/* s */
    EJECT			:	68		/* d */
}


/*
 * TODO
 * 
 *   Conforme a quantidade de codigos uma modificacao importante a ser feita
 * eh gerar allCodes dinamicamente!
 * 
 *  Allow pass the keymap for the player as a parameter
 */
