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

import { computed, provide, useSlots } from 'vue'

defineOptions({ name: 'SnBreadcrumb' })

const props = withDefaults(
  defineProps<{
    /** Separator glyph between items. Mirrors n-breadcrumb `separator`. */
    separator?: string
    /** Maximum number of items to display. When the total exceeds this
     * count, the trail renders as `head(1) + ellipsis + tail(maxCount-1)` —
     * the middle items are folded into a single `…` affordance.
     *
     * Default Infinity (show all). AUI extension beyond n-breadcrumb
     * (naive-ui handles long breadcrumbs via a dropdown slot on the
     * middle item; this prop gives consumers a faster declarative cap).
     *
     * Algorithm matches Element Plus `max-count` / NextUI `maxItems`:
     *   - head always shows the first 1 item
     *   - tail shows the last `maxCount - 1` items
     *   - everything between is collapsed into an ellipsis
     */
    maxCount?: number
  }>(),
  {
    separator: '/',
    maxCount: Infinity,
  },
)

defineSlots<{
  /** Sequence of `<SnBreadcrumbItem>` children. */
  default?(): unknown
}>()

const slots = useSlots()

/** Provide the resolved separator ref so descendant items can read it
 *  reactively (and so per-item override picks up parent's default). */
provide('sn-breadcrumb-separator', () => props.separator)

/* ─────────── maxCount truncation ─────────── */

/** Sentinel type we tag ellipsis items with so the template can branch
 *  on `seg.kind === 'ellipsis'` instead of comparing object references. */
const ELLIPSIS_KIND = 'ellipsis' as const
type EllipsisSeg = { kind: typeof ELLIPSIS_KIND; hidden: number; key: number }
type ChildSeg = { kind: 'child'; node: unknown; key: number }
type Segment = EllipsisSeg | ChildSeg

const segments = computed<Segment[]>(() => {
  const all = (slots.default?.() ?? []) as unknown[]
  const max = Math.floor(props.maxCount)
  if (!Number.isFinite(max) || max <= 0 || all.length <= max) {
    return all.map((node, i) => ({ kind: 'child' as const, node, key: i }))
  }
  const headCount = 1
  const tailCount = Math.max(1, max - 1)
  const out: Segment[] = []
  for (let i = 0; i < headCount; i++) {
    out.push({ kind: 'child', node: all[i], key: i })
  }
  const hidden = all.length - headCount - tailCount
  out.push({ kind: ELLIPSIS_KIND, hidden, key: headCount })
  for (let i = 0; i < tailCount; i++) {
    const idx = all.length - tailCount + i
    out.push({ kind: 'child', node: all[idx], key: idx })
  }
  return out
})

function isEllipsis(seg: Segment): seg is EllipsisSeg {
  return seg.kind === ELLIPSIS_KIND
}
</script>

<template>
  <nav
    class="sn-breadcrumb"
    aria-label="Breadcrumb"
  >
    <ul class="sn-breadcrumb__list">
      <!--
        When `maxCount` is set, render the truncated segments instead of
        the raw children. Each segment is either a real `<SnBreadcrumbItem>`
        child VNode (`kind: 'child'`) or an ellipsis placeholder
        (`kind: 'ellipsis'`) which we render inline as a plain <li>.
        SnBreadcrumbItem renders its own <li> + trailing separator, so we
        just splat the VNode via `<component :is>` — Vue resolves it back
        to the original SnBreadcrumbItem instance.
      -->
      <template v-for="(seg, i) in segments" :key="seg.key">
        <component
          v-if="!isEllipsis(seg)"
          :is="seg.node"
        />
        <li
          v-else
          class="sn-breadcrumb-item sn-breadcrumb-item--ellipsis"
          aria-hidden="true"
        >
          <span class="sn-breadcrumb-item__link sn-breadcrumb-item__link--ellipsis">…</span>
          <span
            v-if="i < segments.length - 1"
            class="sn-breadcrumb-item__separator"
            role="separator"
          >{{ separator }}</span>
        </li>
      </template>
    </ul>
  </nav>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-breadcrumb {
  /*
   * Default to inline-flex (not `display: block`).
   *
   * Rationale: <nav> is block-level, which means it takes the full width of
   * its parent and `text-align: center` on the parent only centers text
   * INSIDE the nav, not the nav itself. The breadcrumb then stays
   * left-aligned in any wrapper that uses the common pattern of
   * `text-align: center` on the surrounding card/section.
   *
   * `inline-flex` makes the nav an inline box whose width matches its
   * content — parents can now center it with `text-align: center`, and
   * flex parents still see a normal flex item. Consumers who want a
   * full-width breadcrumb wrap it in `<div style="display: flex">` (or
   * set `display: flex` on `.sn-breadcrumb` themselves).
   */
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
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

/* ─────────── maxCount ellipsis ─────────── */

.sn-breadcrumb-item__link--ellipsis {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-style: italic;
  color: var(--sn-web-color-text-tertiary);
  background: var(--sn-web-color-background-subtle);
  cursor: default;
}
.sn-breadcrumb-item__link--ellipsis:hover {
  color: var(--sn-web-color-text-secondary);
}
</style>