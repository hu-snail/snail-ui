<script setup lang="ts">
/** Demo: SnSelect — multiple + maxTagCount. */
import { ref } from 'vue'
import { SnSelect } from '@snui/vue-web'
const value = ref<string[]>(['shanghai'])
const options = ['北京', '上海', '广州', '深圳', '杭州', '成都'].map(c => ({ label: c, value: c }))
</script>

<template>
  <div class="demo-col">
    <SnSelect v-model="value" multiple :options="options" placeholder="多选城市" style="width: 320px;" />
    <SnSelect v-model="value" multiple :options="options" :max-tag-count="2" placeholder="maxTagCount=2" style="width: 320px;" />
    <pre class="demo-log">{{ value }}</pre>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.demo-log { margin: 0; padding: 8px 12px; background: var(--vp-c-bg-soft); border-radius: 6px; font-size: 12px; }
</style>
