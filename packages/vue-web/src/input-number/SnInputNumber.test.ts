/**
 * SnInputNumber unit tests — web-end numeric input (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): steppers, keyboard, clamping,
 * precision, stepStrictly, format/parse, clearable, disabled, null,
 * `buttonPlacement` (left / both / right), the tail ↑ / ↓ spinner, the
 * replaceable − / + / ↑ / ↓ glyph slots and the stepper background plate /
 * spacing / centring CSS contract.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, ref } from 'vue';
import SnInputNumber from './SnInputNumber.vue';
import { expectIconRendered, expectNoMissingIcons } from '../test-utils/icon-assertions';

/** Mount helper — keeps tests focused on props. */
function mountNumber(props: Record<string, unknown> = {}) {
  return mount(SnInputNumber, { props });
}

/**
 * Mount with a live v-model so multiple steps accumulate (the component
 * is controlled — props.modelValue must sync back for repeat steps).
 */
function mountVModel(initial: number | null, props: Record<string, unknown> = {}) {
  const value = ref<number | null>(initial);
  const wrapper = mount({
    setup() {
      return () =>
        h(SnInputNumber, {
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (v: number | null) => {
            value.value = v;
          },
        });
    },
  });
  return { wrapper: wrapper.findComponent(SnInputNumber), value };
}

/** Click a stepper button down+up (one step). */
async function clickStep(wrapper: ReturnType<typeof mount>, selector: string): Promise<void> {
  await wrapper.find(selector).trigger('mousedown');
  await wrapper.find(selector).trigger('mouseup');
}

describe('SnInputNumber', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a spinbutton input with no value by default', () => {
    const wrapper = mountNumber();
    const input = wrapper.find('input');
    expect(input.attributes('role')).toBe('spinbutton');
    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('displays the modelValue', () => {
    const wrapper = mountNumber({ modelValue: 42 });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('42');
  });

  it('emits update:modelValue when the plus button is clicked', async () => {
    const wrapper = mountNumber({ modelValue: 0 });
    await clickStep(wrapper, '.sn-input-number__btn--plus');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1]);
  });

  it('emits update:modelValue when the minus button is clicked', async () => {
    const wrapper = mountNumber({ modelValue: 5 });
    await clickStep(wrapper, '.sn-input-number__btn--minus');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4]);
  });

  it('emits change alongside update:modelValue on step', async () => {
    const wrapper = mountNumber({ modelValue: 1 });
    await clickStep(wrapper, '.sn-input-number__btn--plus');
    expect(wrapper.emitted('change')?.at(-1)).toEqual([2]);
  });

  it('starts from min when stepping from a null value', async () => {
    const { wrapper, value } = mountVModel(null, { min: 10, step: 5 });
    await clickStep(wrapper, '.sn-input-number__btn--plus');
    expect(value.value).toBe(10);
  });

  it('clamps to max on the plus button', async () => {
    const { wrapper, value } = mountVModel(9, { max: 10 });
    await clickStep(wrapper, '.sn-input-number__btn--plus');
    expect(value.value).toBe(10);
    const emittedCount = wrapper.emitted('update:modelValue')?.length ?? 0;
    await clickStep(wrapper, '.sn-input-number__btn--plus');
    expect(wrapper.emitted('update:modelValue')?.length).toBe(emittedCount);
  });

  it('clamps to min on the minus button', async () => {
    const { wrapper, value } = mountVModel(1, { min: 0 });
    await clickStep(wrapper, '.sn-input-number__btn--minus');
    expect(value.value).toBe(0);
    const emittedCount = wrapper.emitted('update:modelValue')?.length ?? 0;
    await clickStep(wrapper, '.sn-input-number__btn--minus');
    expect(wrapper.emitted('update:modelValue')?.length).toBe(emittedCount);
  });

  it('disables the plus button at max', () => {
    const wrapper = mountNumber({ modelValue: 10, max: 10 });
    expect(
      (wrapper.find('.sn-input-number__btn--plus').element as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('disables the minus button at min', () => {
    const wrapper = mountNumber({ modelValue: 0, min: 0 });
    expect(
      (wrapper.find('.sn-input-number__btn--minus').element as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('steps by a custom step size', async () => {
    const wrapper = mountNumber({ modelValue: 0, step: 5 });
    await clickStep(wrapper, '.sn-input-number__btn--plus');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([5]);
  });

  it('respects precision when stepping', async () => {
    const wrapper = mountNumber({ modelValue: 0, step: 0.1, precision: 2 });
    await clickStep(wrapper, '.sn-input-number__btn--plus');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0.1]);
  });

  it('repeats steps while the plus button is held (long-press)', async () => {
    vi.useFakeTimers();
    try {
      const { wrapper, value } = mountVModel(0);
      await wrapper.find('.sn-input-number__btn--plus').trigger('mousedown');
      // immediate step, then the repeat interval takes over
      expect(value.value).toBe(1);
      await vi.advanceTimersByTimeAsync(400);
      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(100);
      expect(value.value).toBe(3);
      await wrapper.find('.sn-input-number__btn--plus').trigger('mouseup');
      const atRelease = value.value;
      await vi.advanceTimersByTimeAsync(500);
      expect(value.value).toBe(atRelease);
    } finally {
      vi.useRealTimers();
    }
  });

  it('increases with ArrowUp', async () => {
    const wrapper = mountNumber({ modelValue: 2 });
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3]);
  });

  it('decreases with ArrowDown', async () => {
    const wrapper = mountNumber({ modelValue: 2 });
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1]);
  });

  it('steps by 10x with PageUp / PageDown', async () => {
    const { wrapper, value } = mountVModel(0);
    await wrapper.find('input').trigger('keydown', { key: 'PageUp' });
    expect(value.value).toBe(10);
    await wrapper.find('input').trigger('keydown', { key: 'PageDown' });
    expect(value.value).toBe(0);
  });

  it('clamps typed input to min and max on change', async () => {
    const wrapper = mountNumber({ modelValue: 5, min: 0, max: 10 });
    const input = wrapper.find('input');
    await input.setValue('99');
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([10]);
    await input.setValue('-5');
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0]);
  });

  it('rounds to precision on commit', async () => {
    const wrapper = mountNumber({ modelValue: 1, precision: 2 });
    const input = wrapper.find('input');
    await input.setValue('1.238');
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1.24]);
  });

  it('snaps to step multiples when stepStrictly is on', async () => {
    const wrapper = mountNumber({ modelValue: 0, step: 5, stepStrictly: true });
    const input = wrapper.find('input');
    await input.setValue('13');
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([15]);
  });

  it('formats display but parses input via the format/parse pair', async () => {
    const wrapper = mountNumber({
      modelValue: 0.5,
      format: (v: number) => `${Math.round(v * 100)}%`,
      parse: (s: string) => (s.trim() === '' ? null : Number(s.replace('%', '')) / 100),
    });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('50%');
    const input = wrapper.find('input');
    await input.setValue('75%');
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0.75]);
  });

  it('applies parse result clamping and precision', async () => {
    const wrapper = mountNumber({
      modelValue: 0,
      max: 1,
      precision: 2,
      parse: (s: string) => Number(s),
    });
    const input = wrapper.find('input');
    await input.setValue('1.377');
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1]);
  });

  it('rejects a commit when the validator returns false', async () => {
    const wrapper = mountNumber({
      modelValue: 5,
      validator: (v: number) => v !== 7,
    });
    const input = wrapper.find('input');
    await input.setValue('7');
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('does not commit invalid (NaN) input', async () => {
    const wrapper = mountNumber({ modelValue: 5 });
    const input = wrapper.find('input');
    await input.setValue('abc');
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('input')?.at(-1)).toEqual([null]);
  });

  it('emits input with the parsed value on each keystroke', async () => {
    const wrapper = mountNumber({ modelValue: null });
    await wrapper.find('input').setValue('12');
    expect(wrapper.emitted('input')?.at(-1)).toEqual([12]);
  });

  it('commits on Enter', async () => {
    const wrapper = mountNumber({ modelValue: 1 });
    const input = wrapper.find('input');
    await input.setValue('4');
    await input.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([4]);
  });

  it('commits to null when the field is emptied', async () => {
    const wrapper = mountNumber({ modelValue: 3 });
    const input = wrapper.find('input');
    await input.setValue('');
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null]);
  });

  it('clears to null via the clear button', async () => {
    const wrapper = mountNumber({ modelValue: 8, clearable: true });
    await wrapper.find('.sn-input-number__clear-btn').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([null]);
  });

  it('hides the clear button without a value', () => {
    const wrapper = mountNumber({ modelValue: null, clearable: true });
    expect(wrapper.find('.sn-input-number__clear-btn').exists()).toBe(false);
  });

  it('hides the clear button when disabled', () => {
    const wrapper = mountNumber({ modelValue: 1, clearable: true, disabled: true });
    expect(wrapper.find('.sn-input-number__clear-btn').exists()).toBe(false);
  });

  it('does not step when disabled', async () => {
    const wrapper = mountNumber({ modelValue: 0, disabled: true });
    await clickStep(wrapper, '.sn-input-number__btn--plus');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('does not step when readonly', async () => {
    const wrapper = mountNumber({ modelValue: 0, readonly: true });
    await clickStep(wrapper, '.sn-input-number__btn--plus');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('sets disabled attribute and class', () => {
    const wrapper = mountNumber({ disabled: true });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('sn-input-number--disabled');
  });

  it('sets readonly attribute and class', () => {
    const wrapper = mountNumber({ readonly: true });
    expect(wrapper.find('input').attributes('readonly')).toBeDefined();
    expect(wrapper.classes()).toContain('sn-input-number--readonly');
  });

  it('hides stepper buttons when showButton is false', () => {
    const wrapper = mountNumber({ showButton: false });
    expect(wrapper.find('.sn-input-number__btn').exists()).toBe(false);
  });

  it('stacks steppers to the right by default', () => {
    const wrapper = mountNumber();
    expect(wrapper.classes()).toContain('sn-input-number--placement-right');
    expect(wrapper.classes()).not.toContain('sn-input-number--placement-both');
  });

  it('places steppers on both sides when buttonPlacement is both', () => {
    const wrapper = mountNumber({ buttonPlacement: 'both' });
    expect(wrapper.classes()).toContain('sn-input-number--placement-both');
  });

  it('applies size class', () => {
    const wrapper = mountNumber({ size: 'large' });
    expect(wrapper.classes()).toContain('sn-input-number--large');
  });

  it('forwards placeholder', () => {
    const wrapper = mountNumber({ placeholder: 'Enter amount' });
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter amount');
  });

  it('exposes aria-valuenow / valuemin / valuemax', () => {
    const wrapper = mountNumber({ modelValue: 4, min: 0, max: 10 });
    const input = wrapper.find('input');
    expect(input.attributes('aria-valuenow')).toBe('4');
    expect(input.attributes('aria-valuemin')).toBe('0');
    expect(input.attributes('aria-valuemax')).toBe('10');
  });

  it('omits aria-valuenow when the value is null', () => {
    const wrapper = mountNumber({ modelValue: null });
    expect(wrapper.find('input').attributes('aria-valuenow')).toBeUndefined();
  });

  it('honors border variants and the bordered alias', () => {
    expect(mountNumber({ border: 'none' }).classes()).toContain('sn-input-number--border-none');
    expect(mountNumber({ border: 'bottom' }).classes()).toContain('sn-input-number--border-bottom');
    expect(mountNumber({ bordered: false }).classes()).toContain('sn-input-number--border-none');
    expect(mountNumber({ bordered: true }).classes()).toContain('sn-input-number--border-all');
  });

  it('renders prefix and suffix slots', () => {
    const wrapper = mount(SnInputNumber, {
      props: { modelValue: 1 },
      slots: {
        prefix: '<i data-testid="pfx">$</i>',
        suffix: '<i data-testid="sfx">kg</i>',
      },
    });
    expect(wrapper.find('[data-testid="pfx"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="sfx"]').exists()).toBe(true);
  });

  it('emits focus and blur events', async () => {
    const wrapper = mountNumber({ modelValue: 1 });
    await wrapper.find('input').trigger('focus');
    await wrapper.find('input').trigger('blur');
    expect(wrapper.emitted('focus')).toHaveLength(1);
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('commits in-flight text on blur', async () => {
    const wrapper = mountNumber({ modelValue: 1 });
    const input = wrapper.find('input');
    await input.setValue('6');
    await input.trigger('blur');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([6]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([6]);
  });

  /* --- buttonPlacement: left / both / right --- */

  /* --- buttonMode: symbol (− / +) vs spinner (↑ / ↓) — mutually exclusive --- */

  it('renders the − / + pair as the only stepper in symbol mode (default)', () => {
    const wrapper = mountNumber();
    expect(wrapper.classes()).toContain('sn-input-number--mode-symbol');
    const tail = wrapper.find('.sn-input-number__stepper--tail');
    expect(tail.find('.sn-input-number__btn--minus').exists()).toBe(true);
    expect(tail.find('.sn-input-number__btn--plus').exists()).toBe(true);
    // Never side by side with the ↑ / ↓ plate.
    expect(wrapper.find('.sn-input-number__spin').exists()).toBe(false);
    expect(wrapper.find('.sn-input-number__stepper--head').exists()).toBe(false);
  });

  it('renders only the ↑ / ↓ plate in spinner mode — no − / + at all', () => {
    const wrapper = mountNumber({ buttonMode: 'spinner' });
    expect(wrapper.classes()).toContain('sn-input-number--mode-spinner');
    expect(wrapper.find('.sn-input-number__spin').exists()).toBe(true);
    expect(wrapper.find('.sn-input-number__stepper--head').exists()).toBe(false);
    expect(wrapper.find('.sn-input-number__btn--minus').exists()).toBe(false);
    expect(wrapper.find('.sn-input-number__btn--plus').exists()).toBe(false);
  });

  it('keeps spinner mode exclusive of the symbol pair in every placement', () => {
    for (const placement of ['left', 'both', 'right'] as const) {
      const wrapper = mountNumber({ buttonMode: 'spinner', buttonPlacement: placement });
      expect(wrapper.find('.sn-input-number__spin').exists(), placement).toBe(true);
      expect(wrapper.find('.sn-input-number__btn--minus').exists(), placement).toBe(false);
      expect(wrapper.find('.sn-input-number__btn--plus').exists(), placement).toBe(false);
    }
  });

  /* --- buttonPlacement (symbol mode) --- */

  it('mirrors the symbol pair into the head for the left placement', () => {
    const wrapper = mountNumber({ buttonPlacement: 'left' });
    expect(wrapper.classes()).toContain('sn-input-number--placement-left');
    const head = wrapper.find('.sn-input-number__stepper--head');
    expect(head.find('.sn-input-number__btn--minus').exists()).toBe(true);
    expect(head.find('.sn-input-number__btn--plus').exists()).toBe(true);
    // Nothing is left over in the tail.
    expect(wrapper.find('.sn-input-number__stepper--tail').exists()).toBe(false);
  });

  it('steps from the head pair when buttonPlacement is left', async () => {
    const wrapper = mountNumber({ modelValue: 4, buttonPlacement: 'left' });
    const head = '.sn-input-number__stepper--head ';
    await clickStep(wrapper, `${head}.sn-input-number__btn--plus`);
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([5]);
    await clickStep(wrapper, `${head}.sn-input-number__btn--minus`);
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3]);
  });

  it('splits minus into the head and plus into the tail when buttonPlacement is both', () => {
    const wrapper = mountNumber({ buttonPlacement: 'both' });
    const head = wrapper.find('.sn-input-number__stepper--head');
    const tail = wrapper.find('.sn-input-number__stepper--tail');
    expect(head.find('.sn-input-number__btn--minus').exists()).toBe(true);
    expect(head.find('.sn-input-number__btn--plus').exists()).toBe(false);
    expect(tail.find('.sn-input-number__btn--plus').exists()).toBe(true);
    expect(tail.find('.sn-input-number__btn--minus').exists()).toBe(false);
  });

  /* --- stepper glyphs --- */

  it('renders the built-in − / + glyphs through SnIcon', () => {
    const wrapper = mountNumber();
    expectIconRendered(wrapper, '.sn-input-number__btn--minus .sn-icon');
    expectIconRendered(wrapper, '.sn-input-number__btn--plus .sn-icon');
    expectNoMissingIcons(wrapper, 'SnInputNumber');
  });

  it('renders the built-in ↑ / ↓ glyphs through SnIcon', () => {
    const wrapper = mountNumber({ buttonMode: 'spinner' });
    expectIconRendered(wrapper, '.sn-input-number__btn--up .sn-icon');
    expectIconRendered(wrapper, '.sn-input-number__btn--down .sn-icon');
    expectNoMissingIcons(wrapper, 'SnInputNumber');
  });

  it('replaces the − / + glyphs through the icon slots', () => {
    const wrapper = mount(SnInputNumber, {
      props: { modelValue: 1 },
      slots: {
        'minus-icon': '<i data-testid="minus-glyph">-</i>',
        'plus-icon': '<i data-testid="plus-glyph">+</i>',
      },
    });
    for (const id of ['minus-glyph', 'plus-glyph']) {
      expect(wrapper.find(`[data-testid="${id}"]`).exists(), id).toBe(true);
    }
    expect(wrapper.find('.sn-input-number__btn .sn-icon').exists()).toBe(false);
  });

  it('replaces the ↑ / ↓ glyphs through the icon slots', () => {
    const wrapper = mount(SnInputNumber, {
      props: { modelValue: 1, buttonMode: 'spinner' },
      slots: {
        'up-icon': '<i data-testid="up-glyph">^</i>',
        'down-icon': '<i data-testid="down-glyph">v</i>',
      },
    });
    for (const id of ['up-glyph', 'down-glyph']) {
      expect(wrapper.find(`[data-testid="${id}"]`).exists(), id).toBe(true);
    }
    expect(wrapper.find('.sn-input-number__spin .sn-icon').exists()).toBe(false);
  });

  /* --- tail ↑ / ↓ spinner --- */

  it('steps up / down from the spinner halves', async () => {
    const wrapper = mountNumber({ modelValue: 3, buttonMode: 'spinner' });
    const up = wrapper.find('.sn-input-number__btn--up');
    await up.trigger('mousedown');
    await up.trigger('mouseup');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4]);
    const down = wrapper.find('.sn-input-number__btn--down');
    await down.trigger('mousedown');
    await down.trigger('mouseup');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2]);
  });

  it('long-presses the spinner halves like the − / + buttons', async () => {
    vi.useFakeTimers();
    try {
      const { wrapper, value } = mountVModel(0, { buttonMode: 'spinner' });
      await wrapper.find('.sn-input-number__btn--up').trigger('mousedown');
      expect(value.value).toBe(1);
      await vi.advanceTimersByTimeAsync(400);
      await vi.advanceTimersByTimeAsync(100);
      expect(value.value).toBe(2);
      await wrapper.find('.sn-input-number__btn--up').trigger('mouseup');
      const atRelease = value.value;
      await vi.advanceTimersByTimeAsync(500);
      expect(value.value).toBe(atRelease);
    } finally {
      vi.useRealTimers();
    }
  });

  it('disables each spinner half at its own bound', () => {
    const atMax = mountNumber({ modelValue: 5, max: 5, buttonMode: 'spinner' });
    expect((atMax.find('.sn-input-number__btn--up').element as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect((atMax.find('.sn-input-number__btn--down').element as HTMLButtonElement).disabled).toBe(
      false,
    );
    const atMin = mountNumber({ modelValue: 0, min: 0, buttonMode: 'spinner' });
    expect((atMin.find('.sn-input-number__btn--down').element as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  /* --- stepper background plate --- */

  it('forwards the stepper background props as per-instance CSS vars', () => {
    const wrapper = mountNumber({
      buttonBackground: '#f2f3f5',
      buttonHoverBackground: '#ffe9c7',
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('--sn-web-input-number-btn-bg: #f2f3f5');
    expect(style).toContain('--sn-web-input-number-btn-hover-bg: #ffe9c7');
  });

  it('leaves the stepper plate vars unset without the props', () => {
    const style = mountNumber().attributes('style') ?? '';
    expect(style).not.toContain('--sn-web-input-number-btn-bg');
    expect(style).not.toContain('--sn-web-input-number-btn-hover-bg');
  });
});

/**
 * happy-dom never parses a scoped `<style>` block, so the plate / centring
 * contract is asserted against the component source — the same approach
 * SnAlert.test.ts and SnSteps.test.ts use for their geometry guards.
 */
describe('SnInputNumber stepper plate CSS', () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const source = readFileSync(resolve(here, './SnInputNumber.vue'), 'utf8');
  const styleBlock = /<style scoped>([\s\S]*?)<\/style>/.exec(source);
  if (!styleBlock) throw new Error('SnInputNumber.vue lost its <style scoped> block');

  /** Flatten the style block into { selectors, body } rules. */
  const rules = [
    ...styleBlock[1].replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g),
  ].map((m) => ({
    selectors: m[1].split(',').map((s) => s.replace(/\s+/g, ' ').trim()),
    body: m[2].replace(/\s+/g, ' ').trim(),
  }));

  function bodyOf(selector: string): string {
    const rule = rules.find((r) => r.selectors.includes(selector));
    if (!rule) throw new Error(`no CSS rule for "${selector}"`);
    return rule.body;
  }

  it('centres the value in the both placement', () => {
    expect(bodyOf('.sn-input-number--placement-both .sn-input-number__native')).toContain(
      'text-align: center',
    );
  });

  it('paints the button plate from --sn-web-input-number-btn-bg', () => {
    const body = bodyOf('.sn-input-number__btn');
    expect(body).toContain('background: var(--sn-web-input-number-btn-bg, transparent)');
    expect(body).toContain('background-color 0.15s ease-out');
  });

  it('insets the plate so a coloured button clears the field edge', () => {
    const body = bodyOf('.sn-input-number__btn');
    expect(body).toContain('align-self: center');
    expect(body).toContain('height: calc(100% - 6px)');
    expect(body).toContain('border-radius: var(--sn-web-radius-sm, 4px)');
  });

  it('scopes the hover plate to the both placement', () => {
    const hoverRules = rules.filter((r) => r.body.includes('--sn-web-input-number-btn-hover-bg'));
    expect(hoverRules).toHaveLength(1);
    expect(hoverRules[0].selectors.join(' ')).toContain('--placement-both');
    expect(hoverRules[0].body).toMatch(/background: var\(\s*--sn-web-input-number-btn-hover-bg,/);
  });

  it('gives every plate horizontal breathing room from the border', () => {
    expect(bodyOf('.sn-input-number__btn')).toContain('margin: 0 3px');
    expect(bodyOf('.sn-input-number__spin')).toContain('margin: 0 3px');
  });

  it('stacks the ↑ / ↓ spinner halves inside one plate', () => {
    const spin = bodyOf('.sn-input-number__spin');
    expect(spin).toContain('flex-direction: column');
    expect(spin).toContain('height: calc(100% - 6px)');
    expect(spin).toContain('background: var(--sn-web-input-number-btn-bg, transparent)');
    const half = bodyOf('.sn-input-number__spin .sn-input-number__btn');
    expect(half).toContain('flex: 1 1 50%');
    expect(half).toContain('background: transparent');
  });
});
