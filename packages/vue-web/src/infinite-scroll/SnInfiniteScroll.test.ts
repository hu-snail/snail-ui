import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnInfiniteScroll from './SnInfiniteScroll.vue';

/** Mount SnInfiniteScroll through a wrapper component, mirroring real usage. */
function mountScroll(props: Record<string, unknown> = {}, slotItems = 3) {
  return mount(
    defineComponent({
      components: { SnInfiniteScroll },
      setup() {
        return () =>
          h(
            SnInfiniteScroll,
            props as never,
            {
              default: () =>
                Array.from({ length: slotItems }, (_, i) =>
                  h('div', { key: i, class: 'item' }, `item-${i}`),
                ),
            } as never,
          );
      },
    }),
  );
}

/** happy-dom has no layout engine — stub the geometry reads. */
function stubScrollBox(
  el: Element,
  metrics: { scrollTop: number; clientHeight: number; scrollHeight: number },
): void {
  Object.defineProperty(el, 'scrollTop', { configurable: true, value: metrics.scrollTop });
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: metrics.clientHeight });
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: metrics.scrollHeight });
}

/** Dispatch a scroll event on the component root (the scroll container). */
function fireScroll(el: Element): void {
  el.dispatchEvent(new Event('scroll'));
}

/** Wheel events carry deltaY; build one that works without a real wheel. */
function fireWheel(el: Element, deltaY: number): void {
  const event = new Event('wheel');
  Object.defineProperty(event, 'deltaY', { configurable: true, value: deltaY });
  el.dispatchEvent(event);
}

describe('SnInfiniteScroll (AUI-WEB-DD-011)', () => {
  describe('rendering', () => {
    it('renders a scroll container with slot content', () => {
      const w = mountScroll();
      const root = w.find('.sn-infinite-scroll');
      expect(root.exists()).toBe(true);
      expect(root.attributes('data-snui-component')).toBe('infinite-scroll');
      expect(w.findAll('.item')).toHaveLength(3);
    });

    it('spreads scrollbarProps onto the root element', () => {
      const w = mountScroll({ scrollbarProps: { id: 'chat-scroll' } });
      expect(w.find('.sn-infinite-scroll').attributes('id')).toBe('chat-scroll');
    });
  });

  describe('load triggering', () => {
    it('does not call load when the container is not near the bottom', async () => {
      const load = vi.fn();
      const w = mountScroll({ load });
      stubScrollBox(w.element, { scrollTop: 0, clientHeight: 100, scrollHeight: 2000 });

      fireScroll(w.element);
      await flushPromises();

      expect(load).not.toHaveBeenCalled();
    });

    it('calls load when scrolled within the default distance of the bottom', async () => {
      const load = vi.fn(async () => {});
      const w = mountScroll({ load });
      // scrollTop 110 + clientHeight 100 = 210 >= scrollHeight 200 - distance 0.
      stubScrollBox(w.element, { scrollTop: 110, clientHeight: 100, scrollHeight: 200 });

      fireScroll(w.element);
      await flushPromises();

      expect(load).toHaveBeenCalledTimes(1);
    });

    it('honors the distance threshold', async () => {
      const load = vi.fn(async () => {});
      const w = mountScroll({ load, distance: 50 });
      // 60 + 100 = 160 >= 200 - 50 → inside the threshold.
      stubScrollBox(w.element, { scrollTop: 60, clientHeight: 100, scrollHeight: 200 });

      fireScroll(w.element);
      await flushPromises();

      expect(load).toHaveBeenCalledTimes(1);
    });

    it('does not call load when the scroll stays outside the distance threshold', async () => {
      const load = vi.fn(async () => {});
      const w = mountScroll({ load, distance: 50 });
      // 40 + 100 = 140 < 200 - 50.
      stubScrollBox(w.element, { scrollTop: 40, clientHeight: 100, scrollHeight: 200 });

      fireScroll(w.element);
      await flushPromises();

      expect(load).not.toHaveBeenCalled();
    });

    it('triggers load on a downward wheel even without a scroll event', async () => {
      const load = vi.fn(async () => {});
      const w = mountScroll({ load });
      stubScrollBox(w.element, { scrollTop: 120, clientHeight: 100, scrollHeight: 200 });

      fireWheel(w.element, 120);
      await flushPromises();

      expect(load).toHaveBeenCalledTimes(1);
    });

    it('ignores upward wheel deltas', async () => {
      const load = vi.fn(async () => {});
      const w = mountScroll({ load });
      stubScrollBox(w.element, { scrollTop: 120, clientHeight: 100, scrollHeight: 200 });

      fireWheel(w.element, -120);
      await flushPromises();

      expect(load).not.toHaveBeenCalled();
    });
  });

  describe('pending state', () => {
    it('does not re-trigger load while a previous load is pending', async () => {
      let resolveLoad: (() => void) | undefined;
      const load = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveLoad = resolve;
          }),
      );
      const w = mountScroll({ load });
      stubScrollBox(w.element, { scrollTop: 200, clientHeight: 100, scrollHeight: 200 });

      fireScroll(w.element);
      await flushPromises();
      expect(load).toHaveBeenCalledTimes(1);
      expect(w.find('.sn-infinite-scroll--loading').exists()).toBe(true);

      fireScroll(w.element);
      await flushPromises();
      expect(load).toHaveBeenCalledTimes(1);

      resolveLoad?.();
      await flushPromises();
      expect(w.find('.sn-infinite-scroll--loading').exists()).toBe(false);

      fireScroll(w.element);
      await flushPromises();
      expect(load).toHaveBeenCalledTimes(2);
    });

    it('resets the loading state when load rejects', async () => {
      const load = vi.fn(async () => {
        throw new Error('network down');
      });
      const w = mountScroll({ load });
      stubScrollBox(w.element, { scrollTop: 200, clientHeight: 100, scrollHeight: 200 });

      fireScroll(w.element);
      await flushPromises();

      expect(w.find('.sn-infinite-scroll--loading').exists()).toBe(false);
    });

    it('hides the spinner when showLoading is false while pending', async () => {
      let resolveLoad: (() => void) | undefined;
      const load = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveLoad = resolve;
          }),
      );
      const w = mountScroll({ load, showLoading: false });
      stubScrollBox(w.element, { scrollTop: 200, clientHeight: 100, scrollHeight: 200 });

      fireScroll(w.element);
      await flushPromises();

      expect(w.find('.sn-infinite-scroll--loading').exists()).toBe(true);
      expect(w.find('.sn-infinite-scroll__spinner').exists()).toBe(false);

      resolveLoad?.();
      await flushPromises();
    });

    it('renders the spinner with a real inline svg while pending', async () => {
      let resolveLoad: (() => void) | undefined;
      const load = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveLoad = resolve;
          }),
      );
      const w = mountScroll({ load });
      stubScrollBox(w.element, { scrollTop: 200, clientHeight: 100, scrollHeight: 200 });

      fireScroll(w.element);
      await flushPromises();
      // AGENTS.md §113: the loading glyph must be an inline svg, never emoji.
      expect(w.find('svg.sn-infinite-scroll__spinner').exists()).toBe(true);

      resolveLoad?.();
      await flushPromises();
      expect(w.find('.sn-infinite-scroll__spinner').exists()).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('removes the scroll and wheel listeners on unmount', async () => {
      const load = vi.fn(async () => {});
      const w = mountScroll({ load });
      stubScrollBox(w.element, { scrollTop: 200, clientHeight: 100, scrollHeight: 200 });
      const el = w.element;

      const removeSpy = vi.spyOn(el, 'removeEventListener');
      w.unmount();

      expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('wheel', expect.any(Function));

      // Listeners are gone — firing on the detached element must not load.
      fireScroll(el);
      await flushPromises();
      expect(load).not.toHaveBeenCalled();
    });
  });
});
