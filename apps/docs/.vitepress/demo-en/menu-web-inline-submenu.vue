<script setup lang="ts">
/**
 * menu-web-inline-submenu — SnMenu vertical mode with nested submenus +
 * `defaultExpandedKeys` (a.k.a. `openKeys` in some libraries) for the
 * initial open submenu set + `disabled` per item.
 *
 * Per the docs: pass `defaultExpandedKeys` to set which submenus are open
 * by default. The Menu 3 leaf in Navigation 1 is `disabled: true` — it
 * renders greyed-out and emits nothing on click.
 */
import { ref } from 'vue';
import { markRaw } from 'vue';
import { SnMenu } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';
import { LayoutGrid, Sun, Lightbulb } from 'lucide-vue-next';

const active = ref<string | number | null>('m1-2');
const expanded = ref<Array<string | number>>(['n1', 'n2']);
const collapsed = ref(false);

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
  <div class="sn-menu-inline-submenu-demo">
    <div class="sn-menu-inline-submenu-demo__stage">
      <SnMenu
        mode="vertical"
        :options="items"
        v-model:value="active"
        v-model:expanded-keys="expanded"
        :collapsed="collapsed"
      />
    </div>
    <p class="sn-menu-inline-submenu-demo__hint">
      A menu can nest sub-items — <code>defaultExpandedKeys</code>(often written as
      <code>openKeys</code>in the docs) sets the default expanded sub-items.
    </p>
    <div class="sn-menu-inline-submenu-demo__controls">
      <button
        type="button"
        class="sn-menu-inline-submenu-demo__toggle"
        @click="collapsed = !collapsed"
      >
        <span aria-hidden="true">≡</span>
      </button>
      <span class="sn-menu-inline-submenu-demo__state">
        Collapsed:<code>{{ collapsed ? 'Yes' : 'No' }}</code> · Expand:<code>{{
          expanded.join(', ')
        }}</code>
      </span>
    </div>
  </div>
</template>

<style scoped>
.sn-menu-inline-submenu-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.sn-menu-inline-submenu-demo__stage {
  width: 100%;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
}
.sn-menu-inline-submenu-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-align: left;
  width: 100%;
}
.sn-menu-inline-submenu-demo__hint code {
  background: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
.sn-menu-inline-submenu-demo__controls {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sn-menu-inline-submenu-demo__toggle {
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-1);
}
.sn-menu-inline-submenu-demo__toggle:hover {
  background: var(--vp-c-bg-soft);
}
.sn-menu-inline-submenu-demo__state {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.sn-menu-inline-submenu-demo__state code {
  background: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
