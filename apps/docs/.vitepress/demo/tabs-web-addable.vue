<script setup lang="ts">
/**
 * tabs-web-addable — adding and closing tabs.
 */
import { ref } from 'vue';
import { SnTabPane, SnTabs } from '@snui/vue-web';

let seq = 3;
const active = ref('tab-1');
const tabs = ref([
  { name: 'tab-1', tab: '标签一' },
  { name: 'tab-2', tab: '标签二' },
]);

function onAdd(): void {
  seq += 1;
  const name = `tab-${seq}`;
  tabs.value = [...tabs.value, { name, tab: `标签${seq}` }];
  active.value = name;
}

function onClose(name: string | number): void {
  const idx = tabs.value.findIndex((t) => t.name === name);
  if (idx < 0) return;
  tabs.value = tabs.value.filter((t) => t.name !== name);
  // Move the selection to a neighbour so the strip never goes empty-active.
  const next = tabs.value[idx] ?? tabs.value[idx - 1];
  if (next) active.value = next.name;
}
</script>

<template>
  <div class="tabs-add">
    <SnTabs v-model:value="active" type="card" closable addable @add="onAdd" @close="onClose">
      <SnTabPane v-for="t in tabs" :key="t.name" :name="t.name" :tab="t.tab">
        {{ t.tab }}的内容区域
      </SnTabPane>
    </SnTabs>

    <p class="tabs-add__hint">
      <code>addable</code> 与 <code>closable</code> 只在 <code>type="card"</code> 时生效。
      新增与关闭都由宿主维护列表，组件只发出事件。
    </p>
  </div>
</template>

<style scoped>
.tabs-add {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}
.tabs-add__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
