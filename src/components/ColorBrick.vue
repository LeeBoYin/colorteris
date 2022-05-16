<template>
  <div
      class="color-brick"
      :class="{
        'color-brick--selected': isSelected,
        'color-brick--new': isNew,
      }"
      :style="{
        '--color-brick-background-color': backgroundColor,
      }"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Brick } from '../types';
export default defineComponent({
  props: {
    brick: {
      type: Brick,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    backgroundColor() {
      return `hsl( ${ this.brick.color.hue }deg ${ this.brick.color.saturation }% ${ this.brick.color.lightness }% )`;
    },
  },
});
</script>
