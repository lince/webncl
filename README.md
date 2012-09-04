# INTRODUCTION

**WebNCL** is a NCL (_Nested Context Language_) presentation machine developed on top of Web technologies stack (HTML5/JavaScript/CSS). It allows the execution of NCL Documents in any device which has a HTML5-compatible browser, such as PC, Tablets, Smartphones and Smart TVs.

You can download a pre-compiled version of the WebNCL code [here](https://github.com/downloads/lince/webncl/webncl.min.js).

- For WebNCL's demos visit: [http://webncl.org](http://webncl.org)
- For more information about the NCL language visit: [http://www.ncl.org.br](http://www.ncl.org.br)

# DEPENDENCIES
***
 - [popcorn.js](http://popcornjs.org) > 1.1.2
 - [jquery](http://jquery.org) > 1.7.1
 - [lua.js](https://github.com/mherkender/lua.js/commits/master) _(optional)_
 - [amq.js](http://activemq.apache.org/ajax.html) and [amd_jquery_adapter](http://activemq.apache.org/ajax.html) _(optional)_

# BUILD WEBNCL
***
To build the minified version of the code, you will need the [closure compiler](http://code.google.com/p/closure-compiler/) and a java-vm.

After you get the closure, just do (Linux/Mac):

```
$ make CLOSURE_COMPILER=/path/to/closure/compiler.jar
```

# USING WEBNCL
***
## Embedding NCL documents
To embed the NCL document into a web-page, see the _sample.html_, _sample-dev.html_ or _sample-min.html_. To use the virtual remove control, see the _sample-control.html_.

See the [WebNCL API](webncl/wiki/api) page for more details.

## Running Examples
Because of the [Same Origin Policy](http://www.w3.org/Security/webncl/wiki/Same_Origin_Policy) present in many modern browsers, it may be necessary to have a local web-server to execute NCL documents locally.

Any web server will work; for instance, you can run Python's built-in server:

```
$ python -m SimpleHTTPServer 8888 &
```
Once the server is running, go to http://localhost:8888/ and select _sample.html_ (or other samples)

# Compatibility Issues
***

## Audio/Video
Given that the different browsers can support different audio/video formats, **WebNCL** implements a alternative media source format mechanism. If your NCL uses a video file named _"video1.mp4"_, the WebNCL will try to use _"video1".webm_ and _"video1".ogg_ if the browser does not support h264 videos. The same goes for audio ('mp3' and 'ogg' formats).

It is a good practice to add a version of audio/video files for each different format if you wish your NCL can be present in all compatible browsers.

## Support NCL Documents

Not all the NCL tags are implemented. Also, there is some functionalities that works only for some browsers. For a discussion of compatibility with NCL documents, see the [Compatibily Issues](webncl/wiki/Compatibily-Issues) page.

## Running Lua Scripts

To run lua scripts it may necessary to preload images used by the canvas API. Also, some Lua constructions are not fully supported by the WebNCL. For a discussion about running Lua Scripts and NCLua API. see the [Lua Compatibily](webncl/wiki/Lua-Compatibily) page.

# CHANGE LOG
***
## v0.3 - Outlandish
 - Support for _player_ property and other player selection mechanisms
 - Added textual anchors support
 - Added spacial anchors support for images
 - Temporal anchors now support _hh:mm:ss_ format
 - Media synchronization mechanism enhanced 
 - Contexts now detect natural ends, resumes and pauses
 - NCL settings node management enhanced
 - Lua API (_event_, _canvas_, _persistent_) fully implemented
 - Remove Control now is integrated with the project
 - Images now are defined in the CSS for a better integration with dynamic pages
 - New examples added
 - Several bugs related to media management fixed

For older versions see the [changelog](webncl/wiki/changelog) page.

# DEVELOPMENT
***
You can use the [issues](https://github.com/lince/webncl/issues) to report bugs or to ask questions to the developers.

To develop new players, see the [Media Page Interface](https://github.com/lince/webncl/webncl/wiki/Media-Players-interface) page.