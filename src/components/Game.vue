<template>
  <div class="game">
    <div class="game__score">
      Score: {{ score }}
      <a
          v-if="!isRunning"
          style="text-decoration: underline; cursor: pointer"
          @click="restart"
      >restart</a>
    </div>
    <Teris
      ref="teris"
      class="game__teris"
      :is-playing="isRunning"
      @matched="handleMatched"
      @full="handleFull"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Teris from './Teris.vue';
import { Brick, Color } from '../types';

// const HUE_OFFSET = Math.floor(Math.random() * 360);
const HUE_OFFSET = 30;
const HUE_VARIATION = 4;
const SATURATION = 100;
const MINX_LIGHTNESS = 60;
const MAX_LIGHTNESS = 90;
const LIGHTNESS_VARIATION = 3;

export default defineComponent({
  components: {
    Teris,
  },
  data() {
    return {
      score: 0,
      intervalToAddBrick: 500,
      interval: undefined as (number|undefined),
      isRunning: false,
    };
  },
  mounted() {
    this.start();
  },
  methods: {
    start() {
      if (this.isRunning) {
        return;
      }
      this.isRunning = true;
      this.interval = setInterval(this.addNewBricks, this.intervalToAddBrick);
    },
    stop() {
      clearInterval(this.interval);
      this.isRunning = false;
      this.interval = undefined;
    },
    addNewBricks() {
      (this.$refs.teris as any).addBrick(new Brick(
          new Color(
              (HUE_OFFSET + Math.floor(Math.random() * HUE_VARIATION) * 360 / HUE_VARIATION) % 360,
              SATURATION,
              MINX_LIGHTNESS + Math.floor(Math.random() * LIGHTNESS_VARIATION) * (MAX_LIGHTNESS - MINX_LIGHTNESS) / LIGHTNESS_VARIATION),
          ));
    },
    handleMatched() {
      this.score++;
    },
    handleFull() {
      this.stop();
      this.$emit('ended');
    },
    restart() {
      this.score = 0;
      (this.$refs.teris as any).resetBrickMap();
      this.start();
    },
  },
});
</script>

<style scoped>

</style>
