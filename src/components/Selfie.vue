<template>
  <div>
    <div id="_content">
      <div>
        <video class="video-webcam" id="_webcam2"></video>
        <canvas class="video-canvas" id="_imageData2"></canvas>
        <canvas class="video-canvas" id="_faceSub2"></canvas>
        <canvas class="video-canvas" id="_threejs2"></canvas>
        <canvas class="video-canvas" id="_drawing2"></canvas>
      </div>
    </div>

    <div class="buttons">
      <img src="/static/img/schermata4/btn-buy.png">
      <img src="/static/img/schermata4/btn-live.png">
      <img src="/static/img/schermata4/btn-send.png" v-on:click="sendEmail">
    </div>

    <div id="email" :class="showEmail">
      <input type="email" placeholder="Inserisci la tua email:">
    </div>

    <router-link to="/luxy" id="nav-prev"></router-link>
  </div>
</template>

<style lang="scss">
  .buttons {
    position: absolute;
    width: 622px;
    left: 50%;
    bottom: 170px;
    transform: translate(-50%, 0);

    img {
      height: 60px;
      margin: 0 70px;
    }
  }

  #email {
    position: absolute;
    width: 550px;
    left: 50%;
    bottom: 330px;
    transform: translate(-50%, 0);

    background: #000;

    padding: 20px;

    opacity: 0;
    transition: opacity 2s;

    input {
      background: transparent;
      border: 0;
      border-bottom: 2px solid #fff;

      width: 100%;
    }

    &.visible {
      opacity: 1;
    }
  }
</style>

<script>
import { webcam, intervalSDK, startCamera } from '../libs/webcam';

export default {
  data() {
    return {
      email: false,
    };
  },
  computed: {
    showEmail() {
      return this.email ? 'visible' : 'hidden';
    },
  },
  methods: {
    sendEmail() {
      if (intervalSDK !== -1) {
        clearInterval(intervalSDK);
      }

      this.email = true;
    },
  },
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
