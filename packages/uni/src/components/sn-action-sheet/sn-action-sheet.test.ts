/**
 * sn-action-sheet unit tests — uni-end bottom action panel (wd-action-sheet parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `actions` renders one tappable row each and emits `select` with `{ item, index }`
 *   - disabled rows are inert; `closeOnClickAction` decides whether a tap closes
 *   - `panels` renders a grid and reports `{ item, rowIndex, colIndex }`
 *   - `cancelText` controls the cancel button; `cancel` fires on tap
 *   - `closeOnClickModal` gates the scrim; the popup's animation events forward
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnActionSheet from './sn-action-sheet.vue';
import { clearSnIcons, registerSnIcons } from '../sn-icon/sn-icon-registry';
import { Search } from '../sn-icon/sn-icon-set';

const actions = [
  { name: '分享给朋友', description: '发送到聊天' },
  { name: '保存到相册' },
  { name: '删除', disabled: true },
];

describe('sn-action-sheet', () => {
  it('renders nothing while modelValue is false', () => {
    const wrapper = mount(SnActionSheet, { props: { modelValue: false, actions } });
    expect(wrapper.find('.sn-action-sheet__body').exists()).toBe(false);
  });

  it('renders one row per action and the title', () => {
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, actions, title: '请选择操作' },
    });
    expect(wrapper.findAll('.sn-action-sheet__action')).toHaveLength(3);
    expect(wrapper.find('.sn-action-sheet__title').text()).toBe('请选择操作');
    expect(wrapper.text()).toContain('发送到聊天');
  });

  it('emits select with the item and index, then closes', async () => {
    const wrapper = mount(SnActionSheet, { props: { modelValue: true, actions } });
    await wrapper.findAll('.sn-action-sheet__action')[0]!.trigger('tap');
    expect(wrapper.emitted('select')?.[0]).toEqual([{ item: actions[0], index: 0 }]);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('keeps the sheet open when closeOnClickAction is false', async () => {
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, actions, closeOnClickAction: false },
    });
    await wrapper.findAll('.sn-action-sheet__action')[0]!.trigger('tap');
    expect(wrapper.emitted('select')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('ignores taps on a disabled row', async () => {
    const wrapper = mount(SnActionSheet, { props: { modelValue: true, actions } });
    await wrapper.findAll('.sn-action-sheet__action')[2]!.trigger('tap');
    expect(wrapper.emitted('select')).toBeUndefined();
    expect(wrapper.findAll('.sn-action-sheet__action')[2]!.attributes('aria-disabled')).toBe(
      'true',
    );
  });

  it('renders a flat panel list as a single row', () => {
    const panels = [
      { title: '微信', name: 'wechat' },
      { title: '朋友圈', name: 'moments' },
    ];
    const wrapper = mount(SnActionSheet, { props: { modelValue: true, panels } });
    expect(wrapper.findAll('.sn-action-sheet__panel-row')).toHaveLength(1);
    expect(wrapper.findAll('.sn-action-sheet__panel')).toHaveLength(2);
  });

  it('renders a nested panel list as multiple rows and reports row/col indices', async () => {
    const panels = [[{ title: 'A' }, { title: 'B' }], [{ title: 'C' }]];
    const wrapper = mount(SnActionSheet, { props: { modelValue: true, panels } });
    expect(wrapper.findAll('.sn-action-sheet__panel-row')).toHaveLength(2);
    expect(wrapper.findAll('.sn-action-sheet__panel')).toHaveLength(3);

    await wrapper.findAll('.sn-action-sheet__panel')[2]!.trigger('tap');
    expect(wrapper.emitted('select')?.[0]).toEqual([
      { item: panels[1]![0], rowIndex: 1, colIndex: 0 },
    ]);
  });

  it('hides the cancel button when cancelText is empty and shows it otherwise', async () => {
    const without = mount(SnActionSheet, { props: { modelValue: true, actions } });
    expect(without.find('.sn-action-sheet__cancel').exists()).toBe(false);

    const withCancel = mount(SnActionSheet, {
      props: { modelValue: true, actions, cancelText: '取消' },
    });
    expect(withCancel.find('.sn-action-sheet__cancel').text()).toBe('取消');
    await withCancel.find('.sn-action-sheet__cancel').trigger('tap');
    expect(withCancel.emitted('cancel')).toHaveLength(1);
    expect(withCancel.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('closes on scrim tap only when closeOnClickModal is true', async () => {
    const strict = mount(SnActionSheet, {
      props: { modelValue: true, actions, closeOnClickModal: false },
    });
    await strict.find('.sn-popup__modal').trigger('tap');
    expect(strict.emitted('close')).toBeUndefined();

    const loose = mount(SnActionSheet, { props: { modelValue: true, actions } });
    await loose.find('.sn-popup__modal').trigger('tap');
    expect(loose.emitted('close')).toHaveLength(1);
  });

  it('forwards customClass to the popup root and customStyle to the panel', () => {
    const wrapper = mount(SnActionSheet, {
      props: {
        modelValue: true,
        actions,
        customClass: 'my-sheet',
        customStyle: 'margin: 8px',
      },
    });
    expect(wrapper.classes()).toContain('sn-action-sheet');
    expect(wrapper.classes()).toContain('my-sheet');
    expect(wrapper.find('.sn-popup__panel').attributes('style')).toContain('margin: 8px');
  });

  it('applies customTitleClass to the title node', () => {
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, actions, title: '标题', customTitleClass: 'my-title' },
    });
    expect(wrapper.find('.sn-action-sheet__title').classes()).toContain('my-title');
  });

  it('renders a registry icon for a row when the name resolves', () => {
    const wrapper = mount(SnActionSheet, {
      props: {
        modelValue: true,
        actions: [{ name: '搜索', icon: 'Search' }],
      },
    });
    // Not registered in this test — falls back to no icon node at all.
    expect(wrapper.find('.sn-action-sheet__action-icon').exists()).toBe(false);
  });

  it('renders the registered icon SVG on an action row once the name resolves', () => {
    registerSnIcons({ Search });
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, actions: [{ name: '搜索', icon: 'Search' }] },
    });
    expect(wrapper.find('.sn-action-sheet__action-icon svg').exists()).toBe(true);
    clearSnIcons();
  });

  it('renders the registered icon SVG on a panel cell once the name resolves', () => {
    registerSnIcons({ Search });
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, panels: [{ title: '搜索', icon: 'Search' }] },
    });
    expect(wrapper.find('.sn-action-sheet__panel-icon svg').exists()).toBe(true);
    clearSnIcons();
  });

  it('renders an action icon as an image when the value is an image URL', () => {
    const wrapper = mount(SnActionSheet, {
      props: {
        modelValue: true,
        actions: [{ name: '微信', icon: 'https://example.com/wechat.png' }],
      },
    });
    const icon = wrapper.find('.sn-action-sheet__action-icon');
    expect(icon.exists()).toBe(true);
    expect(icon.attributes('src')).toBe('https://example.com/wechat.png');
  });

  it('renders a panel icon as an image when the value is an image URL', () => {
    const wrapper = mount(SnActionSheet, {
      props: {
        modelValue: true,
        panels: [{ title: '相册', icon: '/static/album.png' }],
      },
    });
    const icon = wrapper.find('.sn-action-sheet__panel-icon');
    expect(icon.exists()).toBe(true);
    expect(icon.attributes('src')).toBe('/static/album.png');
  });

  it('renders default slot content above the list', () => {
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, actions },
      slots: { default: '<text class="slot-body">自定义内容</text>' },
    });
    expect(wrapper.find('.slot-body').exists()).toBe(true);
    // Slot content sits inside the panel, above the action rows.
    const body = wrapper.find('.sn-action-sheet__body');
    expect(body.text()).toContain('自定义内容');
  });

  it('marks enabled rows and the cancel button as buttons for assistive tech', () => {
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, actions, cancelText: '取消' },
    });
    const rows = wrapper.findAll('.sn-action-sheet__action');
    expect(rows[0]!.attributes('role')).toBe('button');
    expect(rows[0]!.attributes('aria-disabled')).toBe('false');
    expect(wrapper.find('.sn-action-sheet__cancel').attributes('role')).toBe('button');
  });

  it('colors a row through its color option', () => {
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, actions: [{ name: '删除', color: 'red' }] },
    });
    expect(wrapper.find('.sn-action-sheet__action').attributes('style') ?? '').toContain(
      'color: red',
    );
  });

  it('reports the flat grid coordinates of a tapped panel cell', async () => {
    const panels = [
      { title: '微信', name: 'wechat' },
      { title: '朋友圈', name: 'moments' },
    ];
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, panels, closeOnClickAction: false },
    });
    await wrapper.findAll('.sn-action-sheet__panel')[1]!.trigger('tap');
    expect(wrapper.emitted('select')?.[0]).toEqual([{ item: panels[1], rowIndex: 0, colIndex: 1 }]);
    // closeOnClickAction: false — the sheet stays open.
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('renders neither list when actions and panels are both empty', () => {
    const wrapper = mount(SnActionSheet, { props: { modelValue: true, cancelText: '取消' } });
    expect(wrapper.find('.sn-action-sheet__actions').exists()).toBe(false);
    expect(wrapper.find('.sn-action-sheet__panels').exists()).toBe(false);
    expect(wrapper.find('.sn-action-sheet__cancel').exists()).toBe(true);
  });

  it('forwards the popup animation legs (enter / leave)', async () => {
    const wrapper = mount(SnActionSheet, {
      // `duration: 0` short-circuits both legs — the sheet only accepts a number.
      props: { modelValue: false, actions, duration: 0 },
    });
    await wrapper.setProps({ modelValue: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('enter')).toHaveLength(1);
    expect(wrapper.emitted('after-enter')).toHaveLength(1);

    await wrapper.setProps({ modelValue: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('leave')).toHaveLength(1);
    expect(wrapper.emitted('after-leave')).toHaveLength(1);
  });

  it('emits click-modal when the scrim is tapped', async () => {
    const wrapper = mount(SnActionSheet, { props: { modelValue: true, actions } });
    await wrapper.find('.sn-popup__modal').trigger('tap');
    expect(wrapper.emitted('click-modal')).toHaveLength(1);
  });

  it('forwards zIndex and duration to the popup layer', () => {
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, actions, zIndex: 77, duration: 150 },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('z-index: 77');
    expect(style).toContain('--sn-popup-duration: 150ms');
  });

  it('pads the bottom safe area by default and drops the padding when opted out', () => {
    const padded = mount(SnActionSheet, { props: { modelValue: true, actions } });
    expect(padded.classes()).toContain('sn-popup--safe-bottom');

    const unpadded = mount(SnActionSheet, {
      props: { modelValue: true, actions, safeAreaInsetBottom: false },
    });
    expect(unpadded.classes()).not.toContain('sn-popup--safe-bottom');
  });

  it('accepts the rootPortal parity prop without breaking the render', () => {
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, actions, rootPortal: true },
    });
    expect(wrapper.find('.sn-action-sheet__body').exists()).toBe(true);
  });

  it('marks panel cells as buttons for assistive tech', () => {
    const panels = [{ title: '微信', name: 'wechat' }];
    const wrapper = mount(SnActionSheet, { props: { modelValue: true, panels } });
    expect(wrapper.find('.sn-action-sheet__panel').attributes('role')).toBe('button');
  });

  it('closes the sheet after a panel cell tap by default', async () => {
    const panels = [{ title: '微信', name: 'wechat' }];
    const wrapper = mount(SnActionSheet, { props: { modelValue: true, panels } });
    await wrapper.find('.sn-action-sheet__panel').trigger('tap');
    expect(wrapper.emitted('select')?.[0]).toEqual([{ item: panels[0], rowIndex: 0, colIndex: 0 }]);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('forwards lazyRender to the popup layer', () => {
    const wrapper = mount(SnActionSheet, {
      props: { modelValue: true, actions, lazyRender: false },
    });
    expect(wrapper.findComponent({ name: 'SnPopup' }).props('lazyRender')).toBe(false);
  });
});
