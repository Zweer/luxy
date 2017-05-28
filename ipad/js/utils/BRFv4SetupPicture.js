// image handling:
//
// QuickSettings image chooser panel.
// First image in list is picked automatically.
//
// imageData handling using images:
//
// setupImage(imageDataCanvas, onImageDataReady) // canvas, callback

(function(){
	"use strict";

	var urlMap = {
		"Marcel":		"assets/brf_example_image_marcel.jpg",
		"Chris":		"assets/brf_example_image_chris.jpg",
		"Two Faces":	"assets/two_faces.jpg"
	};
	var labels = [];
	for (var key in urlMap) { labels.push(key); } // Fill in the labels.

	var example		= brfv4.example;
	var dom			= example.dom;
	var imageData	= example.imageData;
	var gui			= example.gui;

	var picture		= imageData.picture;

	var _picture	= null;
	var _loader 	= null;
	var _onImageDataReady = null;

	picture.onImageLoaded = function(event) {
		_picture = event.result;

		if(_onImageDataReady) {
			_onImageDataReady(_picture.width, _picture.height);
		}
	};

	picture.onImageLoadError = function(event) {
		brfv4.trace("Error loading image.", true);
	};

	picture.loadImage = function(url) {

		if(!url) return;

		_loader = new createjs.LoadQueue(true);
		_loader.on("fileload", picture.onImageLoaded);
		_loader.on("error", picture.onImageLoadError);
		_loader.loadFile(url);
	};

	picture.setup = function(imageDataCanvas, onImageDataReady) {

		if(!imageDataCanvas) {
			brfv4.trace("Please add a <canvas> tag with id='_imageData' to the DOM.", true);
			return;
		}

		_onImageDataReady = onImageDataReady;

		imageData.type = function() {
			return "picture";
		};

		imageData.init = function() {
			if(labels.length > 0) {
				picture.loadImage(urlMap[labels[0]]);

				if(gui.pictureChooser) {
					gui.pictureChooser.show();
				}
			}
		};

		imageData.dispose = function() {
			_picture = null;
			if(gui.pictureChooser) {
				gui.pictureChooser.hide();
			}
		};

		imageData.isAvailable = function() {
			return _picture != null;
		};

		imageData.isStream = function() {
			return false;
		};

		imageData.update = function() {
			if(_picture != null) {
				var _imageDataCtx = imageDataCanvas.getContext("2d");
				_imageDataCtx.drawImage(_picture, 0, 0, _picture.width, _picture.height);
			}
		};
	};

	if(typeof QuickSettings === "undefined") return;

	function onImageChosen(data) {
		picture.loadImage(urlMap[data.value]);
	}

	if(!gui.pictureChooser) {

		QuickSettings.useExtStyleSheet();

		gui.pictureChooser = QuickSettings.create(
			7, 355, "Picture Chooser", dom.createDiv("_settingsLeft"))
			.setWidth(200)
			.addHTML("Choose a picture from the list", "")
			.addDropDown("_picture", labels, onImageChosen)
			.hideTitle("_picture")
			.hide();
	}
})();