<script setup lang="ts">
/**
 * sn-skeleton (uni-end) — placeholder screen while content loads.
 *
 * Reference library: wot-ui `wd-skeleton`
 *   (https://wot-ui.cn/component/skeleton.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-skeleton 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-skeleton/sn-skeleton.vue
 * → auto-registered as `<sn-skeleton>` in any .vue that uses it.
 *
 * ## `row-col` grammar (mirrors wd-skeleton)
 *
 * `rowCol` is an array where each entry is either a number (that many default
 * columns in the row) or an array of column descriptors:
 *
 *   :row-col="[1, [{ size: '50%', type: 'rect' }, { size: '30%' }], 2]"
 *
 * A column descriptor accepts `size` (CSS length / percentage), `type`
 * (`text` / `rect` / `circle` / `image`), `width`, `height`, `margin`,
 * `borderRadius` and `backgroundColor`.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * The shimmer is a CSS animation; there is no timer and no listener.
 *
 * Per AGENTS.md §32, this component handles rendering only.
 *
 * Not responsible for:
 *   - 不定态加载指示器 — 用 sn-loading
 *   - 空状态 — 用 sn-empty
 */

import { computed } from 'vue'

defineOptions({ name: 'SnSkeleton' })

/** Preset layout. Mirrors `wd-skeleton` `theme`. */
type SkeletonTheme = 'text' | 'avatar' | 'paragraph' | 'image'

/** Shimmer kind. Mirrors `wd-skeleton` `animation`. */
type SkeletonAnimation = '' | 'gradient' | 'flashed'

/** Placeholder shape. */
type SkeletonColType = 'text' | 'rect' | 'circle' | 'image'

/** One column descriptor inside a `row-col` row. */
export interface SnSkeletonCol {
  /** Placeholder shape. */
  type?: SkeletonColType
  /** Width — a number is treated as rpx, a string passes through. */
  size?: number | string
  /** Explicit width (overrides `size`). */
  width?: number | string
  /** Explicit height. */
  height?: number | string
  /** Outer margin. */
  margin?: string
  /** Corner radius override. */
  borderRadius?: string
  /** Background color override for this placeholder. */
  backgroundColor?: string
}

/** One `row-col` entry: a column count, or an explicit column list. */
type SkeletonRowCol = number | SnSkeletonCol[]

const props = withDefaults(
  defineProps<{
    /** Preset layout when `rowCol` is empty. */
    theme?: SkeletonTheme
    /** Per-row layout: a column count or an explicit column list per row. */
    rowCol?: SkeletonRowCol[]
    /** Whether the skeleton is shown; `false` renders the default slot. */
    loading?: boolean
    /** Shimmer kind. */
    animation?: SkeletonAnimation
    /** Custom class for the root node. */
    customClass?: string | string[] | Record<string, boolean>
    /** Custom inline style for the root node. */
    customStyle?: string
  }>(),
  {
    theme: 'text',
    rowCol: () => [],
    loading: true,
    animation: '',
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** Real content, rendered once `loading` is false. */
  default?(): unknown
}>()

/** Preset row layouts per theme (mirrors the reference's four presets). */
const THEME_ROWS: Record<SkeletonTheme, SkeletonRowCol[]> = {
  text: [1],
  avatar: [[{ type: 'circle', size: 96 }, { type: 'rect', size: '60%' }]],
  paragraph: [1, 1, [{ type: 'text', size: '60%' }]],
  image: [[{ type: 'image', size: '100%' }]],
}

/** Effective rows: explicit `rowCol` wins, otherwise the theme preset. */
const rows = computed<SkeletonRowCol[]>(() =>
  props.rowCol.length > 0 ? props.rowCol : THEME_ROWS[props.theme],
)

/** Normalise one row into a column list. */
function normaliseRow(row: SkeletonRowCol): SnSkeletonCol[] {
  if (typeof row === 'number') {
    return Array.from({ length: Math.max(1, Math.round(row)) }, () => ({ type: 'text' }))
  }
  return row.length > 0 ? row : [{ type: 'text' }]
}

/** Resolve a numeric-or-string length (bare number = rpx). */
function toLength(value: number | string | undefined): string | undefined {
  if (value === undefined || value === '') return undefined
  return typeof value === 'number' ? `${value}rpx` : value
}

/** Inline style for one placeholder column. */
function colStyle(col: SnSkeletonCol): string {
  const parts: string[] = []
  const width = toLength(col.width ?? col.size)
  const height = toLength(col.height)
  if (width) parts.push(`width: ${width}`)
  if (height) parts.push(`height: ${height}`)
  if (col.margin) parts.push(`margin: ${col.margin}`)
  if (col.borderRadius) parts.push(`border-radius: ${col.borderRadius}`)
  if (col.backgroundColor) parts.push(`background-color: ${col.backgroundColor}`)
  return parts.join('; ')
}

/** Column shape class. */
function colClass(col: SnSkeletonCol): string[] {
  return ['sn-skeleton__col', `sn-skeleton__col--${col.type ?? 'text'}`]
}

const rootClass = computed(() => [
  'sn-skeleton',
  {
    'sn-skeleton--gradient': props.animation === 'gradient',
    'sn-skeleton--flashed': props.animation === 'flashed',
  },
  props.customClass,
])

const rootStyle = computed(() => (props.customStyle ? props.customStyle : undefined))
</script>

<template>
  <view
    v-if="loading"
    data-snui-component="skeleton"
    :class="rootClass"
    :style="rootStyle"
    role="status"
    aria-live="polite"
    aria-busy="true"
    aria-label="loading"
  >
    <view
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="sn-skeleton__row"
    >
      <view
        v-for="(col, colIndex) in normaliseRow(row)"
        :key="colIndex"
        :class="colClass(col)"
        :style="colStyle(col)"
        aria-hidden="true"
      />
    </view>
  </view>

  <slot v-else />
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  box-sizing: border-box;
  width: 100%;
}

.sn-skeleton__row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
}

.sn-skeleton__col {
  box-sizing: border-box;
  /* Placeholder fill: the tinted surface, dark-mode aware. */
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-skeleton__col--text {
  width: 100%;
  height: 32rpx;
  border-radius: var(--sn-mp-radius-sm);
}

.sn-skeleton__col--rect {
  flex: 1 1 auto;
  height: 32rpx;
  border-radius: var(--sn-mp-radius-md);
}

.sn-skeleton__col--circle {
  width: 96rpx;
  height: 96rpx;
  flex: 0 0 auto;
  border-radius: var(--sn-mp-radius-full);
}

.sn-skeleton__col--image {
  width: 100%;
  height: 240rpx;
  border-radius: var(--sn-mp-radius-lg);
}

/* ── Shimmer: gradient sweep ──────────────────────────────────────────── */

.sn-skeleton--gradient .sn-skeleton__col {
  background-image: linear-gradient(
    90deg,
    var(--sn-mp-color-background-subtle) 25%,
    var(--sn-mp-color-background-elevated) 37%,
    var(--sn-mp-color-background-subtle) 63%
  );
  background-size: 400% 100%;
  animation: sn-skeleton-gradient 1.4s ease infinite;
}

@keyframes sn-skeleton-gradient {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* ── Shimmer: opacity pulse ───────────────────────────────────────────── */

.sn-skeleton--flashed .sn-skeleton__col {
  animation: sn-skeleton-flashed 1.4s ease-in-out infinite;
}

@keyframes sn-skeleton-flashed {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Doodle skin — dashed placeholder outline. */
.snui-skin-doodle .sn-skeleton__col {
  border: 2rpx dashed var(--sn-mp-color-border-default);
}
</style>
