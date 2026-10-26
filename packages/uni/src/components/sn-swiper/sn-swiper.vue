<script setup lang="ts">
/**
 * sn-swiper (uni-end) — carousel built on the native `<swiper>` element.
 *
 * Reference library: wot-ui `wd-swiper`
 *   (https://wot-ui.cn/component/swiper.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-swiper 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-swiper/sn-swiper.vue
 * → auto-registered as `<sn-swiper>` in any .vue that uses it.
 *
 * ## Autoplay is the platform's, not a timer here (AGENTS.md §41)
 *
 * The native `<swiper>` element owns the autoplay interval and its own touch
 * handling, so no `setInterval` / listener is created by this component — there
 * is nothing to dispose on unmount. `autoplay` is forwarded as a boolean, and
 * `interval` / `duration` are forwarded verbatim. This is the reason the uni
 * end can honour `loop` / `display-multiple-items` without reimplementing a
 * swipe engine.
 *
 * ## Documented divergences from wd-swiper
 *
 *   - Video playback is not implemented: `<video>` cannot be driven reliably
 *     from a cross-end carousel (playback control differs per vendor). Item
 *     objects with `type: 'video'` render as an image poster instead. The
 *     video props (`autoplay-video` / `muted` / `video-loop` /
 *     `stop-previous-video` / `stop-autoplay-when-video-play`) ARE declared so
 *     a wd-swiper config type-checks unchanged, but they have no rendering
 *     effect while video items degrade to their poster.
 *   - `adjust-height` / `adjust-vertical-height` are Alipay-only in the
 *     reference. They are declared and forwarded to the native `<swiper>`
 *     (Alipay honours them; other vendors ignore the attributes).
 *   - `custom-prev-image-class` / `custom-next-image-class` /
 *     `custom-prev-class` / `custom-next-class` are declared for parity; this
 *     build renders no prev / next peek slides, so nothing consumes them yet.
 *   - `easing-function` is forwarded to the native swiper, which only honours
 *     its own fixed ease set — pass `default` unless a target documents support.
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 单图（含预览 / 加载态）— 用 sn-img
 *   - 轮播内容为复杂卡片 — 用 `<swiper>` 原生元素自建
 */

import { computed } from 'vue'
import SnImg from '../sn-img/sn-img.vue'

defineOptions({ name: 'SnSwiper' })

/** Scroll axis. Mirrors `wd-swiper` `direction`. */
type SwiperDirection = 'horizontal' | 'vertical'

/** Indicator anchor. Mirrors `wd-swiper` `indicator-position`. */
type SwiperIndicatorPosition =
  | 'left' | 'top-left' | 'top' | 'top-right'
  | 'bottom-left' | 'bottom' | 'bottom-right' | 'right'

/** Image crop mode (uni `<image mode>`), forwarded to sn-img. */
type SwiperImageMode = 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix'

/** Indicator style. Mirrors `wd-swiper` `indicator.type`. */
type SwiperIndicatorType = 'dots' | 'dots-bar' | 'fraction'

/** One slide object. Mirrors the `SwiperItem` row group of the wd table. */
export interface SnSwiperItem {
  /** Image / video URL. */
  value?: string
  /** Poster for video items (rendered as the image). */
  poster?: string
  /** Caption rendered over the slide. */
  text?: string
  /** Resource kind; `video` degrades to its poster (see header). */
  type?: 'image' | 'video'
}

/** Indicator config. Mirrors `wd-swiper` `indicator`. */
export interface SnSwiperIndicator {
  /** Indicator style. */
  type?: SwiperIndicatorType
  /** Hide the indicator below this slide count. */
  minShowNum?: number
  /** Show the prev / next arrows. */
  showControls?: boolean
}

const props = withDefaults(
  defineProps<{
    /** Autoplay. */
    autoplay?: boolean
    /** Current slide index (v-model:current). */
    current?: number
    /** Scroll axis. */
    direction?: SwiperDirection
    /** Slides visible at once. */
    displayMultipleItems?: number
    /** Slide transition duration in ms. */
    duration?: number
    /** Easing name (parity; the native swiper uses a fixed ease). */
    easingFunction?: string
    /** Height of the carousel — a bare number is treated as rpx. */
    height?: string | number
    /** Autoplay interval in ms. */
    interval?: number
    /** Slide data: strings or `SwiperItem` objects. */
    list?: Array<string | SnSwiperItem>
    /** Loop the slides. */
    loop?: boolean
    /** Loop video items (declared for parity; video degrades to its poster). */
    videoLoop?: boolean
    /** Mute video items (declared for parity; video degrades to its poster). */
    muted?: boolean
    /** Autoplay video items (declared for parity; see header). */
    autoplayVideo?: boolean
    /** Stop the previous slide's video on change (parity; see header). */
    stopPreviousVideo?: boolean
    /** Pause autoplay while a video plays (parity; see header). */
    stopAutoplayWhenVideoPlay?: boolean
    /**
     * Auto-size the container to the slide height. Alipay-only upstream; the
     * value is forwarded to the native `<swiper>` and ignored elsewhere.
     * `''` (default) leaves the height to the `height` prop.
     */
    adjustHeight?: 'first' | 'current' | 'highest' | ''
    /** Force `adjustHeight` to apply in vertical mode (Alipay-only upstream). */
    adjustVerticalHeight?: boolean
    /** Next-slide inset — a bare number is treated as rpx. */
    nextMargin?: string | number
    /** Indicator anchor. */
    indicatorPosition?: SwiperIndicatorPosition
    /** Previous-slide inset — a bare number is treated as rpx. */
    previousMargin?: string | number
    /** Corner radius — a bare number is treated as rpx. */
    radius?: string | number
    /** Snap the insets to the first / last slide. */
    snapToEdge?: boolean
    /** Indicator config; `false` hides it. */
    indicator?: boolean | SnSwiperIndicator
    /** Image crop mode forwarded to sn-img. */
    imageMode?: SwiperImageMode
    /** Long-press shows the miniprogram QR menu. */
    showMenuByLongpress?: boolean
    /** Field name holding the image URL in an item object. */
    valueKey?: string
    /** Field name holding the caption in an item object. */
    textKey?: string
    /** Custom class for the indicator node. */
    customIndicatorClass?: string
    /** Custom class for the image node. */
    customImageClass?: string
    /** Custom class for the prev-slide image (parity; no peek slides rendered). */
    customPrevImageClass?: string
    /** Custom class for the next-slide image (parity; no peek slides rendered). */
    customNextImageClass?: string
    /** Custom class for each slide. */
    customItemClass?: string
    /** Custom class for the prev slide (parity; no peek slides rendered). */
    customPrevClass?: string
    /** Custom class for the next slide (parity; no peek slides rendered). */
    customNextClass?: string
    /** Custom class for the caption node. */
    customTextClass?: string
    /** Custom inline style for the caption node. */
    customTextStyle?: string
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
  }>(),
  {
    autoplay: true,
    current: 0,
    direction: 'horizontal',
    displayMultipleItems: 1,
    duration: 300,
    easingFunction: 'default',
    height: 192,
    interval: 5000,
    list: () => [],
    loop: true,
    videoLoop: false,
    muted: false,
    autoplayVideo: false,
    stopPreviousVideo: false,
    stopAutoplayWhenVideoPlay: false,
    adjustHeight: '',
    adjustVerticalHeight: false,
    nextMargin: 0,
    indicatorPosition: 'bottom',
    previousMargin: 0,
    radius: '',
    snapToEdge: false,
    indicator: true,
    imageMode: 'aspectFill',
    showMenuByLongpress: false,
    valueKey: 'value',
    textKey: 'text',
    customIndicatorClass: '',
    customImageClass: '',
    customPrevImageClass: '',
    customNextImageClass: '',
    customItemClass: '',
    customPrevClass: '',
    customNextClass: '',
    customTextClass: '',
    customTextStyle: '',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'click', payload: { index: number; item: string | SnSwiperItem }): void
  (e: 'change', payload: { current: number; source: string }): void
  (e: 'animationfinish', payload: { current: number; source: string }): void
  (e: 'update:current', value: number): void
}>()

/** Resolve a numeric-or-string length (bare number = rpx). */
function toLength(value: string | number | undefined, fallback?: number): string | undefined {
  if (value === undefined || value === '') {
    return fallback === undefined ? undefined : `${fallback}rpx`
  }
  return typeof value === 'number' ? `${value}rpx` : value
}

/** One slide normalised to `{ src, text }`. */
interface NormalisedSlide {
  src: string
  text: string
  raw: string | SnSwiperItem
}

/** Slides normalised from either the string form or the object form. */
const slides = computed<NormalisedSlide[]>(() =>
  props.list.map((entry) => {
    if (typeof entry === 'string') return { src: entry, text: '', raw: entry }
    const record = entry as unknown as Record<string, string | undefined>
    return {
      // `valueKey` lets an app reuse its own field name; `poster` is the video
      // fallback documented in the file header.
      src: record[props.valueKey] ?? record.poster ?? '',
      text: record[props.textKey] ?? '',
      raw: entry,
    }
  }),
)

/**
 * Non-undefined views of the props the template forwards into sn-img props or
 * reads arithmetically. `withDefaults` narrows at runtime, but a bare prop
 * identifier in the template still types as `T | undefined`.
 */
const imageModeValue = computed(() => props.imageMode)
const showMenuValue = computed(() => props.showMenuByLongpress)
const imageClassValue = computed(() => props.customImageClass)
const currentIndex = computed(() => props.current)

/*
 * Video / adjust-height parity props. Declared so a wd-swiper config type-
 * checks unchanged; forwarded to the native `<swiper>` where the platform
 * understands them (Alipay for the adjust-height pair, no vendor for the
 * video pair — video items degrade to their poster, see the file header).
 */
const adjustHeightValue = computed(() => (props.adjustHeight === '' ? undefined : props.adjustHeight))
const adjustVerticalHeightValue = computed(() => props.adjustVerticalHeight)
const videoLoopValue = computed(() => props.videoLoop)
const mutedValue = computed(() => props.muted)
const autoplayVideoValue = computed(() => props.autoplayVideo)
const stopPreviousVideoValue = computed(() => props.stopPreviousVideo)
const stopAutoplayWhenVideoPlayValue = computed(() => props.stopAutoplayWhenVideoPlay)

const heightStyle = computed(() => toLength(props.height, 192))
const radiusStyle = computed(() => toLength(props.radius))
const previousMarginStyle = computed(() => toLength(props.previousMargin, 0))
const nextMarginStyle = computed(() => toLength(props.nextMargin, 0))

/** Resolved indicator config. */
const indicatorConfig = computed<SnSwiperIndicator>(() => {
  if (props.indicator === false) return {}
  if (props.indicator === true) return {}
  return props.indicator
})

const showsIndicator = computed(() => {
  if (props.indicator === false) return false
  const minShowNum = indicatorConfig.value.minShowNum ?? 2
  return slides.value.length >= minShowNum
})

const indicatorType = computed<SwiperIndicatorType>(
  () => indicatorConfig.value.type ?? 'dots',
)

const showsControls = computed(
  () => indicatorConfig.value.showControls === true && slides.value.length > 1,
)

const rootClass = computed(() => [
  'sn-swiper',
  `sn-swiper--${props.direction}`,
  props.customClass,
])

const rootStyle = computed(() => {
  const parts = [`height: ${heightStyle.value}`]
  if (radiusStyle.value) parts.push(`border-radius: ${radiusStyle.value}`)
  if (props.customStyle) parts.push(props.customStyle)
  return parts.join('; ')
})

const swiperStyle = computed(() => {
  const parts: string[] = []
  if (previousMarginStyle.value && previousMarginStyle.value !== '0rpx') {
    parts.push(`--sn-swiper-previous-margin: ${previousMarginStyle.value}`)
  }
  if (nextMarginStyle.value && nextMarginStyle.value !== '0rpx') {
    parts.push(`--sn-swiper-next-margin: ${nextMarginStyle.value}`)
  }
  return parts.length > 0 ? parts.join('; ') : undefined
})

/** uni swiper's `easing-function` accepts a fixed name set; anything else is dropped. */
const easingFunction = computed(() =>
  props.easingFunction === 'default' ? undefined : props.easingFunction,
)

const indicatorClass = computed(() => [
  'sn-swiper__indicator',
  `sn-swiper__indicator--${indicatorType.value}`,
  `sn-swiper__indicator--${props.indicatorPosition}`,
  props.customIndicatorClass,
])

const textStyle = computed(() => (props.customTextStyle ? props.customTextStyle : undefined))

function onSwiperChange(event: { detail: { current: number; source: string } }): void {
  emit('update:current', event.detail.current)
  emit('change', { current: event.detail.current, source: event.detail.source })
}

function onAnimationFinish(event: { detail: { current: number; source: string } }): void {
  emit('animationfinish', { current: event.detail.current, source: event.detail.source })
}

function onSlideTap(slide: NormalisedSlide, index: number): void {
  emit('click', { index, item: slide.raw })
}
</script>

<template>
  <view
    data-snui-component="swiper"
    :class="rootClass"
    :style="rootStyle"
  >
    <swiper
      class="sn-swiper__native"
      :style="swiperStyle"
      :autoplay="props.autoplay"
      :current="currentIndex"
      :vertical="direction === 'vertical'"
      :display-multiple-items="displayMultipleItems"
      :duration="duration"
      :easing-function="easingFunction"
      :interval="interval"
      :circular="loop"
      :previous-margin="previousMarginStyle"
      :next-margin="nextMarginStyle"
      :snap-to-edge="snapToEdge"
      :adjust-height="adjustHeightValue"
      :adjust-vertical-height="adjustVerticalHeightValue"
      :video-loop="videoLoopValue"
      :muted="mutedValue"
      :autoplay-video="autoplayVideoValue"
      :stop-previous-video="stopPreviousVideoValue"
      :stop-autoplay-when-video-play="stopAutoplayWhenVideoPlayValue"
      @change="onSwiperChange"
      @animationfinish="onAnimationFinish"
    >
      <swiper-item
        v-for="(slide, index) in slides"
        :key="index"
        class="sn-swiper__item"
        :class="customItemClass"
      >
        <view class="sn-swiper__slide" @tap="onSlideTap(slide, index)">
          <SnImg
            :src="slide.src"
            :mode="imageModeValue"
            :show-menu-by-longpress="showMenuValue"
            :custom-class="imageClassValue"
            width="100%"
            height="100%"
          />
          <view v-if="slide.text" class="sn-swiper__caption" :style="textStyle">
            <text class="sn-swiper__caption-text" :class="customTextClass">
              {{ slide.text }}
            </text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view v-if="showsIndicator" :class="indicatorClass" aria-hidden="true">
      <view v-if="indicatorType === 'fraction'" class="sn-swiper__fraction">
        <text class="sn-swiper__fraction-text">{{ currentIndex + 1 }}/{{ slides.length }}</text>
      </view>

      <view v-else class="sn-swiper__dots">
        <view
          v-for="(_, index) in slides"
          :key="index"
          class="sn-swiper__dot"
          :class="{
            'sn-swiper__dot--active': index === currentIndex,
            'sn-swiper__dot--bar': indicatorType === 'dots-bar',
          }"
        />
      </view>

      <template v-if="showsControls">
        <view class="sn-swiper__control sn-swiper__control--prev">
          <text class="sn-swiper__control-text">‹</text>
        </view>
        <view class="sn-swiper__control sn-swiper__control--next">
          <text class="sn-swiper__control-text">›</text>
        </view>
      </template>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-swiper {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  /* Slide surface: the tinted plate shows through letterboxed images. */
  background-color: var(--sn-mp-color-background-subtle);
  border-radius: var(--sn-mp-radius-lg);
}

.sn-swiper__native {
  width: 100%;
  height: 100%;
}

.sn-swiper__item {
  box-sizing: border-box;
  padding: var(--sn-mp-spacing-0) var(--sn-swiper-next-margin, 0);
}

.sn-swiper__slide {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.sn-swiper__caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  background-color: var(--sn-mp-color-background-overlay);
}

.sn-swiper__caption-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}

/* ── Indicator ────────────────────────────────────────────────────────── */

.sn-swiper__indicator {
  position: absolute;
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-2);
}

.sn-swiper__indicator--bottom,
.sn-swiper__indicator--bottom-left,
.sn-swiper__indicator--bottom-right {
  bottom: var(--sn-mp-spacing-3);
}
.sn-swiper__indicator--top,
.sn-swiper__indicator--top-left,
.sn-swiper__indicator--top-right {
  top: var(--sn-mp-spacing-3);
}

.sn-swiper__indicator--left,
.sn-swiper__indicator--top-left,
.sn-swiper__indicator--bottom-left {
  left: var(--sn-mp-spacing-3);
}
.sn-swiper__indicator--right,
.sn-swiper__indicator--top-right,
.sn-swiper__indicator--bottom-right {
  right: var(--sn-mp-spacing-3);
}
.sn-swiper__indicator--top,
.sn-swiper__indicator--bottom {
  left: 0;
  right: 0;
  justify-content: center;
}

.sn-swiper__dots {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
}

.sn-swiper__dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-elevated);
  opacity: 0.6;
}

.sn-swiper__dot--active {
  opacity: 1;
  background-color: var(--sn-mp-color-action-primary);
}

.sn-swiper__dot--bar {
  width: 32rpx;
  height: 8rpx;
  border-radius: var(--sn-mp-radius-xs);
}

.sn-swiper__fraction {
  padding: 0 var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-overlay);
}

.sn-swiper__fraction-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-swiper__control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-overlay);
}

.sn-swiper__control-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-lg);
  line-height: 1;
}
</style>
