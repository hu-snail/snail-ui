import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import SnPopselect from './SnPopselect.vue';

const Trigger = defineComponent({
  name: 'Trigger',
  setup() {
    return () => h('button', { class: 'trigger-btn' }, 'trigger');
  },
});

const BASIC_OPTIONS = [
  { label: 'Johnson County', value: 'joco' },
  { label: 'Clark County', value: 'clark' },
  { label: 'Douglas County', value: 'douglas' },
];

function stubRect() {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value(this: HTMLElement) {
      const isPanel = this.classList?.contains('sn-popselect');
      const r = isPanel
        ? { top: 0, left: 0, width: 160, height: 120 }
        : { top: 384, left: 500, width: 100, height: 32 };
      return {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        right: r.left + r.width,
        bottom: r.top + r.height,
        x: r.left,
        y: r.top,
        toJSON() {
          return {};
        },
      };
    },
  });
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
}

function panelEl(): HTMLElement {
  const pop = document.body.querySelector('.sn-popselect') as HTMLElement | null;
  expect(pop).not.toBeNull();
  return pop!;
}

function optionEls(): HTMLElement[] {
  return Array.from(panelEl().querySelectorAll('.sn-popselect-option')) as HTMLElement[];
}

function optionByValue(value: string): HTMLElement {
  const row = panelEl().querySelector(`[data-value="${value}"]`) as HTMLElement | null;
  expect(row).not.toBeNull();
  return row!;
}

function pressKey(key: string): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

async function flush(times = 4): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('SnPopselect (AUI-WEB-FB-011)', () => {
  const wrappers: ReturnType<typeof mountPopselect>[] = [];

  beforeEach(() => stubRect());
  afterEach(async () => {
    vi.restoreAllMocks();
    for (const w of wrappers) {
      w.unmount();
      await nextTick();
    }
    wrappers.length = 0;
    document.body.querySelectorAll('.sn-popselect').forEach((el) => el.remove());
  });

  function mountPopselect(
    props: Record<string, unknown> = {},
    slots: Record<string, unknown> = {},
  ) {
    const w = mount(SnPopselect, {
      props,
      slots: { default: slots.default ?? (() => h(Trigger)), ...slots },
      attachTo: document.body,
    });
    wrappers.push(w);
    return w;
  }

  async function open(w: ReturnType<typeof mountPopselect>): Promise<void> {
    await w.find('.sn-popselect-trigger').trigger('click');
    await nextTick();
    await new Promise((r) => setTimeout(r, 10));
  }

  describe('rendering', () => {
    it('renders the default slot wrapped in span.sn-popselect-trigger', () => {
      const w = mountPopselect({ options: BASIC_OPTIONS });
      expect(w.find('.sn-popselect-trigger').exists()).toBe(true);
      expect(w.find('button.trigger-btn').exists()).toBe(true);
    });

    it('opens on trigger click (click is the default trigger)', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS });
      expect(document.body.querySelector('.sn-popselect')).toBeNull();
      await open(w);
      expect(document.body.querySelector('.sn-popselect')).not.toBeNull();
    });

    it('marks the panel with data-snui-component="popselect"', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS, show: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().getAttribute('data-snui-component')).toBe('popselect');
      w.unmount();
    });

    it('renders the menu as role="listbox" with role="option" rows', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS, show: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('[role="listbox"]')).not.toBeNull();
      const rows = optionEls();
      expect(rows).toHaveLength(3);
      expect(rows.every((r) => r.getAttribute('role') === 'option')).toBe(true);
      w.unmount();
    });

    it('accepts bare-value options and renders them as labels', async () => {
      const w = mountPopselect({ options: ['a', 'b', 'c'], show: true });
      await new Promise((r) => setTimeout(r, 10));
      const rows = optionEls();
      expect(rows.map((r) => r.textContent?.trim())).toEqual(['a', 'b', 'c']);
      w.unmount();
    });

    it('reflects defaultValue with aria-selected and the check glyph', async () => {
      const w = mountPopselect({
        options: BASIC_OPTIONS,
        defaultValue: 'clark',
        show: true,
      });
      await new Promise((r) => setTimeout(r, 10));
      const selected = optionByValue('clark');
      expect(selected.getAttribute('aria-selected')).toBe('true');
      expect(selected.classList.contains('sn-popselect-option--selected')).toBe(true);
      expect(selected.querySelector('.sn-popselect-option__check')).not.toBeNull();
      // Unselected rows carry no check.
      expect(optionByValue('joco').querySelector('.sn-popselect-option__check')).toBeNull();
      w.unmount();
    });

    it('renders group headers with their children selectable', async () => {
      const w = mountPopselect({
        options: [
          {
            label: 'Group one',
            value: 'g1',
            children: [
              { label: 'Inner A', value: 'ia' },
              { label: 'Inner B', value: 'ib' },
            ],
          },
        ],
        show: true,
      });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('.sn-popselect-group__label')?.textContent).toContain(
        'Group one',
      );
      expect(optionEls()).toHaveLength(2);
      w.unmount();
    });
  });

  describe('value semantics', () => {
    it('single select: click commits update:value and closes the menu', async () => {
      const values: unknown[] = [];
      const w = mountPopselect({
        options: BASIC_OPTIONS,
        defaultValue: null,
        'onUpdate:value': (v: unknown) => values.push(v),
      });
      await open(w);
      optionByValue('clark').click();
      await flush();
      expect(values).toEqual(['clark']);
      expect(document.body.querySelector('.sn-popselect')).toBeNull();
    });

    it('single select: controlled value + update:value emission', async () => {
      const values: unknown[] = [];
      const w = mountPopselect({
        options: BASIC_OPTIONS,
        value: 'joco',
        show: true,
        'onUpdate:value': (v: unknown) => values.push(v),
      });
      await new Promise((r) => setTimeout(r, 10));
      optionByValue('douglas').click();
      await flush();
      expect(values).toEqual(['douglas']);
      // Controlled: the parent has not mirrored, so selection stays joco.
      expect(optionByValue('joco').getAttribute('aria-selected')).toBe('true');
      w.unmount();
    });

    it('multiple: toggles membership, stays open, emits arrays', async () => {
      const values: unknown[] = [];
      const w = mountPopselect({
        options: BASIC_OPTIONS,
        multiple: true,
        defaultValue: [],
        'onUpdate:value': (v: unknown) => values.push(v),
      });
      await open(w);
      optionByValue('joco').click();
      await flush();
      optionByValue('clark').click();
      await flush();
      expect(values).toEqual([['joco'], ['joco', 'clark']]);
      // Menu stays open in multiple mode.
      expect(document.body.querySelector('.sn-popselect')).not.toBeNull();
      // Toggling off removes the value.
      optionByValue('joco').click();
      await flush();
      expect(values[2]).toEqual(['clark']);
      w.unmount();
    });

    it('disabled options render aria-disabled and ignore clicks', async () => {
      const values: unknown[] = [];
      const w = mountPopselect({
        options: [{ label: 'Locked', value: 'locked', disabled: true }, ...BASIC_OPTIONS],
        'onUpdate:value': (v: unknown) => values.push(v),
      });
      await open(w);
      const locked = optionByValue('locked');
      expect(locked.getAttribute('aria-disabled')).toBe('true');
      expect(locked.classList.contains('sn-popselect-option--disabled')).toBe(true);
      locked.click();
      await flush();
      expect(values).toEqual([]);
      w.unmount();
    });
  });

  describe('keyboard', () => {
    it('ArrowDown moves the pending highlight, wrapping to the top', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS, show: true });
      await new Promise((r) => setTimeout(r, 10));
      // Initial pending: first row (no selection yet).
      expect(optionByValue('joco').classList.contains('sn-popselect-option--pending')).toBe(true);
      pressKey('ArrowDown');
      await flush();
      expect(optionByValue('clark').classList.contains('sn-popselect-option--pending')).toBe(true);
      pressKey('ArrowUp');
      await flush();
      pressKey('ArrowUp');
      await flush();
      // Wrapped to the last row.
      expect(optionByValue('douglas').classList.contains('sn-popselect-option--pending')).toBe(
        true,
      );
      w.unmount();
    });

    it('seeds the pending highlight on the selected row when opening', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS, defaultValue: 'clark', show: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(optionByValue('clark').classList.contains('sn-popselect-option--pending')).toBe(true);
      w.unmount();
    });

    it('Enter commits the pending option', async () => {
      const values: unknown[] = [];
      const w = mountPopselect({
        options: BASIC_OPTIONS,
        'onUpdate:value': (v: unknown) => values.push(v),
      });
      await open(w);
      pressKey('ArrowDown'); // clark
      await flush();
      pressKey('Enter');
      await flush();
      expect(values).toEqual(['clark']);
      expect(document.body.querySelector('.sn-popselect')).toBeNull();
    });

    it('Escape closes the menu', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS });
      await open(w);
      expect(document.body.querySelector('.sn-popselect')).not.toBeNull();
      pressKey('Escape');
      await flush();
      expect(document.body.querySelector('.sn-popselect')).toBeNull();
    });

    it('skips disabled options while moving the highlight', async () => {
      const w = mountPopselect({
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
          { label: 'C', value: 'c' },
        ],
        show: true,
      });
      await new Promise((r) => setTimeout(r, 10));
      pressKey('ArrowDown'); // from a → skips b → c
      await flush();
      expect(optionByValue('c').classList.contains('sn-popselect-option--pending')).toBe(true);
      w.unmount();
    });

    it('publishes the pending row via aria-activedescendant', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS, show: true });
      await new Promise((r) => setTimeout(r, 10));
      pressKey('ArrowDown');
      await flush();
      const listbox = panelEl().querySelector('[role="listbox"]') as HTMLElement;
      const clark = optionByValue('clark');
      expect(listbox.getAttribute('aria-activedescendant')).toBe(clark.id);
      w.unmount();
    });
  });

  describe('custom renderers', () => {
    it('renderLabel receives the normalized leaf and selected flag', async () => {
      const renderLabel = vi.fn((leaf: { label: string; value: unknown }, selected: boolean) =>
        h('em', { class: 'custom-label' }, `${leaf.label}${selected ? '!' : ''}`),
      );
      const w = mountPopselect({
        options: BASIC_OPTIONS,
        defaultValue: 'clark',
        renderLabel,
        show: true,
      });
      await new Promise((r) => setTimeout(r, 10));
      expect(renderLabel).toHaveBeenCalled();
      const labels = panelEl().querySelectorAll('.custom-label');
      expect(labels).toHaveLength(3);
      expect(labels[1]?.textContent).toContain('Clark County!');
      w.unmount();
    });

    it('renderOption wraps the default node with node / option / selected info', async () => {
      const renderOption = vi.fn(
        (info: { node: unknown; option: { label: string }; selected: boolean }) =>
          h('div', { class: 'wrapped-option' }, [info.node as never, info.selected ? '*' : '']),
      );
      const w = mountPopselect({
        options: BASIC_OPTIONS,
        defaultValue: 'joco',
        renderOption,
        show: true,
      });
      await new Promise((r) => setTimeout(r, 10));
      expect(renderOption).toHaveBeenCalled();
      const call = renderOption.mock.calls[0]?.[0] as {
        selected: boolean;
        option: { label: string };
      };
      expect(call.selected).toBe(true);
      expect(call.option.label).toBe('Johnson County');
      const wrapped = panelEl().querySelectorAll('.wrapped-option');
      expect(wrapped).toHaveLength(3);
      expect(wrapped[0]?.textContent).toContain('*');
      // The default node content is preserved inside the wrapper.
      expect(wrapped[1]?.textContent).toContain('Clark County');
      w.unmount();
    });
  });

  describe('menu surface', () => {
    it('forwards menuProps onto the listbox element', async () => {
      const w = mountPopselect({
        options: BASIC_OPTIONS,
        show: true,
        menuProps: { 'data-hj': 'menu-marker' },
      });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('[role="listbox"]')?.getAttribute('data-hj')).toBe(
        'menu-marker',
      );
      w.unmount();
    });

    it('marks aria-multiselectable in multiple mode', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS, multiple: true, show: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(
        panelEl().querySelector('[role="listbox"]')?.getAttribute('aria-multiselectable'),
      ).toBe('true');
      w.unmount();
    });

    it('applies the scrollable class when scrollable is set', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS, show: true, scrollable: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().classList.contains('sn-popselect--scrollable')).toBe(true);
      w.unmount();
    });

    it('keeps the requested placement class on the panel', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS, show: true, placement: 'top-start' });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().classList.contains('sn-popselect--top-start')).toBe(true);
      w.unmount();
    });
  });

  describe('show control', () => {
    it('controlled show renders the menu; update:show is emitted on close', async () => {
      const seen: boolean[] = [];
      const w = mountPopselect({
        options: BASIC_OPTIONS,
        show: true,
        'onUpdate:show': (v: boolean) => seen.push(v),
      });
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popselect')).not.toBeNull();
      pressKey('Escape');
      await flush();
      expect(seen).toEqual([false]);
      w.unmount();
    });

    it('manual trigger ignores gestures and follows show only', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS, trigger: 'manual' });
      await w.find('.sn-popselect-trigger').trigger('click');
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popselect')).toBeNull();
      await w.setProps({ show: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popselect')).not.toBeNull();
    });

    it('hover trigger opens and closes around the pointer', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS, trigger: 'hover' });
      await w.find('.sn-popselect-trigger').trigger('mouseenter');
      await new Promise((r) => setTimeout(r, 150));
      expect(document.body.querySelector('.sn-popselect')).not.toBeNull();
      await w.find('.sn-popselect-trigger').trigger('mouseleave');
      await new Promise((r) => setTimeout(r, 150));
      expect(document.body.querySelector('.sn-popselect')).toBeNull();
    });

    it('closes on an outside click with the click trigger', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS });
      await open(w);
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await flush();
      expect(document.body.querySelector('.sn-popselect')).toBeNull();
    });

    it('exposes imperative show / hide / isShown', async () => {
      const w = mountPopselect({ options: BASIC_OPTIONS });
      const exposed = w.vm as unknown as {
        show: () => void;
        hide: () => void;
        isShown: () => boolean;
      };
      expect(exposed.isShown()).toBe(false);
      exposed.show();
      await new Promise((r) => setTimeout(r, 10));
      expect(exposed.isShown()).toBe(true);
      expect(document.body.querySelector('.sn-popselect')).not.toBeNull();
      exposed.hide();
      await flush();
      expect(exposed.isShown()).toBe(false);
    });
  });
});
