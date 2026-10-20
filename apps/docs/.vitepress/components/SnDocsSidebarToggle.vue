<script setup lang="ts">
/**
 * SnDocsSidebarToggle — collapse / expand the left docs sidebar.
 *
 * Rendered in two places, both driven by the shared `useSidebarCollapse()`
 * state so they can never disagree:
 *
 *   - inside `VPSidebar` via `#sidebar-nav-before` (theme/Layout.vue), where
 *     it reads as "collapse"; it disappears together with the sidebar itself
 *   - inside SnDocsNav while collapsed, so the sidebar can be brought back
 *
 * The icon/label follow the *action*, not the placement: on the expanded
 * sidebar it offers "收起", and once collapsed the surviving navbar control
 * offers "展开".
 */

import { computed } from 'vue'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { SnButton, SnIcon } from '@snui/vue-web'
import { useSidebarCollapse } from '../utils/sidebar-collapse'

const { collapsed, toggle } = useSidebarCollapse()

const label = computed<string>(() => (collapsed.value ? '展开左侧菜单' : '收起左侧菜单'))
</script>

<template>
  <SnButton
    class="sn-docs-sidebar-toggle"
    size="small"
    :aria-label="label"
    :aria-expanded="!collapsed"
    :title="label"
    @click="toggle"
  >
    <SnIcon
      class="sn-docs-sidebar-toggle__icon"
      :icon="collapsed ? PanelLeftOpen : PanelLeftClose"
    />
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
</style>
