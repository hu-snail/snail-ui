<script setup lang="ts">
/** Demo: SnSplit — vertical. */
import { SnSplit, SnSplitPanel, SnText } from '@snui/vue-web';
</script>

<template>
  <SnSplit
    direction="vertical"
    style="
      height: 260px;
      border: 1px solid var(--vp-c-border);
      border-radius: 8px;
      overflow: hidden;
    "
  >
    <SnSplitPanel :default-size="50" :min-size="20">
      <div class="pane pane--top"><SnText depth="2">上 50%（ArrowUp/Down 调整）</SnText></div>
    </SnSplitPanel>
    <SnSplitPanel :default-size="50" :min-size="20">
      <div class="pane pane--bottom"><SnText depth="2">下 50%</SnText></div>
    </SnSplitPanel>
  </SnSplit>
</template>

<style scoped>
.pane {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 分隔条默认隐藏，用两种背景区分上下模块。 */
.pane--top {
  background: var(--vp-c-bg-soft);
}

.pane--bottom {
  background: var(--vp-c-brand-soft, rgba(22, 119, 255, 0.1));
}
</style>
