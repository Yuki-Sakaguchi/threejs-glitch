<template>
  <div class="my-canvas js-mainCanvas">
    <canvas></canvas>
  </div>
</template>

<script>
import Glitch from './js/glitch';

export default {
  data() {
    return {
      imgList: [
        './images/img01.png',
        './images/img02.png',
        './images/img03.png',
        './images/img04.png',
      ]
    }
  },
  mounted() {
    this.glitch = new Glitch(this.imgList);
    this.glitch.init(() => this.glitch.start());
  },
  destroyed() {
    this.glitch.destroyed();
  }
}
</script>

<style>
.my-canvas {
    position: relative;
    width: 100%;
    height: 100%;
    /* width: 300px;
    height: 300px; */
    image-rendering: pixelated;
}
</style>
