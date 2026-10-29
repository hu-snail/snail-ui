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
 *
 * ## Additive: 3D card mode (`card3d`)
 * ## Additive: coverflow mode (`coverflow`)
 *
 * `coverflow` is an AUI-additive capability (no counterpart in wd-swiper;
 * registered in AGENTS.md §112.3a): the active slide stays full-size while its
 * neighbours peek out at both edges scaled down (App Store style). It rides on
 * the native swiper's `previous-margin` / `next-margin` for the peek width —
 * when `coverflow` is on and both margins are unset, they default to 80rpx
 * each; pass `previous-margin` / `next-margin` to control the side width
 * explicitly. Non-active slides get an inline `scale()` derived from their
 * offset to the active index (`coverflow-scale`, default 0.85, clamped so far
 * slides stop shrinking). Presentation only: paging, loop and autoplay remain
 * the native swiper's; with `coverflow` off the DOM is exactly as before the
 * prop existed.
 *
 * ## Additive: `scale` indicator + functional controls
 *
 * `indicator.type: 'scale'` is an AUI-additive dot style: dot size grades with
 * distance from the active page (small → largest at active → small). The
 * `show-controls` arrows are tappable and step `current` (wrapping under
 * `loop`, clamping otherwise); they emit `update:current` and the native
 * swiper mirrors the move back through its own `change` event — the controls
 * themselves do not emit `change` directly.
 *
 *
 * `card3d` is an AUI-additive capability (no counterpart in wd-swiper;
 * registered in AGENTS.md §112.3a). Rationale: the reference can only lay
 * slides out flat, so apps that want the common "card carousel" hero (App Store
 * / Taobao style — cards leaning back behind a flat, largest centre card) had to
 * fork the component. When `card3d` is on the root gains `sn-swiper--card3d`
 * and every slide gets an inline `perspective() rotateY() scale()` transform
 * plus a matching opacity, derived from its offset to the centre of the active
 * window; neighbours lean back, shrink, fade and are inset by a gap so they read
 * as separate cards. It is presentation only: the native `<swiper>` still owns
 * paging, `displayMultipleItems` still decides how many cards share the screen,
 * and with `card3d` off the DOM / classes / inline styles are exactly as before
 * the prop existed.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 单图（含预览 / 加载态）— 用 sn-img
 *   - 轮播内容为复杂卡片 — 用 `<swiper>` 原生元素自建
 */

import { computed } from 'vue';
import SnImg from '../sn-img/sn-img.vue';

defineOptions({ name: 'SnSwiper' });

/* ── Types ────────────────────────────────────────────────────────────────── */

/** Scroll axis. Mirrors `wd-swiper` `direction`. */
type SwiperDirection = 'horizontal' | 'vertical';

/** Indicator anchor. Mirrors `wd-swiper` `indicator-position`. */
type SwiperIndicatorPosition =
  'left' | 'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right' | 'right';

/** Image crop mode (uni `<image mode>`), forwarded to sn-img. */
type SwiperImageMode = 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix';

/** Indicator style. Mirrors `wd-swiper` `indicator.type`. */
type SwiperIndicatorType = 'dots' | 'dots-bar' | 'fraction' | 'scale';

/** One slide object. Mirrors the `SwiperItem` row group of the wd table. */
export interface SnSwiperItem {
  /** Image / video URL. */
  value?: string;
  /** Poster for video items (rendered as the image). */
  poster?: string;
  /** Caption rendered over the slide. */
  text?: string;
  /** Resource kind; `video` degrades to its poster (see header). */
  type?: 'image' | 'video';
}

/** Indicator config. Mirrors `wd-swiper` `indicator`. */
export interface SnSwiperIndicator {
  /** Indicator style. */
  type?: SwiperIndicatorType;
  /** Hide the indicator below this slide count. */
  minShowNum?: number;
  /** Show the prev / next arrows. */
  showControls?: boolean;
}

/* ── Props ────────────────────────────────────────────────────────────────── */

const props = withDefaults(
  defineProps<{
    /** Autoplay. */
    autoplay?: boolean;
    /** Current slide index (v-model:current). */
    current?: number;
    /** Scroll axis. */
    direction?: SwiperDirection;
    /** Slides visible at once. */
    displayMultipleItems?: number;
    /** Slide transition duration in ms. */
    duration?: number;
    /** Easing name (parity; the native swiper uses a fixed ease). */
    easingFunction?: string;
    /** Height of the carousel — a bare number is treated as rpx. */
    height?: string | number;
    /** Autoplay interval in ms. */
    interval?: number;
    /** Slide data: strings or `SwiperItem` objects. */
    list?: Array<string | SnSwiperItem>;
    /** Loop the slides. */
    loop?: boolean;
    /**
     * 3D 卡片模式：叠层透视卡片，一屏多个由 displayMultipleItems 控制。
     * AUI-additive — wd-swiper has no 3D presentation (see the file header).
     */
    card3d?: boolean;
    /**
     * Coverflow 模式（AUI-additive）：中间全尺寸、两侧露出缩小。
     * 露出宽度由 previous-margin / next-margin 控制（两者均未设置时默认各 80rpx）。
     */
    coverflow?: boolean;
    /** Coverflow 模式非激活卡片的缩放比例（默认 0.85）。 */
    coverflowScale?: number;
    /** Loop video items (declared for parity; video degrades to its poster). */
    videoLoop?: boolean;
    /** Mute video items (declared for parity; video degrades to its poster). */
    muted?: boolean;
    /** Autoplay video items (declared for parity; see header). */
    autoplayVideo?: boolean;
    /** Stop the previous slide's video on change (parity; see header). */
    stopPreviousVideo?: boolean;
    /** Pause autoplay while a video plays (parity; see header). */
    stopAutoplayWhenVideoPlay?: boolean;
    /**
     * Auto-size the container to the slide height. Alipay-only upstream; the
     * value is forwarded to the native `<swiper>` and ignored elsewhere.
     * `''` (default) leaves the height to the `height` prop.
     */
    adjustHeight?: 'first' | 'current' | 'highest' | '';
    /** Force `adjustHeight` to apply in vertical mode (Alipay-only upstream). */
    adjustVerticalHeight?: boolean;
    /** Next-slide inset — a bare number is treated as rpx. */
    nextMargin?: string | number;
    /** Indicator anchor. */
    indicatorPosition?: SwiperIndicatorPosition;
    /** Previous-slide inset — a bare number is treated as rpx. */
    previousMargin?: string | number;
    /** Corner radius — a bare number is treated as rpx. */
    radius?: string | number;
    /** Snap the insets to the first / last slide. */
    snapToEdge?: boolean;
    /** Indicator config; `false` hides it. */
    indicator?: boolean | SnSwiperIndicator;
    /** Image crop mode forwarded to sn-img. */
    imageMode?: SwiperImageMode;
    /** Long-press shows the miniprogram QR menu. */
    showMenuByLongpress?: boolean;
    /** Field name holding the image URL in an item object. */
    valueKey?: string;
    /** Field name holding the caption in an item object. */
    textKey?: string;
    /** Custom class for the indicator node. */
    customIndicatorClass?: string;
    /** Custom class for the image node. */
    customImageClass?: string;
    /** Custom class for the prev-slide image (parity; no peek slides rendered). */
    customPrevImageClass?: string;
    /** Custom class for the next-slide image (parity; no peek slides rendered). */
    customNextImageClass?: string;
    /** Custom class for each slide. */
    customItemClass?: string;
    /** Custom class for the prev slide (parity; no peek slides rendered). */
    customPrevClass?: string;
    /** Custom class for the next slide (parity; no peek slides rendered). */
    customNextClass?: string;
    /** Custom class for the caption node. */
    customTextClass?: string;
    /** Custom inline style for the caption node. */
    customTextStyle?: string;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
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
    card3d: false,
    coverflow: false,
    coverflowScale: 0.85,
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
);

/* ── Emits ────────────────────────────────────────────────────────────────── */

const emit = defineEmits<{
  (e: 'click', payload: { index: number; item: string | SnSwiperItem }): void;
  (e: 'change', payload: { current: number; source: string }): void;
  (e: 'animationfinish', payload: { current: number; source: string }): void;
  (e: 'update:current', value: number): void;
}>();

/* ── Normalisation ────────────────────────────────────────────────────────── */

/** Resolve a numeric-or-string length (bare number = rpx). */
function toLength(value: string | number | undefined, fallback?: number): string | undefined {
  if (value === undefined || value === '') {
    return fallback === undefined ? undefined : `${fallback}rpx`;
  }
  return typeof value === 'number' ? `${value}rpx` : value;
}

/** One slide normalised to `{ src, text }`. */
interface NormalisedSlide {
  src: string;
  text: string;
  raw: string | SnSwiperItem;
}

/** Slides normalised from either the string form or the object form. */
const slides = computed<NormalisedSlide[]>(() =>
  props.list.map((entry) => {
    if (typeof entry === 'string') return { src: entry, text: '', raw: entry };
    const record = entry as unknown as Record<string, string | undefined>;
    return {
      // `valueKey` lets an app reuse its own field name; `poster` is the video
      // fallback documented in the file header.
      src: record[props.valueKey] ?? record.poster ?? '',
      text: record[props.textKey] ?? '',
      raw: entry,
    };
  }),
);

/* ── Derived state ────────────────────────────────────────────────────────── */

/*
 * Lengths. `radius` is only emitted when the caller set one, so the theme
 * radius survives; `height` falls back to the wd-swiper default of 192.
 */
const heightStyle = computed(() => toLength(props.height, 192));
const radiusStyle = computed(() => toLength(props.radius));
/*
 * Margins. With `coverflow` on and both margins unset, default to 80rpx each
 * so the neighbours peek out of the box; an explicit margin (either side)
 * keeps the caller's value — that is the documented knob for the peek width.
 */
const coverflowDefaultsMargins = computed(
  () => props.coverflow && !props.previousMargin && !props.nextMargin,
);
const previousMarginStyle = computed(() =>
  coverflowDefaultsMargins.value ? '80rpx' : toLength(props.previousMargin, 0),
);
const nextMarginStyle = computed(() =>
  coverflowDefaultsMargins.value ? '80rpx' : toLength(props.nextMargin, 0),
);

/*
 * Video / adjust-height parity props (see the file header). Declared so a
 * wd-swiper config type-checks unchanged; forwarded to the native `<swiper>`
 * where the platform understands them (Alipay for the adjust-height pair, no
 * vendor for the video pair — video items degrade to their poster). They are
 * read straight off `props` in the template; only `adjustHeight` needs a view,
 * because its `''` "off" state must drop the attribute rather than forward an
 * empty one.
 */
const adjustHeightValue = computed(() =>
  props.adjustHeight === '' ? undefined : props.adjustHeight,
);

/** Resolved indicator config. */
const indicatorConfig = computed<SnSwiperIndicator>(() => {
  if (props.indicator === false) return {};
  if (props.indicator === true) return {};
  return props.indicator;
});

const showsIndicator = computed(() => {
  if (props.indicator === false) return false;
  const minShowNum = indicatorConfig.value.minShowNum ?? 2;
  return slides.value.length >= minShowNum;
});

const indicatorType = computed<SwiperIndicatorType>(() => indicatorConfig.value.type ?? 'dots');

const showsControls = computed(
  () => indicatorConfig.value.showControls === true && slides.value.length > 1,
);

/*
 * The native swiper snaps whole *windows* of `displayMultipleItems` slides, so
 * the indicator counts pages, not slides: N slides shown M at a time give
 * N-M+1 windows. `current` is the leftmost slide of a window, which doubles as
 * the page index except for the last window, where it overshoots — clamping it
 * keeps the trailing page reachable instead of lighting a dot that a trailing
 * slide owns but no page ever activates.
 */
const pageCount = computed(() =>
  Math.max(1, slides.value.length - props.displayMultipleItems + 1),
);

const activePage = computed(() => Math.min(props.current, pageCount.value - 1));

/** uni swiper's `easing-function` accepts a fixed name set; anything else is dropped. */
const easingFunction = computed(() =>
  props.easingFunction === 'default' ? undefined : props.easingFunction,
);

const rootClass = computed(() => [
  'sn-swiper',
  `sn-swiper--${props.direction}`,
  props.card3d ? 'sn-swiper--card3d' : '',
  props.coverflow ? 'sn-swiper--coverflow' : '',
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts = [`height: ${heightStyle.value}`];
  if (radiusStyle.value) parts.push(`border-radius: ${radiusStyle.value}`);
  // Coverflow rounds each card, not the track — hand the caller's radius down
  // to the slides through a custom property (custom properties survive the
  // platforms' style parsing; raw rpx values in some positions do not).
  if (props.coverflow && radiusStyle.value) {
    parts.push(`--sn-swiper-coverflow-radius: ${radiusStyle.value}`);
  }
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});

const swiperStyle = computed(() => {
  const parts: string[] = [];
  if (previousMarginStyle.value && previousMarginStyle.value !== '0rpx') {
    parts.push(`--sn-swiper-previous-margin: ${previousMarginStyle.value}`);
  }
  if (nextMarginStyle.value && nextMarginStyle.value !== '0rpx') {
    parts.push(`--sn-swiper-next-margin: ${nextMarginStyle.value}`);
  }
  return parts.length > 0 ? parts.join('; ') : undefined;
});

const indicatorClass = computed(() => [
  'sn-swiper__indicator',
  `sn-swiper__indicator--${indicatorType.value}`,
  `sn-swiper__indicator--${props.indicatorPosition}`,
  props.customIndicatorClass,
]);

const textStyle = computed(() => (props.customTextStyle ? props.customTextStyle : undefined));

/* ── 3D card mode (AUI-additive; see the file header) ─────────────────────── */

/** Y-rotation per card step, in degrees: neighbours lean back toward the centre. */
const CARD3D_ANGLE_PER_STEP = -18;

/** Scale lost per card step. */
const CARD3D_SCALE_PER_STEP = 0.06;

/** Opacity lost per card step, so the stack reads front-to-back. */
const CARD3D_FADE_PER_STEP = 0.12;

/** How far the whole stack sits from the viewer. */
const CARD3D_PERSPECTIVE = '1200rpx';

/** Offset clamp for scale / fade: beyond two steps cards stop shrinking. */
const CARD3D_MAX_STEP = 2;

/**
 * Wrap an offset into `[-floor(n/2), ceil(n/2)]` where `n` = slide count, i.e.
 * the shortest way round a looping track. Without it a slide that is really one
 * step "behind" the first slide of a loop would be counted as `n - 1` steps and
 * lean by a whole track's worth of angle.
 */
function wrapCardOffset(offset: number, count: number): number {
  if (count <= 1) return offset;
  const min = -Math.floor(count / 2);
  const max = Math.ceil(count / 2);
  let wrapped = offset;
  while (wrapped < min) wrapped += count;
  while (wrapped > max) wrapped -= count;
  return wrapped;
}

/**
 * The slide the stack is centred on: the middle of the active window, clamped
 * to the track. With `displayMultipleItems` > 1 the window is centred rather
 * than left-aligned, so the cards fan out around it symmetrically.
 */
const cardCentre = computed(() => {
  const lastIndex = Math.max(slides.value.length - 1, 0);
  const centre = props.current + Math.floor((props.displayMultipleItems - 1) / 2);
  return Math.min(Math.max(centre, 0), lastIndex);
});

/** Signed card offset of one slide from the centre (wrapped when `loop` is on). */
function cardOffset(index: number): number {
  const offset = index - cardCentre.value;
  return props.loop ? wrapCardOffset(offset, slides.value.length) : offset;
}

/**
 * Inline 3D presentation for one slide. `undefined` when `card3d` is off, so
 * the default render keeps no transform and no extra class. The centre card
 * (offset 0) carries no `rotateY` term at all — it is the flat, largest card
 * facing the viewer; neighbours rotate, shrink and fade by their offset, and
 * the transition on `.sn-swiper--card3d .sn-swiper__slide` animates the swap
 * when `current` moves.
 */
function card3dStyle(index: number): string | undefined {
  if (!props.card3d) return undefined;
  const offset = cardOffset(index);
  const step = Math.min(Math.abs(offset), CARD3D_MAX_STEP);
  const rotateY = offset === 0 ? '' : ` rotateY(${offset * CARD3D_ANGLE_PER_STEP}deg)`;
  return (
    `transform: perspective(${CARD3D_PERSPECTIVE})${rotateY} scale(${1 - step * CARD3D_SCALE_PER_STEP}); ` +
    `opacity: ${1 - step * CARD3D_FADE_PER_STEP};`
  );
}

/* ── Coverflow mode (AUI-additive; see the file header) ───────────────────── */

/**
 * Inline presentation for one coverflow slide. `undefined` when `coverflow`
 * is off, so the default render keeps no transform and no extra class. The
 * active slide (offset 0) carries no `scale()` term — it is the full-size
 * card; neighbours shrink toward `coverflowScale` by their offset, clamped so
 * far slides stop shrinking. The transition on `.sn-swiper--coverflow
 * .sn-swiper__slide` animates the swap when `current` moves.
 */
function coverflowStyle(index: number): string | undefined {
  if (!props.coverflow) return undefined;
  const offset = Math.min(Math.abs(cardOffset(index)), 1);
  const scale = 1 - offset * (1 - props.coverflowScale);
  return `transform: scale(${scale});`;
}

/* ── `scale` indicator (AUI-additive; see the file header) ────────────────── */

/** Largest dot size (active), in rpx. */
const SCALE_DOT_MAX = 20;
/** Size lost per step away from the active page, in rpx. */
const SCALE_DOT_STEP = 6;
/** Dot size floor, in rpx. */
const SCALE_DOT_MIN = 8;

/**
 * Inline dot size for one page of the `scale` indicator: size grades with the
 * distance from the active page (small → largest at active → small).
 */
function scaleDotStyle(index: number): string | undefined {
  if (indicatorType.value !== 'scale') return undefined;
  const distance = Math.abs(index - activePage.value);
  const size = Math.max(SCALE_DOT_MAX - distance * SCALE_DOT_STEP, SCALE_DOT_MIN);
  return `--sn-swiper-scale-dot-size: ${size}rpx;`;
}

/** Step one page back from the controls (wrap under `loop`, clamp otherwise). */
function onPrevControlTap(): void {
  const last = pageCount.value - 1;
  emit('update:current', activePage.value === 0 && props.loop ? last : Math.max(activePage.value - 1, 0));
}

/** Step one page forward from the controls (wrap under `loop`, clamp otherwise). */
function onNextControlTap(): void {
  const last = pageCount.value - 1;
  emit('update:current', activePage.value === last && props.loop ? 0 : Math.min(activePage.value + 1, last));
}

/* ── Handlers ─────────────────────────────────────────────────────────────── */

function onSwiperChange(event: { detail: { current: number; source: string } }): void {
  emit('update:current', event.detail.current);
  emit('change', { current: event.detail.current, source: event.detail.source });
}

function onAnimationFinish(event: { detail: { current: number; source: string } }): void {
  emit('animationfinish', { current: event.detail.current, source: event.detail.source });
}

function onSlideTap(slide: NormalisedSlide, index: number): void {
  emit('click', { index, item: slide.raw });
}
</script>

<template>
  <view data-snui-component="swiper" :class="rootClass" :style="rootStyle">
    <swiper
      class="sn-swiper__native"
      :style="swiperStyle"
      :autoplay="props.autoplay"
      :current="props.current"
      :vertical="props.direction === 'vertical'"
      :display-multiple-items="props.displayMultipleItems"
      :duration="props.duration"
      :easing-function="easingFunction"
      :interval="props.interval"
      :circular="props.loop"
      :previous-margin="previousMarginStyle"
      :next-margin="nextMarginStyle"
      :snap-to-edge="props.snapToEdge"
      :adjust-height="adjustHeightValue"
      :adjust-vertical-height="props.adjustVerticalHeight"
      :video-loop="props.videoLoop"
      :muted="props.muted"
      :autoplay-video="props.autoplayVideo"
      :stop-previous-video="props.stopPreviousVideo"
      :stop-autoplay-when-video-play="props.stopAutoplayWhenVideoPlay"
      @change="onSwiperChange"
      @animationfinish="onAnimationFinish"
    >
      <swiper-item
        v-for="(slide, index) in slides"
        :key="index"
        class="sn-swiper__item"
        :class="props.customItemClass"
      >
        <view
          class="sn-swiper__slide"
          :style="card3dStyle(index) ?? coverflowStyle(index)"
          @tap="onSlideTap(slide, index)"
        >
          <SnImg
            :src="slide.src"
            :mode="props.imageMode"
            :show-menu-by-longpress="props.showMenuByLongpress"
            :custom-class="props.customImageClass"
            width="100%"
            height="100%"
          />
          <view v-if="slide.text" class="sn-swiper__caption" :style="textStyle">
            <text class="sn-swiper__caption-text" :class="props.customTextClass">
              {{ slide.text }}
            </text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view v-if="showsIndicator" :class="indicatorClass" aria-hidden="true">
      <view v-if="showsControls" class="sn-swiper__control sn-swiper__control--prev" @tap="onPrevControlTap">
        <text class="sn-swiper__control-text">‹</text>
      </view>

      <view v-if="indicatorType === 'fraction'" class="sn-swiper__fraction">
        <text class="sn-swiper__fraction-text">{{ activePage + 1 }}/{{ pageCount }}</text>
      </view>

      <view v-else class="sn-swiper__dots">
        <view
          v-for="(_, index) in pageCount"
          :key="index"
          class="sn-swiper__dot"
          :class="{
            'sn-swiper__dot--active': index === activePage,
            'sn-swiper__dot--bar': indicatorType === 'dots-bar',
            'sn-swiper__dot--scale': indicatorType === 'scale',
          }"
          :style="scaleDotStyle(index)"
        />
      </view>

      <view v-if="showsControls" class="sn-swiper__control sn-swiper__control--next" @tap="onNextControlTap">
        <text class="sn-swiper__control-text">›</text>
      </view>
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

/* ── 3D card mode (AUI-additive; see the file header) ────────────────────── */

.sn-swiper--card3d {
  /* Inset gap so the perspective stack reads as separate cards, not one slab. */
  --sn-swiper-card3d-gap: var(--sn-mp-spacing-2);
}

.sn-swiper--card3d .sn-swiper__item {
  padding-right: var(--sn-swiper-card3d-gap);
  padding-left: var(--sn-swiper-card3d-gap);
}

.sn-swiper--card3d .sn-swiper__slide {
  /* The inline transform on each slide animates as `current` moves the stack. */
  transition: transform 300ms ease, opacity 300ms ease;
  backface-visibility: hidden;
}


/* ── Coverflow mode (AUI-additive; see the file header) ────────────────────── */

.sn-swiper--coverflow {
  /* Inter-card gap so the peeking neighbours read as separate rounded cards. */
  --sn-swiper-coverflow-gap: var(--sn-mp-spacing-2);
}

/* The margins make the track narrower than the root, so neighbours peek; the
 * gap insets each card from the peek edge. */
.sn-swiper--coverflow .sn-swiper__item {
  padding-right: var(--sn-swiper-coverflow-gap);
  padding-left: var(--sn-swiper-coverflow-gap);
}

.sn-swiper--coverflow .sn-swiper__slide {
  /* Radius comes from the `radius` prop via --sn-swiper-coverflow-radius so a
   * caller-rounded design lands on each card, not on the whole track. */
  border-radius: var(--sn-swiper-coverflow-radius, var(--sn-mp-radius-lg));
  overflow: hidden;
  /* The inline scale() on each slide animates as `current` moves. Transform
   * only — width/height/layout properties would force per-frame reflow. */
  transition: transform 300ms ease;
  backface-visibility: hidden;
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

/* `scale` indicator: the inline custom property carries the graded size (custom
 * properties survive platforms' style parsing, raw rpx lengths do not). */
.sn-swiper__dot--scale {
  width: var(--sn-swiper-scale-dot-size, 12rpx);
  height: var(--sn-swiper-scale-dot-size, 12rpx);
  transition: width 300ms ease, height 300ms ease;
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
