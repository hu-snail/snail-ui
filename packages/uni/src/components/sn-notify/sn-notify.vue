<script setup lang="ts">
/**
 * sn-notify (uni-end) — stacked card notification for mobile / miniprogram.
 *
 * Reference library: HeroUI `Toast` (mobile demo) — visual spec, restyled per
 * a Human-directed task ("顶部通知组件改成这个风格：动画丝滑从顶部滑下、
 * 支持多消息堆叠、支持自定义、1:1 还原"). The wot-ui `wd-notify` ancestry
 * (https://wot-ui.cn/component/notify.html) was the previous reference; the
 * deviation from that parity surface is registered in AGENTS.md §112.3a.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * ## Interaction model — queue container, not a single banner
 *
 * The old component was one banner driven by `v-model:visible`. Stacked
 * messages need an internal queue, so the model is now a page-level container
 * driven through the ref API:
 *
 *   const notify = ref<SnNotifyInstance | null>(null);
 *   notify.value?.show({ title: 'Plan upgraded', type: 'success', description: '…' });
 *   notify.value?.hideAll();
 *
 * `v-model:visible` / `message` / `variant` are gone (breaking change,
 * changeset recorded). The container renders every queued message as an
 * elevated card; the newest card is the front card, older cards slide down
 * behind it and peek out below (deck stack), capped by `maxVisible`.
 *
 * ## Stack geometry (deck mode)
 *
 * Card heights are measured once per show via `uni.createSelectorQuery`
 * (same pattern as sn-fit-swiper) and the stack is laid out with per-card
 * `translateY` chains — each older card sits so its bottom edge peeks
 * `SLIVER_RPX` below the card in front of it. Transitions on transform make
 * insert / dismiss / swipe reflow animated. When measurement is unavailable
 * (plain jsdom, exotic hosts) the component degrades to a plain column list
 * (flow mode) with class-free percentage transforms — explicit, not silent:
 * the root carries `sn-notify--deck` / `sn-notify--flow`.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * Every queued message owns an auto-dismiss timer (map) and the stack owns
 * one leave timer; all are cleared on dismiss / hide / unmount.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 * No schema validation; no business logic.
 *
 * Not responsible for:
 *   - 无停留的轻提示 — 用 sn-toast
 *   - 横向滚动通知栏 — 用 sn-notice-bar
 *   - 居中确认框 — 用 sn-dialog
 */

import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveFeedbackIcon } from '../sn-icon/sn-icon-feedback';
import { Bell, X as XIcon } from '../sn-icon/sn-icon-set';
import { resolveUniHost } from '../../utils/uni-host';
import type {
  NotifyPosition,
  NotifyType,
  SnNotifyClosePayload,
  SnNotifyInstance,
  SnNotifyOpenPayload,
  SnNotifyOptions,
} from './sn-notify-types';

/* Public type contracts live in ./sn-notify-types (uni-x needs a pure ts
 * entity — sn-icon-types pattern); re-exported here for the @snui/uni barrel. */
export type {
  NotifyPosition,
  NotifyType,
  SnNotifyClosePayload,
  SnNotifyInstance,
  SnNotifyOpenPayload,
  SnNotifyOptions,
} from './sn-notify-types';

defineOptions({ name: 'SnNotify' });

/** Queued message state: pre-measure → off-screen → at rest → leaving. */
type NotifyState = 'pre' | 'enter' | 'active' | 'leave';

interface NotifyItem extends Required<Omit<SnNotifyOptions, 'icon' | 'radius'>> {
  id: string;
  icon: IconData | null;
  radius: string;
  state: NotifyState;
  /** Measured card height (px). */
  height: number;
  /** Deck offset (px) from the stack anchor, signed for the position. */
  offset: number;
  /** Paint order inside the stack (front card = highest). */
  z: number;
  /** Horizontal swipe offset (px); also carries the fling target. */
  dragX: number;
  /** True while the finger owns the card (transitions disabled). */
  dragging: boolean;
}

const props = withDefaults(
  defineProps<{
    /** Anchor of the stack. */
    position?: NotifyPosition;
    /** Default auto-dismiss delay in ms; `0` keeps cards until dismissed. */
    duration?: number;
    /** Maximum number of cards kept in the queue; older ones are dropped. */
    maxVisible?: number;
    /** Stacking level of the fixed layer. */
    zIndex?: number;
    /** Show the close pill by default. */
    closable?: boolean;
    /** Default close pill label. */
    closeText?: string;
    /** Allow horizontal swipe-to-dismiss on the front card. */
    swipeToDismiss?: boolean;
    /**
     * Reserve the status-bar height on top-anchored stacks (default) so the
     * clock / notch never overlaps the card. The card still floats above the
     * page navbar by design. H5 has no status bar and stays flat. Set
     * `false` on hosts where `position: fixed` already starts below the bar.
     */
    safeAreaInsetTop?: boolean;
    /**
     * Extra top offset in px (added to the safe-area inset). A string is a
     * full manual `padding-top` override that replaces the auto inset.
     */
    safeHeight?: number | string | undefined;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    position: 'top',
    duration: 4000,
    maxVisible: 3,
    zIndex: 9990,
    closable: true,
    closeText: 'Close',
    swipeToDismiss: true,
    safeAreaInsetTop: true,
    safeHeight: undefined,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'open', payload: SnNotifyOpenPayload): void;
  (e: 'close', payload: SnNotifyClosePayload): void;
  (e: 'click', payload: SnNotifyOpenPayload): void;
}>();

/** Removal delay after the leave transform (transition + frame buffer). */
const LEAVE_MS = 460;
/** Visible sliver of a card behind the front card (rpx). */
const SLIVER_RPX = 20;
/** Enter frame gap — one render + one tick before the transition kicks in. */
const ENTER_FRAME_MS = 40;
/** Finger travel (px) beyond which a horizontal drag becomes a dismiss. */
const SWIPE_THRESHOLD_PX = 80;

const DEFAULT_ICONS: Record<NotifyType, IconData | null> = {
  default: Bell,
  primary: resolveFeedbackIcon('info'),
  success: resolveFeedbackIcon('success'),
  warning: resolveFeedbackIcon('warning'),
  danger: resolveFeedbackIcon('danger'),
};

/** Component proxy, needed for `createSelectorQuery().in()`. */
const instance = getCurrentInstance();

/** Queued messages, newest first — index 0 is the front card. */
const items = ref<NotifyItem[]>([]);
/** True once a measurement round produced usable geometry. */
const deck = ref(false);
/** Stack anchor rect (px, viewport) captured with the card heights. */
const stackRect = ref<{ top: number; bottom: number } | null>(null);
/** Viewport height (px) for bottom-anchored off-screen math. */
const viewportHeight = ref(0);

/** Auto-dismiss timers per message id (§41). */
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();
/** Leave-transition timers per message id — concurrent dismissals must not
 * cancel each other's removal splice. */
const leaveTimers = new Map<string, ReturnType<typeof setTimeout>>();

let seq = 0;

interface RectLike {
  id?: string;
  top?: number;
  height?: number;
}

interface SelectorQueryLike {
  in(context?: unknown): SelectorQueryLike;
  select(selector: string): SelectorQueryLike;
  selectAll(selector: string): SelectorQueryLike;
  boundingClientRect(
    callback: (rect: RectLike | Array<RectLike | null>) => void,
  ): SelectorQueryLike;
  exec(callback?: () => void): void;
}

/** Viewport metrics with a 375-design fallback (bare jsdom, exotic hosts). */
function readViewport(): { width: number; height: number } {
  const host = resolveUniHost<{ getSystemInfoSync?: () => { windowWidth?: number; windowHeight?: number } }>();
  try {
    const info = host?.getSystemInfoSync?.();
    return {
      width: typeof info?.windowWidth === 'number' && info.windowWidth > 0 ? info.windowWidth : 375,
      height:
        typeof info?.windowHeight === 'number' && info.windowHeight > 0 ? info.windowHeight : 667,
    };
  } catch {
    return { width: 375, height: 667 };
  }
}

/** Design rpx → px, so JS-computed offsets match the CSS rpx geometry. */
function rpxToPx(rpx: number): number {
  return (rpx * readViewport().width) / 750;
}

/** Clear one message's auto-dismiss timer. */
function clearDismissTimer(id: string): void {
  const timer = dismissTimers.get(id);
  if (timer !== undefined) {
    clearTimeout(timer);
    dismissTimers.delete(id);
  }
}

function clearAllTimers(): void {
  for (const timer of dismissTimers.values()) clearTimeout(timer);
  dismissTimers.clear();
  for (const timer of leaveTimers.values()) clearTimeout(timer);
  leaveTimers.clear();
}

function armTimer(item: NotifyItem): void {
  clearDismissTimer(item.id);
  if (item.duration <= 0) return;
  const timer = setTimeout(() => {
    dismissTimers.delete(item.id);
    dismiss(item.id, 'auto');
  }, item.duration);
  dismissTimers.set(item.id, timer);
}

/** Deck offset chain: card `i` peeks SLIVER_RPX below card `i-1`'s bottom edge. */
function applyGeometry(): void {
  const sliver = rpxToPx(SLIVER_RPX);
  let cursor = 0; // previous card's bottom edge, relative to the stack anchor
  let depth = 0;
  for (const item of items.value) {
    if (item.state === 'leave') continue;
    const offset = depth === 0 ? 0 : cursor + sliver - item.height;
    item.offset = offset;
    item.z = 200 - depth;
    cursor = offset + item.height;
    depth += 1;
  }
}

/**
 * Measure the stack anchor and every rendered card (px). Rects are matched by
 * node id so an in-flight leave/splice can never shift the index mapping.
 */
function measure(onReady?: () => void): void {
  const host = resolveUniHost<{ createSelectorQuery?: () => SelectorQueryLike }>();
  const query = host?.createSelectorQuery?.();
  if (query === undefined || instance === null) {
    onReady?.();
    return;
  }
  try {
    query
      .in(instance.proxy)
      .select('.sn-notify__stack')
      .boundingClientRect((rect) => {
        const r = rect as RectLike;
        if (typeof r?.top === 'number') {
          stackRect.value = {
            top: r.top,
            bottom: r.top + (typeof r.height === 'number' ? r.height : 0),
          };
        }
      })
      .selectAll('.sn-notify__card')
      .boundingClientRect((rects) => {
        const list = (rects as Array<RectLike | null>) ?? [];
        const byId = new Map(items.value.map((item) => [item.id, item]));
        list.forEach((rect, index) => {
          if (rect === null) return;
          const item = (rect.id !== undefined ? byId.get(rect.id) : undefined) ?? items.value[index];
          if (item !== undefined && typeof rect.height === 'number' && rect.height > 0) {
            item.height = rect.height;
          }
        });
      })
      .exec(() => {
        viewportHeight.value = readViewport().height;
        if (stackRect.value !== null && items.value.some((item) => item.height > 0)) {
          deck.value = true;
        }
        applyGeometry();
        onReady?.();
      });
  } catch {
    onReady?.();
  }
}

/** Queue a message and run its pre → enter → active sequence. */
function show(options: SnNotifyOptions): string {
  seq += 1;
  const item: NotifyItem = {
    id: `sn-notify-item-${seq}`,
    title: options.title,
    description: options.description ?? '',
    type: options.type ?? 'default',
    icon: options.icon !== undefined ? options.icon : DEFAULT_ICONS[options.type ?? 'default'],
    duration: options.duration ?? props.duration,
    closable: options.closable ?? props.closable,
    closeText: options.closeText ?? props.closeText,
    background: options.background ?? '',
    color: options.color ?? '',
    radius: resolveRadius(options.radius),
    customClass: options.customClass ?? '',
    customStyle: options.customStyle ?? '',
    state: 'pre',
    height: 0,
    offset: 0,
    z: 200,
    dragX: 0,
    dragging: false,
  };
  items.value.unshift(item);
  // The queue is a deep-reactive array — the stored proxy is the handle all
  // later mutations must go through, otherwise nothing re-renders.
  const stored = items.value[0]!;
  trimOverflow();
  emit('open', toPayload(stored));
  armTimer(stored);

  void nextTick(() => {
    measure(() => {
      if (stored.state !== 'pre') return;
      applyGeometry();
      stored.state = 'enter';
      setTimeout(() => {
        if (stored.state === 'enter') stored.state = 'active';
      }, ENTER_FRAME_MS);
    });
  });
  return stored.id;
}

/** Resolve a numeric-or-string radius (bare number = rpx). */
function resolveRadius(value: number | string | undefined): string {
  if (value === undefined || value === '') return '';
  return typeof value === 'number' ? `${value}rpx` : value;
}

function toPayload(item: NotifyItem): SnNotifyOpenPayload {
  return { id: item.id, title: item.title, description: item.description, type: item.type };
}

/** Drop the deepest cards beyond `maxVisible` (reason `overflow`). */
function trimOverflow(): void {
  const active = items.value.filter((item) => item.state !== 'leave');
  let excess = active.length - props.maxVisible;
  if (excess <= 0) return;
  for (let index = items.value.length - 1; index >= 0 && excess > 0; index -= 1) {
    const item = items.value[index]!;
    if (item.state === 'leave') continue;
    clearDismissTimer(item.id);
    items.value.splice(index, 1);
    emit('close', { id: item.id, reason: 'overflow' });
    excess -= 1;
  }
}

/** Dismiss one message; the leave animation runs before the node is dropped. */
function hide(id: string): void {
  dismiss(id, 'api');
}

function hideAll(): void {
  for (const item of [...items.value]) {
    if (item.state !== 'leave') dismiss(item.id, 'api');
  }
}

function dismiss(id: string, reason: SnNotifyClosePayload['reason']): void {
  const index = items.value.findIndex((item) => item.id === id);
  if (index < 0) return;
  const item = items.value[index]!;
  if (item.state === 'leave') return;
  clearDismissTimer(id);
  emit('close', { id, reason });
  item.state = 'leave';
  applyGeometry();
  const timer = setTimeout(() => {
    leaveTimers.delete(id);
    const gone = items.value.findIndex((queued) => queued.id === id);
    if (gone >= 0) items.value.splice(gone, 1);
    applyGeometry();
  }, LEAVE_MS);
  leaveTimers.set(id, timer);
}

/* ── Swipe-to-dismiss (front card) ─────────────────────────────────────── */

interface DragState {
  id: string;
  startX: number;
  startY: number;
  axis: '' | 'x' | 'y';
}

let drag: DragState | null = null;

interface TouchLike {
  clientX: number;
  clientY: number;
}

function touchOf(event: unknown): TouchLike | null {
  const touches = (event as { touches?: TouchLike[] })?.touches;
  return touches !== undefined && touches.length > 0 ? touches[0]! : null;
}

function onTouchStart(item: NotifyItem, index: number, event: TouchEvent): void {
  if (index !== 0 || !props.swipeToDismiss || item.state !== 'active') return;
  const touch = touchOf(event);
  if (touch === null) return;
  drag = { id: item.id, startX: touch.clientX, startY: touch.clientY, axis: '' };
  clearDismissTimer(item.id);
  item.dragging = true;
}

function onTouchMove(item: NotifyItem, index: number, event: TouchEvent): void {
  if (drag === null || drag.id !== item.id || index !== 0) return;
  const touch = touchOf(event);
  if (touch === null) return;
  const dx = touch.clientX - drag.startX;
  const dy = touch.clientY - drag.startY;
  if (drag.axis === '' && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
    drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  }
  if (drag.axis === 'x') item.dragX = dx;
}

function onTouchEnd(item: NotifyItem, index: number): void {
  if (drag === null || drag.id !== item.id || index !== 0) return;
  drag = null;
  item.dragging = false;
  const travel = item.dragX;
  if (Math.abs(travel) > SWIPE_THRESHOLD_PX) {
    // Fling: push the card beyond the viewport edge, then let the leave
    // timer drop it. `dragX` stays so the leave transform keeps the fling.
    item.dragX = Math.sign(travel) * readViewport().width;
    dismiss(item.id, 'swipe');
    return;
  }
  item.dragX = 0;
  armTimer(item);
}

function onTouchCancel(item: NotifyItem, index: number): void {
  if (drag === null || drag.id !== item.id) return;
  drag = null;
  item.dragging = false;
  item.dragX = 0;
  armTimer(item);
}

/* ── Template bindings ─────────────────────────────────────────────────── */

function onCardTap(item: NotifyItem, index: number): void {
  if (index !== 0 || item.state === 'leave') return;
  emit('click', toPayload(item));
}

function onCloseTap(item: NotifyItem): void {
  dismiss(item.id, 'close');
}

const rootClass = computed(() => [
  'sn-notify',
  `sn-notify--${props.position}`,
  deck.value ? 'sn-notify--deck' : 'sn-notify--flow',
  props.customClass,
]);

/**
 * Status-bar inset (px) — the card clears the clock / notch but still floats
 * above the page navbar by design. WeChat MP and App both report the real
 * height through getSystemInfoSync; H5 reports none and stays flat.
 */
function autoTopInset(): number {
  const host = resolveUniHost<{ getSystemInfoSync?: () => { statusBarHeight?: number } }>();
  try {
    const statusBar = host?.getSystemInfoSync?.()?.statusBarHeight ?? 0;
    return typeof statusBar === 'number' && statusBar > 0 ? statusBar : 0;
  } catch {
    return 0;
  }
}

const rootStyle = computed(() => {
  const parts = [`z-index: ${props.zIndex}`];
  if (props.position === 'top') {
    if (typeof props.safeHeight === 'string' && props.safeHeight !== '') {
      // Full manual override — replaces the auto safe-area inset entirely.
      parts.push(`padding-top: ${props.safeHeight}`);
    } else {
      const inset =
        (props.safeAreaInsetTop ? autoTopInset() : 0) +
        (typeof props.safeHeight === 'number' ? props.safeHeight : 0);
      // > 0 only off H5 / with an explicit offset; otherwise the 16rpx class
      // padding keeps the verified flat rhythm. The inline value must carry
      // the breathing room itself — it replaces the class padding.
      if (inset > 0) parts.push(`padding-top: ${inset + rpxToPx(16)}px`);
    }
  }
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});

/** Off-screen transform of one card (px in deck mode, % in flow mode). */
function offscreenTransform(item: NotifyItem): string {
  if (deck.value) {
    const anchor = stackRect.value;
    if (props.position === 'top') {
      const top = (anchor?.top ?? 0) + item.offset + item.height;
      return `translateY(${-top}px)`;
    }
    const drop = viewportHeight.value - (anchor?.bottom ?? 0) + item.height + 12;
    return `translateY(${drop}px)`;
  }
  return `translateY(${props.position === 'top' ? '-160%' : '160%'})`;
}

function restingTransform(item: NotifyItem): string {
  const y = props.position === 'top' ? item.offset : -item.offset;
  return `translateY(${y}px) translateX(${item.dragX}px)`;
}

function itemTransform(item: NotifyItem): string {
  if (item.state === 'pre') return `translateY(0px) translateX(0px)`;
  if (item.state === 'enter') return offscreenTransform(item);
  if (item.state === 'active') return restingTransform(item);
  // leave: a swipe keeps the resting Y and flings X; other reasons slide the
  // card back out through the screen edge it came from.
  return Math.abs(item.dragX) > SWIPE_THRESHOLD_PX ? restingTransform(item) : offscreenTransform(item);
}

function itemClass(item: NotifyItem): string[] {
  return [
    'sn-notify__card',
    `sn-notify__card--${item.type}`,
    `sn-notify__card--${item.state}`,
    item.customClass,
  ];
}

function itemStyle(item: NotifyItem): string {
  const parts = [`z-index: ${item.z}`, `transform: ${itemTransform(item)}`];
  if (item.state === 'pre' || item.state === 'enter' || item.state === 'leave') {
    parts.push('opacity: 0');
  }
  if (item.state === 'pre' || item.state === 'enter' || item.dragging) {
    parts.push('transition-property: none');
  }
  if (item.background) parts.push(`background-color: ${item.background}`);
  if (item.radius) parts.push(`border-radius: ${item.radius}`);
  if (item.customStyle) parts.push(item.customStyle);
  return parts.join('; ');
}

const descriptionLines = (item: NotifyItem): string[] => String(item.description ?? '').split('\n');

function titleStyle(item: NotifyItem): string | undefined {
  return item.color ? `color: ${item.color}` : undefined;
}

onBeforeUnmount(() => {
  drag = null;
  clearAllTimers();
});

/** Template refs receive exactly this surface — script setup is closed
 * without it, so `notify.value?.show(...)` would hit an empty proxy. */
defineExpose<SnNotifyInstance>({ show, hide, hideAll });
</script>

<template>
  <view data-snui-component="notify" :class="rootClass" :style="rootStyle">
    <view class="sn-notify__stack">
      <view
        v-for="(item, index) in items"
        :id="item.id"
        :key="item.id"
        :class="itemClass(item)"
        :style="itemStyle(item)"
        role="alert"
        aria-live="assertive"
        @tap="onCardTap(item, index)"
        @touchstart="onTouchStart(item, index, $event)"
        @touchmove="onTouchMove(item, index, $event)"
        @touchend="onTouchEnd(item, index)"
        @touchcancel="onTouchCancel(item, index)"
      >
        <slot name="card" :item="{ id: item.id, title: item.title, description: item.description, type: item.type }">
          <view v-if="item.icon" class="sn-notify__icon" aria-hidden="true">
            <SnIcon :icon="item.icon" :size="40" />
          </view>

          <view class="sn-notify__content">
            <text class="sn-notify__title" :style="titleStyle(item)">{{ item.title }}</text>
            <template v-if="item.description">
              <text
                v-for="(line, lineIndex) in descriptionLines(item)"
                :key="lineIndex"
                class="sn-notify__description"
              >{{ line }}</text>
            </template>
          </view>

          <view
            v-if="item.closable"
            class="sn-notify__close"
            :class="{ 'sn-notify__close--icon-only': !item.closeText }"
            role="button"
            aria-label="close"
            @tap.stop="onCloseTap(item)"
          >
            <SnIcon v-if="!item.closeText" :icon="XIcon" :size="28" />
            <text v-else class="sn-notify__close-text">{{ item.closeText }}</text>
          </view>
        </slot>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-notify {
  position: fixed;
  left: 0;
  right: 0;
  box-sizing: border-box;
  /* Deck cards hang below/above the ~0-height container; the uni H5 runtime
   * styles `uni-view { overflow: hidden }` by default, which would clip the
   * stack to the container's padding strip. */
  overflow: visible;
  pointer-events: none;
}

.sn-notify--top {
  top: 0;
  padding: 16rpx 32rpx 0;
}

.sn-notify--bottom {
  bottom: 0;
  padding: 0 32rpx 24rpx;
}

/* ── Stack: flow column by default, absolute deck once measured ───────── */

.sn-notify__stack {
  position: relative;
  display: flex;
  flex-direction: column;
  /* Same H5-runtime clipping guard as the container — the deck cards live
   * outside the stack's 0-height box in deck mode. */
  overflow: visible;
  gap: var(--sn-mp-spacing-3);
}

.sn-notify--bottom .sn-notify__stack {
  flex-direction: column-reverse;
}

.sn-notify--deck .sn-notify__card {
  position: absolute;
  left: 0;
  right: 0;
}

.sn-notify--deck.sn-notify--top .sn-notify__card {
  top: 0;
}

.sn-notify--deck.sn-notify--bottom .sn-notify__card {
  bottom: 0;
}

/* ── Card ──────────────────────────────────────────────────────────────── */

.sn-notify__card {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--sn-mp-spacing-4);
  padding: var(--sn-mp-spacing-5);
  border-radius: 32rpx;
  background-color: var(--sn-mp-color-background-elevated);
  box-shadow: var(--sn-mp-shadow-lg);
  pointer-events: auto;
  transition-property: transform, opacity;
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ── Content ───────────────────────────────────────────────────────────── */

.sn-notify__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin-top: 4rpx;
  color: var(--sn-mp-color-text-primary);
}

.sn-notify__card--primary .sn-notify__icon {
  color: var(--sn-mp-color-action-primary);
}

.sn-notify__card--success .sn-notify__icon {
  color: var(--sn-mp-color-feedback-success);
}

.sn-notify__card--warning .sn-notify__icon {
  color: var(--sn-mp-color-feedback-warning);
}

.sn-notify__card--danger .sn-notify__icon {
  color: var(--sn-mp-color-feedback-danger);
}

.sn-notify__content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.sn-notify__title {
  font-size: var(--sn-mp-font-size-lg);
  font-weight: 600;
  line-height: 44rpx;
  color: var(--sn-mp-color-text-primary);
}

.sn-notify__card--primary .sn-notify__title {
  color: var(--sn-mp-color-action-primary);
}

.sn-notify__card--success .sn-notify__title {
  color: var(--sn-mp-color-feedback-success);
}

.sn-notify__card--warning .sn-notify__title {
  color: var(--sn-mp-color-feedback-warning);
}

.sn-notify__card--danger .sn-notify__title {
  color: var(--sn-mp-color-feedback-danger);
}

.sn-notify__description {
  margin-top: var(--sn-mp-spacing-2);
  font-size: var(--sn-mp-font-size-md);
  line-height: 40rpx;
  color: var(--sn-mp-color-text-secondary);
}

/* ── Close pill ────────────────────────────────────────────────────────── */

.sn-notify__close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  height: 64rpx;
  padding: 0 var(--sn-mp-spacing-5);
  border-radius: var(--sn-mp-radius-xl);
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-primary);
}

/* `closeText: ''` — icon-only pill (bare X glyph, custom-card look). */
.sn-notify__close--icon-only {
  width: 64rpx;
  padding: 0;
}

.sn-notify__close-text {
  font-size: var(--sn-mp-font-size-md);
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}

.sn-notify__card--primary .sn-notify__close {
  background-color: var(--sn-mp-color-action-primary);
}

.sn-notify__card--success .sn-notify__close {
  background-color: var(--sn-mp-color-feedback-success);
}

.sn-notify__card--warning .sn-notify__close {
  background-color: var(--sn-mp-color-feedback-warning);
}

.sn-notify__card--danger .sn-notify__close {
  background-color: var(--sn-mp-color-feedback-danger);
}
</style>
