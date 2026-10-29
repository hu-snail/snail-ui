/**
 * sn-date-strip unit tests — uni-end horizontal date strip.
 *
 * Behaviour only (AGENTS.md §46): cell rendering, single / range selection
 * writes, the formatter hook, disabled bounds and the weekday header.
 * No rpx numbers in assertions.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnDateStrip from './sn-date-strip.vue';

/** 2024-06-26 local midnight (a Wednesday). */
const JUNE_26 = new Date(2024, 5, 26).getTime();
const JUNE_27 = new Date(2024, 5, 27).getTime();
const JUNE_28 = new Date(2024, 5, 28).getTime();

function mountStrip(props: Record<string, unknown> = {}) {
  return mount(SnDateStrip, {
    props: {
      startDate: JUNE_26,
      ...props,
    },
  });
}

const cells = (w: ReturnType<typeof mount>) => w.findAll('.sn-date-strip__day');
const numBlocks = (w: ReturnType<typeof mount>) => w.findAll('.sn-date-strip__num');

describe('sn-date-strip', () => {
  describe('structure', () => {
    it('renders count cells starting from startDate', () => {
      const w = mountStrip({ count: 6 });
      expect(cells(w)).toHaveLength(6);
      const texts = w.findAll('.sn-date-strip__text').map((t) => t.text());
      expect(texts).toEqual(['26', '27', '28', '29', '30', '1']);
    });

    it('renders the weekday header by default (26 = 周三)', () => {
      const w = mountStrip();
      const weeks = w.findAll('.sn-date-strip__week').map((t) => t.text());
      expect(weeks[0]).toBe('三');
    });

    it('hides the weekday header when showWeek is false', () => {
      const w = mountStrip({ showWeek: false });
      expect(w.find('.sn-date-strip__week').exists()).toBe(false);
    });
  });

  describe('single selection', () => {
    it('emits the tapped day timestamp', async () => {
      const w = mountStrip({ modelValue: null });
      await cells(w)[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([JUNE_27]);
      expect(w.emitted('change')?.[0]).toEqual([{ value: JUNE_27 }]);
    });

    it('marks the bound value selected', () => {
      const w = mountStrip({ modelValue: JUNE_27 });
      expect(numBlocks(w)[1]?.classes()).toContain('sn-date-strip__num--selected');
      expect(numBlocks(w)[0]?.classes()).not.toContain('sn-date-strip__num--selected');
    });

    it('does not re-emit when the selected day is tapped again', async () => {
      const w = mountStrip({ modelValue: JUNE_27 });
      await cells(w)[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('range selection', () => {
    it('first tap sets the pending start', async () => {
      const w = mountStrip({ type: 'range', modelValue: null });
      await cells(w)[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([[JUNE_26]]);
    });

    it('second tap completes the range and swaps when out of order', async () => {
      const w = mountStrip({ type: 'range', modelValue: [JUNE_26] });
      // 越界点选：先终点后起点 → 交换。
      await cells(w)[2]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([[JUNE_26, JUNE_28]]);

      const w2 = mountStrip({ type: 'range', modelValue: [JUNE_28] });
      await cells(w2)[0]?.trigger('tap');
      expect(w2.emitted('update:modelValue')?.[0]).toEqual([[JUNE_26, JUNE_28]]);
    });

    it('marks start / middle / end cells', () => {
      const w = mountStrip({ type: 'range', modelValue: [JUNE_26, JUNE_28] });
      expect(numBlocks(w)[0]?.classes()).toContain('sn-date-strip__num--selected');
      expect(numBlocks(w)[1]?.classes()).toContain('sn-date-strip__num--middle');
      expect(numBlocks(w)[2]?.classes()).toContain('sn-date-strip__num--selected');
    });

    it('restarts the range after it completed', async () => {
      const w = mountStrip({ type: 'range', modelValue: [JUNE_26, JUNE_28] });
      await cells(w)[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([[JUNE_27]]);
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
      const infos = cells(w)[0]?.findAll('.sn-date-strip__info').map((t) => t.text());
      expect(infos).toContain('¥60');
      expect(cells(w)[1]?.find('.sn-date-strip__info').exists()).toBe(false);
    });

    it('rewrites the day text', () => {
      const w = mountStrip({
        formatter: (item: { text: string }) => ({ ...item, text: `${item.text}日` }),
      });
      expect(w.findAll('.sn-date-strip__text')[0]?.text()).toBe('26日');
    });
  });

  describe('disabled', () => {
    it('disables cells outside min / max and ignores taps on them', async () => {
      const w = mountStrip({
        minDate: JUNE_27,
        maxDate: JUNE_28,
        modelValue: null,
      });
      expect(cells(w)[0]?.classes()).toContain('sn-date-strip__day--disabled');
      await cells(w)[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();

      await cells(w)[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([JUNE_27]);
    });

    it('ignores every tap when the whole strip is disabled', async () => {
      const w = mountStrip({ disabled: true });
      await cells(w)[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });
});
