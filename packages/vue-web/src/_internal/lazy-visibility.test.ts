import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import type { Ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useLazyVisibility } from './lazy-visibility';
import type { LazyVisibilityOptions } from './lazy-visibility';

interface IOController {
  fire: (isIntersecting: boolean) => void;
}

/** Stub IntersectionObserver, handing tests manual control. */
function stubIntersectionObserver(): IOController[] {
  const controllers: IOController[] = [];
  class IOStub {
    constructor(callback: IntersectionObserverCallback) {
      controllers.push({
        fire: (isIntersecting: boolean) => {
          callback(
            [{ isIntersecting } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
        },
      });
    }
    observe(): void {}
    disconnect(): void {}
    unobserve(): void {}
  }
  vi.stubGlobal('IntersectionObserver', IOStub);
  return controllers;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Mount a host component wiring the composable to a div target. */
function mountHost(
  enabled: Ref<boolean>,
  options?: Ref<LazyVisibilityOptions | undefined>,
): { wrapper: ReturnType<typeof mount>; shouldLoad: Ref<boolean> } {
  const target = ref<Element | null>(null);
  let captured: Ref<boolean> | null = null;
  const host = defineComponent({
    setup() {
      const lazy = useLazyVisibility(target, options ?? ref(undefined), enabled);
      captured = lazy.shouldLoad;
      return () =>
        h('div', {
          ref: (el: unknown) => {
            target.value = (el as Element) ?? null;
          },
        });
    },
  });
  const wrapper = mount(host);
  return { wrapper, shouldLoad: captured as Ref<boolean> };
}

describe('useLazyVisibility', () => {
  it('should un-gate immediately when disabled', () => {
    stubIntersectionObserver();
    const { shouldLoad } = mountHost(ref(false));
    expect(shouldLoad.value).toBe(true);
  });

  it('should gate the load until the observer reports visibility', async () => {
    const controllers = stubIntersectionObserver();
    const { shouldLoad } = mountHost(ref(true), ref({ rootMargin: '100px' }));
    // Exactly one observer — built once the target ref is populated (post mount).
    expect(controllers).toHaveLength(1);
    expect(shouldLoad.value).toBe(false);

    controllers[0].fire(false);
    expect(shouldLoad.value).toBe(false);

    controllers[0].fire(true);
    expect(shouldLoad.value).toBe(true);
  });

  it('should stay loaded after the first intersection', async () => {
    const controllers = stubIntersectionObserver();
    const { shouldLoad } = mountHost(ref(true), ref({}));
    controllers[0].fire(true);
    expect(shouldLoad.value).toBe(true);
    controllers[0].fire(false);
    expect(shouldLoad.value).toBe(true);
  });

  it('should un-gate eagerly when IntersectionObserver is unavailable', () => {
    // Deliberately NOT stubbing IntersectionObserver: if the runtime lacks it,
    // the gate must open instead of withholding the src forever (§85).
    const globalWithIO = globalThis as { IntersectionObserver?: unknown };
    const hadIO = 'IntersectionObserver' in globalWithIO;
    const original = globalWithIO.IntersectionObserver;
    if (hadIO) delete globalWithIO.IntersectionObserver;
    try {
      const { shouldLoad } = mountHost(ref(true), ref({}));
      expect(shouldLoad.value).toBe(true);
    } finally {
      if (hadIO) globalWithIO.IntersectionObserver = original;
    }
  });

  it('should build the gate reactively when enabled turns on', async () => {
    const controllers = stubIntersectionObserver();
    const enabled = ref(false);
    const { shouldLoad } = mountHost(enabled, ref({}));
    expect(shouldLoad.value).toBe(true);
    expect(controllers).toHaveLength(0);

    enabled.value = true;
    await nextTick();
    expect(controllers).toHaveLength(1);
    expect(shouldLoad.value).toBe(false);

    controllers[0].fire(true);
    await nextTick();
    expect(shouldLoad.value).toBe(true);
  });

  it('should un-gate reactively when enabled turns off before intersecting', async () => {
    stubIntersectionObserver();
    const enabled = ref(true);
    const { shouldLoad } = mountHost(enabled, ref({}));
    expect(shouldLoad.value).toBe(false);

    enabled.value = false;
    await nextTick();
    expect(shouldLoad.value).toBe(true);
  });
});
