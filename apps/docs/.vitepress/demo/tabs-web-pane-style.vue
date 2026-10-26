<script setup lang="ts">
/**
 * tabs-web-pane-style — styling hooks for slots, tabs and panes.
 */
import { ref } from 'vue';
import { SnTabPane, SnTabs } from '@snui/vue-web';

const active = ref('a');
</script>

<template>
  <div class="tabs-pane">
    <SnTabs
      v-model:value="active"
      type="segment"
      :tabs-padding="8"
      pane-class="tabs-pane__body"
      :pane-style="{ padding: '16px', lineHeight: '1.8' }"
    >
      <template #prefix>
        <span class="tabs-pane__prefix">视图：</span>
      </template>

      <SnTabPane name="a" tab="表格" tab-class="tabs-pane__tab">
        <p>面板内容通过 <code>paneStyle</code> 获得了统一的内边距。</p>
        <p>标签文字通过 <code>tabClass</code> 追加了自定义类名。</p>
      </SnTabPane>
      <SnTabPane name="b" tab="图表" tab-class="tabs-pane__tab">
        <p><code>tabsPadding</code> 给整条标签栏加了内边距。</p>
        <p><code>prefix</code> 插槽在标签序列之前插入了一个前缀元素。</p>
      </SnTabPane>
    </SnTabs>
  </div>
</template>

<style scoped>
.tabs-pane {
  width: 100%;
}
.tabs-pane__prefix {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.tabs-pane__tab {
  letter-spacing: 0.02em;
}
.tabs-pane__body p {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
