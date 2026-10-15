import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SnBackTop from './SnBackTop.vue'

/**
 * Scroll behaviour tests.
 *
 * Harness notes (same conventions as `SnAffix.test.ts`):
 *
 * 1. `SnBackTop` resolves its scroll container to `document` when no
 *    scrollable ancestor exists. happy-dom does not propagate
 *    `window.dispatchEvent` to `document` listeners, so these tests dispatch
 *    the `scroll` event on `document` directly.
 *
 * 2. Scroll offset is stubbed through `document.documentElement.scrollTop`,
 *    which is what `readScrollTop()` reads for a document container.
 *
 * 3. Visibility is a `v-if` inside a `<Transition>`. @vue/test-utils stubs
 *    transitions by default, and a `transition-stub` does not render its
 *    `v-if` child into the DOM, so every test must disable the stub
 *    (`global.stubs.transition = false`). A `nextTick()` (twice, to flush
 *    the state then the render) is needed after moving the scroll position.
 */

/** Drive `document.documentElement.scrollTop` and fire a document scroll. */
async function scrollTo(top: number, eventTarget: EventTarget = document): Promise<void> {
  Object.defineProperty(document.documentElement, 'scrollTop', {
    configurable: true,
    get: () => top,
  })
  eventTarget.dispatchEvent(new Event('scroll'))
  await nextTick()
  await nextTick()
}

function mountBackTop(props: Record<string, unknown> = {}) {
  Object.defineProperty(document.documentElement, 'scrollTop', {
    configurable: true,
    writable: true,
    value: 0,
  })
  const wrapper = mount(SnBackTop, {
    props,
    slots: { default: '<span class="custom-content">up</span>' },
    attachTo: document.body,
    global: { stubs: { transition: false } },
  })
  return wrapper
}

function buttonOf(wrapper: ReturnType<typeof mount>): HTMLElement | null {
  return wrapper.find('button[data-snui-component="back-top"]')
    .element as HTMLElement | null
}

describe('SnBackTop', () => {
  beforeEach(() => {
    // Suppress the intentional deprecation warnings.
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    it('should not render the button before reaching visibilityHeight', async () => {
      const wrapper = mountBackTop({ visibilityHeight: 180 })
      await scrollTo(100)
      expect(wrapper.find('button[data-snui-component="back-top"]').exists()).toBe(false)
    })

    it('should render the button once the scroll passes visibilityHeight', async () => {
      const wrapper = mountBackTop({ visibilityHeight: 180 })
      await scrollTo(200)

      const button = wrapper.find('button[data-snui-component="back-top"]')
      expect(button.exists()).toBe(true)
      expect(button.attributes('data-snui-component')).toBe('back-top')
    })

    it('should render the default slot in place of the built-in icon', async () => {
      const wrapper = mountBackTop({ visibilityHeight: 0 })
      await scrollTo(10)
      expect(wrapper.find('.custom-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('up')
    })

    it('should label the button for assistive technology', async () => {
      const wrapper = mountBackTop({ visibilityHeight: 0 })
      await scrollTo(10)
      expect(
        wrapper.find('button[data-snui-component="back-top"]').attributes('aria-label'),
      ).toBe('回到顶部')
    })
  })

  describe('visibility threshold', () => {
    it('should treat exactly visibilityHeight as visible', async () => {
      const wrapper = mountBackTop({ visibilityHeight: 180 })
      await scrollTo(180)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should hide again when scrolling back above the threshold', async () => {
      const wrapper = mountBackTop({ visibilityHeight: 180 })
      await scrollTo(200)
      expect(wrapper.find('button').exists()).toBe(true)

      await scrollTo(20)
      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('should default visibilityHeight to 180', async () => {
      const wrapper = mountBackTop()
      await scrollTo(100)
      expect(wrapper.find('button').exists()).toBe(false)
      await scrollTo(181)
      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  describe('positioning', () => {
    it('should apply the default right/bottom offsets', async () => {
      const wrapper = mountBackTop({ visibilityHeight: 0 })
      await scrollTo(10)
      const el = buttonOf(wrapper)
      expect(el?.style.right).toBe('40px')
      expect(el?.style.bottom).toBe('40px')
    })

    it('should accept numeric and string offsets', async () => {
      const wrapper = mountBackTop({
        visibilityHeight: 0,
        right: 24,
        bottom: '10%',
      })
      await scrollTo(10)
      const el = buttonOf(wrapper)
      expect(el?.style.right).toBe('24px')
      expect(el?.style.bottom).toBe('10%')
    })
  })

  describe('controlled show', () => {
    it('should ignore scroll when the show prop is provided', async () => {
      const wrapper = mountBackTop({ show: false, visibilityHeight: 0 })
      await scrollTo(500)
      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('should render when controlled show is true', async () => {
      const wrapper = mountBackTop({ show: true })
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should emit update:show when visibility changes after mount', async () => {
      const onUpdateShow = vi.fn()
      mountBackTop({ visibilityHeight: 180, onUpdateShow })
      // First scroll latches the initial geometry; no emit yet.
      await scrollTo(0)
      expect(onUpdateShow).not.toHaveBeenCalled()

      await scrollTo(200)
      expect(onUpdateShow).toHaveBeenCalledWith(true)

      await scrollTo(0)
      expect(onUpdateShow).toHaveBeenLastCalledWith(false)
    })
  })

  describe('scrolling to top', () => {
    it('should scroll the container to 0 on click', async () => {
      const wrapper = mountBackTop({ visibilityHeight: 0 })
      await scrollTo(300)

      const scrollToSpy = vi.fn()
      document.documentElement.scrollTo = scrollToSpy

      await wrapper.find('button[data-snui-component="back-top"]').trigger('click')
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })

    it('should expose scrollToTop imperatively', async () => {
      const wrapper = mountBackTop({ visibilityHeight: 0 })
      await scrollTo(300)

      const scrollToSpy = vi.fn()
      document.documentElement.scrollTo = scrollToSpy

      ;(wrapper.vm as unknown as { scrollToTop: () => void }).scrollToTop()
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })
  })

  describe('listenTo', () => {
    it('should listen to and clean up a custom element target', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const addSpy = vi.spyOn(container, 'addEventListener')
      const removeSpy = vi.spyOn(container, 'removeEventListener')

      const wrapper = mount(SnBackTop, {
        props: { listenTo: container },
        slots: { default: '<span />' },
      })

      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      wrapper.unmount()
      expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))

      container.remove()
    })

    it('should resolve a selector string to an element', () => {
      const container = document.createElement('div')
      container.id = 'sn-back-top-scroll-host'
      document.body.appendChild(container)
      const addSpy = vi.spyOn(container, 'addEventListener')

      const wrapper = mount(SnBackTop, {
        props: { listenTo: '#sn-back-top-scroll-host' },
        slots: { default: '<span />' },
      })

      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      wrapper.unmount()
      container.remove()
    })

    it('should support a listenTo getter function', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const addSpy = vi.spyOn(container, 'addEventListener')

      const wrapper = mount(SnBackTop, {
        props: { listenTo: () => container },
        slots: { default: '<span />' },
      })

      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      wrapper.unmount()
      container.remove()
    })

    it('should read scrollTop from a custom container', async () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      Object.defineProperty(container, 'scrollTop', {
        configurable: true,
        get: () => 500,
      })

      const wrapper = mount(SnBackTop, {
        props: { listenTo: container, visibilityHeight: 180 },
        slots: { default: '<span />' },
      })
      await nextTick()

      expect(wrapper.find('button').exists()).toBe(true)
      wrapper.unmount()
      container.remove()
    })
  })

  describe('dispose', () => {
    it('should remove the document scroll listener on unmount', () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener')
      const wrapper = mount(SnBackTop, { slots: { default: '<span />' } })
      wrapper.unmount()
      expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    })

    it('should not react to scroll after unmount', async () => {
      const wrapper = mountBackTop({ visibilityHeight: 180 })
      await scrollTo(200)
      expect(wrapper.find('button').exists()).toBe(true)

      wrapper.unmount()
      // The listener is gone, so this must be a no-op rather than a throw.
      await expect(scrollTo(0)).resolves.toBeUndefined()
    })
  })

  describe('deprecation', () => {
    it('should warn when the deprecated target prop is used', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(SnBackTop, {
        props: { target: () => document.body },
        slots: { default: '<span />' },
      })
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('deprecated'))
    })

    it('should warn when the deprecated on-show / on-hide props are used', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(SnBackTop, {
        props: { onShow: () => {}, onHide: () => {} },
        slots: { default: '<span />' },
      })
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('deprecated'))
    })

    it('should use the deprecated target as the scroll container', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const addSpy = vi.spyOn(container, 'addEventListener')

      const wrapper = mount(SnBackTop, {
        props: { target: () => container },
        slots: { default: '<span />' },
      })

      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      wrapper.unmount()
      container.remove()
    })
  })
})
