<template>
  <div id="background" :class="stepString">
    <div id="_content" :class="stepString">
      <video class="video-webcam" id="_webcam2"></video>
      <canvas class="video-canvas" id="_imageData2"></canvas>
      <canvas class="video-canvas" id="_faceSub2"></canvas>
      <canvas class="video-canvas" id="_threejs2"></canvas>
      <canvas class="video-canvas" id="_drawing2"></canvas>

      <div class="video-canvas" id="glasses">
        <div class="choices">
          Cosa ne pensi di questi?<br><br>

          <img src="/static/img/schermata3/occhiale1.png">
          <img src="/static/img/schermata3/occhiale2.png">
          <img src="/static/img/schermata3/occhiale3.png">
        </div>

        <div class="influencer">
          <img src="/static/img/schermata3/attanasio.png">
          Vuoi vedere la scelta di @fabioattanasio?
        </div>
      </div>
    </div>

    <div id="question" :class="questionString + ' ' + stepString" v-on:click="highlightGlasses">
      <img src="/static/img/schermata2/esperienza1.png">
      <img src="/static/img/schermata2/esperienza2.png">
      <img src="/static/img/schermata2/esperienza3.png">
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
    background: #000;
    color: antiquewhite;

    .step-1 & {
      display: block;
    }

    .choices {
      margin: 20px;

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
    }
  }
    #question {
      position: absolute;
      width: 430px;
      height: 100px;
      left: 50%;
      bottom: 10px;
      transform: translate(-50%, 0);

      &.step-1 {
        display: none;
      }

      > img {
        height: 100px;
        margin: 0 20px;
      }

      > div {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        transition: opacity 2s;
      }

      &.active-question-1 #question-1,
      &.active-question-2 #question-2,
      &.active-question-3 #question-3 {
        opacity: 1;
      }
      #question-1 {
        background: blue;
      }
      #question-2 {
        background: green;
      }
      #question-3 {
        background: yellow;
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
      setTimeout(() => this.incrementQuestion(), 5000);
      setTimeout(() => startCamera(true), 1000);
    },
    methods: {
      incrementQuestion() {
        this.question += 1;
      },

      highlightGlasses() {
        this.destroyWebcam();

        this.step += 1;
        this.body = 'choice-done';
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
