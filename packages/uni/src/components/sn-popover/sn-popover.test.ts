/**
 * sn-popover unit tests — uni-end tap-triggered bubble (wd-popover parity).
 *
 * Behaviour only (AGENTS.md §46):
 *   - the trigger toggles the bubble; `open` / `close` / `change` fire
 *   - `normal` mode renders the text body, `menu` mode renders rows
 *   - a row tap emits `menuclick` with `{ item, index }`; disabled rows are inert
 *   - `content` slot replaces the built-in body in both modes
 *   - `placement` / `offset` / `custom*` props are forwarded
 *   - closeOutside() (page-root queue) closes the bubble; mounting registers it
 *   - the outside mask (`closeOnClickOutside`) closes on an outside tap
 *   - menu row glyphs resolve from iconData / iconUrl / icon / iconClass
 *   - glyph boxes follow the `--sn-popover-*-icon-size` tokens (auto height)
 *   - the leave timer is cleared on unmount (§41)
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { flushPromises, mount } from '@vue/test-utils';
import SnPopover from './sn-popover.vue';
import { Star, X as XIcon } from '../sn-icon/sn-icon-set';
import { closeOutside } from '../../utils/outside-close';

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

    it('accepts a number offset and applies it to both axes', () => {
      const w = mount(SnPopover, { props: { offset: 4 } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-popover-offset-x: 4px');
      expect(style).toContain('--sn-popover-offset-y: 4px');
    });

    it('accepts an array offset', () => {
      const w = mount(SnPopover, { props: { offset: [3, 7] } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-popover-offset-x: 3px');
      expect(style).toContain('--sn-popover-offset-y: 7px');
    });

    it('forwards a --sn-popover-bg / --sn-popover-color override through customStyle', () => {
      const w = mount(SnPopover, {
        props: { customStyle: '--sn-popover-bg: #1890ff; --sn-popover-color: #ffffff' },
      });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-popover-bg: #1890ff');
      expect(style).toContain('--sn-popover-color: #ffffff');
    });

    it('stops responding to closeOutside after unmount', async () => {
      const w = mount(SnPopover, { props: { modelValue: true } });
      w.unmount();
      // Unregistered on unmount — a page-root closeOutside must not touch it.
      expect(() => closeOutside()).not.toThrow();
    });

    it('accepts the rootPortal parity prop without breaking the render', () => {
      const w = mount(SnPopover, { props: { modelValue: true, rootPortal: true } });
      expect(w.find('.sn-popover__pop').exists()).toBe(true);
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

    // §103 regression (uni-app x): views clip children by default, so without
    // explicit `overflow: visible` the absolutely-positioned bubble and its
    // protruding arrow never painted on the App / web builds (the tap opened
    // the bubble while nothing appeared on screen). The text views also carry
    // an explicit runtime font-size that does not inherit the pop's.
    it('declares overflow visible on the root and pop and explicit text sizes', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-popover.vue'), 'utf8');
      const rootBlock = source.slice(
        source.indexOf('.sn-popover {'),
        source.indexOf('}', source.indexOf('.sn-popover {')),
      );
      expect(rootBlock).toContain('overflow: visible');
      const popBlock = source.slice(
        source.indexOf('.sn-popover__pop {'),
        source.indexOf('}', source.indexOf('.sn-popover__pop {')),
      );
      expect(popBlock).toContain('overflow: visible');
      for (const cls of ['.sn-popover__text {', '.sn-popover__menu-text {']) {
        const block = source.slice(source.indexOf(cls), source.indexOf('}', source.indexOf(cls)));
        expect(block).toContain('font-size: var(--sn-mp-font-size-');
      }
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

    it('closes via closeOutside (page-root queue)', async () => {
      const w = mount(SnPopover, { props: { modelValue: true } });
      closeOutside();
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: false }]);
    });

    it('closeOutside is a no-op for an already-closed bubble', async () => {
      const w = mount(SnPopover, { props: { modelValue: false } });
      closeOutside();
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.emitted('close')).toBeUndefined();
    });

    it('closes via closeOutside even when the consumer ignores update:modelValue', async () => {
      const w = mount(SnPopover, { props: { modelValue: true } });
      closeOutside();
      await w.vm.$nextTick();
      // The bubble keeps the fade-out leg but is no longer shown.
      expect(w.find('.sn-popover__pop').exists()).toBe(true);
      expect(w.classes()).not.toContain('sn-popover--shown');
    });

    it('ignores the trigger tap while disabled', async () => {
      const w = mount(SnPopover, { props: { modelValue: false, disabled: true } });
      await w.find('.sn-popover__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.find('.sn-popover__pop').exists()).toBe(false);
      expect(w.find('.sn-popover__trigger').attributes('aria-disabled')).toBe('true');
    });

    it('trigger="manual" leaves toggling to the page (App-side slot boundary)', async () => {
      // The App-side event model does not propagate taps across the slot
      // boundary, so in manual mode the trigger tap must be inert and the
      // page toggles via v-model.
      const w = mount(SnPopover, { props: { modelValue: false, trigger: 'manual' } });
      await w.find('.sn-popover__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.find('.sn-popover__pop').exists()).toBe(false);
      // The page toggles through v-model instead.
      await w.setProps({ modelValue: true });
      await flushPromises();
      expect(w.find('.sn-popover__pop').exists()).toBe(true);
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

    it('blocks v-model opens while disabled', async () => {
      const w = mount(SnPopover, { props: { modelValue: false, disabled: true } });
      await w.setProps({ modelValue: true });
      await flushPromises();
      expect(w.emitted('open')).toBeUndefined();
      expect(w.find('.sn-popover__pop').exists()).toBe(false);
    });

    it('does not replay open / change when v-model syncs after the trigger tap', async () => {
      const w = mount(SnPopover, { props: { modelValue: false } });
      await w.find('.sn-popover__trigger').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
      // The v-model sync arrives while the enter leg from the tap is still
      // running — open / change must fire exactly once.
      await w.setProps({ modelValue: true });
      await flushPromises();
      expect(w.emitted('open')).toHaveLength(1);
      expect(w.emitted('change')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: true }]);
    });

    it('does not replay close / change when v-model syncs after an internal close', async () => {
      const w = mount(SnPopover, { props: { modelValue: true, showClose: true } });
      await w.find('.sn-popover__close').trigger('tap');
      await w.setProps({ modelValue: false });
      await flushPromises();
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('change')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: false }]);
    });

    it('re-opens cleanly while the fade-out leg is still pending', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnPopover, { props: { modelValue: true } });
        await w.setProps({ modelValue: false });
        await w.setProps({ modelValue: true });
        await flushPromises();
        // The re-open supersedes the pending leave timer: the bubble stays
        // mounted and shown past the fade-out length.
        vi.advanceTimersByTime(150);
        await w.vm.$nextTick();
        expect(w.find('.sn-popover__pop').exists()).toBe(true);
        expect(w.classes()).toContain('sn-popover--shown');
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

    it('labels the close button for assistive tech', () => {
      const w = mount(SnPopover, { props: { modelValue: true, showClose: true } });
      const close = w.find('.sn-popover__close');
      expect(close.attributes('role')).toBe('button');
      expect(close.attributes('aria-label')).toBe('close');
    });
  });
});

describe('sn-popover (icon rows and exposed no-op)', () => {
  it('renders an image element for a menu row whose icon is an image source', () => {
    const w = mount(SnPopover, {
      props: {
        modelValue: true,
        mode: 'menu',
        content: [
          { content: '扫码', iconClass: 'https://cdn.example.com/scan.png' },
          { content: '相册', iconClass: '/local/album.png' },
        ],
      },
    });
    const images = w.findAll('image.sn-popover__menu-icon, image.sn-popover__icon-image');
    expect(images).toHaveLength(2);
    expect(images[0]!.attributes('src')).toBe('https://cdn.example.com/scan.png');
  });

  it('resolves a registry icon name into the row icon', async () => {
    const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
    const { Star } = await import('../sn-icon/sn-icon-set');
    registerSnIcons({ Star });
    try {
      const w = mount(SnPopover, {
        props: {
          modelValue: true,
          mode: 'menu',
          content: [{ content: '收藏', iconClass: 'Star' }],
        },
      });
      expect(w.find('.sn-popover__menu-item svg, .sn-popover__menu-icon svg').exists()).toBe(true);
      expect(w.find('image.sn-popover__menu-icon, image.sn-popover__icon-image').exists()).toBe(false);
    } finally {
      clearSnIcons();
    }
  });

  it('exposes updatePosition as a safe no-op', () => {
    const w = mount(SnPopover, { props: { modelValue: true, content: 'x' } });
    expect(() =>
      (w.vm as unknown as { updatePosition: () => void }).updatePosition(),
    ).not.toThrow();
  });
});

describe('sn-popover (outside-tap switching via the queue)', () => {
  it('lets one gesture switch bubbles: outside close, then the next trigger opens', async () => {
    const a = mount(SnPopover, { props: { modelValue: true, content: 'A' } });
    const b = mount(SnPopover, { props: { modelValue: false, content: 'B' } });
    // Page-root decomposition of one tap on B's trigger: the tap bubbles to
    // the root (closing A) and B's own @tap.stop handler opens B.
    closeOutside();
    await b.find('.sn-popover__trigger').trigger('tap');
    expect(a.emitted('close')).toHaveLength(1);
    expect(b.emitted('update:modelValue')?.[0]).toEqual([true]);
    a.unmount();
    b.unmount();
  });

  it('closes every open bubble at once', async () => {
    const a = mount(SnPopover, { props: { modelValue: true, content: 'A' } });
    const b = mount(SnPopover, { props: { modelValue: true, content: 'B' } });
    closeOutside();
    expect(a.emitted('close')).toHaveLength(1);
    expect(b.emitted('close')).toHaveLength(1);
    a.unmount();
    b.unmount();
  });
});

describe('sn-popover (outside-close queue, AUI-OPT-07)', () => {
  it('closes through the page-root closeOutside channel', async () => {
    const w = mount(SnPopover, { props: { modelValue: true, content: 'A' } });
    closeOutside();
    await flushPromises();
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(w.emitted('close')).toHaveLength(1);
    expect(w.emitted('change')?.[0]).toEqual([{ show: false }]);
    expect(w.classes()).not.toContain('sn-popover--shown');
  });

  it('renders no mask node — the close rides the queue, not a tap catcher', () => {
    const w = mount(SnPopover, { props: { modelValue: true, content: 'A' } });
    expect(w.find('.sn-popover__mask').exists()).toBe(false);
    // the pop itself stays in the tree while shown
    expect(w.find('.sn-popover__pop').exists()).toBe(true);
  });

  it('does not close on taps inside the bubble itself', async () => {
    const w = mount(SnPopover, { props: { modelValue: true, content: 'A' } });
    await w.find('.sn-popover__pop').trigger('tap');
    expect(w.emitted('update:modelValue')).toBeUndefined();
    expect(w.emitted('close')).toBeUndefined();
  });

  it('unregisters the outside-close while closeOnClickOutside is false', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, closeOnClickOutside: false, content: 'A' },
    });
    closeOutside();
    expect(w.emitted('close')).toBeUndefined();
  });

  it('re-registers when closeOnClickOutside flips back to true', async () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, closeOnClickOutside: false, content: 'A' },
    });
    closeOutside();
    expect(w.emitted('close')).toBeUndefined();
    await w.setProps({ closeOnClickOutside: true });
    closeOutside();
    await flushPromises();
    expect(w.emitted('close')).toHaveLength(1);
  });

  it('closes an uncontrolled bubble the consumer never synced', async () => {
    const w = mount(SnPopover, { props: { modelValue: false } });
    await w.find('.sn-popover__trigger').trigger('tap');
    await flushPromises();
    expect(w.classes()).toContain('sn-popover--shown');
    closeOutside();
    await flushPromises();
    expect(w.emitted('update:modelValue')?.[1]).toEqual([false]);
    expect(w.classes()).not.toContain('sn-popover--shown');
  });

  it('lets a second trigger tap close an uncontrolled bubble', async () => {
    const w = mount(SnPopover, { props: { modelValue: false } });
    await w.find('.sn-popover__trigger').trigger('tap');
    await flushPromises();
    expect(w.classes()).toContain('sn-popover--shown');
    await w.find('.sn-popover__trigger').trigger('tap');
    expect(w.emitted('update:modelValue')?.[1]).toEqual([false]);
    expect(w.classes()).not.toContain('sn-popover--shown');
  });

  it('does not replay close / change when the queue fires twice in one gesture', async () => {
    const w = mount(SnPopover, { props: { modelValue: true, content: 'A' } });
    closeOutside();
    // A second dispatcher in the same gesture (nested roots) is idempotent.
    closeOutside();
    await flushPromises();
    expect(w.emitted('close')).toHaveLength(1);
    expect(w.emitted('change')).toHaveLength(1);
  });

  it('binds the trigger with tap.stop per the outside-close contract', () => {
    const source = readFileSync(resolve(import.meta.dirname, 'sn-popover.vue'), 'utf8');
    expect(source).toContain('@tap.stop="onTriggerTap"');
    expect(source).not.toContain('sn-popover__mask');
  });
});

describe('sn-popover (auto height, AUI-OPT-07)', () => {
  it('scales row glyphs through the menu icon token', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, mode: 'menu', content: [{ content: '星标', iconData: Star }] },
    });
    // The arrow outline icon is a SnIcon too — scope to the menu row's
    // (the only one carrying the Star IconData).
    const menuIcon = w
      .findAllComponents({ name: 'SnIcon' })
      .find((c) => JSON.stringify(c.props('icon')) === JSON.stringify(Star));
    expect(menuIcon?.props('size')).toBe('var(--sn-popover-menu-icon-size)');
  });

  it('scales the close glyph through the close icon token', () => {
    const w = mount(SnPopover, { props: { modelValue: true, showClose: true, content: 'A' } });
    const closeIcon = w
      .findAllComponents({ name: 'SnIcon' })
      .find((c) => c.props('icon') === XIcon);
    expect(closeIcon?.props('size')).toBe('var(--sn-popover-close-icon-size)');
  });

  it('publishes the glyph-scale tokens on the root and lets customStyle override them', () => {
    const w = mount(SnPopover, {
      props: { customStyle: '--sn-popover-menu-icon-size: 40rpx' },
    });
    expect(w.attributes('style') ?? '').toContain('--sn-popover-menu-icon-size: 40rpx');
  });

  it('keeps the pop unclamped and wraps long labels in the stylesheet', () => {
    const source = readFileSync(resolve(import.meta.dirname, 'sn-popover.vue'), 'utf8');
    const popRule = source.indexOf('.sn-popover__pop {');
    expect(popRule).toBeGreaterThan(-1);
    expect(source.slice(popRule, source.indexOf('}', popRule))).toContain('height: auto');
    const mainRule = source.indexOf('.sn-popover__menu-main {');
    expect(mainRule).toBeGreaterThan(-1);
    const mainBlock = source.slice(mainRule, source.indexOf('}', mainRule));
    // One-line labels used to be forced with `white-space: nowrap`, which
    // spilled long labels out of the bubble instead of growing its height.
    expect(mainBlock).not.toContain('white-space: nowrap');
    expect(mainBlock).toContain('flex: 1');
    expect(mainBlock).toContain('min-width: 0');
  });

  it('sizes the bubble through fixed-width tokens (no max-content / min / vw on App)', () => {
    // uni-app x App drops `max-content` / `min()` / `vw` declarations — the
    // bubble then loses its sizing and can render collapsed / invisible. The
    // refactor replaces them with fixed-width component vars.
    const source = readFileSync(resolve(import.meta.dirname, 'sn-popover.vue'), 'utf8');
    // Comments are stripped so the assertions judge declarations, not prose.
    const stripComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '');
    const popRule = source.indexOf('.sn-popover__pop {');
    // Slice to the rule's closing brace at line start — the block contains a
    // nested-looking comment with braces inside filter/ifdef lines.
    const popEnd = source.indexOf('\n}', popRule);
    // Raw slice (comments kept) for the conditional-compilation assertions,
    // stripped slice for the declaration assertions.
    const popRaw = source.slice(popRule, popEnd);
    const popBlock = stripComments(popRaw);
    expect(popBlock).toContain('width: var(--sn-popover-width)');
    expect(popBlock).not.toContain('max-content');
    expect(popBlock).not.toContain('100vw');
    expect(popBlock).not.toContain('min(');
    // One-shape elevation: drop-shadow (follows the silhouette incl. the
    // arrow) on H5 / MP; rectangle box-shadow only as the App fallback.
    expect(popRaw).toContain('/* #ifndef APP */');
    expect(popRaw).toContain('filter: drop-shadow(');
    expect(popRaw).toContain('/* #ifdef APP */');
    expect(popRaw).toContain('box-shadow: var(--sn-mp-shadow-md)');
    // Borderless card — an outline would seam against the arrow junction.
    expect(popBlock).not.toContain('border:');
    expect(source).toContain('--sn-popover-width: 480rpx');
    expect(source).toContain('--sn-popover-menu-width: 320rpx');
    // Centering must stay calc-free inside `transform`.
    expect(source).toContain('transform: translateX(-50%)');
    expect(source).not.toContain('translate(calc(');
  });

  it('sizes the glyph boxes with the component vars (no fixed square)', () => {
    const source = readFileSync(resolve(import.meta.dirname, 'sn-popover.vue'), 'utf8');
    const blockOf = (selector: string): string => {
      const start = source.indexOf(selector);
      expect(start).toBeGreaterThan(-1);
      return source.slice(start, source.indexOf('}', start));
    };
    expect(blockOf('.sn-popover__menu-icon {')).toContain(
      'width: var(--sn-popover-menu-icon-size)',
    );
    expect(blockOf('.sn-popover__close {')).toContain('width: var(--sn-popover-close-icon-size)');
  });
});

describe('sn-popover (menu row glyph sources, additive)', () => {
  it('renders an inline IconData glyph without any registration step', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, mode: 'menu', content: [{ content: '星标', iconData: Star }] },
    });
    expect(w.find('.sn-popover__menu-icon svg path').attributes('d')).toBe(Star.paths[0]);
    expect(w.find('image.sn-popover__menu-icon, image.sn-popover__icon-image').exists()).toBe(false);
  });

  it('prefers iconData over iconUrl and icon', () => {
    const w = mount(SnPopover, {
      props: {
        modelValue: true,
        mode: 'menu',
        content: [
          { content: '三源', iconData: Star, iconUrl: 'https://example.com/a.png', icon: 'Star' },
        ],
      },
    });
    expect(w.find('image.sn-popover__menu-icon, image.sn-popover__icon-image').exists()).toBe(false);
    expect(w.find('.sn-popover__menu-icon svg path').attributes('d')).toBe(Star.paths[0]);
  });

  it('renders iconUrl as an image and it beats icon', () => {
    const w = mount(SnPopover, {
      props: {
        modelValue: true,
        mode: 'menu',
        content: [{ content: '图', iconUrl: 'https://example.com/b.png', icon: 'Star' }],
      },
    });
    const image = w.find('image.sn-popover__menu-icon, image.sn-popover__icon-image');
    expect(image.exists()).toBe(true);
    expect(image.attributes('src')).toBe('https://example.com/b.png');
    expect(w.find('.sn-popover__menu-icon svg').exists()).toBe(false);
  });

  it('resolves icon through the SnIcon chain (built-in catalogue)', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, mode: 'menu', content: [{ content: '升序', icon: 'arrow-up' }] },
    });
    expect(w.find('.sn-popover__menu-icon svg').exists()).toBe(true);
    expect(w.find('image.sn-popover__menu-icon, image.sn-popover__icon-image').exists()).toBe(false);
  });

  it('lets icon beat the legacy iconClass field', () => {
    const w = mount(SnPopover, {
      props: {
        modelValue: true,
        mode: 'menu',
        content: [{ content: '优先', icon: 'arrow-up', iconClass: 'Edit' }],
      },
    });
    // The menu row carries the string icon name — the arrow outline icon
    // carries IconData, so matching on the string scopes to the row's.
    const rowIcon = w
      .findAllComponents({ name: 'SnIcon' })
      .find((c) => c.props('icon') === 'arrow-up');
    expect(rowIcon?.props('icon')).toBe('arrow-up');
  });

  it('renders no glyph when none of the sources is set', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, mode: 'menu', content: [{ content: '纯文本' }] },
    });
    expect(w.find('image.sn-popover__menu-icon, image.sn-popover__icon-image').exists()).toBe(false);
    expect(w.find('.sn-popover__menu-icon svg').exists()).toBe(false);
  });
});

describe('sn-popover (App trigger catcher, uni-app x)', () => {
  // On uni-app x App a tap on the trigger's slot content never reaches this
  // component's own views, so an `#ifdef APP` catcher owned by the component
  // sits on top of the trigger box and drives the same toggle. The gate is a
  // textual preprocessor — vitest renders the node, real MP / H5 builds strip
  // it (asserted on the source below).
  it('opens and closes the bubble through the catcher tap', async () => {
    const w = mount(SnPopover, { props: { modelValue: false, content: 'A' } });
    const catcher = w.find('.sn-popover__trigger-catcher');
    expect(catcher.exists()).toBe(true);
    await catcher.trigger('tap');
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
    await flushPromises();
    expect(w.classes()).toContain('sn-popover--shown');
    expect(w.find('.sn-popover__pop').exists()).toBe(true);
    await catcher.trigger('tap');
    expect(w.emitted('update:modelValue')?.[1]).toEqual([false]);
    expect(w.emitted('close')).toHaveLength(1);
  });

  it('stays inert in manual mode and while disabled', async () => {
    const manual = mount(SnPopover, { props: { modelValue: false, trigger: 'manual' } });
    await manual.find('.sn-popover__trigger-catcher').trigger('tap');
    expect(manual.emitted('update:modelValue')).toBeUndefined();
    const disabled = mount(SnPopover, { props: { modelValue: false, disabled: true } });
    await disabled.find('.sn-popover__trigger-catcher').trigger('tap');
    expect(disabled.emitted('update:modelValue')).toBeUndefined();
    expect(disabled.find('.sn-popover__pop').exists()).toBe(false);
  });

  it('keeps the catcher out of the accessibility tree', () => {
    const w = mount(SnPopover);
    expect(w.find('.sn-popover__trigger-catcher').attributes('aria-hidden')).toBe('true');
  });

  it('ships the catcher behind #ifdef APP so MP / H5 builds strip it', () => {
    const source = readFileSync(resolve(import.meta.dirname, 'sn-popover.vue'), 'utf8');
    const templateStart = source.indexOf('<!-- #ifdef APP -->');
    const templateEnd = source.indexOf('<!-- #endif -->', templateStart);
    expect(templateStart, 'the catcher must be gated for App only').toBeGreaterThan(-1);
    expect(templateEnd).toBeGreaterThan(templateStart);
    const gated = source.slice(templateStart, templateEnd);
    expect(gated).toContain('sn-popover__trigger-catcher');
    expect(gated).toContain('@tap.stop="onTriggerTap"');
    expect(gated).toContain('hover-class="sn-popover__trigger-catcher--pressed"');
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
    const source = readFileSync(resolve(import.meta.dirname, 'sn-popover.vue'), 'utf8');
    const triggerRule = source.slice(
      source.indexOf('.sn-popover__trigger {'),
      source.indexOf('}', source.indexOf('.sn-popover__trigger {')),
    );
    expect(triggerRule).toContain('position: relative');
    const cssStart = source.indexOf('/* #ifdef APP */', source.indexOf('<style'));
    const cssEnd = source.indexOf('/* #endif */', cssStart);
    expect(cssStart).toBeGreaterThan(-1);
    expect(cssEnd).toBeGreaterThan(cssStart);
    const css = source.slice(cssStart, cssEnd);
    expect(css).toContain('.sn-popover__trigger-catcher {');
    expect(css).toContain('position: absolute');
    expect(css).toContain('var(--sn-mp-color-background-soft)');
  });
});

describe('sn-popover (rich card body, additive)', () => {
  it('renders the card header with glyph plate, title and subtitle', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, title: 'Alignment', subtitle: '2 minutes ago', icon: 'Star' },
    });
    expect(w.find('.sn-popover__head').exists()).toBe(true);
    expect(w.find('.sn-popover__title').text()).toBe('Alignment');
    expect(w.find('.sn-popover__subtitle').text()).toBe('2 minutes ago');
    expect(w.find('.sn-popover__icon-plate').exists()).toBe(true);
  });

  it('keeps the plain text bubble when no header part is set', () => {
    const w = mount(SnPopover, { props: { modelValue: true, content: '纯文本' } });
    expect(w.find('.sn-popover__head').exists()).toBe(false);
    expect(w.find('.sn-popover__text').text()).toBe('纯文本');
  });

  it('separates the description from a header with the sibling rule', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, title: '标题', content: '描述文字' },
    });
    expect(w.find('.sn-popover__title').exists()).toBe(true);
    expect(w.find('.sn-popover__text').text()).toBe('描述文字');
  });

  it('prefers iconData over iconUrl and icon for the header glyph', () => {
    const w = mount(SnPopover, {
      props: {
        modelValue: true,
        title: '三源',
        iconData: Star,
        iconUrl: 'https://example.com/a.png',
        icon: 'arrow-up',
      },
    });
    expect(w.find('.sn-popover__icon-plate svg path').attributes('d')).toBe(Star.paths[0]);
    expect(w.find('.sn-popover__icon-image').exists()).toBe(false);
  });

  it('renders iconUrl as the header glyph image and it beats icon', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, title: '图', iconUrl: 'https://example.com/b.png', icon: 'Star' },
    });
    expect(w.find('.sn-popover__icon-image').attributes('src')).toBe('https://example.com/b.png');
    expect(w.find('.sn-popover__icon-plate svg').exists()).toBe(false);
  });

  it('resolves the header glyph name through the SnIcon chain', () => {
    const w = mount(SnPopover, { props: { modelValue: true, title: '升', icon: 'arrow-up' } });
    expect(w.find('.sn-popover__icon-plate svg').exists()).toBe(true);
  });

  it('scales the header glyph through the icon plate tokens', () => {
    const w = mount(SnPopover, { props: { title: 'T', icon: 'Star' } });
    expect(w.attributes('style') ?? '').not.toContain('--sn-popover-icon-size');
    expect(w.find('.sn-popover__icon-plate').exists()).toBe(false);
  });

  it('moves the close button into the header row', async () => {
    const w = mount(SnPopover, { props: { modelValue: true, title: '标题', showClose: true } });
    const close = w.find('.sn-popover__head .sn-popover__close');
    expect(close.exists()).toBe(true);
    await close.trigger('tap');
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('renders a close-only header when showClose is set without a title', async () => {
    const w = mount(SnPopover, { props: { modelValue: true, showClose: true, content: 'A' } });
    expect(w.find('.sn-popover__head').exists()).toBe(true);
    await w.find('.sn-popover__close').trigger('tap');
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('renders action pills and emits actionclick with the item and index', async () => {
    const actions = [{ label: 'Dismiss' }, { label: '删除', type: 'danger' as const }];
    const w = mount(SnPopover, { props: { modelValue: true, actions } });
    const pills = w.findAll('.sn-popover__action');
    expect(pills).toHaveLength(2);
    await pills[1]!.trigger('tap');
    expect(w.emitted('actionclick')?.[0]).toEqual([{ item: actions[1], index: 1 }]);
    // closeOnAction defaults to true: the bubble folds after the action tap.
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('ignores disabled action pills', async () => {
    const actions = [{ label: '禁用', disabled: true }];
    const w = mount(SnPopover, { props: { modelValue: true, actions } });
    await w.find('.sn-popover__action').trigger('tap');
    expect(w.emitted('actionclick')).toBeUndefined();
    expect(w.find('.sn-popover__action').attributes('aria-disabled')).toBe('true');
  });

  it('keeps the bubble open when closeOnAction is false', async () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, actions: [{ label: 'Stay' }], closeOnAction: false },
    });
    await w.find('.sn-popover__action').trigger('tap');
    expect(w.emitted('actionclick')).toHaveLength(1);
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('renders rich menu rows with a muted description line', () => {
    const w = mount(SnPopover, {
      props: {
        modelValue: true,
        mode: 'menu',
        content: [{ content: 'Share Link', description: 'Send via messaging app' }],
      },
    });
    expect(w.find('.sn-popover__menu-text').text()).toBe('Share Link');
    expect(w.find('.sn-popover__menu-desc').text()).toBe('Send via messaging app');
  });
});

describe('sn-popover (sheet presentation, additive)', () => {
  it('renders the fixed bottom sheet instead of the anchored bubble', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, presentation: 'sheet', title: 'Share Options' },
    });
    expect(w.find('.sn-popover__sheet').exists()).toBe(true);
    expect(w.find('.sn-popover__pop').exists()).toBe(false);
    expect(w.find('.sn-popover__sheet-mask').exists()).toBe(true);
    expect(w.find('.sn-popover__sheet-handle').exists()).toBe(true);
    expect(w.find('.sn-popover__sheet-title').text()).toBe('Share Options');
  });

  it('hides the arrow in sheet mode even when visibleArrow stays true', () => {
    const w = mount(SnPopover, { props: { modelValue: true, presentation: 'sheet' } });
    expect(w.find('.sn-popover__arrow').exists()).toBe(false);
  });

  it('keeps the anchored bubble for the default presentation', () => {
    const w = mount(SnPopover, { props: { modelValue: true } });
    expect(w.find('.sn-popover__pop').exists()).toBe(true);
    expect(w.find('.sn-popover__sheet').exists()).toBe(false);
  });

  it('closes through the sheet mask tap', async () => {
    const w = mount(SnPopover, { props: { modelValue: true, presentation: 'sheet' } });
    await w.find('.sn-popover__sheet-mask').trigger('tap');
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(w.emitted('close')).toHaveLength(1);
  });

  it('renders menu rows inside the sheet panel', () => {
    const w = mount(SnPopover, {
      props: {
        modelValue: true,
        presentation: 'sheet',
        mode: 'menu',
        content: [
          { content: 'Share Link', description: 'Send via messaging app', icon: 'Star' },
        ],
      },
    });
    const row = w.find('.sn-popover__menu--sheet .sn-popover__menu-item');
    expect(row.exists()).toBe(true);
    expect(w.find('.sn-popover__menu--sheet .sn-popover__menu-desc').text()).toBe(
      'Send via messaging app',
    );
    expect(w.find('.sn-popover__menu--sheet .sn-popover__icon-plate').exists()).toBe(true);
  });

  it('shows the Cancel pill when cancelText is set; its tap emits cancel and closes', async () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, presentation: 'sheet', cancelText: 'Cancel' },
    });
    expect(w.find('.sn-popover__cancel').exists()).toBe(true);
    await w.find('.sn-popover__cancel').trigger('tap');
    expect(w.emitted('cancel')).toHaveLength(1);
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('hides the Cancel pill when cancelText is empty', () => {
    const w = mount(SnPopover, { props: { modelValue: true, presentation: 'sheet' } });
    expect(w.find('.sn-popover__cancel').exists()).toBe(false);
  });

  it('emits menuclick from a sheet row and closes by default', async () => {
    const items = [{ content: 'Copy Link' }];
    const w = mount(SnPopover, {
      props: { modelValue: true, presentation: 'sheet', mode: 'menu', content: items },
    });
    await w.find('.sn-popover__menu-item').trigger('tap');
    expect(w.emitted('menuclick')?.[0]).toEqual([{ item: items[0], index: 0 }]);
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('renders action pills in the sheet with the same actionclick contract', async () => {
    const actions = [{ label: 'Dismiss' }];
    const w = mount(SnPopover, {
      props: { modelValue: true, presentation: 'sheet', actions },
    });
    const pill = w.find('.sn-popover__sheet-actions .sn-popover__action');
    expect(pill.exists()).toBe(true);
    await pill.trigger('tap');
    expect(w.emitted('actionclick')?.[0]).toEqual([{ item: actions[0], index: 0 }]);
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
  });
});

describe('sn-popover (per-row colored glyph plates, additive)', () => {
  it('renders a tinted plate for a menu row carrying iconBg / iconColor', () => {
    const w = mount(SnPopover, {
      props: {
        modelValue: true,
        mode: 'menu',
        content: [
          {
            content: '设为星标',
            iconData: Star,
            iconBg: 'var(--sn-mp-color-feedback-warning-soft)',
            iconColor: 'var(--sn-mp-color-feedback-warning)',
          },
        ],
      },
    });
    const plate = w.find('.sn-popover__menu-item .sn-popover__icon-plate');
    expect(plate.exists()).toBe(true);
    const style = plate.attributes('style') ?? '';
    expect(style).toContain('background-color: var(--sn-mp-color-feedback-warning-soft)');
    expect(style).toContain('color: var(--sn-mp-color-feedback-warning)');
    expect(plate.find('svg path').attributes('d')).toBe(Star.paths[0]);
  });

  it('keeps the bare glyph for untinted anchor rows', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, mode: 'menu', content: [{ content: '纯行', iconData: Star }] },
    });
    expect(w.find('.sn-popover__menu-item .sn-popover__icon-plate').exists()).toBe(false);
    expect(w.find('.sn-popover__menu-item .sn-popover__menu-icon').exists()).toBe(true);
  });

  it('colors sheet rows through the same tint fields', () => {
    const w = mount(SnPopover, {
      props: {
        modelValue: true,
        presentation: 'sheet',
        mode: 'menu',
        content: [
          { content: 'Share', iconData: Star, iconBg: '#e6f4ea', iconColor: '#188038' },
        ],
      },
    });
    const plate = w.find('.sn-popover__menu--sheet .sn-popover__icon-plate');
    expect(plate.exists()).toBe(true);
    expect(plate.attributes('style') ?? '').toContain('background-color: #e6f4ea');
    expect(plate.attributes('style') ?? '').toContain('color: #188038');
  });

  it('draws the arrow as a border-triangle fill, one shape with the card', () => {
    const source = readFileSync(resolve(import.meta.dirname, 'sn-popover.vue'), 'utf8');
    const blockOf = (selector: string): string => {
      const start = source.indexOf(selector);
      expect(start).toBeGreaterThan(-1);
      return source.slice(start, source.indexOf('}', start));
    };
    const arrowBlock = blockOf('.sn-popover__arrow {');
    expect(arrowBlock).toContain('width: 0');
    expect(arrowBlock).toContain('height: 0');
    expect(arrowBlock).toContain('border-style: solid');
    expect(arrowBlock).not.toContain('transform: rotate');
    expect(arrowBlock).not.toContain('box-shadow');
    expect(arrowBlock).not.toContain('sn-icon');
    // Apex points at the trigger per family; fill = the card color.
    expect(source).toContain('border-top-color: var(--sn-popover-bg)');
    expect(source).toContain('border-bottom-color: var(--sn-popover-bg)');
    expect(source).toContain('border-left-color: var(--sn-popover-bg)');
    expect(source).toContain('border-right-color: var(--sn-popover-bg)');
    // The base overlaps 4rpx INTO the card: the fill bridges the junction
    // band, so no fractional-pixel hairline seam can appear between the
    // arrow and the card edge (the seam measured 0.33px at exact-edge
    // alignment).
    expect(source).toContain('bottom: -12rpx');
    expect(source).toContain('top: -12rpx');
    // Gap 16rpx − 4rpx overlap → apex 2rpx short of the trigger edge.
    expect(source).toContain('calc(16rpx + var(--sn-popover-offset-y))');
    expect(source).not.toContain('calc(24rpx + var(--sn-popover-offset-y))');
  });
});

describe('sn-popover (primary action + strip spacing, additive)', () => {
  it('renders a filled primary pill (action-primary fill, on-primary label)', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, actions: [{ label: '知道了', type: 'primary' }] },
    });
    const pill = w.find('.sn-popover__action--primary');
    expect(pill.exists()).toBe(true);
    const source = readFileSync(resolve(import.meta.dirname, 'sn-popover.vue'), 'utf8');
    const rule = source.indexOf('.sn-popover__action--primary {');
    const block = source.slice(rule, source.indexOf('}', rule));
    expect(block).toContain('background-color: var(--sn-mp-color-action-primary)');
    const textRule = source.indexOf('.sn-popover__action--primary .sn-popover__action-text {');
    const textBlock = source.slice(textRule, source.indexOf('}', textRule));
    expect(textBlock).toContain('color: var(--sn-mp-color-text-on-primary)');
  });

  it('pads the actions strip so the pill never touches the card edge', () => {
    const source = readFileSync(resolve(import.meta.dirname, 'sn-popover.vue'), 'utf8');
    const rule = source.indexOf('.sn-popover__actions {');
    const block = source.slice(rule, source.indexOf('}', rule));
    expect(block).toContain('padding: 0 var(--sn-mp-spacing-4) var(--sn-mp-spacing-4)');
    // The sheet's own strip carries no extra padding — its panel pads the
    // content, plus the device safe-area at the bottom edge.
    const sheetRule = source.indexOf('.sn-popover__sheet-actions {');
    const sheetBlock = source.slice(sheetRule, source.indexOf('}', sheetRule));
    expect(sheetBlock).not.toContain('margin-bottom');
    const panelRule = source.indexOf('.sn-popover__sheet-panel {');
    const panelBlock = source.slice(panelRule, source.indexOf('}', panelRule));
    expect(panelBlock).toContain('env(safe-area-inset-bottom)');
    // The sheet Cancel pill uses the primary button style.
    const cancelRule = source.indexOf('.sn-popover__cancel {');
    const cancelBlock = source.slice(cancelRule, source.indexOf('}', cancelRule));
    expect(cancelBlock).toContain('background-color: var(--sn-mp-color-action-primary)');
    const cancelTextRule = source.indexOf('.sn-popover__cancel-text {');
    const cancelTextBlock = source.slice(cancelTextRule, source.indexOf('}', cancelTextRule));
    expect(cancelTextBlock).toContain('color: var(--sn-mp-color-text-on-primary)');
  });
});
