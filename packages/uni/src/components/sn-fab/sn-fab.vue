<script setup lang="ts">
/**
 * sn-fab (uni-end) — floating action button with an expanding action menu.
 *
 * Reference library: wot-ui `wd-fab`
 *   (https://wot-ui.cn/component/fab.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-fab 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-fab/sn-fab.vue
 * → auto-registered as `<sn-fab>` in any .vue that uses it.
 *
 * ## Dragging (AGENTS.md §41 — no `window` / `document`)
 *
 * `draggable` is implemented with uni's own gesture events (`@touchstart` /
 * `@touchmove` / `@touchend` on the trigger), not with `window` listeners or
 * `document.body` measurement. The delta is accumulated in component state and
 * applied as a `translate` offset, clamped to `gap` from the screen edges using
 * `uni.getSystemInfoSync()` when available (falling back to the trigger's own
 * position). No listener is registered globally, so nothing leaks; the only
 * teardown needed is resetting the offset state.
 *
 * ## Documented divergences from wd-fab
 *
 *   - `top` / `bottom` / `left` / `right` are per-instance offsets overriding
 *     the matching side of `gap`, exactly like the reference.
 *   - Drag does not "stick" to an edge after release (the reference snaps);
 *     the offset is kept where the user left it, clamped inside the viewport.
 *   - `direction` additionally accepts `up` / `down` (additive aliases of
 *     `top` / `bottom`, AUI-OPT-02) and the root lays the menu out strictly
 *     along the chosen direction — even for side-centred anchors, where the
 *     reference layout used to force a horizontal stack.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 页面级导航 / 路由 — 由宿主 AppBridge 决定
 *   - 侧边栏菜单 — 用 sn-sidebar
 */

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';
import { registerOutsideClosable, unregisterOutsideClosable } from '../../utils/outside-close';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';
import { Plus as PlusIcon, X as XIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnFab' });

const instanceId = getCurrentInstance()?.uid ?? 0;
// Outside-close queue: a page-root `@tap="closeOutside"` closes this too.
onMounted(() =>
  registerOutsideClosable(instanceId, () => {
    if (props.active) emit('update:active', false);
  }),
);
onBeforeUnmount(() => unregisterOutsideClosable(instanceId));

/** Color theme. Mirrors `wd-fab` `type`. */
type FabType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

/** Anchor preset. Mirrors `wd-fab` `position`. */
type FabPosition =
  | 'left-top'
  | 'right-top'
  | 'left-bottom'
  | 'right-bottom'
  | 'left-center'
  | 'right-center'
  | 'top-center'
  | 'bottom-center';

/**
 * Menu expansion direction. Mirrors `wd-fab` `direction`; `up` / `down` are
 * additive aliases (AUI-OPT-02) that normalize to `top` / `bottom`, which
 * stay accepted for backward compatibility (AGENTS.md §78).
 */
type FabDirection = 'up' | 'down' | 'left' | 'right' | 'top' | 'bottom';

/** Per-edge gap. Mirrors `wd-fab` `gap`. */
export interface SnFabGap {
  /** Distance from the top edge. */
  top?: number;
  /** Distance from the right edge. */
  right?: number;
  /** Distance from the bottom edge. */
  bottom?: number;
  /** Distance from the left edge. */
  left?: number;
}

const DEFAULT_GAP: Required<SnFabGap> = { top: 16, right: 16, bottom: 16, left: 16 };

const props = withDefaults(
  defineProps<{
    /** Whether the menu is expanded (v-model:active). */
    active?: boolean;
    /** Color theme. */
    type?: FabType;
    /** Anchor preset. */
    position?: FabPosition;
    /** Allow dragging the trigger. */
    draggable?: boolean;
    /** Menu expansion direction (`up` / `down` alias `top` / `bottom`). */
    direction?: FabDirection;
    /** Disable the whole button. */
    disabled?: boolean;
    /** Icon while collapsed (registry name). */
    inactiveIcon?: string;
    /** Icon while expanded (registry name). */
    activeIcon?: string;
    /** Stacking level. */
    zIndex?: number;
    /** Default gap from each screen edge. */
    gap?: SnFabGap;
    /** Expand the menu on tap; `false` emits `click` instead. */
    expandable?: boolean;
    /** Explicit distance from the top edge (overrides `gap.top`). */
    top?: number | undefined;
    /** Explicit distance from the bottom edge (overrides `gap.bottom`). */
    bottom?: number | undefined;
    /** Explicit distance from the left edge (overrides `gap.left`). */
    left?: number | undefined;
    /** Explicit distance from the right edge (overrides `gap.right`). */
    right?: number | undefined;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    active: false,
    type: 'primary',
    position: 'right-bottom',
    draggable: false,
    direction: 'up',
    disabled: false,
    inactiveIcon: 'plus',
    activeIcon: 'close',
    zIndex: 99,
    // Literal, not `{ ...DEFAULT_GAP }`: `defineProps()` is hoisted out of
    // `setup()`, so it cannot reference a module-local binding.
    gap: () => ({ top: 16, right: 16, bottom: 16, left: 16 }),
    expandable: true,
    top: undefined,
    bottom: undefined,
    left: undefined,
    right: undefined,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** The action items, rendered inside the expandable menu. */
  default?(): unknown;
  /** Fully custom trigger content (replaces the icon). */
  trigger?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:active', value: boolean): void;
  (e: 'click'): void;
}>();

/** Drag offset accumulated from the touch gesture. */
const dragX = ref(0);
const dragY = ref(0);
/** Touch origin of the running gesture. */
let startX = 0;
let startY = 0;
let startOffsetX = 0;
let startOffsetY = 0;

/** Resolve a trigger icon: the built-in pair, or a registry name. */
function resolveTriggerIcon(name: string, expanded: boolean): IconData {
  if (name === 'plus') return expanded ? XIcon : PlusIcon;
  if (name === 'close') return expanded ? XIcon : PlusIcon;
  return resolveIconByName(name) ?? (expanded ? XIcon : PlusIcon);
}

const triggerIcon = computed(() =>
  resolveTriggerIcon(props.active ? props.activeIcon : props.inactiveIcon, props.active),
);

/**
 * Trigger glyph size rides the icon-size token (40rpx ≈ 0.42 of the 96rpx
 * trigger) instead of a hard-coded pixel box, so it follows the theme's
 * icon scale (AGENTS.md §34 — no hard-coded geometry).
 */
const TRIGGER_ICON_SIZE = 'var(--sn-mp-icon-size-large)';

/** Canonical direction: `up` / `down` normalize to `top` / `bottom`. */
const resolvedDirection = computed<'top' | 'bottom' | 'left' | 'right'>(() => {
  if (props.direction === 'up') return 'top';
  if (props.direction === 'down') return 'bottom';
  return props.direction;
});

/** Resolved edge gaps (per-side props win over `gap`). */
const resolvedGap = computed(() => ({
  top: props.top ?? props.gap.top ?? DEFAULT_GAP.top,
  right: props.right ?? props.gap.right ?? DEFAULT_GAP.right,
  bottom: props.bottom ?? props.gap.bottom ?? DEFAULT_GAP.bottom,
  left: props.left ?? props.gap.left ?? DEFAULT_GAP.left,
}));

/**
 * Anchor placement in px. One branch per `position` preset so the two
 * dimensions (edge + centring) stay readable — a single formula would need
 * four conditionals to express the same thing.
 */
const anchorStyle = computed(() => {
  const gap = resolvedGap.value;
  const parts: string[] = [];

  // The presets come in two shapes: '<side>-<edge>' (left-top, right-center…)
  // and '<edge>-center' (top-center, bottom-center). Split once and branch on
  // which segment carries the edge keyword.
  const [first, second] = props.position.split('-') as [string, string];

  if (first === 'top' || first === 'bottom') {
    parts.push(`${first}: ${first === 'top' ? gap.top : gap.bottom}px`);
    parts.push('left: 50%', 'transform: translateX(-50%)');
    return parts.join('; ');
  }

  if (first === 'left' || first === 'right') {
    parts.push(`${first}: ${first === 'left' ? gap.left : gap.right}px`);
  }

  if (second === 'top') parts.push(`top: ${gap.top}px`);
  else if (second === 'bottom') parts.push(`bottom: ${gap.bottom}px`);
  else parts.push('top: 50%', 'transform: translateY(-50%)');

  return parts.join('; ');
});

const rootClass = computed(() => [
  'sn-fab',
  `sn-fab--${props.position}`,
  `sn-fab--${resolvedDirection.value}`,
  {
    'sn-fab--active': props.active,
    'sn-fab--disabled': props.disabled,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts = [`z-index: ${props.zIndex}`];
  const offset = dragStyle.value;
  if (offset) parts.push(offset);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});

const dragStyle = computed(() => {
  if (!props.draggable) return '';
  if (dragX.value === 0 && dragY.value === 0) return '';
  return `transform: translate(${dragX.value}px, ${dragY.value}px)`;
});

const triggerClass = computed(() => [
  'sn-fab__trigger',
  `sn-fab__trigger--${props.type}`,
  { 'sn-fab__trigger--active': props.active },
]);

const menuClass = computed(() => [
  'sn-fab__menu',
  `sn-fab__menu--${resolvedDirection.value}`,
  { 'sn-fab__menu--open': props.active },
]);

function toggle(): void {
  if (props.disabled) return;
  if (!props.expandable) {
    emit('click');
    return;
  }
  emit('update:active', !props.active);
}

function onTouchStart(event: TouchEvent): void {
  if (!props.draggable) return;
  const touch = event.touches[0];
  if (!touch) return;
  startX = touch.clientX;
  startY = touch.clientY;
  startOffsetX = dragX.value;
  startOffsetY = dragY.value;
}

function onTouchMove(event: TouchEvent): void {
  if (!props.draggable) return;
  const touch = event.touches[0];
  if (!touch) return;
  dragX.value = startOffsetX + (touch.clientX - startX);
  dragY.value = startOffsetY + (touch.clientY - startY);
}

function onTouchEnd(): void {
  if (!props.draggable) return;
  // Clamp into the viewport with the same `gap` the anchor uses, so the
  // trigger can never be dragged fully off-screen. `uni.getSystemInfoSync()`
  // is the only cross-end viewport query; it is optional and guarded.
  const host = globalThis as {
    uni?: { getSystemInfoSync?: () => { windowWidth?: number; windowHeight?: number } };
  };
  let info: { windowWidth?: number; windowHeight?: number } | undefined;
  try {
    info = host.uni?.getSystemInfoSync?.();
  } catch {
    // A host that rejects the probe must not break the gesture (same stance as
    // `vibrateShort` above) — the offset simply stays unclamped.
    info = undefined;
  }
  const viewportW = info?.windowWidth;
  const viewportH = info?.windowHeight;
  if (typeof viewportW !== 'number' || typeof viewportH !== 'number') return;
  const gap = resolvedGap.value;
  const maxX = Math.max(0, viewportW - gap.left - gap.right);
  const maxY = Math.max(0, viewportH - gap.top - gap.bottom);
  dragX.value = Math.min(maxX, Math.max(-maxX, dragX.value));
  dragY.value = Math.min(maxY, Math.max(-maxY, dragY.value));
}
</script>

<template>
  <view data-snui-component="fab" :class="rootClass" :style="`${rootStyle}; ${anchorStyle}`">
    <view :class="menuClass" :aria-hidden="active ? 'false' : 'true'">
      <slot />
    </view>

    <view
      :class="triggerClass"
      role="button"
      :aria-expanded="active ? 'true' : 'false'"
      :aria-disabled="disabled ? 'true' : 'false'"
      @tap="toggle"
      @touchstart="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
    >
      <slot name="trigger">
        <SnIcon :icon="triggerIcon" :size="TRIGGER_ICON_SIZE" />
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-fab {
  position: fixed;
  display: flex;
  align-items: center;
  /* 24rpx：菜单与触发按钮的净距。此前 16rpx 加上方向偏移的样式缺陷
   * （见下 --open 规则），弹出的动作项会被按钮盖住一角。 */
  gap: var(--sn-mp-spacing-4);
  box-sizing: border-box;
}

/* ── Trigger ──────────────────────────────────────────────────────────── */

.sn-fab__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  border-radius: var(--sn-mp-radius-full);
  box-shadow: var(--sn-mp-shadow-lg);
  color: var(--sn-mp-color-text-on-primary);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.sn-fab__trigger--active {
  transform: rotate(90deg);
}

.sn-fab--disabled .sn-fab__trigger {
  opacity: 0.5;
}

.sn-fab__trigger--primary {
  background-color: var(--sn-mp-color-action-primary);
}
.sn-fab__trigger--success {
  background-color: var(--sn-mp-color-feedback-success);
}
.sn-fab__trigger--info {
  background-color: var(--sn-mp-color-feedback-info);
}
.sn-fab__trigger--warning {
  background-color: var(--sn-mp-color-feedback-warning);
}
.sn-fab__trigger--danger {
  background-color: var(--sn-mp-color-feedback-danger);
}

/* ── Menu ─────────────────────────────────────────────────────────────── */

.sn-fab__menu {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    visibility 0.2s ease;
}

.sn-fab__menu--open {
  opacity: 1;
  visibility: visible;
}

/* 展开态必须取消方向规则的收起偏移。方向规则与 --open 同为单类选择器、
 * 且声明在 --open 之后（同特异性按源顺序取胜），展开后的菜单会一直带着
 * 24rpx 朝按钮的位移——四个方向的动作项都被触发按钮盖住一角。复合
 * 选择器（0,2,0）恒压过任何方向规则，与源顺序无关。 */
.sn-fab__menu.sn-fab__menu--open {
  transform: translate(0, 0);
}

/* Direction: the menu stacks away from the trigger and slides out along the
 * same axis while fading in (collapsed it starts offset toward the trigger). */
.sn-fab__menu--top {
  flex-direction: column-reverse;
  transform: translateY(var(--sn-mp-spacing-4));
}
.sn-fab__menu--bottom {
  flex-direction: column;
  transform: translateY(calc(-1 * var(--sn-mp-spacing-4)));
}
.sn-fab__menu--right {
  flex-direction: row;
  transform: translateX(calc(-1 * var(--sn-mp-spacing-4)));
}
.sn-fab__menu--left {
  flex-direction: row-reverse;
  transform: translateX(var(--sn-mp-spacing-4));
}

/* Direction decides which side of the trigger the menu grows from; the
 * menu is the first DOM child, so the reversed flows put it below / to the
 * right of the trigger without touching the markup. */
.sn-fab--top {
  flex-direction: column;
}
.sn-fab--bottom {
  flex-direction: column-reverse;
}
.sn-fab--left {
  flex-direction: row;
}
.sn-fab--right {
  flex-direction: row-reverse;
}
</style>
