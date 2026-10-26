/**
 * sn-watermark unit tests — uni-end watermark layer (wd-watermark parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `content` / `image` / the default slot each render a tile; no content
 *     means no node at all
 *   - `width` / `height` / `gutter-x` / `gutter-y` set the tile box and margin
 *   - `size` / `color` / `font-style` / `font-weight` / `font-family` land on
 *     the text node
 *   - `rotate` / `z-index` / `opacity` land on the layer and root
 *   - `full-screen` / `staggered` drive the class surface
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnWatermark from './sn-watermark.vue';

describe('sn-watermark', () => {
  it('renders nothing without content, image or slot', () => {
    const wrapper = mount(SnWatermark);
    expect(wrapper.find('.sn-watermark').exists()).toBe(false);
  });

  it('renders repeated text tiles for content', () => {
    const wrapper = mount(SnWatermark, { props: { content: '仅供内部使用' } });
    expect(wrapper.find('.sn-watermark__text').text()).toBe('仅供内部使用');
    expect(wrapper.findAll('.sn-watermark__tile').length).toBeGreaterThan(1);
    expect(wrapper.attributes('aria-hidden')).toBe('true');
  });

  it('renders image tiles when image is set', () => {
    const wrapper = mount(SnWatermark, { props: { image: 'https://x/w.png' } });
    expect(wrapper.find('.sn-watermark__image').exists()).toBe(true);
    expect(wrapper.find('.sn-watermark__text').exists()).toBe(false);
  });

  it('renders the default slot as the tile content', () => {
    const wrapper = mount(SnWatermark, {
      slots: { default: '<text class="custom-tile">LOGO</text>' },
    });
    expect(wrapper.find('.custom-tile').text()).toBe('LOGO');
  });

  it('applies the tile geometry and gutters', () => {
    const wrapper = mount(SnWatermark, {
      props: { content: 'x', width: 120, height: 90, gutterX: 10, gutterY: 20 },
    });
    const style = wrapper.find('.sn-watermark__tile').attributes('style') ?? '';
    expect(style).toContain('width: 120px');
    expect(style).toContain('height: 90px');
    expect(style).toContain('margin-right: 10px');
    expect(style).toContain('margin-bottom: 20px');
  });

  it('applies the text styling', () => {
    const wrapper = mount(SnWatermark, {
      props: {
        content: 'x',
        size: 18,
        color: 'rebeccapurple',
        fontStyle: 'italic',
        fontWeight: 700,
        fontFamily: 'serif',
      },
    });
    const style = wrapper.find('.sn-watermark__text').attributes('style') ?? '';
    expect(style).toContain('font-size: 18px');
    expect(style).toContain('color: rebeccapurple');
    expect(style).toContain('font-style: italic');
    expect(style).toContain('font-weight: 700');
    expect(style).toContain('font-family: serif');
  });

  it('applies the image size', () => {
    const wrapper = mount(SnWatermark, {
      props: { image: 'https://x/w.png', imageWidth: 40, imageHeight: 30 },
    });
    const style = wrapper.find('.sn-watermark__image').attributes('style') ?? '';
    expect(style).toContain('width: 40px');
    expect(style).toContain('height: 30px');
  });

  it('applies rotate, zIndex and opacity', () => {
    const wrapper = mount(SnWatermark, {
      props: { content: 'x', rotate: -45, zIndex: 50, opacity: 0.3 },
    });
    expect(wrapper.attributes('style')).toContain('z-index: 50');
    expect(wrapper.attributes('style')).toContain('opacity: 0.3');
    expect(wrapper.find('.sn-watermark__layer').attributes('style')).toContain(
      'transform: rotate(-45deg)',
    );
  });

  it('leaves opacity unset when not provided', () => {
    const wrapper = mount(SnWatermark, { props: { content: 'x' } });
    expect(wrapper.attributes('style')).not.toContain('opacity');
  });

  it('adds the full-screen class by default and drops it on request', () => {
    const full = mount(SnWatermark, { props: { content: 'x' } });
    expect(full.classes()).toContain('sn-watermark--full-screen');

    const contained = mount(SnWatermark, { props: { content: 'x', fullScreen: false } });
    expect(contained.classes()).not.toContain('sn-watermark--full-screen');
  });

  it('offsets every other row in the staggered layout', () => {
    const grid = mount(SnWatermark, { props: { content: 'x', layout: 'grid' } });
    expect(grid.findAll('.sn-watermark__tile--offset')).toHaveLength(0);

    const staggered = mount(SnWatermark, { props: { content: 'x', layout: 'staggered' } });
    expect(staggered.classes()).toContain('sn-watermark--staggered');
    expect(staggered.findAll('.sn-watermark__tile--offset').length).toBeGreaterThan(0);
  });

  it('produces fewer tiles for a larger tile box', () => {
    const small = mount(SnWatermark, { props: { content: 'x', width: 50, height: 50 } });
    const large = mount(SnWatermark, { props: { content: 'x', width: 400, height: 400 } });
    expect(small.findAll('.sn-watermark__tile').length).toBeGreaterThan(
      large.findAll('.sn-watermark__tile').length,
    );
  });

  it('forwards customClass and customStyle', () => {
    const wrapper = mount(SnWatermark, {
      props: { content: 'x', customClass: 'my-watermark', customStyle: 'margin: 8px' },
    });
    expect(wrapper.classes()).toContain('my-watermark');
    expect(wrapper.attributes('style')).toContain('margin: 8px');
  });
});
