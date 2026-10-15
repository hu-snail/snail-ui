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
        <SnTabPane name="overview" tab="概览">概览面板内容。</SnTabPane>
        <SnTabPane name="config" tab="配置">配置面板内容。</SnTabPane>
        <SnTabPane name="permission" tab="权限">权限面板内容。</SnTabPane>
      </SnTabs>
    </section>

    <section class="tabs-demo__block">
      <p class="tabs-demo__label">type="segment"</p>
      <SnTabs v-model:value="segmentActive" type="segment">
        <SnTabPane name="day" tab="今日">今日数据。</SnTabPane>
        <SnTabPane name="week" tab="本周">本周数据。</SnTabPane>
        <SnTabPane name="month" tab="本月">本月数据。</SnTabPane>
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
  color: var(--vp-c-text-2);
  font-family: ui-monospace, monospace;
}
</style>
