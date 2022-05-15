<template>
  <div
      class="teris"
      :style="{
        '--teris-width': width,
        '--teris-height': height,
      }"
  >
    <div
        v-for="(row, level) in brickMap"
        class="teris__row"
    >
      <div
          v-for="(brick, x) in brickMap[height - 1 - level]"
          class="teris__cell"
      >
        <ColorBrick
            v-if="brick"
            :brick="brick"
            :is-selected="checkIsCoordinateSelected(x, height - 1 - level)"
            @click="handleClickColorBrick(x, height - 1 - level)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Brick, Coordinate } from '../types';
import ColorBrick from './ColorBrick.vue';
export default defineComponent({
  expose: ['addBrick', 'resetBrickMap'],
  components: {
    ColorBrick,
  },
  props: {
    width: {
      type: Number,
      default: 6,
    },
    height: {
      type: Number,
      default: 8,
    },
    isPlaying: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      brickMap: [[]] as (Brick|null)[][],
      selectedCoordinates: [] as Coordinate[],
    };
  },
  computed: {
    currentHeights(): number[] {
      const heights = [];
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y <= this.height; y++) {
          if (y === this.height) {
            heights.push(this.height);
          } else if (this.brickMap[y][x] === null) {
            heights.push(y);
            break;
          }
        }
      }
      return heights;
    }
  },
  watch: {
    isPlaying() {
      if (!this.isPlaying) {
        this.selectedCoordinates = [];
      }
    },
  },
  created() {
    this.resetBrickMap();
  },
  methods: {
    resetBrickMap() {
      this.brickMap = Array(this.height).fill(null).map(v => Array(this.width).fill(null));
    },
    addBrick(brick: Brick) {
      const currentMinHeight = Math.min(...this.currentHeights);
      if (currentMinHeight === this.height) {
        // full
        this.$emit('full');
        return;
      }
      const minHeightIndexList: number[] = [];
      this.currentHeights.forEach((value, index) => {
        if (value === currentMinHeight) {
          minHeightIndexList.push(index);
        }
      });
      const targetX = minHeightIndexList[Math.floor(Math.random() * minHeightIndexList.length)];
      this.brickMap[currentMinHeight][targetX] = brick;
    },
    handleClickColorBrick(x: number, y: number) {
      if (!this.isPlaying) {
        return;
      }
      const newCoordinate = new Coordinate(x, y);
      if (this.selectedCoordinates.length === 1 && this.selectedCoordinates[0].isSame(newCoordinate)) {
        // clear
        this.selectedCoordinates = [];
        return;
      }
      this.selectedCoordinates.push(newCoordinate);
      if (this.selectedCoordinates.length < 2) {
        return;
      }

      // check 2 are same?
      const firstBrick = this.brickMap[this.selectedCoordinates[0].y][this.selectedCoordinates[0].x];
      const secondBrick = this.brickMap[this.selectedCoordinates[1].y][this.selectedCoordinates[1].x];
      if (firstBrick !== null && secondBrick !== null && firstBrick.color.isSame(secondBrick.color)) {
        this.brickMap[this.selectedCoordinates[0].y][this.selectedCoordinates[0].x] = null;
        this.brickMap[this.selectedCoordinates[1].y][this.selectedCoordinates[1].x] = null;
        this.$emit('matched', [ firstBrick, secondBrick ]);
      }

      // clear
      this.selectedCoordinates = [];
    },
    checkIsCoordinateSelected(x: number, y: number) {
      return this.selectedCoordinates.some(coordinate => coordinate.isSame(new Coordinate(x, y)));
    },
  },
});
</script>
