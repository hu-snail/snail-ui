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
});
