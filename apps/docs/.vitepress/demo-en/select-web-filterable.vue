<script setup lang="ts">
/** Demo: SnSelect — filterable. */
import { ref } from 'vue'
import { SnSelect } from '@snui/vue-web'
const value = ref<string | null>(null)
const cities = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hangzhou', 'Chengdu', 'Wuhan', 'Xi’an']
</script>

<template>
  <div class="demo-row">
    <SnSelect v-model="value" filterable :options="cities" placeholder="Type to filter" style="width: 240px;" />
    <span class="demo-log">{{ value }}</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
