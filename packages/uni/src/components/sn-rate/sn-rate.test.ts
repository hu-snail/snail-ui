/**
 * sn-rate unit tests — uni-end star rating.
 *
 * Behaviour only (AGENTS.md §46): icon count, score → glyph state mapping,
 * tap selection, half selection, clearable, the blocked states and the
 * per-icon active colors. No rpx numbers in assertions.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnRate from './sn-rate.vue';

const glyphs = (w: ReturnType<typeof mount>) => ({
  active: w.findAll('.sn-rate__glyph--active'),
  inactive: w.findAll('.sn-rate__glyph--inactive'),
  half: w.findAll('.sn-rate__glyph--half'),
});

describe('sn-rate', () => {
  describe('structure', () => {
    it('renders `num` items (5 by default)', () => {
      expect(mount(SnRate).findAll('.sn-rate__item')).toHaveLength(5);
      expect(mount(SnRate, { props: { num: 3 } }).findAll('.sn-rate__item')).toHaveLength(3);
    });

    it('renders every item empty when the score is null', () => {
      const w = mount(SnRate);
      expect(glyphs(w).inactive).toHaveLength(5);
      expect(glyphs(w).active).toHaveLength(0);
    });

    it('fills the glyphs up to the score', () => {
      const w = mount(SnRate, { props: { modelValue: 3 } });
      expect(glyphs(w).active).toHaveLength(3);
      expect(glyphs(w).inactive).toHaveLength(2);
    });

    it('clamps the score above `num`', () => {
      const w = mount(SnRate, { props: { modelValue: 99 } });
      expect(glyphs(w).active).toHaveLength(5);
    });

    it('exposes the score through aria', () => {
      const w = mount(SnRate, { props: { modelValue: 3 } });
      expect(w.attributes('role')).toBe('slider');
      expect(w.attributes('aria-valuenow')).toBe('3');
      expect(w.attributes('aria-valuemax')).toBe('5');
    });

    it('applies the block / disabled / readonly classes', () => {
      expect(mount(SnRate, { props: { block: true } }).classes()).toContain('sn-rate--block');
      expect(mount(SnRate, { props: { disabled: true } }).classes()).toContain('sn-rate--disabled');
      expect(mount(SnRate, { props: { readonly: true } }).classes()).toContain('sn-rate--readonly');
    });
  });

  describe('selection', () => {
    it('emits update:modelValue + change on tap', async () => {
      const w = mount(SnRate, { props: { modelValue: null } });
      await w.findAll('.sn-rate__item')[2]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([3]);
      expect(w.emitted('change')?.[0]).toEqual([{ value: 3 }]);
    });

    it('selects half a star when allowHalf and the tap lands on the left half', async () => {
      const w = mount(SnRate, { props: { allowHalf: true } });
      const item = w.findAll('.sn-rate__item')[1];
      const element = item?.element as HTMLElement;
      element.getBoundingClientRect = () =>
        ({
          left: 100,
          width: 40,
          top: 0,
          height: 40,
          right: 140,
          bottom: 40,
          x: 100,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect;
      await item?.trigger('tap', { detail: { x: 110 } });
      expect(w.emitted('update:modelValue')?.[0]).toEqual([1.5]);
    });

    it('selects a full star when the tap lands on the right half', async () => {
      const w = mount(SnRate, { props: { allowHalf: true } });
      const item = w.findAll('.sn-rate__item')[1];
      const element = item?.element as HTMLElement;
      element.getBoundingClientRect = () =>
        ({
          left: 100,
          width: 40,
          top: 0,
          height: 40,
          right: 140,
          bottom: 40,
          x: 100,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect;
      await item?.trigger('tap', { detail: { x: 135 } });
      expect(w.emitted('update:modelValue')?.[0]).toEqual([2]);
    });

    it('renders a half glyph for a .5 score', () => {
      const w = mount(SnRate, { props: { modelValue: 2.5 } });
      expect(glyphs(w).half).toHaveLength(1);
      expect(glyphs(w).active).toHaveLength(3);
    });

    it('clears back to null when clearable and the score is re-tapped', async () => {
      const w = mount(SnRate, { props: { modelValue: 3, clearable: true } });
      await w.findAll('.sn-rate__item')[2]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([null]);
    });

    it('does not clear when clearable is off', async () => {
      const w = mount(SnRate, { props: { modelValue: 3 } });
      await w.findAll('.sn-rate__item')[2]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([3]);
    });

    it('does not emit when disabled', async () => {
      const w = mount(SnRate, { props: { disabled: true } });
      await w.findAll('.sn-rate__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('does not emit when readonly', async () => {
      const w = mount(SnRate, { props: { readonly: true } });
      await w.findAll('.sn-rate__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('drops tabindex when not interactive', () => {
      expect(
        mount(SnRate, { props: { disabled: true } })
          .find('.sn-rate__item')
          .attributes('tabindex'),
      ).toBe('-1');
    });
  });

  describe('colors', () => {
    it('forwards `color` as the inactive custom property', () => {
      const w = mount(SnRate, { props: { color: 'rgb(1, 2, 3)' } });
      expect(w.attributes('style')).toContain('--sn-rate-inactive-color: rgb(1, 2, 3)');
    });

    it('forwards a single `activeColor` as the active custom property', () => {
      const w = mount(SnRate, { props: { activeColor: 'rgb(4, 5, 6)' } });
      expect(w.attributes('style')).toContain('--sn-rate-active-color: rgb(4, 5, 6)');
    });

    it('uses the per-icon color when activeColor is an array', () => {
      const w = mount(SnRate, {
        props: { modelValue: 2, activeColor: ['rgb(1, 1, 1)', 'rgb(2, 2, 2)'] },
      });
      const active = glyphs(w).active;
      expect(active[0]?.attributes('style')).toContain('rgb(1, 1, 1)');
      expect(active[1]?.attributes('style')).toContain('rgb(2, 2, 2)');
    });
  });

  describe('css icon mode', () => {
    it('renders class-based glyphs when cssIcon is on', () => {
      const w = mount(SnRate, {
        props: { cssIcon: true, icon: 'icon-star', activeIcon: 'icon-star-on' },
      });
      expect(w.find('.sn-rate__glyph--css').exists()).toBe(true);
      expect(w.find('.icon-star').exists()).toBe(true);
    });
  });
});
