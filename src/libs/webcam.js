let intervalSDK = -1;
let webcam;

const draw = brfv4.example.drawing;
const dom = brfv4.example.dom;
const _images = [];
let _image = null;
const _baseNode = new createjs.Container();
const _position = new brfv4.Point();
const calcDistance = brfv4.BRFv4PointUtils.calcDistance;
const calcAngle = brfv4.BRFv4PointUtils.calcAngle;
const toDegree = brfv4.BRFv4PointUtils.toDegree;

function startCamera(tracking = false) {
  let timeoutWebcam = -1;
  webcam = document.getElementById('_webcam' + (tracking ? '2' : ''));

  function onStreamFetched(mediaStream) {
    webcam.srcObject = mediaStream;
    webcam.play();

    function onStreamDimensionsAvailable() {
      if (webcam.videoWidth === 0) {
        clearTimeout(timeoutWebcam);
        timeoutWebcam = setTimeout(onStreamDimensionsAvailable, 100);
      } else {
        // initBRF(webcam.videoWidth, webcam.videoHeight);
        initBRF(528, 330, tracking);
      }
    }

    onStreamDimensionsAvailable();
  }

  window.navigator.mediaDevices.getUserMedia({
    video: {
      width: {
        min: 640,
        ideal: 1280,
        max: 1920,
      },
      height: {
        min: 480,
        ideal: 720,
        max: 1080,
      },
    },
  })
    .then(onStreamFetched)
    .catch(() => {});

  function changeImage(bitmap, index) {
    let imageFactor = 1.0;

    if (index === 0) {
      imageFactor = 1.0;
    } else if (index === 1) {
      imageFactor = 3.3;
    }

    bitmap.scaleX = imageFactor;
    bitmap.scaleY = imageFactor;

    bitmap.x = -parseInt(bitmap.getBounds().width * bitmap.scaleX * 0.50, 10);
    bitmap.y = -parseInt(bitmap.getBounds().height * bitmap.scaleY * 0.45, 10);

    _baseNode.removeAllChildren();
    _baseNode.addChild(bitmap);
  }

  function initBRF(width, height, tracking) {
    draw.setup(dom.getElement('_drawing' + (tracking ? '2' : '')), dom.getElement('_faceSub' + (tracking ? '2' : '')), 30);

    draw.imageContainer.addChild(_baseNode);
    const _imageURLs = ['/static/img/img_glasses.png'];

    _image = new createjs.Bitmap(_imageURLs[0]);

    if (!tracking) {
      _image.image.onload = function onload() {
        changeImage(_image);
      };
    }

    dom.updateLayout(width, height);
    draw.updateLayout(width, height);
    const imageData = document.getElementById('_imageData' + (tracking ? '2' : ''));

    imageData.width = width;
    imageData.height = height;
    imageData.style.position = "absolute";

    const imageDataCtx = imageData.getContext('2d');

    const brfManager = new brfv4.BRFManager();
    const resolution = new brfv4.Rectangle(0, 0, width, height);

    let timeoutSDK = -1;

    function waitForSDK() {
      if (brfv4.sdkReady) {
        onReadySDK();
      } else {
        clearTimeout(timeoutSDK);
        timeoutSDK = setTimeout(waitForSDK, 100);
      }
    }

    function onReadySDK() {
      initSDK();
    }

    function initSDK() {
      if (!brfv4.sdkReady)
        waitForSDK();
      else
        brfManager.init(resolution, resolution, "com.tastenkunst.brfv4.js.examples.minimal.webcam");

      intervalSDK = setInterval(update, 1000 / 30);
    }

    function update() {
      imageDataCtx.setTransform(-1.0, 0, 0, 1, resolution.width, 0); // mirrored for draw of video
      imageDataCtx.drawImage(webcam, 0, 0, resolution.width, resolution.height);
      imageDataCtx.setTransform(1.0, 0, 0, 1, 0, 0); // unmirrored for draw of results

      brfManager.update(imageDataCtx.getImageData(0, 0, resolution.width, resolution.height).data);
      draw.clear();

      // Face detection results: a rough rectangle used to start the face tracking.

      // draw.drawRects(brfManager.getAllDetectedFaces(), false, 1.0, 0x00a1ff, 0.5);
      // draw.drawRects(brfManager.getMergedDetectedFaces(), false, 2.0, 0xffd200, 1.0);

      // Get all faces. The default setup only tracks one face.

      const faces = brfManager.getFaces();

      // If no face was tracked: hide the image overlays.

      let showBaseNode = false;

      for (let i = 0; i < faces.length; i += 1) {
        const face = faces[i];

        if (face.state === brfv4.BRFState.FACE_TRACKING_START ||
          face.state === brfv4.BRFState.FACE_TRACKING) {
          if (tracking) {
            // Face Tracking results: 68 facial feature points.

            draw.drawTriangles(face.candideVertices, face.candideTriangles, false, 1.0, 0xffd200, 0.4, 0, 0);
            draw.drawTrianglesAsPoints(face.candideVertices, 2.0, false, 0xffd200, 0.4);

            draw.drawTriangles(face.vertices, face.triangles, false, 1.0, 0x00a0ff, 0.4, 0, 0);
            draw.drawTrianglesAsPoints(face.vertices, 2.0, false, 0x00a0ff, 0.4);
          } else {
            // Set position to be nose top and calculate rotation.

            _position.x = face.points[27].x;
            _position.y = face.points[27].y;

            const leftEye = face.points[36];
            const rightEye = face.points[45];

            const dist = calcDistance(leftEye, rightEye);
            const rot = toDegree(calcAngle(leftEye, rightEye));
            const scale = (dist * 0.0026);

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
      }

      if (!showBaseNode) {
        _baseNode.alpha = 0.0;
      }
    }

    initSDK();
  }
}

export {
  intervalSDK,
  webcam,
  startCamera,
};
