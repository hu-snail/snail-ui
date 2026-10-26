/**
 * sn-tag unit tests — uni-end compact label (AUI-MP-DS-001).
 *
 * Covers every non-trivial prop from the reference surface: size / type /
 * variant / round / mark / closable / dynamic / icon / color / bgColor /
 * customClass / customStyle, plus the three events and the slot set.
 *
 * Assertions stay on classes / attributes / emitted events — happy-dom drops
 * CSS lengths it cannot parse, so `rpx` values are never asserted.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnTag from './sn-tag.vue';
import { clearSnIcons, registerSnIcons } from '../sn-icon/sn-icon-registry';
import { Check } from '../sn-icon/sn-icon-set';

describe('sn-tag', () => {
  describe('rendering', () => {
    it('renders default slot content with the base classes', () => {
      const w = mount(SnTag, { slots: { default: '标签' } });
      expect(w.text()).toContain('标签');
      expect(w.classes()).toContain('sn-tag');
      expect(w.classes()).toContain('sn-tag--default');
      expect(w.classes()).toContain('sn-tag--size-default');
    });

    it('applies the size class for each preset', () => {
      for (const size of ['small', 'medium', 'large', 'extra-large', 'default'] as const) {
        const w = mount(SnTag, { props: { size } });
        expect(w.classes()).toContain(`sn-tag--size-${size}`);
      }
    });

    it('applies the type class for each semantic colour', () => {
      const types = [
        'default',
        'primary',
        'success',
        'warning',
        'danger',
        'volcano',
        'lightblue',
        'cyan',
        'pink',
        'purple',
      ] as const;
      for (const type of types) {
        const w = mount(SnTag, { props: { type } });
        expect(w.classes()).toContain(`sn-tag--${type}`);
      }
    });

    it('applies the variant class for each of the five variants', () => {
      for (const variant of ['light', 'dark', 'plain', 'dashed', 'text'] as const) {
        const w = mount(SnTag, { props: { variant } });
        expect(w.classes()).toContain(`sn-tag--variant-${variant}`);
      }
    });

    it('defaults to the dark variant', () => {
      const w = mount(SnTag);
      expect(w.classes()).toContain('sn-tag--variant-dark');
    });

    it('adds round / mark classes when requested', () => {
      const w = mount(SnTag, { props: { round: true, mark: true } });
      expect(w.classes()).toContain('sn-tag--round');
      expect(w.classes()).toContain('sn-tag--mark');
    });

    it('forwards customClass and customStyle to the root node', () => {
      const w = mount(SnTag, { props: { customClass: 'my-tag', customStyle: 'margin: 4px' } });
      expect(w.classes()).toContain('my-tag');
      expect(w.attributes('style')).toContain('margin: 4px');
    });

    it('forwards color and bgColor as inline overrides', () => {
      const w = mount(SnTag, { props: { color: '#123456', bgColor: '#abcdef' } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('color: #123456');
      expect(style).toContain('background-color: #abcdef');
      expect(style).toContain('border-color: #abcdef');
    });
  });

  describe('events', () => {
    it('emits click when tapped', async () => {
      const w = mount(SnTag, { slots: { default: 'x' } });
      await w.trigger('tap');
      expect(w.emitted('click')).toHaveLength(1);
    });

    it('renders no close button by default', () => {
      const w = mount(SnTag);
      expect(w.find('.sn-tag__close').exists()).toBe(false);
    });

    it('emits close when the close button is tapped', async () => {
      const w = mount(SnTag, { props: { closable: true } });
      await w.find('.sn-tag__close').trigger('tap');
      expect(w.emitted('close')).toHaveLength(1);
    });

    it('does not bubble the close tap into the root click handler', async () => {
      const w = mount(SnTag, { props: { closable: true } });
      await w.find('.sn-tag__close').trigger('tap');
      expect(w.emitted('click')).toBeUndefined();
    });

    it('emits confirm with the typed value in dynamic mode', async () => {
      const w = mount(SnTag, { props: { dynamic: true } });
      const input = w.find('.sn-tag__input');
      expect(input.exists()).toBe(true);
      await input.setValue('新标签');
      await input.trigger('confirm');
      expect(w.emitted('confirm')?.[0]).toEqual([{ value: '新标签' }]);
    });
  });

  describe('icon', () => {
    it('renders no icon when the name is unregistered', () => {
      clearSnIcons();
      const w = mount(SnTag, { props: { icon: 'nope' } });
      expect(w.find('.sn-tag__icon').exists()).toBe(false);
    });

    it('resolves the icon through the registry', () => {
      registerSnIcons({ Check });
      const w = mount(SnTag, { props: { icon: 'Check' } });
      expect(w.find('.sn-tag__icon').exists()).toBe(true);
      clearSnIcons();
    });

    it('renders an iconfont class when cssIcon is enabled', () => {
      const w = mount(SnTag, { props: { icon: 'star', iconPrefix: 'wd-icon', cssIcon: true } });
      expect(w.find('.wd-icon-star').exists()).toBe(true);
    });

    it('uses a string cssIcon value as the prefix', () => {
      const w = mount(SnTag, { props: { icon: 'star', cssIcon: 'my-icon' } });
      expect(w.find('.my-icon-star').exists()).toBe(true);
    });
  });

  describe('dynamic mode', () => {
    it('renders the add slot instead of the default slot', () => {
      const w = mount(SnTag, {
        props: { dynamic: true },
        slots: { default: 'body', add: 'add-slot' },
      });
      expect(w.find('.sn-tag__input').exists()).toBe(true);
      expect(w.text()).toContain('add-slot');
      expect(w.text()).not.toContain('body');
    });

    it('emits confirm with an empty value when confirmed without typing', async () => {
      const w = mount(SnTag, { props: { dynamic: true } });
      await w.find('.sn-tag__input').trigger('confirm');
      expect(w.emitted('confirm')?.[0]).toEqual([{ value: '' }]);
    });

    it('emits one confirm per interaction, preserving typed order', async () => {
      const w = mount(SnTag, { props: { dynamic: true } });
      const input = w.find('.sn-tag__input');
      await input.setValue('a');
      await input.trigger('confirm');
      await input.setValue('b');
      await input.trigger('confirm');
      expect(w.emitted('confirm')).toEqual([[{ value: 'a' }], [{ value: 'b' }]]);
    });

    it('renders input and close button together in dynamic + closable mode', () => {
      const w = mount(SnTag, { props: { dynamic: true, closable: true } });
      expect(w.find('.sn-tag__input').exists()).toBe(true);
      expect(w.find('.sn-tag__close').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('exposes the root as an interactive button element', () => {
      const w = mount(SnTag);
      expect(w.attributes('role')).toBe('button');
      expect(w.attributes('data-snui-component')).toBe('tag');
    });

    it('labels the close button for assistive tech', () => {
      const w = mount(SnTag, { props: { closable: true } });
      const close = w.find('.sn-tag__close');
      expect(close.attributes('role')).toBe('button');
      expect(close.attributes('aria-label')).toBe('Close');
    });

    it('hides the css font icon from assistive tech', () => {
      const w = mount(SnTag, { props: { icon: 'star', cssIcon: true } });
      expect(w.find('.sn-tag__icon').attributes('aria-hidden')).toBe('true');
    });
  });

  describe('slots', () => {
    it('renders the icon slot over the resolved icon prop', () => {
      registerSnIcons({ Check });
      const w = mount(SnTag, {
        props: { icon: 'Check' },
        slots: { icon: '<text class="custom-icon">I</text>' },
      });
      expect(w.find('.custom-icon').exists()).toBe(true);
      expect(w.find('.sn-tag__icon').exists()).toBe(false);
      clearSnIcons();
    });

    it('renders default slot content alongside closable', () => {
      const w = mount(SnTag, { props: { closable: true }, slots: { default: 'label' } });
      expect(w.text()).toContain('label');
      expect(w.find('.sn-tag__close').exists()).toBe(true);
    });
  });

  describe('css icon fallbacks', () => {
    it('falls back to the bare icon name when cssIcon is on but no prefix exists', () => {
      const w = mount(SnTag, { props: { icon: 'star', cssIcon: true } });
      expect(w.find('.star').exists()).toBe(true);
    });

    it('renders no icon element when cssIcon is enabled without an icon name', () => {
      const w = mount(SnTag, { props: { cssIcon: true } });
      expect(w.find('.sn-tag__icon').exists()).toBe(false);
    });
  });

  describe('inline style overrides', () => {
    it('leaves the root style attribute unset without color overrides', () => {
      const w = mount(SnTag);
      expect(w.attributes('style')).toBeUndefined();
    });
  });
});
