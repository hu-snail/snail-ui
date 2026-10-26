<script setup lang="ts">
/**
 * sn-slide-verify (uni-end) — drag-to-confirm slider captcha.
 *
 * Reference library: wot-ui `wd-slide-verify`
 *   (https://wot-ui.cn/component/slide-verify.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-slide-verify 1:1
 * except for the documented omission. Anything new added here MUST also be
 * added to the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-slide-verify/sn-slide-verify.vue
 * → auto-registered as `<sn-slide-verify>` in any .vue using it.
 *
 * ## Verification model
 *
 * The button must be dragged all the way to the right edge (`tolerance`
 * absorbs the last few px). This build implements the *distance* check only:
 * there is no puzzle-piece image, because generating one needs a canvas
 * (outside the cross-end allowlist, see `sn-signature`) and the difficulty of
 * a distance-only check is 0 — it is a "confirm you are a human" gesture, not
 * a bot filter. The docs page states that explicitly.
 *
 * ## Documented divergences (CONTRIBUTING §9)
 *
 *   - No puzzle-piece image: generating one needs a canvas (outside the
 *     cross-end allowlist, see `sn-signature`) and a distance-only check is a
 *     "confirm you are human" gesture, not a bot filter.
 *   - The two glyphs default to fixed registry icons (`ChevronRight` / `Check`)
 *     and are replaced through the `icon` / `success-icon` slots, but the
 *     wot-ui icon props (`icon` / `success-icon` / `icon-prefix` / `css-icon` /
 *     `icon-size` / `success-icon-size`) ARE declared: a name resolves through
 *     the iconfont convention (as in `sn-button`), and an explicit `icon-size`
 *     drives the SVG fallback size.
 *
 * ## Geometry
 *
 * The track width is measured once on mount (`onMounted` → one
 * `getBoundingClientRect`) and re-measured through the exposed `init()`.
 * No observer, no timer — nothing to dispose (AGENTS.md §41).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 拼图缺口 / 背景图生成 — 需要 canvas，本轮未实现
 *   - 服务端票据校验 — 由宿主在 `success` 里完成
 */

import { computed, markRaw, onMounted, ref } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { Check as CheckIcon, ChevronRight as ChevronRightIcon } from '../sn-icon/sn-icon-set'

defineOptions({ name: 'SnSlideVerify' })

/** Verified state. */
type VerifyState = 'idle' | 'dragging' | 'success' | 'fail'

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-slide-verify` 1:1 surface (documented omissions) ─────── */

    /** Pixels of slack at the right edge. */
    tolerance?: number
    /** Hint text. Empty = built-in copy. */
    text?: string
    /** Success text. Empty = built-in copy. */
    successText?: string
    /** Disables dragging. */
    disabled?: boolean
    /** Track background color (CSS color). Empty = token default. */
    backgroundColor?: string
    /** Track background color once verified (CSS color). Empty = token default. */
    activeBackgroundColor?: string
    /*
     * Icon props — wot-ui `wd-slide-verify` parity, wired like `sn-button`:
     * a name resolves through the iconfont convention (`classPrefix-name`),
     * `css-icon` renders a bare class, and the size drives the box. An empty
     * name keeps the built-in SVG glyphs below.
     */
    /** Handle glyph name (iconfont). Default `double-right` upstream. */
    icon?: string
    /** Success glyph name (iconfont). Default `check-circle-fill` upstream. */
    successIcon?: string
    /** Iconfont class-name prefix. */
    iconPrefix?: string
    /** Render the name as a bare CSS class (`true` = also apply the raw name). */
    cssIcon?: boolean | string
    /** Handle glyph size — a bare number is rpx. */
    iconSize?: number | string
    /** Success glyph size — a bare number is rpx. */
    successIconSize?: number | string
    /** Class on the root node. */
    customClass?: string
    /** Inline style on the root node. */
    customStyle?: string
  }>(),
  {
    tolerance: 10,
    text: '',
    successText: '',
    disabled: false,
    backgroundColor: '',
    activeBackgroundColor: '',
    customClass: '',
    icon: '',
    successIcon: '',
    iconPrefix: 'sn-icon',
    cssIcon: false,
    iconSize: 28,
    successIconSize: 28,
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'fail'): void
}>()

/** Built-in SVG glyphs used when the name props are empty. */
const handleIcon: IconData = markRaw(ChevronRightIcon)
const defaultSuccessIcon: IconData = markRaw(CheckIcon)

/** Size handed to sn-icon (a bare number is an rpx design value → `size`). */
const handleIconSize = computed(() => props.iconSize)
const successIconSizeValue = computed(() => props.successIconSize)

/* ── Geometry ──────────────────────────────────────────────────────────── */

/** Track width in px, measured on mount / `init()`. */
const trackWidth = ref(0)
/** Button width in px design units — fixed so the maths is stable. */
const BUTTON_SIZE = 44

const trackRef = ref<{
  getBoundingClientRect?: () => { width: number, left: number }
} | null>(null)

function init(): void {
  const el = trackRef.value
  if (!el || typeof el.getBoundingClientRect !== 'function') return
  trackWidth.value = el.getBoundingClientRect().width
}

onMounted(init)

/* ── Drag ──────────────────────────────────────────────────────────────── */

const state = ref<VerifyState>('idle')
/** Travel distance in px design units. */
const offset = ref(0)
let dragStartX = 0
/** Max travel: track width minus the button. */
const maxOffset = computed(() => Math.max(trackWidth.value - BUTTON_SIZE, 0))

function touchX(event: Event): number {
  const detail = event as unknown as {
    touches?: Array<{ clientX?: number, pageX?: number }>
    changedTouches?: Array<{ clientX?: number, pageX?: number }>
    detail?: { x?: number }
  }
  const list = detail.touches ?? detail.changedTouches
  const point = list && list.length > 0 ? list[0] : undefined
  if (point && typeof point.clientX === 'number') return point.clientX
  if (point && typeof point.pageX === 'number') return point.pageX
  if (detail.detail && typeof detail.detail.x === 'number') return detail.detail.x
  return 0
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function onTouchStart(event: Event): void {
  if (props.disabled || state.value === 'success') return
  dragStartX = touchX(event)
  state.value = 'dragging'
}

function onTouchMove(event: Event): void {
  if (props.disabled || state.value !== 'dragging') return
  event.preventDefault()
  const delta = touchX(event) - dragStartX
  offset.value = clamp(delta, 0, maxOffset.value)
}

function onTouchEnd(): void {
  if (state.value !== 'dragging') return
  const reached = maxOffset.value > 0
    ? offset.value >= maxOffset.value - props.tolerance
    : false
  if (reached) {
    offset.value = maxOffset.value
    state.value = 'success'
    emit('success')
    return
  }
  offset.value = 0
  state.value = 'fail'
  emit('fail')
  // Snap back to idle so the gesture can be retried without a prop change.
  state.value = 'idle'
}

function onTouchCancel(): void {
  if (state.value !== 'dragging') return
  offset.value = 0
  state.value = 'idle'
}

/** Public imperative API (wd-slide-verify parity). */
function reset(): void {
  offset.value = 0
  state.value = 'idle'
}

defineExpose({ init, reset })

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-slide-verify',
  {
    'sn-slide-verify--success': state.value === 'success',
    'sn-slide-verify--dragging': state.value === 'dragging',
    'sn-slide-verify--disabled': props.disabled,
  },
  props.customClass,
])

const rootStyle = computed(() => {
  const vars: string[] = []
  if (props.backgroundColor) vars.push(`--sn-slide-verify-track-bg: ${props.backgroundColor}`)
  if (props.activeBackgroundColor) {
    vars.push(`--sn-slide-verify-track-active-bg: ${props.activeBackgroundColor}`)
  }
  const base = vars.join('; ')
  if (!props.customStyle) return base
  return base ? `${base}; ${props.customStyle}` : props.customStyle
})

/** rpx offset for the handle (`1px design = 2rpx`). */
const handleStyle = computed(() => `transform: translateX(${offset.value * 2}rpx)`)

const hintText = computed(() => {
  if (state.value === 'success') return props.successText || '验证通过'
  return props.text || '向右拖动滑块'
})
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'slide-verify'"
    role="group"
    :aria-label="hintText"
  >
    <view
      ref="trackRef"
      class="sn-slide-verify__track"
      :aria-disabled="props.disabled ? 'true' : undefined"
    >
      <text class="sn-slide-verify__text">{{ hintText }}</text>

      <view
        :class="['sn-slide-verify__handle', { 'sn-slide-verify__handle--success': state === 'success' }]"
        :style="handleStyle"
        role="button"
        :aria-label="hintText"
        :tabindex="props.disabled || state === 'success' ? -1 : 0"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchCancel"
      >
        <slot v-if="state === 'success'" name="success-icon">
          <!-- Name wins (iconfont path, as in sn-button); otherwise the built-in SVG. -->
          <SnIcon
            v-if="props.successIcon"
            :name="props.successIcon"
            :class-prefix="props.iconPrefix"
            :css-icon="props.cssIcon"
            :size="successIconSizeValue"
          />
          <SnIcon v-else :icon="defaultSuccessIcon" :size="successIconSizeValue" />
        </slot>
        <slot v-else name="icon">
          <SnIcon
            v-if="props.icon"
            :name="props.icon"
            :class-prefix="props.iconPrefix"
            :css-icon="props.cssIcon"
            :size="handleIconSize"
          />
          <SnIcon v-else :icon="handleIcon" :size="handleIconSize" />
        </slot>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-slide-verify {
  display: block;
  width: 100%;
  font-family: inherit;
}

.sn-slide-verify__track {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 88rpx;
  box-sizing: border-box;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-slide-verify-track-bg, var(--sn-mp-color-background-soft));
  overflow: hidden;
}

.sn-slide-verify--success .sn-slide-verify__track {
  background-color: var(--sn-slide-verify-track-active-bg, var(--sn-mp-color-feedback-success-soft));
}

.sn-slide-verify__text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
  pointer-events: none;
}

.sn-slide-verify--success .sn-slide-verify__text {
  color: var(--sn-mp-color-feedback-success);
}

.sn-slide-verify__handle {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-action-primary);
  box-shadow: var(--sn-mp-shadow-sm);
}

.sn-slide-verify__handle--success {
  color: var(--sn-mp-color-feedback-success);
}

.sn-slide-verify--disabled {
  opacity: 0.5;
}

/* Doodle skin — hand-drawn track + handle outline. */
.snui-skin-doodle .sn-slide-verify__track,
.snui-skin-doodle .sn-slide-verify__handle {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
