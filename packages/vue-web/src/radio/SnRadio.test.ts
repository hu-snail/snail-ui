/**
 * SnRadio / SnRadioButton / SnRadioGroup unit tests (AUI-WEB-RADIO-001).
 *
 * Behavior tests (AGENTS.md §46): checked switching, group linkage,
 * disabled suppression, button form, keyboard behavior via native radio.
 */
import { describe, it, expect } from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import SnRadio from './SnRadio.vue';
import SnRadioButton from './SnRadioButton.vue';
import SnRadioGroup from './SnRadioGroup.vue';

/** Component source — used for CSS contract assertions (happy-dom skips styles). */
const here = dirname(fileURLToPath(import.meta.url));
const radioButtonSource = readFileSync(resolve(here, './SnRadioButton.vue'), 'utf8');

describe('SnRadio', () => {
  it('renders a native radio input', () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', label: 'A' },
    });
    expect(wrapper.find('input[type="radio"]').exists()).toBe(true);
  });

  it('is checked when standalone modelValue equals checkedValue', () => {
    const checked = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: 'a', label: 'A' },
    });
    expect(checked.find('input').element.checked).toBe(true);
    const unchecked = mount(SnRadio, {
      props: { checkedValue: 'b', modelValue: 'a', label: 'B' },
    });
    expect(unchecked.find('input').element.checked).toBe(false);
  });

  it('emits update:modelValue with checkedValue on change', async () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: null },
    });
    await wrapper.find('input').setValue('a');
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted?.at(-1)).toEqual(['a']);
  });

  it('emits change and checked on activation', async () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: null },
    });
    await wrapper.find('input').setValue('a');
    expect(wrapper.emitted('checked')).toHaveLength(1);
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('applies disabled attribute and class', () => {
    const wrapper = mount(SnRadio, { props: { disabled: true } });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('sn-radio--disabled');
  });

  it('applies readonly class', () => {
    const wrapper = mount(SnRadio, { props: { readonly: true } });
    expect(wrapper.classes()).toContain('sn-radio--readonly');
  });

  it('applies size class', () => {
    const wrapper = mount(SnRadio, { props: { size: 'large' } });
    expect(wrapper.classes()).toContain('sn-radio--large');
  });

  it('applies status class and aria-invalid for error', () => {
    const wrapper = mount(SnRadio, { props: { status: 'error' } });
    expect(wrapper.classes()).toContain('sn-radio--status-error');
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
  });

  it('forwards name attribute', () => {
    const wrapper = mount(SnRadio, { props: { name: 'gender' } });
    expect(wrapper.find('input').attributes('name')).toBe('gender');
  });

  it('forwards label prop text', () => {
    const wrapper = mount(SnRadio, { props: { label: 'Option A' } });
    expect(wrapper.find('.sn-radio__label').text()).toBe('Option A');
  });

  it('renders the label slot with checked scope', () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: 'a' },
      slots: { label: '<i data-testid="lbl">Custom</i>' },
    });
    expect(wrapper.find('[data-testid="lbl"]').exists()).toBe(true);
    expect(wrapper.find('input').element.checked).toBe(true);
  });

  it('emits focus and blur', async () => {
    const wrapper = mount(SnRadio, {});
    await wrapper.find('input').trigger('focus');
    await wrapper.find('input').trigger('blur');
    expect(wrapper.emitted('focus')).toHaveLength(1);
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('supports number and boolean values', () => {
    const numeric = mount(SnRadio, {
      props: { checkedValue: 1, modelValue: 1 },
    });
    expect(numeric.find('input').element.checked).toBe(true);
    const bool = mount(SnRadio, {
      props: { checkedValue: true, modelValue: true },
    });
    expect(bool.find('input').element.checked).toBe(true);
  });
});

describe('SnRadioGroup', () => {
  it('renders child SnRadio components from options', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    const inputs = wrapper.findAll('input[type="radio"]');
    expect(inputs).toHaveLength(2);
    expect(inputs[0].element.checked).toBe(true);
    expect(inputs[1].element.checked).toBe(false);
  });

  it('coerces plain-value options to label/value pairs', () => {
    const wrapper = mount(SnRadioGroup, {
      props: { modelValue: 'x', options: ['x', 'y'] },
    });
    expect(wrapper.findAll('.sn-radio__label')[0].text()).toBe('x');
    expect(wrapper.findAll('input[type="radio"]')[0].element.checked).toBe(true);
  });

  it('emits update:modelValue when a child radio is activated', async () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    await wrapper.findAll('input[type="radio"]')[1].setValue('b');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b']);
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['b']);
  });

  it('renders slot children over options', () => {
    const wrapper = mount(SnRadioGroup, {
      props: { modelValue: 'a', options: [{ label: 'A', value: 'a' }] },
      slots: {
        default: '<SnRadio checked-value="z" label="Z" />',
      },
      global: { components: { SnRadio } },
    });
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(1);
    expect(wrapper.find('.sn-radio__label').text()).toBe('Z');
  });

  it('provides the shared name to children', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        name: 'fruit',
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    wrapper.findAll('input[type="radio"]').forEach((input) => {
      expect(input.attributes('name')).toBe('fruit');
    });
  });

  it('group disabled disables all children', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        disabled: true,
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    wrapper.findAll('input[type="radio"]').forEach((input) => {
      expect(input.attributes('disabled')).toBeDefined();
    });
  });

  it('group size drives child size classes', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        size: 'small',
        modelValue: 'a',
        options: [{ label: 'A', value: 'a' }],
      },
    });
    expect(wrapper.findComponent(SnRadio).classes()).toContain('sn-radio--small');
  });

  it('group status drives child status classes', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        status: 'warning',
        modelValue: 'a',
        options: [{ label: 'A', value: 'a' }],
      },
    });
    expect(wrapper.findComponent(SnRadio).classes()).toContain('sn-radio--status-warning');
  });

  it('renders button-form children when button=true', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        button: true,
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    expect(wrapper.findAll('.sn-radio-button')).toHaveLength(2);
    expect(wrapper.classes()).toContain('sn-radio-group--button');
  });

  it('sets role=radiogroup on the root', () => {
    const wrapper = mount(SnRadioGroup, { props: {} });
    expect(wrapper.attributes('role')).toBe('radiogroup');
  });

  it('per-child disabled overrides group default', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
        ],
      },
    });
    const inputs = wrapper.findAll('input[type="radio"]');
    expect(inputs[0].attributes('disabled')).toBeUndefined();
    expect(inputs[1].attributes('disabled')).toBeDefined();
  });
});

describe('SnRadioButton', () => {
  it('renders as a button-styled radio', () => {
    const wrapper = mount(SnRadioButton, {
      props: { checkedValue: 'a', label: 'A' },
    });
    expect(wrapper.classes()).toContain('sn-radio-button');
    expect(wrapper.find('input[type="radio"]').exists()).toBe(true);
  });

  it('is checked when standalone modelValue equals checkedValue', () => {
    const wrapper = mount(SnRadioButton, {
      props: { checkedValue: 'a', modelValue: 'a' },
    });
    expect(wrapper.find('input').element.checked).toBe(true);
    expect(wrapper.classes()).toContain('sn-radio-button--checked');
  });

  it('syncs with the group on activation', async () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
      slots: {
        default: `
          <SnRadioButton checked-value="a" label="A" />
          <SnRadioButton checked-value="b" label="B" />
        `,
      },
      global: { components: { SnRadioButton } },
    });
    const inputs = wrapper.findAll('input[type="radio"]');
    expect(inputs[0].element.checked).toBe(true);
    await inputs[1].setValue('b');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b']);
  });

  it('applies disabled state', () => {
    const wrapper = mount(SnRadioButton, { props: { disabled: true } });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('sn-radio-button--disabled');
  });

  it('applies size class', () => {
    const wrapper = mount(SnRadioButton, { props: { size: 'large' } });
    expect(wrapper.classes()).toContain('sn-radio-button--large');
  });

  it('applies status class', () => {
    const wrapper = mount(SnRadioButton, { props: { status: 'error' } });
    expect(wrapper.classes()).toContain('sn-radio-button--status-error');
  });
});

describe('SnRadio keyboard behavior', () => {
  it('native inputs in a shared group accept keyboard-driven checked changes', async () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        name: 'kb',
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    const inputs = wrapper.findAll('input[type="radio"]');
    // jsdom does not implement arrow-key radio roving, but the native
    // change pathway (what arrows trigger) must sync the group.
    await inputs[1].setValue('b');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b']);
  });

  it('inputs share the same name inside a group (arrow-key prerequisite)', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        name: 'kb',
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    });
    const names = wrapper.findAll('input[type="radio"]').map((i) => i.attributes('name'));
    expect(names).toEqual(['kb', 'kb']);
  });
});

describe('SnRadioButton in-group segment merging', () => {
  /*
   * Regression guard: the group used to remove the right radius only from the
   * FIRST segment, so every interior segment kept a rounded right corner and
   * the shared edge rendered as a doubled divider. Only the two outer ends may
   * stay rounded, and the active segment must paint above its neighbours.
   */
  it('squares the right edge of every segment except the last', () => {
    const rule =
      /\.sn-radio-button--in-group:not\(:last-child\)\s*\{[^}]*border-top-right-radius:\s*0;[^}]*border-bottom-right-radius:\s*0;/m;
    expect(rule.test(radioButtonSource)).toBe(true);
  });

  it('squares the left edge of every non-first segment', () => {
    const rule =
      /\.sn-radio-button--in-group \+ \.sn-radio-button--in-group\s*\{[^}]*border-top-left-radius:\s*0;[^}]*border-bottom-left-radius:\s*0;/m;
    expect(rule.test(radioButtonSource)).toBe(true);
  });

  it('no longer keys the right-edge rule off the previous sibling', () => {
    // The old selector left interior segments rounded.
    const oldRule =
      /\.sn-radio-button--in-group:not\(\.sn-radio-button--in-group \+ \.sn-radio-button--in-group\)\s*\{/m;
    expect(oldRule.test(radioButtonSource)).toBe(false);
  });

  it('raises the checked segment above its neighbours', () => {
    const rule = /\.sn-radio-button--in-group\.sn-radio-button--checked\s*\{[^}]*z-index:\s*1;/m;
    expect(rule.test(radioButtonSource)).toBe(true);
  });

  it('collapses adjacent borders with a negative margin', () => {
    const rule =
      /\.sn-radio-button--in-group \+ \.sn-radio-button--in-group\s*\{[^}]*margin-left:\s*-1px;/m;
    expect(rule.test(radioButtonSource)).toBe(true);
  });

  it('renders a single shared border line between grouped segments', () => {
    const wrapper = mount(SnRadioGroup, {
      props: { button: true, modelValue: 'b', options: ['a', 'b', 'c'] },
    });
    const segments = wrapper.findAll('.sn-radio-button--in-group');
    expect(segments).toHaveLength(3);
    // Every segment is a sibling in one group — no wrapper element between
    // them that could re-introduce a separate border box.
    const parent = segments[0].element.parentElement;
    expect(segments.every((s) => s.element.parentElement === parent)).toBe(true);
    expect(wrapper.findAll('.sn-radio-button--checked')).toHaveLength(1);
  });
});

/**
 * AUI additive surface — layout variants, indicator placement, checked paint
 * (AGENTS.md §43: behaviour first, class contracts only where the visual is
 * the behaviour).
 */
describe('SnRadio additive variants', () => {
  it('defaults to the historical leading marker with no card classes', () => {
    const wrapper = mount(SnRadio, { props: { checkedValue: 'a', label: 'A' } });
    expect(wrapper.classes()).toContain('sn-radio--variant-default');
    expect(wrapper.classes()).toContain('sn-radio--indicator-leading');
    expect(wrapper.find('.sn-radio__dot').exists()).toBe(true);
    expect(wrapper.find('.sn-radio__tick').exists()).toBe(false);
  });

  it('variant="card" puts the corner tick at top-right and drops the inline marker', () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: 'a', label: 'A', variant: 'card' },
    });
    expect(wrapper.classes()).toContain('sn-radio--variant-card');
    expect(wrapper.classes()).toContain('sn-radio--indicator-top-right');
    expect(wrapper.find('.sn-radio__dot').exists()).toBe(false);
    expect(wrapper.find('.sn-radio__tick--top-right').exists()).toBe(true);
  });

  it('card variant paints both border and fill when checked', () => {
    const checked = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: 'a', label: 'A', variant: 'card' },
    });
    expect(checked.classes()).toContain('sn-radio--checked-border');
    expect(checked.classes()).toContain('sn-radio--checked-fill');

    const unchecked = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: 'b', label: 'A', variant: 'card' },
    });
    expect(unchecked.classes()).not.toContain('sn-radio--checked-border');
    expect(unchecked.classes()).not.toContain('sn-radio--checked-fill');
    expect(unchecked.find('.sn-radio__tick').exists()).toBe(false);
  });

  it('checkedStyle selects border only / fill only', () => {
    const borderOnly = mount(SnRadio, {
      props: {
        checkedValue: 'a',
        modelValue: 'a',
        variant: 'card',
        checkedStyle: 'border',
      },
    });
    expect(borderOnly.classes()).toContain('sn-radio--checked-border');
    expect(borderOnly.classes()).not.toContain('sn-radio--checked-fill');

    const fillOnly = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: 'a', variant: 'card', checkedStyle: 'fill' },
    });
    expect(fillOnly.classes()).toContain('sn-radio--checked-fill');
    expect(fillOnly.classes()).not.toContain('sn-radio--checked-border');
  });

  it('indicatorPlacement="bottom-right" moves the tick to the bottom corner', () => {
    const wrapper = mount(SnRadio, {
      props: {
        checkedValue: 'a',
        modelValue: 'a',
        variant: 'card',
        indicatorPlacement: 'bottom-right',
      },
    });
    expect(wrapper.find('.sn-radio__tick--bottom-right').exists()).toBe(true);
    expect(wrapper.find('.sn-radio__tick--top-right').exists()).toBe(false);
  });

  it('indicatorPlacement="none" renders no marker and no tick', () => {
    const wrapper = mount(SnRadio, {
      props: {
        checkedValue: 'a',
        modelValue: 'a',
        variant: 'card',
        indicatorPlacement: 'none',
      },
    });
    expect(wrapper.find('.sn-radio__dot').exists()).toBe(false);
    expect(wrapper.find('.sn-radio__tick').exists()).toBe(false);
    expect(wrapper.classes()).toContain('sn-radio--checked-border');
  });

  it('indicatorPlacement="trailing" renders the inline marker after the label', () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', label: 'A', indicatorPlacement: 'trailing' },
    });
    const html = wrapper.html();
    const labelAt = html.indexOf('sn-radio__label');
    const dotAt = html.indexOf('sn-radio__dot');
    expect(labelAt).toBeGreaterThan(-1);
    expect(dotAt).toBeGreaterThan(labelAt);
  });

  it('renders the #card slot content instead of the default label row', () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: 'a', variant: 'card' },
      slots: { card: '<strong class="my-card">Plan A</strong>' },
    });
    expect(wrapper.find('.my-card').exists()).toBe(true);
    expect(wrapper.find('.sn-radio__label').exists()).toBe(false);
  });

  it('group variant cascades to children and a child prop overrides it', () => {
    const wrapper = mount(SnRadioGroup, {
      props: { modelValue: 'a', variant: 'card' },
      slots: {
        default: () => [
          h(SnRadio, { checkedValue: 'a', label: 'A' }),
          h(SnRadio, { checkedValue: 'b', label: 'B', variant: 'default' }),
        ],
      },
    });
    const radios = wrapper.findAll('.sn-radio');
    expect(radios[0].classes()).toContain('sn-radio--variant-card');
    expect(radios[1].classes()).toContain('sn-radio--variant-default');
  });
});

/** AUI additive — inverted marker + label-first ordering. */
describe('SnRadio inverted marker & label-first', () => {
  it('defaults to ring marker and marker-first label order', () => {
    const wrapper = mount(SnRadio, { props: { checkedValue: 'a', label: 'A' } });
    expect(wrapper.classes()).toContain('sn-radio--marker-base');
    expect(wrapper.classes()).toContain('sn-radio--label-marker-first');
  });

  it('markerShape="inverted" adds the inverted class on the marker', () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: 'a', label: 'A', markerShape: 'inverted' },
    });
    expect(wrapper.classes()).toContain('sn-radio--marker-inverted');
  });

  it('labelPlacement="label-first" re-orders without touching DOM order', () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', label: 'A', labelPlacement: 'label-first' },
    });
    expect(wrapper.classes()).toContain('sn-radio--label-label-first');
    // The native input must stay first for a11y + keyboard.
    expect(wrapper.element.firstElementChild?.tagName).toBe('INPUT');
  });

  it('group-level labelPlacement / markerShape cascade and child wins', () => {
    const wrapper = mount(SnRadioGroup, {
      props: { modelValue: 'a', labelPlacement: 'label-first', markerShape: 'inverted' },
      slots: {
        default: () => [
          h(SnRadio, { checkedValue: 'a', label: 'A' }),
          h(SnRadio, { checkedValue: 'b', label: 'B', markerShape: 'base' }),
        ],
      },
    });
    const radios = wrapper.findAll('.sn-radio');
    expect(radios[0].classes()).toContain('sn-radio--label-label-first');
    expect(radios[0].classes()).toContain('sn-radio--marker-inverted');
    expect(radios[1].classes()).toContain('sn-radio--marker-base');
  });
});
