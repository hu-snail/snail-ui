<script setup lang="ts">
/** Demo: SnDynamicInput — basic string rows. */
import { ref } from 'vue'
import { SnDynamicInput } from '@snui/vue-web'
const items = ref<string[]>(['First item', ''])
</script>

<template>
  <div class="demo-col">
    <SnDynamicInput v-model="items" :preset="() => ''" style="max-width: 360px;" />
    <pre class="demo-log">{{ items }}</pre>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.demo-log { margin: 0; padding: 8px 12px; background: var(--vp-c-bg-soft); border-radius: 6px; font-size: 12px; }
</style>
