<script lang="ts">
/**
 * Module scope — shared injection surface + cross-instance drag guard.
 * (Mirrors naive-ui `CarouselContext.ts` and the module-level
 * `globalDragging` flag in `Carousel.tsx`.)
 */
import type { ComputedRef, InjectionKey } from 'vue';

/** Scoped-slot payload for the `arrow` slot (mirrors naive interface.ts). */
export interface CarouselArrowSlotProps {
  total: number;
  currentIndex: number;
  to: (index: number) => void;
  prev: () => void;
  next: () => void;
  isPrevDisabled: () => boolean;
  isNextDisabled: () => boolean;
}

/** Scoped-slot payload for the `dots` slot (mirrors naive interface.ts). */
export interface CarouselDotSlotProps {
  total: number;
  currentIndex: number;
  to: (index: number) => void;
}

export interface SlideSize {
  width: number;
  height: number;
}

/**
 * One data-driven slide of the `options` list. The component renders the
 * media markup itself — a full-bleed `<img>` (default) or `<video>`
 * (`type: 'video'`, click toggles play/pause, muted + loop + playsinline,
 * paused automatically when its slide stops being current).
 */
export interface SnCarouselMediaItem {
  /** Media kind. Default `'image'`. */
  type?: 'image' | 'video';
  /** Media source URL. */
  src: string;
  /** Image alt text (decorative when omitted). */
  alt?: string;
  /** Video poster URL. */
  poster?: string;
  /** Caption title in the bottom gradient overlay. */
  title?: string;
  /** Caption description under the title. */
  description?: string;
  /** object-fit of the media. Default `'cover'`. */
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Stable diff key; defaults to the list index. */
  key?: string | number;
}

/**
 * Provide/inject surface between SnCarousel and SnCarouselItem
 * (1:1 with naive `CarouselContextValue`).
 */
export interface SnCarouselContext {
  currentIndexRef: ComputedRef<number>;
  to: (index: number) => void;
  prev: () => void;
  next: () => void;
  isVertical: () => boolean;
  isHorizontal: () => boolean;
  isPrev: (slideOrIndex: HTMLElement | number) => boolean;
  isNext: (slideOrIndex: HTMLElement | number) => boolean;
  isActive: (slideOrIndex: HTMLElement | number) => boolean;
  isPrevDisabled: () => boolean;
  isNextDisabled: () => boolean;
  getSlideIndex: (slideOrIndex?: HTMLElement | number) => number;
  getSlideStyle: (
    slideOrIndex: HTMLElement | number,
  ) => string | Record<string, string | number> | undefined;
  addSlide: (slide?: HTMLElement) => void;
  removeSlide: (slide?: HTMLElement) => void;
  onCarouselItemClick: (index: number, event: MouseEvent) => void;
}

export const carouselContextKey: InjectionKey<SnCarouselContext> = Symbol('sn-carousel-methods');

/** Only one carousel is allowed to trigger touch globally (naive parity). */
let globalDragging = false;
</script>

<script setup lang="ts">
/**
 * SnCarousel — carousel / slider with slide, fade, card and custom
 * transition effects.
 *
 * Reference library: naive-ui `n-carousel`
 *   (https://github.com/tusen-ai/naive-ui/blob/main/src/carousel/src/Carousel.tsx)
 * Per AGENTS.md §112, props + semantics mirror n-carousel 1:1.
 *
 * Mechanics (mirroring naive Carousel.tsx):
 *   - `loop` is implemented by cloning the first/last slide vnodes at the
 *     opposite ends — only for `effect='slide'` + `slides-per-view=1`
 *     (`duplicatedable`). Display index ⇄ real (clone-inclusive) index
 *     mapping lives in `carousel-utils.ts` as pure functions.
 *   - `slide` translates the flex track (translateX/Y, px); on
 *     `transitionend` the track snaps (0ms) from a clone onto the real
 *     slide so looping is seamless.
 *   - `fade` / `card` stack slides absolutely and toggle classes
 *     `--current` / `--prev` / `--next` (card adds 3D transforms, and
 *     `prev-slide-style` / `next-slide-style` overrides).
 *   - `custom` wraps each slide in a `<Transition v-bind="transition-props">`
 *     and only shows the active one (v-show).
 *   - Draggable (pointer) / touchable (touch) drags follow the pointer,
 *     then snap by nearest track position (can cross multiple pages) or
 *     by flick (> 50% viewport or 0.4 px/ms).
 *   - Autoplay pauses on hover; dots focus + arrow keys switch when
 *     `keyboard` is on; `mousewheel` switches past a 10px delta.
 *
 * Documented divergence (registered in ai-description.md):
 *   - `default-index` is initialized in display space directly, so it
 *     takes effect. naive-ui initializes its uncontrolled display index
 *     against an empty slide list (total view = 1) which collapses
 *     `default-index` to 0 (verified against naive-ui 2.43.1; naive ships
 *     no default-index demo).
 *   - Drag start is suppressed when mousedown/touchstart lands inside an
 *     interactive element (`a, button, input, …`, `[data-no-drag]`) so
 *     native controls keep working; a `<video>` / `<audio>` WITHOUT
 *     `controls` stays swipeable (native media drag would swallow the
 *     gesture), with `controls` the toolbar owns the pointer; naive
 *     preventDefaults every mouse drag start.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units). Indicator dots and arrows
 * render on top of arbitrary slide imagery, so their colours are the
 * white-overlay rgba() values naive's carousel theme itself uses (see
 * ai-description.md token note).
 *
 * Usage:
 *   <SnCarousel v-model:current-index="index" autoplay show-arrow>
 *     <SnCarouselItem>…</SnCarouselItem>
 *   </SnCarousel>
 */

import {
  cloneVNode,
  computed,
  Fragment,
  Comment,
  h,
  nextTick,
  normalizeStyle,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  ref,
  Transition,
  useSlots,
  watch,
  watchEffect,
} from 'vue';
import type {
  ComponentPublicInstance,
  CSSProperties,
  StyleValue,
  TransitionProps,
  VNode,
} from 'vue';
import SnCarouselItem from './SnCarouselItem.vue';
import {
  clampValue,
  computeAutoLastTranslate,
  computeAutoTotalView,
  computeSlideAxisSize,
  computeSlideTranslates,
  computeTotalView,
  findNearestTranslateIndex,
  getDisplayIndex,
  getDisplayTotalView,
  getNextIndex,
  getPrevIndex,
  getRealIndex,
  isDuplicatedable,
  resolveFlickDirection,
  resolveKeyboardAction,
  resolveSpeed,
  resolveWheelDirection,
} from './carousel-utils';

defineOptions({ name: 'SnCarousel' });

const props = withDefaults(
  defineProps<{
    /** Auto-advance between slides. Pauses while hovered. */
    autoplay?: boolean;
    /** Centre the active slide (for slides-per-view / auto layouts). */
    centeredSlides?: boolean;
    /** Controlled current display index (`v-model:current-index`). */
    currentIndex?: number | undefined;
    /** Initial display index (uncontrolled). */
    defaultIndex?: number;
    /** Scroll axis. */
    direction?: 'horizontal' | 'vertical';
    /** Where indicator dots sit. */
    dotPlacement?: 'top' | 'bottom' | 'left' | 'right';
    /** Indicator dots shape. */
    dotType?: 'dot' | 'line';
    /** Drag with the mouse to switch slides. */
    draggable?: boolean;
    /** Transition effect between slides. */
    effect?: 'slide' | 'fade' | 'card' | 'custom';
    /** Autoplay interval in ms. */
    interval?: number;
    /** Wrap around at both ends. */
    loop?: boolean;
    /** Switch slides with the mouse wheel. */
    mousewheel?: boolean;
    /**
     * Data-driven slide list. Each entry renders as a full-bleed image or
     * video slide — the media markup lives inside the component, callers no
     * longer hand-write `<img>` / `<video>`; `type: 'video'` marks a video
     * entry. When set (non-empty) the default slot is ignored, while the
     * `item` slot can still override the built-in media per slide.
     */
    options?: SnCarouselMediaItem[];
    /** Inline style override for the next slide (card mode). */
    nextSlideStyle?: CSSProperties | string;
    /** Inline style override for the previous slide (card mode). */
    prevSlideStyle?: CSSProperties | string;
    /** Slides per view: fixed number or 'auto' (measured from the DOM). */
    slidesPerView?: number | 'auto';
    /** Space (px) between slides. */
    spaceBetween?: number;
    /** Show built-in prev/next arrow buttons. */
    showArrow?: boolean;
    /** Show indicator dots. */
    showDots?: boolean;
    /** Drag with touch to switch slides. */
    touchable?: boolean;
    /** Slide/fade/card transition duration + easing. */
    transitionStyle?: {
      transitionDuration?: string;
      transitionTimingFunction?: string;
    };
    /** Vue `<Transition>` props, for `effect='custom'`. */
    transitionProps?: TransitionProps;
    /** How indicator dots activate. */
    trigger?: 'click' | 'hover';
    /** Arrow keys switch slides while a dot is focused. */
    keyboard?: boolean;
    /** Secondary callback channel for index changes (naive parity). */
    onUpdateCurrentIndex?: (currentIndex: number, lastIndex: number) => void;
  }>(),
  {
    // `currentIndex` / `prevSlideStyle` / `nextSlideStyle` / `transitionProps`
    // deliberately absent: `undefined` means "uncontrolled / unset" and
    // `exactOptionalPropertyTypes` forbids listing them here.
    autoplay: false,
    centeredSlides: false,
    defaultIndex: 0,
    direction: 'horizontal',
    dotPlacement: 'bottom',
    dotType: 'dot',
    draggable: false,
    effect: 'slide',
    interval: 5000,
    loop: true,
    mousewheel: false,
    showArrow: false,
    showDots: true,
    slidesPerView: 1,
    spaceBetween: 0,
    touchable: true,
    transitionStyle: () => ({ transitionDuration: '300ms' }),
    trigger: 'click',
    keyboard: false,
  },
);

const emit = defineEmits<{
  /** Active display index changed, with the previous display index. */
  (e: 'update:currentIndex', currentIndex: number, lastIndex: number): void;
}>();

defineSlots<{
  /** Sequence of `<SnCarouselItem>` children (ignored while `options` is set). */
  default?: () => unknown;
  /**
   * Per-slide content override for the `options` list — replaces the
   * built-in image/video renderer for every entry. Falls back to the
   * built-in media when omitted.
   */
  item?: (props: {
    item: SnCarouselMediaItem;
    index: number;
    isActive: boolean;
    isPrev: boolean;
    isNext: boolean;
  }) => unknown;
  /** Custom arrow buttons; falls back to the built-in pair. */
  arrow?: (props: CarouselArrowSlotProps) => unknown;
  /** Custom indicator dots; falls back to the built-in dots. */
  dots?: (props: CarouselDotSlotProps) => unknown;
}>();

/* ────────────────────────── DOM refs ────────────────────────── */

const selfElRef = ref<HTMLElement | null>(null);
const slidesElRef = ref<HTMLElement | null>(null);
const slideElsRef = ref<HTMLElement[]>([]);

/* ────────────────────────── computed states ────────────────────────── */

const isVertical = computed(() => props.direction === 'vertical');
const sizeAxis = computed<'width' | 'height'>(() => (isVertical.value ? 'height' : 'width'));
const spaceAxis = computed<'right' | 'bottom'>(() => (isVertical.value ? 'bottom' : 'right'));
/** Only the sequential slide effect lays slides out on a flex track. */
const sequenceLayout = computed(() => props.effect === 'slide');
const duplicatedable = computed(() =>
  isDuplicatedable(props.loop, props.slidesPerView, props.effect),
);
/** `effect='custom'` hands transition control to the user. */
const userWantsControl = computed(() => props.effect === 'custom');
/** Slides-per-view used to derive the total view count. */
const displaySlidesPerView = computed<number | 'auto'>(() =>
  !sequenceLayout.value || props.centeredSlides ? 1 : props.slidesPerView,
);
/** Slides-per-view used to derive each slide's size. */
const realSlidesPerView = computed<number | 'auto'>(() =>
  userWantsControl.value ? 1 : props.slidesPerView,
);
const autoSlideSize = computed(
  () =>
    displaySlidesPerView.value === 'auto' ||
    (props.slidesPerView === 'auto' && props.centeredSlides),
);

/* ────────────────────────── carousel size ────────────────────────── */

const perViewSizeRef = ref<SlideSize>({ width: 0, height: 0 });
/** Bumped by slide resizes so `slideSizes` re-measures in auto mode. */
const slideSizesTrigger = ref(0);

function calculateSize(element: HTMLElement, innerOnly?: boolean): SlideSize {
  let { offsetWidth: width, offsetHeight: height } = element;
  if (innerOnly) {
    const style = getComputedStyle(element);
    // happy-dom returns '' for unset paddings — coerce NaN away.
    width -= Number.parseFloat(style.getPropertyValue('padding-left')) || 0;
    width -= Number.parseFloat(style.getPropertyValue('padding-right')) || 0;
    height -= Number.parseFloat(style.getPropertyValue('padding-top')) || 0;
    height -= Number.parseFloat(style.getPropertyValue('padding-bottom')) || 0;
  }
  return { width, height };
}

const slideSizes = computed<SlideSize[]>(() => {
  const slidesEls = slideElsRef.value;
  if (!slidesEls.length) return [];
  // Touch the trigger so auto-mode re-measures when a slide resizes.
  void slideSizesTrigger.value;
  if (autoSlideSize.value) {
    return slidesEls.map((el) => calculateSize(el));
  }
  const axis = sizeAxis.value;
  const slidesPerView = realSlidesPerView.value;
  const perViewSize = perViewSizeRef.value;
  let axisSize = perViewSize[axis];
  if (slidesPerView !== 'auto') {
    axisSize = computeSlideAxisSize(axisSize, slidesPerView, props.spaceBetween);
  }
  const slideSize: SlideSize = { ...perViewSize, [axis]: axisSize };
  return slidesEls.map(() => slideSize);
});

const slideTranslates = computed<number[]>(() => {
  const sizes = slideSizes.value;
  if (!sizes.length) return [];
  const axis = sizeAxis.value;
  return computeSlideTranslates(
    sizes.map((size) => size[axis]),
    perViewSizeRef.value[axis],
    props.spaceBetween,
    props.centeredSlides,
  );
});

/* ────────────────────────── total views ────────────────────────── */

const totalView = computed<number>(() => {
  const slidesPerView = displaySlidesPerView.value;
  const totalSlides = slideElsRef.value.length;
  if (slidesPerView !== 'auto') {
    return computeTotalView(totalSlides, slidesPerView);
  }
  const sizes = slideSizes.value;
  if (!sizes.length) return totalSlides;
  const axis = sizeAxis.value;
  return computeAutoTotalView(
    sizes.map((size) => size[axis]),
    slideTranslates.value,
    perViewSizeRef.value[axis],
  );
});

const displayTotalView = computed<number>(() =>
  getDisplayTotalView(totalView.value, duplicatedable.value),
);

/** 0-based indexes for the dots v-for (avoids template index arithmetic). */
const dotIndexes = computed<number[]>(() =>
  Array.from({ length: Math.max(displayTotalView.value, 0) }, (_, i) => i),
);

/* ────────────────────────── styles ────────────────────────── */

const TRANSITION_PROPERTIES = ['transitionDuration', 'transitionTimingFunction'] as const;
interface TransitionStyle {
  transitionDuration?: string;
  transitionTimingFunction?: string;
}

const isMountedRef = ref(false);

function keepTransitionStyle(style: TransitionStyle): TransitionStyle {
  const result: TransitionStyle = {};
  for (const key of TRANSITION_PROPERTIES) {
    const value = style[key];
    if (value !== undefined) result[key] = value;
  }
  return result;
}

const transitionStyleRef = computed<TransitionStyle>(() =>
  keepTransitionStyle(props.transitionStyle ?? {}),
);

/** Transition duration in ms; 0 for user-controlled (custom) mode. */
const speedMs = computed(() =>
  userWantsControl.value ? 0 : resolveSpeed(transitionStyleRef.value.transitionDuration),
);

const slideStyles = computed<Record<string, string | number>[]>(() => {
  const slidesEls = slideElsRef.value;
  if (!slidesEls.length) return [];
  const useComputedSize = !(autoSlideSize.value || realSlidesPerView.value === 1);
  const getSlideSize = (index: number): Record<string, string> => {
    if (useComputedSize) {
      const axis = sizeAxis.value;
      const size = slideSizes.value[index];
      return size ? { [axis]: `${size[axis]}px` } : {};
    }
    return {};
  };
  if (userWantsControl.value) {
    // Custom mode centres every slide; offsets are the user's concern.
    return slidesEls.map((_, i) => getSlideSize(i));
  }
  const { effect, spaceBetween } = props;
  const axis = spaceAxis.value;
  return slidesEls.reduce<Record<string, string | number>[]>((styles, _, i) => {
    const style: Record<string, string | number> = {
      ...getSlideSize(i),
      [`margin-${axis}`]: `${spaceBetween}px`,
    };
    if (isMountedRef.value && (effect === 'fade' || effect === 'card')) {
      Object.assign(style, transitionStyleRef.value);
    }
    styles.push(style);
    return styles;
  }, []);
});

/* ────────────────────────── index state ────────────────────────── */

/** Divergence vs naive: initialized in display space so `default-index`
 *  takes effect (naive collapses it to 0 through an empty list, see
 *  header note). */
const uncontrolledDisplayIndex = ref<number>(props.defaultIndex);

const mergedDisplayIndex = computed<number>(() =>
  props.currentIndex !== undefined ? props.currentIndex : uncontrolledDisplayIndex.value,
);

const realIndex = computed<number>(() =>
  getRealIndex(mergedDisplayIndex.value, duplicatedable.value),
);

/* ────────────────────────── real-index methods ────────────────────────── */

function toRealIndex(index: number): void {
  const clamped = clampValue(index, 0, totalView.value - 1);
  const displayIndex = getDisplayIndex(clamped, totalView.value, duplicatedable.value);
  const lastDisplayIndex = mergedDisplayIndex.value;
  if (displayIndex !== mergedDisplayIndex.value) {
    uncontrolledDisplayIndex.value = displayIndex;
    emit('update:currentIndex', displayIndex, lastDisplayIndex);
    props.onUpdateCurrentIndex?.(displayIndex, lastDisplayIndex);
  }
}

function getRealPrevIndex(index: number = realIndex.value): number | null {
  return getPrevIndex(index, totalView.value, props.loop);
}

function getRealNextIndex(index: number = realIndex.value): number | null {
  return getNextIndex(index, totalView.value, props.loop);
}

function isRealPrev(slideOrIndex: HTMLElement | number): boolean {
  const index = getSlideIndex(slideOrIndex);
  return index !== -1 && getRealPrevIndex() === index && totalView.value > 1;
}

function isRealNext(slideOrIndex: HTMLElement | number): boolean {
  const index = getSlideIndex(slideOrIndex);
  return index !== -1 && getRealNextIndex() === index && totalView.value > 1;
}

function isRealActive(slideOrIndex: HTMLElement | number): boolean {
  return realIndex.value === getSlideIndex(slideOrIndex);
}

function isPrevDisabled(): boolean {
  return getRealPrevIndex() === null;
}

function isNextDisabled(): boolean {
  return getRealNextIndex() === null;
}

/* ────────────────────────── to / prev / next ────────────────────────── */

/** Direction of the last prev()/next() call, for the clone-jump mapping. */
let expectedTransitionDirection = 0;

function to(index: number): void {
  const targetRealIndex = clampValue(getRealIndex(index, duplicatedable.value), 0, totalView.value);
  if (index !== mergedDisplayIndex.value || targetRealIndex !== realIndex.value) {
    toRealIndex(targetRealIndex);
  }
}

function prev(): void {
  const prevIndex = getRealPrevIndex();
  if (prevIndex !== null) {
    expectedTransitionDirection = -1;
    toRealIndex(prevIndex);
  }
}

function next(): void {
  const nextIndex = getRealNextIndex();
  if (nextIndex !== null) {
    expectedTransitionDirection = 1;
    toRealIndex(nextIndex);
  }
}

/** Context-channel prev/next: skip while a clone jump is animating. */
function prevIfSlideTransitionEnd(): void {
  if (!inTransition || !duplicatedable.value) prev();
}

function nextIfSlideTransitionEnd(): void {
  if (!inTransition || !duplicatedable.value) next();
}

/* ────────────────────────── track translation ────────────────────────── */

let inTransition = false;
/** Translate of the track before the current move — the drag base. */
let previousTranslate = 0;
const translateStyle = ref<Record<string, string>>({});

function updateTranslate(translate: number, durationMs = 0): void {
  const style: Record<string, string> = {
    transform: isVertical.value ? `translateY(${-translate}px)` : `translateX(${-translate}px)`,
    transitionDuration: `${durationMs}ms`,
  };
  const timingFunction = transitionStyleRef.value.transitionTimingFunction;
  if (timingFunction !== undefined) {
    style.transitionTimingFunction = timingFunction;
  }
  translateStyle.value = style;
}

/** Translate for the last view (brings the final slide flush). */
function getLastViewTranslate(): number {
  if (displaySlidesPerView.value === 'auto') {
    const axis = sizeAxis.value;
    return computeAutoLastTranslate(
      slideSizes.value.map((size) => size[axis]),
      slideTranslates.value,
      perViewSizeRef.value[axis],
    );
  }
  return slideTranslates.value[totalView.value - 1] ?? 0;
}

function getTranslate(index: number): number {
  if (index >= totalView.value - 1) {
    return getLastViewTranslate();
  }
  return slideTranslates.value[index] ?? 0;
}

function translateTo(index: number, durationMs: number): void {
  const translate = getTranslate(index);
  if (translate !== previousTranslate && durationMs > 0) {
    inTransition = true;
  }
  previousTranslate = getTranslate(realIndex.value);
  updateTranslate(translate, durationMs);
}

function fixTranslate(durationMs = 0): void {
  if (sequenceLayout.value) {
    translateTo(realIndex.value, durationMs);
  } else if (previousTranslate !== 0) {
    if (!inTransition && durationMs > 0) {
      inTransition = true;
    }
    previousTranslate = 0;
    updateTranslate(0, durationMs);
  }
}

/* ────────────────────────── slide registry ────────────────────────── */

function addSlide(slide?: HTMLElement): void {
  if (!slide) return;
  slideElsRef.value.push(slide);
}

function removeSlide(slide?: HTMLElement): void {
  if (!slide) return;
  const index = slideElsRef.value.indexOf(slide);
  if (index !== -1) {
    slideElsRef.value.splice(index, 1);
  }
}

function getSlideIndex(slideOrIndex?: HTMLElement | number): number {
  return typeof slideOrIndex === 'number'
    ? slideOrIndex
    : slideOrIndex
      ? slideElsRef.value.indexOf(slideOrIndex)
      : -1;
}

function getSlideStyle(
  slideOrIndex: HTMLElement | number,
): string | Record<string, string | number> | undefined {
  const index = getSlideIndex(slideOrIndex);
  if (index !== -1) {
    const styles: Array<string | CSSProperties | Record<string, string | number>> = [
      slideStyles.value[index] ?? {},
    ];
    if (isRealPrev(index)) {
      styles.push(props.prevSlideStyle ?? '');
    }
    if (isRealNext(index)) {
      styles.push(props.nextSlideStyle ?? '');
    }
    // normalizeStyle narrows to `string | CSSProperties`; the caller
    // contract (naive parity) is the wider record shape.
    return normalizeStyle(styles as StyleValue) as
      string | Record<string, string | number> | undefined;
  }
  return undefined;
}

/* ────────────────────────── drag ────────────────────────── */

let dragStartX = 0;
let dragStartY = 0;
let dragOffset = 0;
let dragStartTime = 0;
let dragging = false;
let isEffectiveDrag = false;

function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return typeof TouchEvent !== 'undefined' && event instanceof TouchEvent;
}

function onCarouselItemClick(index: number, event: MouseEvent): void {
  let allowClick = !inTransition && !dragging && !isEffectiveDrag;
  if (props.effect === 'card' && allowClick && !isRealActive(index)) {
    to(index);
    allowClick = false;
  }
  if (!allowClick) {
    event.preventDefault();
    event.stopPropagation();
  }
}

/**
 * Interactive elements keep their native pointer/touch behaviour: a drag
 * never starts when mousedown/touchstart lands inside one (a `<video
 * controls>` timeline, a link, a form control). Card-mode side-slide
 * navigation is unaffected — it listens for `click`, not for drag start.
 * (Beyond naive, which preventDefaults every mouse drag start.)
 *
 * `<video>` / `<audio>` WITHOUT the `controls` attribute are imagery to the
 * pointer: native drag would swallow the whole gesture (a ghost drag starts
 * and no mousemove/mouseup ever reaches the page), so they stay swipeable —
 * our mousedown preventDefault then also cancels the browser's native media
 * drag. With `controls` the toolbar owns the pointer.
 */
const NO_DRAG_SELECTOR =
  'video, audio, a, button, input, textarea, select, [contenteditable], [data-no-drag]';

function isDragGuarded(target: Element): boolean {
  const guarded = target.closest(NO_DRAG_SELECTOR);
  if (!guarded) return false;
  if (guarded instanceof HTMLVideoElement || guarded instanceof HTMLAudioElement) {
    return guarded.hasAttribute('controls');
  }
  return true;
}

function handleTouchstart(event: MouseEvent | TouchEvent): void {
  if (globalDragging) return;
  const slidesEl = slidesElRef.value;
  const target = event.target;
  if (!slidesEl || !(target instanceof Node) || !slidesEl.contains(target)) {
    return;
  }
  if (target instanceof Element && isDragGuarded(target)) {
    return;
  }
  globalDragging = true;
  dragging = true;
  isEffectiveDrag = false;
  dragStartTime = Date.now();
  stopAutoplay();
  if (event.type !== 'touchstart' && !(event.target as HTMLElement).isContentEditable) {
    event.preventDefault();
  }
  const point = isTouchEvent(event) ? event.touches[0] : event;
  if (!point) return;
  dragStartX = point.clientX;
  dragStartY = point.clientY;
  if (props.touchable) {
    document.addEventListener('touchmove', handleTouchmove, { passive: false });
    document.addEventListener('touchend', handleTouchend);
    document.addEventListener('touchcancel', handleTouchend);
  }
  if (props.draggable) {
    document.addEventListener('mousemove', handleTouchmove);
    document.addEventListener('mouseup', handleTouchend);
  }
}

function handleTouchmove(event: MouseEvent | TouchEvent): void {
  const axis = sizeAxis.value;
  const point = isTouchEvent(event) ? event.touches[0] : event;
  if (!point) return;
  const offset = isVertical.value ? point.clientY - dragStartY : point.clientX - dragStartX;
  const perViewSize = perViewSizeRef.value[axis];
  dragOffset = clampValue(offset, -perViewSize, perViewSize);
  if (event.cancelable) {
    event.preventDefault();
  }
  if (sequenceLayout.value) {
    updateTranslate(previousTranslate - dragOffset, 0);
  }
}

function handleTouchend(): void {
  const currentRealIndex = realIndex.value;
  let targetIndex: number | null = currentRealIndex;
  if (!inTransition && dragOffset !== 0 && sequenceLayout.value) {
    const currentTranslate = previousTranslate - dragOffset;
    const translates = [
      ...slideTranslates.value.slice(0, totalView.value - 1),
      getLastViewTranslate(),
    ];
    targetIndex = findNearestTranslateIndex(translates, currentTranslate);
  }
  if (targetIndex === currentRealIndex) {
    const timeElapsed = Date.now() - dragStartTime;
    const flick = resolveFlickDirection(
      dragOffset,
      perViewSizeRef.value[sizeAxis.value],
      timeElapsed,
    );
    if (flick === -1) {
      prev();
    } else if (flick === 1) {
      next();
    }
  }
  if (targetIndex !== null && targetIndex !== currentRealIndex) {
    isEffectiveDrag = true;
    toRealIndex(targetIndex);
    void nextTick(() => {
      if (!duplicatedable.value || uncontrolledDisplayIndex.value !== mergedDisplayIndex.value) {
        fixTranslate(speedMs.value);
      }
    });
  } else {
    fixTranslate(speedMs.value);
  }
  resetDragStatus();
  resetAutoplay();
}

function resetDragStatus(): void {
  if (dragging) {
    globalDragging = false;
  }
  dragging = false;
  dragStartX = 0;
  dragStartY = 0;
  dragOffset = 0;
  dragStartTime = 0;
  document.removeEventListener('touchmove', handleTouchmove);
  document.removeEventListener('touchend', handleTouchend);
  document.removeEventListener('touchcancel', handleTouchend);
  document.removeEventListener('mousemove', handleTouchmove);
  document.removeEventListener('mouseup', handleTouchend);
}

/* ────────────────────────── slide events ────────────────────────── */

function onSlidesTouchstart(event: TouchEvent): void {
  if (props.touchable) handleTouchstart(event);
}

function onSlidesMousedown(event: MouseEvent): void {
  if (props.draggable) handleTouchstart(event);
}

function onSlidesWheel(event: WheelEvent): void {
  if (props.mousewheel) handleMousewheel(event);
}

function handleTransitionEnd(): void {
  if (sequenceLayout.value && inTransition) {
    // Snap from a clone back onto the real slide without a transition.
    translateTo(realIndex.value, 0);
  } else {
    resetAutoplay();
  }
  if (sequenceLayout.value) {
    translateStyle.value.transitionDuration = '0ms';
  }
  inTransition = false;
}

/* ────────────────────────── mousewheel ────────────────────────── */

function handleMousewheel(event: WheelEvent): void {
  event.preventDefault();
  if (inTransition) return;
  const direction = resolveWheelDirection(
    event.deltaX,
    event.deltaY,
    event.shiftKey,
    isVertical.value,
  );
  if (direction === 1 && !isNextDisabled()) {
    next();
  } else if (direction === -1 && !isPrevDisabled()) {
    prev();
  }
}

/* ────────────────────────── autoplay ────────────────────────── */

let autoplayTimer: number | null = null;

function stopAutoplay(): void {
  if (autoplayTimer !== null) {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

function resetAutoplay(): void {
  stopAutoplay();
  const disabled = !props.autoplay || displayTotalView.value < 2;
  if (!disabled) {
    autoplayTimer = window.setInterval(next, props.interval);
  }
}

function handleMouseenter(): void {
  if (props.autoplay) {
    stopAutoplay();
  }
}

function handleMouseleave(): void {
  if (props.autoplay) {
    resetAutoplay();
  }
}

/* ────────────────────────── resize ────────────────────────── */

let resizeObserver: ResizeObserver | null = null;

function handleResize(): void {
  const el = selfElRef.value;
  if (el) {
    perViewSizeRef.value = calculateSize(el, true);
  }
  resetAutoplay();
}

/* ────────────────────────── lifecycle ────────────────────────── */

onMounted(() => {
  handleResize();
  // Re-establish the timer when autoplay / interval / total view change.
  watchEffect(resetAutoplay);
  if (typeof ResizeObserver !== 'undefined' && selfElRef.value) {
    resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(selfElRef.value);
  }
  requestAnimationFrame(() => {
    isMountedRef.value = true;
  });
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  resetDragStatus();
  stopAutoplay();
});

/**
 * Keep the slide registry in DOM order after the slot children reorder
 * (naive performs the equivalent sort in `onUpdated` against vnodes).
 */
onUpdated(() => {
  const container = slidesElRef.value;
  if (!container) return;
  const slideEls = slideElsRef.value;
  if (slideEls.length < 2) return;
  const domOrder = Array.from(container.getElementsByClassName('sn-carousel__slide'));
  // Index the DOM order once — sorting with `indexOf` per comparison was
  // O(n²) DOM scans on every component update.
  const order = new Map<Element, number>();
  domOrder.forEach((el, i) => order.set(el, i));
  slideEls.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
});

/* ────────────────────────── watches ────────────────────────── */

watch(
  realIndex,
  (nextRealIndex, lastRealIndex) => {
    if (nextRealIndex === lastRealIndex) {
      expectedTransitionDirection = 0;
      return;
    }
    resetAutoplay();
    if (sequenceLayout.value) {
      let target = nextRealIndex;
      if (duplicatedable.value) {
        const length = totalView.value;
        // Map clone-landing indexes back onto the first/last originals so
        // the animation ends on a clone, then transitionend snaps it.
        if (
          expectedTransitionDirection === -1 &&
          lastRealIndex === 1 &&
          nextRealIndex === length - 2
        ) {
          target = 0;
        } else if (
          expectedTransitionDirection === 1 &&
          lastRealIndex === length - 2 &&
          nextRealIndex === 1
        ) {
          target = length - 1;
        }
      }
      translateTo(target, speedMs.value);
    } else {
      fixTranslate();
    }
    expectedTransitionDirection = 0;
  },
  { immediate: true },
);

watch([duplicatedable, displaySlidesPerView], () => {
  void nextTick(() => {
    toRealIndex(realIndex.value);
  });
});

watch(
  slideTranslates,
  () => {
    if (sequenceLayout.value) {
      fixTranslate();
    }
  },
  // Plain shallow watch: the computed emits a fresh primitive array per
  // recompute, so reference equality already fires exactly on real changes
  // — deep traversal would only add per-run cost.
);

watch(sequenceLayout, (value) => {
  if (!value) {
    inTransition = false;
    // Modes without a track reset the wrapper position.
    previousTranslate = 0;
    updateTranslate(0);
  } else {
    fixTranslate();
  }
});

/* ────────────────────────── slide vnodes ────────────────────────── */

const slots = useSlots();

function isCarouselItem(vnode: VNode): boolean {
  const type = vnode.type as { name?: string } | null | undefined;
  return typeof type === 'object' && type !== null && type.name === 'SnCarouselItem';
}

/** Flatten arrays / fragments, dropping comments and nulls. */
function flattenVNodes(vnodes: VNode[], result: VNode[] = []): VNode[] {
  for (const vnode of vnodes) {
    if (Array.isArray(vnode)) {
      flattenVNodes(vnode as VNode[], result);
      continue;
    }
    if (vnode === null || typeof vnode === 'string' || typeof vnode === 'number') continue;
    if (vnode.type === Fragment) {
      const children = vnode.children;
      if (Array.isArray(children)) {
        flattenVNodes(children as VNode[], result);
      }
      continue;
    }
    if (vnode.type === Comment) continue;
    result.push(vnode);
  }
  return result;
}

/* ───────────── options-driven media slides ───────────── */

/** Click-to-toggle playback for built-in `options` videos (muted banners). */
function toggleVideo(event: MouseEvent): void {
  const video = event.currentTarget as HTMLVideoElement | null;
  if (!video) return;
  if (video.paused) void video.play().catch(() => {});
  else video.pause();
}

/** Full-bleed media markup for one `options` entry. */
function renderMediaItem(item: SnCarouselMediaItem): VNode {
  const fit = item.fit ?? 'cover';
  const sizeStyle = { width: '100%', height: '100%', objectFit: fit, display: 'block' };
  if (item.type === 'video') {
    // No native controls: click toggles playback, and SnCarouselItem pauses
    // the video when its slide stops being current.
    return h('video', {
      src: item.src,
      poster: item.poster,
      muted: true,
      loop: true,
      playsinline: true,
      preload: 'metadata',
      style: { ...sizeStyle, cursor: 'pointer' },
      onClick: toggleVideo,
    });
  }
  // draggable=false keeps the native image drag from fighting the
  // carousel's pointer drag.
  return h('img', { src: item.src, alt: item.alt ?? '', style: sizeStyle, draggable: false });
}

const rawSlideVNodes = computed<VNode[]>(() => {
  if (props.options && props.options.length > 0) {
    // Data-driven mode: the component builds its own items so the media
    // markup stays inside; the `item` slot overrides the built-in renderer.
    return props.options.map((item, i) =>
      h(
        SnCarouselItem,
        {
          key: item.key ?? i,
          // exactOptionalPropertyTypes: only pass the caption props when set.
          ...(item.title !== undefined ? { title: item.title } : {}),
          ...(item.description !== undefined ? { description: item.description } : {}),
        },
        {
          default: (slotProps: { isActive: boolean; isPrev: boolean; isNext: boolean }) =>
            slots.item
              ? // `index` is the options-list index; it must not be overridden
                // by the item's internal (registration-lagged) scope index.
                slots.item({ ...slotProps, item, index: i })
              : renderMediaItem(item),
        },
      ),
    );
  }
  const children = slots.default ? flattenVNodes(slots.default()) : [];
  const items = children.filter(isCarouselItem);
  if (items.length) return items;
  // Bare children are wrapped in items automatically (naive parity).
  return children.map((child) => h(SnCarouselItem, null, { default: () => cloneVNode(child) }));
});

/**
 * Final render list: originals with normalized keys, plus one clone of the
 * last slide prepended and one clone of the first appended in duplicated
 * (loop + slide + per-view 1) mode.
 */
const slideVNodes = computed<VNode[]>(() => {
  const base = rawSlideVNodes.value.map((vnode, i) =>
    vnode.key == null ? cloneVNode(vnode, { key: i }) : vnode,
  );
  if (!duplicatedable.value || base.length <= 1) return base;
  return [
    cloneVNode(base[base.length - 1]!, {
      key: `sn-carousel-item-duplicate-${base.length - 1}-prepend`,
    }),
    ...base,
    cloneVNode(base[0]!, {
      key: 'sn-carousel-item-duplicate-0-append',
    }),
  ];
});

/** Stable diff key for a rendered slide (users may omit keys). */
function slideKeyOf(vnode: VNode, index: number): string | number {
  const key = vnode.key;
  if (typeof key === 'string' || typeof key === 'number') return key;
  return `sn-carousel-slide-${index}`;
}

/* ────────────────────────── provide / expose ────────────────────────── */

provide(carouselContextKey, {
  currentIndexRef: mergedDisplayIndex,
  to,
  prev: prevIfSlideTransitionEnd,
  next: nextIfSlideTransitionEnd,
  isVertical: () => isVertical.value,
  isHorizontal: () => !isVertical.value,
  isPrev: isRealPrev,
  isNext: isRealNext,
  isActive: isRealActive,
  isPrevDisabled,
  isNextDisabled,
  getSlideIndex,
  getSlideStyle,
  addSlide,
  removeSlide,
  onCarouselItemClick,
});

const arrowSlotProps = computed<CarouselArrowSlotProps>(() => ({
  total: displayTotalView.value,
  currentIndex: mergedDisplayIndex.value,
  to,
  prev: prevIfSlideTransitionEnd,
  next: nextIfSlideTransitionEnd,
  isPrevDisabled,
  isNextDisabled,
}));

const dotSlotProps = computed<CarouselDotSlotProps>(() => ({
  total: displayTotalView.value,
  currentIndex: mergedDisplayIndex.value,
  to,
}));

defineExpose({
  getCurrentIndex: () => mergedDisplayIndex.value,
  to,
  prev,
  next,
});

/* ────────────────────────── dots ────────────────────────── */

const dotEls = ref<HTMLElement[]>([]);

function setDotEl(index: number, el: Element | ComponentPublicInstance | null): void {
  if (el instanceof HTMLElement) {
    dotEls.value[index] = el;
  }
}

function focusDot(index: number): void {
  dotEls.value[index]?.focus();
}

function handleDotClick(index: number): void {
  if (props.trigger === 'click') {
    to(index);
  }
}

function handleDotMouseenter(index: number): void {
  if (props.trigger === 'hover') {
    to(index);
  }
}

function handleDotKeydown(event: KeyboardEvent, index: number): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    to(index);
    return;
  }
  if (!props.keyboard) return;
  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;
  const nodeName = document.activeElement?.nodeName.toLowerCase();
  if (nodeName === 'input' || nodeName === 'textarea') return;
  const action = resolveKeyboardAction(event.code, isVertical.value);
  if (!action) return;
  event.preventDefault();
  if (action === 'next' && !isNextDisabled()) {
    next();
    focusDot(mergedDisplayIndex.value);
  } else if (action === 'prev' && !isPrevDisabled()) {
    prev();
    focusDot(mergedDisplayIndex.value);
  }
}
</script>

<template>
  <div
    ref="selfElRef"
    :class="[
      'sn-carousel',
      `sn-carousel--${dotPlacement}`,
      `sn-carousel--${direction}`,
      `sn-carousel--${effect}`,
      isVertical ? 'sn-carousel--vertical' : '',
      showArrow ? 'sn-carousel--show-arrow' : '',
      userWantsControl ? 'sn-carousel--usercontrol' : '',
    ]"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <div
      ref="slidesElRef"
      class="sn-carousel__slides"
      role="listbox"
      :style="translateStyle"
      @transitionend="handleTransitionEnd"
      @touchstart.passive="onSlidesTouchstart"
      @mousedown="onSlidesMousedown"
      @wheel="onSlidesWheel"
    >
      <template v-if="userWantsControl">
        <div v-for="(slide, i) in slideVNodes" :key="slideKeyOf(slide, i)" :style="slideStyles[i]">
          <Transition v-bind="transitionProps">
            <component :is="slide" v-show="mergedDisplayIndex === i" />
          </Transition>
        </div>
      </template>
      <template v-else>
        <component :is="slide" v-for="(slide, i) in slideVNodes" :key="slideKeyOf(slide, i)" />
      </template>
    </div>

    <div
      v-if="showDots && displayTotalView > 1"
      class="sn-carousel__dots"
      :class="[`sn-carousel__dots--${dotType}`]"
      role="tablist"
    >
      <slot name="dots" :total="displayTotalView" :current-index="mergedDisplayIndex" :to="to">
        <div
          v-for="i in dotIndexes"
          :key="i"
          :ref="(el) => setDotEl(i, el)"
          class="sn-carousel__dot"
          :class="mergedDisplayIndex === i ? 'sn-carousel__dot--active' : ''"
          role="button"
          tabindex="0"
          :aria-selected="mergedDisplayIndex === i"
          @click="handleDotClick(i)"
          @mouseenter="handleDotMouseenter(i)"
          @keydown="handleDotKeydown($event, i)"
        />
      </slot>
    </div>

    <template v-if="showArrow">
      <slot
        name="arrow"
        :total="displayTotalView"
        :current-index="mergedDisplayIndex"
        :to="to"
        :prev="prevIfSlideTransitionEnd"
        :next="nextIfSlideTransitionEnd"
        :is-prev-disabled="isPrevDisabled"
        :is-next-disabled="isNextDisabled"
      >
        <div class="sn-carousel__arrow-group">
          <div
            class="sn-carousel__arrow"
            :class="isPrevDisabled() ? 'sn-carousel__arrow--disabled' : ''"
            role="button"
            @click="prevIfSlideTransitionEnd"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
              <g fill="none">
                <path
                  d="M10.26 3.2a.75.75 0 0 1 .04 1.06L6.773 8l3.527 3.74a.75.75 0 1 1-1.1 1.02l-4-4.25a.75.75 0 0 1 0-1.02l4-4.25a.75.75 0 0 1 1.06-.04z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </div>
          <div
            class="sn-carousel__arrow"
            :class="isNextDisabled() ? 'sn-carousel__arrow--disabled' : ''"
            role="button"
            @click="nextIfSlideTransitionEnd"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
              <g fill="none">
                <path
                  d="M5.74 3.2a.75.75 0 0 0-.04 1.06L9.227 8L5.7 11.74a.75.75 0 1 0 1.1 1.02l4-4.25a.75.75 0 0 0 0-1.02l-4-4.25a.75.75 0 0 0-1.06-.04z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </div>
        </div>
      </slot>
    </template>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only.
 * Mirror of naive `carousel.cssr` root/slides/dots/arrow blocks. Slide-box
 * rules (`.sn-carousel__slide`) live in SnCarouselItem.vue — scoped styles
 * can only reach this component's own template elements. */

.sn-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: pan-y;
}

.sn-carousel__slides {
  display: flex;
  width: 100%;
  height: 100%;
  transition-property: transform;
  transition-timing-function: var(--sn-web-bezier-ease, ease);
}

.sn-carousel--vertical {
  touch-action: pan-x;
}
.sn-carousel--vertical .sn-carousel__slides {
  flex-direction: column;
}

/* ── effect: custom — the per-slide wrappers are centred absolutely ── */
.sn-carousel--usercontrol .sn-carousel__slides > div {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

/* ── effect: card — 3D stage (slide transforms live in SnCarouselItem) ── */
.sn-carousel--card .sn-carousel__slides {
  perspective: 1000px;
}

/* ── indicator dots ── */
.sn-carousel__dots {
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
}

.sn-carousel__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  outline: none;
  transition:
    box-shadow 0.3s var(--sn-web-bezier-ease, ease),
    background-color 0.3s var(--sn-web-bezier-ease, ease);
}
.sn-carousel__dot:focus {
  background-color: rgba(255, 255, 255, 0.5);
}
.sn-carousel__dot--active {
  background-color: rgba(255, 255, 255, 1);
}

.sn-carousel__dots--line .sn-carousel__dot {
  width: 16px;
  height: 4px;
  border-radius: 9999px;
  transition:
    width 0.3s var(--sn-web-bezier-ease, ease),
    box-shadow 0.3s var(--sn-web-bezier-ease, ease),
    background-color 0.3s var(--sn-web-bezier-ease, ease);
}
.sn-carousel__dots--line .sn-carousel__dot--active {
  width: 24px;
}

/* ── dots placement ── */
.sn-carousel--bottom .sn-carousel__dots {
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
}
.sn-carousel--top .sn-carousel__dots {
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
}
.sn-carousel--bottom .sn-carousel__dot,
.sn-carousel--top .sn-carousel__dot {
  margin: 0 4px;
}

.sn-carousel--left .sn-carousel__dots,
.sn-carousel--right .sn-carousel__dots {
  top: 50%;
  flex-direction: column;
  transform: translateY(-50%);
}
.sn-carousel--left .sn-carousel__dots {
  left: 12px;
}
.sn-carousel--right .sn-carousel__dots {
  right: 12px;
}
.sn-carousel--left .sn-carousel__dot,
.sn-carousel--right .sn-carousel__dot {
  margin: 4px 0;
}

/* Line dots run vertically on left/right placement. */
.sn-carousel--left .sn-carousel__dots--line .sn-carousel__dot,
.sn-carousel--right .sn-carousel__dots--line .sn-carousel__dot {
  width: 4px;
  height: 16px;
  transition:
    height 0.3s var(--sn-web-bezier-ease, ease),
    box-shadow 0.3s var(--sn-web-bezier-ease, ease),
    background-color 0.3s var(--sn-web-bezier-ease, ease);
}
.sn-carousel--left .sn-carousel__dots--line .sn-carousel__dot--active,
.sn-carousel--right .sn-carousel__dots--line .sn-carousel__dot--active {
  height: 24px;
}

/* When arrows are shown, dots shift out of their way. */
.sn-carousel--show-arrow.sn-carousel--bottom .sn-carousel__dots {
  bottom: 18px;
  left: 18px;
  transform: translateX(0);
}
.sn-carousel--show-arrow.sn-carousel--top .sn-carousel__dots {
  top: 18px;
  left: 18px;
  transform: translateX(0);
}
.sn-carousel--show-arrow.sn-carousel--left .sn-carousel__dots {
  top: 18px;
  left: 18px;
  transform: translateY(0);
}
.sn-carousel--show-arrow.sn-carousel--right .sn-carousel__dots {
  top: 18px;
  right: 18px;
  transform: translateY(0);
}

/* ── arrows ── */
.sn-carousel__arrow-group {
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
}

.sn-carousel__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  /* naive arrowColor is #eee — expressed as a white overlay mix here so no
   * literal hex lands in component CSS (registered in ai-description.md). */
  color: color-mix(in srgb, rgba(255, 255, 255, 1) 93%, transparent);
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: background-color 0.3s var(--sn-web-bezier-ease, ease);
}
.sn-carousel__arrow svg {
  width: 1em;
  height: 1em;
}
.sn-carousel__arrow:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
.sn-carousel__arrow--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.sn-carousel--vertical .sn-carousel__arrow {
  transform: rotate(90deg);
}

/* ── arrow-group placement ── */
.sn-carousel--bottom .sn-carousel__arrow-group,
.sn-carousel--top .sn-carousel__arrow-group {
  right: 12px;
}
.sn-carousel--bottom .sn-carousel__arrow-group {
  bottom: 12px;
}
.sn-carousel--top .sn-carousel__arrow-group {
  top: 12px;
}
.sn-carousel--left .sn-carousel__arrow-group,
.sn-carousel--right .sn-carousel__arrow-group {
  bottom: 12px;
  flex-direction: column;
}
.sn-carousel--left .sn-carousel__arrow-group {
  left: 12px;
}
.sn-carousel--right .sn-carousel__arrow-group {
  right: 12px;
}
.sn-carousel--bottom .sn-carousel__arrow-group > :first-child,
.sn-carousel--top .sn-carousel__arrow-group > :first-child {
  margin-right: 12px;
}
.sn-carousel--left .sn-carousel__arrow-group > :first-child,
.sn-carousel--right .sn-carousel__arrow-group > :first-child {
  margin-bottom: 12px;
}
</style>
