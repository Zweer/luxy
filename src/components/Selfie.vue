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
      <h3>Inserisci la tua email</h3>
      <input type="email" title="email" v-model="emailaddress">
      <button v-on:click="sendEmail">Invia</button>
    </div>
    <div class="popup" id="confirmMail" :class="showConfirmMail">
      <h3>Email inviata!</h3>
      <button v-on:click="closeConfirmMail">Ok</button>
    </div>

    <div class="popup" id="buy" :class="showBuy">
      <h3>Grazie!</h3>
      <p>I tuoi nuovi occhiali ti aspettano in cassa</p>
    </div>

    <router-link to="/luxy" id="nav-prev"></router-link>
    <router-link to="/aft-1" id="nav-next"></router-link>
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
    width: 300px;
    left: 50%;
    bottom: 330px;
    transform: translate(-50%, 0);
    border-radius: 8px;
    padding-bottom: 10px;
    margin: auto;

    background:rgba(255,255,255,0.85);
    color: #070707;

    opacity: 0;
    transition: opacity 2s;

    h3 {
      margin: 20px 0 0 0;
      padding: 10px;
      font-size: 18px;
      text-align: center;
    }

    input {
      display: block;
      margin: 0 10px;
      background: transparent;
      border: 0;
      border-bottom: 2px solid #BABABA;
      color: #070707;
      width: calc(100% - 20px);
    }

    button {
      display: block;

      background: transparent;
      border: 0;
      color: #007AFF;
      margin: 20px 0 0;

      text-align: center;

      width: 100%;
    }

    p {
      padding: 0 10px 10px;
      text-align: center;
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
      confirmMail: false,
      emailaddress: "",
    };
  },
  computed: {
    showEmail() {
      return this.email ? 'visible' : 'hidden';
    },
    showBuy() {
      return this.buy ? 'visible' : 'hidden';
    },
    showConfirmMail() {
      return this.confirmMail ? 'visible' : 'hidden';
    }
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
      var canvas = document.getElementById("_imageData2");
      var canvasData = canvas.toDataURL("image/png");
      var ajax = new XMLHttpRequest();
      ajax.open("POST",'https://luxy.ga/post',true);
      ajax.onreadystatechange = function() {
          console.log(ajax.responseText);
      }
      function dataURItoBlob(dataURI) {
          var byteString = atob(dataURI.split(',')[1]);
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          return new Blob([ab], {type: mimeString});
      }
      var formData = new FormData();
      formData.append("file", dataURItoBlob(canvasData), "MySelfie.png");
      //formData.append("email", this.email);
      //ajax.setRequestHeader('Content-Type', 'application/upload');
      ajax.setRequestHeader('X-Email', this.emailaddress);
      ajax.send(formData);
      this.confirmMail = true;
    },
    closeConfirmMail(){
      this.confirmMail = false;
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
