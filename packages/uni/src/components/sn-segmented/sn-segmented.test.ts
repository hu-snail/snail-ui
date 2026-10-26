/**
 * sn-segmented unit tests — uni-end segmented control.
 *
 * Behaviour only (AGENTS.md §46): the mixed-shape option normalisation, the
 * v-model contract, the per-option and container-level disabled guards, the
 * two themes and the slider geometry. No rpx numbers in assertions — happy-dom
 * discards lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import SnSegmented from './sn-segmented.vue';

const OPTIONS = ['Day', 'Week', 'Month'];

describe('sn-segmented', () => {
  describe('options', () => {
    it('renders one item per option', () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS } });
      expect(wrapper.findAll('.sn-segmented__item')).toHaveLength(3);
    });

    it('renders string options as labels', () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS } });
      expect(wrapper.findAll('.sn-segmented__label')[0]!.text()).toBe('Day');
    });

    it('accepts object options with a custom label', () => {
      const wrapper = mount(SnSegmented, {
        props: {
          options: [
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
          ],
        },
      });
      expect(wrapper.findAll('.sn-segmented__label')[1]!.text()).toBe('Two');
    });

    it('falls back to String(value) when an object option has no label', () => {
      const wrapper = mount(SnSegmented, { props: { options: [{ value: 42 }] } });
      expect(wrapper.find('.sn-segmented__label').text()).toBe('42');
    });

    it('accepts numeric options', () => {
      const wrapper = mount(SnSegmented, { props: { options: [1, 2, 3] } });
      expect(wrapper.findAll('.sn-segmented__label')).toHaveLength(3);
    });

    it('exposes the option through the label slot', () => {
      const wrapper = mount(SnSegmented, {
        props: { options: [{ value: 'a', label: 'A' }] },
        slots: {
          label: `<template #label="{ option }"><text class="custom-label">{{ option.value }}</text></template>`,
        },
      });
      expect(wrapper.find('.custom-label').text()).toBe('a');
    });
  });

  describe('selection', () => {
    it('marks the option matching modelValue as active', () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, modelValue: 'Week' } });
      const items = wrapper.findAll('.sn-segmented__item');
      expect(items[0]!.classes()).not.toContain('sn-segmented__item--active');
      expect(items[1]!.classes()).toContain('sn-segmented__item--active');
    });

    it('emits update:modelValue with the option value on tap', async () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, modelValue: 'Day' } });
      await wrapper.findAll('.sn-segmented__item')[2]!.trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Month']);
    });

    it('emits change with the normalised option on tap', async () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, modelValue: 'Day' } });
      await wrapper.findAll('.sn-segmented__item')[1]!.trigger('tap');
      expect(wrapper.emitted('change')?.at(-1)).toEqual([{ value: 'Week', label: 'Week' }]);
    });

    it('emits click even when the tapped option is already active', async () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, modelValue: 'Day' } });
      await wrapper.findAll('.sn-segmented__item')[0]!.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
      expect(wrapper.emitted('change')).toBeUndefined();
    });

    it('works uncontrolled', async () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS } });
      await wrapper.findAll('.sn-segmented__item')[1]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-segmented__item')[1]!.classes()).toContain(
        'sn-segmented__item--active',
      );
    });

    it('follows a later modelValue change (controlled)', async () => {
      const value = ref('Day');
      const wrapper = mount(SnSegmented, {
        props: { options: OPTIONS, modelValue: value.value },
      });
      value.value = 'Month';
      await wrapper.setProps({ modelValue: 'Month' });
      expect(wrapper.findAll('.sn-segmented__item')[2]!.classes()).toContain(
        'sn-segmented__item--active',
      );
    });
  });

  describe('disabled', () => {
    it('blocks every option while the control is disabled', async () => {
      const wrapper = mount(SnSegmented, {
        props: { options: OPTIONS, disabled: true, modelValue: 'Day' },
      });
      await wrapper.findAll('.sn-segmented__item')[1]!.trigger('tap');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      expect(wrapper.emitted('click')).toBeUndefined();
    });

    it('blocks a single disabled option', async () => {
      const wrapper = mount(SnSegmented, {
        props: {
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B', disabled: true },
          ],
          modelValue: 'a',
        },
      });
      await wrapper.findAll('.sn-segmented__item')[1]!.trigger('tap');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('marks disabled options with aria-disabled', () => {
      const wrapper = mount(SnSegmented, {
        props: { options: [{ value: 'a', label: 'A', disabled: true }] },
      });
      expect(wrapper.find('.sn-segmented__item').attributes('aria-disabled')).toBe('true');
    });

    it('adds the disabled class on the root', () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, disabled: true } });
      expect(wrapper.classes()).toContain('sn-segmented--disabled');
    });
  });

  describe('theme / layout', () => {
    it('defaults to the card theme', () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS } });
      expect(wrapper.classes()).toContain('sn-segmented--card');
      expect(wrapper.find('.sn-segmented__slider').exists()).toBe(true);
    });

    it('drops the slider in the outline theme', () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, theme: 'outline' } });
      expect(wrapper.classes()).toContain('sn-segmented--outline');
      expect(wrapper.find('.sn-segmented__slider').exists()).toBe(false);
    });

    it('offsets the slider by the active index', () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, modelValue: 'Week' } });
      expect(wrapper.find('.sn-segmented__slider').attributes('style')).toContain(
        'translateX(calc(1 * 100%))',
      );
    });

    it('omits the slider style when nothing is selected', () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS } });
      expect(wrapper.find('.sn-segmented__slider').attributes('style')).toBeUndefined();
    });

    it('forwards customClass and customStyle', () => {
      const wrapper = mount(SnSegmented, {
        props: { options: OPTIONS, customClass: 'my-seg', customStyle: 'margin: 4px;' },
      });
      expect(wrapper.classes()).toContain('my-seg');
      expect(wrapper.attributes('style')).toContain('margin: 4px');
    });
  });

  describe('accessibility', () => {
    it('exposes role="group" on the root', () => {
      expect(mount(SnSegmented, { props: { options: OPTIONS } }).attributes('role')).toBe('group');
    });

    it('reflects selection through aria-pressed', () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, modelValue: 'Week' } });
      const items = wrapper.findAll('.sn-segmented__item');
      expect(items[0]!.attributes('aria-pressed')).toBe('false');
      expect(items[1]!.attributes('aria-pressed')).toBe('true');
    });
  });

  describe('vibrateShort', () => {
    it('does not throw when the host has no vibrateShort', async () => {
      const wrapper = mount(SnSegmented, {
        props: { options: OPTIONS, vibrateShort: true, modelValue: 'Day' },
      });
      await wrapper.findAll('.sn-segmented__item')[1]!.trigger('tap');
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    });

    it('calls the host vibrateShort when present', async () => {
      const calls: unknown[] = [];
      (globalThis as { uni?: unknown }).uni = {
        vibrateShort: (opts: unknown) => calls.push(opts),
      };
      const wrapper = mount(SnSegmented, {
        props: { options: OPTIONS, vibrateShort: true, modelValue: 'Day' },
      });
      await wrapper.findAll('.sn-segmented__item')[1]!.trigger('tap');
      expect(calls).toHaveLength(1);
      delete (globalThis as { uni?: unknown }).uni;
    });

    it('survives a host whose vibrateShort throws', async () => {
      (globalThis as { uni?: unknown }).uni = {
        vibrateShort: () => {
          throw new Error('unsupported');
        },
      };
      const wrapper = mount(SnSegmented, {
        props: { options: OPTIONS, vibrateShort: true, modelValue: 'Day' },
      });
      await wrapper.findAll('.sn-segmented__item')[1]!.trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Week']);
      delete (globalThis as { uni?: unknown }).uni;
    });
  });

  describe('wot-ui value alias', () => {
    it('emits update:value alongside update:modelValue', async () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, modelValue: 'Day' } });
      await wrapper.findAll('.sn-segmented__item')[2]!.trigger('tap');
      expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['Month']);
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Month']);
    });

    it('prefers the value alias over modelValue when both are given', () => {
      const wrapper = mount(SnSegmented, {
        props: { options: OPTIONS, value: 'Month', modelValue: 'Day' },
      });
      expect(wrapper.findAll('.sn-segmented__item')[2]!.classes()).toContain(
        'sn-segmented__item--active',
      );
    });

    it('switching writes both spellings with the same payload', async () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, value: 'Day' } });
      await wrapper.findAll('.sn-segmented__item')[1]!.trigger('tap');
      expect(wrapper.emitted('update:value')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:value')?.[0]).toEqual(wrapper.emitted('update:modelValue')?.[0]);
    });
  });

  describe('option payload', () => {
    it('hands the payload back through the change event', async () => {
      const wrapper = mount(SnSegmented, {
        props: {
          options: [
            { value: 'a', label: 'A', payload: { id: 7 } },
            { value: 'b', label: 'B' },
          ],
          modelValue: 'b',
        },
      });
      await wrapper.findAll('.sn-segmented__item')[0]!.trigger('tap');
      const emitted = wrapper.emitted('change')?.at(-1)?.[0] as { payload?: unknown };
      expect(emitted.payload).toEqual({ id: 7 });
    });

    it('exposes the payload through the label slot scope', () => {
      const wrapper = mount(SnSegmented, {
        props: { options: [{ value: 'a', label: 'A', payload: 'extra' }] },
        slots: {
          label: `<template #label="{ option }"><text class="payload-label">{{ option.payload }}</text></template>`,
        },
      });
      expect(wrapper.find('.payload-label').text()).toBe('extra');
    });
  });

  describe('edge cases', () => {
    it('renders nothing without options and does not crash', () => {
      const wrapper = mount(SnSegmented, { props: { options: [] } });
      expect(wrapper.findAll('.sn-segmented__item')).toHaveLength(0);
    });

    it('suppresses click for a single disabled option too', async () => {
      const wrapper = mount(SnSegmented, {
        props: {
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B', disabled: true },
          ],
          modelValue: 'a',
        },
      });
      await wrapper.findAll('.sn-segmented__item')[1]!.trigger('tap');
      expect(wrapper.emitted('click')).toBeUndefined();
      expect(wrapper.emitted('change')).toBeUndefined();
    });

    it('emits the raw number for numeric options', async () => {
      const wrapper = mount(SnSegmented, { props: { options: [10, 20], modelValue: 20 } });
      expect(wrapper.findAll('.sn-segmented__item')[1]!.classes()).toContain(
        'sn-segmented__item--active',
      );
      await wrapper.findAll('.sn-segmented__item')[0]!.trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10]);
    });

    it('keeps both events in order during rapid switching', async () => {
      const wrapper = mount(SnSegmented, { props: { options: OPTIONS, modelValue: 'Day' } });
      const items = wrapper.findAll('.sn-segmented__item');
      await items[1]!.trigger('tap');
      await items[2]!.trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.map((args) => args[0])).toEqual([
        'Week',
        'Month',
      ]);
    });

    it('keeps the slider hidden in the outline theme even with a selection', () => {
      const wrapper = mount(SnSegmented, {
        props: { options: OPTIONS, theme: 'outline', modelValue: 'Week' },
      });
      expect(wrapper.find('.sn-segmented__slider').exists()).toBe(false);
    });
  });
});
