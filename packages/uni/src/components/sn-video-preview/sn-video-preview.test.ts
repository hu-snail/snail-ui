/**
 * sn-video-preview unit tests — uni-end full-screen video layer.
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `open(options)` loads the source / poster / title and shows the layer
 *   - `close()` unmounts the `<video>` (so the platform stops decoding)
 *   - the reference `on-open` / `on-close` callback props fire
 *   - `full-screen` / `close-position` / `selector` modifiers
 *   - the close button and the modal-dialog contract
 *
 * No `rpx` numbers in assertions: happy-dom drops CSS lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import SnVideoPreview from './sn-video-preview.vue';
import SnPopup from '../sn-popup/sn-popup.vue';

const video = {
  src: 'https://cdn.example.com/clip.mp4',
  poster: 'https://cdn.example.com/clip.jpg',
  title: '产品介绍',
};

/** Exposed surface this test drives. */
interface VideoApi {
  open: (options: { src: string; poster?: string; title?: string; autoplay?: boolean }) => void;
  close: () => void;
}

/** Mount the layer and hand back the wrapper plus its exposed API. */
async function mountVideo(props: Record<string, unknown> = {}) {
  const wrapper = mount(
    defineComponent({
      setup() {
        return () => h(SnVideoPreview, props);
      },
    }),
  );
  await nextTick();
  const preview = wrapper.findComponent(SnVideoPreview);
  return { wrapper, preview, api: preview.vm as unknown as VideoApi };
}

describe('sn-video-preview', () => {
  it('should stay closed until open() is called', async () => {
    const { preview } = await mountVideo();
    expect(preview.findComponent(SnPopup).props('modelValue')).toBe(false);
    expect(preview.find('video').exists()).toBe(false);
  });

  it('should load the video and show the layer on open()', async () => {
    const { preview, api } = await mountVideo();
    api.open(video);
    await nextTick();
    expect(preview.findComponent(SnPopup).props('modelValue')).toBe(true);
    const element = preview.find('video');
    expect(element.exists()).toBe(true);
    expect(element.attributes('src')).toBe(video.src);
    expect(element.attributes('poster')).toBe(video.poster);
  });

  it('should render the title in the top bar', async () => {
    const { preview, api } = await mountVideo();
    api.open(video);
    await nextTick();
    expect(preview.find('.sn-video-preview__title').text()).toBe('产品介绍');
  });

  it('should omit the title node when no title was given', async () => {
    const { preview, api } = await mountVideo();
    api.open({ src: video.src });
    await nextTick();
    expect(preview.find('.sn-video-preview__title').exists()).toBe(false);
  });

  it('should forward autoplay to the native video element', async () => {
    const { preview, api } = await mountVideo();
    api.open({ ...video, autoplay: true });
    await nextTick();
    // A boolean `true` attribute renders as an empty string in the DOM.
    expect(preview.find('video').attributes('autoplay')).toBe('');
  });

  it('should unmount the video source on close so playback stops', async () => {
    const { preview, api } = await mountVideo();
    api.open(video);
    await nextTick();
    api.close();
    await nextTick();
    expect(preview.find('video').exists()).toBe(false);
  });

  it('should emit open and close', async () => {
    const { preview, api } = await mountVideo();
    api.open(video);
    await nextTick();
    api.close();
    await nextTick();
    expect(preview.emitted('open')).toHaveLength(1);
    expect(preview.emitted('close')).toHaveLength(1);
  });

  it('should not emit close when already closed', async () => {
    const { preview, api } = await mountVideo();
    api.close();
    await nextTick();
    expect(preview.emitted('close')).toBeUndefined();
  });

  it('should call the reference on-open / on-close callback props', async () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const { api } = await mountVideo({ onOpen, onClose });
    api.open(video);
    await nextTick();
    api.close();
    await nextTick();
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should add the full-screen modifier', async () => {
    const { preview, api } = await mountVideo({ fullScreen: true });
    api.open(video);
    await nextTick();
    expect(preview.find('.sn-video-preview').classes()).toContain('sn-video-preview--full-screen');
  });

  it('should place the close button per closePosition', async () => {
    const left = await mountVideo();
    left.api.open(video);
    await nextTick();
    expect(left.preview.find('.sn-video-preview__close').classes()).toContain(
      'sn-video-preview__close--left-top',
    );

    const right = await mountVideo({ closePosition: 'right-top' });
    right.api.open(video);
    await nextTick();
    expect(right.preview.find('.sn-video-preview__close').classes()).toContain(
      'sn-video-preview__close--right-top',
    );
  });

  it('should close when the close button is tapped', async () => {
    const { preview, api } = await mountVideo();
    api.open(video);
    await nextTick();
    await preview.find('.sn-video-preview__close').trigger('tap');
    expect(preview.emitted('close')).toHaveLength(1);
  });

  it('should expose the selector as a data attribute', async () => {
    const { preview, api } = await mountVideo({ selector: 'clip-a' });
    api.open(video);
    await nextTick();
    expect(preview.find('.sn-video-preview').attributes('data-selector')).toBe('clip-a');
  });

  it('should forward customClass and customStyle to the layer root', async () => {
    const { preview, api } = await mountVideo({
      customClass: 'my-video',
      customStyle: 'padding: 8px',
    });
    api.open(video);
    await nextTick();
    const root = preview.find('.sn-video-preview');
    expect(root.classes()).toContain('my-video');
    expect(root.attributes('style')).toContain('padding: 8px');
  });

  it('should expose the layer as a modal dialog', async () => {
    const { preview, api } = await mountVideo();
    api.open(video);
    await nextTick();
    const root = preview.find('.sn-video-preview');
    expect(root.attributes('role')).toBe('dialog');
    expect(root.attributes('aria-modal')).toBe('true');
    expect(root.attributes('aria-label')).toBe('video preview');
  });
});

describe('sn-video-preview popup visibility bridge', () => {
  it('should keep the layer open when the popup reports visible', async () => {
    const { preview } = await mountVideo();
    const popup = preview.findComponent(SnPopup);
    popup.vm.$emit('update:modelValue', true);
    await nextTick();
    expect(preview.find('video').exists()).toBe(false);
    expect(preview.emitted('close')).toBeUndefined();
  });

  it('should close when the popup reports hidden', async () => {
    const { preview, api } = await mountVideo();
    api.open(video);
    await nextTick();
    const popup = preview.findComponent(SnPopup);
    popup.vm.$emit('update:modelValue', false);
    await nextTick();
    expect(preview.find('video').exists()).toBe(false);
    expect(preview.emitted('close')).toHaveLength(1);
  });
});
