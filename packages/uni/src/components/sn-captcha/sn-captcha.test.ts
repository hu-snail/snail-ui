/**
 * sn-captcha unit tests — uni-end jigsaw slider captcha.
 *
 * Behaviour only (AGENTS.md §46): open → target re-roll bounds, the drag →
 * success path (within tolerance), the fail → shake + reset path, the modal
 * close guard, the refresh re-roll, the desktop-mouse path, the travel-base
 * fallback and the additive inline mode.
 *
 * Two host realities are regression-tested explicitly because they were the
 * "不能真正滑动" root causes on real uni H5 / mini-program hosts:
 *   - `<view>` is a *component* there, so a template ref is the component
 *     instance and the DOM node lives on `$el` (the measurement unwrap);
 *   - a host without layout must fall back to `uni.createSelectorQuery()` or,
 *     failing that, to the `width` prop, instead of freezing the piece.
 *
 * The viewport is pinned to the 750rpx design reference (375px), matching
 * `sn-picker-view-drag.test.ts`, so one design px == one CSS px in the numbers
 * below; the scale itself is covered by the dedicated viewport test.
 */

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SnCaptcha from './sn-captcha.vue';

const STAGE_W = 260;
const STAGE_H = 200;

/** Pin the viewport so `pxPerDesign()` is exactly 1 (1 design px = 1 CSS px). */
function pinViewport(width: number): void {
  Object.defineProperty(globalThis, 'innerWidth', {
    value: width,
    configurable: true,
    writable: true,
  });
}

beforeAll(() => {
  pinViewport(375);
});

afterEach(() => {
  vi.useRealTimers();
  pinViewport(375);
  delete (globalThis as { uni?: unknown }).uni;
});

/** Give the stage a deterministic box, then re-measure. */
function withStageBox(w: ReturnType<typeof mount>, width = STAGE_W, height = STAGE_H): void {
  const stage = w.find('.sn-captcha__stage');
  const element = stage.element as HTMLElement;
  element.getBoundingClientRect = () =>
    ({
      width,
      height,
      left: 0,
      top: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
  const vm = w.vm as unknown as { init(): void };
  vm.init();
}

/** Drive one touch drag on the piece: start at startX, move by delta, release. */
async function touchDrag(
  w: ReturnType<typeof mount>,
  startX: number,
  delta: number,
): Promise<void> {
  const piece = w.find('.sn-captcha__piece');
  await piece.trigger('touchstart', { touches: [{ clientX: startX }] });
  await piece.trigger('touchmove', { touches: [{ clientX: startX + delta }] });
  await piece.trigger('touchend', { touches: [{ clientX: startX + delta }] });
}

/** Drive one mouse drag on the piece (mousemove / mouseup land on document). */
async function mouseDrag(
  w: ReturnType<typeof mount>,
  startX: number,
  delta: number,
): Promise<void> {
  const piece = w.find('.sn-captcha__piece');
  await piece.trigger('mousedown', { button: 0, clientX: startX });
  document.dispatchEvent(new MouseEvent('mousemove', { clientX: startX + delta }));
  document.dispatchEvent(new MouseEvent('mouseup'));
  await nextTick();
}

/** Mount an open captcha and settle the open/measure watchers. */
async function mountOpen(props: Record<string, unknown> = {}): Promise<ReturnType<typeof mount>> {
  const w = mount(SnCaptcha, { props: { modelValue: true, src: 'bg.png', ...props } });
  await nextTick();
  await flushPromises();
  return w;
}

describe('sn-captcha', () => {
  describe('visibility', () => {
    it('should not render before mounted or when closed', () => {
      const w = mount(SnCaptcha, { props: { modelValue: false, src: 'bg.png' } });
      expect(w.find('.sn-captcha').exists()).toBe(false);
    });

    it('should render the popup chrome when open', async () => {
      const w = await mountOpen();
      expect(w.find('.sn-captcha__modal').exists()).toBe(true);
      expect(w.find('[aria-label="close"]').exists()).toBe(true);
      expect(w.find('.sn-captcha__panel').exists()).toBe(true);
    });
  });

  describe('target re-roll', () => {
    it('should re-roll a target inside the travel range on open and refresh', async () => {
      const w = await mountOpen();
      withStageBox(w);
      const vm = w.vm as unknown as {
        target: { x: number; y: number };
        refresh(): void;
      };
      vm.refresh();
      const first = vm.target;
      // 0.45..0.85 of the inner width; 0.2..0.6 of the height.
      expect(first.x).toBeGreaterThanOrEqual(0.45 * (STAGE_W - 44));
      expect(first.x).toBeLessThanOrEqual(0.85 * (STAGE_W - 44));
      expect(first.y).toBeGreaterThanOrEqual(0.2 * STAGE_H);
      expect(first.y).toBeLessThanOrEqual(0.6 * STAGE_H);

      vm.refresh();
      expect(vm.target).not.toEqual(first);
    });

    it('should keep the travel range draggable when the host cannot measure', async () => {
      // No stubbed box and no uni query → the width prop stays the travel base.
      const w = await mountOpen({ width: 300 });
      const vm = w.vm as unknown as { target: { x: number }; refresh(): void };
      vm.refresh();
      expect(vm.target.x).toBeGreaterThanOrEqual(0.45 * (300 - 44));
      expect(vm.target.x).toBeLessThanOrEqual(0.85 * (300 - 44));

      // And the piece can actually reach that range.
      await touchDrag(w, 0, vm.target.x + 4);
      expect(w.emitted('success')).toHaveLength(1);
    });
  });

  describe('touch drag', () => {
    it('should emit success and auto-close when released within tolerance', async () => {
      vi.useFakeTimers();
      const w = await mountOpen({ tolerance: 10 });
      withStageBox(w);
      const vm = w.vm as unknown as { target: { x: number }; refresh(): void };
      vm.refresh();

      await touchDrag(w, 0, vm.target.x + 4); // 位移 = 目标 +4px，落在 10px 容差内
      expect(w.emitted('success')).toHaveLength(1);
      expect(w.emitted('fail')).toBeUndefined();

      // Success lingers 600ms, then the popup closes itself.
      vi.advanceTimersByTime(600);
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([false]);
      expect(w.emitted('close')).toHaveLength(1);
    });

    it('should emit fail, shake and snap back when released off target', async () => {
      vi.useFakeTimers();
      const w = await mountOpen({ tolerance: 10 });
      withStageBox(w);
      const vm = w.vm as unknown as { target: { x: number }; offset: number; refresh(): void };
      vm.refresh();

      // Clamp keeps the drag inside the stage but far from the target.
      await touchDrag(w, 100, 0);
      expect(w.emitted('fail')).toHaveLength(1);
      expect(w.emitted('success')).toBeUndefined();
      expect(w.find('.sn-captcha__piece--shaking').exists()).toBe(true);

      // Shake window (320ms) elapses → the piece snaps back to the origin.
      vi.advanceTimersByTime(320);
      await nextTick();
      expect(vm.offset).toBe(0);
      expect(w.find('.sn-captcha__piece--shaking').exists()).toBe(false);
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('should treat touchcancel as a release and resolve the verdict', async () => {
      const w = await mountOpen({ tolerance: 10 });
      withStageBox(w);
      (w.vm as unknown as { refresh(): void }).refresh();
      const piece = w.find('.sn-captcha__piece');
      // Never moved → the piece sits at x = 0, far outside the 0.45..0.85
      // target band, so the cancelled gesture must resolve as a fail.
      await piece.trigger('touchstart', { touches: [{ clientX: 0 }] });
      await piece.trigger('touchcancel', { touches: [] });
      expect(w.emitted('fail')).toHaveLength(1);
      expect(w.emitted('success')).toBeUndefined();
    });
  });

  describe('desktop mouse drag (H5)', () => {
    it('should drag the piece with the mouse and resolve success', async () => {
      vi.useFakeTimers();
      const w = await mountOpen({ tolerance: 10 });
      withStageBox(w);
      const vm = w.vm as unknown as { target: { x: number }; refresh(): void };
      vm.refresh();

      await mouseDrag(w, 0, vm.target.x + 4);
      expect(w.emitted('success')).toHaveLength(1);
      vi.advanceTimersByTime(600);
      expect(w.emitted('close')).toHaveLength(1);
    });

    it('should emit fail when the mouse release misses the target', async () => {
      const w = await mountOpen({ tolerance: 10 });
      withStageBox(w);
      (w.vm as unknown as { refresh(): void }).refresh();

      await mouseDrag(w, 150, 0);
      expect(w.emitted('fail')).toHaveLength(1);
    });

    it('should ignore a synthetic mousedown that follows a real touch', async () => {
      const w = await mountOpen({ tolerance: 10 });
      withStageBox(w);
      const vm = w.vm as unknown as { target: { x: number }; offset: number; refresh(): void };
      vm.refresh();

      const piece = w.find('.sn-captcha__piece');
      // A real touch starts the gesture; the browser then emits a synthetic
      // mousedown — it must not re-anchor the drag.
      await piece.trigger('touchstart', { touches: [{ clientX: 0 }] });
      await mouseDrag(w, 0, vm.target.x + 4);
      expect(w.emitted('success')).toBeUndefined();
      // The gesture is still the touch one (never released) — offset moved by
      // the mouse is refused, so the piece stays where the touch left it.
      expect(vm.offset).toBe(0);

      await piece.trigger('touchend', { touches: [] });
    });

    it('should stop listening after close', async () => {
      const w = await mountOpen({ tolerance: 10 });
      withStageBox(w);
      (w.vm as unknown as { refresh(): void }).refresh();

      // Capture the piece node before the overlay unmounts, then close and
      // replay a full mouse gesture against the now-dormant binding.
      const piece = w.find('.sn-captcha__piece').element as HTMLElement;
      await w.setProps({ modelValue: false });
      await nextTick();

      piece.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 0 }));
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 400 }));
      document.dispatchEvent(new MouseEvent('mouseup'));
      await nextTick();

      expect(w.emitted('success')).toBeUndefined();
      expect(w.emitted('fail')).toBeUndefined();
    });
  });

  describe('host measurement', () => {
    it('should unwrap `$el` when a `<view>` ref is a component instance', async () => {
      // Real uni H5 compiles `<view>` to a component, so the template ref is an
      // instance and the measured node lives on `$el`. Hand the ref that shape.
      const w = await mountOpen({ width: 300 });
      const stage = w.find('.sn-captcha__stage').element as HTMLElement;
      stage.getBoundingClientRect = () =>
        ({
          width: STAGE_W,
          height: STAGE_H,
          left: 0,
          top: 0,
          right: STAGE_W,
          bottom: STAGE_H,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect;

      const setupState = (w.vm as unknown as { $: { setupState: Record<string, unknown> } }).$.setupState;
      setupState.stageRef = { $el: stage };

      const vm = w.vm as unknown as { init(): void; target: { x: number }; refresh(): void };
      vm.init();
      // Pin the roll to the top of the range: the upper bound then exposes
      // which base was used (260 measured vs the 300 `width` fallback).
      const random = vi.spyOn(Math, 'random').mockReturnValue(0.9999);
      vm.refresh();
      random.mockRestore();

      expect(vm.target.x).toBeGreaterThan(0.85 * (STAGE_W - 44) - 1);
      expect(vm.target.x).toBeLessThanOrEqual(0.85 * (STAGE_W - 44));
    });

    it('should fall back to uni.createSelectorQuery when there is no DOM box', async () => {
      const rects: Array<{ width?: number }> = [{ width: 320 }];
      let queried: string | null = null;
      const chain = {
        in: () => chain,
        select: (selector: string) => {
          queried = selector;
          return chain;
        },
        boundingClientRect: (callback: (rect: { width?: number } | null) => void) => {
          callback(rects[0] ?? null);
          return chain;
        },
        exec: () => undefined,
      };
      (globalThis as { uni?: unknown }).uni = { createSelectorQuery: () => chain };

      const w = await mountOpen();
      const vm = w.vm as unknown as { init(): void; target: { x: number }; refresh(): void };
      vm.init();
      vm.refresh();

      expect(queried).toBe('.sn-captcha__stage');
      expect(vm.target.x).toBeGreaterThanOrEqual(0.45 * (320 - 44));
      expect(vm.target.x).toBeLessThanOrEqual(0.85 * (320 - 44));
    });
  });

  describe('coordinate scale', () => {
    it('should convert pointer delta with the host rpx basis (wider viewport)', async () => {
      // 750px viewport → 1 design px = 2 CSS px: a 520 CSS px stage measures
      // 260 design px, and a 200 CSS px drag moves the piece 100 design px.
      pinViewport(750);
      const w = await mountOpen({ tolerance: 10 });
      withStageBox(w, 520);
      const vm = w.vm as unknown as {
        target: { x: number };
        offset: number;
        refresh(): void;
      };
      vm.refresh();

      const piece = w.find('.sn-captcha__piece');
      await piece.trigger('touchstart', { touches: [{ clientX: 0 }] });
      await piece.trigger('touchmove', { touches: [{ clientX: 200 }] });
      expect(vm.offset).toBeCloseTo(100);

      // Release exactly on target (delta doubled to match the scale) → success.
      const neededCss = (vm.target.x + 4) * 2;
      await piece.trigger('touchmove', { touches: [{ clientX: neededCss }] });
      await piece.trigger('touchend', { touches: [{ clientX: neededCss }] });
      expect(w.emitted('success')).toHaveLength(1);
    });

    it('should cap the rpx basis at a 960px device width', async () => {
      // Above the cap uni falls back to the 375 design base → factor is 1
      // again, so a 300 CSS px stage measures 300 design px and one CSS px of
      // travel moves the piece by one design px.
      pinViewport(1440);
      const w = await mountOpen({ tolerance: 10 });
      withStageBox(w, 300);
      const vm = w.vm as unknown as {
        target: { x: number };
        offset: number;
        refresh(): void;
      };
      vm.refresh();

      const piece = w.find('.sn-captcha__piece');
      await piece.trigger('touchstart', { touches: [{ clientX: 0 }] });
      await piece.trigger('touchmove', { touches: [{ clientX: 100 }] });
      expect(vm.offset).toBeCloseTo(100);
    });
  });

  describe('close / reset', () => {
    it('should close from the scrim only when close-on-click-modal is on', async () => {
      const w = await mountOpen();
      await w.find('.sn-captcha__modal').trigger('tap');
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([false]);

      const w2 = await mountOpen({ closeOnClickModal: false });
      await w2.find('.sn-captcha__modal').trigger('tap');
      expect(w2.emitted('update:modelValue')).toBeUndefined();
    });

    it('should expose reset and keep the piece idle after it', async () => {
      const w = await mountOpen();
      withStageBox(w);
      const vm = w.vm as unknown as {
        target: { x: number };
        offset: number;
        refresh(): void;
        reset(): void;
      };
      vm.refresh();
      await touchDrag(w, 100, 0);
      vm.reset();
      expect(vm.offset).toBe(0);
    });
  });

  describe('inline mode (additive, AUI-OPT-12)', () => {
    it('should render embedded without scrim or close button, ignoring v-model', async () => {
      const w = await mountOpen({ inline: true, modelValue: false });
      expect(w.find('.sn-captcha--inline').exists()).toBe(true);
      expect(w.find('.sn-captcha__modal').exists()).toBe(false);
      expect(w.find('[aria-label="close"]').exists()).toBe(false);
      expect(w.find('[aria-label="refresh"]').exists()).toBe(true);
      expect(w.attributes('role')).toBe('group');
    });

    it('should stay on the passed state instead of auto-closing', async () => {
      vi.useFakeTimers();
      const w = await mountOpen({ inline: true, modelValue: false, tolerance: 10 });
      withStageBox(w);
      const vm = w.vm as unknown as { target: { x: number }; refresh(): void };
      vm.refresh();

      await touchDrag(w, 0, vm.target.x + 4);
      expect(w.emitted('success')).toHaveLength(1);
      vi.advanceTimersByTime(1000);
      expect(w.emitted('close')).toBeUndefined();
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.find('.sn-captcha__piece--success').exists()).toBe(true);
    });
  });
});