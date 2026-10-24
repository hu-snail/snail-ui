<script setup lang="ts">
/**
 * sn-notice-bar (uni-end) — scrolling / wrapping notice strip for mobile.
 *
 * Reference library: wot-ui `wd-notice-bar`
 *   (https://wot-ui.cn/component/notice-bar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-notice-bar 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-notice-bar/sn-notice-bar.vue
 * → auto-registered as `<sn-notice-bar>` in any .vue that uses it.
 *
 * ## Marquee implementation (AGENTS.md §41 — no `document`, no listeners)
 *
 * The horizontal marquee is a CSS keyframe driven by one inline custom
 * property (`--sn-notice-bar-duration`). Only the *index* advance of the
 * vertical (`direction="vertical"`) mode needs a timer: it is a single
 * `setInterval` created on mount and cleared in `onBeforeUnmount` plus whenever
 * `text` / `direction` / `delay` change. No `window` / `document` access
 * anywhere, so nothing else can leak.
 *
 * ## Documented divergences from wd-notice-bar
 *
 *   - `speed` is honoured as "px per second" by converting it into a keyframe
 *     duration from the measured text length; on miniprogram the measure is a
 *     character-count estimate (`字符数 × 字号`), because there is no layout
 *     API in a cross-end component. The reference measures real text width.
 *   - `direction="vertical"` shows one line at a time, advanced by `speed`-based
 *     intervals rather than by a scroll animation.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 * No schema validation; no business logic.
 *
 * Not responsible for:
 *   - 顶部通知横幅（滑入 / 自动消失）— 用 sn-notify
 *   - 无停留的轻提示 — 用 sn-toast
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { resolveFeedbackIcon } from '../sn-icon/sn-icon-feedback'
import { resolveIconByName } from '../sn-icon/sn-icon-registry'
import { X as XIcon } from '../sn-icon/sn-icon-set'

defineOptions({ name: 'SnNoticeBar' })

/** Semantic type. Mirrors `wd-notice-bar` `type`. */
type NoticeBarType = 'warning' | 'info' | 'danger'

/** Scroll axis. Mirrors `wd-notice-bar` `direction`. */
type NoticeBarDirection = 'horizontal' | 'vertical'

/** Rough glyph advance as a fraction of the font size, for the duration estimate. */
const CHAR_WIDTH_RATIO = 0.95
/** Fallback font size in px when the token cannot be resolved at runtime. */
const FALLBACK_FONT_PX = 14
/** Minimum marquee cycle, so a very short text still reads as motion. */
const MIN_CYCLE_SECONDS = 4

const props = withDefaults(
  defineProps<{
    /** Notice text — a string or an array of lines. */
    text?: string | string[]
    /** Semantic type — drives the tint. */
    type?: NoticeBarType
    /** Left icon name (sn-icon registry); empty falls back to the type glyph. */
    prefix?: string
    /** Enable the marquee. `false` shows a static (optionally wrapped) strip. */
    scrollable?: boolean
    /** Delay before the marquee starts, in seconds. */
    delay?: number
    /** Marquee speed in px per second (converted into a cycle duration). */
    speed?: number
    /** Show the close button. */
    closable?: boolean
    /** Wrap long text onto multiple lines; only applies when `scrollable` is false. */
    wrapable?: boolean
    /** Text and icon color override (any CSS color value). */
    color?: string
    /** Background color override (any CSS color value). */
    backgroundColor?: string
    /** Scroll axis. */
    direction?: NoticeBarDirection
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
  }>(),
  {
    text: '',
    type: 'warning',
    prefix: '',
    scrollable: true,
    delay: 1,
    speed: 50,
    closable: false,
    wrapable: false,
    color: '',
    backgroundColor: '',
    direction: 'horizontal',
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** Custom leading content; overrides `prefix`. */
  prefix?(): unknown
  /** Custom trailing content; overrides the default close button. */
  suffix?(): unknown
  /** Custom notice text (horizontal direction only). */
  default?(): unknown
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'next', index: number): void
  (e: 'click', payload: { text: string; index: number }): void
}>()

/** Notice text normalised to an array of lines. */
const lines = computed<string[]>(() => {
  if (Array.isArray(props.text)) return props.text
  return props.text === '' ? [] : [props.text]
})

/** Closed by the user — the strip stays hidden until `text` changes. */
const closed = ref(false)
watch(() => props.text, () => {
  closed.value = false
})

/** Vertical mode: the line currently on screen. */
const activeIndex = ref(0)

/** Interval handle for vertical mode (cleared on unmount, §41). */
let rotateTimer: ReturnType<typeof setInterval> | null = null

function clearRotateTimer(): void {
  if (rotateTimer !== null) {
    clearInterval(rotateTimer)
    rotateTimer = null
  }
}

/** Cycle for one full marquee pass, derived from `speed` and the text length. */
const marqueeSeconds = computed(() => {
  const longest = lines.value.reduce((max, line) => Math.max(max, line.length), 0)
  const estimatedWidth = longest * FALLBACK_FONT_PX * CHAR_WIDTH_RATIO
  const pxPerSecond = props.speed > 0 ? props.speed : 50
  return Math.max(MIN_CYCLE_SECONDS, estimatedWidth / pxPerSecond)
})

/** Vertical rotation interval — one line every `speed`-derived dwell. */
const rotateIntervalMs = computed(() => Math.max(1000, marqueeSeconds.value * 1000 / 2))

function startRotateTimer(): void {
  clearRotateTimer()
  if (!props.scrollable || props.direction !== 'vertical' || lines.value.length <= 1) return
  rotateTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % lines.value.length
    emit('next', activeIndex.value)
  }, rotateIntervalMs.value)
}

watch(
  () => [props.text, props.direction, props.scrollable, rotateIntervalMs.value],
  () => {
    activeIndex.value = 0
    startRotateTimer()
  },
  { immediate: true },
)

onBeforeUnmount(clearRotateTimer)

/** Resolve the leading icon: `prefix` from the registry, else the type glyph. */
const prefixIcon = computed<IconData | null>(() => {
  if (props.prefix) {
    const registered = resolveIconByName(props.prefix)
    if (registered) return registered
  }
  return resolveFeedbackIcon(props.type)
})

/** The line rendered in the static / horizontal-marquee modes. */
const primaryText = computed(() => lines.value[0] ?? '')

const isHorizontalMarquee = computed(
  () => props.scrollable && props.direction === 'horizontal' && lines.value.length > 0,
)

const isVertical = computed(() => props.direction === 'vertical')

const rootClass = computed(() => [
  'sn-notice-bar',
  `sn-notice-bar--${props.type}`,
  {
    'sn-notice-bar--wrapable': props.wrapable && !props.scrollable,
    'sn-notice-bar--vertical': isVertical.value,
  },
  props.customClass,
])

const rootStyle = computed(() => {
  const parts: string[] = []
  if (props.color) parts.push(`color: ${props.color}`)
  if (props.backgroundColor) parts.push(`background-color: ${props.backgroundColor}`)
  if (isHorizontalMarquee.value) {
    parts.push(`--sn-notice-bar-duration: ${marqueeSeconds.value}s`)
    parts.push(`--sn-notice-bar-delay: ${Math.max(0, props.delay)}s`)
  }
  if (props.customStyle) parts.push(props.customStyle)
  return parts.length > 0 ? parts.join('; ') : undefined
})

function onClose(event: Event): void {
  event.stopPropagation()
  closed.value = true
  emit('close')
}

function onClick(): void {
  if (isVertical.value) {
    emit('click', { text: lines.value[activeIndex.value] ?? '', index: activeIndex.value })
    return
  }
  emit('click', { text: primaryText.value, index: 0 })
}
</script>

<template>
  <view
    v-if="!closed && lines.length > 0"
    data-snui-component="notice-bar"
    :class="rootClass"
    :style="rootStyle"
    role="marquee"
    :aria-live="scrollable ? 'off' : 'polite'"
  >
    <view class="sn-notice-bar__prefix" aria-hidden="true">
      <slot name="prefix">
        <SnIcon v-if="prefixIcon" :icon="prefixIcon" :size="36" />
      </slot>
    </view>

    <view class="sn-notice-bar__body" @tap="onClick">
      <slot>
        <view v-if="isVertical" class="sn-notice-bar__vertical">
          <text class="sn-notice-bar__text">{{ lines[activeIndex] }}</text>
        </view>

        <view v-else-if="isHorizontalMarquee" class="sn-notice-bar__marquee">
          <view class="sn-notice-bar__track">
            <text class="sn-notice-bar__text">{{ primaryText }}</text>
          </view>
        </view>

        <text v-else class="sn-notice-bar__text">{{ primaryText }}</text>
      </slot>
    </view>

    <view v-if="closable || $slots.suffix" class="sn-notice-bar__suffix">
      <slot name="suffix">
        <view
          v-if="closable"
          class="sn-notice-bar__close"
          role="button"
          aria-label="close"
          @tap="onClose"
        >
          <SnIcon :icon="XIcon" :size="32" />
        </view>
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-notice-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}

/* ── Type tints (soft surface + semantic foreground) ───────────────────── */

.sn-notice-bar--warning {
  background-color: var(--sn-mp-color-feedback-warning-soft);
  color: var(--sn-mp-color-feedback-warning);
}
.sn-notice-bar--info {
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-feedback-info);
}
.sn-notice-bar--danger {
  background-color: var(--sn-mp-color-feedback-danger-soft);
  color: var(--sn-mp-color-feedback-danger);
}

/* ── Prefix / suffix ───────────────────────────────────────────────────── */

.sn-notice-bar__prefix,
.sn-notice-bar__suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: inherit;
}

.sn-notice-bar__suffix:empty {
  display: none;
}

.sn-notice-bar__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  color: inherit;
}

/* ── Body ─────────────────────────────────────────────────────────────── */

.sn-notice-bar__body {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}

.sn-notice-bar__text {
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  white-space: nowrap;
}

.sn-notice-bar--wrapable .sn-notice-bar__text {
  display: block;
  white-space: normal;
  word-break: break-all;
}

/* ── Horizontal marquee ───────────────────────────────────────────────── */

.sn-notice-bar__marquee {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.sn-notice-bar__track {
  display: inline-block;
  white-space: nowrap;
  animation-name: sn-notice-bar-marquee;
  animation-duration: var(--sn-notice-bar-duration, 10s);
  animation-delay: var(--sn-notice-bar-delay, 0s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes sn-notice-bar-marquee {
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
}

/* ── Vertical rotation ────────────────────────────────────────────────── */

.sn-notice-bar__vertical {
  overflow: hidden;
  height: 1.5em;
}

.sn-notice-bar__vertical .sn-notice-bar__text {
  display: block;
  height: 1.5em;
  line-height: 1.5em;
}

/* Doodle skin — dashed left rule instead of the soft fill. */
.snui-skin-doodle .sn-notice-bar {
  border-left: 6rpx dashed currentColor;
}
</style>
