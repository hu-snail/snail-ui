/**
 * sn-fab unit tests — uni-end floating action button (wd-fab parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `active` drives the menu visibility and the trigger rotation class
 *   - a tap toggles through `update:active`, or emits `click` when
 *     `expandable` is false
 *   - `disabled` blocks both
 *   - `type` / `position` / `direction` drive the class surface
 *   - `gap` plus the per-side `top` / `right` / `bottom` / `left` overrides land
 *     as inline px offsets
 *   - the default trigger icon swaps between plus and close
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnFab from './sn-fab.vue';
// Raw SFC source for CSS-level regression guards (vitest 的 import.meta.url
// 不是 file: 协议，readFileSync(new URL(...)) 会抛 "The URL must be of scheme
// file"；?raw 走 Vite 资产管线，两端一致)。
import fabSource from './sn-fab.vue?raw';

describe('sn-fab', () => {
  it('renders the trigger with the default plus icon', () => {
    const wrapper = mount(SnFab);
    expect(wrapper.find('.sn-fab__trigger').exists()).toBe(true);
    expect(wrapper.find('.sn-fab__trigger svg').exists()).toBe(true);
    expect(wrapper.find('.sn-fab__trigger').attributes('role')).toBe('button');
    expect(wrapper.find('.sn-fab__trigger').attributes('aria-expanded')).toBe('false');
  });

  it('hides the menu until active', () => {
    const closed = mount(SnFab, { slots: { default: '<view class="item">a</view>' } });
    expect(closed.find('.sn-fab__menu').classes()).not.toContain('sn-fab__menu--open');
    expect(closed.find('.sn-fab__menu').attributes('aria-hidden')).toBe('true');

    const open = mount(SnFab, {
      props: { active: true },
      slots: { default: '<view class="item">a</view>' },
    });
    expect(open.find('.sn-fab__menu').classes()).toContain('sn-fab__menu--open');
    expect(open.find('.sn-fab__menu').attributes('aria-hidden')).toBe('false');
    expect(open.classes()).toContain('sn-fab--active');
  });

  it('toggles through update:active on tap', async () => {
    const wrapper = mount(SnFab, { props: { active: false } });
    await wrapper.find('.sn-fab__trigger').trigger('tap');
    expect(wrapper.emitted('update:active')?.[0]).toEqual([true]);

    const open = mount(SnFab, { props: { active: true } });
    await open.find('.sn-fab__trigger').trigger('tap');
    expect(open.emitted('update:active')?.[0]).toEqual([false]);
  });

  it('emits click instead of toggling when expandable is false', async () => {
    const wrapper = mount(SnFab, { props: { expandable: false } });
    await wrapper.find('.sn-fab__trigger').trigger('tap');
    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('update:active')).toBeUndefined();
  });

  it('ignores taps while disabled', async () => {
    const wrapper = mount(SnFab, { props: { disabled: true } });
    await wrapper.find('.sn-fab__trigger').trigger('tap');
    expect(wrapper.emitted('update:active')).toBeUndefined();
    expect(wrapper.emitted('click')).toBeUndefined();
    expect(wrapper.classes()).toContain('sn-fab--disabled');
    expect(wrapper.find('.sn-fab__trigger').attributes('aria-disabled')).toBe('true');
  });

  it('applies the type class to the trigger', () => {
    const wrapper = mount(SnFab, { props: { type: 'danger' } });
    expect(wrapper.find('.sn-fab__trigger').classes()).toContain('sn-fab__trigger--danger');
  });

  it('applies the position and direction classes', () => {
    const wrapper = mount(SnFab, { props: { position: 'left-top', direction: 'bottom' } });
    expect(wrapper.classes()).toContain('sn-fab--left-top');
    expect(wrapper.classes()).toContain('sn-fab--bottom');
    expect(wrapper.find('.sn-fab__menu').classes()).toContain('sn-fab__menu--bottom');
  });

  it('places the trigger with the default gap', () => {
    const wrapper = mount(SnFab);
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('right: 16px');
    expect(style).toContain('bottom: 16px');
  });

  it('lets the gap prop move every edge', () => {
    const wrapper = mount(SnFab, {
      props: { position: 'left-top', gap: { top: 24, left: 32 } },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('top: 24px');
    expect(style).toContain('left: 32px');
  });

  it('lets the per-side props override the gap', () => {
    const wrapper = mount(SnFab, {
      props: { gap: { right: 16, bottom: 16 }, right: 40, bottom: 8 },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('right: 40px');
    expect(style).toContain('bottom: 8px');
  });

  it('centres a side-anchored preset vertically', () => {
    const wrapper = mount(SnFab, { props: { position: 'right-center' } });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('top: 50%');
    expect(style).toContain('translateY(-50%)');
    expect(style).toContain('right: 16px');
  });

  it('centres a top-anchored preset horizontally', () => {
    const wrapper = mount(SnFab, { props: { position: 'top-center' } });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('top: 16px');
    expect(style).toContain('translateX(-50%)');
  });

  it('uses the custom trigger slot', () => {
    const wrapper = mount(SnFab, {
      slots: { trigger: '<text class="custom-trigger">+</text>' },
    });
    expect(wrapper.find('.custom-trigger').text()).toBe('+');
  });

  it('applies zIndex, customClass and customStyle', () => {
    const wrapper = mount(SnFab, {
      props: { zIndex: 300, customClass: 'my-fab', customStyle: 'margin: 8px' },
    });
    expect(wrapper.attributes('style')).toContain('z-index: 300');
    expect(wrapper.attributes('style')).toContain('margin: 8px');
    expect(wrapper.classes()).toContain('my-fab');
  });

  it('does not offset the trigger when draggable is off', async () => {
    const wrapper = mount(SnFab);
    await wrapper.find('.sn-fab__trigger').trigger('touchstart', {
      touches: [{ clientX: 10, clientY: 10 }],
    });
    await wrapper.find('.sn-fab__trigger').trigger('touchmove', {
      touches: [{ clientX: 60, clientY: 60 }],
    });
    expect(wrapper.attributes('style')).not.toContain('translate(50px');
  });

  it('offsets the trigger by the drag delta when draggable', async () => {
    const wrapper = mount(SnFab, { props: { draggable: true } });
    await wrapper.find('.sn-fab__trigger').trigger('touchstart', {
      touches: [{ clientX: 10, clientY: 10 }],
    });
    await wrapper.find('.sn-fab__trigger').trigger('touchmove', {
      touches: [{ clientX: 60, clientY: 40 }],
    });
    expect(wrapper.attributes('style')).toContain('translate(50px, 30px)');
  });

  it('keeps the drag offset after release when no viewport is available', async () => {
    const wrapper = mount(SnFab, { props: { draggable: true } });
    const trigger = wrapper.find('.sn-fab__trigger');
    await trigger.trigger('touchstart', { touches: [{ clientX: 10, clientY: 10 }] });
    await trigger.trigger('touchmove', { touches: [{ clientX: 60, clientY: 40 }] });
    await trigger.trigger('touchend');
    expect(wrapper.attributes('style')).toContain('translate(50px, 30px)');
  });

  it('clamps the drag inside the uni viewport on release', async () => {
    (globalThis as { uni?: unknown }).uni = {
      getSystemInfoSync: () => ({ windowWidth: 400, windowHeight: 800 }),
    };
    const wrapper = mount(SnFab, { props: { draggable: true } });
    const trigger = wrapper.find('.sn-fab__trigger');
    await trigger.trigger('touchstart', { touches: [{ clientX: 0, clientY: 0 }] });
    await trigger.trigger('touchmove', { touches: [{ clientX: 1000, clientY: 50 }] });
    await trigger.trigger('touchend');
    // maxX = 400 - 16 - 16 = 368; maxY = 800 - 32 = 768, so Y stays at 50.
    expect(wrapper.attributes('style')).toContain('translate(368px, 50px)');
    delete (globalThis as { uni?: unknown }).uni;
  });

  it('clamps a drag past the top-left corner symmetrically', async () => {
    (globalThis as { uni?: unknown }).uni = {
      getSystemInfoSync: () => ({ windowWidth: 400, windowHeight: 800 }),
    };
    const wrapper = mount(SnFab, { props: { draggable: true } });
    const trigger = wrapper.find('.sn-fab__trigger');
    await trigger.trigger('touchstart', { touches: [{ clientX: 0, clientY: 0 }] });
    await trigger.trigger('touchmove', { touches: [{ clientX: -1000, clientY: -1000 }] });
    await trigger.trigger('touchend');
    expect(wrapper.attributes('style')).toContain('translate(-368px, -768px)');
    delete (globalThis as { uni?: unknown }).uni;
  });

  it('still toggles after a drag gesture', async () => {
    const wrapper = mount(SnFab, { props: { draggable: true } });
    const trigger = wrapper.find('.sn-fab__trigger');
    await trigger.trigger('touchstart', { touches: [{ clientX: 10, clientY: 10 }] });
    await trigger.trigger('touchmove', { touches: [{ clientX: 60, clientY: 40 }] });
    await trigger.trigger('touchend');
    await trigger.trigger('tap');
    expect(wrapper.emitted('update:active')?.[0]).toEqual([true]);
  });

  it('survives a viewport probe that throws', async () => {
    (globalThis as { uni?: unknown }).uni = {
      getSystemInfoSync: () => {
        throw new Error('unsupported');
      },
    };
    const wrapper = mount(SnFab, { props: { draggable: true } });
    const trigger = wrapper.find('.sn-fab__trigger');
    await trigger.trigger('touchstart', { touches: [{ clientX: 0, clientY: 0 }] });
    await trigger.trigger('touchmove', { touches: [{ clientX: 100, clientY: 100 }] });
    await trigger.trigger('touchend');
    expect(wrapper.attributes('style')).toContain('translate(100px, 100px)');
    delete (globalThis as { uni?: unknown }).uni;
  });

  it('swaps the trigger icon and the expanded state with active', async () => {
    const wrapper = mount(SnFab, { props: { active: false } });
    expect(wrapper.find('.sn-fab__trigger').attributes('aria-expanded')).toBe('false');
    await wrapper.setProps({ active: true });
    expect(wrapper.find('.sn-fab__trigger').attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('.sn-fab__trigger').classes()).toContain('sn-fab__trigger--active');
    expect(wrapper.find('.sn-fab__trigger svg').exists()).toBe(true);
  });

  it('resolves a registry icon name for the trigger', async () => {
    const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
    const { Star } = await import('../sn-icon/sn-icon-set');
    registerSnIcons({ Star });
    const wrapper = mount(SnFab, { props: { inactiveIcon: 'Star', activeIcon: 'Star' } });
    expect(wrapper.find('.sn-fab__trigger svg').exists()).toBe(true);
    clearSnIcons();
  });

  it('falls back to the built-in plus / close pair for unknown icon names', () => {
    const wrapper = mount(SnFab, { props: { inactiveIcon: 'no-such-icon' } });
    expect(wrapper.find('.sn-fab__trigger svg').exists()).toBe(true);
  });

  it('anchors bottom-center with the horizontal centring transform', () => {
    const wrapper = mount(SnFab, { props: { position: 'bottom-center' } });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('bottom: 16px');
    expect(style).toContain('translateX(-50%)');
  });

  it('writes the default 99 z-index', () => {
    expect(mount(SnFab).attributes('style')).toContain('z-index: 99');
  });

  it('lays the menu out to the left when direction is left', () => {
    const wrapper = mount(SnFab, { props: { direction: 'left' } });
    expect(wrapper.find('.sn-fab__menu').classes()).toContain('sn-fab__menu--left');
  });

  it('defaults to the up direction with the canonical top classes', () => {
    const wrapper = mount(SnFab);
    expect(wrapper.classes()).toContain('sn-fab--top');
    expect(wrapper.find('.sn-fab__menu').classes()).toContain('sn-fab__menu--top');
  });

  it('normalizes the additive up / down aliases to the top / bottom classes', () => {
    const up = mount(SnFab, { props: { direction: 'up' } });
    expect(up.classes()).toContain('sn-fab--top');
    expect(up.find('.sn-fab__menu').classes()).toContain('sn-fab__menu--top');

    const down = mount(SnFab, { props: { direction: 'down' } });
    expect(down.classes()).toContain('sn-fab--bottom');
    expect(down.find('.sn-fab__menu').classes()).toContain('sn-fab__menu--bottom');
  });

  it('keeps the legacy top / bottom direction values working', () => {
    const top = mount(SnFab, { props: { direction: 'top' } });
    expect(top.classes()).toContain('sn-fab--top');

    const bottom = mount(SnFab, { props: { direction: 'bottom' } });
    expect(bottom.find('.sn-fab__menu').classes()).toContain('sn-fab__menu--bottom');
  });

  it('sizes the trigger glyph with the icon-size token, not a pixel box', () => {
    const wrapper = mount(SnFab);
    const iconStyle = wrapper.find('.sn-fab__trigger .sn-icon').attributes('style') ?? '';
    expect(iconStyle).toContain('var(--sn-mp-icon-size-');
  });

  it('lets the open-state transform cancel the direction offset', () => {
    // Regression guard: the direction offset rules and the open rule used to
    // share specificity (0,1,0) with the direction rules declared later, so
    // the resting menu kept its 24rpx offset INTO the trigger and the last
    // action item was visibly covered by the button — in every direction.
    // happy-dom cannot compute rpx token styles, so this is guarded at the
    // source level: the open rule must be the compound selector
    // `.sn-fab__menu.sn-fab__menu--open` (0,2,0), which beats any direction
    // rule regardless of source order.
    const style = fabSource.slice(fabSource.indexOf('<style'));
    expect(style).toMatch(
      /\.sn-fab__menu\.sn-fab__menu--open\s*\{[^}]*transform:\s*translate\(0,\s*0\)/,
    );
    // The bare `--open` selector must not carry the transform any more —
    // reintroducing it would silently reopen the overlap in all directions.
    expect(style).not.toMatch(/^\.sn-fab__menu--open\s*\{[^}]*transform:/m);
  });
});
