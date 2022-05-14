<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterLink :to="{ name: 'home' }">home</RouterLink>
  <RouterLink :to="{ name: 'game' }">play</RouterLink>
  <RouterView />
</template>
