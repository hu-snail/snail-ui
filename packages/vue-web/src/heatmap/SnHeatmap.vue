<script setup lang="ts">
/**
 * SnHeatmap — web-end GitHub-style contribution heatmap (AUI-WEB-DD-008).
 *
 * Reference library: naive-ui `n-heatmap`
 *   (https://www.naiveui.com/zh-CN/light/components/heatmap)
 * Per AGENTS.md §112, props + semantics mirror n-heatmap 1:1 (fetched
 * from naive-ui main `src/heatmap/src/Heatmap.tsx`, a 2.42+ component):
 *   data / loadingData / activeColors / minimumColor / colorTheme /
 *   fillCalendarLeading / firstDayOfWeek (0 = Monday) / loading /
 *   showColorIndicator / showWeekLabels / showMonthLabels / size /
 *   tooltip / xGap / yGap; slots: footer / indicator / tooltip /
 *   indicator-leading-text / indicator-trailing-text.
 *
 * Documented divergences (not §112 violations):
 *   - Built-in color scales are token-driven `color-mix` ramps over
 *     `--sn-web-color-*`: `colorTheme` maps green/blue/orange/red onto the
 *     semantic feedback hues and purple onto a danger/primary mix.
 *     User-supplied `activeColors` / `minimumColor` strings are honored
 *     verbatim via inline backgrounds (data, not component styling).
 *   - Cell hover hints use the native `title` attribute (the reference
 *     wraps each rect in n-tooltip and accepts a TooltipProps object;
 *     only the boolean form of `tooltip` is implemented). The `tooltip`
 *     slot is therefore deferred too — a native title cannot carry custom
 *     node content; footer / indicator / indicator text slots are all
 *     implemented.
 *   - Labels ('少' / '多', week chars, month names) are fixed zh-CN
 *     strings (the reference derives them from its locale system).
 *   - The loading pulse is a scoped keyframes class (the reference
 *     injects a runtime-hashed css-render animation).
 *   - The reference has no item-click event in its source, so none is
 *     exposed.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnHeatmap :data="[{ timestamp: Date.now(), value: 3 }]" />
 *   <SnHeatmap :data="data" color-theme="blue" size="large" tooltip />
 */

import { computed, useSlots } from 'vue'
import {
  buildHeatmapMatrix,
  buildLoadingMatrix,
  buildLoadingMonthLabels,
  buildMonthLabels,
  buildWeekLabels,
  calcLevel,
  normalizeHeatmapData,
} from './heatmap-utils'
import type {
  SnHeatmapCell,
  SnHeatmapColorTheme,
  SnHeatmapDataItem,
  SnHeatmapFirstDayOfWeek,
} from './heatmap-utils'

defineOptions({ name: 'SnHeatmap' })

/** Laid-out cell with the resolved color level. */
interface SnHeatmapViewCell {
  timestamp: number
  value: number | null | undefined
  level: number
}

const props = withDefaults(
  defineProps<{
    /** Data source: `{ timestamp, value }` list (null / absent value renders an empty cell). Mirrors n-heatmap `data`. */
    data?: SnHeatmapDataItem[] | undefined
    /** Data shown while loading. Mirrors n-heatmap `loadingData`. */
    loadingData?: SnHeatmapDataItem[] | undefined
    /** Custom level colors, light → dark; overrides the built-in theme. Mirrors n-heatmap `activeColors`. */
    activeColors?: string[] | undefined
    /** Custom minimum-level color. Mirrors n-heatmap `minimumColor`. */
    minimumColor?: string | undefined
    /** Built-in color theme. Mirrors n-heatmap `colorTheme`. */
    colorTheme?: SnHeatmapColorTheme | undefined
    /** Fill the leading empty week cells with 0 instead of blanks. Mirrors n-heatmap `fillCalendarLeading`. */
    fillCalendarLeading?: boolean
    /** Week start: 0 = Monday … 6 = Sunday. Mirrors n-heatmap `firstDayOfWeek`. */
    firstDayOfWeek?: SnHeatmapFirstDayOfWeek
    /** Loading state; without `loadingData` renders a 7 × 53 skeleton. Mirrors n-heatmap `loading`. */
    loading?: boolean
    /** Show the bottom color indicator. Mirrors n-heatmap `showColorIndicator`. */
    showColorIndicator?: boolean
    /** Show the left week labels. Mirrors n-heatmap `showWeekLabels`. */
    showWeekLabels?: boolean
    /** Show the top month labels. Mirrors n-heatmap `showMonthLabels`. */
    showMonthLabels?: boolean
    /** Scale preset (rects 10 / 11 / 12 px). Mirrors n-heatmap `size`. */
    size?: 'small' | 'medium' | 'large'
    /** Native `title` hover hint (reference wraps n-tooltip; boolean form only). Mirrors n-heatmap `tooltip`. */
    tooltip?: boolean
    /** Vertical (row) side of the grid spacing (px number or CSS length; second border-spacing value, like the reference cssr). Mirrors n-heatmap `xGap`. */
    xGap?: number | string | undefined
    /** Horizontal (column) side of the grid spacing (px number or CSS length; first border-spacing value, like the reference cssr). Mirrors n-heatmap `yGap`. */
    yGap?: number | string | undefined
  }>(),
  {
    data: undefined,
    loadingData: undefined,
    activeColors: undefined,
    minimumColor: undefined,
    colorTheme: undefined,
    fillCalendarLeading: false,
    firstDayOfWeek: 0,
    loading: false,
    showColorIndicator: true,
    showWeekLabels: true,
    showMonthLabels: true,
    size: 'medium',
    tooltip: false,
    xGap: undefined,
    yGap: undefined,
  },
)

defineSlots<{
  /** Left footer area. */
  footer?(): unknown
  /** Replaces the whole right-side indicator. */
  indicator?(): unknown
  /** Leading indicator text (default '少'). */
  'indicator-leading-text'?(): unknown
  /** Trailing indicator text (default '多'). */
  'indicator-trailing-text'?(): unknown
}>()

const slots = useSlots()

const normalizedData = computed(() =>
  normalizeHeatmapData(props.data ?? [], props.firstDayOfWeek, props.fillCalendarLeading),
)

const normalizedLoadingData = computed(() =>
  normalizeHeatmapData(props.loadingData ?? [], props.firstDayOfWeek, props.fillCalendarLeading),
)

// The reference derives the max from the regular data even while loading.
const maxValue = computed(() => {
  let max = 0
  for (const item of normalizedData.value) {
    const value = item.value
    if (typeof value === 'number' && value > max) max = value
  }
  return max
})

const matrix = computed(() => {
  if (props.loading && normalizedLoadingData.value.length === 0) {
    return buildLoadingMatrix(props.firstDayOfWeek)
  }
  const finalData = props.loading ? normalizedLoadingData.value : normalizedData.value
  if (finalData.length === 0) return []
  return buildHeatmapMatrix(finalData, props.firstDayOfWeek)
})

/** Custom palette (index 0 = minimum) or null for the class-based scale. */
const palette = computed<readonly (string | null)[] | null>(() => {
  if (props.activeColors === undefined && props.minimumColor === undefined) return null
  return [props.minimumColor ?? null, ...(props.activeColors ?? [])]
})

const levelCount = computed(() => palette.value?.length ?? 5)

const viewRows = computed<ReadonlyArray<ReadonlyArray<SnHeatmapViewCell | null>>>(() => {
  const rows = matrix.value
  const out: Array<Array<SnHeatmapViewCell | null>> = []
  // The reference renders 7 rows even with no data (week labels remain).
  for (let r = 0; r < 7; r += 1) {
    const row = rows[r] ?? []
    out.push(row.map((cell: SnHeatmapCell | null) => {
      if (cell === null || cell === undefined) return null
      return {
        timestamp: cell.timestamp,
        value: cell.value,
        level: calcLevel(cell.value, maxValue.value, levelCount.value),
      }
    }))
  }
  return out
})

const weekLabels = computed(() => buildWeekLabels(props.firstDayOfWeek))

const monthLabels = computed(() => {
  if (props.loading && !props.loadingData) return buildLoadingMonthLabels()
  return buildMonthLabels(matrix.value)
})

// The reference maps xGap/yGap onto border-spacing (yGap first = horizontal).
const gapStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.xGap !== undefined) {
    style['--sn-heatmap-x-gap'] = typeof props.xGap === 'number' ? `${props.xGap}px` : props.xGap
  }
  if (props.yGap !== undefined) {
    style['--sn-heatmap-y-gap'] = typeof props.yGap === 'number' ? `${props.yGap}px` : props.yGap
  }
  return style
})

const hasFooterSlot = computed(() => slots.footer !== undefined)

const swatches = computed<Array<{ level: number; color: string | null }>>(() => {
  const custom = palette.value
  if (custom === null) {
    return [0, 1, 2, 3, 4].map(level => ({ level, color: null }))
  }
  return custom.map((color, level) => ({ level, color }))
})

function rectStyle(cell: SnHeatmapViewCell): Record<string, string> | undefined {
  const custom = palette.value
  if (custom === null) return undefined
  const color = custom[cell.level]
  return typeof color === 'string' ? { background: color } : undefined
}

function titleFor(cell: SnHeatmapViewCell): string | undefined {
  if (!props.tooltip || props.loading) return undefined
  const date = new Date(cell.timestamp).toLocaleDateString()
  return cell.value !== null ? `${date} ${cell.value ?? 0}` : date
}
</script>

<template>
  <div
    data-snui-component="heatmap"
    class="sn-heatmap"
    :class="[
      `sn-heatmap--${size}`,
      colorTheme ? `sn-heatmap--theme-${colorTheme}` : '',
    ]"
    :style="gapStyle"
  >
    <div class="sn-heatmap__content">
      <table class="sn-heatmap__table">
        <thead v-if="showMonthLabels">
          <tr>
            <th v-if="showWeekLabels" class="sn-heatmap__week-header-cell" aria-hidden="true" />
            <th
              v-for="(label, index) in monthLabels"
              :key="`month-${index}`"
              class="sn-heatmap__month-label-cell"
              :colspan="label.colSpan"
            >
              {{ label.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in viewRows" :key="`row-${rowIndex}`">
            <td v-if="showWeekLabels" class="sn-heatmap__week-label-cell">
              {{ weekLabels[rowIndex]?.visible ? weekLabels[rowIndex]?.label : null }}
            </td>
            <template v-for="(cell, colIndex) in row" :key="`cell-${colIndex}`">
              <td v-if="cell && cell.value !== null" class="sn-heatmap__day-cell">
                <div
                  class="sn-heatmap__rect"
                  :class="[
                    `sn-heatmap__rect--level-${cell.level}`,
                    loading ? 'sn-heatmap__rect--loading' : '',
                  ]"
                  :style="rectStyle(cell)"
                  :title="titleFor(cell)"
                />
              </td>
              <td v-else class="sn-heatmap__day-cell">
                <div class="sn-heatmap__empty-cell" />
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="sn-heatmap__footer"
      :class="{ 'sn-heatmap__footer--single': !hasFooterSlot }"
    >
      <div v-if="hasFooterSlot" class="sn-heatmap__footer-slot">
        <slot name="footer" />
      </div>
      <div class="sn-heatmap__indicator">
        <slot name="indicator">
          <template v-if="showColorIndicator">
            <span class="sn-heatmap__indicator-label">
              <slot name="indicator-leading-text">少</slot>
            </span>
            <div class="sn-heatmap__indicator-cells">
              <div
                v-for="(swatch, index) in swatches"
                :key="index"
                class="sn-heatmap__swatch"
                :class="`sn-heatmap__swatch--level-${swatch.level}`"
                :style="swatch.color ? { background: swatch.color } : undefined"
              />
            </div>
            <span class="sn-heatmap__indicator-label">
              <slot name="indicator-trailing-text">多</slot>
            </span>
          </template>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`).
 * Built-in scales are color-mix ramps over semantic tokens; no literal
 * colors in component CSS. */

.sn-heatmap {
  --sn-heatmap-base: var(--sn-web-color-action-primary);
  --sn-heatmap-color-0: var(--sn-web-color-background-subtle);
  --sn-heatmap-color-1: color-mix(in srgb, var(--sn-heatmap-base) 30%, var(--sn-web-color-background-surface));
  --sn-heatmap-color-2: color-mix(in srgb, var(--sn-heatmap-base) 55%, var(--sn-web-color-background-surface));
  --sn-heatmap-color-3: color-mix(in srgb, var(--sn-heatmap-base) 78%, var(--sn-web-color-background-surface));
  --sn-heatmap-color-4: var(--sn-heatmap-base);
  --sn-heatmap-loading-start: color-mix(in srgb, var(--sn-web-color-text-primary) 6%, transparent);
  --sn-heatmap-loading-end: color-mix(in srgb, var(--sn-web-color-text-primary) 12%, transparent);
  --sn-heatmap-rect-size: 11px;
  --sn-heatmap-x-gap: 3px;
  --sn-heatmap-y-gap: 3px;
  --sn-heatmap-radius: 2px;

  display: flex;
  flex-direction: column;
  max-width: fit-content;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
}

.sn-heatmap--small {
  --sn-heatmap-rect-size: 10px;
  --sn-heatmap-x-gap: 2px;
  --sn-heatmap-y-gap: 2px;
}

.sn-heatmap--large {
  --sn-heatmap-rect-size: 12px;
  font-size: 14px;
}

.sn-heatmap--theme-green {
  --sn-heatmap-base: var(--sn-web-color-feedback-success);
}

.sn-heatmap--theme-blue {
  --sn-heatmap-base: var(--sn-web-color-feedback-info);
}

.sn-heatmap--theme-orange {
  --sn-heatmap-base: var(--sn-web-color-feedback-warning);
}

.sn-heatmap--theme-red {
  --sn-heatmap-base: var(--sn-web-color-feedback-danger);
}

.sn-heatmap--theme-purple {
  --sn-heatmap-base: color-mix(in srgb, var(--sn-web-color-feedback-danger) 55%, var(--sn-web-color-action-primary));
}

.sn-heatmap__content {
  display: block;
}

.sn-heatmap__table {
  border-collapse: separate;
  border-spacing: var(--sn-heatmap-y-gap) var(--sn-heatmap-x-gap);
  font-size: inherit;
}

.sn-heatmap__week-header-cell {
  width: 27px;
  padding: 0;
  border: none;
}

.sn-heatmap__month-label-cell {
  font-size: inherit;
  color: var(--sn-web-color-text-secondary);
  text-align: left;
  height: 15px;
  line-height: 15px;
  font-weight: 400;
  padding: 0 2px 8px;
  vertical-align: bottom;
}

.sn-heatmap__week-label-cell {
  font-size: inherit;
  color: var(--sn-web-color-text-secondary);
  text-align: right;
  width: 27px;
  height: 11px;
  line-height: 11px;
  padding: 0 4px 0 0;
  border: none;
  vertical-align: middle;
  white-space: nowrap;
  font-weight: 400;
}

.sn-heatmap__day-cell {
  width: var(--sn-heatmap-rect-size);
  height: var(--sn-heatmap-rect-size);
  padding: 0;
  border: none;
  vertical-align: middle;
}

.sn-heatmap__empty-cell {
  width: var(--sn-heatmap-rect-size);
  height: var(--sn-heatmap-rect-size);
  border-radius: var(--sn-heatmap-radius);
}

/* ---------- Rects ---------- */

.sn-heatmap__rect {
  width: var(--sn-heatmap-rect-size);
  height: var(--sn-heatmap-rect-size);
  border-radius: var(--sn-heatmap-radius);
  transition: background-color 0.3s;
}

.sn-heatmap__rect--level-0,
.sn-heatmap__swatch--level-0 {
  background: var(--sn-heatmap-color-0);
}

.sn-heatmap__rect--level-1,
.sn-heatmap__swatch--level-1 {
  background: var(--sn-heatmap-color-1);
}

.sn-heatmap__rect--level-2,
.sn-heatmap__swatch--level-2 {
  background: var(--sn-heatmap-color-2);
}

.sn-heatmap__rect--level-3,
.sn-heatmap__swatch--level-3 {
  background: var(--sn-heatmap-color-3);
}

.sn-heatmap__rect--level-4,
.sn-heatmap__swatch--level-4 {
  background: var(--sn-heatmap-color-4);
}

/* Declared after the level rules so loading wins. */
.sn-heatmap__rect--loading {
  cursor: default;
  background: var(--sn-heatmap-loading-start);
  animation: sn-heatmap-loading 2s infinite cubic-bezier(0.36, 0, 0.64, 1);
}

@keyframes sn-heatmap-loading {
  0% {
    background: var(--sn-heatmap-loading-start);
  }

  40% {
    background: var(--sn-heatmap-loading-end);
  }

  80% {
    background: var(--sn-heatmap-loading-start);
  }

  100% {
    background: var(--sn-heatmap-loading-start);
  }
}

/* ---------- Footer / indicator ---------- */

.sn-heatmap__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 17px;
  margin-top: 8px;
}

.sn-heatmap__footer--single {
  justify-content: flex-end;
}

.sn-heatmap__indicator {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.sn-heatmap__indicator-cells {
  display: flex;
  gap: var(--sn-heatmap-x-gap);
}

.sn-heatmap__swatch {
  width: var(--sn-heatmap-rect-size);
  height: var(--sn-heatmap-rect-size);
  border-radius: var(--sn-heatmap-radius);
}

.sn-heatmap__indicator-label {
  font-size: inherit;
  color: var(--sn-web-color-text-secondary);
}
</style>
