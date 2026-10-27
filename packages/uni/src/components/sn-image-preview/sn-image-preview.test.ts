/**
 * sn-image-preview unit tests — uni-end full-screen image viewer.
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - the imperative API (`open` / `close` / `setActive`) drives visibility
 *   - `open(options)` overrides `images` / `startPosition` for the session
 *   - the counter text, `showIndex`, `closeable`, `closeIconPosition`
 *   - tap-to-close (`closeOnClick`), the `long-press` payload
 *   - `selector` hit zones are created from a guarded `uni.createSelectorQuery`
 *     and are absent when the host cannot query layout
 *
 * No `rpx` numbers in assertions: happy-dom drops CSS lengths it cannot parse.
 */

import { afterEach, describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import SnImagePreview from './sn-image-preview.vue';
import {
  clampZoom,
  dismissOpacity,
  lockAxis,
  panLimit,
  pinchScale,
  rubberBand,
  shouldDismiss,
  shouldPage,
  touchDistance,
  touchMidpoint,
} from './sn-image-preview-gestures';
import SnPopup from '../sn-popup/sn-popup.vue';

const images = ['https://x/1.png', 'https://x/2.png', 'https://x/3.png'];

/**
 * Simulate a one-finger tap through the touch pipeline (start → end at the
 * same point). The viewer closes single taps on a 300 ms timer, so pair this
 * with fake timers.
 */
function tapAt(
  stage: ReturnType<typeof mount> extends never
    ? never
    : { trigger: (e: string, o?: unknown) => Promise<void> },
  x = 100,
  y = 100,
): Promise<void> {
  const touches = [{ clientX: x, clientY: y }];
  return stage
    .trigger('touchstart', { touches })
    .then(() => stage.trigger('touchend', { touches: [] }));
}

/** Exposed surface this test drives. */
interface PreviewApi {
  open: (options?: { images?: string[]; startPosition?: number }) => void;
  close: () => void;
  setActive: (index: number) => void;
}

/** Mount the preview and hand back both the wrapper and its exposed API. */
async function mountPreview(props: Record<string, unknown> = {}) {
  const wrapper = mount(
    defineComponent({
      setup() {
        return () => h(SnImagePreview, { images, ...props });
      },
    }),
  );
  await nextTick();
  const preview = wrapper.findComponent(SnImagePreview);
  return { wrapper, preview, api: preview.vm as unknown as PreviewApi };
}

/** Install a `uni.createSelectorQuery` stub returning fixed boxes. */
function installUniQuery(rects: Array<Record<string, number>>): () => void {
  const host = globalThis as { uni?: Record<string, unknown> };
  const previous = host.uni;
  host.uni = {
    createSelectorQuery: () => ({
      in: () => ({
        selectAll: () => ({
          boundingClientRect: (callback: (value: unknown) => void) => ({
            exec: () => callback(rects),
          }),
        }),
      }),
    }),
  };
  return () => {
    if (previous === undefined) delete host.uni;
    else host.uni = previous;
  };
}

afterEach(() => {
  const host = globalThis as { uni?: unknown };
  delete host.uni;
});

describe('sn-image-preview', () => {
  it('should stay closed until open() is called', async () => {
    const { preview } = await mountPreview();
    expect(preview.findComponent(SnPopup).props('modelValue')).toBe(false);
    expect(preview.find('.sn-image-preview__index').exists()).toBe(false);
  });

  it('should show the viewer and emit open when open() runs', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    expect(preview.findComponent(SnPopup).props('modelValue')).toBe(true);
    expect(preview.emitted('open')).toHaveLength(1);
  });

  it('should render one cell per image inside the track', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    expect(preview.findAll('.sn-image-preview__cell')).toHaveLength(3);
  });

  it('should render the counter as n / total', async () => {
    const { preview, api } = await mountPreview();
    api.open({ startPosition: 1 });
    await nextTick();
    expect(preview.find('.sn-image-preview__index-text').text()).toBe('2 / 3');
  });

  it('should hide the counter when showIndex is false', async () => {
    const { preview, api } = await mountPreview({ showIndex: false });
    api.open();
    await nextTick();
    expect(preview.find('.sn-image-preview__index').exists()).toBe(false);
  });

  it('should close and emit close', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    api.close();
    await nextTick();
    expect(preview.emitted('close')).toHaveLength(1);
  });

  it('should not emit close when already closed', async () => {
    const { preview, api } = await mountPreview();
    api.close();
    await nextTick();
    expect(preview.emitted('close')).toBeUndefined();
  });

  it('should switch image and emit change from setActive', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    api.setActive(2);
    await nextTick();
    expect(preview.emitted('change')).toHaveLength(1);
    expect(preview.emitted('change')?.[0]?.[0]).toEqual({ index: 2 });
    expect(preview.find('.sn-image-preview__index-text').text()).toBe('3 / 3');
  });

  it('should clamp setActive to the available range', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    api.setActive(99);
    await nextTick();
    expect(preview.emitted('change')?.[0]?.[0]).toEqual({ index: 2 });

    api.setActive(-5);
    await nextTick();
    expect(preview.emitted('change')?.[1]?.[0]).toEqual({ index: 0 });
  });

  it('should accept a per-open image list that overrides the prop', async () => {
    const { preview, api } = await mountPreview();
    api.open({ images: ['https://x/only.png'] });
    await nextTick();
    expect(preview.findAll('.sn-image-preview__cell')).toHaveLength(1);
    expect(preview.find('.sn-image-preview__index-text').text()).toBe('1 / 1');
  });

  it('should close on image tap when closeOnClick is on', async () => {
    vi.useFakeTimers();
    try {
      const { preview, api } = await mountPreview();
      api.open();
      await nextTick();
      await tapAt(preview.find('.sn-image-preview'));
      await vi.advanceTimersByTimeAsync(350);
      expect(preview.emitted('close')).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('should not close on image tap when closeOnClick is off', async () => {
    vi.useFakeTimers();
    try {
      const { preview, api } = await mountPreview({ closeOnClick: false });
      api.open();
      await nextTick();
      await tapAt(preview.find('.sn-image-preview'));
      await vi.advanceTimersByTimeAsync(350);
      expect(preview.emitted('close')).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('should emit long-press with the current image', async () => {
    const { preview, api } = await mountPreview();
    api.open({ startPosition: 1 });
    await nextTick();
    await preview.find('.sn-image-preview').trigger('longpress');
    expect(preview.emitted('long-press')?.[0]?.[0]).toEqual({ image: images[1] });
  });

  it('should render the close button in the requested corner', async () => {
    const { preview, api } = await mountPreview({ closeIconPosition: 'top-left' });
    api.open();
    await nextTick();
    const button = preview.find('.sn-image-preview__close');
    expect(button.exists()).toBe(true);
    expect(button.classes()).toContain('sn-image-preview__close--top-left');
    expect(button.attributes('role')).toBe('button');
  });

  it('should hide the close button when closeable is false', async () => {
    const { preview, api } = await mountPreview({ closeable: false });
    api.open();
    await nextTick();
    expect(preview.find('.sn-image-preview__close').exists()).toBe(false);
  });

  it('should close when the close button is tapped', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    await preview.find('.sn-image-preview__close').trigger('tap');
    expect(preview.emitted('close')).toHaveLength(1);
  });

  it('should render the footer slot with the current index', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              SnImagePreview,
              { images },
              {
                default: ({ current }: { current: number }) => h('text', `caption ${current}`),
              },
            );
        },
      }),
    );
    const preview = wrapper.findComponent(SnImagePreview);
    (preview.vm as unknown as PreviewApi).open();
    await nextTick();
    expect(preview.find('.sn-image-preview__footer').text()).toBe('caption 0');
  });

  it('should render the indicator slot instead of the built-in counter', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              SnImagePreview,
              { images },
              {
                indicator: ({ current, total }: { current: number; total: number }) =>
                  h('text', `slot ${current}/${total}`),
              },
            );
        },
      }),
    );
    const preview = wrapper.findComponent(SnImagePreview);
    (preview.vm as unknown as PreviewApi).open();
    await nextTick();
    expect(preview.find('.sn-image-preview__index').text()).toBe('slot 0/3');
    expect(preview.find('.sn-image-preview__index-text').exists()).toBe(false);
  });

  it('should create selector hit zones from uni.createSelectorQuery', async () => {
    const restore = installUniQuery([
      { left: 10, top: 20, width: 100, height: 100 },
      { left: 120, top: 20, width: 100, height: 100 },
    ]);
    try {
      const { preview, api } = await mountPreview({ selector: '.thumb' });
      // The zones overlay the page thumbnails, so they render while closed.
      api.open();
      await nextTick();
      api.close();
      await nextTick();
      const zones = preview.findAll('.sn-image-preview__zone');
      expect(zones).toHaveLength(2);
      expect(zones[0]?.attributes('style')).toContain('left: 10px');
    } finally {
      restore();
    }
  });

  it('should not create hit zones when the host cannot query layout', async () => {
    const { preview, api } = await mountPreview({ selector: '.thumb' });
    api.open();
    await nextTick();
    expect(preview.findAll('.sn-image-preview__zone')).toHaveLength(0);
  });

  it('should open at the tapped hit zone index', async () => {
    const restore = installUniQuery([
      { left: 0, top: 0, width: 50, height: 50 },
      { left: 60, top: 0, width: 50, height: 50 },
    ]);
    try {
      const { preview, api } = await mountPreview({ selector: '.thumb' });
      api.open();
      await nextTick();
      api.close();
      await nextTick();
      await preview.findAll('.sn-image-preview__zone')[1]?.trigger('tap');
      await nextTick();
      expect(preview.find('.sn-image-preview__index-text').text()).toBe('2 / 3');
    } finally {
      restore();
    }
  });

  it('should forward customClass and customStyle to the viewer root', async () => {
    const { preview, api } = await mountPreview({
      customClass: 'my-preview',
      customStyle: 'padding: 8px',
    });
    api.open();
    await nextTick();
    const root = preview.find('.sn-image-preview');
    expect(root.classes()).toContain('my-preview');
    expect(root.attributes('style')).toContain('padding: 8px');
  });

  it('should render the default slot when the image list is empty', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(SnImagePreview, { images: [] }, { default: () => h('text', 'empty viewer') });
        },
      }),
    );
    const preview = wrapper.findComponent(SnImagePreview);
    (preview.vm as unknown as PreviewApi).open();
    await nextTick();
    expect(preview.find('.sn-image-preview').text()).toContain('empty viewer');
  });

  it('should expose the viewer as a modal dialog', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    const root = preview.find('.sn-image-preview');
    expect(root.attributes('role')).toBe('dialog');
    expect(root.attributes('aria-modal')).toBe('true');
  });

  it('should track the active image and emit change via setActive', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    api.setActive(2);
    await nextTick();
    expect(preview.emitted('change')?.[0]?.[0]).toEqual({ index: 2 });
    expect(preview.find('.sn-image-preview__index-text').text()).toBe('3 / 3');
  });

  it('should not emit change when setActive lands on the current index', async () => {
    const { preview, api } = await mountPreview({ startPosition: 1 });
    api.open();
    await nextTick();
    api.setActive(1);
    await nextTick();
    expect(preview.emitted('change')).toBeUndefined();
  });

  it('should open and close through the popup visibility update', async () => {
    const { preview } = await mountPreview();
    const popup = preview.findComponent(SnPopup);
    popup.vm.$emit('update:modelValue', true);
    await nextTick();
    expect(preview.emitted('open')).toHaveLength(1);
    expect(popup.props('modelValue')).toBe(true);
    popup.vm.$emit('update:modelValue', false);
    await nextTick();
    expect(preview.emitted('close')).toHaveLength(1);
    expect(popup.props('modelValue')).toBe(false);
  });

  it('should close when the popup modal backdrop is tapped', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    preview.findComponent(SnPopup).vm.$emit('click-modal');
    await nextTick();
    expect(preview.emitted('close')).toHaveLength(1);
  });

  it('should keep the viewer open on a modal backdrop tap when closeOnClick is off', async () => {
    const { preview, api } = await mountPreview({ closeOnClick: false });
    api.open();
    await nextTick();
    preview.findComponent(SnPopup).vm.$emit('click-modal');
    await nextTick();
    expect(preview.emitted('close')).toBeUndefined();
  });

  it('should stay usable when the layout query throws mid-measure', async () => {
    const host = globalThis as { uni?: Record<string, unknown> };
    host.uni = {
      createSelectorQuery: () => ({
        in: () => {
          throw new Error('renderer destroyed');
        },
      }),
    };
    try {
      const { preview, api } = await mountPreview({ selector: '.thumb' });
      api.open();
      await nextTick();
      // The failure degrades to zero zones, never an exception.
      expect(preview.emitted('open')).toHaveLength(1);
      expect(preview.findAll('.sn-image-preview__zone')).toHaveLength(0);
    } finally {
      delete host.uni;
    }
  });

  it('should tear down cleanly when unmounted with measured hit zones', async () => {
    const restore = installUniQuery([{ left: 0, top: 0, width: 50, height: 50 }]);
    try {
      const { wrapper, preview, api } = await mountPreview({ selector: '.thumb' });
      api.open();
      await nextTick();
      api.close();
      await nextTick();
      expect(preview.findAll('.sn-image-preview__zone')).toHaveLength(1);
      expect(() => wrapper.unmount()).not.toThrow();
    } finally {
      restore();
    }
  });
});

describe('sn-image-preview gesture math', () => {
  it('locks the dominant axis and stays unlocked under the threshold', () => {
    expect(lockAxis(3, 2, 10)).toBeNull();
    expect(lockAxis(20, 2, 10)).toBe('x');
    expect(lockAxis(2, 20, 10)).toBe('y');
    expect(lockAxis(12, 12, 10)).toBe('x'); // horizontal wins ties
  });

  it('passes in-range drags 1:1 and resists beyond the limit', () => {
    expect(rubberBand(40, 50, 0.15)).toBe(40);
    expect(rubberBand(60, 50, 0.15)).toBeCloseTo(51.5);
    expect(rubberBand(-60, 0, 0.15)).toBeCloseTo(-9);
  });

  it('derives pinch scale and clamps zoom into range', () => {
    expect(pinchScale(100, 200)).toBe(2);
    expect(pinchScale(0, 200)).toBe(1);
    expect(clampZoom(0.5, 1, 4)).toBe(1);
    expect(clampZoom(6, 1, 4)).toBe(4);
  });

  it('bounds zoomed panning to the scaled overflow', () => {
    expect(panLimit(375, 1)).toBe(0);
    expect(panLimit(375, 3)).toBe(375);
  });

  it('fades the curtain linearly and decides dismissal', () => {
    expect(dismissOpacity(0, 667)).toBe(1);
    expect(dismissOpacity(333.5, 667)).toBeCloseTo(0.5);
    expect(dismissOpacity(700, 667)).toBe(0);
    expect(shouldDismiss(200, 0, 667)).toBe(true); // > 25% height
    expect(shouldDismiss(100, 0.8, 667)).toBe(true); // flick
    expect(shouldDismiss(100, 0.2, 667)).toBe(false);
  });

  it('pages on distance or flick velocity', () => {
    expect(shouldPage(300, 0, 375)).toBe(true); // > 35% width
    expect(shouldPage(100, 0.8, 375)).toBe(true); // flick
    expect(shouldPage(100, 0.2, 375)).toBe(false);
  });

  it('measures two-finger distance and midpoint', () => {
    const touches = [
      { clientX: 100, clientY: 100 },
      { clientX: 200, clientY: 200 },
    ];
    expect(touchDistance(touches)).toBeCloseTo(141.42);
    expect(touchMidpoint(touches)).toEqual({ x: 150, y: 150 });
    expect(touchDistance(touches.slice(0, 1))).toBe(0);
    expect(touchMidpoint(touches.slice(0, 1))).toBeNull();
  });
});

describe('sn-image-preview gestures (component)', () => {
  /** Two-finger pinch helper: start wide, move closer/farther. */
  async function pinch(
    stage: { trigger: (e: string, o?: unknown) => Promise<void> },
    startDistance: number,
    endDistance: number,
  ): Promise<void> {
    const mid = 180;
    const half = (d: number) => d / 2;
    await stage.trigger('touchstart', {
      touches: [
        { clientX: mid - half(startDistance), clientY: mid },
        { clientX: mid + half(startDistance), clientY: mid },
      ],
    });
    await stage.trigger('touchmove', {
      touches: [
        { clientX: mid - half(endDistance), clientY: mid },
        { clientX: mid + half(endDistance), clientY: mid },
      ],
    });
    await stage.trigger('touchend', { touches: [] });
  }

  it('zooms with a pinch and reports the scale on the current image', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    const stage = preview.find('.sn-image-preview');
    await pinch(stage, 100, 300);
    await nextTick();
    expect(preview.find('.sn-image-preview__image').attributes('style') ?? '').toContain(
      'scale(3)',
    );
  });

  it('snaps the zoom back when pinching below 1x', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    const stage = preview.find('.sn-image-preview');
    await pinch(stage, 200, 80);
    await nextTick();
    expect(preview.find('.sn-image-preview__image').attributes('style') ?? '').not.toContain(
      'scale(',
    );
  });

  it('pages on a horizontal flick and updates the counter', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    const stage = preview.find('.sn-image-preview');
    await stage.trigger('touchstart', { touches: [{ clientX: 300, clientY: 300 }] });
    await stage.trigger('touchmove', { touches: [{ clientX: 100, clientY: 300 }] });
    await stage.trigger('touchend', { touches: [] });
    await nextTick();
    expect(preview.emitted('change')?.[0]?.[0]).toEqual({ index: 1 });
    expect(preview.find('.sn-image-preview__index-text').text()).toBe('2 / 3');
  });

  it('dismisses on a downward drag past the threshold and fades the curtain', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    const stage = preview.find('.sn-image-preview');
    await stage.trigger('touchstart', { touches: [{ clientX: 180, clientY: 200 }] });
    await stage.trigger('touchmove', { touches: [{ clientX: 180, clientY: 420 }] });
    await nextTick();
    const curtain = preview.find('.sn-image-preview__curtain');
    expect(curtain.attributes('style') ?? '').toContain('opacity: 0.670'); // 1 - 220/667
    await stage.trigger('touchend', { touches: [] });
    expect(preview.emitted('close')).toHaveLength(1); // 220px > 25% of 667
  });
});
