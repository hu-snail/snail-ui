<script setup lang="ts">
/**
 * tabs-web-placement-left — SnTabs `placement="left"` (vertical strip).
 */
import { ref } from 'vue';
import { SnTabs, SnTabPane } from '@snui/vue-web';

const active = ref<string>('dashboard');
</script>

<template>
  <div class="tabs-demo">
    <SnTabs v-model:value="active" type="line" placement="left">
      <SnTabPane name="dashboard" tab="仪表盘">「仪表盘」面板内容。</SnTabPane>
      <SnTabPane name="orders" tab="订单">「订单」面板内容。</SnTabPane>
      <SnTabPane name="users" tab="用户">「用户」面板内容。</SnTabPane>
    </SnTabs>
  </div>
</template>

<style scoped>
.tabs-demo {
  width: 100%;
  min-height: 220px;
}
</style>
