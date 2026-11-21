<script setup lang="ts">
/**
 * sn-popover (uni-end) — tap-triggered rich bubble with anchor / sheet forms.
 *
 * Reference library: wot-ui `wd-popover`
 *   (https://wot-ui.cn/component/popover.html)
 * Per AGENTS.md §112, the wd-parity prop surface below mirrors wd-popover 1:1.
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
 * ## Rich card body (additive, reference-design refactor)
 *
 * `normal` mode renders a card, not a bare text bubble: a header row (glyph in
 * a tinted circle + bold `title` + muted `subtitle`), the `content` text, a
 * `footer` slot, and full-width pill `actions`. All parts are optional — a
 * popover with only `content` stays the plain bubble it always was. The glyph
 * resolves from three sources, highest precedence first: `iconData` (inline
 * IconData, no registration step) → `iconUrl` (image) → `icon` (SnIcon
 * registry name). `menu` rows gain the same shape: `content` is the row title
 * and the additive `description` field renders a muted second line.
 *
 * ## Sheet presentation (additive)
 *
 * `presentation="sheet"` swaps the anchored bubble for a fixed bottom sheet
 * (mask + handle + centred title / subtitle + body + action pills). The sheet
 * ignores `placement` / `visibleArrow` / `offset` — there is no anchor to
 * point at. `cancelText` (non-empty) appends the reference Cancel pill and its
 * tap emits `cancel` + closes. A sheet has its own mask, so its outside-close
 * is the mask tap itself; the page-root `closeOutside` channel still closes it.
 *
 * ## Click-outside close (AUI-OPT-07 — mask-free anchor mode)
 *
 * uni-app components cannot listen to taps outside their own subtree, so the
 * anchor-mode close rides the shared outside-close queue: while mounted (and
 * `closeOnClickOutside` is on, the default) the bubble registers an idempotent
 * close in `utils/outside-close.ts`, and the page root dispatches it —
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
 * trigger re-tap, the bubble's own close button, and the sheet mask.
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
 * ## Cross-platform bubble geometry (H5 / mp-weixin / uni-app x App)
 *
 * The bubble is a FIXED-width card — `--sn-popover-width` (normal, default
 * 480rpx) / `--sn-popover-menu-width` (menu, default 320rpx) — overridable via
 * `custom-style`. The previous `width: max-content` +
 * `max-width: min(480rpx, calc(100vw - 32rpx))` pair silently broke on
 * renderers that drop unsupported declarations (uni-app x App has no
 * `max-content`, `min()` or `vw`): the bubble lost its sizing and could render
 * collapsed / invisible. Fixed width is deterministic on all three platforms;
 * the cost is no automatic edge clamping, so near the screen edge an
 * `-start` / `-end` alignment is the consumer's tool. Centering uses pure
 * `translateX/Y(-50%)` (no `calc()` inside `transform`) with the offset folded
 * into margins, which every renderer supports.
 *
 * ## Timers (AGENTS.md §41)
 *
 * One transition timer keeps the bubble mounted for the fade-out leg. It is
 * cleared on every leg change and in `onBeforeUnmount`; no global listener is
 * registered (miniprogram has no `document`).
 *
 * Usage:
 *   <sn-popover v-model="open" title="Quick Tip" icon="location" content="…">
 *     <sn-button>提示</sn-button>
 *   </sn-popover>
 *
 * Not responsible for:
 *   - 纯文字提示 — 用 sn-tooltip
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
 * Where the popover appears (additive). `anchor` (default) pins the bubble to
 * the trigger; `sheet` presents it as a fixed bottom sheet.
 */
type PopoverPresentation = 'anchor' | 'sheet';

/**
 * Gap between trigger and bubble. `number` applies to both axes, `[x, y]`
 * sets them individually, `{ x, y }` sets either one.
 */
type PopoverOffset = number | number[] | { x?: number; y?: number };

/** One row of the `menu` mode list. */
export interface SnPopoverMenuItem {
  /** Row title. */
  content?: string;
  /** Muted second line under the title (additive). */
  description?: string;
  /**
   * Row glyph plate fill — any CSS color or var() (additive). When set (or
   * `iconColor` is), the row renders a tinted circle behind the glyph instead
   * of the bare glyph / neutral plate. Per-row colored plates, reference-style.
   */
  iconBg?: string;
  /**
   * Row glyph color — any CSS color or var() (additive). Beats the plate's
   * `--sn-popover-icon-color` default.
   */
  iconColor?: string;
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
   * wd-parity legacy glyph field: a name, or an image address when the value
   * looks like one (`http` / `data` / `//` / `/` / `./`).
   * Lowest precedence of the four glyph sources.
   */
  iconClass?: string;
  /** Disable the row — taps are ignored. */
  disabled?: boolean;
}

/** One pill button under the bubble body (additive). */
export interface SnPopoverAction {
  /** Button label. */
  label: string;
  /**
   * `primary` renders the filled action button (action-primary fill +
   * on-primary label — the sn-button primary look); `danger` renders the
   * label in the danger feedback color; `default` keeps the soft plate.
   */
  type?: 'default' | 'primary' | 'danger';
  /** Disable the button — taps are ignored. */
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
/** Header glyph scale — one tier above the menu rows. */
const HEAD_ICON_SIZE = 'var(--sn-popover-icon-size)';

const props = withDefaults(
  defineProps<{
    /** Whether the bubble is shown (v-model). */
    modelValue?: boolean;
    /**
     * How the trigger reacts. `slot` (default) binds the tap on the trigger
     * wrapper itself — on uni-app x App an App-only catcher node (see the
     * template note) receives it because slot-content taps never reach this
     * component's own views there. `manual` leaves toggling to the page via
     * v-model.
     */
    trigger?: 'slot' | 'manual';
    /**
     * Where the popover appears (additive): `anchor` (default) pins the bubble
     * to the trigger; `sheet` presents it as a fixed bottom sheet.
     */
    presentation?: PopoverPresentation;
    /** Bubble body: a string in `normal` mode, a list in `menu` mode. */
    content?: string | SnPopoverMenuItem[];
    /** Bubble display mode. */
    mode?: PopoverMode;
    /** Bold card title (additive). */
    title?: string;
    /** Muted line under the title — a timestamp, or the sheet description (additive). */
    subtitle?: string;
    /** Header glyph as inline SVG data (additive). Beats `iconUrl` / `icon`. */
    iconData?: IconData;
    /** Header glyph as an image address (additive). Beats `icon`, loses to `iconData`. */
    iconUrl?: string;
    /** Header glyph as an SnIcon registry name (additive). */
    icon?: string;
    /** Bubble anchor (anchor presentation). */
    placement?: PopoverPlacement;
    /** Gap between trigger and bubble, in design px. */
    offset?: PopoverOffset;
    /** Render the arrow pointing at the trigger (anchor presentation). */
    visibleArrow?: boolean;
    /** Disables the trigger — taps are ignored and the bubble stays closed. */
    disabled?: boolean;
    /** Render a close button in the card header. */
    showClose?: boolean;
    /** Full-width pill buttons under the bubble body (additive). */
    actions?: SnPopoverAction[];
    /** Close the bubble after an action / menu row tap (additive). */
    closeOnAction?: boolean;
    /** Sheet Cancel pill label — empty hides the pill (additive, sn-action-sheet parity). */
    cancelText?: string;
    /**
     * Close the bubble when the user taps outside it (additive, AUI-OPT-07).
     * The close rides the page-root `closeOutside` channel and never swallows
     * the tap. Pass `false` to unregister the outside-close while mounted.
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
    presentation: 'anchor',
    content: '',
    mode: 'normal',
    title: '',
    subtitle: '',
    iconUrl: '',
    icon: '',
    placement: 'bottom',
    offset: 0,
    visibleArrow: true,
    disabled: false,
    showClose: false,
    actions: () => [],
    closeOnAction: true,
    cancelText: '',
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
  /** Custom bubble body; replaces `content` in both modes. */
  content?(): unknown;
  /** Card footer strip under the body (additive) — a tag row, a meta line. */
  footer?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'open'): void;
  (e: 'close'): void;
  (e: 'change', payload: { show: boolean }): void;
  (e: 'menuclick', payload: { item: SnPopoverMenuItem; index: number }): void;
  (e: 'actionclick', payload: { item: SnPopoverAction; index: number }): void;
  (e: 'cancel'): void;
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

/** Looks like an image source rather than an icon name. */
function isImageSource(value: string): boolean {
  return /^(https?:|data:|\/\/|\/|\.{1,2}\/)/.test(value);
}

/** Which glyph source a slot uses (precedence: iconData > iconUrl > icon > iconClass). */
function iconSourceOf(item: {
  iconData?: IconData | undefined;
  iconUrl?: string | undefined;
  icon?: string | undefined;
  iconClass?: string | undefined;
}): 'data' | 'url' | 'name' | 'none' {
  if (item.iconData !== undefined) return 'data';
  if (item.iconUrl !== undefined && item.iconUrl !== '') return 'url';
  if (item.icon !== undefined && item.icon !== '') return 'name';
  const legacy = item.iconClass;
  if (legacy === undefined || legacy === '') return 'none';
  return isImageSource(legacy) ? 'url' : 'name';
}

/** Image address of a `url` slot — `iconUrl`, or the URL-shaped legacy field. */
function iconUrlOf(item: { iconUrl?: string | undefined; iconClass?: string | undefined }): string {
  if (item.iconUrl !== undefined && item.iconUrl !== '') return item.iconUrl;
  return item.iconClass ?? '';
}

/** Glyph name of a `name` slot — `icon`, or the legacy field's name form. */
function iconNameOf(item: { icon?: string | undefined; iconClass?: string | undefined }): string {
  return item.icon !== undefined && item.icon !== '' ? item.icon : (item.iconClass ?? '');
}

/** Whether a menu row carries a per-row glyph tint (colored plate, reference-style). */
function rowHasTint(item: SnPopoverMenuItem): boolean {
  return (
    (item.iconBg !== undefined && item.iconBg !== '') ||
    (item.iconColor !== undefined && item.iconColor !== '')
  );
}

/** Inline plate style from the row's tint fields — only provided fields land. */
function rowPlateStyle(item: SnPopoverMenuItem): string {
  const parts: string[] = [];
  if (item.iconBg !== undefined && item.iconBg !== '') {
    parts.push(`background-color: ${item.iconBg}`);
  }
  if (item.iconColor !== undefined && item.iconColor !== '') {
    parts.push(`color: ${item.iconColor}`);
  }
  return parts.join('; ');
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

/** Header glyph source — same precedence chain as the menu rows. */
const headIconSource = computed(() => iconSourceOf(props));

/** Whether the card header row (glyph / title / subtitle / close) renders. */
const hasHead = computed(
  () =>
    headIconSource.value !== 'none' ||
    props.title !== '' ||
    props.subtitle !== '' ||
    props.showClose,
);

const isSheet = computed(() => props.presentation === 'sheet');

/** Sheet Cancel pill — non-empty label shows it (sn-action-sheet parity). */
const showsCancel = computed(() => props.cancelText !== '');

const rootClass = computed(() => [
  'sn-popover',
  `sn-popover--${props.placement}`,
  `sn-popover--${props.mode}`,
  `sn-popover--${props.presentation}`,
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

const sheetPanelClass = computed(() => [
  'sn-popover__sheet-panel',
  { 'sn-popover__sheet-panel--shown': isShown.value },
]);

const sheetMaskClass = computed(() => [
  'sn-popover__sheet-mask',
  { 'sn-popover__sheet-mask--shown': isShown.value },
]);

function onMenuTap(item: SnPopoverMenuItem, index: number): void {
  if (item.disabled) return;
  emit('menuclick', { item, index });
  if (props.closeOnAction) close();
}

function onActionTap(action: SnPopoverAction, index: number): void {
  if (action.disabled) return;
  emit('actionclick', { item: action, index });
  if (props.closeOnAction) close();
}

function onCancelTap(): void {
  emit('cancel');
  close();
}
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

    <!-- ── Anchor bubble ─────────────────────────────────────────────────── -->
    <view v-if="isMounted && !isSheet" :class="popClass" role="dialog" @tap.stop>
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
            <!-- Row glyph precedence: inline data > image address > name.
                 A tinted row (iconBg / iconColor) renders the glyph in a
                 colored circle; untinted anchor rows keep the bare glyph. -->
            <view
              v-if="iconSourceOf(item) !== 'none'"
              :class="rowHasTint(item) ? 'sn-popover__icon-plate' : 'sn-popover__menu-icon'"
              :style="rowPlateStyle(item)"
            >
              <SnIcon
                v-if="iconSourceOf(item) === 'data'"
                :icon="item.iconData"
                :size="MENU_ICON_SIZE"
              />
              <image
                v-else-if="iconSourceOf(item) === 'url'"
                class="sn-popover__icon-image"
                :src="iconUrlOf(item)"
                mode="aspectFit"
                aria-hidden="true"
              />
              <SnIcon v-else :icon="iconNameOf(item)" :size="MENU_ICON_SIZE" />
            </view>
            <view class="sn-popover__menu-main">
              <text class="sn-popover__menu-text">{{ item.content }}</text>
              <text v-if="item.description" class="sn-popover__menu-desc">
                {{ item.description }}
              </text>
            </view>
          </view>
        </slot>
      </view>

      <view v-else class="sn-popover__body">
        <slot name="content">
          <!-- Card header: glyph circle + title / subtitle + close. -->
          <view v-if="hasHead" class="sn-popover__head">
            <view v-if="headIconSource !== 'none'" class="sn-popover__icon-plate" aria-hidden="true">
              <SnIcon
                v-if="headIconSource === 'data'"
                :icon="props.iconData"
                :size="HEAD_ICON_SIZE"
              />
              <image
                v-else-if="headIconSource === 'url'"
                class="sn-popover__icon-image"
                :src="props.iconUrl"
                mode="aspectFit"
              />
              <SnIcon v-else :icon="props.icon" :size="HEAD_ICON_SIZE" />
            </view>
            <view class="sn-popover__head-main">
              <text v-if="props.title" class="sn-popover__title">{{ props.title }}</text>
              <text v-if="props.subtitle" class="sn-popover__subtitle">{{ props.subtitle }}</text>
            </view>
            <view
              v-if="props.showClose"
              class="sn-popover__close"
              role="button"
              aria-label="close"
              @tap="close"
            >
              <SnIcon :icon="XIcon" :size="CLOSE_ICON_SIZE" />
            </view>
          </view>
          <text v-if="normalText" class="sn-popover__text">{{ normalText }}</text>
        </slot>
        <slot name="footer" />
      </view>

      <view v-if="props.actions.length > 0" class="sn-popover__actions">
        <view
          v-for="(action, index) in props.actions"
          :key="index"
          class="sn-popover__action"
          :class="{
            'sn-popover__action--primary': action.type === 'primary',
            'sn-popover__action--danger': action.type === 'danger',
            'sn-popover__action--disabled': action.disabled,
          }"
          role="button"
          :aria-label="action.label"
          :aria-disabled="action.disabled ? 'true' : 'false'"
          @tap="onActionTap(action, index)"
        >
          <text class="sn-popover__action-text">{{ action.label }}</text>
        </view>
      </view>
    </view>

    <!-- ── Sheet presentation ────────────────────────────────────────────── -->
    <view v-if="isMounted && isSheet" class="sn-popover__sheet" role="dialog">
      <view :class="sheetMaskClass" @tap="close" />
      <view :class="sheetPanelClass" @tap.stop>
        <view class="sn-popover__sheet-handle" aria-hidden="true" />
        <view v-if="props.title || props.subtitle" class="sn-popover__sheet-head">
          <text v-if="props.title" class="sn-popover__sheet-title">{{ props.title }}</text>
          <text v-if="props.subtitle" class="sn-popover__sheet-subtitle">
            {{ props.subtitle }}
          </text>
        </view>

        <view v-if="mode === 'menu'" class="sn-popover__menu sn-popover__menu--sheet">
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
              <view
                v-if="iconSourceOf(item) !== 'none'"
                class="sn-popover__icon-plate"
                :style="rowPlateStyle(item)"
              >
                <SnIcon
                  v-if="iconSourceOf(item) === 'data'"
                  :icon="item.iconData"
                  :size="MENU_ICON_SIZE"
                />
                <image
                  v-else-if="iconSourceOf(item) === 'url'"
                  class="sn-popover__icon-image"
                  :src="iconUrlOf(item)"
                  mode="aspectFit"
                />
                <SnIcon v-else :icon="iconNameOf(item)" :size="MENU_ICON_SIZE" />
              </view>
              <view class="sn-popover__menu-main">
                <text class="sn-popover__menu-text">{{ item.content }}</text>
                <text v-if="item.description" class="sn-popover__menu-desc">
                  {{ item.description }}
                </text>
              </view>
            </view>
          </slot>
        </view>

        <view v-else class="sn-popover__sheet-body">
          <slot name="content">
            <text v-if="normalText" class="sn-popover__text">{{ normalText }}</text>
          </slot>
        </view>
        <slot name="footer" />

        <view v-if="props.actions.length > 0 || showsCancel" class="sn-popover__sheet-actions">
          <view
            v-for="(action, index) in props.actions"
            :key="index"
            class="sn-popover__action"
            :class="{
              'sn-popover__action--danger': action.type === 'danger',
              'sn-popover__action--disabled': action.disabled,
            }"
            role="button"
            :aria-label="action.label"
            :aria-disabled="action.disabled ? 'true' : 'false'"
            @tap="onActionTap(action, index)"
          >
            <text class="sn-popover__action-text">{{ action.label }}</text>
          </view>
          <view
            v-if="showsCancel"
            class="sn-popover__cancel"
            role="button"
            :aria-label="props.cancelText"
            @tap="onCancelTap"
          >
            <text class="sn-popover__cancel-text">{{ props.cancelText }}</text>
          </view>
        </view>
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
  /* The bubble rides OUTSIDE this box (absolute, anchored to the trigger) —
   * explicit `overflow: visible` is load-bearing: uni-app x views clip
   * children by default, which swallowed the whole bubble on the App / web
   * builds (H5 / MP default to visible). Same guard as sn-tooltip. */
  overflow: visible;
  /* Bubble palette (wot-ui parity). Inline `custom-style` beats these defaults. */
  --sn-popover-bg: var(--sn-mp-color-background-elevated);
  --sn-popover-border: var(--sn-mp-color-border-subtle);
  --sn-popover-color: var(--sn-mp-color-text-primary);
  /* Fixed bubble widths — the cross-platform replacement for `max-content` +
   * `min(…, 100vw)` sizing, which uni-app x App drops (unsupported), leaving
   * the bubble collapsed / invisible. Overridable via `custom-style`. */
  --sn-popover-width: 480rpx;
  --sn-popover-menu-width: 320rpx;
  /* Header glyph plate + scale. */
  --sn-popover-icon-size: var(--sn-mp-icon-size-medium);
  --sn-popover-icon-plate-size: 72rpx;
  --sn-popover-icon-bg: var(--sn-mp-color-background-sunken);
  --sn-popover-icon-color: var(--sn-mp-color-text-secondary);
  /* Glyph scale (wd parity), overridable via `custom-style`. */
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

/* ── Anchor bubble ─────────────────────────────────────────────────────── */

.sn-popover__pop {
  position: absolute;
  z-index: 500;
  display: flex;
  flex-direction: column;
  /* Fixed card width (see the root note): deterministic on H5 / MP / App
   * where the old `max-content` + `min(…, 100vw)` sizing broke the bubble. */
  width: var(--sn-popover-width);
  /* Auto height (AUI-OPT-07): the card grows with its content and never clips
   * it — labels wrap and glyph plates follow their tokens. */
  height: auto;
  box-sizing: border-box;
  border: 2rpx solid var(--sn-popover-border);
  border-radius: var(--sn-mp-radius-lg);
  /* Same uni-app x default-clip guard as the root: the arrow protrudes
   * outside this box. */
  overflow: visible;
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

/* Menu mode keeps a narrower card (rows are short labels, not paragraphs). */
.sn-popover--menu .sn-popover__pop {
  width: var(--sn-popover-menu-width);
  padding: var(--sn-mp-spacing-2) 0;
}

/* ── Card body ─────────────────────────────────────────────────────────── */

.sn-popover__body {
  display: flex;
  flex-direction: column;
  /* Flex gap spaces the header from the description (uni-app x App drops the
   * `~` sibling combinator, so spacing must not rely on it). A lone child —
   * a bare text body — sits flush either way. */
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-4);
}

.sn-popover__head {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
}

.sn-popover__icon-plate {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--sn-popover-icon-plate-size);
  height: var(--sn-popover-icon-plate-size);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-popover-icon-bg);
  color: var(--sn-popover-icon-color);
}

.sn-popover__icon-image {
  width: var(--sn-popover-icon-size);
  height: var(--sn-popover-icon-size);
}

.sn-popover__head-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: var(--sn-mp-spacing-1);
}

.sn-popover__title {
  display: block;
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}

.sn-popover__subtitle {
  display: block;
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-popover__close {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--sn-popover-close-icon-size);
  height: var(--sn-popover-close-icon-size);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-popover__text {
  display: block;
  /* uni-app x views carry an explicit default font-size and do NOT inherit
   * the pop's — declare the body text size directly. */
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-secondary);
}

/* ── Actions ───────────────────────────────────────────────────────────── */

.sn-popover__actions {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  margin-top: var(--sn-mp-spacing-3);
  /* Own horizontal / bottom padding: the actions strip sits outside the
   * body's padding box, so without it the pill touches the card edge. */
  padding: 0 var(--sn-mp-spacing-4) var(--sn-mp-spacing-4);
}

.sn-popover__action {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-soft);
}

.sn-popover__action-text {
  display: block;
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-medium);
  color: var(--sn-mp-color-text-primary);
}

.sn-popover__action--danger .sn-popover__action-text {
  color: var(--sn-mp-color-feedback-danger);
}

/* Filled primary — the sn-button primary look (action-primary fill +
 * on-primary label). */
.sn-popover__action--primary {
  background-color: var(--sn-mp-color-action-primary);
}

.sn-popover__action--primary .sn-popover__action-text {
  color: var(--sn-mp-color-text-on-primary);
}

.sn-popover__action--disabled {
  opacity: 0.5;
}

/* ── Menu mode ─────────────────────────────────────────────────────────── */

.sn-popover__menu {
  display: flex;
  flex-direction: column;
}

.sn-popover__menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  color: var(--sn-mp-color-text-primary);
}

.sn-popover__menu-item--disabled {
  opacity: 0.5;
}

/* Glyph boxes follow `--sn-popover-menu-icon-size` instead of a fixed square,
 * so a bigger glyph or a longer label grows the bubble instead of overflowing
 * it (auto height, AUI-OPT-07). */
.sn-popover__menu-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--sn-popover-menu-icon-size);
  height: var(--sn-popover-menu-icon-size);
  color: var(--sn-mp-color-text-secondary);
}

.sn-popover__menu-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 4rpx;
}

.sn-popover__menu-text {
  display: block;
  /* Long labels wrap inside the bubble's fixed width instead of forcing one
   * line and spilling out of the pop: flex + min-width let the text shrink
   * below its max-content width. */
  flex: 1;
  min-width: 0;
  /* Same non-inheritance guard as __text: uni-app x views do not inherit the
   * pop's font-size. */
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-primary);
}

.sn-popover__menu-desc {
  display: block;
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}

/* ── Arrow ─────────────────────────────────────────────────────────────── */

.sn-popover__arrow {
  position: absolute;
  /* Rotated diamond, widest line ON the bubble edge: half protrudes toward
   * the trigger (~22rpx spike, ~45rpx base — the old -12rpx offset pushed
   * the whole diamond outside the card, overlapping the trigger), half
   * hides inside the card. The shadow uses the card's token so bubble +
   * arrow read as one elevated shape. */
  width: 32rpx;
  height: 32rpx;
  background-color: var(--sn-popover-bg);
  box-shadow: var(--sn-mp-shadow-md);
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
/* Centering uses pure `translateX/Y(-50%)` — no `calc()` inside `transform`;
 * `offset-x/y` folds into the margins, which every renderer supports. */

.sn-popover--top .sn-popover__pop {
  bottom: 100%;
  left: 50%;
  margin-bottom: calc(28rpx + var(--sn-popover-offset-y));
  margin-left: var(--sn-popover-offset-x);
  transform: translateX(-50%);
}
.sn-popover--top-start .sn-popover__pop {
  bottom: 100%;
  left: 0;
  margin-bottom: calc(28rpx + var(--sn-popover-offset-y));
  margin-left: var(--sn-popover-offset-x);
}
.sn-popover--top-end .sn-popover__pop {
  right: 0;
  bottom: 100%;
  margin-right: var(--sn-popover-offset-x);
  margin-bottom: calc(28rpx + var(--sn-popover-offset-y));
}

/* ── Placement: bottom family ──────────────────────────────────────────── */

.sn-popover--bottom .sn-popover__pop {
  top: 100%;
  left: 50%;
  margin-top: calc(28rpx + var(--sn-popover-offset-y));
  margin-left: var(--sn-popover-offset-x);
  transform: translateX(-50%);
}
.sn-popover--bottom-start .sn-popover__pop {
  top: 100%;
  left: 0;
  margin-top: calc(28rpx + var(--sn-popover-offset-y));
  margin-left: var(--sn-popover-offset-x);
}
.sn-popover--bottom-end .sn-popover__pop {
  top: 100%;
  right: 0;
  margin-top: calc(28rpx + var(--sn-popover-offset-y));
  margin-right: var(--sn-popover-offset-x);
}

/* ── Placement: left family ────────────────────────────────────────────── */

.sn-popover--left .sn-popover__pop {
  top: 50%;
  right: 100%;
  margin-right: calc(28rpx + var(--sn-popover-offset-x));
  margin-top: var(--sn-popover-offset-y);
  transform: translateY(-50%);
}
.sn-popover--left-start .sn-popover__pop {
  top: 0;
  right: 100%;
  margin-right: calc(28rpx + var(--sn-popover-offset-x));
  margin-top: var(--sn-popover-offset-y);
}
.sn-popover--left-end .sn-popover__pop {
  right: 100%;
  bottom: 0;
  margin-right: calc(28rpx + var(--sn-popover-offset-x));
  margin-bottom: var(--sn-popover-offset-y);
}

/* ── Placement: right family ───────────────────────────────────────────── */

.sn-popover--right .sn-popover__pop {
  top: 50%;
  left: 100%;
  margin-left: calc(28rpx + var(--sn-popover-offset-x));
  margin-top: var(--sn-popover-offset-y);
  transform: translateY(-50%);
}
.sn-popover--right-start .sn-popover__pop {
  top: 0;
  left: 100%;
  margin-left: calc(28rpx + var(--sn-popover-offset-x));
  margin-top: var(--sn-popover-offset-y);
}
.sn-popover--right-end .sn-popover__pop {
  bottom: 0;
  left: 100%;
  margin-left: calc(28rpx + var(--sn-popover-offset-x));
  margin-bottom: var(--sn-popover-offset-y);
}

/* ── Arrow geometry per placement ──────────────────────────────────────── */

.sn-popover--top .sn-popover__arrow,
.sn-popover--top-start .sn-popover__arrow,
.sn-popover--top-end .sn-popover__arrow {
  bottom: -16rpx;
  /* Points up: the outside half is the bottom-right of the rotated square. */
  border-top-color: transparent;
  border-left-color: transparent;
  border-bottom-color: var(--sn-popover-border);
  border-right-color: var(--sn-popover-border);
}
.sn-popover--top .sn-popover__arrow {
  left: calc(50% - 16rpx);
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
  top: -16rpx;
  /* Points down: the outside half is the top-left of the rotated square. */
  border-top-color: var(--sn-popover-border);
  border-left-color: var(--sn-popover-border);
}
.sn-popover--bottom .sn-popover__arrow {
  left: calc(50% - 16rpx);
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
  right: -16rpx;
  /* Points left: the outside half is the right edge of the rotated square. */
  border-top-color: var(--sn-popover-border);
  border-left-color: transparent;
  border-right-color: var(--sn-popover-border);
}
.sn-popover--left .sn-popover__arrow {
  top: calc(50% - 16rpx);
}
.sn-popover--left-start .sn-popover__arrow {
  top: 24rpx;
}
.sn-popover--left-end .sn-popover__arrow {
  bottom: 24rpx;
}

.sn-popover--right .sn-popover__arrow,
.sn-popover--right-start .sn-popover__arrow,
.sn-popover--right-end .sn-popover__arrow {
  left: -16rpx;
  /* Points right: the outside half is the left edge of the rotated square. */
  border-top-color: var(--sn-popover-border);
  border-right-color: transparent;
  border-left-color: var(--sn-popover-border);
}
.sn-popover--right .sn-popover__arrow {
  top: calc(50% - 16rpx);
}
.sn-popover--right-start .sn-popover__arrow {
  top: 24rpx;
}
.sn-popover--right-end .sn-popover__arrow {
  bottom: 24rpx;
}

/* ── Sheet presentation ────────────────────────────────────────────────── */

.sn-popover__sheet {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 500;
}

.sn-popover__sheet-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--sn-mp-color-background-overlay);
  opacity: 0;
  transition: opacity 150ms ease;
}

.sn-popover__sheet-mask--shown {
  opacity: 1;
}

.sn-popover__sheet-panel {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-5) var(--sn-mp-spacing-5);
  border-top-left-radius: var(--sn-mp-radius-xl);
  border-top-right-radius: var(--sn-mp-radius-xl);
  background-color: var(--sn-popover-bg);
  color: var(--sn-popover-color);
  transform: translateY(100%);
  transition: transform 200ms ease, opacity 200ms ease;
  opacity: 0;
}

.sn-popover__sheet-panel--shown {
  transform: translateY(0);
  opacity: 1;
}

.sn-popover__sheet-handle {
  align-self: center;
  flex: 0 0 auto;
  width: 64rpx;
  height: 8rpx;
  margin-bottom: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-border-default);
}

.sn-popover__sheet-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  margin-bottom: var(--sn-mp-spacing-3);
}

.sn-popover__sheet-title {
  display: block;
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}

.sn-popover__sheet-subtitle {
  display: block;
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}

.sn-popover__sheet-body {
  display: flex;
  flex-direction: column;
}

/* Sheet rows are roomier than the anchored menu card's. */
.sn-popover__menu--sheet .sn-popover__menu-item {
  padding: var(--sn-mp-spacing-3) 0;
}

.sn-popover__sheet-actions {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  margin-top: var(--sn-mp-spacing-4);
  /* Cancel the shared actions strip's own padding — the sheet panel already
   * pads its content. */
  margin-right: calc(-1 * var(--sn-mp-spacing-4));
  margin-bottom: calc(-1 * var(--sn-mp-spacing-4));
  margin-left: calc(-1 * var(--sn-mp-spacing-4));
}

.sn-popover__cancel {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-soft);
}

.sn-popover__cancel-text {
  display: block;
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
  color: var(--sn-mp-color-text-primary);
}

.sn-popover--disabled .sn-popover__trigger {
  opacity: 0.5;
}

/* Doodle skin — hand-drawn bubble outline. */
.snui-skin-doodle .sn-popover__pop,
.snui-skin-doodle .sn-popover__sheet-panel {
  border-width: 4rpx;
  border-radius: var(--sn-mp-radius-xs);
}
</style>
