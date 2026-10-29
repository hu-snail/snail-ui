/**
 * sn-captcha unit tests — uni-end jigsaw slider captcha.
 *
 * Behaviour only (AGENTS.md §46): open → target re-roll bounds, the drag →
 * success path (within tolerance), the fail → shake + reset path, the modal
 * close guard and the refresh re-roll. No rpx numbers in assertions; the
 * piece handlers are driven through the exposed API (same harness style as
 * sn-slide-verify, whose touch handlers the tests trigger directly).
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SnCaptcha from './sn-captcha.vue';

const STAGE_W = 260;
const STAGE_H = 200;

/** Give the stage a deterministic box, then re-measure. */
function withStageBox(w: ReturnType<typeof mount>, width = STAGE_W): void {
  const stage = w.find('.sn-captcha__stage');
  const element = stage.element as HTMLElement;
  element.getBoundingClientRect = () =>
    ({
      width,
      height: STAGE_H,
      left: 0,
      top: 0,
      right: width,
      bottom: STAGE_H,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
  const vm = w.vm as unknown as { init(): void };
  vm.init();
}

/** Drive one drag: start at startX, move by delta, release. */
function drag(
  w: ReturnType<typeof mount>,
  startX: number,
  delta: number,
): void {
  const vm = w.vm as unknown as {
    onPieceTouchStart(event: Event): void;
    onPieceTouchMove(event: Event): void;
    onPieceTouchEnd(): void;
  };
  const touch = (x: number) => ({ touches: [{ clientX: x }] }) as unknown as Event;
  vm.onPieceTouchStart(touch(startX));
  vm.onPieceTouchMove(touch(startX + delta));
  vm.onPieceTouchEnd();
}

afterEach(() => {
  vi.useRealTimers();
});

describe('sn-captcha', () => {
  it('should not render before mounted or when closed', () => {
    const w = mount(SnCaptcha, { props: { modelValue: false, src: 'bg.png' } });
    expect(w.find('.sn-captcha').exists()).toBe(false);
  });

  it('should re-roll a target inside the travel range on open and refresh', async () => {
    const w = mount(SnCaptcha, { props: { modelValue: true, src: 'bg.png' } });
    await nextTick();
    withStageBox(w);
    (w.vm as unknown as { refresh(): void }).refresh();
    const vm = w.vm as unknown as {
      target: { x: number; y: number };
      refresh(): void;
    };
    // 打开瞬间舞台未挂载，target 以 props 宽度兜底；注入盒子后重掷一次再断言。
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

  it('should emit success and auto-close when released within tolerance', async () => {
    vi.useFakeTimers();
    const w = mount(SnCaptcha, {
      props: { modelValue: true, src: 'bg.png', tolerance: 10 },
    });
    await nextTick();
    withStageBox(w);
    (w.vm as unknown as { refresh(): void }).refresh();
    const vm = w.vm as unknown as {
      target: { x: number };
      refresh(): void;
    };
    vm.refresh();
    const targetX = vm.target.x;

    drag(w, 0, targetX + 4); // 位移 = 目标 +4px，落在 10px 容差内
    expect(w.emitted('success')).toHaveLength(1);
    expect(w.emitted('fail')).toBeUndefined();

    // Success lingers 600ms, then the popup closes itself.
    vi.advanceTimersByTime(600);
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    expect(w.emitted('close')).toHaveLength(1);
  });

  it('should emit fail, shake and snap back when released off target', async () => {
    vi.useFakeTimers();
    const w = mount(SnCaptcha, {
      props: { modelValue: true, src: 'bg.png', tolerance: 10 },
    });
    await nextTick();
    withStageBox(w);
    (w.vm as unknown as { refresh(): void }).refresh();
    const vm = w.vm as unknown as {
      target: { x: number };

    };

    drag(w, 100, vm.target.x - 100 - 40); // far off target
    expect(w.emitted('fail')).toHaveLength(1);
    expect(w.emitted('success')).toBeUndefined();
    // Shake window (320ms) elapses → piece snaps back to the origin.
    vi.advanceTimersByTime(320);
    expect(vm.offset).toBe(0);
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('should close from the scrim only when close-on-click-modal is on', async () => {
    const w = mount(SnCaptcha, { props: { modelValue: true, src: 'bg.png' } });
    await nextTick();
    await w.find('.sn-captcha__modal').trigger('tap');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([false]);

    const w2 = mount(SnCaptcha, {
      props: { modelValue: true, src: 'bg.png', closeOnClickModal: false },
    });
    await nextTick();
    await w2.find('.sn-captcha__modal').trigger('tap');
    expect(w2.emitted('update:modelValue')).toBeUndefined();
  });

  it('should expose reset and keep the piece idle after it', async () => {
    vi.useFakeTimers();
    const w = mount(SnCaptcha, { props: { modelValue: true, src: 'bg.png' } });
    await nextTick();
    withStageBox(w);
    (w.vm as unknown as { refresh(): void }).refresh();
    const vm = w.vm as unknown as {
      target: { x: number };

      reset(): void;
    };
    drag(w, 100, vm.target.x - 100 - 40);
    vm.reset();
    expect(vm.offset).toBe(0);
  });
});
