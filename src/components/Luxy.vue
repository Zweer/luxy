<template>
  <div id="background" :class="stepString">
    <div id="_content" :class="stepString">
      <video class="video-webcam" id="_webcam1"></video>
      <canvas class="video-canvas" id="_imageData1"></canvas>
      <canvas class="video-canvas" id="_faceSub1"></canvas>
      <canvas class="video-canvas" id="_threejs1"></canvas>
      <canvas class="video-canvas" id="_drawing1"></canvas>

      <div class="video-canvas" id="glasses">
        <div class="choices" v-on:click="goToSelfie">
          Cosa ne pensi di questi?<br><br>

          <img src="/static/img/schermata3/occhiale1.png">
          <img src="/static/img/schermata3/occhiale2.png">
          <img src="/static/img/schermata3/occhiale3.png">
        </div>

        <div class="influencer">
          <img src="/static/img/schermata3/attanasio.png">
          <div>Vuoi vedere la scelta di @fabioattanasio?</div>
        </div>
        <div class="footer" v-on:click="goToSelfie">
          <div>Scatta!</div>
        </div>
      </div>
    </div>

    <div id="question" :class="questionString + ' ' + stepString" v-on:click="highlightGlasses">
      <div>
        Che cosa ti inspira? <br><br>
        <img src="/static/img/schermata2/esperienza1.png">
        <img src="/static/img/schermata2/esperienza2.png">
        <img src="/static/img/schermata2/esperienza3.png">
      </div>
    </div>

    <router-link to="/" id="nav-prev"></router-link>
  </div>
</template>

<style lang="scss">
  #background {
    background: center no-repeat;
    background-size: cover;

    &.step-1 {
      background-image: url('/static/img/schermata2/sfondo-highlight.png');
    }
  }

  #glasses {
    display: none;
    background: white;
    color: #005192;

    .step-1 & {
      display: block;
    }

    .choices {
      margin: 20px;
      text-align: center;

      > img {
        width: 90px;
        margin: 0 34px;
      }
    }

    .influencer {
      margin: 50px 40px 0;

      img {
        float: left;
        margin: 0 20px;
        width: 100px;
      }

      div {
        padding-top: 35px;
      }
    }
    .footer {
      width: 100%;
      height: 40px;
      position: absolute;
      bottom: 0px;
      text-align: center;
      background-color: #005192;
      div {
        color: black;
        margin-top: 7px;
      }
    }
  }
    #question {
      position: absolute;
      width: 622px;
      left: 50%;
      bottom: 150px;
      transform: translate(-50%, 0);

      background: #000;
      color: #fff;

      opacity: 0;
      transition: opacity 2s;

      &.active-question-1 {
        opacity: 1;
      }

      &.step-1 {
        display: none;
      }

      > div {
        margin: 10px 20px 0;
      }

      img {
        height: 100px;
        margin: 0 40px;
      }
    }
</style>

<script>
  import { webcam, intervalSDK, startCamera } from '../libs/webcam';

  export default {
    name: 'luxy',
    data() {
      return {
        question: 0,
        step: 0,
        body: '',
      };
    },
    computed: {
      questionString() {
        return `active-question-${this.question}`;
      },
      stepString() {
        return `step-${this.step}`;
      },
    },
    created() {
      setTimeout(() => startCamera(1), 1000);
    },
    methods: {
      incrementQuestion() {
        this.question += 1;
      },

      highlightGlasses() {
        if (this.question === 0) {
          this.incrementQuestion();
        } else {
          this.destroyWebcam();

          this.step += 1;
          this.body = 'choice-done';
        }
      },

      destroyWebcam() {
        if (intervalSDK !== -1) {
          clearInterval(intervalSDK);
        }

        if (webcam) {
          webcam.src = '';
          webcam.play();
        }
      },

      goToSelfie() {
        this.$router.push('/selfie');
      },
    },
    watch: {
      question(val) {
        if (val > 3) {
          this.$router.push('/selection');
        }
      },
    },
    destroyed() {
      this.destroyWebcam();
    },
  };
</script>
