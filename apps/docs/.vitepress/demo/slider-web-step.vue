<script setup lang="ts">
/** Demo: SnSlider — step + bounds. */
import { ref } from 'vue'
import { SnSlider } from '@snui/vue-web'
const v = ref(0)
const strict = ref(10)
</script>

<template>
  <div class="demo-col">
    <SnSlider v-model="v" :min="-50" :max="50" :step="10" />
    <SnSlider v-model="strict" :min="0" :max="100" :step="25" />
    <span class="demo-log">v = {{ v }} · strict = {{ strict }}</span>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
