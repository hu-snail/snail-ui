/**
 * SnDropdown unit tests — web-end dropdown action menu (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): click/hover open-close, option +
 * divider rendering, select emission, disabled (row + whole), the full
 * keyboard surface, placement classes, outside-click dismissal, one-level
 * submenu, controlled show, and listener cleanup on unmount.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import SnDropdown from './SnDropdown.vue';
import type { SnDropdownOption } from './sn-dropdown-types';

const ACTIONS: SnDropdownOption[] = [
  { label: 'Edit', key: 'edit' },
  { label: 'Duplicate', key: 'duplicate', disabled: true },
  { type: 'divider', key: 'sep' },
  { label: 'Delete', key: 'delete' },
];

const SHARE_OPTIONS: SnDropdownOption[] = [
  {
    label: 'Share',
    key: 'share',
    children: [
      { label: 'Copy Link', key: 'copy-link' },
      { label: 'Email', key: 'email', disabled: true },
    ],
  },
  { label: 'Rename', key: 'rename' },
];

/** A minimal icon component for the `icon` option field (SnMenu convention). */
const MarkerIcon = () => h('svg', { viewBox: '0 0 24 24' }, [h('path', { d: 'M4 4h16v16H4z' })]);

/** Mounted wrappers tracked so afterEach can unmount before clearing body. */
const mounted: Array<{ unmount: () => void }> = [];

/** Mount helper — click trigger by default (hover tests opt in). */
function mountDropdown(props: Record<string, unknown> = {}) {
  const w = mount(SnDropdown, {
    props: { options: ACTIONS, trigger: 'click', ...props },
    attachTo: document.body,
  });
  mounted.push(w);
  return w;
}

/** Open the menu via a trigger click (two ticks: render + reposition pass). */
async function openByClick(wrapper: ReturnType<typeof mountDropdown>): Promise<void> {
  await wrapper.find('.sn-dropdown').trigger('click');
  await nextTick();
  await nextTick();
}

/**
 * Wait out the sn-pop leave transition (150ms + frame timing) so a closed
 * panel is actually gone from the DOM before asserting.
 */
async function menuLeft(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 250));
}

/** The main menu panel (submenu shares .sn-dropdown-menu — exclude it). */
function mainMenu(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('.sn-dropdown-menu:not(.sn-dropdown-submenu)');
}

/** The right-slide submenu panel. */
function subMenu(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('.sn-dropdown-submenu');
}

/** Row (either level) by its data-key. */
function rowByKey(key: string): HTMLElement | null {
  return document.body.querySelector<HTMLElement>(`.sn-dropdown-option[data-key="${key}"]`);
}

/** The keyboard-highlighted row in whichever menu is active. */
function pendingRow(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('.sn-dropdown-option--pending');
}

/** The trigger wrapper element. */
function triggerOf(wrapper: ReturnType<typeof mountDropdown>) {
  return wrapper.find('.sn-dropdown');
}

/** Full DOMRect-shaped literal for the getBoundingClientRect mock. */
function rect(left: number, top: number, width: number, height: number) {
  return {
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  };
}

describe('SnDropdown', () => {
  beforeEach(() => {
    // happy-dom has no layout — give the trigger, rows and panels stable rects.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.classList.contains('sn-dropdown-submenu')) return rect(224, 332, 160, 100);
      if (this.classList.contains('sn-dropdown-option')) return rect(40, 332, 180, 34);
      if (this.classList.contains('sn-dropdown-menu')) return rect(40, 332, 180, 140);
      if (this.classList.contains('sn-dropdown')) return rect(40, 300, 120, 32);
      return rect(0, 0, 0, 0);
    });
  });

  afterEach(async () => {
    // Unmount first so Vue removes its own Teleport nodes cleanly (wiping
    // document.body under a live component crashes the patcher).
    for (const w of mounted.splice(0)) w.unmount();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  /* ───── open / close: click ───── */

  it('opens and closes on trigger clicks, emitting update:show', async () => {
    const w = mountDropdown();
    const trigger = triggerOf(w);
    await trigger.trigger('click');
    await nextTick();
    expect(mainMenu()).not.toBeNull();
    expect(w.emitted('update:show')?.at(-1)).toEqual([true]);
    await trigger.trigger('click');
    await nextTick();
    await menuLeft();
    expect(mainMenu()).toBeNull();
    expect(w.emitted('update:show')?.at(-1)).toEqual([false]);
  });

  /* ───── open / close: hover ───── */

  it('opens on hover and closes after the 300ms grace delay', async () => {
    const w = mountDropdown({ trigger: 'hover' });
    await triggerOf(w).trigger('mouseenter');
    await nextTick();
    expect(mainMenu()).not.toBeNull();
    expect(w.emitted('update:show')?.at(-1)).toEqual([true]);
    // Inside the delay window the menu is still up.
    await triggerOf(w).trigger('mouseleave');
    await nextTick();
    expect(mainMenu()).not.toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 380));
    expect(mainMenu()).toBeNull();
  });

  it('keeps the menu open while the pointer is inside a panel', async () => {
    const w = mountDropdown({ trigger: 'hover' });
    await triggerOf(w).trigger('mouseenter');
    await nextTick();
    await triggerOf(w).trigger('mouseleave');
    // Entering the panel cancels the pending close.
    mainMenu()?.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 380));
    expect(mainMenu()).not.toBeNull();
    // Leaving the panel restarts it.
    mainMenu()?.dispatchEvent(new MouseEvent('mouseleave'));
    await new Promise((resolve) => setTimeout(resolve, 380));
    expect(mainMenu()).toBeNull();
  });

  /* ───── options rendering ───── */

  it('renders action rows and dividers from mixed options', async () => {
    const w = mountDropdown();
    await openByClick(w);
    const rows = document.body.querySelectorAll('.sn-dropdown-option');
    expect(rows).toHaveLength(3);
    expect(rowByKey('edit')).not.toBeNull();
    expect(rowByKey('duplicate')).not.toBeNull();
    expect(rowByKey('delete')).not.toBeNull();
    expect(document.body.querySelector('.sn-dropdown-menu__divider')).not.toBeNull();
  });

  it('renders a leading icon per row when provided', async () => {
    const w = mountDropdown({
      options: [{ label: 'Edit', key: 'edit', icon: MarkerIcon }],
    });
    await openByClick(w);
    const iconHost = rowByKey('edit')?.querySelector('.sn-dropdown-option__icon');
    expect(iconHost?.querySelector('svg')).not.toBeNull();
  });

  /* ───── select ───── */

  it('emits select with key + raw option and closes the menu', async () => {
    const w = mountDropdown();
    await openByClick(w);
    rowByKey('delete')?.click();
    await nextTick();
    expect(w.emitted('select')?.at(-1)).toEqual(['delete', { label: 'Delete', key: 'delete' }]);
    expect(w.emitted('update:show')?.at(-1)).toEqual([false]);
    await menuLeft();
    expect(mainMenu()).toBeNull();
  });

  /* ───── disabled ───── */

  it('refuses to activate a disabled row and stays open', async () => {
    const w = mountDropdown();
    await openByClick(w);
    rowByKey('duplicate')?.click();
    await nextTick();
    expect(w.emitted('select')).toBeUndefined();
    expect(mainMenu()).not.toBeNull();
    expect(rowByKey('duplicate')?.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not open at all when the whole dropdown is disabled', async () => {
    const w = mountDropdown({ disabled: true });
    await triggerOf(w).trigger('click');
    await nextTick();
    expect(mainMenu()).toBeNull();
    await triggerOf(w).trigger('mouseenter');
    await nextTick();
    expect(mainMenu()).toBeNull();
    await triggerOf(w).trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(mainMenu()).toBeNull();
    expect(w.find('.sn-dropdown--disabled').exists()).toBe(true);
  });

  /* ───── keyboard ───── */

  it('opens with Enter and walks the highlight with arrows (skipping disabled rows)', async () => {
    const w = mountDropdown();
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(mainMenu()).not.toBeNull();
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(pendingRow()?.getAttribute('data-key')).toBe('edit');
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(pendingRow()?.getAttribute('data-key')).toBe('delete');
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(pendingRow()?.getAttribute('data-key')).toBe('edit');
    await trigger.trigger('keydown', { key: 'ArrowUp' });
    expect(pendingRow()?.getAttribute('data-key')).toBe('delete');
  });

  it('commits the highlighted row with Enter and closes', async () => {
    const w = mountDropdown();
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(w.emitted('select')?.at(-1)).toEqual(['delete', { label: 'Delete', key: 'delete' }]);
    await menuLeft();
    expect(mainMenu()).toBeNull();
  });

  it('opens with Space and closes with Escape', async () => {
    const w = mountDropdown();
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: ' ' });
    await nextTick();
    expect(mainMenu()).not.toBeNull();
    await trigger.trigger('keydown', { key: 'Escape' });
    await nextTick();
    await menuLeft();
    expect(mainMenu()).toBeNull();
  });

  it('exposes menu semantics (role=menu / menuitem / aria state)', async () => {
    const w = mountDropdown();
    const trigger = triggerOf(w);
    expect(trigger.attributes('aria-haspopup')).toBe('menu');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    await openByClick(w);
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(mainMenu()?.getAttribute('role')).toBe('menu');
    expect(rowByKey('edit')?.getAttribute('role')).toBe('menuitem');
    expect(rowByKey('edit')?.getAttribute('aria-disabled')).toBeNull();
  });

  /* ───── placement + size ───── */

  it.each(['bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end'] as const)(
    'applies the %s placement class to the panel',
    async (placement) => {
      const w = mountDropdown({ placement });
      await openByClick(w);
      expect(mainMenu()?.classList.contains(`sn-dropdown-menu--${placement}`)).toBe(true);
    },
  );

  it('applies the size preset class to the panel', async () => {
    const w = mountDropdown({ size: 'small' });
    await openByClick(w);
    expect(mainMenu()?.classList.contains('sn-dropdown-menu--small')).toBe(true);
  });

  /* ───── outside click ───── */

  it('emits clickoutside and closes on an outside mousedown', async () => {
    const w = mountDropdown();
    await openByClick(w);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    expect(w.emitted('clickoutside')).toHaveLength(1);
    await menuLeft();
    expect(mainMenu()).toBeNull();
  });

  it('does not treat panel mousedowns as outside clicks', async () => {
    const w = mountDropdown();
    await openByClick(w);
    mainMenu()?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    expect(w.emitted('clickoutside')).toBeUndefined();
    expect(mainMenu()).not.toBeNull();
  });

  /* ───── submenu (one nesting level) ───── */

  it('opens the right-slide submenu when hovering a parent row', async () => {
    const w = mountDropdown({ trigger: 'hover', options: SHARE_OPTIONS });
    await triggerOf(w).trigger('mouseenter');
    await nextTick();
    expect(mainMenu()).not.toBeNull();
    rowByKey('share')?.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();
    await nextTick();
    expect(subMenu()).not.toBeNull();
    expect(subMenu()?.getAttribute('role')).toBe('menu');
    expect(rowByKey('share')?.getAttribute('aria-expanded')).toBe('true');
    expect(rowByKey('email')?.getAttribute('aria-disabled')).toBe('true');
  });

  it('selects a submenu child and closes the whole dropdown', async () => {
    const w = mountDropdown({ trigger: 'hover', options: SHARE_OPTIONS });
    await triggerOf(w).trigger('mouseenter');
    await nextTick();
    rowByKey('share')?.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();
    rowByKey('copy-link')?.click();
    await nextTick();
    expect(w.emitted('select')?.at(-1)).toEqual([
      'copy-link',
      { label: 'Copy Link', key: 'copy-link' },
    ]);
    await menuLeft();
    expect(mainMenu()).toBeNull();
    expect(subMenu()).toBeNull();
  });

  it('reaches the submenu with ArrowRight and commits a child with Enter', async () => {
    const w = mountDropdown({ options: SHARE_OPTIONS });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    expect(subMenu()).not.toBeNull();
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(subMenu()?.querySelector('.sn-dropdown-option--pending')?.getAttribute('data-key')).toBe(
      'copy-link',
    );
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(w.emitted('select')?.at(-1)).toEqual(['copy-link', expect.anything()]);
    await menuLeft();
    expect(mainMenu()).toBeNull();
  });

  it('ignores clicks on a disabled submenu child', async () => {
    const w = mountDropdown({ trigger: 'hover', options: SHARE_OPTIONS });
    await triggerOf(w).trigger('mouseenter');
    await nextTick();
    rowByKey('share')?.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();
    rowByKey('email')?.click();
    await nextTick();
    expect(w.emitted('select')).toBeUndefined();
    expect(subMenu()).not.toBeNull();
  });

  /* ───── controlled show ───── */

  it('respects a controlled show prop and only emits update:show', async () => {
    const w = mountDropdown({ show: false });
    await triggerOf(w).trigger('click');
    await nextTick();
    expect(w.emitted('update:show')).toEqual([[true]]);
    expect(mainMenu()).toBeNull();
    await w.setProps({ show: true });
    await nextTick();
    await nextTick();
    expect(mainMenu()).not.toBeNull();
    await triggerOf(w).trigger('keydown', { key: 'Escape' });
    await nextTick();
    expect(w.emitted('update:show')?.at(-1)).toEqual([false]);
    expect(mainMenu()).not.toBeNull();
    await w.setProps({ show: false });
    await nextTick();
    await menuLeft();
    expect(mainMenu()).toBeNull();
  });

  /* ───── unmount cleanup (§41/§42) ───── */

  it('removes the document mousedown listener on unmount (no leak)', async () => {
    const w = mountDropdown();
    await openByClick(w);
    const spy = vi.spyOn(document, 'removeEventListener');
    w.unmount();
    expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    spy.mockRestore();
  });

  it('stops the scroll/resize follower on unmount', async () => {
    const w = mountDropdown();
    await openByClick(w);
    const spy = vi.spyOn(window, 'removeEventListener');
    w.unmount();
    expect(spy).toHaveBeenCalledWith('scroll', expect.any(Function), { capture: true });
    expect(spy).toHaveBeenCalledWith('resize', expect.any(Function));
    spy.mockRestore();
  });

  /* ───── context-menu trigger (Arco parity) ───── */

  /** Dispatch a cancelable right-click and return it for assertions. */
  async function openByContextMenu(
    wrapper: ReturnType<typeof mountDropdown>,
    clientX = 150,
    clientY = 200,
  ): Promise<MouseEvent> {
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
    });
    triggerOf(wrapper).element.dispatchEvent(event);
    await nextTick();
    await nextTick();
    return event;
  }

  it('opens at the pointer on right-click and swallows the native menu', async () => {
    const w = mountDropdown({ trigger: 'contextMenu' });
    const event = await openByContextMenu(w);
    expect(event.defaultPrevented).toBe(true);
    expect(mainMenu()).not.toBeNull();
    expect(w.emitted('update:show')?.at(-1)).toEqual([true]);
    // Zero-size panel in happy-dom + center alignment → menu's top-left
    // lands on the pointer itself (bottom side keeps top = pointer y).
    expect(mainMenu()?.style.left).toBe('150px');
    expect(mainMenu()?.style.top).toBe('200px');
  });

  it('re-anchors an open context menu to a fresh right-click position', async () => {
    const w = mountDropdown({ trigger: 'contextMenu' });
    await openByContextMenu(w, 150, 200);
    await openByContextMenu(w, 300, 100);
    expect(mainMenu()?.style.left).toBe('300px');
    expect(mainMenu()?.style.top).toBe('100px');
  });

  it('flips above the pointer when the bottom half lacks room', async () => {
    // Give panels real sizes so the flip arithmetic has room to fail.
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(180);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(140);
    const w = mountDropdown({ trigger: 'contextMenu' });
    // happy-dom viewport is 768px tall — 8px below the pointer, 760 above.
    await openByContextMenu(w, 150, 760);
    expect(mainMenu()?.classList.contains('sn-dropdown-menu--top')).toBe(true);
    expect(mainMenu()?.style.top).toBe('620px'); // 760 - 140
  });

  it('keeps the keyboard path anchored to the trigger, not a pointer', async () => {
    const w = mountDropdown({ trigger: 'contextMenu' });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    await nextTick();
    expect(mainMenu()).not.toBeNull();
    // Trigger rect mock is (40, 300, 120, 32) → center-aligned left 100,
    // bottom side top 332 — the trigger-anchored arithmetic, not clientX/Y.
    expect(mainMenu()?.style.left).toBe('100px');
    expect(mainMenu()?.style.top).toBe('332px');
  });

  it('closes the context menu after a select', async () => {
    const w = mountDropdown({ trigger: 'contextMenu' });
    await openByContextMenu(w);
    rowByKey('delete')?.click();
    await nextTick();
    expect(w.emitted('select')?.at(-1)).toEqual(['delete', { label: 'Delete', key: 'delete' }]);
    await menuLeft();
    expect(mainMenu()).toBeNull();
  });

  it('ignores left-clicks under the contextMenu trigger', async () => {
    const w = mountDropdown({ trigger: 'contextMenu' });
    await triggerOf(w).trigger('click');
    await nextTick();
    expect(mainMenu()).toBeNull();
    expect(w.emitted('update:show')).toBeUndefined();
  });

  it('leaves the native menu and panel alone for other trigger modes', async () => {
    const w = mountDropdown({ trigger: 'click' });
    const event = await openByContextMenu(w);
    expect(event.defaultPrevented).toBe(false);
    expect(mainMenu()).toBeNull();
  });

  it('does not open a disabled dropdown on right-click', async () => {
    const w = mountDropdown({ trigger: 'contextMenu', disabled: true });
    const event = await openByContextMenu(w);
    expect(event.defaultPrevented).toBe(false);
    expect(mainMenu()).toBeNull();
  });

  /* ───── content slot (Arco #content parity) ───── */

  function mountWithContentSlot(trigger: 'click' | 'contextMenu') {
    const w = mount(SnDropdown, {
      props: { options: ACTIONS, trigger },
      slots: {
        content: `<template #content="{ close }">
            <div class="custom-panel">
              <button class="custom-row" @click="close()">自定义关闭</button>
            </div>
          </template>`,
      },
      attachTo: document.body,
    });
    mounted.push(w);
    return w;
  }

  it('lets the #content slot take over the panel body (options ignored)', async () => {
    const w = mountWithContentSlot('click');
    await openByClick(w);
    expect(mainMenu()).not.toBeNull();
    expect(document.body.querySelector('.custom-panel')).not.toBeNull();
    // The options-driven rows and their keyboard highlight are inert.
    expect(document.body.querySelectorAll('.sn-dropdown-option')).toHaveLength(0);
    expect(mainMenu()?.getAttribute('aria-activedescendant')).toBeNull();
    await triggerOf(w).trigger('keydown', { key: 'ArrowDown' });
    expect(document.body.querySelector('.sn-dropdown-option--pending')).toBeNull();
  });

  it('closes through the close() slot prop and emits update:show', async () => {
    const w = mountWithContentSlot('click');
    await openByClick(w);
    (document.body.querySelector('.custom-row') as HTMLElement | null)?.click();
    await nextTick();
    await menuLeft();
    expect(mainMenu()).toBeNull();
    expect(w.emitted('update:show')?.at(-1)).toEqual([false]);
  });

  it('keeps Esc working in content-slot mode', async () => {
    const w = mountWithContentSlot('click');
    await openByClick(w);
    await triggerOf(w).trigger('keydown', { key: 'Escape' });
    await nextTick();
    await menuLeft();
    expect(mainMenu()).toBeNull();
  });

  it('supports the #content slot under the contextMenu trigger', async () => {
    const w = mountWithContentSlot('contextMenu');
    await openByContextMenu(w);
    expect(mainMenu()).not.toBeNull();
    expect(document.body.querySelector('.custom-panel')).not.toBeNull();
    expect(w.emitted('update:show')?.at(-1)).toEqual([true]);
  });

  it('renders leading icons on rows in contextMenu mode', async () => {
    const w = mountDropdown({
      trigger: 'contextMenu',
      options: [{ label: 'Edit', key: 'edit', icon: MarkerIcon }],
    });
    await openByContextMenu(w);
    const iconHost = rowByKey('edit')?.querySelector('.sn-dropdown-option__icon');
    expect(iconHost?.querySelector('svg')).not.toBeNull();
  });
});
