<script setup lang="ts">
/**
 * sn-popover (uni-end) — tap-triggered bubble with normal / menu modes.
 *
 * Reference library: wot-ui `wd-popover`
 *   (https://wot-ui.cn/component/popover.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-popover 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-popover/sn-popover.vue
 * → auto-registered as `<sn-popover>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 *
 * ## Documented divergences from wd-popover
 *
 *   - `hover` / `click` trigger switching does not exist: miniprogram has no
 *     hover, so the trigger is always tapped (`@tap`). The `trigger` prop is
 *     therefore not declared.
 *   - `root-portal` is NOT implemented (miniprogram has no portal host). It is
 *     declared for parity and marked "未实现" on the docs page.
 *   - `updatePosition()` is a compatibility no-op: the bubble is placed by CSS
 *     (`placement` + `offset`), so there is no measurement to refresh.
 *   - `iconClass` is accepted as an `sn-icon` registry name (or an image URL)
 *     rather than a CSS class — uni has no font-icon layer.
 *
 * ## Click-outside close (transparent mask)
 *
 * wot-ui closes the popover on a tap outside the bubble. Miniprogram has no
 * `document` to hang a global listener on, so the mechanism here is a
 * transparent fixed mask (z-index 499 — below the bubble's 500, above the
 * page) mounted exactly while the bubble is; tapping it calls `close()`.
 * Consequence: while a bubble is shown, the first tap anywhere else —
 * including on another popover's trigger — closes this one first.
 *
 * ## Bubble palette (wot-ui parity: --wot-popover-bg / --wot-popover-color)
 *
 * The fill already defaults to the elevated surface (white in the light
 * theme) and the label to the page text color; both flip with the mp dark
 * theme. They are published as `--sn-popover-bg` / `--sn-popover-color` so
 * consumers can recolor the bubble through `custom-style="--sn-popover-bg: …"`
 * (inline beats the class default). The arrow follows the fill.
 *
 * ## Timers (AGENTS.md §41)
 *
 * One transition timer keeps the bubble mounted for the fade-out leg. It is
 * cleared on every leg change and in `onBeforeUnmount`; no global listener is
 * registered (miniprogram has no `document`).
 *
 * Usage:
 *   <sn-popover v-model="open" mode="menu" :content="items" @menuclick="onPick">
 *     <sn-button>更多</sn-button>
 *   </sn-popover>
 *
 * Not responsible for:
 *   - 纯文本提示 — 用 sn-tooltip
 *   - 页面级下拉筛选 — 用 sn-drop-menu
 */

import { computed, markRaw, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';

defineOptions({ name: 'SnPopover' });

/** Bubble anchor. Mirrors `wd-popover` `placement` (12 directions). */
type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/** Bubble display mode. */
type PopoverMode = 'normal' | 'menu';

/**
 * Gap between trigger and bubble. `number` applies to both axes, `[x, y]`
 * sets them individually, `{ x, y }` sets either one.
 */
type PopoverOffset = number | number[] | { x?: number; y?: number };

/** One row of the `menu` mode list. */
export interface SnPopoverMenuItem {
  /** Row label. */
  content?: string;
  /** `sn-icon` registry name, or an image URL. */
  iconClass?: string;
  /** Disable the row — taps are ignored. */
  disabled?: boolean;
}

/** Fade-out leg length in ms (the leave leg keeps the node mounted). */
const ANIMATION_DURATION = 150;

const props = withDefaults(
  defineProps<{
    /** Whether the bubble is shown (v-model). */
    modelValue?: boolean;
    /** Bubble body: a string in `normal` mode, a list in `menu` mode. */
    content?: string | SnPopoverMenuItem[];
    /** Bubble display mode. */
    mode?: PopoverMode;
    /** Bubble anchor. */
    placement?: PopoverPlacement;
    /** Gap between trigger and bubble, in design px. */
    offset?: PopoverOffset;
    /** Render the arrow pointing at the trigger. */
    visibleArrow?: boolean;
    /** Disables the trigger — taps are ignored and the bubble stays closed. */
    disabled?: boolean;
    /** Render a close button inside the bubble. */
    showClose?: boolean;
    /** Extra class on the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
    /** Extra class on the arrow node. */
    customArrow?: string;
    /** Extra class on the bubble node. */
    customPop?: string;
    /**
     * Accepted for `wd-popover` parity, NOT implemented — miniprogram has no
     * portal host, so the bubble cannot leave the page's document flow.
     */
    rootPortal?: boolean;
  }>(),
  {
    modelValue: false,
    content: '',
    mode: 'normal',
    placement: 'bottom',
    offset: 0,
    visibleArrow: true,
    disabled: false,
    showClose: false,
    customClass: '',
    customStyle: '',
    customArrow: '',
    customPop: '',
    rootPortal: false,
  },
);

defineSlots<{
  /** Trigger content (the element the bubble points at). */
  default?(): unknown;
  /** Custom bubble body; replaces `content`. */
  content?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'open'): void;
  (e: 'close'): void;
  (e: 'change', payload: { show: boolean }): void;
  (e: 'menuclick', payload: { item: SnPopoverMenuItem; index: number }): void;
}>();

/** Bubble node present in the tree (survives the leave leg). */
const isMounted = ref(props.modelValue);
/** Target visible state — drives the opacity transition. */
const isShown = ref(props.modelValue);

/** Single pending transition timer (cleared on unmount, §41). */
let timer: ReturnType<typeof setTimeout> | null = null;
/** Guards against a stale leg finishing after a newer one started. */
let generation = 0;
/** Animation leg currently playing. `none` = at rest. */
let phase: 'none' | 'enter' | 'leave' = 'none';

function clearTimer(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

async function enter(): Promise<void> {
  // One open per hidden→shown transition: without this guard the v-model sync
  // that follows the trigger tap re-runs enter() and emits open / change twice.
  if (phase === 'enter' || isShown.value) return;
  phase = 'enter';
  clearTimer();
  const token = ++generation;
  isMounted.value = true;
  // One tick so the hidden style is committed before the shown class lands.
  await nextTick();
  if (token !== generation) return;
  isShown.value = true;
  emit('open');
  emit('change', { show: true });
  phase = 'none';
}

function leave(): void {
  // One close per shown→hidden transition: a leave already in flight (the
  // v-model sync arriving after an internal close), or a bubble that is
  // neither shown nor mounted, has nothing to tear down.
  if (phase === 'leave' || (!isShown.value && !isMounted.value)) return;
  phase = 'leave';
  clearTimer();
  const token = ++generation;
  isShown.value = false;
  emit('close');
  emit('change', { show: false });
  timer = setTimeout(() => {
    timer = null;
    if (token !== generation) return;
    isMounted.value = false;
    phase = 'none';
  }, ANIMATION_DURATION);
}

watch(
  () => props.modelValue,
  (value) => {
    if (props.disabled) return;
    if (value) void enter();
    else leave();
  },
);

onBeforeUnmount(clearTimer);

/** Show the bubble and notify the consumer (controlled + uncontrolled). */
function open(): void {
  if (props.disabled) return;
  emit('update:modelValue', true);
  if (!props.modelValue) void enter();
}

/** Hide the bubble and notify the consumer. */
function close(): void {
  emit('update:modelValue', false);
  if (props.modelValue) leave();
}

/** Compatibility no-op — see the header note (CSS-driven placement). */
function updatePosition(): void {
  // Intentionally empty: nothing is measured, so there is nothing to refresh.
}

defineExpose({ open, close, updatePosition });

function onTriggerTap(): void {
  if (props.disabled) return;
  if (props.modelValue) close();
  else open();
}

function onMenuTap(item: SnPopoverMenuItem, index: number): void {
  if (item.disabled) return;
  emit('menuclick', { item, index });
}

/* ── Presentation ──────────────────────────────────────────────────────── */

/** Normalise `offset` into a `{ x, y }` pair of design px. */
const offsetPair = computed<{ x: number; y: number }>(() => {
  const value = props.offset;
  if (typeof value === 'number') return { x: value, y: value };
  if (Array.isArray(value)) {
    const x = value[0];
    const y = value[1];
    return { x: typeof x === 'number' ? x : 0, y: typeof y === 'number' ? y : 0 };
  }
  return { x: value.x ?? 0, y: value.y ?? 0 };
});

/** `menu` mode rows (an empty list in `normal` mode). */
const menuItems = computed<SnPopoverMenuItem[]>(() =>
  props.mode === 'menu' && Array.isArray(props.content) ? props.content : [],
);

/** Plain text body for `normal` mode. */
const normalText = computed(() => (typeof props.content === 'string' ? props.content : ''));

/** Looks like an image source rather than a registry icon name. */
function isImageSource(value: string): boolean {
  return /^(https?:|data:|\/\/|\/|\.{1,2}\/)/.test(value);
}

/** Registry icon data for a menu row, or `null` when it is an image URL. */
function resolveRowIcon(icon: string | undefined): IconData | null {
  if (!icon || isImageSource(icon)) return null;
  const data = resolveIconByName(icon);
  return data ? markRaw(data) : null;
}

const rootClass = computed(() => [
  'sn-popover',
  `sn-popover--${props.placement}`,
  `sn-popover--${props.mode}`,
  {
    'sn-popover--disabled': props.disabled,
    'sn-popover--shown': isShown.value,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const { x, y } = offsetPair.value;
  const base = [`--sn-popover-offset-x: ${x}px`, `--sn-popover-offset-y: ${y}px`].join('; ');
  return props.customStyle ? `${base}; ${props.customStyle}` : base;
});

const popClass = computed(() => ['sn-popover__pop', props.customPop]);

const arrowClass = computed(() => ['sn-popover__arrow', props.customArrow]);
</script>

<template>
  <view data-snui-component="popover" :class="rootClass" :style="rootStyle">
    <view
      class="sn-popover__trigger"
      role="button"
      :aria-expanded="isShown ? 'true' : 'false'"
      :aria-disabled="props.disabled ? 'true' : undefined"
      @tap="onTriggerTap"
    >
      <slot />
    </view>

    <!-- Outside tap catcher: transparent, full viewport, one level under the bubble. -->
    <view v-if="isMounted" class="sn-popover__mask" aria-hidden="true" @tap="close" />
    <view v-if="isMounted" :class="popClass" role="dialog">
      <view v-if="visibleArrow" :class="arrowClass" aria-hidden="true" />

      <view v-if="mode === 'menu'" class="sn-popover__menu">
        <slot name="content">
          <view
            v-for="(item, index) in menuItems"
            :key="index"
            class="sn-popover__menu-item"
            :class="{ 'sn-popover__menu-item--disabled': item.disabled }"
            role="menuitem"
            :aria-disabled="item.disabled ? 'true' : 'false'"
            @tap="onMenuTap(item, index)"
          >
            <image
              v-if="item.iconClass && isImageSource(item.iconClass)"
              class="sn-popover__menu-icon"
              :src="item.iconClass"
              mode="aspectFit"
            />
            <view v-else-if="resolveRowIcon(item.iconClass)" class="sn-popover__menu-icon">
              <SnIcon :icon="resolveRowIcon(item.iconClass)!" :size="32" />
            </view>
            <text class="sn-popover__menu-text">{{ item.content }}</text>
          </view>
        </slot>
      </view>

      <view v-else class="sn-popover__body">
        <slot name="content">
          <text v-if="normalText" class="sn-popover__text">{{ normalText }}</text>
        </slot>
      </view>

      <view
        v-if="showClose"
        class="sn-popover__close"
        role="button"
        aria-label="close"
        @tap="close"
      >
        <SnIcon :icon="XIcon" :size="24" />
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-popover {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  /* Bubble palette (see header). Inline `custom-style` beats these defaults. */
  --sn-popover-bg: var(--sn-mp-color-background-elevated);
  --sn-popover-color: var(--sn-mp-color-text-primary);
}

.sn-popover__trigger {
  display: block;
}

/* ── Bubble ────────────────────────────────────────────────────────────── */

.sn-popover__pop {
  position: absolute;
  z-index: 500;
  display: flex;
  align-items: flex-start;
  gap: var(--sn-mp-spacing-2);
  /* Shrink-to-fit would clamp to min-content: the abspos containing block is
   * the trigger-sized root and `left: 50%` leaves only half of it available.
   * `max-content` grows past that cap; `max-width` still bounds long text. */
  width: max-content;
  min-width: 160rpx;
  max-width: 480rpx;
  box-sizing: border-box;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-popover-bg);
  color: var(--sn-popover-color);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
  box-shadow: var(--sn-mp-shadow-md);
  opacity: 0;
  transition: opacity 150ms ease;
  pointer-events: none;
}

.sn-popover--shown .sn-popover__pop {
  opacity: 1;
  pointer-events: auto;
}

/* Outside tap catcher — invisible, full viewport, one level under the
 * bubble. Inert during the fade legs so taps fall through to the page. */
.sn-popover__mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 499;
  background-color: transparent;
  pointer-events: none;
}

.sn-popover--shown .sn-popover__mask {
  pointer-events: auto;
}

.sn-popover__body {
  display: block;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
}

.sn-popover__text {
  display: block;
}

.sn-popover__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  margin: var(--sn-mp-spacing-2);
  color: var(--sn-mp-color-text-secondary);
}

/* ── Menu mode ─────────────────────────────────────────────────────────── */

.sn-popover--menu .sn-popover__pop {
  flex-direction: column;
  gap: 0;
  padding: var(--sn-mp-spacing-2) 0;
}

.sn-popover__menu {
  display: flex;
  flex-direction: column;
}

.sn-popover__menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  color: var(--sn-mp-color-text-primary);
}

.sn-popover__menu-item--disabled {
  color: var(--sn-mp-color-text-disabled);
}

.sn-popover__menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  color: var(--sn-mp-color-text-secondary);
}

.sn-popover__menu-text {
  display: block;
  white-space: nowrap;
}

/* ── Arrow ─────────────────────────────────────────────────────────────── */

.sn-popover__arrow {
  position: absolute;
  width: 16rpx;
  height: 16rpx;
  /* Solid fill like the tooltip arrow: a rotated bordered square shows a
   * misplaced diamond outline that does not line up with the bubble border. */
  background-color: var(--sn-popover-bg);
  transform: rotate(45deg);
}

/* ── Placement: top family ─────────────────────────────────────────────── */

.sn-popover--top .sn-popover__pop {
  bottom: 100%;
  left: 50%;
  margin-bottom: calc(12rpx + var(--sn-popover-offset-y));
  transform: translateX(calc(-50% + var(--sn-popover-offset-x)));
}
.sn-popover--top-start .sn-popover__pop {
  bottom: 100%;
  left: 0;
  margin-bottom: calc(12rpx + var(--sn-popover-offset-y));
  margin-left: var(--sn-popover-offset-x);
}
.sn-popover--top-end .sn-popover__pop {
  right: 0;
  bottom: 100%;
  margin-right: var(--sn-popover-offset-x);
  margin-bottom: calc(12rpx + var(--sn-popover-offset-y));
}

/* ── Placement: bottom family ──────────────────────────────────────────── */

.sn-popover--bottom .sn-popover__pop {
  top: 100%;
  left: 50%;
  margin-top: calc(12rpx + var(--sn-popover-offset-y));
  transform: translateX(calc(-50% + var(--sn-popover-offset-x)));
}
.sn-popover--bottom-start .sn-popover__pop {
  top: 100%;
  left: 0;
  margin-top: calc(12rpx + var(--sn-popover-offset-y));
  margin-left: var(--sn-popover-offset-x);
}
.sn-popover--bottom-end .sn-popover__pop {
  top: 100%;
  right: 0;
  margin-top: calc(12rpx + var(--sn-popover-offset-y));
  margin-right: var(--sn-popover-offset-x);
}

/* ── Placement: left family ────────────────────────────────────────────── */

.sn-popover--left .sn-popover__pop {
  top: 50%;
  right: 100%;
  margin-right: calc(12rpx + var(--sn-popover-offset-x));
  transform: translateY(calc(-50% + var(--sn-popover-offset-y)));
}
.sn-popover--left-start .sn-popover__pop {
  top: 0;
  right: 100%;
  margin-right: calc(12rpx + var(--sn-popover-offset-x));
  margin-top: var(--sn-popover-offset-y);
}
.sn-popover--left-end .sn-popover__pop {
  right: 100%;
  bottom: 0;
  margin-right: calc(12rpx + var(--sn-popover-offset-x));
  margin-bottom: var(--sn-popover-offset-y);
}

/* ── Placement: right family ───────────────────────────────────────────── */

.sn-popover--right .sn-popover__pop {
  top: 50%;
  left: 100%;
  margin-left: calc(12rpx + var(--sn-popover-offset-x));
  transform: translateY(calc(-50% + var(--sn-popover-offset-y)));
}
.sn-popover--right-start .sn-popover__pop {
  top: 0;
  left: 100%;
  margin-left: calc(12rpx + var(--sn-popover-offset-x));
  margin-top: var(--sn-popover-offset-y);
}
.sn-popover--right-end .sn-popover__pop {
  bottom: 0;
  left: 100%;
  margin-left: calc(12rpx + var(--sn-popover-offset-x));
  margin-bottom: var(--sn-popover-offset-y);
}

/* ── Arrow geometry per placement ──────────────────────────────────────── */

.sn-popover--top .sn-popover__arrow,
.sn-popover--top-start .sn-popover__arrow,
.sn-popover--top-end .sn-popover__arrow {
  bottom: -6rpx;
}
.sn-popover--top .sn-popover__arrow {
  left: calc(50% - 8rpx);
}
.sn-popover--top-start .sn-popover__arrow {
  left: 24rpx;
}
.sn-popover--top-end .sn-popover__arrow {
  right: 24rpx;
}

.sn-popover--bottom .sn-popover__arrow,
.sn-popover--bottom-start .sn-popover__arrow,
.sn-popover--bottom-end .sn-popover__arrow {
  top: -6rpx;
}
.sn-popover--bottom .sn-popover__arrow {
  left: calc(50% - 8rpx);
}
.sn-popover--bottom-start .sn-popover__arrow {
  left: 24rpx;
}
.sn-popover--bottom-end .sn-popover__arrow {
  right: 24rpx;
}

.sn-popover--left .sn-popover__arrow,
.sn-popover--left-start .sn-popover__arrow,
.sn-popover--left-end .sn-popover__arrow {
  right: -6rpx;
}
.sn-popover--left .sn-popover__arrow {
  top: calc(50% - 8rpx);
}
.sn-popover--left-start .sn-popover__arrow {
  top: 16rpx;
}
.sn-popover--left-end .sn-popover__arrow {
  bottom: 16rpx;
}

.sn-popover--right .sn-popover__arrow,
.sn-popover--right-start .sn-popover__arrow,
.sn-popover--right-end .sn-popover__arrow {
  left: -6rpx;
}
.sn-popover--right .sn-popover__arrow {
  top: calc(50% - 8rpx);
}
.sn-popover--right-start .sn-popover__arrow {
  top: 16rpx;
}
.sn-popover--right-end .sn-popover__arrow {
  bottom: 16rpx;
}

.sn-popover--disabled .sn-popover__trigger {
  opacity: 0.5;
}

/* Doodle skin — hand-drawn bubble outline. */
.snui-skin-doodle .sn-popover__pop {
  border-width: 4rpx;
  border-radius: var(--sn-mp-radius-xs);
}
</style>
