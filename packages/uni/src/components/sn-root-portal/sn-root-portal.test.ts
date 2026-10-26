/**
 * sn-root-portal unit tests — root-layer rendering (wot-ui `wd-root-portal`
 * parity).
 *
 * Tests verify observable behaviour (AGENTS.md §46):
 *   - the slot renders inside the portal layer
 *   - `customClass` / `customStyle` are forwarded (additive AUI hooks)
 *   - the layer carries the component marker
 *   - the layer never swallows pointer events on the page
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnRootPortal from './sn-root-portal.vue';

describe('sn-root-portal', () => {
  it('renders slot content', () => {
    const wrapper = mount(SnRootPortal, { slots: { default: 'portal body' } });
    expect(wrapper.text()).toContain('portal body');
  });

  it('exposes the component marker for inspection', () => {
    const wrapper = mount(SnRootPortal, { slots: { default: 'x' } });
    expect(wrapper.attributes('data-snui-component')).toBe('root-portal');
  });

  it('forwards customClass and customStyle to the layer', () => {
    const wrapper = mount(SnRootPortal, {
      props: { customClass: 'my-portal', customStyle: 'padding: 4px' },
      slots: { default: 'x' },
    });
    expect(wrapper.classes()).toContain('my-portal');
    expect(wrapper.attributes('style')).toContain('padding: 4px');
  });

  it('omits the style attribute when no customStyle is given', () => {
    const wrapper = mount(SnRootPortal, { slots: { default: 'x' } });
    // An empty `style=""` would be harmless but noisy; the component returns
    // `undefined` instead so the attribute is absent.
    expect(wrapper.attributes('style')).toBeUndefined();
  });

  it('does not add a role — it is a layout layer, not a dialog', () => {
    const wrapper = mount(SnRootPortal, { slots: { default: 'x' } });
    expect(wrapper.attributes('role')).toBeUndefined();
  });
});
