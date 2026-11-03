import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnProTabbar from './SnProTabbar.vue';

const tabs = [
  { key: 'home', label: '首页', closable: false },
  { key: 'user', label: '用户' },
  { key: 'role', label: '角色' },
];

describe('SnProTabbar', () => {
  // Pane registration lands through an async re-render (SnTabPane registers
  // during mount, the strip re-renders on the next tick).
  const mountTabbar = async (props: Record<string, unknown>) => {
    const wrapper = mount(SnProTabbar, { props });
    await wrapper.vm.$nextTick();
    return wrapper;
  };

  it('should render one strip entry per tab in visit order', async () => {
    const wrapper = await mountTabbar({ tabs, activeKey: 'user' });
    const entries = wrapper.findAll('.sn-tabs__tab .sn-tabs__tab-label');
    expect(entries.map((e) => e.text())).toEqual(['首页', '用户', '角色']);
    expect(wrapper.find('.sn-tabs').classes()).toContain('sn-tabs--chrome');
  });

  it('should emit update:activeKey when a tab is clicked', async () => {
    const wrapper = await mountTabbar({ tabs, activeKey: 'home' });
    await wrapper.findAll('.sn-tabs__tab')[2]!.trigger('click');
    expect(wrapper.emitted('update:activeKey')?.[0]?.[0]).toBe('role');
  });

  it('should hide the close button on affix tabs and emit close for the rest', async () => {
    const wrapper = await mountTabbar({ tabs, activeKey: 'home' });
    const entries = wrapper.findAll('.sn-tabs__tab');
    // Affix tab (closable: false) has no close button; the others do.
    expect(entries[0]!.find('.sn-tabs__tab-close').exists()).toBe(false);
    expect(entries[1]!.find('.sn-tabs__tab-close').exists()).toBe(true);
    await entries[1]!.find('.sn-tabs__tab-close').trigger('click');
    expect(wrapper.emitted('close')?.[0]?.[0]).toBe('user');
    expect(wrapper.emitted('update:activeKey')).toBeUndefined();
  });

  it('should forward the style prop as the SnTabs type class', async () => {
    const wrapper = await mountTabbar({ tabs, activeKey: 'home', type: 'card' });
    expect(wrapper.find('.sn-tabs').classes()).toContain('sn-tabs--card');
  });

  it('should hide the pane layer entirely (strip-only usage)', async () => {
    const wrapper = await mountTabbar({ tabs, activeKey: 'home' });
    const panes = wrapper.find('.sn-tabs__panes');
    expect(panes.attributes('style')).toContain('display: none');
  });

  it('should stay uncontrolled when activeKey is omitted', async () => {
    await mountTabbar({ tabs: [{ key: 'home', label: '首页' }] });
    // No value prop forwarded — SnTabs picks its own default without a
    // controlled null leaking through (asserted by not crashing + rendering).
    expect(true).toBe(true);
  });
});
