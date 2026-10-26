<script setup lang="ts">
/**
 * tabs-web-card-segment — SnTabs `type="card"` (boxed tabs) next to
 * `type="segment"` (segmented control), the two "filled" visual styles.
 */
import { ref } from 'vue'
import { SnTabs, SnTabPane } from '@snui/vue-web'

const cardActive = ref<string>('overview')
const segmentActive = ref<string>('day')
</script>

<template>
  <div class="tabs-demo">
    <section class="tabs-demo__block">
      <p class="tabs-demo__label">type="card"</p>
      <SnTabs v-model:value="cardActive" type="card">
        <SnTabPane name="overview" tab="Overview">Overview panel content.</SnTabPane>
        <SnTabPane name="config" tab="Config">Configuration panel content.</SnTabPane>
        <SnTabPane name="permission" tab="Permissions">Permissions panel content.</SnTabPane>
      </SnTabs>
    </section>

    <section class="tabs-demo__block">
      <p class="tabs-demo__label">type="segment"</p>
      <SnTabs v-model:value="segmentActive" type="segment">
        <SnTabPane name="day" tab="Today">Today's data.</SnTabPane>
        <SnTabPane name="week" tab="This week">This week's data.</SnTabPane>
        <SnTabPane name="month" tab="This month">This month's data.</SnTabPane>
      </SnTabs>
    </section>
  </div>
</template>

<style scoped>
.tabs-demo {
  width: 100%;
}
.tabs-demo__block + .tabs-demo__block {
  margin-top: 24px;
}
.tabs-demo__label {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
  font-family: ui-monospace, monospace;
}
</style>
