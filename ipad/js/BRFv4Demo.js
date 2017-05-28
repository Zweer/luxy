
// brfv4 is the (mandatory) namespace for the library.

var brfv4 = {

	// Location/path of emscripten .mem file.
	locateFile: function(fileName) { return "js/lib/brf/" + fileName; },
	memoryInitializerRequest: {
		response: null, status: 200, callback: null, addEventListener: function(type, callback) {
			brfv4.memoryInitializerRequest.callback = callback;
		}
	},

	// Custom way to write to a log/error to console.
	trace: function(msg, error) {
		if(typeof window !== 'undefined' && window.console) {
			var now = (window.performance.now() / 1000).toFixed(3);
			if(error) {	window.console.error(now + ': ', msg); }
			else { window.console.log(now + ': ', msg); }
		}
	},

	// example namespaces for better readability.
	// Different tasks are seperated, so you know what does what.

	example: {

		appId: "com.tastenkunst.brfv4.js.examples", // Choose your own app id. 8 chars minimum.

		loader: {},		// preloading/example loading
		imageData: {	// image data source handling
			webcam: {}, // either webcam ...
			picture: {} // ... or pictures/images
		},
		dom: {},		// html dom stuff
		gui: {},		// QuickSettings elements
		drawing: {},	// drawing the results using createJS
		drawing3d: {},	// all 3D engine functions
		stats: {}		// fps meter
	}
};

// Demo entry point. Preloading all the stuff.

brfv4.example.start = function() {

	brfv4.example.loader.preload([
		{
			id: "memFile", "type":createjs.AbstractLoader.BINARY,
			"src": "js/lib/brf/BRFv4_JS_TK240517_v4.0b31_trial.js.mem"
		},
		"js/lib/brf/BRFv4_JS_TK240517_v4.0b31_trial.js",		// BRFv4 SDK

		"https://webrtc.github.io/adapter/adapter-latest.js",	// Browser webcam polyfill

		"js/lib/quicksettings/quicksettings_tiny.min.css",		// gui elements
		"js/lib/quicksettings/quicksettings.js",

		"css/highlight_tomorrow.css",							// code highlighter
		"js/lib/highlight/highlight.pack.js",

		"js/lib/createjs/easeljs-0.8.2.min.js",					// canvas drawing lib
		"js/lib/threejs/three.js",								// a 3D engine

		"js/utils/BRFv4DOMUtils.js",							// DOM handling
		"js/utils/BRFv4Stats.js",								// FPS meter

		"js/utils/BRFv4DrawingUtils_CreateJS.js",				// BRF result drawing
		"js/utils/BRFv4Drawing3DUtils_ThreeJS.js",				// ThreeJS 3D engine handling

		"js/utils/BRFv4SetupWebcam.js",							// webcam handling
		"js/utils/BRFv4SetupPicture.js",						// picture/image handling
		"js/utils/BRFv4SetupExample.js",						// example setup

		"js/utils/BRFv4PointUtils.js",							// some calculation helpers

		"js/utils/BRFv4SetupChooser.js",						// gui: choose either webcam or picture
		"js/utils/BRFv4ExampleChooser.js",						// gui: choose an example
		"js/utils/BRFv4DownloadChooser.js",						// gui: choose an example to download

		// example to load on startup, others can be chosen via
		// the example chooser GUI.
		"js/examples/face_tracking/track_single_face.js"	// start with this example

	], function() {

		brfv4.example.init("webcam");

	});

};

// loading of javascript files:
//
// preload(filesToLoad, callback) // filesToLoad (array)
// loadExample(filesToLoad, callback) // filesToLoad (array)
// setProgressBar(percent, visible)

(function () {
	"use strict";

	var loader = brfv4.example.loader;

	loader.preload = function (filesToLoad, callback) {

		if (loader.queuePreloader != null || !filesToLoad) {
			return;
		}

		function onFileLoaded(event) {
			var item = event.item;
			var id = item.id;
			var req = brfv4.memoryInitializerRequest;

			if(id == "memFile" && req) {
				req.response = event.result;
				if(req.callback) { req.callback(); }
			}
		}

		function onPreloadProgress(event) {
			loader.setProgressBar(event.loaded, true);
		}

		function onPreloadComplete(event) {
			loader.setProgressBar(1.0, false);
			if(callback) callback();
		}

		var queue = loader.queuePreloader = new createjs.LoadQueue(true);
		queue.on("progress", onPreloadProgress);
		queue.on("complete", onPreloadComplete);
		queue.on("fileload", onFileLoaded);
		queue.loadManifest(filesToLoad, true);
	};

	loader.loadExample = function (filesToLoad, callback) {

		function onProgress(event) {
			loader.setProgressBar(event.loaded, true);
		}

		function onComplete(event) {
			loader.setProgressBar(1.0, false);
			if(callback) callback();
		}

		var queue = loader.queueExamples = new createjs.LoadQueue(true);
		queue.on("progress", onProgress);
		queue.on("complete", onComplete);
		queue.loadManifest(filesToLoad, true);
	};

	loader.setProgressBar = function(percent, visible) {

		var bar = document.getElementById("_progressBar");
		if(!bar) return;

		if(percent < 0.0) percent = 0.0;
		if(percent > 1.0) percent = 1.0;

		var width = Math.round(percent * 640);
		var color = //ffd200
			(((percent * 64 + 128 + 64) & 0xff) << 16) +
			(((percent * 55 + 105 + 50) & 0xff) <<  8); // no blue portion

		bar.style.width = width + "px";
		bar.style.backgroundColor = "#" + color.toString(16);
		bar.style.display = visible ? "block" : "none";
	};
})();