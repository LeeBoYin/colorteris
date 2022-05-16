<template>
  <div class="game">
    <div class="game__score">
      Score: {{ score }}
      <a
          v-if="!isRunning"
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
      const hueTypeNum = 4;
      const hueOffset = 30;
      // const saturationTypeNum = 3;
      const minLightness = 60;
      const maxLightness = 90;
      const lightnessTypeNum = 3;
      (this.$refs.teris as any).addBrick(new Brick(
          new Color(
              (hueOffset + Math.floor(Math.random() * hueTypeNum) * 360 / hueTypeNum) % 360,
              100,
              minLightness + Math.floor(Math.random() * lightnessTypeNum) * (maxLightness - minLightness) / lightnessTypeNum),
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
