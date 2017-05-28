(function exampleCode() {
	"use strict";

	var example	= brfv4.example; // references to example relevant objects.
	var dom		= example.dom;   // ... e.g. the DOM handling.

	example.initCurrentExample = function(brfManager, resolution, draw) {

		brfManager.init(resolution, resolution, example.appId);

		// Load all image masks for quick switching.

		draw.imageContainer.removeAllChildren();
		draw.imageContainer.addChild(_baseNode);

		var i = 0;
		var l = _imageURLs.length;

		for(; i < l; i++) {
			_images[i] = new createjs.Bitmap(_imageURLs[i]);

			if(i == 0) {
				_image = _images[i];
				_image.image.onload = function() {
					changeImage(_image);
				}
			}
		}

		// Add a click event to cycle through the image overlays.

		draw.clickArea.addEventListener("click", onClicked);
		draw.clickArea.mouseEnabled = true;
	};

	example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		draw.clear();

		// Face detection results: a rough rectangle used to start the face tracking.

		draw.drawRects(brfManager.getAllDetectedFaces(),    false, 1.0, 0x00a1ff, 0.5);
		draw.drawRects(brfManager.getMergedDetectedFaces(), false, 2.0, 0xffd200, 1.0);

		// Get all faces. The default setup only tracks one face.

		var faces = brfManager.getFaces();

		// If no face was tracked: hide the image overlays.

		var showBaseNode = false;

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			if(	face.state == brfv4.BRFState.FACE_TRACKING_START ||
					face.state == brfv4.BRFState.FACE_TRACKING) {

				// Face Tracking results: 68 facial feature points.

				draw.drawTriangles(face.vertices, face.triangles, false, 1.0, 0x00a0ff, 0.4, 0, 0);
				draw.drawTrianglesAsPoints(face.vertices, 2.0, false, 0x00a0ff, 0.4);

				// Set position to be nose top and calculate rotation.

				_position.x		= face.points[27].x;
				_position.y		= face.points[27].y;

				var leftEye		= face.points[36];
				var rightEye	= face.points[45];

				var dist		= calcDistance(leftEye, rightEye);
				var rot			= toDegree(calcAngle(leftEye, rightEye));
				var scale		= (dist * 0.0026);

				_baseNode.rotation = 0;
				_baseNode.x = _position.x;
				_baseNode.y = _position.y;
				_baseNode.rotation = rot;

				_baseNode.scaleX = scale * (1 - toDegree(Math.abs(face.rotationY)) / 150.0);
				_baseNode.scaleY = scale * (1 - toDegree(Math.abs(face.rotationX)) / 100.0);
				_baseNode.alpha = 1.0;

				showBaseNode = true;
			}
		}

		if(!showBaseNode) {
			_baseNode.alpha = 0.0;
		}
	};

	function onClicked(event) {
		var i = _images.indexOf(_image) + 1;

		if(i == _images.length) {
			i = 0;
		}

		_image = _images[i];
		changeImage(_image, i);
	}

	function changeImage(bitmap, index) {

		var imageFactor = 1.0;

		if(index == 0) {
			imageFactor = 1.0;
		} else if(index == 1) {
			imageFactor = 3.3;
		}

		bitmap.scaleX = imageFactor;
		bitmap.scaleY = imageFactor;

		bitmap.x = -parseInt(bitmap.getBounds().width  * bitmap.scaleX * 0.50);
		bitmap.y = -parseInt(bitmap.getBounds().height * bitmap.scaleY * 0.45);

		_baseNode.removeAllChildren();
		_baseNode.addChild(bitmap);
	}

	var _imageURLs = [
		"assets/img_glasses.png",
		"assets/lion.png"
	];
	var _images = [];
	var _image = null;
	var _baseNode = new createjs.Container();
	var _position = new brfv4.Point();

	var calcDistance	= brfv4.BRFv4PointUtils.calcDistance;
	var calcAngle		= brfv4.BRFv4PointUtils.calcAngle;
	var toDegree		= brfv4.BRFv4PointUtils.toDegree;

	dom.updateHeadline("BRFv4 - advanced - face tracking - PNG/mask image overlay.\n" +
		"Click to cycle through images.");

	dom.updateCodeSnippet(exampleCode + "");

})();