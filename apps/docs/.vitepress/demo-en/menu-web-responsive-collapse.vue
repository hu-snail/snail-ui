<script setup lang="ts">
/**
 * menu-web-responsive-collapse — SnMenu `breakpoint` responsive collapse.
 *
 * Per the docs, set `breakpoint` to enable automatic collapse when the
 * viewport inner-width is strictly less than the threshold. The component
 * mirrors the current viewport across the threshold via a window resize
 * listener and emits `update:collapsed` so the consumer can persist the
 * state via `v-model:collapsed`. Named breakpoints resolve to px thresholds:
 *   xs=480  sm=768  md=992  lg=1200  xl=1920  (px)
 *
 * The stage below uses CSS `max-width` with a manual toggle to simulate
 * the narrow viewport — the menu inside collapses automatically when the
 * stage's rendered width drops below 992px.
 */
import { ref } from 'vue'
import { markRaw } from 'vue'
import { SnMenu } from '@snui/vue-web'
import type { SnMenuOption } from '@snui/vue-web'
import {
  LayoutGrid, Sun, Lightbulb,
} from 'lucide-vue-next'

const active = ref<string | number | null>('m1-2')
// Two-way bound so we can render the effective state below + let the user
// override the auto-collapse behavior if they want.
const collapsed = ref(false)
const stageWidth = ref(1024)
// Pre-open Navigation 1 so the demo shows the expanded menu (submenu
// items rendered inline) at viewport >= md breakpoint — matches the
// responsive-collapse behavior documented in menu.md.
const expanded = ref<Array<string | number>>(['n1'])

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
]

function toggleStage(): void {
  // Toggle between narrow (< md breakpoint) and wide.
  stageWidth.value = stageWidth.value <= 600 ? 1024 : 500
}
</script>

<template>
  <div class="sn-menu-responsive-collapse-demo">
    <div
      class="sn-menu-responsive-collapse-demo__stage"
      :style="{ maxWidth: stageWidth + 'px' }"
    >
      <SnMenu
        mode="vertical"
        :options="items"
        v-model:value="active"
        v-model:collapsed="collapsed"
        v-model:expanded-keys="expanded"
        breakpoint="md"
        :collapsed-width="64"
        :collapsed-icon-size="22"
      />
    </div>
    <p class="sn-menu-responsive-collapse-demo__hint">
      Settings <code>breakpoint="md"</code>(992px) for responsive collapsing. When the container width drops below the breakpoint, the menu auto-collapses into an icon-only sidebar; two-way state sync via <code>v-model:collapsed</code> .
    </p>
    <div class="sn-menu-responsive-collapse-demo__controls">
      <button
        type="button"
        class="sn-menu-responsive-collapse-demo__toggle"
        @click="toggleStage"
      >
        <span aria-hidden="true">≡</span>
      </button>
      <span class="sn-menu-responsive-collapse-demo__state">
        Container width:<code>{{ stageWidth }}px</code> · Collapsed:<code>{{ collapsed ? 'Yes' : 'No' }}</code> · Expand:<code>{{ expanded.join(', ') }}</code>
      </span>
    </div>
  </div>
</template>

<style scoped>
.sn-menu-responsive-collapse-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.sn-menu-responsive-collapse-demo__stage {
  width: 100%;
  /* Right padding leaves room for the hover popover when collapsed. */
  padding: 16px 220px 16px 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  transition: max-width 0.3s ease;
}
.sn-menu-responsive-collapse-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-align: left;
  width: 100%;
}
.sn-menu-responsive-collapse-demo__hint code {
  background: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
.sn-menu-responsive-collapse-demo__controls {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.sn-menu-responsive-collapse-demo__toggle {
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-1);
}
.sn-menu-responsive-collapse-demo__toggle:hover {
  background: var(--vp-c-bg-soft);
}
.sn-menu-responsive-collapse-demo__state {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.sn-menu-responsive-collapse-demo__state code {
  background: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>