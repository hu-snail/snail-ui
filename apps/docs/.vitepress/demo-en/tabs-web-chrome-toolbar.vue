<script setup lang="ts">
/**
 * tabs-web-chrome-toolbar — `type="chrome"` composed with the strip's
 * `prefix` / `suffix` slots: the browser navigation affordances sit before
 * the tabs and the end-of-strip icons after the trailing `+`, exactly like a
 * browser window's tab row.
 */
import { ref } from 'vue';
import { ArrowLeft, ArrowRight, RotateCw, Star } from 'lucide-vue-next';
import { SnIcon, SnTabs, SnTabPane } from '@snui/vue-web';

const active = ref<string>('home');
</script>

<template>
  <div class="tabs-demo">
    <SnTabs v-model:value="active" type="chrome" addable>
      <template #prefix>
        <span class="tabs-demo__nav-actions" aria-hidden="true">
          <SnIcon :icon="ArrowLeft" :size="14" />
          <SnIcon :icon="ArrowRight" :size="14" />
          <SnIcon :icon="RotateCw" :size="14" />
        </span>
      </template>
      <template #suffix>
        <span class="tabs-demo__nav-actions" aria-hidden="true">
          <SnIcon :icon="Star" :size="14" />
        </span>
      </template>

      <SnTabPane name="home" tab="Home"
        >A browser tab row: navigation actions on the left, the star on the right.</SnTabPane
      >
      <SnTabPane name="token" tab="Token"
        >Theme / style pack / density as three independent dimensions.</SnTabPane
      >
      <SnTabPane name="disabled" tab="Disabled" disabled
        >A disabled tab cannot be activated.</SnTabPane
      >
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
.tabs-demo__nav-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 7px;
  color: var(--sn-web-color-text-tertiary);
}
.tabs-demo__state {
  margin: 16px 0 0;
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
