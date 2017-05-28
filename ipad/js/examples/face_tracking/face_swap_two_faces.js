(function exampleCode() {
	"use strict";

	var example	= brfv4.example; // references to example relevant objects.
	var dom		= example.dom;   // ... e.g. the DOM handling.

	// We need two face textures thus create two canvases that will hold the
	// extracted faces.

	var _size = 256; // texture size

	var _extractedFace0 = dom.createCanvas("_extractedFace0", _size, _size, null);
	var _extractedFace1 = dom.createCanvas("_extractedFace1", _size, _size, null);

	var _ctxFace0 = _extractedFace0.getContext("2d");
	var _ctxFace1 = _extractedFace1.getContext("2d");

	// BRF analysis image data.

	var _imageData = dom.getElement("_imageData");
	var _resolution = null;

	example.initCurrentExample = function(brfManager, resolution) {

		_resolution = resolution;

		brfManager.init(resolution, resolution, brfv4.example.appId);
		brfManager.setNumFacesToTrack(2); // two faces
	};

	example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		if(!_resolution || !_imageData) return;

		draw.clear(); // also clears separate _faceSub canvas

		var faces = brfManager.getFaces();

		if(faces.length < 2) {
			return;
		}

		var face0 = faces[0];
		var face1 = faces[1];

		// leave out the inner mouth, remove the last 6 triangles:

		var triangles = face0.triangles.concat();
		triangles.splice(triangles.length - 3 * 6, 3 * 6);

		if(	face0.state == brfv4.BRFState.FACE_TRACKING &&
				face1.state == brfv4.BRFState.FACE_TRACKING) {

			_ctxFace0.clearRect(0, 0, _size, _size);
			_ctxFace1.clearRect(0, 0, _size, _size);

			var uvData0 = prepareFaceTexture(face0, _ctxFace0);
			var uvData1 = prepareFaceTexture(face1, _ctxFace1);

			draw.drawTrianglesTexture(face0.vertices, triangles, uvData1, _extractedFace1);
			draw.drawTrianglesTexture(face1.vertices, triangles, uvData0, _extractedFace0);
		}

		// optional visualize the tracking results as dots.

		if(face0.state == brfv4.BRFState.FACE_TRACKING) {
			draw.drawTrianglesAsPoints(face0.vertices, 2.0, false, 0x00a0ff, 0.4);
		}

		if(face1.state == brfv4.BRFState.FACE_TRACKING) {
			draw.drawTrianglesAsPoints(face1.vertices, 2.0, false, 0x00a0ff, 0.4);
		}
	};

	function prepareFaceTexture(face, ctx) {

		var f = _size / face.bounds.width;

		if (face.bounds.height > face.bounds.width) {
			f = _size / face.bounds.height;
		}

		ctx.drawImage(_imageData,
			-face.bounds.x * f, -face.bounds.y * f,
			_resolution.width * f , _resolution.height * f);

		var uvData = [];

		for(var u = 0; u < face.vertices.length; u += 2) {
			var ux = (((face.vertices[u]   - face.bounds.x) * f) / _size);
			var uy = (((face.vertices[u+1] - face.bounds.y) * f) / _size);
			uvData.push(ux);
			uvData.push(uy);
		}

		return uvData;
	}

	dom.updateHeadline("BRFv4 - advanced - face swap of two faces.\n" +
		"Switch faces with a friend.");

	dom.updateCodeSnippet(exampleCode + "");

})();