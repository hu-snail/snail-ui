import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import SnVideoPlayer from './SnVideoPlayer.vue';
import type { SnVideoQuality, SnVideoSourceBridge } from './video-player-types';

/* happy-dom implements HTMLMediaElement sparsely — define the surface the
 * player drives so tests exercise the real wiring. */
beforeEach(() => {
  const proto = HTMLMediaElement.prototype as HTMLMediaElement & {
    play?: () => Promise<void>;
  };
  if (typeof proto.play !== 'function') {
    Object.defineProperty(proto, 'play', {
      configurable: true,
      value: () => Promise.resolve(),
    });
  }
  if (typeof proto.pause !== 'function') {
    Object.defineProperty(proto, 'pause', { configurable: true, value: () => {} });
  }
  if (typeof proto.load !== 'function') {
    Object.defineProperty(proto, 'load', { configurable: true, value: () => {} });
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

/** Stub the media duration + current time (spec getters are readonly). */
function stubDuration(video: HTMLVideoElement, seconds: number): void {
  Object.defineProperty(video, 'duration', {
    configurable: true,
    value: seconds,
  });
}

const LADDER: SnVideoQuality[] = [
  { label: '1080P', value: '1080p', src: 'blob:video-1080.mp4' },
  { label: '720P', value: '720p', src: 'blob:video-720.mp4' },
  { label: '360P', value: '360p', src: 'blob:video-360.mp4' },
];

/** applySource runs one tick after mount (post-mounted nextTick) — every
 * mount awaits it so source / bridge assertions see the settled state. */
async function mountPlayer(props: Record<string, unknown> = {}): Promise<VueWrapper> {
  const w = mount(SnVideoPlayer, {
    props,
    attachTo: document.body,
  });
  await nextTick();
  return w;
}

function root(w: VueWrapper) {
  return w.find('.sn-video-player');
}

function videoEl(w: VueWrapper): HTMLVideoElement {
  return w.find('video').element as HTMLVideoElement;
}

function openSettings(w: VueWrapper): void {
  void w.find('.sn-video-player__settings button').trigger('click');
}

describe('SnVideoPlayer', () => {
  describe('rendering', () => {
    it('renders the media element with native source and inline-play attrs', async () => {
      const w = await mountPlayer({ src: '/clip.mp4', title: '宣传片' });
      const video = videoEl(w);
      expect(video.getAttribute('src')).toBe('/clip.mp4');
      expect(video.hasAttribute('playsinline')).toBe(true);
      expect(video.hasAttribute('webkit-playsinline')).toBe(true);
      expect(video.getAttribute('aria-label')).toBe('宣传片');
      w.unmount();
    });

    it('shows the big play button while paused and hides it on play', async () => {
      const w = await mountPlayer({ src: '/clip.mp4' });
      expect(w.find('.sn-video-player__big-play').exists()).toBe(true);
      await videoEl(w).dispatchEvent(new Event('play'));
      await nextTick();
      expect(w.find('.sn-video-player__big-play').exists()).toBe(false);
      expect(w.emitted('play')).toHaveLength(1);
      w.unmount();
    });

    it('forwards autoplay / muted / loop / preload / volume / rate', async () => {
      const w = await mountPlayer({
        src: '/clip.mp4',
        autoplay: true,
        muted: true,
        loop: true,
        preload: 'none',
        volume: 0.4,
        rate: 1.5,
      });
      const video = videoEl(w);
      expect(video.hasAttribute('autoplay')).toBe(true);
      expect(video.hasAttribute('muted')).toBe(true);
      expect(video.hasAttribute('loop')).toBe(true);
      expect(video.getAttribute('preload')).toBe('none');
      expect(video.volume).toBe(0.4);
      expect(video.playbackRate).toBe(1.5);
      w.unmount();
    });
  });

  describe('time + progress', () => {
    it('formats the time display and tracks buffered ranges', async () => {
      const w = await mountPlayer({ src: '/clip.mp4' });
      const video = videoEl(w);
      stubDuration(video, 125);
      await video.dispatchEvent(new Event('loadedmetadata'));
      Object.defineProperty(video, 'currentTime', { configurable: true, value: 65 });
      Object.defineProperty(video, 'buffered', {
        configurable: true,
        value: { length: 1, end: () => 62.5 },
      });
      await video.dispatchEvent(new Event('timeupdate'));
      expect(w.find('.sn-video-player__time').text()).toContain('01:05');
      expect(w.find('.sn-video-player__time').text()).toContain('02:05');
      w.unmount();
    });

    it('seeks from the progress bar via pointer + keyboard and exposes slider semantics', async () => {
      const w = await mountPlayer({ src: '/clip.mp4' });
      const video = videoEl(w);
      stubDuration(video, 100);
      await video.dispatchEvent(new Event('loadedmetadata'));
      Object.defineProperty(video, 'currentTime', {
        configurable: true,
        value: 0,
        writable: true,
      });
      const track = w.find('.sn-video-player__progress');
      expect(track.attributes('role')).toBe('slider');
      expect(track.attributes('aria-valuemax')).toBe('100');

      // Pointer at 30% of the (stubbed) track → seek(30).
      track.element.getBoundingClientRect = () =>
        ({ left: 0, width: 200, top: 0, height: 14, right: 200, bottom: 14, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
      await track.trigger('pointerdown', { clientX: 60, pointerId: 1 });
      expect(video.currentTime).toBe(30);
      window.dispatchEvent(new PointerEvent('pointerup'));

      // Keyboard: ArrowRight seeks +5s from current.
      Object.defineProperty(video, 'currentTime', { configurable: true, value: 30, writable: true });
      await video.dispatchEvent(new Event('timeupdate'));
      await track.trigger('keydown', { key: 'ArrowRight' });
      expect(video.currentTime).toBe(35);
      w.unmount();
    });
  });

  describe('settings menu (quality / rate / loop)', () => {
    it('renders the ladder, switches the source and emits quality-change', async () => {
      const w = await mountPlayer({ qualities: LADDER, defaultQuality: '1080p' });
      expect(videoEl(w).getAttribute('src')).toBe('blob:video-1080.mp4');
      await openSettings(w);
      const items = w.findAll('.sn-video-player__settings-item');
      expect(items.length).toBeGreaterThanOrEqual(3);
      const p720 = items.find((i) => i.text() === '720P');
      expect(p720).toBeDefined();
      await p720!.trigger('click');
      await nextTick();
      expect(videoEl(w).getAttribute('src')).toBe('blob:video-720.mp4');
      expect(w.emitted('quality-change')?.[0]?.[0]).toEqual({ id: '720p', label: '720P' });
      w.unmount();
    });

    it('changes playback rate and toggles loop from the menu', async () => {
      const w = await mountPlayer({ src: '/clip.mp4' });
      // happy-dom's HTMLMediaElement ships a getter-only playbackRate —
      // replace it with a writable field so the component can drive it.
      const video = videoEl(w);
      Object.defineProperty(video, 'playbackRate', {
        configurable: true,
        value: 1,
        writable: true,
      });
      await openSettings(w);
      const rate2 = w.findAll('.sn-video-player__settings-item').find((i) => i.text() === '2x');
      await rate2!.trigger('click');
      expect(video.playbackRate).toBe(2);
      // Browsers fire `ratechange` after the assignment — happy-dom does
      // not, so mirror the real event flow here.
      await video.dispatchEvent(new Event('ratechange'));
      expect(w.emitted('rate-change')?.[0]?.[0]).toBe(2);

      await openSettings(w);
      const loopSwitch = w.find('.sn-video-player__switch');
      await loopSwitch.trigger('click');
      expect(videoEl(w).loop).toBe(true);
      expect(loopSwitch.attributes('aria-checked')).toBe('true');
      w.unmount();
    });
  });

  describe('live mode', () => {
    it('hides the progress bar and time when the live prop is set', async () => {
      const w = await mountPlayer({ src: '/live.m3u8', live: true });
      // The live-mode spacer reuses the progress class — the slider itself
      // must be gone.
      expect(w.find('.sn-video-player__progress[role="slider"]').exists()).toBe(false);
      expect(w.find('.sn-video-player__live-badge').exists()).toBe(true);
      expect(w.find('.sn-video-player__time--live').exists()).toBe(true);
      expect(w.classes()).toContain('sn-video-player--live');
      w.unmount();
    });

    it('sniffs live from an infinite duration', async () => {
      const w = await mountPlayer({ src: '/live.m3u8' });
      stubDuration(videoEl(w), Number.POSITIVE_INFINITY);
      await videoEl(w).dispatchEvent(new Event('durationchange'));
      expect(w.classes()).toContain('sn-video-player--live');
      w.unmount();
    });
  });

  describe('danmaku', () => {
    it('renders the canvas, toggles visibility and submits from the input', async () => {
      const w = await mountPlayer({
        src: '/clip.mp4',
        danmus: [
          { text: '前方高能', time: 1 },
          { text: '哈哈哈', time: 3 },
        ],
      });
      expect(w.find('.sn-video-player__danmaku').exists()).toBe(true);

      const toggle = w.findAll('.sn-video-player__button').find((b) => b.attributes('aria-pressed') !== undefined && b.attributes('aria-label')?.includes('弹幕'));
      expect(toggle).toBeDefined();
      expect(toggle!.attributes('aria-pressed')).toBe('true');
      await toggle!.trigger('click');
      expect(toggle!.attributes('aria-pressed')).toBe('false');

      const input = w.find('.sn-video-player__danmu-input');
      expect(input.exists()).toBe(true);
      await input.setValue('666');
      await input.trigger('keydown', { key: 'Enter' });
      expect(w.emitted('danmu-send')?.[0]?.[0]).toMatchObject({ text: '666', self: true });
      // input cleared after send
      expect((input.element as HTMLInputElement).value).toBe('');
      w.unmount();
    });

    it('hides the input for live media and honours danmu-send=false', async () => {
      const wLive = await mountPlayer({ src: '/live.m3u8', live: true, danmus: [{ text: 'x', time: 0 }] });
      expect(wLive.find('.sn-video-player__danmu-input').exists()).toBe(false);
      wLive.unmount();
      const wNoSend = await mountPlayer({ src: '/clip.mp4', danmuSend: false });
      expect(wNoSend.find('.sn-video-player__danmu-input').exists()).toBe(false);
      wNoSend.unmount();
    });

    it('sends through the exposed API', async () => {
      const w = await mountPlayer({ src: '/clip.mp4', danmus: [{ text: 'x', time: 0 }] });
      (w.vm as unknown as { sendDanmu: (t: string) => void }).sendDanmu('测试弹幕');
      w.unmount();
      // no crash; scheduling covered by the engine tests
    });
  });

  describe('source bridge (third-party streaming)', () => {
    it('hands the video element + source to the bridge and skips native src', async () => {
      const destroy = vi.fn();
      const bridge = vi.fn(() => ({ destroy }));
      const w = await mountPlayer({ src: '/live/master.m3u8', sourceBridge: bridge });
      const video = videoEl(w);
      expect(bridge).toHaveBeenCalledTimes(1);
      const ctx = bridge.mock.calls[0]?.[0] as { video: HTMLVideoElement; source: { src: string } };
      expect(ctx.video).toBe(video);
      expect(ctx.source.src).toBe('/live/master.m3u8');
      // The bridge owns loading — no native src may be set.
      expect(video.getAttribute('src')).toBeNull();
      w.unmount();
      expect(destroy).toHaveBeenCalledTimes(1);
    });

    it('falls back to native playback when the bridge declines', async () => {
      const bridge: SnVideoSourceBridge = () => undefined;
      const w = await mountPlayer({ src: '/clip.mp4', sourceBridge: bridge });
      expect(videoEl(w).getAttribute('src')).toBe('/clip.mp4');
      w.unmount();
    });

    it('re-creates the bridge when the source prop changes and destroys the old handle', async () => {
      const handles: Array<{ destroy: ReturnType<typeof vi.fn> }> = [];
      const bridge: SnVideoSourceBridge = () => {
        const handle = { destroy: vi.fn() };
        handles.push(handle);
        return handle;
      };
      const w = await mountPlayer({ src: '/a.m3u8', sourceBridge: bridge });
      await w.setProps({ src: '/b.m3u8' });
      await nextTick();
      expect(handles).toHaveLength(2);
      expect(handles[0]!.destroy).toHaveBeenCalledTimes(1);
      w.unmount();
      expect(handles[1]!.destroy).toHaveBeenCalledTimes(1);
    });

    it('surfaces bridge-reported qualities and forwards selection', async () => {
      const handle = {
        destroy: vi.fn(),
        selectQuality: vi.fn(),
      };
      const bridge: SnVideoSourceBridge = (ctx) => {
        ctx.setQualities([
          { id: 0, label: '1080P 高码率' },
          { id: 1, label: '720P 高清' },
        ]);
        return handle;
      };
      const w = await mountPlayer({ src: '/vod.m3u8', sourceBridge: bridge });
      await openSettings(w);
      const items = w.findAll('.sn-video-player__settings-item');
      expect(items.some((i) => i.text() === '720P 高清')).toBe(true);

      const p720 = items.find((i) => i.text() === '720P 高清');
      await p720!.trigger('click');
      expect(handle.selectQuality).toHaveBeenCalledWith(1);
      expect(w.emitted('quality-change')?.[0]?.[0]).toEqual({ id: 1, label: '720P 高清' });

      // Bridge-owned media keeps native src untouched after switching.
      expect(videoEl(w).getAttribute('src')).toBeNull();
      w.unmount();
    });

    it('shows the error panel when the bridge reports a failure and recovers on retry', async () => {
      // Fail on the first load, succeed on the retry.
      let failed = false;
      let bridgeCalls = 0;
      const bridge: SnVideoSourceBridge = (ctx) => {
        bridgeCalls++;
        if (!failed) {
          failed = true;
          ctx.reportError(new Error('manifest parse failed'));
        }
        return { destroy: vi.fn() };
      };
      const w = await mountPlayer({ src: '/bad.m3u8', sourceBridge: bridge });
      expect(w.find('.sn-video-player__error').exists()).toBe(true);
      expect(w.emitted('error')).toHaveLength(1);

      await w.find('.sn-video-player__error-retry').trigger('click');
      expect(w.find('.sn-video-player__error').exists()).toBe(false);
      // Bridge-owned retry re-invokes the bridge (2nd call).
      expect(bridgeCalls).toBe(2);
      w.unmount();
    });
  });

  describe('download', () => {
    it('emits download and calls the custom handler with the active source', async () => {
      const onDownload = vi.fn();
      const w = await mountPlayer({ src: '/clip.mp4', onDownload });
      const btn = w
        .findAll('.sn-video-player__button')
        .find((b) => b.attributes('aria-label') === '下载视频');
      expect(btn).toBeDefined();
      await btn!.trigger('click');
      expect(w.emitted('download')).toHaveLength(1);
      expect(onDownload).toHaveBeenCalledWith({ src: '/clip.mp4' });
      w.unmount();
    });

    it('hides the download button for live media', async () => {
      const w = await mountPlayer({ src: '/live.m3u8', live: true });
      const btn = w
        .findAll('.sn-video-player__button')
        .find((b) => b.attributes('aria-label') === '下载视频');
      expect(btn).toBeUndefined();
      w.unmount();
    });
  });

  describe('mini window', () => {
    it('toggles via the exposed API and emits update:mini', async () => {
      const w = await mountPlayer({ src: '/clip.mp4' });
      (w.vm as unknown as { toggleMini: () => void }).toggleMini();
      await nextTick();
      expect(root(w).classes()).toContain('sn-video-player--mini');
      expect(w.emitted('update:mini')?.[0]?.[0]).toBe(true);
      (w.vm as unknown as { toggleMini: () => void }).toggleMini();
      await nextTick();
      expect(root(w).classes()).not.toContain('sn-video-player--mini');
      w.unmount();
    });

    it('auto-docks when scrolled out of view while playing', async () => {
      type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;
      let ioCallback: IOCallback | null = null;
      class FakeIntersectionObserver {
        constructor(cb: IOCallback) {
          ioCallback = cb;
        }
        observe(): void {}
        disconnect(): void {}
        unobserve(): void {}
      }
      vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);

      const w = await mountPlayer({ src: '/clip.mp4', miniOnScrollOut: true });
      await videoEl(w).dispatchEvent(new Event('play'));
      await nextTick();

      ioCallback?.([{ isIntersecting: false }]);
      await nextTick();
      expect(root(w).classes()).toContain('sn-video-player--mini');
      expect(w.emitted('mini-change')?.[0]?.[0]).toBe(true);

      ioCallback?.([{ isIntersecting: true }]);
      await nextTick();
      expect(root(w).classes()).not.toContain('sn-video-player--mini');
      w.unmount();
      vi.unstubAllGlobals();
    });

    it('does not auto-dock when paused', async () => {
      type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;
      let ioCallback: IOCallback | null = null;
      class FakeIntersectionObserver {
        constructor(cb: IOCallback) {
          ioCallback = cb;
        }
        observe(): void {}
        disconnect(): void {}
        unobserve(): void {}
      }
      vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);

      const w = await mountPlayer({ src: '/clip.mp4', miniOnScrollOut: true });
      ioCallback?.([{ isIntersecting: false }]);
      await nextTick();
      expect(root(w).classes()).not.toContain('sn-video-player--mini');
      w.unmount();
      vi.unstubAllGlobals();
    });
  });

  describe('picture-in-picture', () => {
    it('hides the PiP button when the platform does not support it', async () => {
      const w = await mountPlayer({ src: '/clip.mp4' });
      const btn = w
        .findAll('.sn-video-player__button')
        .find((b) => b.attributes('aria-label') === '画中画');
      expect(btn).toBeUndefined();
      w.unmount();
    });

    it('requests PiP when supported and tracks the active state', async () => {
      Object.defineProperty(document, 'pictureInPictureEnabled', {
        configurable: true,
        value: true,
      });
      const requestSpy = vi.fn(() => Promise.resolve());
      Object.defineProperty(HTMLVideoElement.prototype, 'requestPictureInPicture', {
        configurable: true,
        value: requestSpy,
      });

      const w = await mountPlayer({ src: '/clip.mp4' });
      const btn = w
        .findAll('.sn-video-player__button')
        .find((b) => b.attributes('aria-label') === '画中画');
      expect(btn).toBeDefined();
      await btn!.trigger('click');
      expect(requestSpy).toHaveBeenCalledTimes(1);

      await videoEl(w).dispatchEvent(new Event('enterpictureinpicture'));
      expect(w.emitted('pip-change')?.[0]?.[0]).toBe(true);
      await videoEl(w).dispatchEvent(new Event('leavepictureinpicture'));
      expect(w.emitted('pip-change')?.[1]?.[0]).toBe(false);
      w.unmount();
      delete (HTMLVideoElement.prototype as { requestPictureInPicture?: unknown })
        .requestPictureInPicture;
      // Un-stub the platform flag so later tests see the default (unsupported).
      Reflect.deleteProperty(document, 'pictureInPictureEnabled');
    });
  });

  describe('fullscreen', () => {
    it('toggles web fullscreen via the exposed API', async () => {
      const w = await mountPlayer({ src: '/clip.mp4' });
      (w.vm as unknown as { toggleWebFullscreen: () => void }).toggleWebFullscreen();
      await nextTick();
      expect(root(w).classes()).toContain('sn-video-player--web-fullscreen');
      (w.vm as unknown as { toggleWebFullscreen: () => void }).toggleWebFullscreen();
      await nextTick();
      expect(root(w).classes()).not.toContain('sn-video-player--web-fullscreen');
      w.unmount();
    });
  });

  describe('error handling', () => {
    it('shows the error panel on a media error with a source and recovers via retry', async () => {
      const w = await mountPlayer({ src: '/missing.mp4' });
      // Wait for applySource to set the src (post-mount nextTick).
      await nextTick();
      expect(videoEl(w).getAttribute('src')).toBe('/missing.mp4');
      await videoEl(w).dispatchEvent(new Event('error'));
      expect(w.find('.sn-video-player__error').exists()).toBe(true);
      expect(w.emitted('error')).toHaveLength(1);

      const loadSpy = vi.spyOn(HTMLMediaElement.prototype, 'load');
      await w.find('.sn-video-player__error-retry').trigger('click');
      expect(loadSpy).toHaveBeenCalledTimes(1);
      w.unmount();
    });

    it('does not show an error before any source is assigned', async () => {
      const w = await mountPlayer({});
      expect(w.find('.sn-video-player__error').exists()).toBe(false);
      w.unmount();
    });
  });

  describe('keyboard shortcuts', () => {
    it('toggles playback with Space and seeks with arrows', async () => {
      const w = await mountPlayer({ src: '/clip.mp4' });
      stubDuration(videoEl(w), 60);
      await videoEl(w).dispatchEvent(new Event('loadedmetadata'));
      Object.defineProperty(videoEl(w), 'currentTime', {
        configurable: true,
        value: 10,
        writable: true,
      });
      // The player tracks the clock through `timeupdate` — mirror the event
      // flow so seek offsets land where a real browser would put them.
      await videoEl(w).dispatchEvent(new Event('timeupdate'));

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
      root(w).element.dispatchEvent(spaceEvent);
      expect(spaceEvent.defaultPrevented).toBe(true);

      const arrow = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      });
      root(w).element.dispatchEvent(arrow);
      expect(arrow.defaultPrevented).toBe(true);
      expect(videoEl(w).currentTime).toBe(15);
      w.unmount();
    });

    it('keeps shortcuts out of the danmu input', async () => {
      const w = await mountPlayer({ src: '/clip.mp4', danmus: [{ text: 'x', time: 0 }] });
      const input = w.find('.sn-video-player__danmu-input');
      await input.setValue('hello');
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      input.element.dispatchEvent(spaceEvent);
      expect(spaceEvent.defaultPrevented).toBe(false);
      w.unmount();
    });

    it('does nothing when shortcuts are disabled', async () => {
      const w = await mountPlayer({ src: '/clip.mp4', shortcuts: false });
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      root(w).element.dispatchEvent(spaceEvent);
      expect(spaceEvent.defaultPrevented).toBe(false);
      w.unmount();
    });
  });
});
