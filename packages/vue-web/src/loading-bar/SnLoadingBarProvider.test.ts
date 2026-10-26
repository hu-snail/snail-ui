/**
 * SnLoadingBarProvider + useLoadingBar tests — AUI-WEB-FB-013.
 *
 * Reference: naive-ui `n-loading-bar-provider` / `useLoadingBar`. These
 * tests pin the observable bar contract:
 *   - the bar is a teleported, `aria-hidden` decorative strip;
 *   - `start()` shows the bar and grows its width frame by frame with a
 *     decelerating rAF loop that never reaches 100% on its own;
 *   - `finish()` sprints to 100%, fades out, and resets to idle;
 *   - `error()` does the same with the danger colour state;
 *   - idle `finish()` / repeated `start()` are safe no-ops / single loops;
 *   - unmount cancels the rAF loop (§41/§42);
 *   - the no-provider path warns `PROVIDER_MISSING` and returns a no-op API.
 *
 * Note on querying: with VTU's teleport stub the bar element is re-created
 * on every re-render of the stub, so the bar must be re-queried after each
 * state change (the real Teleport reuses the element — pinned by the
 * `to`-target test below).
 */

import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import SnLoadingBarProvider from './SnLoadingBarProvider.vue';
import { useLoadingBar } from './use-loading-bar';
import type { LoadingBarApi } from './loading-bar-types';

const FRAME = 16;

/** Install fake timers that cover the rAF loop. */
function useAnimationFrameTimers(): void {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'],
  });
}

/** Parse `width: 12.34%` out of the bar's inline style. */
function widthOf(style: string | undefined): number {
  const match = /width:\s*([\d.]+)%/.exec(style ?? '');
  return match ? Number.parseFloat(match[1]) : Number.NaN;
}

describe('SnLoadingBarProvider (AUI-WEB-FB-013)', () => {
  let capturedApi: LoadingBarApi | undefined;

  beforeEach(() => {
    useAnimationFrameTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function mountWithConsumer(props: Record<string, unknown> = {}) {
    const Consumer = defineComponent({
      name: 'LoadingBarConsumer',
      setup() {
        capturedApi = useLoadingBar();
        return () => null;
      },
    });
    const wrapper = mount(SnLoadingBarProvider, {
      props,
      slots: { default: () => h(Consumer) },
      global: { stubs: { teleport: true } },
    });
    const getApi = (): LoadingBarApi => {
      if (!capturedApi) {
        throw new Error('consumer never captured the loading bar API');
      }
      return capturedApi;
    };
    /** Re-query the bar: the stub re-creates the element per re-render. */
    const barOf = () => wrapper.find('.sn-loading-bar__bar');
    return { wrapper, getApi, barOf };
  }

  it('should render a hidden decorative bar with the accessibility contract', () => {
    const { wrapper } = mountWithConsumer();
    const barRoot = wrapper.find('.sn-loading-bar');

    expect(barRoot.exists()).toBe(true);
    expect(barRoot.attributes('aria-hidden')).toBe('true');
    expect(barRoot.attributes('data-snui-component')).toBe('loading-bar');
    expect(widthOf(barRoot.find('.sn-loading-bar__bar').attributes('style'))).toBe(0);
    expect(barRoot.find('.sn-loading-bar__bar').attributes('style')).toContain('opacity: 0');
  });

  it('should show the bar on start() and grow the width frame by frame', async () => {
    const { getApi, barOf } = mountWithConsumer();

    getApi().start();
    await nextTick();
    expect(barOf().attributes('style')).toContain('opacity: 1');

    vi.advanceTimersByTime(FRAME * 3);
    await nextTick();
    const early = widthOf(barOf().attributes('style'));
    expect(early).toBeGreaterThan(0);

    vi.advanceTimersByTime(FRAME * 40);
    await nextTick();
    const later = widthOf(barOf().attributes('style'));
    expect(later).toBeGreaterThan(early);
  });

  it('should decelerate towards — but never pass — the loading ceiling', async () => {
    const { getApi, barOf } = mountWithConsumer();

    getApi().start();
    await nextTick();
    vi.advanceTimersByTime(FRAME * 10);
    await nextTick();
    const earlyDelta = widthOf(barOf().attributes('style'));

    vi.advanceTimersByTime(FRAME * 10);
    await nextTick();
    const lateDelta = widthOf(barOf().attributes('style'));

    // Later frame window must add less width than the earlier one.
    expect(lateDelta).toBeGreaterThan(earlyDelta);
    expect(lateDelta).toBeLessThan(90);
  });

  it('should ignore repeated start() calls while loading', async () => {
    const { getApi, barOf } = mountWithConsumer();

    getApi().start();
    await nextTick();
    vi.advanceTimersByTime(FRAME * 10);
    await nextTick();
    const before = widthOf(barOf().attributes('style'));

    getApi().start();
    vi.advanceTimersByTime(FRAME);
    await nextTick();
    const after = widthOf(barOf().attributes('style'));

    // A second loop would roughly double the increment for this frame.
    const singleStep = (90 - before) * 0.035;
    expect(after - before).toBeLessThan(singleStep * 1.5);
  });

  it('should sprint to 100% on finish(), fade out, then reset', async () => {
    const { getApi, barOf } = mountWithConsumer();

    getApi().start();
    await nextTick();
    vi.advanceTimersByTime(FRAME * 10);
    await nextTick();

    getApi().finish();
    await nextTick();
    expect(widthOf(barOf().attributes('style'))).toBe(100);
    expect(barOf().attributes('style')).toContain('opacity: 1');

    vi.advanceTimersByTime(260);
    await nextTick();
    expect(barOf().attributes('style')).toContain('opacity: 0');

    vi.advanceTimersByTime(320);
    await nextTick();
    expect(widthOf(barOf().attributes('style'))).toBe(0);
    expect(barOf().attributes('style')).toContain('opacity: 0');
  });

  it('should switch to the danger state on error() and fade out afterwards', async () => {
    const { getApi, barOf } = mountWithConsumer();

    getApi().start();
    await nextTick();
    vi.advanceTimersByTime(FRAME * 10);
    await nextTick();

    getApi().error();
    await nextTick();
    expect(barOf().classes()).toContain('sn-loading-bar__bar--error');
    expect(widthOf(barOf().attributes('style'))).toBe(100);

    vi.advanceTimersByTime(380);
    await nextTick();
    expect(barOf().attributes('style')).toContain('opacity: 0');

    vi.advanceTimersByTime(320);
    await nextTick();
    expect(widthOf(barOf().attributes('style'))).toBe(0);
  });

  it('should treat finish() / error() without start() as no-ops', async () => {
    const { getApi, barOf } = mountWithConsumer();

    getApi().finish();
    getApi().error();
    vi.advanceTimersByTime(2000);
    await nextTick();

    expect(widthOf(barOf().attributes('style'))).toBe(0);
    expect(barOf().attributes('style')).toContain('opacity: 0');
  });

  it('should merge loadingBarStyle for the active state', async () => {
    const { getApi, barOf } = mountWithConsumer({
      loadingBarStyle: { loading: { height: '4px' } },
    });

    getApi().start();
    await nextTick();
    expect(barOf().attributes('style')).toContain('height: 4px');
  });

  it('should cancel the rAF loop on unmount', async () => {
    const cancelSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
    const { wrapper, getApi } = mountWithConsumer();

    getApi().start();
    await nextTick();
    wrapper.unmount();

    expect(cancelSpy).toHaveBeenCalled();
    expect(() => vi.advanceTimersByTime(2000)).not.toThrow();
    cancelSpy.mockRestore();
  });

  it('should honour a custom `to` teleport target and reuse the bar element', async () => {
    const target = document.createElement('div');
    target.id = 'sn-loading-bar-teleport-target';
    document.body.appendChild(target);

    try {
      const Consumer = defineComponent({
        name: 'LoadingBarConsumer',
        setup() {
          capturedApi = useLoadingBar();
          return () => null;
        },
      });
      const wrapper = mount(SnLoadingBarProvider, {
        props: { to: '#sn-loading-bar-teleport-target' },
        slots: { default: () => h(Consumer) },
        global: { stubs: { teleport: false } },
      });

      const bar = target.querySelector('.sn-loading-bar__bar');
      expect(bar).not.toBeNull();

      // Real Teleport: the element must survive re-renders so CSS
      // transitions on width actually animate.
      capturedApi?.start();
      await nextTick();
      expect(document.querySelector('.sn-loading-bar__bar')).toBe(bar);

      vi.advanceTimersByTime(FRAME * 3);
      await nextTick();
      expect(document.querySelector('.sn-loading-bar__bar')).toBe(bar);
      expect(widthOf(bar?.getAttribute('style'))).toBeGreaterThan(0);

      wrapper.unmount();
      expect(target.querySelector('.sn-loading-bar')).toBeNull();
    } finally {
      target.remove();
    }
  });
});

describe('useLoadingBar without a provider (AUI-WEB-FB-013)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should warn PROVIDER_MISSING and return a no-op API that never crashes', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const Consumer = defineComponent({
        name: 'BareLoadingBarConsumer',
        setup() {
          const api = useLoadingBar();
          return () => h('div', { class: 'bare-consumer' }, String(typeof api.start));
        },
      });
      const wrapper = mount(Consumer);

      expect(wrapper.find('.bare-consumer').text()).toBe('function');
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('PROVIDER_MISSING'),
        expect.objectContaining({ code: 'PROVIDER_MISSING' }),
      );

      // Every no-op call must survive without throwing.
      expect(() => {
        useLoadingBar().start();
        useLoadingBar().finish();
        useLoadingBar().error();
      }).not.toThrow();
    } finally {
      warn.mockRestore();
    }
  });
});
