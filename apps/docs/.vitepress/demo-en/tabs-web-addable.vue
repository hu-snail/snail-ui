<script setup lang="ts">
/**
 * tabs-web-addable — adding and closing tabs.
 */
import { ref } from 'vue';
import { SnTabPane, SnTabs } from '@snui/vue-web';

let seq = 3;
const active = ref('tab-1');
const tabs = ref([
  { name: 'tab-1', tab: 'Tab 1' },
  { name: 'tab-2', tab: 'Tab 2' },
]);

function onAdd(): void {
  seq += 1;
  const name = `tab-${seq}`;
  tabs.value = [...tabs.value, { name, tab: `Tab ${seq}` }];
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
        Content area of {{ t.tab }}
      </SnTabPane>
    </SnTabs>

    <p class="tabs-add__hint">
      <code>addable</code> and <code>closable</code> only apply when <code>type="card"</code> take
      effect. Adding and closing are owned by the host list; the component only emits events.
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
