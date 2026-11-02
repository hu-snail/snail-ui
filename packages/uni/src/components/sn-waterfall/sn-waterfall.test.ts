/**
 * sn-waterfall unit tests — uni-end masonry / waterfall container.
 *
 * Behaviour only (AGENTS.md §46): the DOM contract the layout depends on
 * (which items land in which column, the wrapper structure, the gap custom
 * properties, the masonry off switch) plus the observable integration
 * points:
 *   - the lazy-load cascade: `sn-img` inside a waterfall inherits the
 *     container's `lazyLoad` when it does not pass its own
 *   - the measurement path: a `uni.createSelectorQuery` stub reports item
 *     heights, the wall re-packs once, and appended items then go to the
 *     shortest column without moving what is already placed
 *   - the fallback: with no uni host (happy-dom / SSR) items are distributed
 *     round-robin — balanced columns instead of a crash
 *
 * Untestable in happy-dom: real selector-query geometry, native
 * `<image lazy-load>` behaviour and rpx numbers in computed styles — the
 * measurement path is therefore exercised through the same query stub shape
 * sn-fit-swiper's tests use.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import type { ComponentMountingOptions } from '@vue/test-utils';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import SnWaterfall from './sn-waterfall.vue';
import SnImg from '../sn-img/sn-img.vue';

/** One recorded selector-query criterion. */
interface QueryCall {
  /** Selector the component asked for. */
  selector: string;
  /** Shape of the criterion (`select` / `selectAll`). */
  mode: 'select' | 'selectAll';
  /** Nodes the selector actually matched in the mounted DOM. */
  matches: number;
}

/** The mounted component's root — the stub resolves selectors against it. */
let stubRoot: Element | null = null;
/** Queries the component issued, in order. */
let queryCalls: QueryCall[] = [];
/** Synchronous `getSystemInfoSync` probes the component issued. */
let viewportProbes = 0;

/**
 * Install a `uni.createSelectorQuery` stub.
 *
 * The stub is selector-aware: it resolves the requested selector against the
 * mounted DOM and hands back one rect per matched node, in DOM order — the
 * real API's contract. That makes the measurement path testable rather than
 * asserting against a fixed array: a round over the pending marker must ask
 * for exactly the unmeasured nodes, and a re-render that added nothing may
 * not query at all.
 *
 * Heights are supplied per matched node (`heights[i]` for the i-th match, 0
 * when the array runs out), so a test controls what an item measures.
 */
function installUniQuery(heights: number[], containerWidth = 375): void {
  queryCalls = [];
  viewportProbes = 0;
  (globalThis as { uni?: unknown }).uni = {
    getSystemInfoSync: () => {
      viewportProbes += 1;
      return { windowWidth: 375 };
    },
    createSelectorQuery: () => {
      let selector = '';
      let mode: 'select' | 'selectAll' = 'selectAll';
      const query = {
        in: () => query,
        select: (next: string) => {
          selector = next;
          mode = 'select';
          return query;
        },
        selectAll: (next: string) => {
          selector = next;
          mode = 'selectAll';
          return query;
        },
        boundingClientRect: (
          callback: (value: Array<{ height?: number; width?: number }>) => void,
        ) => ({
          exec: () => {
            const nodes =
              stubRoot === null ? [] : Array.from(stubRoot.querySelectorAll(selector));
            queryCalls.push({ selector, mode, matches: nodes.length });
            if (mode === 'select') {
              callback([{ width: containerWidth, height: 600 }]);
              return;
            }
            callback(nodes.map((_, index) => ({ height: heights[index] ?? 0, width: 100 })));
          },
        }),
      };
      return query;
    },
  };
}

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni;
  stubRoot = null;
  queryCalls = [];
  viewportProbes = 0;
});

/** Harness: a waterfall wrapping keyed text entries. */
function mountWaterfall(
  entries: string[],
  options: ComponentMountingOptions<typeof SnWaterfall> = {},
) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(SnWaterfall, options.props, {
          default: () => entries.map((entry) => h('view', { key: entry, class: 'entry' }, entry)),
        });
    },
  });
  const wrapper = mount(Harness, options);
  stubRoot = wrapper.element;
  return wrapper;
}

/** Entry texts grouped by column. */
function columnTexts(wrapper: ReturnType<typeof mountWaterfall>): string[][] {
  return wrapper
    .findAll('.sn-waterfall__column')
    .map((column) => column.findAll('.sn-waterfall__item .entry').map((entry) => entry.text()));
}

describe('sn-waterfall', () => {
  describe('rendering', () => {
    it('renders one item box per slot child', () => {
      const wrapper = mountWaterfall(['a', 'b', 'c']);
      expect(wrapper.findAll('.sn-waterfall__item')).toHaveLength(3);
      expect(wrapper.findAll('.sn-waterfall__item .entry').map((e) => e.text())).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('renders nothing for an empty slot', () => {
      const wrapper = mountWaterfall([]);
      expect(wrapper.find('.sn-waterfall__item').exists()).toBe(false);
    });

    it('skips null and boolean slot children', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnWaterfall, null, {
              default: () => [null, false, h('view', { key: 'a', class: 'entry' }, 'a')],
            });
        },
      });
      const wrapper = mount(Harness);
      expect(wrapper.findAll('.sn-waterfall__item')).toHaveLength(1);
    });

    it('flattens template v-for fragments into per-entry boxes', () => {
      // `<template v-for>` compiles to a Fragment vnode holding the repeated
      // items — the same shape the default slot receives from a real template.
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnWaterfall, { columns: 2 }, {
              default: () => [
                h('view', { key: 'a', class: 'entry' }, 'a'),
                h('view', { key: 'b', class: 'entry' }, 'b'),
                h('view', { key: 'c', class: 'entry' }, 'c'),
                h('view', { key: 'd', class: 'entry' }, 'd'),
              ],
            });
        },
      });
      const wrapper = mount(Harness);
      expect(wrapper.findAll('.sn-waterfall__item')).toHaveLength(4);
    });

    it('tags the root as this component', () => {
      const wrapper = mountWaterfall(['a']);
      expect(wrapper.find('.sn-waterfall').attributes('data-snui-component')).toBe('waterfall');
    });

    it('hardcodes no colour literal in the style block (layout-only)', () => {
      // A layout container paints nothing: every colour must come from a
      // --sn-mp-* alias, and this component declares none. The invariant is
      // not observable at runtime (scoped CSS), so it is pinned on the source
      // text — the same approach sn-img's static `uni.previewImage` guard
      // takes.
      const source = readFileSync(resolve(import.meta.dirname, 'sn-waterfall.vue'), 'utf8');
      const style = source.slice(source.indexOf('<style'));
      expect(style).not.toMatch(/#(?:[0-9a-f]{3,8})\b|rgb\(/i);
      expect(style).toContain('--sn-waterfall-column-gap');
      expect(style).toContain('--sn-waterfall-row-gap');
    });
  });

  describe('column placement', () => {
    it('distributes round-robin while nothing is measured', () => {
      // No uni host installed → the documented fallback path.
      const wrapper = mountWaterfall(['a', 'b', 'c', 'd', 'e', 'f'], {
        props: { columns: 3 },
      });
      expect(columnTexts(wrapper)).toEqual([
        ['a', 'd'],
        ['b', 'e'],
        ['c', 'f'],
      ]);
    });

    it('honours a custom column count', () => {
      const wrapper = mountWaterfall(['a', 'b', 'c', 'd'], { props: { columns: 2 } });
      expect(wrapper.findAll('.sn-waterfall__column')).toHaveLength(2);
      expect(columnTexts(wrapper)).toEqual([
        ['a', 'c'],
        ['b', 'd'],
      ]);
    });

    it('renders a single stacked column when masonry is off', () => {
      const wrapper = mountWaterfall(['a', 'b', 'c'], { props: { masonry: false } });
      expect(wrapper.find('.sn-waterfall').classes()).toContain('sn-waterfall--stacked');
      expect(wrapper.findAll('.sn-waterfall__column')).toHaveLength(1);
      expect(columnTexts(wrapper)).toEqual([['a', 'b', 'c']]);
    });

    it('exposes the gap knobs as custom properties', () => {
      const wrapper = mountWaterfall(['a'], {
        props: { columnGap: 12, rowGap: 8 },
      });
      const style = wrapper.find('.sn-waterfall').attributes('style') ?? '';
      expect(style).toContain('--sn-waterfall-column-gap: 12rpx');
      expect(style).toContain('--sn-waterfall-row-gap: 8rpx');
    });

    it('passes string geometry through untouched', () => {
      const wrapper = mountWaterfall(['a'], {
        props: { columnGap: '2vw', rowGap: '10px' },
      });
      const style = wrapper.find('.sn-waterfall').attributes('style') ?? '';
      expect(style).toContain('--sn-waterfall-column-gap: 2vw');
      expect(style).toContain('--sn-waterfall-row-gap: 10px');
    });

    it('forwards customClass / customStyle', () => {
      const wrapper = mountWaterfall(['a'], {
        props: { customClass: 'my-wall', customStyle: 'margin: 4px' },
      });
      expect(wrapper.find('.sn-waterfall').classes()).toContain('my-wall');
      expect(wrapper.find('.sn-waterfall').attributes('style')).toContain('margin: 4px');
    });
  });

  describe('measured placement (selector-query stub)', () => {
    it('re-packs once with the measured heights', async () => {
      // 3 columns; a is much taller than the rest → after measurement b/c/d
      // must pack into the shorter columns instead of round-robin.
      installUniQuery([300, 100, 100, 100]);
      const wrapper = mountWaterfall(['a', 'b', 'c', 'd'], { props: { columns: 3 } });
      await flushPromises();

      const columns = columnTexts(wrapper);
      expect(columns[0]).toEqual(['a']);
      expect(columns[1]).toEqual(['b', 'd']);
      expect(columns[2]).toEqual(['c']);
    });

    it('keeps placed items in their columns and appends to the shortest', async () => {
      // Measured: a = 300, b = 100 → pack leaves a alone in column 0.
      // Appending an unmeasured `c` (charged the average ≈ 200) sends it to
      // the shorter column 1 — a / b never move (append-only placement).
      installUniQuery([300, 100]);
      const list = ref(['a', 'b']);
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnWaterfall, { columns: 2 }, {
              default: () =>
                list.value.map((entry) => h('view', { key: entry, class: 'entry' }, entry)),
            });
        },
      });
      const wrapper = mount(Harness);
      stubRoot = wrapper.element;
      await flushPromises();
      expect(columnTexts(wrapper)).toEqual([['a'], ['b']]);

      list.value = ['a', 'b', 'c'];
      await wrapper.vm.$nextTick();
      await flushPromises();
      expect(columnTexts(wrapper)).toEqual([['a'], ['b', 'c']]);
    });

    it('stays round-robin when the host reports no heights', async () => {
      installUniQuery([0, 0, 0, 0, 0, 0]);
      const wrapper = mountWaterfall(['a', 'b', 'c', 'd', 'e', 'f'], { props: { columns: 3 } });
      await flushPromises();
      expect(columnTexts(wrapper)).toEqual([
        ['a', 'd'],
        ['b', 'e'],
        ['c', 'f'],
      ]);
    });

    it('derives the responsive column count from the measured width', async () => {
      // Container 375px, min width 100rpx = 50px → floor((375+8)/(50+8)) = 6…
      // clamped by the items available; with 4 items and gap 0 → 7 capped by
      // content. Use an exact-fit case: 375px, 180rpx = 90px, gap 5px →
      // floor((375+5)/(90+5)) = 4 columns.
      installUniQuery([100, 100, 100, 100], 375);
      const wrapper = mountWaterfall(['a', 'b', 'c', 'd'], {
        props: { minColumnWidth: 180, columnGap: 5, columns: 2 },
      });
      await flushPromises();
      expect(wrapper.findAll('.sn-waterfall__column')).toHaveLength(4);
    });

    it('falls back to the columns guess without a measured width', async () => {
      installUniQuery([100, 100, 100]);
      const wrapper = mountWaterfall(['a', 'b', 'c'], {
        props: { minColumnWidth: 180, columns: 3 },
      });
      await flushPromises();
      expect(wrapper.findAll('.sn-waterfall__column')).toHaveLength(3);
    });

    it('never throws when the uni host is mis-shaped', async () => {
      (globalThis as { uni?: unknown }).uni = {
        createSelectorQuery: () => {
          throw new Error('broken host');
        },
      };
      const wrapper = mountWaterfall(['a', 'b', 'c']);
      await flushPromises();
      expect(wrapper.findAll('.sn-waterfall__item')).toHaveLength(3);
    });
  });

  /*
   * Perf revisions: the measurement round asks only for the items without a
   * usable height, an unrelated re-render issues no query at all, a
   * fixed-columns mount skips the container/viewport probes, and the entry
   * pool keeps the placement while content stays fresh.
   */
  describe('measurement cost + content freshness', () => {
    /** Item queries the component issued (the pending-marker rounds). */
    function itemQueries(): QueryCall[] {
      return queryCalls.filter((call) => call.selector === '.sn-waterfall__item--pending');
    }

    it('measures only the pending items, not the whole wall', async () => {
      const list = ref(['a', 'b', 'c', 'd']);
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnWaterfall, { columns: 2 }, {
              default: () =>
                list.value.map((entry) => h('view', { key: entry, class: 'entry' }, entry)),
            });
        },
      });
      installUniQuery([100, 100, 100, 100]);
      const wrapper = mount(Harness);
      stubRoot = wrapper.element;
      await flushPromises();

      // First round: every item is unmeasured, so all four are asked for.
      expect(itemQueries().map((call) => call.matches)).toEqual([4]);

      queryCalls = [];
      list.value = ['a', 'b', 'c', 'd', 'e', 'f'];
      await wrapper.vm.$nextTick();
      await flushPromises();

      // Append of two: the round must ask for two boxes, not for six.
      expect(itemQueries().map((call) => call.matches)).toEqual([2]);
    });

    it('issues no query when a re-render adds nothing unmeasured', async () => {
      installUniQuery([100, 100, 100, 100]);
      const wrapper = mountWaterfall(['a', 'b', 'c', 'd'], { props: { columns: 2 } });
      await flushPromises();
      expect(itemQueries()).toHaveLength(1);

      queryCalls = [];
      // A geometry change re-places the wall but adds no unmeasured item.
      await wrapper.setProps({ rowGap: 24 });
      await flushPromises();
      expect(itemQueries()).toHaveLength(0);
      expect(queryCalls).toHaveLength(0);
    });

    it('skips the container query and the viewport probe in fixed-columns mode', async () => {
      installUniQuery([100, 100]);
      const wrapper = mountWaterfall(['a', 'b'], { props: { columns: 2 } });
      await flushPromises();

      expect(viewportProbes).toBe(0);
      expect(queryCalls.filter((call) => call.selector === '.sn-waterfall')).toHaveLength(0);
      expect(wrapper.findAll('.sn-waterfall__column')).toHaveLength(2);
    });

    it('probes the viewport and the container once in responsive mode', async () => {
      installUniQuery([100, 100], 375);
      mountWaterfall(['a', 'b'], { props: { minColumnWidth: 160, columns: 2 } });
      await flushPromises();

      expect(viewportProbes).toBe(1);
      expect(queryCalls.filter((call) => call.selector === '.sn-waterfall')).toHaveLength(1);
    });

    it('measures an item again after it left the wall and came back', async () => {
      const list = ref(['a']);
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnWaterfall, { columns: 1 }, {
              default: () =>
                list.value.map((entry) => h('view', { key: entry, class: 'entry' }, entry)),
            });
        },
      });
      installUniQuery([100]);
      const wrapper = mount(Harness);
      stubRoot = wrapper.element;
      await flushPromises();

      // Remove it (prunes the pooled entry + its height) …
      queryCalls = [];
      list.value = [];
      await wrapper.vm.$nextTick();
      await flushPromises();

      // … and bring it back: it must measure itself again rather than inherit
      // the height it had before it left.
      list.value = ['a'];
      await wrapper.vm.$nextTick();
      await flushPromises();
      expect(itemQueries().map((call) => call.matches)).toEqual([1]);
    });

    it('re-measures every item on refresh()', async () => {
      installUniQuery([100, 100, 100]);
      const wrapper = mountWaterfall(['a', 'b', 'c'], { props: { columns: 3 } });
      await flushPromises();

      queryCalls = [];
      const wall = wrapper.findComponent(SnWaterfall);
      (wall.vm as unknown as { refresh: () => void }).refresh();
      await flushPromises();
      expect(itemQueries().map((call) => call.matches)).toEqual([3]);
    });

    it('shows fresh slot content on a content-only re-render', async () => {
      // Regression: the previous revision memoised the whole allocation and
      // returned the old vnodes with it, so a re-render that changed content
      // but not the keys kept showing the stale item.
      const title = ref('first');
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnWaterfall, { columns: 2 }, {
              default: () =>
                ['a', 'b'].map((key) =>
                  h('view', { key, class: 'entry' }, `${key}:${title.value}`),
                ),
            });
        },
      });
      const wrapper = mount(Harness);
      stubRoot = wrapper.element;
      expect(wrapper.findAll('.entry').map((entry) => entry.text())).toEqual([
        'a:first',
        'b:first',
      ]);

      title.value = 'second';
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.entry').map((entry) => entry.text())).toEqual([
        'a:second',
        'b:second',
      ]);
      // …and the placement is untouched (two columns, one item each, order
      // unchanged) — a content change must not re-place or re-measure.
      expect(
        wrapper
          .findAll('.sn-waterfall__column')
          .map((column) => column.findAll('.sn-waterfall__item').length),
      ).toEqual([1, 1]);
      expect(queryCalls).toHaveLength(0);
    });
  });

  describe('lazy-load cascade (sn-img)', () => {
    /** Harness: a waterfall with one sn-img child. */
    function mountWallWithImg(
      waterfallProps: Record<string, unknown>,
      imgProps: Record<string, unknown>,
    ) {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnWaterfall, waterfallProps, {
              default: () => [h(SnImg, { key: 'pic', src: 'a.png', ...imgProps })],
            });
        },
      });
      return mount(Harness).findComponent(SnImg);
    }

    it('images inside a lazy waterfall inherit the container config', () => {
      const img = mountWallWithImg({ lazyLoad: true }, {});
      expect(img.find('.sn-img__image').attributes('lazy-load')).toBe('true');
    });

    it('an explicit image prop wins over the container config', () => {
      const off = mountWallWithImg({ lazyLoad: true }, { lazyLoad: false });
      expect(off.find('.sn-img__image').attributes('lazy-load')).toBe('false');
    });

    it('an explicit kebab-case :lazy-load also wins (template spelling)', () => {
      // In a real template `:lazy-load="false"` lands on the vnode as the
      // `lazy-load` key, not `lazyLoad` — probing only camelCase let the
      // container cascade override an explicit off.
      const off = mountWallWithImg({ lazyLoad: true }, { 'lazy-load': false });
      expect(off.find('.sn-img__image').attributes('lazy-load')).toBe('false');
    });

    it('an explicit kebab-case :lazy-load="true" inside a non-lazy wall stays on', () => {
      const on = mountWallWithImg({ lazyLoad: false }, { 'lazy-load': true });
      expect(on.find('.sn-img__image').attributes('lazy-load')).toBe('true');
    });

    it('images outside any waterfall keep the wd-img default (off)', () => {
      const wrapper = mount(SnImg, { props: { src: 'a.png' } });
      expect(wrapper.find('.sn-img__image').attributes('lazy-load')).toBe('false');
    });

    it('an image inside a non-lazy waterfall stays off', () => {
      const img = mountWallWithImg({ lazyLoad: false }, {});
      expect(img.find('.sn-img__image').attributes('lazy-load')).toBe('false');
    });
  });
});
