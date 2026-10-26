<script setup lang="ts">
/**
 * sn-backtop (uni-end) — floating "back to top" button.
 *
 * Reference library: wot-ui `wd-backtop`
 *   (https://wot-ui.cn/component/backtop.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-backtop 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-backtop/sn-backtop.vue
 * → auto-registered as `<sn-backtop>` in any .vue that uses it.
 *
 * ## Why the scroll position is a prop, not an internal listener
 *
 * miniprogram pages cannot read `window.scrollY`, and `uni.createSelectorQuery`
 * is async. wd-backtop therefore takes `scrollTop` from the host (the page's
 * own `onPageScroll` or a `scroll-view`'s `@scroll`), which also keeps the
 * component free of listeners it would have to dispose (§41). Scrolling back
 * up goes through `uni.pageScrollTo` when the runtime exposes it, falling back
 * to `scroll-view`'s own `scroll-top` via the same API name.
 *
 * ## Visibility threshold
 *
 * The button appears once `scrollTop` passes `top`. It is rendered (not
 * `v-if`'d away) so the fade transition can run, and hidden buttons ignore
 * taps — a zero-size hit target must not swallow touches.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 页面滚动监听 — 由宿主页面 `onPageScroll` 提供 `scrollTop`
 *   - 回到顶部动画曲线 — 交给宿主的 `pageScrollTo`
 */

import { computed } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import { ArrowRight } from '../sn-icon/sn-icon-set'

defineOptions({ name: 'SnBacktop' })

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-backtop` 1:1 surface ────────────────────────────────── */

    /** 页面滚动距离（由宿主提供）。 */
    scrollTop?: number
    /** 按钮文字。 */
    text?: string
    /** 滚动距离超过该值时显示按钮，单位为 px。 */
    top?: number
    /** 返回顶部滚动时间，单位为 ms。 */
    duration?: number
    /** 组件层级。 */
    zIndex?: number
    /** 自定义图标样式。 */
    iconStyle?: string
    /** 按钮形状：circle / square。 */
    shape?: 'circle' | 'square'
    /** 距离屏幕底部的距离，单位为 px。 */
    bottom?: number
    /** 距离屏幕右侧的距离，单位为 px。 */
    right?: number
    /** 自定义根节点样式。 */
    customStyle?: string
    /** 自定义根节点样式类。 */
    customClass?: string
  }>(),
  {
    scrollTop: 0,
    text: '',
    top: 300,
    duration: 100,
    zIndex: 10,
    iconStyle: '',
    shape: 'circle',
    bottom: 100,
    right: 20,
    customStyle: '',
    customClass: '',
  },
)

const emit = defineEmits<{
  /** 点击按钮时触发（宿主也可自行调用 `pageScrollTo`）。 */
  (e: 'click', event: Event): void
}>()

defineSlots<{
  /** 自定义按钮内容。 */
  default?(): unknown
}>()

/** The button is visible only past the threshold. */
const isVisible = computed(() => props.scrollTop >= props.top)

/**
 * Scroll the page back to the top.
 *
 * `uni.pageScrollTo` is the cross-end API; on H5 it maps to
 * `window.scrollTo`. When the host does not expose it (unit tests, some
 * embedded targets) the call is skipped — the component still emits `click`
 * so the host can scroll its own `scroll-view`.
 */
function scrollToTop(): void {
  if (!isVisible.value) return
  const uni = (globalThis as {
    uni?: { pageScrollTo?: (opts: { scrollTop: number; duration: number }) => unknown }
  }).uni
  if (typeof uni?.pageScrollTo !== 'function') return
  try {
    uni.pageScrollTo({ scrollTop: 0, duration: props.duration })
  } catch {
    /* A host that rejects the API must not break the tap handler. */
  }
}

function onTap(event: Event): void {
  if (!isVisible.value) return
  scrollToTop()
  emit('click', event)
}

const rootClass = computed(() => [
  'sn-backtop',
  `sn-backtop--${props.shape}`,
  {
    'sn-backtop--visible': isVisible.value,
  },
  props.customClass,
])

const rootStyle = computed(() => {
  const parts = [
    `bottom: ${props.bottom}px`,
    `right: ${props.right}px`,
    `z-index: ${props.zIndex}`,
  ]
  if (props.customStyle) parts.push(props.customStyle)
  return parts.join('; ')
})

const iconStyleComputed = computed(() => {
  /* The default glyph points right; rotate it to point up. */
  const base = 'transform: rotate(-90deg)'
  return props.iconStyle ? `${base}; ${props.iconStyle}` : base
})
</script>

<template>
  <view
    data-snui-component="backtop"
    :class="rootClass"
    :style="rootStyle"
    role="button"
    :aria-label="text || 'Back to top'"
    :aria-hidden="!isVisible"
    @tap="onTap"
  >
    <slot>
      <SnIcon class="sn-backtop__icon" :icon="ArrowRight" :size="36" :style="iconStyleComputed" />
      <text v-if="text" class="sn-backtop__text">{{ text }}</text>
    </slot>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-backtop {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 88rpx;
  height: 88rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-primary);
  box-shadow: var(--sn-mp-shadow-sm);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.sn-backtop--circle {
  border-radius: var(--sn-mp-radius-full);
}

.sn-backtop--square {
  border-radius: var(--sn-mp-radius-md);
}

.sn-backtop--visible {
  opacity: 1;
  visibility: visible;
}

.sn-backtop--visible:active {
  opacity: 0.7;
}

.sn-backtop__icon {
  color: var(--sn-mp-color-text-primary);
}

.sn-backtop__text {
  margin-top: var(--sn-mp-spacing-1);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1;
}

/* Doodle skin — heavier outline. */
.snui-skin-doodle .sn-backtop {
  border-width: 4rpx;
  border-color: var(--sn-mp-color-text-primary);
}
</style>
