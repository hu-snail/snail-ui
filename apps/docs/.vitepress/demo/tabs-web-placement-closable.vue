<script setup lang="ts">
/**
 * tabs-web-placement-closable — SnTabs `placement="left"` (vertical strip)
 * with `closable` tabs and an `addable` "+" tab. Wires the close / add
 * events to a local list so the demo is self-contained.
 */
import { ref } from 'vue';
import { SnTabs, SnTabPane } from '@snui/vue-web';

interface TabItem {
  name: string;
  label: string;
}

const tabs = ref<TabItem[]>([
  { name: 'dashboard', label: '仪表盘' },
  { name: 'orders', label: '订单' },
  { name: 'users', label: '用户' },
]);

const active = ref<string>('dashboard');
let seq = 0;

function handleClose(name: string | number) {
  const index = tabs.value.findIndex((item) => item.name === name);
  if (index === -1) return;
  tabs.value.splice(index, 1);
  if (active.value === name) {
    active.value = tabs.value[Math.max(0, index - 1)]?.name ?? '';
  }
}

function handleAdd() {
  seq += 1;
  const name = `new-${seq}`;
  tabs.value.push({ name, label: `新标签 ${seq}` });
  active.value = name;
}
</script>

<template>
  <div class="tabs-demo">
    <SnTabs
      v-model:value="active"
      type="line"
      placement="left"
      closable
      addable
      @close="handleClose"
      @add="handleAdd"
    >
      <SnTabPane v-for="item in tabs" :key="item.name" :name="item.name" :tab="item.label">
        「{{ item.label }}」面板内容。
      </SnTabPane>
    </SnTabs>
  </div>
</template>

<style scoped>
.tabs-demo {
  width: 100%;
  min-height: 220px;
}
</style>
