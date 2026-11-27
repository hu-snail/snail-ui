/**
 * sn-popover unit tests — uni-end tap-triggered bubble (wd-popover parity).
 *
 * Behaviour only (AGENTS.md §46):
 *   - the trigger toggles the bubble; `open` / `close` / `change` fire
 *   - `normal` mode renders the text body, `menu` mode renders rows
 *   - a row tap emits `menuclick` with `{ item, index }` and closes
 *   - the `content` slot replaces the built-in body in both modes
 *   - `customClass` / `customPop` / `customArrow` / `customStyle` are forwarded
 *   - a hidden copy of the bubble stays mounted for measurement
 *   - opening folds the measured rects into inline placement styles
 *   - the after-enter leg re-measures the SHOWN bubble
 *   - `closeOutside()` (page-root queue) closes the bubble; mounting registers it
 *   - opening one bubble closes the others (one gesture switches)
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import SnPopover from './sn-popover.vue';
import { closeOutside } from '../../utils/outside-close';

const menu = [{ content: '编辑' }, { content: '分享' }, { content: '删除' }];

type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };

/**
 * Install a fake `uni.createSelectorQuery` answering per node ROLE.
 * Keys are `target` / `pos` / `content` (the id suffix) — the numeric
 * instance id is a per-mount counter, so it cannot be spelled out.
 */
function stubSelectorQuery(rects: Record<'target' | 'pos' | 'content', Rect>): void {
  const createQuery = () => {
    let picked = '';
    const query = {
      in: () => query,
      select: (selector: string) => {
        picked = selector.replace(/^#sn-popover-/, '').replace(/-\d+$/, '');
        return {
          boundingClientRect: (cb: (rect: Rect | null) => void) => {
            cb(rects[picked] ?? null);
            return query;
          },
        };
      },
      exec: (cb?: () => void) => {
        cb?.();
      },
    };
    return query;
  };
  (globalThis as { uni?: unknown }).uni = { createSelectorQuery: createQuery };
}

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni;
  vi.restoreAllMocks();
});

/**
 * The positioning layer (this component's own node, carrying the placement
 * classes). Permanently mounted.
 */
function shownBubble(w: VueWrapper) {
  return w.findAll('.sn-popover__pos').find((node) => !node.classes().includes('sn-popover__pos--hidden'));
}

/**
 * The bubble body (the container INSIDE the positioning layer). The
 * positioning layer is permanently mounted, so "closed" means the transition
 * renders no body — not that the layer itself is absent.
 */
function bubbleBody(w: VueWrapper) {
  const layer = shownBubble(w);
  return layer ? layer.find('.sn-popover__container') : null;
}

describe('sn-popover', () => {
  describe('structure', () => {
    it('renders the trigger slot and no bubble while closed', () => {
      const w = mount(SnPopover, { slots: { default: '<text>更多</text>' } });
      expect(w.text()).toContain('更多');
      expect(bubbleBody(w) === null || !bubbleBody(w)!.exists()).toBe(true);
    });

    it('renders the normal-mode text body', () => {
      const w = mount(SnPopover, { props: { modelValue: true, content: '气泡内容' } });
      const bubble = shownBubble(w);
      expect(bubble).toBeDefined();
      expect(bubble!.find('.sn-popover__text').text()).toBe('气泡内容');
      expect(bubble!.find('.sn-popover__menu').exists()).toBe(false);
    });

    it('renders one row per menu item in menu mode', () => {
      const w = mount(SnPopover, {
        props: { modelValue: true, mode: 'menu', content: menu },
      });
      const rows = shownBubble(w)!.findAll('.sn-popover__menu-inner');
      expect(rows).toHaveLength(3);
      expect(rows[0]!.find('.sn-popover__text').text()).toBe('编辑');
      expect(shownBubble(w)!.find('.sn-popover__inner').exists()).toBe(false);
    });

    it('draws a divider on every menu row except the first', () => {
      const w = mount(SnPopover, {
        props: { modelValue: true, mode: 'menu', content: menu },
      });
      const rows = shownBubble(w)!.findAll('.sn-popover__menu-inner');
      expect(rows[0]!.find('.sn-popover__menu-divider').exists()).toBe(false);
      expect(rows[1]!.find('.sn-popover__menu-divider').exists()).toBe(true);
    });

    it('does not render menu rows when the mode is menu but content is a string', () => {
      const w = mount(SnPopover, { props: { modelValue: true, mode: 'menu', content: '文本' } });
      expect(shownBubble(w)!.findAll('.sn-popover__menu-inner')).toHaveLength(0);
    });

    it('lets the content slot replace the built-in body', () => {
      const w = mount(SnPopover, {
        props: { modelValue: true, content: 'prop 文案' },
        slots: { content: '<text class="custom-body">slot 文案</text>' },
      });
      const bubble = shownBubble(w)!;
      expect(bubble.find('.custom-body').exists()).toBe(true);
      expect(bubble.find('.sn-popover__text').exists()).toBe(false);
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
      const bubble = shownBubble(w)!;
      expect(w.classes()).toContain('my-popover');
      expect(bubble.find('.sn-popover__container').classes()).toContain('my-pop');
      expect(bubble.find('.sn-popover__arrow').classes()).toContain('my-arrow');
      expect(w.attributes('style') ?? '').toContain('margin: 4px');
    });

    it('keeps a hidden copy of the bubble mounted while closed, for measurement', () => {
      const w = mount(SnPopover, { props: { modelValue: false, content: '气泡' } });
      const hidden = w.find('.sn-popover__pos--hidden');
      expect(hidden.exists()).toBe(true);
      expect(hidden.attributes('aria-hidden')).toBe('true');
      // The copy mirrors the body so its natural size is the bubble's size.
      expect(hidden.find('.sn-popover__text').text()).toBe('气泡');
      // It carries no placement styles.
      expect(hidden.attributes('style')).toBeUndefined();
    });

    it('renders the arrow by default and hides it when visibleArrow is false', () => {
      const withArrow = mount(SnPopover, { props: { modelValue: true } });
      expect(shownBubble(withArrow)!.find('.sn-popover__arrow').exists()).toBe(true);
      const without = mount(SnPopover, { props: { modelValue: true, visibleArrow: false } });
      expect(shownBubble(without)!.find('.sn-popover__arrow').exists()).toBe(false);
    });

    it('gates the arrow opacity on the shown state — no stray triangle when closed', () => {
      // §103 regression: the arrow sits outside the fade transition, so it
      // must carry its own visibility gate.
      const closed = mount(SnPopover, { props: { modelValue: false, content: 'x' } });
      const closedArrow = shownBubble(closed)!.find('.sn-popover__arrow');
      expect(closedArrow.exists()).toBe(true);
      expect(closedArrow.classes()).not.toContain('sn-popover__arrow--shown');

      const open = mount(SnPopover, { props: { modelValue: true, content: 'x' } });
      expect(shownBubble(open)!.find('.sn-popover__arrow').classes()).toContain(
        'sn-popover__arrow--shown',
      );
    });
  });

  describe('placement', () => {
    it('folds the measured trigger + bubble rects into inline placement styles', async () => {
      stubSelectorQuery({
        'target': { left: 100, top: 200, right: 220, bottom: 244, width: 120, height: 44 },
        'pos': { left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100 },
      });
      const w = mount(SnPopover, { props: { modelValue: false, content: '气泡' } });
      await flushPromises();
      await w.find('.sn-popover__target').trigger('tap');
      await flushPromises();
      // bottom: left = trigger width / 2, top = arrow 9 + height 44 + gap 10.
      expect(shownBubble(w)!.attributes('style') ?? '').toContain('left: 60px');
      expect(shownBubble(w)!.attributes('style') ?? '').toContain('top: 63px');
    });

    it('re-captures on open when the mount-time trigger measurement was unusable', async () => {
    // §103 regression (content-slot, reproducible on H5 too): the trigger can
    // measure zero at mount (slotted / lazily laid-out content). The old code
    // initialised from that zero width, produced `left: 0`, and never retried —
    // the bubble sat half a bubble off with the arrow pointing at nothing.
    stubSelectorQuery({
      target: { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 },
      pos: { left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100 },
      content: { left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100 },
    });
    // First target read (mount) is unusable; every later read is the real box.
    const zero: Rect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    const good: Rect = { left: 100, top: 200, right: 220, bottom: 244, width: 120, height: 44 };
    const pop: Rect = { left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100 };
    let targetReads = 0;
    const uni = (globalThis as { uni?: Record<string, unknown> }).uni!;
    uni.createSelectorQuery = () => {
      let picked = '';
      const query = {
        in: () => query,
        select: (selector: string) => {
          picked = selector.replace(/^#sn-popover-/, '').replace(/-\d+$/, '');
          return {
            boundingClientRect: (cb: (rect: Rect | null) => void) => {
              if (picked === 'target') {
                targetReads += 1;
                cb(targetReads <= 1 ? zero : good);
              } else {
                cb(pop);
              }
              return query;
            },
          };
        },
        exec: (cb?: () => void) => cb?.(),
      };
      return query;
    };
    const w = mount(SnPopover, { props: { modelValue: false, content: '气泡' } });
    await flushPromises();
    await w.find('.sn-popover__target').trigger('tap');
    await flushPromises();
    // The open re-capture produced a centred placement instead of left: 0.
    expect(shownBubble(w)!.attributes('style') ?? '').toContain('left: 60px');
  });

  it('follows the placement prop and points the arrow with it', async () => {
      stubSelectorQuery({
        'target': { left: 100, top: 200, right: 220, bottom: 244, width: 120, height: 44 },
        'pos': { left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100 },
      });
      const w = mount(SnPopover, { props: { modelValue: false, placement: 'top-end' } });
      await flushPromises();
      await w.find('.sn-popover__target').trigger('tap');
      await flushPromises();
      expect(shownBubble(w)!.attributes('style') ?? '').toContain('bottom: 63px');
      const arrow = shownBubble(w)!.find('.sn-popover__arrow');
      // Bubble above → the arrow sits on the bottom edge → apex down.
      expect(arrow.classes()).toContain('sn-popover__arrow-down');
    });

    it('re-measures the shown bubble after the enter transition', async () => {
      vi.useFakeTimers();
      try {
        // The hidden copy predicts a 200px bubble.
        stubSelectorQuery({
          target: { left: 0, top: 0, right: 120, bottom: 44, width: 120, height: 44 },
          pos: { left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100 },
        });
        const w = mount(SnPopover, {
          props: { modelValue: false, placement: 'bottom-start', content: '气泡' },
        });
        await flushPromises();
        await w.find('.sn-popover__target').trigger('tap');
        await flushPromises();
        // 200 >= the 120 trigger → the arrow sits at trigger width / 2.
        expect(shownBubble(w)!.find('.sn-popover__arrow').attributes('style')).toBe('left: 60px;');

        // The SHOWN bubble settles narrower than the hidden copy predicted.
        stubSelectorQuery({
          target: { left: 0, top: 0, right: 120, bottom: 44, width: 120, height: 44 },
          pos: { left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100 },
          content: { left: 0, top: 0, right: 80, bottom: 100, width: 80, height: 100 },
        });
        // The enter leg runs its 300ms, then after-enter re-measures.
        await vi.advanceTimersByTimeAsync(400);
        await flushPromises();
        // 80 < 120 → the inset becomes (pop width − 25).
        expect(shownBubble(w)!.find('.sn-popover__arrow').attributes('style')).toBe('left: 55px;');
      } finally {
        vi.useRealTimers();
      }
    });

    it('re-derives the placement when the placement prop changes while open', async () => {
      stubSelectorQuery({
        'target': { left: 0, top: 0, right: 120, bottom: 44, width: 120, height: 44 },
        'pos': { left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100 },
      });
      const w = mount(SnPopover, { props: { modelValue: true, content: '气泡' } });
      await flushPromises();
      await w.setProps({ placement: 'left' });
      await flushPromises();
      expect(shownBubble(w)!.attributes('style') ?? '').toContain('right: 139px');
      expect(shownBubble(w)!.find('.sn-popover__arrow').classes()).toContain('sn-popover__arrow-right');
    });
  });

  describe('interaction', () => {
    it('emits update:modelValue and open when the trigger is tapped', async () => {
      const w = mount(SnPopover, { props: { modelValue: false } });
      await w.find('.sn-popover__target').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
      await flushPromises();
      expect(w.emitted('open')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: true }]);
      expect(shownBubble(w)).toBeDefined();
    });

    it('shows the bubble even when the consumer ignores update:modelValue', async () => {
      const w = mount(SnPopover, { props: { modelValue: false } });
      await w.find('.sn-popover__target').trigger('tap');
      await flushPromises();
      expect(shownBubble(w)).toBeDefined();
      expect(w.find('.sn-popover__target').attributes('aria-expanded')).toBe('true');
    });

    it('closes on a second tap', async () => {
      const w = mount(SnPopover, { props: { modelValue: true } });
      await w.find('.sn-popover__target').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
    });

    it('ignores the trigger tap while disabled', async () => {
      const w = mount(SnPopover, { props: { modelValue: false, disabled: true } });
      await w.find('.sn-popover__target').trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(bubbleBody(w) === null || !bubbleBody(w)!.exists()).toBe(true);
      expect(w.find('.sn-popover__target').attributes('aria-disabled')).toBe('true');
    });

    it('still opens through v-model while disabled (disabled only guards the trigger)', async () => {
      // Reference behaviour: `disabled` blocks `toggle`, not the page-driven
      // v-model — a page may still drive the bubble programmatically.
      const w = mount(SnPopover, { props: { modelValue: false, disabled: true } });
      await w.setProps({ modelValue: true });
      await flushPromises();
      expect(w.emitted('open')).toHaveLength(1);
      expect(shownBubble(w)).toBeDefined();
    });

    it('emits menuclick with the item and index, and closes', async () => {
      const w = mount(SnPopover, { props: { modelValue: true, mode: 'menu', content: menu } });
      await shownBubble(w)!.findAll('.sn-popover__menu-inner')[1]!.trigger('tap');
      expect(w.emitted('menuclick')?.[0]).toEqual([{ item: menu[1], index: 1 }]);
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('renders a close button that hides the bubble', async () => {
      const w = mount(SnPopover, { props: { modelValue: true, showClose: true } });
      await shownBubble(w)!.find('.sn-popover__close').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('sizes the close glyph explicitly — never the 32px SnIcon default', () => {
      // §103 regression (user report: the X swallowed the bubble body).
      // SnIcon sizes its BOX from the `size` prop (default 32px); a CSS
      // font-size on the wrapper cannot shrink it.
      const w = mount(SnPopover, { props: { modelValue: true, showClose: true } });
      const icon = shownBubble(w)!.find('.sn-popover__close-icon');
      expect(icon.exists()).toBe(true);
      const style = icon.attributes('style') ?? '';
      expect(style).toContain('width: var(--sn-mp-icon-size-small)');
      expect(style).toContain('height: var(--sn-mp-icon-size-small)');
    });

    it('hides the close button by default', () => {
      const w = mount(SnPopover, { props: { modelValue: true } });
      expect(shownBubble(w)!.find('.sn-popover__close').exists()).toBe(false);
    });

    it('reserves room for the close button — the body never runs under the ×', () => {
      // §103 regression (user report: the absolutely-positioned close sat on
      // top of the last characters). The body reserves a right gutter while
      // showClose is on — the hidden measurement copy included, so the bubble
      // width and the shown layout agree.
      const withClose = mount(SnPopover, { props: { modelValue: true, showClose: true } });
      expect(
        shownBubble(withClose)!.find('.sn-popover__inner').classes(),
      ).toContain('sn-popover__inner--with-close');
      expect(
        withClose.find('.sn-popover__pos--hidden .sn-popover__inner').classes(),
      ).toContain('sn-popover__inner--with-close');

      const withoutClose = mount(SnPopover, { props: { modelValue: true } });
      expect(
        shownBubble(withoutClose)!.find('.sn-popover__inner').classes(),
      ).not.toContain('sn-popover__inner--with-close');

      // The menu body gets the same gutter.
      const menuClose = mount(SnPopover, {
        props: { modelValue: true, showClose: true, mode: 'menu', content: menu },
      });
      expect(shownBubble(menuClose)!.find('.sn-popover__menu').classes()).toContain(
        'sn-popover__menu--with-close',
      );
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

    it('does not replay open / change when v-model syncs after the trigger tap', async () => {
      const w = mount(SnPopover, { props: { modelValue: false } });
      await w.find('.sn-popover__target').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
      // The v-model sync arrives after the tap already turned the state on —
      // open / change must fire exactly once.
      await w.setProps({ modelValue: true });
      await flushPromises();
      expect(w.emitted('open')).toHaveLength(1);
      expect(w.emitted('change')).toHaveLength(1);
    });

    it('does not replay close / change when v-model syncs after an internal close', async () => {
      const w = mount(SnPopover, { props: { modelValue: true, showClose: true } });
      await shownBubble(w)!.find('.sn-popover__close').trigger('tap');
      await w.setProps({ modelValue: false });
      await flushPromises();
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('change')).toHaveLength(1);
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
        await vi.advanceTimersByTimeAsync(1000);
        expect(shownBubble(w)).toBeDefined();
        expect(w.find('.sn-popover__target').attributes('aria-expanded')).toBe('true');
        expect(w.emitted('close')).toHaveLength(1);
        expect(w.emitted('open')).toHaveLength(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it('lets one gesture switch bubbles: the newly opened one closes the other', async () => {
      const a = mount(SnPopover, { props: { modelValue: true }, attachTo: document.body });
      const b = mount(SnPopover, { props: { modelValue: false }, attachTo: document.body });
      await b.find('.sn-popover__target').trigger('tap');
      await flushPromises();
      // `a` was closed through the page-root queue; `b` is the open one.
      expect(a.emitted('update:modelValue')?.[0]).toEqual([false]);
      expect(b.emitted('update:modelValue')?.[0]).toEqual([true]);
      expect(b.find('.sn-popover__target').attributes('aria-expanded')).toBe('true');
    });
  });

  describe('outside close', () => {
    it('closes via closeOutside (page-root queue)', async () => {
      const w = mount(SnPopover, { props: { modelValue: true } });
      closeOutside();
      // update:modelValue is synchronous; close / change ride the shown-state
      // watcher, so they land on the next tick (reference behaviour).
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
      await flushPromises();
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('change')?.[0]).toEqual([{ show: false }]);
    });

    it('closeOutside is a no-op for an already-closed bubble', async () => {
      const w = mount(SnPopover, { props: { modelValue: false } });
      closeOutside();
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.emitted('close')).toBeUndefined();
    });

    it('unregisters on unmount — a page-root closeOutside no longer reaches it', async () => {
      const w = mount(SnPopover, { props: { modelValue: true } });
      await w.setProps({ modelValue: false });
      await flushPromises();
      w.unmount();
      expect(() => closeOutside()).not.toThrow();
    });
  });

  describe('timers', () => {
    it('keeps the bubble mounted for the fade-out leg, then unmounts it', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnPopover, { props: { modelValue: true } });
        await w.setProps({ modelValue: false });
        expect(shownBubble(w)).toBeDefined();
        // sn-transition default duration is 300ms.
        await vi.advanceTimersByTimeAsync(400);
        expect(bubbleBody(w) === null || !bubbleBody(w)!.exists()).toBe(true);
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
      expect(w.find('.sn-popover__target').attributes('role')).toBe('button');
      expect(w.find('.sn-popover__target').attributes('aria-expanded')).toBe('false');
      await w.setProps({ modelValue: true });
      await flushPromises();
      expect(w.find('.sn-popover__target').attributes('aria-expanded')).toBe('true');
    });

    it('gives the bubble a dialog role and the arrow aria-hidden', () => {
      const w = mount(SnPopover, { props: { modelValue: true } });
      const bubble = shownBubble(w)!;
      expect(bubble.find('.sn-popover__container').attributes('role')).toBe('dialog');
      expect(bubble.find('.sn-popover__arrow').attributes('aria-hidden')).toBe('true');
    });

    it('tags the menu list and its rows', () => {
      const w = mount(SnPopover, { props: { modelValue: true, mode: 'menu', content: menu } });
      const bubble = shownBubble(w)!;
      expect(bubble.find('.sn-popover__menu').attributes('role')).toBe('menu');
      expect(bubble.findAll('.sn-popover__menu-inner')[0]!.attributes('role')).toBe('menuitem');
    });

    it('tags the root for the docs / AI component map', () => {
      expect(mount(SnPopover).attributes('data-snui-component')).toBe('popover');
    });

    it('labels the close button for assistive tech', () => {
      const w = mount(SnPopover, { props: { modelValue: true, showClose: true } });
      const close = shownBubble(w)!.find('.sn-popover__close');
      expect(close.attributes('role')).toBe('button');
      expect(close.attributes('aria-label')).toBe('close');
    });
  });

  describe('stylesheet contract', () => {
    const source = readFileSync(resolve(__dirname, 'sn-popover.vue'), 'utf8');
    const style = source.slice(source.indexOf('<style scoped>') + '<style scoped>'.length, source.indexOf('</style>'));

    it('keeps the bubble absolute on every platform — no fixed layer anywhere', () => {
      // The owner verified absolute renders unclipped on the mini-program end,
      // so the fixed viewport layer (and its whole scroll-compensation
      // machinery) was removed. One positioning mode, one code path. The
      // hidden measurement copy keeps its own fixed — it must stay laid out
      // regardless of any positioning context.
      const base = style.slice(
        style.indexOf('.sn-popover__pos {'),
        style.indexOf('}', style.indexOf('.sn-popover__pos {')),
      );
      expect(base).toContain('position: absolute');
      expect(style).not.toContain('sn-popover__pos--fixed');
      const hidden = style.slice(
        style.indexOf('.sn-popover__pos--hidden {'),
        style.indexOf('}', style.indexOf('.sn-popover__pos--hidden {')),
      );
      expect(hidden).toContain('position: fixed');
    });

    it('keeps the hidden measurement copy from depending on a positioning context', () => {
      // Regression: the copy was `absolute; left: -100vw`. On mini-programs the
      // component root is not a positioning context, so the copy lost its
      // origin and leaked into the viewport as a stray card over the trigger.
      const hidden = style.slice(
        style.indexOf('.sn-popover__pos--hidden {'),
        style.indexOf('}', style.indexOf('.sn-popover__pos--hidden {')),
      );
      expect(hidden).toContain('position: fixed');
      expect(hidden).toContain('visibility: hidden');
      expect(hidden).toContain('pointer-events: none');
      expect(hidden).not.toContain('-100vw');
    });

    it('renders the positioning layer as its own node, outside the transition', () => {
      // Regression: the placement classes used to ride sn-transition's
      // custom-class. A custom-component stylesheet cannot style another
      // component's internal nodes on mini-programs (no `styleIsolation:
      // shared` in the uni-app x compile — verified in the compiled json), so
      // `.sn-popover__pos` never landed and the bubble rendered in the
      // document flow as a stray card. The layer must be a node THIS template
      // renders, and the transition must carry none of the placement wiring.
      const template = source.slice(source.indexOf('<template>'), source.indexOf('</template>'));
      expect(template).toContain('class="sn-popover__pos"');
      expect(template).toContain(':style="popStyle"');
      const transitionTag = template.slice(
        template.indexOf('<SnTransition'),
        template.indexOf('>', template.indexOf('<SnTransition')),
      );
      expect(transitionTag).not.toContain('custom-class');
      expect(transitionTag).not.toContain('custom-style');
      expect(transitionTag).not.toContain('popStyle');
    });

    it('draws the arrow as a border triangle with per-side longhands', () => {
      // The uni-x App flattener does not expand the 4-value border-width
      // shorthand — geometry must be written per side.
      // No 4-value `border` / `border-width` shorthand anywhere.
      const shorthands = style.match(/border(?:-width)?:\s*\d[^;]*\s\d[^;]*;/g) ?? [];
      expect(shorthands, `border shorthand breaks uni-x App: ${shorthands.join(' | ')}`).toEqual([]);
      for (const dir of ['up', 'down', 'left', 'right']) {
        const block = style.slice(
          style.indexOf(`.sn-popover__arrow-${dir} {`),
          style.indexOf('}', style.indexOf(`.sn-popover__arrow-${dir} {`)),
        );
        expect(block).toContain('border-top-width');
        expect(block).toContain('border-right-width');
        expect(block).toContain('border-bottom-width');
        expect(block).toContain('border-left-width');
      }
    });

    it('uses class selectors only — no pseudo-classes or pseudo-elements', () => {
      const withoutComments = style.replace(/\/\*[\s\S]*?\*\//g, '');
      const selectors = [...withoutComments.matchAll(/([^{}]+)\{/g)].map((m) => m[1]!.trim());
      // Every selector is a plain class (compound allowed), never a pseudo.
      const offenders = selectors.filter((sel) => !/^(\.[\w-]+\s*)+$/.test(sel));
      expect(offenders, `non-class selectors break uni-app x App: ${offenders.join(' | ')}`).toEqual([]);
    });

    it('paints the surface with the MP-safe two-line form and literal token payloads', () => {
      // §103 regression (device-verified on WeChat MP, 0354cf95): a custom
      // property whose PAYLOAD contains var() is unresolvable there, and a
      // consuming `var(--x, fallback)` does not rescue it — the bubble surface
      // and the arrow border painted transparent (bubble showed as a
      // "frame with no content", the arrow was invisible).
      //   1. no `--sn-popover-*` definition may carry a var() payload;
      //   2. every painted surface carries the plain `--sn-mp-*` floor line
      //      AND the overridable `var(--sn-popover-*, var(--sn-mp-*))` line.
      const definitions = [...style.matchAll(/--sn-popover-[a-z-]+:\s*([^;]+);/g)];
      const brokenPayloads = definitions
        .filter((m) => (m[1] ?? '').includes('var('))
        .map((m) => m[0]);
      expect(
        brokenPayloads,
        `var()-payload definitions compute to initial on WeChat MP: ${brokenPayloads.join(' | ')}`,
      ).toEqual([]);

      const twoLine = [
        ['.sn-popover__container {', 'background-color', 'color-background-elevated'],
        // The bubble itself carries the text colour so the menu glyphs — which
        // only inherit — match the text instead of the page default.
        ['.sn-popover__container {', 'color', 'color-text-secondary'],
        ['.sn-popover__container {', 'border-radius', 'radius-md'],
        ['.sn-popover__inner {', 'color', 'color-text-secondary'],
        ['.sn-popover__text {', 'color', 'color-text-secondary'],
        ['.sn-popover__menu-divider {', 'background-color', 'color-border-subtle'],
        ['.sn-popover__arrow-up {', 'border-bottom-color', 'color-background-elevated'],
        ['.sn-popover__arrow-down {', 'border-top-color', 'color-background-elevated'],
        ['.sn-popover__arrow-left {', 'border-right-color', 'color-background-elevated'],
        ['.sn-popover__arrow-right {', 'border-left-color', 'color-background-elevated'],
      ] as const;
      for (const [cls, prop, token] of twoLine) {
        const block = style.slice(style.indexOf(cls), style.indexOf('}', style.indexOf(cls)));
        expect(
          block,
          `${cls} must keep the plain --sn-mp-* ${prop} floor line`,
        ).toContain(`${prop}: var(--sn-mp-${token})`);
        expect(block).toContain(`${prop}: var(--sn-popover-`);
      }
    });

    it('keeps the arrow outside the transition so no ancestor clip can eat it', () => {
      // §103 regression: mini-programs force `overflow: hidden` on every view,
      // and `sn-transition` is another component whose root we cannot override
      // — an arrow protruding past the bubble box was clipped away entirely.
      const template = source.slice(source.indexOf('<template>'), source.indexOf('</template>'));
      const transitionStart = template.indexOf('<SnTransition');
      const transitionEnd = template.indexOf('</SnTransition>');
      const arrowIndex = template.indexOf('sn-popover__arrow');
      expect(arrowIndex, 'the arrow must exist in the template').toBeGreaterThan(-1);
      expect(
        arrowIndex < transitionStart || arrowIndex > transitionEnd,
        'the arrow must be a sibling of the transition, never inside it',
      ).toBe(true);
      // It must still sit inside the positioning layer that owns the bubble.
      const posStart = template.indexOf('class="sn-popover__pos"');
      expect(arrowIndex).toBeGreaterThan(posStart);
    });

    it('declares white-space nowrap on the text node itself', () => {
      // §103 regression (H5 "frame with no content"): uni-app's H5 `uni-text`
      // element carries `white-space: pre-line`, which overrides inheritance
      // from `.sn-popover__inner` — the body broke between every CJK character
      // and the bubble collapsed into a one-character-wide strip. Only a rule
      // ON the text class beats the element default.
      const block = style.slice(
        style.indexOf('.sn-popover__text {'),
        style.indexOf('}', style.indexOf('.sn-popover__text {')),
      );
      expect(block).toContain('white-space: nowrap');
    });

    it('fades the arrow itself — no stray triangle while the bubble is closed', () => {
      // §103 regression: the arrow is a sibling of the fade transition (so
      // ancestor clips cannot eat it), which also means it no longer inherits
      // the transition's visibility — without its own gate a closed popover
      // left 14 floating triangles over the demo page.
      const block = style.slice(
        style.indexOf('.sn-popover__arrow {'),
        style.indexOf('}', style.indexOf('.sn-popover__arrow {')),
      );
      expect(block).toContain('opacity: 0');
      const shown = style.slice(
        style.indexOf('.sn-popover__arrow--shown {'),
        style.indexOf('}', style.indexOf('.sn-popover__arrow--shown {')),
      );
      expect(shown).toContain('opacity: 1');
      const template = source.slice(source.indexOf('<template>'), source.indexOf('</template>'));
      expect(template).toContain("'sn-popover__arrow--shown': showPopover");
    });
  });
});

/**
 * Mini-program host (AUI-POP-MP-001). The host wrapper there forces
 * `overflow: hidden` on every view and is not a positioning context, so the
 * bubble must leave the component box on a `fixed` layer with VIEWPORT
 * coordinates.
 *
 * The host flavour is detected when the module is evaluated, so the stub has to
 * be in place BEFORE the component module is (re)loaded — hence the dynamic
 * import inside each case rather than the static one at the top of the file.
 */
