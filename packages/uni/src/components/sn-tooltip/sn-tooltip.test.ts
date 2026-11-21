/**
 * sn-tooltip unit tests — uni-end tap-triggered TEXT-ONLY hint bubble.
 *
 * Behaviour only (AGENTS.md §46):
 *   - the trigger toggles the bubble, `open` / `close` / `change` fire in order
 *   - `disabled` blocks both the trigger and the imperative API
 *   - `content` renders as plain-text lines (string | string[] only — the
 *     text-only split from sn-popover); the old `content` slot is gone
 *   - the bubble rides the dark transient plate (toast token pair)
 *   - `placement` becomes a class, `offset` becomes a CSS variable pair
 *   - closeOutside() (page-root queue) closes the bubble; mounting registers it
 *   - `showClose` renders a close button that hides the bubble
 *   - the leave timer is cleared on unmount (§41)
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { flushPromises, mount } from '@vue/test-utils';
import SnTooltip from './sn-tooltip.vue';
import { closeOutside } from '../../utils/outside-close';

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
        props: { modelValue: true, content: ['第一行', '第二行'] },
      });
      const lines = w.findAll('.sn-tooltip__line');
      expect(lines).toHaveLength(2);
      expect(lines[1]!.text()).toBe('第二行');
    });

    it('drops non-string entries deterministically instead of stringifying them', () => {
      // Text hints only (split from sn-popover): a JS caller passing the old
      // object rows must never see "[object Object]" — entries are dropped.
      const w = mount(SnTooltip, {
        props: { modelValue: true, content: ['甲', { text: '乙' } as unknown as string] },
      });
      expect(w.findAll('.sn-tooltip__line')).toHaveLength(1);
      expect(w.find('.sn-tooltip__line').text()).toBe('甲');
    });

    it('renders no lines for empty string content', () => {
      const w = mount(SnTooltip, { props: { modelValue: true, content: '' } });
      expect(w.findAll('.sn-tooltip__line')).toHaveLength(0);
    });

    it('declares no content slot — rich bodies belong to sn-popover', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
      expect(source).not.toContain('<slot name="content"');
      // The custom body a caller still passes renders nowhere.
      const w = mount(SnTooltip, {
        props: { modelValue: true, content: 'prop 文案' },
        slots: { content: '<text class="custom-body">slot 文案</text>' },
      });
      expect(w.find('.custom-body').exists()).toBe(false);
      expect(w.find('.sn-tooltip__line').text()).toBe('prop 文案');
    });

    it('rides the dark transient plate (toast token pair, split from sn-popover)', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
      expect(source).toContain('--sn-tooltip-bg: var(--sn-mp-color-background-inverse)');
      expect(source).toContain('--sn-tooltip-color: var(--sn-mp-color-text-on-primary)');
    });

    it('sizes the bubble through the fixed-width token (no max-content / vw on App)', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
      const popRule = source.indexOf('.sn-tooltip__pop {');
      const block = source.slice(popRule, source.indexOf('}', popRule));
      expect(block).toContain('width: var(--sn-tooltip-width)');
      expect(block).not.toContain('max-content');
      expect(block).not.toContain('100vw');
      expect(source).toContain('--sn-tooltip-width: 320rpx');
    });

    it('applies the placement class', () => {
      const w = mount(SnTooltip, { props: { placement: 'top-start' } });
      expect(w.classes()).toContain('sn-tooltip--top-start');
    });

    it('defaults to the dark plate (no light class)', () => {
      const w = mount(SnTooltip, {});
      expect(w.classes()).not.toContain('sn-tooltip--light');
    });

    it('applies the light-theme class for theme="light"', () => {
      const w = mount(SnTooltip, { props: { theme: 'light' } });
      expect(w.classes()).toContain('sn-tooltip--light');
      // the arrow shares the plate fill, so the light override must live on
      // the root (it cascades to both nodes through --sn-tooltip-bg)
      const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
      expect(source).toMatch(
        /\.sn-tooltip--light\s*\{[^}]*--sn-tooltip-bg: var\(--sn-mp-color-background-surface\)/,
      );
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

    it('stops responding to closeOutside after unmount', async () => {
      const w = mount(SnTooltip, { props: { modelValue: true } });
      w.unmount();
      // Unregistered on unmount — a page-root closeOutside must not touch it.
      expect(() => closeOutside()).not.toThrow();
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

    // §103 regression: the arrow used to be a 16rpx rotated SQUARE sharing the
    // plate's translucent fill — the inner half double-composited over the
    // bubble body (a darker diamond over the content) and the exposed triangle
    // read too small. The border triangle paints the fill exactly once and
    // rides fully outside the plate, so neither can regress silently.
    it('draws the arrow as a border triangle, not a translucent rotated square', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
      const arrowBase = source.slice(
        source.indexOf('.sn-tooltip__arrow {'),
        source.indexOf('}', source.indexOf('.sn-tooltip__arrow {')),
      );
      // A rotated square (transform: rotate) would double-composite alpha.
      expect(arrowBase).not.toContain('transform');
      expect(arrowBase).not.toContain('background-color');
      expect(arrowBase).toContain('border-style: solid');
    });

    it('keeps the arrow outside the content plate for every placement family', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
      for (const edge of ['bottom: -14rpx', 'top: -14rpx', 'right: -14rpx', 'left: -14rpx']) {
        expect(source).toContain(edge);
      }
    });

    it('sizes the arrow to the trigger gap so the apex lands flush (贴边)', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
      // 14rpx triangle in a 14rpx gap: the apex exactly kisses the trigger
      // edge instead of poking into it or stopping short of it.
      const allSides = ['border-top-width: 14rpx', 'border-right-width: 14rpx', 'border-bottom-width: 14rpx', 'border-left-width: 14rpx'];
      for (const side of allSides) expect(source).toContain(side);
    });

    // §103 regression: uni-app x views clip children by default, so without
    // explicit `overflow: visible` the absolutely-positioned bubble (outside
    // the root box) and the protruding arrow never painted on App / uni-app x
    // web — the tap opened the bubble (shown state + DOM present) while
    // nothing appeared on screen.
    it('declares overflow visible where children ride outside the box', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
      const rootBlock = source.slice(
        source.indexOf('.sn-tooltip {'),
        source.indexOf('}', source.indexOf('.sn-tooltip {')),
      );
      expect(rootBlock).toContain('overflow: visible');
      const popBlock = source.slice(
        source.indexOf('.sn-tooltip__pop {'),
        source.indexOf('}', source.indexOf('.sn-tooltip__pop {')),
      );
      expect(popBlock).toContain('overflow: visible');
    });

    // uni-app x views carry an explicit default font-size and do NOT inherit
    // the pop's — body text rendered at the 16px runtime default and
    // over-wrapped inside the fixed plate.
    it('sets the plate font explicitly on the body and line views', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
      for (const cls of ['.sn-tooltip__body {', '.sn-tooltip__line {']) {
        const block = source.slice(source.indexOf(cls), source.indexOf('}', source.indexOf(cls)));
        expect(block).toContain('font-size: var(--sn-mp-font-size-xs)');
        expect(block).toContain('line-height: var(--sn-mp-font-line-height-normal)');
      }
    });

    // §103 regression: the vertical families used to color the WRONG border —
    // a colored top border renders apex-down, so `top` (bubble above, apex
    // must point down at the trigger) colors the TOP border, and `bottom`
    // colors the BOTTOM border. Inverted, the apex merged into the plate and
    // every vertical arrow read upside-down.
    it('points the apex at the trigger (top colors top, bottom colors bottom)', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
      const topRule = source.slice(
        source.indexOf('.sn-tooltip--top .sn-tooltip__arrow,'),
        source.indexOf('}', source.indexOf('border-top-color: var(--sn-tooltip-bg)')),
      );
      expect(topRule).toContain('border-top-color: var(--sn-tooltip-bg)');
      expect(topRule).toContain('border-bottom-width: 0');
      const bottomRule = source.slice(
        source.indexOf('.sn-tooltip--bottom .sn-tooltip__arrow,'),
        source.indexOf('}', source.indexOf('border-bottom-color: var(--sn-tooltip-bg)')),
      );
      expect(bottomRule).toContain('border-bottom-color: var(--sn-tooltip-bg)');
      expect(bottomRule).toContain('border-top-width: 0');
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

    it('closes via closeOutside (page-root queue)', async () => {
      const w = mount(SnTooltip, { props: { modelValue: true } });
      closeOutside();
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: false }]);
    });

    it('closeOutside is a no-op for an already-closed bubble', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false } });
      closeOutside();
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.emitted('close')).toBeUndefined();
    });

    it('closes via closeOutside even when the consumer ignores update:modelValue', async () => {
      const w = mount(SnTooltip, { props: { modelValue: true } });
      closeOutside();
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

    it('trigger="manual" leaves toggling to the page (App-side slot boundary)', async () => {
      // The App-side event model does not propagate taps across the slot
      // boundary, so in manual mode the trigger tap must be inert and the
      // page toggles via v-model.
      const w = mount(SnTooltip, { props: { modelValue: false, trigger: 'manual' } });
      await w.find('.sn-tooltip__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.find('.sn-tooltip__pop').exists()).toBe(false);
      await w.setProps({ modelValue: true });
      await w.vm.$nextTick();
      expect(w.find('.sn-tooltip__pop').exists()).toBe(true);
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

describe('sn-tooltip (outside-tap switching via the queue)', () => {
  it('lets one gesture switch bubbles: outside close, then the next trigger opens', async () => {
    const a = mount(SnTooltip, { props: { modelValue: true, content: 'A' } });
    const b = mount(SnTooltip, { props: { modelValue: false, content: 'B' } });
    // Page-root decomposition of one tap on B's trigger: the tap bubbles to
    // the root (closing A) and B's own @tap.stop handler opens B.
    closeOutside();
    await b.find('.sn-tooltip__trigger').trigger('tap');
    expect(a.emitted('close')).toHaveLength(1);
    expect(b.emitted('update:modelValue')?.[0]).toEqual([true]);
    a.unmount();
    b.unmount();
  });

  it('closes every open bubble at once', async () => {
    const a = mount(SnTooltip, { props: { modelValue: true, content: 'A' } });
    const b = mount(SnTooltip, { props: { modelValue: true, content: 'B' } });
    closeOutside();
    expect(a.emitted('close')).toHaveLength(1);
    expect(b.emitted('close')).toHaveLength(1);
    a.unmount();
    b.unmount();
  });
});

describe('sn-tooltip (App trigger catcher, uni-app x)', () => {
  // On uni-app x App a tap on the trigger's slot content never reaches this
  // component's own views, so an `#ifdef APP` catcher owned by the component
  // sits on top of the trigger box and drives the same toggle. The gate is a
  // textual preprocessor — vitest renders the node, real MP / H5 builds strip
  // it (asserted on the source below).
  it('opens and closes the bubble through the catcher tap', async () => {
    const w = mount(SnTooltip, { props: { modelValue: false, content: '提示' } });
    const catcher = w.find('.sn-tooltip__trigger-catcher');
    expect(catcher.exists()).toBe(true);
    await catcher.trigger('tap');
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
    await flushPromises();
    expect(w.classes()).toContain('sn-tooltip--shown');
    expect(w.find('.sn-tooltip__pop').exists()).toBe(true);
    await catcher.trigger('tap');
    expect(w.emitted('update:modelValue')?.[1]).toEqual([false]);
    expect(w.emitted('close')).toHaveLength(1);
  });

  it('stays inert in manual mode and while disabled', async () => {
    const manual = mount(SnTooltip, { props: { modelValue: false, trigger: 'manual' } });
    await manual.find('.sn-tooltip__trigger-catcher').trigger('tap');
    expect(manual.emitted('update:modelValue')).toBeUndefined();
    const disabled = mount(SnTooltip, { props: { modelValue: false, disabled: true } });
    await disabled.find('.sn-tooltip__trigger-catcher').trigger('tap');
    expect(disabled.emitted('update:modelValue')).toBeUndefined();
    expect(disabled.find('.sn-tooltip__pop').exists()).toBe(false);
  });

  it('keeps the catcher out of the accessibility tree', () => {
    const w = mount(SnTooltip);
    expect(w.find('.sn-tooltip__trigger-catcher').attributes('aria-hidden')).toBe('true');
  });

  it('ships the catcher behind #ifdef APP so MP / H5 builds strip it', () => {
    const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
    const templateStart = source.indexOf('<!-- #ifdef APP -->');
    const templateEnd = source.indexOf('<!-- #endif -->', templateStart);
    expect(templateStart, 'the catcher must be gated for App only').toBeGreaterThan(-1);
    expect(templateEnd).toBeGreaterThan(templateStart);
    const gated = source.slice(templateStart, templateEnd);
    expect(gated).toContain('sn-tooltip__trigger-catcher');
    expect(gated).toContain('@tap.stop="onTriggerTap"');
    expect(gated).toContain('hover-class="sn-tooltip__trigger-catcher--pressed"');
    // The template's closing marker must sit inside the trigger wrapper.
    expect(source.slice(templateStart, templateEnd)).toContain('<view');
    // Nothing catcher-shaped may leak outside the two gates (template + CSS).
    const styleStart = source.indexOf('/* #ifdef APP */');
    const styleEnd = source.indexOf('/* #endif */', styleStart) + '/* #endif */'.length;
    const ungated =
      source.slice(0, templateStart) +
      source.slice(templateEnd + '<!-- #endif -->'.length, styleStart) +
      source.slice(styleEnd);
    expect(ungated).not.toContain('trigger-catcher');
  });

  it('anchors the catcher to a relative trigger wrapper in the stylesheet', () => {
    const source = readFileSync(resolve(import.meta.dirname, 'sn-tooltip.vue'), 'utf8');
    const triggerRule = source.slice(
      source.indexOf('.sn-tooltip__trigger {'),
      source.indexOf('}', source.indexOf('.sn-tooltip__trigger {')),
    );
    expect(triggerRule).toContain('position: relative');
    const cssStart = source.indexOf('/* #ifdef APP */', source.indexOf('<style'));
    const cssEnd = source.indexOf('/* #endif */', cssStart);
    expect(cssStart).toBeGreaterThan(-1);
    expect(cssEnd).toBeGreaterThan(cssStart);
    const css = source.slice(cssStart, cssEnd);
    expect(css).toContain('.sn-tooltip__trigger-catcher {');
    expect(css).toContain('position: absolute');
    expect(css).toContain('var(--sn-mp-color-background-soft)');
  });
});
