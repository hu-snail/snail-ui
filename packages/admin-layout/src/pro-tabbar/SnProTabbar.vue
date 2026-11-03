<script setup lang="ts">
/**
 * SnProTabbar — visited-route tab strip of @snui/admin-layout.
 *
 * A thin wrapper over @snui/vue-web SnTabs: routed content renders in the
 * layout's content area, not inside the tabs, so the pane layer is hidden
 * and only the strip is kept. Clicking a tab is event-driven — the HOST
 * navigates; per-item `closable: false` pins affix tabs (no close button).
 */
import { computed } from 'vue';
import { SnTabPane, SnTabs } from '@snui/vue-web';
import type { SnProTabItem, SnProTabType } from '../pro-layout/sn-pro-layout-types';

defineOptions({ name: 'SnProTabbar' });

const props = withDefaults(
  defineProps<{
    /** Visited-route entries, in visit order. */
    tabs?: SnProTabItem[] | undefined;
    /** Active tab key (controlled, `v-model:activeKey`). Accepts the host's
     * route-name key verbatim — numeric route names simply match no tab. */
    activeKey?: string | number | null | undefined;
    /** Strip visual style. Default 'chrome'. */
    type?: SnProTabType | undefined;
  }>(),
  {
    tabs: () => [],
    activeKey: null,
    type: 'chrome',
  },
);

const emit = defineEmits<{
  (e: 'update:activeKey', key: string): void;
  (e: 'close', key: string): void;
}>();

// Typed conditional bind: only a real tab value may reach SnTabs' controlled
// `value`; null/undefined must stay absent so SnTabs keeps its own default.
const valueProps = computed<Record<string, never> | { value: string | number }>(() =>
  typeof props.activeKey === 'string' || typeof props.activeKey === 'number'
    ? { value: props.activeKey }
    : {},
);
</script>

<template>
  <SnTabs
    class="sn-pro-tabbar"
    :type="props.type"
    size="small"
    closable
    pane-wrapper-style="display: none"
    v-bind="valueProps"
    @update:value="(key) => emit('update:activeKey', String(key))"
    @close="(key) => emit('close', String(key))"
  >
    <SnTabPane
      v-for="tab in props.tabs"
      :key="tab.key"
      :name="tab.key"
      :tab="tab.label"
      :closable="tab.closable !== false"
    />
  </SnTabs>
</template>

<style scoped>
.sn-pro-tabbar {
  flex-shrink: 0;
  padding: 0 var(--sn-web-spacing-4);
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  background-color: var(--sn-web-color-background-elevated);
}
</style>
