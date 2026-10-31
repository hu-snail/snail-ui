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
 *   - `mode: 'fan'` + `actions` + `fanRadius` (AUI-OPT-19): an arc-shaped
 *     expansion the reference does not have. Corner anchors bloom an oblique
 *     quadrant fan into the screen, edge-centre anchors a symmetric fan
 *     (bottom-center = the classic centre fan), with a staggered back-out
 *     animation. `actions` is a structured item source rendered by the
 *     component (MP-safe: per-item geometry must be inline style) and its
 *     items auto-close the fan on tap.
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
// The trigger therefore binds `@tap.stop` (outside-close contract) — without
// it the opening tap bubbles to the page root and instantly re-closes the
// menu, which reads as "the button does nothing".
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

/**
 * Expansion shape. `line` is the wd-fab stack (1:1 parity); `fan` arranges
 * the action items along an arc around the trigger — additive (AUI-OPT-19,
 * registered in AGENTS.md §112.3a).
 */
type FabMode = 'line' | 'fan';

/**
 * Fan-mode action item (additive, AUI-OPT-19 — wd-fab has no structured
 * action model; the default slot stays the line-mode contract).
 */
export interface SnFabAction {
  /** Icon: built-in registry name or an inline IconData object. */
  icon: string | IconData;
  /** Optional label — turns the item into an icon+text pill. */
  text?: string;
  /** Icon tint (CSS color; prefer `var(--sn-mp-color-*)` tokens). */
  color?: string;
  /** Disabled item: dimmed, taps blocked. */
  disabled?: boolean;
}

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
    /** Expansion shape: stack (`line`, wd-fab 1:1) or arc (`fan`, additive). */
    mode?: FabMode;
    /** Fan-mode action items (structured source; the slot is ignored in fan mode). */
    actions?: SnFabAction[];
    /** Fan radius in px — distance from the trigger centre to an item centre. */
    fanRadius?: number;
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
    mode: 'line',
    actions: () => [],
    fanRadius: 96,
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
  (e: 'action', action: SnFabAction, index: number): void;
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
/** Fan pill glyph rides the medium tier (matches the line-mode pill demos). */
const FAN_PILL_ICON_SIZE = 'var(--sn-mp-icon-size-medium)';
/** Fan bubble glyph rides the large tier (matches the direction demo). */
const FAN_BUBBLE_ICON_SIZE = 'var(--sn-mp-icon-size-large)';

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

/* ── Fan mode (additive, AUI-OPT-19) ─────────────────────────────────── */

const isFan = computed(() => props.mode === 'fan');

/**
 * Fan geometry per anchor preset. Screen coordinates: 0° = right, 90° =
 * down, 180° = left, 270° = up. Corner anchors open an oblique quadrant
 * fan (90° span) pointing into the screen; edge-centre anchors open a
 * symmetric half-plane fan (120° span) — `bottom-center` is the classic
 * centre fan spreading evenly around straight up.
 */
const FAN_GEOMETRY: Record<FabPosition, { center: number; span: number }> = {
  'left-top': { center: 45, span: 90 },
  'right-top': { center: 135, span: 90 },
  'right-bottom': { center: 225, span: 90 },
  'left-bottom': { center: 315, span: 90 },
  'top-center': { center: 90, span: 120 },
  'bottom-center': { center: 270, span: 120 },
  'left-center': { center: 0, span: 120 },
  'right-center': { center: 180, span: 120 },
};

/** Angular step between neighbouring items before the span cap kicks in. */
const FAN_STEP_DEG = 45;
/** Stagger between neighbouring items while the fan blooms open. */
const FAN_STAGGER_MS = 40;

/** Angle of each action item, evenly spread under the preset's span cap. */
const fanAngles = computed<number[]>(() => {
  const count = props.actions.length;
  if (count === 0) return [];
  const { center, span } = FAN_GEOMETRY[props.position];
  if (count === 1) return [center];
  const spread = Math.min(FAN_STEP_DEG * (count - 1), span);
  return Array.from({ length: count }, (_, i) => center - spread / 2 + (spread * i) / (count - 1));
});

/**
 * Inline style per fan item. Geometry is computed here (WXSS has no trig
 * functions) and applied as a transform; collapsed, every item rests on the
 * trigger centre so the fan visibly blooms out of the button. The
 * back-out easing in the class adds the overshoot that makes it silky.
 */
function fanItemStyle(action: SnFabAction, index: number): string {
  const radians = (fanAngles.value[index] ?? 0) * (Math.PI / 180);
  const open = props.active;
  const x = open ? Math.round(Math.cos(radians) * props.fanRadius * 100) / 100 : 0;
  const y = open ? Math.round(Math.sin(radians) * props.fanRadius * 100) / 100 : 0;
  const scale = open ? 1 : 0.4;
  const opacity = open ? (action.disabled ? 0.5 : 1) : 0;
  const delay = open ? index * FAN_STAGGER_MS : 0;
  const color = action.color === undefined ? '' : ` color: ${action.color};`;
  return (
    `transform: translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}); ` +
    `opacity: ${opacity}; visibility: ${open ? 'visible' : 'hidden'}; ` +
    `transition-delay: ${delay}ms;${color}`
  );
}

/** Icon-only items render as bubbles; labelled items as icon+text pills. */
function fanItemClass(action: SnFabAction): string[] {
  return [
    'sn-fab__fan-item',
    action.text === undefined ? 'sn-fab__fan-item--icon' : 'sn-fab__fan-item--pill',
  ];
}

function fanItemLabel(action: SnFabAction, index: number): string {
  if (action.text !== undefined && action.text !== '') return action.text;
  if (typeof action.icon === 'string') return action.icon;
  return `action-${index + 1}`;
}

function resolveActionIcon(action: SnFabAction): IconData {
  if (typeof action.icon === 'string') {
    return resolveIconByName(action.icon) ?? PlusIcon;
  }
  return action.icon;
}

function onActionTap(action: SnFabAction, index: number): void {
  if (action.disabled) return;
  emit('action', action, index);
  // Structured actions auto-close the fan. wd-fab's slot items stay manual
  // (the demo closes them itself) — documented divergence, AUI-OPT-19.
  if (props.active) emit('update:active', false);
}

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

const menuClass = computed(() =>
  isFan.value
    ? // Fan items position themselves; the container is a 0×0 anchor point
      // and must not inherit the line-mode direction offset / open fade.
      ['sn-fab__menu', 'sn-fab__menu--fan']
    : [
        'sn-fab__menu',
        `sn-fab__menu--${resolvedDirection.value}`,
        { 'sn-fab__menu--open': props.active },
      ],
);

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
      <template v-if="isFan">
        <view
          v-for="(action, index) in actions"
          :key="`${fanItemLabel(action, index)}-${index}`"
          :class="fanItemClass(action)"
          :style="fanItemStyle(action, index)"
          role="button"
          :aria-label="fanItemLabel(action, index)"
          :aria-disabled="action.disabled ? 'true' : 'false'"
          @tap="onActionTap(action, index)"
        >
          <SnIcon
            :icon="resolveActionIcon(action)"
            :size="action.text === undefined ? FAN_BUBBLE_ICON_SIZE : FAN_PILL_ICON_SIZE"
          />
          <text v-if="action.text !== undefined" class="sn-fab__fan-item-text">
            {{ action.text }}
          </text>
        </view>
      </template>
      <template v-else>
        <slot />
      </template>
    </view>

    <view
      :class="triggerClass"
      role="button"
      :aria-expanded="active ? 'true' : 'false'"
      :aria-disabled="disabled ? 'true' : 'false'"
      @tap.stop="toggle"
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

/* ── Fan mode (additive, AUI-OPT-19) ─────────────────────────────────── */

/* The container is a 0×0 anchor point at the trigger centre; items are
 * absolutely positioned and fly out along the arc via inline transforms
 * (per-item geometry + stagger are computed in JS — WXSS has no trig).
 * Declared after the line-mode rules so it wins the closed-state
 * opacity/visibility of the shared `.sn-fab__menu` base. */
.sn-fab__menu--fan {
  position: absolute;
  left: 50%;
  top: 50%;
  display: block;
  width: 0;
  height: 0;
  opacity: 1;
  visibility: visible;
}

.sn-fab__fan-item {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  height: 72rpx;
  padding: 0 var(--sn-mp-spacing-5);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-elevated);
  box-shadow: var(--sn-mp-shadow-sm);
  opacity: 0;
  visibility: hidden;
  /* Back-out overshoot = the silky bloom; the geometry and the per-item
   * stagger delay arrive via inline style (fanItemStyle). */
  transition:
    transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.2s ease,
    visibility 0s linear;
  will-change: transform;
}

/* Icon-only bubble variant (labelled items keep the pill box above). */
.sn-fab__fan-item--icon {
  width: 88rpx;
  height: 88rpx;
  padding: 0;
  justify-content: center;
}

.sn-fab__fan-item-text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-primary);
  /* 动作项绝对定位在 0×0 锚点容器内：width:auto 收缩到 min-content，
   * CJK 文案会被逐字换行。nowrap 令最小内容宽度 = 整行，胶囊恢复
   * 「图标 + 文字」的自然宽度。 */
  white-space: nowrap;
}
</style>
