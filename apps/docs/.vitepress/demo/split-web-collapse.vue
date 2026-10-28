<script setup lang="ts">
/** Demo: SnSplit — collapsible panel. */
import { ref } from 'vue';
import { SnSplit, SnSplitPanel, SnText } from '@snui/vue-web';
const collapsed = ref(false);
</script>

<template>
  <SnSplit
    style="
      height: 200px;
      border: 1px solid var(--vp-c-border);
      border-radius: 8px;
      overflow: hidden;
    "
  >
    <SnSplitPanel v-model:collapsed="collapsed" collapsible :default-size="30" :min-size="15">
      <div class="pane pane--fold"><SnText depth="2">可折叠面板</SnText></div>
    </SnSplitPanel>
    <SnSplitPanel :default-size="70" :min-size="40">
      <div class="pane pane--rest">
        <SnText depth="2"
          >拖 divider 到 min 以下 snap 收起；双击恢复；当前
          {{ collapsed ? '已收起' : '展开' }}</SnText
        >
      </div>
    </SnSplitPanel>
  </SnSplit>
</template>

<style scoped>
.pane {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

/* 两种背景区分模块；可折叠面板 hover 分隔处出现居中竖条。 */
.pane--fold {
  background: var(--vp-c-brand-soft, rgba(22, 119, 255, 0.1));
}

.pane--rest {
  background: var(--vp-c-bg-soft);
}
</style>
