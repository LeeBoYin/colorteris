<template>
  <div class="play">
    <Game
        @ended="handleEnded"
    />
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
  methods: {
    handleEnded() {
      // this.router.push({ name: 'home'});
    },
  },
});
</script>
