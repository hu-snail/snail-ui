<script setup lang="ts">
/**
 * menu-web-collapsed-inline — SnMenu `collapsed` mode + manual toggle.
 *
 * Per the docs, set `collapsed` to specify the menu's collapsed state.
 * A blue toggle button at the top of the stage drives the v-model; in
 * collapsed mode the menu renders an icon-only vertical bar (icons from
 * the SnIcon registry / lucide-vue-next), and items with children show
 * their sub-tree in a CSS hover popover anchored to the right.
 *
 * Use cases: dashboard sidebars that the user can fold away to reclaim
 * horizontal space.
 */
import { ref } from 'vue';
import { markRaw } from 'vue';
import { SnMenu } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';
import { LayoutGrid, Sun, Lightbulb } from 'lucide-vue-next';

const active = ref<string | number | null>('m1-2');
const collapsed = ref(true);

const items: SnMenuOption[] = [
  {
    key: 'n1',
    label: 'Navigation 1',
    icon: markRaw(LayoutGrid),
    children: [
      { key: 'm1-1', label: 'Menu 1' },
      { key: 'm1-2', label: 'Menu 2' },
      { key: 'm1-3', label: 'Menu 3', disabled: true },
      { key: 'm1-4', label: 'Menu 4' },
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
  <div class="sn-menu-collapsed-inline-demo">
    <div class="sn-menu-collapsed-inline-demo__toolbar">
      <button
        type="button"
        class="sn-menu-collapsed-inline-demo__toggle"
        :aria-pressed="collapsed"
        @click="collapsed = !collapsed"
      >
        <span aria-hidden="true">{{ collapsed ? 'Expand' : 'Collapse' }}</span>
      </button>
    </div>
    <div class="sn-menu-collapsed-inline-demo__stage">
      <SnMenu
        mode="vertical"
        :options="items"
        v-model:value="active"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        inverted
      />
    </div>
    <p class="sn-menu-collapsed-inline-demo__hint">
      Customize <code>collapsed</code> to collapse the menu. When collapsed, only icons show and
      submenus open as popovers on hover.
    </p>
  </div>
</template>

<style scoped>
.sn-menu-collapsed-inline-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.sn-menu-collapsed-inline-demo__toolbar {
  display: flex;
  /* Center the toggle within the same column as the menu bar so the
   * "drives collapsed" affordance visually belongs to the bar. */
  justify-content: flex-start;
  width: 100%;
}
.sn-menu-collapsed-inline-demo__toggle {
  /* Material 3 filled tonal button */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: var(--sn-web-color-action-primary, #1677ff);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.sn-menu-collapsed-inline-demo__toggle:hover {
  background: color-mix(in srgb, var(--sn-web-color-action-primary, #1677ff) 88%, transparent);
}
.sn-menu-collapsed-inline-demo__toggle:focus-visible {
  outline: 2px solid var(--sn-web-color-action-primary, #1677ff);
  outline-offset: 2px;
}

.sn-menu-collapsed-inline-demo__stage {
  width: 100%;
  /* Right padding leaves room for the hover popover (popover width ~180px
   * + 8px offset from the menu's right edge) so the popover isn't clipped
   * by the stage's edge. The menu bar sits flush at the start of the
   * stage; the stage is left-aligned within the demo (not centered). */
  padding: 12px 220px 12px 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.sn-menu-collapsed-inline-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-align: left;
  width: 100%;
}
.sn-menu-collapsed-inline-demo__hint code {
  background: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
