/**
 * sn-tooltip unit tests — uni-end tap-triggered hint bubble (wd-tooltip parity).
 *
 * Behaviour only (AGENTS.md §46):
 *   - the trigger toggles the bubble, `open` / `close` / `change` fire in order
 *   - `disabled` blocks both the trigger and the imperative API
 *   - `content` renders as text lines; the `content` slot wins over it
 *   - `placement` becomes a class, `offset` becomes a CSS variable pair
 *   - a tap on the transparent outside mask closes the bubble
 *   - `showClose` renders a close button that hides the bubble
 *   - the leave timer is cleared on unmount (§41)
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import SnTooltip from './sn-tooltip.vue';

describe('sn-tooltip', () => {
  describe('structure', () => {
    it('renders the trigger slot and no bubble while closed', () => {
      const w = mount(SnTooltip, { slots: { default: '<text>删除</text>' } });
      expect(w.text()).toContain('删除');
      expect(w.find('.sn-tooltip__pop').exists()).toBe(false);
    });

    it('renders the bubble and its text when modelValue is true', () => {
      const w = mount(SnTooltip, { props: { modelValue: true, content: '删除后不可恢复' } });
      expect(w.find('.sn-tooltip__pop').exists()).toBe(true);
      expect(w.find('.sn-tooltip__line').text()).toBe('删除后不可恢复');
    });

    it('renders one line per entry for an array content', () => {
      const w = mount(SnTooltip, {
        props: { modelValue: true, content: ['第一行', { label: '第二行' }] },
      });
      const lines = w.findAll('.sn-tooltip__line');
      expect(lines).toHaveLength(2);
      expect(lines[1]!.text()).toBe('第二行');
    });

    it('renders object rows through the alternate text keys and skips label-less rows', () => {
      const w = mount(SnTooltip, {
        props: { modelValue: true, content: [{ text: '甲' }, { name: '乙' }, { other: 1 }, '丙'] },
      });
      const lines = w.findAll('.sn-tooltip__line');
      expect(lines.map((line) => line.text())).toEqual(['甲', '乙', '丙']);
    });

    it('renders no lines for empty string content', () => {
      const w = mount(SnTooltip, { props: { modelValue: true, content: '' } });
      expect(w.findAll('.sn-tooltip__line')).toHaveLength(0);
    });

    it('lets the content slot replace the content prop', () => {
      const w = mount(SnTooltip, {
        props: { modelValue: true, content: 'prop 文案' },
        slots: { content: '<text class="custom-body">slot 文案</text>' },
      });
      expect(w.find('.custom-body').exists()).toBe(true);
      expect(w.find('.sn-tooltip__line').exists()).toBe(false);
    });

    it('applies the placement class', () => {
      const w = mount(SnTooltip, { props: { placement: 'top-start' } });
      expect(w.classes()).toContain('sn-tooltip--top-start');
    });

    it('forwards customClass to the root and customPop to the bubble', () => {
      const w = mount(SnTooltip, {
        props: { modelValue: true, customClass: 'my-tip', customPop: 'my-pop' },
      });
      expect(w.classes()).toContain('my-tip');
      expect(w.find('.sn-tooltip__pop').classes()).toContain('my-pop');
    });

    it('forwards customStyle onto the root style', () => {
      const w = mount(SnTooltip, { props: { customStyle: 'margin: 4px' } });
      expect(w.attributes('style') ?? '').toContain('margin: 4px');
    });

    it('forwards a --sn-tooltip-bg / --sn-tooltip-color override through customStyle', () => {
      const w = mount(SnTooltip, {
        props: { customStyle: '--sn-tooltip-bg: #1890ff; --sn-tooltip-color: #ffffff' },
      });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-tooltip-bg: #1890ff');
      expect(style).toContain('--sn-tooltip-color: #ffffff');
    });

    it('mounts the transparent mask exactly while the bubble is mounted', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnTooltip, { props: { modelValue: true } });
        const mask = w.find('.sn-tooltip__mask');
        expect(mask.exists()).toBe(true);
        expect(mask.attributes('aria-hidden')).toBe('true');
        // Fade-out leg: the mask stays mounted with the bubble, then leaves.
        await w.setProps({ modelValue: false });
        expect(w.find('.sn-tooltip__mask').exists()).toBe(true);
        vi.advanceTimersByTime(150);
        await w.vm.$nextTick();
        expect(w.find('.sn-tooltip__mask').exists()).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('publishes the offset as a CSS variable pair', () => {
      const w = mount(SnTooltip, { props: { offset: { x: 6, y: 2 } } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-tooltip-offset-x: 6px');
      expect(style).toContain('--sn-tooltip-offset-y: 2px');
    });

    it('accepts a number offset and applies it to both axes', () => {
      const w = mount(SnTooltip, { props: { offset: 4 } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-tooltip-offset-x: 4px');
      expect(style).toContain('--sn-tooltip-offset-y: 4px');
    });

    it('accepts an array offset', () => {
      const w = mount(SnTooltip, { props: { offset: [3, 7] } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-tooltip-offset-x: 3px');
      expect(style).toContain('--sn-tooltip-offset-y: 7px');
    });
  });

  describe('arrow', () => {
    it('renders the arrow by default', () => {
      const w = mount(SnTooltip, { props: { modelValue: true } });
      expect(w.find('.sn-tooltip__arrow').exists()).toBe(true);
    });

    it('hides the arrow when visibleArrow is false', () => {
      const w = mount(SnTooltip, { props: { modelValue: true, visibleArrow: false } });
      expect(w.find('.sn-tooltip__arrow').exists()).toBe(false);
    });

    it('forwards customArrow onto the arrow node', () => {
      const w = mount(SnTooltip, { props: { modelValue: true, customArrow: 'my-arrow' } });
      expect(w.find('.sn-tooltip__arrow').classes()).toContain('my-arrow');
    });
  });

  describe('interaction', () => {
    it('emits update:modelValue and open when the trigger is tapped', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false } });
      await w.find('.sn-tooltip__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
      await w.vm.$nextTick();
      expect(w.emitted('open')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: true }]);
      expect(w.find('.sn-tooltip__pop').exists()).toBe(true);
    });

    it('shows the bubble even when the consumer ignores update:modelValue', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false } });
      await w.find('.sn-tooltip__trigger').trigger('tap');
      await w.vm.$nextTick();
      expect(w.find('.sn-tooltip__pop').exists()).toBe(true);
      expect(w.classes()).toContain('sn-tooltip--shown');
    });

    it('closes on a second tap', async () => {
      const w = mount(SnTooltip, { props: { modelValue: true } });
      await w.find('.sn-tooltip__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: false }]);
    });

    it('closes on an outside tap (transparent mask)', async () => {
      const w = mount(SnTooltip, { props: { modelValue: true } });
      await w.find('.sn-tooltip__mask').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: false }]);
    });

    it('closes on a mask tap even when the consumer ignores update:modelValue', async () => {
      const w = mount(SnTooltip, { props: { modelValue: true } });
      await w.find('.sn-tooltip__mask').trigger('tap');
      await w.vm.$nextTick();
      // The bubble keeps the fade-out leg but is no longer shown.
      expect(w.find('.sn-tooltip__pop').exists()).toBe(true);
      expect(w.classes()).not.toContain('sn-tooltip--shown');
    });

    it('ignores the trigger tap while disabled', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false, disabled: true } });
      await w.find('.sn-tooltip__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.find('.sn-tooltip__pop').exists()).toBe(false);
      expect(w.find('.sn-tooltip__trigger').attributes('aria-disabled')).toBe('true');
    });

    it('does not open when a disabled tooltip is driven by v-model', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false, disabled: true } });
      await w.setProps({ modelValue: true });
      await w.vm.$nextTick();
      expect(w.emitted('open')).toBeUndefined();
      expect(w.find('.sn-tooltip__pop').exists()).toBe(false);
    });

    it('renders a close button that hides the bubble', async () => {
      const w = mount(SnTooltip, { props: { modelValue: true, showClose: true } });
      const close = w.find('.sn-tooltip__close');
      expect(close.exists()).toBe(true);
      await close.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
    });

    it('exposes an imperative open / close pair', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false } });
      const vm = w.vm as unknown as { open(): void; close(): void };
      vm.open();
      await w.vm.$nextTick();
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
      vm.close();
      expect(w.emitted('update:modelValue')?.[1]).toEqual([false]);
    });

    it('does not replay open / change when v-model syncs after the trigger tap', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false } });
      await w.find('.sn-tooltip__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
      // The v-model sync arrives while the enter leg from the tap is still
      // running — open / change must fire exactly once.
      await w.setProps({ modelValue: true });
      await w.vm.$nextTick();
      expect(w.emitted('open')).toHaveLength(1);
      expect(w.emitted('change')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: true }]);
    });

    it('does not replay close / change when v-model syncs after an internal close', async () => {
      const w = mount(SnTooltip, { props: { modelValue: true, showClose: true } });
      await w.find('.sn-tooltip__close').trigger('tap');
      await w.setProps({ modelValue: false });
      await w.vm.$nextTick();
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('change')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: false }]);
    });

    it('re-opens cleanly while the fade-out leg is still pending', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnTooltip, { props: { modelValue: true } });
        await w.setProps({ modelValue: false });
        await w.setProps({ modelValue: true });
        await flushPromises();
        // The re-open supersedes the pending leave timer: the bubble stays
        // mounted and shown past the fade-out length.
        vi.advanceTimersByTime(150);
        await w.vm.$nextTick();
        expect(w.find('.sn-tooltip__pop').exists()).toBe(true);
        expect(w.classes()).toContain('sn-tooltip--shown');
        expect(w.emitted('close')).toHaveLength(1);
        expect(w.emitted('open')).toHaveLength(1);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('timers', () => {
    it('keeps the bubble mounted for the fade-out leg', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnTooltip, { props: { modelValue: true } });
        await w.setProps({ modelValue: false });
        expect(w.find('.sn-tooltip__pop').exists()).toBe(true);
        vi.advanceTimersByTime(150);
        await w.vm.$nextTick();
        expect(w.find('.sn-tooltip__pop').exists()).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('clears the pending leave timer on unmount (no leak)', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnTooltip, { props: { modelValue: true } });
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
      const w = mount(SnTooltip, { props: { modelValue: false } });
      const trigger = w.find('.sn-tooltip__trigger');
      expect(trigger.attributes('role')).toBe('button');
      expect(trigger.attributes('aria-expanded')).toBe('false');
      await w.setProps({ modelValue: true });
      // `enter()` flips the shown state one tick later — flush the queue.
      await flushPromises();
      expect(w.find('.sn-tooltip__trigger').attributes('aria-expanded')).toBe('true');
    });

    it('gives the bubble a tooltip role and the arrow aria-hidden', () => {
      const w = mount(SnTooltip, { props: { modelValue: true } });
      expect(w.find('.sn-tooltip__pop').attributes('role')).toBe('tooltip');
      expect(w.find('.sn-tooltip__arrow').attributes('aria-hidden')).toBe('true');
    });

    it('tags the root for the docs / AI component map', () => {
      const w = mount(SnTooltip);
      expect(w.attributes('data-snui-component')).toBe('tooltip');
    });

    it('labels the close button for assistive tech', () => {
      const w = mount(SnTooltip, { props: { modelValue: true, showClose: true } });
      const close = w.find('.sn-tooltip__close');
      expect(close.attributes('role')).toBe('button');
      expect(close.attributes('aria-label')).toBe('close');
    });

    it('accepts the rootPortal parity prop without breaking the render', () => {
      const w = mount(SnTooltip, { props: { modelValue: true, rootPortal: true } });
      expect(w.find('.sn-tooltip__pop').exists()).toBe(true);
    });
  });
});

describe('sn-tooltip (outside-tap switching)', () => {
  it('switches to another tooltip within the same gesture', async () => {
    const a = mount(SnTooltip, { props: { modelValue: true, content: 'A' } });
    const b = mount(SnTooltip, { props: { modelValue: false, content: 'B' } });
    // One gesture: touchstart on A's mask closes it early, then the same tap
    // lands on B's trigger — B must open without a second tap.
    await a.find('.sn-tooltip__mask').trigger('touchstart');
    await b.find('.sn-tooltip__trigger').trigger('tap');
    expect(a.emitted('close')).toHaveLength(1);
    expect(b.emitted('update:modelValue')?.[0]).toEqual([true]);
    a.unmount();
    b.unmount();
  });

  it('does not instantly reopen the bubble it just closed via the mask', async () => {
    const w = mount(SnTooltip, { props: { modelValue: true, content: 'A' } });
    await w.find('.sn-tooltip__mask').trigger('touchstart');
    // The same-gesture tap on the just-closed trigger must be ignored.
    await w.find('.sn-tooltip__trigger').trigger('tap');
    expect(w.emitted('update:modelValue')).toEqual([[false]]);
    w.unmount();
  });
});
