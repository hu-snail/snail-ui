/**
 * sn-input-number unit tests — uni-end numeric stepper.
 *
 * Behaviour only (AGENTS.md §46): clamping, step snapping, precision,
 * beforeChange veto (sync + async), allowNull, per-button disable flags and
 * the long-press timer teardown. No rpx numbers in assertions.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnInputNumber from './sn-input-number.vue';

function mountNumber(props: Record<string, unknown> = {}) {
  return mount(SnInputNumber, { props: { modelValue: 5, min: 0, max: 10, ...props } });
}

/**
 * Mount with a live v-model: emitted updates flow back into `modelValue`,
 * mirroring how a real parent consumes the component.
 */
function mountVModel(props: Record<string, unknown> = {}) {
  let current: number | string = (props.modelValue as number | string) ?? 0;
  const w = mount(SnInputNumber, {
    props: {
      min: 0,
      max: 10,
      ...props,
      modelValue: current,
      'onUpdate:modelValue': (v: number | string) => {
        current = v;
        w.setProps({ modelValue: v });
      },
    },
  });
  return w;
}

const lastValue = (w: ReturnType<typeof mountNumber>): unknown =>
  w.emitted('update:modelValue')?.at(-1)?.[0];

afterEach(() => {
  vi.useRealTimers();
});

describe('sn-input-number', () => {
  describe('structure', () => {
    it('renders the minus / plus buttons and the field', () => {
      const w = mountNumber();
      expect(w.find('.sn-input-number__minus').exists()).toBe(true);
      expect(w.find('.sn-input-number__plus').exists()).toBe(true);
      expect(w.find('.sn-input-number__field').exists()).toBe(true);
    });

    it('hides the field when withoutInput is set', () => {
      const w = mountNumber({ withoutInput: true });
      expect(w.find('.sn-input-number__field').exists()).toBe(false);
      expect(w.classes()).toContain('sn-input-number--without-input');
    });

    it('applies the theme class', () => {
      expect(mountNumber({ theme: 'outline' }).classes()).toContain('sn-input-number--outline');
      expect(mountNumber({ theme: 'primary' }).classes()).toContain('sn-input-number--primary');
    });

    it('applies the round class', () => {
      expect(mountNumber({ round: true }).classes()).toContain('sn-input-number--round');
    });

    it('shows the model value in the field', () => {
      const field = mountNumber({ modelValue: 7 }).find('.sn-input-number__field');
      expect((field.element as HTMLInputElement).value).toBe('7');
    });

    it('renders the placeholder', () => {
      const field = mountNumber({ modelValue: '', allowNull: true, placeholder: 'qty' }).find(
        '.sn-input-number__field',
      );
      expect(field.attributes('placeholder')).toBe('qty');
    });
  });

  describe('stepping', () => {
    it('emits update:modelValue + change on plus', async () => {
      const w = mountNumber({ modelValue: 5 });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      expect(lastValue(w)).toBe(6);
      expect(w.emitted('change')?.at(-1)).toEqual([{ value: 6 }]);
    });

    it('emits update:modelValue on minus', async () => {
      const w = mountNumber({ modelValue: 5 });
      await w.find('.sn-input-number__minus').trigger('tap');
      await Promise.resolve();
      expect(lastValue(w)).toBe(4);
    });

    it('honours a custom step', async () => {
      const w = mountNumber({ modelValue: 5, step: 0.5, precision: 1 });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      expect(lastValue(w)).toBe(5.5);
    });

    it('clamps at max', async () => {
      const w = mountNumber({ modelValue: 10, max: 10 });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('clamps at min', async () => {
      const w = mountNumber({ modelValue: 0, min: 0 });
      await w.find('.sn-input-number__minus').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('marks the buttons disabled at the bounds', () => {
      const w = mountNumber({ modelValue: 0, min: 0 });
      expect(w.find('.sn-input-number__minus').attributes('aria-disabled')).toBe('true');
      expect(w.find('.sn-input-number__minus').attributes('tabindex')).toBe('-1');
    });

    it('snaps onto the step grid when stepStrictly is on', async () => {
      const w = mountNumber({ modelValue: 3, min: 0, max: 10, step: 4, stepStrictly: true });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      // 3 + 4 = 7 snaps onto the 0 / 4 / 8 grid → 8.
      expect(lastValue(w)).toBe(8);
    });

    it('keeps the precision digits', async () => {
      const w = mountNumber({ modelValue: 1.234, min: 0, max: 10, precision: 2 });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      expect(lastValue(w)).toBe(2.23);
    });
  });

  describe('disable flags', () => {
    it('blocks everything when disabled', async () => {
      const w = mountNumber({ disabled: true });
      await w.find('.sn-input-number__plus').trigger('tap');
      await w.find('.sn-input-number__minus').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.classes()).toContain('sn-input-number--disabled');
    });

    it('blocks only the plus button with disablePlus', async () => {
      const w = mountNumber({ disablePlus: true });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')).toBeUndefined();
      await w.find('.sn-input-number__minus').trigger('tap');
      await Promise.resolve();
      expect(lastValue(w)).toBe(4);
    });

    it('blocks only the minus button with disableMinus', async () => {
      const w = mountNumber({ disableMinus: true });
      await w.find('.sn-input-number__minus').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('blocks the field when disableInput is set', async () => {
      const w = mountNumber({ disableInput: true });
      const field = w.find('.sn-input-number__field');
      expect(field.attributes('disabled')).toBeDefined();
    });
  });

  describe('beforeChange veto', () => {
    it('keeps the value when beforeChange returns false', async () => {
      const beforeChange = vi.fn(() => false);
      const w = mountNumber({ beforeChange });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      expect(beforeChange).toHaveBeenCalledWith(6);
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('keeps the value when the async beforeChange resolves false', async () => {
      const w = mountNumber({ beforeChange: async () => false });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('applies the change when beforeChange allows it', async () => {
      const w = mountNumber({ beforeChange: () => true });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      await Promise.resolve();
      expect(lastValue(w)).toBe(6);
    });
  });

  describe('field interaction', () => {
    it('commits the typed value on input', async () => {
      const w = mountNumber({ modelValue: 5 });
      await w.find('.sn-input-number__field').setValue('7');
      await Promise.resolve();
      expect(lastValue(w)).toBe(7);
    });

    it('does not commit out-of-range typing immediately', async () => {
      const w = mountNumber({ modelValue: 5, max: 10 });
      await w.find('.sn-input-number__field').setValue('99');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('clamps on blur', async () => {
      const w = mountNumber({ modelValue: 5, max: 10 });
      const field = w.find('.sn-input-number__field');
      await field.setValue('99');
      await field.trigger('blur');
      await Promise.resolve();
      await Promise.resolve();
      expect(lastValue(w)).toBe(10);
    });

    it('defers the commit until blur when immediateChange is off', async () => {
      const w = mountNumber({ modelValue: 5, immediateChange: false });
      const field = w.find('.sn-input-number__field');
      await field.setValue('8');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      await field.trigger('blur');
      await Promise.resolve();
      await Promise.resolve();
      expect(lastValue(w)).toBe(8);
    });

    it('emits focus and blur payloads', async () => {
      const w = mountNumber({ modelValue: 5 });
      const field = w.find('.sn-input-number__field');
      await field.trigger('focus');
      await field.trigger('blur');
      expect(w.emitted('focus')?.[0]).toEqual([{ value: 5, height: 0 }]);
      expect(w.emitted('blur')?.[0]).toEqual([{ value: 5 }]);
    });
  });

  describe('allowNull', () => {
    it('keeps an empty value when allowNull is on', async () => {
      const w = mountNumber({ modelValue: 5, allowNull: true });
      await w.find('.sn-input-number__field').setValue('');
      await Promise.resolve();
      expect(lastValue(w)).toBe('');
    });

    it('refuses to clear when allowNull is off', async () => {
      const w = mountNumber({ modelValue: 5, allowNull: false });
      await w.find('.sn-input-number__field').setValue('');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('updateOnInit', () => {
    it('emits the corrected value on mount', () => {
      const w = mountNumber({ modelValue: 99, max: 10, updateOnInit: true });
      expect(lastValue(w)).toBe(10);
    });

    it('stays silent when updateOnInit is off', () => {
      const w = mountNumber({ modelValue: 99, max: 10, updateOnInit: false });
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('long press', () => {
    it('repeats the step while held and stops on release', async () => {
      vi.useFakeTimers();
      const w = mountNumber({ modelValue: 0, max: 100, longPress: true });
      await w.find('.sn-input-number__plus').trigger('touchstart');
      await vi.advanceTimersByTimeAsync(400);
      const emitted = w.emitted('update:modelValue')?.length ?? 0;
      expect(emitted).toBeGreaterThan(0);
      await w.find('.sn-input-number__plus').trigger('touchend');
      const settled = w.emitted('update:modelValue')?.length ?? 0;
      await vi.advanceTimersByTimeAsync(400);
      expect(w.emitted('update:modelValue')?.length ?? 0).toBe(settled);
    });

    it('clears the repeat timer on unmount', async () => {
      vi.useFakeTimers();
      const clearSpy = vi.spyOn(globalThis, 'clearInterval');
      const w = mountNumber({ modelValue: 0, max: 100, longPress: true });
      await w.find('.sn-input-number__plus').trigger('touchstart');
      await vi.advanceTimersByTimeAsync(200);
      expect(w.emitted('update:modelValue')?.length ?? 0).toBeGreaterThan(0);
      w.unmount();
      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
    });

    it('does not repeat when longPress is off', async () => {
      vi.useFakeTimers();
      const w = mountNumber({ modelValue: 0, max: 100, longPress: false });
      await w.find('.sn-input-number__plus').trigger('touchstart');
      await vi.advanceTimersByTimeAsync(400);
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  /* ── Extended coverage: presentation props, a11y, coercion edges ── */

  describe('presentation props', () => {
    it('passes a string inputWidth through verbatim', () => {
      const w = mountNumber({ inputWidth: '50%' });
      expect(w.find('.sn-input-number__field').attributes('style')).toContain('50%');
    });

    /* Untestable in happy-dom: numeric inputWidth expands to `NNNrpx`, an
     * invalid CSS length that happy-dom's parser drops, so no style attribute
     * survives to assert on. The expansion is verified by review. */

    it('omits the field width when inputWidth is unset', () => {
      const w = mountNumber();
      expect(w.find('.sn-input-number__field').attributes('style')).toBeUndefined();
    });

    it('forwards inputType to the native field', () => {
      expect(mountNumber({ inputType: 'number' }).find('input').attributes('type')).toBe('number');
      expect(mountNumber().find('input').attributes('type')).toBe('digit');
    });

    it('forwards adjustPosition', () => {
      const w = mountNumber({ adjustPosition: false });
      expect(w.find('input').attributes('adjust-position')).toBe('false');
    });

    it('applies customClass and customStyle to the root', () => {
      const w = mountNumber({ customClass: 'qty-x', customStyle: 'margin: 2px;' });
      expect(w.classes()).toContain('qty-x');
      expect(w.attributes('style')).toContain('margin: 2px');
    });

    it('applies the outline-split theme class', () => {
      expect(mountNumber({ theme: 'outline-split' }).classes()).toContain(
        'sn-input-number--outline-split',
      );
    });
  });

  describe('accessibility', () => {
    it('exposes a group role with the disabled state', () => {
      const w = mountNumber({ disabled: true });
      expect(w.attributes('role')).toBe('group');
      expect(w.attributes('aria-disabled')).toBe('true');
      expect(w.find('.sn-input-number__field').attributes('aria-label')).toBe('number input');
    });

    it('labels the stepper buttons for assistive tech', () => {
      const w = mountNumber();
      expect(w.find('.sn-input-number__minus').attributes('aria-label')).toBe('decrease');
      expect(w.find('.sn-input-number__plus').attributes('aria-label')).toBe('increase');
      expect(w.find('.sn-input-number__minus').attributes('role')).toBe('button');
      expect(w.find('.sn-input-number__plus').attributes('role')).toBe('button');
    });

    it('disables the plus button semantics at the max bound', () => {
      const w = mountNumber({ modelValue: 10, max: 10 });
      const plus = w.find('.sn-input-number__plus');
      expect(plus.attributes('aria-disabled')).toBe('true');
      expect(plus.attributes('tabindex')).toBe('-1');
    });

    it('uses the placeholder as the field accessible name', () => {
      const w = mountNumber({ placeholder: '库存' });
      expect(w.find('.sn-input-number__field').attributes('aria-label')).toBe('库存');
    });
  });

  describe('value normalization edges', () => {
    it('clamps below min on mount when updateOnInit is on', () => {
      const w = mountNumber({ modelValue: -5, min: 0 });
      expect(lastValue(w)).toBe(0);
    });

    it('snaps a mount value onto the step grid when stepStrictly is on', () => {
      const w = mountNumber({ modelValue: 3, min: 0, max: 10, step: 2, stepStrictly: true });
      expect(lastValue(w)).toBe(4);
    });

    it('honours a string precision prop', async () => {
      const w = mountNumber({ modelValue: 1.234, precision: '2' });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      expect(lastValue(w)).toBe(2.23);
    });

    it('rounds a typed decimal on blur when precision is 0', async () => {
      const w = mountNumber({ modelValue: 5 });
      const field = w.find('.sn-input-number__field');
      await field.setValue('6.6');
      await field.trigger('blur');
      await Promise.resolve();
      await Promise.resolve();
      expect(lastValue(w)).toBe(7);
    });

    it('avoids 0.1 + 0.2 floating-point drift with precision', async () => {
      const w = mountNumber({ modelValue: 0.1, step: 0.2, precision: 1 });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      expect(lastValue(w)).toBe(0.3);
    });

    it('steps down from min after an allowNull clear', async () => {
      const w = mountVModel({ modelValue: 5, min: 2, max: 10, allowNull: true });
      await w.find('.sn-input-number__field').setValue('');
      await Promise.resolve();
      expect(w.props('modelValue')).toBe('');
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      // unset state → base falls back to min, then +step
      expect(w.props('modelValue')).toBe(3);
    });

    it('keeps both stepper buttons live from the unset allowNull state', async () => {
      const w = mountVModel({ modelValue: 5, min: 2, max: 10, allowNull: true });
      await w.find('.sn-input-number__field').setValue('');
      await Promise.resolve();
      await w.setProps({ modelValue: '' });
      expect(w.find('.sn-input-number__minus').attributes('aria-disabled')).toBeUndefined();
      expect(w.find('.sn-input-number__plus').attributes('aria-disabled')).toBeUndefined();
      await w.find('.sn-input-number__minus').trigger('tap');
      await Promise.resolve();
      // unset → base min, minus clamps back onto min
      expect(w.props('modelValue')).toBe(2);
    });

    it('does not double-commit when the typed value is committed again on blur', async () => {
      const w = mountVModel({ modelValue: 5 });
      const field = w.find('.sn-input-number__field');
      await field.setValue('7');
      await Promise.resolve();
      const afterInput = w.emitted('update:modelValue')?.length ?? 0;
      await field.trigger('blur');
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('update:modelValue')?.length ?? 0).toBe(afterInput);
    });

    it('shows the raw draft in the field while typing out of range', async () => {
      const w = mountNumber({ modelValue: 5, max: 10 });
      const field = w.find('.sn-input-number__field');
      await field.setValue('99');
      expect((field.element as HTMLInputElement).value).toBe('99');
      await field.trigger('blur');
      await Promise.resolve();
      await Promise.resolve();
      // clamped and re-rendered from the committed model
      expect((w.find('.sn-input-number__field').element as HTMLInputElement).value).toBe('5');
    });

    it('vets the normalized (clamped) value through beforeChange', async () => {
      const beforeChange = vi.fn(() => true);
      const w = mountNumber({ modelValue: 9, max: 10, beforeChange });
      await w.find('.sn-input-number__plus').trigger('tap');
      await Promise.resolve();
      await Promise.resolve();
      expect(beforeChange).toHaveBeenCalledWith(10);
      expect(lastValue(w)).toBe(10);
    });

    it('accumulates rapid taps under v-model', async () => {
      const w = mountVModel({ modelValue: 0, min: 0, max: 10 });
      const plus = w.find('.sn-input-number__plus');
      await plus.trigger('tap');
      await plus.trigger('tap');
      await plus.trigger('tap');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')).toHaveLength(3);
      expect(w.props('modelValue')).toBe(3);
    });
  });

  describe('long press bounds', () => {
    it('stops repeating when the held press reaches max', async () => {
      vi.useFakeTimers();
      const w = mountVModel({ modelValue: 9, min: 0, max: 10, longPress: true });
      await w.find('.sn-input-number__plus').trigger('touchstart');
      await vi.advanceTimersByTimeAsync(600);
      // only the single step to the bound, then the timer self-clears
      const values = (w.emitted('update:modelValue') ?? []).map((e) => e[0]);
      expect(values).toEqual([10]);
      await w.find('.sn-input-number__plus').trigger('touchcancel');
      await vi.advanceTimersByTimeAsync(400);
      expect(w.emitted('update:modelValue')).toHaveLength(1);
    });
  });

  describe('allowNull regression (Number("") === 0)', () => {
    it('does not overwrite a deliberate empty value on mount', () => {
      const w = mount(SnInputNumber, {
        props: { modelValue: '', allowNull: true, min: 2, max: 10 },
      });
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('does not overwrite the empty value on blur either', async () => {
      const w = mountVModel({ modelValue: '', min: 2, max: 10, allowNull: true });
      await w.find('.sn-input-number__field').trigger('blur');
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.props('modelValue')).toBe('');
    });
  });
});
