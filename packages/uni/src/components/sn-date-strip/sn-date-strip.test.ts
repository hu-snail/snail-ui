/**
 * sn-date-strip unit tests — uni-end horizontal date strip (swiper pages).
 *
 * Behaviour only (AGENTS.md §46): page rendering, whole-column single /
 * range selection writes, the formatter hook, lunar captions, the nav
 * buttons + slots, swiper-driven paging and bounds clamping.
 * No rpx numbers in assertions.
 *
 * Note on the harness: happy-dom renders `<swiper>` as an inert unknown
 * element, so ALL three pages (prev / current / next) are in the DOM at
 * once. Every page-dependent assertion scopes to the middle page, which is
 * the one `swiperCurrent` points at.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnDateStrip from './sn-date-strip.vue';
import { lunarDayLabel } from '../../utils/sn-lunar';

/** 2024-06-23 (Sunday) — page 0 starts here. */
const JUNE_23 = new Date(2024, 5, 23).getTime();
const JUNE_26 = new Date(2024, 5, 26).getTime();
const JUNE_27 = new Date(2024, 5, 27).getTime();
const JUNE_28 = new Date(2024, 5, 28).getTime();
const JUNE_30 = new Date(2024, 5, 30).getTime();

function mountStrip(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
  return mount(SnDateStrip, {
    props: {
      startDate: JUNE_23,
      ...props,
    },
    ...options,
  });
}

/** The middle swiper-item — the page `swiperCurrent` points at. */
const currentPage = (w: ReturnType<typeof mount>) =>
  w.findAll('.sn-date-strip__page')[1] ?? w.find('.sn-date-strip__page');

const cells = (w: ReturnType<typeof mount>) => currentPage(w).findAll('.sn-date-strip__day');

const texts = (w: ReturnType<typeof mount>) =>
  cells(w).map((c) => c.find('.sn-date-strip__text').text());

describe('sn-date-strip', () => {
  describe('structure', () => {
    it('renders count columns per page starting from startDate', () => {
      const w = mountStrip({ count: 7 });
      expect(cells(w)).toHaveLength(7);
      expect(texts(w)).toEqual(['23', '24', '25', '26', '27', '28', '29']);
    });

    it('renders the weekday caption per column (23 June 2024 = 周日)', () => {
      const w = mountStrip();
      const weeks = cells(w).map((c) => c.find('.sn-date-strip__week').text());
      expect(weeks[0]).toBe('日');
      expect(weeks).toHaveLength(7);
    });

    it('hides the weekday caption when showWeek is false', () => {
      const w = mountStrip({ showWeek: false });
      expect(currentPage(w).find('.sn-date-strip__week').exists()).toBe(false);
    });

    it('starts on the page containing the bound value', () => {
      const w = mountStrip({ modelValue: JUNE_30 });
      expect(texts(w)).toEqual(['30', '1', '2', '3', '4', '5', '6']);
    });
  });

  describe('whole-column selection', () => {
    it('highlights the whole column (weekday + number) of the bound value', () => {
      const w = mountStrip({ modelValue: JUNE_27 });
      expect(cells(w)[4]?.classes()).toContain('sn-date-strip__day--selected');
      expect(cells(w)[3]?.classes()).not.toContain('sn-date-strip__day--selected');
    });

    it('emits the tapped day timestamp', async () => {
      const w = mountStrip({ modelValue: null });
      await cells(w)[3]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([JUNE_26]);
      expect(w.emitted('change')?.[0]).toEqual([{ value: JUNE_26 }]);
    });

    it('does not re-emit when the selected day is tapped again', async () => {
      const w = mountStrip({ modelValue: JUNE_27 });
      await cells(w)[4]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('marks range start / middle / end columns', () => {
      const w = mountStrip({ type: 'range', modelValue: [JUNE_26, JUNE_28] });
      expect(cells(w)[3]?.classes()).toContain('sn-date-strip__day--selected');
      expect(cells(w)[4]?.classes()).toContain('sn-date-strip__day--middle');
      expect(cells(w)[5]?.classes()).toContain('sn-date-strip__day--selected');
    });

    it('completes and restarts ranges like the calendar semantics', async () => {
      const w = mountStrip({ type: 'range', modelValue: [JUNE_26] });
      await cells(w)[5]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([[JUNE_26, JUNE_28]]);

      const w2 = mountStrip({ type: 'range', modelValue: [JUNE_26, JUNE_28] });
      await cells(w2)[4]?.trigger('tap');
      expect(w2.emitted('update:modelValue')?.[0]).toEqual([[JUNE_27]]);
    });
  });

  describe('formatter', () => {
    it('rewrites the bottom caption (价格场景)', () => {
      const w = mountStrip({
        formatter: (item: { date: number; bottomInfo: string }) => ({
          ...item,
          bottomInfo: item.date === JUNE_26 ? '¥60' : item.bottomInfo,
        }),
      });
      const infos = cells(w)[3]?.findAll('.sn-date-strip__info').map((t) => t.text());
      expect(infos).toContain('¥60');
    });

    it('rewrites the day text', () => {
      const w = mountStrip({
        formatter: (item: { text: string }) => ({ ...item, text: `${item.text}日` }),
      });
      expect(texts(w)[0]).toBe('23日');
    });
  });

  describe('showLunar (additive)', () => {
    it('fills the bottom caption with the lunar day name', () => {
      const w = mountStrip({ showLunar: true });
      const info = cells(w)[3]?.find('.sn-date-strip__info');
      expect(info?.text()).toBe(lunarDayLabel(JUNE_26));
    });

    it('shows the month name on 初一 (leap month included)', () => {
      const w = mountStrip({ showLunar: true, startDate: new Date(2025, 6, 25).getTime() });
      expect(cells(w)[0]?.find('.sn-date-strip__info').text()).toBe('闰六月');
    });

    it('lets the formatter override the lunar caption', () => {
      const w = mountStrip({
        showLunar: true,
        formatter: (item: { date: number; bottomInfo: string }) =>
          item.date === JUNE_26 ? { ...item, bottomInfo: '¥60' } : item,
      });
      expect(cells(w)[3]?.find('.sn-date-strip__info').text()).toBe('¥60');
    });

    it('renders no caption by default', () => {
      const w = mountStrip();
      expect(currentPage(w).find('.sn-date-strip__info').exists()).toBe(false);
    });
  });

  describe('navigation buttons', () => {
    it('renders the prev / next buttons with the default arrows when showNav is set', () => {
      const w = mountStrip({ showNav: true });
      const navs = w.findAll('.sn-date-strip__nav');
      expect(navs).toHaveLength(2);
      expect(navs[0]?.text()).toBe('‹');
      expect(navs[1]?.text()).toBe('›');
    });

    it('renders no nav buttons by default', () => {
      const w = mountStrip();
      expect(w.find('.sn-date-strip__nav').exists()).toBe(false);
    });

    it('lets the prev / next slots replace the button content', () => {
      const w = mountStrip(
        { showNav: true },
        {
          slots: {
            prev: '<text class="my-prev">上一页</text>',
            next: '<text class="my-next">下一页</text>',
          },
        },
      );
      expect(w.find('.my-prev').text()).toBe('上一页');
      expect(w.find('.my-next').text()).toBe('下一页');
      expect(w.find('.sn-date-strip__arrow').exists()).toBe(false);
    });

    it('pages forward / backward on button tap and emits pagechange', async () => {
      const w = mountStrip({ showNav: true });
      await w.findAll('.sn-date-strip__nav')[1]?.trigger('tap');
      // 按钮只把 swiper 推向下一页；动画结束（animationfinish）后真正翻页。
      await w.find('.sn-date-strip__swiper').trigger('animationfinish');
      expect(texts(w)[0]).toBe('30');
      expect(w.emitted('pagechange')?.[0]?.[0]).toEqual({
        start: JUNE_30,
        end: JUNE_30 + 6 * 86400000,
        index: 1,
      });

      await w.findAll('.sn-date-strip__nav')[0]?.trigger('tap');
      await w.find('.sn-date-strip__swiper').trigger('animationfinish');
      expect(texts(w)[0]).toBe('23');
    });
  });

  describe('swiper paging', () => {
    it('advances the page after a swipe change + animationfinish', async () => {
      const w = mountStrip();
      const swiper = w.find('.sn-date-strip__swiper');
      await swiper.trigger('change', { detail: { current: 2 } });
      await swiper.trigger('animationfinish');
      expect(texts(w)[0]).toBe('30');
    });

    it('goes back one page after a left swipe', async () => {
      const w = mountStrip();
      const swiper = w.find('.sn-date-strip__swiper');
      await swiper.trigger('change', { detail: { current: 0 } });
      await swiper.trigger('animationfinish');
      expect(texts(w)[0]).toBe('16');
    });

    it('keeps the page when the swipe settles back on the middle', async () => {
      const w = mountStrip();
      const swiper = w.find('.sn-date-strip__swiper');
      await swiper.trigger('change', { detail: { current: 0 } });
      await swiper.trigger('change', { detail: { current: 1 } });
      await swiper.trigger('animationfinish');
      expect(texts(w)[0]).toBe('23');
      expect(w.emitted('pagechange')).toBeUndefined();
    });

    it('clamps paging to the minDate / maxDate bounds', async () => {
      const w = mountStrip({ minDate: JUNE_23, maxDate: JUNE_30 });
      const swiper = w.find('.sn-date-strip__swiper');
      // 越界再右滑一页：夹回最大页（30 日所在页）。
      await swiper.trigger('change', { detail: { current: 2 } });
      await swiper.trigger('animationfinish');
      await swiper.trigger('change', { detail: { current: 2 } });
      await swiper.trigger('animationfinish');
      expect(texts(w)[0]).toBe('30');
    });

    it('disables cells outside min / max and ignores taps on them', async () => {
      const w = mountStrip({
        minDate: JUNE_26,
        maxDate: JUNE_28,
        modelValue: null,
      });
      expect(cells(w)[0]?.classes()).toContain('sn-date-strip__day--disabled');
      await cells(w)[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();

      await cells(w)[3]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([JUNE_26]);
    });

    it('ignores every tap when the whole strip is disabled', async () => {
      const w = mountStrip({ disabled: true });
      await cells(w)[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('exposed methods', () => {
    it('jumpTo moves to the page containing the date', async () => {
      const w = mountStrip();
      w.vm.jumpTo(JUNE_30);
      await w.vm.$nextTick();
      expect(texts(w)[0]).toBe('30');
    });
  });
});
