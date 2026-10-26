<script setup lang="ts">
/** Demo: SnSplitter — collapsible panel. */
import { ref } from 'vue'
import { SnSplitter, SnSplitterPanel, SnText } from '@snui/vue-web'
const collapsed = ref(false)
</script>

<template>
  <SnSplitter style="height: 200px; border: 1px solid var(--vp-c-border); border-radius: 8px; overflow: hidden;">
    <SnSplitterPanel
      v-model:collapsed="collapsed"
      collapsible
      :default-size="30"
      :min-size="15"
    >
      <div class="pane"><SnText depth="2">可折叠面板</SnText></div>
    </SnSplitterPanel>
    <SnSplitterPanel :default-size="70" :min-size="40">
      <div class="pane"><SnText depth="2">拖 divider 到 min 以下 snap 收起；双击恢复；当前 {{ collapsed ? '已收起' : '展开' }}</SnText></div>
    </SnSplitterPanel>
  </SnSplitter>
</template>

<style scoped>
.pane { height: 100%; display: flex; align-items: center; justify-content: center; background: var(--vp-c-bg-soft); padding: 8px; }
</style>
