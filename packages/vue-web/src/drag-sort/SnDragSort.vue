<template>
  <TransitionGroup
    tag="div"
    name="sn-drag-sort"
    :class="['sn-drag-sort', `sn-drag-sort--${direction}`, { 'sn-drag-sort--disabled': disabled }]"
    :data-snui-component="'drag-sort'"
    role="list"
    @keydown="onListKeyDown"
  >
    <div
      v-for="(row, index) in rows"
      :key="row.key"
      :class="[
        'sn-drag-sort__item',
        {
          'sn-drag-sort__item--dragging': draggingKey === row.key,
          'sn-drag-sort__item--disabled': row.disabled,
          'sn-drag-sort__item--handle-only': handle && !row.disabled,
        },
      ]"
      role="listitem"
      tabindex="0"
      :draggable="isRowDraggable(row) ? 'true' : 'false'"
      :aria-disabled="row.disabled ? 'true' : undefined"
      :aria-keyshortcuts="row.disabled ? undefined : moveShortcuts"
      :data-key="String(row.key)"
      @mousedown="onRowMouseDown(row, $event)"
      @dragstart="onDragStart(row, index, $event)"
      @dragenter.prevent
      @dragover="onDragOver(row, index, $event)"
      @drop.prevent="onDrop"
      @dragend="onDragEnd"
    >
      <span v-if="handle && !row.disabled" class="sn-drag-sort__handle" aria-hidden="true">
        <SnIcon :icon="GripVerticalIcon" :size="14" />
      </span>
      <div class="sn-drag-sort__content">
        <slot name="item" :item="row.item" :index="index" :is-dragging="draggingKey === row.key">
          {{ defaultLabel(row.item) }}
        </slot>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
/**
 * SnDragSort — drag-and-drop sortable list (拖拽排序).
 *
 * **Explicit divergence from naive-ui** (AGENTS.md §112): naive-ui has no
 * sortable list. Per §112 the surface follows the near-universal sortable
 * convention (vuedraggable / dnd-kit): items in via `v-model`, reordered
 * array out via `update:modelValue`, optional grip handle, per-item lock.
 *
 * Mechanism — dependency-free (AGENTS.md §57):
 *   - HTML5 Drag & Drop on the rows (`draggable` + dragstart / dragover /
 *     dragend). The source row arms `draggable` on handle mousedown when
 *     `handle` is set, so text selection inside rows keeps working.
 *   - LIVE PREVIEW ordering: while dragging, `dragover` over a row's half
 *     (top/bottom for vertical, left/right for horizontal) splices the
 *     dragged row into its working-order copy immediately; the commit
 *     happens once on `dragend` (which always fires after `drop`), so
 *     drop-inside and cancel-outside both land on the visible order —
 *     vuedraggable semantics.
 *   - Locked (`disabled`) rows are neither draggable nor drop targets and
 *     can never be crossed: a drag that would jump over one is a no-op.
 *   - `<TransitionGroup name="sn-drag-sort">` provides the FLIP move
 *     animation for the live reorder (`.sn-drag-sort-move`).
 *   - Keyboard parity: a focused row moves with Alt+Arrow (Up/Down vertical,
 *     Left/Right horizontal), skipping over locked neighbours — the a11y
 *     path for users who cannot drag.
 *
 * Platform note: HTML5 DnD has no touch support on mobile browsers — this
 * is a PC-end component (`@snui/vue-web`); on touch, use the keyboard path
 * or a pointer-event based implementation.
 *
 * Per AUI-WEB-FORM-018, this component is end: web and uses `--sn-web-*`
 * token aliases only (px units).
 *
 * Usage:
 *   <SnDragSort v-model="list" #item="{ item }">{{ item.title }}</SnDragSort>
 *   <SnDragSort v-model="list" handle direction="horizontal" />
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../icon/SnIcon.vue';
import { GripVerticalIcon } from './sn-drag-sort-icons';
import {
  normalizeDragSortItems,
  type SnDragSortDirection,
  type SnDragSortEvent,
  type SnDragSortItem,
  type SnDragSortKey,
} from './sn-drag-sort-types';

defineOptions({ name: 'SnDragSort' });

const props = withDefaults(
  defineProps<{
    /** Bound row array (`v-model`). Emits the complete reordered array. */
    modelValue?: SnDragSortItem[];
    /** Layout axis the drag is measured against. */
    direction?: SnDragSortDirection;
    /** Disables dragging AND keyboard moves for the whole list. */
    disabled?: boolean;
    /**
     * Restrict drag initiation to the built-in grip handle — rows stay
     * text-selectable; without it every row is grabbable.
     */
    handle?: boolean;
  }>(),
  {
    modelValue: () => [],
    direction: 'vertical',
    disabled: false,
    handle: false,
  },
);

const emit = defineEmits<{
  /** v-model sync — always the complete next array (AGENTS.md §96). */
  (e: 'update:modelValue', items: SnDragSortItem[]): void;
  /** A move was committed (drag end or keyboard move). */
  (e: 'sort', event: SnDragSortEvent): void;
}>();

defineSlots<{
  /**
   * Row content. Receives the consumer's original item object, its current
   * index and whether it is the row being dragged.
   */
  item?(slotProps: { item: SnDragSortItem; index: number; isDragging: boolean }): unknown;
}>();

/* ─────────── Working order (§27: normalize pure, preview isolated) ─────────── */

/**
 * The live order actually rendered. Starts as a copy of `modelValue` (the
 * prop is never mutated — §101 hygiene) and is synced back whenever the
 * prop changes — except mid-drag, where the preview owns the order and a
 * concurrent prop update would snap rows under the pointer.
 */
const order = ref<SnDragSortItem[]>([...props.modelValue]);

watch(
  () => props.modelValue,
  (items) => {
    if (draggingKey.value !== null) return;
    order.value = [...items];
  },
  { deep: true },
);

const rows = computed(() => normalizeDragSortItems(order.value));

function defaultLabel(item: SnDragSortItem): string {
  const label = item.label;
  return typeof label === 'string' ? label : String(item.key);
}

/** aria-keyshortcuts value advertised on movable rows. */
const moveShortcuts = computed(() =>
  props.direction === 'horizontal'
    ? 'Alt+Left Arrow Alt+Right Arrow'
    : 'Alt+Up Arrow Alt+Down Arrow',
);

/* ─────────── Drag state ─────────── */

/** Key of the row currently dragged — null when no drag is in flight. */
const draggingKey = ref<SnDragSortKey | null>(null);
/** Index the drag started from (pre-move order) — the `sort.from` source. */
let dragFromIndex = -1;
/**
 * Row armed by a handle mousedown in `handle` mode — the only row whose
 * `draggable` attribute is true until the pointer is released again.
 */
const armedKey = ref<SnDragSortKey | null>(null);

function isRowDraggable(row: { key: SnDragSortKey; disabled: boolean }): boolean {
  if (props.disabled || row.disabled) return false;
  if (props.handle) return armedKey.value === row.key;
  return true;
}

/**
 * Arms the handle-mode drag: with `handle`, pressing the grip marks the row
 * draggable; pressing anywhere else disarms (text selection keeps working).
 * Disarm happens on the next document mouseup (§41/§42 cleanup below).
 */
function onRowMouseDown(row: { key: SnDragSortKey; disabled: boolean }, event: MouseEvent): void {
  if (!props.handle || props.disabled || row.disabled) return;
  const source = event.target;
  const onHandle = source instanceof Element && source.closest('.sn-drag-sort__handle') !== null;
  armedKey.value = onHandle ? row.key : null;
}

function onDocumentMouseUp(): void {
  if (armedKey.value !== null) armedKey.value = null;
}

onMounted(() => {
  document.addEventListener('mouseup', onDocumentMouseUp);
});

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', onDocumentMouseUp);
});

/* ─────────── Drag & Drop handlers ─────────── */

function onDragStart(
  row: { key: SnDragSortKey; disabled: boolean },
  index: number,
  event: DragEvent,
): void {
  if (props.disabled || row.disabled) {
    event.preventDefault();
    return;
  }
  draggingKey.value = row.key;
  dragFromIndex = index;
  // dataTransfer is optional by spec (and absent in some test environments);
  // the reorder logic never depends on it.
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    try {
      event.dataTransfer.setData('text/plain', String(row.key));
    } catch {
      // Environment without DataTransfer support — dropping still works
      // because the drop target cancels dragover.
    }
  }
}

function onDragOver(
  row: { key: SnDragSortKey; disabled: boolean },
  index: number,
  event: DragEvent,
): void {
  if (draggingKey.value === null) return;
  if (row.disabled) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';

  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) return;
  const rect = target.getBoundingClientRect();
  const before =
    props.direction === 'horizontal'
      ? event.clientX < rect.left + rect.width / 2
      : event.clientY < rect.top + rect.height / 2;

  const next = previewOrder(index, before);
  if (next !== null && !sameKeySequence(next, order.value)) order.value = next;
}

/** Cheap no-op guard for the preview — equal key sequences never re-render. */
function sameKeySequence(a: readonly SnDragSortItem[], b: readonly SnDragSortItem[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((entry, i) => entry.key === b[i]?.key);
}

/**
 * Preview splice — returns the reordered array or null when the move is
 * illegal (no-op / hover self / crossing a locked row). The hovered index
 * is translated into post-removal coordinates before inserting.
 */
function previewOrder(hoverIndex: number, before: boolean): SnDragSortItem[] | null {
  const current = order.value;
  const from = current.findIndex((entry) => entry.key === draggingKey.value);
  if (from === -1 || hoverIndex === from) return null;
  // A drag may never cross a locked row — block jumps over it entirely.
  const step = hoverIndex > from ? 1 : -1;
  for (let i = from + step; i !== hoverIndex + step; i += step) {
    if (current[i]?.disabled === true) return null;
  }
  const next = current.slice();
  const moved = next.splice(from, 1)[0];
  if (!moved) return null;
  const hoverAfter = hoverIndex > from ? hoverIndex - 1 : hoverIndex;
  next.splice(before ? hoverAfter : hoverAfter + 1, 0, moved);
  return next;
}

function onDrop(event: DragEvent): void {
  // The preview already reordered the list; drop only finalizes the
  // gesture (dragend below commits). preventDefault stops the browser
  // from navigating on the dropped text payload.
  event.preventDefault();
}

function onDragEnd(): void {
  if (draggingKey.value === null) return;
  commit(draggingKey.value, dragFromIndex);
}

/* ─────────── Commit (drag end + keyboard share the path) ─────────── */

function commit(key: SnDragSortKey, from: number): void {
  const to = order.value.findIndex((entry) => entry.key === key);
  draggingKey.value = null;
  dragFromIndex = -1;
  if (from < 0 || to < 0 || from === to) return;
  emit('update:modelValue', [...order.value]);
  emit('sort', { from, to });
}

/* ─────────── Keyboard moves (a11y parity) ─────────── */

function onListKeyDown(event: KeyboardEvent): void {
  if (props.disabled) return;
  if (!event.altKey) return;
  const source = event.target;
  if (!(source instanceof HTMLElement)) return;
  const key = source.dataset['key'];
  if (key === undefined) return;

  let delta = 0;
  if (props.direction === 'vertical') {
    if (event.key === 'ArrowUp') delta = -1;
    else if (event.key === 'ArrowDown') delta = 1;
  } else {
    if (event.key === 'ArrowLeft') delta = -1;
    else if (event.key === 'ArrowRight') delta = 1;
  }
  if (delta === 0) return;

  const index = order.value.findIndex((entry) => String(entry.key) === key);
  if (index === -1 || order.value[index]?.disabled === true) return;
  // Land on the nearest movable neighbour, skipping over locked rows.
  let target = index + delta;
  while (target >= 0 && target < order.value.length && order.value[target]?.disabled === true) {
    target += delta;
  }
  if (target < 0 || target >= order.value.length) return;

  const next = order.value.slice();
  const moved = next.splice(index, 1)[0];
  if (!moved) return;
  next.splice(target, 0, moved);
  order.value = next;
  emit('update:modelValue', [...next]);
  emit('sort', { from: index, to: target });
  // The row is the drag surface; arrows must not scroll the page.
  event.preventDefault();
}
</script>

<style scoped>
.sn-drag-sort {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-drag-sort-gap, 8px);
  box-sizing: border-box;
  font-family: inherit;
}

.sn-drag-sort--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.sn-drag-sort--disabled {
  cursor: not-allowed;
}

.sn-drag-sort__item {
  display: flex;
  align-items: center;
  gap: var(--sn-web-drag-sort-item-gap, 8px);
  box-sizing: border-box;
  padding: var(--sn-web-drag-sort-item-padding-y, 8px) var(--sn-web-drag-sort-item-padding-x, 12px);
  border: 1px solid var(--sn-web-drag-sort-item-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-drag-sort-item-radius, 4px);
  background-color: var(--sn-web-drag-sort-item-bg, var(--sn-web-color-background-elevated));
  color: var(--sn-web-drag-sort-item-text-color, var(--sn-web-color-text-primary));
  cursor: grab;
  user-select: none;
  transition:
    background-color 0.15s ease-out,
    border-color 0.15s ease-out;
}

.sn-drag-sort__item:hover {
  border-color: var(--sn-web-drag-sort-item-border-color-hover, var(--sn-web-color-border-strong));
}

/* Handle mode: the row itself is not the grab surface. */
.sn-drag-sort__item--handle-only {
  cursor: default;
}

/* The row under the cursor during its own drag. */
.sn-drag-sort__item--dragging {
  opacity: 0.5;
  border-style: dashed;
}

.sn-drag-sort__item--disabled {
  color: var(--sn-web-drag-sort-item-text-color-disabled, var(--sn-web-color-text-disabled));
  background-color: var(--sn-web-drag-sort-item-bg-disabled, var(--sn-web-color-background-subtle));
  cursor: not-allowed;
}

.sn-drag-sort__handle {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--sn-web-drag-sort-handle-color, var(--sn-web-color-text-tertiary));
  cursor: grab;
}

.sn-drag-sort__handle:hover {
  color: var(--sn-web-drag-sort-handle-color-hover, var(--sn-web-color-text-secondary));
}

.sn-drag-sort__content {
  flex: 1;
  min-width: 0;
}

/* Focus ring follows the library keyboard convention (visible, tokenized). */
.sn-drag-sort__item:focus-visible {
  outline: 2px solid var(--sn-web-drag-sort-item-focus-ring, var(--sn-web-color-primary));
  outline-offset: 1px;
}

/* TransitionGroup FLIP — animates rows sliding to their preview positions. */
.sn-drag-sort-move {
  transition: transform var(--sn-web-drag-sort-move-duration, 0.2s) ease;
}

@media (prefers-reduced-motion: reduce) {
  .sn-drag-sort-move {
    transition: none;
  }
}
</style>
