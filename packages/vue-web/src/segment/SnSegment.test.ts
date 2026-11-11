import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, reactive, ref, type Component } from 'vue';
import SnSegment from './SnSegment.vue';
import type { SnSegmentOption } from './sn-segment-types';

/** Stand-in icon component (the real ones are lucide-vue-next SVG components). */
const FakeIcon: Component = defineComponent({
  name: 'FakeIcon',
  render: () => h('i', { class: 'fake-icon' }),
});

// happy-dom has no layout engine — offsetLeft / offsetWidth are always 0.
// Stub deterministic metrics on the prototype so the thumb measurement has
// real numbers to report (the values double as assertions below).
Object.defineProperty(HTMLElement.prototype, 'offsetLeft', { value: 42, configurable: true });
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { value: 96, configurable: true });

const OPTIONS: SnSegmentOption[] = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'reports', label: 'Reports', disabled: true },
  { value: 'settings', label: 'Settings' },
];

/** Mount SnSegment through a wrapper component, mirroring real usage. */
function mountSegment(props: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnSegment },
      setup() {
        return () => h(SnSegment, props as never);
      },
    }),
  );
}

/** Two ticks: the thumb measurement is scheduled on the tick after mount. */
async function flushTicks(w: { vm: { $nextTick: () => Promise<void> } }): Promise<void> {
  await w.vm.$nextTick();
  await w.vm.$nextTick();
}

/** Mount through a live parent ref so controlled updates round-trip. */
function mountLiveSegment(props: Record<string, unknown>, state: { value: unknown }) {
  return mount(
    defineComponent({
      components: { SnSegment },
      setup() {
        return () =>
          h(SnSegment, {
            ...props,
            modelValue: state.value,
            'onUpdate:modelValue': (key: unknown) => {
              state.value = key;
            },
          } as never);
      },
    }),
  );
}

describe('SnSegment (AUI-WEB-SEGMENT-001)', () => {
  describe('rendering', () => {
    it('renders a radiogroup with one radio per option', () => {
      const w = mountSegment({ options: OPTIONS });
      expect(w.find('.sn-segment').attributes('role')).toBe('radiogroup');
      expect(w.findAll('[role="radio"]')).toHaveLength(OPTIONS.length);
    });

    it('defaults to md size and default variant with no selection', () => {
      const w = mountSegment({ options: OPTIONS });
      const root = w.find('.sn-segment');
      expect(root.classes()).toContain('sn-segment--md');
      expect(root.classes()).toContain('sn-segment--default');
    });

    it('applies the size and variant modifier classes', () => {
      for (const size of ['sm', 'md', 'lg'] as const) {
        const w = mountSegment({ options: OPTIONS, size });
        expect(w.find('.sn-segment').classes()).toContain(`sn-segment--${size}`);
      }
      const ghost = mountSegment({ options: OPTIONS, variant: 'ghost' });
      expect(ghost.find('.sn-segment').classes()).toContain('sn-segment--ghost');
    });

    it('renders icons and labels, and keeps an icon-only item label-free', () => {
      const w = mountSegment({
        options: [
          { value: 'sun', icon: FakeIcon },
          { value: 'both', label: '两者', icon: FakeIcon },
        ],
      });
      const items = w.findAll('.sn-segment__item');
      expect(items[0]?.find('.fake-icon').exists()).toBe(true);
      expect(items[0]?.find('.sn-segment__label').exists()).toBe(false);
      expect(items[1]?.find('.sn-segment__label').text()).toBe('两者');
    });

    it('renders no separators by default and hides them adjacent to the selection', () => {
      const base = { options: OPTIONS, separators: true };
      // 4 items → 3 divider slots; only the two next to the selection hide.
      expect(mountSegment({ ...base, modelValue: 'dashboard' }).findAll('.sn-segment__separator')).toHaveLength(2);
      expect(mountSegment({ ...base, modelValue: 'analytics' }).findAll('.sn-segment__separator')).toHaveLength(1);
      expect(mountSegment({ ...base, modelValue: 'reports' }).findAll('.sn-segment__separator')).toHaveLength(1);
      expect(mountSegment({ ...base }).findAll('.sn-segment__separator')).toHaveLength(3);
    });
  });

  describe('selection', () => {
    it('marks the selected item aria-checked and selected', () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'analytics' });
      const items = w.findAll('[role="radio"]');
      expect(items[1]?.attributes('aria-checked')).toBe('true');
      expect(items[1]?.classes()).toContain('sn-segment__item--selected');
      expect(items[0]?.attributes('aria-checked')).toBe('false');
    });

    it('emits update:modelValue and change on click', async () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'dashboard' });
      await w.findAll('[role="radio"]')[3]!.trigger('click');
      const emitted = w.findComponent(SnSegment).emitted();
      expect(emitted['update:modelValue']?.[0]).toEqual(['settings']);
      expect(emitted['change']?.[0]).toEqual(['settings']);
    });

    it('supports uncontrolled selection via defaultValue', async () => {
      const w = mountSegment({ options: OPTIONS, defaultValue: 'analytics' });
      expect(w.findAll('[role="radio"]')[1]?.attributes('aria-checked')).toBe('true');
      await w.findAll('[role="radio"]')[0]!.trigger('click');
      expect(w.findComponent(SnSegment).emitted('update:modelValue')?.[0]).toEqual(['dashboard']);
    });

    it('does not re-emit when the selected item is clicked again', async () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'dashboard' });
      await w.findAll('[role="radio"]')[0]!.trigger('click');
      expect(w.findComponent(SnSegment).emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('disabled states', () => {
    it('blocks interaction and emits nothing while the root is disabled', async () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'dashboard', disabled: true });
      const root = w.find('.sn-segment');
      expect(root.classes()).toContain('sn-segment--disabled');
      expect(root.attributes('aria-disabled')).toBe('true');
      for (const btn of w.findAll('[role="radio"]')) {
        expect(btn.attributes('disabled')).toBeDefined();
      }
      await w.findAll('[role="radio"]')[1]!.trigger('click');
      expect(w.findComponent(SnSegment).emitted('update:modelValue')).toBeUndefined();
    });

    it('renders a disabled item unclickable and keeps it out of selection', async () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'dashboard' });
      const disabledItem = w.findAll('[role="radio"]')[2]!;
      expect(disabledItem.classes()).toContain('sn-segment__item--disabled');
      expect(disabledItem.attributes('disabled')).toBeDefined();
      await disabledItem.trigger('click');
      expect(w.findComponent(SnSegment).emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('radiogroup keyboard pattern', () => {
    it('moves to the next enabled item with ArrowRight, skipping the disabled one', async () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'analytics' });
      await w.find('.sn-segment').trigger('keydown', { key: 'ArrowRight' });
      // reports is disabled → selection lands on settings.
      expect(w.findComponent(SnSegment).emitted('update:modelValue')?.[0]).toEqual(['settings']);
    });

    it('moves backwards with ArrowLeft from the first item onto the last enabled one', async () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'dashboard' });
      await w.find('.sn-segment').trigger('keydown', { key: 'ArrowLeft' });
      expect(w.findComponent(SnSegment).emitted('update:modelValue')?.[0]).toEqual(['settings']);
    });

    it('jumps with Home / End and supports ArrowUp / ArrowDown (live v-model)', async () => {
      const state = reactive({ value: 'settings' as string | number });
      const w = mountLiveSegment({ options: OPTIONS }, state);
      const segment = w.find('.sn-segment');
      await segment.trigger('keydown', { key: 'Home' });
      expect(state.value).toBe('dashboard');
      await segment.trigger('keydown', { key: 'End' });
      expect(state.value).toBe('settings');
      await segment.trigger('keydown', { key: 'ArrowDown' });
      // settings is the last enabled item — ArrowDown wraps to the first.
      expect(state.value).toBe('dashboard');
      await segment.trigger('keydown', { key: 'ArrowUp' });
      // ArrowUp from dashboard wraps to the last enabled item.
      expect(state.value).toBe('settings');
    });

    it('does nothing on arrows while the root is disabled', async () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'dashboard', disabled: true });
      await w.find('.sn-segment').trigger('keydown', { key: 'ArrowRight' });
      expect(w.findComponent(SnSegment).emitted('update:modelValue')).toBeUndefined();
    });

    it('moves focus to the item selected by keyboard', async () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'dashboard' });
      // happy-dom's focus() never updates document.activeElement, so observe
      // the focus call on the target item instead (reports is disabled — the
      // step from dashboard lands on analytics).
      const target = w.findAll('[role="radio"]')[1]!.element;
      const focusSpy = vi.spyOn(target, 'focus');
      await w.find('.sn-segment').trigger('keydown', { key: 'ArrowRight' });
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('roving tabindex', () => {
    it('keeps the tab stop on the selected item', () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'analytics' });
      const items = w.findAll('[role="radio"]');
      expect(items[1]?.attributes('tabindex')).toBe('0');
      expect(items[0]?.attributes('tabindex')).toBe('-1');
    });

    it('moves the tab stop to the first enabled item when the selection is disabled', () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'reports' });
      const items = w.findAll('[role="radio"]');
      expect(items[2]?.attributes('tabindex')).toBe('-1');
      expect(items[0]?.attributes('tabindex')).toBe('0');
    });

    it('puts the tab stop on the first enabled item while nothing is selected', () => {
      const w = mountSegment({ options: OPTIONS });
      const items = w.findAll('[role="radio"]');
      expect(items[0]?.attributes('tabindex')).toBe('0');
      expect(items[1]?.attributes('tabindex')).toBe('-1');
      expect(items[2]?.attributes('tabindex')).toBe('-1');
    });
  });

  describe('sliding indicator', () => {
    it('positions the thumb over the selected item after mount', async () => {
      const w = mountSegment({ options: OPTIONS, modelValue: 'analytics' });
      await flushTicks(w);
      const thumb = w.find('.sn-segment__thumb');
      expect(thumb.exists()).toBe(true);
      const style = thumb.attributes('style') ?? '';
      // Prototype-stubbed metrics (42 / 96) prove the thumb reads the
      // measured geometry instead of its (0, 0) defaults.
      expect(style).toContain('translateX(42px)');
      expect(style).toContain('96px');
    });

    it('hides the thumb while nothing is selected', () => {
      const w = mountSegment({ options: OPTIONS });
      // v-show keeps the node but flips display; assert via style visibility.
      const thumb = w.find('.sn-segment__thumb');
      expect(thumb.attributes('style')).toContain('display: none');
    });
  });

  describe('v-model integration', () => {
    it('round-trips selection through a parent ref', async () => {
      const w = mount(
        defineComponent({
          components: { SnSegment },
          setup() {
            const value = ref<string | number>('dashboard');
            return () =>
              h(SnSegment, {
                options: OPTIONS,
                modelValue: value.value,
                'onUpdate:modelValue': (key: string | number) => {
                  value.value = key;
                },
              } as never);
          },
        }),
      );
      await w.findAll('[role="radio"]')[3]!.trigger('click');
      expect(w.findAll('[role="radio"]')[3]?.attributes('aria-checked')).toBe('true');
      expect(w.findAll('[role="radio"]')[0]?.attributes('aria-checked')).toBe('false');
    });
  });
});
