<script setup lang="ts">
/**
 * SnFloatButtonGroup — collapsible stack of `<SnFloatButton>` children
 * sharing one fixed corner.
 *
 * Reference library: Ant Design Vue `FloatButton.Group`
 *   (https://antdv.com/components/float-button).
 * **Explicit divergence from the naive-ui 1:1 rule**: naive-ui has NO float
 * button (and therefore no float button group), so per the parity rule this
 * component mirrors Ant Design Vue `FloatButton.Group` instead — the same
 * registration style SnComment uses for the data-display batch:
 *   shape / open (v-model:open) / trigger ('click' | 'hover') / placement /
 *   right / bottom / top / left / zIndex / gap; slots: default (the stacked
 *   `SnFloatButton` children) + trigger (replaces the built-in trigger).
 *
 * Divergences from the Ant Design Vue source (documented, not accidental):
 *   - The reference renders the children inside a `FloatButton` wrapper whose
 *     icon is either `CloseOutlined` / `MenuOutlined` or a custom `icon`. Here
 *     the trigger is a plain `<SnFloatButton>` whose glyph (`triggerIcon`,
 *     default `Plus`) rotates 45° while open, matching the reference's
 *     `CloseOutlined` behaviour without pinning a close glyph.
 *   - `triggerTooltip` sets the native `title` + the accessible name on the
 *     trigger; no tooltip component is pulled in (same policy as
 *     `SnFloatButton.tooltip`).
 *   - `gap` replaces the reference's fixed 12px vertical rhythm (the
 *     reference hard-codes it in the less source).
 *   - The trigger always toggles on click, whatever `trigger` is; `hover`
 *     additionally opens on `mouseenter` and closes on `mouseleave`.
 *   - `hover` installs a document-level `mousemove` guard so the stack also
 *     collapses when the pointer leaves it without a `mouseleave` (e.g. the
 *     pointer moved over an overlay). The listener is removed as soon as the
 *     stack closes and on unmount (AGENTS.md §41).
 *
 * The group owns the fixed position for itself AND its children: it provides
 * `sn-float-button-group` (shape) and each child renders `position: static` /
 * full width. Children keep working standalone — the inject has a `null`
 * fallback and each child positions itself when no group is present.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnFloatButtonGroup v-model:open="open" trigger="hover">
 *     <SnFloatButton :icon="FileText" tooltip="文档" />
 *     <SnFloatButton :icon="Share2" tooltip="分享" />
 *   </SnFloatButtonGroup>
 */

import { computed, markRaw, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import type { ComputedRef, CSSProperties } from 'vue';
import { Plus } from 'lucide-vue-next';
import SnIcon from '../icon/SnIcon.vue';
import SnFloatButton from './SnFloatButton.vue';
import type { SnFloatButtonGroupDirection, SnFloatButtonPlacement } from './SnFloatButton.vue';
import type { IconComponent } from '../icon/sn-icon-registry';

defineOptions({ name: 'SnFloatButtonGroup' });

type SnFloatButtonGroupShape = 'circle' | 'square';
type SnFloatButtonGroupPlacement = SnFloatButtonPlacement;

/**
 * Shape contract handed down to every child `SnFloatButton` through
 * provide/inject. Structural twin of the interface declared in
 * `SnFloatButton.vue` — kept local so the two files share no module.
 */
interface SnFloatButtonGroupContext {
  /** Group-level shape; overrides each child's own `shape` prop. */
  shape: ComputedRef<SnFloatButtonGroupShape>;
}

/** Injection key shared with `SnFloatButton` (string key, like SnCollapse). */
const FLOAT_BUTTON_GROUP_KEY = 'sn-float-button-group';

/** Distance from the viewport edge that `placement` falls back to. */
const DEFAULT_OFFSET = '24px';

/** Size passed to the trigger glyph. */
const TRIGGER_ICON_SIZE = 18;

const props = withDefaults(
  defineProps<{
    /** Shape handed to every child; overrides each child's own `shape` prop. */
    shape?: SnFloatButtonGroupShape;
    /** Controlled open state (`v-model:open`). Uncontrolled when omitted. */
    open?: boolean;
    /** Gesture that opens the stack. */
    trigger?: 'click' | 'hover';
    /** Fixed corner of the group (and therefore of its children). */
    placement?: SnFloatButtonGroupPlacement;
    /**
     * Which way the stack opens from the trigger. `'auto'` (default) derives it
     * from `placement` — the stack always grows towards the viewport centre, so
     * a bottom-corner group opens upwards and a left-edge group opens
     * rightwards. Set it explicitly to override.
     */
    direction?: SnFloatButtonGroupDirection;
    /** Explicit distance from the viewport right edge; overrides `placement`. */
    right?: number | string;
    /** Explicit distance from the viewport bottom edge; overrides `placement`. */
    bottom?: number | string;
    /** Explicit distance from the viewport top edge; overrides `placement`. */
    top?: number | string;
    /** Explicit distance from the viewport left edge; overrides `placement`. */
    left?: number | string;
    /** Stacking order of the fixed root. */
    zIndex?: number;
    /**
     * `false` pins the group to its nearest positioned ancestor instead of the
     * viewport (or to `container` when one is given).
     */
    fixed?: boolean;
    /** Explicit positioning context (selector or element) for `fixed: false`. */
    container?: string | HTMLElement | undefined;
    /** Vertical gap between the stacked children (and to the trigger). */
    gap?: number;
    /**
     * Trigger glyph component. Rotated 45° while open.
     *
     * Deliberately absent from the `withDefaults` object below: `IconComponent`
     * is a function type behind an imported alias, so the SFC compiler cannot
     * infer `type: Function` and Vue would treat a function-valued default as
     * a *factory* and call the icon component itself. `resolvedTriggerIcon`
     * applies the `Plus` fallback instead.
     */
    triggerIcon?: IconComponent | undefined;
    /**
     * Sets the trigger's native `title` and accessible name. The explicit
     * `| undefined` is required by `exactOptionalPropertyTypes` because the
     * value is forwarded to the child `SnFloatButton` in the template.
     */
    triggerTooltip?: string | undefined;
  }>(),
  {
    shape: 'circle',
    trigger: 'click',
    placement: 'bottom-right',
    zIndex: 1000,
    gap: 12,
    /*
     * `open: undefined` is load-bearing, not noise. Vue's boolean-prop
     * casting turns an *absent* `Boolean` prop into `false`, which would
     * make "uncontrolled" indistinguishable from "controlled closed" and
     * freeze `mergedOpen` at `false`. Declaring an explicit `undefined`
     * default marks the prop as having a default, which disables the cast —
     * the same trick SnBackTop uses for its `show` prop.
     */
    open: undefined as any,
  },
);

const emit = defineEmits<{
  /** The open state changed (`v-model:open`). */
  (e: 'update:open', value: boolean): void;
  /** The open state changed (event-style alias). */
  (e: 'openChange', value: boolean): void;
}>();

defineSlots<{
  /** The `SnFloatButton` children — stacked above the trigger. */
  default?(): unknown;
  /** Replaces the built-in trigger button entirely. */
  trigger?(): unknown;
}>();

// ---------- Open state ----------

/** Uncontrolled open state, used while the `open` prop is omitted. */
const uncontrolledOpen = ref(false);

/** Effective open state: the `open` prop wins when provided. */
const mergedOpen = computed(() => (props.open === undefined ? uncontrolledOpen.value : props.open));

function setOpen(value: boolean): void {
  const changed = value !== mergedOpen.value;
  if (props.open === undefined) uncontrolledOpen.value = value;
  if (!changed) return;
  emit('update:open', value);
  emit('openChange', value);
}

function toggle(): void {
  setOpen(!mergedOpen.value);
}

// ---------- Provide (shape + "the group owns positioning") ----------

const groupShape = computed<SnFloatButtonGroupShape>(() => props.shape);

provide<SnFloatButtonGroupContext>(FLOAT_BUTTON_GROUP_KEY, { shape: groupShape });

// ---------- Positioning (8 anchors, shared model with SnFloatButton) ----------

function formatLength(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Where the group's root pins. Same eight anchors as `SnFloatButton`: corners
 * pin both axes, edge midpoints pin their own axis and centre the box on the
 * other one via `50%` + a `translate`.
 */
interface ResolvedGroupPlacement {
  style: CSSProperties;
  translateX: string;
  translateY: string;
}

function resolveGroupPlacement(): ResolvedGroupPlacement {
  const style: CSSProperties = {
    position: props.fixed ? 'fixed' : 'absolute',
    zIndex: props.zIndex,
  };

  if (props.top !== undefined) style.top = formatLength(props.top);
  if (props.bottom !== undefined) style.bottom = formatLength(props.bottom);
  if (props.left !== undefined) style.left = formatLength(props.left);
  if (props.right !== undefined) style.right = formatLength(props.right);

  const hasVertical = props.top !== undefined || props.bottom !== undefined;
  const hasHorizontal = props.left !== undefined || props.right !== undefined;

  const placement = props.placement;
  const isTop = placement === 'top-left' || placement === 'top-right' || placement === 'top';
  const isBottom =
    placement === 'bottom-left' || placement === 'bottom-right' || placement === 'bottom';
  const isLeft = placement === 'top-left' || placement === 'bottom-left' || placement === 'left';
  const isRight =
    placement === 'top-right' || placement === 'bottom-right' || placement === 'right';

  const centreHorizontally = placement === 'top' || placement === 'bottom';
  const centreVertically = placement === 'left' || placement === 'right';

  if (!hasVertical) {
    if (isTop) style.top = DEFAULT_OFFSET;
    else if (isBottom) style.bottom = DEFAULT_OFFSET;
    else if (centreVertically) style.top = '50%';
  }
  if (!hasHorizontal) {
    if (isLeft) style.left = DEFAULT_OFFSET;
    else if (isRight) style.right = DEFAULT_OFFSET;
    else if (centreHorizontally) style.left = '50%';
  }

  return {
    style,
    translateX: !hasHorizontal && centreHorizontally ? '-50%' : '0',
    translateY: !hasVertical && centreVertically ? '-50%' : '0',
  };
}

const resolvedGroupPlacement = computed<ResolvedGroupPlacement>(() => resolveGroupPlacement());

/**
 * Which way the stack grows. `'auto'` reads the anchor: the stack always
 * opens towards the viewport centre, so a bottom-anchored group stacks
 * upwards and a left-anchored one stacks rightwards.
 */
const resolvedDirection = computed<'up' | 'down' | 'left' | 'right'>(() => {
  // `direction` is optional and deliberately has no `withDefaults` entry (a
  // union of literals would be inferred as a prop *factory* by the SFC
  // compiler), so `undefined` means "derive from the anchor".
  const wanted = props.direction;
  if (wanted !== undefined && wanted !== 'auto') return wanted;

  const placement = props.placement;
  if (placement === 'top-left' || placement === 'top-right' || placement === 'top') return 'down';
  if (placement === 'bottom-left' || placement === 'bottom-right' || placement === 'bottom') {
    return 'up';
  }
  if (placement === 'left') return 'right';
  return 'left';
});

/** Vertical stacks put the trigger last (below the stack) when opening up. */
const isVerticalStack = computed(
  () => resolvedDirection.value === 'up' || resolvedDirection.value === 'down',
);

/** Root: anchor + the gap between the stack and the trigger. */
const rootStyle = computed<CSSProperties>(() => {
  const { style, translateX, translateY } = resolvedGroupPlacement.value;
  const base: CSSProperties = { ...style, rowGap: `${props.gap}px` };
  if (translateX === '0' && translateY === '0') return base;
  return { ...base, transform: `translate(${translateX}, ${translateY})` };
});

/** Stack of children: the same gap applies between the children themselves. */
const itemsStyle = computed<CSSProperties>(() => ({ gap: `${props.gap}px` }));

const rootClass = computed(() => [
  'sn-float-button-group',
  `sn-float-button-group--${props.shape}`,
  `sn-float-button-group--dir-${resolvedDirection.value}`,
  {
    'sn-float-button-group--open': mergedOpen.value,
    'sn-float-button-group--vertical': isVerticalStack.value,
  },
]);

// ---------- Trigger ----------

/** Resolved trigger glyph. `markRaw` keeps the component out of the proxy. */
const resolvedTriggerIcon = computed<IconComponent>(() => markRaw(props.triggerIcon ?? Plus));

function handleTriggerClick(): void {
  toggle();
}

function handleGroupMouseEnter(): void {
  if (props.trigger !== 'hover') return;
  setOpen(true);
}

function handleGroupMouseLeave(): void {
  if (props.trigger !== 'hover') return;
  setOpen(false);
}

// ---------- Hover dismiss guard ----------

const rootRef = ref<HTMLElement | null>(null);

function isPointerInsideGroup(event: MouseEvent): boolean {
  const root = rootRef.value;
  if (!root) return false;
  const rect = root.getBoundingClientRect();
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

/* ---------- Container mounting (§41) ---------- */

/**
 * `fixed: false` + `container` renders the group inside that element: the
 * instance inserts a comment placeholder where the root originally sat,
 * appends the root to the container and restores it on unmount. `rootRef`
 * already exists for the hover guard, so nothing extra needs disposal.
 */
let containerHost: { parent: Node; placeholder: Comment } | null = null;

function resolveContainer(target: string | HTMLElement | undefined): HTMLElement | null {
  if (target === undefined) return null;
  if (typeof target !== 'string') return target;
  if (typeof document === 'undefined') return null;
  return document.querySelector<HTMLElement>(target);
}

onMounted(() => {
  if (props.fixed) return;
  const container = resolveContainer(props.container);
  const root = rootRef.value;
  const parent = root?.parentNode;
  if (!container || !root || !parent) return;
  const placeholder = document.createComment('sn-float-button-group');
  parent.insertBefore(placeholder, root);
  container.appendChild(root);
  containerHost = { parent, placeholder };
});

function handleDocumentMouseMove(event: MouseEvent): void {
  if (isPointerInsideGroup(event)) return;
  setOpen(false);
}
function bindHoverGuard(): void {
  // SSR guard (§SSR): the immediate hover watch calls unbind on the server.
  if (typeof document === 'undefined') return;
  document.addEventListener('mousemove', handleDocumentMouseMove);
}

function unbindHoverGuard(): void {
  if (typeof document === 'undefined') return;
  document.removeEventListener('mousemove', handleDocumentMouseMove);
}

// Only while an open hover-triggered stack exists does the document listener
// need to exist; closing the stack (or unmounting) removes it. AGENTS.md §41.
watch(
  () => mergedOpen.value && props.trigger === 'hover',
  (active) => {
    if (active) bindHoverGuard();
    else unbindHoverGuard();
  },
  { immediate: true },
);

onBeforeUnmount(unbindHoverGuard);
</script>

<template>
  <div
    ref="rootRef"
    data-snui-component="float-button-group"
    role="group"
    :class="rootClass"
    :style="rootStyle"
    @mouseenter="handleGroupMouseEnter"
    @mouseleave="handleGroupMouseLeave"
  >
    <!-- `v-show` keeps the children mounted (their own state survives a
         collapse); the transition animates opacity + translate. -->
    <Transition name="sn-float-button-group-items">
      <div
        v-show="mergedOpen"
        class="sn-float-button-group__items"
        :class="{ 'sn-float-button-group__items--open': mergedOpen }"
        :style="itemsStyle"
        :aria-hidden="mergedOpen ? undefined : 'true'"
      >
        <slot />
      </div>
    </Transition>

    <slot name="trigger">
      <SnFloatButton
        class="sn-float-button-group__trigger"
        :tooltip="triggerTooltip"
        aria-haspopup="true"
        :aria-expanded="mergedOpen"
        @click="handleTriggerClick"
      >
        <template #icon>
          <span
            class="sn-float-button-group__trigger-icon"
            :class="{ 'sn-float-button-group__trigger-icon--open': mergedOpen }"
          >
            <!-- `SnIcon` is the only icon path (AGENTS.md §113). -->
            <SnIcon :icon="resolvedTriggerIcon" :size="TRIGGER_ICON_SIZE" />
          </span>
        </template>
      </SnFloatButton>
    </slot>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

/* The root is one flex line; DOM order is always stack-then-trigger, and the
 * opening direction flips the axis so the trigger lands where it must be:
 *   up    → column         stack above, trigger at the bottom
 *   down  → column-reverse trigger on top, stack below it
 *   left  → row            stack on the left, trigger at the right
 *   right → row-reverse    trigger on the left, stack to its right
 * Keeping the DOM order fixed means `aria-expanded` and the focus order do not
 * change when the direction does. */
.sn-float-button-group {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: fit-content;
}

.sn-float-button-group--dir-down {
  flex-direction: column-reverse;
}

/* The stack slides in from the trigger: a vertical stack travels on Y, a
 * horizontal one on X, and the sign follows the opening direction. */
.sn-float-button-group--dir-up .sn-float-button-group-items-enter-from,
.sn-float-button-group--dir-up .sn-float-button-group-items-leave-to {
  transform: translateY(8px);
}

.sn-float-button-group--dir-down .sn-float-button-group-items-enter-from,
.sn-float-button-group--dir-down .sn-float-button-group-items-leave-to {
  transform: translateY(-8px);
}

.sn-float-button-group--dir-left .sn-float-button-group-items-enter-from,
.sn-float-button-group--dir-left .sn-float-button-group-items-leave-to {
  transform: translateX(8px);
}

.sn-float-button-group--dir-right .sn-float-button-group-items-enter-from,
.sn-float-button-group--dir-right .sn-float-button-group-items-leave-to {
  transform: translateX(-8px);
}

.sn-float-button-group--dir-left,
.sn-float-button-group--dir-right {
  flex-direction: row;
  align-items: center;
}

.sn-float-button-group--dir-right {
  flex-direction: row-reverse;
}

/* The stack is a plain flex line: it must never claim a width of its own —
 * the children size themselves (see `.sn-float-button--in-group`). */
.sn-float-button-group__items {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: fit-content;
}

.sn-float-button-group--dir-left .sn-float-button-group__items,
.sn-float-button-group--dir-right .sn-float-button-group__items {
  flex-direction: row;
  align-items: center;
}
/* ---------- Trigger ---------- */

.sn-float-button-group__trigger-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.sn-float-button-group__trigger-icon--open {
  transform: rotate(45deg);
}

/* ---------- Stack transition ---------- */

.sn-float-button-group-items-enter-active,
.sn-float-button-group-items-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.sn-float-button-group-items-enter-from,
.sn-float-button-group-items-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
