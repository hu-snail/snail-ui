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
      // No stray placeholder: the key is not rendered at all.
      expect(deleteKey).toBeUndefined();
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

    it('fills the empty extra slot with the collapse glyph key', () => {
      const w = mountKeyboard();
      // 1–9 + [collapse][0][delete] — three equal keys in the bottom row.
      expect(w.findAll('.sn-keyboard__key')).toHaveLength(12);
      const bottom = w.findAll('.sn-keyboard__row')[3];
      expect(bottom?.findAll('.sn-keyboard__key')).toHaveLength(3);
      expect(bottom?.find('.sn-keyboard__key svg').exists()).toBe(true);
      expect(keyByText(w, '0')?.attributes('style')).toBeUndefined();
    });

    it('closes the keyboard from the collapse key without typing', async () => {
      const w = mountKeyboard({ modelValue: '1' });
      await w.findAll('.sn-keyboard__row')[3]?.find('.sn-keyboard__key').trigger('tap');
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
      expect(w.emitted('input')).toBeUndefined();
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('replaces the collapse key when extraKey is supplied', () => {
      const w = mountKeyboard({ extraKey: '.' });
      const bottom = w.findAll('.sn-keyboard__row')[3];
      // The lead slot is the extra key; only the delete key keeps a glyph.
      expect(bottom?.find('[aria-label="collapse"]').exists()).toBe(false);
      expect(keyByText(w, '.')).toBeTruthy();
      expect(w.findAll('.sn-keyboard__key')).toHaveLength(12);
    });

    it('renders a collapse key in the custom grid for an unsupplied slot', () => {
      const w = mountKeyboard({ mode: 'custom', extraKey: '.' });
      const rows = w.findAll('.sn-keyboard__row');
      expect(rows[3]?.findAll('.sn-keyboard__key')).toHaveLength(3);
      // [extra][0][collapse] — the aside column stays the only other actions.
      expect(rows[3]?.find('.sn-keyboard__key svg').exists()).toBe(true);
    });

    it('lets 0 span the row when the delete key is hidden', () => {
      const w = mountKeyboard({ showDeleteKey: false });
      expect(w.find('.sn-keyboard__key--delete').exists()).toBe(false);
      expect(w.findAll('.sn-keyboard__row')[3]?.findAll('.sn-keyboard__key')).toHaveLength(2);
      expect(keyByText(w, '0')?.attributes('style')).toContain('flex-grow: 2');
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

    it('renders the chevron chip when closeText is empty', () => {
      const w = mountKeyboard();
      expect(w.find('.sn-keyboard__close .sn-keyboard__close-chip svg').exists()).toBe(true);
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
      // The panel's generic sheet padding is neutralised so the key field
      // paints edge to edge; the host style is appended after it.
      const style = w.findComponent({ name: 'SnPopup' }).props('customStyle') as string;
      expect(style).toContain('padding: 0');
      expect(style).toContain('margin: 4px');
    });
  });

  /* ── Visual system (redesign) ────────────────────────────────────────── */

  describe('key plates (redesign)', () => {
    it('renders the backspace glyph rather than a generic X', () => {
      expect(mountKeyboard().find('.sn-keyboard__key--delete svg').exists()).toBe(true);
    });

    it('carries a hover-class for press feedback (§116.2)', () => {
      expect(keyByText(mountKeyboard(), '5')?.attributes('hover-class')).toBe(
        'sn-keyboard__key--pressed',
      );
    });

    it('drops the hidden delete key and keeps the row hole-free', () => {
      const w = mountKeyboard({ showDeleteKey: false });
      expect(w.find('.sn-keyboard__key--delete').exists()).toBe(false);
      // [collapse][0(span 2)] — the collapse glyph still anchors the row.
      expect(w.findAll('.sn-keyboard__row')[3]?.findAll('.sn-keyboard__key')).toHaveLength(2);
      expect(keyByText(w, '0')?.attributes('style')).toContain('flex-grow: 2');
    });

    it('flags the root with the safe-area class', () => {
      expect(mountKeyboard().find('.sn-keyboard').classes()).toContain('sn-keyboard--safe');
      expect(
        mountKeyboard({ safeAreaInsetBottom: false }).find('.sn-keyboard').classes(),
      ).not.toContain('sn-keyboard--safe');
    });

    it('anchors the custom close key on the action column', () => {
      const w = mountKeyboard({ mode: 'custom', closeText: 'Done' });
      expect(w.find('.sn-keyboard__aside-key--close').text()).toBe('Done');
    });

    it('keeps the custom bottom row on three columns', () => {
      // Regression: a fourth slot used to squeeze the bottom row into quarters,
      // knocking it out of alignment with the rows above.
      const rows = mountKeyboard({ mode: 'custom', extraKey: ['00', '.'] }).findAll(
        '.sn-keyboard__row',
      );
      expect(rows[3]?.findAll('.sn-keyboard__key')).toHaveLength(3);
      // Delete belongs to the action column in custom mode.
      expect(rows[3]?.find('.sn-keyboard__key--delete').exists()).toBe(false);
    });
  });

  describe('delete hold-to-repeat (redesign)', () => {
    it('deletes exactly once on a plain tap', async () => {
      const w = mountKeyboard({ modelValue: '12' });
      const key = w.find('.sn-keyboard__key--delete');
      await key.trigger('touchstart');
      await key.trigger('touchend');
      await key.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['1']);
      expect(w.emitted('update:modelValue')).toHaveLength(1);
    });

    it('drops its timers on unmount', async () => {
      const w = mountKeyboard({ modelValue: '12' });
      w.find('.sn-keyboard__key--delete').trigger('touchstart');
      w.unmount();
      // Past REPEAT_DELAY: a leaked timer would emit a delete after unmount.
      await new Promise((resolve) => setTimeout(resolve, 600));
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('car plate grid (redesign)', () => {
    it('lays the province plate out in rows of ten', () => {
      const rows = mountKeyboard({ mode: 'car', carLang: 'zh' }).findAll('.sn-keyboard__car-row');
      expect(rows).toHaveLength(4);
      expect(rows[0]?.findAll('.sn-keyboard__key--car')).toHaveLength(10);
      // Short tail row: the remaining 7 provinces plus the delete key.
      expect(rows[3]?.findAll('.sn-keyboard__key--car')).toHaveLength(8);
    });

    it('puts the language key at the head of the last row', () => {
      const rows = mountKeyboard({ mode: 'car', carLang: 'zh' }).findAll('.sn-keyboard__car-row');
      expect(rows[3]?.find('.sn-keyboard__key--fn').text()).toBe('ABC');
    });

    it('switches language from the plate key', async () => {
      const w = mountKeyboard({ mode: 'car', carLang: 'zh' });
      await w.find('.sn-keyboard__key--fn').trigger('tap');
      expect(w.emitted('update:carLang')?.[0]).toEqual(['en']);
    });
  });
});
