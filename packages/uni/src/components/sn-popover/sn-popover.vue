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
 *   - `iconClass` is accepted as an `sn-icon` registry name (or an image URL)
 *     rather than a CSS class — uni has no font-icon layer.
 *
 * ## Measured placement (the wd-popover pipeline, SVG chrome beneath)
 *
 * Like the reference library, the bubble is positioned from REAL measurements
 * (trigger rect + bubble size), not trusted to CSS anchoring: open mounts the
 * bubble at opacity 0, measures trigger + bubble (DOM on H5 /
 * SelectorQuery on MP), computes viewport coords + the arrow's trigger
 * projection, applies them as inline styles, THEN fades in. The
 * `after-enter` leg re-applies the position (`updatePosition` — the
 * reference's handleAfterEnter parity) because auto-height content changes
 * the bubble's size between mount and settle.
 *
 * The silhouette (rounded card + arrow) is ONE SVG path (sn-popover-chrome),
 * so there is no rotated-diamond composite to seam. The chrome renders as:
 *   - H5 / classic webview: inline `<svg><path>` (crisp, repaints free)
 *   - mini-programs: canvas-rasterized PNG data URL on `<image>`
 *     (WeChat `<image>` cannot decode SVG docs — sn-icon AUI-MP-003)
 *   - uni-app x App: `<image>` + SVG-document data URL (sn-circle decoder
 *     constraints: plain path, explicit intrinsic size)
 * Colors (fill / stroke) are RESOLVED concrete values baked into the shape —
 * never var() — so the WeChat custom-property chain cannot reach the chrome
 * (the transparent-bubble class of bugs is structurally impossible there).
 *
 * uni-app x MP has no `virtualHost` escape in the uni-x compile
 * (AUI-POP-MP-001: the vapor wrapper's overflow clip swallows any
 * absolutely-positioned overflow), so there the measured coords promote the
 * bubble to `position: fixed` — fixed nodes escape every ancestor clip
 * (probe-verified). All other ends keep root-relative `absolute`.
 *
 * When measurement is unavailable (plain test environments, exotic hosts)
 * the bubble falls back to the CSS flow-anchored placement classes — the
 * previous geometry — so nothing degrades to invisible.
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
 * ## Bubble sizing + palette (MP custom-property contract)
 *
 * The bubble is a FIXED-width card — `--sn-popover-width` (normal, default
 * 480rpx) / `--sn-popover-menu-width` (menu, default 320rpx) — overridable
 * via `custom-style`. Fixed width is deterministic on all platforms
 * (`max-content` / `min()` / `vw` are dropped by uni-app x App). Height is
 * measured, never assumed.
 *
 * The MP custom-property contract still governs the CSS-painted surfaces
 * (content text, plates, actions): every `--sn-popover-*` definition carries
 * a literal payload; `--sn-mp-*` tokens are consumed directly; overridable
 * surfaces stack the overridable var() line on top of the plain token line.
 * The chrome fill/stroke RESOLUTION reads the effective computed colors
 * through the same probe pattern as sn-icon (concrete values pass through,
 * token values are read back from the cascade with a literal floor), so
 * custom-style overrides reach the baked shape on every repaint.
 *
 * ## Timers (AGENTS.md §41)
 *
 * One transition timer keeps the bubble mounted for the fade-out leg. It is
 * cleared on every leg change and in `onBeforeUnmount`; measurement observers
 * (page scroll / window resize) are disconnected on close and unmount.
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

import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';
import {
  closeOutside,
  registerOutsideClosable,
  unregisterOutsideClosable,
} from '../../utils/outside-close';
import { resolveUniHost } from '../../utils/uni-host';
import {
  buildBubbleChrome,
  type ChromeGeometry,
  type ChromePlacement,
} from './sn-popover-chrome';
import { buildChromeRasterUrl, rasterizeChromePng, rasterizeChromePngOnHolder } from './sn-popover-raster';
import {
  computeFixedPlacement,
  computeBubblePlacement,
  type AnchorRect,
  type PlacementMeasurements,
  type PlacementOptions,
} from './sn-popover-position';

defineOptions({ name: 'SnPopover' });

const instance = getCurrentInstance();
const instanceId = instance?.uid ?? 0;
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
   * sunken-token default.
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
 * Static trigger↔bubble gap in px (the stylesheet's 28rpx at a 750rpx
 * design width on a 375px viewport). The measured placement folds the
 * `offset` prop on top of this base gap.
 */
const BUBBLE_GAP_PX = 14;

/**
 * Arrow shape in px (the stylesheet diamond's 22rpx base / 11rpx half-height
 * at the 375px reference viewport — matching the CSS fallback geometry).
 */
const ARROW = { protrusion: 11, base: 22 } as const;

/** Card corner radius in px (16rpx at 375px). */
const CARD_RADIUS_PX = 8;

/** Border stroke width in px (2rpx at 375px). */
const CARD_STROKE_PX = 1;

/** Chrome raster scale — 2× physical pixels (sn-icon crispness rule). */
const RASTER_SCALE = 2;

/**
 * Resolved-chrome palette floor. When the cascade probe cannot return a
 * concrete color the chrome bakes these literals — a chrome that never
 * paints transparently (sn-icon's never-blank-ink contract).
 */
const CHROME_FILL_FLOOR = '#ffffff';
const CHROME_STROKE_FLOOR = 'transparent';

/**
 * Glyph scale published as literal-rpx component tokens (see the MP contract
 * note — a var() payload default would break the box on WeChat). Overridable
 * via `custom-style`.
 */
const HEAD_ICON_SIZE = 'var(--sn-popover-icon-size)';
const MENU_ICON_SIZE = 'var(--sn-popover-menu-icon-size)';
const CLOSE_ICON_SIZE = 'var(--sn-popover-close-icon-size)';

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
  // Measure BEFORE the fade-in: the pipeline reads the flow-anchored pop
  // (opacity 0, CSS classes positioning it) and swaps in the inline
  // coordinates; the fade then runs from the final position. On MP the
  // measurement is async (SelectorQuery) — awaiting it avoids a visible
  // jump from the CSS fallback position to the measured one.
  await resolveChromeColors();
  if (token !== generation) return;
  await applyMeasuredPlacement();
  if (token !== generation) return;
  isShown.value = true;
  // after-enter parity (wd-popover handleAfterEnter): content layout may
  // change the bubble's natural size between mount and settle — re-apply
  // once the shown state has rendered.
  void nextTick().then(() => {
    if (token === generation) reapplyPlacement();
  });
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
    // Reset the measured placement — the next open re-measures (the trigger
    // may have moved / resized since this bubble closed).
    measured.value = false;
    popPosition.value = null;
    arrowCenterPx.value = null;
    popSize.value = null;
    chromeRasterUrl.value = null;
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

// updatePosition is defined in the measured-placement section below (the
// real re-measure, wd-popover parity). defineExpose happens after it.

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

/* ── Glyph resolution ───────────────────────────────────────────────────── */

/** Looks like an image source rather than an icon name. */
function isImageSource(value: string): boolean {
  return /^(https?:|data:|\/\/|\/|\.{1,2}\/)/.test(value);
}

/**
 * One resolved glyph slot: which branch renders and with what value.
 * Precedence: `iconData` > `iconUrl` > `icon` > legacy `iconClass`
 * (name, or an image address when the value looks like one).
 */
interface ResolvedGlyph {
  kind: 'data' | 'url' | 'name' | 'none';
  value: string | IconData;
}

function resolveGlyph(item: {
  iconData?: IconData | undefined;
  iconUrl?: string | undefined;
  icon?: string | undefined;
  iconClass?: string | undefined;
}): ResolvedGlyph {
  if (item.iconData !== undefined) return { kind: 'data', value: item.iconData };
  if (item.iconUrl !== undefined && item.iconUrl !== '') return { kind: 'url', value: item.iconUrl };
  if (item.icon !== undefined && item.icon !== '') return { kind: 'name', value: item.icon };
  const legacy = item.iconClass;
  if (legacy === undefined || legacy === '') return { kind: 'none', value: '' };
  return isImageSource(legacy)
    ? { kind: 'url', value: legacy }
    : { kind: 'name', value: legacy };
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

/** One rendered menu row: the item plus its precomputed glyph / plate style. */
interface MenuRow {
  item: SnPopoverMenuItem;
  index: number;
  glyph: ResolvedGlyph;
  plateStyle: string;
}

/** View model for the row list — resolution runs once, not per binding. */
const menuRows = computed<MenuRow[]>(() =>
  menuItems.value.map((item, index) => ({
    item,
    index,
    glyph: resolveGlyph(item),
    plateStyle: [
      ...(item.iconBg !== undefined && item.iconBg !== ''
        ? [`background-color: ${item.iconBg}`]
        : []),
      ...(item.iconColor !== undefined && item.iconColor !== ''
        ? [`color: ${item.iconColor}`]
        : []),
    ].join('; '),
  })),
);

/** Plain text body for `normal` mode. */
const normalText = computed(() => (typeof props.content === 'string' ? props.content : ''));

/** Header glyph — same precedence chain as the menu rows. */
const headGlyph = computed(() => resolveGlyph(props));

/** Whether the card header row (glyph / title / subtitle / close) renders. */
const hasHead = computed(
  () =>
    headGlyph.value.kind !== 'none' ||
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

const popClass = computed(() => [
  'sn-popover__pop',
  { 'sn-popover__pop--measured': measured.value },
  props.customPop,
]);

/* ── Measured placement (the wd-popover pipeline) ──────────────────────── */

/**
 * Whether a measured position is in effect. When true, the pop node gets
 * inline viewport coordinates (absolute relative to the root on H5 /
 * classic MP / App; `position: fixed` on uni-app x MP to escape the vapor
 * wrapper clip). When false — unmeasurable host, or before the first
 * measurement lands — the CSS flow-anchored placement classes position the
 * bubble (the previous geometry, never worse than invisible).
 */
const measured = ref(false);

/** Inline pop geometry: left / top (+ fixed promotion on uni-app x MP). */
const popPosition = ref<{ left: number; top: number } | null>(null);

/** Whether the current render runs on a uni-app x MP host (fixed layer). */
const isUniXMiniProgram = ref(false);

/**
 * Arrow tip position along the anchored edge, px from the bubble's
 * cross-axis start (the trigger projection the chrome clamps). `null`
 * falls back to the CSS class anchor.
 */
const arrowCenterPx = ref<number | null>(null);

/** The pop node's natural (flow) size for the placement math. */
const popSize = ref<{ width: number; height: number } | null>(null);

/** Chrome raster payload for the `<image>` channel (`null` → inline svg / CSS). */
const chromeRasterUrl = ref<string | null>(null);

/** Resolved chrome geometry — drives both the inline svg and the raster. */
const chromeGeometry = computed<ChromeGeometry | null>(() => {
  if (!isShown.value && !isMounted.value) return null;
  const size = popSize.value;
  if (size === null || size.width <= 0 || size.height <= 0) return null;
  return buildBubbleChrome({
    width: size.width,
    height: size.height,
    placement: props.placement as ChromePlacement,
    arrow: ARROW,
    withArrow: props.visibleArrow,
    arrowCenter: arrowCenterPx.value,
    arrowInset: 20,
    radius: CARD_RADIUS_PX,
    strokeWidth: CARD_STROKE_PX,
  });
});

/**
 * Resolved chrome palette — the bake colors for the silhouette. Concrete
 * values pass through; unresolved probes keep the literal floor so the
 * chrome never paints transparently. The outline is transparent by default
 * (reference borderless card); a consumer border arrives as the SVG stroke
 * when `--sn-popover-border` resolves concrete — see resolveChromeColors.
 */

/** Resolved pop background color — the chrome fill bake ('' → floor). */
const resolvedBg = ref('');

/** Resolved card outline color (`transparent` keeps the borderless card). */
const resolvedBorder = ref('');

const chromePaint = computed(() => ({
  fill: resolvedBg.value || CHROME_FILL_FLOOR,
  stroke: resolvedBorder.value || CHROME_STROKE_FLOOR,
  strokeWidth: CARD_STROKE_PX,
}));

/**
 * uni-app x App channel URL — the uni-x patch swaps the inline `<svg>` for
 * `<image :src="chromeAppUrl">`. Same geometry, SVG-document data URL inside
 * the sn-circle decoder constraints.
 */
const chromeAppUrl = computed<string | null>(() => {
  const geometry = chromeGeometry.value;
  if (geometry === null) return null;
  return buildChromeRasterUrl(geometry, chromePaint.value);
});

/**
 * Chrome node URL per platform channel:
 *   - MP (classic + uni-app x): the canvas-rasterized PNG (real devices
 *     decode PNG only);
 *   - uni-app x App: the SVG-document data URL (uni-x patch swaps the inline
 *     `<svg>` for `<image>`, the decoder constraint).
 * `null` on H5 / classic webview — those render the inline `<svg>` directly.
 */
const chromeUrl = computed<string | null>(() => {
  if (chromeRasterUrl.value !== null) return chromeRasterUrl.value;
  return null;
});

/**
 * Whether the MP raster `<canvas>` holder must exist in the template: only
 * uni-app x MP hosts (createCanvasContextAsync without getElementById) need
 * a node; classic MP uses the offscreen canvas, everything else inline svg.
 */
const mpCanvasNeeded = computed<boolean>(() => {
  const host = resolveUniHost<{ createCanvasContextAsync?: unknown; getElementById?: unknown }>();
  return (
    typeof host?.createCanvasContextAsync === 'function' &&
    typeof host?.getElementById !== 'function'
  );
});

/**
 * Chrome raster lifecycle: whenever the geometry or paint changes on an MP
 * host, re-rasterize. The offscreen path is synchronous; the uni-app x MP
 * node path (createCanvasContextAsync) repaints through the cached context.
 */
const mpRasterContext = ref<{
  holder: { getContext?(kind: string): unknown; toDataURL?: () => string } | null;
  canvasId: string;
} | null>(null);

function repaintChromeRaster(): void {
  const geometry = chromeGeometry.value;
  if (geometry === null) {
    chromeRasterUrl.value = null;
    return;
  }
  // 2× physical pixels (sn-icon crispness rule). The offscreen canvas takes
  // one square-ish size; the holder path resizes its bitmap per leg.
  const rasterSize = Math.ceil(Math.max(geometry.box.width, geometry.box.height) * RASTER_SCALE);
  const holder = mpRasterContext.value?.holder ?? null;
  if (holder !== null) {
    chromeRasterUrl.value = rasterizeChromePngOnHolder(holder, geometry, chromePaint.value, rasterSize);
    return;
  }
  chromeRasterUrl.value = rasterizeChromePng(geometry, chromePaint.value, rasterSize);
}

// Repaint whenever the geometry, the palette or the theme override changes —
// on EVERY raster host (classic MP uses the offscreen path synchronously;
// the holder path picks up as soon as createCanvasContextAsync resolves).
watch([chromeGeometry, chromePaint], () => {
  if (chromeGeometry.value !== null) repaintChromeRaster();
});

/** uni-app x MP canvas node id (component-scoped). */
const mpCanvasId = `sn-popover-chrome-${instance?.uid ?? 0}`;

onMounted(() => {
  const host = resolveUniHost<{ createCanvasContextAsync?: (o: Record<string, unknown>) => void }>();
  if (typeof host?.createCanvasContextAsync !== 'function') return;
  try {
    host.createCanvasContextAsync({
      id: mpCanvasId,
      component: instance?.proxy,
      success: (value: unknown) => {
        if (value === null || typeof value !== 'object') return;
        const holder = value as { getContext?: (kind: string) => unknown; toDataURL?: () => string };
        if (typeof holder.getContext !== 'function') return;
        mpRasterContext.value = { holder, canvasId: mpCanvasId };
        // The node path just became available — repaint the open bubble
        // through it (the offscreen path is unavailable on uni-app x MP).
        repaintChromeRaster();
      },
      fail: () => {
        /* 无 canvas 面 —— offscreen / CSS 回落 */
      },
    } as Record<string, unknown>);
  } catch {
    /* 回落 */
  }
});

/**
 * Cascade probe for the chrome palette (the sn-icon pattern): read the
 * pop node's resolved background color back as a CONCRETE value. Custom
 * token strings / var() chains that the probe cannot concretize keep the
 * literal floor (never transparent). Re-probed on every open, so theme /
 * dark-mode flips re-bake on the next bubble.
 */

/** Retry cadence for the MP computed-style probe (styles settle late). */
const COLOR_RETRY_MS = [50, 120, 240];

/** Guards a stale color probe from overwriting a newer open's bake. */
let colorGeneration = 0;
let colorTimer: ReturnType<typeof setTimeout> | null = null;

/** Concrete CSS color test — var() / currentColor / names fail it. */
function isConcreteColor(value: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$|^rgba?\(|^hsla?\(/i.test(value.trim());
}

/**
 * Fully transparent is NOT a resolved paint — a cascade with no tokens at all
 * (e.g. an H5 host that never imported the MP token layer) computes
 * `rgba(0, 0, 0, 0)` and the chrome must fall back to the floor fill, not
 * bake transparency into the silhouette.
 */
function isVisibleConcreteColor(value: string): boolean {
  if (!isConcreteColor(value)) return false;
  const rgba = /^rgba?\(([^)]+)\)$/i.exec(value.trim());
  if (rgba !== null) {
    const parts = rgba[1]!.split(/[,\s]+/).filter(Boolean);
    const alpha = parts[3];
    if (alpha !== undefined && parseFloat(alpha) === 0) return false;
  }
  return value.trim().toLowerCase() !== 'transparent';
}

/** Extract a concrete color from any computedStyle result wrapper. */
function readComputedColor(value: unknown, field: string): string {
  const probe = (node: unknown): string => {
    if (node === null || typeof node !== 'object') return '';
    const raw = (node as Record<string, unknown>)[field];
    return typeof raw === 'string' && isVisibleConcreteColor(raw) ? raw : '';
  };
  if (Array.isArray(value)) {
    for (const item of value) {
      const color = probe(item);
      if (color !== '') return color;
    }
  }
  const direct = probe(value);
  if (direct !== '') return direct;
  // UTSJSONObject / JSON-string wrappers: probe the serialized shape.
  try {
    const json = typeof value === 'string' ? value : JSON.stringify(value);
    const match = json === undefined ? null : new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`).exec(json);
    return match !== null && isConcreteColor(match[1] ?? '') ? (match[1] as string) : '';
  } catch {
    return '';
  }
}

/** Query host for scoped selector queries (component `$scope` first — the
 * sn-icon / uni-host resolver pattern; the uni host is the H5 / uni-app x
 * fallback). */
function pickQueryHost(): { createQuery: () => QueryHost; queryScope: unknown } | null {
  const proxy = instance?.proxy as
    | { $scope?: { createSelectorQuery?: () => QueryHost } }
    | undefined;
  const scope = proxy?.$scope;
  if (scope !== undefined && typeof scope.createSelectorQuery === 'function') {
    return { createQuery: scope.createSelectorQuery, queryScope: scope };
  }
  const uniHost = resolveUniHost<QueryUniHost>();
  if (typeof uniHost?.createSelectorQuery === 'function') {
    return { createQuery: uniHost.createSelectorQuery, queryScope: instance?.proxy };
  }
  return null;
}

/**
 * Resolve the chrome palette to CONCRETE values before the shape is baked:
 *
 *   1. a concrete `custom-style` background passes straight through;
 *   2. DOM hosts (H5 / webview): getComputedStyle on the pop node;
 *   3. MP hosts: `computedStyle` probe of the pop node (sn-icon pattern) —
 *      the cascade (theme tokens, dark mode) resolves there; a failed probe
 *      retries briefly, then keeps the literal floor.
 *
 * Returns after the FIRST attempt (success or not) so `open` is not stalled;
 * late retries still land through the reactive paint watch. Re-probed on
 * every open, so theme flips re-bake on the next bubble.
 */
async function resolveChromeColors(): Promise<void> {
  const generation = ++colorGeneration;
  if (colorTimer !== null) {
    clearTimeout(colorTimer);
    colorTimer = null;
  }
  // (1) Concrete custom-style override.
  const custom = props.customStyle;
  const bgMatch = /(?:^|;)\s*background(?:-color)?:\s*([^;]+)/i.exec(custom ?? '');
  if (bgMatch !== null && isVisibleConcreteColor(bgMatch[1] ?? '')) {
    resolvedBg.value = (bgMatch[1] as string).trim();
  } else {
    resolvedBg.value = '';
  }
  const borderMatch = /(?:^|;)\s*--sn-popover-border:\s*([^;]+)/i.exec(custom ?? '');
  resolvedBorder.value =
    borderMatch !== null && isVisibleConcreteColor(borderMatch[1] ?? '') ? (borderMatch[1] as string).trim() : '';

  // (2) DOM hosts.
  const el = (instance?.proxy as { $el?: Element | null } | undefined)?.$el;
  if (el !== undefined && el !== null && typeof el.querySelector === 'function') {
    try {
      const node = el.querySelector('.sn-popover__pop') ?? el;
      const style = el.ownerDocument?.defaultView?.getComputedStyle(node as Element);
      const bg = style?.backgroundColor ?? '';
      if (isVisibleConcreteColor(bg)) resolvedBg.value = bg;
      const border = style?.borderTopColor ?? '';
      if (isVisibleConcreteColor(border)) resolvedBorder.value = border;
    } catch {
      /* 探测失败走地板色 */
    }
    return;
  }

  // (3) MP hosts — scoped computedStyle probe.
  const picked = pickQueryHost();
  if (picked === null) return;
  const attempt = (index: number): void => {
    if (generation !== colorGeneration) return;
    try {
      picked
        .createQuery()
        .in?.(picked.queryScope)
        .select?.('.sn-popover__pop')
        ?.fields?.({ computedStyle: ['background-color', 'border-top-color'] }, (value) => {
          if (generation !== colorGeneration) return;
          const bg = readComputedColor(value, 'background-color');
          const border = readComputedColor(value, 'border-top-color');
          if (bg !== '') resolvedBg.value = bg;
          if (border !== '') resolvedBorder.value = border;
          if (bg === '' && index < COLOR_RETRY_MS.length) {
            colorTimer = setTimeout(() => {
              colorTimer = null;
              attempt(index + 1);
            }, COLOR_RETRY_MS[index]);
          }
        })
        ?.exec?.();
    } catch {
      /* 地板色兜底 */
    }
  };
  attempt(0);
}

/**
 * One measurement pass (wd-popover pipeline): trigger rect + pop size +
 * viewport → inline position + arrow projection. Pure DOM on H5 /
 * webview; SelectorQuery on MP (the component `$scope` first — the
 * sn-icon / uni-host resolver pattern). Single-shot: the pass reads the
 * pop node only while it is flow-anchored (`measured === false`); the
 * re-apply leg (`updatePosition`) measures the pop SIZE only, never
 * re-reads a fixed node's box (the c42f1576 phantom-rect regression).
 */
async function applyMeasuredPlacement(): Promise<void> {
  if (isSheet.value) return;
  const proxy = instance?.proxy as
    | { $el?: Element | null; $scope?: { createSelectorQuery?: () => unknown } }
    | undefined;

  /* ── DOM path (H5 / webview / tests with happy-dom) ── */
  const el = proxy?.$el;
  if (el !== undefined && el !== null && typeof el.querySelector === 'function') {
    try {
      const doc = el.ownerDocument;
      const triggerNode = el.querySelector('.sn-popover__trigger') as Element | null;
      const popNode = el.querySelector('.sn-popover__pop') as Element | null;
      if (doc === undefined || doc === null || triggerNode === null || popNode === null) return;
      const view = doc.defaultView;
      if (view === undefined || view === null) return;
      const triggerRect = triggerNode.getBoundingClientRect();
      const popRect = popNode.getBoundingClientRect();
      if (popRect.width <= 0 || popRect.height <= 0) return;
      const measurements: PlacementMeasurements = {
        trigger: {
          left: triggerRect.left,
          top: triggerRect.top,
          width: triggerRect.width,
          height: triggerRect.height,
        },
        pop: { width: popRect.width, height: popRect.height },
        viewport: { width: view.innerWidth, height: view.innerHeight },
      };
      applyPlacement(measurements);
      popSize.value = { ...measurements.pop };
      return;
    } catch {
      /* 落回 CSS 锚定 */
    }
    return;
  }

  /* ── SelectorQuery path (classic MP + uni-app x MP) ── */
  const picked = pickQueryHost();
  if (picked === null) return;
  try {
    const rects = await measureRects(picked.createQuery, picked.queryScope);
    if (rects === null || rects.trigger === null || rects.pop === null) return;
    if (rects.pop.width <= 0 || rects.pop.height <= 0) return;
    const windowInfo = resolveUniHost<{ getWindowInfo?: () => { windowWidth?: number; windowHeight?: number }; getSystemInfoSync?: () => { windowWidth?: number; windowHeight?: number } }>();
    const info =
      typeof windowInfo?.getWindowInfo === 'function'
        ? windowInfo.getWindowInfo()
        : windowInfo?.getSystemInfoSync?.();
    const viewport = {
      width: typeof info?.windowWidth === 'number' && info.windowWidth > 0 ? info.windowWidth : 375,
      height: typeof info?.windowHeight === 'number' && info.windowHeight > 0 ? info.windowHeight : 667,
    };
    const measurements: PlacementMeasurements = {
      trigger: rects.trigger,
      pop: { width: rects.pop.width, height: rects.pop.height },
      viewport,
    };
    applyPlacement(measurements);
    popSize.value = { ...measurements.pop };
  } catch {
    /* 落回 CSS 锚定 */
  }
}

/** SelectorQuery shapes (subset the queries need). */
interface QueryRect {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}
interface QueryNode {
  boundingClientRect?: (cb: (rect: QueryRect | null) => void) => QueryNode;
  fields?: (options: Record<string, unknown>, cb: (value: unknown) => void) => QueryNode;
  exec?: (cb?: () => void) => void;
}
interface QueryHost {
  in?: (scope: unknown) => QueryHost;
  select?: (selector: string) => QueryNode;
  exec?: (cb?: () => void) => void;
}
interface QueryUniHost {
  createSelectorQuery?: () => QueryHost;
}

/** Measure trigger + pop rects in one exec (viewport coordinates on MP). */
function measureRects(
  createQuery: () => QueryHost,
  queryScope: unknown,
): Promise<{ trigger: AnchorRect | null; pop: AnchorRect | null }> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: { trigger: AnchorRect | null; pop: AnchorRect | null }): void => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };
    try {
      const query = createQuery();
      const scoped = typeof query.in === 'function' ? query.in(queryScope) : query;
      const triggerChain = scoped.select?.('.sn-popover__trigger');
      const popChain = scoped.select?.('.sn-popover__pop');
      if (triggerChain === undefined || popChain === undefined) {
        finish({ trigger: null, pop: null });
        return;
      }
      let triggerRect: AnchorRect | null = null;
      let popRect: AnchorRect | null = null;
      triggerChain.boundingClientRect?.((rect) => {
        triggerRect = toAnchorRect(rect);
      });
      popChain.boundingClientRect?.((rect) => {
        popRect = toAnchorRect(rect);
      });
      scoped.exec?.(() => finish({ trigger: triggerRect, pop: popRect }));
      // Hosts whose exec carries no callback still settle (short cap: open
      // awaits this round-trip, so it must not stall the fade).
      setTimeout(() => finish({ trigger: triggerRect, pop: popRect }), 150);
    } catch {
      finish({ trigger: null, pop: null });
    }
  });
}

function toAnchorRect(rect: QueryRect | null): AnchorRect | null {
  if (rect === null || rect === undefined) return null;
  const { left, top, width, height } = rect;
  if (typeof width !== 'number' || typeof height !== 'number') return null;
  return {
    left: typeof left === 'number' ? left : 0,
    top: typeof top === 'number' ? top : 0,
    width,
    height,
  };
}

/** Fold one measurement pass into the reactive placement state. */
function applyPlacement(measurements: PlacementMeasurements): void {
  // uni-app x MP detection is runtime-capability based (sn-qr-code
  // precedent, no compile-target assumption): createCanvasContextAsync
  // exists only on uni-app x MP hosts; getElementById exists on App/Web.
  const uniXHost = resolveUniHost<{ createCanvasContextAsync?: unknown; getElementById?: unknown }>();
  const uniXMp =
    typeof uniXHost?.createCanvasContextAsync === 'function' &&
    typeof uniXHost?.getElementById !== 'function';
  isUniXMiniProgram.value = uniXMp;
  const options: PlacementOptions = {
    placement: props.placement as ChromePlacement,
    offset: offsetPair.value,
    gap: BUBBLE_GAP_PX,
    arrow: ARROW,
    radius: CARD_RADIUS_PX,
  };
  if (uniXMp) {
    const fixed = computeFixedPlacement(measurements, options);
    popPosition.value = { left: fixed.left, top: fixed.top };
    arrowCenterPx.value = fixed.arrowCenter;
  } else {
    const placed = computeBubblePlacement(measurements, options);
    // Root-relative: subtract the root node's viewport offset so the inline
    // absolute coords ride the existing positioning context.
    const el = (instance?.proxy as { $el?: Element | null } | undefined)?.$el;
    let rootLeft = 0;
    let rootTop = 0;
    if (el !== undefined && el !== null && typeof el.getBoundingClientRect === 'function') {
      const rootRect = (el as Element).getBoundingClientRect();
      rootLeft = rootRect.left;
      rootTop = rootRect.top;
    }
    popPosition.value = { left: placed.viewportLeft - rootLeft, top: placed.viewportTop - rootTop };
    arrowCenterPx.value = placed.arrowCenter;
  }
  measured.value = true;
}

/** after-enter parity (wd-popover handleAfterEnter): re-run the pipeline. */
function reapplyPlacement(): void {
  void applyMeasuredPlacement();
}

/** updatePosition expose — the reference API, now a real re-measure. */
function updatePosition(): void {
  if (!isShown.value && !isMounted.value) return;
  void applyMeasuredPlacement();
}

defineExpose({ open, close, updatePosition });

const arrowClass = computed(() => ['sn-popover__arrow', props.customArrow]);

const popStyle = computed(() => {
  const parts: string[] = [];
  if (measured.value && popPosition.value !== null) {
    // The chrome extends past the bubble on the arrow side; the pop keeps
    // its own geometry — the chrome layer carries its own offset.
    parts.push(`left: ${popPosition.value.left}px`);
    parts.push(`top: ${popPosition.value.top}px`);
    if (isUniXMiniProgram.value) parts.push('position: fixed');
    // Keep the fade transition usable while positioned.
    parts.push('margin: 0');
  }
  return parts.length > 0 ? parts.join('; ') : undefined;
});

const chromeBoxStyle = computed(() => {
  const geometry = chromeGeometry.value;
  if (geometry === null) return undefined;
  return [
    `width: ${geometry.box.width}px`,
    `height: ${geometry.box.height}px`,
    `left: ${geometry.box.offsetLeft}px`,
    `top: ${geometry.box.offsetTop}px`,
  ].join('; ');
});

/** The raster node's exact box (composed in script — uvue-safe attribute). */
const chromeRasterStyle = computed(() => {
  const geometry = chromeGeometry.value;
  if (geometry === null) return undefined;
  return `width: ${geometry.box.width}px; height: ${geometry.box.height}px`;
});

/** The inline-svg viewBox (composed in script — uvue-safe attribute). */
const chromeViewBox = computed(() => {
  const geometry = chromeGeometry.value;
  if (geometry === null) return undefined;
  return `0 0 ${geometry.box.width} ${geometry.box.height}`;
});

const sheetPanelClass = computed(() => [
  'sn-popover__sheet-panel',
  { 'sn-popover__sheet-panel--shown': isShown.value },
]);

const sheetMaskClass = computed(() => [
  'sn-popover__sheet-mask',
  { 'sn-popover__sheet-mask--shown': isShown.value },
]);

function onMenuTap(row: MenuRow): void {
  if (row.item.disabled) return;
  emit('menuclick', { item: row.item, index: row.index });
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
    <!--
      The bubble silhouette (card + arrow) is ONE SVG path (sn-popover-chrome):
      no rotated-diamond composite, no seams. Render channels:
        - H5 / classic webview: inline <svg> (`#ifndef MP`), currentColor-free
          baked colors;
        - mini-programs: canvas-rasterized PNG on <image> (WeChat <image>
          cannot decode SVG docs — sn-icon AUI-MP-003);
        - uni-app x App: the uni-x patch swaps the inline <svg> for
          <image :src="chromeAppUrl"> (sn-circle decoder constraints).
      The chrome layer sits UNDER the content (absolute, offset box). The
      pop's own CSS paint stays as the content styling + fallback floor.
      Without a measured position (popStyle empty) the CSS placement classes
      position the bubble — the previous geometry, still correct.
    -->
    <view
      v-if="isMounted && !isSheet"
      :class="popClass"
      :style="popStyle"
      role="dialog"
      @tap.stop
    >
      <!-- Chrome layer: one silhouette path beneath the card content. -->
      <view v-if="chromeGeometry !== null" class="sn-popover__chrome" :style="chromeBoxStyle" aria-hidden="true">
        <!-- #ifndef MP-WEIXIN -->
        <svg
          v-if="chromeUrl === null"
          class="sn-popover__chrome-svg"
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="chromeViewBox"
          :width="chromeGeometry.box.width"
          :height="chromeGeometry.box.height"
          focusable="false"
        >
          <path
            :d="chromeGeometry.path"
            :fill="chromePaint.fill"
            :stroke="chromePaint.stroke === 'transparent' ? undefined : chromePaint.stroke"
            :stroke-width="chromePaint.stroke === 'transparent' ? undefined : chromePaint.strokeWidth"
            stroke-linejoin="round"
          />
        </svg>
        <image
          v-else
          class="sn-popover__chrome-image"
          :src="chromeUrl"
          :style="chromeRasterStyle"
          mode="scaleToFill"
        />
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <image
          v-if="chromeUrl !== null"
          class="sn-popover__chrome-image"
          :src="chromeUrl"
          :style="chromeRasterStyle"
          mode="scaleToFill"
        />
        <!-- #endif -->
      </view>
      <!-- uni-app x MP raster holder: an offscreen-viewport 2d canvas this
           component owns (createCanvasContextAsync resolves only nodes; the
           sn-icon pattern — display:none would lose the bitmap). -->
      <!-- #ifdef MP-WEIXIN -->
      <canvas
        v-if="mpCanvasNeeded"
        :id="mpCanvasId"
        :canvas-id="mpCanvasId"
        type="2d"
        class="sn-popover__raster-canvas"
        aria-hidden="true"
      />
      <!-- #endif -->

      <!-- CSS fallback arrow: only when the chrome layer is unavailable
           (unmeasured size / broken canvas host) — the measured bubble never
           carries it. customArrow keeps its landing spot. -->
      <view v-if="chromeGeometry === null && visibleArrow" :class="arrowClass" aria-hidden="true" />

      <view v-if="mode === 'menu'" class="sn-popover__menu">
        <slot name="content">
          <view
            v-for="row in menuRows"
            :key="row.index"
            class="sn-popover__menu-item"
            :class="{ 'sn-popover__menu-item--disabled': row.item.disabled }"
            role="menuitem"
            :aria-disabled="row.item.disabled ? 'true' : 'false'"
            @tap="onMenuTap(row)"
          >
            <!-- Every row renders the glyph in a circle plate (untinted rows
                 take the default sunken plate) — one consistent rhythm;
                 iconBg / iconColor recolor the plate per row. -->
            <view
              v-if="row.glyph.kind !== 'none'"
              class="sn-popover__icon-plate"
              :style="row.plateStyle"
            >
              <SnIcon
                v-if="row.glyph.kind === 'data'"
                :icon="row.glyph.value as IconData"
                :size="MENU_ICON_SIZE"
              />
              <image
                v-else-if="row.glyph.kind === 'url'"
                class="sn-popover__icon-image"
                :src="row.glyph.value as string"
                mode="aspectFit"
                aria-hidden="true"
              />
              <SnIcon v-else :icon="row.glyph.value as string" :size="MENU_ICON_SIZE" />
            </view>
            <view class="sn-popover__menu-main">
              <text class="sn-popover__menu-text">{{ row.item.content }}</text>
              <text v-if="row.item.description" class="sn-popover__menu-desc">
                {{ row.item.description }}
              </text>
            </view>
          </view>
        </slot>
      </view>

      <view v-else class="sn-popover__body">
        <slot name="content">
          <!-- Card header: glyph circle + title / subtitle + close. -->
          <view v-if="hasHead" class="sn-popover__head">
            <view
              v-if="headGlyph.kind !== 'none'"
              class="sn-popover__icon-plate"
              aria-hidden="true"
            >
              <SnIcon
                v-if="headGlyph.kind === 'data'"
                :icon="headGlyph.value as IconData"
                :size="HEAD_ICON_SIZE"
              />
              <image
                v-else-if="headGlyph.kind === 'url'"
                class="sn-popover__icon-image"
                :src="headGlyph.value as string"
                mode="aspectFit"
              />
              <SnIcon v-else :icon="headGlyph.value as string" :size="HEAD_ICON_SIZE" />
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
              v-for="row in menuRows"
              :key="row.index"
              class="sn-popover__menu-item"
              :class="{ 'sn-popover__menu-item--disabled': row.item.disabled }"
              role="menuitem"
              :aria-disabled="row.item.disabled ? 'true' : 'false'"
              @tap="onMenuTap(row)"
            >
              <view v-if="row.glyph.kind !== 'none'" class="sn-popover__icon-plate" :style="row.plateStyle">
                <SnIcon
                  v-if="row.glyph.kind === 'data'"
                  :icon="row.glyph.value as IconData"
                  :size="MENU_ICON_SIZE"
                />
                <image
                  v-else-if="row.glyph.kind === 'url'"
                  class="sn-popover__icon-image"
                  :src="row.glyph.value as string"
                  mode="aspectFit"
                />
                <SnIcon v-else :icon="row.glyph.value as string" :size="MENU_ICON_SIZE" />
              </view>
              <view class="sn-popover__menu-main">
                <text class="sn-popover__menu-text">{{ row.item.content }}</text>
                <text v-if="row.item.description" class="sn-popover__menu-desc">
                  {{ row.item.description }}
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
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`).
 *
 * MP custom-property contract (see the script header): every --sn-popover-*
 * definition below carries a LITERAL payload; --sn-mp-* tokens are consumed
 * directly; overridable surfaces stack the overridable var() line ON TOP of
 * the plain token line so a broken WeChat chain loses only the top line. */

.sn-popover {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  /* The bubble rides OUTSIDE this box (absolute, anchored to the trigger) —
   * explicit `overflow: visible` is load-bearing: uni-app x views clip
   * children by default, which swallowed the whole bubble on the App / web
   * builds (H5 / MP default to visible). Same guard as sn-tooltip. */
  overflow: visible;
  /* Fixed bubble widths — the cross-platform replacement for `max-content` +
   * `min(…, 100vw)` sizing, which uni-app x App drops (unsupported), leaving
   * the bubble collapsed / invisible. Literal payloads; overridable via
   * `custom-style`. */
  --sn-popover-width: 480rpx;
  --sn-popover-menu-width: 320rpx;
  /* Header glyph plate + scale (literal rpx — see the MP contract note). */
  --sn-popover-icon-size: 32rpx;
  --sn-popover-icon-plate-size: 72rpx;
  /* Glyph scale (wd parity), overridable via `custom-style`. */
  --sn-popover-menu-icon-size: 32rpx;
  --sn-popover-close-icon-size: 28rpx;
  /* Arrow / card outline — transparent by default (reference borderless
   * card); consumers color it via custom-style / custom-class for a custom
   * border. The fill triangle overlaps the junction, so the border opens at
   * the arrow and the interiors stay connected. */
  --sn-popover-border: transparent;
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
  /* Borderless by default (the reference card reads through fill +
   * elevation alone) — the token lets consumers draw a custom border. The
   * measured bubble paints through the SVG chrome (one silhouette, baked
   * colors); this CSS border only paints the FALLBACK geometry when no
   * measured chrome exists. The definition payload is a literal, so the
   * consumption is MP-safe. */
  border: 2rpx solid var(--sn-popover-border);
  border-radius: var(--sn-mp-radius-lg);
  /* Same uni-app x default-clip guard as the root: the chrome layer (and the
   * fallback arrow) protrudes outside this box. */
  overflow: visible;
  /* Palette, TWO-LINE form (see the MP contract): the plain token line is
   * the always-valid MP floor; the overridable var() line wins on compliant
   * renderers and loses only itself if a WeChat chain breaks. This paint is
   * the content floor + fallback geometry; the measured bubble's chrome
   * bakes the resolved colors INTO the SVG/PNG shape. */
  background-color: var(--sn-mp-color-background-elevated);
  background-color: var(--sn-popover-bg, var(--sn-mp-color-background-elevated));
  color: var(--sn-mp-color-text-primary);
  color: var(--sn-popover-color, var(--sn-mp-color-text-primary));
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
  /* Elevation: the measured chrome carries the silhouette shadow inside the
   * SVG/PNG paint budget is not needed — drop-shadow on the pop node follows
   * the TRUE rendered silhouette (chrome layer included). uni-app x App has
   * no filter support: falls back to the rectangle box-shadow token. */
  /* #ifndef APP */
  filter: drop-shadow(0 6px 16px rgba(15, 23, 42, 0.08));
  /* #endif */
  /* #ifdef APP */
  box-shadow: var(--sn-mp-shadow-md);
  /* #endif */
  opacity: 0;
  transition: opacity 150ms ease;
  pointer-events: none;
}

/* Measured placement: inline coordinates land via popStyle (left / top /
 * fixed promotion on uni-app x MP). The placement-class margins stay in the
 * cascade but the inline styles win; `margin: 0` in popStyle clears the
 * static gap so the measured coords are the single source of position. */
.sn-popover__pop--measured {
  /* No stylesheet geometry beyond the box itself — placement is inline. */
}

/* ── Chrome layer (the SVG silhouette beneath the content) ─────────────── */

.sn-popover__chrome {
  position: absolute;
  /* The chrome box is offset (arrow side protrudes) via inline style. */
  pointer-events: none;
}

.sn-popover__chrome-svg,
.sn-popover__chrome-image {
  display: block;
  width: 100%;
  height: 100%;
}

/* uni-app x MP raster holder: offscreen-viewport but rendered (display:none
 * would lose the bitmap — the sn-icon canvas pattern). */
.sn-popover__raster-canvas {
  position: absolute;
  left: -9999rpx;
  top: 0;
  width: 8px;
  height: 8px;
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

/* Header / row glyph plate. The tint fields stack the overridable lines on
 * the plain tokens (two-line form) — per-row iconBg / iconColor land as
 * inline styles and beat both. */
.sn-popover__icon-plate {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--sn-popover-icon-plate-size);
  height: var(--sn-popover-icon-plate-size);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-sunken);
  background-color: var(--sn-popover-icon-bg, var(--sn-mp-color-background-sunken));
  color: var(--sn-mp-color-text-secondary);
  color: var(--sn-popover-icon-color, var(--sn-mp-color-text-secondary));
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

/* Menu rows ALL render the circle plate: untinted rows take the default
 * sunken plate, tinted rows the per-row colors — one consistent rhythm
 * across the menu. The plate is slightly smaller than the card head's
 * (64rpx vs 72rpx) to keep the row compact. */
.sn-popover__menu-item .sn-popover__icon-plate {
  width: 64rpx;
  height: 64rpx;
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
  /* Single line with ellipsis — a wrapping description breaks the menu
   * row rhythm (user report). */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}

/* ── Arrow ─────────────────────────────────────────────────────────────── */

/* Rotated diamond — the Element-style callout arrow, DRAWN as one shape:
 * fill = the card color (the diamond's inner half overlaps the card's
 * junction, covering the border segment behind it — interiors connect, so
 * the bordered card and the arrow are one piece), outline = the same
 * --sn-popover-border token as the card border, drawn on the two OUTSIDE
 * edges of the rotated square — the slant strokes meet the card border at
 * the two junction points, forming one continuous outline path. The pop's
 * drop-shadow follows the true silhouette (card + diamond) as one shape. */

.sn-popover__arrow {
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  /* Card fill, two-line form (see the MP contract note on the pop). */
  background-color: var(--sn-mp-color-background-elevated);
  background-color: var(--sn-popover-bg, var(--sn-mp-color-background-elevated));
  border: 2rpx solid var(--sn-popover-border);
  border-bottom-color: transparent;
  border-right-color: transparent;
  transform: rotate(45deg);
  pointer-events: none;
}

/* Outline per placement family: only the two OUTSIDE edges of the rotated
 * square are colored (the inside-facing pair stays transparent — filling
 * them would double-composite the diamond over the card fill). Longhands
 * only — the uni-x App flattener expands border shorthands only into
 * per-side longhands, and a TRBL width shorthand would ride through
 * unexpanded (§85 explicit). */

/* Bubble above → diamond protrudes from the bubble's bottom edge → the
 * outside half is the bottom-right of the rotated square. */
.sn-popover--top .sn-popover__arrow,
.sn-popover--top-start .sn-popover__arrow,
.sn-popover--top-end .sn-popover__arrow {
  bottom: -16rpx;
  border-bottom-color: var(--sn-popover-border);
  border-right-color: var(--sn-popover-border);
}

/* Bubble below → protrudes from the top edge → outside half is the
 * top-left of the rotated square. */
.sn-popover--bottom .sn-popover__arrow,
.sn-popover--bottom-start .sn-popover__arrow,
.sn-popover--bottom-end .sn-popover__arrow {
  top: -16rpx;
  border-top-color: var(--sn-popover-border);
  border-left-color: var(--sn-popover-border);
}

/* Bubble left → protrudes from the right edge → right-pointing half. */
.sn-popover--left .sn-popover__arrow,
.sn-popover--left-start .sn-popover__arrow,
.sn-popover--left-end .sn-popover__arrow {
  right: -16rpx;
  border-top-color: var(--sn-popover-border);
  border-right-color: var(--sn-popover-border);
}

/* Bubble right → protrudes from the left edge → left-pointing half. */
.sn-popover--right .sn-popover__arrow,
.sn-popover--right-start .sn-popover__arrow,
.sn-popover--right-end .sn-popover__arrow {
  left: -16rpx;
  border-bottom-color: var(--sn-popover-border);
  border-left-color: var(--sn-popover-border);
}

/* Arrow footprint per family: center diamond centered on the trigger;
 * -start / -end pin it 24rpx from the near corner. */
.sn-popover--top .sn-popover__arrow,
.sn-popover--bottom .sn-popover__arrow {
  left: calc(50% - 16rpx);
}
.sn-popover--top-start .sn-popover__arrow,
.sn-popover--bottom-start .sn-popover__arrow {
  left: 24rpx;
}
.sn-popover--top-end .sn-popover__arrow,
.sn-popover--bottom-end .sn-popover__arrow {
  right: 24rpx;
}
.sn-popover--left .sn-popover__arrow,
.sn-popover--right .sn-popover__arrow {
  top: calc(50% - 16rpx);
}
.sn-popover--left-start .sn-popover__arrow,
.sn-popover--right-start .sn-popover__arrow {
  top: 24rpx;
}
.sn-popover--left-end .sn-popover__arrow,
.sn-popover--right-end .sn-popover__arrow {
  bottom: 24rpx;
}

/* ── Placement: top family ─────────────────────────────────────────────── */
/* Centering uses pure `translateX/Y(-50%)` — no `calc()` inside `transform`.
 * The gap is a static 28rpx: WeChat MP drops var() nested inside a custom
 * property value, which zeroes the margin and slams the bubble into the
 * trigger — the arrow apex then pokes into the button on real devices. A
 * nonzero `offset` re-adds the gap inline on the pop node (popStyle) instead
 * of riding the var chain. */

.sn-popover--top .sn-popover__pop {
  bottom: 100%;
  left: 50%;
  margin-bottom: 28rpx;
  margin-left: var(--sn-popover-offset-x);
  transform: translateX(-50%);
}
.sn-popover--top-start .sn-popover__pop {
  bottom: 100%;
  left: 0;
  margin-bottom: 28rpx;
  margin-left: var(--sn-popover-offset-x);
}
.sn-popover--top-end .sn-popover__pop {
  right: 0;
  bottom: 100%;
  margin-right: var(--sn-popover-offset-x);
  margin-bottom: 28rpx;
}

/* ── Placement: bottom family ──────────────────────────────────────────── */

.sn-popover--bottom .sn-popover__pop {
  top: 100%;
  left: 50%;
  margin-top: 28rpx;
  margin-left: var(--sn-popover-offset-x);
  transform: translateX(-50%);
}
.sn-popover--bottom-start .sn-popover__pop {
  top: 100%;
  left: 0;
  margin-top: 28rpx;
  margin-left: var(--sn-popover-offset-x);
}
.sn-popover--bottom-end .sn-popover__pop {
  top: 100%;
  right: 0;
  margin-top: 28rpx;
  margin-right: var(--sn-popover-offset-x);
}

/* ── Placement: left family ────────────────────────────────────────────── */

.sn-popover--left .sn-popover__pop {
  top: 50%;
  right: 100%;
  margin-right: 28rpx;
  margin-top: var(--sn-popover-offset-y);
  transform: translateY(-50%);
}
.sn-popover--left-start .sn-popover__pop {
  top: 0;
  right: 100%;
  margin-right: 28rpx;
  margin-top: var(--sn-popover-offset-y);
}
.sn-popover--left-end .sn-popover__pop {
  right: 100%;
  bottom: 0;
  margin-right: 28rpx;
  margin-bottom: var(--sn-popover-offset-y);
}

/* ── Placement: right family ───────────────────────────────────────────── */

.sn-popover--right .sn-popover__pop {
  top: 50%;
  left: 100%;
  margin-left: 28rpx;
  margin-top: var(--sn-popover-offset-y);
  transform: translateY(-50%);
}
.sn-popover--right-start .sn-popover__pop {
  top: 0;
  left: 100%;
  margin-left: 28rpx;
  margin-top: var(--sn-popover-offset-y);
}
.sn-popover--right-end .sn-popover__pop {
  bottom: 0;
  left: 100%;
  margin-left: 28rpx;
  margin-bottom: var(--sn-popover-offset-y);
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
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-5)
    calc(var(--sn-mp-spacing-5) + env(safe-area-inset-bottom));
  border-top-left-radius: var(--sn-mp-radius-xl);
  border-top-right-radius: var(--sn-mp-radius-xl);
  /* Palette, two-line form (see the MP contract note on the pop). */
  background-color: var(--sn-mp-color-background-elevated);
  background-color: var(--sn-popover-bg, var(--sn-mp-color-background-elevated));
  color: var(--sn-mp-color-text-primary);
  color: var(--sn-popover-color, var(--sn-mp-color-text-primary));
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
  /* Primary button style (user request): filled action-primary with the
   * on-primary label — the SnButton primary look. */
  background-color: var(--sn-mp-color-action-primary);
}

.sn-popover__cancel-text {
  display: block;
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-popover--disabled .sn-popover__trigger {
  opacity: 0.5;
}

/* Doodle skin — hand-drawn bubble outline. */
.snui-skin-doodle .sn-popover__pop,
.snui-skin-doodle .sn-popover__sheet-panel {
  /* The base card is borderless — the skin draws its hand-drawn outline. */
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
