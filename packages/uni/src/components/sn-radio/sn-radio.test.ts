/**
 * sn-radio / sn-radio-group unit tests — uni-end radio pair (AUI-MP-009).
 *
 * Behaviour only (AGENTS.md §46): group single-value selection,
 * `allowUncheck`, inheritance from the group, and the blocked states.
 * No rpx numbers in assertions — happy-dom discards lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, defineComponent, ref } from 'vue';
import SnRadio from './sn-radio.vue';
import SnRadioGroup from './sn-radio-group.vue';

type RadioValue = string | number | boolean | undefined;

/** Mount a group whose default slot holds the given radios. */
function mountGroup(
  groupProps: Record<string, unknown>,
  children: Array<{ value: string | number | boolean; label: string; disabled?: boolean }>,
) {
  const Host = defineComponent({
    setup() {
      const model = ref<RadioValue>(groupProps.modelValue as RadioValue);
      return () =>
        h(
          SnRadioGroup,
          {
            ...groupProps,
            modelValue: model.value,
            'onUpdate:modelValue': (v: RadioValue) => {
              model.value = v;
            },
          },
          () =>
            children.map((child) =>
              h(SnRadio, { value: child.value, disabled: child.disabled }, () => child.label),
            ),
        );
    },
  });
  return mount(Host);
}

describe('sn-radio-group', () => {
  describe('structure', () => {
    it('renders role="radiogroup"', () => {
      expect(mount(SnRadioGroup).attributes('role')).toBe('radiogroup');
    });

    it('applies the vertical direction by default', () => {
      expect(mount(SnRadioGroup).classes()).toContain('sn-radio-group--vertical');
    });

    it('applies the horizontal direction when set', () => {
      expect(mount(SnRadioGroup, { props: { direction: 'horizontal' } }).classes()).toContain(
        'sn-radio-group--horizontal',
      );
    });

    it('renders the default slot', () => {
      const wrapper = mount(SnRadioGroup, {
        slots: { default: '<view data-testid="child">x</view>' },
      });
      expect(wrapper.find('[data-testid="child"]').exists()).toBe(true);
    });
  });

  describe('selection', () => {
    it('emits update:modelValue and change when a radio is tapped', async () => {
      const wrapper = mountGroup({ modelValue: undefined }, [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ]);
      await wrapper.findAllComponents(SnRadio)[1]!.trigger('tap');
      const group = wrapper.findComponent(SnRadioGroup);
      expect(group.emitted('update:modelValue')?.at(-1)).toEqual(['b']);
      expect(group.emitted('change')?.at(-1)).toEqual(['b']);
    });

    it('marks the selected radio checked and the others not', () => {
      const wrapper = mountGroup({ modelValue: 'b' }, [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ]);
      const radios = wrapper.findAllComponents(SnRadio);
      expect(radios[0]!.classes()).not.toContain('sn-radio--checked');
      expect(radios[1]!.classes()).toContain('sn-radio--checked');
      expect(radios[1]!.attributes('aria-checked')).toBe('true');
    });

    it('does not re-emit when tapping the already selected radio', async () => {
      const wrapper = mountGroup({ modelValue: 'a' }, [{ value: 'a', label: 'A' }]);
      await wrapper.findComponent(SnRadio).trigger('tap');
      expect(wrapper.findComponent(SnRadioGroup).emitted('update:modelValue')).toBeUndefined();
    });

    it('clears the selection when allowUncheck is on', async () => {
      const wrapper = mountGroup({ modelValue: 'a', allowUncheck: true }, [
        { value: 'a', label: 'A' },
      ]);
      await wrapper.findComponent(SnRadio).trigger('tap');
      expect(wrapper.findComponent(SnRadioGroup).emitted('update:modelValue')?.at(-1)).toEqual([
        undefined,
      ]);
    });

    it('supports numeric values', async () => {
      const wrapper = mountGroup({ modelValue: undefined }, [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two' },
      ]);
      await wrapper.findAllComponents(SnRadio)[1]!.trigger('tap');
      expect(wrapper.findComponent(SnRadioGroup).emitted('update:modelValue')?.at(-1)).toEqual([2]);
    });

    it('exposes select / isChecked for imperative use', () => {
      const wrapper = mount(SnRadioGroup, { props: { modelValue: 'a' } });
      const vm = wrapper.vm as unknown as {
        select: (v: string) => void;
        isChecked: (v: string) => boolean;
      };
      expect(vm.isChecked('a')).toBe(true);
      expect(vm.isChecked('b')).toBe(false);
      vm.select('b');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b']);
    });
  });

  describe('disabled / readonly', () => {
    it('applies the group disabled class', () => {
      expect(mount(SnRadioGroup, { props: { disabled: true } }).classes()).toContain(
        'sn-radio-group--disabled',
      );
    });

    it('blocks every child when the group is disabled', async () => {
      const wrapper = mountGroup({ modelValue: undefined, disabled: true }, [
        { value: 'a', label: 'A' },
      ]);
      const radio = wrapper.findComponent(SnRadio);
      expect(radio.classes()).toContain('sn-radio--disabled');
      await radio.trigger('tap');
      expect(wrapper.findComponent(SnRadioGroup).emitted('update:modelValue')).toBeUndefined();
    });

    it('blocks every child when the group is readonly', async () => {
      const wrapper = mountGroup({ modelValue: undefined, readonly: true }, [
        { value: 'a', label: 'A' },
      ]);
      const radio = wrapper.findComponent(SnRadio);
      expect(radio.classes()).toContain('sn-radio--readonly');
      await radio.trigger('tap');
      expect(wrapper.findComponent(SnRadioGroup).emitted('update:modelValue')).toBeUndefined();
    });

    it('blocks select() while disabled', () => {
      const wrapper = mount(SnRadioGroup, { props: { disabled: true } });
      const vm = wrapper.vm as unknown as { select: (v: string) => void };
      vm.select('a');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('inheritance', () => {
    it('inherits type from the group', () => {
      const wrapper = mountGroup({ modelValue: undefined, type: 'button' }, [
        { value: 'a', label: 'A' },
      ]);
      expect(wrapper.findComponent(SnRadio).classes()).toContain('sn-radio--button');
    });

    it('lets a child override the group type', () => {
      const Host = defineComponent({
        setup() {
          return () =>
            h(SnRadioGroup, { modelValue: undefined, type: 'button' }, () =>
              h(SnRadio, { value: 'a', type: 'square' }, () => 'A'),
            );
        },
      });
      expect(mount(Host).findComponent(SnRadio).classes()).toContain('sn-radio--square');
    });

    it('inherits placement and direction from the group', () => {
      const wrapper = mountGroup(
        { modelValue: undefined, placement: 'right', direction: 'horizontal' },
        [{ value: 'a', label: 'A' }],
      );
      const radio = wrapper.findComponent(SnRadio);
      expect(radio.classes()).toContain('sn-radio--placement-right');
      expect(radio.classes()).toContain('sn-radio--horizontal');
    });

    it('inherits checkedColor / uncheckedColor from the group', () => {
      const wrapper = mountGroup({ modelValue: 'a', checkedColor: 'rgb(9, 9, 9)' }, [
        { value: 'a', label: 'A' },
      ]);
      expect(
        wrapper.findComponent(SnRadio).find('.sn-radio__marker').attributes('style'),
      ).toContain('rgb(9, 9, 9)');
    });
  });

  describe('forwarding', () => {
    it('forwards customClass / customStyle', () => {
      const wrapper = mount(SnRadioGroup, {
        props: { customClass: 'my-group', customStyle: 'gap: 6px;' },
      });
      expect(wrapper.classes()).toContain('my-group');
      expect(wrapper.attributes('style')).toContain('gap: 6px');
    });
  });
});

describe('sn-radio', () => {
  describe('structure', () => {
    it('renders the label slot', () => {
      const wrapper = mount(SnRadio, { slots: { default: 'Option' } });
      expect(wrapper.text()).toContain('Option');
    });

    it('renders role="radio" and aria-checked', () => {
      const wrapper = mount(SnRadio);
      expect(wrapper.attributes('role')).toBe('radio');
      expect(wrapper.attributes('aria-checked')).toBe('false');
    });

    it('defaults to the circle shape and left placement', () => {
      const wrapper = mount(SnRadio);
      expect(wrapper.classes()).toContain('sn-radio--circle');
      expect(wrapper.classes()).toContain('sn-radio--placement-left');
    });

    it('renders every shape preset', () => {
      for (const type of ['circle', 'dot', 'square', 'button'] as const) {
        expect(mount(SnRadio, { props: { type } }).classes()).toContain(`sn-radio--${type}`);
      }
    });

    it('renders the marker on the right when placement="right"', () => {
      expect(mount(SnRadio, { props: { placement: 'right' } }).classes()).toContain(
        'sn-radio--placement-right',
      );
    });

    it('does not render the inner dot while unchecked', () => {
      expect(mount(SnRadio).find('.sn-radio__dot').exists()).toBe(false);
    });

    it('renders the inner dot while checked inside a group', () => {
      const wrapper = mountGroup({ modelValue: 'a' }, [{ value: 'a', label: 'A' }]);
      expect(wrapper.findComponent(SnRadio).find('.sn-radio__dot').exists()).toBe(true);
    });
  });

  describe('blocked states', () => {
    it('applies the disabled class and blocks the tap', async () => {
      const wrapper = mount(SnRadio, { props: { disabled: true } });
      expect(wrapper.classes()).toContain('sn-radio--disabled');
      expect(wrapper.attributes('aria-disabled')).toBe('true');
      expect(wrapper.attributes('tabindex')).toBe('-1');
      await wrapper.trigger('tap');
      expect(wrapper.emitted('change')).toBeUndefined();
    });

    it('applies the readonly class and blocks the tap', async () => {
      const wrapper = mount(SnRadio, { props: { readonly: true } });
      expect(wrapper.classes()).toContain('sn-radio--readonly');
      expect(wrapper.attributes('aria-readonly')).toBe('true');
      await wrapper.trigger('tap');
      expect(wrapper.emitted('change')).toBeUndefined();
    });
  });

  describe('events + forwarding', () => {
    it('emits change with its own value inside a group', async () => {
      const wrapper = mountGroup({ modelValue: undefined }, [{ value: 'x', label: 'X' }]);
      await wrapper.findComponent(SnRadio).trigger('tap');
      expect(wrapper.findComponent(SnRadio).emitted('change')?.at(-1)).toEqual(['x']);
    });

    it('renders no inline marker style when no color override is given', () => {
      const wrapper = mountGroup({ modelValue: 'a' }, [{ value: 'a', label: 'A' }]);
      expect(
        wrapper.findComponent(SnRadio).find('.sn-radio__marker').attributes('style'),
      ).toBeUndefined();
    });

    it('applies checkedColor inline when a child passes its own color', () => {
      const Host = defineComponent({
        setup() {
          return () =>
            h(SnRadioGroup, { modelValue: 'a' }, () =>
              h(SnRadio, { value: 'a', checkedColor: 'rgb(7, 7, 7)' }, () => 'A'),
            );
        },
      });
      expect(
        mount(Host).findComponent(SnRadio).find('.sn-radio__marker').attributes('style'),
      ).toContain('rgb(7, 7, 7)');
    });

    it('forwards customLabelClass / customClass / customStyle', () => {
      const wrapper = mount(SnRadio, {
        props: {
          customLabelClass: 'my-label',
          customClass: 'my-radio',
          customStyle: 'margin: 4px;',
        },
        slots: { default: 'Label' },
      });
      expect(wrapper.find('.sn-radio__label').classes()).toContain('my-label');
      expect(wrapper.classes()).toContain('my-radio');
      expect(wrapper.attributes('style')).toContain('margin: 4px');
    });
  });

  /* ── Extended coverage: standalone tap, inheritance edges, a11y details ── */

  it('still emits change when tapped outside any group', async () => {
    const wrapper = mount(SnRadio, { props: { value: 'solo' }, slots: { default: 'Solo' } });
    await wrapper.trigger('tap');
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['solo']);
    expect(wrapper.attributes('aria-checked')).toBe('false');
  });

  it('marks the wrapper data component and shape', () => {
    const wrapper = mount(SnRadio, { props: { type: 'dot' } });
    expect(wrapper.attributes('data-snui-component')).toBe('radio');
    expect(wrapper.attributes('data-type')).toBe('dot');
  });

  it('keeps the radio in the tab order while interactive', () => {
    expect(mount(SnRadio).attributes('tabindex')).toBe('0');
  });

  it('renders the check glyph inside the button-shape dot while checked', () => {
    const wrapper = mountGroup({ modelValue: 'a', type: 'button' }, [{ value: 'a', label: 'A' }]);
    const radio = wrapper.findComponent(SnRadio);
    expect(radio.find('.sn-radio__dot .sn-icon').exists()).toBe(true);
  });

  it('applies the group uncheckedColor to an unselected child marker', () => {
    const wrapper = mountGroup(
      { modelValue: 'b', uncheckedColor: 'rgb(5, 6, 7)' },
      [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ],
    );
    expect(
      wrapper.findAllComponents(SnRadio)[0]!.find('.sn-radio__marker').attributes('style'),
    ).toContain('border-color: rgb(5, 6, 7)');
  });

  it('lets a child stay disabled while the group is enabled', () => {
    const wrapper = mountGroup({ modelValue: undefined }, [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B' },
    ]);
    const radios = wrapper.findAllComponents(SnRadio);
    expect(radios[0]!.classes()).toContain('sn-radio--disabled');
    expect(radios[1]!.classes()).not.toContain('sn-radio--disabled');
    expect(radios[0]!.attributes('tabindex')).toBe('-1');
    expect(radios[1]!.attributes('tabindex')).toBe('0');
  });

  it('matches boolean values strictly', async () => {
    const wrapper = mountGroup({ modelValue: undefined }, [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ]);
    await wrapper.findAllComponents(SnRadio)[0]!.trigger('tap');
    const group = wrapper.findComponent(SnRadioGroup);
    expect(group.emitted('update:modelValue')?.at(-1)).toEqual([true]);
    const radios = wrapper.findAllComponents(SnRadio);
    expect(radios[0]!.attributes('aria-checked')).toBe('true');
    expect(radios[1]!.attributes('aria-checked')).toBe('false');
  });

  it('emits change alongside update:modelValue from imperative select', () => {
    const wrapper = mount(SnRadioGroup, { props: { modelValue: 'a' } });
    const vm = wrapper.vm as unknown as { select: (v: string) => void };
    vm.select('b');
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['b']);
  });

  it('blocks imperative select while readonly', () => {
    const wrapper = mount(SnRadioGroup, { props: { readonly: true } });
    const vm = wrapper.vm as unknown as { select: (v: string) => void };
    vm.select('a');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('re-selects after an allowUncheck clear', async () => {
    const model = ref<RadioValue>('a');
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnRadioGroup,
            {
              modelValue: model.value,
              allowUncheck: true,
              'onUpdate:modelValue': (v: RadioValue) => {
                model.value = v;
              },
            },
            () => [h(SnRadio, { value: 'a' }, () => 'A')],
          );
      },
    });
    const wrapper = mount(Host);
    const radio = wrapper.findComponent(SnRadio);
    await radio.trigger('tap');
    expect(model.value).toBeUndefined();
    await radio.trigger('tap');
    expect(model.value).toBe('a');
  });
});
