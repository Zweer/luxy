(function exampleCode() {
	"use strict";

	var example	= brfv4.example;
	var dom		= example.dom;
	var d3d		= example.drawing3d;

	var numFacesToTrack = 2;

	function loadModels() {
		if(d3d) {

			// Remove all models and load new ones.

			d3d.removeAll();
			d3d.loadOcclusionHead("assets/occlusion_head.json", numFacesToTrack);
			d3d.loadModel("assets/model.json", numFacesToTrack);
		}
	}

	example.initCurrentExample = function(brfManager, resolution) {
		brfManager.init(resolution, resolution, example.appId);
		brfManager.setNumFacesToTrack(numFacesToTrack);
		loadModels();
	};

	example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		if(d3d) d3d.hideAll(); // Hide 3d models. Only show them on top of tracked faces.

		draw.clear();

		var faces = brfManager.getFaces();

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			if(face.state == brfv4.BRFState.FACE_TRACKING) {

				// Draw the 68 facial feature points as reference.

				draw.drawTrianglesAsPoints(face.vertices, 2.0, false, 0x00a0ff, 0.4);

				// Set the 3D model according to the tracked results.

				if(d3d) d3d.update(i, face, true);
			}
		}

		if(d3d) { d3d.render(); }
	};

	dom.updateCodeSnippet(exampleCode + "");

	dom.updateHeadline("BRFv4 - advanced - face_tracking - ThreeJS example.\n" +
		"Tracks up to " + numFacesToTrack + " faces and puts glasses on them.");

})();