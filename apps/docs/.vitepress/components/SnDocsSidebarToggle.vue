<script setup lang="ts">
/**
 * SnDocsSidebarToggle — collapse / expand the left docs sidebar.
 *
 * One control, one place: `placement="handle"` renders the tab that is glued
 * to the sidebar's LEFT edge (viewport x = 16px, the floating panel's own
 * left edge) and stays there in both states — collapsing turns the same tab
 * into the expand affordance instead of moving the control somewhere else
 * (a button at the navbar's left was easy to miss). Driven by the shared
 * `useSidebarCollapse()` state, mirrored onto `<html class="sn-sidebar-collapsed">`
 * for custom.css §12 to animate the panel slide.
 *
 * `placement="navbar"` is the inline control for the navbar band; the icon
 * and label always follow the *action* ("收起" while expanded, "展开" once
 * collapsed), and the chevron points the way the panel will travel.
 */

import { computed } from 'vue';
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next';
import { SnButton, SnIcon } from '@snui/vue-web';
import { useSidebarCollapse } from '../utils/sidebar-collapse';

const props = withDefaults(defineProps<{ placement?: 'navbar' | 'handle' }>(), {
  placement: 'navbar',
});

const { collapsed, toggle } = useSidebarCollapse();

const label = computed<string>(() => (collapsed.value ? '展开左侧菜单' : '收起左侧菜单'));

/** A narrow border tab reads better with a plain chevron than with the
 * panel glyphs used by the roomy navbar button. */
const icon = computed(() =>
  props.placement === 'handle'
    ? collapsed.value
      ? ChevronRight
      : ChevronLeft
    : collapsed.value
      ? PanelLeftOpen
      : PanelLeftClose,
);
</script>

<template>
  <SnButton
    class="sn-docs-sidebar-toggle"
    :class="[
      `sn-docs-sidebar-toggle--${placement}`,
      { 'sn-docs-sidebar-toggle--collapsed': collapsed },
    ]"
    size="small"
    :aria-label="label"
    :aria-expanded="!collapsed"
    :title="label"
    @click="toggle"
  >
    <SnIcon class="sn-docs-sidebar-toggle__icon" :icon="icon" />
  </SnButton>
</template>

<style scoped>
/* Quiet icon-only ghost button, matching the navbar action buttons. */
.sn-docs-sidebar-toggle {
  width: 32px;
  height: 32px;
  min-width: 32px;
  padding: 0;
  border-color: transparent;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
}
.sn-docs-sidebar-toggle:hover:not(.sn-button--disabled) {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}
.sn-docs-sidebar-toggle__icon {
  width: var(--sn-web-icon-size-medium);
  height: var(--sn-web-icon-size-medium);
}
.sn-docs-sidebar-toggle__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

/* Right-edge riding tab: a half-pill whose flat edge sits on the panel's
  * right border (expanded), rounded into the article gutter. Collapsed:
  * the panel has slid away, so the left edge is restored and both corners
  * round off — the tab reads as a free-standing grabber. */
.sn-docs-sidebar-toggle--handle {
  width: 20px;
  min-width: 20px;
  height: 44px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-left: none;
  border-radius: 0 10px 10px 0;
  background: var(--vp-c-bg);
  color: var(--sn-web-color-text-secondary);
  /* 图标方向切换 / 折叠态补边都不该有跳变。 */
  transition:
    border-radius 0.24s ease,
    border-color 0.16s ease,
    color 0.16s ease;
}

/* 折叠态：面板已滑出，手柄贴回左缘后右侧有了面板边可贴 —— 补回左侧
 * 1px 边并收圆两侧，读作一枚独立的抓手。 */
.sn-docs-sidebar-toggle--handle.sn-docs-sidebar-toggle--collapsed {
  border-left: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

/* 提升可发现性：悬停时向面板方向微微一推 + 图标染主题色。 */
.sn-docs-sidebar-toggle--handle:hover:not(.sn-button--disabled) {
  border-color: var(--sn-web-color-action-primary, var(--vp-c-brand-1));
  color: var(--sn-web-color-action-primary, var(--vp-c-brand-1));
  background: var(--vp-c-bg);
}

.sn-docs-sidebar-toggle--handle .sn-docs-sidebar-toggle__icon {
  width: 14px;
  height: 14px;
}
</style>
