/**
 * sn-img unit tests — uni-end image (wd-img parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `src` / `mode` / `lazyLoad` land on the inner `<image>`
 *   - `width` / `height` / `radius` become inline lengths; `round` adds the class
 *   - `load` / `error` emit and swap the loading / error overlays
 *   - `showLoading: false` / `showError: false` suppress the overlays
 *   - a tap always emits `click`; `enablePreview` opens `uni.previewImage`
 *
 * Untestable in happy-dom: the numeric `width` / `height` / `radius` → rpx
 * conversion — happy-dom's CSS parser silently drops rpx declarations from the
 * style attribute (custom properties survive; regular lengths don't), so the
 * computed inline length never reaches the DOM. The same limitation applies to
 * real image decoding / native long-press menus.
 */

import { describe, it, expect, afterAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mount } from '@vue/test-utils';
import SnImg from './sn-img.vue';

/** Minimal shape of the `uni` namespace the preview path touches. */
interface PreviewHost {
  uni?: { previewImage?: (options: { urls: string[]; current: string }) => void };
}

const host = globalThis as PreviewHost;
const originalUni = host.uni;

afterAll(() => {
  if (originalUni === undefined) delete host.uni;
  else host.uni = originalUni;
});

describe('sn-img', () => {
  it('renders the image with src and mode', () => {
    const wrapper = mount(SnImg, { props: { src: 'https://x/y.png', mode: 'aspectFill' } });
    const image = wrapper.find('.sn-img__image');
    expect(image.attributes('src')).toBe('https://x/y.png');
    expect(image.attributes('mode')).toBe('aspectFill');
  });

  it('defaults to scaleToFill and no lazy-load', () => {
    const wrapper = mount(SnImg, { props: { src: 'a.png' } });
    const image = wrapper.find('.sn-img__image');
    expect(image.attributes('mode')).toBe('scaleToFill');
    expect(image.attributes('lazy-load')).toBe('false');
  });

  it('passes lazyLoad and showMenuByLongpress through', () => {
    const wrapper = mount(SnImg, {
      props: { src: 'a.png', lazyLoad: true, showMenuByLongpress: true },
    });
    const image = wrapper.find('.sn-img__image');
    expect(image.attributes('lazy-load')).toBe('true');
    expect(image.attributes('show-menu-by-longpress')).toBe('true');
  });

  it('renders no image element without src', () => {
    const wrapper = mount(SnImg, { props: { src: '' } });
    expect(wrapper.find('.sn-img__image').exists()).toBe(false);
  });

  it('applies width / height / radius as inline lengths', () => {
    const wrapper = mount(SnImg, {
      // `px` strings: happy-dom drops CSS lengths it cannot parse (rpx).
      props: { src: 'a.png', width: '100px', height: '80px', radius: '8px' },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('width: 100px');
    expect(style).toContain('height: 80px');
    expect(style).toContain('border-radius: 8px');
  });

  it('adds the round class when round is set', () => {
    const plain = mount(SnImg, { props: { src: 'a.png' } });
    expect(plain.classes()).not.toContain('sn-img--round');

    const round = mount(SnImg, { props: { src: 'a.png', round: true } });
    expect(round.classes()).toContain('sn-img--round');
  });

  it('shows the loading overlay until the image loads', async () => {
    const wrapper = mount(SnImg, { props: { src: 'a.png' } });
    expect(wrapper.find('.sn-img__loading').exists()).toBe(true);

    await wrapper.find('.sn-img__image').trigger('load');
    expect(wrapper.find('.sn-img__loading').exists()).toBe(false);
    expect(wrapper.emitted('load')).toHaveLength(1);
    expect(wrapper.classes()).toContain('sn-img--loaded');
  });

  it('shows the error overlay after a load failure', async () => {
    const wrapper = mount(SnImg, { props: { src: 'a.png' } });
    await wrapper.find('.sn-img__image').trigger('error');
    expect(wrapper.find('.sn-img__error').exists()).toBe(true);
    expect(wrapper.find('.sn-img__error-text').text()).toBe('加载失败');
    expect(wrapper.emitted('error')).toHaveLength(1);
    expect(wrapper.classes()).toContain('sn-img--error');
    expect(wrapper.find('.sn-img__image').classes()).toContain('sn-img__image--hidden');
  });

  it('suppresses the overlays when showLoading / showError are false', async () => {
    const wrapper = mount(SnImg, {
      props: { src: 'a.png', showLoading: false, showError: false },
    });
    expect(wrapper.find('.sn-img__loading').exists()).toBe(false);
    await wrapper.find('.sn-img__image').trigger('error');
    expect(wrapper.find('.sn-img__error').exists()).toBe(false);
  });

  it('renders the custom loading / error slots', async () => {
    const wrapper = mount(SnImg, {
      props: { src: 'a.png' },
      slots: { loading: '<text>loading…</text>', error: '<text>broken</text>' },
    });
    expect(wrapper.text()).toContain('loading…');
    await wrapper.find('.sn-img__image').trigger('error');
    expect(wrapper.text()).toContain('broken');
  });

  it('emits click on tap', async () => {
    const wrapper = mount(SnImg, { props: { src: 'a.png' } });
    await wrapper.trigger('tap');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('forwards customClass / customStyle / customImage', () => {
    const wrapper = mount(SnImg, {
      props: {
        src: 'a.png',
        customClass: 'my-img',
        customStyle: 'margin: 8px',
        customImage: 'my-image',
      },
    });
    expect(wrapper.classes()).toContain('my-img');
    expect(wrapper.attributes('style')).toContain('margin: 8px');
    expect(wrapper.find('.sn-img__image').classes()).toContain('my-image');
  });

  describe('enablePreview', () => {
    it('opens uni.previewImage with the src when tapped', async () => {
      const previewImage = vi.fn();
      host.uni = { previewImage };
      const wrapper = mount(SnImg, { props: { src: 'https://x/a.png', enablePreview: true } });
      await wrapper.trigger('tap');
      expect(previewImage).toHaveBeenCalledTimes(1);
      expect(previewImage).toHaveBeenCalledWith({
        urls: ['https://x/a.png'],
        current: 'https://x/a.png',
      });
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('previews previewSrc instead of src when given', async () => {
      const previewImage = vi.fn();
      host.uni = { previewImage };
      const wrapper = mount(SnImg, {
        props: {
          src: 'https://x/thumb.png',
          previewSrc: 'https://x/full.png',
          enablePreview: true,
        },
      });
      await wrapper.trigger('tap');
      expect(previewImage).toHaveBeenCalledWith({
        urls: ['https://x/full.png'],
        current: 'https://x/full.png',
      });
    });

    it('does not open the preview when enablePreview is off', async () => {
      const previewImage = vi.fn();
      host.uni = { previewImage };
      const wrapper = mount(SnImg, { props: { src: 'https://x/a.png' } });
      await wrapper.trigger('tap');
      expect(previewImage).not.toHaveBeenCalled();
    });

    it('does not open the preview without a src', async () => {
      const previewImage = vi.fn();
      host.uni = { previewImage };
      const wrapper = mount(SnImg, { props: { enablePreview: true } });
      await wrapper.trigger('tap');
      expect(previewImage).not.toHaveBeenCalled();
    });

    it('stays silent where the uni preview API is missing', async () => {
      delete host.uni;
      const wrapper = mount(SnImg, { props: { src: 'https://x/a.png', enablePreview: true } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    /*
     * Regression guard for the shipped-H5 "tap does nothing" bug: the uni-app
     * production build only bundles the uni APIs its static analysis can see,
     * so reaching `previewImage` through a variable (the old
     * `globalThis.uni?.previewImage` form) let the API be tree-shaken out of
     * the bundle while every behavioural test above still passed in dev.
     * The invariant cannot be observed at runtime, so it is pinned on the
     * source text.
     */
    it('calls uni.previewImage statically so the build keeps the API', () => {
      const source = readFileSync(resolve(import.meta.dirname, 'sn-img.vue'), 'utf8');
      expect(source).toMatch(/\buni\.previewImage\s*\(/);
    });
  });

  describe('src lifecycle', () => {
    it('returns to the loading state when src changes after a load', async () => {
      const wrapper = mount(SnImg, { props: { src: 'a.png' } });
      await wrapper.find('.sn-img__image').trigger('load');
      expect(wrapper.find('.sn-img__loading').exists()).toBe(false);
      await wrapper.setProps({ src: 'b.png' });
      expect(wrapper.find('.sn-img__loading').exists()).toBe(true);
      expect(wrapper.classes()).not.toContain('sn-img--loaded');
    });

    it('returns to the loading state when src changes after an error', async () => {
      const wrapper = mount(SnImg, { props: { src: 'a.png' } });
      await wrapper.find('.sn-img__image').trigger('error');
      expect(wrapper.find('.sn-img__error').exists()).toBe(true);
      await wrapper.setProps({ src: 'b.png' });
      expect(wrapper.find('.sn-img__error').exists()).toBe(false);
      expect(wrapper.classes()).not.toContain('sn-img--error');
    });

    it('replays load / error per attempt', async () => {
      const wrapper = mount(SnImg, { props: { src: 'a.png' } });
      await wrapper.find('.sn-img__image').trigger('error');
      await wrapper.setProps({ src: 'b.png' });
      await wrapper.find('.sn-img__image').trigger('load');
      expect(wrapper.emitted('error')).toHaveLength(1);
      expect(wrapper.emitted('load')).toHaveLength(1);
    });
  });

  it('emits the tap event object as the click payload', async () => {
    const wrapper = mount(SnImg, { props: { src: 'a.png' } });
    await wrapper.trigger('tap');
    const payload = wrapper.emitted('click')?.[0]?.[0];
    expect(payload).toBeInstanceOf(Event);
    expect((payload as Event).type).toBe('tap');
  });
});
