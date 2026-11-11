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
      <SnTabPane name="dashboard" tab="Dashboard">Content of the "Dashboard" panel.</SnTabPane>
      <SnTabPane name="orders" tab="Orders">Content of the "Orders" panel.</SnTabPane>
      <SnTabPane name="users" tab="Users">Content of the "Users" panel.</SnTabPane>
    </SnTabs>
  </div>
</template>

<style scoped>
.tabs-demo {
  width: 100%;
  min-height: 220px;
}
</style>
