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
 * ## Click-outside close (AUI-OPT-07 — mask-free, tooltip parity)
 *
 * uni-app components cannot listen to taps outside their own subtree, so the
 * close rides the shared outside-close queue: while mounted (and
 * `closeOnClickOutside` is on, the default) the bubble registers an
 * idempotent close in `utils/outside-close.ts`, and the page root dispatches
 * it —
 *
 *     const { closeOutside } = useQueue();
 *     <view @tap="closeOutside"> … page … </view>
 *
 * A tap outside the bubble then closes it AND still reaches whatever button
 * sits under it — no full-viewport mask swallowed the gesture, so switching
 * to a sibling trigger (or any other control) is one tap, not two. The
 * trigger and the bubble bind `@tap.stop` so taps on them never reach the
 * dispatcher. Pages that never bind the handler simply never outside-close;
 * `closeOnClickOutside: false` unregisters the close while mounted.
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
 * ## Auto height (AUI-OPT-07)
 *
 * The bubble sizes to its content and never clips it: the pop is `height: auto`
 * with no cap, menu labels wrap instead of forcing one line, and no glyph lives
 * in a fixed square whose geometry disagrees with the icon's own scale — the
 * row glyph and the close glyph are sized by `--sn-mp-icon-size-*` tokens, so a
 * larger icon or a long label grows the bubble instead of overflowing it.
 *
 * ## Menu row icons (additive, AUI-OPT-07, AGENTS.md §112.3a)
 *
 * A `menu` row resolves its glyph from four sources, highest precedence first:
 *
 *   - `iconData`  — an inline `IconData` object; no registration step needed
 *   - `iconUrl`   — an image address, rendered as `<image>`
 *   - `icon`      — a name resolved by SnIcon (registry → built-in catalogue →
 *                   `prefix:rest` provider)
 *   - `iconClass` — wd-parity legacy field: a name, or an image address when
 *                   the value looks like one (`http` / `data` / `//` / `/`)
 *
 * The glyph scale is `--sn-popover-menu-icon-size` (wd
 * `--wot-popover-menu-icon-size` parity), defaulting to the `medium` icon tier;
 * the close glyph follows `--sn-popover-close-icon-size`, defaulting to
 * `small`. Both are published on the bubble, overridable via `custom-style`.
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
import type { IconData } from '../sn-icon/sn-icon.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';
import {
  closeOutside,
  registerOutsideClosable,
  unregisterOutsideClosable,
} from '../../utils/outside-close';

defineOptions({ name: 'SnPopover' });

const instanceId = getCurrentInstance()?.uid ?? 0;

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
  /**
   * Row glyph as inline SVG data (additive, AUI-OPT-07). Highest precedence —
   * pass a built-in set object and no registration step is needed.
   */
  iconData?: IconData;
  /**
   * Row glyph as an image address (additive, AUI-OPT-07), rendered as
   * `<image>`. Beats `icon` / `iconClass`, loses to `iconData`.
   */
  iconUrl?: string;
  /**
   * Row glyph as a name (additive, AUI-OPT-07), resolved through SnIcon:
   * registry (`registerSnIcons`) → built-in catalogue → `prefix:rest`
   * provider. Beats `iconClass`, loses to the two sources above.
   */
  icon?: string;
  /**
   * wd-parity legacy glyph field: an SnIcon registry name, or an image address
   * when the value looks like one (`http` / `data` / `//` / `/` / `./`).
   * Lowest precedence of the four glyph sources.
   */
  iconClass?: string;
  /** Disable the row — taps are ignored. */
  disabled?: boolean;
}

/** Fade-out leg length in ms (the leave leg keeps the node mounted). */
const ANIMATION_DURATION = 150;

/**
 * Menu / close glyph scale. Published as component variables on the bubble so
 * a consumer can resize every glyph through `custom-style` (wd
 * `--wot-popover-menu-icon-size` / `--wot-popover-close-icon-size` parity).
 */
const MENU_ICON_SIZE = 'var(--sn-popover-menu-icon-size)';
const CLOSE_ICON_SIZE = 'var(--sn-popover-close-icon-size)';

const props = withDefaults(
  defineProps<{
    /** Whether the bubble is shown (v-model). */
    modelValue?: boolean;
    /**
     * How the trigger reacts. `slot` (default) binds the tap on the trigger
     * wrapper itself — on uni-app x App an App-only catcher node (see the
     * template note) receives the tap because slot-content taps never reach
     * this component's own views there. `manual` leaves toggling to the page
     * via v-model: use it when the tap target lives outside the default slot
     * (a remote button, imperative open/close), not as an App workaround —
     * event listeners the page binds on components inside the slot never fire
     * on App either, so a manual-mode slotted trigger is inert there too.
     */
    trigger?: 'slot' | 'manual';
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
    /**
     * Close the bubble when the user taps outside it (additive, AUI-OPT-07).
     * The close rides the page-root `closeOutside` channel and never swallows
     * the tap — the same gesture still lands on whatever button sits under
     * it. Pass `false` to unregister the outside-close while mounted.
     */
    closeOnClickOutside?: boolean;
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
    trigger: 'slot',
    content: '',
    mode: 'normal',
    placement: 'bottom',
    offset: 0,
    visibleArrow: true,
    disabled: false,
    showClose: false,
    closeOnClickOutside: true,
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

/** Hide the bubble and notify the consumer. Idempotent (outside-close contract). */
function close(): void {
  // Idempotent: a second close gesture (the mask plus the page-root queue, a
  // close button while the fade-out leg runs) must not replay the event pair.
  // A bubble that is neither shown nor mounted is already fully closed.
  const wasUp = props.modelValue || isShown.value || isMounted.value;
  emit('update:modelValue', false);
  if (wasUp) leave();
}

/** Compatibility no-op — see the header note (CSS-driven placement). */
function updatePosition(): void {
  // Intentionally empty: nothing is measured, so there is nothing to refresh.
}

defineExpose({ open, close, updatePosition });

// Outside-close registration (tooltip parity — the transparent mask is gone):
// while `closeOnClickOutside` is on, the mounted bubble registers an
// idempotent close in the queue; a page-root `@tap="closeOutside"` closes it
// WITHOUT swallowing the tap, so the very same gesture still reaches whatever
// button sits under it. `false` unregisters, keeping the bubble open until
// its own trigger or close button handles it.
let outsideRegistered = false;

function syncOutsideRegistration(): void {
  if (props.closeOnClickOutside && !outsideRegistered) {
    outsideRegistered = true;
    registerOutsideClosable(instanceId, () => {
      // Idempotent: an already-closed bubble must not emit another close.
      if (isShown.value || isMounted.value) close();
    });
  } else if (!props.closeOnClickOutside && outsideRegistered) {
    outsideRegistered = false;
    unregisterOutsideClosable(instanceId);
  }
}

onMounted(syncOutsideRegistration);
watch(() => props.closeOnClickOutside, syncOutsideRegistration);
onBeforeUnmount(() => {
  if (outsideRegistered) unregisterOutsideClosable(instanceId);
});

function onTriggerTap(): void {
  if (props.trigger === 'manual') return;
  if (props.disabled) return;
  // Toggle on the actual shown state, not `props.modelValue`: an uncontrolled
  // bubble (consumer ignoring the v-model event) must still close on the
  // second trigger tap.
  if (isShown.value) {
    close();
    return;
  }
  // One-gesture switching: the trigger stops propagation (it must not close
  // its own bubble through the page root), so it dispatches the outside-close
  // itself before opening — every other overlay on the page folds in the same
  // tap that opens this one.
  closeOutside();
  open();
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

/** Looks like an image source rather than an icon name. */
function isImageSource(value: string): boolean {
  return /^(https?:|data:|\/\/|\/|\.{1,2}\/)/.test(value);
}

/** Which glyph source a `menu` row uses (precedence: see the header). */
function rowIconSource(item: SnPopoverMenuItem): 'data' | 'url' | 'name' | 'none' {
  if (item.iconData !== undefined) return 'data';
  if (item.iconUrl !== undefined && item.iconUrl !== '') return 'url';
  if (item.icon !== undefined && item.icon !== '') return 'name';
  const legacy = item.iconClass;
  if (legacy === undefined || legacy === '') return 'none';
  return isImageSource(legacy) ? 'url' : 'name';
}

/** Image address of a `url` row — `iconUrl`, or the URL-shaped legacy field. */
function rowIconUrl(item: SnPopoverMenuItem): string {
  if (item.iconUrl !== undefined && item.iconUrl !== '') return item.iconUrl;
  return item.iconClass ?? '';
}

/** Glyph name of a `name` row — `icon`, or the legacy field's name form. */
function rowIconName(item: SnPopoverMenuItem): string {
  return item.icon !== undefined && item.icon !== '' ? item.icon : (item.iconClass ?? '');
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
        class="sn-popover__trigger-catcher"
        hover-class="sn-popover__trigger-catcher--pressed"
        aria-hidden="true"
        @tap.stop="onTriggerTap"
      />
      <!-- #endif -->
    </view>

    <view v-if="isMounted" :class="popClass" role="dialog" @tap.stop>
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
            <!-- Row glyph precedence: inline data > image address > name. -->
            <SnIcon
              v-if="rowIconSource(item) === 'data'"
              class="sn-popover__menu-icon"
              :icon="item.iconData"
              :size="MENU_ICON_SIZE"
            />
            <image
              v-else-if="rowIconSource(item) === 'url'"
              class="sn-popover__menu-icon"
              :src="rowIconUrl(item)"
              mode="aspectFit"
              aria-hidden="true"
            />
            <SnIcon
              v-else-if="rowIconSource(item) === 'name'"
              class="sn-popover__menu-icon"
              :icon="rowIconName(item)"
              :size="MENU_ICON_SIZE"
            />
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
        <SnIcon :icon="XIcon" :size="CLOSE_ICON_SIZE" />
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
  --sn-popover-border: var(--sn-mp-color-border-subtle);
  --sn-popover-color: var(--sn-mp-color-text-primary);
  /* Glyph scale (see header): tier tokens, overridable via `custom-style`. */
  --sn-popover-menu-icon-size: var(--sn-mp-icon-size-medium);
  --sn-popover-close-icon-size: var(--sn-mp-icon-size-small);
}

.sn-popover__trigger {
  position: relative;
  display: block;
}

/* #ifdef APP */
/* App trigger catcher (see the template note): a transparent shield over the
 * trigger box. `position: relative` on the wrapper above is its containing
 * block. The pressed leg restores the touch feedback the covered slot content
 * can no longer receive on App. */
.sn-popover__trigger-catcher {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.sn-popover__trigger-catcher--pressed {
  background-color: var(--sn-mp-color-background-soft);
}
/* #endif */

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
  /* Auto height (AUI-OPT-07): the bubble grows with its content and never
   * clips it — labels wrap and glyph boxes follow their tokens (no fixed
   * square disagrees with the icon scale). */
  height: auto;
  min-width: 160rpx;
  /* Never wider than the viewport: the bubble is centered on the trigger,
   * so an unclamped width overflows the screen near either edge. */
  max-width: min(480rpx, calc(100vw - 32rpx));
  box-sizing: border-box;
  border: 2rpx solid var(--sn-popover-border);
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
  flex: 0 0 auto;
  width: var(--sn-popover-close-icon-size);
  height: var(--sn-popover-close-icon-size);
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

/* Glyph boxes follow `--sn-popover-menu-icon-size` instead of a fixed square,
 * so a bigger glyph or a longer label grows the bubble instead of overflowing
 * it (auto height, AUI-OPT-07). */
.sn-popover__menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--sn-popover-menu-icon-size);
  height: var(--sn-popover-menu-icon-size);
  color: var(--sn-mp-color-text-secondary);
}

.sn-popover__menu-text {
  display: block;
  /* Long labels wrap inside the bubble's max-width instead of forcing one
   * line and spilling out of the pop: flex + min-width let the text shrink
   * below its max-content width. */
  flex: 1;
  min-width: 0;
}

/* ── Arrow ─────────────────────────────────────────────────────────────── */

.sn-popover__arrow {
  position: absolute;
  width: 16rpx;
  height: 16rpx;
  background-color: var(--sn-popover-bg);
  /* Outline the diamond so the outside half reads against the page — a bare
   * white diamond vanishes on an elevated (white) host surface, and the half
   * inside the pop merges with the bubble fill either way. The border shares
   * the pop's border token, so the arrow line continues the bubble edge. */
  border: 2rpx solid var(--sn-popover-border);
  border-bottom-color: transparent;
  border-right-color: transparent;
  transform: rotate(45deg);
  pointer-events: none;
}

/* ── Placement: top family ─────────────────────────────────────────────── */

.sn-popover--top .sn-popover__pop {
  bottom: 100%;
  left: 50%;
  margin-bottom: calc(12rpx + var(--sn-popover-offset-y));
  /* True center: the pop center is pinned to the root center at any width
   * (stretch + auto margins collapse to 0 once max-content outgrows the
   * trigger, walking the pop — and the arrow's 50% — off the trigger).
   * max-content is bounded by the viewport clamp, so a centered pop never
   * crosses the screen edge by itself; offset-x rides the same transform. */
  transform: translate(calc(-50% + var(--sn-popover-offset-x)), var(--sn-popover-offset-y));
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
  transform: translate(calc(-50% + var(--sn-popover-offset-x)), var(--sn-popover-offset-y));
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
  /* Points up: the outside half is the bottom-right of the rotated square. */
  border-top-color: transparent;
  border-left-color: transparent;
  border-bottom-color: var(--sn-popover-border);
  border-right-color: var(--sn-popover-border);
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
  /* Points down: the outside half is the top-left of the rotated square. */
  border-top-color: var(--sn-popover-border);
  border-left-color: var(--sn-popover-border);
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
  /* Points left: the outside half is the right edge of the rotated square. */
  border-top-color: var(--sn-popover-border);
  border-left-color: transparent;
  border-right-color: var(--sn-popover-border);
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
  /* Points right: the outside half is the left edge of the rotated square. */
  border-top-color: var(--sn-popover-border);
  border-right-color: transparent;
  border-left-color: var(--sn-popover-border);
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
