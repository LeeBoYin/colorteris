<template>
  <div class="play">
    <Game
        ref="game"
        @ended="handleEnded"
    />
    <div
        v-if="!hasReadInstruction"
        class="play__instruction"
    >
      <p>
        Select two squares with the same color to clear them.
      </p>
      <p>
        Clear as many squares as you can until the grid is fully filled.
      </p>
      <a @click="handleStart">
        Start
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Game from '../components/Game.vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  setup() {
    return {
      router: useRouter(),
    }
  },
  components: {
    Game,
  },
  data() {
    return {
      hasReadInstruction: window.localStorage.getItem('hasReadInstruction') || false,
    };
  },
  mounted() {
    if (this.hasReadInstruction) {
      (this.$refs.game as any).start();
    }
  },
  methods: {
    handleEnded() {
      // this.router.push({ name: 'home'});
    },
    handleStart() {
      window.localStorage.setItem('hasReadInstruction', '1');
      this.hasReadInstruction = true;
      (this.$refs.game as any).start();
    },
  },
});
</script>
