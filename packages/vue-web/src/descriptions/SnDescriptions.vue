<script setup lang="ts">
/**
 * SnDescriptions — grouped key/value detail list rendered as a table
 * (AUI-WEB-DD-005).
 *
 * Reference library: naive-ui `n-descriptions`
 *   (https://www.naiveui.com/zh-CN/light/components/descriptions)
 * Per AGENTS.md §112, props + slots mirror n-descriptions 1:1:
 *   title / column / label-placement / label-align / separator / size /
 *   bordered / label-class / label-style / content-class / content-style;
 *   slots: default / header.
 *
 * Layout parity notes (mirrors the reference table model):
 *   - The grid has `column * 2` physical tracks (label + content per
 *     logical column). `label-placement="top"` renders a hidden
 *     visibility:collapse sizing row to establish equal track widths.
 *   - The last entry of each row stretches to fill the remaining tracks.
 *   - `separator` only renders for `label-placement="left"` without a
 *     border (inline label/content spans mode), as in the reference.
 *
 * Documented divergences (not §112 violations):
 *   - The deprecated `columns` alias is not implemented (`column` only).
 *   - Non-`SnDescriptionsItem` children are filtered silently; the
 *     reference emits a dev warning.
 *   - Fragment children (e.g. `<template v-for>` wrapping items) are
 *     flattened recursively, so v-for-driven items work; the reference
 *     drops fragments.
 *   - Styles/classes from `label-style`/`content-style` etc. are passed
 *     through as strings or style objects; object styles are merged
 *     per cell exactly like the reference.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnDescriptions title="订单信息" bordered>
 *     <SnDescriptionsItem label="订单号">AUI-2024-001</SnDescriptionsItem>
 *     <SnDescriptionsItem label="状态">已支付</SnDescriptionsItem>
 *   </SnDescriptions>
 */

import type { CSSProperties, VNode, VNodeChild } from 'vue'
import { Fragment, computed, isVNode, useSlots } from 'vue'
import SnDescriptionsItem from './SnDescriptionsItem.vue'

defineOptions({ name: 'SnDescriptions' })

const slots = useSlots()

const props = withDefaults(
  defineProps<{
    /** Title above the table; the `header` slot overrides it. */
    title?: string
    /** Total number of logical columns the grid is laid out with. */
    column?: number
    /** Where labels sit relative to their content. */
    labelPlacement?: 'left' | 'top'
    /** Label text alignment (applies to the th cells). */
    labelAlign?: 'left' | 'right' | 'center'
    /** Separator between inline label and content (`left` + no border). */
    separator?: string
    /** Font scale. */
    size?: 'small' | 'medium' | 'large'
    /** Draw the bordered grid (outlined cells + tinted label background). */
    bordered?: boolean
    /** Class applied to every rendered label cell / span. */
    labelClass?: string
    /** Style applied to every rendered label cell / span. */
    labelStyle?: string | CSSProperties
    /** Class applied to every rendered content cell / span. */
    contentClass?: string
    /** Style applied to every rendered content cell / span. */
    contentStyle?: string | CSSProperties
  }>(),
  {
    column: 3,
    labelPlacement: 'top',
    labelAlign: 'left',
    separator: ':',
    size: 'medium',
    bordered: false,
  },
)

defineSlots<{
  /** `<SnDescriptionsItem>` entries. */
  default?(): unknown
  /** Header content — overrides the `title` prop. */
  header?(): unknown
}>()

/** Functional fragment: renders a captured array of slot vnodes. */
const VNodes = (props: { nodes: VNodeChild[] }): VNodeChild => props.nodes

/** Normalized data read from one `<SnDescriptionsItem>` vnode. */
interface DescriptionsItemData {
  label: VNodeChild[]
  content: VNodeChild[]
  span: number
  labelStyle: string | CSSProperties | undefined
  contentStyle: string | CSSProperties | undefined
  labelClass: string | undefined
  contentClass: string | undefined
}

/** One logical table row: label row + content row (`top` placement) or a
 * single mixed row (`left` placement). */
interface DescriptionsRowData {
  /** th cells — the label row of a `top` placement row. */
  header: DescriptionsCellData[]
  /** td cells — the content row of a `top` placement row. */
  content: DescriptionsCellData[]
  /** All cells in document order — a `left` placement row. */
  cells: DescriptionsCellData[]
}

/** One physical table cell to render. */
interface DescriptionsCellData {
  tag: 'th' | 'td'
  colspan: number
  label: VNodeChild[]
  content: VNodeChild[]
  /** `left` placement without border: label/content inline in one td. */
  combined: boolean
  labelStyle: string | CSSProperties | undefined
  contentStyle: string | CSSProperties | undefined
  labelClass: string | undefined
  contentClass: string | undefined
}

function flattenSlotChildren(children: unknown): VNodeChild[] {
  const out: VNodeChild[] = []
  const walk = (input: unknown): void => {
    if (Array.isArray(input)) {
      input.forEach(walk)
      return
    }
    if (input === null || input === undefined || typeof input === 'boolean') {
      return
    }
    // Template v-for wraps repeated items in Fragment vnodes; recurse so
    // data-driven item lists work (the reference drops fragments).
    if (isVNode(input) && input.type === Fragment) {
      walk(input.children)
      return
    }
    out.push(input as VNodeChild)
  }
  walk(children)
  return out
}

function readSlotChildren(vnode: VNode, slotName?: 'label'): VNodeChild[] {
  const children = vnode.children
  if (typeof children === 'string') {
    return slotName ? [] : [children]
  }
  if (children === null) {
    return []
  }
  const slotFns = children as Record<string, (() => unknown) | undefined>
  const fn = slotName ? slotFns[slotName] : slotFns.default
  return fn ? flattenSlotChildren(fn()) : []
}

/** Comment/text placeholder vnodes carry a symbol type — not visible. */
function hasRenderableContent(nodes: VNodeChild[]): boolean {
  return nodes.some((node) => {
    if (typeof node === 'string') return node.length > 0
    if (isVNode(node)) return typeof node.type !== 'symbol'
    return false
  })
}

function collectItems(): DescriptionsItemData[] {
  const slot = slots.default
  if (!slot) return []
  const flattened = flattenSlotChildren(slot())
  const items: DescriptionsItemData[] = []
  for (const child of flattened) {
    if (isVNode(child) && child.type === SnDescriptionsItem) {
      const vnodeProps = (child.props ?? {}) as {
        label?: string
        span?: number
        labelStyle?: string | CSSProperties
        contentStyle?: string | CSSProperties
        labelClass?: string
        contentClass?: string
      }
      const labelSlot = readSlotChildren(child, 'label')
      items.push({
        label: hasRenderableContent(labelSlot)
          ? labelSlot
          : vnodeProps.label !== undefined
            ? [vnodeProps.label]
            : [],
        content: readSlotChildren(child),
        span: vnodeProps.span || 1,
        labelStyle: vnodeProps.labelStyle,
        contentStyle: vnodeProps.contentStyle,
        labelClass: vnodeProps.labelClass,
        contentClass: vnodeProps.contentClass,
      })
    }
  }
  return items
}

const columnCount = computed(() => {
  const value = props.column
  return typeof value === 'number' && value > 0 ? Math.floor(value) : 1
})

/**
 * Row layout walk — a direct port of the reference algorithm: entries
 * flow into rows of `column` columns; the row (and its content row for
 * `top` placement) closes when the running span reaches `column`; the
 * last entry of a row stretches to fill the remaining tracks.
 */
function buildRows(): DescriptionsRowData[] {
  const column = columnCount.value
  const items = collectItems()
  const rows: DescriptionsRowData[] = []
  let row: DescriptionsCellData[] = []
  let secondRow: DescriptionsCellData[] = []
  let span = 0
  const left = props.labelPlacement === 'left'

  items.forEach((item, index) => {
    const isLast = items.length - 1 === index
    const itemSpan = item.span
    const memorizedSpan = span
    span += itemSpan
    const labelStyle = item.labelStyle ?? props.labelStyle
    const contentStyle = item.contentStyle ?? props.contentStyle
    const labelClass = [props.labelClass, item.labelClass]
      .filter(Boolean)
      .join(' ') || undefined
    const contentClass = [props.contentClass, item.contentClass]
      .filter(Boolean)
      .join(' ') || undefined

    if (left) {
      if (props.bordered) {
        row.push({
          tag: 'th',
          colspan: 1,
          label: item.label,
          content: [],
          combined: false,
          labelStyle,
          contentStyle: undefined,
          labelClass,
          contentClass: undefined,
        })
        row.push({
          tag: 'td',
          colspan: isLast
            ? (column - memorizedSpan) * 2 + 1
            : itemSpan * 2 - 1,
          label: [],
          content: item.content,
          combined: false,
          labelStyle: undefined,
          contentStyle,
          labelClass: undefined,
          contentClass,
        })
      } else {
        row.push({
          tag: 'td',
          colspan: isLast ? (column - memorizedSpan) * 2 : itemSpan * 2,
          label: item.label,
          content: item.content,
          combined: true,
          labelStyle,
          contentStyle,
          labelClass,
          contentClass,
        })
      }
    } else {
      const colspan = isLast ? (column - memorizedSpan) * 2 : itemSpan * 2
      row.push({
        tag: 'th',
        colspan,
        label: item.label,
        content: [],
        combined: false,
        labelStyle,
        contentStyle: undefined,
        labelClass,
        contentClass: undefined,
      })
      secondRow.push({
        tag: 'td',
        colspan,
        label: [],
        content: item.content,
        combined: false,
        labelStyle: undefined,
        contentStyle,
        labelClass: undefined,
        contentClass,
      })
    }

    if (span >= column || isLast) {
      span = 0
      if (left && row.length) {
        rows.push({ header: [], content: [], cells: row })
        row = []
      }
      if (!left && row.length) {
        rows.push({ header: row, content: secondRow, cells: [] })
        row = []
        secondRow = []
      }
    }
  })
  return rows
}

const headerNodes = (): VNodeChild[] => {
  const slot = slots.header
  return slot ? flattenSlotChildren(slot()) : []
}
</script>

<template>
  <div
    data-snui-component="descriptions"
    class="sn-descriptions"
    :class="[
      `sn-descriptions--${labelPlacement}-label-placement`,
      `sn-descriptions--${labelAlign}-label-align`,
      `sn-descriptions--${size}`,
      bordered ? 'sn-descriptions--bordered' : '',
    ]"
  >
    <div v-if="title || $slots.header" class="sn-descriptions__header">
      <template v-if="$slots.header">
        <VNodes :nodes="headerNodes()" />
      </template>
      <template v-else>{{ title }}</template>
    </div>
    <div class="sn-descriptions__table-wrapper">
      <table class="sn-descriptions__table">
        <tbody>
          <tr
            v-if="labelPlacement === 'top'"
            class="sn-descriptions__table-row"
            style="visibility: collapse"
            aria-hidden="true"
          >
            <td v-for="n in columnCount * 2" :key="`sizer-${n}`" />
          </tr>
          <template v-for="(row, rowIndex) in buildRows()" :key="rowIndex">
            <tr v-if="labelPlacement === 'top'" class="sn-descriptions__table-row">
              <th
                v-for="(cell, cellIndex) in row.header"
                :key="cellIndex"
                class="sn-descriptions__table-header"
                :colspan="cell.colspan"
                :class="cell.labelClass"
                :style="cell.labelStyle"
              >
                <VNodes :nodes="cell.label" />
              </th>
            </tr>
            <tr v-if="labelPlacement === 'top'" class="sn-descriptions__table-row">
              <td
                v-for="(cell, cellIndex) in row.content"
                :key="cellIndex"
                class="sn-descriptions__table-content"
                :colspan="cell.colspan"
                :class="cell.contentClass"
                :style="cell.contentStyle"
              >
                <VNodes :nodes="cell.content" />
              </td>
            </tr>
            <tr v-else class="sn-descriptions__table-row">
              <template v-for="(cell, cellIndex) in row.cells" :key="cellIndex">
                <th
                  v-if="cell.tag === 'th'"
                  class="sn-descriptions__table-header"
                  :colspan="cell.colspan"
                  :class="cell.labelClass"
                  :style="cell.labelStyle"
                >
                  <VNodes :nodes="cell.label" />
                </th>
                <td
                  v-else-if="!cell.combined"
                  class="sn-descriptions__table-content"
                  :colspan="cell.colspan"
                  :class="cell.contentClass"
                  :style="cell.contentStyle"
                >
                  <VNodes :nodes="cell.content" />
                </td>
                <td
                  v-else
                  class="sn-descriptions__table-content"
                  :colspan="cell.colspan"
                  :style="cell.contentStyle"
                >
                  <span
                    class="sn-descriptions__label"
                    :class="cell.labelClass"
                    :style="cell.labelStyle"
                  >
                    <VNodes :nodes="cell.label" />
                    <span
                      v-if="separator"
                      class="sn-descriptions__separator"
                    >{{ separator }}</span>
                  </span>
                  <span
                    class="sn-descriptions__content"
                    :class="cell.contentClass"
                    :style="cell.contentStyle"
                  >
                    <VNodes :nodes="cell.content" />
                  </span>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-descriptions {
  /* Size + bordered driven paddings (reference: thPaddingBordered* /
   * tdPadding* per size). */
  --sn-descriptions-font-size: 14px;
  --sn-descriptions-th-padding: 0;
  --sn-descriptions-td-padding: 0 0 12px 0;
  font-size: var(--sn-descriptions-font-size);
}

.sn-descriptions--small {
  --sn-descriptions-font-size: 12px;
  --sn-descriptions-td-padding: 0 0 8px 0;
}

.sn-descriptions--large {
  --sn-descriptions-font-size: 15px;
  --sn-descriptions-td-padding: 0 0 16px 0;
}

/* ---------- Title header ---------- */

.sn-descriptions__header {
  font-weight: 500;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 16px;
  color: var(--sn-web-color-text-primary);
}

/* ---------- Table ---------- */

.sn-descriptions__table-wrapper {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.sn-descriptions__table {
  width: 100%;
  /* Host chrome (e.g. vitepress `.vp-doc table { display: block }`)
   * degrades the table to a block and kills width:100% — re-assert. */
  display: table;
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
  box-sizing: border-box;
}

.sn-descriptions__table-row {
  box-sizing: border-box;
  /* Host chrome (e.g. `.vp-doc tr { border-top: 1px }`) stacks with the
   * bordered cell grid and doubles separators — rows draw no border. */
  border: none;
  transition: border-color 0.3s ease;
}

/* Defensive `border: none`: host-global table chrome (e.g. a docs site
 * styling `.vp-doc th/td`) must not draw borders the component did not ask
 * for — bordered mode re-asserts its own grid at higher specificity. */
.sn-descriptions__table-header {
  border: none;
  padding: var(--sn-descriptions-th-padding);
  font-weight: 500;
  line-height: 1.6;
  display: table-cell;
  box-sizing: border-box;
  color: var(--sn-web-color-text-primary);
  text-align: left;
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.sn-descriptions__table-content {
  border: none;
  padding: var(--sn-descriptions-td-padding);
  vertical-align: top;
  line-height: 1.6;
  display: table-cell;
  box-sizing: border-box;
  color: var(--sn-web-color-text-secondary);
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.sn-descriptions__label {
  font-weight: 500;
  display: inline-block;
  margin-right: 14px;
  color: var(--sn-web-color-text-primary);
  transition: color 0.3s ease;
}

.sn-descriptions__content {
  display: inline-block;
  color: var(--sn-web-color-text-secondary);
  transition: color 0.3s ease;
}

.sn-descriptions__separator {
  display: inline-block;
  margin: 0 8px 0 2px;
}

/* Drop the trailing padding on the last row (no bordered frame below). */
.sn-descriptions:not(.sn-descriptions--bordered)
  .sn-descriptions__table-row:last-child
  .sn-descriptions__table-content {
  padding-bottom: 0;
}

/* ---------- Label placement / alignment ---------- */

.sn-descriptions--left-label-placement .sn-descriptions__table-content > * {
  vertical-align: top;
}

.sn-descriptions--left-label-align .sn-descriptions__table-header {
  text-align: left;
}

.sn-descriptions--center-label-align .sn-descriptions__table-header {
  text-align: center;
}

.sn-descriptions--right-label-align .sn-descriptions__table-header {
  text-align: right;
}

/* ---------- Bordered grid ----------
 * naive composes its grid from dividerColor (rgb(239,239,245) ≈ 6% ink
 * on white) and tableHeaderColor (rgb(250,250,252) ≈ 2% ink) — one step
 * lighter than --sn-web-color-border-* / --sn-web-color-background-subtle,
 * hence the color-mix formulas instead of those heavier tokens. */
.sn-descriptions--bordered {
  --sn-descriptions-th-padding: 12px 16px;
  --sn-descriptions-td-padding: 12px 16px;
}

.sn-descriptions--bordered.sn-descriptions--small {
  --sn-descriptions-th-padding: 8px 12px;
  --sn-descriptions-td-padding: 8px 12px;
}

.sn-descriptions--bordered.sn-descriptions--large {
  --sn-descriptions-th-padding: 16px 24px;
  --sn-descriptions-td-padding: 16px 24px;
}

.sn-descriptions--bordered .sn-descriptions__table-wrapper {
  border-radius: 3px;
  overflow: hidden;
  background: var(--sn-web-color-background-surface);
  border: 1px solid color-mix(in srgb, var(--sn-web-color-text-primary) 6%, var(--sn-web-color-background-surface));
}

.sn-descriptions--bordered .sn-descriptions__table-header {
  font-weight: 400;
  background-clip: padding-box;
  background-color: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 2%,
    var(--sn-web-color-background-surface)
  );
}

.sn-descriptions--bordered .sn-descriptions__table-row:not(:last-child) .sn-descriptions__table-header,
.sn-descriptions--bordered .sn-descriptions__table-row:not(:last-child) .sn-descriptions__table-content {
  border-bottom: 1px solid color-mix(in srgb, var(--sn-web-color-text-primary) 6%, var(--sn-web-color-background-surface));
}

.sn-descriptions--bordered .sn-descriptions__table-header:not(:last-child),
.sn-descriptions--bordered .sn-descriptions__table-content:not(:last-child) {
  border-right: 1px solid color-mix(in srgb, var(--sn-web-color-text-primary) 6%, var(--sn-web-color-background-surface));
}
</style>
