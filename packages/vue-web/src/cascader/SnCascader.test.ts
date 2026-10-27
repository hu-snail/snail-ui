/**
 * SnCascader unit tests — web-end cascader (path v-model parity).
 *
 * Behavior-focused (AGENTS.md §46): path selection through the columns,
 * multi-level expansion, clearable, filterable path matching, disabled
 * rows, custom fields, keyboard navigation, expand-trigger, events, a11y.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import SnCascader from './SnCascader.vue';

const OPTIONS = [
  {
    label: 'Asia',
    value: 'asia',
    children: [
      {
        label: 'China',
        value: 'china',
        children: [
          { label: 'Beijing', value: 'beijing' },
          { label: 'Shanghai', value: 'shanghai' },
          { label: 'Chongqing', value: 'chongqing', disabled: true },
        ],
      },
      { label: 'Japan', value: 'japan', children: [{ label: 'Tokyo', value: 'tokyo' }] },
    ],
  },
  {
    label: 'Europe',
    value: 'europe',
    children: [
      { label: 'France', value: 'france', children: [{ label: 'Paris', value: 'paris' }] },
      {
        label: 'Italy',
        value: 'italy',
        disabled: true,
        children: [{ label: 'Rome', value: 'rome' }],
      },
    ],
  },
];

/** Mounted wrappers tracked so afterEach can unmount before clearing body. */
const mounted: Array<{ unmount: () => void }> = [];

/** Mount helper with default options. */
function mountCascader(props: Record<string, unknown> = {}) {
  const w = mount(SnCascader, {
    props: { options: OPTIONS, ...props },
    attachTo: document.body,
  });
  mounted.push(w);
  return w;
}

/** Mount with a live v-model so commits round-trip. */
function mountVModel(initial: unknown, props: Record<string, unknown> = {}) {
  const value = ref<unknown>(initial);
  const wrapper = mount(
    {
      setup() {
        return () =>
          h(SnCascader, {
            options: OPTIONS,
            ...props,
            modelValue: value.value as never,
            'onUpdate:modelValue': (v: unknown) => {
              value.value = v;
            },
          });
      },
    },
    { attachTo: document.body },
  );
  mounted.push(wrapper);
  return { wrapper: wrapper.findComponent(SnCascader), value };
}

type Findable = {
  find: (sel: string) => { trigger: (ev: string, o?: unknown) => Promise<void> };
};

/** Open the dropdown by clicking the trigger. */
async function openMenu(wrapper: Findable) {
  await wrapper.find('.sn-cascader__selection').trigger('click');
  await nextTick();
}

/**
 * Wait out the sn-pop leave transition (150ms + frame timing) so a closed
 * panel is actually gone from the DOM before asserting.
 */
async function menuLeft(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 250));
}

/** The trigger combobox element. */
function triggerOf(wrapper: Findable) {
  return wrapper.find('.sn-cascader__selection');
}

/** All visible columns in the teleported menu. */
function columns(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>('.sn-cascader-menu__column'));
}

/** Option row by its index-path data-key. */
function rowByKey(key: string): HTMLElement | null {
  return document.body.querySelector<HTMLElement>(`.sn-cascader-option[data-key="${key}"]`);
}

/** All option rows currently rendered (any mode). */
function allRows(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>('.sn-cascader-option'));
}

/** The multiple-mode checkbox glyph inside one option row. */
function checkboxOf(row: HTMLElement | null): HTMLElement | null {
  return row?.querySelector<HTMLElement>('.sn-cascader-option__checkbox') ?? null;
}

describe('SnCascader', () => {
  beforeEach(() => {
    // happy-dom has no layout — give the trigger + menu stable rects.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isMenu = this.classList.contains('sn-cascader-menu');
      return isMenu
        ? {
            top: 0,
            left: 0,
            width: 200,
            height: 160,
            right: 200,
            bottom: 160,
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

  /* ───── trigger echo ───── */

  it('shows the placeholder when empty', () => {
    const w = mountCascader({ placeholder: 'Pick a path' });
    expect(w.find('.sn-cascader__placeholder').text()).toBe('Pick a path');
  });

  it('displays the selected path labels joined with " / "', () => {
    const w = mountCascader({ modelValue: ['asia', 'china', 'beijing'] });
    expect(w.find('.sn-cascader__single-value').text()).toBe('Asia / China / Beijing');
  });

  it('falls back to the placeholder when the bound path is unknown', () => {
    const w = mountCascader({ modelValue: ['nope'] });
    expect(w.find('.sn-cascader__placeholder').text()).toBe('Please select');
  });

  /* ───── path selection through the columns ───── */

  it('selects a leaf through the columns and syncs v-model', async () => {
    const { wrapper, value } = mountVModel([]);
    await openMenu(wrapper);
    rowByKey('0')?.click();
    await nextTick();
    rowByKey('0-0')?.click();
    await nextTick();
    rowByKey('0-0-0')?.click();
    expect(value.value).toEqual(['asia', 'china', 'beijing']);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([['asia', 'china', 'beijing']]);
    await nextTick();
    // Menu closes after the leaf commit; the trigger echoes the full path.
    await menuLeft();
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
    expect(wrapper.find('.sn-cascader__single-value').text()).toBe('Asia / China / Beijing');
  });

  it('opens with only the root column and expands the child column on parent click', async () => {
    const w = mountCascader();
    await openMenu(w);
    expect(columns()).toHaveLength(1);
    rowByKey('0')?.click();
    await nextTick();
    expect(columns()).toHaveLength(2);
    const secondLabels = Array.from(
      columns()[1]?.querySelectorAll('.sn-cascader-option__label') ?? [],
    ).map((el) => el.textContent);
    expect(secondLabels).toEqual(['China', 'Japan']);
    // The walked parent is marked as in-path.
    expect(rowByKey('0')?.classList.contains('sn-cascader-option--in-path')).toBe(true);
  });

  it('cascades a third column for deeper levels', async () => {
    const w = mountCascader();
    await openMenu(w);
    rowByKey('0')?.click();
    await nextTick();
    rowByKey('0-0')?.click();
    await nextTick();
    expect(columns()).toHaveLength(3);
    const thirdLabels = Array.from(
      columns()[2]?.querySelectorAll('.sn-cascader-option__label') ?? [],
    ).map((el) => el.textContent);
    expect(thirdLabels).toEqual(['Beijing', 'Shanghai', 'Chongqing']);
  });

  it('replaces the child column when switching to a sibling parent', async () => {
    const w = mountCascader();
    await openMenu(w);
    rowByKey('0')?.click();
    await nextTick();
    rowByKey('1')?.click();
    await nextTick();
    expect(columns()).toHaveLength(2);
    const secondLabels = Array.from(
      columns()[1]?.querySelectorAll('.sn-cascader-option__label') ?? [],
    ).map((el) => el.textContent);
    expect(secondLabels).toEqual(['France', 'Italy']);
    expect(rowByKey('0')?.classList.contains('sn-cascader-option--in-path')).toBe(false);
  });

  it('marks the selected leaf and its walked ancestors on reopen', async () => {
    const w = mountCascader({ modelValue: ['asia', 'china', 'beijing'] });
    await openMenu(w);
    expect(columns()).toHaveLength(3);
    expect(rowByKey('0-0-0')?.classList.contains('sn-cascader-option--selected')).toBe(true);
    expect(rowByKey('0-0-0')?.getAttribute('aria-selected')).toBe('true');
    expect(rowByKey('0')?.classList.contains('sn-cascader-option--in-path')).toBe(true);
    expect(rowByKey('0-0')?.classList.contains('sn-cascader-option--in-path')).toBe(true);
  });

  /* ───── clearable ───── */

  it('shows the clear button only when a value exists and is interactive', () => {
    expect(mountCascader({ clearable: true }).find('.sn-cascader__clear').exists()).toBe(false);
    expect(
      mountCascader({ modelValue: ['asia', 'japan', 'tokyo'], clearable: true, disabled: true })
        .find('.sn-cascader__clear')
        .exists(),
    ).toBe(false);
    expect(
      mountCascader({ modelValue: ['asia', 'japan', 'tokyo'], clearable: true })
        .find('.sn-cascader__clear')
        .exists(),
    ).toBe(true);
  });

  it('clears to an empty path and emits clear', async () => {
    const { wrapper, value } = mountVModel(['asia', 'japan', 'tokyo'], { clearable: true });
    await wrapper.find('.sn-cascader__clear').trigger('click');
    expect(value.value).toEqual([]);
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[]]);
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.find('.sn-cascader__placeholder').text()).toBe('Please select');
  });

  /* ───── filterable ───── */

  it('matches on the full path text as the user types', async () => {
    const w = mountCascader({ filterable: true });
    await openMenu(w);
    const input = w.find('.sn-cascader__filter-input');
    await input.setValue('bei');
    await nextTick();
    expect(allRows().map((r) => r.textContent)).toEqual(['Asia / China / Beijing']);
    // Matching a parent label keeps every leaf below it.
    await input.setValue('china');
    await nextTick();
    expect(allRows().map((r) => r.textContent)).toEqual([
      'Asia / China / Beijing',
      'Asia / China / Shanghai',
      'Asia / China / Chongqing',
    ]);
  });

  it('shows the empty state when nothing matches', async () => {
    const w = mountCascader({ filterable: true });
    await openMenu(w);
    await w.find('.sn-cascader__filter-input').setValue('zzz');
    await nextTick();
    expect(allRows()).toHaveLength(0);
    expect(document.body.querySelector('.sn-cascader-menu__empty')?.textContent).toBe('No options');
  });

  it('renders the empty slot content when nothing matches', async () => {
    const w = mount(SnCascader, {
      props: { options: OPTIONS, filterable: true },
      slots: { empty: '<div data-testid="casc-empty">Nothing here</div>' },
      attachTo: document.body,
    });
    mounted.push(w);
    await openMenu(w);
    await w.find('.sn-cascader__filter-input').setValue('zzz');
    await nextTick();
    expect(document.body.querySelector('[data-testid="casc-empty"]')).not.toBeNull();
  });

  it('commits the clicked filter match directly', async () => {
    const { wrapper, value } = mountVModel([], { filterable: true });
    await openMenu(wrapper);
    await wrapper.find('.sn-cascader__filter-input').setValue('paris');
    await nextTick();
    allRows()[0]?.click();
    expect(value.value).toEqual(['europe', 'france', 'paris']);
    await nextTick();
    expect(wrapper.find('.sn-cascader__single-value').text()).toBe('Europe / France / Paris');
  });

  it('keeps the menu open when typing a space in the filter input', async () => {
    const w = mountCascader({ filterable: true });
    await openMenu(w);
    await w.find('.sn-cascader__filter-input').trigger('keydown', { key: ' ' });
    await nextTick();
    expect(document.body.querySelector('.sn-cascader-menu')).not.toBeNull();
  });

  /* ───── disabled rows ───── */

  it('refuses to choose a disabled leaf', async () => {
    const w = mountCascader();
    await openMenu(w);
    rowByKey('0')?.click();
    await nextTick();
    rowByKey('0-0')?.click();
    await nextTick();
    const disabledRow = rowByKey('0-0-2');
    expect(disabledRow?.getAttribute('aria-disabled')).toBe('true');
    disabledRow?.click();
    expect(w.emitted('update:modelValue')).toBeUndefined();
    expect(document.body.querySelector('.sn-cascader-menu')).not.toBeNull();
  });

  it('does not expand a disabled parent', async () => {
    const w = mountCascader();
    await openMenu(w);
    rowByKey('1')?.click();
    await nextTick();
    rowByKey('1-1')?.click();
    await nextTick();
    expect(columns()).toHaveLength(2);
    expect(rowByKey('1-1-0')).toBeNull();
  });

  /* ───── custom fields ───── */

  it('supports labelField / valueField / childrenField remapping', async () => {
    const { wrapper, value } = mountVModel([], {
      options: [
        {
          name: 'Roads',
          id: 'r',
          sub: [
            { name: 'Main', id: 'm' },
            { name: 'Side', id: 's' },
          ],
        },
      ],
      labelField: 'name',
      valueField: 'id',
      childrenField: 'sub',
    });
    await openMenu(wrapper);
    rowByKey('0')?.click();
    await nextTick();
    expect(columns()[1]?.textContent).toContain('Main');
    rowByKey('0-0')?.click();
    expect(value.value).toEqual(['r', 'm']);
    await nextTick();
    expect(wrapper.find('.sn-cascader__single-value').text()).toBe('Roads / Main');
  });

  /* ───── keyboard ───── */

  it('opens with Enter and walks the tree with arrows to select a leaf', async () => {
    const w = mountCascader();
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(document.body.querySelector('.sn-cascader-menu')).not.toBeNull();
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(rowByKey('0')?.classList.contains('sn-cascader-option--pending')).toBe(true);
    await trigger.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    expect(columns()).toHaveLength(2);
    // The child column auto-highlights its first selectable row.
    expect(rowByKey('0-0')?.classList.contains('sn-cascader-option--pending')).toBe(true);
    await trigger.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    expect(columns()).toHaveLength(3);
    // Entering the third column auto-highlights its first selectable row.
    expect(rowByKey('0-0-0')?.classList.contains('sn-cascader-option--pending')).toBe(true);
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['asia', 'china', 'beijing']]);
    await nextTick();
    await menuLeft();
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
  });

  it('moves the highlight up and down within the active column, wrapping and skipping disabled rows', async () => {
    const w = mountCascader();
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    await trigger.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    // Third column: Beijing, Shanghai, Chongqing(disabled). Entering the
    // column already highlights Beijing (first selectable child).
    expect(rowByKey('0-0-0')?.classList.contains('sn-cascader-option--pending')).toBe(true);
    await trigger.trigger('keydown', { key: 'ArrowDown' }); // shanghai
    expect(rowByKey('0-0-1')?.classList.contains('sn-cascader-option--pending')).toBe(true);
    await trigger.trigger('keydown', { key: 'ArrowDown' }); // wraps to beijing, skips chongqing
    expect(rowByKey('0-0-0')?.classList.contains('sn-cascader-option--pending')).toBe(true);
    await trigger.trigger('keydown', { key: 'ArrowUp' }); // back to shanghai
    expect(rowByKey('0-0-1')?.classList.contains('sn-cascader-option--pending')).toBe(true);
  });

  it('collapses one column with ArrowLeft and highlights the parent', async () => {
    const w = mountCascader();
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    await trigger.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    expect(columns()).toHaveLength(3);
    await trigger.trigger('keydown', { key: 'ArrowLeft' });
    await nextTick();
    expect(columns()).toHaveLength(2);
    expect(rowByKey('0-0')?.classList.contains('sn-cascader-option--pending')).toBe(true);
    await trigger.trigger('keydown', { key: 'ArrowLeft' });
    await nextTick();
    expect(columns()).toHaveLength(1);
    expect(rowByKey('0')?.classList.contains('sn-cascader-option--pending')).toBe(true);
  });

  it('selects the highlighted parent with Enter by expanding it, not committing', async () => {
    const w = mountCascader();
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(columns()).toHaveLength(2);
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('closes with Escape', async () => {
    const w = mountCascader();
    await openMenu(w);
    await triggerOf(w).trigger('keydown', { key: 'Escape' });
    await nextTick();
    await menuLeft();
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
  });

  it('navigates the filter match list with arrows and commits with Enter', async () => {
    const w = mountCascader({ filterable: true });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    const input = w.find('.sn-cascader__filter-input');
    await input.setValue('china');
    await nextTick();
    // First match auto-highlighted after typing.
    expect(allRows()[0]?.classList.contains('sn-cascader-option--pending')).toBe(true);
    await input.trigger('keydown', { key: 'ArrowDown' });
    expect(allRows()[1]?.classList.contains('sn-cascader-option--pending')).toBe(true);
    await input.trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['asia', 'china', 'shanghai']]);
  });

  /* ───── expand-trigger ───── */

  it('expands on hover when expandTrigger is hover', async () => {
    const w = mountCascader({ expandTrigger: 'hover' });
    await openMenu(w);
    rowByKey('0')?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
    await nextTick();
    expect(columns()).toHaveLength(2);
  });

  it('does not expand on hover when expandTrigger is click', async () => {
    const w = mountCascader();
    await openMenu(w);
    rowByKey('0')?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
    await nextTick();
    expect(columns()).toHaveLength(1);
    // Click still expands.
    rowByKey('0')?.click();
    await nextTick();
    expect(columns()).toHaveLength(2);
  });

  /* ───── open/close behavior ───── */

  it('toggles the menu on repeated trigger clicks', async () => {
    const w = mountCascader();
    const trigger = triggerOf(w);
    await trigger.trigger('click');
    await nextTick();
    expect(document.body.querySelector('.sn-cascader-menu')).not.toBeNull();
    await trigger.trigger('click');
    await nextTick();
    await menuLeft();
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
  });

  it('does not open when disabled or readonly', async () => {
    const disabled = mountCascader({ disabled: true });
    await triggerOf(disabled).trigger('click');
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
    expect(disabled.find('.sn-cascader--disabled').exists()).toBe(true);

    const readonly = mountCascader({ readonly: true });
    await triggerOf(readonly).trigger('click');
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
  });

  it('does not respond to keyboard when disabled', async () => {
    const w = mountCascader({ disabled: true });
    await triggerOf(w).trigger('keydown', { key: 'Enter' });
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
  });

  it('closes on outside click', async () => {
    const w = mountCascader();
    await openMenu(w);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    await menuLeft();
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
  });

  it('stays open when clicking inside the menu', async () => {
    const w = mountCascader();
    await openMenu(w);
    document.body
      .querySelector('.sn-cascader-menu')
      ?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    expect(document.body.querySelector('.sn-cascader-menu')).not.toBeNull();
  });

  it('removes the document listener on unmount (no leak)', async () => {
    const w = mountCascader();
    await openMenu(w);
    const spy = vi.spyOn(document, 'removeEventListener');
    w.unmount();
    expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    spy.mockRestore();
  });

  /* ───── empty options / a11y / events ───── */

  it('renders the empty state when options are empty', async () => {
    const w = mount(SnCascader, {
      props: { options: [] },
      slots: { empty: '<div data-testid="no-opts">No options yet</div>' },
      attachTo: document.body,
    });
    mounted.push(w);
    await openMenu(w);
    expect(document.body.querySelector('[data-testid="no-opts"]')).not.toBeNull();
  });

  it('exposes combobox / listbox / option aria structure', async () => {
    const w = mountCascader();
    const trigger = triggerOf(w);
    expect(trigger.attributes('role')).toBe('combobox');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    await openMenu(w);
    expect(trigger.attributes('aria-expanded')).toBe('true');
    const menu = document.body.querySelector('.sn-cascader-menu') as HTMLElement;
    const listbox = menu.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();
    expect(menu.querySelectorAll('[role="option"]').length).toBeGreaterThan(0);
    const option = menu.querySelector('[role="option"]') as HTMLElement;
    expect(option.getAttribute('aria-selected')).toBe('false');
    // Keyboard highlight is exposed through aria-activedescendant.
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(trigger.attributes('aria-activedescendant')).toContain('sn-cascader-option');
  });

  it('sets aria-invalid when status is error', () => {
    const w = mountCascader({ status: 'error' });
    expect(w.find('.sn-cascader--status-error').exists()).toBe(true);
    expect(triggerOf(w).attributes('aria-invalid')).toBe('true');
  });

  it('applies size classes to the trigger', () => {
    expect(mountCascader({ size: 'large' }).classes()).toContain('sn-cascader--large');
  });

  it('flips the arrow direction while open', async () => {
    const w = mountCascader();
    expect(w.find('.sn-cascader__arrow--up').exists()).toBe(false);
    await openMenu(w);
    expect(w.find('.sn-cascader__arrow--up').exists()).toBe(true);
  });

  it('emits focus and blur from the trigger', async () => {
    const w = mountCascader();
    await triggerOf(w).trigger('focus');
    await triggerOf(w).trigger('blur');
    expect(w.emitted('focus')).toHaveLength(1);
    expect(w.emitted('blur')).toHaveLength(1);
  });

  it('positions the menu below the trigger by default', async () => {
    const w = mountCascader();
    await openMenu(w);
    await nextTick();
    const menu = document.body.querySelector('.sn-cascader-menu') as HTMLElement;
    expect(menu.style.top).toBe('332px');
    expect(menu.style.left).toBe('40px');
  });

  it('does not stretch the panel to the trigger width (column-driven width)', async () => {
    const w = mountCascader();
    await openMenu(w);
    await nextTick();
    const menu = document.body.querySelector('.sn-cascader-menu') as HTMLElement;
    // The panel wraps its fixed-width columns; no trigger-width min-width
    // is forced on the inline style, so an unexpanded panel is one column.
    expect(menu.style.minWidth).toBe('');
  });

  it('opens the menu through the sn-pop transition and settles with it mounted', async () => {
    // VTU stubs Transition by default; opt into the real one here so the
    // sn-pop enter classes are actually applied.
    const w = mount(SnCascader, {
      props: { options: OPTIONS },
      attachTo: document.body,
      global: { stubs: { transition: false } },
    });
    mounted.push(w);
    await openMenu(w);
    const menu = document.body.querySelector('.sn-cascader-menu') as HTMLElement;
    // Enter classes prove the Transition name is sn-pop (applied synchronously).
    expect(menu).not.toBeNull();
    expect(
      menu.classList.contains('sn-pop-enter-from') ||
        menu.classList.contains('sn-pop-enter-active'),
    ).toBe(true);
    // Enter completes within 300ms: panel still mounted, enter classes gone.
    await new Promise((resolve) => setTimeout(resolve, 300));
    const settled = document.body.querySelector('.sn-cascader-menu') as HTMLElement | null;
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
    height: 160,
    right: 200,
    bottom: 160,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };

  it('keeps the menu glued to the trigger when the page scrolls while open', async () => {
    const w = mountCascader();
    await openMenu(w);
    await nextTick();
    const menu = document.body.querySelector('.sn-cascader-menu') as HTMLElement;
    expect(menu.style.left).toBe('40px');
    // The page scrolled: the trigger's viewport rect moved 80px right.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.classList.contains('sn-cascader-menu') ? MENU_RECT : TRIGGER_RECT(120);
    });
    stubSyncFrame();
    window.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(menu.style.left).toBe('120px');
    vi.unstubAllGlobals();
  });

  it('stops following page scroll once the menu closes', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const w = mountCascader();
    await openMenu(w);
    await nextTick();
    await triggerOf(w).trigger('click');
    await nextTick();
    expect(removeSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.objectContaining({ capture: true }),
    );
  });

  it('stops following page scroll after unmount', async () => {
    const w = mountCascader();
    await openMenu(w);
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

/* ───── multiple (tree check) mode ───── */

describe('SnCascader multiple', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isMenu = this.classList.contains('sn-cascader-menu');
      return isMenu
        ? {
            top: 0,
            left: 0,
            width: 200,
            height: 160,
            right: 200,
            bottom: 160,
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
    for (const w of mounted.splice(0)) w.unmount();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('renders a checkbox in every row when multiple', async () => {
    const w = mountCascader({ multiple: true });
    await openMenu(w);
    expect(allRows().length).toBeGreaterThan(0);
    expect(allRows().every((row) => checkboxOf(row) !== null)).toBe(true);
  });

  it('renders no checkboxes in single mode', async () => {
    const w = mountCascader();
    await openMenu(w);
    expect(checkboxOf(allRows()[0] ?? null)).toBeNull();
  });

  it('checking a leaf commits its path and keeps the menu open', async () => {
    const { wrapper, value } = mountVModel([], { multiple: true });
    await openMenu(wrapper);
    rowByKey('0')?.click();
    await nextTick();
    rowByKey('0-0')?.click();
    await nextTick();
    checkboxOf(rowByKey('0-0-0'))?.click();
    await nextTick();
    expect(value.value).toEqual([['asia', 'china', 'beijing']]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[['asia', 'china', 'beijing']]]);
    // Menu stays open for continuous toggling; the tag echoes the path.
    expect(document.body.querySelector('.sn-cascader-menu')).not.toBeNull();
    expect(wrapper.find('.sn-cascader__tag-label').text()).toBe('Asia / China / Beijing');
    // The checked leaf row is marked.
    expect(rowByKey('0-0-0')?.classList.contains('sn-cascader-option--selected')).toBe(true);
  });

  it('unchecking a checked leaf removes its path', async () => {
    const { wrapper, value } = mountVModel([['asia', 'china', 'beijing']], { multiple: true });
    await openMenu(wrapper);
    checkboxOf(rowByKey('0-0-0'))?.click();
    await nextTick();
    expect(value.value).toEqual([]);
  });

  it('checking a parent commits every selectable descendant leaf path', async () => {
    const { wrapper, value } = mountVModel([], { multiple: true });
    await openMenu(wrapper);
    rowByKey('0')?.click();
    await nextTick();
    checkboxOf(rowByKey('0'))?.click();
    await nextTick();
    expect(value.value).toEqual([
      ['asia', 'china', 'beijing'],
      ['asia', 'china', 'shanghai'],
      ['asia', 'japan', 'tokyo'],
    ]);
    // Parent + child rows show the checked checkbox state.
    expect(
      checkboxOf(rowByKey('0'))?.classList.contains('sn-cascader-option__checkbox--checked'),
    ).toBe(true);
    expect(
      checkboxOf(rowByKey('0-0'))?.classList.contains('sn-cascader-option__checkbox--checked'),
    ).toBe(true);
  });

  it('skips disabled leaves when cascading a parent check', async () => {
    const { wrapper, value } = mountVModel([], { multiple: true });
    await openMenu(wrapper);
    checkboxOf(rowByKey('0'))?.click();
    await nextTick();
    expect(value.value).not.toContainEqual(['asia', 'china', 'chongqing']);
  });

  it('unchecking a fully-checked parent removes its descendant paths', async () => {
    const { wrapper, value } = mountVModel(
      [
        ['asia', 'china', 'beijing'],
        ['asia', 'china', 'shanghai'],
        ['asia', 'japan', 'tokyo'],
      ],
      { multiple: true },
    );
    await openMenu(wrapper);
    checkboxOf(rowByKey('0'))?.click();
    await nextTick();
    expect(value.value).toEqual([]);
  });

  it('marks a parent indeterminate when only some descendant leaves are checked', async () => {
    const { wrapper } = mountVModel([['asia', 'china', 'beijing']], { multiple: true });
    await openMenu(wrapper);
    const parentBox = checkboxOf(rowByKey('0'));
    expect(parentBox?.classList.contains('sn-cascader-option__checkbox--indeterminate')).toBe(true);
    expect(parentBox?.classList.contains('sn-cascader-option__checkbox--checked')).toBe(false);
    expect(
      checkboxOf(rowByKey('0-0'))?.classList.contains(
        'sn-cascader-option__checkbox--indeterminate',
      ),
    ).toBe(true);
    // The indeterminate parent cascades to fully checked on click.
    parentBox?.click();
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      [
        ['asia', 'china', 'beijing'],
        ['asia', 'china', 'shanghai'],
        ['asia', 'japan', 'tokyo'],
      ],
    ]);
  });

  it('does not check a disabled leaf via its checkbox', async () => {
    const { wrapper, value } = mountVModel([], { multiple: true });
    await openMenu(wrapper);
    rowByKey('0')?.click();
    await nextTick();
    rowByKey('0-0')?.click();
    await nextTick();
    checkboxOf(rowByKey('0-0-2'))?.click();
    await nextTick();
    expect(value.value).toEqual([]);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('row click on a leaf toggles the check in multiple mode', async () => {
    const { wrapper, value } = mountVModel([], { multiple: true });
    await openMenu(wrapper);
    rowByKey('0')?.click();
    await nextTick();
    rowByKey('0-0')?.click();
    await nextTick();
    rowByKey('0-0-0')?.click();
    await nextTick();
    expect(value.value).toEqual([['asia', 'china', 'beijing']]);
    rowByKey('0-0-0')?.click();
    await nextTick();
    expect(value.value).toEqual([]);
  });

  it('removes one path via its trigger tag close button', async () => {
    const { wrapper, value } = mountVModel(
      [
        ['asia', 'china', 'beijing'],
        ['asia', 'japan', 'tokyo'],
      ],
      { multiple: true },
    );
    const closeButtons = wrapper.findAll('.sn-cascader__tag-close');
    expect(closeButtons).toHaveLength(2);
    await closeButtons[0].trigger('click');
    expect(value.value).toEqual([['asia', 'japan', 'tokyo']]);
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[['asia', 'japan', 'tokyo']]]);
  });

  it('collapses tags into +N with maxTagCount', () => {
    const w = mountCascader({
      multiple: true,
      maxTagCount: 1,
      modelValue: [
        ['asia', 'china', 'beijing'],
        ['asia', 'china', 'shanghai'],
        ['asia', 'japan', 'tokyo'],
      ],
    });
    const labels = w.findAll('.sn-cascader__tag-label').map((t) => t.text());
    expect(labels).toEqual(['Asia / China / Beijing', '+2']);
    expect(w.find('.sn-cascader__tag--rest').exists()).toBe(true);
  });

  it('clears every path and emits clear', async () => {
    const { wrapper, value } = mountVModel([['asia', 'japan', 'tokyo']], {
      multiple: true,
      clearable: true,
    });
    await wrapper.find('.sn-cascader__clear').trigger('click');
    expect(value.value).toEqual([]);
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.find('.sn-cascader__placeholder').text()).toBe('Please select');
  });

  it('exposes check state through aria-selected and multiselectable columns', async () => {
    const w = mountCascader({ multiple: true, modelValue: [['asia', 'china', 'beijing']] });
    await openMenu(w);
    expect(rowByKey('0-0-0')?.getAttribute('aria-selected')).toBe('true');
    // Partially-checked ancestors are not aria-selected — their checkbox
    // carries the indeterminate state instead.
    expect(rowByKey('0-0')?.getAttribute('aria-selected')).toBe('false');
    expect(rowByKey('0')?.getAttribute('aria-selected')).toBe('false');
    expect(
      checkboxOf(rowByKey('0'))?.classList.contains('sn-cascader-option__checkbox--indeterminate'),
    ).toBe(true);
    expect(rowByKey('1')?.getAttribute('aria-selected')).toBe('false');
    const listbox = document.body.querySelector('.sn-cascader-menu__column');
    expect(listbox?.getAttribute('aria-multiselectable')).toBe('true');
  });

  it('reopens on the first bound path so checked rows are visible', async () => {
    const w = mountCascader({ multiple: true, modelValue: [['asia', 'japan', 'tokyo']] });
    await openMenu(w);
    expect(columns()).toHaveLength(3);
    expect(
      checkboxOf(rowByKey('0-1-0'))?.classList.contains('sn-cascader-option__checkbox--checked'),
    ).toBe(true);
  });

  it('toggles a filter match without closing the menu (multiple + filterable)', async () => {
    const { wrapper, value } = mountVModel([], { multiple: true, filterable: true });
    await openMenu(wrapper);
    await wrapper.find('.sn-cascader__filter-input').setValue('paris');
    await nextTick();
    allRows()[0]?.click();
    await nextTick();
    expect(value.value).toEqual([['europe', 'france', 'paris']]);
    expect(document.body.querySelector('.sn-cascader-menu')).not.toBeNull();
  });
});

/* ───── check-strictly (strict selection) mode ───── */

describe('SnCascader checkStrictly', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isMenu = this.classList.contains('sn-cascader-menu');
      return isMenu
        ? {
            top: 0,
            left: 0,
            width: 200,
            height: 160,
            right: 200,
            bottom: 160,
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
    for (const w of mounted.splice(0)) w.unmount();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('single strict: clicking a parent commits its own path and expands', async () => {
    const { wrapper, value } = mountVModel([], { checkStrictly: true });
    await openMenu(wrapper);
    rowByKey('0')?.click();
    await nextTick();
    expect(value.value).toEqual(['asia']);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([['asia']]);
    // The menu stays open and the child column expanded for drilling.
    expect(document.body.querySelector('.sn-cascader-menu')).not.toBeNull();
    expect(columns()).toHaveLength(2);
    expect(wrapper.find('.sn-cascader__single-value').text()).toBe('Asia');
  });

  it('single strict: Enter commits the highlighted parent', async () => {
    const { wrapper, value } = mountVModel([], { checkStrictly: true });
    const trigger = triggerOf(wrapper);
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(value.value).toEqual(['asia']);
    await nextTick();
    await menuLeft();
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
  });

  it('single strict: leaf selection still commits the full path and closes', async () => {
    const { wrapper, value } = mountVModel([], { checkStrictly: true });
    await openMenu(wrapper);
    rowByKey('0')?.click();
    await nextTick();
    rowByKey('0-0')?.click();
    await nextTick();
    rowByKey('0-0-0')?.click();
    await nextTick();
    expect(value.value).toEqual(['asia', 'china', 'beijing']);
    await menuLeft();
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
    expect(wrapper.find('.sn-cascader__single-value').text()).toBe('Asia / China / Beijing');
  });

  it('single strict: echo resolves a parent-bound path', () => {
    const w = mountCascader({ checkStrictly: true, modelValue: ['asia', 'china'] });
    expect(w.find('.sn-cascader__single-value').text()).toBe('Asia / China');
  });

  it('single strict without the prop still refuses parent commits', async () => {
    const { wrapper, value } = mountVModel([], {});
    await openMenu(wrapper);
    rowByKey('0')?.click();
    await nextTick();
    expect(value.value).toEqual([]);
  });

  it('single strict: a filter match on a parent commits and closes', async () => {
    const { wrapper, value } = mountVModel([], { checkStrictly: true, filterable: true });
    await openMenu(wrapper);
    await wrapper.find('.sn-cascader__filter-input').setValue('china');
    await nextTick();
    // Depth-first pool: the matched parent row comes before its leaf rows.
    expect(allRows()[0]?.textContent).toBe('Asia / China');
    allRows()[0]?.click();
    await nextTick();
    expect(value.value).toEqual(['asia', 'china']);
    await menuLeft();
    expect(document.body.querySelector('.sn-cascader-menu')).toBeNull();
  });

  it('multiple strict: checking a parent commits only its own path', async () => {
    const { wrapper, value } = mountVModel([], { multiple: true, checkStrictly: true });
    await openMenu(wrapper);
    checkboxOf(rowByKey('0'))?.click();
    await nextTick();
    expect(value.value).toEqual([['asia']]);
    expect(wrapper.find('.sn-cascader__tag-label').text()).toBe('Asia');
    // No cascade: the child column stayed unexpanded-child-free in value.
    expect(value.value).toHaveLength(1);
  });

  it('multiple strict: no indeterminate state on partially-checked parents', async () => {
    const w = mountCascader({
      multiple: true,
      checkStrictly: true,
      modelValue: [['asia', 'china', 'beijing']],
    });
    await openMenu(w);
    const parentBox = checkboxOf(rowByKey('0'));
    expect(parentBox?.classList.contains('sn-cascader-option__checkbox--indeterminate')).toBe(
      false,
    );
    expect(parentBox?.classList.contains('sn-cascader-option__checkbox--checked')).toBe(false);
    expect(
      checkboxOf(rowByKey('0-0-0'))?.classList.contains('sn-cascader-option__checkbox--checked'),
    ).toBe(true);
  });

  it('multiple strict: unchecking a parent removes only its own path', async () => {
    const { wrapper, value } = mountVModel([['asia'], ['asia', 'china', 'beijing']], {
      multiple: true,
      checkStrictly: true,
    });
    await openMenu(wrapper);
    checkboxOf(rowByKey('0'))?.click();
    await nextTick();
    expect(value.value).toEqual([['asia', 'china', 'beijing']]);
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[['asia', 'china', 'beijing']]]);
  });

  it('multiple strict: parent rows still expand on click', async () => {
    const { wrapper, value } = mountVModel([], { multiple: true, checkStrictly: true });
    await openMenu(wrapper);
    rowByKey('0')?.click();
    await nextTick();
    expect(columns()).toHaveLength(2);
    expect(value.value).toEqual([]);
  });

  it('multiple strict: filter matches include parents and toggle them in place', async () => {
    const { wrapper, value } = mountVModel([], {
      multiple: true,
      checkStrictly: true,
      filterable: true,
    });
    await openMenu(wrapper);
    await wrapper.find('.sn-cascader__filter-input').setValue('china');
    await nextTick();
    expect(allRows()[0]?.textContent).toBe('Asia / China');
    allRows()[0]?.click();
    await nextTick();
    expect(value.value).toEqual([['asia', 'china']]);
    expect(document.body.querySelector('.sn-cascader-menu')).not.toBeNull();
  });
});
