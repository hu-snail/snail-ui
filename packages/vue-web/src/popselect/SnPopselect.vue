<script setup lang="ts">
/**
 * SnPopselect — bubble single/multiple selector (AUI-WEB-FB-011).
 *
 * Reference library: naive-ui `n-popselect`
 *   (https://www.naiveui.com/zh-CN/light/components/popselect)
 * Per AGENTS.md §112, props + semantics mirror n-popselect 1:1.
 *
 * 1:1 parity (this version):
 *   - options — same raw entry shape as SnSelect (bare values or
 *     `{ label, value, disabled, children }` records; re-exported as
 *     `SnSelectOptionInput`, not redefined)
 *   - value / defaultValue (controlled vs uncontrolled; single value or
 *     array) + update:value
 *   - multiple (default false)
 *   - trigger ('click' | 'hover' | 'manual' | 'focus', default 'click')
 *   - placement (12-way, default 'bottom')
 *   - scrollable (default false — unbounded menu height unless set)
 *   - renderLabel (option, selected) / renderOption ({ node, option,
 *     selected })
 *   - menuProps (attributes spread onto the listbox element)
 *   - show / update:show
 *
 * Intentional divergences from the reference API:
 *   - The trigger renders from the default slot (reference keeps the
 *     same convention for n-popselect — no divergence here).
 *   - Not implemented: `consistencyMenuWidth` (the menu always sizes to
 *     its content), inherited popover `showArrow` (the menu panel draws
 *     no arrow), `displayDirective`, and theme overrides (token-driven).
 *   - `renderLabel` / `renderOption` receive the *normalized* leaf
 *     (label / value / disabled resolved), not the raw option object.
 *
 * Keyboard + Accessibility:
 *   ↑ / ↓ move the highlight, Enter commits, Escape closes (handled on
 *   a document-level listener while open, skipped over editable
 *   targets). Menu: role="listbox" (+ aria-multiselectable,
 *   aria-activedescendant); rows: role="option" + aria-selected, with a
 *   primary-coloured check glyph on selected rows.
 *
 * Design:
 *   Same teleported fixed-position engine as SnPopover (copied, not
 *   imported): getBoundingClientRect placement, viewport flip, hover
 *   bridge, clickoutside dismiss. Single selection closes the bubble
 *   after committing; multiple keeps it open. Per AGENTS.md §40 + §41,
 *   timers and listeners are torn down on unmount and on hide.
 */

import {
  computed,
  defineComponent,
  h,
  markRaw,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  type PropType,
  type VNodeChild,
} from 'vue';
import { Check } from 'lucide-vue-next';
import SnIcon from '../icon/SnIcon.vue';
import type { IconComponent } from '../icon/sn-icon-registry';
import {
  normalizePopselectOptions,
  toPopselectRows,
  type SnPopselectLeafOption,
  type SnPopselectRenderLabel,
  type SnPopselectRenderOption,
  type SnPopselectRow,
  type SnPopselectValue,
  type SnSelectOptionInput,
  type SnSelectValue,
} from './sn-popselect-types';

defineOptions({ name: 'SnPopselect' });

export type SnPopselectPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end';

/**
 * Internal functional renderer for the `renderLabel` / `renderOption`
 * callables — the SFC template cannot render a returned VNodeChild
 * directly, so a tiny function component evaluates it per patch.
 */
const RenderVNode = defineComponent({
  name: 'SnPopselectRenderVNode',
  props: {
    render: { type: Function as PropType<() => VNodeChild>, required: true },
  },
  setup(renderProps) {
    return () => renderProps.render();
  },
});

const props = withDefaults(
  defineProps<{
    /**
     * Option list — bare values or `{ label, value, disabled, children }`
     * records. Mirrors n-popselect `options`.
     */
    options?: SnSelectOptionInput[];
    /**
     * Selected value(s). When `undefined`, falls back to uncontrolled
     * mode. Mirrors n-popselect `value`.
     */
    value?: SnPopselectValue | undefined;
    /**
     * Initial value for uncontrolled mode. Mirrors n-popselect
     * `defaultValue`. Default: `[]` when `multiple`, else `null`.
     */
    defaultValue?: SnPopselectValue | undefined;
    /** Toggle / multi-select mode. Mirrors n-popselect `multiple`. */
    multiple?: boolean;
    /**
     * What gesture opens the menu. Mirrors n-popselect `trigger`.
     * Default 'click'.
     */
    trigger?: 'click' | 'hover' | 'manual' | 'focus';
    /**
     * Where to render the menu relative to the trigger. Mirrors
     * n-popselect `placement`. Default 'bottom'.
     */
    placement?: SnPopselectPlacement;
    /**
     * Cap the menu height and scroll overflowing rows. Mirrors
     * n-popselect `scrollable`. Default false.
     */
    scrollable?: boolean;
    /** Custom row label renderer. Mirrors n-popselect `renderLabel`. */
    renderLabel?: SnPopselectRenderLabel | undefined;
    /** Wrapper for the whole default row. Mirrors n-popselect `renderOption`. */
    renderOption?: SnPopselectRenderOption | undefined;
    /** Attributes spread onto the listbox element. */
    menuProps?: Record<string, unknown> | undefined;
    /**
     * Whether the menu is shown. When `undefined`, falls back to
     * uncontrolled mode. Mirrors n-popselect `show`.
     */
    show?: boolean | undefined;
  }>(),
  {
    options: () => [],
    value: undefined,
    defaultValue: undefined,
    multiple: false,
    trigger: 'click',
    placement: 'bottom',
    scrollable: false,
    renderLabel: undefined,
    renderOption: undefined,
    menuProps: undefined,
    show: undefined,
  },
);

const emit = defineEmits<{
  /** Fired when the selection changes (v-model:value). */
  (e: 'update:value', value: SnPopselectValue): void;
  /** Fired when show state changes (v-model:show). */
  (e: 'update:show', show: boolean): void;
}>();

defineSlots<{
  /** Trigger element (the visible target, e.g. a button). */
  default(): unknown;
}>();

/* ─────────── Internal show state ─────────── */

const uncontrolledShow = ref<boolean>(false);
const isShowControlled = computed(() => props.show !== undefined);
const visible = computed<boolean>(() =>
  isShowControlled.value ? (props.show as boolean) : uncontrolledShow.value,
);

function setVisible(next: boolean): void {
  if (isShowControlled.value) {
    if (visible.value !== next) emit('update:show', next);
  } else {
    uncontrolledShow.value = next;
  }
}

/* ─────────── Value state ─────────── */

const uncontrolledValue = ref<SnPopselectValue>(props.defaultValue ?? (props.multiple ? [] : null));
const isValueControlled = computed(() => props.value !== undefined);
const currentValue = computed<SnPopselectValue>(() =>
  isValueControlled.value ? (props.value as SnPopselectValue) : uncontrolledValue.value,
);

/** Current selection as an array view regardless of mode. */
const selectedValues = computed<ReadonlyArray<SnSelectValue>>(() => {
  const v = currentValue.value;
  if (props.multiple) return Array.isArray(v) ? v : [];
  if (v === null || v === undefined || Array.isArray(v)) return [];
  return [v];
});

function isOptionSelected(value: SnSelectValue): boolean {
  return selectedValues.value.includes(value);
}

function commitValue(next: SnPopselectValue): void {
  // Always notify listeners; only the uncontrolled ref is written here —
  // the parent mirrors the prop in controlled mode.
  emit('update:value', next);
  if (!isValueControlled.value) uncontrolledValue.value = next;
}

/* ─────────── Options ─────────── */

const menuNodes = computed(() => normalizePopselectOptions(props.options));
const menuRows = computed<SnPopselectRow[]>(() => toPopselectRows(menuNodes.value));

/** Flat selectable leaves (groups flattened, order preserved). */
const flatLeaves = computed<SnPopselectLeafOption[]>(() => {
  const out: SnPopselectLeafOption[] = [];
  for (const node of menuNodes.value) {
    if (node.kind === 'group') out.push(...node.children);
    else out.push(node);
  }
  return out;
});

/** Rows a keyboard pass may land on (disabled rows are skipped). */
const selectableLeaves = computed(() => flatLeaves.value.filter((l) => !l.disabled));

/* ─────────── Selection commit ─────────── */

function chooseLeaf(leaf: SnPopselectLeafOption): void {
  if (leaf.disabled) return;
  if (props.multiple) {
    const current = selectedValues.value.slice();
    const index = current.indexOf(leaf.value);
    if (index >= 0) current.splice(index, 1);
    else current.push(leaf.value);
    commitValue(current);
    // Multiple mode keeps the bubble open for further toggling.
  } else {
    commitValue(leaf.value);
    // Single selection closes on commit (naive behaviour).
    setVisible(false);
  }
}

/* ─────────── Keyboard (↑ ↓ Enter Esc) ─────────── */

const pendingValue = ref<SnSelectValue | null>(null);
const menuBodyRef = ref<HTMLElement | null>(null);

function optionDomId(leaf: SnPopselectLeafOption): string {
  return `sn-popselect-option-${leaf.key}`;
}

const activeDescendant = computed<string | null>(() => {
  if (pendingValue.value === null) return null;
  const leaf = flatLeaves.value.find((l) => l.value === pendingValue.value);
  return leaf ? optionDomId(leaf) : null;
});

/** Seed the highlight: the selected leaf if any, else the first row. */
function initPending(): void {
  const firstSelected = selectableLeaves.value.find((l) => isOptionSelected(l.value));
  pendingValue.value = (firstSelected ?? selectableLeaves.value[0])?.value ?? null;
}

function movePending(delta: 1 | -1): void {
  const leaves = selectableLeaves.value;
  if (leaves.length === 0) return;
  const currentIndex =
    pendingValue.value === null ? -1 : leaves.findIndex((l) => l.value === pendingValue.value);
  let next = currentIndex + delta;
  if (next < 0) next = leaves.length - 1;
  if (next >= leaves.length) next = 0;
  const leaf = leaves[next];
  if (leaf) {
    pendingValue.value = leaf.value;
    void scrollPendingIntoView(leaf);
  }
}

async function scrollPendingIntoView(leaf: SnPopselectLeafOption): Promise<void> {
  await nextTick();
  const body = menuBodyRef.value;
  if (!body) return;
  const row = body.querySelector(`[data-value="${CSS.escape(String(leaf.value))}"]`);
  if (row && typeof row.scrollIntoView === 'function') row.scrollIntoView({ block: 'nearest' });
}

function onDocumentKeydown(e: KeyboardEvent): void {
  if (!visible.value) return;
  // Never steal keys while the user is typing in an editable field.
  const target = e.target as HTMLElement | null;
  if (
    target &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
  )
    return;
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      movePending(1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      movePending(-1);
      break;
    case 'Enter': {
      const pending = flatLeaves.value.find((l) => l.value === pendingValue.value);
      if (pending) {
        e.preventDefault();
        chooseLeaf(pending);
      }
      break;
    }
    case 'Escape':
      e.preventDefault();
      setVisible(false);
      break;
    default:
      break;
  }
}

/* Scroll (capture — any container) and resize both land here. Recomputes are
 * coalesced to one per animation frame so a scroll burst does not run the
 * measure-and-write positioning pass per event.
 * Declared BEFORE every immediate \`watch\` below: the positioning watcher's
 * first (immediate) run calls \`cancelPendingRecompute\`, which reads
 * \`recomputeFrame\` — declaring the binding after the watch put it in the TDZ
 * on every closed mount. */
let recomputeFrame: number | null = null;
function cancelPendingRecompute(): void {
  if (recomputeFrame !== null) {
    window.cancelAnimationFrame(recomputeFrame);
    recomputeFrame = null;
  }
}
function onScrollOrResize(): void {
  if (recomputeFrame !== null || !visible.value) return;
  recomputeFrame = window.requestAnimationFrame(() => {
    recomputeFrame = null;
    if (visible.value) void recompute();
  });
}

watch(
  visible,
  (v) => {
    // SSR guard (§SSR): the immediate pass runs during server render where
    // window / document do not exist; listeners are client-only.
    if (typeof window === 'undefined') return;
    if (v) document.addEventListener('keydown', onDocumentKeydown);
    else document.removeEventListener('keydown', onDocumentKeydown);
    // A controlled menu can mount already visible — the listener must
    // attach on that first pass too.
  },
  { immediate: true },
);

/* ─────────── Delay timers (hover / focus triggers) ─────────── */

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
function clearTimers(): void {
  if (openTimer) {
    clearTimeout(openTimer);
    openTimer = null;
  }
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}
function scheduleOpen(): void {
  clearTimers();
  openTimer = setTimeout(() => setVisible(true), 100);
}
function scheduleClose(): void {
  clearTimers();
  closeTimer = setTimeout(() => setVisible(false), 100);
}

/* ─────────── Trigger event wiring ─────────── */

const triggerEl = ref<HTMLElement | null>(null);
const popoverEl = ref<HTMLElement | null>(null);

function onTriggerMouseEnter(): void {
  if (props.trigger !== 'hover') return;
  scheduleOpen();
}
function onTriggerMouseLeave(e: MouseEvent): void {
  if (props.trigger !== 'hover') return;
  const to = e.relatedTarget as Node | null;
  if (to && popoverEl.value && popoverEl.value.contains(to)) return;
  scheduleClose();
}
function onTriggerClick(): void {
  if (props.trigger !== 'click') return;
  setVisible(!visible.value);
}
function onTriggerFocus(): void {
  if (props.trigger !== 'focus') return;
  scheduleOpen();
}
function onTriggerBlur(e: FocusEvent): void {
  if (props.trigger !== 'focus') return;
  const to = e.relatedTarget as Node | null;
  if (to && popoverEl.value && popoverEl.value.contains(to)) return;
  scheduleClose();
}

/* Hover bridge — the menu is reachable without closing. */
function onPopoverMouseEnter(): void {
  if (props.trigger !== 'hover') return;
  clearTimers();
}
function onPopoverMouseLeave(e: MouseEvent): void {
  if (props.trigger !== 'hover') return;
  const to = e.relatedTarget as Node | null;
  if (to && triggerEl.value && triggerEl.value.contains(to)) return;
  scheduleClose();
}

/* ─────────── Positioning + boundary detection ─────────── */

/** Gap between the trigger and the menu panel (menu-style, no arrow). */
const PANEL_GAP = 4;

interface PositionRect {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

const popoverStyle = ref<Record<string, string>>({});
const resolvedSide = ref<'top' | 'right' | 'bottom' | 'left'>('bottom');

async function recompute(): Promise<void> {
  if (!visible.value) return;
  await nextTick();
  const trig = triggerEl.value;
  const pop = popoverEl.value;
  if (!trig || !pop) return;

  const trigRect = trig.getBoundingClientRect();
  const popRect = pop.getBoundingClientRect();
  const trigBox: PositionRect = {
    top: trigRect.top,
    left: trigRect.left,
    width: trigRect.width,
    height: trigRect.height,
    right: trigRect.right,
    bottom: trigRect.bottom,
  };
  const popBox: PositionRect = {
    top: popRect.top,
    left: popRect.left,
    width: popRect.width,
    height: popRect.height,
    right: popRect.right,
    bottom: popRect.bottom,
  };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 8;

  const [sideRaw, alignRaw = 'center'] = props.placement.split('-');
  const side = sideRaw as 'top' | 'right' | 'bottom' | 'left';
  const align = alignRaw as 'start' | 'center' | 'end';

  function clampWithin(value: number, size: number, limit: number): number {
    const max = Math.min(value, limit - size - margin);
    return Math.max(margin, max);
  }

  function rectFor(
    sideChoice: typeof side,
    trigger: PositionRect,
    pop: PositionRect,
    strict = true,
  ): PositionRect | null {
    const out: PositionRect = {
      top: 0,
      left: 0,
      width: pop.width,
      height: pop.height,
      right: 0,
      bottom: 0,
    };
    switch (sideChoice) {
      case 'top':
        out.top = trigger.top - pop.height - PANEL_GAP;
        break;
      case 'bottom':
        out.top = trigger.bottom + PANEL_GAP;
        break;
      case 'left':
        out.left = trigger.left - pop.width - PANEL_GAP;
        break;
      case 'right':
        out.left = trigger.right + PANEL_GAP;
        break;
    }
    const place = (raw: number, size: number, limit: number): number =>
      strict ? raw : clampWithin(raw, size, limit);
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      switch (align) {
        case 'start':
          out.left = place(trigger.left, pop.width, vw);
          break;
        case 'end':
          out.left = place(trigger.right - pop.width, pop.width, vw);
          break;
        default:
          out.left = place(trigger.left + trigger.width / 2 - pop.width / 2, pop.width, vw);
      }
    } else {
      switch (align) {
        case 'start':
          out.top = place(trigger.top, pop.height, vh);
          break;
        case 'end':
          out.top = place(trigger.bottom - pop.height, pop.height, vh);
          break;
        default:
          out.top = place(trigger.top + trigger.height / 2 - pop.height / 2, pop.height, vh);
      }
    }
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      if (out.top < margin || out.top + pop.height > vh - margin) return null;
    } else {
      if (out.left < margin || out.left + pop.width > vw - margin) return null;
    }
    return out;
  }

  function fitsCrossAxis(
    sideChoice: typeof side,
    rect: PositionRect,
    width: number,
    height: number,
  ): boolean {
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      return rect.left >= margin && rect.left + rect.width <= width - margin;
    }
    return rect.top >= margin && rect.top + rect.height <= height - margin;
  }

  const opposite: Record<typeof side, typeof side> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  let finalSide = side;
  let r = rectFor(side, trigBox, popBox);
  if (!r) {
    const flipped = rectFor(opposite[side], trigBox, popBox);
    if (flipped) {
      r = flipped;
      finalSide = opposite[side];
    }
  }
  if (!r || !fitsCrossAxis(finalSide, r, vw, vh)) {
    r = rectFor(finalSide, trigBox, popBox, false)!;
  }
  resolvedSide.value = finalSide;

  popoverStyle.value = {
    position: 'fixed',
    top: `${r.top}px`,
    left: `${r.left}px`,
  };
}

/* Reposition on show and on scroll/resize while open. */
let resizeObserver: ResizeObserver | null = null;
 /* Scroll (capture — any container) and resize both land here. Recomputes are
  * coalesced to one per animation frame so a scroll burst does not run the
  * measure-and-write positioning pass per event. Declared above the watcher:
  * its immediate pass runs synchronously during setup and touches this
  * binding (a later `let` would be a TDZ ReferenceError on every mount). */
 let recomputeFrame: number | null = null;
watch(
  visible,
  async (v) => {
    // SSR guard (§SSR): the immediate pass runs during server render where
    // window / document do not exist; listeners are client-only.
    if (typeof window === 'undefined') return;
    if (v) {
      // Seed the keyboard highlight — covers both gesture opens and
      // controlled consumers that mount already visible.
      initPending();
      await recompute();
      if (!resizeObserver && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          void recompute();
        });
        resizeObserver.observe(document.body);
      }
      window.addEventListener('scroll', onScrollOrResize, true);
      window.addEventListener('resize', onScrollOrResize);
    } else {
      cancelPendingRecompute();
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    }
  },
  { immediate: true },
);

/* ─────────── Outside-click dismiss (click trigger) ─────────── */

function onDocumentMouseDown(e: MouseEvent): void {
  if (props.trigger !== 'click' || !visible.value) return;
  const t = e.target as Node | null;
  if (!t) return;
  if (triggerEl.value && triggerEl.value.contains(t)) return;
  if (popoverEl.value && popoverEl.value.contains(t)) return;
  setVisible(false);
}

watch(
  visible,
  (v) => {
    // SSR guard (§SSR): the immediate pass runs during server render where
    // window / document do not exist; listeners are client-only.
    if (typeof window === 'undefined') return;
    if (props.trigger !== 'click') return;
    if (v) document.addEventListener('mousedown', onDocumentMouseDown);
    else document.removeEventListener('mousedown', onDocumentMouseDown);
  },
  { immediate: true },
);

/* ─────────── Cleanup (§41/§42) ─────────── */

onBeforeUnmount(() => {
  clearTimers();
  cancelPendingRecompute();
  document.removeEventListener('keydown', onDocumentKeydown);
  document.removeEventListener('mousedown', onDocumentMouseDown);
  window.removeEventListener('scroll', onScrollOrResize, true);
  window.removeEventListener('resize', onScrollOrResize);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

/* When controlled show flips true via the parent, recompute. */
watch(
  () => props.show,
  (s) => {
    if (s === undefined) return;
    if (s && !visible.value) {
      clearTimers();
      setVisible(true);
    }
  },
);

const popoverPlacementClass = computed<string[]>(() => {
  const requested = `sn-popselect--${props.placement}`;
  const resolved = `sn-popselect--${resolvedSide.value}`;
  return requested === resolved ? [requested] : [requested, resolved];
});

/** Default label node handed to `renderOption`. */
function defaultOptionNode(leaf: SnPopselectLeafOption, selected: boolean): VNodeChild {
  if (props.renderLabel) return props.renderLabel(leaf, selected);
  return h('span', { class: 'sn-popselect-option__label' }, leaf.label);
}

function rowSelected(leaf: SnPopselectLeafOption): boolean {
  return isOptionSelected(leaf.value);
}

/** Built-in check glyph for selected rows (§113: SnIcon, no emoji). */
const CheckIcon = markRaw(Check) as IconComponent;

const shouldRenderPopover = computed(() => visible.value);

// Expose imperative API for parents that prefer ref-based control.
defineExpose({
  /** Programmatic show. */
  show: () => setVisible(true),
  /** Programmatic hide. */
  hide: () => setVisible(false),
  /** Read current effective show state (controlled + uncontrolled). */
  isShown: () => visible.value,
});
</script>

<template>
  <span
    ref="triggerEl"
    class="sn-popselect-trigger"
    :aria-expanded="visible ? 'true' : 'false'"
    aria-haspopup="listbox"
    @mouseenter="onTriggerMouseEnter"
    @mouseleave="onTriggerMouseLeave"
    @click="onTriggerClick"
    @focusin="onTriggerFocus"
    @focusout="onTriggerBlur"
  >
    <slot />
  </span>

  <Teleport to="body">
    <div
      v-if="shouldRenderPopover"
      ref="popoverEl"
      class="sn-popselect"
      :class="[popoverPlacementClass, scrollable && 'sn-popselect--scrollable']"
      :style="popoverStyle"
      data-snui-component="popselect"
      @mouseenter="onPopoverMouseEnter"
      @mouseleave="onPopoverMouseLeave"
    >
      <div
        ref="menuBodyRef"
        class="sn-popselect__menu"
        role="listbox"
        :aria-multiselectable="multiple ? 'true' : undefined"
        :aria-activedescendant="activeDescendant ?? undefined"
        v-bind="menuProps"
      >
        <template v-for="row in menuRows" :key="row.key">
          <div v-if="row.kind === 'group'" class="sn-popselect-group__label">
            {{ row.label }}
          </div>
          <div
            v-else
            :id="optionDomId(row.leaf)"
            class="sn-popselect-option"
            :class="{
              'sn-popselect-option--selected': rowSelected(row.leaf),
              'sn-popselect-option--pending': pendingValue === row.leaf.value,
              'sn-popselect-option--disabled': row.leaf.disabled,
            }"
            role="option"
            :aria-selected="rowSelected(row.leaf) ? 'true' : 'false'"
            :aria-disabled="row.leaf.disabled ? 'true' : undefined"
            :data-value="String(row.leaf.value)"
            @click="chooseLeaf(row.leaf)"
            @mouseenter="pendingValue = row.leaf.disabled ? pendingValue : row.leaf.value"
            @mousedown.prevent
          >
            <component
              :is="RenderVNode"
              v-if="renderOption"
              :render="
                () =>
                  renderOption!({
                    node: defaultOptionNode(row.leaf, rowSelected(row.leaf)),
                    option: row.leaf,
                    selected: rowSelected(row.leaf),
                  })
              "
            />
            <component
              :is="RenderVNode"
              v-else-if="renderLabel"
              :render="() => renderLabel!(row.leaf, rowSelected(row.leaf))"
            />
            <span v-else class="sn-popselect-option__label">{{ row.leaf.label }}</span>
            <SnIcon
              v-if="rowSelected(row.leaf)"
              class="sn-popselect-option__check"
              :icon="CheckIcon"
              :size="14"
            />
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Web side: --sn-web-* tokens only (§114 / Spec-02). */

.sn-popselect-trigger {
  display: inline-flex;
}

.sn-popselect {
  z-index: 9999;
  pointer-events: auto;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.5;
  color: var(--sn-web-color-text-primary, #1f2329);
  background: var(--sn-web-color-background-surface, #ffffff);
  border: 1px solid var(--sn-web-color-border-subtle, rgba(31, 35, 41, 0.12));
  border-radius: 8px;
  overflow: visible;
  box-shadow: var(--sn-web-card-shadow, 0 2px 8px rgba(0, 0, 0, 0.12));
  animation: sn-popselect-in 150ms cubic-bezier(0.16, 1, 0.3, 1) both;
  min-width: 120px;
  max-width: 280px;
}

.sn-popselect__menu {
  box-sizing: border-box;
  padding: 4px;
  /* Unbounded by default — `scrollable` opts into the capped height. */
}

.sn-popselect--scrollable .sn-popselect__menu {
  max-height: 260px;
  overflow: auto;
}

.sn-popselect-group__label {
  padding: 6px 10px 2px;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
  user-select: none;
}

.sn-popselect-option {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 10px;
  min-height: 34px;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 14px;
  color: var(--sn-web-color-text-primary, #1f2329);
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
}

.sn-popselect-option__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Keyboard / hover highlight — soft fill, no border change. */
.sn-popselect-option--pending {
  background-color: var(--sn-web-color-background-subtle, rgba(0, 0, 0, 0.04));
}

/* Selected row — primary text + trailing check glyph. */
.sn-popselect-option--selected {
  color: var(--sn-web-color-action-primary, #2080f0);
  font-weight: 500;
}

.sn-popselect-option__check {
  flex-shrink: 0;
  color: var(--sn-web-color-action-primary, #2080f0);
}

.sn-popselect-option--disabled {
  cursor: not-allowed;
  color: var(--sn-web-color-text-disabled, #c2c4c9);
  background-color: transparent;
}

.sn-popselect-option--disabled.sn-popselect-option--selected {
  color: var(--sn-web-color-text-disabled, #c2c4c9);
}

.sn-popselect-option:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, rgba(32, 128, 240, 0.35));
  outline-offset: -2px;
}

@keyframes sn-popselect-in {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
