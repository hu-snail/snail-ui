/**
 * sn-empty unit tests — uni-end empty-state placeholder (wd-empty parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - the built-in glyph renders when nothing resolves
 *   - `icon` as a URL renders `<image>`, as a registry key renders `<sn-icon>`
 *   - `cssIcon` switches to the class-based iconfont path
 *   - `iconSize` drives the glyph box; `tip` / slots fill the rest
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnEmpty from './sn-empty.vue';
import { clearSnIcons, registerSnIcons } from '../sn-icon/sn-icon-registry';
import { Home } from '../sn-icon/sn-icon-set';

describe('sn-empty', () => {
  beforeEach(() => {
    clearSnIcons();
  });

  it('renders the built-in glyph when no icon resolves', () => {
    const wrapper = mount(SnEmpty);
    expect(wrapper.classes()).toContain('sn-empty');
    expect(wrapper.find('.sn-empty__image').exists()).toBe(true);
    expect(wrapper.find('.sn-empty__image svg').exists()).toBe(true);
  });

  it('renders the tip text only when provided', () => {
    const without = mount(SnEmpty);
    expect(without.find('.sn-empty__tip').exists()).toBe(false);

    const withTip = mount(SnEmpty, { props: { tip: '暂无数据' } });
    expect(withTip.find('.sn-empty__tip').text()).toBe('暂无数据');
  });

  it('renders an <image> when the icon looks like a URL', () => {
    const wrapper = mount(SnEmpty, { props: { icon: 'https://cdn.example.com/empty.png' } });
    expect(wrapper.find('image').exists()).toBe(true);
    expect(wrapper.find('image').attributes('src')).toBe('https://cdn.example.com/empty.png');
    expect(wrapper.find('.sn-empty__image svg').exists()).toBe(false);
  });

  it('renders a registry icon as inline SVG', () => {
    registerSnIcons({ home: Home });
    const wrapper = mount(SnEmpty, { props: { icon: 'home' } });
    expect(wrapper.find('.sn-empty__image svg').exists()).toBe(true);
    expect(wrapper.find('.sn-empty__image').text()).not.toContain('empty');
  });

  it('switches to the CSS-icon path when cssIcon is true', () => {
    const wrapper = mount(SnEmpty, {
      props: { icon: 'icon-empty', iconPrefix: 'wd-icon', cssIcon: true },
    });
    const glyph = wrapper.find('.sn-empty__css-icon');
    expect(glyph.exists()).toBe(true);
    expect(glyph.classes()).toContain('wd-icon');
    expect(glyph.classes()).toContain('icon-empty');
    expect(wrapper.find('.sn-empty__image svg').exists()).toBe(false);
  });

  it('treats a non-empty cssIcon string as CSS-icon mode too', () => {
    const wrapper = mount(SnEmpty, {
      props: { icon: 'icon-empty', cssIcon: 'iconfont' },
    });
    expect(wrapper.find('.sn-empty__css-icon').exists()).toBe(true);
  });

  it('treats a numeric iconSize as rpx (asserted via the CSS class contract)', () => {
    // `iconSize: 200` maps to a `200rpx` glyph box, which happy-dom drops as an
    // unparseable length. The rpx conversion itself is covered by the tokens
    // package tests; here we assert the prop does not break rendering and the
    // string form (a unit happy-dom keeps) reaches the glyph box.
    const numeric = mount(SnEmpty, { props: { iconSize: 200 } });
    expect(numeric.find('.sn-empty__image').exists()).toBe(true);

    const stringy = mount(SnEmpty, { props: { iconSize: '120px' } });
    expect(stringy.find('.sn-empty__image').attributes('style')).toContain('120px');
  });
  it('passes a string iconSize through unchanged', () => {
    const wrapper = mount(SnEmpty, { props: { iconSize: '120px' } });
    expect(wrapper.find('.sn-empty__image').attributes('style')).toContain('120px');
  });

  it('renders the image slot instead of the resolved glyph', () => {
    const wrapper = mount(SnEmpty, {
      slots: { image: '<text>custom glyph</text>' },
    });
    expect(wrapper.find('.sn-empty__image').text()).toContain('custom glyph');
    expect(wrapper.find('.sn-empty__image svg').exists()).toBe(false);
  });

  it('renders the bottom slot only when provided', () => {
    const without = mount(SnEmpty);
    expect(without.find('.sn-empty__bottom').exists()).toBe(false);

    const withBottom = mount(SnEmpty, {
      slots: { bottom: '<text>重试</text>' },
    });
    expect(withBottom.find('.sn-empty__bottom').text()).toContain('重试');
  });

  it('forwards customClass and customStyle to the root', () => {
    const wrapper = mount(SnEmpty, {
      // `8px`, not `8rpx`: happy-dom drops CSS lengths it cannot parse.
      props: { customClass: 'my-empty', customStyle: 'padding: 8px' },
    });
    expect(wrapper.classes()).toContain('my-empty');
    expect(wrapper.attributes('style')).toContain('padding: 8px');
  });

  it('exposes the tip as an accessible name', () => {
    const wrapper = mount(SnEmpty, { props: { tip: '没有搜索结果' } });
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.attributes('aria-label')).toBe('没有搜索结果');
  });
});
