import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { SnProNoticeItem } from './sn-pro-notice-types';
import SnProNotice from './SnProNotice.vue';

const items: SnProNoticeItem[] = [
  { key: 'n1', label: '构建完成', description: 'admin-basic #128', time: '2 分钟前' },
  { key: 'n2', label: '新成员加入', time: '1 小时前' },
];

const mountNotice = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(SnProNotice, { props: { items, ...props }, slots, attachTo: document.body });

const trigger = (wrapper: ReturnType<typeof mountNotice>) => wrapper.find('.sn-pro-notice__trigger');

describe('SnProNotice · badge', () => {
  it('should hide the badge when there is nothing unread', () => {
    const wrapper = mountNotice();
    expect(wrapper.find('.sn-pro-notice__badge').exists()).toBe(false);
  });

  it('should show the unread count', () => {
    const wrapper = mountNotice({ count: 3 });
    expect(wrapper.find('.sn-pro-notice__badge').text()).toBe('3');
  });

  it('should cap the badge at max with a plus marker', () => {
    expect(mountNotice({ count: 120 }).find('.sn-pro-notice__badge').text()).toBe('99+');
    expect(mountNotice({ count: 12, max: 9 }).find('.sn-pro-notice__badge').text()).toBe('9+');
  });

  it('should hide the badge for a non-positive count', () => {
    expect(mountNotice({ count: -1 }).find('.sn-pro-notice__badge').exists()).toBe(false);
  });
});

describe('SnProNotice · panel', () => {
  it('should start closed and open on click', async () => {
    const wrapper = mountNotice();
    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('.sn-pro-notice__panel').exists()).toBe(false);

    await trigger(wrapper).trigger('click');
    expect(wrapper.find('.sn-pro-notice__panel').exists()).toBe(true);
    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true');
  });

  it('should toggle the panel closed on a second click', async () => {
    const wrapper = mountNotice();
    await trigger(wrapper).trigger('click');
    await trigger(wrapper).trigger('click');
    expect(wrapper.find('.sn-pro-notice__panel').exists()).toBe(false);
  });

  it('should label the trigger and the panel', async () => {
    const wrapper = mountNotice({ label: '通知', panelTitle: '通知中心' });
    expect(trigger(wrapper).attributes('aria-label')).toBe('通知');
    await trigger(wrapper).trigger('click');
    const panel = wrapper.find('.sn-pro-notice__panel');
    expect(panel.attributes('role')).toBe('dialog');
    expect(panel.attributes('aria-label')).toBe('通知中心');
    expect(wrapper.find('.sn-pro-notice__title').text()).toBe('通知中心');
  });

  it('should render one row per item with its description and time', async () => {
    const wrapper = mountNotice();
    await trigger(wrapper).trigger('click');
    expect(wrapper.findAll('.sn-pro-notice__item')).toHaveLength(2);
    expect(wrapper.findAll('.sn-pro-notice__item-label').map((n) => n.text())).toEqual([
      '构建完成',
      '新成员加入',
    ]);
    expect(wrapper.find('.sn-pro-notice__item-desc').text()).toBe('admin-basic #128');
    expect(wrapper.findAll('.sn-pro-notice__item-time').map((n) => n.text())).toEqual([
      '2 分钟前',
      '1 小时前',
    ]);
  });

  it('should show the empty copy when there are no items', async () => {
    const wrapper = mountNotice({ items: [], emptyText: '没有新消息' });
    await trigger(wrapper).trigger('click');
    expect(wrapper.find('.sn-pro-notice__empty').text()).toBe('没有新消息');
    expect(wrapper.find('.sn-pro-notice__read-all').exists()).toBe(false);
  });

  it('should replace the list body via the panel slot', async () => {
    const wrapper = mountNotice({}, { panel: '<div class="custom-panel">custom</div>' });
    await trigger(wrapper).trigger('click');
    expect(wrapper.find('.custom-panel').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-notice__list').exists()).toBe(false);
    // The heading stays host-visible even with a custom body.
    expect(wrapper.find('.sn-pro-notice__title').exists()).toBe(true);
  });
});

describe('SnProNotice · events', () => {
  it('should emit select with the row key and item', async () => {
    const wrapper = mountNotice();
    await trigger(wrapper).trigger('click');
    await wrapper.findAll('.sn-pro-notice__item')[1]!.trigger('click');
    const [key, item] = wrapper.emitted('select')?.[0] ?? [];
    expect(key).toBe('n2');
    expect(item).toMatchObject({ key: 'n2', label: '新成员加入' });
  });

  it('should emit read-all from the panel action', async () => {
    const wrapper = mountNotice();
    await trigger(wrapper).trigger('click');
    await wrapper.find('.sn-pro-notice__read-all').trigger('click');
    expect(wrapper.emitted('read-all')).toHaveLength(1);
  });
});

describe('SnProNotice · dismissal', () => {
  it('should close on Escape', async () => {
    const wrapper = mountNotice();
    await trigger(wrapper).trigger('click');
    await wrapper.find('.sn-pro-notice').trigger('keydown', { key: 'Escape' });
    expect(wrapper.find('.sn-pro-notice__panel').exists()).toBe(false);
  });

  it('should close on a mousedown outside the bell', async () => {
    const wrapper = mountNotice();
    await trigger(wrapper).trigger('click');
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-pro-notice__panel').exists()).toBe(false);
  });

  it('should stay open on a mousedown inside the bell', async () => {
    const wrapper = mountNotice();
    await trigger(wrapper).trigger('click');
    await trigger(wrapper).trigger('mousedown');
    expect(wrapper.find('.sn-pro-notice__panel').exists()).toBe(true);
  });

  it('should drop the outside-click listener when unmounted while open', async () => {
    const wrapper = mountNotice();
    await trigger(wrapper).trigger('click');
    wrapper.unmount();
    // Would throw / re-trigger state if the listener outlived the component.
    expect(() => document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))).not.toThrow();
  });
});
