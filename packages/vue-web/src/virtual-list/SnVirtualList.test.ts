import { afterEach, describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import SnVirtualList from './SnVirtualList.vue';

/** Mount SnVirtualList through a wrapper component, mirroring real usage. */
function mountVirtualList(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnVirtualList },
      setup() {
        return () => h(SnVirtualList, props as never, slots as never);
      },
    }),
  );
}

/** Wait for the rAF-throttled scroll handler + re-render. */
async function flushScroll(): Promise<void> {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await nextTick();
}

function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({ value: i, label: `row-${i}` }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SnVirtualList (AUI-WEB-DD-029)', () => {
  describe('rendering', () => {
    it('renders the component marker with role="list"', () => {
      const w = mountVirtualList({ items: makeItems(20), itemSize: 30, visibleHeight: 90 });
      const root = w.find('.sn-virtual-list');
      expect(root.attributes('data-snui-component')).toBe('virtual-list');
      expect(root.attributes('role')).toBe('list');
    });

    it('renders only the visible window for a fixed itemSize (overscan 0)', () => {
      const w = mountVirtualList({
        items: makeItems(20),
        itemSize: 30,
        visibleHeight: 90,
        overscan: 0,
      });
      const rows = w.findAll('.sn-virtual-list__item');
      // viewport 90px / 30px rows = 3 visible + the row starting exactly at the edge
      expect(rows.length).toBe(4);
      const indexes = rows.map((row) => row.attributes('data-vl-index'));
      expect(indexes).toEqual(['0', '1', '2', '3']);
    });

    it('sizes the sizer to the total list height and offsets the window', () => {
      const w = mountVirtualList({
        items: makeItems(20),
        itemSize: 30,
        visibleHeight: 90,
        overscan: 0,
      });
      expect(w.find('.sn-virtual-list__sizer').attributes('style')).toContain('height: 600px');
      expect(w.find('.sn-virtual-list__window').attributes('style')).toContain('translateY(0px)');
    });

    it('renders the default slot content for primitive items', () => {
      const w = mountVirtualList({
        items: ['a', 'b', 'c'],
        itemSize: 30,
        visibleHeight: 60,
        overscan: 0,
      });
      const texts = w.findAll('.sn-virtual-list__item').map((row) => row.text());
      expect(texts.join('|')).toContain('a');
      expect(texts.join('|')).toContain('c');
    });

    it('renders nothing when items are empty', () => {
      const w = mountVirtualList({ items: [], itemSize: 30, visibleHeight: 90 });
      expect(w.findAll('.sn-virtual-list__item').length).toBe(0);
      expect(w.find('.sn-virtual-list__sizer').attributes('style')).toContain('height: 0px');
    });
  });

  describe('item slot', () => {
    it('receives { item, index } through the item slot', () => {
      const w = mountVirtualList(
        { items: makeItems(20), itemSize: 30, visibleHeight: 90, overscan: 0 },
        {
          item: ({ item, index }: { item: { label: string }; index: number }) =>
            h('div', { class: 'row' }, `${index}:${item.label}`),
        },
      );
      const rows = w.findAll('.row');
      expect(rows[0]?.text()).toBe('0:row-0');
      expect(rows[2]?.text()).toBe('2:row-2');
    });
  });

  describe('scrolling', () => {
    it('recomputes the window from the scrolled offset (manual scroll event)', async () => {
      const w = mountVirtualList({
        items: makeItems(20),
        itemSize: 30,
        visibleHeight: 90,
        overscan: 0,
      });
      const container = w.find('.sn-virtual-list').element as HTMLElement;
      container.scrollTop = 90;
      await w.find('.sn-virtual-list').trigger('scroll');
      await flushScroll();
      const indexes = w
        .findAll('.sn-virtual-list__item')
        .map((row) => row.attributes('data-vl-index'));
      // offset 90 = row 3 start; viewport renders 3..6 with overscan 0
      expect(indexes).toEqual(['3', '4', '5', '6']);
      expect(w.find('.sn-virtual-list__window').attributes('style')).toContain('translateY(90px)');
    });

    it('emits scroll and update:scrollTop through the rAF throttle', async () => {
      const w = mountVirtualList({
        items: makeItems(20),
        itemSize: 30,
        visibleHeight: 90,
        overscan: 0,
      });
      const container = w.find('.sn-virtual-list').element as HTMLElement;
      container.scrollTop = 60;
      await w.find('.sn-virtual-list').trigger('scroll');
      // Emitted synchronously (leading edge of the throttle)
      expect(w.findComponent(SnVirtualList).emitted('scroll')?.length).toBe(1);
      await flushScroll();
      expect(w.findComponent(SnVirtualList).emitted('update:scrollTop')?.[0]).toEqual([60]);
    });

    it('includes the overscan rows above and below the window', () => {
      const w = mountVirtualList({
        items: makeItems(20),
        itemSize: 30,
        visibleHeight: 60,
        overscan: 3,
      });
      // scrollTop 0: startIndex 0, endIndex = 2 (viewport edge) + 3 = 5
      const indexes = w
        .findAll('.sn-virtual-list__item')
        .map((row) => row.attributes('data-vl-index'));
      expect(indexes).toEqual(['0', '1', '2', '3', '4', '5']);
    });
  });

  describe('keyField', () => {
    it('reuses keyed DOM nodes across reorders (keyField identity)', async () => {
      const source = ref([
        { id: 'x-1', label: 'one' },
        { id: 'x-2', label: 'two' },
      ]);
      const w = mount(
        defineComponent({
          setup() {
            return () =>
              h(SnVirtualList, {
                items: source.value,
                keyField: 'id',
                itemSize: 30,
                visibleHeight: 60,
                overscan: 0,
              } as never);
          },
        }),
      );
      const firstRowBefore = w.find('.sn-virtual-list__item[data-vl-index="0"]').element;
      source.value = [...source.value].reverse();
      await nextTick();
      const rows = w.findAll('.sn-virtual-list__item');
      expect(rows.map((row) => row.attributes('data-vl-index'))).toEqual(['0', '1']);
      // Keyed by id: the node that rendered x-1 (index 0) now renders at index 1
      expect(rows[1]?.element).toBe(firstRowBefore);
    });

    it('falls back to the item itself for primitive items', () => {
      const w = mountVirtualList({
        items: [7, 8],
        itemSize: 30,
        visibleHeight: 60,
        overscan: 0,
      });
      expect(w.findAll('.sn-virtual-list__item').length).toBe(2);
    });
  });

  describe('itemResizable', () => {
    it('registers rendered rows with ResizeObserver and reflows from measured heights', async () => {
      type RecordedObserver = {
        callback: (entries: Array<{ target: Element; contentRect: { height: number } }>) => void;
        observed: Element[];
        disconnect: () => void;
      };
      const created: RecordedObserver[] = [];
      class MockResizeObserver {
        callback: RecordedObserver['callback'];
        observed: Element[] = [];
        constructor(cb: RecordedObserver['callback']) {
          this.callback = cb;
          created.push(this as unknown as RecordedObserver);
        }
        observe(el: Element): void {
          this.observed.push(el);
        }
        disconnect(): void {
          this.observed = [];
        }
      }
      vi.stubGlobal('ResizeObserver', MockResizeObserver);

      const w = mountVirtualList({
        items: makeItems(10),
        itemSize: 30,
        itemResizable: true,
        visibleHeight: 90,
        overscan: 0,
      });
      // Before measurement everything uses the 30px estimate
      expect(w.find('.sn-virtual-list__sizer').attributes('style')).toContain('height: 300px');

      // Simulate the observer firing for rows 0 + 1 with measured 60px heights.
      // Two observers exist (container + rows); pick the one observing rows.
      const rowObserver = created.find((inst) =>
        inst.observed.some((el) => el.className.includes('sn-virtual-list__item')),
      );
      const row0 = w.find('.sn-virtual-list__item[data-vl-index="0"]').element;
      const row1 = w.find('.sn-virtual-list__item[data-vl-index="1"]').element;
      rowObserver.callback([
        { target: row0, contentRect: { height: 60 } },
        { target: row1, contentRect: { height: 60 } },
      ]);
      await nextTick();
      // Total = 2 * 60 + 8 * 30 = 360
      expect(w.find('.sn-virtual-list__sizer').attributes('style')).toContain('height: 360px');

      // Scroll to 60px: binary search over prefix [0,60,120,180,...] → row 1 starts the window
      const container = w.find('.sn-virtual-list').element as HTMLElement;
      container.scrollTop = 60;
      await w.find('.sn-virtual-list').trigger('scroll');
      await flushScroll();
      expect(w.find('.sn-virtual-list__window').attributes('style')).toContain('translateY(60px)');
      const indexes = w
        .findAll('.sn-virtual-list__item')
        .map((row) => row.attributes('data-vl-index'));
      expect(indexes[0]).toBe('1');

      // Cleanup: unmount disconnects the observers (§41/§42)
      w.unmount();
      expect(rowObserver.observed.length).toBe(0);
    });
  });

  describe('visibleHeight', () => {
    it('pins the container height via inline style when provided', () => {
      const w = mountVirtualList({
        items: makeItems(20),
        itemSize: 30,
        visibleHeight: 240,
      });
      expect(w.find('.sn-virtual-list').attributes('style')).toContain('height: 240px');
    });

    it('leaves the height to CSS when omitted', () => {
      const w = mountVirtualList({ items: makeItems(20), itemSize: 30 });
      expect(w.find('.sn-virtual-list').attributes('style')).toBeUndefined();
    });
  });
});
