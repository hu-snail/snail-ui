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

import { afterEach, describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import SnImagePreview from './sn-image-preview.vue';
import SnPopup from '../sn-popup/sn-popup.vue';
import SnSwiper from '../sn-swiper/sn-swiper.vue';

const images = ['https://x/1.png', 'https://x/2.png', 'https://x/3.png'];

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

  it('should render one slide per image inside the swiper', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    expect(preview.findAll('.sn-swiper__item')).toHaveLength(3);
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
    expect(preview.findAll('.sn-swiper__item')).toHaveLength(1);
    expect(preview.find('.sn-image-preview__index-text').text()).toBe('1 / 1');
  });

  it('should close on image tap when closeOnClick is on', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    await preview.find('.sn-image-preview__stage').trigger('tap');
    expect(preview.emitted('close')).toHaveLength(1);
  });

  it('should not close on image tap when closeOnClick is off', async () => {
    const { preview, api } = await mountPreview({ closeOnClick: false });
    api.open();
    await nextTick();
    await preview.find('.sn-image-preview__stage').trigger('tap');
    expect(preview.emitted('close')).toBeUndefined();
  });

  it('should emit long-press with the current image', async () => {
    const { preview, api } = await mountPreview();
    api.open({ startPosition: 1 });
    await nextTick();
    await preview.find('.sn-image-preview__stage').trigger('longpress');
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
    expect(preview.find('.sn-image-preview__stage').text()).toContain('empty viewer');
  });

  it('should expose the viewer as a modal dialog', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    const root = preview.find('.sn-image-preview');
    expect(root.attributes('role')).toBe('dialog');
    expect(root.attributes('aria-modal')).toBe('true');
  });

  it('should follow the swiper position and emit change when slides move', async () => {
    const { preview, api } = await mountPreview();
    api.open();
    await nextTick();
    preview.findComponent(SnSwiper).vm.$emit('change', { current: 2, source: 'touch' });
    await nextTick();
    expect(preview.emitted('change')?.[0]?.[0]).toEqual({ index: 2 });
    expect(preview.find('.sn-image-preview__index-text').text()).toBe('3 / 3');
  });

  it('should not emit change when the swiper reports the current position', async () => {
    const { preview, api } = await mountPreview({ startPosition: 1 });
    api.open();
    await nextTick();
    preview.findComponent(SnSwiper).vm.$emit('change', { current: 1, source: 'touch' });
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
