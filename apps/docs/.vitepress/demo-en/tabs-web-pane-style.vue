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
        <span class="tabs-pane__prefix">View:</span>
      </template>

      <SnTabPane name="a" tab="Table" tab-class="tabs-pane__tab">
        <p>Panel content gets uniform padding from <code>paneStyle</code> .</p>
        <p>Tab labels get a custom class from <code>tabClass</code> .</p>
      </SnTabPane>
      <SnTabPane name="b" tab="Chart" tab-class="tabs-pane__tab">
        <p><code>tabsPadding</code> adds padding to the whole tab bar.</p>
        <p><code>prefix</code> slot inserts a prefix element before the tab sequence.</p>
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
