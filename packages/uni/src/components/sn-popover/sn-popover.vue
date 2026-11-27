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

/**
 * Mini-programs wrap every component in a host node that is neither a
 * positioning context nor free of `overflow: hidden` (`uvue.wxss` forces it on
 * every `view`). There the bubble cannot be an `absolute` child of this root:
 * it loses its origin and anything outside the component box is clipped. The
 * mini-program build therefore positions the bubble in a `fixed` full-viewport
 * layer with VIEWPORT coordinates — fixed is the one positioning mode no
 * ancestor clip reaches (AUI-POP-MP-001, probe-verified). Every other end
 * (H5 / App) keeps the root-relative `absolute` bubble.
 *
 * Detected by capability, not by conditional compilation: a host that exposes
 * the mini-program canvas API and has no DOM is a mini-program. This keeps the
 * same code path testable (the unit-test harness strips only `MP-WEIXIN`
 * blocks, so a `#ifdef MP` switch would leave both branches in place there).
 */
function isMiniProgramHost(): boolean {
  const host = resolveUniHost<{ createCanvasContextAsync?: unknown; getElementById?: unknown }>();
  return typeof host?.createCanvasContextAsync === 'function' && typeof host?.getElementById !== 'function';
}

const IS_MINI_PROGRAM = isMiniProgramHost();

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
const { popStyle, arrowStyle } = position;

/** Root class: the component block + the consumer class. */
const rootClass = computed(() => ['sn-popover', props.customClass]);

/**
 * The bubble's classes. `sn-transition` takes `customClass` as a STRING, so
 * this joins — an array would be stringified with a trailing comma and break
 * the `sn-popover__pos` rule. On mini-programs the bubble is `fixed`; its
 * layer covers the viewport.
 */
const bubbleClass = computed(() =>
  IS_MINI_PROGRAM ? 'sn-popover__pos sn-popover__pos--fixed' : 'sn-popover__pos',
);

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
 * Read one node's rect (px), or `null` when no query flavour can measure it.
 * Flavours are tried in turn until one reports a node with a real size, so a
 * host where the scoped query sees nothing still measures through the
 * page-level one (`utils/uni-host.ts` — the page-level query alone matches
 * the first node in document order inside nested components, so it is the
 * fallback rather than the first choice).
 */
async function measureRect(selector: string): Promise<PopoverRect | null> {
  for (const variant of queryVariants()) {
    const rect = await runQuery(variant, selector);
    if (rect !== null && (rect.width ?? 0) > 0 && (rect.height ?? 0) > 0) {
      return toRect(rect);
    }
  }
  return null;
}

/** The viewport in px, read once per open (mini-program solve only). */
let viewportSize: { width: number; height: number } | null = null;

/** Read the viewport size — `getWindowInfo` first, `getSystemInfoSync` after. */
function readViewport(): { width: number; height: number } | null {
  const host = resolveUniHost<{
    getWindowInfo?: () => { windowWidth?: number; windowHeight?: number };
    getSystemInfoSync?: () => { windowWidth?: number; windowHeight?: number };
  }>();
  const info = host?.getWindowInfo?.() ?? host?.getSystemInfoSync?.();
  const width = info?.windowWidth;
  const height = info?.windowHeight;
  if (typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0) {
    return { width, height };
  }
  return null;
}

/**
 * Solve the placement in the coordinate space this host needs: root-relative
 * `absolute` on H5 / App, viewport `fixed` on mini-programs. Uses whatever
 * was last measured — never measures by itself, so it is always synchronous
 * and the bubble never appears at a stale spot while a query is in flight.
 */
function solve(): void {
  // A viewport that could not be read stays `null`: the solve then skips the
  // flip and the clamp instead of treating the screen as zero-sized.
  if (IS_MINI_PROGRAM) {
    position.controlViewport(props.placement, props.offset, viewportSize);
  } else {
    position.control(props.placement, props.offset);
  }
}

/**
 * Position the bubble for an open. Synchronous from the cached measurements
 * first, then — on mini-programs only — the trigger is re-measured, because
 * viewport coordinates go stale as soon as the page scrolls. The late solve
 * lands through the same refs, so the bubble just corrects in place.
 */
function resolvePlacement(): void {
  solve();
  if (!IS_MINI_PROGRAM) return;
  viewportSize = readViewport() ?? viewportSize;
  void measureRect(targetId).then((trigger) => {
    if (trigger === null || !showPopover.value) return;
    position.moveTrigger(trigger);
    solve();
  });
}

/**
 * Capture the trigger + hidden-bubble measurements. Runs on mount and again
 * whenever `placement` changes (the reference `init`).
 */
async function initPosition(): Promise<void> {
  const [trigger, pop] = await Promise.all([measureRect(targetId), measureRect(posId)]);
  if (trigger === null || pop === null) return;
  position.init(trigger, pop);
  if (IS_MINI_PROGRAM) viewportSize = readViewport() ?? viewportSize;
  // The reference measures at rest and positions on open; a bubble that is
  // ALREADY open needs the fresh numbers applied right away.
  if (showPopover.value) solve();
}

/**
 * Re-measure the SHOWN bubble and re-derive the styles when its natural size
 * changed (the reference `handleAfterEnter`). The slotted content may settle
 * to a different size than the hidden copy predicted.
 */
function updatePosition(): void {
  void measureRect(contentId).then((pop) => {
    if (pop === null) return;
    position.updatePosition(pop);
  });
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
        <view v-if="!$slots.content && mode === 'normal'" class="sn-popover__inner">
          <text class="sn-popover__text">{{ normalText }}</text>
        </view>
        <view v-if="!$slots.content && mode === 'menu' && isMenuContent" class="sn-popover__menu">
          <view v-for="(item, index) in menuItems" :key="index" class="sn-popover__menu-inner">
            <SnIcon v-if="item.iconClass" :icon="item.iconClass" custom-class="sn-popover__icon" />
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
    <view :class="bubbleClass" :style="popStyle">
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
      <view
        v-if="props.visibleArrow"
        :class="['sn-popover__arrow', arrowClass, { 'sn-popover__arrow--shown': showPopover }]"
        :style="arrowStyle"
        aria-hidden="true"
      />
      <SnTransition :show="showPopover" name="fade" @after-enter="updatePosition">
        <view :id="contentId" :class="['sn-popover__container', props.customPop]" role="dialog">
          <slot name="content">
            <view v-if="mode === 'normal'" class="sn-popover__inner">
              <text class="sn-popover__text">{{ normalText }}</text>
            </view>
            <view v-if="mode === 'menu'" class="sn-popover__menu" role="menu">
              <view
                v-for="(item, index) in menuItems"
                :key="index"
                :class="['sn-popover__menu-inner', { 'sn-popover__menu-inner--first': index === 0 }]"
                role="menuitem"
                @tap="menuClick(index)"
              >
                <SnIcon v-if="item.iconClass" :icon="item.iconClass" custom-class="sn-popover__menu-icon" />
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

/*
 * The shown bubble on mini-programs. `fixed` is the one positioning mode no
 * ancestor clip reaches — the host wrapper forces `overflow: hidden` on every
 * `view` and is not a positioning context, so an `absolute` bubble would both
 * lose its origin and be clipped at the component box (AUI-POP-MP-001). The
 * inline coordinates are viewport px from the viewport solve.
 */
.sn-popover__pos--fixed {
  position: fixed;
}

.sn-popover__container {
  position: relative;
  z-index: var(--sn-popover-z-index);
  box-sizing: border-box;
  overflow: visible;
  /* Two-line palette (see the MP contract on `.sn-popover`). */
  border-radius: var(--sn-mp-radius-md);
  border-radius: var(--sn-popover-radius, var(--sn-mp-radius-md));
  background-color: var(--sn-mp-color-background-elevated);
  background-color: var(--sn-popover-bg, var(--sn-mp-color-background-elevated));
  box-shadow: var(--sn-mp-shadow-md);
}

.sn-popover__inner {
  position: relative;
  padding: var(--sn-mp-spacing-4);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-secondary);
  color: var(--sn-popover-color, var(--sn-mp-color-text-secondary));
  white-space: nowrap;
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
  bottom: calc(-1 * var(--sn-popover-arrow-size));
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
  top: calc(-1 * var(--sn-popover-arrow-size));
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
  right: calc(-1 * var(--sn-popover-arrow-size));
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
  left: calc(-1 * var(--sn-popover-arrow-size));
}

/* ── Close button ─────────────────────────────────────────────────────── */

.sn-popover__close {
  position: absolute;
  top: 0;
  right: 0;
  padding: var(--sn-mp-spacing-1);
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
