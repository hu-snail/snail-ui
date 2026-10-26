<script setup lang="ts">
/**
 * sn-tooltip (uni-end) — tap-triggered text hint bubble.
 *
 * Reference library: wot-ui `wd-tooltip`
 *   (https://wot-ui.cn/component/tooltip.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-tooltip 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-tooltip/sn-tooltip.vue
 * → auto-registered as `<sn-tooltip>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 *
 * ## Documented divergences from wd-tooltip
 *
 *   - There is no `hover` on miniprogram / touch devices, so the trigger is
 *     tapped (`@tap`) to toggle instead of hovered.
 *   - `root-portal` is declared for parity but NOT implemented: uni-app
 *     miniprogram has no portal host, so the bubble cannot be reparented to
 *     the page root. The host must not wrap the tooltip in a transformed
 *     container. Marked "未实现" on the docs page.
 *   - `updatePosition()` is a compatibility no-op: the bubble is placed by
 *     CSS (`placement` + `offset`), so there is no measurement to refresh and
 *     no collision flip to recompute.
 *
 * ## Why the offset is a CSS variable pair, not an inline transform
 *
 * The placement rules already use `transform: translateX(-50%)` to centre the
 * bubble on its trigger. An inline `transform` would win the cascade and
 * silently break that centring, so `offset` is published as
 * `--sn-tooltip-offset-x` / `--sn-tooltip-offset-y` and folded into the
 * placement margins with `calc()`.
 *
 * ## Timers (AGENTS.md §41)
 *
 * One transition timer keeps the bubble mounted for the fade-out leg. It is
 * cleared on every leg change and in `onBeforeUnmount`; no global listener is
 * registered (miniprogram has no `document`).
 *
 * Usage:
 *   <sn-tooltip content="删除后不可恢复" placement="top">
 *     <text>删除</text>
 *   </sn-tooltip>
 *
 * Not responsible for:
 *   - 带菜单项的富气泡 — 用 sn-popover
 *   - 页面级下拉筛选 — 用 sn-drop-menu
 */

import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnTooltip' });

/** Bubble anchor. Mirrors `wd-tooltip` `placement` (12 directions). */
type TooltipPlacement =
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

/**
 * Gap between trigger and bubble. `number` applies to both axes, `[x, y]`
 * sets them individually, `{ x, y }` sets either one.
 */
type PopoverOffset = number | number[] | { x?: number; y?: number };

/** One row of an array `content`. */
type TooltipContentRow = Record<string, unknown> | string;

/** Fade-out leg length in ms (the leave leg keeps the node mounted). */
const ANIMATION_DURATION = 150;

const props = withDefaults(
  defineProps<{
    /** Whether the bubble is shown (v-model). */
    modelValue?: boolean;
    /** Bubble text; an array renders one line per entry. */
    content?: string | TooltipContentRow[];
    /** Bubble anchor. */
    placement?: TooltipPlacement;
    /** Gap between trigger and bubble, in design px. */
    offset?: PopoverOffset;
    /** Render the arrow pointing at the trigger. */
    visibleArrow?: boolean;
    /** Disables the trigger — taps are ignored and the bubble stays closed. */
    disabled?: boolean;
    /** Render a close button inside the bubble. */
    showClose?: boolean;
    /** Extra class on the arrow node. */
    customArrow?: string;
    /** Extra class on the bubble node. */
    customPop?: string;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
    /**
     * Accepted for `wd-tooltip` parity, NOT implemented — miniprogram has no
     * portal host, so the bubble cannot leave the page's document flow.
     */
    rootPortal?: boolean;
  }>(),
  {
    modelValue: false,
    content: '',
    placement: 'bottom',
    offset: 0,
    visibleArrow: true,
    disabled: false,
    showClose: false,
    customArrow: '',
    customPop: '',
    customClass: '',
    customStyle: '',
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
  // One tick so the hidden style is committed before the shown class lands,
  // otherwise both frames coalesce and the bubble pops in without fading.
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
  // A consumer that ignores `update:modelValue` still gets a working bubble.
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

/** Text lines for a `content` value. */
const contentLines = computed<string[]>(() => {
  if (typeof props.content === 'string') return props.content ? [props.content] : [];
  return props.content
    .map((row) => {
      if (typeof row === 'string') return row;
      const label = row.label ?? row.text ?? row.content ?? row.name;
      return typeof label === 'string' ? label : '';
    })
    .filter((line) => line !== '');
});

const rootClass = computed(() => [
  'sn-tooltip',
  `sn-tooltip--${props.placement}`,
  {
    'sn-tooltip--disabled': props.disabled,
    'sn-tooltip--shown': isShown.value,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const { x, y } = offsetPair.value;
  const base = [`--sn-tooltip-offset-x: ${x}px`, `--sn-tooltip-offset-y: ${y}px`].join('; ');
  return props.customStyle ? `${base}; ${props.customStyle}` : base;
});

const popClass = computed(() => ['sn-tooltip__pop', props.customPop]);

const arrowClass = computed(() => ['sn-tooltip__arrow', props.customArrow]);
</script>

<template>
  <view data-snui-component="tooltip" :class="rootClass" :style="rootStyle">
    <view
      class="sn-tooltip__trigger"
      role="button"
      :aria-expanded="isShown ? 'true' : 'false'"
      :aria-disabled="props.disabled ? 'true' : undefined"
      @tap="onTriggerTap"
    >
      <slot />
    </view>

    <view v-if="isMounted" :class="popClass" role="tooltip">
      <view v-if="visibleArrow" :class="arrowClass" aria-hidden="true" />
      <view class="sn-tooltip__body">
        <slot name="content">
          <text v-for="(line, index) in contentLines" :key="index" class="sn-tooltip__line">
            {{ line }}
          </text>
        </slot>
      </view>
      <view
        v-if="showClose"
        class="sn-tooltip__close"
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

.sn-tooltip {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
}

.sn-tooltip__trigger {
  display: block;
}

/* ── Bubble ────────────────────────────────────────────────────────────── */

.sn-tooltip__pop {
  position: absolute;
  z-index: 500;
  display: flex;
  align-items: flex-start;
  gap: var(--sn-mp-spacing-2);
  max-width: 480rpx;
  box-sizing: border-box;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-md);
  /* Inverted surface: the page text color as the bubble fill, and the
   * elevated surface color as the bubble text — both flip in dark mode. */
  background-color: var(--sn-mp-color-text-primary);
  color: var(--sn-mp-color-background-elevated);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
  box-shadow: var(--sn-mp-shadow-md);
  opacity: 0;
  transition: opacity 150ms ease;
  pointer-events: none;
}

.sn-tooltip--shown .sn-tooltip__pop {
  opacity: 1;
  pointer-events: auto;
}

.sn-tooltip__body {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.sn-tooltip__line {
  display: block;
}

.sn-tooltip__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  color: var(--sn-mp-color-background-elevated);
  opacity: 0.7;
}

/* ── Arrow ─────────────────────────────────────────────────────────────── */

.sn-tooltip__arrow {
  position: absolute;
  width: 16rpx;
  height: 16rpx;
  background-color: var(--sn-mp-color-text-primary);
  transform: rotate(45deg);
}

/* ── Placement: top family ─────────────────────────────────────────────── */

.sn-tooltip--top .sn-tooltip__pop {
  bottom: 100%;
  left: 50%;
  margin-bottom: calc(12rpx + var(--sn-tooltip-offset-y));
  transform: translateX(calc(-50% + var(--sn-tooltip-offset-x)));
}
.sn-tooltip--top-start .sn-tooltip__pop {
  bottom: 100%;
  left: 0;
  margin-bottom: calc(12rpx + var(--sn-tooltip-offset-y));
  margin-left: var(--sn-tooltip-offset-x);
}
.sn-tooltip--top-end .sn-tooltip__pop {
  right: 0;
  bottom: 100%;
  margin-right: var(--sn-tooltip-offset-x);
  margin-bottom: calc(12rpx + var(--sn-tooltip-offset-y));
}

/* ── Placement: bottom family ──────────────────────────────────────────── */

.sn-tooltip--bottom .sn-tooltip__pop {
  top: 100%;
  left: 50%;
  margin-top: calc(12rpx + var(--sn-tooltip-offset-y));
  transform: translateX(calc(-50% + var(--sn-tooltip-offset-x)));
}
.sn-tooltip--bottom-start .sn-tooltip__pop {
  top: 100%;
  left: 0;
  margin-top: calc(12rpx + var(--sn-tooltip-offset-y));
  margin-left: var(--sn-tooltip-offset-x);
}
.sn-tooltip--bottom-end .sn-tooltip__pop {
  top: 100%;
  right: 0;
  margin-top: calc(12rpx + var(--sn-tooltip-offset-y));
  margin-right: var(--sn-tooltip-offset-x);
}

/* ── Placement: left family ────────────────────────────────────────────── */

.sn-tooltip--left .sn-tooltip__pop {
  top: 50%;
  right: 100%;
  margin-right: calc(12rpx + var(--sn-tooltip-offset-x));
  transform: translateY(calc(-50% + var(--sn-tooltip-offset-y)));
}
.sn-tooltip--left-start .sn-tooltip__pop {
  top: 0;
  right: 100%;
  margin-right: calc(12rpx + var(--sn-tooltip-offset-x));
  margin-top: var(--sn-tooltip-offset-y);
}
.sn-tooltip--left-end .sn-tooltip__pop {
  right: 100%;
  bottom: 0;
  margin-right: calc(12rpx + var(--sn-tooltip-offset-x));
  margin-bottom: var(--sn-tooltip-offset-y);
}

/* ── Placement: right family ───────────────────────────────────────────── */

.sn-tooltip--right .sn-tooltip__pop {
  top: 50%;
  left: 100%;
  margin-left: calc(12rpx + var(--sn-tooltip-offset-x));
  transform: translateY(calc(-50% + var(--sn-tooltip-offset-y)));
}
.sn-tooltip--right-start .sn-tooltip__pop {
  top: 0;
  left: 100%;
  margin-left: calc(12rpx + var(--sn-tooltip-offset-x));
  margin-top: var(--sn-tooltip-offset-y);
}
.sn-tooltip--right-end .sn-tooltip__pop {
  bottom: 0;
  left: 100%;
  margin-left: calc(12rpx + var(--sn-tooltip-offset-x));
  margin-bottom: var(--sn-tooltip-offset-y);
}

/* ── Arrow geometry per placement ──────────────────────────────────────── */

.sn-tooltip--top .sn-tooltip__arrow,
.sn-tooltip--top-start .sn-tooltip__arrow,
.sn-tooltip--top-end .sn-tooltip__arrow {
  bottom: -6rpx;
}
.sn-tooltip--top .sn-tooltip__arrow {
  left: calc(50% - 8rpx);
}
.sn-tooltip--top-start .sn-tooltip__arrow {
  left: 24rpx;
}
.sn-tooltip--top-end .sn-tooltip__arrow {
  right: 24rpx;
}

.sn-tooltip--bottom .sn-tooltip__arrow,
.sn-tooltip--bottom-start .sn-tooltip__arrow,
.sn-tooltip--bottom-end .sn-tooltip__arrow {
  top: -6rpx;
}
.sn-tooltip--bottom .sn-tooltip__arrow {
  left: calc(50% - 8rpx);
}
.sn-tooltip--bottom-start .sn-tooltip__arrow {
  left: 24rpx;
}
.sn-tooltip--bottom-end .sn-tooltip__arrow {
  right: 24rpx;
}

.sn-tooltip--left .sn-tooltip__arrow,
.sn-tooltip--left-start .sn-tooltip__arrow,
.sn-tooltip--left-end .sn-tooltip__arrow {
  right: -6rpx;
}
.sn-tooltip--left .sn-tooltip__arrow {
  top: calc(50% - 8rpx);
}
.sn-tooltip--left-start .sn-tooltip__arrow {
  top: 16rpx;
}
.sn-tooltip--left-end .sn-tooltip__arrow {
  bottom: 16rpx;
}

.sn-tooltip--right .sn-tooltip__arrow,
.sn-tooltip--right-start .sn-tooltip__arrow,
.sn-tooltip--right-end .sn-tooltip__arrow {
  left: -6rpx;
}
.sn-tooltip--right .sn-tooltip__arrow {
  top: calc(50% - 8rpx);
}
.sn-tooltip--right-start .sn-tooltip__arrow {
  top: 16rpx;
}
.sn-tooltip--right-end .sn-tooltip__arrow {
  bottom: 16rpx;
}

.sn-tooltip--disabled .sn-tooltip__trigger {
  opacity: 0.5;
}

/* Doodle skin — hand-drawn bubble outline. */
.snui-skin-doodle .sn-tooltip__pop {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
