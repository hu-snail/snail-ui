<script setup lang="ts">
/**
 * sn-curtain (uni-end) — full-screen image curtain for promos / announcements.
 *
 * Reference library: wot-ui `wd-curtain`
 *   (https://wot-ui.cn/component/curtain.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-curtain 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-curtain/sn-curtain.vue
 * → auto-registered as `<sn-curtain>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 *
 * ## Documented divergences from wd-curtain
 *
 *   - `value` (the pre-v-model prop) is not declared: it is documented as
 *     deprecated upstream, and declaring a second source of truth would let
 *     the two disagree. Use `v-model`.
 *   - `root-portal` is NOT implemented (miniprogram has no portal host). It is
 *     declared for parity and marked "未实现" on the docs page.
 *   - `show-menu-by-longpress` maps onto `<image>`'s own
 *     `show-menu-by-longpress` attribute, which only WeChat honours; other
 *     targets ignore it.
 *   - `to` navigates through `globalThis.uni.navigateTo` behind an existence
 *     guard (see below), never through a router import — routing belongs to
 *     the host (AGENTS.md §20 / §60).
 *
 * ## `to` navigation (AGENTS.md §23: no dynamic code, §60: host owns routing)
 *
 * `uni` is looked up through a guarded `globalThis` access, so the component
 * also renders in H5 / test environments where the uni runtime is absent.
 * When there is no `navigateTo` (or the call fails, e.g. an unregistered page
 * path), the failure is swallowed and `click` still fires — the host can
 * handle navigation itself.
 *
 * ## Timers (AGENTS.md §41)
 *
 * One transition timer drives the leave leg and one generation token guards
 * against a stale leg. Both are cleared in `onBeforeUnmount`. There is no
 * global listener.
 *
 * Usage:
 *   <sn-curtain v-model="show" src="/static/promo.png" to="/pages/campaign" />
 *
 * Not responsible for:
 *   - 通用弹出层 — 用 sn-popup
 *   - 图片预览 / 缩放 — 用 sn-img
 */

import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnCurtain' });

/** Where the close button sits. Mirrors `wd-curtain` `close-position`. */
type CurtainClosePosition =
  'inset' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/** Leave leg length in ms (the node stays mounted until it elapses). */
const DEFAULT_DURATION = 300;

const props = withDefaults(
  defineProps<{
    /** Whether the curtain is shown (v-model). */
    modelValue?: boolean;
    /** Image URL — must be a network / package path, not a base64 blob. */
    src?: string;
    /** Image width in design px; 0 = fit the screen width. */
    width?: number;
    /** Page path to open when the image is tapped. */
    to?: string;
    /** Where the close button sits. */
    closePosition?: CurtainClosePosition;
    /** Close the curtain when the scrim is tapped. */
    closeOnClickModal?: boolean;
    /** Close the curtain when the image is tapped. */
    closeOnClick?: boolean;
    /** Remove the node from the tree once the leave animation finished. */
    hideWhenClose?: boolean;
    /** Stacking level of the curtain. */
    zIndex?: number;
    /** Extra class on the close button. */
    customCloseClass?: string;
    /** Extra inline style on the close button. */
    customCloseStyle?: string;
    /** Show the WeChat long-press menu on the image (WeChat only). */
    showMenuByLongpress?: boolean;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
    /**
     * Accepted for `wd-curtain` parity, NOT implemented — miniprogram has no
     * portal host, so the curtain cannot leave the page's document flow.
     */
    rootPortal?: boolean;
  }>(),
  {
    modelValue: false,
    src: '',
    width: 0,
    to: '',
    closePosition: 'inset',
    closeOnClickModal: false,
    closeOnClick: true,
    hideWhenClose: true,
    zIndex: 10,
    customCloseClass: '',
    customCloseStyle: '',
    showMenuByLongpress: false,
    customClass: '',
    customStyle: '',
    rootPortal: false,
  },
);

defineSlots<{
  /** Custom close button; replaces the built-in glyph. */
  close?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'click'): void;
  (e: 'close'): void;
  (e: 'closed'): void;
  (e: 'click-modal'): void;
  (e: 'before-enter'): void;
  (e: 'enter'): void;
  (e: 'after-enter'): void;
  (e: 'before-leave'): void;
  (e: 'leave'): void;
  (e: 'after-leave'): void;
  (e: 'load', event: Event): void;
  (e: 'error'): void;
}>();

/** Node present in the tree. */
const isMounted = ref(props.modelValue);
/** Target visible state — drives the fade transition. */
const isShown = ref(props.modelValue);
/** The image failed to load — the curtain stays hidden even when `modelValue`. */
const hasError = ref(false);

/** Single pending transition timer (cleared on unmount, §41). */
let timer: ReturnType<typeof setTimeout> | null = null;
/** Guards against a stale leg finishing after a newer one started. */
let generation = 0;

function clearTimer(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

async function enter(): Promise<void> {
  if (hasError.value) return;
  clearTimer();
  const token = ++generation;
  emit('before-enter');
  isMounted.value = true;
  // One tick so the hidden style is committed before the shown class lands.
  await nextTick();
  if (token !== generation) return;
  isShown.value = true;
  emit('enter');
  timer = setTimeout(() => {
    timer = null;
    if (token !== generation) return;
    emit('after-enter');
  }, DEFAULT_DURATION);
}

function leave(): void {
  clearTimer();
  const token = ++generation;
  emit('before-leave');
  isShown.value = false;
  emit('leave');
  timer = setTimeout(() => {
    timer = null;
    if (token !== generation) return;
    if (props.hideWhenClose) isMounted.value = false;
    emit('after-leave');
    emit('closed');
  }, DEFAULT_DURATION);
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) void enter();
    else leave();
  },
);

onBeforeUnmount(clearTimer);

/** Close requests coming from inside the component. */
function requestClose(): void {
  emit('update:modelValue', false);
  emit('close');
}

/**
 * Navigate to `to` through the host uni runtime.
 *
 * `uni` is read from `globalThis` behind a guard so the component also works
 * in H5 / tests where the runtime is absent. A rejected navigation (unknown
 * page path) is swallowed — `click` still fires so the host can react.
 */
function navigateTo(): void {
  if (!props.to) return;
  const host = globalThis as {
    uni?: { navigateTo?: (options: { url: string }) => unknown };
  };
  const navigate = host.uni?.navigateTo;
  if (typeof navigate !== 'function') return;
  try {
    const result = navigate({ url: props.to });
    // Newer runtimes return a promise; a rejection must not surface as an
    // unhandled rejection (AGENTS.md §39).
    if (result && typeof (result as Promise<unknown>).catch === 'function') {
      void (result as Promise<unknown>).catch(() => undefined);
    }
  } catch {
    // An unregistered page path throws synchronously on some targets.
  }
}

function onImageTap(): void {
  emit('click');
  navigateTo();
  if (props.closeOnClick) requestClose();
}

function onModalTap(): void {
  emit('click-modal');
  if (props.closeOnClickModal) requestClose();
}

function onCloseTap(event: Event): void {
  event.stopPropagation();
  requestClose();
}

function onImageLoad(event: Event): void {
  emit('load', event);
}

function onImageError(): void {
  hasError.value = true;
  emit('error');
  // A broken image must not keep a blank curtain on screen (wd-curtain does
  // the same: the curtain is not shown once the image failed).
  if (isMounted.value) leave();
}

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-curtain',
  {
    'sn-curtain--shown': isShown.value,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const base = `z-index: ${props.zIndex}`;
  return props.customStyle ? `${base}; ${props.customStyle}` : base;
});

/**
 * Image width: `width` in design px (×2 for rpx), or nothing when the image
 * should fill the screen. The full-width case is a class rather than an inline
 * `width: 100%`, so the layout mode is assertable as a class.
 */
const imageStyle = computed(() => {
  if (props.width > 0) return `width: ${props.width * 2}rpx`;
  return undefined;
});

const imageClass = computed(() => [
  'sn-curtain__image',
  { 'sn-curtain__image--full': props.width <= 0 },
]);

const closeClass = computed(() => [
  'sn-curtain__close',
  `sn-curtain__close--${props.closePosition}`,
  props.customCloseClass,
]);

const closeStyle = computed(() => props.customCloseStyle || undefined);
</script>

<template>
  <view
    v-if="isMounted"
    data-snui-component="curtain"
    :class="rootClass"
    :style="rootStyle"
    role="dialog"
    aria-modal="true"
  >
    <view class="sn-curtain__modal" aria-hidden="true" @tap="onModalTap" />

    <view class="sn-curtain__body">
      <image
        :class="imageClass"
        :style="imageStyle"
        :src="src"
        mode="widthFix"
        :show-menu-by-longpress="showMenuByLongpress"
        @tap="onImageTap"
        @load="onImageLoad"
        @error="onImageError"
      />

      <view
        :class="closeClass"
        :style="closeStyle"
        role="button"
        aria-label="close"
        @tap="onCloseTap"
      >
        <slot name="close">
          <SnIcon :icon="XIcon" :size="40" />
        </slot>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-curtain {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 300ms ease;
}

.sn-curtain--shown {
  opacity: 1;
}

/* ── Scrim ─────────────────────────────────────────────────────────────── */

.sn-curtain__modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--sn-mp-color-background-overlay);
}

/* ── Body ──────────────────────────────────────────────────────────────── */

.sn-curtain__body {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  box-sizing: border-box;
}

.sn-curtain__image {
  display: block;
  border-radius: var(--sn-mp-radius-md);
}

/* No `width` prop → the image fills the screen width. */
.sn-curtain__image--full {
  width: 100%;
}

/* ── Close button ──────────────────────────────────────────────────────── */

.sn-curtain__close {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  box-sizing: border-box;
  border-radius: var(--sn-mp-radius-full);
  border: 2rpx solid var(--sn-mp-color-border-default);
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-secondary);
}

/* `inset` = bottom-centre, inside the image (the wd default). */
.sn-curtain__close--inset {
  bottom: 24rpx;
  left: calc(50% - 28rpx);
}
.sn-curtain__close--top {
  top: -28rpx;
  left: calc(50% - 28rpx);
}
.sn-curtain__close--bottom {
  bottom: -28rpx;
  left: calc(50% - 28rpx);
}
.sn-curtain__close--top-left {
  top: -28rpx;
  left: -28rpx;
}
.sn-curtain__close--top-right {
  top: -28rpx;
  right: -28rpx;
}
.sn-curtain__close--bottom-left {
  bottom: -28rpx;
  left: -28rpx;
}
.sn-curtain__close--bottom-right {
  right: -28rpx;
  bottom: -28rpx;
}

/* Doodle skin — hand-drawn close button outline. */
.snui-skin-doodle .sn-curtain__close {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
