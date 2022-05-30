<template>
  <div class="home">
    <h1>Color Teris</h1>
    <img
        src="../assets/logo.png"
        alt="Color Teris Logo"
        width="200"
    >
    <RouterLink :to="{ name: 'play' }">Play</RouterLink>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home'
}
</script>
