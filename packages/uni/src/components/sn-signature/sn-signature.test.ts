/**
 * sn-signature unit tests — uni-end touch signature pad.
 *
 * Behaviour only (AGENTS.md §46): stroke capture, the emitted segment count,
 * clear / undo / redo, the disabled guard and the confirm payload. No rpx
 * numbers in assertions (except custom properties, which happy-dom preserves).
 *
 * Untestable in happy-dom: there is no `<canvas>` on this end by design
 * (stroke = rotated `<view>` bars, see the SFC header), so canvas bitmap /
 * degradation paths do not exist to test; pressure-simulated variable stroke
 * width is declared-for-parity and inert, and real multi-touch gesture physics
 * are beyond the DOM event model.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnSignature from './sn-signature.vue';
import type { SignatureResult } from './sn-signature.vue';

/** The component's `defineExpose` surface. */
interface ExposedSignature {
  confirm(): void;
  clear(): void;
  revoke(): void;
  restore(): void;
  init(): void;
}

function mountPad(props: Record<string, unknown> = {}) {
  return mount(SnSignature, { props });
}

/** Give the pad a deterministic box so pad-relative points are stable. */
function withPadBox(w: ReturnType<typeof mount>, left = 0, top = 0): void {
  const pad = w.find('.sn-signature__pad');
  const element = pad.element as HTMLElement;
  element.getBoundingClientRect = () =>
    ({
      left,
      top,
      width: 200,
      height: 200,
      right: left + 200,
      bottom: top + 200,
      x: left,
      y: top,
      toJSON: () => ({}),
    }) as DOMRect;
}

/** Draw a two-segment stroke. */
async function drawStroke(w: ReturnType<typeof mount>): Promise<void> {
  const pad = w.find('.sn-signature__pad');
  await pad.trigger('touchstart', { touches: [{ clientX: 10, clientY: 10 }] });
  await pad.trigger('touchmove', { touches: [{ clientX: 40, clientY: 10 }] });
  await pad.trigger('touchmove', { touches: [{ clientX: 40, clientY: 40 }] });
  await pad.trigger('touchend', { touches: [{ clientX: 40, clientY: 40 }] });
}

describe('sn-signature', () => {
  describe('structure', () => {
    it('renders the pad and the buttons', () => {
      const w = mountPad();
      expect(w.find('.sn-signature__pad').exists()).toBe(true);
      expect(w.findAll('.sn-signature__button').length).toBeGreaterThanOrEqual(2);
    });

    it('renders the custom button labels', () => {
      const w = mountPad({ confirmText: 'Save', clearText: 'Wipe' });
      const buttons = w.findAll('.sn-signature__button');
      expect(buttons[0]?.text()).toBe('Wipe');
      expect(buttons.at(-1)?.text()).toBe('Save');
    });

    it('renders no strokes initially', () => {
      expect(mountPad().findAll('.sn-signature__bar')).toHaveLength(0);
    });

    it('applies the disabled class and scrim', () => {
      const w = mountPad({ disabled: true });
      expect(w.classes()).toContain('sn-signature--disabled');
      expect(w.find('.sn-signature__scrim').exists()).toBe(true);
    });

    it('forwards penColor / backgroundColor / size as custom properties', () => {
      const w = mountPad({
        penColor: 'rgb(1,2,3)',
        backgroundColor: 'rgb(4,5,6)',
        height: 200,
        width: 300,
      });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-signature-pen-color: rgb(1,2,3)');
      expect(style).toContain('--sn-signature-pad-bg: rgb(4,5,6)');
      expect(style).toContain('--sn-signature-height:');
      expect(style).toContain('--sn-signature-width:');
    });

    it('accepts the export / pressure parity props without changing the pad', async () => {
      const w = mountPad({
        fileType: 'jpg',
        quality: 0.6,
        exportScale: 2,
        pressure: true,
        maxWidth: 8,
        minWidth: 1,
        minSpeed: 2,
      });
      withPadBox(w);
      await drawStroke(w);
      // Rendering is unchanged: the export props are the host's to apply.
      expect(w.findAll('.sn-signature__bar')).toHaveLength(2);
      expect(w.find('.sn-signature__pad').exists()).toBe(true);
    });
  });

  describe('drawing', () => {
    it('renders one bar per point pair', async () => {
      const w = mountPad();
      withPadBox(w);
      await drawStroke(w);
      expect(w.findAll('.sn-signature__bar')).toHaveLength(2);
    });

    it('emits start / signing / end', async () => {
      const w = mountPad();
      withPadBox(w);
      await drawStroke(w);
      expect(w.emitted('start')).toHaveLength(1);
      expect(w.emitted('signing')).toHaveLength(2);
      expect(w.emitted('end')).toHaveLength(1);
    });

    it('renders a dot for a single-point tap', async () => {
      const w = mountPad();
      withPadBox(w);
      await w
        .find('.sn-signature__pad')
        .trigger('touchstart', { touches: [{ clientX: 5, clientY: 5 }] });
      await w
        .find('.sn-signature__pad')
        .trigger('touchend', { touches: [{ clientX: 5, clientY: 5 }] });
      expect(w.findAll('.sn-signature__dot')).toHaveLength(1);
    });

    it('drops duplicate points', async () => {
      const w = mountPad();
      withPadBox(w);
      const pad = w.find('.sn-signature__pad');
      await pad.trigger('touchstart', { touches: [{ clientX: 10, clientY: 10 }] });
      await pad.trigger('touchmove', { touches: [{ clientX: 10, clientY: 10 }] });
      await pad.trigger('touchmove', { touches: [{ clientX: 10, clientY: 10 }] });
      expect(w.emitted('signing')).toBeUndefined();
    });

    it('does not draw while disabled', async () => {
      const w = mountPad({ disabled: true });
      withPadBox(w);
      await drawStroke(w);
      expect(w.emitted('start')).toBeUndefined();
      expect(w.findAll('.sn-signature__bar')).toHaveLength(0);
    });
  });

  describe('clear', () => {
    it('clears the strokes and emits clear', async () => {
      const w = mountPad();
      withPadBox(w);
      await drawStroke(w);
      expect(w.findAll('.sn-signature__bar').length).toBeGreaterThan(0);
      await w.findAll('.sn-signature__button')[0]?.trigger('tap');
      expect(w.findAll('.sn-signature__bar')).toHaveLength(0);
      expect(w.emitted('clear')).toHaveLength(1);
    });

    it('does not clear while disabled', async () => {
      const w = mountPad({ disabled: true });
      await w.findAll('.sn-signature__button')[0]?.trigger('tap');
      expect(w.emitted('clear')).toBeUndefined();
    });
  });

  describe('history', () => {
    it('renders undo / redo only when enableHistory is on', () => {
      expect(mountPad().findAll('.sn-signature__button')).toHaveLength(2);
      expect(mountPad({ enableHistory: true }).findAll('.sn-signature__button')).toHaveLength(4);
    });

    it('undo removes the last stroke and redo restores it', async () => {
      const w = mountPad({ enableHistory: true });
      withPadBox(w);
      await drawStroke(w);
      const drawn = w.findAll('.sn-signature__bar').length;
      const buttons = w.findAll('.sn-signature__button');
      await buttons[1]?.trigger('tap');
      expect(w.findAll('.sn-signature__bar')).toHaveLength(0);
      await w.findAll('.sn-signature__button')[2]?.trigger('tap');
      expect(w.findAll('.sn-signature__bar')).toHaveLength(drawn);
    });

    it('marks undo disabled with an empty history', () => {
      const w = mountPad({ enableHistory: true });
      expect(w.findAll('.sn-signature__button')[1]?.classes()).toContain(
        'sn-signature__button--disabled',
      );
    });

    it('drops the redo stack after a new stroke', async () => {
      const w = mountPad({ enableHistory: true });
      withPadBox(w);
      await drawStroke(w);
      await w.findAll('.sn-signature__button')[1]?.trigger('tap');
      await drawStroke(w);
      await w.findAll('.sn-signature__button')[2]?.trigger('tap');
      // The redo stack was cleared, so the bar count stays at one stroke.
      expect(w.findAll('.sn-signature__bar')).toHaveLength(2);
    });

    it('ignores undo / redo when history is off', async () => {
      const w = mountPad();
      const vm = w.vm as unknown as { revoke(): void; restore(): void };
      expect(() => {
        vm.revoke();
        vm.restore();
      }).not.toThrow();
    });
  });

  describe('confirm', () => {
    it('emits the stroke geometry', async () => {
      const w = mountPad();
      withPadBox(w);
      await drawStroke(w);
      await w.findAll('.sn-signature__button').at(-1)?.trigger('tap');
      const payload = w.emitted('confirm')?.[0]?.[0] as SignatureResult;
      expect(payload.paths).toHaveLength(1);
      expect(payload.paths[0]).toHaveLength(3);
      expect(payload.isEmpty).toBe(false);
    });

    it('reports an empty pad', async () => {
      const w = mountPad();
      await w.findAll('.sn-signature__button').at(-1)?.trigger('tap');
      const payload = w.emitted('confirm')?.[0]?.[0] as SignatureResult;
      expect(payload.isEmpty).toBe(true);
    });

    it('does not confirm while disabled', async () => {
      const w = mountPad({ disabled: true });
      await w.findAll('.sn-signature__button').at(-1)?.trigger('tap');
      expect(w.emitted('confirm')).toBeUndefined();
    });

    it('reports the exact pad-relative point coordinates', async () => {
      const w = mountPad();
      withPadBox(w, 0, 0);
      await drawStroke(w);
      await w.findAll('.sn-signature__button').at(-1)?.trigger('tap');
      const payload = w.emitted('confirm')?.[0]?.[0] as SignatureResult;
      expect(payload.paths).toEqual([
        [
          { x: 10, y: 10 },
          { x: 40, y: 10 },
          { x: 40, y: 40 },
        ],
      ]);
    });

    it('subtracts the pad origin from the pointer coordinates', async () => {
      const w = mountPad();
      withPadBox(w, 100, 50);
      await drawStroke(w);
      await w.findAll('.sn-signature__button').at(-1)?.trigger('tap');
      const payload = w.emitted('confirm')?.[0]?.[0] as SignatureResult;
      expect(payload.paths[0]?.[0]).toEqual({ x: -90, y: -40 });
    });

    it('reports every committed stroke with an empty live one', async () => {
      const w = mountPad();
      withPadBox(w);
      await drawStroke(w);
      await drawStroke(w);
      await w.findAll('.sn-signature__button').at(-1)?.trigger('tap');
      const payload = w.emitted('confirm')?.[0]?.[0] as SignatureResult;
      expect(payload.paths).toHaveLength(2);
      expect(payload.isEmpty).toBe(false);
    });
  });

  describe('exposed methods', () => {
    it('confirm() emits the same payload as the button', async () => {
      const w = mountPad();
      withPadBox(w);
      await drawStroke(w);
      (w.vm as unknown as ExposedSignature).confirm();
      const payload = w.emitted('confirm')?.[0]?.[0] as SignatureResult;
      expect(payload.paths).toHaveLength(1);
    });

    it('clear() wipes the strokes and emits clear', async () => {
      const w = mountPad();
      withPadBox(w);
      await drawStroke(w);
      (w.vm as unknown as ExposedSignature).clear();
      await w.vm.$nextTick();
      expect(w.findAll('.sn-signature__bar')).toHaveLength(0);
      expect(w.emitted('clear')).toHaveLength(1);
    });

    it('revoke() / restore() move a stroke between the stacks', async () => {
      const w = mountPad({ enableHistory: true });
      withPadBox(w);
      await drawStroke(w);
      const vm = w.vm as unknown as ExposedSignature;
      vm.revoke();
      await w.vm.$nextTick();
      expect(w.findAll('.sn-signature__bar')).toHaveLength(0);
      vm.restore();
      await w.vm.$nextTick();
      expect(w.findAll('.sn-signature__bar')).toHaveLength(2);
    });

    it('init() drops the redo stack so restore() is a no-op', async () => {
      const w = mountPad({ enableHistory: true });
      withPadBox(w);
      await drawStroke(w);
      const vm = w.vm as unknown as ExposedSignature;
      vm.revoke();
      vm.init();
      vm.restore();
      await w.vm.$nextTick();
      expect(w.findAll('.sn-signature__bar')).toHaveLength(0);
    });
  });

  describe('history options', () => {
    it('undo removes `step` strokes at once', async () => {
      const w = mountPad({ enableHistory: true, step: 2 });
      withPadBox(w);
      await drawStroke(w);
      await drawStroke(w);
      await drawStroke(w);
      const buttons = w.findAll('.sn-signature__button');
      await buttons[1]?.trigger('tap');
      // 3 strokes × 2 bars each, minus 2 strokes = 2 bars left.
      expect(w.findAll('.sn-signature__bar')).toHaveLength(2);
    });

    it('redo restores `step` strokes at once', async () => {
      const w = mountPad({ enableHistory: true, step: 2 });
      withPadBox(w);
      await drawStroke(w);
      await drawStroke(w);
      const buttons = w.findAll('.sn-signature__button');
      await buttons[1]?.trigger('tap');
      await buttons[1]?.trigger('tap');
      expect(w.findAll('.sn-signature__bar')).toHaveLength(0);
      await w.findAll('.sn-signature__button')[2]?.trigger('tap');
      expect(w.findAll('.sn-signature__bar')).toHaveLength(4);
    });

    it('shows undoText / redoText over the revoke / restore defaults', () => {
      const w = mountPad({
        enableHistory: true,
        undoText: 'Undo',
        redoText: 'Redo',
        revokeText: 'ignored',
        restoreText: 'ignored',
      });
      const texts = w.findAll('.sn-signature__button').map((button) => button.text());
      expect(texts).toContain('Undo');
      expect(texts).toContain('Redo');
      expect(texts).not.toContain('ignored');
    });

    it('echoes the stroke counts through the undo / redo labels', async () => {
      const w = mountPad({ enableHistory: true });
      withPadBox(w);
      await drawStroke(w);
      const buttons = w.findAll('.sn-signature__button');
      expect(buttons[1]?.attributes('aria-label')).toBe('撤回 (1)');
      await buttons[1]?.trigger('tap');
      expect(w.findAll('.sn-signature__button')[2]?.attributes('aria-label')).toBe('恢复 (1)');
    });

    it('caps the committed strokes at the history guard', async () => {
      const w = mountPad();
      withPadBox(w);
      const pad = w.find('.sn-signature__pad');
      for (let i = 0; i < 202; i += 1) {
        await pad.trigger('touchstart', { touches: [{ clientX: i, clientY: 5 }] });
        await pad.trigger('touchend', { touches: [{ clientX: i, clientY: 5 }] });
      }
      await w.findAll('.sn-signature__button').at(-1)?.trigger('tap');
      const payload = w.emitted('confirm')?.[0]?.[0] as SignatureResult;
      expect(payload.paths).toHaveLength(200);
    });
  });

  describe('touch guards', () => {
    it('discards the in-flight stroke on touchcancel', async () => {
      const w = mountPad();
      withPadBox(w);
      const pad = w.find('.sn-signature__pad');
      await pad.trigger('touchstart', { touches: [{ clientX: 10, clientY: 10 }] });
      await pad.trigger('touchmove', { touches: [{ clientX: 40, clientY: 10 }] });
      await pad.trigger('touchcancel');
      await pad.trigger('touchend', { touches: [{ clientX: 40, clientY: 10 }] });
      expect(w.emitted('end')).toBeUndefined();
      expect(w.findAll('.sn-signature__bar')).toHaveLength(0);
      expect(w.findAll('.sn-signature__dot')).toHaveLength(0);
    });

    it('ignores touchmove before touchstart', async () => {
      const w = mountPad();
      withPadBox(w);
      await w.find('.sn-signature__pad').trigger('touchmove', {
        touches: [{ clientX: 10, clientY: 10 }],
      });
      expect(w.emitted('signing')).toBeUndefined();
    });

    it('intercepts page scroll while drawing by default', async () => {
      const w = mountPad();
      withPadBox(w);
      const pad = w.find('.sn-signature__pad');
      await pad.trigger('touchstart', { touches: [{ clientX: 10, clientY: 10 }] });
      const move = new Event('touchmove', { cancelable: true });
      Object.defineProperty(move, 'touches', { value: [{ clientX: 20, clientY: 10 }] });
      pad.element.dispatchEvent(move);
      expect(move.defaultPrevented).toBe(true);
    });

    it('lets the page scroll when disableScroll is off', async () => {
      const w = mountPad({ disableScroll: false });
      withPadBox(w);
      const pad = w.find('.sn-signature__pad');
      await pad.trigger('touchstart', { touches: [{ clientX: 10, clientY: 10 }] });
      const move = new Event('touchmove', { cancelable: true });
      Object.defineProperty(move, 'touches', { value: [{ clientX: 20, clientY: 10 }] });
      pad.element.dispatchEvent(move);
      expect(move.defaultPrevented).toBe(false);
      expect(w.emitted('signing')).toHaveLength(1);
    });

    it('keeps drawing across pointless taps without history', async () => {
      const w = mountPad();
      withPadBox(w);
      await drawStroke(w);
      await drawStroke(w);
      await drawStroke(w);
      expect(w.emitted('start')).toHaveLength(3);
      expect(w.emitted('end')).toHaveLength(3);
      expect(w.emitted('signing')).toHaveLength(6);
    });
  });

  describe('presentation', () => {
    it('passes string height / width through as custom properties', () => {
      const w = mountPad({ height: '50%', width: '80%' });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-signature-height: 50%');
      expect(style).toContain('--sn-signature-width: 80%');
    });

    it('derives the line width custom property from lineWidth', () => {
      const w = mountPad({ lineWidth: 3 });
      expect(w.attributes('style')).toContain('--sn-signature-line-width: 6rpx');
    });

    it('appends customStyle after the custom properties', () => {
      const w = mountPad({ customStyle: 'margin: 4px' });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-signature-line-width:');
      expect(style).toContain('margin: 4px');
    });

    it('echoes the step and stroke counters to assistive tech', async () => {
      const w = mountPad({ step: 2 });
      withPadBox(w);
      const meta = w.find('.sn-signature__meta');
      expect(meta.text()).toBe('2 · 0');
      expect(meta.attributes('aria-live')).toBe('polite');
      await drawStroke(w);
      expect(meta.text()).toBe('2 · 1');
    });

    it('labels the pad as a group', () => {
      const w = mountPad();
      expect(w.attributes('role')).toBe('group');
      expect(w.attributes('aria-label')).toBe('signature pad');
    });

    it('marks the buttons as buttons with spoken names', () => {
      const w = mountPad({ clearText: 'Wipe', confirmText: 'Save' });
      const buttons = w.findAll('.sn-signature__button');
      expect(buttons[0]?.attributes('role')).toBe('button');
      expect(buttons[0]?.attributes('aria-label')).toBe('Wipe');
      expect(buttons[0]?.attributes('tabindex')).toBe('0');
      expect(buttons.at(-1)?.attributes('aria-label')).toBe('Save');
    });

    it('disables the pad and the buttons for assistive tech', () => {
      const w = mountPad({ disabled: true });
      expect(w.find('.sn-signature__pad').attributes('aria-disabled')).toBe('true');
      const buttons = w.findAll('.sn-signature__button');
      expect(buttons[0]?.attributes('aria-disabled')).toBe('true');
      expect(buttons[0]?.attributes('tabindex')).toBe('-1');
      expect(buttons.at(-1)?.classes()).toContain('sn-signature__button--disabled');
    });
  });
});
