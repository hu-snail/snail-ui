/**
 * sn-drop-menu unit tests — uni-end filter bar (wd-drop-menu parity).
 *
 * Behaviour only (AGENTS.md §46):
 *   - the bar toggles the panel; `open` / `opened` / `close` / `closed` fire
 *   - `before-toggle` returning false blocks the toggle, async included
 *   - a row tap emits `update:modelValue` + `change` with `{ value, selectedItem }`
 *   - `valueKey` / `labelKey` / `tipKey` remap the option fields
 *   - `title` overrides the selected label; `disabled` blocks every tap
 *   - the scrim honours `modal` / `closeOnClickModal`
 *   - the transition timer is cleared on unmount (§41)
 *   - stacking: the raised ceiling floors a low `zIndex` and never lowers a
 *     high one (AUI-OPT-04 occlusion fix)
 *   - `direction` anchors the panel up or down and rests the arrow accordingly
 *   - option icons resolve three sources (data object > image URL > name) with
 *     a documented precedence chain
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import SnDropMenu from './sn-drop-menu.vue';
import { Star } from '../sn-icon/sn-icon-set';

/**
 * Drain both queues.
 *
 * `duration: 0` still schedules a `setTimeout(0)` for the transition
 * callback, and `flushPromises()` only drains microtasks — the macrotask that
 * emits `opened` / `closed` never runs without this. Awaiting a real
 * timeout keeps the test on real timers (no fake-timer bookkeeping) and is the
 * smallest fix for a correct component.
 */
async function flushAll(): Promise<void> {
  await flushPromises();
  // Under fake timers a real `setTimeout` never resolves, so advance the fake
  // clock instead — the tests that assert timer ordering install fake timers
  // themselves and expect to control every tick.
  if (vi.isFakeTimers()) {
    vi.advanceTimersByTime(0);
  } else {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  await flushPromises();
}

const options = [
  { label: '综合排序', value: 'default', tip: '推荐' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '销量优先', value: 'sales', disabled: true },
];

describe('sn-drop-menu', () => {
  describe('structure', () => {
    it('renders the placeholder while nothing is selected', () => {
      const w = mount(SnDropMenu, { props: { options } });
      expect(w.find('.sn-drop-menu__label').text()).toBe('请选择');
      expect(w.find('.sn-drop-menu__label').classes()).toContain(
        'sn-drop-menu__label--placeholder',
      );
    });

    it('renders the selected option label', () => {
      const w = mount(SnDropMenu, { props: { options, modelValue: 'price-asc' } });
      expect(w.find('.sn-drop-menu__label').text()).toBe('价格从低到高');
    });

    it('prefers the title over the selected label', () => {
      const w = mount(SnDropMenu, {
        props: { options, modelValue: 'price-asc', title: '排序方式' },
      });
      expect(w.find('.sn-drop-menu__label').text()).toBe('排序方式');
    });

    it('renders no panel while closed', () => {
      const w = mount(SnDropMenu, { props: { options } });
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(false);
    });

    it('renders one row per option once open, with the tip line', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.findAll('.sn-drop-menu__option')).toHaveLength(3);
      expect(w.find('.sn-drop-menu__option-tip').text()).toBe('推荐');
    });

    it('marks the selected row active and renders its check glyph', async () => {
      const w = mount(SnDropMenu, {
        props: { options, modelValue: 'price-asc', duration: 0 },
      });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      const rows = w.findAll('.sn-drop-menu__option');
      expect(rows[1]!.classes()).toContain('sn-drop-menu__option--active');
      expect(w.findAll('.sn-drop-menu__option-check')).toHaveLength(1);
    });

    it('applies the direction class and forwards customClass / customStyle', () => {
      const w = mount(SnDropMenu, {
        props: { direction: 'up', customClass: 'my-menu', customStyle: 'margin: 4px' },
      });
      expect(w.classes()).toContain('sn-drop-menu--up');
      expect(w.classes()).toContain('my-menu');
      expect(w.attributes('style') ?? '').toContain('margin: 4px');
    });

    it('writes the authored level and duration into the root style', () => {
      const w = mount(SnDropMenu, { props: { zIndex: 30, duration: 400 } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-drop-menu-z-index: 30');
      expect(style).toContain('--sn-drop-menu-duration: 400ms');
    });

    it('forwards customPopupClass / customPopupStyle / popupHeight to the panel', async () => {
      const w = mount(SnDropMenu, {
        props: {
          options,
          duration: 0,
          customPopupClass: 'my-popup',
          customPopupStyle: 'padding: 2px',
          popupHeight: '300px',
        },
      });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      const panel = w.find('.sn-drop-menu__popup');
      expect(panel.classes()).toContain('my-popup');
      const style = panel.attributes('style') ?? '';
      expect(style).toContain('height: 300px');
      expect(style).toContain('padding: 2px');
    });

    it('renders the bar arrow and the selected check as SVG glyphs', async () => {
      const w = mount(SnDropMenu, {
        props: { options, modelValue: 'price-asc', duration: 0 },
      });
      expect(w.find('.sn-drop-menu__arrow svg').exists()).toBe(true);
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.find('.sn-drop-menu__option-check svg').exists()).toBe(true);
    });

    it('falls back to the built-in glyphs for an unknown icon name', async () => {
      const w = mount(SnDropMenu, {
        props: { options, modelValue: 'price-asc', duration: 0, icon: 'nope', iconName: 'nope' },
      });
      expect(w.find('.sn-drop-menu__arrow svg').exists()).toBe(true);
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.find('.sn-drop-menu__option-check svg').exists()).toBe(true);
    });

    it('forwards iconSize to the arrow icon', () => {
      const w = mount(SnDropMenu, { props: { iconSize: 24 } });
      // The arrow is the first (and only) SnIcon while the panel is closed.
      expect(w.findComponent({ name: 'SnIcon' }).props('size')).toBe(24);
    });

    it('replaces the option list with the default slot', async () => {
      const w = mount(SnDropMenu, {
        props: { options, duration: 0 },
        slots: { default: '<text class="slot-panel">自定义面板</text>' },
      });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.find('.slot-panel').exists()).toBe(true);
      expect(w.findAll('.sn-drop-menu__option')).toHaveLength(0);
    });
  });

  describe('stacking (occlusion fix — AUI-OPT-04)', () => {
    it('publishes the authored level plus a floored overlay level', () => {
      const w = mount(SnDropMenu, { props: { options } });
      const style = w.attributes('style') ?? '';
      // Idle level = the authored zIndex (default 12).
      expect(style).toContain('--sn-drop-menu-z-index: 12');
      // Overlay level is floored at the overlay band so page chrome and the
      // floating button can no longer cover an open panel.
      expect(style).toContain('--sn-drop-menu-overlay-z-index: 90');
    });

    it('raises the root while the panel node exists and drops back after closing', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      expect(w.classes()).not.toContain('sn-drop-menu--raised');
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.classes()).toContain('sn-drop-menu--raised');
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      // The close leg finished → the raised ceiling is released.
      expect(w.classes()).not.toContain('sn-drop-menu--raised');
    });

    it('keeps the root raised through the closing animation', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnDropMenu, { props: { options, duration: 200 } });
        await w.find('.sn-drop-menu__bar').trigger('tap');
        await flushAll();
        await w.find('.sn-drop-menu__bar').trigger('tap');
        await flushAll();
        // The panel node is still mounted → still raised, so it cannot slip
        // under a sibling mid-animation.
        expect(w.find('.sn-drop-menu__popup').exists()).toBe(true);
        expect(w.classes()).toContain('sn-drop-menu--raised');
        vi.advanceTimersByTime(200);
        await w.vm.$nextTick();
        expect(w.classes()).not.toContain('sn-drop-menu--raised');
      } finally {
        vi.useRealTimers();
      }
    });

    it('never lowers an explicit zIndex above the overlay floor', () => {
      const w = mount(SnDropMenu, { props: { zIndex: 1200 } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-drop-menu-z-index: 1200');
      expect(style).toContain('--sn-drop-menu-overlay-z-index: 1200');
    });

    it('floors a zIndex below the overlay band up to 90', () => {
      const w = mount(SnDropMenu, { props: { zIndex: 5 } });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-drop-menu-z-index: 5');
      expect(style).toContain('--sn-drop-menu-overlay-z-index: 90');
    });
  });

  describe('direction', () => {
    it('defaults to the down direction', () => {
      const w = mount(SnDropMenu, { props: { options } });
      expect(w.classes()).toContain('sn-drop-menu--down');
      expect(w.classes()).not.toContain('sn-drop-menu--up');
    });

    it('renders the panel + scrim under the up direction class', async () => {
      const w = mount(SnDropMenu, { props: { options, direction: 'up', duration: 0 } });
      expect(w.classes()).toContain('sn-drop-menu--up');
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(true);
      expect(w.find('.sn-drop-menu__modal').exists()).toBe(true);
    });

    it('rests the bar arrow on the up chevron for the up direction', () => {
      const down = mount(SnDropMenu, { props: { options, direction: 'down' } });
      const up = mount(SnDropMenu, { props: { options, direction: 'up' } });
      const downPath = down.find('.sn-drop-menu__arrow svg path').attributes('d');
      const upPath = up.find('.sn-drop-menu__arrow svg path').attributes('d');
      expect(downPath).toBeTruthy();
      expect(upPath).toBeTruthy();
      // Down rests on chevron-down, up rests on chevron-up — different glyphs.
      expect(upPath).not.toBe(downPath);
    });

    it('honours an explicit arrow glyph regardless of direction', () => {
      const w = mount(SnDropMenu, { props: { options, direction: 'up', icon: 'arrow-right' } });
      expect(w.find('.sn-drop-menu__arrow svg').exists()).toBe(true);
    });
  });

  describe('option icons', () => {
    it('renders an inline IconData option icon (highest precedence)', async () => {
      const rows = [{ label: '星标', value: 'star', iconData: Star }];
      const w = mount(SnDropMenu, { props: { options: rows, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      const icon = w.find('.sn-drop-menu__option-icon');
      expect(icon.exists()).toBe(true);
      expect(icon.find('svg path').attributes('d')).toBe(Star.paths[0]);
      expect(w.find('.sn-drop-menu__option-image').exists()).toBe(false);
    });

    it('renders an image option icon for iconUrl', async () => {
      const rows = [{ label: '图', value: 'img', iconUrl: 'https://example.com/a.png' }];
      const w = mount(SnDropMenu, { props: { options: rows, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      const image = w.find('.sn-drop-menu__option-image');
      expect(image.exists()).toBe(true);
      expect(image.attributes('src')).toBe('https://example.com/a.png');
      expect(w.find('.sn-drop-menu__option-icon').exists()).toBe(false);
    });

    it('resolves a named option icon through the built-in catalogue', async () => {
      const rows = [{ label: '升序', value: 'asc', icon: 'arrow-up' }];
      const w = mount(SnDropMenu, { props: { options: rows, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      const icon = w.find('.sn-drop-menu__option-icon');
      expect(icon.exists()).toBe(true);
      expect(icon.findAll('svg path').length).toBeGreaterThan(0);
      expect(w.find('.sn-drop-menu__option-image').exists()).toBe(false);
    });

    it('prefers iconData over iconUrl and icon name', async () => {
      const rows = [
        {
          label: '三源',
          value: 'all',
          iconData: Star,
          iconUrl: 'https://example.com/b.png',
          icon: 'arrow-up',
        },
      ];
      const w = mount(SnDropMenu, { props: { options: rows, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.find('.sn-drop-menu__option-image').exists()).toBe(false);
      expect(w.find('.sn-drop-menu__option-icon svg path').attributes('d')).toBe(Star.paths[0]);
    });

    it('falls back to iconUrl when no iconData is present', async () => {
      const rows = [
        { label: 'URL 优先', value: 'u', iconUrl: 'https://example.com/c.png', icon: 'arrow-up' },
      ];
      const w = mount(SnDropMenu, { props: { options: rows, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.find('.sn-drop-menu__option-image').attributes('src')).toBe(
        'https://example.com/c.png',
      );
    });

    it('renders no option icon when none of the three sources is set', async () => {
      const rows = [{ label: '纯文本', value: 't' }];
      const w = mount(SnDropMenu, { props: { options: rows, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.find('.sn-drop-menu__option-icon').exists()).toBe(false);
      expect(w.find('.sn-drop-menu__option-image').exists()).toBe(false);
    });
  });

  describe('field keys', () => {
    it('remaps the option fields through valueKey / labelKey / tipKey', async () => {
      const custom = [{ name: '自定义', id: 7, note: '说明' }];
      const w = mount(SnDropMenu, {
        props: {
          options: custom,
          modelValue: 7,
          labelKey: 'name',
          valueKey: 'id',
          tipKey: 'note',
          duration: 0,
        },
      });
      expect(w.find('.sn-drop-menu__label').text()).toBe('自定义');
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.find('.sn-drop-menu__option-tip').text()).toBe('说明');
    });
  });

  describe('interaction', () => {
    it('opens on a bar tap and emits open / opened', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.emitted('open')).toHaveLength(1);
      expect(w.emitted('opened')).toHaveLength(1);
      expect(w.classes()).toContain('sn-drop-menu--open');
    });

    it('closes on a second bar tap and emits close / closed', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('closed')).toHaveLength(1);
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(false);
    });

    it('ignores the bar tap while disabled', async () => {
      const w = mount(SnDropMenu, { props: { options, disabled: true, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.emitted('open')).toBeUndefined();
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(false);
      expect(w.find('.sn-drop-menu__bar').attributes('aria-disabled')).toBe('true');
    });

    it('emits update:modelValue and change with the picked option', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      await w.findAll('.sn-drop-menu__option')[1]!.trigger('tap');
      await flushPromises();
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['price-asc']);
      expect(w.emitted('change')?.[0]).toEqual([{ value: 'price-asc', selectedItem: options[1] }]);
    });

    it('closes after a row is picked', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      await w.findAll('.sn-drop-menu__option')[0]!.trigger('tap');
      await flushPromises();
      expect(w.emitted('close')).toHaveLength(1);
    });

    it('ignores taps on a disabled row', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      const row = w.findAll('.sn-drop-menu__option')[2]!;
      await row.trigger('tap');
      await flushPromises();
      expect(w.emitted('change')).toBeUndefined();
      expect(row.attributes('aria-disabled')).toBe('true');
    });

    it('closes on a scrim tap', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      await w.find('.sn-drop-menu__modal').trigger('tap');
      await flushPromises();
      expect(w.emitted('close')).toHaveLength(1);
    });

    it('keeps the menu open on a scrim tap when closeOnClickModal is false', async () => {
      const w = mount(SnDropMenu, {
        props: { options, duration: 0, closeOnClickModal: false },
      });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      await w.find('.sn-drop-menu__modal').trigger('tap');
      await flushPromises();
      expect(w.emitted('close')).toBeUndefined();
    });

    it('renders no scrim when modal is false', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0, modal: false } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.find('.sn-drop-menu__modal').exists()).toBe(false);
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(true);
    });
  });

  describe('before-toggle guard', () => {
    it('blocks opening when the guard returns false', async () => {
      const beforeToggle = vi.fn(() => false);
      const w = mount(SnDropMenu, { props: { options, duration: 0, beforeToggle } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(beforeToggle).toHaveBeenCalledWith({ status: true });
      expect(w.emitted('open')).toBeUndefined();
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(false);
    });

    it('opens when the guard resolves true asynchronously', async () => {
      const beforeToggle = vi.fn(async () => true);
      const w = mount(SnDropMenu, { props: { options, duration: 0, beforeToggle } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.emitted('open')).toHaveLength(1);
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(true);
    });

    it('blocks closing when the guard returns false', async () => {
      const beforeToggle = vi.fn(({ status }: { status: boolean }) => status);
      const w = mount(SnDropMenu, { props: { options, duration: 0, beforeToggle } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(beforeToggle).toHaveBeenCalledWith({ status: false });
      expect(w.emitted('close')).toBeUndefined();
      expect(w.classes()).toContain('sn-drop-menu--open');
    });

    it('treats a throwing guard as a rejection', async () => {
      const beforeToggle = vi.fn(() => {
        throw new Error('guard exploded');
      });
      const w = mount(SnDropMenu, { props: { options, duration: 0, beforeToggle } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(beforeToggle).toHaveBeenCalledWith({ status: true });
      expect(w.emitted('open')).toBeUndefined();
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(false);
    });
  });

  describe('imperative api', () => {
    it('opens and closes through the exposed methods', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      const vm = w.vm as unknown as { open(): void; close(): void; getShowPop(): boolean };
      vm.open();
      await flushAll();
      expect(vm.getShowPop()).toBe(true);
      expect(w.emitted('open')).toHaveLength(1);

      vm.close();
      await flushAll();
      expect(vm.getShowPop()).toBe(false);
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(false);
    });

    it('is idempotent when open / close repeat the current state', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      const vm = w.vm as unknown as { open(): void; close(): void };
      vm.open();
      await flushAll();
      vm.open();
      await flushAll();
      // Repeating open must not replay open / opened.
      expect(w.emitted('open')).toHaveLength(1);
      expect(w.emitted('opened')).toHaveLength(1);

      vm.close();
      await flushAll();
      vm.close();
      await flushAll();
      // Repeating close must not replay close / closed.
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('closed')).toHaveLength(1);
    });

    it('survives rapid open / close / open taps without a stale unmount', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnDropMenu, { props: { options, duration: 200 } });
        await w.find('.sn-drop-menu__bar').trigger('tap');
        await flushAll();
        await w.find('.sn-drop-menu__bar').trigger('tap');
        await flushAll();
        await w.find('.sn-drop-menu__bar').trigger('tap');
        await flushAll();
        // The closing leg was superseded by the re-open: `closed` never fires,
        // the panel outlives one duration, and the final open leg completes.
        vi.advanceTimersByTime(200);
        await w.vm.$nextTick();
        expect(w.emitted('closed')).toBeUndefined();
        expect(w.find('.sn-drop-menu__popup').exists()).toBe(true);
        expect(w.classes()).toContain('sn-drop-menu--open');
        expect(w.emitted('opened')).toHaveLength(1);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('timers', () => {
    it('keeps the panel mounted until the duration elapses', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnDropMenu, { props: { options, duration: 200 } });
        await w.find('.sn-drop-menu__bar').trigger('tap');
        await flushAll();
        expect(w.emitted('opened')).toBeUndefined();
        vi.advanceTimersByTime(200);
        expect(w.emitted('opened')).toHaveLength(1);

        await w.find('.sn-drop-menu__bar').trigger('tap');
        await flushAll();
        expect(w.find('.sn-drop-menu__popup').exists()).toBe(true);
        expect(w.emitted('closed')).toBeUndefined();
        vi.advanceTimersByTime(200);
        await w.vm.$nextTick();
        expect(w.emitted('closed')).toHaveLength(1);
        expect(w.find('.sn-drop-menu__popup').exists()).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('clears the pending transition timer on unmount (no leak)', async () => {
      vi.useFakeTimers();
      try {
        const w = mount(SnDropMenu, { props: { options, duration: 200 } });
        await w.find('.sn-drop-menu__bar').trigger('tap');
        await flushAll();
        w.unmount();
        expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('accessibility', () => {
    it('marks the bar as an expanded button', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      const bar = w.find('.sn-drop-menu__bar');
      expect(bar.attributes('role')).toBe('button');
      expect(bar.attributes('aria-expanded')).toBe('false');
      await bar.trigger('tap');
      await flushPromises();
      expect(w.find('.sn-drop-menu__bar').attributes('aria-expanded')).toBe('true');
    });

    it('marks option rows with a menuitem role', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } });
      await w.find('.sn-drop-menu__bar').trigger('tap');
      await flushAll();
      expect(w.findAll('.sn-drop-menu__option')[0]!.attributes('role')).toBe('menuitem');
    });

    it('tags the root for the docs / AI component map', () => {
      expect(mount(SnDropMenu).attributes('data-snui-component')).toBe('drop-menu');
    });
  });
});
