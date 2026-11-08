/**
 * sn-backtop unit tests — uni-end back-to-top button.
 *
 * Behaviour only (AGENTS.md §46): the scrollTop threshold, the tap → emit /
 * pageScrollTo contract, the shape / size / theme variants and the
 * accessibility wiring. No rpx numbers in assertions — happy-dom discards
 * lengths it cannot parse; icon tier sizes are asserted on the forwarded
 * SnIcon prop, before the DOM style layer.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnBacktop from './sn-backtop.vue';

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni;
});

describe('sn-backtop', () => {
  describe('visibility', () => {
    it('is hidden below the threshold', () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 100, top: 300 } });
      expect(wrapper.classes()).not.toContain('sn-backtop--visible');
      expect(wrapper.attributes('aria-hidden')).toBe('true');
    });

    it('is visible at the threshold', () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 300, top: 300 } });
      expect(wrapper.classes()).toContain('sn-backtop--visible');
      expect(wrapper.attributes('aria-hidden')).toBe('false');
    });

    it('is visible past the threshold', () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 900, top: 300 } });
      expect(wrapper.classes()).toContain('sn-backtop--visible');
    });

    it('uses a 300px default threshold', () => {
      expect(mount(SnBacktop, { props: { scrollTop: 299 } }).classes()).not.toContain(
        'sn-backtop--visible',
      );
      expect(mount(SnBacktop, { props: { scrollTop: 300 } }).classes()).toContain(
        'sn-backtop--visible',
      );
    });

    it('does not emit a tap while hidden', async () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 0 } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toBeUndefined();
    });
  });

  describe('tap', () => {
    it('emits click when visible', async () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500 } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('calls the host pageScrollTo when present', async () => {
      const pageScrollTo = vi.fn();
      (globalThis as { uni?: unknown }).uni = { pageScrollTo };
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500, duration: 250 } });
      await wrapper.trigger('tap');
      expect(pageScrollTo).toHaveBeenCalledWith({ scrollTop: 0, duration: 250 });
    });

    it('does not throw when the host has no pageScrollTo', async () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500 } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('survives a host that rejects pageScrollTo', async () => {
      (globalThis as { uni?: unknown }).uni = {
        pageScrollTo: () => {
          throw new Error('unsupported');
        },
      };
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500 } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });
  });

  describe('appearance', () => {
    it('defaults to the circle shape', () => {
      expect(mount(SnBacktop).classes()).toContain('sn-backtop--circle');
    });

    it('applies the square shape', () => {
      expect(mount(SnBacktop, { props: { shape: 'square' } }).classes()).toContain(
        'sn-backtop--square',
      );
    });

    it('writes bottom / right / z-index inline as px', () => {
      const wrapper = mount(SnBacktop, { props: { bottom: 60, right: 24, zIndex: 99 } });
      const style = wrapper.attributes('style');
      expect(style).toContain('bottom: 60px');
      expect(style).toContain('right: 24px');
      expect(style).toContain('z-index: 99');
    });

    it('renders the text label', () => {
      const wrapper = mount(SnBacktop, { props: { text: 'Top' } });
      expect(wrapper.find('.sn-backtop__text').text()).toBe('Top');
    });

    it('renders the default arrow icon', () => {
      expect(mount(SnBacktop).find('.sn-backtop__icon').exists()).toBe(true);
    });

    it('applies iconStyle on top of the upward rotation', () => {
      const wrapper = mount(SnBacktop, { props: { iconStyle: 'color: rgb(1, 2, 3)' } });
      const style = wrapper.find('.sn-backtop__icon').attributes('style');
      expect(style).toContain('rotate(-90deg)');
      expect(style).toContain('color: rgb(1, 2, 3)');
    });

    it('forwards customClass and customStyle', () => {
      const wrapper = mount(SnBacktop, {
        props: { customClass: 'my-backtop', customStyle: 'margin: 4px;' },
      });
      expect(wrapper.classes()).toContain('my-backtop');
      expect(wrapper.attributes('style')).toContain('margin: 4px');
    });
  });

  describe('size tiers', () => {
    it('defaults to the medium tier with the medium icon token', () => {
      const wrapper = mount(SnBacktop);
      expect(wrapper.classes()).toContain('sn-backtop--size-medium');
      expect(wrapper.findComponent({ name: 'SnIcon' }).props('size')).toBe(
        'var(--sn-mp-icon-size-medium)',
      );
    });

    it('scales the icon token down on the small tier', () => {
      const wrapper = mount(SnBacktop, { props: { size: 'small' } });
      expect(wrapper.classes()).toContain('sn-backtop--size-small');
      expect(wrapper.findComponent({ name: 'SnIcon' }).props('size')).toBe(
        'var(--sn-mp-icon-size-small)',
      );
    });

    it('scales the icon token up on the large tier', () => {
      const wrapper = mount(SnBacktop, { props: { size: 'large' } });
      expect(wrapper.classes()).toContain('sn-backtop--size-large');
      expect(wrapper.findComponent({ name: 'SnIcon' }).props('size')).toBe(
        'var(--sn-mp-icon-size-large)',
      );
    });
  });

  describe('theme', () => {
    it('defaults to the neutral surface theme', () => {
      expect(mount(SnBacktop).classes()).toContain('sn-backtop--theme-default');
    });

    it.each(['primary', 'success', 'warning', 'danger', 'info'] as const)(
      'applies the %s theme class',
      (theme) => {
        expect(mount(SnBacktop, { props: { theme } }).classes()).toContain(
          `sn-backtop--theme-${theme}`,
        );
      },
    );

    it('combines theme with shape and size classes', () => {
      const wrapper = mount(SnBacktop, {
        props: { theme: 'danger', shape: 'square', size: 'large' },
      });
      expect(wrapper.classes()).toEqual(
        expect.arrayContaining([
          'sn-backtop--theme-danger',
          'sn-backtop--square',
          'sn-backtop--size-large',
        ]),
      );
    });
  });

  describe('label overflow guard', () => {
    it('keeps a long label intact for a11y while the CSS box clips it', async () => {
      const label = '一个特别特别特别长的回到顶部文案';
      const wrapper = mount(SnBacktop, { props: { text: label, scrollTop: 500 } });
      expect(wrapper.find('.sn-backtop__text').text()).toBe(label);
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });
  });

  describe('slots / accessibility', () => {
    it('renders the default slot instead of the built-in content', () => {
      const wrapper = mount(SnBacktop, { slots: { default: '<text class="custom">Up</text>' } });
      expect(wrapper.find('.custom').text()).toBe('Up');
      expect(wrapper.find('.sn-backtop__icon').exists()).toBe(false);
    });

    it('exposes role="button" and a default aria-label', () => {
      const wrapper = mount(SnBacktop);
      expect(wrapper.attributes('role')).toBe('button');
      expect(wrapper.attributes('aria-label')).toBe('Back to top');
    });

    it('uses the text prop as the accessible name', () => {
      expect(mount(SnBacktop, { props: { text: '顶部' } }).attributes('aria-label')).toBe('顶部');
    });
  });

  describe('threshold dynamics', () => {
    it('flips visibility when the host scrollTop crosses the threshold', async () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 0, top: 300 } });
      expect(wrapper.classes()).not.toContain('sn-backtop--visible');
      await wrapper.setProps({ scrollTop: 600 });
      expect(wrapper.classes()).toContain('sn-backtop--visible');
      expect(wrapper.attributes('aria-hidden')).toBe('false');
      await wrapper.setProps({ scrollTop: 10 });
      expect(wrapper.classes()).not.toContain('sn-backtop--visible');
      expect(wrapper.attributes('aria-hidden')).toBe('true');
    });

    it('ignores a tap after scrolling back above the threshold', async () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500, top: 300 } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
      await wrapper.setProps({ scrollTop: 50 });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('passes the default 100ms duration to pageScrollTo', async () => {
      const pageScrollTo = vi.fn();
      (globalThis as { uni?: unknown }).uni = { pageScrollTo };
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500 } });
      await wrapper.trigger('tap');
      expect(pageScrollTo).toHaveBeenCalledWith({ scrollTop: 0, duration: 100 });
    });

    it('keeps the upward rotation on the default icon', () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500 } });
      expect(wrapper.find('.sn-backtop__icon').attributes('style')).toContain('rotate(-90deg)');
    });
  });

  describe('press feedback (hover-class)', () => {
    it('wires the pressed class while visible', () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500 } });
      expect(wrapper.attributes('hover-class')).toBe('sn-backtop--pressed');
    });

    it('stays inert while hidden', () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 0 } });
      expect(wrapper.attributes('hover-class')).toBe('none');
    });
  });
});
