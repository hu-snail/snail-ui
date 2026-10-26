<script setup lang="ts">
/** Demo: SnLog — reach-top / reach-bottom / require-more events. */
import { ref } from 'vue';
import { SnLog } from '@snui/vue-web';

function makeLog(): string {
  const lines: string[] = [];
  for (let i = 0; i < 10; ++i) {
    lines.push(Math.random().toString(16));
  }
  return `${lines.join('\n')}\n`;
}

const loading = ref(false);
const log = ref(makeLog());
const lastEvent = ref('（暂无事件）');

function handleRequireMore(from: 'top' | 'bottom') {
  if (loading.value) return;
  loading.value = true;
  lastEvent.value = `require-more：${from === 'top' ? '顶部' : '底部'}`;
  window.setTimeout(() => {
    log.value = from === 'top' ? makeLog() + log.value : log.value + makeLog();
    loading.value = false;
  }, 800);
}

function handleReachTop() {
  lastEvent.value = 'reach-top：已到顶部';
}

function handleReachBottom() {
  lastEvent.value = 'reach-bottom：已到底部';
}
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo__status">最近事件：{{ lastEvent }}</p>
    <SnLog
      :log="log"
      :loading="loading"
      trim
      @require-more="handleRequireMore"
      @reach-top="handleReachTop"
      @reach-bottom="handleReachBottom"
    />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: var(--sn-web-color-text-primary);
}

.sn-demo__status {
  margin: 0;
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
}
</style>
