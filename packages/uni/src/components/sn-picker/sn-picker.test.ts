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
});
