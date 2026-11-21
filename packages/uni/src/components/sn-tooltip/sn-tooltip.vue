<script setup lang="ts">
/**
 * sn-tooltip (uni-end) — tap-triggered TEXT-ONLY hint bubble (dark plate).
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
 * ## Scope: text hints only (deliberate split from sn-popover)
 *
 * The tooltip is the dark, compact, text-only hint: `content` is a string or
 * a list of plain-text lines, rendered on the platform-standard dark
 * transient plate (the toast token pair `--sn-mp-color-background-inverse` /
 * `--sn-mp-color-text-on-primary`). There is deliberately NO `content` slot,
 * no title / description / icon / actions — rich anchored cards, menus and
 * bottom sheets belong to `sn-popover`; page-level filters to `sn-drop-menu`.
 * The former `content` slot and object-row rendering were removed when the
 * two components were split (breaking, by design).
 *
 * ## Documented divergences from wd-tooltip
 *
 *   - There is no `hover` on miniprogram / touch devices, so the trigger is
 *     tapped (`@tap`) to toggle instead of hovered.
 *   - `theme` (`'dark' | 'light'`) is an AUI addition — wd-tooltip is
 *     dark-only. `light` re-skins the plate to a white surface with dark
 *     text plus the `--sn-mp-shadow-md` lift (Element-style light tooltip);
 *     the plate and arrow share the same `--sn-tooltip-bg` custom property,
 *     so one override re-skins both.
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
 * The placement rules already use pure `translateX/Y(-50%)` (no `calc()`
 * inside `transform` — uni-app x App drops complex calc) to centre the bubble
 * on its trigger. An inline `transform` would win the cascade and silently
 * break that centring, so `offset` is published as
 * `--sn-tooltip-offset-x` / `--sn-tooltip-offset-y` and folded into the
 * placement margins with `calc()`.
 *
 * ## Fixed bubble width (cross-platform geometry)
 *
 * The bubble is a fixed-width plate — `--sn-tooltip-width` (default 320rpx),
 * overridable via `custom-style`. The previous `width: max-content` +
 * `100vw` clamp silently broke on renderers that drop unsupported
 * declarations (uni-app x App has no `max-content` / `vw`); a fixed width is
 * deterministic on H5 / mp-weixin / uni-app x App. Text wraps inside it.
 *
 * ## Click-outside close (useQueue / closeOutside, wot-ui parity)
 *
 * uni-app components cannot listen to taps outside their own subtree, so the
 * transparent-mask approach was dropped: it swallowed the whole tap and made
 * switching to another bubble a two-tap affair. Instead the component
 * registers an idempotent close in `utils/outside-close.ts` while mounted,
 * and the page root binds the tap-bubbling dispatcher:
 *
 *   import { useQueue } from '@snui/uni';
 *   const { closeOutside } = useQueue();
 *   <view @tap="closeOutside"> … page … </view>
 *
 * The trigger and the bubble bind `@tap.stop` so taps on them never reach
 * the root handler — tapping another trigger therefore switches bubbles in
 * one gesture. Pages that never bind the handler simply never outside-close.
 *
 * On uni-app x App the page-root dispatcher never sees page taps either
 * (taps stay inside their compilation unit), so the App close paths are the
 * trigger re-tap and the bubble's own close button.
 *
 * ## App trigger catcher (uni-app x App)
 *
 * Taps on slot content never cross into this component's compilation unit on
 * App — the wrapper's `@tap` never fires from the page's trigger element, and
 * page-bound listeners on slotted components never fire either. The template
 * therefore ships an `#ifdef APP` transparent catcher over the trigger box
 * (a node this component owns) that receives the tap and runs the same
 * `onTriggerTap` toggle. Keep the default `trigger="slot"` for App; see the
 * `trigger` prop note for when `manual` is actually needed.
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
 *   - 富气泡 / 菜单 / 底部面板 — 用 sn-popover
 *   - 页面级下拉筛选 — 用 sn-drop-menu
 */

import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';
import {
  closeOutside,
  registerOutsideClosable,
  unregisterOutsideClosable,
} from '../../utils/outside-close';

defineOptions({ name: 'SnTooltip' });

const instanceId = getCurrentInstance()?.uid ?? 0;

// Register while mounted so a page-root `@tap="closeOutside"` closes this
// overlay too (the callback no-ops while the bubble is already closed).
onMounted(() =>
  registerOutsideClosable(instanceId, () => {
    // Idempotent: an already-closed bubble must not emit another close.
    if (isShown.value || isMounted.value) close();
  }),
);
onBeforeUnmount(() => unregisterOutsideClosable(instanceId));

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
type TooltipOffset = number | number[] | { x?: number; y?: number };

/** Fade-out leg length in ms (the leave leg keeps the node mounted). */
const ANIMATION_DURATION = 150;

const props = withDefaults(
  defineProps<{
    /** Whether the bubble is shown (v-model). */
    modelValue?: boolean;
    /**
     * How the trigger reacts. `slot` (default) binds the tap on the trigger
     * wrapper itself — on uni-app x App an App-only catcher node (see the
     * template note) receives it because slot-content taps never reach this
     * component's own views there. `manual` leaves toggling to the page via
     * v-model: use it when the tap target lives outside the default slot
     * (a remote button, imperative open/close), not as an App workaround —
     * event listeners the page binds on components inside the slot never fire
     * on App either, so a manual-mode slotted trigger is inert there too.
     */
    trigger?: 'slot' | 'manual';
    /** Bubble text; an array renders one plain-text line per entry. */
    content?: string | string[];
    /** Bubble anchor. */
    placement?: TooltipPlacement;
    /** Gap between trigger and bubble, in design px. */
    offset?: TooltipOffset;
    /** Render the arrow pointing at the trigger. */
    visibleArrow?: boolean;
    /**
     * Plate appearance (AUI additive — wd-tooltip is dark-only). `dark`
     * renders the platform-standard translucent toast plate; `light` renders
     * a white surface plate with dark text (Element-style light tooltip).
     */
    theme?: 'dark' | 'light';
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
    trigger: 'slot',
    content: '',
    placement: 'bottom',
    offset: 0,
    visibleArrow: true,
    theme: 'dark',
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

/** Hide the bubble and notify the consumer. Idempotent (outside-close contract). */
function close(): void {
  // Idempotent: a bubble opened uncontrolled (consumer ignoring the v-model
  // event) has `props.modelValue === false` while still shown — decide from
  // the actual shown state (popover parity).
  const wasUp = props.modelValue || isShown.value || isMounted.value;
  emit('update:modelValue', false);
  if (wasUp) leave();
}

/** Compatibility no-op — see the header note (CSS-driven placement). */
function updatePosition(): void {
  // Intentionally empty: nothing is measured, so there is nothing to refresh.
}

defineExpose({ open, close, updatePosition });

function onTriggerTap(): void {
  if (props.trigger === 'manual') return;
  if (props.disabled) return;
  // Toggle on the actual shown state, not `props.modelValue`: an uncontrolled
  // bubble (consumer ignoring the v-model event) must still close on the
  // second trigger tap (popover parity).
  if (isShown.value) {
    close();
    return;
  }
  // One-gesture switching (popover parity): the trigger stops propagation, so
  // it dispatches the outside-close itself before opening — other open
  // overlays fold in the same tap.
  closeOutside();
  open();
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

/** Plain-text lines for a `content` value (text hints only — no objects).
 * Non-string entries (a JS caller passing the old object rows) degrade
 * deterministically: they are dropped, never stringified (§85). */
const contentLines = computed<string[]>(() => {
  if (typeof props.content === 'string') return props.content ? [props.content] : [];
  return props.content.filter((line) => typeof line === 'string' && line !== '');
});

const rootClass = computed(() => [
  'sn-tooltip',
  `sn-tooltip--${props.placement}`,
  {
    'sn-tooltip--light': props.theme === 'light',
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
      @tap.stop="onTriggerTap"
    >
      <slot />
      <!-- #ifdef APP -->
      <!-- uni-app x App: a tap on the trigger's slot content (the page's
           compilation unit) never reaches this component's own views — not as
           a native bubble, not as a component emit — so the wrapper's @tap
           alone can never fire there. This App-only transparent catcher is a
           node this component owns that sits on top of the trigger box, so the
           tap lands on it directly (the same component-internal tap path every
           other App-working trigger uses). Web / MP strip it: there the slot
           content taps reach the wrapper by native bubbling, and the catcher
           would only steal the trigger's press feedback. -->
      <view
        class="sn-tooltip__trigger-catcher"
        hover-class="sn-tooltip__trigger-catcher--pressed"
        aria-hidden="true"
        @tap.stop="onTriggerTap"
      />
      <!-- #endif -->
    </view>

    <view v-if="isMounted" :class="popClass" role="tooltip" @tap.stop>
      <view v-if="visibleArrow" :class="arrowClass" aria-hidden="true" />
      <view class="sn-tooltip__body">
        <text v-for="(line, index) in contentLines" :key="index" class="sn-tooltip__line">
          {{ line }}
        </text>
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
  /* The bubble rides OUTSIDE this box (absolute, below the trigger) — an
   * explicit `overflow: visible` is load-bearing: uni-app x views clip
   * children by default, which swallowed the whole bubble on the App / web
   * builds (H5 / MP default to visible, so it only broke there). */
  overflow: visible;
  /* Dark transient plate — the platform-standard toast token pair, so the
   * tooltip reads as a hint, not a card (sn-popover owns cards). Inline
   * `custom-style` beats these defaults. */
  --sn-tooltip-bg: var(--sn-mp-color-background-inverse);
  --sn-tooltip-color: var(--sn-mp-color-text-on-primary);
  /* Fixed plate width (see the header note): deterministic on H5 / MP / App
   * where the old `max-content` + `100vw` sizing broke the bubble. */
  --sn-tooltip-width: 320rpx;
}

.sn-tooltip__trigger {
  position: relative;
  display: block;
}

/* #ifdef APP */
/* App trigger catcher (see the template note): a transparent shield over the
 * trigger box. `position: relative` on the wrapper above is its containing
 * block. The pressed leg restores the touch feedback the covered slot content
 * can no longer receive on App. */
.sn-tooltip__trigger-catcher {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.sn-tooltip__trigger-catcher--pressed {
  background-color: var(--sn-mp-color-background-soft);
}
/* #endif */

/* ── Bubble ────────────────────────────────────────────────────────────── */

.sn-tooltip__pop {
  position: absolute;
  z-index: 500;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--sn-mp-spacing-2);
  box-sizing: border-box;
  width: var(--sn-tooltip-width);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-md);
  /* Same uni-app x default-clip guard as the root: the arrow protrudes
   * -12rpx outside this box. */
  overflow: visible;
  background-color: var(--sn-tooltip-bg);
  color: var(--sn-tooltip-color);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
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
  flex: 1;
  min-width: 0;
  gap: 4rpx;
  /* uni-app x views carry an explicit default font-size / line-height and do
   * NOT inherit the pop's — without these the body text renders at the
   * 16px runtime default and over-wraps inside the fixed plate. */
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-tooltip__line {
  display: block;
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-tooltip__close {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 32rpx;
  height: 32rpx;
  color: var(--sn-tooltip-color);
  opacity: 0.7;
}

/* ── Arrow ─────────────────────────────────────────────────────────────── */
/* Border triangle, NOT a rotated square: the plate fill is translucent
 * (`--sn-mp-color-background-inverse` = rgba(0,0,0,0.75)), so a rotated
 * square sharing the fill double-composites its inner half over the bubble
 * body — a darker diamond showed inside the content area (§103). A triangle
 * paints the fill exactly once, so it can never overlap the text plate.
 * 28rpx base × 14rpx tall: with the 14rpx trigger gap the apex lands exactly
 * on the trigger edge (贴边), and the footprint matches the popover's small
 * reference arrow. */

.sn-tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent;
  pointer-events: none;
}

/* Orientation per placement family: the apex points at the trigger, the
 * colored border is the one on the OUTSIDE edge (the fill paints once).
 * Declared as longhands, not a 4-value `border-width` shorthand — the uni-x
 * App flattener expands border shorthands only into per-side longhands, and
 * a TRBL width shorthand would ride through unexpanded (§85 explicit). */

/* Bubble above → the arrow rides the bubble's bottom edge → apex DOWN →
 * colored TOP border (a colored top border with transparent sides renders
 * base-up / apex-down; the web end maps --top the same way). */
.sn-tooltip--top .sn-tooltip__arrow,
.sn-tooltip--top-start .sn-tooltip__arrow,
.sn-tooltip--top-end .sn-tooltip__arrow {
  border-top-width: 14rpx;
  border-right-width: 14rpx;
  border-bottom-width: 0;
  border-left-width: 14rpx;
  border-top-color: var(--sn-tooltip-bg);
}
/* Bubble below → arrow on the bubble's top edge → apex UP → colored BOTTOM
 * border (base-down / apex-up). */
.sn-tooltip--bottom .sn-tooltip__arrow,
.sn-tooltip--bottom-start .sn-tooltip__arrow,
.sn-tooltip--bottom-end .sn-tooltip__arrow {
  border-top-width: 0;
  border-right-width: 14rpx;
  border-bottom-width: 14rpx;
  border-left-width: 14rpx;
  border-bottom-color: var(--sn-tooltip-bg);
}
/* Bubble left → apex RIGHT → colored left border. */
.sn-tooltip--left .sn-tooltip__arrow,
.sn-tooltip--left-start .sn-tooltip__arrow,
.sn-tooltip--left-end .sn-tooltip__arrow {
  border-top-width: 14rpx;
  border-right-width: 0;
  border-bottom-width: 14rpx;
  border-left-width: 14rpx;
  border-left-color: var(--sn-tooltip-bg);
}
/* Bubble right → apex LEFT → colored right border. */
.sn-tooltip--right .sn-tooltip__arrow,
.sn-tooltip--right-start .sn-tooltip__arrow,
.sn-tooltip--right-end .sn-tooltip__arrow {
  border-top-width: 14rpx;
  border-right-width: 14rpx;
  border-bottom-width: 14rpx;
  border-left-width: 0;
  border-right-color: var(--sn-tooltip-bg);
}

/* ── Placement: top family ─────────────────────────────────────────────── */
/* Centering uses pure `translateX/Y(-50%)` — no `calc()` inside `transform`;
 * `offset-x/y` folds into the margins, which every renderer supports. */

.sn-tooltip--top .sn-tooltip__pop {
  bottom: 100%;
  left: 50%;
  margin-bottom: calc(14rpx + var(--sn-tooltip-offset-y));
  margin-left: var(--sn-tooltip-offset-x);
  transform: translateX(-50%);
}
.sn-tooltip--top-start .sn-tooltip__pop {
  bottom: 100%;
  left: 0;
  margin-bottom: calc(14rpx + var(--sn-tooltip-offset-y));
  margin-left: var(--sn-tooltip-offset-x);
}
.sn-tooltip--top-end .sn-tooltip__pop {
  right: 0;
  bottom: 100%;
  margin-right: var(--sn-tooltip-offset-x);
  margin-bottom: calc(14rpx + var(--sn-tooltip-offset-y));
}

/* ── Placement: bottom family ──────────────────────────────────────────── */

.sn-tooltip--bottom .sn-tooltip__pop {
  top: 100%;
  left: 50%;
  margin-top: calc(14rpx + var(--sn-tooltip-offset-y));
  margin-left: var(--sn-tooltip-offset-x);
  transform: translateX(-50%);
}
.sn-tooltip--bottom-start .sn-tooltip__pop {
  top: 100%;
  left: 0;
  margin-top: calc(14rpx + var(--sn-tooltip-offset-y));
  margin-left: var(--sn-tooltip-offset-x);
}
.sn-tooltip--bottom-end .sn-tooltip__pop {
  top: 100%;
  right: 0;
  margin-top: calc(14rpx + var(--sn-tooltip-offset-y));
  margin-right: var(--sn-tooltip-offset-x);
}

/* ── Placement: left family ────────────────────────────────────────────── */

.sn-tooltip--left .sn-tooltip__pop {
  top: 50%;
  right: 100%;
  margin-right: calc(14rpx + var(--sn-tooltip-offset-x));
  margin-top: var(--sn-tooltip-offset-y);
  transform: translateY(-50%);
}
.sn-tooltip--left-start .sn-tooltip__pop {
  top: 0;
  right: 100%;
  margin-right: calc(14rpx + var(--sn-tooltip-offset-x));
  margin-top: var(--sn-tooltip-offset-y);
}
.sn-tooltip--left-end .sn-tooltip__pop {
  right: 100%;
  bottom: 0;
  margin-right: calc(14rpx + var(--sn-tooltip-offset-x));
  margin-bottom: var(--sn-tooltip-offset-y);
}

/* ── Placement: right family ───────────────────────────────────────────── */

.sn-tooltip--right .sn-tooltip__pop {
  top: 50%;
  left: 100%;
  margin-left: calc(14rpx + var(--sn-tooltip-offset-x));
  margin-top: var(--sn-tooltip-offset-y);
  transform: translateY(-50%);
}
.sn-tooltip--right-start .sn-tooltip__pop {
  top: 0;
  left: 100%;
  margin-left: calc(14rpx + var(--sn-tooltip-offset-x));
  margin-top: var(--sn-tooltip-offset-y);
}
.sn-tooltip--right-end .sn-tooltip__pop {
  bottom: 0;
  left: 100%;
  margin-left: calc(14rpx + var(--sn-tooltip-offset-x));
  margin-bottom: var(--sn-tooltip-offset-y);
}

/* ── Arrow geometry per placement ──────────────────────────────────────── */
/* The whole triangle rides OUTSIDE the bubble edge (`-12rpx` = its full
 * height) and the placement gap is also 12rpx, so the apex lands exactly ON
 * the trigger edge (贴边) without poking into it. start/end offsets aim the
 * apex 16rpx from the edge. */

.sn-tooltip--top .sn-tooltip__arrow,
.sn-tooltip--top-start .sn-tooltip__arrow,
.sn-tooltip--top-end .sn-tooltip__arrow {
  bottom: -14rpx;
}
.sn-tooltip--top .sn-tooltip__arrow {
  left: calc(50% - 14rpx);
}
.sn-tooltip--top-start .sn-tooltip__arrow {
  left: 16rpx;
}
.sn-tooltip--top-end .sn-tooltip__arrow {
  right: 16rpx;
}

.sn-tooltip--bottom .sn-tooltip__arrow,
.sn-tooltip--bottom-start .sn-tooltip__arrow,
.sn-tooltip--bottom-end .sn-tooltip__arrow {
  top: -14rpx;
}
.sn-tooltip--bottom .sn-tooltip__arrow {
  left: calc(50% - 14rpx);
}
.sn-tooltip--bottom-start .sn-tooltip__arrow {
  left: 16rpx;
}
.sn-tooltip--bottom-end .sn-tooltip__arrow {
  right: 16rpx;
}

.sn-tooltip--left .sn-tooltip__arrow,
.sn-tooltip--left-start .sn-tooltip__arrow,
.sn-tooltip--left-end .sn-tooltip__arrow {
  right: -14rpx;
}
.sn-tooltip--left .sn-tooltip__arrow {
  top: calc(50% - 14rpx);
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
  left: -14rpx;
}
.sn-tooltip--right .sn-tooltip__arrow {
  top: calc(50% - 14rpx);
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

/* Light theme (`theme="light"`) — white surface plate with dark text (the
 * Element-style light tooltip; 图2 reference). The vars live on the root so
 * the plate AND the arrow re-skin from one override, and the white plate
 * carries the shadow the dark plate never needed (dark reads on any
 * surface; white on white needs the lift). */
.sn-tooltip--light {
  --sn-tooltip-bg: var(--sn-mp-color-background-surface);
  --sn-tooltip-color: var(--sn-mp-color-text-primary);
}
.sn-tooltip--light .sn-tooltip__pop {
  box-shadow: var(--sn-mp-shadow-md);
}

/* Doodle skin — hand-drawn bubble outline. */
.snui-skin-doodle .sn-tooltip__pop {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
