/**
 * sn-keyboard-panel unit tests — embedded keypad view (no popup).
 *
 * Behaviour only (AGENTS.md §46): the inline render, the shared key-model
 * contract (extraKey / collapse glyph / delete / maxlength), the panel-specific
 * collapse event, the header visibility rules and car-mode switching.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnKeyboardPanel from './sn-keyboard-panel.vue';

function mountPanel(props: Record<string, unknown> = {}) {
  return mount(SnKeyboardPanel, { props: { modelValue: '', ...props } });
}

const keyByText = (w: ReturnType<typeof mount>, text: string) =>
  w.findAll('.sn-keyboard-panel__key').find((key) => key.text() === text);

describe('sn-keyboard-panel', () => {
  describe('structure', () => {
    it('renders inline without any popup wrapper', () => {
      const w = mountPanel();
      expect(w.find('.sn-keyboard-panel').exists()).toBe(true);
      expect(w.findComponent({ name: 'SnPopup' }).exists()).toBe(false);
      expect(w.classes()).toContain('sn-keyboard-panel--default');
    });

    it('renders the 1-9 keys plus 0 and the delete glyph', () => {
      const w = mountPanel();
      for (const digit of ['1', '5', '9', '0']) {
        expect(keyByText(w, digit)).toBeTruthy();
      }
      expect(w.find('.sn-keyboard-panel__key--delete svg').exists()).toBe(true);
    });

    it('renders the header only when a title is set', () => {
      expect(mountPanel().find('.sn-keyboard-panel__header').exists()).toBe(false);
      expect(mountPanel({ title: 'Amount' }).find('.sn-keyboard-panel__title').text()).toBe(
        'Amount',
      );
    });

    it('renders the header with the language toggle in car mode', () => {
      const w = mountPanel({ mode: 'car' });
      expect(w.find('.sn-keyboard-panel__header').exists()).toBe(true);
      expect(w.find('.sn-keyboard-panel__lang').text()).toBe('EN');
    });

    it('applies customClass and customStyle to the root', () => {
      const w = mountPanel({ customClass: 'my-panel', customStyle: 'margin: 4px' });
      expect(w.find('.sn-keyboard-panel').classes()).toContain('my-panel');
      expect(w.find('.sn-keyboard-panel').attributes('style')).toContain('margin: 4px');
    });
  });

  describe('typing', () => {
    it('appends a digit and emits input', async () => {
      const w = mountPanel({ modelValue: '1' });
      await keyByText(w, '5')?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['15']);
      expect(w.emitted('input')?.[0]).toEqual(['5']);
    });

    it('respects maxlength', async () => {
      const w = mountPanel({ modelValue: '12', maxlength: 2 });
      await keyByText(w, '3')?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('renders an extra key in the bottom-left slot', async () => {
      const w = mountPanel({ extraKey: '.' });
      await keyByText(w, '.')?.trigger('tap');
      expect(w.emitted('input')?.[0]).toEqual(['.']);
    });

    it('emits collapse from the glyph key instead of typing', async () => {
      const w = mountPanel({ modelValue: '7' });
      const bottom = w.findAll('.sn-keyboard-panel__row')[3];
      await bottom?.find('[aria-label="collapse"]').trigger('tap');
      expect(w.emitted('collapse')).toHaveLength(1);
      expect(w.emitted('input')).toBeUndefined();
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('removes the last character and emits delete', async () => {
      const w = mountPanel({ modelValue: '123' });
      await w.find('.sn-keyboard-panel__key--delete').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['12']);
      expect(w.emitted('delete')).toHaveLength(1);
    });

    it('deletes exactly once on a plain tap (hold consumed)', async () => {
      const w = mountPanel({ modelValue: '12' });
      const key = w.find('.sn-keyboard-panel__key--delete');
      await key.trigger('touchstart');
      await key.trigger('touchend');
      await key.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['1']);
      expect(w.emitted('update:modelValue')).toHaveLength(1);
    });

    it('drops its timers on unmount', async () => {
      const w = mountPanel({ modelValue: '12' });
      w.find('.sn-keyboard-panel__key--delete').trigger('touchstart');
      w.unmount();
      // Past REPEAT_DELAY: a leaked timer would emit a delete after unmount.
      await new Promise((resolve) => setTimeout(resolve, 600));
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('hides the delete key when showDeleteKey is off', () => {
      const w = mountPanel({ showDeleteKey: false });
      expect(w.find('.sn-keyboard-panel__key--delete').exists()).toBe(false);
      // The collapse glyph still anchors the bottom row; 0 spans the freed column.
      expect(
        w.findAll('.sn-keyboard-panel__row')[3]?.findAll('.sn-keyboard-panel__key'),
      ).toHaveLength(2);
    });
  });

  describe('custom mode', () => {
    it('renders the action column with collapse + delete', async () => {
      const w = mountPanel({ mode: 'custom', modelValue: '9' });
      expect(w.find('.sn-keyboard-panel__aside').exists()).toBe(true);
      await w.find('.sn-keyboard-panel__aside-key--delete').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['']);
      await w.find('.sn-keyboard-panel__aside-key--close').trigger('tap');
      expect(w.emitted('collapse')).toHaveLength(1);
    });

    it('keeps both extra-key slots on the 3-column grid', () => {
      const w = mountPanel({ mode: 'custom', extraKey: ['00', '.'] });
      const rows = w.findAll('.sn-keyboard-panel__row');
      expect(rows[3]?.findAll('.sn-keyboard-panel__key')).toHaveLength(3);
      expect(keyByText(w, '00')).toBeTruthy();
      expect(keyByText(w, '.')).toBeTruthy();
    });
  });

  describe('car mode', () => {
    it('renders the province plate in rows of ten', () => {
      const rows = mountPanel({ mode: 'car' }).findAll('.sn-keyboard-panel__car-row');
      expect(rows).toHaveLength(4);
      expect(rows[0]?.findAll('.sn-keyboard-panel__key--car')).toHaveLength(10);
    });

    it('types a plate key and auto-switches after the province', async () => {
      const w = mountPanel({ mode: 'car', autoSwitchLang: true });
      await keyByText(w, '京')?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['京']);
      await w.setProps({ modelValue: '京' });
      expect(w.emitted('update:carLang')?.[0]).toEqual(['en']);
    });

    it('toggles language from the header button', async () => {
      const w = mountPanel({ mode: 'car' });
      await w.find('.sn-keyboard-panel__lang').trigger('tap');
      expect(w.emitted('update:carLang')?.[0]).toEqual(['en']);
    });
  });
});
