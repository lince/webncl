// @depends PxLoader.js
/**
 * PxLoader plugin to load images
 */

function PxLoaderFont(alias, url, tags, priority) {
    var self = this,
        loader = null;

	this.alias = alias;
	this.url= url;
    this.tags = tags;
    this.priority = priority;



    var onLoad = function() {

    };

    var onError = function() {

    };


    this.start = function(pxLoader) {
        
        loader = pxLoader;

     	var styleCss = "@font-face{" + 
		"font-family: '"+ this.alias + "';" + 
		"src: url('"+ this.url +"');}";
	
		$('<style>').text(styleCss).appendTo('head');
		
		var result = $.ajax({
		type : "GET",
		url : this.url,
		async : false,
		});
		
		
		$('body').append('<div class = "font_' + this.alias + '"  style="visibility:hidden"><h1>.</h1><div></div>');
		
		var h1 = ".font_" + this.alias + " { font-family: '" + this.alias + "'; }";
		$('<style>').text(h1).appendTo('head');
    };

    // called by PxLoader to check status of image (fallback in case
    // the event listeners are not triggered).
    this.checkStatus = function() {
		loader.onLoad(self);
    };

    // called by PxLoader when it is no longer waiting
    this.onTimeout = function() {

    };

    // returns a name for the resource that can be used in logging
    this.getName = function() {
        return url;
    };


}

// add a convenience method to PxLoader for adding an image
PxLoader.prototype.addFont = function(alias, url, tags, priority) {
    var imageLoader = new PxLoaderFont(alias, url, tags, priority);
    this.add(imageLoader);

    // return the img element to the caller
    return imageLoader.img;
};