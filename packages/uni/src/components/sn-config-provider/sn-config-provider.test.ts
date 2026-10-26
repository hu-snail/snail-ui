/**
 * sn-config-provider unit tests — theme / theme-vars / skin containment
 * (AUI-MP-THEME-001, wot-ui `wd-config-provider` parity).
 *
 * Tests verify observable behavior, not internal wiring (AGENTS.md §46):
 *   - `theme="dark"` puts the `.sn-theme-dark` hook on the root
 *   - `themeVars` lands as inline custom properties, in both key dialects
 *   - `customStyle` / `customClass` are forwarded
 *   - `skin` still produces the `.snui-skin-*` class (existing contract)
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnConfigProvider from './sn-config-provider.vue';

describe('sn-config-provider', () => {
  it('defaults to the light theme with no dark hook', () => {
    const wrapper = mount(SnConfigProvider, { slots: { default: 'x' } });
    expect(wrapper.classes()).not.toContain('sn-theme-dark');
    expect(wrapper.attributes('data-snui-theme')).toBe('light');
  });

  it('adds the dark theme hook when theme="dark"', () => {
    const wrapper = mount(SnConfigProvider, {
      props: { theme: 'dark' },
      slots: { default: 'x' },
    });
    expect(wrapper.classes()).toContain('sn-theme-dark');
    expect(wrapper.attributes('data-snui-theme')).toBe('dark');
  });

  it('writes fully-qualified themeVars keys as inline custom properties', () => {
    const wrapper = mount(SnConfigProvider, {
      props: { themeVars: { '--sn-mp-color-action-primary': '#07c160' } },
      slots: { default: 'x' },
    });
    expect(wrapper.attributes('style')).toContain('--sn-mp-color-action-primary: #07c160');
  });

  it('converts wot-style camelCase themeVars keys to --sn-mp-* kebab names', () => {
    const wrapper = mount(SnConfigProvider, {
      props: { themeVars: { buttonPrimaryBgColor: '#07c160' } },
      slots: { default: 'x' },
    });
    expect(wrapper.attributes('style')).toContain('--sn-mp-button-primary-bg-color: #07c160');
  });

  it('forwards customClass and customStyle to the root', () => {
    const wrapper = mount(SnConfigProvider, {
      // `8px`, not `8rpx`: happy-dom validates CSS values and drops lengths it
      // cannot parse, so an rpx assertion would fail on the test environment
      // rather than on the component.
      props: { customClass: 'my-provider', customStyle: 'padding: 8px' },
      slots: { default: 'x' },
    });
    expect(wrapper.classes()).toContain('my-provider');
    expect(wrapper.attributes('style')).toContain('padding: 8px');
  });

  it('keeps the skin class contract (default skin emits nothing)', () => {
    const plain = mount(SnConfigProvider, { props: { skin: 'default' }, slots: { default: 'x' } });
    expect(plain.classes().some((c) => c.startsWith('snui-skin-'))).toBe(false);

    const doodle = mount(SnConfigProvider, { props: { skin: 'doodle' }, slots: { default: 'x' } });
    expect(doodle.classes()).toContain('snui-skin-doodle');
  });

  it('renders slot content', () => {
    const wrapper = mount(SnConfigProvider, { slots: { default: 'inside' } });
    expect(wrapper.text()).toContain('inside');
  });
});
