<script setup lang="ts">
/** Demo: SnSplitter — basic drag. */
import { SnSplitter, SnSplitterPanel, SnText } from '@snui/vue-web';
</script>

<template>
  <SnSplitter
    style="
      height: 220px;
      border: 1px solid var(--vp-c-border);
      border-radius: 8px;
      overflow: hidden;
    "
  >
    <SnSplitterPanel :default-size="35" :min-size="20">
      <div class="pane"><SnText depth="2">Left pane 35%</SnText></div>
    </SnSplitterPanel>
    <SnSplitterPanel :default-size="65" :min-size="30">
      <div class="pane"><SnText depth="2">Right pane 65%</SnText></div>
    </SnSplitterPanel>
  </SnSplitter>
</template>

<style scoped>
.pane {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
}
</style>
