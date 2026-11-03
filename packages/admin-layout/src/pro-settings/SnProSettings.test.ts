import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnProSettings from './SnProSettings.vue';

const colors = [
  { id: 'blue', color: '#1677ff' },
  { id: 'violet', color: '#722ed1' },
];

// SnDrawer teleports to body — render the teleport in place so wrapper.find
// can reach the panel content.
const mountSettings = (props: Record<string, unknown> = {}) =>
  mount(SnProSettings, { props, global: { stubs: { teleport: true } } });

describe('SnProSettings', () => {
  it('should hide the drawer until show is true', () => {
    const hidden = mountSettings();
    // displayDirective defaults to 'if' — the panel is not mounted until shown.
    expect(hidden.find('.sn-pro-settings').exists()).toBe(false);
    const shown = mountSettings({ show: true });
    expect(shown.find('.sn-pro-settings').exists()).toBe(true);
  });

  it('should render four layout cards and emit update:layout on click', async () => {
    const wrapper = mountSettings({ show: true, layout: 'side' });
    const cards = wrapper.findAll('.sn-pro-settings__layout-card');
    expect(cards).toHaveLength(4);
    await cards[2]!.trigger('click');
    expect(wrapper.emitted('update:layout')?.[0]?.[0]).toBe('mix');
  });

  it('should mark the active layout card as checked', () => {
    const wrapper = mountSettings({ show: true, layout: 'dual' });
    const cards = wrapper.findAll('.sn-pro-settings__layout-card');
    expect(cards[3]!.classes()).toContain('sn-pro-settings__layout-card--active');
    expect(cards[3]!.attributes('aria-checked')).toBe('true');
  });

  it('should hide the mode section when mode is unbound and emit update:mode when shown', async () => {
    // Layout is the only always-on section.
    expect(mountSettings({ show: true }).findAll('.sn-pro-settings__section')).toHaveLength(1);
    const wrapper = mountSettings({ show: true, mode: 'light' });
    // The change handler lives on the native input inside each radio label.
    await wrapper.findAll('.sn-radio-button__native')[1]!.setValue(true);
    expect(wrapper.emitted('update:mode')?.[0]?.[0]).toBe('dark');
  });

  it('should render primary swatches and emit update:primaryId on click', async () => {
    const wrapper = mountSettings({ show: true, primaryId: 'blue', primaryColors: colors });
    const swatches = wrapper.findAll('.sn-pro-settings__swatch');
    expect(swatches).toHaveLength(2);
    expect(swatches[0]!.attributes('aria-selected')).toBe('true');
    await swatches[1]!.trigger('click');
    expect(wrapper.emitted('update:primaryId')?.[0]?.[0]).toBe('violet');
  });

  it('should hide the tab-style section when tabType is unbound and emit update:tabType when shown', async () => {
    expect(mountSettings({ show: true }).findAll('.sn-pro-settings__section')).toHaveLength(1);
    const wrapper = mountSettings({ show: true, tabType: 'chrome' });
    await wrapper.findAll('.sn-radio-button__native')[2]!.setValue(true);
    expect(wrapper.emitted('update:tabType')?.[0]?.[0]).toBe('line');
  });

  it('should let labels override the built-in copy', () => {
    const wrapper = mountSettings({ show: true, labels: { title: '偏好设置', layout: '布局风格' } });
    expect(wrapper.find('.sn-drawer-header').text()).toContain('偏好设置');
    expect(wrapper.find('.sn-pro-settings__heading').text()).toBe('布局风格');
  });
});
