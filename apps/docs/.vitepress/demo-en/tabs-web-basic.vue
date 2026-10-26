<script setup lang="ts">
/**
 * tabs-web-basic — SnTabs default `type="bar"` with three panes and a
 * `v-model:value` binding. Shows the default visual style.
 */
import { ref } from 'vue';
import { SnTabs, SnTabPane } from '@snui/vue-web';

const active = ref<string>('overview');
</script>

<template>
  <div class="tabs-demo">
    <SnTabs v-model:value="active">
      <SnTabPane name="overview" tab="Overview">
        Edge-cloud features, the component list, and a Token usage overview.
      </SnTabPane>
      <SnTabPane name="architecture" tab="Architecture">
        pnpm workspace + dual-platform alias packages; web consumes <code>--sn-web-*</code>。
      </SnTabPane>
      <SnTabPane name="faq" tab="FAQ"> FAQ and migration notes. </SnTabPane>
    </SnTabs>
    <p class="tabs-demo__state">
      Current:<code>{{ active }}</code>
    </p>
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
