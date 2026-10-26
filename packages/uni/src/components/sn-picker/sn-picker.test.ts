/**
 * sn-picker unit tests — uni-end picker sheet (popup + roller composition).
 *
 * Behaviour only (AGENTS.md §46): draft vs immediate model writes, the
 * confirm / cancel contract, the beforeConfirm veto and the toolbar labels.
 * No rpx numbers in assertions.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnPicker from './sn-picker.vue';

const FRUITS = [['apple', 'banana', 'cherry']];

function mountPicker(props: Record<string, unknown> = {}) {
  return mount(SnPicker, {
    props: { visible: true, modelValue: [], columns: FRUITS, ...props },
  });
}

describe('sn-picker', () => {
  describe('structure', () => {
    it('renders the toolbar actions and the title', () => {
      const w = mountPicker({ title: 'Pick one' });
      expect(w.find('.sn-picker__cancel').text()).toBe('取消');
      expect(w.find('.sn-picker__confirm').text()).toBe('确认');
      expect(w.find('.sn-picker__title').text()).toBe('Pick one');
    });

    it('omits the title row content when no title is given', () => {
      expect(mountPicker().find('.sn-picker__title').exists()).toBe(false);
    });

    it('honours custom button labels', () => {
      const w = mountPicker({ cancelButtonText: 'nope', confirmButtonText: 'yep' });
      expect(w.find('.sn-picker__cancel').text()).toBe('nope');
      expect(w.find('.sn-picker__confirm').text()).toBe('yep');
    });

    it('renders the roller body inside the sheet', () => {
      expect(mountPicker().find('.sn-picker-view').exists()).toBe(true);
    });

    it('stays out of the tree while invisible', () => {
      const w = mountPicker({ visible: false });
      expect(w.find('.sn-picker').exists()).toBe(false);
    });
  });

  describe('confirm', () => {
    it('writes v-model on confirm (deferred mode)', async () => {
      const w = mountPicker({ modelValue: ['apple'] });
      await w.findAll('.sn-picker-view__item')[2]?.trigger('tap');
      // Rolling the wheel alone must not write the model.
      expect(w.emitted('update:modelValue')).toBeUndefined();
      await w.find('.sn-picker__confirm').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([['cherry']]);
    });

    it('emits confirm with the value and the selected items', async () => {
      const w = mountPicker({ modelValue: ['apple'] });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      await w.find('.sn-picker__confirm').trigger('tap');
      const payload = w.emitted('confirm')?.[0]?.[0] as { value: unknown[] };
      expect(payload.value).toEqual(['banana']);
    });

    it('closes the sheet after confirm', async () => {
      const w = mountPicker();
      await w.find('.sn-picker__confirm').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('writes v-model on every roll in immediateChange mode', async () => {
      const w = mountPicker({ modelValue: ['apple'], immediateChange: true });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([['banana']]);
    });

    it('keeps the sheet open when beforeConfirm returns false', async () => {
      const w = mountPicker({ beforeConfirm: () => false });
      await w.find('.sn-picker__confirm').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('confirm')).toBeUndefined();
      expect(w.emitted('update:visible')).toBeUndefined();
    });

    it('keeps the sheet open when the async beforeConfirm resolves false', async () => {
      const w = mountPicker({ beforeConfirm: async () => false });
      await w.find('.sn-picker__confirm').trigger('tap');
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('confirm')).toBeUndefined();
    });

    it('passes the draft value into beforeConfirm', async () => {
      const beforeConfirm = vi.fn(() => true);
      const w = mountPicker({ modelValue: ['apple'], beforeConfirm });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      await w.find('.sn-picker__confirm').trigger('tap');
      await Promise.resolve();
      expect(beforeConfirm).toHaveBeenCalledTimes(1);
      const arg = beforeConfirm.mock.calls[0]?.[0] as { value: unknown[] };
      expect(arg.value).toEqual(['banana']);
    });
  });

  describe('cancel', () => {
    it('emits cancel and closes without writing the model', async () => {
      const w = mountPicker({ modelValue: ['apple'] });
      await w.findAll('.sn-picker-view__item')[2]?.trigger('tap');
      await w.find('.sn-picker__cancel').trigger('tap');
      expect(w.emitted('cancel')).toHaveLength(1);
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('drops the draft on cancel so reopening starts from the model', async () => {
      const w = mountPicker({ modelValue: ['apple'] });
      await w.findAll('.sn-picker-view__item')[2]?.trigger('tap');
      await w.find('.sn-picker__cancel').trigger('tap');
      await w.setProps({ visible: false });
      await w.setProps({ visible: true });
      const active = w.find('.sn-picker-view__item--active');
      expect(active.text()).toBe('apple');
    });
  });

  describe('open', () => {
    it('emits open when visibility flips on', async () => {
      const w = mountPicker({ visible: false });
      await w.setProps({ visible: true });
      expect(w.emitted('open')).toHaveLength(1);
    });
  });

  describe('cascade + key mapping', () => {
    const TREE = [
      {
        value: 'zj',
        label: 'Zhejiang',
        children: [{ value: 'hz', label: 'Hangzhou' }],
      },
    ];

    it('forwards cascade + childrenKey to the roller body', () => {
      const w = mountPicker({ cascade: true, columns: TREE, modelValue: ['zj'] });
      expect(w.findAll('.sn-picker-view__column')).toHaveLength(2);
    });

    it('forwards valueKey / labelKey', () => {
      const w = mountPicker({
        modelValue: [1],
        columns: [[{ id: 1, text: 'One' }]],
        valueKey: 'id',
        labelKey: 'text',
      });
      expect(w.find('.sn-picker-view__item').text()).toBe('One');
    });
  });

  describe('popup wiring', () => {
    it('closes when the mask is tapped and closeOnClickModal is on', async () => {
      const w = mountPicker({ closeOnClickModal: true });
      await w.find('.sn-popup__modal').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('stays open when closeOnClickModal is off', async () => {
      const w = mountPicker({ closeOnClickModal: false });
      await w.find('.sn-popup__modal').trigger('tap');
      expect(w.emitted('update:visible')).toBeUndefined();
    });
  });

  describe('prop forwarding', () => {
    it('merges customClass into the popup sheet class', () => {
      const w = mountPicker({ customClass: 'my-sheet' });
      expect(w.find('.sn-picker-popup.my-sheet').exists()).toBe(true);
    });

    it('forwards customStyle to the popup', () => {
      const w = mountPicker({ customStyle: 'background: red' });
      expect(w.findComponent({ name: 'SnPopup' }).props('customStyle')).toBe('background: red');
    });

    it('forwards customViewClass to the roller body', () => {
      const w = mountPicker({ customViewClass: 'my-roller' });
      expect(w.find('.sn-picker-view.my-roller').exists()).toBe(true);
    });

    it('forwards the roller geometry (itemHeight / visibleItemCount)', () => {
      const w = mountPicker({ itemHeight: 22, visibleItemCount: 5 });
      const view = w.findComponent({ name: 'SnPickerView' });
      expect(view.props('itemHeight')).toBe(22);
      expect(view.props('visibleItemCount')).toBe(5);
    });

    it('forwards zIndex and safeAreaInsetBottom to the popup', () => {
      const w = mountPicker({ zIndex: 99, safeAreaInsetBottom: false });
      const popup = w.findComponent({ name: 'SnPopup' });
      expect(popup.props('zIndex')).toBe(99);
      expect(popup.props('safeAreaInsetBottom')).toBe(false);
    });

    it('accepts root-portal as the documented no-op', () => {
      const w = mountPicker({ rootPortal: true });
      expect(w.find('.sn-picker').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('exposes the toolbar actions as labelled buttons', () => {
      const w = mountPicker({ title: 'Pick' });
      const cancel = w.find('.sn-picker__cancel');
      const confirm = w.find('.sn-picker__confirm');
      expect(cancel.attributes('role')).toBe('button');
      expect(cancel.attributes('aria-label')).toBe('取消');
      expect(confirm.attributes('role')).toBe('button');
      expect(confirm.attributes('aria-label')).toBe('确认');
    });
  });

  describe('draft sync', () => {
    it('follows an external modelValue write while open', async () => {
      const w = mountPicker({ modelValue: ['apple'] });
      await w.setProps({ modelValue: ['cherry'] });
      expect(w.find('.sn-picker-view__item--active').text()).toBe('cherry');
    });

    it('does not emit open on initial mount with visible already true', () => {
      expect(mountPicker().emitted('open')).toBeUndefined();
    });

    it('confirms only the last selection after rapid re-rolling', async () => {
      const w = mountPicker({ modelValue: ['apple'] });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      await w.findAll('.sn-picker-view__item')[2]?.trigger('tap');
      await w.find('.sn-picker__confirm').trigger('tap');
      // Rolling never writes the model, so the single write is the confirm's.
      expect(w.emitted('update:modelValue')).toHaveLength(1);
      expect(w.emitted('update:modelValue')?.[0]).toEqual([['cherry']]);
    });

    it('keeps the draft across an immediateChange external write', async () => {
      // In immediate mode the roller is bound straight to the model, so an
      // external write lands on the wheel with no draft in between.
      const w = mountPicker({ modelValue: ['apple'], immediateChange: true });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      await w.setProps({ modelValue: ['cherry'] });
      expect(w.find('.sn-picker-view__item--active').text()).toBe('cherry');
    });
  });

  describe('confirm payload', () => {
    const OBJECTS = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ];

    it('emits confirm with the exact value and raw selected items', async () => {
      const w = mountPicker({ modelValue: ['b'], columns: [OBJECTS] });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      await w.find('.sn-picker__confirm').trigger('tap');
      expect(w.emitted('confirm')?.[0]).toEqual([
        { value: ['b'], selectedItems: [{ value: 'b', label: 'B' }] },
      ]);
    });

    it('reports the selected items even without a preceding roll', async () => {
      // Regression: the old payload tracked only interaction changes, so
      // confirming straight after open reported selectedItems: [] while
      // value claimed 'b' was selected.
      const w = mountPicker({ modelValue: ['b'], columns: [OBJECTS] });
      await w.find('.sn-picker__confirm').trigger('tap');
      expect(w.emitted('confirm')?.[0]).toEqual([
        { value: ['b'], selectedItems: [{ value: 'b', label: 'B' }] },
      ]);
    });

    it('hands the same selection to beforeConfirm', async () => {
      const beforeConfirm = vi.fn(() => true);
      const w = mountPicker({ modelValue: ['a'], columns: [OBJECTS], beforeConfirm });
      await w.find('.sn-picker__confirm').trigger('tap');
      await Promise.resolve();
      expect(beforeConfirm.mock.calls[0]?.[0]).toEqual({
        value: ['a'],
        selectedItems: [{ value: 'a', label: 'A' }],
      });
    });
  });
});
