<script setup lang="ts">
/**
 * SnProLayoutStrip — internal content strip of SnProLayout (NOT public API).
 *
 * The slim bar above the content area in top/mix/dual modes: optional sider
 * collapse toggle + breadcrumb. Extracted because the same block repeated in
 * three mode templates (AGENTS.md §105 Rule of Three).
 */
import { PanelLeft } from 'lucide-vue-next';
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web';

defineOptions({ name: 'SnProLayoutStrip' });

const props = withDefaults(
  defineProps<{
    /** Render the collapse toggle (only when a collapsible sider exists). */
    showToggle?: boolean | undefined;
    /** Breadcrumb labels; the strip hides its crumb part when empty. */
    breadcrumb?: string[] | undefined;
    /** Accessible label for the toggle. Default '折叠菜单'. */
    toggleLabel?: string | undefined;
  }>(),
  {
    showToggle: false,
    breadcrumb: () => [],
    toggleLabel: '折叠菜单',
  },
);

const emit = defineEmits<{
  (e: 'toggle-collapse'): void;
}>();
</script>

<template>
  <div class="sn-pro-layout__strip">
    <button
      v-if="showToggle"
      type="button"
      class="sn-pro-layout__strip-toggle"
      :aria-label="toggleLabel"
      @click="emit('toggle-collapse')"
    >
      <PanelLeft :size="16" aria-hidden="true" />
    </button>
    <SnBreadcrumb v-if="props.breadcrumb.length > 0" class="sn-pro-layout__strip-crumb">
      <SnBreadcrumbItem v-for="item in props.breadcrumb" :key="item" :clickable="false">
        {{ item }}
      </SnBreadcrumbItem>
    </SnBreadcrumb>
  </div>
</template>

<style scoped>
.sn-pro-layout__strip {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  flex-shrink: 0;
  box-sizing: border-box;
  height: 44px;
  padding: 0 var(--sn-web-spacing-6);
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  background-color: var(--sn-web-color-background-elevated);
}

.sn-pro-layout__strip-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-md);
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
}

.sn-pro-layout__strip-toggle:hover {
  background-color: var(--sn-web-color-background-subtle);
}

.sn-pro-layout__strip-crumb {
  color: var(--sn-web-color-text-tertiary);
}
</style>
