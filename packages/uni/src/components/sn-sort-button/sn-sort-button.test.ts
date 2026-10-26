/**
 * sn-sort-button unit tests — uni-end tri-state sort toggle.
 *
 * Behaviour only (AGENTS.md §46): the tap cycle for every option combination,
 * the emit contract and the aria mapping. No rpx numbers in assertions.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnSortButton from './sn-sort-button.vue';

const lastValue = (w: ReturnType<typeof mount>) => w.emitted('update:modelValue')?.[0]?.[0];

describe('sn-sort-button', () => {
  describe('structure', () => {
    it('renders the title', () => {
      expect(mount(SnSortButton, { props: { title: 'Price' } }).text()).toContain('Price');
    });

    it('is not active at the reset state', () => {
      const w = mount(SnSortButton, { props: { modelValue: 0 } });
      expect(w.classes()).not.toContain('sn-sort-button--active');
      expect(w.attributes('aria-sort')).toBe('none');
    });

    it('marks the ascending state', () => {
      const w = mount(SnSortButton, { props: { modelValue: 1 } });
      expect(w.classes()).toContain('sn-sort-button--asc');
      expect(w.attributes('aria-sort')).toBe('ascending');
    });

    it('marks the descending state', () => {
      const w = mount(SnSortButton, { props: { modelValue: -1 } });
      expect(w.classes()).toContain('sn-sort-button--desc');
      expect(w.attributes('aria-sort')).toBe('descending');
    });

    it('applies the line class', () => {
      expect(mount(SnSortButton, { props: { line: true } }).classes()).toContain(
        'sn-sort-button--line',
      );
    });

    it('is a focusable button', () => {
      const w = mount(SnSortButton, { props: { title: 'Price' } });
      expect(w.attributes('role')).toBe('button');
      expect(w.attributes('tabindex')).toBe('0');
    });
  });

  describe('cycle', () => {
    it('goes 0 → 1 by default', async () => {
      const w = mount(SnSortButton, { props: { modelValue: 0 } });
      await w.trigger('tap');
      expect(lastValue(w)).toBe(1);
    });

    it('goes 1 → -1 when allowReset is off', async () => {
      const w = mount(SnSortButton, { props: { modelValue: 1, allowReset: false } });
      await w.trigger('tap');
      expect(lastValue(w)).toBe(-1);
    });

    it('goes -1 → 1 when allowReset is off', async () => {
      const w = mount(SnSortButton, { props: { modelValue: -1, allowReset: false } });
      await w.trigger('tap');
      expect(lastValue(w)).toBe(1);
    });

    it('goes 1 → -1 with allowReset (three-state cycle)', async () => {
      const w = mount(SnSortButton, { props: { modelValue: 1, allowReset: true } });
      await w.trigger('tap');
      expect(lastValue(w)).toBe(-1);
    });

    it('goes -1 → 0 when allowReset is on', async () => {
      const w = mount(SnSortButton, { props: { modelValue: -1, allowReset: true } });
      await w.trigger('tap');
      expect(lastValue(w)).toBe(0);
    });

    it('goes 0 → -1 when descFirst is on', async () => {
      const w = mount(SnSortButton, { props: { modelValue: 0, descFirst: true } });
      await w.trigger('tap');
      expect(lastValue(w)).toBe(-1);
    });

    it('goes 1 → 0 when descFirst + allowReset are on', async () => {
      const w = mount(SnSortButton, {
        props: { modelValue: 1, descFirst: true, allowReset: true },
      });
      await w.trigger('tap');
      expect(lastValue(w)).toBe(0);
    });

    it('goes -1 → 1 when descFirst is on', async () => {
      const w = mount(SnSortButton, { props: { modelValue: -1, descFirst: true } });
      await w.trigger('tap');
      expect(lastValue(w)).toBe(1);
    });

    it('emits change with the same payload', async () => {
      const w = mount(SnSortButton, { props: { modelValue: 0 } });
      await w.trigger('tap');
      expect(w.emitted('change')?.[0]).toEqual([{ value: 1 }]);
    });
  });
});
