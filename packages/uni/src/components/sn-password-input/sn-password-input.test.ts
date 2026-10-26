/**
 * sn-password-input unit tests — uni-end boxed password field.
 *
 * Behaviour only (AGENTS.md §46): box count, masking, the caret position,
 * the input write path and the message precedence. No rpx numbers in
 * assertions.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
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
});
