/**
 * sn-icon unit tests — uni-end icon component (AUI-MP-002).
 *
 * Tests cover behavior, not implementation detail (AGENTS.md §46):
 *   - renders inline SVG with the provided icon data
 *   - forwards size / color / strokeWidth to the inner svg
 *   - uses the icon's viewBox when provided, falls back to 24x24
 *   - applies the sn-icon CSS class
 *   - exposes IconData type for type-safe icon packs
 *
 * No real SVG-rendering assertions — happy-dom does not paint SVG, and
 * path coordinates are not the user-visible behavior. We assert the
 * attribute contract only.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnIcon, { type IconData } from './sn-icon.vue';

const fakeIcon: IconData = {
  paths: ['M3 12h18', 'M12 3v18'],
};

const customViewBoxIcon: IconData = {
  viewBox: '0 0 16 16',
  paths: ['M2 8h12', 'M8 2v12'],
};

describe('sn-icon', () => {
  it('renders an inline svg', () => {
    const wrapper = mount(SnIcon, { props: { icon: fakeIcon } });
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('uses the default 24x24 viewBox when icon data has none', () => {
    const wrapper = mount(SnIcon, { props: { icon: fakeIcon } });
    expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 24 24');
  });

  it('uses the icon-provided viewBox when present', () => {
    const wrapper = mount(SnIcon, {
      props: { icon: customViewBoxIcon },
    });
    expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 16 16');
  });

  it('forwards color (defaults to currentColor)', () => {
    const wrapper = mount(SnIcon, { props: { icon: fakeIcon } });
    expect(wrapper.find('svg').attributes('stroke')).toBe('currentColor');
  });

  it('forwards an explicit color', () => {
    const wrapper = mount(SnIcon, {
      props: { icon: fakeIcon, color: '#ff0000' },
    });
    expect(wrapper.find('svg').attributes('stroke')).toBe('#ff0000');
  });

  it('forwards strokeWidth (defaults to 2)', () => {
    const wrapper = mount(SnIcon, { props: { icon: fakeIcon } });
    expect(wrapper.find('svg').attributes('stroke-width')).toBe('2');
  });

  it('forwards an explicit strokeWidth', () => {
    const wrapper = mount(SnIcon, {
      props: { icon: fakeIcon, strokeWidth: 1.5 },
    });
    expect(wrapper.find('svg').attributes('stroke-width')).toBe('1.5');
  });

  it('renders one <path> per entry in icon.paths', () => {
    const wrapper = mount(SnIcon, { props: { icon: fakeIcon } });
    expect(wrapper.findAll('path').length).toBe(2);
  });

  it('applies the sn-icon class to the wrapper', () => {
    const wrapper = mount(SnIcon, { props: { icon: fakeIcon } });
    expect(wrapper.classes()).toContain('sn-icon');
  });

  it('sets aria-hidden on the wrapper (decorative by default)', () => {
    const wrapper = mount(SnIcon, { props: { icon: fakeIcon } });
    expect(wrapper.attributes('aria-hidden')).toBe('true');
  });

  it('applies width / height from the size prop (number → px)', () => {
    const wrapper = mount(SnIcon, {
      props: { icon: fakeIcon, size: 32 },
    });
    // size numeric → wrapper inline width + height = '<n>px'
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('width: 32px');
    expect(style).toContain('height: 32px');
  });

  it('accepts size as a CSS length (passed through verbatim)', () => {
    const wrapper = mount(SnIcon, {
      props: { icon: fakeIcon, size: '1.5em' },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('width: 1.5em');
    expect(style).toContain('height: 1.5em');
  });
});

describe('sn-icon iconfont glyph path (wot-ui `name` API)', () => {
  it('renders a glyph element instead of an svg when name is given', () => {
    const wrapper = mount(SnIcon, { props: { name: 'close' } });
    expect(wrapper.find('svg').exists()).toBe(false);
    const glyph = wrapper.find('.sn-icon__glyph');
    expect(glyph.exists()).toBe(true);
    expect(glyph.classes()).toContain('sn-icon-close');
  });

  it('prefers the name glyph over inline svg data when both are given', () => {
    const wrapper = mount(SnIcon, { props: { name: 'close', icon: fakeIcon } });
    expect(wrapper.find('.sn-icon__glyph').exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(false);
  });

  it('builds the glyph class from classPrefix', () => {
    const wrapper = mount(SnIcon, { props: { name: 'close', classPrefix: 'my-font' } });
    expect(wrapper.find('.sn-icon__glyph').classes()).toContain('my-font-close');
  });

  it('adds the bare name as a second class when cssIcon is true', () => {
    const wrapper = mount(SnIcon, { props: { name: 'close', cssIcon: true } });
    const classes = wrapper.find('.sn-icon__glyph').classes();
    expect(classes).toContain('sn-icon-close');
    expect(classes).toContain('close');
  });

  it('renders a string cssIcon verbatim without the prefix', () => {
    const wrapper = mount(SnIcon, { props: { cssIcon: 'my-css-glyph' } });
    const glyph = wrapper.find('.sn-icon__glyph');
    expect(glyph.exists()).toBe(true);
    expect(glyph.classes()).toContain('my-css-glyph');
    expect(glyph.classes()).not.toContain('sn-icon-my-css-glyph');
  });

  it('renders a string cssIcon even when svg icon data is provided', () => {
    const wrapper = mount(SnIcon, { props: { cssIcon: 'my-css-glyph', icon: fakeIcon } });
    expect(wrapper.find('.sn-icon__glyph').exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(false);
  });

  it('renders nothing when cssIcon is true but name is empty (a css icon needs a class name)', () => {
    const wrapper = mount(SnIcon, { props: { cssIcon: true } });
    expect(wrapper.find('.sn-icon__glyph').exists()).toBe(false);
    expect(wrapper.find('svg').exists()).toBe(false);
  });
});

describe('sn-icon root passthrough', () => {
  it('applies customClass to the wrapper', () => {
    const wrapper = mount(SnIcon, { props: { icon: fakeIcon, customClass: 'my-icon' } });
    expect(wrapper.classes()).toContain('my-icon');
  });

  it('applies a string customStyle on the wrapper', () => {
    const wrapper = mount(SnIcon, {
      props: { icon: fakeIcon, customStyle: 'opacity: 0.5' },
    });
    expect(wrapper.attributes('style')).toContain('opacity');
  });

  it('merges a Record customStyle into the wrapper style', () => {
    const wrapper = mount(SnIcon, {
      props: { icon: fakeIcon, customStyle: { opacity: '0.5' } },
    });
    expect(wrapper.attributes('style')).toContain('opacity');
  });

  it('sets the explicit color on the wrapper style so css inheritance reaches the glyph path', () => {
    const wrapper = mount(SnIcon, { props: { name: 'close', color: '#ff0000' } });
    expect(wrapper.attributes('style')).toContain('color: #ff0000');
  });

  it('omits the wrapper color for the currentColor default', () => {
    const wrapper = mount(SnIcon, { props: { icon: fakeIcon } });
    expect(wrapper.attributes('style')).not.toContain('color');
  });

  it('keeps forwarding strokeWidth when strokeWidthAbsolute is set (characterization: the flag does not change the svg attribute on the H5 renderer)', () => {
    const wrapper = mount(SnIcon, {
      props: { icon: fakeIcon, strokeWidth: 2, strokeWidthAbsolute: true },
    });
    expect(wrapper.find('svg').attributes('stroke-width')).toBe('2');
    expect(wrapper.find('svg').exists()).toBe(true);
  });
});
