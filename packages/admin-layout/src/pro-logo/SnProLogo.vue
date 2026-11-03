<script setup lang="ts">
/**
 * SnProLogo — admin brand mark (logo component of @snui/admin-layout).
 *
 * Layout-package piece (ADR-0006), composed with @snui/vue-web tokens only
 * (`--sn-web-*`). Purely presentational: renders a mark (image URL or a
 * letter tile) + a title that collapses away with the sider.
 *
 * Slots:
 *   - default — replaces the whole brand content (mark + title)
 *   - icon    — replaces just the mark (the title still renders)
 */
import { computed } from 'vue';

defineOptions({ name: 'SnProLogo' });

const props = withDefaults(
  defineProps<{
    /** Image URL for the mark. When absent a letter tile renders. */
    logo?: string | undefined;
    /** Brand title. Hidden while collapsed. */
    title?: string | undefined;
    /** Letter used by the fallback tile. Default 'S'. */
    mark?: string | undefined;
    /** Collapsed (sider folded) — title hidden, mark stays. Default false. */
    collapsed?: boolean | undefined;
  }>(),
  {
    logo: '',
    title: '',
    mark: 'S',
    collapsed: false,
  },
);

defineSlots<{
  /** Whole brand content replacement. */
  default?(): unknown;
  /** Mark-only replacement (image / letter tile skipped). */
  icon?(): unknown;
}>();

const showTitle = computed(() => !props.collapsed && props.title !== '');
</script>

<template>
  <div class="sn-pro-logo" :class="{ 'sn-pro-logo--collapsed': collapsed }">
    <slot>
      <slot name="icon">
        <img v-if="logo" class="sn-pro-logo__img" :src="logo" alt="" />
        <span v-else class="sn-pro-logo__mark" aria-hidden="true">{{ mark }}</span>
      </slot>
      <span v-if="showTitle" class="sn-pro-logo__title">{{ title }}</span>
    </slot>
  </div>
</template>

<style scoped>
.sn-pro-logo {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  overflow: hidden;
  white-space: nowrap;
}

.sn-pro-logo__img {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.sn-pro-logo__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--sn-web-radius-md);
  background-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
  font-weight: var(--sn-web-font-weight-bold);
}

.sn-pro-logo__title {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--sn-web-font-size-lg);
  font-weight: var(--sn-web-font-weight-semibold);
  color: var(--sn-pro-logo-title, var(--sn-web-color-text-primary));
}

.sn-pro-logo--collapsed {
  justify-content: center;
}
</style>
