<script setup lang="ts">
/** Demo: SnSlider — tooltip + formatTooltip. */
import { ref } from 'vue'
import { SnSlider } from '@snui/vue-web'
const v = ref(50)
</script>

<template>
  <div class="demo-col">
    <SnSlider v-model="v" />
    <SnSlider v-model="v" :format-tooltip="(x: number) => `${x}%`" />
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
</style>
