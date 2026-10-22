<script setup lang="ts">
/**
 * tabs-web-size — the three size tiers.
 */
import { ref } from 'vue'
import { SnTabPane, SnTabs } from '@snui/vue-web'

const small = ref('a')
const medium = ref('a')
const large = ref('a')
</script>

<template>
  <div class="tabs-size">
    <div class="tabs-size__row">
      <span class="tabs-size__cap">size="small"</span>
      <SnTabs v-model:value="small" size="small" type="line">
        <SnTabPane name="a" tab="Overview">Overview content</SnTabPane>
        <SnTabPane name="b" tab="Config">Config content</SnTabPane>
        <SnTabPane name="c" tab="Logs">Log content</SnTabPane>
      </SnTabs>
    </div>

    <div class="tabs-size__row">
      <span class="tabs-size__cap">size="medium" (default)</span>
      <SnTabs v-model:value="medium" size="medium" type="line">
        <SnTabPane name="a" tab="Overview">Overview content</SnTabPane>
        <SnTabPane name="b" tab="Config">Config content</SnTabPane>
        <SnTabPane name="c" tab="Logs">Log content</SnTabPane>
      </SnTabs>
    </div>

    <div class="tabs-size__row">
      <span class="tabs-size__cap">size="large"</span>
      <SnTabs v-model:value="large" size="large" type="line">
        <SnTabPane name="a" tab="Overview">Overview content</SnTabPane>
        <SnTabPane name="b" tab="Config">Config content</SnTabPane>
        <SnTabPane name="c" tab="Logs">Log content</SnTabPane>
      </SnTabs>
    </div>
  </div>
</template>

<style scoped>
.tabs-size {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
.tabs-size__row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tabs-size__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
