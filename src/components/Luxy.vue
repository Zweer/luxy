<template>
  <div>
    <div id="question" :class="questionString" v-on:click="incrementQuestion">
      <div id="question-1"></div>
      <div id="question-2"></div>
      <div id="question-3"></div>
    </div>

    <router-link to="/" id="nav-prev"></router-link>
  </div>
</template>

<style lang="scss">
  #question {
    position: absolute;

    width: 200px;
    height: 100px;

    background: red;

    left: 50%;
    bottom: 0;

    transform: translate(-50%, 0);

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
  export default {
    name: 'luxy',
    data() {
      return {
        question: 0,
      };
    },
    computed: {
      questionString() {
        return `active-question-${this.question}`;
      },
    },
    created() {
      setTimeout(() => this.incrementQuestion(), 5000);
    },
    methods: {
      incrementQuestion() {
        this.question += 1;
      },
    },
    watch: {
      question(val) {
        if (val > 3) {
          this.$router.push('/selection');
        }
      },
    },
  };
</script>
