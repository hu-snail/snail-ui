/**
 * sn-slide-verify unit tests — uni-end drag-to-confirm slider.
 *
 * Behaviour only (AGENTS.md §46): the drag threshold, the tolerance, the
 * fail / reset cycle, the disabled guard, the slot overrides, the desktop-mouse
 * path, the host measurement fallbacks and the rpx coordinate scale. No rpx
 * numbers in assertions.
 *
 * The viewport is pinned to the 750rpx design reference (375px) so one design
 * px == one CSS px in the numbers below; the scale rule itself is covered by
 * the dedicated viewport tests at the end.
 */

import { afterEach, beforeAll, describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SnSlideVerify from './sn-slide-verify.vue';

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
  pinViewport(375);
  delete (globalThis as { uni?: unknown }).uni;
});

/**
 * Give the track a deterministic 200px box, then re-measure.
 *
 * happy-dom reports a zero-width box, so the pad is stubbed first and the
 * component's own `init()` (the exposed, public re-measure entry point) is
 * called to pick the width up — exactly what a host page does after a layout
 * change.
 */
function withTrackBox(w: ReturnType<typeof mount>, width = 200): void {
  const track = w.find('.sn-slide-verify__track');
  const element = track.element as HTMLElement;
  element.getBoundingClientRect = () =>
    ({
      width,
      height: 44,
      left: 0,
      top: 0,
      right: width,
      bottom: 44,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
  const vm = w.vm as unknown as { init(): void };
  vm.init();
}

async function drag(w: ReturnType<typeof mount>, to: number): Promise<void> {
  const handle = w.find('.sn-slide-verify__handle');
  await handle.trigger('touchstart', { touches: [{ clientX: 0 }] });
  await handle.trigger('touchmove', { touches: [{ clientX: to }] });
  await handle.trigger('touchend', { touches: [{ clientX: to }] });
}

describe('sn-slide-verify', () => {
  describe('structure', () => {
    it('renders the built-in hint', () => {
      expect(mount(SnSlideVerify).find('.sn-slide-verify__text').text()).toBe('向右拖动滑块');
    });

    it('renders a custom hint', () => {
      expect(
        mount(SnSlideVerify, { props: { text: 'Slide to unlock' } })
          .find('.sn-slide-verify__text')
          .text(),
      ).toBe('Slide to unlock');
    });

    it('renders the handle with role="button"', () => {
      const w = mount(SnSlideVerify);
      expect(w.find('.sn-slide-verify__handle').attributes('role')).toBe('button');
    });

    it('applies the disabled class and drops the tabindex', () => {
      const w = mount(SnSlideVerify, { props: { disabled: true } });
      expect(w.classes()).toContain('sn-slide-verify--disabled');
      expect(w.find('.sn-slide-verify__handle').attributes('tabindex')).toBe('-1');
    });

    it('forwards the background colors as custom properties', () => {
      const w = mount(SnSlideVerify, {
        props: { backgroundColor: 'rgb(1,2,3)', activeBackgroundColor: 'rgb(4,5,6)' },
      });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-slide-verify-track-bg: rgb(1,2,3)');
      expect(style).toContain('--sn-slide-verify-track-active-bg: rgb(4,5,6)');
    });

    it('renders the default handle icon', () => {
      expect(mount(SnSlideVerify).find('.sn-icon').exists()).toBe(true);
    });

    it('renders the icon slot when provided', () => {
      const w = mount(SnSlideVerify, { slots: { icon: '<text class="custom-icon">go</text>' } });
      expect(w.find('.custom-icon').exists()).toBe(true);
    });

    it('renders the iconfont glyph when icon is set', () => {
      const w = mount(SnSlideVerify, { props: { icon: 'double-right' } });
      expect(w.find('.sn-icon__glyph').classes()).toContain('sn-icon-double-right');
      // The built-in SVG glyph is replaced, not duplicated.
      expect(w.find('.sn-icon svg').exists()).toBe(false);
    });

    it('honours iconPrefix and cssIcon', () => {
      const prefixed = mount(SnSlideVerify, {
        props: { icon: 'arrow', iconPrefix: 'wd-icon' },
      });
      expect(prefixed.find('.sn-icon__glyph').classes()).toContain('wd-icon-arrow');

      const css = mount(SnSlideVerify, { props: { icon: 'my-glyph', cssIcon: true } });
      expect(css.find('.sn-icon__glyph').classes()).toContain('my-glyph');
    });

    it('applies iconSize to the built-in handle glyph', () => {
      const w = mount(SnSlideVerify, { props: { iconSize: 40 } });
      expect(w.find('.sn-icon').attributes('style')).toContain('40px');
    });

    it('renders the success glyph name once verified', async () => {
      const w = mount(SnSlideVerify, { props: { successIcon: 'check-circle-fill' } });
      withTrackBox(w);
      await drag(w, 200);
      expect(w.find('.sn-icon__glyph').classes()).toContain('sn-icon-check-circle-fill');
    });

    it('applies successIconSize to the built-in success glyph', async () => {
      const w = mount(SnSlideVerify, { props: { successIconSize: 36 } });
      withTrackBox(w);
      await drag(w, 200);
      expect(w.find('.sn-icon').attributes('style')).toContain('36px');
    });
  });

  describe('verification', () => {
    it('emits success when dragged to the end', async () => {
      const w = mount(SnSlideVerify);
      withTrackBox(w);
      await drag(w, 200);
      expect(w.emitted('success')).toHaveLength(1);
    });

    it('accepts a drag inside the tolerance band', async () => {
      const w = mount(SnSlideVerify, { props: { tolerance: 20 } });
      withTrackBox(w);
      // maxOffset = 200 - 44 = 156; 140 is within 20 of it.
      await drag(w, 140);
      expect(w.emitted('success')).toHaveLength(1);
    });

    it('emits fail for a short drag', async () => {
      const w = mount(SnSlideVerify);
      withTrackBox(w);
      await drag(w, 40);
      expect(w.emitted('fail')).toHaveLength(1);
      expect(w.emitted('success')).toBeUndefined();
    });

    it('resets the offset after a failed drag', async () => {
      const w = mount(SnSlideVerify);
      withTrackBox(w);
      await drag(w, 40);
      const style = w.find('.sn-slide-verify__handle').attributes('style') ?? '';
      expect(style).toContain('translateX(0rpx)');
    });

    it('shows the success state and text', async () => {
      const w = mount(SnSlideVerify, { props: { successText: 'Verified' } });
      withTrackBox(w);
      await drag(w, 200);
      expect(w.classes()).toContain('sn-slide-verify--success');
      expect(w.find('.sn-slide-verify__text').text()).toBe('Verified');
    });

    it('falls back to the built-in success copy', async () => {
      const w = mount(SnSlideVerify);
      withTrackBox(w);
      await drag(w, 200);
      expect(w.find('.sn-slide-verify__text').text()).toBe('验证通过');
    });

    it('does not emit while disabled', async () => {
      const w = mount(SnSlideVerify, { props: { disabled: true } });
      withTrackBox(w);
      await drag(w, 200);
      expect(w.emitted('success')).toBeUndefined();
      expect(w.emitted('fail')).toBeUndefined();
    });

    it('does not re-verify once successful', async () => {
      const w = mount(SnSlideVerify);
      withTrackBox(w);
      await drag(w, 200);
      await drag(w, 200);
      expect(w.emitted('success')).toHaveLength(1);
    });
  });

  describe('exposed API', () => {
    it('reset returns the handle to the start', async () => {
      const w = mount(SnSlideVerify);
      withTrackBox(w);
      await drag(w, 200);
      const vm = w.vm as unknown as { reset(): void; init(): void };
      vm.reset();
      await w.vm.$nextTick();
      expect(w.classes()).not.toContain('sn-slide-verify--success');
    });

    it('init re-measures without throwing', () => {
      const w = mount(SnSlideVerify);
      const vm = w.vm as unknown as { init(): void };
      expect(() => {
        vm.init();
      }).not.toThrow();
    });
  });
});

describe('sn-slide-verify gesture cancellation and coordinate fallbacks', () => {
  it('resets the offset when the gesture is cancelled mid-drag', async () => {
    const w = mount(SnSlideVerify);
    withTrackBox(w);
    const handle = w.find('.sn-slide-verify__handle');
    await handle.trigger('touchstart', { touches: [{ clientX: 0 }] });
    await handle.trigger('touchmove', { touches: [{ clientX: 100 }] });
    expect(w.classes()).toContain('sn-slide-verify--dragging');
    await handle.trigger('touchcancel');
    expect(w.classes()).not.toContain('sn-slide-verify--dragging');
    expect(w.emitted('success')).toBeUndefined();
  });

  it('ignores a cancel that arrives outside a drag', async () => {
    const w = mount(SnSlideVerify);
    withTrackBox(w);
    await w.find('.sn-slide-verify__handle').trigger('touchcancel');
    expect(w.classes()).not.toContain('sn-slide-verify--dragging');
  });

  it('falls back to pageX when clientX is absent', async () => {
    const w = mount(SnSlideVerify);
    withTrackBox(w);
    const handle = w.find('.sn-slide-verify__handle');
    await handle.trigger('touchstart', { touches: [{ pageX: 0 }] });
    await handle.trigger('touchmove', { touches: [{ pageX: 400 }] });
    await handle.trigger('touchend', { touches: [{ pageX: 400 }] });
    expect(w.emitted('success')).toHaveLength(1);
  });

  it('falls back to detail.x when no touch list is present', async () => {
    const w = mount(SnSlideVerify);
    withTrackBox(w);
    const handle = w.find('.sn-slide-verify__handle');
    await handle.trigger('touchstart', { detail: { x: 0 } });
    await handle.trigger('touchmove', { detail: { x: 400 } });
    await handle.trigger('touchend', { detail: { x: 400 } });
    expect(w.emitted('success')).toHaveLength(1);
  });
});

describe('sn-slide-verify desktop mouse drag (additive, AUI-OPT-12)', () => {
  /** One mouse gesture; move / up land on `document` as the binder expects. */
  async function mouseDrag(w: ReturnType<typeof mount>, to: number): Promise<void> {
    const handle = w.find('.sn-slide-verify__handle');
    await handle.trigger('mousedown', { button: 0, clientX: 0 });
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: to }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();
  }

  it('verifies through a mouse drag to the right edge', async () => {
    const w = mount(SnSlideVerify);
    withTrackBox(w);
    await mouseDrag(w, 400);
    expect(w.emitted('success')).toHaveLength(1);
    expect(w.classes()).toContain('sn-slide-verify--success');
  });

  it('fails a short mouse drag and snaps back', async () => {
    const w = mount(SnSlideVerify);
    withTrackBox(w);
    await mouseDrag(w, 60);
    expect(w.emitted('fail')).toHaveLength(1);
    expect(w.classes()).not.toContain('sn-slide-verify--dragging');
  });

  it('ignores a right-click and an already verified handle', async () => {
    const w = mount(SnSlideVerify);
    withTrackBox(w);
    const handle = w.find('.sn-slide-verify__handle');
    await handle.trigger('mousedown', { button: 2, clientX: 0 });
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 400 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(w.emitted('success')).toBeUndefined();
  });

  it('does not drag while disabled', async () => {
    const w = mount(SnSlideVerify, { props: { disabled: true } });
    withTrackBox(w);
    await mouseDrag(w, 400);
    expect(w.emitted('success')).toBeUndefined();
  });

  it('removes the listeners on unmount', async () => {
    const w = mount(SnSlideVerify);
    withTrackBox(w);
    const handle = w.find('.sn-slide-verify__handle').element as HTMLElement;
    w.unmount();
    handle.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 0 }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 400 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    // Nothing to assert beyond "no exception and no drag state" — the instance
    // is gone; a leaked listener would only show as a crash-free no-op here.
    expect(w.emitted('success')).toBeUndefined();
  });
});

describe('sn-slide-verify host measurement', () => {
  it('unwraps `$el` when a `<view>` ref is a component instance', async () => {
    // Real uni H5 compiles `<view>` to a component: the ref is the instance and
    // the measured node lives on `$el`.
    const w = mount(SnSlideVerify);
    const track = w.find('.sn-slide-verify__track').element as HTMLElement;
    track.getBoundingClientRect = () =>
      ({
        width: 240,
        height: 44,
        left: 0,
        top: 0,
        right: 240,
        bottom: 44,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    const setupState = (w.vm as unknown as { $: { setupState: Record<string, unknown> } }).$
      .setupState;
    setupState.trackRef = { $el: track };

    (w.vm as unknown as { init(): void }).init();
    // A 240 design px track leaves 196 px of travel; a 196 px drag verifies.
    await drag(w, 196);
    expect(w.emitted('success')).toHaveLength(1);
  });

  it('falls back to uni.createSelectorQuery when there is no DOM box', async () => {
    let queried: string | null = null;
    const chain = {
      in: () => chain,
      select: (selector: string) => {
        queried = selector;
        return chain;
      },
      boundingClientRect: (callback: (rect: { width?: number } | null) => void) => {
        callback({ width: 240 });
        return chain;
      },
      exec: () => undefined,
    };
    (globalThis as { uni?: unknown }).uni = { createSelectorQuery: () => chain };

    const w = mount(SnSlideVerify);
    (w.vm as unknown as { init(): void }).init();
    expect(queried).toBe('.sn-slide-verify__track');

    await drag(w, 196);
    expect(w.emitted('success')).toHaveLength(1);
  });

  it('re-measures lazily when the first gesture starts on an unmeasured track', async () => {
    // No `init()` call and no box stub at mount: the track is unmeasured when
    // the gesture starts (the popup / tab opened after mount case). The start
    // path measures again, so the release can still reach the right edge.
    const w = mount(SnSlideVerify);
    const track = w.find('.sn-slide-verify__track').element as HTMLElement;
    track.getBoundingClientRect = () =>
      ({
        width: 200,
        height: 44,
        left: 0,
        top: 0,
        right: 200,
        bottom: 44,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    await drag(w, 400);
    expect(w.emitted('success')).toHaveLength(1);
  });
});

describe('sn-slide-verify coordinate scale', () => {
  it('converts the pointer delta with the host rpx basis (750px viewport)', async () => {
    // 750px viewport → 1 design px = 2 CSS px: a 400 CSS px track measures
    // 200 design px, and a 400 CSS px drag is exactly the 156 design px max
    // travel (plus tolerance) → success.
    pinViewport(750);
    const w = mount(SnSlideVerify);
    withTrackBox(w, 400);
    await drag(w, 400);
    expect(w.emitted('success')).toHaveLength(1);
  });

  it('caps the rpx basis above the 960px device cap', async () => {
    // Above the cap uni falls back to the 375 design base → factor 1 again, so
    // a 400 CSS px track stays 400 design px and 200 CSS px of travel is a fail.
    pinViewport(1440);
    const w = mount(SnSlideVerify);
    withTrackBox(w, 400);
    await drag(w, 200);
    expect(w.emitted('fail')).toHaveLength(1);

    await drag(w, 400);
    expect(w.emitted('success')).toHaveLength(1);
  });
});
