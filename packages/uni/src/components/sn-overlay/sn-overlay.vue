<script setup lang="ts">
/**
 * sn-overlay (uni-end) — full-screen scrim layer for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-overlay`
 *   (https://wot-ui.cn/component/overlay.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-overlay 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-overlay/sn-overlay.vue
 * → auto-registered as `<sn-overlay>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 *
 * ## Background scroll lock (AGENTS.md §41 / uni has no `document`)
 *
 * uni-app runs on miniprogram targets that have neither `document` nor a
 * scrollable `body`. The lock is therefore expressed as a `catchtouchmove`
 * gesture interception on the overlay itself (`.stop` + `preventDefault`),
 * which stops the gesture from reaching the page behind the scrim. No global
 * listener is registered, so there is nothing to dispose beyond the animation
 * timer below.
 *
 * Not responsible for:
 *   - 带面板 / 位置动画的弹出层 — 用 sn-popup
 *   - 居中的确认框 — 用 sn-dialog
 *   - 页面路由级遮罩 — 由宿主 AppBridge 决定
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({ name: 'SnOverlay' })

/**
 * Animation duration. `false` disables the animation, `true` falls back to the
 * 300ms default, and a record sets the enter / leave legs independently —
 * mirrors `wd-overlay` `duration`.
 */
type OverlayDuration = number | boolean | Record<string, number>

const DEFAULT_DURATION = 300

const props = withDefaults(
  defineProps<{
    /** Whether the overlay is shown. */
    show?: boolean
    /** Animation duration in ms. `false` = no animation, record = per-leg. */
    duration?: OverlayDuration
    /** Lock background scroll while shown (intercepts touchmove). */
    lockScroll?: boolean
    /** Stacking level. */
    zIndex?: number
    /** Custom inline style for the root node. */
    customStyle?: string
    /** Custom class for the root node. */
    customClass?: string
  }>(),
  {
    show: false,
    duration: DEFAULT_DURATION,
    lockScroll: true,
    zIndex: 10,
    customStyle: '',
    customClass: '',
  },
)

defineSlots<{
  /** Content rendered on top of the scrim (centred). */
  default?(): unknown
}>()

const emit = defineEmits<{
  (e: 'click', event: Event): void
  (e: 'before-enter'): void
  (e: 'enter'): void
  (e: 'after-enter'): void
  (e: 'before-leave'): void
  (e: 'leave'): void
  (e: 'after-leave'): void
}>()

/** Resolve the duration for one animation leg. */
function resolveDuration(value: OverlayDuration, leg: 'enter' | 'leave'): number {
  if (value === false) return 0
  if (value === true) return DEFAULT_DURATION
  if (typeof value === 'number') return value
  const legValue = value[leg] ?? value.enter ?? value.leave
  return typeof legValue === 'number' ? legValue : DEFAULT_DURATION
}

/** Node present in the tree. Cleared once the leave animation finished. */
const isMounted = ref(props.show)
/** Target visible state — drives the opacity transition. */
const isShown = ref(props.show)
/** Duration of the currently running leg (drives the inline transition). */
const durationMs = ref(resolveDuration(props.duration, 'enter'))

/** Single pending animation timer (disposed on unmount, §41). */
let timer: ReturnType<typeof setTimeout> | null = null

/**
 * Animation generation. `enter()` awaits a tick before flipping the visible
 * state, so a close landing inside that window would otherwise have its leave
 * timer overwritten by the resumed enter leg — the node would stay mounted and
 * `after-leave` would never fire. Every leg bumps the token and drops its
 * result when a newer leg has started.
 */
let generation = 0

function clearTimer(): void {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
}

async function enter(): Promise<void> {
  clearTimer()
  const token = ++generation
  durationMs.value = resolveDuration(props.duration, 'enter')
  emit('before-enter')
  isMounted.value = true
  // One tick so the initial (hidden) style is committed before the
  // transition class lands — otherwise the browser coalesces both frames
  // and the overlay pops in without animating.
  await nextTick()
  // A leave started while we were waiting for the tick — abandon this leg.
  if (token !== generation) return
  isShown.value = true
  emit('enter')
  if (durationMs.value <= 0) {
    emit('after-enter')
    return
  }
  timer = setTimeout(() => {
    timer = null
    if (token !== generation) return
    emit('after-enter')
  }, durationMs.value)
}

function leave(): void {
  clearTimer()
  const token = ++generation
  durationMs.value = resolveDuration(props.duration, 'leave')
  emit('before-leave')
  isShown.value = false
  emit('leave')
  if (durationMs.value <= 0) {
    isMounted.value = false
    emit('after-leave')
    return
  }
  timer = setTimeout(() => {
    timer = null
    if (token !== generation) return
    isMounted.value = false
    emit('after-leave')
  }, durationMs.value)
}

watch(
  () => props.show,
  (value) => {
    if (value) void enter()
    else leave()
  },
)

onMounted(() => {
  // Initial `show` renders immediately without replaying the enter events —
  // a popup that is already open on first paint was never "entered".
  if (props.show) {
    isMounted.value = true
    isShown.value = true
  }
})

onBeforeUnmount(clearTimer)

const rootClass = computed(() => [
  'sn-overlay',
  { 'sn-overlay--shown': isShown.value },
  props.customClass,
])

const rootStyle = computed(() => {
  const style = [
    `z-index: ${props.zIndex}`,
    `transition-duration: ${durationMs.value}ms`,
    props.customStyle,
  ].filter(Boolean)
  return style.join('; ')
})

function onTap(event: Event): void {
  emit('click', event)
}

/**
 * Intercept the gesture while `lockScroll` is on. Mirrors uni-app's
 * `catchtouchmove`: the event neither bubbles to the page nor scrolls it.
 */
function onTouchMove(event: Event): void {
  if (!props.lockScroll) return
  event.preventDefault()
}
</script>

<template>
  <view
    v-if="isMounted"
    data-snui-component="overlay"
    :class="rootClass"
    :style="rootStyle"
    @tap="onTap"
    @touchmove.stop="onTouchMove"
  >
    <view class="sn-overlay__content">
      <slot />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  /* Scrim token: near-black in light, deeper near-black in dark — the page
   * behind it is dark already, so the alpha does not need to change. */
  background-color: var(--sn-mp-color-background-overlay);
  opacity: 0;
  transition-property: opacity;
  transition-timing-function: ease;
}

.sn-overlay--shown {
  opacity: 1;
}

.sn-overlay__content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sn-mp-color-text-on-primary);
}
</style>
