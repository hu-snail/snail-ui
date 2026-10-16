<script setup lang="ts">
/**
 * back-top-web-target-container — auto-detecting the scrollable ancestor.
 *
 * Shows: omitting `listen-to` entirely. The button walks up from its own
 * position to find the nearest scrollable ancestor, so no ref is needed.
 */
import { ref } from 'vue'
import { SnBackTop } from '@snui/vue-web'

const canvasRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="bt-target">
    <p class="bt-target__hint">
      下面这个容器没有传 <code>listen-to</code> —— 按钮自行向上找到最近的可滚动祖先。
    </p>

    <div ref="canvasRef" class="bt-target__canvas">
      <p v-for="n in 30" :key="n" class="bt-target__line">第 {{ n }} 行内容</p>
      <SnBackTop :visibility-height="100" :right="16" :bottom="16" />
    </div>
  </div>
</template>

<style scoped>
.bt-target {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.bt-target__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.bt-target__canvas {
  position: relative;
  height: 240px;
  overflow-y: auto;
  padding: 0 12px;
  border: 1px solid var(--sn-web-color-border);
  border-radius: 6px;
  background: var(--sn-web-color-background-subtle);
}
.bt-target__line {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--sn-web-color-text-secondary);
}
</style>
