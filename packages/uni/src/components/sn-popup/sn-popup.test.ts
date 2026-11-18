/**
 * sn-popup unit tests — uni-end positioned popup (wd-popup parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - v-model controls presence; `update:modelValue` + `close` fire on close
 *   - `position` / `round` / `closable` drive the class surface
 *   - `closeOnClickModal` decides whether a scrim tap closes
 *   - `lazyRender` defers slot rendering until the first open
 *   - `hideWhenClose=false` keeps the node mounted after closing
 *   - the animation timer is cleared on unmount (§41)
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnPopup from './sn-popup.vue';

describe('sn-popup', () => {
  it('renders nothing when modelValue is false', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: false } });
    expect(wrapper.find('.sn-popup').exists()).toBe(false);
  });

  it('renders the panel and slot content when modelValue is true', () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true },
      slots: { default: '<text>panel body</text>' },
    });
    expect(wrapper.find('.sn-popup__panel').exists()).toBe(true);
    expect(wrapper.text()).toContain('panel body');
  });

  /**
   * Mount closed, then open — the enter leg is what carries the animation
   * (an already-open first paint renders at rest, matching the onMounted
   * contract). The leg is transition-driven: the first frame parks the panel
   * at its off-screen start, the next tick drops it to rest.
   */
  async function mountOpened(props: Record<string, unknown> = {}) {
    const wrapper = mount(SnPopup, { props: { modelValue: false, ...props } });
    await wrapper.setProps({ modelValue: true });
    await wrapper.vm.$nextTick();
    return wrapper;
  }

  /** The panel's style attribute ('' when unset). */
  const panelStyle = (w: ReturnType<typeof mount>): string =>
    w.find('.sn-popup__panel').attributes('style') ?? '';

  it('defaults to the center anchor and fades the panel in', async () => {
    const wrapper = await mountOpened();
    expect(wrapper.classes()).toContain('sn-popup--center');
    // A fade parks on opacity only — no transform offset.
    expect(panelStyle(wrapper)).toContain('opacity: 0');
  });

  it('applies the anchor-specific class for each position', () => {
    for (const position of ['center', 'top', 'bottom', 'left', 'right'] as const) {
      const wrapper = mount(SnPopup, { props: { modelValue: true, position } });
      expect(wrapper.classes()).toContain(`sn-popup--${position}`);
    }
  });

  it('slides the panel in from the edge its anchor implies', async () => {
    const bottom = await mountOpened({ position: 'bottom' });
    expect(panelStyle(bottom)).toContain('translateY(100%)');

    const right = await mountOpened({ position: 'right' });
    expect(panelStyle(right)).toContain('translateX(100%)');
  });

  it('lets `transition` override the anchor default', async () => {
    const wrapper = await mountOpened({ position: 'bottom', transition: 'zoom-in' });
    expect(panelStyle(wrapper)).toContain('scale(0.8)');
    expect(panelStyle(wrapper)).not.toContain('translateY(100%)');
  });

  it('renders the close button only when closable', () => {
    const without = mount(SnPopup, { props: { modelValue: true } });
    expect(without.find('.sn-popup__close').exists()).toBe(false);

    const withClose = mount(SnPopup, { props: { modelValue: true, closable: true } });
    expect(withClose.find('.sn-popup__close').exists()).toBe(true);
    expect(withClose.find('.sn-popup__close').attributes('role')).toBe('button');
  });

  it('closes via the close button (update:modelValue + close)', async () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true, closable: true } });
    await wrapper.find('.sn-popup__close').trigger('tap');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('closes on scrim tap by default and emits click-modal', async () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true } });
    await wrapper.find('.sn-popup__modal').trigger('tap');
    expect(wrapper.emitted('click-modal')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('emits click-modal but stays open when closeOnClickModal is false', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, closeOnClickModal: false },
    });
    await wrapper.find('.sn-popup__modal').trigger('tap');
    expect(wrapper.emitted('click-modal')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('close')).toBeUndefined();
  });

  it('omits the scrim when modal is false', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true, modal: false } });
    expect(wrapper.find('.sn-popup__modal').exists()).toBe(false);
  });

  it('defers slot rendering until the first open when lazyRender is on', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: false, lazyRender: true, duration: false },
      slots: { default: '<text>lazy body</text>' },
    });
    expect(wrapper.text()).not.toContain('lazy body');

    await wrapper.setProps({ modelValue: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('lazy body');
  });

  it('renders the slot immediately when lazyRender is off', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, lazyRender: false },
      slots: { default: '<text>eager body</text>' },
    });
    expect(wrapper.text()).toContain('eager body');
  });

  it('finishes the leave leg when the popup closes inside the enter tick (regression)', async () => {
    vi.useFakeTimers();
    try {
      // Open then immediately close: the enter leg is still awaiting its tick,
      // so without a generation guard its timer would clobber the leave timer
      // and `after-leave` would never fire.
      const wrapper = mount(SnPopup, { props: { modelValue: false, duration: 200 } });
      await wrapper.setProps({ modelValue: true });
      await wrapper.setProps({ modelValue: false });
      vi.advanceTimersByTime(200);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('after-leave')).toHaveLength(1);
      expect(wrapper.find('.sn-popup').exists()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('adds the round class and the safe-area class', () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, round: true, safeAreaInsetBottom: true },
    });
    expect(wrapper.classes()).toContain('sn-popup--round');
    expect(wrapper.classes()).toContain('sn-popup--safe-bottom');
  });

  it('forwards zIndex, customClass, customStyle and modalStyle', () => {
    const wrapper = mount(SnPopup, {
      // `8px`, not `8rpx`: happy-dom drops CSS lengths it cannot parse.
      props: {
        modelValue: true,
        zIndex: 42,
        customClass: 'my-popup',
        customStyle: 'padding: 8px',
        modalStyle: 'opacity: 0.5',
      },
    });
    expect(wrapper.classes()).toContain('my-popup');
    expect(wrapper.attributes('style')).toContain('z-index: 42');
    expect(wrapper.find('.sn-popup__panel').attributes('style')).toContain('padding: 8px');
    expect(wrapper.find('.sn-popup__modal').attributes('style')).toContain('opacity: 0.5');
  });

  it('emits the enter legs when modelValue flips to true', async () => {
    const wrapper = mount(SnPopup, { props: { modelValue: false, duration: false } });
    await wrapper.setProps({ modelValue: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('before-enter')).toHaveLength(1);
    expect(wrapper.emitted('enter')).toHaveLength(1);
    expect(wrapper.emitted('after-enter')).toHaveLength(1);
  });

  it('emits the leave legs and unmounts after the leave duration', async () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(SnPopup, { props: { modelValue: true, duration: 300 } });
      await wrapper.setProps({ modelValue: false });
      expect(wrapper.emitted('before-leave')).toHaveLength(1);
      expect(wrapper.emitted('leave')).toHaveLength(1);
      expect(wrapper.find('.sn-popup').exists()).toBe(true);

      vi.advanceTimersByTime(300);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('after-leave')).toHaveLength(1);
      expect(wrapper.find('.sn-popup').exists()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps the node after closing when hideWhenClose is false', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, hideWhenClose: false, duration: false },
    });
    await wrapper.setProps({ modelValue: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-popup').exists()).toBe(true);
    expect(wrapper.classes()).toContain('sn-popup--hidden');
  });

  it('intercepts the touchmove gesture on the scrim when lockScroll is on', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true, lockScroll: true } });
    const event = new Event('touchmove', { cancelable: true, bubbles: true });
    wrapper.find('.sn-popup__modal').element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('lets the touchmove gesture through when lockScroll is off', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true, lockScroll: false } });
    const event = new Event('touchmove', { cancelable: true, bubbles: true });
    wrapper.find('.sn-popup__modal').element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('marks the panel as a modal dialog for assistive tech', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true } });
    const panel = wrapper.find('.sn-popup__panel');
    expect(panel.attributes('role')).toBe('dialog');
    expect(panel.attributes('aria-modal')).toBe('true');
  });

  it('clears the pending animation timer on unmount (no leak)', async () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(SnPopup, { props: { modelValue: true, duration: 300 } });
      await wrapper.setProps({ modelValue: false });
      wrapper.unmount();
      expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders an already-open popup on first paint without replaying the enter legs', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true } });
    expect(wrapper.find('.sn-popup__panel').exists()).toBe(true);
    expect(wrapper.emitted('before-enter')).toBeUndefined();
    expect(wrapper.emitted('enter')).toBeUndefined();
    expect(wrapper.emitted('after-enter')).toBeUndefined();
  });

  it('treats duration=true as the 300ms default', async () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(SnPopup, { props: { modelValue: true, duration: true } });
      await wrapper.setProps({ modelValue: false });
      vi.advanceTimersByTime(299);
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.sn-popup').exists()).toBe(true);
      vi.advanceTimersByTime(1);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('after-leave')).toHaveLength(1);
      expect(wrapper.find('.sn-popup').exists()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('uses the per-leg leave duration from a duration record', async () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(SnPopup, {
        props: { modelValue: true, duration: { enter: 100, leave: 250 } },
      });
      await wrapper.setProps({ modelValue: false });
      vi.advanceTimersByTime(100);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('after-leave')).toBeUndefined();
      vi.advanceTimersByTime(150);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('after-leave')).toHaveLength(1);
      expect(wrapper.find('.sn-popup').exists()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('re-shows cleanly after closing with hideWhenClose=false', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, hideWhenClose: false, duration: false },
      slots: { default: '<text>panel body</text>' },
    });
    await wrapper.setProps({ modelValue: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain('sn-popup--hidden');

    await wrapper.setProps({ modelValue: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).not.toContain('sn-popup--hidden');
    expect(wrapper.find('.sn-popup__panel').exists()).toBe(true);
    expect(wrapper.text()).toContain('panel body');
  });

  it('hides the scrim from assistive tech', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true } });
    expect(wrapper.find('.sn-popup__modal').attributes('aria-hidden')).toBe('true');
  });

  it('labels the close button for assistive tech', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true, closable: true } });
    expect(wrapper.find('.sn-popup__close').attributes('aria-label')).toBe('close');
  });

  it('tags the root for the docs / AI component map', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true } });
    expect(wrapper.attributes('data-snui-component')).toBe('popup');
  });

  it('maps the top and left anchors to their own slide directions', async () => {
    const top = await mountOpened({ position: 'top' });
    expect(panelStyle(top)).toContain('translateY(-100%)');

    const left = await mountOpened({ position: 'left' });
    expect(panelStyle(left)).toContain('translateX(-100%)');
  });

  it('parks the panel for every supported transition name', async () => {
    const expected: Record<string, string> = {
      fade: 'opacity: 0',
      'fade-up': 'translateY(24rpx)',
      'fade-down': 'translateY(-24rpx)',
      'fade-left': 'translateX(24rpx)',
      'fade-right': 'translateX(-24rpx)',
      'slide-up': 'translateY(100%)',
      'slide-down': 'translateY(-100%)',
      'slide-left': 'translateX(100%)',
      'slide-right': 'translateX(-100%)',
      'zoom-in': 'scale(0.8)',
      'zoom-out': 'scale(1.2)',
    };
    for (const [name, parked] of Object.entries(expected)) {
      const wrapper = await mountOpened({ transition: name });
      expect(panelStyle(wrapper)).toContain(parked);
    }
  });

  it('settles at rest once the enter leg ends', async () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(SnPopup, { props: { modelValue: false, duration: 100 } });
      await wrapper.setProps({ modelValue: true });
      // enter() paints the parked frame, then flips on the following tick —
      // the leg timer starts after that second tick.
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.classes()).toContain('sn-popup--animating');
      vi.advanceTimersByTime(100);
      await wrapper.vm.$nextTick();
      expect(wrapper.classes()).not.toContain('sn-popup--animating');
      expect(panelStyle(wrapper)).toContain('opacity: 1');
      expect(panelStyle(wrapper)).not.toContain('scale(');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('sn-popup draggable', () => {
  /** Simulate a grabber drag: start at `from`, move to `to`, release. */
  async function dragGrabber(
    wrapper: ReturnType<typeof mount>,
    from: number,
    to: number,
  ): Promise<void> {
    const grabber = wrapper.find('.sn-popup__grabber');
    await grabber.trigger('touchstart', { touches: [{ clientY: from }] });
    await grabber.trigger('touchmove', { touches: [{ clientY: to }] });
    await grabber.trigger('touchend');
  }

  it('renders the grabber on bottom sheets by default and honours draggable=false', () => {
    const bottom = mount(SnPopup, { props: { modelValue: true, position: 'bottom' } });
    expect(bottom.find('.sn-popup__grabber').exists()).toBe(true);
    expect(bottom.find('.sn-popup__grabber-bar').attributes('aria-hidden')).toBe('true');

    const off = mount(SnPopup, {
      props: { modelValue: true, position: 'bottom', draggable: false },
    });
    expect(off.find('.sn-popup__grabber').exists()).toBe(false);

    const center = mount(SnPopup, { props: { modelValue: true } });
    expect(center.find('.sn-popup__grabber').exists()).toBe(false);
  });

  it('closes when the drag passes the distance threshold', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, position: 'bottom', draggable: true, duration: false },
    });
    await dragGrabber(wrapper, 100, 200);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('after-leave')).toHaveLength(1);
    expect(wrapper.find('.sn-popup').exists()).toBe(false);
  });

  it('closes on a fast fling even under the distance threshold', async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(0);
      const wrapper = mount(SnPopup, {
        props: { modelValue: true, position: 'bottom', draggable: true, duration: false },
      });
      const grabber = wrapper.find('.sn-popup__grabber');
      await grabber.trigger('touchstart', { touches: [{ clientY: 0 }] });
      vi.setSystemTime(50);
      // 60px over 50ms = 1.2px/ms — a fling, though under the 80px distance.
      await grabber.trigger('touchmove', { touches: [{ clientY: 60 }] });
      await grabber.trigger('touchend');
      expect(wrapper.emitted('close')).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('springs back without closing under the threshold', async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(0);
      const wrapper = mount(SnPopup, {
        props: { modelValue: true, position: 'bottom', draggable: true, duration: false },
      });
      const grabber = wrapper.find('.sn-popup__grabber');
      await grabber.trigger('touchstart', { touches: [{ clientY: 100 }] });
      // A slow 40px drag (300ms) — under both the distance and the fling.
      vi.setSystemTime(300);
      await grabber.trigger('touchmove', { touches: [{ clientY: 140 }] });
      await grabber.trigger('touchend');
      expect(wrapper.emitted('close')).toBeUndefined();
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      expect(wrapper.find('.sn-popup').exists()).toBe(true);
      // The settle leg finished instantly (duration=false) — back at rest.
      expect(wrapper.find('.sn-popup__panel').attributes('style') ?? '').not.toContain(
        'translateY',
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps the dragged offset while the finger is down', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, position: 'bottom', draggable: true, duration: false },
    });
    const grabber = wrapper.find('.sn-popup__grabber');
    await grabber.trigger('touchstart', { touches: [{ clientY: 0 }] });
    await grabber.trigger('touchmove', { touches: [{ clientY: 120 }] });
    expect(wrapper.find('.sn-popup__panel').attributes('style')).toContain('translateY(120px)');
    await grabber.trigger('touchend');
  });

  it('does not run a second leave leg when the controlled sync arrives (regression)', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, position: 'bottom', draggable: true, duration: false },
    });
    await dragGrabber(wrapper, 0, 200);
    expect(wrapper.emitted('before-leave')).toHaveLength(1);
    // The parent applies the close after the drag already finished the leg.
    await wrapper.setProps({ modelValue: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('before-leave')).toHaveLength(1);
    expect(wrapper.emitted('after-leave')).toHaveLength(1);
  });

  it('unmounts after the drag-close leg when animated', async () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(SnPopup, {
        props: { modelValue: true, position: 'bottom', draggable: true, duration: 200 },
      });
      await dragGrabber(wrapper, 0, 200);
      expect(wrapper.find('.sn-popup').exists()).toBe(true);
      vi.advanceTimersByTime(200);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('after-leave')).toHaveLength(1);
      expect(wrapper.find('.sn-popup').exists()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});

/**
 * The popup root must stay a fullscreen fixed layer. happy-dom discards
 * stylesheets, so the geometry contract is pinned on the source text (same
 * pattern as sn-drop-menu's scrim invariant): uni-app x App cannot rely on
 * four-edge inset stretching, so the rule must also carry an explicit
 * width/height — a page-level pinning class overriding `position` to
 * `absolute` would otherwise anchor the layer to the direct parent and clip
 * it inside the host's box (regression: dialog / action-sheet / popup demos
 * rendered the panel inline in the demo card on uni-app x App).
 */
describe('sn-popup stylesheet (fullscreen invariant)', () => {
  const readStyleRule = (selector: string): string => {
    const source = readFileSync(resolve(import.meta.dirname, 'sn-popup.vue'), 'utf8');
    const start = source.indexOf(`${selector} {`);
    expect(start).toBeGreaterThan(-1);
    return source.slice(start, source.indexOf('}', start));
  };

  it('pins the root as a fixed fullscreen layer with explicit size (source invariant)', () => {
    const body = readStyleRule('.sn-popup');
    expect(body).toContain('position: fixed;');
    expect(body).toContain('top: 0;');
    expect(body).toContain('width: 100%;');
    expect(body).toContain('height: 100%;');
  });

  it('sizes the scrim to its fullscreen root (source invariant)', () => {
    const body = readStyleRule('.sn-popup__modal');
    expect(body).toContain('position: absolute;');
    expect(body).toContain('width: 100%;');
    expect(body).toContain('height: 100%;');
  });
});
