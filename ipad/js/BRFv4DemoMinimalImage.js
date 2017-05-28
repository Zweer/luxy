function initMinimal() {

	function loadImage() {
		var image = document.getElementById("_image");
		initBRF(image.width, image.height);
	}

	function initBRF(width, height) {

		var image = document.getElementById("_image");
		var imageData = document.getElementById("_imageData");

		imageData.width = width;
		imageData.height = height;
		imageData.style.position = "absolute";

		var imageDataCtx = imageData.getContext("2d");

		var brfManager = new brfv4.BRFManager();
		var resolution = new brfv4.Rectangle(0, 0, width, height);

		var timeoutSDK = -1;

		function waitForSDK() {

			if(brfv4.sdkReady) {

				onReadySDK();

			} else {

				clearTimeout(timeoutSDK);
				timeoutSDK = setTimeout(waitForSDK, 100);
			}
		}

		function onReadySDK() { initSDK(); }

		function initSDK() {

			if(!brfv4.sdkReady) {

				waitForSDK();

			} else {

				brfManager.init(resolution, resolution, "com.tastenkunst.brfv4.js.examples.minimal.image");

				var i = 0;
				var numUpdates = 10;

				imageDataCtx.drawImage(image, 0, 0, resolution.width, resolution.height);

				for(i = 0; i < numUpdates; i++) {
					brfManager.update(imageDataCtx.getImageData(0, 0, resolution.width, resolution.height).data);
				}

				brfManager.getFaces();

				var faces = brfManager.getFaces();

				for(i = 0; i < faces.length; i++) {

					var face = faces[i];

					if(	face.state == brfv4.BRFState.FACE_TRACKING_START ||
						face.state == brfv4.BRFState.FACE_TRACKING) {

						imageDataCtx.strokeStyle="#00a0ff";

						for(var k = 0; k < face.vertices.length; k += 2) {
							imageDataCtx.beginPath();
							imageDataCtx.arc(face.vertices[k], face.vertices[k + 1], 2, 0, 2 * Math.PI);
							imageDataCtx.stroke();
						}
					}
				}
			}
		}

		initSDK();
	}

	loadImage();
}