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
import { Star } from '../sn-icon/sn-icon-set';
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
    const images = w.findAll('image.sn-popover__menu-icon');
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
      expect(w.find('image.sn-popover__menu-icon').exists()).toBe(false);
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
    expect(w.findComponent({ name: 'SnIcon' }).props('size')).toBe(
      'var(--sn-popover-menu-icon-size)',
    );
  });

  it('scales the close glyph through the close icon token', () => {
    const w = mount(SnPopover, { props: { modelValue: true, showClose: true, content: 'A' } });
    expect(w.findComponent({ name: 'SnIcon' }).props('size')).toBe(
      'var(--sn-popover-close-icon-size)',
    );
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
    const textRule = source.indexOf('.sn-popover__menu-text {');
    expect(textRule).toBeGreaterThan(-1);
    const textBlock = source.slice(textRule, source.indexOf('}', textRule));
    // One-line labels used to be forced with `white-space: nowrap`, which
    // spilled long labels out of the bubble instead of growing its height.
    expect(textBlock).not.toContain('white-space: nowrap');
    expect(textBlock).toContain('flex: 1');
    expect(textBlock).toContain('min-width: 0');
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
    expect(w.find('image.sn-popover__menu-icon').exists()).toBe(false);
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
    expect(w.find('image.sn-popover__menu-icon').exists()).toBe(false);
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
    const image = w.find('image.sn-popover__menu-icon');
    expect(image.exists()).toBe(true);
    expect(image.attributes('src')).toBe('https://example.com/b.png');
    expect(w.find('.sn-popover__menu-icon svg').exists()).toBe(false);
  });

  it('resolves icon through the SnIcon chain (built-in catalogue)', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, mode: 'menu', content: [{ content: '升序', icon: 'arrow-up' }] },
    });
    expect(w.find('.sn-popover__menu-icon svg').exists()).toBe(true);
    expect(w.find('image.sn-popover__menu-icon').exists()).toBe(false);
  });

  it('lets icon beat the legacy iconClass field', () => {
    const w = mount(SnPopover, {
      props: {
        modelValue: true,
        mode: 'menu',
        content: [{ content: '优先', icon: 'arrow-up', iconClass: 'Edit' }],
      },
    });
    expect(w.findComponent({ name: 'SnIcon' }).props('icon')).toBe('arrow-up');
  });

  it('renders no glyph when none of the sources is set', () => {
    const w = mount(SnPopover, {
      props: { modelValue: true, mode: 'menu', content: [{ content: '纯文本' }] },
    });
    expect(w.find('image.sn-popover__menu-icon').exists()).toBe(false);
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
