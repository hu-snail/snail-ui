import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, nextTick, type Ref } from 'vue';
import SnCountdown from './SnCountdown.vue';

/**
 * The countdown is driven by setTimeout + performance.now (like the
 * reference). happy-dom's fake-timer support for `performance` is
 * unreliable and stubbing global setTimeout starves the vitest runner's
 * own timers, so: setTimeout comes from vitest fake timers while
 * performance.now is a manual clock — both advanced in 1 ms lockstep
 * (frame delays are clamped to >= 1 ms by the component, so each step
 * fires at most one chained frame).
 */
let clock = 0;

async function advance(ms: number): Promise<void> {
  for (let step = 0; step < ms; step += 1) {
    clock += 1;
    vi.advanceTimersByTime(1);
  }
  // Vue flushes DOM updates on the microtask queue — settle before the
  // caller asserts.
  await nextTick();
}

/** Mount SnCountdown through a wrapper; exposes reactive prop handles. */
function mountCountdown(staticProps: Record<string, unknown> = {}, reactiveKeys: string[] = []) {
  const setters: Record<string, (value: unknown) => void> = {};
  const wrapper = mount(
    defineComponent({
      components: { SnCountdown },
      setup() {
        const reactiveProps: Record<string, Ref<unknown>> = {};
        for (const key of reactiveKeys) {
          reactiveProps[key] = ref(staticProps[key]);
          setters[key] = (value: unknown) => {
            reactiveProps[key]!.value = value;
          };
        }
        return () =>
          h(SnCountdown, {
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

function getExposed(wrapper: ReturnType<typeof mountCountdown>['wrapper']): { reset: () => void } {
  return wrapper.findComponent(SnCountdown).vm as unknown as { reset: () => void };
}

describe('SnCountdown (AUI-WEB-DD-003)', () => {
  beforeEach(() => {
    clock = 0;
    // Bare useFakeTimers is what reliably patches the component-visible
    // setTimeout in the happy-dom env (a toFake subset does not).
    vi.useFakeTimers();
    // Manual clock applied after fake timers — performance.now follows it.
    vi.stubGlobal('performance', { now: () => clock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders the ceiling value inside the component marker on mount', async () => {
      const { wrapper } = mountCountdown({ duration: 5000 });
      const root = wrapper.find('.sn-countdown');
      expect(root.attributes('data-snui-component')).toBe('countdown');
      // 5000 ms remaining → the current second is still the 5th one.
      expect(root.text()).toBe('00:00:05');
    });

    it('renders 00:00:00 for a zero duration', async () => {
      const { wrapper } = mountCountdown({ duration: 0 });
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:00');
    });

    it('ticks down second by second', async () => {
      const { wrapper } = mountCountdown({ duration: 5000 });
      await advance(1000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:04');
      await advance(1000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:03');
    });
  });

  describe('precision', () => {
    it('renders one decimal digit with precision 1', async () => {
      const { wrapper } = mountCountdown({ duration: 2000, precision: 1 });
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:02.0');
      await advance(500);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:01.5');
    });

    it('renders two decimal digits with precision 2', async () => {
      const { wrapper } = mountCountdown({ duration: 2000, precision: 2 });
      // Mid-flight the exact fraction depends on where the ~30 fps frame
      // chain last fired — assert the shape, then the settled end state.
      await advance(500);
      expect(wrapper.find('.sn-countdown').text()).toMatch(/^00:00:01\.\d{2}$/);
      await advance(1500);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:00.00');
    });

    it('renders three decimal digits with precision 3', async () => {
      const { wrapper } = mountCountdown({ duration: 2000, precision: 3 });
      await advance(500);
      expect(wrapper.find('.sn-countdown').text()).toMatch(/^00:00:01\.\d{3}$/);
      await advance(1500);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:00.000');
    });
  });

  describe('finish event', () => {
    it('emits finish once and shows 00:00:00 when reaching zero', async () => {
      const { wrapper } = mountCountdown({ duration: 2000 });
      await advance(2000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:00');
      expect(wrapper.findComponent(SnCountdown).emitted('finish')).toHaveLength(1);

      // Running past the end must not re-emit.
      await advance(3000);
      expect(wrapper.findComponent(SnCountdown).emitted('finish')).toHaveLength(1);
    });

    it('does not emit finish while active is false', async () => {
      const { wrapper } = mountCountdown({ duration: 2000, active: false });
      await advance(5000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:02');
      expect(wrapper.findComponent(SnCountdown).emitted('finish')).toBeUndefined();
    });

    it('emits finish again after reset', async () => {
      const { wrapper } = mountCountdown({ duration: 1000 });
      await advance(1000);
      expect(wrapper.findComponent(SnCountdown).emitted('finish')).toHaveLength(1);

      getExposed(wrapper).reset();
      await nextTick();
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:01');
      await advance(1000);
      expect(wrapper.findComponent(SnCountdown).emitted('finish')).toHaveLength(2);
    });
  });

  describe('active', () => {
    it('starts ticking when active flips to true', async () => {
      const { wrapper, setters } = mountCountdown({ duration: 5000, active: false }, ['active']);
      await advance(2000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:05');

      setters.active!(true);
      await nextTick();
      await advance(1000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:04');
    });

    it('pauses when active flips to false and resumes where it stopped', async () => {
      const { wrapper, setters } = mountCountdown({ duration: 5000, active: true }, ['active']);
      await advance(1000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:04');

      setters.active!(false);
      await nextTick();
      await advance(5000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:04');

      setters.active!(true);
      await nextTick();
      await advance(1000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:03');
    });
  });

  describe('render prop', () => {
    it('renders the time info through the render function', async () => {
      const { wrapper } = mountCountdown({
        duration: 5000,
        render: (info: { hours: number; minutes: number; seconds: number }) =>
          `剩 ${info.hours} 时 ${info.minutes} 分 ${info.seconds} 秒`,
      });
      expect(wrapper.find('.sn-countdown').text()).toBe('剩 0 时 0 分 5 秒');
      await advance(1000);
      expect(wrapper.find('.sn-countdown').text()).toBe('剩 0 时 0 分 4 秒');
    });
  });

  describe('reset', () => {
    it('restores the full duration and keeps ticking', async () => {
      const { wrapper } = mountCountdown({ duration: 5000 });
      await advance(2000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:03');

      getExposed(wrapper).reset();
      await nextTick();
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:05');
      await advance(1000);
      expect(wrapper.find('.sn-countdown').text()).toBe('00:00:04');
    });
  });

  describe('dispose', () => {
    it('stops ticking without errors after unmount', async () => {
      const { wrapper } = mountCountdown({ duration: 5000 });
      const component = wrapper.findComponent(SnCountdown);
      wrapper.unmount();
      expect(() => advance(5000)).not.toThrow();
      expect(component.emitted('finish')).toBeUndefined();
    });
  });
});
