/**
 * SnVideoPreview tests — AUI-WEB-DD-011.
 *
 * Harness notes:
 *
 * 1. happy-dom ships no media engine, so `HTMLMediaElement.prototype.play` /
 *    `.pause` are stubbed with `vi.fn()` in `beforeEach` and restored in
 *    `afterEach`. The stubs are what makes "click to play" observable at all —
 *    the component itself must keep working when these methods are missing.
 *
 * 2. The preview overlay is teleported to `document.body`, so it is queried on
 *    the document rather than through the wrapper (same convention as
 *    `SnImage.test.ts`). Components are mounted with `attachTo: document.body`
 *    so focus assertions are meaningful.
 *
 * 3. Focus return is asserted through `document.activeElement`: the toolbar
 *    affordance is the trigger, and it must be focused again after the overlay
 *    closes.
 *
 * 4. `controls` no longer means the native `<video controls>` attribute — it
 *    renders our custom, beautified bar (`SnVideoControls.vue`). The native
 *    attribute only appears through `nativeControls`. The bar's own static
 *    query helpers are used instead of `mount(SnVideoControls)` so these tests
 *    only need the main component's SFC types.
 *
 * 5. happy-dom has neither `HTMLMediaElement.requestFullscreen` nor
 *    `document.exitFullscreen`, which is exactly the branch where the
 *    fullscreen button must disappear. `Object.defineProperty` installs a fake
 *    API for the "supported" branch and `afterEach` reverts it.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import SnVideoPreview from './SnVideoPreview.vue';
import { expectIconRendered, expectNoMissingIcons } from '../test-utils/icon-assertions';

/** Tiny inline sources: no network dependency, nothing to decode. */
const VIDEO_SRC = 'data:video/mp4;base64,AAAAIGZ0eXBpc29t';
const POSTER_SRC =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E';

/* ── Media method stubs ─────────────────────────────────────────────────── */

const originalPlay = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'play');
const originalPause = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'pause');

let playMock: ReturnType<typeof vi.fn>;
let pauseMock: ReturnType<typeof vi.fn>;

function installMediaStubs(): void {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: playMock,
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    writable: true,
    value: pauseMock,
  });
}

function restoreMediaMethods(): void {
  for (const [name, descriptor] of [
    ['play', originalPlay],
    ['pause', originalPause],
  ] as const) {
    if (descriptor) Object.defineProperty(HTMLMediaElement.prototype, name, descriptor);
    else delete (HTMLMediaElement.prototype as unknown as Record<string, unknown>)[name];
  }
}

/* ── Mounting helpers ───────────────────────────────────────────────────── */

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountVideo(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
): ReturnType<typeof mount> {
  const wrapper = mount(SnVideoPreview, {
    props: { src: VIDEO_SRC, ...props },
    slots,
    attachTo: document.body,
  });
  mountedWrappers.push(wrapper);
  return wrapper;
}

type Wrapper = ReturnType<typeof mountVideo>;

function videoOf(wrapper: Wrapper): ReturnType<Wrapper['find']> {
  return wrapper.find('video');
}

function previewTriggerOf(wrapper: Wrapper): ReturnType<Wrapper['find']> {
  return wrapper.find('button[aria-label="放大预览"]');
}

function overlayRoot(): Element | null {
  return document.querySelector('[data-snui-component="video-preview-overlay"]');
}

function closeButton(): HTMLElement | null {
  return document.querySelector('[aria-label="关闭"]');
}

/* ── Custom bar queries / fullscreen API harness ────────────────────────── */

function barOf(wrapper: Wrapper): ReturnType<Wrapper['find']> {
  return wrapper.find('[data-snui-component="video-controls"]');
}

function barButtonOf(wrapper: Wrapper, label: string): ReturnType<Wrapper['find']> {
  return wrapper.find(`[data-snui-component="video-controls"] button[aria-label="${label}"]`);
}

function timelineOf(wrapper: Wrapper): ReturnType<Wrapper['find']> {
  return wrapper.find('[data-snui-component="video-controls"] input[type="range"]');
}

/** `[0]` / `[1]` are current and total time, in DOM order. */
function barTimesOf(wrapper: Wrapper): string[] {
  return wrapper
    .findAll('[data-snui-component="video-controls"] .sn-video-controls__time')
    .map((node) => node.text());
}

const originalRequestFullscreen = Object.getOwnPropertyDescriptor(
  HTMLMediaElement.prototype,
  'requestFullscreen',
);
const originalExitFullscreen = Object.getOwnPropertyDescriptor(
  Document.prototype,
  'exitFullscreen',
);
/**
 * happy-dom declares `document.exitFullscreen` as a *throwing function* and
 * mirrors `Document.prototype` through an own getter, so the instance copy has
 * to be captured and restored separately from the prototype one.
 */
const originalDocumentExitFullscreen = Object.getOwnPropertyDescriptor(document, 'exitFullscreen');

const requestFullscreenMock = vi.fn(() => Promise.resolve());
const exitFullscreenMock = vi.fn(() => Promise.resolve());

/**
 * Install a full Fullscreen API pair so the bar renders its button. Both holes
 * are patched: `HTMLMediaElement.requestFullscreen` is normally absent, and
 * `document.exitFullscreen` is the one happy-dom mirrors through an own
 * accessor, so it needs an own override on top of the prototype one.
 */
function installFullscreenApi(): void {
  Object.defineProperty(HTMLMediaElement.prototype, 'requestFullscreen', {
    configurable: true,
    writable: true,
    value: requestFullscreenMock,
  });
  Object.defineProperty(Document.prototype, 'exitFullscreen', {
    configurable: true,
    writable: true,
    value: exitFullscreenMock,
  });
  Object.defineProperty(document, 'exitFullscreen', {
    configurable: true,
    writable: true,
    value: exitFullscreenMock,
  });
}

/** happy-dom has no working Fullscreen API: undo whatever a test installed. */
function restoreFullscreenApi(): void {
  for (const [target, name, descriptor] of [
    [HTMLMediaElement.prototype, 'requestFullscreen', originalRequestFullscreen],
    [Document.prototype, 'exitFullscreen', originalExitFullscreen],
    [document, 'exitFullscreen', originalDocumentExitFullscreen],
  ] as const) {
    if (descriptor) Object.defineProperty(target, name, descriptor);
    else delete (target as unknown as Record<string, unknown>)[name];
  }
}

/**
 * happy-dom's Fullscreen surface is partial: `document.exitFullscreen` is
 * always a callable function there while `fullscreenElement` stays `null`.
 * The component therefore probes `fullscreenElement` as well, which makes
 * "API available" and "API missing" both testable.
 */
function defineFullscreenElement(value: unknown): void {
  Object.defineProperty(document, 'fullscreenElement', { configurable: true, value });
}

beforeEach(() => {
  playMock = vi.fn(() => Promise.resolve());
  pauseMock = vi.fn();
  installMediaStubs();
});

afterEach(() => {
  restoreFullscreenApi();
  requestFullscreenMock.mockClear();
  exitFullscreenMock.mockClear();
  for (const wrapper of mountedWrappers.splice(0)) wrapper.unmount();
  document.documentElement.style.overflow = '';
  restoreMediaMethods();
  vi.restoreAllMocks();
});

describe('SnVideoPreview (AUI-WEB-DD-011)', () => {
  describe('rendering', () => {
    it('should render the video box with src and poster', () => {
      const wrapper = mountVideo({ poster: POSTER_SRC });

      expect(wrapper.attributes('data-snui-component')).toBe('video-preview');
      const video = videoOf(wrapper);
      expect(video.exists()).toBe(true);
      expect(video.attributes('src')).toBe(VIDEO_SRC);
      expect(video.attributes('poster')).toBe(POSTER_SRC);
    });

    it('should default width to 320px and object-fit to cover', () => {
      const wrapper = mountVideo();

      expect(wrapper.element.style.width).toBe('320px');

      // The video fills the box, so the fit mode lives on the video element.
      expect(videoOf(wrapper).attributes('style')).toContain('object-fit: cover');
    });

    it('should accept numeric and string sizes', () => {
      const numeric = mountVideo({ width: 480, height: 270 });
      expect(numeric.element.style.width).toBe('480px');
      expect(numeric.element.style.height).toBe('270px');

      const stringly = mountVideo({ width: '20rem', objectFit: 'contain' });
      expect(stringly.element.style.width).toBe('20rem');
      expect(videoOf(stringly).attributes('style')).toContain('object-fit: contain');
    });

    it('should apply aspectRatio only while no explicit height is given', () => {
      const ratio = mountVideo({ aspectRatio: '16 / 9' });
      expect(ratio.element.style.aspectRatio).toBe('16 / 9');

      const explicit = mountVideo({ aspectRatio: '16 / 9', height: 180 });
      expect(explicit.element.style.height).toBe('180px');
      expect(explicit.element.style.aspectRatio).toBe('');
    });

    it('should render a centered play button with a real icon', () => {
      const wrapper = mountVideo();

      const button = wrapper.find('button[aria-label="播放视频"]');
      expect(button.exists()).toBe(true);
      expectIconRendered(button, '.sn-icon');
      expectNoMissingIcons(wrapper, 'SnVideoPreview');
    });

    it('should forward loop / muted / preload and render the custom bar instead of native controls', () => {
      const wrapper = mountVideo({ controls: true, loop: true, muted: true, preload: 'auto' });
      const video = videoOf(wrapper);

      // `controls` = OUR bar. The UA attribute is what `nativeControls` adds.
      expect(video.element.hasAttribute('controls')).toBe(false);
      expect(barOf(wrapper).exists()).toBe(true);
      expect(video.element.hasAttribute('loop')).toBe(true);
      expect((video.element as HTMLVideoElement).muted).toBe(true);
      expect(video.attributes('preload')).toBe('auto');
    });

    it('should render no bar at all when controls is false', () => {
      const wrapper = mountVideo({ controls: false });

      expect(videoOf(wrapper).element.hasAttribute('controls')).toBe(false);
      expect(barOf(wrapper).exists()).toBe(false);
    });

    it('should use alt as the accessible name, falling back to title', () => {
      expect(videoOf(mountVideo({ title: '宣传片' })).attributes('aria-label')).toBe('宣传片');
      expect(
        videoOf(mountVideo({ title: '宣传片', alt: '产品宣传片' })).attributes('aria-label'),
      ).toBe('产品宣传片');
      expect(videoOf(mountVideo()).attributes('aria-label')).toBeUndefined();
    });

    it('should always render playsinline and the legacy webkit-playsinline', () => {
      // iOS Safari hijacks the screen for a playing video without these; there
      // is deliberately no prop to turn them off.
      for (const wrapper of [mountVideo(), mountVideo({ background: true })]) {
        const video = videoOf(wrapper).element;
        expect(video.hasAttribute('playsinline')).toBe(true);
        expect(video.hasAttribute('webkit-playsinline')).toBe(true);
      }
    });
  });

  describe('inline playback', () => {
    it('should start playback when the play button is clicked', async () => {
      const wrapper = mountVideo({ poster: POSTER_SRC });
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true);

      await wrapper.find('button[aria-label="播放视频"]').trigger('click');

      expect(playMock).toHaveBeenCalledTimes(1);
      // The scrim is the poster state: playing hides it.
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(false);
    });

    it('should return to the poster state when the video pauses or ends', async () => {
      const wrapper = mountVideo();
      await wrapper.find('button[aria-label="播放视频"]').trigger('click');

      await videoOf(wrapper).trigger('pause');
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true);

      await wrapper.find('button[aria-label="播放视频"]').trigger('click');
      await videoOf(wrapper).trigger('ended');
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true);
    });

    it('should toggle play and pause by clicking the video when controls are off', async () => {
      const wrapper = mountVideo({ controls: false });

      await videoOf(wrapper).trigger('click');
      expect(playMock).toHaveBeenCalledTimes(1);

      await videoOf(wrapper).trigger('click');
      expect(pauseMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true);
    });

    it('should leave video clicks to the native controls when controls are on', async () => {
      const wrapper = mountVideo({ controls: true });

      await videoOf(wrapper).trigger('click');
      expect(playMock).not.toHaveBeenCalled();
    });

    it('should emit play, pause, ended and error from the video element', async () => {
      const wrapper = mountVideo();

      await videoOf(wrapper).trigger('play');
      expect(wrapper.emitted('play')).toHaveLength(1);

      await videoOf(wrapper).trigger('pause');
      expect(wrapper.emitted('pause')).toHaveLength(1);

      await videoOf(wrapper).trigger('ended');
      expect(wrapper.emitted('ended')).toHaveLength(1);

      await videoOf(wrapper).trigger('error');
      expect(wrapper.emitted('error')).toHaveLength(1);
    });

    it('should expose play and pause imperatively', async () => {
      const wrapper = mountVideo();
      const vm = wrapper.vm as unknown as { play: () => void; pause: () => void };

      vm.play();
      expect(playMock).toHaveBeenCalledTimes(1);

      vm.pause();
      expect(pauseMock).toHaveBeenCalledTimes(1);
      await nextTick();
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true);
    });

    it('should fall back to the poster state when play() rejects', async () => {
      playMock.mockImplementation(() => Promise.reject(new Error('autoplay blocked')));
      const wrapper = mountVideo();

      await wrapper.find('button[aria-label="播放视频"]').trigger('click');
      await nextTick();
      await nextTick();

      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true);
    });
  });

  describe('preview overlay', () => {
    it('should hide the toolbar affordance when previewDisabled', () => {
      const wrapper = mountVideo({ previewDisabled: true });

      expect(previewTriggerOf(wrapper).exists()).toBe(false);
      expect(overlayRoot()).toBeNull();
    });

    it('should hide the toolbar affordance when showToolbar is false', () => {
      expect(previewTriggerOf(mountVideo({ showToolbar: false })).exists()).toBe(false);
    });

    it('should open the overlay, emit preview and move focus into the dialog', async () => {
      const wrapper = mountVideo({ title: '宣传片' });

      await previewTriggerOf(wrapper).trigger('click');
      await nextTick();
      await nextTick();

      const root = overlayRoot();
      expect(root).not.toBeNull();
      expect(root?.getAttribute('role')).toBe('dialog');
      expect(root?.getAttribute('aria-modal')).toBe('true');
      expect(root?.getAttribute('aria-label')).toBe('宣传片');
      expect(wrapper.emitted('preview')).toHaveLength(1);
      expect(document.activeElement).toBe(closeButton());
    });

    it('should show the (larger) preview src in the overlay', async () => {
      const wrapper = mountVideo({ previewSrc: 'data:video/mp4;base64,PREVIEW' });
      await previewTriggerOf(wrapper).trigger('click');
      await nextTick();

      expect(overlayRoot()?.querySelector('video')?.getAttribute('src')).toBe(
        'data:video/mp4;base64,PREVIEW',
      );
    });

    it('should close on Escape, emit close and return focus to the trigger', async () => {
      const wrapper = mountVideo();
      await previewTriggerOf(wrapper).trigger('click');
      await nextTick();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await nextTick();
      await nextTick();

      expect(overlayRoot()).toBeNull();
      expect(wrapper.emitted('close')).toHaveLength(1);
      expect(document.activeElement).toBe(previewTriggerOf(wrapper).element);
    });

    it('should close on mask click and lock page scroll meanwhile', async () => {
      const wrapper = mountVideo();
      await previewTriggerOf(wrapper).trigger('click');
      await nextTick();

      expect(document.documentElement.style.overflow).toBe('hidden');

      document
        .querySelector('.sn-video-preview-overlay__mask')!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await nextTick();
      await nextTick();

      expect(overlayRoot()).toBeNull();
      expect(wrapper.emitted('close')).toHaveLength(1);
      expect(document.documentElement.style.overflow).toBe('');
    });

    it('should keep the overlay open on mask click when closeOnMaskClick is false', async () => {
      const wrapper = mountVideo({ closeOnMaskClick: false });
      await previewTriggerOf(wrapper).trigger('click');
      await nextTick();

      document
        .querySelector('.sn-video-preview-overlay__mask')!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await nextTick();

      expect(overlayRoot()).not.toBeNull();
      expect(wrapper.emitted('close')).toBeUndefined();
    });

    it('should open and close the overlay through the exposed methods', async () => {
      const wrapper = mountVideo();
      const vm = wrapper.vm as unknown as { showPreview: () => void; closePreview: () => void };

      vm.showPreview();
      await nextTick();
      expect(overlayRoot()).not.toBeNull();

      vm.closePreview();
      await nextTick();
      await nextTick();
      expect(overlayRoot()).toBeNull();
      expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('should make showPreview a no-op when previewDisabled', async () => {
      const wrapper = mountVideo({ previewDisabled: true });
      const vm = wrapper.vm as unknown as { showPreview: () => void };

      vm.showPreview();
      await nextTick();

      expect(overlayRoot()).toBeNull();
      expect(wrapper.emitted('preview')).toBeUndefined();
    });
  });

  describe('custom control bar', () => {
    it('should render the beautified bar by default and never the native controls attribute', () => {
      const wrapper = mountVideo();

      expect(barOf(wrapper).exists()).toBe(true);
      expect(videoOf(wrapper).element.hasAttribute('controls')).toBe(false);
      // play/pause, mute, timeline, current + total time.
      expect(barButtonOf(wrapper, '播放').exists()).toBe(true);
      expect(barButtonOf(wrapper, '静音').exists()).toBe(true);
      expect(timelineOf(wrapper).exists()).toBe(true);
      expect(barTimesOf(wrapper)).toHaveLength(2);
      expectNoMissingIcons(wrapper, 'SnVideoPreview');
    });

    it('should render the native controls attribute only when nativeControls is set', () => {
      const wrapper = mountVideo({ nativeControls: true });

      expect(videoOf(wrapper).element.hasAttribute('controls')).toBe(true);
      // The custom bar is still the visible one — `controls` stays at its default.
      expect(barOf(wrapper).exists()).toBe(true);

      const nativeOnly = mountVideo({ nativeControls: true, controls: false });
      expect(videoOf(nativeOnly).element.hasAttribute('controls')).toBe(true);
      expect(barOf(nativeOnly).exists()).toBe(false);
    });

    it('should toggle play() and pause() from the bar play/pause button', async () => {
      const wrapper = mountVideo();

      await barButtonOf(wrapper, '播放').trigger('click');
      expect(playMock).toHaveBeenCalledTimes(1);

      // The glyph + label follow the media element's own `play` event.
      await videoOf(wrapper).trigger('play');
      expect(barButtonOf(wrapper, '暂停').exists()).toBe(true);

      await barButtonOf(wrapper, '暂停').trigger('click');
      expect(pauseMock).toHaveBeenCalledTimes(1);
    });

    it('should toggle video.muted from the mute button without emitting media events', async () => {
      const wrapper = mountVideo();
      const video = videoOf(wrapper).element as HTMLVideoElement;
      expect(video.muted).toBe(false);

      await barButtonOf(wrapper, '静音').trigger('click');
      expect(video.muted).toBe(true);
      expect(barButtonOf(wrapper, '取消静音').exists()).toBe(true);

      await barButtonOf(wrapper, '取消静音').trigger('click');
      expect(video.muted).toBe(false);

      // Toggling mute is local UI state: no play/pause/ended/preview/close.
      for (const name of ['play', 'pause', 'ended', 'error', 'preview', 'close'] as const) {
        expect(wrapper.emitted(name)).toBeUndefined();
      }
    });

    it('should reflect currentTime / duration and seek through the media element', async () => {
      const wrapper = mountVideo();
      const video = videoOf(wrapper).element as HTMLVideoElement;

      // `loadedmetadata` carries the duration, `timeupdate` the position.
      Object.defineProperty(video, 'duration', { configurable: true, value: 95 });
      Object.defineProperty(video, 'currentTime', {
        configurable: true,
        value: 12,
        writable: true,
      });
      video.dispatchEvent(new Event('loadedmetadata'));
      video.dispatchEvent(new Event('timeupdate'));
      await nextTick();

      expect(barTimesOf(wrapper)).toEqual(['00:12', '01:35']);
      expect(timelineOf(wrapper).attributes('max')).toBe('95');
      expect(timelineOf(wrapper).attributes('aria-valuetext')).toBe('00:12 / 01:35');

      const timeline = timelineOf(wrapper);
      (timeline.element as HTMLInputElement).value = '42';
      await timeline.trigger('input');

      expect(video.currentTime).toBe(42);
      expect(barTimesOf(wrapper)[0]).toBe('00:42');

      // `change` releases the scrub override: the element is authoritative again.
      Object.defineProperty(video, 'currentTime', {
        configurable: true,
        value: 43,
        writable: true,
      });
      await timeline.trigger('change');
      video.dispatchEvent(new Event('timeupdate'));
      await nextTick();
      expect(barTimesOf(wrapper)[0]).toBe('00:43');
    });

    it('should hide the fullscreen button when the Fullscreen API is unavailable', () => {
      // happy-dom exposes no Fullscreen implementation (and the default
      // document has no `fullscreenElement`): the button must not be offered.
      const wrapper = mountVideo();

      expect(barButtonOf(wrapper, '全屏').exists()).toBe(false);
      expect(barButtonOf(wrapper, '退出全屏').exists()).toBe(false);
    });

    it('should call the media fullscreen API when it is available', async () => {
      installFullscreenApi();
      defineFullscreenElement(null);
      const wrapper = mountVideo();
      const video = videoOf(wrapper).element as HTMLVideoElement;
      // `mount()` does not flush the mounted hook: the capability probe (and
      // therefore the button) only lands after a tick.
      await nextTick();

      const button = barButtonOf(wrapper, '全屏');
      expect(button.exists()).toBe(true);
      expectIconRendered(button, '.sn-icon');

      await button.trigger('click');
      expect(requestFullscreenMock).toHaveBeenCalledTimes(1);

      // A fullscreenchange hands the glyph over to "exit".
      defineFullscreenElement(video);
      document.dispatchEvent(new Event('fullscreenchange'));
      await nextTick();
      expect(barButtonOf(wrapper, '退出全屏').exists()).toBe(true);

      await barButtonOf(wrapper, '退出全屏').trigger('click');
      expect(exitFullscreenMock).toHaveBeenCalledTimes(1);

      defineFullscreenElement(null);
      document.dispatchEvent(new Event('fullscreenchange'));
      await nextTick();
      expect(barButtonOf(wrapper, '全屏').exists()).toBe(true);
    });

    it('should drop the fullscreenchange listener on unmount', async () => {
      installFullscreenApi();
      defineFullscreenElement(null);
      const removeSpy = vi.spyOn(document, 'removeEventListener');
      const wrapper = mountVideo();
      // Let the mounted hook register the document listener first.
      await nextTick();
      expect(typeof document.fullscreenElement).toBe('object');

      wrapper.unmount();

      expect(removeSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
    });

    it('should reuse the same bar inside the overlay', async () => {
      const wrapper = mountVideo({ title: '宣传片' });
      await previewTriggerOf(wrapper).trigger('click');
      await nextTick();

      const overlayBar = overlayRoot()?.querySelector('[data-snui-component="video-controls"]');
      expect(overlayBar).not.toBeNull();
      // The overlay video itself never gets the native attribute by default.
      expect(overlayRoot()?.querySelector('video')?.hasAttribute('controls')).toBe(false);
    });

    it('should drive the overlay video from its own bar buttons', async () => {
      const wrapper = mountVideo();
      await previewTriggerOf(wrapper).trigger('click');
      await nextTick();

      // Query the bar inside the teleported overlay, not the inline one.
      const overlayPlay = overlayRoot()!.querySelector<HTMLElement>('button[aria-label="播放"]')!;
      expect(overlayPlay).not.toBeNull();
      overlayPlay.click();
      await nextTick();
      expect(playMock).toHaveBeenCalledTimes(1);

      const overlayPause = overlayRoot()!.querySelector<HTMLElement>('button[aria-label="暂停"]')!;
      expect(overlayPause).not.toBeNull();
      overlayPause.click();
      await nextTick();
      expect(pauseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('background mode', () => {
    it('should hide every player affordance', () => {
      const wrapper = mountVideo({ background: true });

      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(false);
      expect(wrapper.find('button[aria-label="播放视频"]').exists()).toBe(false);
      expect(wrapper.find('.sn-video-preview__toolbar').exists()).toBe(false);
      expect(barOf(wrapper).exists()).toBe(false);
      expect(videoOf(wrapper).element.hasAttribute('controls')).toBe(false);
      expect(overlayRoot()).toBeNull();
    });

    it('should hide the placeholder slot and the poster scrim', () => {
      const wrapper = mountVideo(
        { background: true, poster: POSTER_SRC },
        { placeholder: '<span class="demo-placeholder">加载中</span>' },
      );

      expect(wrapper.find('.sn-video-preview__placeholder').exists()).toBe(false);
      expect(videoOf(wrapper).attributes('poster')).toBeUndefined();
    });

    it('should force muted / autoplay / loop / cover and fill the parent', () => {
      const wrapper = mountVideo({ background: true, objectFit: 'contain' });
      const video = videoOf(wrapper).element as HTMLVideoElement;

      expect(video.hasAttribute('autoplay')).toBe(true);
      expect(video.hasAttribute('loop')).toBe(true);
      expect(video.hasAttribute('muted')).toBe(true);
      expect(video.muted).toBe(true);
      expect(video.getAttribute('style')).toContain('object-fit: cover');

      // Fills a `position: relative` hero section instead of using width/height.
      expect(wrapper.element.style.position).toBe('absolute');
      // Written as the four longhands: `inset` is a shorthand the CSSOM may
      // drop (happy-dom does), and the box must span its parent either way.
      for (const side of ['top', 'right', 'bottom', 'left'] as const) {
        expect(wrapper.element.style[side]).toBe('0px');
      }
      expect(wrapper.element.style.width).toBe('');
    });

    it('should mark the video as decorative', () => {
      const wrapper = mountVideo({ background: true, title: '宣传片', alt: '产品宣传片' });
      const video = videoOf(wrapper).element;

      expect(video.getAttribute('aria-hidden')).toBe('true');
      expect(video.hasAttribute('aria-label')).toBe(false);
      expect(video.getAttribute('style')).toContain('pointer-events: none');
    });

    it('should override nativeControls and ignore showPreview()', () => {
      const wrapper = mountVideo({ background: true, nativeControls: true });
      expect(videoOf(wrapper).element.hasAttribute('controls')).toBe(false);

      const vm = wrapper.vm as unknown as { showPreview: () => void };
      vm.showPreview();
      expect(overlayRoot()).toBeNull();
      expect(wrapper.emitted('preview')).toBeUndefined();
    });
  });

  describe('autoplay policy', () => {
    it('should force the muted attribute when autoplay is on', () => {
      const wrapper = mountVideo({ autoplay: true });
      const video = videoOf(wrapper).element as HTMLVideoElement;

      expect(video.hasAttribute('autoplay')).toBe(true);
      expect(video.hasAttribute('muted')).toBe(true);
      expect(video.muted).toBe(true);
    });

    it('should run the background autoplay+muted JS fallback on mount', async () => {
      // The attribute alone is not enough on every engine: the *property* is
      // written as well. Instrument the prototype setter, which is what the
      // component call resolves to, to prove the write actually happens.
      const mutedSetter = vi.spyOn(HTMLMediaElement.prototype, 'muted', 'set');

      const wrapper = mountVideo({ background: true });

      expect(mutedSetter).toHaveBeenCalled();
      const video = videoOf(wrapper).element as HTMLVideoElement;
      expect(video.muted).toBe(true);

      // A stray unmute (e.g. a UA policy reset) is re-read from the element on
      // `play`; the media engine already allows the muted autoplay attempt.
      video.muted = false;
      await videoOf(wrapper).trigger('play');
      expect(barOf(wrapper).exists()).toBe(false);
      expect(video.muted).toBe(false);
    });
  });

  describe('slots', () => {
    it('should render the placeholder slot while the video has not started', async () => {
      const wrapper = mountVideo(
        {},
        { placeholder: '<span class="demo-placeholder">加载中</span>' },
      );

      expect(wrapper.find('.sn-video-preview__placeholder').exists()).toBe(true);
      expect(wrapper.find('.demo-placeholder').exists()).toBe(true);

      await wrapper.find('button[aria-label="播放视频"]').trigger('click');
      expect(wrapper.find('.sn-video-preview__placeholder').exists()).toBe(false);
    });

    it('should replace the play glyph through the play-icon slot', () => {
      const wrapper = mountVideo({}, { 'play-icon': '<span class="demo-glyph" />' });

      const button = wrapper.find('button[aria-label="播放视频"]');
      expect(button.find('.demo-glyph').exists()).toBe(true);
      expect(button.find('.sn-icon').exists()).toBe(false);
    });

    it('should replace the overlay affordance through the toolbar slot', async () => {
      // The slot receives `showPreview` so a custom affordance can still open
      // the overlay (the default button is gone).
      const wrapper = mountVideo(
        {},
        {
          toolbar: (params: { showPreview: () => void }) =>
            h('button', { class: 'demo-expand', onClick: params.showPreview }),
        },
      );
      const expand = wrapper.find('.demo-expand');

      expect(expand.exists()).toBe(true);
      expect(previewTriggerOf(wrapper).exists()).toBe(false);

      await expand.trigger('click');
      await nextTick();
      expect(overlayRoot()).not.toBeNull();
      expect(wrapper.emitted('preview')).toHaveLength(1);
    });
  });

  describe('dispose', () => {
    it('should pause the video and drop its source on unmount', () => {
      const wrapper = mountVideo({ poster: POSTER_SRC });
      const video = videoOf(wrapper).element as HTMLVideoElement;

      wrapper.unmount();

      expect(pauseMock).toHaveBeenCalledTimes(1);
      expect(video.hasAttribute('src')).toBe(false);
    });

    it('should remove the overlay keydown listener on unmount', async () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener');
      const wrapper = mountVideo();

      await previewTriggerOf(wrapper).trigger('click');
      await nextTick();
      wrapper.unmount();

      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});
