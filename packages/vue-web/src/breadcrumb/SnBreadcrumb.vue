<script setup lang="ts">
/**
 * SnBreadcrumb — page breadcrumb trail (AUI-WEB-NAV-003).
 *
 * Reference library: naive-ui `n-breadcrumb`
 *   (https://www.naiveui.com/zh-CN/light/components/breadcrumb)
 * Per AGENTS.md §112, prop names + slot shape mirror n-breadcrumb 1:1.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnBreadcrumb separator="/">
 *     <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
 *     <SnBreadcrumbItem href="/components/web">Components</SnBreadcrumbItem>
 *     <SnBreadcrumbItem>Card</SnBreadcrumbItem>
 *   </SnBreadcrumb>
 */

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

/** Recursively render children, marking the final item `isLast`. */
const childrenCount = (): number => {
  const nodes = (props as unknown as { $slots?: unknown }).$slots
  return 0
}
// Slot content is opaque at <script setup> runtime; we use a render-less
// approach by letting SnBreadcrumbItem consumers pass the children, then
// rendering the wrapper via render slots.
</script>

<template>
  <nav
    class="sn-breadcrumb"
    aria-label="Breadcrumb"
  >
    <ol class="sn-breadcrumb__list">
      <li
        v-for="(child, i) in $slots.default?.() ?? []"
        :key="i"
        class="sn-breadcrumb__item"
      >
        <component :is="child" />
        <span
          v-if="i < ($slots.default?.() ?? []).length - 1"
          class="sn-breadcrumb__separator"
          aria-hidden="true"
        >{{ separator }}</span>
      </li>
    </ol>
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
  gap: 4px;
}

.sn-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.sn-breadcrumb__separator {
  margin: 0 6px;
  color: var(--sn-web-color-text-secondary);
  opacity: 0.6;
}

/* Doodle skin */
.snui-skin-doodle .sn-breadcrumb__separator {
  font-weight: 700;
}
</style>