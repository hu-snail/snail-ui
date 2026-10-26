import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnDivider from './sn-divider.vue';

describe('sn-divider (AUI-MP-005)', () => {
  it('renders an empty horizontal separator by default', () => {
    const w = mount(SnDivider);
    expect(w.classes()).toContain('sn-divider');
    expect(w.classes()).toContain('sn-divider--horizontal');
    expect(w.classes()).toContain('sn-divider--hairline');
    expect(w.classes()).toContain('sn-divider--margin-medium');
    expect(w.attributes('role')).toBe('separator');
    expect(w.attributes('aria-orientation')).toBe('horizontal');
  });

  it('applies vertical direction classes and aria', () => {
    const w = mount(SnDivider, { props: { direction: 'vertical' } });
    expect(w.classes()).toContain('sn-divider--vertical');
    expect(w.attributes('aria-orientation')).toBe('vertical');
  });

  it('removes hairline class when hairline=false', () => {
    const w = mount(SnDivider, { props: { hairline: false } });
    expect(w.classes()).not.toContain('sn-divider--hairline');
  });

  it('adds dashed class and inline border-style when dashed=true', () => {
    const w = mount(SnDivider, { props: { dashed: true } });
    expect(w.classes()).toContain('sn-divider--dashed');
    expect(w.attributes('style')).toContain('dashed');
  });

  it('renders the slot text only for horizontal dividers', () => {
    const w = mount(SnDivider, {
      slots: { default: 'OR' },
    });
    expect(w.classes()).toContain('sn-divider--with-text');
    expect(w.text()).toBe('OR');
  });

  it('omits the slot wrapper for vertical direction', () => {
    const w = mount(SnDivider, {
      props: { direction: 'vertical' },
      slots: { default: 'OR' },
    });
    expect(w.find('.sn-divider__text').exists()).toBe(false);
  });

  /* ── wot-ui `wd-divider` 1:1 parity ──────────────────────────────────── */

  it('renders the vertical variant from the vertical prop', () => {
    const w = mount(SnDivider, { props: { vertical: true }, slots: { default: 'OR' } });
    expect(w.classes()).toContain('sn-divider--vertical');
    expect(w.attributes('aria-orientation')).toBe('vertical');
    expect(w.find('.sn-divider__text').exists()).toBe(false);
  });

  it('applies the content-position class', () => {
    const w = mount(SnDivider, { props: { contentPosition: 'left' }, slots: { default: 'OR' } });
    expect(w.classes()).toContain('sn-divider--content-left');
  });

  it('defaults the content position to center', () => {
    const w = mount(SnDivider, { slots: { default: 'OR' } });
    expect(w.classes()).toContain('sn-divider--content-center');
  });

  it('forwards customClass and a string customStyle', () => {
    const w = mount(SnDivider, {
      props: { customClass: 'my-divider', customStyle: 'opacity: 0.5' },
    });
    expect(w.classes()).toContain('my-divider');
    expect(w.attributes('style')).toContain('opacity');
  });

  it('merges a Record customStyle into the root style', () => {
    const w = mount(SnDivider, { props: { customStyle: { marginTop: '8px' } } });
    expect(w.attributes('style')).toContain('margin-top');
  });

  it('applies the color override as border-color', () => {
    const w = mount(SnDivider, { props: { color: '#ff0000' } });
    expect(w.attributes('style')).toContain('border-color');
    expect(w.attributes('style')).toContain('#ff0000');
  });

  it('omits border-color when no color prop is given', () => {
    const w = mount(SnDivider);
    expect(w.attributes('style')).not.toContain('border-color');
  });

  it('applies the right content-position class', () => {
    const w = mount(SnDivider, { props: { contentPosition: 'right' }, slots: { default: 'OR' } });
    expect(w.classes()).toContain('sn-divider--content-right');
    expect(w.find('.sn-divider__text').exists()).toBe(true);
  });

  it('applies each marginSize variant class', () => {
    expect(mount(SnDivider, { props: { marginSize: 'small' } }).classes()).toContain(
      'sn-divider--margin-small',
    );
    expect(mount(SnDivider, { props: { marginSize: 'large' } }).classes()).toContain(
      'sn-divider--margin-large',
    );
    expect(mount(SnDivider, { props: { marginSize: 'medium' } }).classes()).toContain(
      'sn-divider--margin-medium',
    );
  });

  it('keeps the dashed border declaration on the vertical axis', () => {
    const w = mount(SnDivider, { props: { vertical: true, dashed: true } });
    expect(w.classes()).toContain('sn-divider--dashed');
    expect(w.attributes('style')).toContain('dashed');
  });

  it('renders the vertical variant once when both vertical prop and direction are given', () => {
    const w = mount(SnDivider, { props: { vertical: true, direction: 'vertical' } });
    expect(w.classes().filter((c) => c === 'sn-divider--vertical')).toHaveLength(1);
  });

  it('keeps direction="horizontal" authoritative when vertical prop is false', () => {
    const w = mount(SnDivider, { props: { vertical: false, direction: 'horizontal' } });
    expect(w.classes()).toContain('sn-divider--horizontal');
    expect(w.attributes('aria-orientation')).toBe('horizontal');
  });

  it('drops the dashed style declaration when dashed is false', () => {
    const w = mount(SnDivider);
    expect(w.attributes('style')).not.toContain('dashed');
    expect(w.attributes('style')).toContain('solid');
  });
});
