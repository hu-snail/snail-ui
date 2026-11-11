<script setup lang="ts">
/**
 * Demo: SnMenu — per-item `disabled`.
 *
 * The Menu 3 leaf in Navigation 1 is `disabled: true` — it renders
 * greyed-out and emits nothing on click.
 */
import { ref } from 'vue';
import { markRaw } from 'vue';
import { SnMenu } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';
import { LayoutGrid, Sun, Lightbulb } from 'lucide-vue-next';

const active = ref<string | number | null>('m1-2');
const expanded = ref<Array<string | number>>(['n1']);

const items: SnMenuOption[] = [
  { key: 'm-top', label: 'Menu 1' },
  {
    key: 'n1',
    label: 'Navigation 1',
    icon: markRaw(LayoutGrid),
    children: [
      { key: 'm1-1', label: 'Menu 1' },
      { key: 'm1-2', label: 'Menu 2' },
      { key: 'm1-3', label: 'Menu 3', disabled: true },
    ],
  },
  {
    key: 'n2',
    label: 'Navigation 2',
    icon: markRaw(Sun),
    children: [
      { key: 'm2-1', label: 'Menu 1' },
      { key: 'm2-2', label: 'Menu 2' },
      { key: 'm2-3', label: 'Menu 3' },
    ],
  },
  {
    key: 'n3',
    label: 'Navigation 3',
    icon: markRaw(Lightbulb),
  },
];
</script>

<template>
  <div class="sn-menu-disabled-item-demo">
    <div class="sn-menu-disabled-item-demo__stage">
      <SnMenu
        mode="vertical"
        :options="items"
        v-model:value="active"
        v-model:expanded-keys="expanded"
      />
    </div>
    <p class="sn-menu-disabled-item-demo__hint">
      选项上设置 <code>disabled: true</code>：菜单项置灰、不可选中，点击不触发
      <code>update:value</code> / <code>select</code>。
    </p>
  </div>
</template>

<style scoped>
.sn-menu-disabled-item-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.sn-menu-disabled-item-demo__stage {
  width: 100%;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
}
.sn-menu-disabled-item-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-align: left;
  width: 100%;
}
.sn-menu-disabled-item-demo__hint code {
  background: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
