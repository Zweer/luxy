<template>
  <div>
    <div id="_content">
      <div>
        <video class="video-webcam" id="_webcam0"></video>
        <canvas class="video-canvas" id="_imageData0"></canvas>
        <canvas class="video-canvas" id="_faceSub0"></canvas>
        <canvas class="video-canvas" id="_threejs0"></canvas>
        <canvas class="video-canvas" id="_drawing0"></canvas>
      </div>
    </div>
    <router-link to="/pre-2" id="nav-prev"></router-link>
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
    setTimeout(() => startCamera(0), 1000);
  },
};
</script>
