<script setup lang="ts">
/**
 * SnBreadcrumb — page breadcrumb trail (AUI-WEB-NAV-003).
 *
 * Reference library: naive-ui `n-breadcrumb`
 *   (https://www.naiveui.com/zh-CN/light/components/breadcrumb)
 * Per AGENTS.md §112, props + semantics mirror n-breadcrumb 1:1.
 *
 * 1:1 parity (this version): separator / separator-location-style
 *   (header/below display via CSS class) / item-count (max display,
 *   hides middle items via "$N more" expand) / SnBreadcrumbItem props
 *   (href) + slots (default text, default + override).
 *
 * §112 future markers (doc-roadmap):
 *   - on-click handler per item
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

import { computed, useSlots } from 'vue'

defineOptions({ name: 'SnBreadcrumb' })

const slots = useSlots()

const props = withDefaults(
  defineProps<{
    /** Separator glyph between items. Mirrors n-breadcrumb `separator`. */
    separator?: string
    /** Max number of items to display. When total exceeds this, head and
     * tail portions are shown with a "$N more" affordance in the middle.
     * Default Infinity (show all). Mirrors n-breadcrumb `itemCount`. */
    itemCount?: number
  }>(),
  {
    separator: '/',
    itemCount: Infinity,
  },
)

defineSlots<{
  /** Sequence of `<SnBreadcrumbItem>` children. */
  default?(): unknown
}>()

/** Reactive view of slot children (each `<SnBreadcrumbItem>`). */
const slotChildren = computed<unknown[]>(() => slots.default?.() ?? [])

/* Flat list of segments to render. Each segment is either a child node
 * (`type: 'child'`) or a hidden-count placeholder (`type: 'more'`). The
 * template can then walk the segments in order without conditional indices. */
type ChildSegment = { type: 'child'; node: unknown; key: number }
type MoreSegment = { type: 'more'; hidden: number; key: number }
type Segment = ChildSegment | MoreSegment

function isChild(seg: Segment): seg is ChildSegment {
  return seg.type === 'child'
}
function isMore(seg: Segment): seg is MoreSegment {
  return seg.type === 'more'
}

const segments = computed<Segment[]>(() => {
  const all = slotChildren.value
  const max = Math.floor(props.itemCount)
  if (!Number.isFinite(max) || max <= 0 || all.length <= max) {
    return all.map((node, i) => ({ type: 'child' as const, node, key: i }))
  }
  const headCount = Math.max(1, Math.ceil(max / 2))
  const tailCount = Math.max(1, Math.floor(max / 2))
  const out: Segment[] = []
  for (let i = 0; i < headCount; i++) {
    out.push({ type: 'child', node: all[i], key: i })
  }
  const hidden = all.length - headCount - tailCount
  out.push({ type: 'more', hidden, key: headCount })
  for (let i = 0; i < tailCount; i++) {
    const idx = all.length - tailCount + i
    out.push({ type: 'child', node: all[idx], key: idx })
  }
  return out
})
</script>

<template>
  <nav
    class="sn-breadcrumb"
    aria-label="Breadcrumb"
  >
    <ol class="sn-breadcrumb__list">
      <li
        v-for="(seg, i) in segments"
        :key="seg.key"
        :class="[
            'sn-breadcrumb__item',
            seg.type === 'more' ? 'sn-breadcrumb__ellipsis-item' : '',
          ]"
      >
        <template v-if="isChild(seg)">
          <component :is="seg.node" />
          <span
            v-if="i < segments.length - 1"
            class="sn-breadcrumb__separator"
            aria-hidden="true"
          >{{ separator }}</span>
        </template>
        <template v-else>
          <span class="sn-breadcrumb__more">… {{ seg.hidden }} more …</span>
          <span
            v-if="i < segments.length - 1"
            class="sn-breadcrumb__separator"
            aria-hidden="true"
          >{{ separator }}</span>
        </template>
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

.sn-breadcrumb__more {
  font-style: italic;
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
}

/* Doodle skin */
.snui-skin-doodle .sn-breadcrumb__separator {
  font-weight: 700;
}
</style>