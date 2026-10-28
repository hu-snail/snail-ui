<script setup lang="ts">
/** Demo: SnSplit — basic drag. */
import { SnSplit, SnSplitPanel, SnText } from '@snui/vue-web';
</script>

<template>
  <SnSplit
    style="
      height: 220px;
      border: 1px solid var(--vp-c-border);
      border-radius: 8px;
      overflow: hidden;
    "
  >
    <SnSplitPanel :default-size="35" :min-size="20">
      <div class="pane pane--left"><SnText depth="2">左面板 35%</SnText></div>
    </SnSplitPanel>
    <SnSplitPanel :default-size="65" :min-size="30">
      <div class="pane pane--right"><SnText depth="2">右面板 65%</SnText></div>
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

/* 分隔条默认隐藏，用两种背景区分左右模块；hover 分隔处出现居中竖条。 */
.pane--left {
  background: var(--vp-c-bg-soft);
}

.pane--right {
  background: var(--vp-c-brand-soft, rgba(22, 119, 255, 0.1));
}
</style>
