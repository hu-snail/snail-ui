/**
 * sn-skeleton unit tests — uni-end loading placeholder (wd-skeleton parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `loading` swaps the placeholder for the default slot
 *   - each `theme` preset renders its own row / column shape
 *   - `rowCol` overrides the preset; a number expands into that many columns
 *   - column descriptors land as inline width/height and shape classes
 *   - `animation` drives the shimmer class
 *   - `customClass` accepts a string, an array and an object map
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnSkeleton from './sn-skeleton.vue';

describe('sn-skeleton', () => {
  it('renders a single text row for the default theme', () => {
    const wrapper = mount(SnSkeleton);
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.findAll('.sn-skeleton__row')).toHaveLength(1);
    expect(wrapper.findAll('.sn-skeleton__col--text')).toHaveLength(1);
  });

  it('renders the default slot instead of placeholders when loading is false', () => {
    const wrapper = mount(SnSkeleton, {
      props: { loading: false },
      slots: { default: '<text>real content</text>' },
    });
    expect(wrapper.find('.sn-skeleton').exists()).toBe(false);
    expect(wrapper.text()).toContain('real content');
  });

  it('renders the avatar preset as a circle plus a rect', () => {
    const wrapper = mount(SnSkeleton, { props: { theme: 'avatar' } });
    expect(wrapper.findAll('.sn-skeleton__row')).toHaveLength(1);
    expect(wrapper.findAll('.sn-skeleton__col--circle')).toHaveLength(1);
    expect(wrapper.findAll('.sn-skeleton__col--rect')).toHaveLength(1);
  });

  it('renders the paragraph preset as three rows', () => {
    const wrapper = mount(SnSkeleton, { props: { theme: 'paragraph' } });
    expect(wrapper.findAll('.sn-skeleton__row')).toHaveLength(3);
  });

  it('renders the image preset as one full-width block', () => {
    const wrapper = mount(SnSkeleton, { props: { theme: 'image' } });
    expect(wrapper.findAll('.sn-skeleton__col--image')).toHaveLength(1);
  });

  it('expands a numeric rowCol entry into that many columns', () => {
    const wrapper = mount(SnSkeleton, { props: { rowCol: [3] } });
    expect(wrapper.findAll('.sn-skeleton__row')).toHaveLength(1);
    expect(wrapper.findAll('.sn-skeleton__col')).toHaveLength(3);
  });

  it('renders explicit column descriptors with their own shape and size', () => {
    const wrapper = mount(SnSkeleton, {
      // `px` strings, not bare numbers: happy-dom drops CSS lengths it cannot
      // parse, so an `rpx` assertion would silently pass on an empty string.
      props: {
        rowCol: [
          [
            { type: 'circle', size: '64px' },
            { type: 'rect', size: '40%' },
          ],
        ],
      },
    });
    const cols = wrapper.findAll('.sn-skeleton__col');
    expect(cols).toHaveLength(2);
    expect(cols[0]!.classes()).toContain('sn-skeleton__col--circle');
    expect(cols[0]!.attributes('style')).toContain('width: 64px');
    expect(cols[1]!.attributes('style')).toContain('width: 40%');
  });

  it('honours explicit width / height / margin / backgroundColor overrides', () => {
    const wrapper = mount(SnSkeleton, {
      props: {
        rowCol: [
          [
            {
              type: 'rect',
              width: '120px',
              height: '20px',
              margin: '4px',
              backgroundColor: 'rebeccapurple',
            },
          ],
        ],
      },
    });
    const style = wrapper.find('.sn-skeleton__col').attributes('style') ?? '';
    expect(style).toContain('width: 120px');
    expect(style).toContain('height: 20px');
    expect(style).toContain('margin: 4px');
    expect(style).toContain('background-color: rebeccapurple');
  });

  it('adds the gradient shimmer class', () => {
    const wrapper = mount(SnSkeleton, { props: { animation: 'gradient' } });
    expect(wrapper.classes()).toContain('sn-skeleton--gradient');
  });

  it('adds the flashed shimmer class', () => {
    const wrapper = mount(SnSkeleton, { props: { animation: 'flashed' } });
    expect(wrapper.classes()).toContain('sn-skeleton--flashed');
  });

  it('renders no shimmer class by default', () => {
    const wrapper = mount(SnSkeleton);
    expect(wrapper.classes()).not.toContain('sn-skeleton--gradient');
    expect(wrapper.classes()).not.toContain('sn-skeleton--flashed');
  });

  it('accepts customClass as a string, an array and an object map', () => {
    const asString = mount(SnSkeleton, { props: { customClass: 'my-skeleton' } });
    expect(asString.classes()).toContain('my-skeleton');

    const asArray = mount(SnSkeleton, { props: { customClass: ['a-skeleton', 'b-skeleton'] } });
    expect(asArray.classes()).toContain('a-skeleton');
    expect(asArray.classes()).toContain('b-skeleton');

    const asMap = mount(SnSkeleton, {
      props: { customClass: { 'c-skeleton': true, 'd-skeleton': false } },
    });
    expect(asMap.classes()).toContain('c-skeleton');
    expect(asMap.classes()).not.toContain('d-skeleton');
  });

  it('forwards customStyle to the root', () => {
    const wrapper = mount(SnSkeleton, { props: { customStyle: 'margin: 8px' } });
    expect(wrapper.attributes('style')).toContain('margin: 8px');
  });
});
