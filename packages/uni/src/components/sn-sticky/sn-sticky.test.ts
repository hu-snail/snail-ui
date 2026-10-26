/**
 * sn-sticky unit tests — uni-end sticky container.
 *
 * Behaviour only (AGENTS.md §46): the offsetTop / z-index insets, the slot
 * content and the customClass / customStyle forwarding. The component is
 * CSS-only (no scroll listener), so there is no event surface to assert — the
 * style contract *is* the behaviour here.
 *
 * No rpx numbers in assertions — happy-dom discards lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnSticky from './sn-sticky.vue';

describe('sn-sticky', () => {
  it('renders the default slot', () => {
    const wrapper = mount(SnSticky, { slots: { default: 'pinned' } });
    expect(wrapper.text()).toBe('pinned');
  });

  it('defaults offsetTop to 0 and z-index to 1', () => {
    const style = mount(SnSticky).attributes('style');
    expect(style).toContain('top: 0px');
    expect(style).toContain('z-index: 1');
  });

  it('maps offsetTop to the top inset', () => {
    const wrapper = mount(SnSticky, { props: { offsetTop: 88 } });
    expect(wrapper.attributes('style')).toContain('top: 88px');
  });

  it('writes a custom z-index', () => {
    const wrapper = mount(SnSticky, { props: { zIndex: 50 } });
    expect(wrapper.attributes('style')).toContain('z-index: 50');
  });

  it('forwards customClass and customStyle', () => {
    const wrapper = mount(SnSticky, {
      props: { customClass: 'my-sticky', customStyle: 'margin: 4px;' },
    });
    expect(wrapper.classes()).toContain('my-sticky');
    expect(wrapper.attributes('style')).toContain('margin: 4px');
  });

  it('renders a single root wrapper', () => {
    const wrapper = mount(SnSticky, { slots: { default: '<view class="inner" />' } });
    expect(wrapper.element.tagName.toLowerCase()).toBe('view');
    expect(wrapper.find('.inner').exists()).toBe(true);
  });

  it('exposes the component marker for inspection tooling', () => {
    const wrapper = mount(SnSticky, { slots: { default: 'x' } });
    expect(wrapper.attributes('data-snui-component')).toBe('sticky');
  });

  it('writes a z-index of 0 explicitly', () => {
    const wrapper = mount(SnSticky, { props: { zIndex: 0 } });
    expect(wrapper.attributes('style')).toContain('z-index: 0');
  });

  it('appends customStyle after the sticky insets so the consumer override wins', () => {
    const wrapper = mount(SnSticky, {
      props: { offsetTop: 12, zIndex: 3, customStyle: 'top: 99px;' },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style.indexOf('top: 12px')).toBeLessThan(style.indexOf('top: 99px'));
    expect(style).toContain('z-index: 3');
  });

  it('keeps the sticky insets when only customClass is provided', () => {
    const wrapper = mount(SnSticky, { props: { customClass: 'only-class' } });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('top: 0px');
    expect(style).toContain('z-index: 1');
  });
});
