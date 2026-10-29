/**
 * sn-checkbox / sn-checkbox-group unit tests — uni-end checkbox pair
 * (AUI-MP-008).
 *
 * Behaviour only (AGENTS.md §46): group selection arrays, standalone
 * true/false mapping, inheritance from the group, and the blocked states.
 * No rpx numbers in assertions — happy-dom discards lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, defineComponent, ref, nextTick } from 'vue';
import SnCheckbox from './sn-checkbox.vue';
import SnCheckboxGroup from './sn-checkbox-group.vue';

/** Mount a group whose default slot holds the given checkboxes. */
function mountGroup(
  groupProps: Record<string, unknown>,
  children: Array<{ name: string | number | boolean; label: string; disabled?: boolean }>,
) {
  const Host = defineComponent({
    setup() {
      const model = ref<Array<string | number | boolean>>(
        (groupProps.modelValue as Array<string | number | boolean>) ?? [],
      );
      return () =>
        h(
          SnCheckboxGroup,
          {
            ...groupProps,
            modelValue: model.value,
            'onUpdate:modelValue': (v: Array<string | number | boolean>) => {
              model.value = v;
            },
          },
          () =>
            children.map((child) =>
              h(SnCheckbox, { name: child.name, disabled: child.disabled }, () => child.label),
            ),
        );
    },
  });
  return mount(Host);
}

describe('sn-checkbox', () => {
  describe('standalone mode', () => {
    it('renders the label slot', () => {
      const wrapper = mount(SnCheckbox, { slots: { default: 'Apple' } });
      expect(wrapper.text()).toContain('Apple');
    });

    it('renders unchecked by default', () => {
      const wrapper = mount(SnCheckbox);
      expect(wrapper.classes()).toContain('sn-checkbox');
      expect(wrapper.classes()).not.toContain('sn-checkbox--checked');
      expect(wrapper.attributes('aria-checked')).toBe('false');
    });

    it('is checked when modelValue equals trueValue', () => {
      const wrapper = mount(SnCheckbox, { props: { modelValue: true } });
      expect(wrapper.classes()).toContain('sn-checkbox--checked');
      expect(wrapper.attributes('aria-checked')).toBe('true');
    });

    it('emits update:modelValue with trueValue when tapped unchecked', async () => {
      const wrapper = mount(SnCheckbox, { props: { modelValue: false } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true]);
      expect(wrapper.emitted('change')?.at(-1)).toEqual([true]);
    });

    it('emits update:modelValue with falseValue when tapped checked', async () => {
      const wrapper = mount(SnCheckbox, { props: { modelValue: true } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('honours custom trueValue / falseValue', async () => {
      const wrapper = mount(SnCheckbox, {
        props: { modelValue: 'no', trueValue: 'yes', falseValue: 'no' },
      });
      expect(wrapper.classes()).not.toContain('sn-checkbox--checked');
      await wrapper.trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['yes']);
    });
  });

  describe('disabled / readonly', () => {
    it('does not emit when disabled', async () => {
      const wrapper = mount(SnCheckbox, { props: { disabled: true } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      expect(wrapper.classes()).toContain('sn-checkbox--disabled');
      expect(wrapper.attributes('aria-disabled')).toBe('true');
      expect(wrapper.attributes('tabindex')).toBe('-1');
    });

    it('does not emit when readonly', async () => {
      const wrapper = mount(SnCheckbox, { props: { readonly: true } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      expect(wrapper.classes()).toContain('sn-checkbox--readonly');
      expect(wrapper.attributes('aria-readonly')).toBe('true');
    });
  });

  describe('type / placement / indeterminate', () => {
    it('defaults to the circle shape', () => {
      expect(mount(SnCheckbox).classes()).toContain('sn-checkbox--circle');
    });

    it('renders every shape preset', () => {
      for (const type of ['circle', 'square', 'button', 'dot'] as const) {
        expect(mount(SnCheckbox, { props: { type } }).classes()).toContain(`sn-checkbox--${type}`);
      }
    });

    it('renders the tick on the left by default and on the right when asked', () => {
      expect(mount(SnCheckbox).classes()).toContain('sn-checkbox--placement-left');
      expect(mount(SnCheckbox, { props: { placement: 'right' } }).classes()).toContain(
        'sn-checkbox--placement-right',
      );
    });

    it('sets aria-checked="mixed" and the indeterminate class', () => {
      const wrapper = mount(SnCheckbox, { props: { indeterminate: true } });
      expect(wrapper.attributes('aria-checked')).toBe('mixed');
      expect(wrapper.classes()).toContain('sn-checkbox--indeterminate');
    });

    it('binds the filled-plate modifier on the icon while checked or indeterminate', async () => {
      /* The checked plate (and the doodle-skin override of it) keys off this
       * icon-level class instead of a 3-level `.skin .checked .icon`
       * descendant selector (§116.2 — App cannot express those). */
      const unchecked = mount(SnCheckbox);
      expect(unchecked.find('.sn-checkbox__icon--checked').exists()).toBe(false);

      const checked = mount(SnCheckbox, { props: { modelValue: true } });
      expect(checked.find('.sn-checkbox__icon--checked').exists()).toBe(true);

      const mixed = mount(SnCheckbox, { props: { indeterminate: true } });
      expect(mixed.find('.sn-checkbox__icon--checked').exists()).toBe(true);

      const toggled = mount(SnCheckbox);
      await toggled.setProps({ modelValue: true });
      expect(toggled.find('.sn-checkbox__icon--checked').exists()).toBe(true);
      await toggled.setProps({ modelValue: false });
      expect(toggled.find('.sn-checkbox__icon--checked').exists()).toBe(false);
    });

    it('applies checkedColor inline when checked', () => {
      const wrapper = mount(SnCheckbox, {
        props: { modelValue: true, checkedColor: 'rgb(0, 128, 0)' },
      });
      expect(wrapper.find('.sn-checkbox__icon').attributes('style')).toContain(
        'background-color: rgb(0, 128, 0)',
      );
    });

    it('applies uncheckedColor inline when unchecked', () => {
      const wrapper = mount(SnCheckbox, { props: { uncheckedColor: 'rgb(1, 2, 3)' } });
      expect(wrapper.find('.sn-checkbox__icon').attributes('style')).toContain(
        'border-color: rgb(1, 2, 3)',
      );
    });
  });

  describe('label + slots', () => {
    it('forwards customLabelClass and maxWidth to the label', () => {
      const wrapper = mount(SnCheckbox, {
        props: { customLabelClass: 'my-label', maxWidth: '120px' },
        slots: { default: 'Label' },
      });
      const label = wrapper.find('.sn-checkbox__label');
      expect(label.classes()).toContain('my-label');
      expect(label.attributes('style')).toContain('max-width: 120px');
    });

    it('renders the icon slot with the checked state', () => {
      const wrapper = mount(SnCheckbox, {
        props: { modelValue: true },
        slots: { icon: '<view data-testid="icon-slot">i</view>' },
      });
      expect(wrapper.find('[data-testid="icon-slot"]').exists()).toBe(true);
    });

    it('forwards customClass / customStyle', () => {
      const wrapper = mount(SnCheckbox, {
        props: { customClass: 'my-cb', customStyle: 'margin: 4px;' },
      });
      expect(wrapper.classes()).toContain('my-cb');
      expect(wrapper.attributes('style')).toContain('margin: 4px');
    });
  });

  /* ── Extended coverage: a11y details, rapid toggling, group wiring ── */

  it('stays in the tab order while interactive', () => {
    expect(mount(SnCheckbox).attributes('tabindex')).toBe('0');
  });

  it('marks the wrapper data component and shape', () => {
    const wrapper = mount(SnCheckbox, { props: { type: 'square' } });
    expect(wrapper.attributes('data-snui-component')).toBe('checkbox');
    expect(wrapper.attributes('data-type')).toBe('square');
  });

  it('keeps aria-checked="mixed" when checked and indeterminate', () => {
    const wrapper = mount(SnCheckbox, { props: { modelValue: true, indeterminate: true } });
    expect(wrapper.attributes('aria-checked')).toBe('mixed');
  });

  it('flips the value on every tap under v-model', async () => {
    const Host = defineComponent({
      setup() {
        const model = ref<boolean>(false);
        return () =>
          h(SnCheckbox, {
            modelValue: model.value,
            'onUpdate:modelValue': (v: boolean) => {
              model.value = v;
            },
          });
      },
    });
    const wrapper = mount(Host);
    const box = wrapper.findComponent(SnCheckbox);
    await box.trigger('tap');
    await box.trigger('tap');
    await box.trigger('tap');
    const values = (wrapper.findComponent(SnCheckbox).emitted('update:modelValue') ?? []).map(
      (e) => e[0],
    );
    expect(values).toEqual([true, false, true]);
  });

  it('omits the icon inline style when no color override is set', () => {
    const wrapper = mount(SnCheckbox);
    expect(wrapper.find('.sn-checkbox__icon').attributes('style')).toBeUndefined();
  });
});

describe('sn-checkbox-group (extended)', () => {
  it('emits change with the child name through a real tap', async () => {
    const wrapper = mountGroup({ modelValue: [] }, [{ name: 'a', label: 'A' }]);
    await wrapper.findAllComponents(SnCheckbox)[0]!.trigger('tap');
    const group = wrapper.findComponent(SnCheckboxGroup);
    expect(group.emitted('change')?.at(-1)).toEqual([['a']]);
  });

  it('carries the child name as the child change payload', async () => {
    const wrapper = mountGroup({ modelValue: [] }, [{ name: 'a', label: 'A' }]);
    const child = wrapper.findAllComponents(SnCheckbox)[0]!;
    await child.trigger('tap');
    expect(child.emitted('change')?.at(-1)).toEqual(['a']);
  });

  it('applies the group checkedColor to a selected child icon', () => {
    const wrapper = mountGroup(
      { modelValue: ['a'], checkedColor: 'rgb(10, 20, 30)' },
      [{ name: 'a', label: 'A' }],
    );
    expect(wrapper.findComponent(SnCheckbox).find('.sn-checkbox__icon').attributes('style')).toContain(
      'background-color: rgb(10, 20, 30)',
    );
  });

  it('applies the group uncheckedColor to an unselected child icon', () => {
    const wrapper = mountGroup(
      { modelValue: [], uncheckedColor: 'rgb(3, 4, 5)' },
      [{ name: 'a', label: 'A' }],
    );
    expect(wrapper.findComponent(SnCheckbox).find('.sn-checkbox__icon').attributes('style')).toContain(
      'border-color: rgb(3, 4, 5)',
    );
  });

  it('removes a group-blocked child from the tab order', () => {
    const wrapper = mountGroup({ modelValue: [], disabled: true }, [{ name: 'a', label: 'A' }]);
    expect(wrapper.findComponent(SnCheckbox).attributes('tabindex')).toBe('-1');
  });

  it('blocks selecting beyond max through a real tap', async () => {
    const wrapper = mountGroup({ modelValue: ['a'], max: 1 }, [
      { name: 'a', label: 'A' },
      { name: 'b', label: 'B' },
    ]);
    await wrapper.findAllComponents(SnCheckbox)[1]!.trigger('tap');
    expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')).toBeUndefined();
  });

  it('blocks deselecting below min through a real tap', async () => {
    const wrapper = mountGroup({ modelValue: ['a'], min: 1 }, [{ name: 'a', label: 'A' }]);
    await wrapper.findAllComponents(SnCheckbox)[0]!.trigger('tap');
    expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')).toBeUndefined();
  });

  it('caps toggleAll(true) at max', async () => {
    const wrapper = mountGroup({ modelValue: [], max: 1 }, [
      { name: 'a', label: 'A' },
      { name: 'b', label: 'B' },
    ]);
    const vm = wrapper.findComponent(SnCheckboxGroup).vm as unknown as {
      toggleAll: (checked: boolean, skipDisabled?: boolean) => void;
    };
    vm.toggleAll(true);
    await nextTick();
    expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')?.at(-1)).toEqual([
      ['a'],
    ]);
  });

  it('keeps the min floor when toggleAll(false) would drop below it', async () => {
    const wrapper = mountGroup({ modelValue: ['a', 'b'], min: 1 }, [
      { name: 'a', label: 'A' },
      { name: 'b', label: 'B' },
    ]);
    const vm = wrapper.findComponent(SnCheckboxGroup).vm as unknown as {
      toggleAll: (checked: boolean, skipDisabled?: boolean) => void;
    };
    vm.toggleAll(false);
    await nextTick();
    expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')).toBeUndefined();
  });

  it('is a no-op to toggleAll on a disabled group', async () => {
    const wrapper = mountGroup({ modelValue: [], disabled: true }, [{ name: 'a', label: 'A' }]);
    const vm = wrapper.findComponent(SnCheckboxGroup).vm as unknown as {
      toggleAll: (checked: boolean) => void;
    };
    vm.toggleAll(true);
    await nextTick();
    expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')).toBeUndefined();
  });

  it('drops unmounted children from the toggleAll registry', async () => {
    const names = ref(['a', 'b']);
    const Host = defineComponent({
      setup() {
        return () =>
          h(SnCheckboxGroup, { modelValue: [] }, () =>
            names.value.map((n) => h(SnCheckbox, { name: n }, () => n)),
          );
      },
    });
    const wrapper = mount(Host);
    names.value = ['a'];
    await nextTick();
    const vm = wrapper.findComponent(SnCheckboxGroup).vm as unknown as {
      toggleAll: (checked: boolean) => void;
    };
    vm.toggleAll(true);
    await nextTick();
    expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')?.at(-1)).toEqual([
      ['a'],
    ]);
  });
});

describe('sn-checkbox-group', () => {
  describe('selection', () => {
    it('renders role="group"', () => {
      const wrapper = mount(SnCheckboxGroup);
      expect(wrapper.attributes('role')).toBe('group');
    });

    it('applies the vertical direction by default', () => {
      expect(mount(SnCheckboxGroup).classes()).toContain('sn-checkbox-group--vertical');
    });

    it('applies the horizontal direction when set', () => {
      expect(mount(SnCheckboxGroup, { props: { direction: 'horizontal' } }).classes()).toContain(
        'sn-checkbox-group--horizontal',
      );
    });

    it('emits update:modelValue and change with the next array', async () => {
      const wrapper = mount(SnCheckboxGroup, { props: { modelValue: [] } });
      const vm = wrapper.vm as unknown as {
        toggle: (name: string, checked: boolean) => void;
      };
      vm.toggle('a', true);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a']]);
      expect(wrapper.emitted('change')?.at(-1)).toEqual([['a']]);
    });

    it('toggles a child through a real tap', async () => {
      const wrapper = mountGroup({ modelValue: [] }, [
        { name: 'a', label: 'A' },
        { name: 'b', label: 'B' },
      ]);
      const boxes = wrapper.findAllComponents(SnCheckbox);
      await boxes[1]!.trigger('tap');
      expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')?.at(-1)).toEqual([
        ['b'],
      ]);
    });

    it('reflects the group selection in the children', () => {
      const wrapper = mountGroup({ modelValue: ['b'] }, [
        { name: 'a', label: 'A' },
        { name: 'b', label: 'B' },
      ]);
      const boxes = wrapper.findAllComponents(SnCheckbox);
      expect(boxes[0]!.classes()).not.toContain('sn-checkbox--checked');
      expect(boxes[1]!.classes()).toContain('sn-checkbox--checked');
    });

    it('toggles a selected child back off', async () => {
      const wrapper = mountGroup({ modelValue: ['a', 'b'] }, [
        { name: 'a', label: 'A' },
        { name: 'b', label: 'B' },
      ]);
      await wrapper.findAllComponents(SnCheckbox)[0]!.trigger('tap');
      expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')?.at(-1)).toEqual([
        ['b'],
      ]);
    });
  });

  describe('min / max', () => {
    it('stops selecting beyond max', async () => {
      const wrapper = mount(SnCheckboxGroup, { props: { modelValue: ['a'], max: 1 } });
      const vm = wrapper.vm as unknown as { toggle: (n: string, c: boolean) => void };
      vm.toggle('b', true);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('stops deselecting below min', async () => {
      const wrapper = mount(SnCheckboxGroup, { props: { modelValue: ['a'], min: 1 } });
      const vm = wrapper.vm as unknown as { toggle: (n: string, c: boolean) => void };
      vm.toggle('a', false);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('disabled / readonly', () => {
    it('blocks every child when the group is disabled', async () => {
      const wrapper = mountGroup({ modelValue: [], disabled: true }, [{ name: 'a', label: 'A' }]);
      const box = wrapper.findComponent(SnCheckbox);
      expect(box.classes()).toContain('sn-checkbox--disabled');
      await box.trigger('tap');
      expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')).toBeUndefined();
    });

    it('blocks every child when the group is readonly', async () => {
      const wrapper = mountGroup({ modelValue: [], readonly: true }, [{ name: 'a', label: 'A' }]);
      const box = wrapper.findComponent(SnCheckbox);
      expect(box.classes()).toContain('sn-checkbox--readonly');
      await box.trigger('tap');
      expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')).toBeUndefined();
    });

    it('applies the group disabled class', () => {
      expect(mount(SnCheckboxGroup, { props: { disabled: true } }).classes()).toContain(
        'sn-checkbox-group--disabled',
      );
    });
  });

  describe('inheritance', () => {
    it('inherits type from the group', () => {
      const wrapper = mountGroup({ modelValue: [], type: 'square' }, [{ name: 'a', label: 'A' }]);
      expect(wrapper.findComponent(SnCheckbox).classes()).toContain('sn-checkbox--square');
    });

    it('lets a child override the group type', () => {
      const Host = defineComponent({
        setup() {
          return () =>
            h(SnCheckboxGroup, { modelValue: [], type: 'square' }, () =>
              h(SnCheckbox, { name: 'a', type: 'button' }, () => 'A'),
            );
        },
      });
      expect(mount(Host).findComponent(SnCheckbox).classes()).toContain('sn-checkbox--button');
    });

    it('inherits placement / size / direction from the group', () => {
      const wrapper = mountGroup(
        { modelValue: [], placement: 'right', size: 'large', direction: 'horizontal' },
        [{ name: 'a', label: 'A' }],
      );
      const box = wrapper.findComponent(SnCheckbox);
      expect(box.classes()).toContain('sn-checkbox--placement-right');
      expect(box.classes()).toContain('sn-checkbox--large');
      expect(box.classes()).toContain('sn-checkbox--horizontal');
    });
  });

  describe('toggleAll', () => {
    it('selects every registered child', async () => {
      const wrapper = mountGroup({ modelValue: [] }, [
        { name: 'a', label: 'A' },
        { name: 'b', label: 'B' },
      ]);
      const vm = wrapper.findComponent(SnCheckboxGroup).vm as unknown as {
        toggleAll: (checked: boolean, skipDisabled?: boolean) => void;
      };
      vm.toggleAll(true);
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')?.at(-1)).toEqual([
        ['a', 'b'],
      ]);
    });

    it('deselects every registered child', async () => {
      const wrapper = mountGroup({ modelValue: ['a', 'b'] }, [
        { name: 'a', label: 'A' },
        { name: 'b', label: 'B' },
      ]);
      const vm = wrapper.findComponent(SnCheckboxGroup).vm as unknown as {
        toggleAll: (checked: boolean, skipDisabled?: boolean) => void;
      };
      vm.toggleAll(false);
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')?.at(-1)).toEqual([
        [],
      ]);
    });

    it('skips disabled children when skipDisabled is set', async () => {
      const wrapper = mountGroup({ modelValue: [] }, [
        { name: 'a', label: 'A' },
        { name: 'b', label: 'B', disabled: true },
      ]);
      const vm = wrapper.findComponent(SnCheckboxGroup).vm as unknown as {
        toggleAll: (checked: boolean, skipDisabled?: boolean) => void;
      };
      vm.toggleAll(true, true);
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCheckboxGroup).emitted('update:modelValue')?.at(-1)).toEqual([
        ['a'],
      ]);
    });
  });

  describe('forwarding', () => {
    it('forwards customClass / customStyle', () => {
      const wrapper = mount(SnCheckboxGroup, {
        props: { customClass: 'my-group', customStyle: 'gap: 6px;' },
      });
      expect(wrapper.classes()).toContain('my-group');
      expect(wrapper.attributes('style')).toContain('gap: 6px');
    });

    it('renders the default slot', () => {
      const wrapper = mount(SnCheckboxGroup, {
        slots: { default: '<view data-testid="child">x</view>' },
      });
      expect(wrapper.find('[data-testid="child"]').exists()).toBe(true);
    });
  });
});
