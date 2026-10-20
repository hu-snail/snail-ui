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
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import SnVideoPreview from './SnVideoPreview.vue'
import { expectIconRendered, expectNoMissingIcons } from '../test-utils/icon-assertions'

/** Tiny inline sources: no network dependency, nothing to decode. */
const VIDEO_SRC = 'data:video/mp4;base64,AAAAIGZ0eXBpc29t'
const POSTER_SRC = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E'

/* ── Media method stubs ─────────────────────────────────────────────────── */

const originalPlay = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'play')
const originalPause = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'pause')

let playMock: ReturnType<typeof vi.fn>
let pauseMock: ReturnType<typeof vi.fn>

function installMediaStubs(): void {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: playMock,
  })
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    writable: true,
    value: pauseMock,
  })
}

function restoreMediaMethods(): void {
  for (const [name, descriptor] of [
    ['play', originalPlay],
    ['pause', originalPause],
  ] as const) {
    if (descriptor) Object.defineProperty(HTMLMediaElement.prototype, name, descriptor)
    else delete (HTMLMediaElement.prototype as unknown as Record<string, unknown>)[name]
  }
}

/* ── Mounting helpers ───────────────────────────────────────────────────── */

const mountedWrappers: Array<ReturnType<typeof mount>> = []

function mountVideo(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
): ReturnType<typeof mount> {
  const wrapper = mount(SnVideoPreview, {
    props: { src: VIDEO_SRC, ...props },
    slots,
    attachTo: document.body,
  })
  mountedWrappers.push(wrapper)
  return wrapper
}

type Wrapper = ReturnType<typeof mountVideo>

function videoOf(wrapper: Wrapper): ReturnType<Wrapper['find']> {
  return wrapper.find('video')
}

function previewTriggerOf(wrapper: Wrapper): ReturnType<Wrapper['find']> {
  return wrapper.find('button[aria-label="放大预览"]')
}

function overlayRoot(): Element | null {
  return document.querySelector('[data-snui-component="video-preview-overlay"]')
}

function closeButton(): HTMLElement | null {
  return document.querySelector('[aria-label="关闭"]')
}

beforeEach(() => {
  playMock = vi.fn(() => Promise.resolve())
  pauseMock = vi.fn()
  installMediaStubs()
})

afterEach(() => {
  for (const wrapper of mountedWrappers.splice(0)) wrapper.unmount()
  document.body.innerHTML = ''
  document.documentElement.style.overflow = ''
  restoreMediaMethods()
  vi.restoreAllMocks()
})

describe('SnVideoPreview (AUI-WEB-DD-011)', () => {
  describe('rendering', () => {
    it('should render the video box with src and poster', () => {
      const wrapper = mountVideo({ poster: POSTER_SRC })

      expect(wrapper.attributes('data-snui-component')).toBe('video-preview')
      const video = videoOf(wrapper)
      expect(video.exists()).toBe(true)
      expect(video.attributes('src')).toBe(VIDEO_SRC)
      expect(video.attributes('poster')).toBe(POSTER_SRC)
    })

    it('should default width to 320px and object-fit to cover', () => {
      const wrapper = mountVideo()

      expect(wrapper.element.style.width).toBe('320px')

      // The video fills the box, so the fit mode lives on the video element.
      expect(videoOf(wrapper).attributes('style')).toContain('object-fit: cover')
    })

    it('should accept numeric and string sizes', () => {
      const numeric = mountVideo({ width: 480, height: 270 })
      expect(numeric.element.style.width).toBe('480px')
      expect(numeric.element.style.height).toBe('270px')

      const stringly = mountVideo({ width: '20rem', objectFit: 'contain' })
      expect(stringly.element.style.width).toBe('20rem')
      expect(videoOf(stringly).attributes('style')).toContain('object-fit: contain')
    })

    it('should apply aspectRatio only while no explicit height is given', () => {
      const ratio = mountVideo({ aspectRatio: '16 / 9' })
      expect(ratio.element.style.aspectRatio).toBe('16 / 9')

      const explicit = mountVideo({ aspectRatio: '16 / 9', height: 180 })
      expect(explicit.element.style.height).toBe('180px')
      expect(explicit.element.style.aspectRatio).toBe('')
    })

    it('should render a centered play button with a real icon', () => {
      const wrapper = mountVideo()

      const button = wrapper.find('button[aria-label="播放视频"]')
      expect(button.exists()).toBe(true)
      expectIconRendered(button, '.sn-icon')
      expectNoMissingIcons(wrapper, 'SnVideoPreview')
    })

    it('should forward controls / loop / muted / preload to the video element', () => {
      const wrapper = mountVideo({ controls: true, loop: true, muted: true, preload: 'auto' })
      const video = videoOf(wrapper)

      expect(video.element.hasAttribute('controls')).toBe(true)
      expect(video.element.hasAttribute('loop')).toBe(true)
      expect((video.element as HTMLVideoElement).muted).toBe(true)
      expect(video.attributes('preload')).toBe('auto')
    })

    it('should omit native controls when controls is false', () => {
      const wrapper = mountVideo({ controls: false })

      expect(videoOf(wrapper).element.hasAttribute('controls')).toBe(false)
    })

    it('should use alt as the accessible name, falling back to title', () => {
      expect(videoOf(mountVideo({ title: '宣传片' })).attributes('aria-label')).toBe('宣传片')
      expect(
        videoOf(mountVideo({ title: '宣传片', alt: '产品宣传片' })).attributes('aria-label'),
      ).toBe('产品宣传片')
      expect(videoOf(mountVideo()).attributes('aria-label')).toBeUndefined()
    })
  })

  describe('inline playback', () => {
    it('should start playback when the play button is clicked', async () => {
      const wrapper = mountVideo({ poster: POSTER_SRC })
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true)

      await wrapper.find('button[aria-label="播放视频"]').trigger('click')

      expect(playMock).toHaveBeenCalledTimes(1)
      // The scrim is the poster state: playing hides it.
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(false)
    })

    it('should return to the poster state when the video pauses or ends', async () => {
      const wrapper = mountVideo()
      await wrapper.find('button[aria-label="播放视频"]').trigger('click')

      await videoOf(wrapper).trigger('pause')
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true)

      await wrapper.find('button[aria-label="播放视频"]').trigger('click')
      await videoOf(wrapper).trigger('ended')
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true)
    })

    it('should toggle play and pause by clicking the video when controls are off', async () => {
      const wrapper = mountVideo({ controls: false })

      await videoOf(wrapper).trigger('click')
      expect(playMock).toHaveBeenCalledTimes(1)

      await videoOf(wrapper).trigger('click')
      expect(pauseMock).toHaveBeenCalledTimes(1)
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true)
    })

    it('should leave video clicks to the native controls when controls are on', async () => {
      const wrapper = mountVideo({ controls: true })

      await videoOf(wrapper).trigger('click')
      expect(playMock).not.toHaveBeenCalled()
    })

    it('should emit play, pause, ended and error from the video element', async () => {
      const wrapper = mountVideo()

      await videoOf(wrapper).trigger('play')
      expect(wrapper.emitted('play')).toHaveLength(1)

      await videoOf(wrapper).trigger('pause')
      expect(wrapper.emitted('pause')).toHaveLength(1)

      await videoOf(wrapper).trigger('ended')
      expect(wrapper.emitted('ended')).toHaveLength(1)

      await videoOf(wrapper).trigger('error')
      expect(wrapper.emitted('error')).toHaveLength(1)
    })

    it('should expose play and pause imperatively', async () => {
      const wrapper = mountVideo()
      const vm = wrapper.vm as unknown as { play: () => void; pause: () => void }

      vm.play()
      expect(playMock).toHaveBeenCalledTimes(1)

      vm.pause()
      expect(pauseMock).toHaveBeenCalledTimes(1)
      await nextTick()
      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true)
    })

    it('should fall back to the poster state when play() rejects', async () => {
      playMock.mockImplementation(() => Promise.reject(new Error('autoplay blocked')))
      const wrapper = mountVideo()

      await wrapper.find('button[aria-label="播放视频"]').trigger('click')
      await nextTick()
      await nextTick()

      expect(wrapper.find('.sn-video-preview__mask').exists()).toBe(true)
    })
  })

  describe('preview overlay', () => {
    it('should hide the toolbar affordance when previewDisabled', () => {
      const wrapper = mountVideo({ previewDisabled: true })

      expect(previewTriggerOf(wrapper).exists()).toBe(false)
      expect(overlayRoot()).toBeNull()
    })

    it('should hide the toolbar affordance when showToolbar is false', () => {
      expect(previewTriggerOf(mountVideo({ showToolbar: false })).exists()).toBe(false)
    })

    it('should open the overlay, emit preview and move focus into the dialog', async () => {
      const wrapper = mountVideo({ title: '宣传片' })

      await previewTriggerOf(wrapper).trigger('click')
      await nextTick()
      await nextTick()

      const root = overlayRoot()
      expect(root).not.toBeNull()
      expect(root?.getAttribute('role')).toBe('dialog')
      expect(root?.getAttribute('aria-modal')).toBe('true')
      expect(root?.getAttribute('aria-label')).toBe('宣传片')
      expect(wrapper.emitted('preview')).toHaveLength(1)
      expect(document.activeElement).toBe(closeButton())
    })

    it('should show the (larger) preview src in the overlay', async () => {
      const wrapper = mountVideo({ previewSrc: 'data:video/mp4;base64,PREVIEW' })
      await previewTriggerOf(wrapper).trigger('click')
      await nextTick()

      expect(overlayRoot()?.querySelector('video')?.getAttribute('src')).toBe(
        'data:video/mp4;base64,PREVIEW',
      )
    })

    it('should close on Escape, emit close and return focus to the trigger', async () => {
      const wrapper = mountVideo()
      await previewTriggerOf(wrapper).trigger('click')
      await nextTick()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await nextTick()
      await nextTick()

      expect(overlayRoot()).toBeNull()
      expect(wrapper.emitted('close')).toHaveLength(1)
      expect(document.activeElement).toBe(previewTriggerOf(wrapper).element)
    })

    it('should close on mask click and lock page scroll meanwhile', async () => {
      const wrapper = mountVideo()
      await previewTriggerOf(wrapper).trigger('click')
      await nextTick()

      expect(document.documentElement.style.overflow).toBe('hidden')

      document
        .querySelector('.sn-video-preview-overlay__mask')!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await nextTick()
      await nextTick()

      expect(overlayRoot()).toBeNull()
      expect(wrapper.emitted('close')).toHaveLength(1)
      expect(document.documentElement.style.overflow).toBe('')
    })

    it('should keep the overlay open on mask click when closeOnMaskClick is false', async () => {
      const wrapper = mountVideo({ closeOnMaskClick: false })
      await previewTriggerOf(wrapper).trigger('click')
      await nextTick()

      document
        .querySelector('.sn-video-preview-overlay__mask')!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await nextTick()

      expect(overlayRoot()).not.toBeNull()
      expect(wrapper.emitted('close')).toBeUndefined()
    })

    it('should open and close the overlay through the exposed methods', async () => {
      const wrapper = mountVideo()
      const vm = wrapper.vm as unknown as { showPreview: () => void; closePreview: () => void }

      vm.showPreview()
      await nextTick()
      expect(overlayRoot()).not.toBeNull()

      vm.closePreview()
      await nextTick()
      await nextTick()
      expect(overlayRoot()).toBeNull()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('should make showPreview a no-op when previewDisabled', async () => {
      const wrapper = mountVideo({ previewDisabled: true })
      const vm = wrapper.vm as unknown as { showPreview: () => void }

      vm.showPreview()
      await nextTick()

      expect(overlayRoot()).toBeNull()
      expect(wrapper.emitted('preview')).toBeUndefined()
    })
  })

  describe('slots', () => {
    it('should render the placeholder slot while the video has not started', async () => {
      const wrapper = mountVideo({}, { placeholder: '<span class="demo-placeholder">加载中</span>' })

      expect(wrapper.find('.sn-video-preview__placeholder').exists()).toBe(true)
      expect(wrapper.find('.demo-placeholder').exists()).toBe(true)

      await wrapper.find('button[aria-label="播放视频"]').trigger('click')
      expect(wrapper.find('.sn-video-preview__placeholder').exists()).toBe(false)
    })

    it('should replace the play glyph through the play-icon slot', () => {
      const wrapper = mountVideo({}, { 'play-icon': '<span class="demo-glyph" />' })

      const button = wrapper.find('button[aria-label="播放视频"]')
      expect(button.find('.demo-glyph').exists()).toBe(true)
      expect(button.find('.sn-icon').exists()).toBe(false)
    })

    it('should replace the overlay affordance through the toolbar slot', async () => {
      // The slot receives `showPreview` so a custom affordance can still open
      // the overlay (the default button is gone).
      const wrapper = mountVideo({}, {
        toolbar: (params: { showPreview: () => void }) =>
          h('button', { class: 'demo-expand', onClick: params.showPreview }),
      })
      const expand = wrapper.find('.demo-expand')

      expect(expand.exists()).toBe(true)
      expect(previewTriggerOf(wrapper).exists()).toBe(false)

      await expand.trigger('click')
      await nextTick()
      expect(overlayRoot()).not.toBeNull()
      expect(wrapper.emitted('preview')).toHaveLength(1)
    })
  })

  describe('dispose', () => {
    it('should pause the video and drop its source on unmount', () => {
      const wrapper = mountVideo({ poster: POSTER_SRC })
      const video = videoOf(wrapper).element as HTMLVideoElement

      wrapper.unmount()

      expect(pauseMock).toHaveBeenCalledTimes(1)
      expect(video.hasAttribute('src')).toBe(false)
    })

    it('should remove the overlay keydown listener on unmount', async () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener')
      const wrapper = mountVideo()

      await previewTriggerOf(wrapper).trigger('click')
      await nextTick()
      wrapper.unmount()

      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })
})