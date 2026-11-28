<script setup lang="ts">
/**
 * sn-popover (uni-end) — tap-triggered bubble with a text or menu body.
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
 * ## How the bubble is positioned (wd-popover `usePopover` parity)
 *
 * The bubble is positioned from REAL measurements, not CSS anchoring. A
 * hidden copy of the bubble (`.sn-popover__pos--hidden`) stays mounted
 * off-screen at `visibility: hidden` so its natural size can be read, and the
 * trigger box is measured the same way. Opening folds both rects through the
 * 12-entry placement table (`sn-popover-position.ts`) into inline styles —
 * the bubble is `position: absolute` inside the component root on every
 * platform. The `after-enter` leg re-measures the SHOWN bubble
 * (`handleAfterEnter` → `updatePosition`) because slotted / async content may
 * settle to a different natural size than the hidden copy.
 *
 * ## Documented divergences from wd-popover
 *
 *   - ADDITIVE (registered in AGENTS.md §112.3a): `arrowShape` ('sharp' |
 *     'rounded' tip) and `borderColor` (1px consumer border that continues
 *     around the sharp arrow through the outline triangle) — wd-popover has
 *     neither.
 *   - Menu row dividers are real elements, not `::after`: uni-app x App has
 *     no pseudo-elements (AGENTS.md §116.2).
 *   - `iconClass` resolves through `sn-icon` (registry → built-in catalog →
 *     provider) instead of a font-icon class: this library ships no icon font.
 *
 * ## App trigger catcher (uni-app x App)
 *
 * Taps on slot content never cross into this component's compilation unit on
 * App — the wrapper's `@tap` never fires from the page's trigger element, and
 * page-bound listeners on slotted components never fire either. The template
 * therefore ships an `#ifdef APP` transparent catcher over the trigger box
 * (a node this component owns) that receives the tap and runs the same toggle.
 *
 * ## Outside close (wd-popover `useQueue` parity)
 *
 * uni-app components cannot listen to taps outside their own subtree, so the
 * close rides the shared outside-close queue in `utils/outside-close.ts`: the
 * page root binds `@tap="closeOutside"` and every open bubble registers an
 * idempotent close. The trigger stops propagation so opening a bubble never
 * immediately closes it again.
 *
 * ## Timers (AGENTS.md §41)
 *
 * This component owns no timer — the fade legs belong to `sn-transition`,
 * which disposes its own on unmount. The outside-close registration is
 * removed in `onBeforeUnmount`.
 *
 * Usage:
 *   <sn-popover v-model="open" content="提示文字">
 *     <sn-button>显示气泡</sn-button>
 *   </sn-popover>
 *
 * Not responsible for:
 *   - 纯文字提示 — 用 sn-tooltip
 *   - 页面级下拉筛选 — 用 sn-drop-menu
 */

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import SnTransition from '../sn-transition/sn-transition.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';
import {
  resolveUniHost,
  type UniSelectorQuery,
  type UniSelectorQueryHost,
} from '../../utils/uni-host';
import {
  createPopoverPosition,
  type PopoverOffset,
  type PopoverPlacement,
  type PopoverRect,
} from './sn-popover-position';
import { registerOutsideClosable, unregisterOutsideClosable, closeOutside } from '../../utils/outside-close';

defineOptions({ name: 'SnPopover' });



type PopoverMode = 'normal' | 'menu';

/** One `menu` mode row (wd-popover `PopoverMenuItem`). */
export interface SnPopoverMenuItem {
  /** Row text. */
  content: string;
  /** Icon name resolved through `sn-icon`. */
  iconClass?: string;
}

const props = withDefaults(
  defineProps<{
    /** Whether the bubble is shown (v-model). */
    modelValue?: boolean;
    /** Bubble body: a string in `normal` mode, a row list in `menu` mode. */
    content?: string | SnPopoverMenuItem[];
    /** Bubble display mode. */
    mode?: PopoverMode;
    /** Bubble anchor. */
    placement?: PopoverPlacement;
    /** Extra distance from the trigger, in px. */
    offset?: PopoverOffset;
    /** Render the arrow pointing at the trigger. */
    visibleArrow?: boolean;
    /** Disables the trigger — taps are ignored. */
    disabled?: boolean;
    /** Render a close button at the bubble's top-right corner. */
    showClose?: boolean;
    /** Extra class on the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
    /** Arrow tip shape. `sharp` (default) is the border triangle;
     * `rounded` is a soft-cornered square tip. */
    arrowShape?: 'sharp' | 'rounded';
    /** Custom bubble border colour. When set, the bubble body draws a 1px
     * border in this colour (the reference card is borderless by default). */
    borderColor?: string;
    /** Extra class on the arrow node. */
    customArrow?: string;
    /** Extra class on the bubble node. */
    customPop?: string;
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
    arrowShape: 'sharp',
    borderColor: '',
    customArrow: '',
    customPop: '',
  },
);

defineSlots<{
  /** Trigger content (the element the bubble points at). */
  default?(): unknown;
  /** Custom bubble body; replaces `content` in both modes. */
  content?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'open'): void;
  (e: 'close'): void;
  (e: 'change', payload: { show: boolean }): void;
  (e: 'menuclick', payload: { item: SnPopoverMenuItem; index: number }): void;
}>();

const instance = getCurrentInstance();
const instanceId = instance?.uid ?? 0;
/**
 * Close glyph size. SnIcon sizes its BOX from the `size` prop (default 32px),
 * not from a CSS font-size on its wrapper — the class alone left a 32px X
 * swallowing the bubble (user-reported). Single-hop consumption of the mp
 * size token (MP contract rule 2).
 */
const CLOSE_ICON_SIZE = 'var(--sn-mp-icon-size-small)';
/** Menu row glyph size — same box-sizing trap as the close glyph (SnIcon
 * sizes its box from __TEXT	__DATA	__OBJC	others	dec	hex, not from the wrapper font-size). */
const MENU_ICON_SIZE = 'var(--sn-mp-icon-size-medium)';
/** Per-instance node ids: several popovers on one page must not share nodes. */
const targetId = `sn-popover-target-${instanceId}`;
const posId = `sn-popover-pos-${instanceId}`;
const contentId = `sn-popover-content-${instanceId}`;

/** The reference watch: a wrong `content` type is a developer error. */
watch(
  () => props.content,
  (value) => {
    if (props.mode === 'normal' && typeof value !== 'string') {
      console.error('The value type must be a string type in normal mode');
    } else if (props.mode === 'menu' && !Array.isArray(value)) {
      console.error('The value type must be a Array type in menu mode');
    }
  },
);

const isMenuContent = computed(() => Array.isArray(props.content));
const menuItems = computed<SnPopoverMenuItem[]>(() =>
  Array.isArray(props.content) ? props.content : [],
);
const normalText = computed(() => (typeof props.content === 'string' ? props.content : ''));

/* ── Visibility (wd-popover showPopover) ──────────────────────────────── */

/** The shown state. Mirrors `modelValue` in, and emits `update:modelValue` out. */
const showPopover = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    showPopover.value = value;
  },
);

watch(
  () => showPopover.value,
  (value) => {
    if (value) resolvePlacement();
    emit('change', { show: value });
    if (value) emit('open');
    else emit('close');
  },
);

/** Turn the shown state without re-emitting `update:modelValue` (expose API). */
function updateModelValue(value: boolean): void {
  showPopover.value = value;
  emit('update:modelValue', value);
}

function toggle(): void {
  if (props.disabled) return;
  if (!showPopover.value) closeOtherBubbles();
  updateModelValue(!showPopover.value);
}

function open(): void {
  closeOtherBubbles();
  updateModelValue(true);
}

/**
 * Idempotent — the outside-close queue contract: closing an already
 * closed bubble is a no-op and emits nothing. This is what lets the open
 * path dispatch `closeOutside()` first without emitting a phantom close.
 */
function close(): void {
  if (!showPopover.value) return;
  updateModelValue(false);
}

/** The trigger wrapper and the App catcher both run this. */
function onTriggerTap(): void {
  toggle();
}

/* ── Menu rows ────────────────────────────────────────────────────────── */

function menuClick(index: number): void {
  updateModelValue(false);
  const item = menuItems.value[index];
  if (item === undefined) return;
  emit('menuclick', { item, index });
}

/* ── Placement (wd-popover usePopover) ────────────────────────────────── */

const position = createPopoverPosition(props.visibleArrow);
const { popStyle, arrowStyle, roundedStyle } = position;

/**
 * Bubble border, consumer-coloured: the reference card is borderless — a
 * set `borderColor` draws a 1px border on the body AND carries around the
 * sharp arrow through the outline triangle below. Rounded tips keep a
 * body-only border (a rotated square has no per-edge outline to continue).
 */
const containerStyle = computed(() =>
  props.borderColor ? `border: 1px solid ${props.borderColor};` : undefined,
);

/** The triangle-forming border side per placement family (matches the
 * arrow family classes: top → arrow-down colours border-top, …). */
const OUTLINE_SIDE_BY_FAMILY: Record<string, string> = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
};

/**
 * Outline triangle's border colour — the triangle-forming side ONLY. The
 * border-triangle silhouette needs the other three sides transparent:
 * colouring all four turns the tip into a solid rectangle.
 */
const arrowOutlineColorStyle = computed(() => {
  if (!props.borderColor) return undefined;
  const family = (position.actualPlacement.value ?? props.placement).split('-')[0] ?? '';
  const side = OUTLINE_SIDE_BY_FAMILY[family] ?? 'top';
  return `border-${side}-color: ${props.borderColor};`;
});

/** Root class: the component block + the bordered marker + the consumer class. */
const rootClass = computed(() => [
  'sn-popover',
  /* The zoom origin anchors on the arrow's edge, so the body scales out of
   * the junction instead of drifting away from the arrow mid-animation. */
  `sn-popover--origin-${props.placement.split('-')[0]}`,
  ...(props.borderColor ? ['sn-popover--bordered'] : []),
  props.customClass,
]);

/**
 * The bubble's classes. `sn-transition` takes `customClass` as a STRING, so
 * this joins — an array would be stringified with a trailing comma and break
 * the `sn-popover__pos` rule. On mini-programs the bubble is `fixed`; its
 * layer covers the viewport.
 */

/**
 * Arrow orientation classes. On mini-programs they follow the ACTUAL
 * placement — a bubble flipped to the opposite side needs the matching arrow.
 */
const arrowClass = computed(() => [
  position.arrowClass(position.actualPlacement.value ?? props.placement),
  props.customArrow,
]);

/** Rect fields the placement table reads (px). */
interface MeasuredRect {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
}

function toRect(rect: MeasuredRect | null | undefined): PopoverRect | null {
  if (rect === null || rect === undefined) return null;
  const width = rect.width ?? 0;
  const height = rect.height ?? 0;
  return {
    left: rect.left ?? 0,
    top: rect.top ?? 0,
    width,
    height,
    bottom: rect.bottom ?? (rect.top ?? 0) + height,
  };
}

/** One selector-query flavour: where it is created and what it is scoped to. */
interface QueryVariant {
  createQuery: () => UniSelectorQuery;
  queryScope: unknown;
}

/**
 * The query flavours that can see this component's nodes, best first:
 *   a. the mp component's own `$scope` (`.in($scope)` scopes to this subtree);
 *   b. page-level, no `.in()` — the variant that reaches nested components on
 *      uni-app x mp / App (no `virtualHost` there, so a. does not exist);
 *   c. page-level with `.in(Vue proxy)` (best effort where b. is restricted).
 */
function queryVariants(): QueryVariant[] {
  const proxy = instance?.proxy as { $scope?: UniSelectorQueryHost } | undefined;
  const uniHost = resolveUniHost<UniSelectorQueryHost>();
  const variants: QueryVariant[] = [];
  if (typeof proxy?.$scope?.createSelectorQuery === 'function') {
    variants.push({ createQuery: proxy.$scope.createSelectorQuery, queryScope: proxy.$scope });
  }
  if (typeof uniHost?.createSelectorQuery === 'function') {
    variants.push({ createQuery: uniHost.createSelectorQuery, queryScope: undefined });
    if (instance?.proxy !== undefined) {
      variants.push({ createQuery: uniHost.createSelectorQuery, queryScope: instance.proxy });
    }
  }
  return variants;
}

/** Run one query flavour and report the rect it measured, if any. */
function runQuery(variant: QueryVariant, selector: string): Promise<MeasuredRect | null> {
  return new Promise((resolve) => {
    let rect: MeasuredRect | null = null;
    const finish = (): void => resolve(rect);
    try {
      const query = variant.createQuery();
      const scoped =
        variant.queryScope === undefined
          ? query
          : ((query.in?.(variant.queryScope) as UniSelectorQuery | undefined) ?? query);
      scoped.select?.(`#${selector}`)?.boundingClientRect?.((value) => {
        rect = value as MeasuredRect | null;
      });
      scoped.exec?.(() => finish());
    } catch {
      finish();
    }
  });
}

/**
 * Read one node's rect (px), or `null` when no channel can measure it.
 *
 * Channels, in order:
 *   1. the real DOM (H5 / web): `getBoundingClientRect` on the component
 *      subtree — authoritative there, and the production H5 bundle
 *      tree-shakes `uni.createSelectorQuery` away (nothing references it
 *      statically), so the query channels are MP-only in practice;
 *   2. the query flavours (mini-program): the component \`$scope\` first,
 *      then the page-level uni query as fallback (`utils/uni-host.ts`).
 */
function measureRectDom(selector: string): PopoverRect | null {
  // Bare `document` is stripped by the uni-app x compiler for non-web
  // targets — reach it as a globalThis property, which survives everywhere
  // (mini-programs and uni-app x App simply have no such property).
  const g = globalThis as { document?: { querySelector?: (sel: string) => Element | null } };
  const doc = g.document;
  if (doc === undefined || doc === null || typeof doc.querySelector !== 'function') return null;
  const node = doc.querySelector('#' + selector);
  if (node === null) return null;
  const rect = node.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, bottom: rect.bottom };
}

async function measureRect(selector: string): Promise<PopoverRect | null> {
  const domRect = measureRectDom(selector);
  if (domRect !== null) return domRect;
  for (const variant of queryVariants()) {
    const rect = await runQuery(variant, selector);
    if (rect !== null && (rect.width ?? 0) > 0 && (rect.height ?? 0) > 0) {
      return toRect(rect);
    }
  }
  return null;
}

/**
 * Whether a successful capture has ever landed. A zero-width trigger measured
 * too early (slotted / lazily laid-out content) must NOT count — the old code
 * initialised from it, produced `left: 0`, and never retried, so the bubble
 * sat half a bubble away from its trigger with the arrow pointing at nothing
 * (user-reported content-slot bug, reproducible on H5 too).
 */
let hasMeasurements = false;

/** Capture trigger + hidden-bubble rects; `true` when both are usable. */
function captureRects(preferShownPop: boolean): Promise<boolean> {
  try { (globalThis as Record<string, unknown>).__snPopDiag = { step: 'capture-start', preferShownPop }; } catch {}
  const popId = preferShownPop ? contentId : posId;
  return Promise.all([measureRect(targetId), measureRect(popId)]).then(async ([trigger, primary]) => {
    // Fall back to the other bubble node — the hidden copy and the shown body
    // normally measure the same size, and one of them may not be laid out yet.
    const pop = primary ?? (await measureRect(preferShownPop ? posId : contentId));
    if (trigger === null || pop === null) return false;
    position.init(trigger, pop);
    hasMeasurements = true;
    return true;
  });
}

/**
 * Position the bubble for an open. Paints instantly from the last good
 * capture (never from a failed one), then always re-captures — the trigger
 * may have been zero-sized at mount, and on mini-programs viewport
 * coordinates go stale as soon as the page scrolls.
 */
/**
 * Derive the inline placement styles from whatever was last measured — never
 * measures by itself, so it is always synchronous and the bubble never
 * appears at a stale spot while a query is in flight.
 */
function solve(): void {
  try {
    position.control(props.placement, props.offset);
    (globalThis as Record<string, unknown>).__snPopDiag = { step: 'solved', popStyle: position.popStyle.value };
  } catch (e) {
    (globalThis as Record<string, unknown>).__snPopDiag = { step: 'solve-throw', msg: String(e).slice(0, 120) };
  }
}

/**
 * Bounded re-capture while a bubble stays open. The shown body mounts
 * asynchronously on mini-programs (sn-transition gates it on `hasRendered`,
 * and the MP render flush lands a frame later), so the first capture after
 * an open can run before slotted content is laid out — the capture then
 * reports nothing and the bubble would never position (user-reported MP
 * content-slot dead screen). §86 caps the attempts.
 */
const CAPTURE_RETRY_ATTEMPTS = 3;
const CAPTURE_RETRY_DELAY_MS = 60;
let captureRetryTimer: ReturnType<typeof setTimeout> | null = null;

function captureAndApply(preferShownPop: boolean, attemptsLeft: number): void {
  void captureRects(preferShownPop).then((ok) => {
    if (!showPopover.value) return;
    if (ok) {
      solve();
      return;
    }
    if (attemptsLeft <= 0) return;
    captureRetryTimer = setTimeout(() => {
      captureRetryTimer = null;
      captureAndApply(preferShownPop, attemptsLeft - 1);
    }, CAPTURE_RETRY_DELAY_MS);
  });
}

function resolvePlacement(): void {
  if (captureRetryTimer !== null) {
    clearTimeout(captureRetryTimer);
    captureRetryTimer = null;
  }
  if (hasMeasurements) solve();
  captureAndApply(false, CAPTURE_RETRY_ATTEMPTS);
}

/**
 * Capture the trigger + hidden-bubble measurements. Runs on mount and again
 * whenever `placement` changes (the reference `init`).
 */
async function initPosition(): Promise<void> {
  const ok = await captureRects(false);
  // The reference measures at rest and positions on open; a bubble that is
  // ALREADY open needs the fresh numbers applied right away.
  if (ok && showPopover.value) solve();
}

/**
 * Re-measure and re-derive when the SHOWN bubble's natural size changed — the
 * slotted content may settle to a different size than the hidden copy
 * predicted — and refresh the trigger rect along the way (the reference
 * `handleAfterEnter`).
 */
function updatePosition(): void {
  captureAndApply(true, CAPTURE_RETRY_ATTEMPTS);
}

/* ── Outside close (wd-popover useQueue parity) ───────────────────────── */

/**
 * Close every other open bubble (the reference `closeOther`): one gesture
 * switches bubbles. The shared queue closes ALL entries including this one,
 * so it runs BEFORE the bubble is turned on, never after.
 */
function closeOtherBubbles(): void {
  closeOutside();
}

onMounted(() => {
  void initPosition();
  // While mounted the page-root `closeOutside` may close this bubble.
  registerOutsideClosable(instanceId, close);
});

onBeforeUnmount(() => {
  if (captureRetryTimer !== null) {
    clearTimeout(captureRetryTimer);
    captureRetryTimer = null;
  }
  unregisterOutsideClosable(instanceId);
});

watch(
  () => props.placement,
  () => {
    void initPosition();
  },
);

defineExpose({ open, close, updatePosition });
</script>

<template>
  <view data-snui-component="popover" :class="rootClass" :style="props.customStyle" @tap.stop>
    <!-- Hidden measurement copy (the reference `#pos`): stays mounted
         off-screen so the bubble's natural size can be read before it is
         shown. It carries no placement styles. -->
    <view :id="posId" class="sn-popover__pos sn-popover__pos--hidden" aria-hidden="true">
      <view :class="['sn-popover__container', props.customPop]">
        <!-- NO slot outlet here. WeChat mini-programs distribute page content
             into the FIRST same-name slot node only (the uni-app x generated
             json carries no `multipleSlots`), so a second outlet HERE stole
             the content from the shown body and left it an empty zero-height
             card — only the arrow showed (user-reported). The hidden copy
             carries the PROP body only, gated on non-empty content so a
             slotted bubble's copy measures zero height and the capture falls
             through to the shown body (see captureAndApply). -->
        <view
          v-if="mode === 'normal' && normalText !== ''"
          :class="['sn-popover__inner', { 'sn-popover__inner--with-close': props.showClose }]"
        >
          <text class="sn-popover__text">{{ normalText }}</text>
        </view>
        <view
          v-if="mode === 'menu' && isMenuContent"
          :class="['sn-popover__menu', { 'sn-popover__menu--with-close': props.showClose }]"
        >
          <view v-for="(item, index) in menuItems" :key="index" class="sn-popover__menu-inner">
            <SnIcon v-if="item.iconClass" :icon="item.iconClass" :size="MENU_ICON_SIZE" custom-class="sn-popover__icon" />
            <text class="sn-popover__text">{{ item.content }}</text>
          </view>
        </view>
      </view>
    </view>

    <!--
      Positioning layer + transition layer are SEPARATE. The `.sn-popover__pos`
      wrapper below is a node THIS component owns, so its scoped stylesheet
      (position: absolute / fixed + the placement inline styles) provably
      reaches it. Inside it, `sn-transition` only fades the CONTENT: a
      custom-component stylesheet cannot style another component's internal
      nodes on mini-programs (no `styleIsolation: shared` in the uni-app x
      compile — verified: no component json carries it), so handing the
      placement classes to sn-transition's custom-class put the bubble in the
      document flow, unpositioned — the stray card over the trigger.
    -->
    <view class="sn-popover__pos" :style="popStyle">
      <!--
        The arrow is a SIBLING of the transition, not a child of the bubble:
        mini-programs force `overflow: hidden` on every view (`uvue.wxss`), and
        `sn-transition` — another component — carries no `overflow: visible`
        override we could reach from here, so an arrow protruding past the
        bubble box was clipped away entirely. This component's own
        `.sn-popover__pos` stylesheet DOES set `overflow: visible`, and its box
        coincides with the bubble box (the transition adds no box of its own),
        so the arrow keeps the same coordinates while staying unclipped.
      -->
      <!-- Bordered mode: an outline triangle UNDER the fill triangle — z 499,
           one step BELOW the container (500), so sub-pixel rounding at the
           abutment row can never paint consumer colour inside the bubble. It
           protrudes 10px vs the fill's 8px: on the 45° slants that leaves a
           ~1.4px band of the border colour (2px horizontal) continuing the
           body's 1px border line around the tip — one closed outline. -->
      <view
        v-if="props.visibleArrow && props.borderColor && props.arrowShape !== 'rounded'"
        :class="['sn-popover__arrow', 'sn-popover__arrow-outline', arrowClass, { 'sn-popover__arrow--shown': showPopover }]"
        :style="(arrowStyle ?? '') + (arrowOutlineColorStyle ?? '')"
        aria-hidden="true"
      />
      <view
        v-if="props.visibleArrow"
        :class="[
          'sn-popover__arrow',
          arrowClass,
          { 'sn-popover__arrow--shown': showPopover, 'sn-popover__arrow--rounded': props.arrowShape === 'rounded' },
        ]"
        :style="props.arrowShape === 'rounded' ? roundedStyle : arrowStyle"
        aria-hidden="true"
      />
      <SnTransition :show="showPopover" name="fade" @after-enter="updatePosition">
        <view
          :id="contentId"
          :class="[
            'sn-popover__container',
            { 'sn-popover__container--shown': showPopover },
            props.customPop,
          ]"
          :style="containerStyle"
          role="dialog"
        >
          <slot name="content">
            <view
              v-if="mode === 'normal'"
              :class="['sn-popover__inner', { 'sn-popover__inner--with-close': props.showClose }]"
            >
              <text class="sn-popover__text">{{ normalText }}</text>
            </view>
            <view
              v-if="mode === 'menu'"
              :class="['sn-popover__menu', { 'sn-popover__menu--with-close': props.showClose }]"
              role="menu"
            >
              <view
                v-for="(item, index) in menuItems"
                :key="index"
                :class="['sn-popover__menu-inner', { 'sn-popover__menu-inner--first': index === 0 }]"
                role="menuitem"
                @tap="menuClick(index)"
              >
                <SnIcon v-if="item.iconClass" :icon="item.iconClass" :size="MENU_ICON_SIZE" custom-class="sn-popover__menu-icon" />
                <text class="sn-popover__text">{{ item.content }}</text>
                <view v-if="index > 0" class="sn-popover__menu-divider" aria-hidden="true" />
              </view>
            </view>
          </slot>

          <view
            v-if="props.showClose"
            class="sn-popover__close"
            role="button"
            aria-label="close"
            @tap.stop="close"
          >
            <SnIcon :icon="XIcon" :size="CLOSE_ICON_SIZE" custom-class="sn-popover__close-icon" />
          </view>
        </view>
      </SnTransition>
    </view>

    <view
      :id="targetId"
      class="sn-popover__target"
      role="button"
      :aria-expanded="showPopover ? 'true' : 'false'"
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
           tap lands on it directly. Web / MP strip it: there the slot content
           taps reach the wrapper by native bubbling, and the catcher would
           only steal the trigger's press feedback. -->
      <view
        class="sn-popover__trigger-catcher"
        hover-class="sn-popover__trigger-catcher--pressed"
        aria-hidden="true"
        @tap.stop="onTriggerTap"
      />
      <!-- #endif -->
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`).
 *
 * Only class selectors; no pseudo-classes / pseudo-elements (uni-app x App
 * has neither — AGENTS.md §116.2). Arrow geometry is written as per-side
 * border longhands: the uni-x App flattener does not expand the 4-value
 * `border-width` shorthand. */

.sn-popover {
  position: relative;
  display: inline-block;
  /* The bubble rides OUTSIDE this box (the shown bubble is absolutely /
   * fixed anchored to the trigger) — explicit `overflow: visible` is
   * load-bearing: uni-app x views clip children by default, which swallowed
   * the whole bubble there. */
  overflow: visible;
  /* MP custom-property contract (0354cf95, device-verified): WeChat MP cannot
   * resolve a custom-property PAYLOAD that itself contains var(), and a
   * consuming `var(--x, fallback)` does NOT rescue it — a defined-but-
   * unresolvable variable computes to initial (transparent), so the bubble
   * surface AND the arrow border painted nothing. The contract:
   *   1. `--sn-popover-*` definitions carry LITERAL payloads only (never var());
   *   2. `--sn-mp-*` tokens are consumed DIRECTLY (the always-valid floor);
   *   3. overridable surfaces stack the overridable `var(--sn-popover-*,
   *      var(--sn-mp-*))` line ON TOP of the plain token line, so a broken
   *      chain loses only the top line, never the paint.
   * The colour / radius tokens are therefore NOT defined here at all — an
   * undefined variable is exactly what makes the fallback line work. Consumers
   * override them with concrete values through `custom-style`.
   *
   * The two remaining definitions are literals (px / unitless) and are read
   * by the placement math's inline styles, so they stay as defaults. */
  --sn-popover-arrow-size: 9px;
  --sn-popover-z-index: 500;
}

/* ── Bubble box (shared by the shown bubble and the hidden copy) ──────── */

/*
 * The positioning layer — a node THIS component owns, so this scoped
 * stylesheet provably reaches it (the transition's internal nodes are in
 * another custom component, whose styles this sheet can never touch on
 * mini-programs). It wraps the fade transition and is permanently mounted:
 * while closed it has no visible content (the transition renders none), so
 * it paints nothing and takes no tap.
 */
.sn-popover__pos {
  position: absolute;
  z-index: var(--sn-popover-z-index);
  box-sizing: border-box;
  overflow: visible;
  /* max-content BEFORE the measured inline width lands: the layer's
   * containing block is the trigger-sized inline-block root, so an
   * auto-width absolute layer shrink-to-fit CLAMPS to the trigger width —
   * and a slotted bubble measured in that state locks the clamp in
   * (user-reported H5: the slot bubble measured exactly the trigger's 89px).
   * max-content ignores the available width; solve() always overrides it
   * with the measured inline width right after. */
  width: max-content;
}

/*
 * The hidden measurement copy. It is `fixed`, not `absolute`: it must not
 * depend on an ancestor being a positioning context. On mini-programs the
 * component root is not one (the host wrapper is a plain flex column), so an
 * `absolute; left: -100vw` copy lost its origin and leaked into the viewport
 * as a stray card. `fixed` pins it to the viewport edge on every host;
 * `visibility: hidden` keeps it laid out (so it can be measured) and
 * `pointer-events: none` keeps it from ever taking a tap.
 */
.sn-popover__pos--hidden {
  position: fixed;
  top: 0;
  left: 0;
  visibility: hidden;
  pointer-events: none;
}


.sn-popover__container {
  position: relative;
  z-index: var(--sn-popover-z-index);
  /* Zoom-expand entry (user request): scale 0.9 → 1 with a fade, driven by a
   * CSS TRANSITION on the shown gate — CSS transitions degrade gracefully on
   * mini-programs (unsupported transform = appear without scaling), unlike
   * the keyframes+fill-mode combo which left the bubble stuck invisible. */
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 200ms ease, transform 200ms ease;
  box-sizing: border-box;
  overflow: visible;
  /* Two-line palette (see the MP contract on `.sn-popover`). The `color`
   * lives HERE, not only on the text: menu glyphs are siblings of the text
   * and inherit their colour — without a declaration on the bubble the icons
   * fell back to the page default while the text stayed on the token
   * (user-reported wrong icon colour). */
  border-radius: var(--sn-mp-radius-md);
  border-radius: var(--sn-popover-radius, var(--sn-mp-radius-md));
  background-color: var(--sn-mp-color-background-elevated);
  background-color: var(--sn-popover-bg, var(--sn-mp-color-background-elevated));
  color: var(--sn-mp-color-text-secondary);
  color: var(--sn-popover-color, var(--sn-mp-color-text-secondary));
  /* #ifndef MP */
  /* Softer than the md token on H5 / App; mini-programs render box-shadow
   * as hard grey corner patches (no radius) — no shadow there at all. */
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
  /* #endif */
}
.sn-popover__container--shown {
  opacity: 1;
  transform: scale(1);
}

.sn-popover__inner {
  position: relative;
  /* Roomier than the reference's loose padding: the body reads better with
   * clear breathing room around the text (user-reported crowding). */
  padding: var(--sn-mp-spacing-5);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-secondary);
  color: var(--sn-popover-color, var(--sn-mp-color-text-secondary));
  white-space: nowrap;
}

/*
 * Reserve space for the absolutely-positioned close button. The close box is
 * icon 28rpx + 2 × 16rpx padding = 60rpx wide and takes no layout space, so
 * without this the nowrap body ran underneath the × (user-reported overlap).
 * 72rpx leaves a 12rpx breathing gap; literal rpx keeps it MP-safe.
 */
.sn-popover__inner--with-close {
  padding-right: 72rpx;
}

.sn-popover__menu--with-close {
  padding-right: 72rpx;
}

/*
 * `white-space: nowrap` is declared HERE, not inherited from `__inner`: on H5
 * the `uni-text` element carries its own `white-space: pre-line`, which
 * overrides inheritance — the body then broke between every CJK character and
 * the bubble collapsed to a one-character-wide strip (the "frame with no
 * content" bug). A class rule beats uni-app's element default.
 */
.sn-popover__text {
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-secondary);
  color: var(--sn-popover-color, var(--sn-mp-color-text-secondary));
  white-space: nowrap;
}

/* ── Menu mode ────────────────────────────────────────────────────────── */

.sn-popover__menu {
  position: relative;
  padding-top: var(--sn-mp-spacing-0);
  padding-right: var(--sn-mp-spacing-4);
  padding-bottom: var(--sn-mp-spacing-0);
  padding-left: var(--sn-mp-spacing-4);
  white-space: nowrap;
}

.sn-popover__menu-inner {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: var(--sn-mp-spacing-4);
  padding-right: var(--sn-mp-spacing-0);
  padding-bottom: var(--sn-mp-spacing-4);
  padding-left: var(--sn-mp-spacing-0);
}

/* Row divider: a real element (no `::after` on App). */
.sn-popover__menu-divider {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background-color: var(--sn-mp-color-border-subtle);
  background-color: var(--sn-popover-border, var(--sn-mp-color-border-subtle));
}

.sn-popover__menu-icon {
  font-size: var(--sn-mp-icon-size-medium);
  margin-right: var(--sn-mp-spacing-2);
}

.sn-popover__icon {
  font-size: var(--sn-mp-icon-size-medium);
  margin-right: var(--sn-mp-spacing-2);
}

/* ── Arrow: a border triangle, the apex pointing at the trigger ───────── */

.sn-popover__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent;
  pointer-events: none;
  /* Paint ABOVE the bubble container (z 500): the container's background and
   * its drop shadow used to cover the protruding triangle, washing the seam
   * region in translucent shadow — the callout read as two detached pieces
   * (user-reported: top / right / left arrows "not one piece" while the
   * geometry measured a correct 1px overlap). One step above the container's
   * layer puts the junction back in white-on-white. */
  z-index: 501;
  /* The arrow lives OUTSIDE the fade transition (so no ancestor clip can eat
   * it), which means it no longer inherits the transition's visibility — it
   * must fade with the bubble on its own, or a closed popover leaves a stray
   * triangle floating over the page. */
  opacity: 0;
  transition: opacity 200ms ease;
}

.sn-popover__arrow--shown {
  opacity: 1;
}

/* Bubble above → arrow on the bottom edge → apex DOWN → coloured TOP border. */
.sn-popover__arrow-down {
  border-top-width: var(--sn-popover-arrow-size);
  border-right-width: var(--sn-popover-arrow-size);
  border-bottom-width: 0;
  border-left-width: var(--sn-popover-arrow-size);
  border-top-color: var(--sn-mp-color-background-elevated);
  border-top-color: var(--sn-popover-bg, var(--sn-mp-color-background-elevated));
  transform: translateX(-50%);
  /* 9px leg − 1px seam overlap, precomputed: WeChat MP does not apply
   * the +1px term inside a calc with var() — the arrow detached from the
   * bubble by its whole protrusion (user-reported). Literal keeps the
   * geometry MP-safe (same rule as the two-line palette). */
  bottom: -8px;
}
/* Bubble below → arrow on the top edge → apex UP → coloured BOTTOM border. */
.sn-popover__arrow-up {
  border-top-width: 0;
  border-right-width: var(--sn-popover-arrow-size);
  border-bottom-width: var(--sn-popover-arrow-size);
  border-left-width: var(--sn-popover-arrow-size);
  border-bottom-color: var(--sn-mp-color-background-elevated);
  border-bottom-color: var(--sn-popover-bg, var(--sn-mp-color-background-elevated));
  transform: translateX(-50%);
  /* 9px leg − 1px seam overlap, precomputed: WeChat MP does not apply
   * the +1px term inside a calc with var() — the arrow detached from the
   * bubble by its whole protrusion (user-reported). Literal keeps the
   * geometry MP-safe (same rule as the two-line palette). */
  top: -8px;
}
/* Bubble left → apex RIGHT → coloured LEFT border. */
.sn-popover__arrow-right {
  border-top-width: var(--sn-popover-arrow-size);
  border-right-width: 0;
  border-bottom-width: var(--sn-popover-arrow-size);
  border-left-width: var(--sn-popover-arrow-size);
  border-left-color: var(--sn-mp-color-background-elevated);
  border-left-color: var(--sn-popover-bg, var(--sn-mp-color-background-elevated));
  transform: translateY(-50%);
  /* 9px leg − 1px seam overlap, precomputed: WeChat MP does not apply
   * the +1px term inside a calc with var() — the arrow detached from the
   * bubble by its whole protrusion (user-reported). Literal keeps the
   * geometry MP-safe (same rule as the two-line palette). */
  right: -8px;
}
/* Bubble right → apex LEFT → coloured RIGHT border. */
.sn-popover__arrow-left {
  border-top-width: var(--sn-popover-arrow-size);
  border-right-width: var(--sn-popover-arrow-size);
  border-bottom-width: var(--sn-popover-arrow-size);
  border-left-width: 0;
  border-right-color: var(--sn-mp-color-background-elevated);
  border-right-color: var(--sn-popover-bg, var(--sn-mp-color-background-elevated));
  transform: translateY(-50%);
  /* 9px leg − 1px seam overlap, precomputed: WeChat MP does not apply
   * the +1px term inside a calc with var() — the arrow detached from the
   * bubble by its whole protrusion (user-reported). Literal keeps the
   * geometry MP-safe (same rule as the two-line palette). */
  left: -8px;
}

/* Outline triangle (bordered mode): painted one step BELOW the container —
 * even if sub-pixel rounding bleeds its top row past the bubble edge, the
 * container's own paint (z 500) wins and no consumer colour shows inside
 * the bubble. Protruding 10px vs the fill's 8px exposes a ~1.4px colour
 * band on the 45° slant edges (2px horizontal) — the arrow-side
 * continuation of the body border. */
.sn-popover__arrow-outline {
  z-index: 499;
}
.sn-popover__arrow-outline.sn-popover__arrow-down {
  bottom: -10px;
  border-top-width: 10px;
  border-right-width: 10px;
  border-left-width: 10px;
}
.sn-popover__arrow-outline.sn-popover__arrow-up {
  top: -10px;
  border-bottom-width: 10px;
  border-right-width: 10px;
  border-left-width: 10px;
}
.sn-popover__arrow-outline.sn-popover__arrow-right {
  right: -10px;
  border-top-width: 10px;
  border-bottom-width: 10px;
  border-left-width: 10px;
}
.sn-popover__arrow-outline.sn-popover__arrow-left {
  left: -10px;
  border-top-width: 10px;
  border-bottom-width: 10px;
  border-right-width: 10px;
}

/* Zoom origin per placement family: the edge the arrow anchors on stays
 * pinned while the body scales in. */
.sn-popover--origin-top .sn-popover__container {
  transform-origin: bottom center;
}
.sn-popover--origin-bottom .sn-popover__container {
  transform-origin: top center;
}
.sn-popover--origin-left .sn-popover__container {
  transform-origin: right center;
}
.sn-popover--origin-right .sn-popover__container {
  transform-origin: left center;
}

/* Bordered mode: the fill triangle grows 1px on every leg so its box bottom
 * reaches 2px INTO the body. Its old 1px overlap stopped exactly at the
 * border strip's lower edge — at fractional zoom ratios (1.4× browser zoom /
 * DPR scaling) the strip's antialiased bottom edge then peeked through the
 * arrow mouth as a faint grey line still "connecting" the two border
 * segments (user-reported). One extra px of white-on-white is invisible and
 * keeps the mouth a clean opening. Placed BEFORE the rounded rule so
 * rounded + border keeps border-width 0 (equal specificity, later wins). */
.sn-popover--bordered .sn-popover__arrow-up {
  border-bottom-width: 10px;
  border-right-width: 10px;
  border-left-width: 10px;
}
.sn-popover--bordered .sn-popover__arrow-down {
  border-top-width: 10px;
  border-right-width: 10px;
  border-left-width: 10px;
}
.sn-popover--bordered .sn-popover__arrow-right {
  border-left-width: 10px;
  border-top-width: 10px;
  border-bottom-width: 10px;
}
.sn-popover--bordered .sn-popover__arrow-left {
  border-right-width: 10px;
  border-top-width: 10px;
  border-bottom-width: 10px;
}

/* Rounded arrow tip (arrowShape="rounded"): a filled rounded square
 * rotated 45° inline — the compound selector outranks the per-family border
 * rules above, swapping the border triangle for a soft-cornered square that
 * straddles the bubble edge (inline offsets centre it on the edge). */
.sn-popover__arrow.sn-popover__arrow--rounded {
  width: 12px;
  height: 12px;
  border-width: 0;
  border-radius: 3px;
  background-color: var(--sn-mp-color-background-elevated);
  background-color: var(--sn-popover-bg, var(--sn-mp-color-background-elevated));
}

/* ── Close button ─────────────────────────────────────────────────────── */

.sn-popover__close {
  position: absolute;
  top: 0;
  right: 0;
  /* Clear of the corner and of the text: the 4rpx hug glued the × to the
   * rounded edge (user-reported crowding). */
  padding: var(--sn-mp-spacing-3);
  color: var(--sn-mp-color-text-secondary);
}

.sn-popover__close-icon {
  font-size: var(--sn-mp-icon-size-small);
}

/* ── Trigger ──────────────────────────────────────────────────────────── */

.sn-popover__target {
  position: relative;
  display: block;
  overflow: visible;
}

/* #ifdef APP */
/* App trigger catcher: a transparent shield over the trigger box. The
 * pressed leg restores the touch feedback the covered slot content can no
 * longer receive on App. */
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
</style>
