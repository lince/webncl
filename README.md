# INTRODUCTION

WebNCL is a NCL presentation machine developed on top of Web technologies stack (HTML/JavaScript/CSS)

It allows the execution of NCL Documents in any device which has a HTML5-compatible browser, such as PC, Tablets, Smartphones and Smart TVs.

# DEPENDENCIES
-------------------------------------------------------
## To run
 - popcorn.js (http://popcornjs.org)
 - jquery > 1.7.1 (http://jquery.org)
 
## To build
 - closure compiler (http://code.google.com/p/closure-compiler/)

# USING WEBNCL
-------------------------------------------------------
Write a simple HTML page as 'sample.html' or 'sample-mim.html' to embedded the NCL document.

Because of the Same Origin Policy present in many modern browsers, it may be necessary to use a webserver to execute NCL documents.

WebNCL was tested in the following browsers and devices:
* Chrome
* Firefox
* Opera
* Safari
* iOS devices
* Android devices > 2.3

# BUILD WEBNCL
-------------------------------------------------------
To build the minified version of the code, just do:

`
` $ make CLOSURE_COMPILER=/path/to/closure/compiler.jar
`
