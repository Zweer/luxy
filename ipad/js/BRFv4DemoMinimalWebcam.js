function initMinimal() {

	function startCamera() {

		var webcam = document.getElementById("_webcam");
		var timeoutWebcam = -1;

		function onStreamFetched (mediaStream) {

			webcam.srcObject = mediaStream;
			webcam.play();

			function onStreamDimensionsAvailable () {

				if (webcam.videoWidth === 0) {

					clearTimeout(timeoutWebcam);
					timeoutWebcam = setTimeout(onStreamDimensionsAvailable, 100);

				} else {

					initBRF(webcam.videoWidth, webcam.videoHeight)
				}
			}

			onStreamDimensionsAvailable();
		}

		window.navigator.mediaDevices.getUserMedia(
			{video: {
				width: 640,
				height: 480,
				frameRate: 30}
			})
			.then (onStreamFetched)
			.catch(function () {});
	}

	function initBRF(width, height) {

		var webcam = document.getElementById("_webcam");
		var imageData = document.getElementById("_imageData");

		imageData.width = width;
		imageData.height = height;
		imageData.style.position = "absolute";

		var imageDataCtx = imageData.getContext("2d");

		var brfManager = new brfv4.BRFManager();
		var resolution = new brfv4.Rectangle(0, 0, width, height);

		var timeoutSDK = -1;
		var intervalSDK = -1;

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

				brfManager.init(resolution, resolution, "com.tastenkunst.brfv4.js.examples.minimal.webcam");
				intervalSDK = setInterval(update, 1000/30);
			}
		}

		function update() {

			imageDataCtx.setTransform(-1.0, 0, 0, 1, resolution.width, 0); // mirrored for draw of video
			imageDataCtx.drawImage(webcam, 0, 0, resolution.width, resolution.height);
			imageDataCtx.setTransform( 1.0, 0, 0, 1, 0, 0); // unmirrored for draw of results

			brfManager.update(imageDataCtx.getImageData(0, 0, resolution.width, resolution.height).data);

			brfManager.getFaces();

			var faces = brfManager.getFaces();

			for(var i = 0; i < faces.length; i++) {

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

		initSDK();
	}

	startCamera();
}