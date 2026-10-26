<script setup lang="ts">
/** Demo: SnSlider — vertical + reverse. */
import { ref } from 'vue'
import { SnSlider } from '@snui/vue-web'
const v = ref(40)
const r = ref(60)
</script>

<template>
  <div class="demo-row" style="height: 220px;">
    <SnSlider v-model="v" vertical />
    <SnSlider v-model="r" vertical reverse />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 40px; align-items: center; }
</style>
