import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, ref, type Ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useOverlayFollow } from './use-overlay-follow';

/**
 * Frame control: tests queue rAF callbacks and flush them explicitly, so a
 * scroll dispatch + flush is a deterministic reposition, and a pending frame
 * survives across an assert to prove stop() cancels it.
 */
let frameQueue: FrameRequestCallback[] = [];

function flushFrames(): void {
  const callbacks = frameQueue;
  frameQueue = [];
  for (const callback of callbacks) callback(0);
}

beforeEach(() => {
  frameQueue = [];
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback): number => {
    frameQueue.push(callback);
    return frameQueue.length;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Host component wiring the composable to two real divs. */
function mountHost(reposition: ReturnType<typeof vi.fn>, enabled?: Ref<boolean>) {
  const host = defineComponent({
    setup() {
      const triggerRef = ref<HTMLElement | null>(null);
      const panelRef = ref<HTMLElement | null>(null);
      const follow = useOverlayFollow(triggerRef, panelRef, reposition, enabled ?? ref(true));
      return { triggerRef, panelRef, follow };
    },
    template: `<div>
      <div ref="triggerRef" data-testid="trigger"></div>
      <div ref="panelRef" data-testid="panel"></div>
    </div>`,
  });
  const wrapper = mount(host, { attachTo: document.body });
  return wrapper;
}

describe('useOverlayFollow', () => {
  it('registers one capture-phase scroll listener and one resize listener on start', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const reposition = vi.fn();
    const wrapper = mountHost(reposition);
    const { follow } = wrapper.vm as unknown as { follow: { start: () => void } };

    follow.start();

    const scrollCall = addSpy.mock.calls.find((call) => call[0] === 'scroll');
    expect(scrollCall).toBeDefined();
    expect(scrollCall?.[2]).toMatchObject({ capture: true });
    expect(addSpy.mock.calls.filter((call) => call[0] === 'resize')).toHaveLength(1);

    wrapper.unmount();
  });

  it('removes the listeners with the same capture flag on stop', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const reposition = vi.fn();
    const wrapper = mountHost(reposition);
    const { follow } = wrapper.vm as unknown as { follow: { start: () => void; stop: () => void } };

    follow.start();
    follow.stop();

    const scrollCall = removeSpy.mock.calls.find((call) => call[0] === 'scroll');
    expect(scrollCall).toBeDefined();
    expect(scrollCall?.[2]).toMatchObject({ capture: true });
    expect(removeSpy.mock.calls.filter((call) => call[0] === 'resize')).toHaveLength(1);

    wrapper.unmount();
  });

  it('start and stop are idempotent — repeated calls attach/detach once', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const reposition = vi.fn();
    const wrapper = mountHost(reposition);
    const { follow } = wrapper.vm as unknown as { follow: { start: () => void; stop: () => void } };

    follow.start();
    follow.start();
    expect(addSpy.mock.calls.filter((call) => call[0] === 'scroll')).toHaveLength(1);

    follow.stop();
    follow.stop();
    expect(removeSpy.mock.calls.filter((call) => call[0] === 'scroll')).toHaveLength(1);
    // stop() before start() attaches nothing.
    expect(addSpy.mock.calls.filter((call) => call[0] === 'scroll')).toHaveLength(1);

    wrapper.unmount();
  });

  it('repositions on window scroll after start and not before', () => {
    const reposition = vi.fn();
    const wrapper = mountHost(reposition);
    const { follow } = wrapper.vm as unknown as { follow: { start: () => void } };

    window.dispatchEvent(new Event('scroll'));
    flushFrames();
    expect(reposition).not.toHaveBeenCalled();

    follow.start();
    window.dispatchEvent(new Event('scroll'));
    flushFrames();
    expect(reposition).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it('coalesces a scroll burst into one reposition per frame (rAF throttle)', () => {
    const reposition = vi.fn();
    const wrapper = mountHost(reposition);
    const { follow } = wrapper.vm as unknown as { follow: { start: () => void } };

    follow.start();
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    // Frames not flushed yet — nothing ran.
    expect(reposition).not.toHaveBeenCalled();
    flushFrames();
    expect(reposition).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it('repositions on window resize', () => {
    const reposition = vi.fn();
    const wrapper = mountHost(reposition);
    const { follow } = wrapper.vm as unknown as { follow: { start: () => void } };

    follow.start();
    window.dispatchEvent(new Event('resize'));
    flushFrames();
    expect(reposition).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it('drops frames while disabled but resumes when re-enabled', () => {
    const enabled = ref(false);
    const reposition = vi.fn();
    const wrapper = mountHost(reposition, enabled);
    const { follow } = wrapper.vm as unknown as { follow: { start: () => void } };

    follow.start();
    window.dispatchEvent(new Event('scroll'));
    flushFrames();
    expect(reposition).not.toHaveBeenCalled();

    enabled.value = true;
    window.dispatchEvent(new Event('scroll'));
    flushFrames();
    expect(reposition).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it('skips scroll events raised inside the panel (its own scrollbar)', () => {
    const reposition = vi.fn();
    const wrapper = mountHost(reposition);
    const { follow } = wrapper.vm as unknown as { follow: { start: () => void } };
    const panel = wrapper.find('[data-testid="panel"]').element as HTMLElement;

    follow.start();
    // Capture-phase window listener still sees non-bubbling events.
    panel.dispatchEvent(new Event('scroll'));
    flushFrames();
    expect(reposition).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('stop cancels a queued frame — no reposition after stop', () => {
    const reposition = vi.fn();
    const wrapper = mountHost(reposition);
    const { follow } = wrapper.vm as unknown as { follow: { start: () => void; stop: () => void } };

    follow.start();
    window.dispatchEvent(new Event('scroll'));
    follow.stop();
    flushFrames();
    expect(reposition).not.toHaveBeenCalled();

    // And scrolling after stop stays inert.
    window.dispatchEvent(new Event('scroll'));
    flushFrames();
    expect(reposition).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('stops following after the host unmounts (§41 cleanup)', async () => {
    const reposition = vi.fn();
    const wrapper = mountHost(reposition);
    const { follow } = wrapper.vm as unknown as { follow: { start: () => void } };

    follow.start();
    wrapper.unmount();

    window.dispatchEvent(new Event('scroll'));
    flushFrames();
    expect(reposition).not.toHaveBeenCalled();
  });
});
