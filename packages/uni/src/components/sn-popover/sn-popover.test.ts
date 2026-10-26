/**
 * sn-popover unit tests — uni-end tap-triggered bubble (wd-popover parity).
 *
 * Behaviour only (AGENTS.md §46):
 *   - the trigger toggles the bubble; `open` / `close` / `change` fire
 *   - `normal` mode renders the text body, `menu` mode renders rows
 *   - a row tap emits `menuclick` with `{ item, index }`; disabled rows are inert
 *   - `content` slot replaces the built-in body in both modes
 *   - `placement` / `offset` / `custom*` props are forwarded
 *   - the leave timer is cleared on unmount (§41)
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import SnPopover from './sn-popover.vue';

const menu = [{ content: '编辑' }, { content: '分享' }, { content: '删除', disabled: true }];

describe('sn-popover', () => {
  describe('structure', () => {
    it('renders the trigger slot and no bubble while closed', () => {
      const w = mount(SnPopover, { slots: { default: '<text>更多</text>' } });
      expect(w.text()).toContain('更多');
      expect(w.find('.sn-popover__pop').exists()).toBe(false);
    });

    it('renders the normal-mode text body', () => {
      const w = mount(SnPopover, { props: { modelValue: true, content: '气泡内容' } });
      expect(w.find('.sn-popover__text').text()).toBe('气泡内容');
      expect(w.find('.sn-popover__menu').exists()).toBe(false);
    });

    it('renders one row per menu item in menu mode', () => {
      const w = mount(SnPopover, {
        props: { modelValue: true, mode: 'menu', content: menu },
      });
      expect(w.findAll('.sn-popover__menu-item')).toHaveLength(3);
      expect(w.findAll('.sn-popover__menu-text')[0]!.text()).toBe('编辑');
      expect(w.find('.sn-popover__body').exists()).toBe(false);
    });

    it('does not render menu rows when the mode is menu but content is a string', () => {
      const w = mount(SnPopover, { props: { modelValue: true, mode: 'menu', content: '文本' } });
      expect(w.findAll('.sn-popover__menu-item')).toHaveLength(0);
    });

    it('lets the content slot replace the built-in body', () => {
      const w = mount(SnPopover, {
        props: { modelValue: true, content: 'prop 文案' },
        slots: { content: '<text class="custom-body">slot 文案</text>' },
      });
      expect(w.find('.custom-body').exists()).toBe(true);
      expect(w.find('.sn-popover__text').exists()).toBe(false);
    });

    it('applies the placement and mode classes', () => {
      const w = mount(SnPopover, { props: { placement: 'right-end', mode: 'menu' } });
      expect(w.classes()).toContain('sn-popover--right-end');
      expect(w.classes()).toContain('sn-popover--menu');
    });

    it('forwards customClass / customPop / customArrow / customStyle', () => {
      const w = mount(SnPopover, {
        props: {
          modelValue: true,
          customClass: 'my-popover',
          customPop: 'my-pop',
          customArrow: 'my-arrow',
          customStyle: 'margin: 4px',
        },
      });
      expect(w.classes()).toContain('my-popover');
      expect(w.find('.sn-popover__pop').classes()).toContain('my-pop');
      expect(w.find('.sn-popover__arrow').classes()).toContain('my-arrow');
      expect(w.attributes('style') ?? '').toContain('margin: 4px');
    });

    it('publishes the offset as a CSS variable pair', () => {
      const w = mount(SnPopover, { props: { offset: { x: 5, y: 1 } } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-popover-offset-x: 5px');
      expect(style).toContain('--sn-popover-offset-y: 1px');
    });
  });

  describe('arrow', () => {
    it('renders the arrow by default and hides it when visibleArrow is false', () => {
      expect(
        mount(SnPopover, { props: { modelValue: true } })
          .find('.sn-popover__arrow')
          .exists(),
      ).toBe(true);
      expect(
        mount(SnPopover, { props: { modelValue: true, visibleArrow: false } })
          .find('.sn-popover__arrow')
          .exists(),
      ).toBe(false);
    });
  });

  describe('interaction', () => {
    it('emits update:modelValue and open when the trigger is tapped', async () => {
      const w = mount(SnPopover, { props: { modelValue: false } });
      await w.find('.sn-popover__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
      await flushPromises();
      expect(w.emitted('open')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: true }]);
      expect(w.find('.sn-popover__pop').exists()).toBe(true);
    });

    it('shows the bubble even when the consumer ignores update:modelValue', async () => {
      const w = mount(SnPopover, { props: { modelValue: false } });
      await w.find('.sn-popover__trigger').trigger('tap');
      await flushPromises();
      expect(w.find('.sn-popover__pop').exists()).toBe(true);
      expect(w.classes()).toContain('sn-popover--shown');
    });

    it('closes on a second tap', async () => {
      const w = mount(SnPopover, { props: { modelValue: true } });
      await w.find('.sn-popover__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
    });

    it('ignores the trigger tap while disabled', async () => {
      const w = mount(SnPopover, { props: { modelValue: false, disabled: true } });
      await w.find('.sn-popover__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.find('.sn-popover__pop').exists()).toBe(false);
      expect(w.find('.sn-popover__trigger').attributes('aria-disabled')).toBe('true');
    });

    it('emits menuclick with the item and index', async () => {
      const w = mount(SnPopover, { props: { modelValue: true, mode: 'menu', content: menu } });
      await w.findAll('.sn-popover__menu-item')[1]!.trigger('tap');
      expect(w.emitted('menuclick')?.[0]).toEqual([{ item: menu[1], index: 1 }]);
    });

    it('ignores taps on a disabled menu row', async () => {
      const w = mount(SnPopover, { props: { modelValue: true, mode: 'menu', content: menu } });
      const row = w.findAll('.sn-popover__menu-item')[2]!;
      await row.trigger('tap');
      expect(w.emitted('menuclick')).toBeUndefined();
      expect(row.attributes('aria-disabled')).toBe('true');
    });

    it('renders a close button that hides the bubble', async () => {
      const w = mount(SnPopover, { props: { modelValue: true, showClose: true } });
      await w.find('.sn-popover__close').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('exposes an imperative open / close pair', async () => {
      const w = mount(SnPopover, { props: { modelValue: false } });
      const vm = w.vm as unknown as { open(): void; close(): void };
      vm.open();
      await flushPromises();
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
      vm.close();
      expect(w.emitted('update:modelValue')?.[1]).toEqual([false]);
    });
  });

  describe('timers', () => {
    it('keeps the bubble mounted for the fade-out leg', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnPopover, { props: { modelValue: true } });
        await w.setProps({ modelValue: false });
        expect(w.find('.sn-popover__pop').exists()).toBe(true);
        vi.advanceTimersByTime(150);
        await w.vm.$nextTick();
        expect(w.find('.sn-popover__pop').exists()).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('clears the pending leave timer on unmount (no leak)', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnPopover, { props: { modelValue: true } });
        await w.setProps({ modelValue: false });
        w.unmount();
        expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('accessibility', () => {
    it('marks the trigger as an expanded button', async () => {
      const w = mount(SnPopover, { props: { modelValue: false } });
      expect(w.find('.sn-popover__trigger').attributes('role')).toBe('button');
      expect(w.find('.sn-popover__trigger').attributes('aria-expanded')).toBe('false');
      await w.setProps({ modelValue: true });
      await flushPromises();
      expect(w.find('.sn-popover__trigger').attributes('aria-expanded')).toBe('true');
    });

    it('gives the bubble a dialog role and the arrow aria-hidden', () => {
      const w = mount(SnPopover, { props: { modelValue: true } });
      expect(w.find('.sn-popover__pop').attributes('role')).toBe('dialog');
      expect(w.find('.sn-popover__arrow').attributes('aria-hidden')).toBe('true');
    });

    it('tags menu rows with a menuitem role', () => {
      const w = mount(SnPopover, { props: { modelValue: true, mode: 'menu', content: menu } });
      expect(w.findAll('.sn-popover__menu-item')[0]!.attributes('role')).toBe('menuitem');
    });

    it('tags the root for the docs / AI component map', () => {
      expect(mount(SnPopover).attributes('data-snui-component')).toBe('popover');
    });
  });
});
