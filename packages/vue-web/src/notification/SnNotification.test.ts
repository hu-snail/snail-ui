/**
 * SnNotification tests — AUI-WEB-FB-012.
 *
 * Reference: naive-ui `n-notification`. These tests pin the observable
 * contract that is easy to get subtly wrong:
 *   - the per-type built-in icon table (default type has no icon) and the
 *     icon colours' presence via the rendered <svg>, not the wrapper span;
 *   - `role="alert"` for warning/error vs `role="status"` for the rest;
 *   - the duration countdown: default 3000ms, `duration: 0` disables it,
 *     `keepAliveOnHover` (default true) pauses on hover and resumes with the
 *     remaining time, and the timer is cleared on unmount (§41).
 */

import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import SnNotification from './SnNotification.vue';
import { expectIconRendered, expectNoMissingIcons } from '../test-utils/icon-assertions';
import type { NotificationType } from './notification-types';

function mountCard(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return mount(SnNotification, { props, slots });
}

describe('SnNotification (AUI-WEB-FB-012)', () => {
  describe('rendering', () => {
    it('should render title, content, description and meta', () => {
      const wrapper = mountCard({
        title: '构建完成',
        content: '主包体积 1.2 MB',
        description: '比上次构建减少 80 KB',
        meta: '刚刚',
      });

      expect(wrapper.find('.sn-notification__header').text()).toBe('构建完成');
      expect(wrapper.find('.sn-notification__content').text()).toBe('主包体积 1.2 MB');
      expect(wrapper.find('.sn-notification__description').text()).toBe('比上次构建减少 80 KB');
      expect(wrapper.find('.sn-notification__meta').text()).toBe('刚刚');
    });

    it('should expose the data-snui-component hook and BEM class', () => {
      const root = mountCard().find('.sn-notification');
      expect(root.attributes('data-snui-component')).toBe('notification');
      expect(root.classes()).toContain('sn-notification');
    });

    it('should apply the type modifier class', () => {
      expect(mountCard({ type: 'error' }).find('.sn-notification').classes()).toContain(
        'sn-notification--error',
      );
    });

    it('should announce warning/error assertively and the rest politely', () => {
      expect(mountCard().find('.sn-notification').attributes('role')).toBe('status');
      expect(mountCard({ type: 'info' }).find('.sn-notification').attributes('role')).toBe(
        'status',
      );
      expect(mountCard({ type: 'success' }).find('.sn-notification').attributes('role')).toBe(
        'status',
      );
      expect(mountCard({ type: 'warning' }).find('.sn-notification').attributes('role')).toBe(
        'alert',
      );
      expect(mountCard({ type: 'error' }).find('.sn-notification').attributes('role')).toBe(
        'alert',
      );
    });

    it('should let slots replace title / content / avatar / footer', () => {
      const wrapper = mountCard(
        { title: 'prop 标题', content: 'prop 正文' },
        {
          header: () => '插槽标题',
          default: () => '插槽正文',
          avatar: () => h('span', { class: 'slot-avatar' }, 'A'),
          footer: () => h('button', { class: 'slot-footer' }, '撤销'),
        },
      );

      expect(wrapper.find('.sn-notification__header').text()).toBe('插槽标题');
      expect(wrapper.find('.sn-notification__content').text()).toBe('插槽正文');
      expect(wrapper.find('.sn-notification__avatar .slot-avatar').exists()).toBe(true);
      expect(wrapper.find('.sn-notification__footer .slot-footer').exists()).toBe(true);
    });

    it('should render avatar / footer passed as render-function props (API options)', () => {
      const wrapper = mountCard({
        avatar: () => h('span', { class: 'prop-avatar' }, '头'),
        footer: () => h('span', { class: 'prop-footer' }, '尾'),
      });

      expect(wrapper.find('.sn-notification__avatar .prop-avatar').exists()).toBe(true);
      expect(wrapper.find('.sn-notification__footer .prop-footer').exists()).toBe(true);
    });

    it('should hide optional sections that are not provided', () => {
      const wrapper = mountCard({ title: '只有标题' });

      expect(wrapper.find('.sn-notification__avatar').exists()).toBe(false);
      expect(wrapper.find('.sn-notification__description').exists()).toBe(false);
      expect(wrapper.find('.sn-notification__meta').exists()).toBe(false);
      expect(wrapper.find('.sn-notification__footer').exists()).toBe(false);
    });
  });

  describe('type icons', () => {
    it.each<[NotificationType]>([['info'], ['success'], ['warning'], ['error']])(
      'should render the built-in icon for type=%s',
      (type) => {
        const wrapper = mountCard({ type, title: 't' });

        expectIconRendered(wrapper, '.sn-notification__icon');
        expectNoMissingIcons(wrapper, `type=${type}`);
      },
    );

    it('should not render an icon column for type=default', () => {
      const wrapper = mountCard({ title: 't' });

      expect(wrapper.find('.sn-notification__icon').exists()).toBe(false);
      expectNoMissingIcons(wrapper);
    });
  });

  describe('close button', () => {
    it('should render by default (closable defaults to true)', () => {
      const close = mountCard().find('.sn-notification__close');

      expect(close.exists()).toBe(true);
      expect(close.attributes('aria-label')).toBe('关闭');
      expectIconRendered(close);
    });

    it('should be hidden when closable is false', () => {
      expect(mountCard({ closable: false }).find('.sn-notification__close').exists()).toBe(false);
    });

    it('should emit destroy on click', async () => {
      const wrapper = mountCard();
      await wrapper.find('.sn-notification__close').trigger('click');

      expect(wrapper.emitted('destroy')).toHaveLength(1);
    });
  });

  describe('duration countdown', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should emit destroy once the default duration (3000ms) expires', () => {
      const wrapper = mountCard();

      vi.advanceTimersByTime(2999);
      expect(wrapper.emitted('destroy')).toBeUndefined();

      vi.advanceTimersByTime(1);
      expect(wrapper.emitted('destroy')).toHaveLength(1);
    });

    it('should respect a custom duration', () => {
      const wrapper = mountCard({ duration: 50 });

      vi.advanceTimersByTime(50);
      expect(wrapper.emitted('destroy')).toHaveLength(1);
    });

    it('should never auto destroy when duration is 0', () => {
      const wrapper = mountCard({ duration: 0 });

      vi.advanceTimersByTime(60_000);
      expect(wrapper.emitted('destroy')).toBeUndefined();
    });

    it('should pause the countdown while hovered and resume with the remaining time (keepAliveOnHover default true)', () => {
      const wrapper = mountCard({ duration: 1000 });
      const root = wrapper.find('.sn-notification');

      vi.advanceTimersByTime(400);
      root.trigger('mouseenter');

      vi.advanceTimersByTime(5000);
      expect(wrapper.emitted('destroy')).toBeUndefined();

      root.trigger('mouseleave');
      vi.advanceTimersByTime(600);
      expect(wrapper.emitted('destroy')).toHaveLength(1);
    });

    it('should keep counting on hover when keepAliveOnHover is false', () => {
      const wrapper = mountCard({ duration: 1000, keepAliveOnHover: false });
      const root = wrapper.find('.sn-notification');

      vi.advanceTimersByTime(400);
      root.trigger('mouseenter');
      vi.advanceTimersByTime(600);

      expect(wrapper.emitted('destroy')).toHaveLength(1);
    });

    it('should clean up the timer on unmount', () => {
      const wrapper = mountCard({ duration: 1000 });

      vi.advanceTimersByTime(500);
      wrapper.unmount();
      vi.advanceTimersByTime(5000);

      expect(wrapper.emitted('destroy')).toBeUndefined();
    });
  });
});
