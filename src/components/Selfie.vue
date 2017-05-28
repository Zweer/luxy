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
      <img src="/static/img/schermata4/btn-buy.png" v-on:click="sendOrder">
      <img src="/static/img/schermata4/btn-live.png">
      <img src="/static/img/schermata4/btn-send.png" v-on:click="addressEmail">
    </div>

    <div class="popup" id="email" :class="showEmail">
      <input type="email" placeholder="Inserisci la tua email:">
      <button v-on:click="sendEmail">Invia</button>
    </div>

    <div class="popup" id="buy" :class="showBuy">
      I tuoi nuovi occhiali ti aspettano in cassa, grazie!
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

  .popup {
    position: absolute;
    width: 550px;
    left: 50%;
    bottom: 330px;
    transform: translate(-50%, 0);

    background: #005192;
    color: antiquewhite;
    padding: 20px;

    opacity: 0;
    transition: opacity 2s;

    input {
      background: transparent;
      border: 0;
      border-bottom: 2px solid #fff;

      width: 80%;
    }

    button {
      background: transparent;
      border: 0;
      color: #fff;

      text-align: right;

      width: 18%;
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
      buy: false,
    };
  },
  computed: {
    showEmail() {
      return this.email ? 'visible' : 'hidden';
    },
    showBuy() {
      return this.buy ? 'visible' : 'hidden';
    },
  },
  methods: {
    addressEmail() {
      if (intervalSDK !== -1) {
        clearInterval(intervalSDK);
      }

      this.buy = false;
      this.email = true;
    },
    sendEmail() {
      this.email = false;
    },

    sendOrder() {
      this.email = false;
      this.buy = !this.buy;
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
