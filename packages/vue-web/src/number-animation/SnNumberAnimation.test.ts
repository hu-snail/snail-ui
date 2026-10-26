import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, nextTick, type Ref } from 'vue';
import SnNumberAnimation from './SnNumberAnimation.vue';

/**
 * The tween is driven by requestAnimationFrame + performance.now (like the
 * reference). happy-dom's fake-timer support for `performance` is
 * unreliable, so both clocks are stubbed manually and driven
 * deterministically by the test.
 */
let frameQueue: Array<() => void> = [];
let clock = 0;

async function pumpFrames(totalMs: number, stepMs = 250): Promise<void> {
  let remaining = totalMs;
  while (remaining > 0) {
    const step = Math.min(stepMs, remaining);
    clock += step;
    remaining -= step;
    const callbacks = frameQueue;
    frameQueue = [];
    for (const callback of callbacks) callback();
    // Vue flushes DOM updates on the microtask queue — settle before the
    // next frame so assertions observe the rendered value.
    await nextTick();
  }
}

/** Mount SnNumberAnimation through a wrapper; exposes reactive prop handles. */
function mountAnimation(staticProps: Record<string, unknown> = {}, reactiveKeys: string[] = []) {
  const setters: Record<string, (value: unknown) => void> = {};
  const wrapper = mount(
    defineComponent({
      components: { SnNumberAnimation },
      setup() {
        const reactiveProps: Record<string, Ref<unknown>> = {};
        for (const key of reactiveKeys) {
          reactiveProps[key] = ref(staticProps[key]);
          setters[key] = (value: unknown) => {
            reactiveProps[key]!.value = value;
          };
        }
        return () =>
          h(SnNumberAnimation, {
            ...staticProps,
            ...Object.fromEntries(
              Object.entries(reactiveProps).map(([key, value]) => [key, value.value]),
            ),
          } as never);
      },
    }),
  );
  return { wrapper, setters };
}

describe('SnNumberAnimation (AUI-WEB-DD-014)', () => {
  beforeEach(() => {
    clock = 0;
    frameQueue = [];
    vi.stubGlobal('performance', { now: () => clock });
    vi.stubGlobal('requestAnimationFrame', (callback: () => void): number => {
      frameQueue.push(callback);
      return frameQueue.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('rendering', () => {
    it('renders the from value inside the component marker', async () => {
      const { wrapper } = mountAnimation({ from: 0, to: 100, duration: 1000 });
      const root = wrapper.find('.sn-number-animation');
      expect(root.attributes('data-snui-component')).toBe('number-animation');
      expect(root.text()).toBe('0');
    });

    it('animates from `from` to `to` and lands exactly on `to`', async () => {
      const { wrapper } = mountAnimation({ from: 0, to: 100, duration: 1000 });
      await pumpFrames(500);
      const mid = Number(wrapper.find('.sn-number-animation').text());
      expect(mid).toBeGreaterThan(0);
      expect(mid).toBeLessThan(100);

      await pumpFrames(500);
      expect(wrapper.find('.sn-number-animation').text()).toBe('100');
    });

    it('renders instantly when from equals to', async () => {
      const { wrapper } = mountAnimation({ from: 42, to: 42, duration: 1000 });
      expect(wrapper.find('.sn-number-animation').text()).toBe('42');
    });
  });

  describe('formatting', () => {
    it('keeps `precision` decimal digits and rounds the final value', async () => {
      const { wrapper } = mountAnimation({ from: 0, to: 1.234, precision: 2, duration: 1000 });
      await pumpFrames(1000);
      expect(wrapper.find('.sn-number-animation').text()).toBe('1.23');
    });

    it('formats the integer part with thousands separators when show-separator is set', async () => {
      const { wrapper } = mountAnimation({
        from: 0,
        to: 1000000,
        showSeparator: true,
        duration: 1000,
      });
      expect(wrapper.find('.sn-number-animation').text()).toBe('0');
      await pumpFrames(1000);
      expect(wrapper.find('.sn-number-animation').text()).toBe('1,000,000');
    });

    it('does not add separators by default', async () => {
      const { wrapper } = mountAnimation({ from: 0, to: 1000000, duration: 1000 });
      await pumpFrames(1000);
      expect(wrapper.find('.sn-number-animation').text()).toBe('1000000');
    });

    it('uses the locale for decimal marks and separators', async () => {
      const { wrapper } = mountAnimation({
        from: 0,
        to: 1234.5,
        precision: 1,
        showSeparator: true,
        locale: 'de-DE',
        duration: 1000,
      });
      await pumpFrames(1000);
      expect(wrapper.find('.sn-number-animation').text()).toBe('1.234,5');
    });
  });

  describe('active', () => {
    it('does not animate while active is false', async () => {
      const { wrapper } = mountAnimation({ from: 0, to: 100, duration: 1000, active: false });
      await pumpFrames(2000);
      expect(wrapper.find('.sn-number-animation').text()).toBe('0');
    });

    it('starts animating when active flips to true', async () => {
      const { wrapper, setters } = mountAnimation(
        { from: 0, to: 100, duration: 1000, active: false },
        ['active'],
      );
      await pumpFrames(500);
      expect(wrapper.find('.sn-number-animation').text()).toBe('0');

      setters.active!(true);
      await nextTick();
      await pumpFrames(1000);
      expect(wrapper.find('.sn-number-animation').text()).toBe('100');
    });

    it('restarts from `from` when `to` changes while active', async () => {
      const { wrapper, setters } = mountAnimation({ from: 0, to: 100, duration: 1000 }, ['to']);
      await pumpFrames(1000);
      expect(wrapper.find('.sn-number-animation').text()).toBe('100');

      setters.to!(200);
      await nextTick();
      await pumpFrames(1000);
      expect(wrapper.find('.sn-number-animation').text()).toBe('200');
    });
  });

  describe('finish event', () => {
    it('emits finish exactly once when the animation completes', async () => {
      const { wrapper } = mountAnimation({ from: 0, to: 100, duration: 1000 });
      await pumpFrames(5000);
      expect(wrapper.findComponent(SnNumberAnimation).emitted('finish')).toHaveLength(1);
    });

    it('does not emit finish when from equals to (no tween runs)', async () => {
      const { wrapper } = mountAnimation({ from: 42, to: 42, duration: 1000 });
      await pumpFrames(2000);
      expect(wrapper.findComponent(SnNumberAnimation).emitted('finish')).toBeUndefined();
    });
  });

  describe('play method', () => {
    it('replays the animation when called on the exposed instance', async () => {
      const { wrapper } = mountAnimation({ from: 0, to: 100, duration: 1000, active: false });
      const component = wrapper.findComponent(SnNumberAnimation);
      const exposed = component.vm as unknown as { play: () => void };
      await pumpFrames(1000);
      expect(wrapper.find('.sn-number-animation').text()).toBe('0');

      exposed.play();
      await pumpFrames(1000);
      expect(wrapper.find('.sn-number-animation').text()).toBe('100');
    });
  });
});
