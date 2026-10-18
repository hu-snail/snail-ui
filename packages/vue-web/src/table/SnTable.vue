<script setup lang="ts">
/**
 * SnTable — web-end simple table (AUI-WEB-DD-017).
 *
 * Reference library: naive-ui `n-table`
 *   (https://www.naiveui.com/zh-CN/light/components/table)
 * Per AGENTS.md §112, props + semantics mirror n-table 1:1:
 *   bordered / bottom-bordered / single-column / single-line / size /
 *   striped. The consumer writes thead / tbody / tr / th / td markup in the
 *   default slot; this component renders the <table> root, the merged
 *   border grid, header background, striped rows and the size scale
 *   (padding 6/12/12 px, font-size 14/14/15 px, radius 3px — from
 *   naive-ui src/table/src/styles/index.cssr.ts + styles/_common.ts).
 *
 * Documented divergences (not §112 violations):
 *   - Theme tokens are mapped to `--sn-web-*` via color-mix on
 *     text-primary / surface (naive light.ts weights): grid lines are a 6%
 *     hairline, the outer frame 12%, header bg 2%, striped 2%. The old
 *     border-subtle / background-subtle semantic tiers were the "thick
 *     border" root cause.
 *   - Slotted th/td are styled through `:deep()` because slot content is
 *     compiled in the parent scope.
 *   - naive-ui's theme `modal`/`popover` context variants are not ported
 *     (no inside-modal / inside-popover CSS contexts in this library yet).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnTable>
 *     <thead><tr><th>名称</th></tr></thead>
 *     <tbody><tr><td>数据</td></tr></tbody>
 *   </SnTable>
 *   <SnTable bordered :single-line="false" striped>…</SnTable>
 */

defineOptions({ name: 'SnTable' })

const props = withDefaults(
  defineProps<{
    /** Draw the surrounding border. Mirrors n-table `bordered`. */
    bordered?: boolean
    /** Keep the bottom border of the last row (ignored when bordered). Mirrors n-table `bottom-bordered`. */
    bottomBordered?: boolean
    /** Remove the row separators (cell bottom borders). Mirrors n-table `single-column`. */
    singleColumn?: boolean
    /** Remove the column separators (cell right borders). Mirrors n-table `single-line`. */
    singleLine?: boolean
    /** Table scale. Mirrors n-table `size`. */
    size?: 'small' | 'medium' | 'large'
    /** Zebra stripes on even tbody rows. Mirrors n-table `striped`. */
    striped?: boolean
  }>(),
  {
    bordered: true,
    bottomBordered: true,
    singleColumn: false,
    singleLine: true,
    size: 'medium',
    striped: false,
  },
)

defineSlots<{
  /** Full table markup (thead / tbody / tr / th / td) authored by the consumer. */
  default?(): unknown
}>()
</script>

<template>
  <table
    data-snui-component="table"
    class="sn-table"
    :class="[
      `sn-table--${props.size}`,
      bordered ? 'sn-table--bordered' : '',
      bottomBordered && !bordered ? 'sn-table--bottom-bordered' : '',
      singleColumn ? 'sn-table--single-column' : '',
      singleLine ? 'sn-table--single-line' : '',
      striped ? 'sn-table--striped' : '',
    ]"
  >
    <slot />
  </table>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`).
 * Token mapping per naive-ui Table theme (src/table/styles/light.ts):
 *   borderColor -> 12% color-mix (outer frame), tdColor -> surface,
 *   thColor -> 2% color-mix, thTextColor -> text-primary,
 *   tdTextColor -> text-secondary; grid lines are a 6% hairline
 *   (naive dividerColor rgb(239,239,245) over white). */

.sn-table {
  --sn-table-border-color: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 12%,
    var(--sn-web-color-background-surface)
  );
  --sn-table-divider-color: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 6%,
    var(--sn-web-color-background-surface)
  );
  --sn-table-th-bg: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 2%,
    var(--sn-web-color-background-surface)
  );
  --sn-table-striped-bg: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 2%,
    var(--sn-web-color-background-surface)
  );

  width: 100%;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  line-height: 1.6;
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border-radius: 3px 3px 0 0;
  background-color: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-secondary);
  transition:
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ---------- Cells (slotted content is parent-scoped -> :deep) ---------- */

.sn-table :deep(th) {
  white-space: nowrap;
  text-align: inherit;
  padding: 12px;
  vertical-align: inherit;
  text-transform: none;
  font-weight: 500;
  color: var(--sn-web-color-text-primary);
  background-color: var(--sn-table-th-bg);
  border: 0 solid var(--sn-table-divider-color);
  border-bottom: 1px solid var(--sn-table-divider-color);
  border-right: 1px solid var(--sn-table-divider-color);
  transition:
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-table :deep(td) {
  padding: 12px;
  color: var(--sn-web-color-text-secondary);
  background-color: var(--sn-web-color-background-surface);
  border: 0 solid var(--sn-table-divider-color);
  border-right: 1px solid var(--sn-table-divider-color);
  border-bottom: 1px solid var(--sn-table-divider-color);
  transition:
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-table :deep(th:last-child),
.sn-table :deep(td:last-child) {
  border-right: 0 solid var(--sn-table-divider-color);
}

/* ---------- Size scale (th/td padding 6 / 12 / 12 px, font 14 / 14 / 15 px) ---------- */

.sn-table--small {
  font-size: 14px;
}

.sn-table--small :deep(th),
.sn-table--small :deep(td) {
  padding: 6px;
}

.sn-table--medium {
  font-size: 14px;
}

.sn-table--large {
  font-size: 15px;
}

/* ---------- Single line (default true): no column separators ---------- */

.sn-table--single-line :deep(th),
.sn-table--single-line :deep(td) {
  border-right: 0 solid var(--sn-table-divider-color);
}

/* ---------- Single column: no row separators except the last ---------- */

.sn-table--single-column :deep(tr:not(:last-child) td) {
  border-bottom: 0 solid var(--sn-table-divider-color);
}

/* ---------- Bordered: outer frame + full radius ---------- */

.sn-table--bordered {
  border: 1px solid var(--sn-table-border-color);
  border-radius: 3px;
}

/* bordered covers the bottom edge -> last row keeps no bottom border */
.sn-table--bordered :deep(tr:last-child td) {
  border-bottom: 0 solid var(--sn-table-divider-color);
}

/* ---------- bottom-bordered (only effective when not bordered) ---------- */

.sn-table--bottom-bordered :deep(tr:last-child td) {
  border-bottom: 1px solid var(--sn-table-divider-color);
}

.sn-table:not(.sn-table--bordered):not(.sn-table--bottom-bordered) :deep(tr:last-child td) {
  border-bottom: 0 solid var(--sn-table-divider-color);
}

/* ---------- Striped: even tbody rows ---------- */

.sn-table--striped :deep(tbody tr:nth-of-type(even) td) {
  background-color: var(--sn-table-striped-bg);
}
</style>
