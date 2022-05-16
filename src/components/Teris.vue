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
      </div>
    </div>
    <div>
      <ColorBrick
          v-for="brick in bricks"
          :key="brick.id"
          :brick="brick"
          :style="{
              '--coordinate-x': brickCoordinateMap.get(brick).x,
              '--coordinate-y': height - 1 - brickCoordinateMap.get(brick).y,
            }"
          :is-selected="checkIsCoordinateSelected(brickCoordinateMap.get(brick))"
          :is-new="brick === newBrick"
          @click="handleClickColorBrick(brickCoordinateMap.get(brick))"
      />
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
      newBrick: null as (Brick|null),
      bricks: [] as Brick[],
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
    },
    brickCoordinateMap() {
      const map: Map<Brick, Coordinate> = new Map();
      this.brickMap.forEach((row, y) => {
        row.forEach((brick, x) => {
          if (brick !== null) {
            map.set(brick, new Coordinate(x, y));
          }
        })
      });
      return map;
    },
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
      this.bricks = [];
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
      this.bricks.push(brick);
      this.brickMap[currentMinHeight][targetX] = brick;
      this.newBrick = brick;
      setTimeout(() => {
        this.newBrick = null;
      }, 100);
    },
    handleClickColorBrick(coordinate: Coordinate) {
      if (!this.isPlaying) {
        return;
      }
      if (this.selectedCoordinates.length === 1 && this.selectedCoordinates[0].isSame(coordinate)) {
        // clear
        this.selectedCoordinates = [];
        return;
      }
      this.selectedCoordinates.push(coordinate);
      if (this.selectedCoordinates.length < 2) {
        return;
      }

      // check 2 are same?
      setTimeout(() => {
        // delay a little to highlight selected bricks before clear
        if (!this.selectedCoordinates.length) {
          return;
        }
        const firstBrick = this.brickMap[this.selectedCoordinates[0].y][this.selectedCoordinates[0].x];
        const secondBrick = this.brickMap[this.selectedCoordinates[1].y][this.selectedCoordinates[1].x];
        if (firstBrick !== null && secondBrick !== null && firstBrick.color.isSame(secondBrick.color)) {
          this.brickMap[this.selectedCoordinates[0].y][this.selectedCoordinates[0].x] = null;
          this.brickMap[this.selectedCoordinates[1].y][this.selectedCoordinates[1].x] = null;
          this.swapDownBricksInColumn(this.selectedCoordinates[0].x);
          this.swapDownBricksInColumn(this.selectedCoordinates[1].x);
          this.bricks.splice(this.bricks.indexOf(firstBrick), 1);
          this.bricks.splice(this.bricks.indexOf(secondBrick), 1);
          this.$emit('matched', [ firstBrick, secondBrick ]);
        }

        // clear
        this.selectedCoordinates = [];
      }, 100);
    },
    swapDownBricksInColumn(x: number) {
      let currentEmptyLevel = null;
      for (let level = 0; level < this.height; level++) {
        if (this.brickMap[level][x] === null && currentEmptyLevel === null) {
          currentEmptyLevel = level;
          continue;
        }
        if (this.brickMap[level][x] !== null && currentEmptyLevel !== null) {
          this.brickMap[currentEmptyLevel][x] = this.brickMap[level][x];
          this.brickMap[level][x] = null;
          currentEmptyLevel = level;
        }
      }
    },
    checkIsCoordinateSelected(coordinate: Coordinate) {
      return this.selectedCoordinates.some(selectedCoordinate => selectedCoordinate.isSame(coordinate));
    },
  },
});
</script>
