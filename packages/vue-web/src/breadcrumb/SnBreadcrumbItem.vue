<script setup lang="ts">
/**
 * SnBreadcrumbItem — leaf / separator-aware breadcrumb child (AUI-WEB-NAV-003).
 *
 * Reference library: naive-ui `n-breadcrumb-item`. Per AGENTS.md §112, prop
 * names + slot shape mirror the reference child component.
 */

defineOptions({ name: 'SnBreadcrumbItem' })

const props = withDefaults(
  defineProps<{
    /** When set, renders as <a href> (mirrors n-breadcrumb-item `href`). */
    href?: string
    /** When true, the final segment is rendered without a trailing separator
     * (handled by SnBreadcrumb parent). */
    isLast?: boolean
  }>(),
  {
    href: '',
    isLast: false,
  },
)
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    :href="href || undefined"
    :class="['sn-breadcrumb-item', isLast ? 'sn-breadcrumb-item--last' : '']"
  >
    <slot />
  </component>
</template>

<style scoped>
.sn-breadcrumb-item {
  color: var(--sn-web-color-text-secondary);
  text-decoration: none;
}
.sn-breadcrumb-item:hover {
  color: var(--sn-web-color-text-primary);
}
.sn-breadcrumb-item--last {
  color: var(--sn-web-color-text-primary);
  font-weight: 500;
}
</style>