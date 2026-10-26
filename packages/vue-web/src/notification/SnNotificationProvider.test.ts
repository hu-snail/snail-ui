/**
 * SnNotificationProvider + useNotification tests — AUI-WEB-FB-012.
 *
 * Reference: naive-ui `n-notification-provider` / `useNotification`. These
 * tests pin:
 *   - the stack container contract: role="region", aria-label, placement
 *     class (default 'top-right'), teleport-to-body default and `to` prop;
 *   - the API surface: create / info / success / warning / error /
 *     destroyAll, the returned `destroy()` handle, and the `max` cap
 *     evicting the oldest entry first;
 *   - the destroy semantics: `onClose` fires on every destroy path;
 *   - the transition callbacks `onAfterEnter` / `onAfterLeave` firing from
 *     the stack's TransitionGroup hooks;
 *   - the no-provider path: structured `PROVIDER_MISSING` warning + no-op
 *     API that must not crash (§28/§83).
 */

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import SnNotificationProvider from './SnNotificationProvider.vue'
import { useNotification } from './use-notification'
import type { NotificationApi } from './notification-types'

/**
 * Mount the provider with a child that captures the injected API — the same
 * shape a real app uses (`useNotification()` inside the provider's subtree).
 */
function mountWithConsumer(
  props: Record<string, unknown> = {},
  stubs: Record<string, unknown> = { teleport: true, 'transition-group': true },
) {
  let capturedApi: NotificationApi | undefined
  const Consumer = defineComponent({
    name: 'NotificationConsumer',
    setup() {
      capturedApi = useNotification()
      return () => null
    },
  })
  const wrapper = mount(SnNotificationProvider, {
    props,
    slots: { default: () => h(Consumer) },
    global: { stubs },
  })
  const getApi = (): NotificationApi => {
    if (!capturedApi) {
      throw new Error('consumer never captured the notification API')
    }
    return capturedApi
  }
  return { wrapper, getApi }
}

const cardsOf = (wrapper: ReturnType<typeof mountWithConsumer>['wrapper']) =>
  wrapper.findAll('.sn-notification')

describe('SnNotificationProvider (AUI-WEB-FB-012)', () => {
  describe('stack container', () => {
    it('should render a region container with the accessibility labels', () => {
      const { wrapper } = mountWithConsumer()
      const container = wrapper.find('.sn-notification-container')

      expect(container.exists()).toBe(true)
      expect(container.attributes('role')).toBe('region')
      expect(container.attributes('aria-label')).toBe('Notifications')
      expect(container.attributes('data-snui-component')).toBe('notification-provider')
    })

    it('should default placement to top-right', () => {
      const { wrapper } = mountWithConsumer()

      expect(wrapper.find('.sn-notification-container').classes()).toContain(
        'sn-notification-container--top-right',
      )
    })

    it('should apply the placement modifier class', () => {
      const { wrapper } = mountWithConsumer({ placement: 'bottom-left' })

      expect(wrapper.find('.sn-notification-container').classes()).toContain(
        'sn-notification-container--bottom-left',
      )
    })

    it('should teleport the stack to body by default', () => {
      const { wrapper } = mountWithConsumer(
        {},
        { teleport: false, 'transition-group': true },
      )

      expect(document.querySelector('.sn-notification-container')).not.toBeNull()
      wrapper.unmount()
      expect(document.querySelector('.sn-notification-container')).toBeNull()
    })

    it('should honour the `to` teleport target', () => {
      const target = document.createElement('div')
      target.id = 'sn-notification-teleport-target'
      document.body.appendChild(target)

      try {
        const { wrapper } = mountWithConsumer(
          { to: '#sn-notification-teleport-target' },
          { teleport: false, 'transition-group': true },
        )

        expect(
          target.querySelector('.sn-notification-container'),
        ).not.toBeNull()
        wrapper.unmount()
      }
      finally {
        target.remove()
      }
    })
  })

  describe('useNotification API', () => {
    it('should create a card and force the type on per-type shortcuts', async () => {
      const { wrapper, getApi } = mountWithConsumer()

      getApi().create({ title: '来自 create' })
      getApi().success({ title: '来自 success' })
      getApi().error({ title: '来自 error' })
      await nextTick()

      const cards = cardsOf(wrapper)
      expect(cards).toHaveLength(3)
      expect(cards[1].classes()).toContain('sn-notification--success')
      expect(cards[2].classes()).toContain('sn-notification--error')
    })

    it('should render the built-in icon without missing-icon placeholders', async () => {
      const { wrapper, getApi } = mountWithConsumer()

      getApi().warning({ title: '配额不足', content: '当前已使用 90%' })
      await nextTick()

      expect(wrapper.find('.sn-notification__icon .sn-icon svg').exists()).toBe(true)
      expect(wrapper.findAll('.sn-icon--missing')).toHaveLength(0)
    })

    it('should force the type on per-type shortcuts even when options.type conflicts', async () => {
      const { wrapper, getApi } = mountWithConsumer()

      getApi().info({ type: 'success', title: '快捷方法强制 type' })
      await nextTick()

      expect(cardsOf(wrapper)[0].classes()).toContain('sn-notification--info')
    })

    it('should apply the scrollable modifier and containerStyle to the stack', () => {
      const { wrapper } = mountWithConsumer({
        scrollable: true,
        containerStyle: 'z-index: 9999;',
      })
      const container = wrapper.find('.sn-notification-container')

      expect(container.classes()).toContain('sn-notification-container--scrollable')
      expect(container.attributes('style')).toContain('z-index: 9999')
    })

    it('should return a handle whose destroy() removes the card', async () => {
      const { wrapper, getApi } = mountWithConsumer()

      const handle = getApi().create({ title: '会被手动关闭' })
      await nextTick()
      expect(cardsOf(wrapper)).toHaveLength(1)

      handle.destroy()
      await nextTick()
      expect(cardsOf(wrapper)).toHaveLength(0)
    })

    it('should fire onClose on the destroy() path', async () => {
      const { getApi } = mountWithConsumer()
      const onClose = vi.fn()

      const handle = getApi().create({ title: 'x', onClose })
      handle.destroy()

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should destroy all cards with destroyAll()', async () => {
      const { wrapper, getApi } = mountWithConsumer()

      getApi().create({ title: 'a' })
      getApi().create({ title: 'b' })
      await nextTick()
      expect(cardsOf(wrapper)).toHaveLength(2)

      getApi().destroyAll()
      await nextTick()
      expect(cardsOf(wrapper)).toHaveLength(0)
    })

    it('should evict the oldest card when max is exceeded', async () => {
      const { wrapper, getApi } = mountWithConsumer({ max: 2 })

      getApi().create({ title: '最旧' })
      getApi().create({ title: '中间' })
      getApi().create({ title: '最新' })
      await nextTick()

      const texts = cardsOf(wrapper).map((card) => card.find('.sn-notification__header').text())
      expect(texts).toEqual(['中间', '最新'])
    })

    it('should auto destroy after the entry duration', async () => {
      vi.useFakeTimers()
      try {
        const { wrapper, getApi } = mountWithConsumer()

        getApi().info({ title: '自动消失', duration: 100 })
        await nextTick()
        expect(cardsOf(wrapper)).toHaveLength(1)

        vi.advanceTimersByTime(100)
        await nextTick()
        expect(cardsOf(wrapper)).toHaveLength(0)
      }
      finally {
        vi.useRealTimers()
      }
    })
  })

  describe('transition callbacks', () => {
    beforeEach(() => {
      vi.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'],
      })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should fire onAfterEnter after the enter transition completes', async () => {
      const onAfterEnter = vi.fn()
      const { getApi } = mountWithConsumer(
        {},
        // Opt out of the VTU default stubs so the real TransitionGroup runs
        // its enter hooks; the happy-dom computed transition duration is 0,
        // so advancing the clock finishes the transition.
        { teleport: true, transition: false, 'transition-group': false },
      )

      getApi().create({ title: '进入回调', onAfterEnter })
      await nextTick()
      vi.advanceTimersByTime(100)

      expect(onAfterEnter).toHaveBeenCalledTimes(1)
    })

    it('should fire onAfterLeave after the leave transition completes', async () => {
      const onAfterLeave = vi.fn()
      const { getApi } = mountWithConsumer(
        {},
        { teleport: true, transition: false, 'transition-group': false },
      )

      const handle = getApi().create({ title: '离开回调', onAfterLeave })
      await nextTick()
      vi.advanceTimersByTime(100)

      handle.destroy()
      await nextTick()
      vi.advanceTimersByTime(100)

      expect(onAfterLeave).toHaveBeenCalledTimes(1)
    })
  })

  describe('useNotification without a provider', () => {
    it('should warn PROVIDER_MISSING and return a no-op API that never crashes', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        const Consumer = defineComponent({
          name: 'BareConsumer',
          setup() {
            const api = useNotification()
            return () => h('div', { class: 'bare-consumer' }, String(typeof api.create))
          },
        })
        const wrapper = mount(Consumer)

        expect(wrapper.find('.bare-consumer').text()).toBe('function')
        expect(warn).toHaveBeenCalledWith(
          expect.stringContaining('PROVIDER_MISSING'),
          expect.objectContaining({ code: 'PROVIDER_MISSING' }),
        )

        // Every no-op call must survive without throwing.
        const api = useNotification()
        expect(() => api.create({ title: 'x' }).destroy()).not.toThrow()
        expect(() => api.success({ title: 'x' })).not.toThrow()
        expect(() => api.destroyAll()).not.toThrow()
      }
      finally {
        warn.mockRestore()
      }
    })
  })
})
