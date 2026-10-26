<script setup lang="ts">
/**
 * tabs-web-bar-width — pinning the active bar to a fixed width.
 */
import { ref } from 'vue'
import { SnTabPane, SnTabs } from '@snui/vue-web'

const natural = ref('a')
const pinned = ref('a')
</script>

<template>
  <div class="tabs-bar">
    <div class="tabs-bar__row">
      <span class="tabs-bar__cap">Default: the bar matches the tab width</span>
      <SnTabs v-model:value="natural" type="bar">
        <SnTabPane name="a" tab="Short">Content A</SnTabPane>
        <SnTabPane name="b" tab="A very long tag">Content B</SnTabPane>
        <SnTabPane name="c" tab="Middle">Content C</SnTabPane>
      </SnTabs>
    </div>

    <div class="tabs-bar__row">
      <span class="tabs-bar__cap">barWidth=32: the bar is fixed at 32px</span>
      <SnTabs v-model:value="pinned" type="bar" :bar-width="32">
        <SnTabPane name="a" tab="Short">Content A</SnTabPane>
        <SnTabPane name="b" tab="A very long tag">Content B</SnTabPane>
        <SnTabPane name="c" tab="Middle">Content C</SnTabPane>
      </SnTabs>
    </div>

    <p class="tabs-bar__hint">
      <code>barWidth</code> switches the bar from "following tab width" to a fixed value so it no longer jumps when switching.
    </p>
  </div>
</template>

<style scoped>
.tabs-bar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
.tabs-bar__row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tabs-bar__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.tabs-bar__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
