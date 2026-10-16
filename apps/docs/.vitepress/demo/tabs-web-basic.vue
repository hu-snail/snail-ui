<script setup lang="ts">
/**
 * tabs-web-basic — SnTabs default `type="bar"` with three panes and a
 * `v-model:value` binding. Shows the default visual style.
 */
import { ref } from 'vue'
import { SnTabs, SnTabPane } from '@snui/vue-web'

const active = ref<string>('overview')
</script>

<template>
  <div class="tabs-demo">
    <SnTabs v-model:value="active">
      <SnTabPane name="overview" tab="概览">
        端云一组功能、组件清单、Token 用法一览。
      </SnTabPane>
      <SnTabPane name="architecture" tab="架构">
        pnpm workspace + 双端别名包，web 消费 <code>--sn-web-*</code>。
      </SnTabPane>
      <SnTabPane name="faq" tab="FAQ">
        常见问题与迁移说明。
      </SnTabPane>
    </SnTabs>
    <p class="tabs-demo__state">当前：<code>{{ active }}</code></p>
  </div>
</template>

<style scoped>
.tabs-demo {
  width: 100%;
}
.tabs-demo__state {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.tabs-demo__state code {
  background: var(--sn-web-color-background-subtle);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
