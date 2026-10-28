import { afterEach, describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import type { ComponentMountingOptions } from '@vue/test-utils';
import { Fragment, defineComponent, h, nextTick, ref } from 'vue';
import type { VNode } from 'vue';
import SnWaterfall from './SnWaterfall.vue';

/**
 * Harness notes:
 *
 * 1. The placement is JS (a flex column per column + shortest-column pack), but
 *    the *geometry* itself is the browser's flex layout, so there is nothing to
 *    assert in happy-dom. These tests pin the DOM contract the layout depends
 *    on: which items land in which column, the column wrappers, the gap custom
 *    properties and the ARIA shape. The placement math itself is unit-tested in
 *    `waterfall-assign.test.ts`.
 *
 * 2. happy-dom has no layout and (usually) no firing ResizeObserver, which is
 *    exactly the documented fallback path: the container distributes items
 *    round-robin. That makes the assertions deterministic — the reading order
 *    runs left to right, one item per column per pass.
 *
 * 3. Column geometry is read from the rendered columns, not from
 *    `getComputedStyle`: happy-dom does not resolve `var()` / custom
 *    properties, but it does keep inline declarations.
 *
 * 4. `<template v-for>` compiles to a Fragment vnode, so the fragment cases
 *    build `h(Fragment, [...])` by hand — the same shape the `default` slot
 *    receives from a real template.
 */

function mountWaterfall(options: ComponentMountingOptions<typeof SnWaterfall> = {}) {
  return mount(SnWaterfall, options);
}

/** The mounted root (single-root component). */
function rootOf(wrapper: ReturnType<typeof mountWaterfall>): HTMLElement {
  return wrapper.element as HTMLElement;
}

/** The entry text of every item, grouped by column. */
function columnTexts(wrapper: ReturnType<typeof mountWaterfall>): string[][] {
  return wrapper
    .findAll('.sn-waterfall__column')
    .map((column) => column.findAll('.sn-waterfall__item .entry').map((entry) => entry.text()));
}

/** Item texts in DOM order (column-major). */
function itemTexts(wrapper: ReturnType<typeof mountWaterfall>): string[] {
  return wrapper.findAll('.sn-waterfall__item .entry').map((entry) => entry.text());
}

/** The scroll-freeze listener must never leak between tests. */
afterEach(() => {
  vi.unstubAllGlobals();
});
function readGap(el: HTMLElement, name: string): string {
  return el.style.getPropertyValue(name);
}

/** One Fragment vnode holding `entries` — mirrors `<template v-for>`. */
function fragmentList(entries: string[]): VNode {
  return h(
    Fragment,
    entries.map((entry) => h('span', { key: entry, class: 'entry' }, entry)),
  );
}

describe('SnWaterfall', () => {
  describe('item wrapping', () => {
    it('should render one item box per slot child', () => {
      const wrapper = mountWaterfall({
        slots: {
          default: () => [
            h('span', { class: 'entry' }, 'a'),
            h('span', { class: 'entry' }, 'b'),
            h('span', { class: 'entry' }, 'c'),
          ],
        },
      });

      expect(wrapper.findAll('.sn-waterfall__item')).toHaveLength(3);
      expect(itemTexts(wrapper)).toEqual(['a', 'b', 'c']);
    });

    it('should render nothing for an empty slot', () => {
      const wrapper = mountWaterfall({ slots: { default: () => [] } });
      expect(wrapper.find('.sn-waterfall__item').exists()).toBe(false);
    });

    it('should skip null and boolean slot children', () => {
      const wrapper = mountWaterfall({
        slots: {
          default: () => [null, false, h('span', { class: 'entry' }, 'a')],
        },
      });
      expect(wrapper.findAll('.sn-waterfall__item')).toHaveLength(1);
    });

    it('should tag the root as this component', () => {
      const wrapper = mountWaterfall({ slots: { default: () => [h('span')] } });
      expect(rootOf(wrapper).getAttribute('data-snui-component')).toBe('waterfall');
    });
  });

  describe('fragment flattening', () => {
    it('should render one item per entry inside a v-for fragment', () => {
      const wrapper = mountWaterfall({
        slots: { default: () => fragmentList(['a', 'b', 'c', 'd']) },
      });

      expect(wrapper.findAll('.sn-waterfall__item')).toHaveLength(4);
      expect(new Set(itemTexts(wrapper))).toEqual(new Set(['a', 'b', 'c', 'd']));
    });

    it('should flatten nested fragments recursively', () => {
      const wrapper = mountWaterfall({
        slots: {
          default: () =>
            h(Fragment, [
              h(Fragment, [h('span', { class: 'entry' }, 'a'), h('span', { class: 'entry' }, 'b')]),
              h('span', { class: 'entry' }, 'c'),
            ]),
        },
      });

      expect(wrapper.findAll('.sn-waterfall__item')).toHaveLength(3);
      expect(new Set(itemTexts(wrapper))).toEqual(new Set(['a', 'b', 'c']));
    });
  });

  describe('columns', () => {
    it('should default to three columns', () => {
      const wrapper = mountWaterfall({ slots: { default: () => [h('span')] } });
      expect(wrapper.findAll('.sn-waterfall__column')).toHaveLength(3);
    });

    it('should honor the columns prop', () => {
      const wrapper = mountWaterfall({
        props: { columns: 5 },
        slots: { default: () => [h('span')] },
      });
      expect(wrapper.findAll('.sn-waterfall__column')).toHaveLength(5);
    });

    it('should coerce columns to an integer of at least 1', () => {
      const fractional = mountWaterfall({
        props: { columns: 2.7 },
        slots: { default: () => [h('span')] },
      });
      expect(fractional.findAll('.sn-waterfall__column')).toHaveLength(2);

      const zero = mountWaterfall({
        props: { columns: 0 },
        slots: { default: () => [h('span')] },
      });
      expect(zero.findAll('.sn-waterfall__column')).toHaveLength(1);
    });

    it('should mark the root as a masonry container', () => {
      const wrapper = mountWaterfall({ slots: { default: () => [h('span')] } });
      expect(rootOf(wrapper).classList.contains('sn-waterfall--masonry')).toBe(true);
    });
  });

  describe('placement', () => {
    it('should distribute items round-robin while nothing is measured', () => {
      const wrapper = mountWaterfall({
        props: { columns: 3 },
        slots: { default: () => fragmentList(['a', 'b', 'c', 'd', 'e', 'f']) },
      });

      expect(columnTexts(wrapper)).toEqual([
        ['a', 'd'],
        ['b', 'e'],
        ['c', 'f'],
      ]);
    });

    it('should keep existing items in their columns when the feed grows', async () => {
      const items = ref(['a', 'b', 'c']);
      const Host = defineComponent({
        setup() {
          return () =>
            h(
              SnWaterfall,
              { columns: 3 },
              {
                default: () =>
                  h(
                    Fragment,
                    items.value.map((item) => h('span', { key: item, class: 'entry' }, item)),
                  ),
              },
            );
        },
      });
      const wrapper = mount(Host);
      expect(columnTexts(wrapper as never)).toEqual([['a'], ['b'], ['c']]);

      items.value = ['a', 'b', 'c', 'd', 'e'];
      await nextTick();

      // Append-only: d/e continue the rotation instead of the whole wall being
      // rebuilt (which would move — and therefore re-load — every image).
      expect(columnTexts(wrapper as never)).toEqual([['a', 'd'], ['b', 'e'], ['c']]);
    });

    it('should drop items that leave the feed', async () => {
      const items = ref(['a', 'b', 'c']);
      const Host = defineComponent({
        setup() {
          return () =>
            h(
              SnWaterfall,
              { columns: 3 },
              {
                default: () =>
                  h(
                    Fragment,
                    items.value.map((item) => h('span', { key: item, class: 'entry' }, item)),
                  ),
              },
            );
        },
      });
      const wrapper = mount(Host);

      items.value = ['a', 'c'];
      await nextTick();

      expect(columnTexts(wrapper as never)).toEqual([['a'], [], ['c']]);
    });
  });

  describe('first measured pack', () => {
    /** Stub ResizeObserver and expose the callbacks so tests can report sizes. */
    function stubResizeObserver(): Array<(entries: ResizeObserverEntry[]) => void> {
      const callbacks: Array<(entries: ResizeObserverEntry[]) => void> = [];
      class ROStub {
        constructor(callback: (entries: ResizeObserverEntry[]) => void) {
          callbacks.push(callback);
        }
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
      }
      vi.stubGlobal('ResizeObserver', ROStub);
      return callbacks;
    }

    /** Report item heights to every live observer callback. */
    function reportHeights(
      callbacks: Array<(entries: ResizeObserverEntry[]) => void>,
      wrapper: ReturnType<typeof mountWaterfall>,
      heights: Record<string, number>,
    ): void {
      const entries = wrapper.findAll('.sn-waterfall__item').map(
        (item) =>
          ({
            target: item.element,
            contentRect: { height: heights[item.find('.entry').text()] ?? 0, width: 100 },
          }) as unknown as ResizeObserverEntry,
      );
      callbacks.forEach((callback) => callback(entries));
    }

    it('should re-pack once when the first heights arrive', async () => {
      const callbacks = stubResizeObserver();
      try {
        const wrapper = mountWaterfall({
          props: { columns: 3, rowGap: 0 },
          slots: { default: () => fragmentList(['a', 'b', 'c', 'd', 'e', 'f']) },
        });
        // Nothing measured yet → balanced round-robin.
        expect(columnTexts(wrapper)).toEqual([
          ['a', 'd'],
          ['b', 'e'],
          ['c', 'f'],
        ]);

        // `a` is a tall image and the rest are short: the round-robin pass would
        // leave column 0 carrying 400px alone, which is exactly what the one-shot
        // measured pack fixes.
        const heights: Record<string, number> = { a: 400, b: 60, c: 60, d: 60, e: 60, f: 60 };
        reportHeights(callbacks, wrapper, heights);
        await nextTick();

        const after = columnTexts(wrapper);
        const perColumn = after.map((column) =>
          column.reduce((sum, key) => sum + (heights[key] ?? 0), 0),
        );
        expect(Math.max(...perColumn) - Math.min(...perColumn)).toBeLessThan(400);
        expect(after.flat().sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
      } finally {
        vi.unstubAllGlobals();
      }
    });

    it('should keep placement append-only after the first pack', async () => {
      const callbacks = stubResizeObserver();
      try {
        const wrapper = mountWaterfall({
          props: { columns: 2, rowGap: 0 },
          slots: { default: () => fragmentList(['a', 'b', 'c']) },
        });

        reportHeights(callbacks, wrapper, { a: 100, b: 100, c: 100 });
        await nextTick();
        const settled = columnTexts(wrapper);

        // A later, much larger measurement must not move what is already placed.
        reportHeights(callbacks, wrapper, { a: 900, b: 100, c: 100 });
        await nextTick();
        expect(columnTexts(wrapper)).toEqual(settled);
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });

  describe('minColumnWidth', () => {
    it('should use columns as the pre-measurement guess', () => {
      // happy-dom reports a zero width, which is the documented "no measurement
      // yet" state: the guess keeps SSR rendering a grid.
      const wrapper = mountWaterfall({
        props: { minColumnWidth: 200, columns: 4 },
        slots: { default: () => [h('span')] },
      });
      expect(wrapper.findAll('.sn-waterfall__column')).toHaveLength(4);
    });

    it('should ignore columns for the guess when it is not given', () => {
      const wrapper = mountWaterfall({
        props: { minColumnWidth: 200 },
        slots: { default: () => [h('span')] },
      });
      expect(wrapper.findAll('.sn-waterfall__column')).toHaveLength(3);
    });
  });

  describe('gaps', () => {
    it('should expose the default gaps as custom properties', () => {
      const wrapper = mountWaterfall({ slots: { default: () => [h('span')] } });
      const root = rootOf(wrapper);
      expect(readGap(root, '--sn-waterfall-column-gap')).toBe('16px');
      expect(readGap(root, '--sn-waterfall-row-gap')).toBe('16px');
    });

    it('should accept numeric gaps as px and string gaps verbatim', () => {
      const wrapper = mountWaterfall({
        props: { columnGap: 24, rowGap: '2rem' },
        slots: { default: () => [h('span')] },
      });
      const root = rootOf(wrapper);
      expect(readGap(root, '--sn-waterfall-column-gap')).toBe('24px');
      expect(readGap(root, '--sn-waterfall-row-gap')).toBe('2rem');
    });

    it('should no longer inline any column geometry on the root', () => {
      const wrapper = mountWaterfall({
        props: { columns: 4, minColumnWidth: 200 },
        slots: { default: () => [h('span')] },
      });
      const root = rootOf(wrapper);
      expect(root.style.columnCount).toBe('');
      expect(root.style.columnWidth).toBe('');
    });
  });

  describe('masonry off switch', () => {
    it('should render a single column when masonry is false', () => {
      const wrapper = mountWaterfall({
        props: { masonry: false, columns: 4 },
        slots: { default: () => fragmentList(['a', 'b', 'c']) },
      });

      expect(rootOf(wrapper).classList.contains('sn-waterfall--stacked')).toBe(true);
      expect(rootOf(wrapper).classList.contains('sn-waterfall--masonry')).toBe(false);
      expect(columnTexts(wrapper)).toEqual([['a', 'b', 'c']]);
    });

    it('should ignore minColumnWidth when masonry is false', () => {
      const wrapper = mountWaterfall({
        props: { masonry: false, minColumnWidth: 200, columns: 5 },
        slots: { default: () => [h('span')] },
      });
      expect(wrapper.findAll('.sn-waterfall__column')).toHaveLength(1);
    });
  });

  describe('accessibility', () => {
    it('should expose the items as an ARIA list', () => {
      const wrapper = mountWaterfall({
        slots: {
          default: () => [h('span', { class: 'entry' }, 'a'), h('span', { class: 'entry' }, 'b')],
        },
      });

      expect(rootOf(wrapper).getAttribute('role')).toBe('list');
      wrapper.findAll('.sn-waterfall__item').forEach((item) => {
        expect(item.attributes('role')).toBe('listitem');
      });
      // The column wrappers must not break the list ownership.
      wrapper.findAll('.sn-waterfall__column').forEach((column) => {
        expect(column.attributes('role')).toBe('presentation');
      });
    });
  });
});
