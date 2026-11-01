/**
 * sn-plate-input unit tests — uni-end plate field with a popup car keyboard.
 *
 * Behaviour only (AGENTS.md §46): box rendering, the tap-to-toggle contract,
 * the scrim-free keyboard, the v-model flow through sn-keyboard, maxlength
 * capping, the car-language lifecycle and the visibility contract
 * (uncontrolled + controlled). No rpx numbers in assertions.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, ref } from 'vue';
import SnPlateInput from './sn-plate-input.vue';

const keyByText = (w: ReturnType<typeof mount>, text: string) =>
  w.findAll('.sn-keyboard__key').find((key) => key.text() === text);

/**
 * Host wrapper binding v-model like real usage — the keyboard appends to the
 * prop value it sees, so value-driven behaviour (auto-switch, caps) only
 * works when the emitted value flows back in.
 */
function mountPlate(props: Record<string, unknown> = {}, initialModel = '') {
  const model = ref(initialModel);
  const wrapper = mount({
    setup() {
      return () =>
        h(SnPlateInput, {
          modelValue: model.value,
          'onUpdate:modelValue': (v: string) => {
            model.value = v;
          },
          ...props,
        });
    },
  });
  return { wrapper, model };
}

describe('sn-plate-input', () => {
  describe('structure', () => {
    it('renders `maxlength` boxes (7 by default)', () => {
      expect(mount(SnPlateInput).findAll('.sn-plate-input__box')).toHaveLength(7);
      expect(
        mount(SnPlateInput, { props: { maxlength: 8 } }).findAll('.sn-plate-input__box'),
      ).toHaveLength(8);
    });

    it('renders at least one box when maxlength is 0', () => {
      expect(
        mount(SnPlateInput, { props: { maxlength: 0 } }).findAll('.sn-plate-input__box'),
      ).toHaveLength(1);
    });

    it('renders one character per filled box', () => {
      const w = mount(SnPlateInput, { props: { modelValue: '京A1' } });
      const chars = w.findAll('.sn-plate-input__char');
      expect(chars).toHaveLength(3);
      expect(chars[0]?.text()).toBe('京');
      expect(chars[2]?.text()).toBe('1');
    });

    it('clamps the rendered characters to the box count', () => {
      const w = mount(SnPlateInput, { props: { modelValue: '京A12345678', maxlength: 7 } });
      expect(w.findAll('.sn-plate-input__char')).toHaveLength(7);
    });

    it('marks filled boxes', () => {
      const w = mount(SnPlateInput, { props: { modelValue: '京A' } });
      expect(w.findAll('.sn-plate-input__box--filled')).toHaveLength(2);
    });

    it('labels the box group with the fill progress', () => {
      const w = mount(SnPlateInput, { props: { modelValue: '京A1', maxlength: 8 } });
      expect(w.find('.sn-plate-input__boxes').attributes('aria-label')).toBe(
        'plate number, 3 of 8',
      );
    });

    it('marks the wrapper data component', () => {
      expect(mount(SnPlateInput).attributes('data-snui-component')).toBe('plate-input');
    });
  });

  describe('keyboard visibility', () => {
    it('stays closed until the field is tapped', () => {
      expect(mount(SnPlateInput).find('.sn-keyboard').exists()).toBe(false);
    });

    it('opens the car keyboard on tap with the title', async () => {
      const w = mount(SnPlateInput, { props: { title: '车牌号' } });
      await w.find('.sn-plate-input__boxes').trigger('tap');
      expect(w.find('.sn-keyboard').exists()).toBe(true);
      expect(w.find('.sn-keyboard').classes()).toContain('sn-keyboard--car');
      expect(w.find('.sn-keyboard__title').text()).toBe('车牌号');
    });

    it('renders the keyboard without a scrim', async () => {
      const w = mount(SnPlateInput);
      await w.find('.sn-plate-input__boxes').trigger('tap');
      expect(w.find('.sn-keyboard').exists()).toBe(true);
      expect(w.find('.sn-popup__modal').exists()).toBe(false);
    });

    it('marks the open state on the root', async () => {
      const w = mount(SnPlateInput);
      await w.find('.sn-plate-input__boxes').trigger('tap');
      expect(w.classes()).toContain('sn-plate-input--open');
    });

    it('toggles closed on the second field tap (scrim-free collapse)', async () => {
      const w = mount(SnPlateInput);
      await w.find('.sn-plate-input__boxes').trigger('tap');
      expect(w.find('.sn-keyboard').exists()).toBe(true);
      await w.find('.sn-plate-input__boxes').trigger('tap');
      // the popup leave animation unmounts the panel async; the visible
      // contract is observable through the event and the root state class
      expect(w.emitted('update:visible')?.at(-1)).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.classes()).not.toContain('sn-plate-input--open');
    });

    it('emits open then close across a full toggle cycle', async () => {
      const w = mount(SnPlateInput);
      await w.find('.sn-plate-input__boxes').trigger('tap');
      await w.find('.sn-plate-input__boxes').trigger('tap');
      expect(w.emitted('open')).toHaveLength(1);
      expect(w.emitted('close')).toHaveLength(1);
    });

    it('does not toggle when disabled', async () => {
      const w = mount(SnPlateInput, { props: { disabled: true } });
      await w.find('.sn-plate-input__boxes').trigger('tap');
      expect(w.find('.sn-keyboard').exists()).toBe(false);
      expect(w.classes()).toContain('sn-plate-input--disabled');
      expect(w.attributes('aria-disabled')).toBe('true');
    });

    it('closes from the keyboard close button and emits close', async () => {
      const w = mount(SnPlateInput);
      await w.find('.sn-plate-input__boxes').trigger('tap');
      await w.find('.sn-keyboard__close').trigger('tap');
      expect(w.emitted('update:visible')?.at(-1)).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.classes()).not.toContain('sn-plate-input--open');
    });

    it('honours a one-way controlled `visible` (open, tap keeps it open)', async () => {
      const w = mount(SnPlateInput, { props: { visible: true } });
      expect(w.find('.sn-keyboard').exists()).toBe(true);
      // controlled: the bound prop wins, so the tap cannot toggle it closed
      await w.find('.sn-plate-input__boxes').trigger('tap');
      expect(w.find('.sn-keyboard').exists()).toBe(true);
      expect(w.emitted('update:visible')?.at(-1)).toEqual([false]);
    });
  });

  describe('typing via the keyboard', () => {
    it('types a province then letters through the auto-switched layout', async () => {
      const { wrapper, model } = mountPlate();
      await wrapper.find('.sn-plate-input__boxes').trigger('tap');
      await keyByText(wrapper, '京')?.trigger('tap');
      expect(model.value).toBe('京');
      // province picked → the keyboard switched to letters
      await keyByText(wrapper, 'A')?.trigger('tap');
      expect(model.value).toBe('京A');
    });

    it('emits change alongside update:modelValue', async () => {
      const { wrapper } = mountPlate();
      await wrapper.find('.sn-plate-input__boxes').trigger('tap');
      await keyByText(wrapper, '京')?.trigger('tap');
      await keyByText(wrapper, 'A')?.trigger('tap');
      const plate = wrapper.findComponent(SnPlateInput);
      expect(plate.emitted('update:modelValue')?.map((e) => e[0])).toEqual(['京', '京A']);
      expect(plate.emitted('change')?.map((e) => e[0])).toEqual(['京', '京A']);
    });

    it('caps typing at the box count', async () => {
      const { wrapper, model } = mountPlate({ maxlength: 3 });
      await wrapper.find('.sn-plate-input__boxes').trigger('tap');
      await keyByText(wrapper, '京')?.trigger('tap');
      await keyByText(wrapper, 'A')?.trigger('tap');
      await keyByText(wrapper, 'B')?.trigger('tap');
      expect(model.value).toBe('京AB');
      await keyByText(wrapper, 'C')?.trigger('tap');
      expect(model.value).toBe('京AB');
    });

    it('removes the last character with the delete key', async () => {
      const { wrapper, model } = mountPlate({}, '京A');
      await wrapper.find('.sn-plate-input__boxes').trigger('tap');
      await wrapper.find('.sn-keyboard__key--delete').trigger('tap');
      expect(model.value).toBe('京');
    });

    it('starts the next plate back on the province layout after clearing', async () => {
      const { wrapper, model } = mountPlate();
      await wrapper.find('.sn-plate-input__boxes').trigger('tap');
      await keyByText(wrapper, '京')?.trigger('tap');
      // switched to letters: the header toggle now offers 中
      expect(wrapper.find('.sn-keyboard__lang').text()).toBe('中');
      await wrapper.find('.sn-keyboard__key--delete').trigger('tap');
      // value empty → back to provinces: the header toggle offers EN again
      expect(model.value).toBe('');
      expect(wrapper.find('.sn-keyboard__lang').text()).toBe('EN');
      await keyByText(wrapper, '沪')?.trigger('tap');
      expect(model.value).toBe('沪');
    });
  });

  /* Untestable in happy-dom: the real device soft-keyboard interplay (none —
   * the field is keyboard-only), popup leave-transition timing (asserted via
   * events instead) and hover-class press states. */
});
