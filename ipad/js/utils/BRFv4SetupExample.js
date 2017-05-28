// BRF example handling:
//
// We need one instance of BRFManager. This instance is reuseable.

(function() {
	"use strict";

	var example		= brfv4.example;
	var imageData	= example.imageData;
	var dom			= example.dom;
	var stats		= example.stats;
	var drawing		= example.drawing;
	var d3d			= example.drawing3d;

	var trace		= brfv4.trace;

	var brfManager	= null;
	var resolution	= null;

	var paused		= true;

	if(drawing.setup && !drawing.stage) {
		drawing.setup(dom.getElement("_drawing"), dom.getElement("_faceSub"), 30);
	}

	if(d3d.setup && !d3d.stage) {
		d3d.setup(dom.getElement("_threejs"));
	}

	if(stats.init) {
		stats.init(30);
	}

	example.reinit = function() {
		example.init(imageData.type());
	};

	imageData.onAvailable = function(width, height) {
		trace("imageData.onAvailable: " + width + "x" + height);

		dom.updateLayout(width, height);
		resolution.setTo(0, 0, width, height);
		drawing.updateLayout(width, height);
		if(d3d) d3d.updateLayout(width, height);

		example.reinit();
	};

	example.waitForSDK = function(callback) {

		if(brfv4.sdkReady) {

			trace("waitForSDK: done.");
			callback();

		} else {

			trace("waitForSDK: still waiting.");
			clearTimeout(example.waitForSDK_timeout);
			example.waitForSDK_timeout = setTimeout(function(){
				example.waitForSDK();
			}, 100, callback);
		}
	};

	example.init = function(type) {

		paused = true;

		if(imageData.type && type != imageData.type() && imageData.isAvailable()) {
			drawing.setUpdateCallback(null);
			trace("imageData.dispose: " + imageData.type());
			imageData.dispose();
		}

		trace("init: type: " + type);

		if(!brfv4.sdkReady) {

			example.waitForSDK(example.init);

		} else {

			trace("-> brfv4.sdkReady: " + brfv4.sdkReady);

			if(!initReferences()) {
				trace("Init failed!", true);
				return;
			}

			if(type == "picture") {	// Start either using an image ...

				imageData.picture.setup(
					dom.getElement("_imageData"),
					imageData.onAvailable
				);

			} else {				// ... or start using the webcam.

				imageData.webcam.setup(
					dom.getElement("_webcam"),
					dom.getElement("_imageData"),
					resolution,
					imageData.onAvailable
				);
			}

			trace("-> imageData.isAvailable (" +
				imageData.type() + "): " + imageData.isAvailable());

			if(imageData.isAvailable()) {

				setupBRFExample();

			} else {

				resolution.setTo(0, 0, 640, 480); // reset for webcam initialization
				imageData.init();
			}
		}
	};

	function initReferences() {

		if(brfv4.BRFManager && !brfManager) {
			brfManager	= new brfv4.BRFManager();
		}

		if(brfv4.Rectangle && !resolution) {
			resolution	= new brfv4.Rectangle(0, 0, 640, 480);
		}

		return (brfManager != null && resolution != null);
	}

	function resetBRFExample() {

		// reset some parameters to their default
		// to reduce the setup code in the examples.

		brfManager.setMode(brfv4.BRFMode.FACE_TRACKING);
		brfManager.setNumFacesToTrack(1);
		brfManager.setFaceDetectionParams(
			resolution.height * 0.30, resolution.height * 0.90, 12, 8);
		brfManager.setFaceTrackingStartParams(
			resolution.height * 0.30, resolution.height * 0.90, 40, 40, 30);
		brfManager.setFaceTrackingResetParams(
			resolution.height * 0.25, resolution.height * 0.95, 45, 50, 32);

		drawing.clickArea.mouseEnabled = false;
		drawing.imageContainer.removeAllChildren();
		if(d3d) d3d.hideAll();
	}

	function setupBRFExample() {

		resetBRFExample();

		example.initCurrentExample(brfManager, resolution, drawing);
		paused = false;

		if(imageData.isStream()) {

			drawing.setUpdateCallback(updateBRFExample);

		} else {
			for(var i = 0; i < 10; i++) {
				updateBRFExample();
			}
		}
	}

	function updateBRFExample() {

		if(!paused) {

			if (stats.start) stats.start();

			var imageDataCanvas	= dom.getElement("_imageData");

			imageData.update();				// depends on whether it is a webcam or image setup

			example.updateCurrentExample(	// depends on the chosen example
				brfManager,
				imageDataCanvas.getContext("2d").getImageData(0, 0, resolution.width, resolution.height).data,
				drawing
			);

			if (stats.end) stats.end();
		}
	}
})();