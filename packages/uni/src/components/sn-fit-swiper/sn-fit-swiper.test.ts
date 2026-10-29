/**
 * sn-fit-swiper unit tests — uni-end adaptive-height carousel.
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - one page per `list` row, with the scoped slot receiving
 *     `{ page, index, active }`
 *   - `autoplay` / `interval` / `duration` / `loop` / `current` forward to the
 *     native `<swiper>`, with out-of-range `current` clamped into range
 *   - the container height follows the ACTIVE page's measured content height
 *     (`uni.createSelectorQuery` stub), switches on `change`, re-measures on
 *     `animationfinish` / list changes / `refit()`, and stays on the
 *     placeholder height when no uni host exists (happy-dom / SSR)
 *   - the height transition is applied only after the first fit and only when
 *     `animateHeight` is on
 *   - `indicator` accepts `true`, `false` and a config object; `minShowNum`
 *     gates visibility, `type` picks dots / bars / fraction, and the
 *     `#indicator` slot replaces the built-in rendering entirely
 *   - `change` / `animationfinish` / `click` / `heightchange` /
 *     `update:current` payloads
 *
 * Untestable in happy-dom: touch-swipe physics, autoplay timing and the
 * platform selector-query geometry itself — `<swiper>` renders as an inert
 * unknown element and the real query comes from the uni runtime, so the
 * measurement path is exercised through a `uni.createSelectorQuery` stub.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import SnFitSwiper from './sn-fit-swiper.vue';

const pages = [{ title: '电影' }, { title: '旅行' }, { title: '美食' }];

/** Height rects the stubbed selector query returns, in page order. */
const FIT_RECTS = [180.4, 120.5, 95];

/** Install a `uni.createSelectorQuery` stub returning fixed page heights. */
function installUniQuery(rects: number[]): void {
  (globalThis as { uni?: unknown }).uni = {
    createSelectorQuery: () => ({
      in: () => ({
        selectAll: () => ({
          boundingClientRect: (callback: (value: Array<{ height: number }>) => void) => ({
            exec: () => callback(rects.map((height) => ({ height }))),
          }),
        }),
      }),
    }),
  };
}

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni;
});

/** Root inline style of the mounted component. */
function rootStyleOf(wrapper: ReturnType<typeof mount>): string {
  return wrapper.attributes('style') ?? '';
}

describe('sn-fit-swiper', () => {
  describe('rendering', () => {
    it('renders one page per list row with the scoped slot content', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages },
        slots: {
          default: `<template #default="{ page }"><view class="page-body">{{ page.title }}</view></template>`,
        },
      });
      expect(wrapper.findAll('.sn-fit-swiper__item')).toHaveLength(3);
      const bodies = wrapper.findAll('.page-body');
      expect(bodies).toHaveLength(3);
      expect(bodies[0]!.text()).toBe('电影');
      expect(bodies[2]!.text()).toBe('美食');
    });

    it('passes the row index and active flag to the slot', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, current: 1 },
        slots: {
          default:
            `<template #default="{ index, active }">` +
            `<view class="page-flag">{{ index }}:{{ active }}</view>` +
            `</template>`,
        },
      });
      const flags = wrapper.findAll('.page-flag').map((node) => node.text());
      expect(flags).toEqual(['0:false', '1:true', '2:false']);
    });

    it('renders nothing for an empty list', () => {
      const wrapper = mount(SnFitSwiper, { props: { list: [] } });
      expect(wrapper.findAll('.sn-fit-swiper__item')).toHaveLength(0);
      expect(wrapper.find('.sn-fit-swiper__indicator').exists()).toBe(false);
    });
  });

  describe('native swiper forwarding', () => {
    it('forwards the native swiper props', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, autoplay: false, interval: 3000, duration: 500, loop: false },
      });
      const swiper = wrapper.find('.sn-fit-swiper__native');
      expect(swiper.attributes('autoplay')).toBe('false');
      expect(swiper.attributes('interval')).toBe('3000');
      expect(swiper.attributes('duration')).toBe('500');
      expect(swiper.attributes('circular')).toBe('false');
    });

    it('forwards the seeded current index to the native swiper', () => {
      const wrapper = mount(SnFitSwiper, { props: { list: pages, current: 2 } });
      expect(wrapper.find('.sn-fit-swiper__native').attributes('current')).toBe('2');
    });

    it('clamps an out-of-range current into the list range', () => {
      const wrapper = mount(SnFitSwiper, { props: { list: pages, current: 7 } });
      expect(wrapper.find('.sn-fit-swiper__native').attributes('current')).toBe('2');
    });
  });

  describe('height fitting', () => {
    it('keeps the placeholder height when no uni host exists', async () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, height: '240px' },
      });
      await flushPromises();
      const style = rootStyleOf(wrapper);
      expect(style).toContain('height: 240px');
      expect(style).not.toContain('transition');
    });

    it('fits the container to the active page height after mount', async () => {
      installUniQuery(FIT_RECTS);
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      await flushPromises();
      const style = rootStyleOf(wrapper);
      expect(style).toContain('height: 181px'); // ceil(180.4)
      expect(style).toContain('transition: height 300ms ease');
    });

    it('emits heightchange once per actual height change', async () => {
      installUniQuery(FIT_RECTS);
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      await flushPromises();
      expect(wrapper.emitted('heightchange')).toEqual([[{ height: 181 }]]);
    });

    it('switches to the new page height on change', async () => {
      installUniQuery(FIT_RECTS);
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      await flushPromises();
      await wrapper.find('.sn-fit-swiper__native').trigger('change', {
        detail: { current: 1, source: 'touch' },
      });
      await flushPromises();
      expect(rootStyleOf(wrapper)).toContain('height: 121px'); // ceil(120.5)
      expect(wrapper.emitted('heightchange')?.[1]).toEqual([{ height: 121 }]);
    });

    it('switches the height when the parent re-seeds current', async () => {
      installUniQuery(FIT_RECTS);
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      await flushPromises();
      await wrapper.setProps({ current: 2 });
      await flushPromises();
      expect(rootStyleOf(wrapper)).toContain('height: 95px');
    });

    it('re-measures on animationfinish and stays quiet when nothing changed', async () => {
      installUniQuery(FIT_RECTS);
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      await flushPromises();
      await wrapper.find('.sn-fit-swiper__native').trigger('animationfinish', {
        detail: { current: 0, source: 'touch' },
      });
      await flushPromises();
      // Same rects → same height → no duplicated heightchange.
      expect(wrapper.emitted('heightchange')).toHaveLength(1);

      installUniQuery([200, 120.5, 95]);
      await wrapper.find('.sn-fit-swiper__native').trigger('animationfinish', {
        detail: { current: 0, source: 'touch' },
      });
      await flushPromises();
      expect(rootStyleOf(wrapper)).toContain('height: 200px');
      expect(wrapper.emitted('heightchange')).toHaveLength(2);
    });

    it('re-measures when the list changes', async () => {
      installUniQuery(FIT_RECTS);
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      await flushPromises();
      installUniQuery([400, 100]);
      await wrapper.setProps({ list: [{ title: '新版一' }, { title: '新版二' }] });
      await flushPromises();
      expect(rootStyleOf(wrapper)).toContain('height: 400px');
    });

    it('applies refit() after async content changes', async () => {
      installUniQuery(FIT_RECTS);
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      await flushPromises();
      const api = wrapper.vm as unknown as { refit: () => Promise<void> };
      installUniQuery([260, 120.5, 95]);
      await api.refit();
      await flushPromises();
      expect(rootStyleOf(wrapper)).toContain('height: 260px');
    });

    it('keeps the placeholder height when measurement is unavailable', async () => {
      // uni host exists but without createSelectorQuery (mis-shaped host).
      (globalThis as { uni?: unknown }).uni = {};
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, height: '240px' },
      });
      await flushPromises();
      expect(rootStyleOf(wrapper)).toContain('height: 240px');
      expect(wrapper.emitted('heightchange')).toBeUndefined();
    });

    it('ignores zero-height rects and keeps the placeholder', async () => {
      installUniQuery([0, 0, 0]);
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, height: '240px' },
      });
      await flushPromises();
      expect(rootStyleOf(wrapper)).toContain('height: 240px');
    });

    it('drops the height transition while animateHeight is off', async () => {
      installUniQuery(FIT_RECTS);
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, animateHeight: false },
      });
      await flushPromises();
      const style = rootStyleOf(wrapper);
      expect(style).toContain('height: 181px');
      expect(style).not.toContain('transition');
    });

    it('honours a custom height transition duration', async () => {
      installUniQuery(FIT_RECTS);
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, heightDuration: 480 },
      });
      await flushPromises();
      expect(rootStyleOf(wrapper)).toContain('transition: height 480ms ease');
    });
  });

  describe('events', () => {
    it('emits change + update:current from the native change event', async () => {
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      await wrapper.find('.sn-fit-swiper__native').trigger('change', {
        detail: { current: 1, source: 'touch' },
      });
      expect(wrapper.emitted('update:current')?.[0]).toEqual([1]);
      expect(wrapper.emitted('change')?.[0]).toEqual([{ current: 1, source: 'touch' }]);
    });

    it('emits animationfinish from the native event', async () => {
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      await wrapper.find('.sn-fit-swiper__native').trigger('animationfinish', {
        detail: { current: 2, source: 'autoplay' },
      });
      expect(wrapper.emitted('animationfinish')?.[0]).toEqual([
        { current: 2, source: 'autoplay' },
      ]);
    });

    it('emits click with the page index and raw row', async () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages },
        slots: { default: `<view class="page-body" />` },
      });
      await wrapper.findAll('.sn-fit-swiper__content')[1]!.trigger('tap');
      expect(wrapper.emitted('click')?.[0]).toEqual([{ index: 1, page: pages[1] }]);
    });

    it('keeps tracking the active page without a bound current (uncontrolled)', async () => {
      installUniQuery(FIT_RECTS);
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, indicator: { type: 'fraction' } },
      });
      await flushPromises();
      await wrapper.find('.sn-fit-swiper__native').trigger('change', {
        detail: { current: 2, source: 'touch' },
      });
      expect(wrapper.find('.sn-fit-swiper__fraction-text').text()).toBe('3/3');
      expect(wrapper.find('.sn-fit-swiper__native').attributes('current')).toBe('2');
    });
  });

  describe('indicator', () => {
    it('shows dots by default when there are at least two pages', () => {
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      expect(wrapper.find('.sn-fit-swiper__indicator').exists()).toBe(true);
      expect(wrapper.findAll('.sn-fit-swiper__dot')).toHaveLength(3);
      expect(wrapper.find('.sn-fit-swiper__indicator').attributes('aria-hidden')).toBe('true');
    });

    it('marks the active dot', () => {
      const wrapper = mount(SnFitSwiper, { props: { list: pages, current: 2 } });
      const dots = wrapper.findAll('.sn-fit-swiper__dot');
      expect(dots[2]!.classes()).toContain('sn-fit-swiper__dot--active');
      expect(dots[0]!.classes()).not.toContain('sn-fit-swiper__dot--active');
    });

    it('hides the indicator when indicator is false', () => {
      const wrapper = mount(SnFitSwiper, { props: { list: pages, indicator: false } });
      expect(wrapper.find('.sn-fit-swiper__indicator').exists()).toBe(false);
    });

    it('hides the indicator below minShowNum', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, indicator: { minShowNum: 5 } },
      });
      expect(wrapper.find('.sn-fit-swiper__indicator').exists()).toBe(false);
    });

    it('shows a single page when minShowNum is lowered', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: [pages[0]!], indicator: { minShowNum: 1 } },
      });
      expect(wrapper.find('.sn-fit-swiper__indicator').exists()).toBe(true);
    });

    it('renders the dots-bar indicator', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, indicator: { type: 'dots-bar' } },
      });
      expect(wrapper.findAll('.sn-fit-swiper__dot--bar')).toHaveLength(3);
      expect(wrapper.find('.sn-fit-swiper__indicator').classes()).toContain(
        'sn-fit-swiper__indicator--dots-bar',
      );
    });

    it('renders the fraction indicator', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, current: 1, indicator: { type: 'fraction' } },
      });
      expect(wrapper.find('.sn-fit-swiper__fraction-text').text()).toBe('2/3');
    });

    it('moves the active dot when the page changes', async () => {
      const wrapper = mount(SnFitSwiper, { props: { list: pages } });
      await wrapper.find('.sn-fit-swiper__native').trigger('change', {
        detail: { current: 1, source: 'touch' },
      });
      const dots = wrapper.findAll('.sn-fit-swiper__dot');
      expect(dots[1]!.classes()).toContain('sn-fit-swiper__dot--active');
      expect(dots[0]!.classes()).not.toContain('sn-fit-swiper__dot--active');
    });

    it('applies the indicator position class', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, indicatorPosition: 'top-right' },
      });
      expect(wrapper.find('.sn-fit-swiper__indicator').classes()).toContain(
        'sn-fit-swiper__indicator--top-right',
      );
    });

    it('replaces the built-in indicator with the indicator slot', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages },
        slots: {
          indicator:
            `<template #indicator="{ current, total }">` +
            `<text class="my-indicator">{{ current + 1 }} 页 / 共 {{ total }} 页</text>` +
            `</template>`,
        },
      });
      expect(wrapper.find('.sn-fit-swiper__dot').exists()).toBe(false);
      expect(wrapper.find('.sn-fit-swiper__fraction').exists()).toBe(false);
      expect(wrapper.find('.my-indicator').text()).toBe('1 页 / 共 3 页');
    });

    it('applies customIndicatorClass / customIndicatorStyle to the indicator node', () => {
      const wrapper = mount(SnFitSwiper, {
        props: {
          list: pages,
          customIndicatorClass: 'my-indicator',
          customIndicatorStyle: 'padding: 8px',
        },
      });
      const indicator = wrapper.find('.sn-fit-swiper__indicator');
      expect(indicator.classes()).toContain('my-indicator');
      expect(indicator.attributes('style')).toContain('padding: 8px');
    });
  });

  describe('custom classes and styles', () => {
    it('merges customStyle into the root style', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, customStyle: 'margin: 8px' },
      });
      expect(rootStyleOf(wrapper)).toContain('margin: 8px');
    });

    it('applies a px radius on the root', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, radius: '12px' },
      });
      expect(rootStyleOf(wrapper)).toContain('border-radius: 12px');
    });

    it('applies customPageClass to every page item', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, customPageClass: 'my-page' },
      });
      for (const item of wrapper.findAll('.sn-fit-swiper__item')) {
        expect(item.classes()).toContain('my-page');
      }
    });

    it('applies customClass on the root node', () => {
      const wrapper = mount(SnFitSwiper, {
        props: { list: pages, customClass: 'my-fit-swiper' },
      });
      expect(wrapper.classes()).toContain('my-fit-swiper');
    });
  });
});
