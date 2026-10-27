/**
 * SnDragSort unit tests — drag-and-drop sortable list.
 *
 * Behavior-focused (AGENTS.md §46): rendering from modelValue, the drag
 * preview → commit lifecycle (dragstart / dragover / drop / dragend),
 * locked rows (not draggable, not drop targets, not crossable), handle
 * arming, the Alt+Arrow keyboard path, direction class, v-model sync
 * (including the mid-drag guard), and listener cleanup on unmount.
 *
 * happy-dom maps DragEvent onto plain Event, and @vue/test-utils copies
 * custom options (clientX/clientY/altKey) onto the instance afterwards —
 * so `trigger('dragover', { clientY })` reaches the handlers intact. The
 * component never depends on `dataTransfer` being present.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SnDragSort from './SnDragSort.vue';
import type { SnDragSortItem } from './sn-drag-sort-types';

const ITEMS: SnDragSortItem[] = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Bravo' },
  { key: 'c', label: 'Charlie' },
];

/** Mounted wrappers tracked so afterEach can unmount before clearing body. */
const mounted: Array<{ unmount: () => void }> = [];

function mountList(props: Record<string, unknown> = {}, slots?: Record<string, string>) {
  const w = mount(SnDragSort, {
    props: { modelValue: ITEMS.map((item) => ({ ...item })), ...props },
    slots,
    attachTo: document.body,
  });
  mounted.push(w);
  return w;
}

function row(wrapper: ReturnType<typeof mountList>, key: string) {
  return wrapper.find(`.sn-drag-sort__item[data-key="${key}"]`);
}

function rowsInOrder(wrapper: ReturnType<typeof mountList>): string[] {
  return wrapper.findAll('.sn-drag-sort__item').map((r) => r.attributes('data-key'));
}

/** Vertical rects: 100×40 rows stacked at top = index * 40. */
function verticalRect(this: HTMLElement) {
  const index = Number(this.dataset['key']?.charCodeAt(0) ?? 0) - 97;
  return {
    top: index * 40,
    left: 0,
    width: 100,
    height: 40,
    right: 100,
    bottom: index * 40 + 40,
    x: 0,
    y: index * 40,
    toJSON: () => ({}),
  };
}

describe('SnDragSort', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(verticalRect);
  });

  afterEach(async () => {
    for (const w of mounted.splice(0)) w.unmount();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  /* ───── rendering ───── */

  it('renders one row per item with role=list/listitem', () => {
    const w = mountList();
    expect(w.findAll('[role="listitem"]')).toHaveLength(3);
    expect(rowsInOrder(w)).toEqual(['a', 'b', 'c']);
    expect(w.find('[role="list"]').exists()).toBe(true);
    expect(row(w, 'a').text()).toContain('Alpha');
  });

  it('falls back to the key as label when item has none', () => {
    const w = mountList({ modelValue: [{ key: 'k1' }] });
    expect(row(w, 'k1').text()).toContain('k1');
  });

  it('passes item, index and isDragging through the item slot', async () => {
    const w = mountList(
      { modelValue: [{ key: 'a', title: 'First' }] },
      {
        item: `<template #item="{ item, index, isDragging }">
        <span class="probe">{{ item.title }}#{{ index }}#{{ isDragging }}</span>
      </template>`,
      },
    );
    expect(w.find('.probe').text()).toBe('First#0#false');
    await row(w, 'a').trigger('dragstart');
    expect(w.find('.probe').text()).toBe('First#0#true');
  });

  /* ───── drag commit (preview → dragend) ───── */

  it('reorders to after the hovered row and emits v-model + sort', async () => {
    const w = mountList();
    await row(w, 'a').trigger('dragstart');
    // Hover the lower half of 'c' (clientY 110 > midpoint 100) → move after it.
    await row(w, 'c').trigger('dragover', { clientY: 110 });
    expect(rowsInOrder(w)).toEqual(['b', 'c', 'a']); // live preview
    expect(row(w, 'a').classes()).toContain('sn-drag-sort__item--dragging');
    await row(w, 'a').trigger('dragend');
    // The payload is itself an array → it is args[0] of the emit call.
    expect(w.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      { key: 'b', label: 'Bravo' },
      { key: 'c', label: 'Charlie' },
      { key: 'a', label: 'Alpha' },
    ]);
    expect(w.emitted('sort')?.at(-1)).toEqual([{ from: 0, to: 2 }]);
    expect(row(w, 'a').classes()).not.toContain('sn-drag-sort__item--dragging');
  });

  it('reorders to before the hovered row when the upper half is hovered', async () => {
    const w = mountList();
    await row(w, 'c').trigger('dragstart');
    // Hover the upper half of 'b' (clientY 50 < midpoint 60) → move above it.
    await row(w, 'b').trigger('dragover', { clientY: 50 });
    await row(w, 'c').trigger('dragend');
    expect(rowsInOrder(w)).toEqual(['a', 'c', 'b']);
    expect(w.emitted('sort')?.at(-1)).toEqual([{ from: 2, to: 1 }]);
  });

  it('emits nothing when a drag ends without moving', async () => {
    const w = mountList();
    await row(w, 'a').trigger('dragstart');
    await row(w, 'a').trigger('dragend');
    expect(w.emitted('update:modelValue')).toBeUndefined();
    expect(w.emitted('sort')).toBeUndefined();
  });

  it('ignores dragover while no drag is in flight', async () => {
    const w = mountList();
    await row(w, 'b').trigger('dragover', { clientY: 90 });
    expect(rowsInOrder(w)).toEqual(['a', 'b', 'c']);
  });

  /* ───── locked rows ───── */

  it('locks a disabled row: not draggable, marked, and skipped by dragover', async () => {
    const w = mountList({
      modelValue: [
        { key: 'a', label: 'Alpha' },
        { key: 'l', label: 'Locked', disabled: true },
        { key: 'c', label: 'Charlie' },
      ],
    });
    expect(row(w, 'l').attributes('draggable')).toBe('false');
    expect(row(w, 'l').attributes('aria-disabled')).toBe('true');
    expect(row(w, 'a').attributes('draggable')).toBe('true');

    await row(w, 'l').trigger('dragstart');
    await row(w, 'l').trigger('dragend');
    expect(w.emitted('update:modelValue')).toBeUndefined();

    await row(w, 'a').trigger('dragstart');
    await row(w, 'l').trigger('dragover', { clientY: 90 });
    expect(rowsInOrder(w)).toEqual(['a', 'l', 'c']); // locked row: no preview
    await row(w, 'a').trigger('dragend');
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('never lets a drag cross over a locked row', async () => {
    const w = mountList({
      modelValue: [
        { key: 'a', label: 'Alpha' },
        { key: 'l', label: 'Locked', disabled: true },
        { key: 'c', label: 'Charlie' },
      ],
    });
    await row(w, 'a').trigger('dragstart');
    // 'c' sits below the locked row — moving there would cross it.
    await row(w, 'c').trigger('dragover', { clientY: 110 });
    await row(w, 'a').trigger('dragend');
    expect(rowsInOrder(w)).toEqual(['a', 'l', 'c']);
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  /* ───── handle mode ───── */

  it('arms draggable only from the handle press when handle is set', async () => {
    const w = mountList({ handle: true });
    expect(row(w, 'a').attributes('draggable')).toBe('false');
    expect(row(w, 'a').find('.sn-drag-sort__handle svg').exists()).toBe(true);

    // Press on the row content — stays disarmed.
    await row(w, 'a').trigger('mousedown');
    expect(row(w, 'a').attributes('draggable')).toBe('false');

    // Press on the grip — the row becomes draggable until mouseup.
    await row(w, 'a').find('.sn-drag-sort__handle').trigger('mousedown');
    expect(row(w, 'a').attributes('draggable')).toBe('true');
    document.body.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await nextTick();
    expect(row(w, 'a').attributes('draggable')).toBe('false');
  });

  it('starts drags from any row without handle mode', () => {
    const w = mountList();
    expect(row(w, 'b').attributes('draggable')).toBe('true');
    expect(row(w, 'b').find('.sn-drag-sort__handle').exists()).toBe(false);
  });

  /* ───── keyboard moves ───── */

  it('moves a focused row with Alt+ArrowDown/Up and emits like a drag', async () => {
    const w = mountList();
    await row(w, 'a').trigger('keydown', { altKey: true, key: 'ArrowDown' });
    expect(rowsInOrder(w)).toEqual(['b', 'a', 'c']);
    expect(w.emitted('sort')?.at(-1)).toEqual([{ from: 0, to: 1 }]);
    await row(w, 'a').trigger('keydown', { altKey: true, key: 'ArrowDown' });
    expect(rowsInOrder(w)).toEqual(['b', 'c', 'a']);
    await row(w, 'a').trigger('keydown', { altKey: true, key: 'ArrowUp' });
    expect(rowsInOrder(w)).toEqual(['b', 'a', 'c']);
    expect(w.emitted('update:modelValue')).toHaveLength(3);
  });

  it('swaps with the next movable row, skipping a locked neighbour', async () => {
    const w = mountList({
      modelValue: [
        { key: 'a', label: 'Alpha' },
        { key: 'l', label: 'Locked', disabled: true },
        { key: 'c', label: 'Charlie' },
      ],
    });
    // Locked rows are walls: Alt+Down swaps 'a' with the next movable row.
    await row(w, 'a').trigger('keydown', { altKey: true, key: 'ArrowDown' });
    expect(rowsInOrder(w)).toEqual(['l', 'c', 'a']);
    expect(w.emitted('sort')?.at(-1)).toEqual([{ from: 0, to: 2 }]);
    // 'a' is the last movable row — ArrowDown from there is a no-op.
    await row(w, 'a').trigger('keydown', { altKey: true, key: 'ArrowDown' });
    expect(rowsInOrder(w)).toEqual(['l', 'c', 'a']);
  });

  it('does not move rows when the whole list is disabled', async () => {
    const w = mountList({ disabled: true });
    expect(w.find('.sn-drag-sort--disabled').exists()).toBe(true);
    await row(w, 'a').trigger('dragstart');
    await row(w, 'c').trigger('dragover', { clientY: 110 });
    await row(w, 'a').trigger('dragend');
    await row(w, 'a').trigger('keydown', { altKey: true, key: 'ArrowDown' });
    expect(rowsInOrder(w)).toEqual(['a', 'b', 'c']);
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('uses Left/Right arrows in horizontal mode', async () => {
    const w = mountList({ direction: 'horizontal' });
    expect(w.find('.sn-drag-sort--horizontal').exists()).toBe(true);
    await row(w, 'c').trigger('keydown', { altKey: true, key: 'ArrowLeft' });
    expect(rowsInOrder(w)).toEqual(['a', 'c', 'b']);
    // Up/Down are not the axis here.
    await row(w, 'b').trigger('keydown', { altKey: true, key: 'ArrowDown' });
    expect(rowsInOrder(w)).toEqual(['a', 'c', 'b']);
  });

  it('advertises the keyboard shortcuts per direction', () => {
    const w = mountList();
    expect(row(w, 'a').attributes('aria-keyshortcuts')).toBe('Alt+Up Arrow Alt+Down Arrow');
    const h = mountList({ direction: 'horizontal' });
    expect(row(h, 'a').attributes('aria-keyshortcuts')).toBe('Alt+Left Arrow Alt+Right Arrow');
  });

  /* ───── v-model sync ───── */

  it('follows external modelValue updates', async () => {
    const w = mountList();
    await w.setProps({
      modelValue: [
        { key: 'c', label: 'Charlie' },
        { key: 'a', label: 'Alpha' },
      ],
    });
    expect(rowsInOrder(w)).toEqual(['c', 'a']);
  });

  it('keeps the preview order mid-drag when the prop changes', async () => {
    const w = mountList();
    await row(w, 'a').trigger('dragstart');
    await row(w, 'c').trigger('dragover', { clientY: 110 });
    expect(rowsInOrder(w)).toEqual(['b', 'c', 'a']);
    await w.setProps({ modelValue: [{ key: 'c' }, { key: 'b' }, { key: 'a' }] });
    expect(rowsInOrder(w)).toEqual(['b', 'c', 'a']); // preview owns the order
    await row(w, 'a').trigger('dragend');
    expect(w.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      { key: 'b', label: 'Bravo' },
      { key: 'c', label: 'Charlie' },
      { key: 'a', label: 'Alpha' },
    ]);
  });

  /* ───── horizontal drag axis ───── */

  it('measures the drag midpoint on the x axis in horizontal mode', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const index = Number(this.dataset['key']?.charCodeAt(0) ?? 0) - 97;
      return {
        top: 0,
        left: index * 120,
        width: 100,
        height: 40,
        right: index * 120 + 100,
        bottom: 40,
        x: index * 120,
        y: 0,
        toJSON: () => ({}),
      };
    });
    const w = mountList({ direction: 'horizontal' });
    await row(w, 'a').trigger('dragstart');
    // Right half of 'c' → move after it.
    await row(w, 'c').trigger('dragover', { clientX: 320 });
    await row(w, 'a').trigger('dragend');
    expect(rowsInOrder(w)).toEqual(['b', 'c', 'a']);
    expect(w.emitted('sort')?.at(-1)).toEqual([{ from: 0, to: 2 }]);
  });

  /* ───── cleanup (§41/§42) ───── */

  it('removes the document mouseup listener on unmount (no leak)', async () => {
    const w = mountList();
    const spy = vi.spyOn(document, 'removeEventListener');
    w.unmount();
    expect(spy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    spy.mockRestore();
  });
});
