<script setup lang="ts">
/**
 * sn-tag (uni-end) — compact label / chip for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-tag`
 *   (https://wot-ui.cn/component/tag.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-tag 1:1:
 *   size / type / icon / icon-prefix / css-icon / closable / dynamic / color /
 *   bg-color / round / mark / variant / custom-class / custom-style.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * ## Why `icon` resolves through the sn-icon registry
 *
 * The web end accepts an icon component; the uni end has no first-class
 * tree-shakable icon component library (see sn-icon.vue header). A tag icon is
 * therefore given as a *name* and resolved through `registerSnIcons()` at app
 * bootstrap — the same contract sn-button already uses. `iconPrefix` +
 * `cssIcon` cover the other upstream idiom: an iconfont class pair, rendered
 * as `<text class="prefix-name">` (font icons work in miniprogram WXSS).
 *
 * Per Spec-02 v1.1 §3 (end: mp), uni-side component CSS uses only
 * `--sn-mp-*` aliases (rpx units). The `end: mp` marker in ai-description.md
 * is consumed by `@snui/cli` and MCP tools for per-end filtering.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-tag/sn-tag.vue
 * → auto-registered as `<sn-tag>` in any .vue that uses it.
 *
 * Usage:
 *   <sn-tag>默认</sn-tag>
 *   <sn-tag type="primary" variant="light" closable @close="remove">标签</sn-tag>
 *   <sn-tag type="success" round mark>圆角标记</sn-tag>
 *   <sn-tag dynamic @confirm="add" />
 *
 * Not responsible for:
 *   - 选择 / 复选语义 — 用 sn-checkbox / sn-radio
 *   - 徽标计数 — 用 sn-badge
 *   - 长文本排版 — 用 sn-text
 */

import { computed, markRaw, ref } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { resolveIconByName } from '../sn-icon/sn-icon-registry'
import { X } from '../sn-icon/sn-icon-set'

defineOptions({ name: 'SnTag' })

// Reference: wot-ui wd-tag Attributes
//   (https://wot-ui.cn/component/tag.html)
// All prop names match wd-tag 1:1.
const props = withDefaults(
  defineProps<{
    /** 标签尺寸，可选值为 small、medium、large、extra-large、default。 */
    size?: 'small' | 'medium' | 'large' | 'extra-large' | 'default'
    /**
     * 标签类型（语义色）。
     * default / primary / success / warning / danger / volcano / lightblue /
     * cyan / pink / purple。
     */
    type?:
      | 'default'
      | 'primary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'volcano'
      | 'lightblue'
      | 'cyan'
      | 'pink'
      | 'purple'
    /** 左侧图标名（经 `registerSnIcons()` 注册的 sn-icon 名称）。 */
    icon?: string
    /** 图标类名前缀，`cssIcon` 打开时用于拼出字体图标 class。 */
    iconPrefix?: string
    /** CSS（字体）图标：`true` 用 `iconPrefix`，字符串则直接作为 class 前缀。 */
    cssIcon?: boolean | string
    /** 是否可关闭（渲染关闭按钮，点击 emit `close`）。 */
    closable?: boolean
    /** 是否为新增标签（渲染输入框，确认后 emit `confirm`）。 */
    dynamic?: boolean
    /** 文字颜色（内联覆盖）。 */
    color?: string
    /** 背景色和边框色（内联覆盖）。 */
    bgColor?: string
    /** 是否圆角（胶囊形）。 */
    round?: boolean
    /** 是否标记样式（左上 / 右下不对称圆角）。 */
    mark?: boolean
    /** 标签变体：light / dark / plain / dashed / text。 */
    variant?: 'light' | 'dark' | 'plain' | 'dashed' | 'text'
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义 inline style。 */
    customStyle?: string
  }>(),
  {
    size: 'default',
    type: 'default',
    icon: '',
    iconPrefix: '',
    cssIcon: false,
    closable: false,
    dynamic: false,
    color: '',
    bgColor: '',
    round: false,
    mark: false,
    variant: 'dark',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  /** 点击标签时触发。 */
  (e: 'click', event: Event): void
  /** 点击关闭按钮时触发。 */
  (e: 'close', event: Event): void
  /** 新增标签输入确认后触发。 */
  (e: 'confirm', payload: { value: string }): void
}>()

defineSlots<{
  /** 标签内容。 */
  default?(): unknown
  /** 自定义图标（覆盖 `icon` prop）。 */
  icon?(): unknown
  /** 自定义新增标签内容，`dynamic` 为 true 时生效。 */
  add?(): unknown
}>()

/** Registry-resolved icon data for the `icon` prop (null when unknown). */
const iconData = computed<IconData | null>(() => {
  if (!props.icon) return null
  const resolved = resolveIconByName(props.icon)
  return resolved ? markRaw(resolved) : null
})

/**
 * Font-icon class list. `cssIcon === true` uses `iconPrefix` as the prefix
 * (`wd-icon` upstream); a string value is the prefix itself, which is the
 * escape hatch for consumers carrying their own iconfont.
 */
const cssIconClass = computed<string>(() => {
  if (!props.icon || !props.cssIcon) return ''
  const prefix = typeof props.cssIcon === 'string' ? props.cssIcon : props.iconPrefix
  return prefix ? `${prefix}-${props.icon}` : props.icon
})

/** Draft text of the inline "new tag" input. */
const draftValue = ref('')

/** Close button click — must not bubble into the root `click`. */
function onCloseTap(event: Event): void {
  event.stopPropagation()
  emit('close', event)
}

function onRootTap(event: Event): void {
  emit('click', event)
}

function onConfirm(): void {
  emit('confirm', { value: draftValue.value })
}

const rootClass = computed(() => [
  'sn-tag',
  `sn-tag--${props.type}`,
  `sn-tag--size-${props.size}`,
  `sn-tag--variant-${props.variant}`,
  {
    'sn-tag--round': props.round,
    'sn-tag--mark': props.mark,
    'sn-tag--closable': props.closable,
    'sn-tag--dynamic': props.dynamic,
  },
  props.customClass,
])

const rootStyle = computed(() => {
  const parts: string[] = []
  if (props.color) parts.push(`color: ${props.color}`)
  if (props.bgColor) parts.push(`background-color: ${props.bgColor}`, `border-color: ${props.bgColor}`)
  if (props.customStyle) parts.push(props.customStyle)
  return parts.length > 0 ? parts.join('; ') : undefined
})
</script>

<template>
  <view
    data-snui-component="tag"
    :class="rootClass"
    :style="rootStyle"
    role="button"
    @tap="onRootTap"
  >
    <slot name="icon">
      <SnIcon v-if="iconData" class="sn-tag__icon" :icon="iconData" :size="size === 'small' ? 20 : 24" />
      <text v-else-if="cssIconClass" :class="['sn-tag__icon', cssIconClass]" aria-hidden="true" />
    </slot>

    <input
      v-if="dynamic"
      v-model="draftValue"
      class="sn-tag__input"
      type="text"
      confirm-type="done"
      :placeholder="''"
      @confirm="onConfirm"
    >
    <slot v-else />
    <slot v-if="dynamic" name="add" />

    <view
      v-if="closable"
      class="sn-tag__close"
      role="button"
      aria-label="Close"
      @tap="onCloseTap"
    >
      <SnIcon :icon="X" :size="size === 'small' ? 16 : 20" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`).
 *
 * Type colours are funneled through three component-local custom properties
 * (`--snui-tag-*`) so the five variants stay a single set of rules instead of
 * a 10 types × 5 variants matrix. The locals are *not* theme slots — they are
 * assigned from real `--sn-mp-*` tokens per type class. */

.sn-tag {
  --snui-tag-bg: var(--sn-mp-color-feedback-info);
  --snui-tag-soft: var(--sn-mp-color-background-subtle);
  --snui-tag-accent: var(--sn-mp-color-text-secondary);
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  max-width: 100%;
  padding: 6rpx 16rpx;
  border: 2rpx solid transparent;
  border-radius: var(--sn-mp-radius-sm);
  font-size: var(--sn-mp-font-size-sm);
  line-height: 1;
  vertical-align: middle;
  white-space: nowrap;
}

/* ── Sizes ─────────────────────────────────────────────────────────────── */

.sn-tag--size-small {
  padding: 2rpx 8rpx;
  font-size: var(--sn-mp-font-size-xs);
}

.sn-tag--size-medium {
  padding: 4rpx 12rpx;
  font-size: var(--sn-mp-font-size-sm);
}

.sn-tag--size-large {
  padding: 6rpx 20rpx;
  font-size: var(--sn-mp-font-size-md);
}

.sn-tag--size-extra-large {
  padding: 8rpx 24rpx;
  font-size: var(--sn-mp-font-size-lg);
}

/* ── Shapes ────────────────────────────────────────────────────────────── */

.sn-tag--round {
  padding-left: 20rpx;
  padding-right: 20rpx;
  border-radius: var(--sn-mp-radius-full);
}

/* Mark: asymmetric corners (large top-left, small bottom-right). */
.sn-tag--mark {
  border-radius: var(--sn-mp-radius-lg) var(--sn-mp-radius-md) var(--sn-mp-radius-lg)
    var(--sn-mp-radius-md);
}

.sn-tag--round.sn-tag--mark {
  border-radius: var(--sn-mp-radius-full);
}

/* ── Type palettes (fills the --snui-tag-* locals) ─────────────────────── */

.sn-tag--primary {
  --snui-tag-bg: var(--sn-mp-color-action-primary);
  --snui-tag-soft: var(--sn-mp-color-action-primary-soft);
  --snui-tag-accent: var(--sn-mp-color-action-primary);
}

.sn-tag--success {
  --snui-tag-bg: var(--sn-mp-color-feedback-success);
  --snui-tag-soft: var(--sn-mp-color-feedback-success-soft);
  --snui-tag-accent: var(--sn-mp-color-feedback-success);
}

.sn-tag--warning {
  --snui-tag-bg: var(--sn-mp-color-feedback-warning);
  --snui-tag-soft: var(--sn-mp-color-feedback-warning-soft);
  --snui-tag-accent: var(--sn-mp-color-feedback-warning);
}

.sn-tag--danger {
  --snui-tag-bg: var(--sn-mp-color-feedback-danger);
  --snui-tag-soft: var(--sn-mp-color-feedback-danger-soft);
  --snui-tag-accent: var(--sn-mp-color-feedback-danger);
}

.sn-tag--volcano {
  --snui-tag-bg: var(--sn-mp-color-volcano);
  --snui-tag-soft: var(--sn-mp-color-volcano-soft);
  --snui-tag-accent: var(--sn-mp-color-volcano);
}

.sn-tag--lightblue {
  --snui-tag-bg: var(--sn-mp-color-lightblue);
  --snui-tag-soft: var(--sn-mp-color-lightblue-soft);
  --snui-tag-accent: var(--sn-mp-color-lightblue);
}

.sn-tag--cyan {
  --snui-tag-bg: var(--sn-mp-color-cyan);
  --snui-tag-soft: var(--sn-mp-color-cyan-soft);
  --snui-tag-accent: var(--sn-mp-color-cyan);
}

.sn-tag--pink {
  --snui-tag-bg: var(--sn-mp-color-pink);
  --snui-tag-soft: var(--sn-mp-color-pink-soft);
  --snui-tag-accent: var(--sn-mp-color-pink);
}

.sn-tag--purple {
  --snui-tag-bg: var(--sn-mp-color-purple);
  --snui-tag-soft: var(--sn-mp-color-purple-soft);
  --snui-tag-accent: var(--sn-mp-color-purple);
}

/* ── Variants ──────────────────────────────────────────────────────────── */

/* dark (default): solid fill, white label. */
.sn-tag--variant-dark {
  background-color: var(--snui-tag-bg);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--snui-tag-bg);
}

/* light: tinted fill, accent label. */
.sn-tag--variant-light {
  background-color: var(--snui-tag-soft);
  color: var(--snui-tag-accent);
  border-color: transparent;
}

/* plain: no fill, accent border. */
.sn-tag--variant-plain {
  background-color: transparent;
  color: var(--snui-tag-accent);
  border-color: var(--snui-tag-accent);
}

/* dashed: plain with a dashed border. */
.sn-tag--variant-dashed {
  background-color: transparent;
  color: var(--snui-tag-accent);
  border-style: dashed;
  border-color: var(--snui-tag-accent);
}

/* text: label only. */
.sn-tag--variant-text {
  padding-left: 0;
  padding-right: 0;
  background-color: transparent;
  color: var(--snui-tag-accent);
  border-color: transparent;
}

/* ── Parts ─────────────────────────────────────────────────────────────── */

.sn-tag__icon {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  color: inherit;
  font-size: inherit;
}

.sn-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin-left: 4rpx;
  color: inherit;
  opacity: 0.7;
}

.sn-tag--closable:active .sn-tag__close {
  opacity: 1;
}

.sn-tag__input {
  flex: 1 1 auto;
  min-width: 120rpx;
  padding: 0;
  border: 0;
  background-color: transparent;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* ── Doodle skin ───────────────────────────────────────────────────────── */

.snui-skin-doodle .sn-tag {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-md) var(--sn-mp-radius-sm);
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
