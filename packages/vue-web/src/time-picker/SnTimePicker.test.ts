/**
 * SnTimePicker unit tests — web-end time picker (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): v-model round-trip, format display,
 * three-column selection, clearable, disabled / readonly, keyboard
 * (ArrowUp/Down step, Tab switches column, Enter confirm, Esc close),
 * 12-hour mode, panel open/close, outside click, listener cleanup,
 * viewport-flip positioning.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import SnTimePicker from './SnTimePicker.vue';

/** Mounted wrappers tracked so afterEach can unmount before clearing body. */
const mounted: Array<{ unmount: () => void }> = [];

/** Mount helper with default options. */
function mountPicker(props: Record<string, unknown> = {}) {
  const w = mount(SnTimePicker, {
    props,
    attachTo: document.body,
  });
  mounted.push(w);
  return w;
}

/** Mount with a live v-model so commits round-trip. */
function mountVModel(initial: number | null, props: Record<string, unknown> = {}) {
  const value = ref<number | null>(initial);
  const wrapper = mount(
    {
      setup() {
        return () =>
          h(SnTimePicker, {
            ...props,
            modelValue: value.value,
            'onUpdate:modelValue': (v: number | null) => {
              value.value = v;
            },
          });
      },
    },
    { attachTo: document.body },
  );
  mounted.push(wrapper);
  return { wrapper: wrapper.findComponent(SnTimePicker), value };
}

/** Local-timezone timestamp for one time-of-day on a fixed date. */
function ts(hour: number, minute: number, second: number): number {
  return new Date(2026, 0, 15, hour, minute, second, 0).getTime();
}

/** Open the panel by clicking the trigger. */
async function openPanel(wrapper: {
  find: (sel: string) => { trigger: (ev: string, o?: unknown) => Promise<void> };
}) {
  await wrapper.find('.sn-time-picker__selection').trigger('click');
  await nextTick();
}

/**
 * Wait out the sn-pop leave transition (150ms + frame timing) so a closed
 * panel is actually gone from the DOM before asserting.
 */
async function panelLeft(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 250));
}

/** The teleported panel element (null when closed). */
function panelEl(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('.sn-time-picker-panel');
}

/** One cell by column + value. */
function cell(key: string, value: number | string): HTMLElement | null {
  return document.body.querySelector<HTMLElement>(
    `.sn-time-picker-item[data-column="${key}"][data-value="${value}"]`,
  );
}

/** All listbox columns currently in the teleported panel. */
function columnCount(): number {
  return document.body.querySelectorAll('[role="listbox"]').length;
}

/** The trigger combobox element. */
function triggerOf(wrapper: {
  find: (sel: string) => {
    trigger: (ev: string, o?: unknown) => Promise<void>;
    attributes: (a: string) => string | undefined;
  };
}) {
  return wrapper.find('.sn-time-picker__selection');
}

describe('SnTimePicker', () => {
  beforeEach(() => {
    // happy-dom has no layout — give the trigger + panel stable rects.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isPanel = this.classList.contains('sn-time-picker-panel');
      return isPanel
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

  /* ───── display ───── */

  it('shows the placeholder when empty', () => {
    const w = mountPicker({ placeholder: 'Pick a time' });
    expect(w.find('.sn-time-picker__placeholder').text()).toBe('Pick a time');
  });

  it('displays the formatted time for a timestamp', () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7) });
    expect(w.find('.sn-time-picker__value').text()).toBe('09:05:07');
  });

  it('respects the HH:mm format in the display', () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7), format: 'HH:mm' });
    expect(w.find('.sn-time-picker__value').text()).toBe('09:05');
  });

  /* ───── panel layout ───── */

  it('opens the panel on trigger click with three listbox columns', async () => {
    const w = mountPicker();
    expect(panelEl()).toBeNull();
    await openPanel(w);
    expect(panelEl()).not.toBeNull();
    expect(columnCount()).toBe(3);
    expect(document.body.querySelectorAll('.sn-time-picker-item[data-column="hour"]')).toHaveLength(
      24,
    );
    expect(
      document.body.querySelectorAll('.sn-time-picker-item[data-column="minute"]'),
    ).toHaveLength(60);
    expect(
      document.body.querySelectorAll('.sn-time-picker-item[data-column="second"]'),
    ).toHaveLength(60);
    expect(cell('hour', 0)?.textContent?.trim()).toBe('00');
    expect(cell('hour', 23)?.textContent?.trim()).toBe('23');
  });

  it('hides the seconds column for the HH:mm format', async () => {
    const w = mountPicker({ format: 'HH:mm' });
    await openPanel(w);
    expect(columnCount()).toBe(2);
    expect(cell('second', 0)).toBeNull();
  });

  it('marks the current value cells as selected', async () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7) });
    await openPanel(w);
    expect(cell('hour', 9)?.getAttribute('aria-selected')).toBe('true');
    expect(cell('minute', 5)?.getAttribute('aria-selected')).toBe('true');
    expect(cell('second', 7)?.getAttribute('aria-selected')).toBe('true');
    expect(cell('hour', 9)?.classList.contains('sn-time-picker-item--selected')).toBe(true);
    expect(cell('hour', 10)?.getAttribute('aria-selected')).toBe('false');
  });

  /* ───── column selection ───── */

  it('selecting a minute cell commits immediately and syncs v-model', async () => {
    const { wrapper, value } = mountVModel(ts(9, 5, 7));
    await openPanel(wrapper);
    cell('minute', 30)?.click();
    expect(value.value).toBe(ts(9, 30, 7));
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([ts(9, 30, 7)]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([ts(9, 30, 7)]);
  });

  it('selecting across all three columns updates each part', async () => {
    const { value } = mountVModel(ts(9, 5, 7));
    await openPanel(mounted[mounted.length - 1] as never);
    cell('hour', 14)?.click();
    cell('minute', 30)?.click();
    cell('second', 45)?.click();
    expect(value.value).toBe(ts(14, 30, 45));
  });

  it('keeps the panel open after selecting a cell', async () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7) });
    await openPanel(w);
    cell('hour', 10)?.click();
    await nextTick();
    expect(panelEl()).not.toBeNull();
  });

  it('zeroes the seconds part when committing in HH:mm format', async () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7), format: 'HH:mm' });
    await openPanel(w);
    cell('minute', 30)?.click();
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([ts(9, 30, 0)]);
  });

  it('sets aria-expanded on the trigger', async () => {
    const w = mountPicker();
    const trigger = triggerOf(w);
    expect(trigger.attributes('aria-expanded')).toBe('false');
    await openPanel(w);
    expect(trigger.attributes('aria-expanded')).toBe('true');
  });

  /* ───── keyboard ───── */

  it('opens with Enter and steps the hour with ArrowDown', async () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7) });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(panelEl()).not.toBeNull();
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([ts(10, 5, 7)]);
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([ts(11, 5, 7)]);
    expect(w.emitted('change')).toHaveLength(2);
  });

  it('steps backward with ArrowUp and wraps the hour at midnight', async () => {
    const w = mountPicker({ modelValue: ts(0, 5, 7) });
    // ArrowUp on the closed picker opens it and wraps 0 → 23 directly.
    await triggerOf(w).trigger('keydown', { key: 'ArrowUp' });
    expect(panelEl()).not.toBeNull();
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([ts(23, 5, 7)]);
  });

  it('ArrowUp on a closed picker opens it and steps from the current value', async () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7) });
    await triggerOf(w).trigger('keydown', { key: 'ArrowUp' });
    expect(panelEl()).not.toBeNull();
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([ts(8, 5, 7)]);
  });

  it('opens with Space without scrolling the page', async () => {
    const w = mountPicker();
    await triggerOf(w).trigger('keydown', { key: ' ' });
    await nextTick();
    expect(panelEl()).not.toBeNull();
  });

  it('Tab switches to the next column for stepping', async () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7) });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await trigger.trigger('keydown', { key: 'Tab' });
    expect(trigger.attributes('aria-activedescendant')).toContain('minute');
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([ts(9, 6, 7)]);
  });

  it('Shift+Tab switches back to the previous column', async () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7) });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await trigger.trigger('keydown', { key: 'Tab' });
    expect(trigger.attributes('aria-activedescendant')).toContain('minute');
    await trigger.trigger('keydown', { key: 'Tab', shiftKey: true });
    expect(trigger.attributes('aria-activedescendant')).toContain('hour');
    // hour → minute → hour: ArrowDown steps the hour again.
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([ts(10, 5, 7)]);
  });

  it('Enter closes the panel without re-committing a set value', async () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7) });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('Enter commits the initialized time when the model is null', async () => {
    const w = mountPicker();
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await trigger.trigger('keydown', { key: 'Enter' });
    const emitted = w.emitted('update:modelValue');
    expect(emitted).toHaveLength(1);
    expect(typeof emitted?.[0]?.[0]).toBe('number');
  });

  it('Escape closes the panel without committing a null model', async () => {
    const w = mountPicker();
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await trigger.trigger('keydown', { key: 'Escape' });
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  /* ───── clearable ───── */

  it('clears the value via the clear button', async () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7), clearable: true });
    await w.find('.sn-time-picker__clear').trigger('click');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([null]);
    expect(w.emitted('change')?.at(-1)).toEqual([null]);
  });

  it('hides the clear button when empty or disabled', () => {
    expect(mountPicker({ clearable: true }).find('.sn-time-picker__clear').exists()).toBe(false);
    expect(
      mountPicker({ modelValue: ts(9, 5, 7), clearable: true, disabled: true })
        .find('.sn-time-picker__clear')
        .exists(),
    ).toBe(false);
  });

  /* ───── disabled / readonly ───── */

  it('does not open when disabled', async () => {
    const w = mountPicker({ disabled: true });
    await triggerOf(w).trigger('click');
    expect(panelEl()).toBeNull();
    expect(w.find('.sn-time-picker--disabled').exists()).toBe(true);
    await triggerOf(w).trigger('keydown', { key: 'Enter' });
    expect(panelEl()).toBeNull();
  });

  it('does not open when readonly', async () => {
    const w = mountPicker({ readonly: true });
    await triggerOf(w).trigger('click');
    expect(panelEl()).toBeNull();
  });

  /* ───── 12-hour mode ───── */

  it('renders four columns with an AM/PM column in 12-hour mode', async () => {
    const w = mountPicker({ use12Hours: true });
    await openPanel(w);
    expect(columnCount()).toBe(4);
    const hourItems = document.body.querySelectorAll('.sn-time-picker-item[data-column="hour"]');
    expect(hourItems).toHaveLength(12);
    expect(hourItems[0]?.textContent?.trim()).toBe('12');
    expect(cell('period', 0)?.textContent?.trim()).toBe('AM');
    expect(cell('period', 1)?.textContent?.trim()).toBe('PM');
  });

  it('displays the 12-hour format with the period suffix', () => {
    const w = mountPicker({ modelValue: ts(9, 5, 7), use12Hours: true });
    expect(w.find('.sn-time-picker__value').text()).toBe('09:05:07 AM');
    const w2 = mountPicker({ modelValue: ts(21, 5, 7), use12Hours: true });
    expect(w2.find('.sn-time-picker__value').text()).toBe('09:05:07 PM');
  });

  it('clicking PM converts to 24-hour time', async () => {
    const { value } = mountVModel(ts(9, 5, 7), { use12Hours: true });
    await openPanel(mounted[mounted.length - 1] as never);
    cell('period', 1)?.click();
    expect(value.value).toBe(ts(21, 5, 7));
  });

  it('clicking an hour cell in 12-hour mode keeps the period', async () => {
    const { value } = mountVModel(ts(13, 5, 7), { use12Hours: true });
    await openPanel(mounted[mounted.length - 1] as never);
    expect(cell('hour', 1)?.getAttribute('aria-selected')).toBe('true');
    cell('hour', 5)?.click();
    expect(value.value).toBe(ts(17, 5, 7));
  });

  /* ───── open/close behavior ───── */

  it('toggles the panel on repeated trigger clicks', async () => {
    const w = mountPicker();
    const trigger = triggerOf(w);
    await trigger.trigger('click');
    await nextTick();
    expect(panelEl()).not.toBeNull();
    await trigger.trigger('click');
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
  });

  it('closes on outside click', async () => {
    const w = mountPicker();
    await openPanel(w);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
  });

  it('stays open when clicking inside the panel', async () => {
    const w = mountPicker();
    await openPanel(w);
    panelEl()?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    expect(panelEl()).not.toBeNull();
  });

  it('removes the document listener on unmount (no leak)', async () => {
    const w = mountPicker();
    await openPanel(w);
    const spy = vi.spyOn(document, 'removeEventListener');
    w.unmount();
    expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    spy.mockRestore();
  });

  /* ───── events / positioning ───── */

  it('emits focus and blur from the trigger', async () => {
    const w = mountPicker();
    await triggerOf(w).trigger('focus');
    await triggerOf(w).trigger('blur');
    expect(w.emitted('focus')).toHaveLength(1);
    expect(w.emitted('blur')).toHaveLength(1);
  });

  it('positions the panel below the trigger by default', async () => {
    const w = mountPicker();
    await openPanel(w);
    await nextTick();
    const panel = panelEl();
    expect(panel?.style.top).toBe('332px');
    expect(panel?.style.left).toBe('40px');
    expect(panel?.classList.contains('sn-time-picker-panel--bottom')).toBe(true);
  });

  it('flips the panel above the trigger when below lacks room', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isPanel = this.classList.contains('sn-time-picker-panel');
      return isPanel
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
            top: 700,
            left: 40,
            width: 200,
            height: 32,
            right: 240,
            bottom: 732,
            x: 40,
            y: 700,
            toJSON: () => ({}),
          };
    });
    // repositionPanel measures the layout box (offsetHeight), not the
    // transformed rect, so the enter scale never skews the flip math.
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.classList.contains('sn-time-picker-panel') ? 160 : 32;
    });
    const w = mountPicker();
    await openPanel(w);
    await nextTick();
    const panel = panelEl();
    expect(panel?.classList.contains('sn-time-picker-panel--top')).toBe(true);
    expect(panel?.style.top).toBe('540px'); // 700 - 160
  });

  it('opens the panel through the sn-pop transition and settles with it mounted', async () => {
    // VTU stubs Transition by default; opt into the real one here so the
    // sn-pop enter classes are actually applied.
    const w = mount(SnTimePicker, {
      props: {},
      attachTo: document.body,
      global: { stubs: { transition: false } },
    });
    mounted.push(w);
    await openPanel(w);
    const panel = panelEl() as HTMLElement;
    // Enter classes prove the Transition name is sn-pop (applied synchronously).
    expect(panel).not.toBeNull();
    expect(
      panel.classList.contains('sn-pop-enter-from') ||
        panel.classList.contains('sn-pop-enter-active'),
    ).toBe(true);
    // Enter completes within 300ms: panel still mounted, enter classes gone.
    await new Promise((resolve) => setTimeout(resolve, 300));
    const settled = panelEl() as HTMLElement | null;
    expect(settled).not.toBeNull();
    expect(settled.classList.contains('sn-pop-enter-active')).toBe(false);
    expect(settled.classList.contains('sn-pop-enter-from')).toBe(false);
  });

  it('applies size and status classes', () => {
    expect(mountPicker({ size: 'large' }).classes()).toContain('sn-time-picker--large');
    expect(mountPicker({ status: 'error' }).classes()).toContain('sn-time-picker--status-error');
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
  const PANEL_RECT = {
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

  it('keeps the panel glued to the trigger when the page scrolls while open', async () => {
    const w = mountPicker();
    await openPanel(w);
    await nextTick();
    const panel = panelEl() as HTMLElement;
    expect(panel.style.left).toBe('40px');
    // The page scrolled: the trigger's viewport rect moved 80px right.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.classList.contains('sn-time-picker-panel') ? PANEL_RECT : TRIGGER_RECT(120);
    });
    stubSyncFrame();
    window.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(panel.style.left).toBe('120px');
    vi.unstubAllGlobals();
  });

  it('stops following page scroll once the panel closes', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const w = mountPicker();
    await openPanel(w);
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
    const w = mountPicker();
    await openPanel(w);
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
