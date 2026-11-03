<script setup lang="ts">
/**
 * SnProSider — admin left sidebar (left sider component of @snui/admin-layout).
 *
 * Brand (SnProLogo) + a vertical SnMenu. Collapse is consumer-driven —
 * the layout's header (or the host) owns the toggle; this piece only
 * reflects `collapsed`. `inverted` flips to the classic dark admin surface
 * and forwards the flag to SnMenu so the menu follows.
 *
 * Standalone usage (outside SnProLayout):
 *   <SnProSider :menus="menus" :active-key="active" @select="go" />
 */
import { computed } from 'vue';
import { SnMenu } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';
import SnProLogo from '../pro-logo/SnProLogo.vue';

defineOptions({ name: 'SnProSider' });

const props = withDefaults(
  defineProps<{
    /** Menu tree (static-route derived or backend-provided — see README). */
    menus?: SnMenuOption[] | undefined;
    /** Selected menu key (controlled). */
    activeKey?: string | number | null | undefined;
    /** Expanded submenu keys (forwarded to SnMenu; uncontrolled when omitted). */
    expandedKeys?: Array<string | number> | undefined;
    /** Single-open submenus. Default false. */
    accordion?: boolean | undefined;
    /** Folded state: narrow rail, brand title hidden. Default false. */
    collapsed?: boolean | undefined;
    /** Expanded width (px). Default 224. */
    width?: number | undefined;
    /** Collapsed width (px). Default 56. */
    collapsedWidth?: number | undefined;
    /** Dark admin surface; forwards to SnMenu `inverted`. Default false. */
    inverted?: boolean | undefined;
    /** Brand area props — pass through to SnProLogo. */
    logo?: string | undefined;
    /** Brand title. */
    title?: string | undefined;
    /** Fallback brand letter. */
    mark?: string | undefined;
    /** Render the brand area at all (mix/dual secondary columns turn it off). */
    showBrand?: boolean | undefined;
  }>(),
  {
    menus: () => [],
    activeKey: null,
    accordion: false,
    collapsed: false,
    width: 224,
    collapsedWidth: 56,
    inverted: false,
    logo: '',
    title: '',
    mark: 'S',
    showBrand: true,
  },
);

const emit = defineEmits<{
  (e: 'select', key: string | number | null, item: SnMenuOption): void;
  (e: 'update:expandedKeys', keys: Array<string | number>): void;
}>();

defineSlots<{
  /** Brand content replacement (forwarded to SnProLogo default slot). */
  logo?(): unknown;
}>();

/** Typed conditional bind for SnMenu's controlled expandedKeys: passing the
 * prop at all switches SnMenu to controlled mode, so it must be omitted (not
 * `undefined`) when the host didn't provide it. */
const expandedKeysProps = computed<Record<string, never> | { expandedKeys: Array<string | number> }>(() =>
  props.expandedKeys !== undefined ? { expandedKeys: props.expandedKeys } : {},
);
</script>

<template>
  <aside
    class="sn-pro-sider"
    :class="{
      'sn-pro-sider--inverted': inverted,
      'sn-pro-sider--collapsed': collapsed,
    }"
    :style="{
      '--sn-pro-sider-width': `${width}px`,
      '--sn-pro-sider-collapsed-width': `${collapsedWidth}px`,
    }"
  >
    <div v-if="showBrand" class="sn-pro-sider__brand">
      <SnProLogo :logo="logo" :title="title" :mark="mark" :collapsed="collapsed">
        <slot name="logo" />
      </SnProLogo>
    </div>
    <SnMenu
      class="sn-pro-sider__menu"
      mode="vertical"
      :options="props.menus"
      :value="props.activeKey"
      :collapsed="props.collapsed"
      :collapsed-width="props.collapsedWidth"
      :inverted="props.inverted"
      :accordion="props.accordion"
      v-bind="expandedKeysProps"
      @select="(key, item) => emit('select', key, item)"
      @update:expanded-keys="(keys) => emit('update:expandedKeys', keys)"
    />
  </aside>
</template>

<style scoped>
/*
 * Local surface hooks (AGENTS.md §112 additive pattern): any ancestor can
 * re-point them. The inverted values align with SnMenu's own inverted
 * surface so brand area and menu read as one panel.
 */
.sn-pro-sider {
  --sn-pro-sider-bg: var(--sn-web-color-background-elevated);
  --sn-pro-sider-border-color: var(--sn-web-color-border-subtle);
  --sn-pro-sider-title-color: var(--sn-web-color-text-primary);

  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-sizing: border-box;
  width: var(--sn-pro-sider-width);
  overflow: hidden;
  border-right: 1px solid var(--sn-pro-sider-border-color);
  background-color: var(--sn-pro-sider-bg);
  transition: width 180ms ease;
}

.sn-pro-sider--inverted {
  /* Aligns with the SnMenu inverted surface (n-menu classic dark sider). */
  --sn-pro-sider-bg: #001529;
  --sn-pro-sider-border-color: transparent;
  --sn-pro-sider-title-color: rgba(255, 255, 255, 0.9);

  --sn-pro-logo-title: rgba(255, 255, 255, 0.9);
}

.sn-pro-sider--collapsed {
  width: var(--sn-pro-sider-collapsed-width);
}

.sn-pro-sider__brand {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid var(--sn-pro-sider-border-color);
}

.sn-pro-sider__menu {
  flex: 1;
  overflow-y: auto;
}
</style>
