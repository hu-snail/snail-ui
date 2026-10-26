/**
 * sn-gap unit tests — uni-end vertical spacer (AUI-MP-DS-004).
 *
 * Covers the reference surface: height / bgColor / safeAreaBottom /
 * customClass / customStyle, plus the "purely decorative" contract.
 *
 * Assertions stay on classes / attributes — happy-dom drops CSS lengths it
 * cannot parse, so `rpx` values are never asserted.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnGap from './sn-gap.vue';

describe('sn-gap', () => {
  describe('height', () => {
    it('defaults to 14px', () => {
      const w = mount(SnGap);
      expect(w.attributes('style')).toContain('height: 14px');
    });

    it('reads a numeric height as px', () => {
      const w = mount(SnGap, { props: { height: 24 } });
      expect(w.attributes('style')).toContain('height: 24px');
    });

    it('forwards a string height verbatim', () => {
      const w = mount(SnGap, { props: { height: '20px' } });
      expect(w.attributes('style')).toContain('height: 20px');
    });
  });

  describe('background', () => {
    it('omits the background override for the transparent default', () => {
      const w = mount(SnGap);
      expect(w.attributes('style')).not.toContain('background-color');
    });

    it('forwards bgColor as an inline background', () => {
      const w = mount(SnGap, { props: { bgColor: '#abcdef' } });
      expect(w.attributes('style')).toContain('background-color: #abcdef');
    });
  });

  describe('safe area', () => {
    it('adds no safe-area class by default', () => {
      const w = mount(SnGap);
      expect(w.classes()).not.toContain('sn-gap--safe-area');
    });

    it('adds the safe-area class when safeAreaBottom is on', () => {
      const w = mount(SnGap, { props: { safeAreaBottom: true } });
      expect(w.classes()).toContain('sn-gap--safe-area');
    });
  });

  describe('root passthrough', () => {
    it('forwards customClass and customStyle to the root node', () => {
      const w = mount(SnGap, { props: { customClass: 'my-gap', customStyle: 'margin: 4px' } });
      expect(w.classes()).toContain('my-gap');
      expect(w.attributes('style')).toContain('margin: 4px');
    });
  });

  describe('decoration contract', () => {
    it('renders no content and is hidden from assistive tech', () => {
      const w = mount(SnGap, { slots: { default: 'ignored' } });
      expect(w.text()).toBe('');
      expect(w.attributes('aria-hidden')).toBe('true');
      expect(w.attributes('role')).toBe('presentation');
    });
  });
});
