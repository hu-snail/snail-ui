<script setup lang="ts">
/** Demo: SnMention — basic. */
import { ref } from 'vue'
import { SnMention } from '@snui/vue-web'
const value = ref('')
const options = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' },
  { label: '王五', value: 'wangwu' },
]
</script>

<template>
  <div class="demo-col">
    <SnMention v-model="value" :options="options" placeholder="输入 @ 提及成员" style="width: 300px;" />
    <span class="demo-log">{{ value }}</span>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
