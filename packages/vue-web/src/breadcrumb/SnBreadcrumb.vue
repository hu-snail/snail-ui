<script setup lang="ts">
/**
 * SnBreadcrumb — page breadcrumb trail (AUI-WEB-NAV-003).
 *
 * Reference library: naive-ui `n-breadcrumb`
 *   (https://www.naiveui.com/zh-CN/light/components/breadcrumb)
 * Per AGENTS.md §112, props + semantics mirror n-breadcrumb 1:1.
 *
 * 1:1 parity (this version):
 *   - separator (string, default '/') — provided to descendant items
 *     via provide/inject; each SnBreadcrumbItem renders its own separator
 *     so per-item overrides work (mirrors n-breadcrumb behaviour).
 *
 * §112 future markers (doc-roadmap):
 *   - per-item `separator-location-style` for header/below display modes
 *     (n-breadcrumb removed this in a later refactor; track consumer
 *     requests before adding)
 *   - renderItem render-fn override (consumer controls label rendering)
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnBreadcrumb separator="›">
 *     <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
 *     <SnBreadcrumbItem href="/components/web">Components</SnBreadcrumbItem>
 *     <SnBreadcrumbItem>Card</SnBreadcrumbItem>
 *   </SnBreadcrumb>
 */

import { provide } from 'vue'

defineOptions({ name: 'SnBreadcrumb' })

const props = withDefaults(
  defineProps<{
    /** Separator glyph between items. Mirrors n-breadcrumb `separator`. */
    separator?: string
  }>(),
  {
    separator: '/',
  },
)

defineSlots<{
  /** Sequence of `<SnBreadcrumbItem>` children. */
  default?(): unknown
}>()

/** Provide the resolved separator ref so descendant items can read it
 *  reactively (and so per-item override picks up parent's default). */
provide('sn-breadcrumb-separator', () => props.separator)
</script>

<template>
  <nav
    class="sn-breadcrumb"
    aria-label="Breadcrumb"
  >
    <ul class="sn-breadcrumb__list">
      <slot />
    </ul>
  </nav>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-breadcrumb {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.sn-breadcrumb__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

/* Doodle skin */
.snui-skin-doodle .sn-breadcrumb-item__separator {
  font-weight: 700;
}
</style>