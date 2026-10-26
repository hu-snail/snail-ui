/**
 * SnMention unit tests — web-end mention input (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): trigger detection, live filtering,
 * keyboard navigation + selection, trigger-word replacement, events,
 * disabled, custom delimiters, empty slot, outside-click close, a11y.
 *
 * The panel is Teleported to body, so panel assertions go through
 * document.body (SnSelect test convention). getBoundingClientRect is
 * mocked — happy-dom has no layout.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import SnMention from './SnMention.vue';

const USERS = ['alice', 'bob', 'carol'];

/** Mounted wrappers tracked so afterEach can unmount before clearing body. */
const mounted: Array<{ unmount: () => void }> = [];

function mountMention(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  const w = mount(SnMention, {
    props: { options: USERS, ...props },
    slots,
    attachTo: document.body,
  });
  mounted.push(w);
  return w;
}

/** Mount with a live v-model so keystrokes accumulate. */
function mountVModel(initial: string, props: Record<string, unknown> = {}) {
  const value = ref(initial);
  const wrapper = mount(
    {
      setup() {
        return () =>
          h(SnMention, {
            options: USERS,
            ...props,
            modelValue: value.value,
            'onUpdate:modelValue': (v: string) => {
              value.value = v;
            },
          });
      },
    },
    { attachTo: document.body },
  );
  mounted.push(wrapper);
  return { wrapper: wrapper.findComponent(SnMention), value };
}

/** All option rows currently in the teleported panel. */
function panelOptions(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>('.sn-mention__option'));
}

function panel(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('.sn-mention__menu');
}

/** Simulate typing into the input: set DOM value + caret, fire input. */
async function type(wrapper: ReturnType<typeof mountMention>, text: string, caret?: number) {
  const input = wrapper.find('input');
  const el = input.element as HTMLInputElement;
  el.value = text;
  const pos = caret ?? text.length;
  el.setSelectionRange(pos, pos);
  await input.trigger('input');
}

/**
 * Wait out the sn-pop leave transition (150ms + frame timing) so a closed
 * panel is actually gone from the DOM before asserting.
 */
async function panelLeft(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 250));
}

describe('SnMention', () => {
  beforeEach(() => {
    // happy-dom has no layout — give the root + panel stable rects
    // (root near the bottom of a 800px viewport so "bottom" stays preferred).
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isMenu = this.classList.contains('sn-mention__menu');
      return isMenu
        ? {
            top: 0,
            left: 0,
            width: 200,
            height: 120,
            right: 200,
            bottom: 120,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          }
        : {
            top: 300,
            left: 40,
            width: 200,
            height: 32,
            right: 240,
            bottom: 332,
            x: 40,
            y: 300,
            toJSON: () => ({}),
          };
    });
  });

  afterEach(async () => {
    // Unmount first so Vue removes its own Teleport nodes cleanly (wiping
    // document.body under a live component crashes the patcher).
    for (const w of mounted.splice(0)) w.unmount();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  /* ───── trigger + panel ───── */

  it('renders a combobox input bound to the modelValue', () => {
    const w = mountMention({ modelValue: 'hello' });
    const input = w.find('input');
    expect(input.attributes('role')).toBe('combobox');
    expect((input.element as HTMLInputElement).value).toBe('hello');
  });

  it('opens the panel after typing the delimiter', async () => {
    const w = mountMention({ modelValue: '' });
    expect(panel()).toBeNull();
    await type(w, 'hi @');
    expect(panel()).not.toBeNull();
    expect(panelOptions()).toHaveLength(3);
  });

  it('does not open the panel without a delimiter', async () => {
    const w = mountMention({ modelValue: '' });
    await type(w, 'hello alice');
    expect(panel()).toBeNull();
  });

  it('filters options by the query typed after the delimiter', async () => {
    const w = mountMention({ modelValue: '' });
    await type(w, '@al');
    const rows = panelOptions();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.textContent).toBe('alice');
  });

  it('closes the panel when the query is cleared by whitespace', async () => {
    const w = mountMention({ modelValue: '' });
    await type(w, '@al');
    expect(panel()).not.toBeNull();
    await type(w, '@al and more');
    await panelLeft();
    expect(panel()).toBeNull();
  });

  it('shows the empty slot when no option matches the query', async () => {
    const w = mountMention(
      { modelValue: '' },
      { empty: () => h('span', { class: 'custom-empty' }, 'nobody') },
    );
    await type(w, '@zzz');
    expect(document.body.querySelector('.custom-empty')).not.toBeNull();
  });

  /* ───── selection ───── */

  it('selects an option on click and replaces the trigger word', async () => {
    const { wrapper, value } = mountVModel('');
    const input = wrapper.find('input');
    const el = input.element as HTMLInputElement;
    el.value = 'ping @bo';
    el.setSelectionRange(8, 8);
    await input.trigger('input');
    panelOptions()[0]?.click();
    await nextTick();
    expect(value.value).toBe('ping @bob');
  });

  it('keeps the text after the caret when replacing', async () => {
    const { wrapper, value } = mountVModel('');
    const input = wrapper.find('input');
    const el = input.element as HTMLInputElement;
    el.value = 'ping @bo now';
    // Caret right after "bo" (index 8) — " now" stays.
    el.setSelectionRange(8, 8);
    await input.trigger('input');
    panelOptions()[0]?.click();
    await nextTick();
    expect(value.value).toBe('ping @bob now');
  });

  it('closes the panel after a selection commits (no reopen via model watch)', async () => {
    const { wrapper } = mountVModel('');
    const input = wrapper.find('input');
    const el = input.element as HTMLInputElement;
    el.value = 'ping @bo';
    el.setSelectionRange(8, 8);
    await input.trigger('input');
    expect(panel()).not.toBeNull();
    panelOptions()[0]?.click();
    await nextTick();
    await nextTick();
    await panelLeft();
    expect(panel()).toBeNull();
  });

  it('commits the option value (not label) for object options and emits select', async () => {
    const w = mountMention({
      options: [{ label: 'Alice Lee', value: 'alice' }],
      modelValue: '',
    });
    await type(w, '@Al');
    panelOptions()[0]?.click();
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['@alice']);
    expect(w.emitted('change')?.at(-1)).toEqual(['@alice']);
    expect(w.emitted('select')?.at(-1)).toEqual([{ label: 'Alice Lee', value: 'alice' }]);
  });

  it('syncs v-model on plain keystrokes without a trigger', async () => {
    const { wrapper, value } = mountVModel('');
    await wrapper.find('input').setValue('just text');
    expect(value.value).toBe('just text');
    expect(wrapper.emitted('select')).toBeUndefined();
  });

  /* ───── keyboard ───── */

  it('highlights with ArrowDown and selects with Enter', async () => {
    const { wrapper, value } = mountVModel('');
    const input = wrapper.find('input');
    await type(wrapper, '@');
    await input.trigger('keydown', { key: 'ArrowDown' });
    const active = document.body.querySelector('.sn-mention__option--active');
    expect(active?.textContent).toBe('alice');
    expect(input.attributes('aria-activedescendant')).toBeDefined();
    await input.trigger('keydown', { key: 'Enter' });
    expect(value.value).toBe('@alice');
    expect(wrapper.emitted('select')?.at(-1)).toEqual([{ label: 'alice', value: 'alice' }]);
  });

  it('selects the highlighted option with Tab', async () => {
    const { wrapper, value } = mountVModel('');
    const input = wrapper.find('input');
    await type(wrapper, '@');
    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'Tab' });
    expect(value.value).toBe('@bob');
  });

  it('wraps ArrowUp from none to the last option', async () => {
    const w = mountMention({ modelValue: '' });
    const input = w.find('input');
    await type(w, '@');
    await input.trigger('keydown', { key: 'ArrowUp' });
    const active = document.body.querySelector('.sn-mention__option--active');
    expect(active?.textContent).toBe('carol');
  });

  it('closes the panel with Escape', async () => {
    const w = mountMention({ modelValue: '' });
    const input = w.find('input');
    await type(w, '@');
    expect(panel()).not.toBeNull();
    await input.trigger('keydown', { key: 'Escape' });
    await panelLeft();
    expect(panel()).toBeNull();
  });

  it('does not select disabled options', async () => {
    const w = mountMention({
      options: [{ label: 'alice', disabled: true }, 'bob'],
      modelValue: '',
    });
    const input = w.find('input');
    await type(w, '@');
    await input.trigger('keydown', { key: 'ArrowDown' });
    // Skips the disabled first option and lands on bob.
    const active = document.body.querySelector('.sn-mention__option--active');
    expect(active?.textContent).toBe('bob');
    await input.trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['@bob']);
  });

  /* ───── delimiters ───── */

  it('supports a custom single-char delimiter', async () => {
    const { wrapper, value } = mountVModel('', { delimiter: '#' });
    const input = wrapper.find('input');
    await type(wrapper, 'tag #al');
    expect(panelOptions()).toHaveLength(1);
    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'Enter' });
    expect(value.value).toBe('tag #alice');
  });

  it('supports an array of delimiters (multi-char simplified to last char)', async () => {
    const { wrapper, value } = mountVModel('', { delimiter: ['@', '()'] });
    const input = wrapper.find('input');
    // '()' keys off the final '(' char.
    await type(wrapper, 'hi (@al');
    expect(panelOptions()).toHaveLength(1);
    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'Enter' });
    expect(value.value).toBe('hi (@alice');
  });

  /* ───── states ───── */

  it('does not open the panel when disabled', async () => {
    const w = mountMention({ modelValue: '', disabled: true });
    await type(w, 'hi @a');
    expect(panel()).toBeNull();
    expect(w.find('input').attributes('disabled')).toBeDefined();
  });

  it('does not open the panel when readonly', async () => {
    const w = mountMention({ modelValue: '', readonly: true });
    await type(w, 'hi @a');
    expect(panel()).toBeNull();
    expect(w.find('input').attributes('readonly')).toBeDefined();
  });

  it('renders a textarea when type is textarea', async () => {
    const { wrapper, value } = mountVModel('', { type: 'textarea', rows: 4 });
    const area = wrapper.find('textarea');
    expect(area.exists()).toBe(true);
    expect(area.attributes('rows')).toBe('4');
    expect(area.attributes('role')).toBe('combobox');
    const el = area.element as HTMLTextAreaElement;
    el.value = 'note @bo';
    el.setSelectionRange(8, 8);
    await area.trigger('input');
    expect(panelOptions()).toHaveLength(1);
    panelOptions()[0]?.click();
    await nextTick();
    expect(value.value).toBe('note @bob');
  });

  it('emits focus and blur', async () => {
    const w = mountMention({ modelValue: '' });
    const input = w.find('input');
    await input.trigger('focus');
    await input.trigger('blur');
    expect(w.emitted('focus')).toHaveLength(1);
    expect(w.emitted('blur')).toHaveLength(1);
  });

  /* ───── outside click + cleanup ───── */

  it('closes the panel on outside click and cleans up on unmount', async () => {
    const w = mountMention({ modelValue: '' });
    await type(w, '@');
    expect(panel()).not.toBeNull();
    document.dispatchEvent(new Event('pointerdown'));
    await nextTick();
    await panelLeft();
    expect(panel()).toBeNull();

    // Listener must be removed on unmount — dispatch after unmount is a no-op.
    w.unmount();
    mounted.splice(mounted.indexOf(w), 1);
    expect(() => document.dispatchEvent(new Event('pointerdown'))).not.toThrow();
  });

  /* ───── a11y / styling ───── */

  it('exposes aria combobox wiring on the input and listbox in the panel', async () => {
    const w = mountMention({ modelValue: '' });
    const input = w.find('input');
    await type(w, '@');
    expect(input.attributes('aria-expanded')).toBe('true');
    const menuIdAttr = input.attributes('aria-controls');
    expect(menuIdAttr).toBeDefined();
    const menu = document.getElementById(menuIdAttr ?? '');
    expect(menu?.getAttribute('role')).toBe('listbox');
    const option = menu?.querySelector('[role="option"]');
    expect(option).not.toBeNull();
  });

  it('applies size, status and placeholder', () => {
    expect(mountMention({ size: 'large' }).classes()).toContain('sn-mention--large');
    expect(mountMention({ status: 'error' }).classes()).toContain('sn-mention--status-error');
    expect(mountMention({ status: 'warning' }).classes()).toContain('sn-mention--status-warning');
    const w = mountMention({ placeholder: 'Type a message' });
    expect(w.find('input').attributes('placeholder')).toBe('Type a message');
  });

  it('positions the panel below the field by default and flips when the viewport lacks room', async () => {
    const w = mountMention({ modelValue: '' });
    await type(w, '@');
    await nextTick();
    const menu = panel();
    expect(menu).not.toBeNull();
    expect(menu?.classList.contains('sn-mention__menu--bottom')).toBe(true);
    expect(menu?.style.position).toBe('fixed');

    // Re-mock with the root at the very bottom of the viewport — panel must
    // flip up (root top 780 < bottom room 20 of an 800px viewport).
    vi.restoreAllMocks();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isMenu = this.classList.contains('sn-mention__menu');
      return isMenu
        ? {
            top: 0,
            left: 0,
            width: 200,
            height: 120,
            right: 200,
            bottom: 120,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          }
        : {
            top: 780,
            left: 40,
            width: 200,
            height: 32,
            right: 240,
            bottom: 812,
            x: 40,
            y: 780,
            toJSON: () => ({}),
          };
    });
    await type(w, '@a');
    await nextTick();
    expect(panel()?.classList.contains('sn-mention__menu--top')).toBe(true);
  });

  it('opens the panel through the sn-pop transition and settles with it mounted', async () => {
    // VTU stubs Transition by default; opt into the real one here so the
    // sn-pop enter classes are actually applied.
    const w = mount(SnMention, {
      props: { options: USERS, modelValue: '' },
      attachTo: document.body,
      global: { stubs: { transition: false } },
    });
    mounted.push(w);
    await type(w, '@');
    const menu = panel() as HTMLElement;
    // Enter classes prove the Transition name is sn-pop (applied synchronously).
    expect(menu).not.toBeNull();
    expect(
      menu.classList.contains('sn-pop-enter-from') ||
        menu.classList.contains('sn-pop-enter-active'),
    ).toBe(true);
    // Enter completes within 300ms: panel still mounted, enter classes gone.
    await new Promise((resolve) => setTimeout(resolve, 300));
    const settled = panel() as HTMLElement | null;
    expect(settled).not.toBeNull();
    expect(settled.classList.contains('sn-pop-enter-active')).toBe(false);
    expect(settled.classList.contains('sn-pop-enter-from')).toBe(false);
  });

  /* ───── scroll follow (useOverlayFollow) ───── */

  /** rAF stub that runs the queued frame synchronously. */
  function stubSyncFrame(): void {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
  }

  const TRIGGER_RECT = (left: number) => ({
    top: 300,
    left,
    width: 200,
    height: 32,
    right: left + 200,
    bottom: 332,
    x: left,
    y: 300,
    toJSON: () => ({}),
  });
  const MENU_RECT = {
    top: 0,
    left: 0,
    width: 200,
    height: 120,
    right: 200,
    bottom: 120,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };

  it('keeps the panel glued to the input when the page scrolls while open', async () => {
    const w = mountMention({ modelValue: '' });
    await type(w, '@al');
    await nextTick();
    const menu = panel() as HTMLElement;
    expect(menu.style.left).toBe('40px');
    // The page scrolled: the input's viewport rect moved 80px right.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.classList.contains('sn-mention__menu') ? MENU_RECT : TRIGGER_RECT(120);
    });
    stubSyncFrame();
    window.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(menu.style.left).toBe('120px');
    vi.unstubAllGlobals();
  });

  it('stops following page scroll once the panel closes', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const w = mountMention({ modelValue: '' });
    await type(w, '@al');
    await nextTick();
    await w.find('input').trigger('keydown', { key: 'Escape' });
    await nextTick();
    expect(removeSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.objectContaining({ capture: true }),
    );
  });

  it('stops following page scroll after unmount', async () => {
    const w = mountMention({ modelValue: '' });
    await type(w, '@al');
    await nextTick();
    w.unmount();
    mounted.splice(mounted.indexOf(w), 1);
    const reads = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
    stubSyncFrame();
    window.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(reads).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
