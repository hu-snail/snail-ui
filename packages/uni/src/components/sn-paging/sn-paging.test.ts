/**
 * sn-paging unit tests — uni-end pull-to-refresh + load-more container.
 *
 * Behaviour only (AGENTS.md §46): the query/complete contract, page
 * aggregation, no-more inference, failure retry, the refresher lock, the
 * empty view, the second-floor (F2) overlay, the pull physics contract
 * (damped + clamped, transform-only) and the background/color forwarding.
 * `scroll-view` renders as a plain host element here, so gesture handlers
 * are driven via element events; the vitest host has `document` and no
 * `uni`, which is exactly the docs-preview environment where the browser
 * gesture fallback is the active path.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SnPaging from './sn-paging.vue';

/** Defaults driving the physics numbers below (see sn-paging-simulate.ts). */
/** Pull clamp = threshold × MAX_PULL_RATIO(3); visible hold strip = 50px. */
const MAX_PULL = 135;
const HOLD_PX = 50;

/** v-model round-trip harness: every `update:modelValue` rebinds the prop. */
function mountPaging(props: Record<string, unknown> = {}) {
  const list: unknown[] = [];
  const wrapper = mount(SnPaging, {
    props: {
      ...props,
      modelValue: [],
      'onUpdate:modelValue': (value: unknown[]) => {
        list.length = 0;
        list.push(...value);
        void wrapper.setProps({ modelValue: [...value] });
      },
    },
  });
  return { wrapper, list: () => [...list] };
}

/** Let the re-bind from `update:modelValue` land before asserting on it. */
async function flush(): Promise<void> {
  await nextTick();
  await nextTick();
}

/**
 * Let a coalesced gesture report land (the fallback reports through
 * requestAnimationFrame, with a 16ms setTimeout fallback in this host).
 */
async function frame(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 30));
  await flush();
}

function queryCalls(wrapper: ReturnType<typeof mount>): unknown[][] {
  return wrapper.emitted('query') ?? [];
}

function refresherStyleAttr(wrapper: ReturnType<typeof mount>): string {
  return wrapper.find('.sn-paging__refresher').attributes('style') ?? '';
}

function bodyStyleAttr(wrapper: ReturnType<typeof mount>): string {
  return wrapper.find('.sn-paging__body').attributes('style') ?? '';
}

/** Simulate a drag: start, a series of moves (raw clientY), end/cancel. */
async function drag(
  wrapper: ReturnType<typeof mount>,
  moves: number[],
  end: 'touchend' | 'touchcancel' = 'touchend',
): Promise<void> {
  const scroller = wrapper.find('scroll-view');
  await scroller.trigger('touchstart', { touches: [{ clientY: moves[0] }] });
  for (const y of moves.slice(1)) {
    await scroller.trigger('touchmove', { touches: [{ clientY: y }] });
  }
  await frame();
  await scroller.trigger(end);
}

afterEach(() => {
  vi.useRealTimers();
});

describe('sn-paging', () => {
  describe('query flow', () => {
    it('fires the first query automatically on mount', () => {
      const { wrapper } = mountPaging();
      expect(queryCalls(wrapper)).toEqual([[1, 10]]);
    });

    it('does not query on mount when auto is false', () => {
      const { wrapper } = mountPaging({ auto: false });
      expect(queryCalls(wrapper)).toHaveLength(0);
    });

    it('emits the configured first page and page size', () => {
      const { wrapper } = mountPaging({ defaultPageNo: 2, defaultPageSize: 15 });
      expect(queryCalls(wrapper)).toEqual([[2, 15]]);
    });
  });

  describe('refresh', () => {
    it('refresh() resets to the first page and locks the refresher', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.completeByTotal(['a', 'b'], 30);
      await flush();
      await wrapper.find('scroll-view').trigger('scrolltolower');
      expect(queryCalls(wrapper)[1]).toEqual([2, 10]);
      wrapper.vm.completeByTotal(['c'], 30);
      await flush();

      wrapper.vm.refresh();
      expect(queryCalls(wrapper)[2]).toEqual([1, 10]);
      await flush();
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('true');
    });

    it('reload() refreshes without locking the refresher', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.completeByTotal(['a', 'b'], 30);
      await flush();

      wrapper.vm.reload();
      expect(queryCalls(wrapper)[1]).toEqual([1, 10]);
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
    });

    it('a pull gesture queries page 1 and locks the refresher', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.completeByTotal(['a'], 30);
      await flush();

      await wrapper.find('scroll-view').trigger('refresherrefresh');
      expect(queryCalls(wrapper)[1]).toEqual([1, 10]);
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('true');
    });

    it('a pull gesture while loading collapses instead of stacking a query', async () => {
      const { wrapper } = mountPaging();
      await wrapper.find('scroll-view').trigger('refresherrefresh');
      expect(queryCalls(wrapper)).toHaveLength(1);
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
    });

    it('refresherpulling only arms the visual state, no extra query', async () => {
      const { wrapper } = mountPaging();
      await wrapper.find('scroll-view').trigger('refresherpulling', { detail: { dy: 80 } });
      expect(queryCalls(wrapper)).toHaveLength(1);
    });

    it('a failed refresh keeps an existing list and stays silent', async () => {
      const { wrapper, list } = mountPaging();
      wrapper.vm.completeByTotal(['a', 'b'], 30);
      await flush();

      wrapper.vm.refresh();
      wrapper.vm.complete(false);
      await flush();
      expect(list()).toEqual(['a', 'b']);
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('点击加载更多');
    });
  });

  describe('load-more', () => {
    it('aggregates pages via v-model until the total is reached', async () => {
      const { wrapper, list } = mountPaging({ defaultPageSize: 2 });
      wrapper.vm.completeByTotal(['a', 'b'], 5);
      await flush();
      expect(list()).toEqual(['a', 'b']);

      await wrapper.find('scroll-view').trigger('scrolltolower');
      expect(queryCalls(wrapper)[1]).toEqual([2, 2]);
      wrapper.vm.completeByTotal(['c', 'd'], 5);
      await flush();
      expect(list()).toEqual(['a', 'b', 'c', 'd']);

      await wrapper.find('scroll-view').trigger('scrolltolower');
      wrapper.vm.completeByTotal(['e'], 5);
      await flush();
      expect(list()).toEqual(['a', 'b', 'c', 'd', 'e']);
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('没有更多了');

      await wrapper.find('scroll-view').trigger('scrolltolower');
      expect(queryCalls(wrapper)).toHaveLength(3);
    });

    it('infers no-more when a page is shorter than pageSize', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.complete(['a', 'b', 'c']);
      await flush();
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('没有更多了');

      await wrapper.find('scroll-view').trigger('scrolltolower');
      expect(queryCalls(wrapper)).toHaveLength(1);
    });

    it('completeByNoMore(false) keeps the sequence going', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.completeByNoMore(['a', 'b'], false);
      await flush();
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('点击加载更多');

      await wrapper.find('scroll-view').trigger('scrolltolower');
      expect(queryCalls(wrapper)[1]).toEqual([2, 10]);
    });

    it('is ignored while a query is in flight', async () => {
      const { wrapper } = mountPaging();
      await wrapper.find('scroll-view').trigger('scrolltolower');
      expect(queryCalls(wrapper)).toHaveLength(1);
    });

    it('is ignored before the first load completed', async () => {
      const { wrapper } = mountPaging({ auto: false });
      await wrapper.find('scroll-view').trigger('scrolltolower');
      expect(queryCalls(wrapper)).toHaveLength(0);
    });

    it('loadMoreEnabled=false removes the footer and the gesture', async () => {
      const { wrapper } = mountPaging({ loadMoreEnabled: false });
      wrapper.vm.completeByTotal(['a', 'b'], 30);
      await flush();
      expect(wrapper.find('.sn-paging__footer').exists()).toBe(false);

      await wrapper.find('scroll-view').trigger('scrolltolower');
      expect(queryCalls(wrapper)).toHaveLength(1);
    });

    it('tapping the idle footer loads the next page manually', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.completeByTotal(['a'], 30);
      await flush();

      await wrapper.find('.sn-paging__footer').trigger('click');
      expect(queryCalls(wrapper)[1]).toEqual([2, 10]);
    });

    it('renders the custom footer slot content', async () => {
      const wrapper = mount(SnPaging, {
        props: { modelValue: [], 'onUpdate:modelValue': () => {} },
        slots: { footer: '<view class="custom-footer">自定义加载</view>' },
      });
      await flush();
      expect(wrapper.find('.custom-footer').text()).toBe('自定义加载');
    });
  });

  describe('failures', () => {
    it('a failed initial load shows the fail footer and retry restarts page 1', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.complete(false);
      await flush();
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('加载失败，点击重试');
      expect(wrapper.find('.sn-paging__footer-text--fail').exists()).toBe(true);
      expect(wrapper.find('.sn-paging__empty').exists()).toBe(false);

      await wrapper.find('.sn-paging__footer').trigger('click');
      expect(queryCalls(wrapper)[1]).toEqual([1, 10]);
    });

    it('a failed load-more retry re-emits the same page', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.completeByTotal(['a', 'b'], 30);
      await flush();

      await wrapper.find('scroll-view').trigger('scrolltolower');
      wrapper.vm.complete(false);
      await flush();
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('加载失败，点击重试');

      await wrapper.find('.sn-paging__footer').trigger('click');
      expect(queryCalls(wrapper)[2]).toEqual([2, 10]);
    });

    it('double complete is ignored', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.complete(['a']);
      wrapper.vm.complete(['b']);
      await flush();
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    });
  });

  describe('refresher animation', () => {
    it('holds the success text for the duration then collapses', async () => {
      vi.useFakeTimers();
      const { wrapper } = mountPaging();
      wrapper.vm.completeByTotal(['a'], 30);
      await flush();

      wrapper.vm.refresh();
      wrapper.vm.complete(['z']);
      await flush();
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('true');

      vi.advanceTimersByTime(500);
      await flush();
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
    });

    it('refresherCompleteDuration 0 collapses immediately', async () => {
      const { wrapper } = mountPaging({ refresherCompleteDuration: 0 });
      wrapper.vm.completeByTotal(['a'], 30);
      await flush();

      wrapper.vm.refresh();
      wrapper.vm.complete(['z']);
      await flush();
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
    });

    it('a failed refresh collapses immediately, without the success hold', async () => {
      vi.useFakeTimers();
      const { wrapper } = mountPaging();
      wrapper.vm.completeByTotal(['a'], 30);
      await flush();

      wrapper.vm.refresh();
      wrapper.vm.complete(false);
      await flush();
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
      vi.advanceTimersByTime(1000);
      await flush();
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
    });
  });

  describe('empty view', () => {
    it('appears after an empty first load, with no footer', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.complete([]);
      await flush();
      expect(wrapper.find('.sn-paging__empty').exists()).toBe(true);
      expect(wrapper.find('.sn-paging__empty-text').text()).toBe('暂无数据');
      expect(wrapper.find('.sn-paging__footer').exists()).toBe(false);
    });

    it('stays hidden while loading and before the first load', async () => {
      const loading = mountPaging();
      expect(loading.wrapper.find('.sn-paging__empty').exists()).toBe(false);

      const idle = mountPaging({ auto: false });
      await flush();
      expect(idle.wrapper.find('.sn-paging__empty').exists()).toBe(false);
    });

    it('renders the custom empty slot', async () => {
      const wrapper = mount(SnPaging, {
        props: { modelValue: [], 'onUpdate:modelValue': () => {} },
        slots: { empty: '<text class="custom-empty">空空如也</text>' },
      });
      wrapper.vm.complete([]);
      await flush();
      expect(wrapper.find('.custom-empty').text()).toBe('空空如也');
    });

    it('uses the configured empty text', async () => {
      const { wrapper } = mountPaging({ emptyText: 'No records' });
      wrapper.vm.complete([]);
      await flush();
      expect(wrapper.find('.sn-paging__empty-text').text()).toBe('No records');
    });
  });

  describe('browser gesture fallback (pull physics)', () => {
    it('a pull past the threshold arms the refresh and holds the strip', async () => {
      const { wrapper } = mountPaging({ auto: false });
      // 80px finger travel × 0.75 in-zone rate → 60px pull (≥ 45 threshold).
      await drag(wrapper, [300, 380]);
      expect(queryCalls(wrapper)).toEqual([[1, 10]]);
      await flush();
      expect(refresherStyleAttr(wrapper)).toContain(`translateY(${HOLD_PX - MAX_PULL}px)`);
      expect(refresherStyleAttr(wrapper)).toContain('transition: transform 0.2s ease-out');
      expect(bodyStyleAttr(wrapper)).toContain(`translateY(${HOLD_PX}px)`);
    });

    it('a pull below the threshold springs back without querying', async () => {
      const { wrapper } = mountPaging({ auto: false });
      // 50px travel × 0.75 → 37.5px pull (< 45 threshold).
      await drag(wrapper, [300, 350]);
      expect(queryCalls(wrapper)).toHaveLength(0);
      await flush();
      expect(refresherStyleAttr(wrapper)).toContain(`translateY(-${MAX_PULL}px)`);
      expect(refresherStyleAttr(wrapper)).toContain('cubic-bezier');
      expect(bodyStyleAttr(wrapper)).toContain('translateY(0px)');
    });

    it('a hard yank never exceeds the rubber-band clamp', async () => {
      const { wrapper } = mountPaging({ auto: false });
      // 600px single jump → delta capped at 100 × 0.75 = 75, then two more
      // capped jumps past the threshold damp to 0.35 (75+35+35=145) and the
      // total clamps at maxPull.
      const scroller = wrapper.find('scroll-view');
      await scroller.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await scroller.trigger('touchmove', { touches: [{ clientY: 900 }] });
      await scroller.trigger('touchmove', { touches: [{ clientY: 1200 }] });
      await scroller.trigger('touchmove', { touches: [{ clientY: 1500 }] });
      await frame();
      expect(refresherStyleAttr(wrapper)).toContain('translateY(0px)');
      await scroller.trigger('touchend');
      // Releasing inside the clamp still arms the refresh (past the threshold).
      expect(queryCalls(wrapper)).toEqual([[1, 10]]);
    });

    it('the arrow rotates continuously with the pull on browser hosts', async () => {
      const { wrapper } = mountPaging({ auto: false });
      const scroller = wrapper.find('scroll-view');
      await scroller.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await scroller.trigger('touchmove', { touches: [{ clientY: 380 }] });
      await frame();
      // 60px pull reaches the 45px threshold → 180°.
      expect(wrapper.find('.sn-paging__refresher-icon').attributes('style')).toContain(
        'rotate(180deg)',
      );
      await scroller.trigger('touchend');
    });

    it('a cancelled gesture springs back and never arms', async () => {
      const { wrapper } = mountPaging({ auto: false });
      await drag(wrapper, [300, 900], 'touchcancel');
      expect(queryCalls(wrapper)).toHaveLength(0);
      await flush();
      expect(refresherStyleAttr(wrapper)).toContain(`translateY(-${MAX_PULL}px)`);
    });

    it('dragging is ignored while a query is in flight', async () => {
      const { wrapper } = mountPaging();
      await drag(wrapper, [300, 380]);
      expect(queryCalls(wrapper)).toHaveLength(1);
    });

    it('scrolling near the bottom loads the next page', async () => {
      const { wrapper } = mountPaging();
      wrapper.vm.completeByTotal(['a', 'b'], 30);
      await flush();

      const el = wrapper.find('scroll-view').element as HTMLElement;
      Object.defineProperty(el, 'scrollHeight', { value: 1000, configurable: true });
      Object.defineProperty(el, 'clientHeight', { value: 600, configurable: true });
      el.scrollTop = 400;
      el.dispatchEvent(new Event('scroll'));
      await flush();
      expect(queryCalls(wrapper)[1]).toEqual([2, 10]);
    });

    it('refresherEnabled=false blocks the refresh handler', async () => {
      const { wrapper } = mountPaging({ auto: false, refresherEnabled: false });
      await wrapper.find('scroll-view').trigger('refresherrefresh');
      expect(queryCalls(wrapper)).toHaveLength(0);
    });
  });

  describe('refresher loading animation', () => {
    it('defaults to the circular spinner at a matched 18px size', async () => {
      const { wrapper } = mountPaging({ auto: false });
      wrapper.vm.refresh();
      await flush();
      expect(wrapper.find('.sn-paging__refresher .sn-loading--circular').exists()).toBe(true);
      expect(wrapper.find('.sn-paging__refresher-icon').exists()).toBe(false);
    });

    it('refresherLoadingType switches the spinner shape', async () => {
      const { wrapper } = mountPaging({ auto: false, refresherLoadingType: 'wave' });
      wrapper.vm.refresh();
      await flush();
      expect(wrapper.find('.sn-paging__refresher .sn-loading--wave').exists()).toBe(true);
      expect(wrapper.find('.sn-paging__refresher .sn-loading--circular').exists()).toBe(false);
    });

    it('keeps the pull arrow at the same 18px footprint as the spinner', () => {
      const { wrapper } = mountPaging({ auto: false });
      const style = wrapper.find('.sn-paging__refresher-icon').attributes('style') ?? '';
      expect(style).toContain('width: 18px');
      expect(style).toContain('height: 18px');
    });
  });

  describe('second floor', () => {
  /** Mount without the auto query so pull events reach the handler. */
  function mountIdle(props: Record<string, unknown> = {}) {
    return mountPaging({ auto: false, ...props });
  }

  it('a native pull past the threshold arms the second-floor state', async () => {
    const { wrapper } = mountIdle({ secondFloorEnabled: true });
    await wrapper.find('scroll-view').trigger('refresherpulling', { detail: { dy: 120 } });
    await flush();
    expect(wrapper.find('.sn-paging__refresher-text').text()).toBe('松开进入二楼');
  });

  it('releasing in the zone opens the overlay instead of querying', async () => {
    vi.useFakeTimers();
    const { wrapper } = mountIdle({ secondFloorEnabled: true });
    await wrapper.find('scroll-view').trigger('refresherpulling', { detail: { dy: 120 } });
    await wrapper.find('scroll-view').trigger('refresherrefresh');
    await flush();
    // The interception IS the contract: no refresh query may fire. The
    // triggered hold is adopted and dropped again within one tick so the
    // native pull restores instead of staying locked.
    expect(queryCalls(wrapper)).toHaveLength(0);
    expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
    expect(wrapper.find('.sn-paging__f2').exists()).toBe(true);
    expect(wrapper.emitted('secondFloorChange')).toEqual([['go']]);
    expect(wrapper.find('.sn-paging__f2').attributes('style')).toContain('translateY(-100%)');

    vi.advanceTimersByTime(100);
    await flush();
    expect(wrapper.find('.sn-paging__f2').attributes('style')).toContain('translateY(0%)');
    expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
  });

  it('the uni-h5 release echo cannot cancel the armed second floor', async () => {
    vi.useFakeTimers();
    const { wrapper } = mountIdle({ secondFloorEnabled: true });
    // uni-h5 synthesizes a final `refresherpulling` with dy === threshold
    // right before `refresherrefresh` — the arming latch must survive it.
    await wrapper.find('scroll-view').trigger('refresherpulling', { detail: { dy: 120 } });
    await wrapper.find('scroll-view').trigger('refresherpulling', { detail: { dy: 45 } });
    await flush();
    expect(wrapper.find('.sn-paging__refresher-text').text()).toBe('松开进入二楼');

    await wrapper.find('scroll-view').trigger('refresherrefresh');
    await flush();
    expect(queryCalls(wrapper)).toHaveLength(0);
    expect(wrapper.find('.sn-paging__f2').exists()).toBe(true);
  });

  it('pulling back below the threshold de-arms the second floor', async () => {
    const { wrapper } = mountIdle({ secondFloorEnabled: true });
    await wrapper.find('scroll-view').trigger('refresherpulling', { detail: { dy: 120 } });
    await flush();
    expect(wrapper.find('.sn-paging__refresher-text').text()).toBe('松开进入二楼');

    // The user actively pulls the gesture back down — the latch clears.
    await wrapper.find('scroll-view').trigger('refresherpulling', { detail: { dy: 20 } });
    await flush();
    expect(wrapper.find('.sn-paging__refresher-text').text()).toBe('继续下拉刷新');

    await wrapper.find('scroll-view').trigger('refresherabort');
    await flush();
    expect(queryCalls(wrapper)).toHaveLength(0);
    expect(wrapper.find('.sn-paging__f2').exists()).toBe(false);
  });

    it('renders the second-floor slot inside a scroll area', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnPaging, {
        props: { secondFloorEnabled: true, modelValue: [], 'onUpdate:modelValue': () => {} },
        slots: { secondFloor: '<view class="custom-f2">二楼内容</view>' },
      });
      wrapper.vm.openSecondFloor();
      vi.advanceTimersByTime(100);
      await flush();
      expect(wrapper.find('.custom-f2').text()).toBe('二楼内容');
      expect(wrapper.find('.sn-paging__f2-scroll').exists()).toBe(true);
    });

    it('closeSecondFloor slides the overlay out and unmounts it', async () => {
      vi.useFakeTimers();
      const { wrapper } = mountPaging({ secondFloorEnabled: true });
      wrapper.vm.openSecondFloor();
      vi.advanceTimersByTime(100);
      await flush();
      expect(wrapper.find('.sn-paging__f2').attributes('style')).toContain('translateY(0%)');

      wrapper.vm.closeSecondFloor();
      await flush();
      expect(wrapper.emitted('secondFloorChange')).toEqual([['go'], ['close']]);
      expect(wrapper.find('.sn-paging__f2').attributes('style')).toContain('translateY(-100%)');

      vi.advanceTimersByTime(250);
      await flush();
      expect(wrapper.find('.sn-paging__f2').exists()).toBe(false);
    });

    it('a browser release inside the zone opens the overlay, not a query', async () => {
      const { wrapper } = mountPaging({ secondFloorEnabled: true, auto: false });
      // Two capped jumps: 100×0.75 = 75, then 100×0.35 = 35 → clamp 108 ≥ 100.
      await drag(wrapper, [300, 900, 1200]);
      expect(queryCalls(wrapper)).toHaveLength(0);
      expect(wrapper.find('.sn-paging__f2').exists()).toBe(true);
      expect(wrapper.emitted('secondFloorChange')).toEqual([['go']]);
      // Real-timer wait: the slide-in starts after the show delay.
      await new Promise((resolve) => setTimeout(resolve, 150));
      await flush();
      expect(wrapper.find('.sn-paging__f2').attributes('style')).toContain('translateY(0%)');
    });

    it('secondFloorEnabled=false keeps the plain refresh contract', async () => {
      const { wrapper } = mountIdle();
      await wrapper.find('scroll-view').trigger('refresherpulling', { detail: { dy: 200 } });
      await flush();
      expect(wrapper.find('.sn-paging__refresher-text').text()).toBe('松开立即刷新');

      await wrapper.find('scroll-view').trigger('refresherrefresh');
      expect(queryCalls(wrapper)[0]).toEqual([1, 10]);
      expect(wrapper.find('.sn-paging__f2').exists()).toBe(false);
    });

    it('respects a custom secondFloorThreshold', async () => {
      const { wrapper } = mountIdle({ secondFloorEnabled: true, secondFloorThreshold: 140 });
      await wrapper.find('scroll-view').trigger('refresherpulling', { detail: { dy: 120 } });
      await flush();
      expect(wrapper.find('.sn-paging__refresher-text').text()).toBe('松开立即刷新');
    });

    it('expands fullscreen by default and stays boxed when disabled', async () => {
      vi.useFakeTimers();
      const fullscreen = mountIdle({ secondFloorEnabled: true });
      fullscreen.wrapper.vm.openSecondFloor();
      vi.advanceTimersByTime(100);
      await flush();
      const f2 = fullscreen.wrapper.find('.sn-paging__f2');
      expect(f2.classes()).toContain('sn-paging__f2--fullscreen');

      const boxed = mountIdle({ secondFloorEnabled: true, secondFloorFullscreen: false });
      boxed.wrapper.vm.openSecondFloor();
      vi.advanceTimersByTime(100);
      await flush();
      expect(boxed.wrapper.find('.sn-paging__f2').classes()).not.toContain(
        'sn-paging__f2--fullscreen',
      );
    });

    it('a swipe-up past the threshold drags the floor and dismisses it', async () => {
      vi.useFakeTimers();
      const { wrapper } = mountIdle({ secondFloorEnabled: true });
      wrapper.vm.openSecondFloor();
      await flush();
      // Geometry must exist before the open timer fires the measurement.
      const floor = wrapper.find('.sn-paging__f2-scroll');
      const el = floor.element as HTMLElement;
      Object.defineProperty(el, 'clientHeight', { value: 400, configurable: true });
      Object.defineProperty(el, 'scrollHeight', { value: 400, configurable: true });
      vi.advanceTimersByTime(100);
      await flush();

      await floor.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await floor.trigger('touchmove', { touches: [{ clientY: 200 }] });
      await flush();
      // dyUp = 100 → damped offset 90, dragging freezes the transition.
      expect(wrapper.find('.sn-paging__f2').attributes('style')).toContain('translateY(-90px)');
      expect(wrapper.find('.sn-paging__f2').attributes('style')).toContain('transition: none');

      await floor.trigger('touchmove', { touches: [{ clientY: 100 }] });
      await floor.trigger('touchend');
      await flush();
      // dyUp = 200 → offset 180 ≥ 80 → dismisses from the dragged position.
      expect(wrapper.emitted('secondFloorChange')).toEqual([['go'], ['close']]);
      expect(wrapper.find('.sn-paging__f2').attributes('style')).toContain('translateY(-100%)');
      vi.advanceTimersByTime(250);
      await flush();
      expect(wrapper.find('.sn-paging__f2').exists()).toBe(false);
    });

    it('a swipe-up below the threshold springs the floor back', async () => {
      vi.useFakeTimers();
      const { wrapper } = mountIdle({ secondFloorEnabled: true });
      wrapper.vm.openSecondFloor();
      await flush();
      const floor = wrapper.find('.sn-paging__f2-scroll');
      const el = floor.element as HTMLElement;
      Object.defineProperty(el, 'clientHeight', { value: 400, configurable: true });
      Object.defineProperty(el, 'scrollHeight', { value: 400, configurable: true });
      vi.advanceTimersByTime(100);
      await flush();

      await floor.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await floor.trigger('touchmove', { touches: [{ clientY: 280 }] });
      await floor.trigger('touchend');
      await flush();
      expect(wrapper.emitted('secondFloorChange')).toEqual([['go']]);
      expect(wrapper.find('.sn-paging__f2').attributes('style')).toContain('translateY(0%)');
      vi.useRealTimers();
    });

    it('a scrollable floor scrolls first and only dismisses at the bottom', async () => {
      vi.useFakeTimers();
      const { wrapper } = mountIdle({ secondFloorEnabled: true });
      wrapper.vm.openSecondFloor();
      await flush();
      const floor = wrapper.find('.sn-paging__f2-scroll');
      const el = floor.element as HTMLElement;
      Object.defineProperty(el, 'clientHeight', { value: 400, configurable: true });
      Object.defineProperty(el, 'scrollHeight', { value: 800, configurable: true });
      vi.advanceTimersByTime(100);
      await flush();

      // At the top the up-drag belongs to the inner scroll — no floor drag.
      await floor.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await floor.trigger('touchmove', { touches: [{ clientY: 100 }] });
      await floor.trigger('touchend');
      await flush();
      expect(wrapper.find('.sn-paging__f2').attributes('style')).toContain('translateY(0%)');

      // Scrolled to the bottom: the same gesture now dismisses the floor.
      el.dispatchEvent(
        new CustomEvent('scroll', { detail: { scrollTop: 400, scrollHeight: 800 } }),
      );
      await floor.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await floor.trigger('touchmove', { touches: [{ clientY: 100 }] });
      await floor.trigger('touchend');
      await flush();
      expect(wrapper.emitted('secondFloorChange')).toEqual([['go'], ['close']]);
      vi.useRealTimers();
    });
  });

  describe('background / color forwarding', () => {
    it('refresherBackground reaches the native attribute and the reveal box', async () => {
      const { wrapper } = mountPaging({ auto: false, refresherBackground: '#0b1220' });
      expect(wrapper.find('scroll-view').attributes('refresher-background')).toBe('#0b1220');
      expect(refresherStyleAttr(wrapper)).toContain('background: #0b1220');
    });

    it('refresherBackground stays unset by default', () => {
      const { wrapper } = mountPaging({ auto: false });
      expect(wrapper.find('scroll-view').attributes('refresher-background')).toBeUndefined();
      expect(refresherStyleAttr(wrapper)).not.toContain('background');
    });

    it('refresher text and icon colors bind inline', async () => {
      const { wrapper } = mountPaging({
        auto: false,
        refresherTextColor: '#e2e8f0',
        refresherIconColor: '#38bdf8',
      });
      expect(refresherStyleAttr(wrapper)).toContain('color: #38bdf8');
      expect(wrapper.find('.sn-paging__refresher-text').attributes('style')).toContain(
        'color: #e2e8f0',
      );
    });

    it('loadMoreTextColor binds to the footer text', async () => {
      const { wrapper } = mountPaging({ auto: false, loadMoreTextColor: '#f59e0b' });
      // With auto=false a query must be in flight for `complete` to apply.
      wrapper.vm.reload();
      wrapper.vm.complete(['a']);
      await flush();
      expect(wrapper.find('.sn-paging__footer-text').attributes('style')).toContain(
        'color: #f59e0b',
      );
    });
  });

  describe('passthrough / forwarding', () => {
    it('re-emits scroll-view scroll events', async () => {
      const { wrapper } = mountPaging({ auto: false });
      await wrapper.find('scroll-view').trigger('scroll', { detail: { scrollTop: 5 } });
      expect(wrapper.emitted('scroll')?.[0]?.[0]).toMatchObject({ detail: { scrollTop: 5 } });
    });

    it('forwards customClass and customStyle to the root', () => {
      const { wrapper } = mountPaging({
        auto: false,
        customClass: 'my-list',
        customStyle: 'height: 50vh',
      });
      expect(wrapper.classes()).toContain('sn-paging');
      expect(wrapper.classes()).toContain('my-list');
      expect(wrapper.attributes('style')).toContain('height: 50vh');
      expect(wrapper.find('scroll-view').classes()).toContain('sn-paging__scroll');
    });

    it('adds the safe-area modifier only when safeAreaInsetBottom is set', () => {
      const on = mountPaging({ auto: false, safeAreaInsetBottom: true });
      expect(on.wrapper.classes()).toContain('sn-paging--safe-bottom');
      const off = mountPaging({ auto: false });
      expect(off.wrapper.classes()).not.toContain('sn-paging--safe-bottom');
    });

    it('renders the fixed #top / #bottom slot areas', () => {
      const wrapper = mount(SnPaging, {
        props: { modelValue: [], 'onUpdate:modelValue': () => {} },
        slots: {
          top: '<text class="custom-top">顶部</text>',
          bottom: '<text class="custom-bottom">底部</text>',
        },
      });
      expect(wrapper.find('.sn-paging__fixed--top .custom-top').text()).toBe('顶部');
      expect(wrapper.find('.sn-paging__fixed--bottom .custom-bottom').text()).toBe('底部');
    });

    it('renders empty fixed areas when the slots are unused', () => {
      const { wrapper } = mountPaging({ auto: false });
      const top = wrapper.find('.sn-paging__fixed--top');
      expect(top.exists()).toBe(true);
      expect(top.text()).toBe('');
      expect(wrapper.find('.sn-paging__fixed--bottom').text()).toBe('');
    });
  });
});

describe('sn-paging (refresher lifecycle edges)', () => {
  it('holds the success text for refresherCompleteDuration then collapses', async () => {
    vi.useFakeTimers();
    const { wrapper } = mountPaging();
    wrapper.vm.complete(['first']);
    await flush();
    await wrapper.find('scroll-view').trigger('refresherrefresh');
    wrapper.vm.completeByNoMore(['a'], false);
    await flush();
    expect(wrapper.find('.sn-paging__refresher-text').text()).toBe('刷新成功');
    vi.advanceTimersByTime(500);
    await flush();
    expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
  });

  it('collapses a pending success hold when a load-more completes', async () => {
    vi.useFakeTimers();
    const { wrapper, list } = mountPaging();
    wrapper.vm.complete(['first']);
    await flush();
    await wrapper.find('scroll-view').trigger('refresherrefresh');
    wrapper.vm.completeByNoMore(['a'], false);
    await flush();
    expect(wrapper.find('.sn-paging__refresher-text').text()).toBe('刷新成功');
    // A load-more starts and finishes while the success hold is still pending.
    await wrapper.find('scroll-view').trigger('scrolltolower');
    wrapper.vm.completeByNoMore(['b'], false);
    await flush();
    // The stale hold was cleared: the refresher collapsed right away instead
    // of waiting out the success timer.
    expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
    // The pull-refresh replaced the list, the load-more appended to it.
    expect(list()).toEqual(['a', 'b']);
    vi.advanceTimersByTime(1000);
    await flush();
    expect(wrapper.find('.sn-paging__refresher-text').text()).toBe('继续下拉刷新');
  });

  it('keeps the success hold when the native refresherrestore arrives early', async () => {
    vi.useFakeTimers();
    const { wrapper } = mountPaging();
    wrapper.vm.complete(['first']);
    await flush();
    await wrapper.find('scroll-view').trigger('refresherrefresh');
    wrapper.vm.completeByNoMore(['a'], false);
    await flush();
    // The restore event fires while the success text is held — the hold wins.
    await wrapper.find('scroll-view').trigger('refresherrestore');
    await flush();
    expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('true');
    vi.advanceTimersByTime(500);
    await flush();
    expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false');
  });

  it('disposes the browser gesture and pending holds on unmount', async () => {
    vi.useFakeTimers();
    const { wrapper } = mountPaging();
    await wrapper.find('scroll-view').trigger('refresherrefresh');
    wrapper.vm.complete(['a']);
    await flush();
    // Unmount with a pending success hold and a bound gesture: no dangling
    // timer may fire afterwards.
    wrapper.unmount();
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
  });

  it('disposes a pending second-floor timer on unmount', async () => {
    vi.useFakeTimers();
    const { wrapper } = mountPaging({ secondFloorEnabled: true });
    wrapper.vm.openSecondFloor();
    wrapper.unmount();
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
  });
});
