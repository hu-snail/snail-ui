<script setup lang="ts">
/**
 * sn-badge (uni-end) — count / dot marker attached to an icon or avatar.
 *
 * Reference library: wot-ui `wd-badge`
 *   (https://wot-ui.cn/component/badge.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-badge 1:1:
 *   value / max / top / right / is-dot / hidden / type / bg-color / show-zero /
 *   shape / border / custom-class / custom-style.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * ## Why the offsets are inline styles
 *
 * `top` / `right` are per-instance nudges on top of the default
 * top-right anchor, so they cannot live in a class. A numeric value is read as
 * px (the upstream contract); a string is forwarded verbatim, which lets a
 * caller pass `4rpx` and keep the design-canvas rhythm.
 *
 * Per Spec-02 v1.1 §3 (end: mp), uni-side component CSS uses only
 * `--sn-mp-*` aliases (rpx units). The `end: mp` marker in ai-description.md
 * is consumed by `@snui/cli` and MCP tools for per-end filtering.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-badge/sn-badge.vue
 * → auto-registered as `<sn-badge>` in any .vue that uses it.
 *
 * Usage:
 *   <sn-badge :value="8"><sn-icon :icon="Bell" /></sn-badge>
 *   <sn-badge :value="120" :max="99" type="danger" />
 *   <sn-badge is-dot><sn-avatar text="A" /></sn-badge>
 *
 * Not responsible for:
 *   - 标签文本 / 状态语义 — 用 sn-tag
 *   - 头像本体 — 用 sn-avatar
 *   - 点击 / 路由 — 由外层元素承载
 */

import { computed } from 'vue'

defineOptions({ name: 'SnBadge' })

/** Numeric offsets are px; strings pass through so `rpx` stays usable. */
function addUnit(value: string | number | undefined): string | undefined {
  if (value === undefined || value === '') return undefined
  return typeof value === 'number' ? `${value}px` : value
}

// Reference: wot-ui wd-badge Attributes
//   (https://wot-ui.cn/component/badge.html)
// All prop names match wd-badge 1:1.
const props = withDefaults(
  defineProps<{
    /** 显示值（数字或字符串）。数字超出 `max` 时显示 `{max}+`。 */
    value?: string | number | undefined
    /** 最大值，超过后显示 `{max}+`，仅当 `value` 为数字时生效。 */
    max?: number | undefined
    /** 为正时，角标向下偏移对应像素。 */
    top?: string | number | undefined
    /** 为正时，角标向左偏移对应像素。 */
    right?: string | number | undefined
    /** 红色点状标注（不显示数值）。 */
    isDot?: boolean
    /** 隐藏角标（内容照常渲染）。 */
    hidden?: boolean
    /**
     * 类型：primary / success / warning / danger / info。
     * 不设置时用危险色（红）—— 默认角标为红色。
     */
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | undefined
    /** 背景色（内联覆盖 `type`）。 */
    bgColor?: string
    /** 是否显示 `0`（默认 `0` 不渲染角标）。 */
    showZero?: boolean
    /** 徽标形状：circle / square / bubble。 */
    shape?: 'circle' | 'square' | 'bubble'
    /** 是否显示描边（与背景同宽的一道分隔环）。 */
    border?: boolean
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义 inline style。 */
    customStyle?: string
  }>(),
  {
    value: undefined,
    max: undefined,
    top: undefined,
    right: undefined,
    isDot: false,
    hidden: false,
    type: undefined,
    showZero: false,
    shape: 'circle',
    border: false,
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** 徽标包裹的内容（图标 / 头像 / 文本）。 */
  default?(): unknown
}>()

/**
 * Whether the numeric / text badge is rendered at all.
 *
 * Upstream semantics: no `value` means "dot-less wrapper", `0` is suppressed
 * unless `showZero` is on, and `hidden` wins over everything.
 */
const isVisible = computed<boolean>(() => {
  if (props.hidden) return false
  if (props.isDot) return true
  if (props.value === undefined || props.value === '') return false
  if (props.value === 0 && !props.showZero) return false
  return true
})

/** Text inside the badge — applies the `max` overflow rule for numbers. */
const displayValue = computed<string>(() => {
  const { value, max } = props
  if (typeof value === 'number' && typeof max === 'number' && value > max) {
    return `${max}+`
  }
  return String(value ?? '')
})

const rootClass = computed(() => [
  'sn-badge',
  props.isDot ? 'sn-badge--dot' : '',
  props.customClass,
])

const rootStyle = computed(() => (props.customStyle ? props.customStyle : undefined))

const markerClass = computed(() => [
  'sn-badge__marker',
  props.type ? `sn-badge__marker--${props.type}` : '',
  `sn-badge__marker--${props.shape}`,
  props.border ? 'sn-badge__marker--border' : '',
])

const markerStyle = computed(() => {
  const parts: string[] = []
  if (props.bgColor) parts.push(`background-color: ${props.bgColor}`)
  const top = addUnit(props.top)
  const right = addUnit(props.right)
  if (top !== undefined) parts.push(`top: ${top}`)
  if (right !== undefined) parts.push(`right: ${right}`)
  return parts.length > 0 ? parts.join('; ') : undefined
})
</script>

<template>
  <view data-snui-component="badge" :class="rootClass" :style="rootStyle">
    <slot />
    <view
      v-if="isVisible"
      :class="markerClass"
      :style="markerStyle"
      :aria-hidden="isDot ? 'true' : undefined"
    >
      <text v-if="!isDot" class="sn-badge__text">{{ displayValue }}</text>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

.sn-badge__marker {
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  border-radius: var(--sn-mp-radius-full);
  font-size: var(--sn-mp-font-size-xs);
  font-weight: var(--sn-mp-font-weight-medium);
  line-height: 1;
  color: var(--sn-mp-color-text-on-primary);
  white-space: nowrap;
  /* Default anchor: sit on the top-right corner of the wrapped content. */
  transform: translateY(-50%) translateX(50%);
}

/* Dot: a small round marker, no label. */
.sn-badge--dot .sn-badge__marker {
  min-width: 16rpx;
  width: 16rpx;
  height: 16rpx;
  padding: 0;
  border-radius: var(--sn-mp-radius-full);
}

/* ── Shapes ────────────────────────────────────────────────────────────── */

.sn-badge__marker--square {
  border-radius: var(--sn-mp-radius-sm);
}

/* Bubble: rounded except for the bottom-right corner pointing at the host. */
.sn-badge__marker--bubble {
  border-radius: var(--sn-mp-radius-lg) var(--sn-mp-radius-lg) 0 var(--sn-mp-radius-lg);
}

/* ── Types ─────────────────────────────────────────────────────────────── */

/* No `type` prop: danger red is the default marker colour. */
.sn-badge__marker--danger,
.sn-badge__marker {
  background-color: var(--sn-mp-color-feedback-danger);
}
.sn-badge__marker--primary {
  background-color: var(--sn-mp-color-action-primary);
}

.sn-badge__marker--success {
  background-color: var(--sn-mp-color-feedback-success);
}

.sn-badge__marker--warning {
  background-color: var(--sn-mp-color-feedback-warning);
}

.sn-badge__marker--danger {
  background-color: var(--sn-mp-color-feedback-danger);
}

.sn-badge__marker--info {
  background-color: var(--sn-mp-color-feedback-info);
  color: var(--sn-mp-color-text-on-primary);
}

/* ── Border ring ───────────────────────────────────────────────────────── */

.sn-badge__marker--border {
  border: 4rpx solid var(--sn-mp-color-background-surface);
}

.sn-badge__text {
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* ── Doodle skin ───────────────────────────────────────────────────────── */

.snui-skin-doodle .sn-badge__marker {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-sm);
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
