import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SnAffix from './SnAffix.vue'

/**
 * Scroll behaviour tests.
 *
 * Harness notes — the first two are essential, and getting either wrong
 * produces results that look like component bugs but are artifacts:
 *
 * 1. happy-dom performs no layout, so `getBoundingClientRect()` returns all
 *    zeros unless stubbed. We patch `Element.prototype.getBoundingClientRect`
 *    so that the component's MOUNT-TIME measurement already sees the intended
 *    geometry. Stubbing a single element after `mount()` is too late: the
 *    mount measurement has already latched a state from zero rects, and the
 *    release path is only evaluated on later scrolls.
 *
 * 2. `SnAffix` listens for `scroll` on the resolved target, which defaults to
 *    `document` (mirroring n-affix). happy-dom does not propagate
 *    `window.dispatchEvent` to `document` listeners, so these tests dispatch
 *    on `document` (or on the custom target) directly.
 *
 * Rect geometry is driven through a mutable `currentRect` that the patched
 * prototype reads, so tests can move the element between frames.
 */

function rectOf(top: number, bottom: number): DOMRect {
  return {
    top,
    bottom,
    left: 0,
    right: 0,
    width: 0,
    height: bottom - top,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}

/** Wait for the rAF-coalesced measurement to run, then flush Vue. */
async function nextFrame(): Promise<void> {
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  await nextTick()
}

interface Harness {
  wrapper: ReturnType<typeof mount>
  el: HTMLElement
  /** Move the element to a viewport position and fire a scroll event. */
  scrollTo: (
    top: number,
    bottom: number,
    scrollY: number,
    eventTarget?: EventTarget,
  ) => Promise<void>
  isAffixed: () => boolean
}

/**
 * Mount `<SnAffix>` with the element starting at `top`/`bottom` in the
 * viewport. `scrollY` starts at 0.
 */
function mountAffix(
  props: Record<string, unknown>,
  top: number,
  bottom: number,
): Harness {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    get: () => 0,
  })

  let currentRect = rectOf(top, bottom)
  const original = Element.prototype.getBoundingClientRect
  Element.prototype.getBoundingClientRect = function () {
    return currentRect
  }

  const wrapper = mount(SnAffix, {
    props,
    slots: { default: '<span class="inner">pinned</span>' },
    attachTo: document.body,
  })

  // Restore immediately: from here on only the component's own element needs
  // the stub, and the tests patch it per-frame via `currentRect`.
  Element.prototype.getBoundingClientRect = original
  const el = wrapper.element as HTMLElement
  el.getBoundingClientRect = () => currentRect

  return {
    wrapper,
    el,
    isAffixed: () => wrapper.classes().includes('sn-affix--affixed'),
    async scrollTo(nextTop, nextBottom, scrollY, eventTarget = document) {
      currentRect = rectOf(nextTop, nextBottom)
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        get: () => scrollY,
      })
      eventTarget.dispatchEvent(new Event('scroll'))
      await nextFrame()
    },
  }
}

describe('SnAffix', () => {
  beforeEach(() => {
    // Suppress the intentional deprecation warnings.
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('should render the default slot', () => {
      const { wrapper } = mountAffix({ top: 10 }, 400, 440)
      expect(wrapper.find('.inner').exists()).toBe(true)
      expect(wrapper.text()).toContain('pinned')
    })

    it('should expose the data-snui-component hook', () => {
      const { wrapper } = mountAffix({ top: 10 }, 400, 440)
      expect(wrapper.attributes('data-snui-component')).toBe('affix')
    })

    it('should not affix while below the threshold', async () => {
      const { el, scrollTo, isAffixed } = mountAffix(
        { triggerTop: 50, top: 50 },
        400,
        440,
      )
      await scrollTo(180, 220, 20)
      expect(isAffixed()).toBe(false)
      expect(el.style.top).toBe('')
    })
  })

  describe('top sticking', () => {
    /** Element starts well below the 50px threshold. */
    function mountBelowThreshold() {
      return mountAffix({ triggerTop: 50, top: 50 }, 400, 440)
    }

    it('should affix once the element reaches the triggerTop threshold', async () => {
      const { el, scrollTo, isAffixed } = mountBelowThreshold()
      expect(isAffixed()).toBe(false)

      // Element top now sits 40px from the viewport top — past the 50px
      // threshold.
      await scrollTo(40, 80, 400)

      expect(isAffixed()).toBe(true)
      expect(el.style.top).toBe('50px')
    })

    it('should stay affixed while scrolled further past the threshold', async () => {
      const { scrollTo, isAffixed } = mountBelowThreshold()
      await scrollTo(40, 80, 400)
      expect(isAffixed()).toBe(true)

      await scrollTo(10, 50, 430)
      expect(isAffixed()).toBe(true)
    })

    it('should release when scrolling back above the recorded trigger point', async () => {
      const { scrollTo, isAffixed } = mountBelowThreshold()
      await scrollTo(40, 80, 400)
      expect(isAffixed()).toBe(true)

      // Affixing latched at 400 - (50 - 40) = 390; back at 350 is above it.
      await scrollTo(90, 130, 350)
      expect(isAffixed()).toBe(false)
    })

    it('should fall back to `top` when triggerTop is omitted', async () => {
      const { el, scrollTo, isAffixed } = mountAffix({ top: 30 }, 400, 440)
      await scrollTo(25, 65, 500)
      expect(isAffixed()).toBe(true)
      expect(el.style.top).toBe('30px')
    })

    it('should accept the deprecated offsetTop as a fallback', async () => {
      const { scrollTo, isAffixed } = mountAffix(
        { offsetTop: 50, top: 50 },
        400,
        440,
      )
      await scrollTo(40, 80, 400)
      expect(isAffixed()).toBe(true)
    })

    it('should not affix without a top/triggerTop prop', async () => {
      const { scrollTo, isAffixed } = mountAffix({}, 400, 440)
      await scrollTo(-500, -460, 900)
      expect(isAffixed()).toBe(false)
    })
  })

  describe('bottom sticking', () => {
    /** Viewport is 768 tall in happy-dom; the element bottom must sit
     *  within `triggerBottom` of the viewport bottom. */
    function mountNearBottom() {
      return mountAffix({ triggerBottom: 60, bottom: 60 }, 558, 720)
    }

    it('should affix to the bottom when within the triggerBottom threshold', async () => {
      const { el, scrollTo, isAffixed } = mountNearBottom()
      // innerHeight(768) - bottom(720) = 48 <= 60 → affix.
      await scrollTo(558, 720, 0)

      expect(isAffixed()).toBe(true)
      expect(el.style.bottom).toBe('60px')
    })

    it('should expose the deprecated offsetBottom as a fallback', async () => {
      const { scrollTo, isAffixed } = mountAffix(
        { offsetBottom: 60, bottom: 60 },
        558,
        720,
      )
      await scrollTo(558, 720, 0)
      expect(isAffixed()).toBe(true)
    })

    it('should not bottom-affix when far from the viewport bottom', async () => {
      const { scrollTo, isAffixed } = mountAffix(
        { triggerBottom: 60, bottom: 60 },
        100,
        140,
      )
      await scrollTo(100, 140, 0)
      expect(isAffixed()).toBe(false)
    })
  })

  describe('position', () => {
    it('should mark the absolute-positioned variant', async () => {
      const { wrapper, scrollTo, isAffixed } = mountAffix(
        { top: 10, position: 'absolute' },
        400,
        440,
      )
      expect(wrapper.classes()).toContain('sn-affix--absolute-positioned')

      await scrollTo(5, 45, 500)
      expect(isAffixed()).toBe(true)
      expect(wrapper.classes()).toContain('sn-affix--absolute-positioned')
    })
  })

  describe('listenTo', () => {
    it('should listen to and clean up a custom element target', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const addSpy = vi.spyOn(container, 'addEventListener')
      const removeSpy = vi.spyOn(container, 'removeEventListener')

      const wrapper = mount(SnAffix, {
        props: { listenTo: container, triggerTop: 10, top: 10 },
        slots: { default: '<span />' },
      })

      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      wrapper.unmount()
      expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))

      container.remove()
    })

    it('should resolve a selector string to an element', () => {
      const container = document.createElement('div')
      container.id = 'sn-affix-scroll-host'
      document.body.appendChild(container)
      const addSpy = vi.spyOn(container, 'addEventListener')

      const wrapper = mount(SnAffix, {
        props: { listenTo: '#sn-affix-scroll-host', triggerTop: 10, top: 10 },
        slots: { default: '<span />' },
      })

      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      wrapper.unmount()
      container.remove()
    })
  })

  describe('dispose', () => {
    it('should remove the document scroll listener on unmount', () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener')
      const wrapper = mount(SnAffix, {
        props: { top: 10 },
        slots: { default: '<span />' },
      })
      wrapper.unmount()
      expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    })

    it('should not react to scroll after unmount', async () => {
      const h = mountAffix({ triggerTop: 50, top: 50 }, 400, 440)
      h.wrapper.unmount()
      // The listener is removed, so this must be a no-op rather than a throw.
      await expect(h.scrollTo(10, 50, 500)).resolves.toBeUndefined()
      expect(h.el.style.top).toBe('')
    })
  })

  describe('deprecation', () => {
    it('should warn when the deprecated target prop is used', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(SnAffix, {
        props: { target: () => document.body, top: 10 },
        slots: { default: '<span />' },
      })
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('deprecated'))
    })

    it('should honour the deprecated target as the scroll container', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const addSpy = vi.spyOn(container, 'addEventListener')

      const wrapper = mount(SnAffix, {
        props: { target: () => container, top: 10 },
        slots: { default: '<span />' },
      })

      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      wrapper.unmount()
      container.remove()
    })
  })
})
