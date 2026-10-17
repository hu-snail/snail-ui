<script setup lang="ts">
/** Demo: SnSelect — filterable. */
import { ref } from 'vue'
import { SnSelect } from '@snui/vue-web'
const value = ref<string | null>(null)
const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']
</script>

<template>
  <div class="demo-row">
    <SnSelect v-model="value" filterable :options="cities" placeholder="输入过滤" style="width: 240px;" />
    <span class="demo-log">{{ value }}</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
