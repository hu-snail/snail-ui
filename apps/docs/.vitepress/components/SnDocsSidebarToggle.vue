<script setup lang="ts">
/**
 * SnDocsSidebarToggle — collapse / expand the left docs sidebar.
 *
 * Two placements, both driven by the shared `useSidebarCollapse()` state so
 * they can never disagree:
 *
 *   - `placement="handle"`: the tab that rides the sidebar's right border
 *     line, vertically centred (theme/Layout.vue mounts it through the
 *     `layout-top` slot, i.e. *outside* VPSidebar — that element is
 *     `overflow: hidden` and carries a transform, so a child of it would be
 *     clipped at the border and positioned against the sidebar box rather
 *     than the viewport). custom.css §12 gates its visibility: desktop only,
 *     only while a sidebar is rendered, and only while it is expanded.
 *   - `placement="navbar"` (default): the matching expand control inside
 *     SnDocsNav, which renders only while collapsed.
 *
 * The icon/label follow the *action*, not the placement: on the expanded
 * sidebar it offers "收起", and once collapsed the surviving navbar control
 * offers "展开".
 */

import { computed } from 'vue'
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { SnButton, SnIcon } from '@snui/vue-web'
import { useSidebarCollapse } from '../utils/sidebar-collapse'

const props = withDefaults(defineProps<{ placement?: 'navbar' | 'handle' }>(), {
  placement: 'navbar',
})

const { collapsed, toggle } = useSidebarCollapse()

const label = computed<string>(() => (collapsed.value ? '展开左侧菜单' : '收起左侧菜单'))

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
)
</script>

<template>
  <SnButton
    class="sn-docs-sidebar-toggle"
    :class="`sn-docs-sidebar-toggle--${placement}`"
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

/* Border-line tab: a half-pill whose flat edge sits on the sidebar's own
 * `border-right`, rounded into the article gutter. The 1px left border is
 * dropped so it never doubles the sidebar's. */
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
}
.sn-docs-sidebar-toggle--handle:hover:not(.sn-button--disabled) {
  background: var(--vp-c-bg-soft);
  color: var(--sn-web-color-text-primary);
}
.sn-docs-sidebar-toggle--handle .sn-docs-sidebar-toggle__icon {
  width: 14px;
  height: 14px;
}
</style>
