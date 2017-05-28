<template>
  <div>
    <div id="_content">
      <div>
        <video class="video-webcam" id="_webcam"></video>
        <canvas class="video-canvas" id="_imageData"></canvas>
        <canvas class="video-canvas" id="_faceSub"></canvas>
        <canvas class="video-canvas" id="_threejs"></canvas>
        <canvas class="video-canvas" id="_drawing"></canvas>
      </div>
    </div>

    <router-link to="/luxy" id="nav-next"></router-link>
  </div>
</template>

<script>
import { webcam, intervalSDK, startCamera } from '../libs/webcam';

export default {
  destroyed() {
    if (intervalSDK !== -1) {
      clearInterval(intervalSDK);
    }

    if (webcam) {
      webcam.src = '';
      webcam.play();
    }
  },
  created() {
	setTimeout(() => startCamera(2), 1000);
  },
};
</script>
