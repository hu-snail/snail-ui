<script setup lang="ts">
/**
 * sn-grid-item (uni-end) — one cell in a `sn-grid`.
 *
 * Reference library: wot-ui `wd-grid-item`
 *   (https://wot-ui.cn/component/grid.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-grid-item 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Lives next to `sn-grid.vue` so the provide/inject contract types
 * (`sn-grid-types.ts`) stay beside both halves of the pair.
 *
 * ## `url` / `linkType` do not navigate
 *
 * A component must not own routing (§60 — AppBridge is the host capability
 * boundary). The pair is forwarded to the `click` payload so the host decides
 * between `navigateTo` / `switchTab` / `reLaunch` / `redirectTo`.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 路由跳转 — 由宿主按 `click` 的 `url` / `linkType` 决定
 *   - 列数 / 间距 — 配置在 sn-grid 上
 *   - 徽标本体 — 用 sn-badge（本组件内置了同一套角标渲染）
 */

import { computed, inject, markRaw } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { resolveIconByName } from '../sn-icon/sn-icon-registry'
import { SN_GRID_KEY } from './sn-grid-types'

defineOptions({ name: 'SnGridItem' })

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-grid-item` 1:1 surface ──────────────────────────────── */

    /** 文字内容。 */
    text?: string
    /** 是否超出隐藏显示省略号。 */
    ellipsis?: boolean
    /** 图标名称（经 `registerSnIcons()` 注册）。 */
    icon?: string
    /** 图标颜色（内联覆盖）。 */
    iconColor?: string
    /** 图标类名前缀，`cssIcon` 打开时用于拼出字体图标 class。 */
    iconPrefix?: string
    /** CSS（字体）图标：`true` 用 `iconPrefix`，字符串则直接作为 class 前缀。 */
    cssIcon?: boolean | string
    /** 是否显示图标右上角小红点。 */
    isDot?: boolean
    /** 图标右上角徽标显示值。 */
    value?: string | number | undefined
    /** 图标右上角徽标最大值，超过后显示 `{max}+`。 */
    max?: number
    /** 点击后跳转的链接地址（仅随 `click` 透出）。 */
    url?: string
    /** 页面跳转方式（仅随 `click` 透出）。 */
    linkType?: 'navigateTo' | 'switchTab' | 'reLaunch' | 'redirectTo'
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义样式。 */
    customStyle?: string
  }>(),
  {
    text: '',
    ellipsis: false,
    icon: '',
    iconColor: '',
    iconPrefix: '',
    cssIcon: false,
    isDot: false,
    value: undefined,
    max: 99,
    url: '',
    linkType: 'navigateTo',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  /** 点击（或跳转）时触发；`url` / `linkType` 随 payload 透出。 */
  (e: 'click', payload: { url: string; linkType: string }): void
}>()

defineSlots<{
  /** 自定义全部内容。 */
  default?(): unknown
  /** 图标位内容。 */
  icon?(): unknown
  /** 文本位内容。 */
  text?(): unknown
}>()

const grid = inject(SN_GRID_KEY, null)

/** Share of the row this cell occupies. */
const cellWidth = computed(() => {
  const column = grid?.column.value ?? 3
  return `${100 / Math.max(1, column)}%`
})

/** Gutter as symmetric padding (the grid supplies the outer half). */
const gutterStyle = computed(() => {
  const gutter = grid?.gutter.value ?? 0
  if (gutter <= 0) return undefined
  return `padding: ${gutter / 2}px`
})

const isClickable = computed(() => grid?.clickable.value ?? false)

const iconData = computed<IconData | null>(() => {
  if (!props.icon) return null
  const resolved = resolveIconByName(props.icon)
  return resolved ? markRaw(resolved) : null
})

/** Font-icon class list — mirrors sn-tag's `cssIcon` handling. */
const cssIconClass = computed<string>(() => {
  if (!props.icon || !props.cssIcon) return ''
  const prefix = typeof props.cssIcon === 'string' ? props.cssIcon : props.iconPrefix
  return prefix ? `${prefix}-${props.icon}` : props.icon
})

/** Badge text: `{max}+` above the ceiling, dot mode renders no text. */
const badgeText = computed<string>(() => {
  if (props.isDot || props.value === undefined || props.value === '') return ''
  if (typeof props.value === 'number' && props.value > props.max) return `${props.max}+`
  return String(props.value)
})

const contentClass = computed(() => [
  'sn-grid-item__content',
  {
    'sn-grid-item__content--horizontal': grid?.direction.value === 'horizontal',
    'sn-grid-item__content--reverse': grid?.reverse.value ?? false,
    'sn-grid-item__content--center': grid?.center.value ?? true,
    'sn-grid-item__content--square': grid?.square.value ?? false,
  },
])

const hoverClass = computed(() => grid?.hoverClass.value ?? '')

function onTap(): void {
  if (props.url || isClickable.value) {
    emit('click', { url: props.url, linkType: props.linkType })
  }
}

const rootClass = computed(() => [
  'sn-grid-item',
  {
    'sn-grid-item--clickable': isClickable.value,
    'sn-grid-item--square': grid?.square.value ?? false,
  },
  props.customClass,
])

const rootStyle = computed(() => {
  const parts = [`flex: 0 0 ${cellWidth.value}`, `max-width: ${cellWidth.value}`]
  if (gutterStyle.value) parts.push(gutterStyle.value)
  if (props.customStyle) parts.push(props.customStyle)
  return parts.join('; ')
})
</script>

<template>
  <view
    data-snui-component="grid-item"
    :class="rootClass"
    :style="rootStyle"
    :hover-class="isClickable ? hoverClass : 'none'"
    role="listitem"
    @tap="onTap"
  >
    <view :class="contentClass">
      <slot>
        <view class="sn-grid-item__icon-wrap" :class="{ 'sn-grid-item__icon-wrap--reverse': grid?.reverse.value }">
          <slot name="icon">
            <SnIcon
              v-if="iconData"
              class="sn-grid-item__icon"
              :icon="iconData"
              :size="grid?.iconSize.value ?? '28px'"
              :style="iconColor ? `color: ${iconColor}` : undefined"
            />
            <text
              v-else-if="cssIconClass"
              :class="['sn-grid-item__icon', cssIconClass]"
              aria-hidden="true"
            />
          </slot>
          <view
            v-if="isDot || badgeText"
            class="sn-grid-item__badge"
            :class="{ 'sn-grid-item__badge--dot': isDot }"
          >
            <text v-if="badgeText" class="sn-grid-item__badge-text">{{ badgeText }}</text>
          </view>
        </view>

        <view class="sn-grid-item__text-wrap">
          <slot name="text">
            <text
              class="sn-grid-item__text"
              :class="{ 'sn-grid-item__text--ellipsis': ellipsis }"
            >{{ text }}</text>
          </slot>
        </view>
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-grid-item {
  display: flex;
  box-sizing: border-box;
  min-width: 0;
}

.sn-grid-item__content {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-4) var(--sn-mp-spacing-2);
  gap: var(--sn-mp-spacing-2);
}

.sn-grid-item__content--horizontal {
  flex-direction: row;
}

.sn-grid-item__content--center {
  justify-content: center;
}

/* Square cells — padding-box trick, so no JS measurement is needed. */
.sn-grid-item__content--square {
  height: 0;
  padding-bottom: 100%;
  padding-top: 0;
}

.sn-grid-item__content--square .sn-grid-item__icon-wrap,
.sn-grid-item__content--square .sn-grid-item__text-wrap {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-grid-item__content--square .sn-grid-item__icon-wrap {
  top: 28%;
}

.sn-grid-item__content--square .sn-grid-item__text-wrap {
  top: 52%;
}

.sn-grid-item__content--reverse .sn-grid-item__icon-wrap {
  order: 2;
}

.sn-grid-item__icon-wrap {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: var(--sn-mp-color-text-secondary);
}

.sn-grid-item__icon {
  color: inherit;
}

.sn-grid-item__text-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.sn-grid-item__text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-tight);
  text-align: center;
}

.sn-grid-item__text--ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-grid-item__badge {
  position: absolute;
  top: -8rpx;
  right: -16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28rpx;
  height: 28rpx;
  padding: 0 6rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-feedback-danger);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-grid-item__badge--dot {
  top: -4rpx;
  right: -8rpx;
  min-width: 14rpx;
  width: 14rpx;
  height: 14rpx;
  padding: 0;
}

.sn-grid-item__badge-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1;
}

.sn-grid-item--clickable:active .sn-grid-item__content {
  background-color: var(--sn-mp-color-background-soft);
}

/* Doodle skin — heavier label. */
.snui-skin-doodle .sn-grid-item__text {
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
