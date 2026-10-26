<script setup lang="ts">
/** Demo: SnSelect — basic single select. */
import { ref } from 'vue'
import { SnSelect } from '@snui/vue-web'
const value = ref<string | null>('shanghai')
</script>

<template>
  <div class="demo-row">
    <SnSelect v-model="value" :options="['北京', '上海', '广州', '深圳']" placeholder="选择城市" />
    <span class="demo-log">{{ value }}</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
