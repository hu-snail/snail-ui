/**
 * sn-badge unit tests — uni-end count / dot marker (AUI-MP-DS-002).
 *
 * Covers the reference surface: value / max / isDot / hidden / type / bgColor /
 * showZero / shape / border / top / right / customClass / customStyle.
 *
 * Assertions stay on classes / attributes / text — happy-dom drops CSS lengths
 * it cannot parse, so `rpx` values are never asserted.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnBadge from './sn-badge.vue';

describe('sn-badge', () => {
  describe('value rendering', () => {
    it('renders the wrapped content and the numeric value', () => {
      const w = mount(SnBadge, { props: { value: 8 }, slots: { default: 'host' } });
      expect(w.text()).toContain('host');
      expect(w.find('.sn-badge__marker').text()).toBe('8');
    });

    it('renders a string value verbatim', () => {
      const w = mount(SnBadge, { props: { value: 'new' } });
      expect(w.find('.sn-badge__marker').text()).toBe('new');
    });

    it('caps a numeric value at max with a trailing plus', () => {
      const w = mount(SnBadge, { props: { value: 120, max: 99 } });
      expect(w.find('.sn-badge__marker').text()).toBe('99+');
    });

    it('ignores max for string values', () => {
      const w = mount(SnBadge, { props: { value: 'v120', max: 99 } });
      expect(w.find('.sn-badge__marker').text()).toBe('v120');
    });

    it('renders no marker when value is absent', () => {
      const w = mount(SnBadge, { slots: { default: 'host' } });
      expect(w.find('.sn-badge__marker').exists()).toBe(false);
    });

    it('suppresses a zero value by default', () => {
      const w = mount(SnBadge, { props: { value: 0 } });
      expect(w.find('.sn-badge__marker').exists()).toBe(false);
    });

    it('renders a zero value when showZero is on', () => {
      const w = mount(SnBadge, { props: { value: 0, showZero: true } });
      expect(w.find('.sn-badge__marker').text()).toBe('0');
    });

    it('hides the marker when hidden is on, even with a value', () => {
      const w = mount(SnBadge, { props: { value: 5, hidden: true } });
      expect(w.find('.sn-badge__marker').exists()).toBe(false);
    });
  });

  describe('dot mode', () => {
    it('renders a dot marker without text', () => {
      const w = mount(SnBadge, { props: { isDot: true } });
      expect(w.classes()).toContain('sn-badge--dot');
      expect(w.find('.sn-badge__marker').exists()).toBe(true);
      expect(w.find('.sn-badge__marker').text()).toBe('');
      expect(w.find('.sn-badge__marker').attributes('aria-hidden')).toBe('true');
    });

    it('renders a dot even without a value', () => {
      const w = mount(SnBadge, { props: { isDot: true, value: undefined } });
      expect(w.find('.sn-badge__marker').exists()).toBe(true);
    });
  });

  describe('type', () => {
    it('renders the danger marker by default', () => {
      const w = mount(SnBadge, { props: { value: 3 } });
      expect(w.find('.sn-badge__marker').classes()).not.toContain('sn-badge__marker--primary');
    });

    it('applies the type class for each semantic colour', () => {
      for (const type of ['primary', 'success', 'warning', 'danger', 'info'] as const) {
        const w = mount(SnBadge, { props: { value: 1, type } });
        expect(w.find('.sn-badge__marker').classes()).toContain(`sn-badge__marker--${type}`);
      }
    });

    it('forwards bgColor as an inline background override', () => {
      const w = mount(SnBadge, { props: { value: 1, bgColor: '#abcdef' } });
      expect(w.find('.sn-badge__marker').attributes('style')).toContain(
        'background-color: #abcdef',
      );
    });
  });

  describe('shape', () => {
    it('defaults to the circle shape', () => {
      const w = mount(SnBadge, { props: { value: 1 } });
      expect(w.find('.sn-badge__marker').classes()).toContain('sn-badge__marker--circle');
    });

    it('applies the shape class for square and bubble', () => {
      for (const shape of ['square', 'bubble'] as const) {
        const w = mount(SnBadge, { props: { value: 1, shape } });
        expect(w.find('.sn-badge__marker').classes()).toContain(`sn-badge__marker--${shape}`);
      }
    });

    it('adds the border class when border is on', () => {
      const w = mount(SnBadge, { props: { value: 1, border: true } });
      expect(w.find('.sn-badge__marker').classes()).toContain('sn-badge__marker--border');
    });
  });

  describe('offsets', () => {
    it('adds px units to numeric top / right offsets', () => {
      const w = mount(SnBadge, { props: { value: 1, top: 4, right: 6 } });
      const style = w.find('.sn-badge__marker').attributes('style') ?? '';
      expect(style).toContain('top: 4px');
      expect(style).toContain('right: 6px');
    });

    it('forwards string offsets verbatim', () => {
      const w = mount(SnBadge, { props: { value: 1, top: '8px', right: '8px' } });
      const style = w.find('.sn-badge__marker').attributes('style') ?? '';
      expect(style).toContain('top: 8px');
      expect(style).toContain('right: 8px');
    });

    it('leaves the marker style empty without offsets or bgColor', () => {
      const w = mount(SnBadge, { props: { value: 1 } });
      expect(w.find('.sn-badge__marker').attributes('style')).toBeUndefined();
    });
  });

  describe('root passthrough', () => {
    it('forwards customClass and customStyle to the root node', () => {
      const w = mount(SnBadge, {
        props: { value: 1, customClass: 'my-badge', customStyle: 'margin: 4px' },
      });
      expect(w.classes()).toContain('my-badge');
      expect(w.attributes('style')).toContain('margin: 4px');
    });
  });
});
