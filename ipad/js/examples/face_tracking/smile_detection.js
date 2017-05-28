(function exampleCode() {
	"use strict";

	var example	= brfv4.example; // references to example relevant objects.
	var dom		= example.dom;   // ... e.g. the DOM handling.

	example.initCurrentExample = function(brfManager, resolution) {
		brfManager.init(resolution, resolution, example.appId);
	};

	example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		draw.clear();

		// Face detection results: a rough rectangle used to start the face tracking.

		draw.drawRects(brfManager.getAllDetectedFaces(),    false, 1.0, 0x00a1ff, 0.5);
		draw.drawRects(brfManager.getMergedDetectedFaces(), false, 2.0, 0xffd200, 1.0);

		var faces = brfManager.getFaces(); // default: one face, only one element in that array.

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			if(	face.state == brfv4.BRFState.FACE_TRACKING_START ||
					face.state == brfv4.BRFState.FACE_TRACKING) {

				// Smile Detection

				setPoint(face.vertices, 48, p0); // mouth corner left
				setPoint(face.vertices, 54, p1); // mouth corner right

				var mouthWidth = calcDistance(p0, p1);

				setPoint(face.vertices, 39, p1); // left eye inner corner
				setPoint(face.vertices, 42, p0); // right eye outer corner

				var eyeDist = calcDistance(p0, p1);
				var smileFactor = mouthWidth / eyeDist;

				smileFactor -= 1.45; // 1.45 - neutral, 1.70 smiling

				if(smileFactor > 0.25) smileFactor = 0.25;
				if(smileFactor < 0.00) smileFactor = 0.00;

				smileFactor *= 4.0;

				if(smileFactor < 0.0) { smileFactor = 0.0; }
				if(smileFactor > 1.0) { smileFactor = 1.0; }

				var color =
					(((0xff * (1.0 - smileFactor) & 0xff) << 16)) +
					(((0xff * smileFactor) & 0xff) << 8);

				// Face Tracking results: 68 facial feature points.

				draw.drawTriangles(face.vertices, face.triangles, false, 1.0, color, 0.4, 0, 0);
				draw.drawTrianglesAsPoints(face.vertices, 2.0, false, color, 0.4);

				dom.updateHeadline("BRFv4 - intermediate - face tracking - simple smile detection.\n" +
					"Detects how much someone is smiling. smile factor: " +
					(smileFactor * 100).toFixed(0) + "%");
			}
		}
	};

	var p0				= new brfv4.Point();
	var p1				= new brfv4.Point();

	var setPoint		= brfv4.BRFv4PointUtils.setPoint;
	var calcDistance	= brfv4.BRFv4PointUtils.calcDistance;

	dom.updateHeadline("BRFv4 - intermediate - face tracking - simple smile detection.\n" +
		"Detects how much someone is smiling.");

	dom.updateCodeSnippet(exampleCode + "");

})();