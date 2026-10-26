/**
 * sn-password-input unit tests — uni-end boxed password field.
 *
 * Behaviour only (AGENTS.md §46): box count, masking, the caret position,
 * the input write path and the message precedence. No rpx numbers in
 * assertions.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, ref } from 'vue';
import SnPasswordInput from './sn-password-input.vue';

describe('sn-password-input', () => {
  describe('structure', () => {
    it('renders `length` boxes (6 by default)', () => {
      expect(mount(SnPasswordInput).findAll('.sn-password-input__box')).toHaveLength(6);
      expect(
        mount(SnPasswordInput, { props: { length: 4 } }).findAll('.sn-password-input__box'),
      ).toHaveLength(4);
    });

    it('renders one dot per typed character when mask is on', () => {
      const w = mount(SnPasswordInput, { props: { modelValue: '12' } });
      const chars = w.findAll('.sn-password-input__char');
      expect(chars).toHaveLength(2);
      expect(chars[0]?.text()).toBe('•');
    });

    it('renders the real characters when mask is off', () => {
      const w = mount(SnPasswordInput, { props: { modelValue: '12', mask: false } });
      expect(w.findAll('.sn-password-input__char').map((c) => c.text())).toEqual(['1', '2']);
    });

    it('clamps the rendered characters to `length`', () => {
      const w = mount(SnPasswordInput, { props: { modelValue: '12345678', length: 4 } });
      expect(w.findAll('.sn-password-input__char')).toHaveLength(4);
    });

    it('marks filled boxes', () => {
      const w = mount(SnPasswordInput, { props: { modelValue: '123' } });
      expect(w.findAll('.sn-password-input__box--filled')).toHaveLength(3);
    });
  });

  describe('focus + caret', () => {
    it('shows the caret in the first empty box while focused', () => {
      const w = mount(SnPasswordInput, { props: { modelValue: '12', focused: true } });
      expect(w.find('.sn-password-input__caret').exists()).toBe(true);
      const boxes = w.findAll('.sn-password-input__box');
      expect(boxes[2]?.classes()).toContain('sn-password-input__box--active');
    });

    it('hides the caret when not focused', () => {
      const w = mount(SnPasswordInput, { props: { modelValue: '12', focused: false } });
      expect(w.find('.sn-password-input__caret').exists()).toBe(false);
    });

    it('hides the caret when every box is filled', () => {
      const w = mount(SnPasswordInput, { props: { modelValue: '123456', length: 6 } });
      expect(w.find('.sn-password-input__caret').exists()).toBe(false);
    });

    it('emits focus and blur from the native input', async () => {
      const w = mount(SnPasswordInput);
      await w.find('.sn-password-input__native').trigger('focus');
      await w.find('.sn-password-input__native').trigger('blur');
      expect(w.emitted('focus')).toHaveLength(1);
      expect(w.emitted('blur')).toHaveLength(1);
    });
  });

  describe('input', () => {
    it('emits update:modelValue + change on typing', async () => {
      const w = mount(SnPasswordInput);
      await w.find('.sn-password-input__native').setValue('123');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['123']);
      expect(w.emitted('change')?.[0]).toEqual(['123']);
    });

    it('truncates typing past `length`', async () => {
      const w = mount(SnPasswordInput, { props: { length: 4 } });
      await w.find('.sn-password-input__native').setValue('123456');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['1234']);
    });
  });

  describe('messages', () => {
    it('renders the info text', () => {
      expect(
        mount(SnPasswordInput, { props: { info: 'helper' } })
          .find('.sn-password-input__message')
          .text(),
      ).toBe('helper');
    });

    it('lets errorInfo win over info', () => {
      const w = mount(SnPasswordInput, { props: { info: 'helper', errorInfo: 'bad' } });
      expect(w.find('.sn-password-input__message').text()).toBe('bad');
      expect(w.find('.sn-password-input__message').classes()).toContain(
        'sn-password-input__message--error',
      );
    });

    it('adds the error class to the boxes', () => {
      const w = mount(SnPasswordInput, { props: { errorInfo: 'bad' } });
      expect(w.classes()).toContain('sn-password-input--error');
      expect(w.findAll('.sn-password-input__box--error')).toHaveLength(6);
    });

    it('renders no message when both texts are empty', () => {
      expect(mount(SnPasswordInput).find('.sn-password-input__message').exists()).toBe(false);
    });
  });

  describe('gutter', () => {
    it('forwards a numeric gutter as a custom property', () => {
      const w = mount(SnPasswordInput, { props: { gutter: 8 } });
      expect(w.attributes('style')).toContain('--sn-password-input-gap:');
    });

    it('forwards a string gutter verbatim', () => {
      const w = mount(SnPasswordInput, { props: { gutter: '6px' } });
      expect(w.attributes('style')).toContain('--sn-password-input-gap: 6px');
    });
  });

  /* ── Extended coverage: bounds, a11y, v-model flow, forwarding ── */

  it('renders at least one box when length is 0', () => {
    expect(mount(SnPasswordInput, { props: { length: 0 } }).findAll('.sn-password-input__box')).toHaveLength(1);
  });

  it('shows the caret by default (focused defaults to true)', () => {
    expect(mount(SnPasswordInput).find('.sn-password-input__caret').exists()).toBe(true);
  });

  it('omits the gap custom property when gutter is 0', () => {
    const w = mount(SnPasswordInput);
    expect(w.attributes('style') ?? '').not.toContain('--sn-password-input-gap');
  });

  it('keeps the native input numeric with the box-count maxlength', () => {
    const w = mount(SnPasswordInput, { props: { length: 4 } });
    const input = w.find('.sn-password-input__native');
    expect(input.attributes('maxlength')).toBe('4');
    expect(input.attributes('inputmode')).toBe('numeric');
    expect(input.attributes('aria-label')).toBe('password');
  });

  it('labels the box group with the fill progress', () => {
    const w = mount(SnPasswordInput, { props: { modelValue: '12', length: 5 } });
    expect(w.find('.sn-password-input__boxes').attributes('aria-label')).toBe('password, 2 of 5');
  });

  it('labels each box with its digit position', () => {
    const w = mount(SnPasswordInput, { props: { length: 3 } });
    const boxes = w.findAll('.sn-password-input__box');
    expect(boxes[0]?.attributes('aria-label')).toBe('digit 1');
    expect(boxes[2]?.attributes('aria-label')).toBe('digit 3');
  });

  it('sits the caret in the first box while empty', () => {
    const w = mount(SnPasswordInput, { props: { modelValue: '' } });
    expect(w.findAll('.sn-password-input__box')[0]?.classes()).toContain(
      'sn-password-input__box--active',
    );
  });

  it('emits one update per keystroke and tracks the caret under v-model', async () => {
    const Host = {
      setup() {
        const model = ref('');
        return () =>
          h(SnPasswordInput, {
            modelValue: model.value,
            'onUpdate:modelValue': (v: string) => {
              model.value = v;
            },
          });
      },
    };
    const wrapper = mount(Host);
    const input = wrapper.find('.sn-password-input__native');
    await input.setValue('1');
    await input.setValue('12');
    await input.setValue('123');
    const emitted = wrapper.findComponent(SnPasswordInput).emitted('update:modelValue') ?? [];
    expect(emitted.map((e) => e[0])).toEqual(['1', '12', '123']);
    expect(wrapper.findAll('.sn-password-input__box--filled')).toHaveLength(3);
  });

  it('emits the truncated value in change as well', async () => {
    const w = mount(SnPasswordInput, { props: { length: 2 } });
    await w.find('.sn-password-input__native').setValue('987');
    expect(w.emitted('change')?.[0]).toEqual(['98']);
  });

  it('clamps the masked rendering of an overlong model value', () => {
    const w = mount(SnPasswordInput, { props: { modelValue: '1234567890', length: 4 } });
    expect(w.findAll('.sn-password-input__char').map((c) => c.text())).toEqual([
      '•',
      '•',
      '•',
      '•',
    ]);
    // the native input still shows the bound value; clamping happens on input
    expect((w.find('.sn-password-input__native').element as HTMLInputElement).value).toBe(
      '1234567890',
    );
  });

  it('merges customStyle after the gap variable and applies customClass', () => {
    const w = mount(SnPasswordInput, {
      props: { gutter: '4px', customStyle: 'margin: 4px;', customClass: 'my-pin' },
    });
    const style = w.attributes('style') ?? '';
    expect(style).toContain('--sn-password-input-gap: 4px');
    expect(style).toContain('margin: 4px');
    expect(w.classes()).toContain('my-pin');
  });

  it('marks the wrapper data component', () => {
    expect(mount(SnPasswordInput).attributes('data-snui-component')).toBe('password-input');
  });

  /* Untestable in happy-dom: the soft-keyboard linkage (`focused` ↔ sn-keyboard
   * visible) and the hidden native input's real focus behavior — `:focus` maps
   * to the HTMLElement.focus DOM slot in plain Vue, so no attribute or focus
   * change is observable here. The focus/blur re-emit path is covered above. */
});
