/**
 * sn-avatar unit tests — uni-end image / text / icon avatar (AUI-MP-DS-003).
 *
 * Covers the reference surface: src / text / icon / iconPrefix / cssIcon /
 * size / shape / bgColor / color / alt / mode / customClass / customStyle,
 * plus the click / error events and the documented fallback chain.
 *
 * Assertions stay on classes / attributes / text — happy-dom drops CSS lengths
 * it cannot parse, so `rpx` values are never asserted.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnAvatar from './sn-avatar.vue';
import { clearSnIcons, registerSnIcons } from '../sn-icon/sn-icon-registry';
import { User } from '../sn-icon/sn-icon-set';

describe('sn-avatar', () => {
  describe('content layers', () => {
    it('renders an image when src is given', () => {
      const w = mount(SnAvatar, { props: { src: '/static/a.png' } });
      const img = w.find('.sn-avatar__image');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('/static/a.png');
    });

    it('forwards mode to the image element', () => {
      const w = mount(SnAvatar, { props: { src: '/a.png', mode: 'aspectFit' } });
      expect(w.find('.sn-avatar__image').attributes('mode')).toBe('aspectFit');
    });

    it('defaults the image mode to aspectFill', () => {
      const w = mount(SnAvatar, { props: { src: '/a.png' } });
      expect(w.find('.sn-avatar__image').attributes('mode')).toBe('aspectFill');
    });

    it('renders text when there is no src', () => {
      const w = mount(SnAvatar, { props: { text: 'AU' } });
      expect(w.find('.sn-avatar__text').text()).toBe('AU');
      expect(w.find('.sn-avatar__image').exists()).toBe(false);
    });

    it('renders a registry icon when there is no src or text', () => {
      registerSnIcons({ User });
      const w = mount(SnAvatar, { props: { icon: 'User' } });
      expect(w.find('.sn-avatar__icon').exists()).toBe(true);
      clearSnIcons();
    });

    it('renders an iconfont class when cssIcon is enabled', () => {
      const w = mount(SnAvatar, { props: { icon: 'user', iconPrefix: 'wd-icon', cssIcon: true } });
      expect(w.find('.wd-icon-user').exists()).toBe(true);
    });

    it('prefers the default slot over every built-in layer', () => {
      const w = mount(SnAvatar, { props: { text: 'AU' }, slots: { default: 'custom' } });
      expect(w.text()).toContain('custom');
      expect(w.find('.sn-avatar__text').exists()).toBe(false);
    });
  });

  describe('fallback', () => {
    it('degrades to the alt text when the image fails', async () => {
      const w = mount(SnAvatar, { props: { src: '/broken.png', alt: 'B' } });
      await w.find('.sn-avatar__image').trigger('error');
      expect(w.find('.sn-avatar__image').exists()).toBe(false);
      expect(w.find('.sn-avatar__text').text()).toBe('B');
    });

    it('degrades to text when the image fails and no alt is set', async () => {
      const w = mount(SnAvatar, { props: { src: '/broken.png', text: 'AU' } });
      await w.find('.sn-avatar__image').trigger('error');
      expect(w.find('.sn-avatar__text').text()).toBe('AU');
    });

    it('emits error when the image fails to load', async () => {
      const w = mount(SnAvatar, { props: { src: '/broken.png' } });
      await w.find('.sn-avatar__image').trigger('error');
      expect(w.emitted('error')).toHaveLength(1);
    });

    it('retries the image after src changes', async () => {
      const w = mount(SnAvatar, { props: { src: '/broken.png', alt: 'B' } });
      await w.find('.sn-avatar__image').trigger('error');
      expect(w.find('.sn-avatar__image').exists()).toBe(false);
      await w.setProps({ src: '/good.png' });
      expect(w.find('.sn-avatar__image').exists()).toBe(true);
    });
  });

  describe('shape and size', () => {
    it('defaults to the round shape', () => {
      const w = mount(SnAvatar, { props: { text: 'A' } });
      expect(w.classes()).toContain('sn-avatar--round');
    });

    it('applies the square shape class', () => {
      const w = mount(SnAvatar, { props: { text: 'A', shape: 'square' } });
      expect(w.classes()).toContain('sn-avatar--square');
    });

    it('maps a named size preset to a size class', () => {
      for (const size of ['small', 'medium', 'normal', 'large'] as const) {
        const w = mount(SnAvatar, { props: { text: 'A', size } });
        expect(w.classes()).toContain(`sn-avatar--size-${size}`);
      }
    });

    it('adds no size class for a custom size', () => {
      const w = mount(SnAvatar, { props: { text: 'A', size: '20%' } });
      expect(w.classes().some((c) => c.startsWith('sn-avatar--size-'))).toBe(false);
    });

    it('reads a numeric size as px', () => {
      const w = mount(SnAvatar, { props: { text: 'A', size: 40 } });
      expect(w.attributes('style')).toContain('width: 40px');
    });

    it('forwards a custom unit string verbatim', () => {
      const w = mount(SnAvatar, { props: { text: 'A', size: '20%' } });
      expect(w.attributes('style')).toContain('width: 20%');
    });
  });

  describe('colors and passthrough', () => {
    it('forwards bgColor and color as inline overrides', () => {
      const w = mount(SnAvatar, { props: { text: 'A', bgColor: '#123456', color: '#abcdef' } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('background-color: #123456');
      expect(style).toContain('color: #abcdef');
    });

    it('forwards customClass and customStyle to the root node', () => {
      const w = mount(SnAvatar, {
        props: { text: 'A', customClass: 'my-avatar', customStyle: 'margin: 4px' },
      });
      expect(w.classes()).toContain('my-avatar');
      expect(w.attributes('style')).toContain('margin: 4px');
    });
  });

  describe('accessibility and events', () => {
    it('exposes the label through aria-label', () => {
      const w = mount(SnAvatar, { props: { text: 'AU' } });
      expect(w.attributes('role')).toBe('img');
      expect(w.attributes('aria-label')).toBe('AU');
    });

    it('falls back to alt for the accessible name while the image loads', () => {
      const w = mount(SnAvatar, { props: { src: '/a.png', alt: 'Avatar B' } });
      expect(w.attributes('aria-label')).toBe('Avatar B');
    });

    it('emits click when tapped', async () => {
      const w = mount(SnAvatar, { props: { text: 'A' } });
      await w.trigger('tap');
      expect(w.emitted('click')).toHaveLength(1);
    });

    it('emits the error event object', async () => {
      const w = mount(SnAvatar, { props: { src: '/broken.png' } });
      await w.find('.sn-avatar__image').trigger('error');
      const payload = w.emitted('error')?.[0]?.[0];
      expect(payload).toBeInstanceOf(Event);
    });
  });

  describe('remaining fallbacks', () => {
    it('prefers text over the icon when both are given', () => {
      registerSnIcons({ User });
      const w = mount(SnAvatar, { props: { text: 'AU', icon: 'User' } });
      expect(w.find('.sn-avatar__text').text()).toBe('AU');
      expect(w.find('.sn-avatar__icon').exists()).toBe(false);
      clearSnIcons();
    });

    it('degrades the failed image to the icon', async () => {
      registerSnIcons({ User });
      const w = mount(SnAvatar, { props: { src: '/broken.png', icon: 'User' } });
      await w.find('.sn-avatar__image').trigger('error');
      expect(w.find('.sn-avatar__image').exists()).toBe(false);
      expect(w.find('.sn-avatar__icon').exists()).toBe(true);
      clearSnIcons();
    });

    it('renders an empty avatar when nothing resolves', () => {
      const w = mount(SnAvatar, { props: { icon: 'never-registered' } });
      expect(w.find('.sn-avatar__image').exists()).toBe(false);
      expect(w.find('.sn-avatar__text').exists()).toBe(false);
      expect(w.find('.sn-avatar__icon').exists()).toBe(false);
      expect(w.find('svg').exists()).toBe(false);
    });

    it('shrinks the icon on the small preset', () => {
      registerSnIcons({ User });
      const small = mount(SnAvatar, { props: { icon: 'User', size: 'small' } });
      expect(small.find('.sn-avatar__icon').attributes('style')).toContain('width: 24px');

      const normal = mount(SnAvatar, { props: { icon: 'User', size: 'normal' } });
      expect(normal.find('.sn-avatar__icon').attributes('style')).toContain('width: 32px');
      clearSnIcons();
    });

    it('treats a cssIcon string as the class prefix', () => {
      const w = mount(SnAvatar, { props: { icon: 'user', cssIcon: 'icon' } });
      expect(w.find('.sn-avatar__icon').classes()).toContain('icon-user');
    });

    it('keeps the aria role even when empty', () => {
      const w = mount(SnAvatar, { props: { icon: 'never-registered' } });
      expect(w.attributes('role')).toBe('img');
      expect(w.attributes('aria-label')).toBeUndefined();
    });
  });
});
