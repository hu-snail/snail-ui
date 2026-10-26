<script setup lang="ts">
/** Demo: SnSplitter — vertical. */
import { SnSplitter, SnSplitterPanel, SnText } from '@snui/vue-web'
</script>

<template>
  <SnSplitter direction="vertical" style="height: 260px; border: 1px solid var(--vp-c-border); border-radius: 8px; overflow: hidden;">
    <SnSplitterPanel :default-size="50" :min-size="20">
      <div class="pane"><SnText depth="2">Top 50% (ArrowUp/Down to resize)</SnText></div>
    </SnSplitterPanel>
    <SnSplitterPanel :default-size="50" :min-size="20">
      <div class="pane"><SnText depth="2">Bottom 50%</SnText></div>
    </SnSplitterPanel>
  </SnSplitter>
</template>

<style scoped>
.pane { height: 100%; display: flex; align-items: center; justify-content: center; background: var(--vp-c-bg-soft); }
</style>
