/**
 * sn-keyboard unit tests — uni-end on-screen keypad.
 *
 * Behaviour only (AGENTS.md §46): the digit grid, extraKey placement, the
 * delete key, maxlength capping, car-mode language switching and the close
 * contract. No rpx numbers in assertions.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnKeyboard from './sn-keyboard.vue';

function mountKeyboard(props: Record<string, unknown> = {}) {
  return mount(SnKeyboard, { props: { visible: true, modelValue: '', ...props } });
}

const keyByText = (w: ReturnType<typeof mount>, text: string) =>
  w.findAll('.sn-keyboard__key').find((key) => key.text() === text);

describe('sn-keyboard', () => {
  describe('structure', () => {
    it('renders the title', () => {
      expect(mountKeyboard({ title: 'Amount' }).find('.sn-keyboard__title').text()).toBe('Amount');
    });

    it('renders the 1-9 keys plus 0', () => {
      const w = mountKeyboard();
      for (const digit of ['1', '5', '9', '0']) {
        expect(keyByText(w, digit)).toBeTruthy();
      }
    });

    it('stays out of the tree while invisible', () => {
      expect(mountKeyboard({ visible: false }).find('.sn-keyboard').exists()).toBe(false);
    });

    it('applies the mode class to the panel and the popup', () => {
      const w = mountKeyboard({ mode: 'car' });
      expect(w.find('.sn-keyboard').classes()).toContain('sn-keyboard--car');
      expect(w.classes()).toContain('sn-keyboard-popup--car');
    });

    it('renders the custom action column only in custom mode', () => {
      expect(mountKeyboard({ mode: 'custom' }).find('.sn-keyboard__aside').exists()).toBe(true);
      expect(mountKeyboard().find('.sn-keyboard__aside').exists()).toBe(false);
    });
  });

  describe('typing', () => {
    it('appends a digit and emits input', async () => {
      const w = mountKeyboard({ modelValue: '1' });
      await keyByText(w, '5')?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['15']);
      expect(w.emitted('input')?.[0]).toEqual(['5']);
    });

    it('respects maxlength', async () => {
      const w = mountKeyboard({ modelValue: '12', maxlength: 2 });
      await keyByText(w, '3')?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('renders an extra key in the bottom row', async () => {
      const w = mountKeyboard({ extraKey: '00' });
      expect(keyByText(w, '00')).toBeTruthy();
    });

    it('accepts an array of extra keys', async () => {
      const w = mountKeyboard({ extraKey: ['00', '.'] });
      expect(keyByText(w, '00')).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('removes the last character and emits delete', async () => {
      const w = mountKeyboard({ modelValue: '123' });
      await w.find('.sn-keyboard__key--delete').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['12']);
      expect(w.emitted('delete')).toHaveLength(1);
    });

    it('does not emit when the value is already empty', async () => {
      const w = mountKeyboard({ modelValue: '' });
      await w.find('.sn-keyboard__key--delete').trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('hides the delete glyph when showDeleteKey is off', () => {
      const w = mountKeyboard({ showDeleteKey: false });
      const deleteKey = w
        .findAll('.sn-keyboard__key')
        .find((k) => k.classes().includes('sn-keyboard__key--delete'));
      expect(deleteKey?.text()).toBe('');
    });
  });

  describe('car mode', () => {
    it('renders the province abbreviations by default', () => {
      const w = mountKeyboard({ mode: 'car', carLang: 'zh' });
      // 37 province keys + the delete key, which shares the car-key class.
      expect(w.findAll('.sn-keyboard__key--car')).toHaveLength(38);
      expect(keyByText(w, '京')).toBeTruthy();
    });

    it('renders the letters and digits for the en layout', () => {
      const w = mountKeyboard({ mode: 'car', carLang: 'en' });
      expect(keyByText(w, 'A')).toBeTruthy();
      expect(keyByText(w, '京')).toBeUndefined();
    });

    it('auto-switches to en after the province character', async () => {
      const w = mountKeyboard({ mode: 'car', carLang: 'zh', autoSwitchLang: true });
      await w.setProps({ modelValue: '京' });
      expect(w.emitted('update:carLang')?.[0]).toEqual(['en']);
    });

    it('does not auto-switch when the flag is off', async () => {
      const w = mountKeyboard({ mode: 'car', carLang: 'zh', autoSwitchLang: false });
      await w.setProps({ modelValue: '京' });
      expect(w.emitted('update:carLang')).toBeUndefined();
    });

    it('toggles the language from the header button', async () => {
      const w = mountKeyboard({ mode: 'car', carLang: 'zh' });
      await w.find('.sn-keyboard__lang').trigger('tap');
      expect(w.emitted('update:carLang')?.[0]).toEqual(['en']);
    });

    it('types a car key', async () => {
      const w = mountKeyboard({ mode: 'car', carLang: 'en', modelValue: '' });
      await keyByText(w, 'A')?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['A']);
    });
  });

  describe('close', () => {
    it('closes from the header button', async () => {
      const w = mountKeyboard();
      await w.find('.sn-keyboard__close').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
    });

    it('closes on scrim tap when hideOnClickOutside is on', async () => {
      const w = mountKeyboard({ hideOnClickOutside: true });
      await w.find('.sn-popup__modal').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('renders no scrim when hideOnClickOutside is off', () => {
      // wd-keyboard: hide-on-click-outside also controls whether the mask is
      // rendered, so with it off there is nothing to tap.
      expect(mountKeyboard({ hideOnClickOutside: false }).find('.sn-popup__modal').exists()).toBe(
        false,
      );
    });

    it('renders the custom close label', () => {
      const w = mountKeyboard({ mode: 'custom', closeText: 'Done' });
      expect(w.find('.sn-keyboard__aside-key').text()).toBe('Done');
    });
  });

  describe('parity props', () => {
    it('honours v-model:visible through the visible prop', async () => {
      const w = mount(SnKeyboard, { props: { visible: false, modelValue: '' } });
      expect(w.find('.sn-keyboard').exists()).toBe(false);
      await w.setProps({ visible: true });
      expect(w.find('.sn-keyboard').exists()).toBe(true);
    });

    it('forwards root-portal to the popup', () => {
      const w = mountKeyboard({ rootPortal: true });
      expect(w.findComponent({ name: 'SnPopup' }).props('rootPortal')).toBe(true);
    });

    it('renders the car keys for the bound carLang value', () => {
      expect(keyByText(mountKeyboard({ mode: 'car', carLang: 'zh' }), '京')).toBeTruthy();
      expect(keyByText(mountKeyboard({ mode: 'car', carLang: 'en' }), '京')).toBeUndefined();
    });
  });

  /* ── Added coverage ──────────────────────────────────────────────────── */

  describe('extra keys (added)', () => {
    it('renders both extra keys in custom mode', async () => {
      const w = mountKeyboard({ mode: 'custom', extraKey: ['00', '.'] });
      expect(keyByText(w, '00')).toBeTruthy();
      expect(keyByText(w, '.')).toBeTruthy();

      await keyByText(w, '.')?.trigger('tap');
      expect(w.emitted('input')?.[0]).toEqual(['.']);
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['.']);
    });

    it('keeps a single extra slot in default mode', () => {
      const w = mountKeyboard({ extraKey: ['00', '.'] });
      expect(keyByText(w, '00')).toBeTruthy();
      expect(keyByText(w, '.')).toBeUndefined();
    });

    it('renders an inert empty slot when no extraKey is given', async () => {
      const w = mountKeyboard();
      // Regression: the empty slot and the delete key shared one v-for key, so
      // the empty placeholder was dropped from the bottom row.
      expect(w.findAll('.sn-keyboard__key')).toHaveLength(12);
      const empty = w.find('.sn-keyboard__key--empty');
      expect(empty.exists()).toBe(true);
      await empty.trigger('tap');
      expect(w.emitted('input')).toBeUndefined();
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('randomKeyOrder (added)', () => {
    it('shuffles the digits deterministically without losing one', () => {
      const a = mountKeyboard({ randomKeyOrder: true });
      const b = mountKeyboard({ randomKeyOrder: true });

      const orderOf = (w: ReturnType<typeof mount>) =>
        w
          .findAll('.sn-keyboard__key')
          .map((key) => key.text())
          .filter((text) => text !== '');

      const first = orderOf(a);
      const second = orderOf(b);
      // Same digit set, deterministic across mounts, different from 1..9 order.
      expect([...first].sort()).toEqual(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
      expect(first).toEqual(second);
      expect(first).not.toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
    });

    it('keeps the natural order by default', () => {
      const w = mountKeyboard();
      const texts = w
        .findAll('.sn-keyboard__key')
        .map((key) => key.text())
        .filter((text) => text !== '');
      expect(texts.slice(0, 9)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    });
  });

  describe('header close button (added)', () => {
    it('renders the close label text when closeText is set', () => {
      const w = mountKeyboard({ closeText: 'Done' });
      expect(w.find('.sn-keyboard__close').text()).toBe('Done');
      expect(w.find('.sn-keyboard__close svg').exists()).toBe(false);
    });

    it('renders the X glyph when closeText is empty', () => {
      const w = mountKeyboard();
      expect(w.find('.sn-keyboard__close svg').exists()).toBe(true);
    });

    it('marks the close button busy while closeButtonLoading is set', () => {
      const busy = mountKeyboard({ closeButtonLoading: true });
      expect(busy.find('.sn-keyboard__close').attributes('aria-busy')).toBe('true');

      const idle = mountKeyboard();
      expect(idle.find('.sn-keyboard__close').attributes('aria-busy')).toBeUndefined();
    });

    it('uses deleteText as the delete key label', () => {
      const w = mountKeyboard({ deleteText: 'Backspace' });
      expect(w.find('.sn-keyboard__key--delete').attributes('aria-label')).toBe('Backspace');
    });
  });

  describe('custom action column (added)', () => {
    it('deletes from the aside delete key', async () => {
      const w = mountKeyboard({ mode: 'custom', modelValue: '12' });
      await w.find('.sn-keyboard__aside-key--delete').trigger('tap');
      expect(w.emitted('delete')).toHaveLength(1);
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['1']);
    });

    it('closes from the aside close key', async () => {
      const w = mountKeyboard({ mode: 'custom', closeText: 'Done' });
      await w.find('.sn-keyboard__aside-key:not(.sn-keyboard__aside-key--delete)').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
    });
  });

  describe('car mode edges (added)', () => {
    it('hides the car delete key when showDeleteKey is off', () => {
      const w = mountKeyboard({ mode: 'car', showDeleteKey: false });
      expect(w.find('.sn-keyboard__key--delete').exists()).toBe(false);
    });

    it('deletes from the car delete key', async () => {
      const w = mountKeyboard({ mode: 'car', carLang: 'en', modelValue: 'AB' });
      await w.find('.sn-keyboard__key--delete').trigger('tap');
      expect(w.emitted('delete')).toHaveLength(1);
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['A']);
    });
  });

  describe('scroll lock (added)', () => {
    it('prevents touchmove on the panel while lockScroll is on', () => {
      const w = mountKeyboard({ lockScroll: true });
      const event = new Event('touchmove', { bubbles: true, cancelable: true });
      w.find('.sn-keyboard').element.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('lets touchmove pass while lockScroll is off', () => {
      const w = mountKeyboard({ lockScroll: false });
      const event = new Event('touchmove', { bubbles: true, cancelable: true });
      w.find('.sn-keyboard').element.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('popup forwarding (added)', () => {
    it('forwards safeAreaInsetBottom and zIndex to the popup', () => {
      const w = mountKeyboard({ safeAreaInsetBottom: false, zIndex: 55 });
      const popup = w.findComponent({ name: 'SnPopup' });
      expect(popup.props('safeAreaInsetBottom')).toBe(false);
      expect(popup.props('zIndex')).toBe(55);
    });

    it('renders the scrim whenever hideOnClickOutside forces the modal on', () => {
      const w = mountKeyboard({ modal: false, hideOnClickOutside: true });
      expect(w.findComponent({ name: 'SnPopup' }).props('modal')).toBe(true);
    });

    it('forwards customClass and customStyle', () => {
      const w = mountKeyboard({ customClass: 'my-kb', customStyle: 'margin: 4px' });
      expect(w.find('.sn-keyboard').classes()).toContain('my-kb');
      expect(w.findComponent({ name: 'SnPopup' }).props('customStyle')).toBe('margin: 4px');
    });
  });
});
