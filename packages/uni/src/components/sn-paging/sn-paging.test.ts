/**
 * sn-paging unit tests — uni-end pull-to-refresh + load-more container.
 *
 * Behaviour only (AGENTS.md §46): the query/complete contract, page
 * aggregation, no-more inference, failure retry, the refresher lock and the
 * empty view. `scroll-view` renders as a plain host element here, so gesture
 * handlers are driven via element events and the custom `#refresher` slot
 * content (dropped for host elements) is covered by code review instead.
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SnPaging from './sn-paging.vue'

/** v-model round-trip harness: every `update:modelValue` rebinds the prop. */
function mountPaging(props: Record<string, unknown> = {}) {
  const list: unknown[] = []
  const wrapper = mount(SnPaging, {
    props: {
      ...props,
      modelValue: [],
      'onUpdate:modelValue': (value: unknown[]) => {
        list.length = 0
        list.push(...value)
        void wrapper.setProps({ modelValue: [...value] })
      },
    },
  })
  return { wrapper, list: () => [...list] }
}

/** Let the re-bind from `update:modelValue` land before asserting on it. */
async function flush(): Promise<void> {
  await nextTick()
  await nextTick()
}

function queryCalls(wrapper: ReturnType<typeof mount>): unknown[][] {
  return wrapper.emitted('query') ?? []
}

afterEach(() => {
  vi.useRealTimers()
})

describe('sn-paging', () => {
  describe('query flow', () => {
    it('fires the first query automatically on mount', () => {
      const { wrapper } = mountPaging()
      expect(queryCalls(wrapper)).toEqual([[1, 10]])
    })

    it('does not query on mount when auto is false', () => {
      const { wrapper } = mountPaging({ auto: false })
      expect(queryCalls(wrapper)).toHaveLength(0)
    })

    it('emits the configured first page and page size', () => {
      const { wrapper } = mountPaging({ defaultPageNo: 2, defaultPageSize: 15 })
      expect(queryCalls(wrapper)).toEqual([[2, 15]])
    })
  })

  describe('refresh', () => {
    it('refresh() resets to the first page and locks the refresher', async () => {
      const { wrapper } = mountPaging()
      wrapper.vm.completeByTotal(['a', 'b'], 30)
      await flush()
      await wrapper.find('scroll-view').trigger('scrolltolower')
      expect(queryCalls(wrapper)[1]).toEqual([2, 10])
      wrapper.vm.completeByTotal(['c'], 30)
      await flush()

      wrapper.vm.refresh()
      expect(queryCalls(wrapper)[2]).toEqual([1, 10])
      await flush()
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('true')
    })

    it('reload() refreshes without locking the refresher', async () => {
      const { wrapper } = mountPaging()
      wrapper.vm.completeByTotal(['a', 'b'], 30)
      await flush()

      wrapper.vm.reload()
      expect(queryCalls(wrapper)[1]).toEqual([1, 10])
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false')
    })

    it('a pull gesture queries page 1 and locks the refresher', async () => {
      const { wrapper } = mountPaging()
      wrapper.vm.completeByTotal(['a'], 30)
      await flush()

      await wrapper.find('scroll-view').trigger('refresherrefresh')
      expect(queryCalls(wrapper)[1]).toEqual([1, 10])
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('true')
    })

    it('a pull gesture while loading collapses instead of stacking a query', async () => {
      const { wrapper } = mountPaging()
      await wrapper.find('scroll-view').trigger('refresherrefresh')
      expect(queryCalls(wrapper)).toHaveLength(1)
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false')
    })

    it('refresherpulling only arms the visual state, no extra query', async () => {
      const { wrapper } = mountPaging()
      await wrapper
        .find('scroll-view')
        .trigger('refresherpulling', { detail: { dy: 80 } })
      expect(queryCalls(wrapper)).toHaveLength(1)
    })

    it('a failed refresh keeps an existing list and stays silent', async () => {
      const { wrapper, list } = mountPaging()
      wrapper.vm.completeByTotal(['a', 'b'], 30)
      await flush()

      wrapper.vm.refresh()
      wrapper.vm.complete(false)
      await flush()
      expect(list()).toEqual(['a', 'b'])
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('点击加载更多')
    })
  })

  describe('load-more', () => {
    it('aggregates pages via v-model until the total is reached', async () => {
      const { wrapper, list } = mountPaging({ defaultPageSize: 2 })
      wrapper.vm.completeByTotal(['a', 'b'], 5)
      await flush()
      expect(list()).toEqual(['a', 'b'])

      await wrapper.find('scroll-view').trigger('scrolltolower')
      expect(queryCalls(wrapper)[1]).toEqual([2, 2])
      wrapper.vm.completeByTotal(['c', 'd'], 5)
      await flush()
      expect(list()).toEqual(['a', 'b', 'c', 'd'])

      await wrapper.find('scroll-view').trigger('scrolltolower')
      wrapper.vm.completeByTotal(['e'], 5)
      await flush()
      expect(list()).toEqual(['a', 'b', 'c', 'd', 'e'])
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('没有更多了')

      await wrapper.find('scroll-view').trigger('scrolltolower')
      expect(queryCalls(wrapper)).toHaveLength(3)
    })

    it('infers no-more when a page is shorter than pageSize', async () => {
      const { wrapper } = mountPaging()
      wrapper.vm.complete(['a', 'b', 'c'])
      await flush()
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('没有更多了')

      await wrapper.find('scroll-view').trigger('scrolltolower')
      expect(queryCalls(wrapper)).toHaveLength(1)
    })

    it('completeByNoMore(false) keeps the sequence going', async () => {
      const { wrapper } = mountPaging()
      wrapper.vm.completeByNoMore(['a', 'b'], false)
      await flush()
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('点击加载更多')

      await wrapper.find('scroll-view').trigger('scrolltolower')
      expect(queryCalls(wrapper)[1]).toEqual([2, 10])
    })

    it('is ignored while a query is in flight', async () => {
      const { wrapper } = mountPaging()
      await wrapper.find('scroll-view').trigger('scrolltolower')
      expect(queryCalls(wrapper)).toHaveLength(1)
    })

    it('is ignored before the first load completed', async () => {
      const { wrapper } = mountPaging({ auto: false })
      await wrapper.find('scroll-view').trigger('scrolltolower')
      expect(queryCalls(wrapper)).toHaveLength(0)
    })

    it('loadMoreEnabled=false removes the footer and the gesture', async () => {
      const { wrapper } = mountPaging({ loadMoreEnabled: false })
      wrapper.vm.completeByTotal(['a', 'b'], 30)
      await flush()
      expect(wrapper.find('.sn-paging__footer').exists()).toBe(false)

      await wrapper.find('scroll-view').trigger('scrolltolower')
      expect(queryCalls(wrapper)).toHaveLength(1)
    })

    it('tapping the idle footer loads the next page manually', async () => {
      const { wrapper } = mountPaging()
      wrapper.vm.completeByTotal(['a'], 30)
      await flush()

      await wrapper.find('.sn-paging__footer').trigger('click')
      expect(queryCalls(wrapper)[1]).toEqual([2, 10])
    })
  })

  describe('failures', () => {
    it('a failed initial load shows the fail footer and retry restarts page 1', async () => {
      const { wrapper } = mountPaging()
      wrapper.vm.complete(false)
      await flush()
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('加载失败，点击重试')
      expect(wrapper.find('.sn-paging__footer-text--fail').exists()).toBe(true)
      expect(wrapper.find('.sn-paging__empty').exists()).toBe(false)

      await wrapper.find('.sn-paging__footer').trigger('click')
      expect(queryCalls(wrapper)[1]).toEqual([1, 10])
    })

    it('a failed load-more retry re-emits the same page', async () => {
      const { wrapper } = mountPaging()
      wrapper.vm.completeByTotal(['a', 'b'], 30)
      await flush()

      await wrapper.find('scroll-view').trigger('scrolltolower')
      wrapper.vm.complete(false)
      await flush()
      expect(wrapper.find('.sn-paging__footer-text').text()).toBe('加载失败，点击重试')

      await wrapper.find('.sn-paging__footer').trigger('click')
      expect(queryCalls(wrapper)[2]).toEqual([2, 10])
    })

    it('double complete is ignored', async () => {
      const { wrapper } = mountPaging()
      wrapper.vm.complete(['a'])
      wrapper.vm.complete(['b'])
      await flush()
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    })
  })

  describe('refresher animation', () => {
    it('holds the success text for the duration then collapses', async () => {
      vi.useFakeTimers()
      const { wrapper } = mountPaging()
      wrapper.vm.completeByTotal(['a'], 30)
      await flush()

      wrapper.vm.refresh()
      wrapper.vm.complete(['z'])
      await flush()
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('true')

      vi.advanceTimersByTime(500)
      await flush()
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false')
    })

    it('refresherCompleteDuration 0 collapses immediately', async () => {
      const { wrapper } = mountPaging({ refresherCompleteDuration: 0 })
      wrapper.vm.completeByTotal(['a'], 30)
      await flush()

      wrapper.vm.refresh()
      wrapper.vm.complete(['z'])
      await flush()
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false')
    })

    it('a failed refresh collapses immediately, without the success hold', async () => {
      vi.useFakeTimers()
      const { wrapper } = mountPaging()
      wrapper.vm.completeByTotal(['a'], 30)
      await flush()

      wrapper.vm.refresh()
      wrapper.vm.complete(false)
      await flush()
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false')
      vi.advanceTimersByTime(1000)
      await flush()
      expect(wrapper.find('scroll-view').attributes('refresher-triggered')).toBe('false')
    })
  })

  describe('empty view', () => {
    it('appears after an empty first load, with no footer', async () => {
      const { wrapper } = mountPaging()
      wrapper.vm.complete([])
      await flush()
      expect(wrapper.find('.sn-paging__empty').exists()).toBe(true)
      expect(wrapper.find('.sn-paging__empty-text').text()).toBe('暂无数据')
      expect(wrapper.find('.sn-paging__footer').exists()).toBe(false)
    })

    it('stays hidden while loading and before the first load', async () => {
      const loading = mountPaging()
      expect(loading.wrapper.find('.sn-paging__empty').exists()).toBe(false)

      const idle = mountPaging({ auto: false })
      await flush()
      expect(idle.wrapper.find('.sn-paging__empty').exists()).toBe(false)
    })

    it('renders the custom empty slot', async () => {
      const wrapper = mount(SnPaging, {
        props: { modelValue: [], 'onUpdate:modelValue': () => {} },
        slots: { empty: '<text class="custom-empty">空空如也</text>' },
      })
      wrapper.vm.complete([])
      await flush()
      expect(wrapper.find('.custom-empty').text()).toBe('空空如也')
    })

    it('uses the configured empty text', async () => {
      const { wrapper } = mountPaging({ emptyText: 'No records' })
      wrapper.vm.complete([])
      await flush()
      expect(wrapper.find('.sn-paging__empty-text').text()).toBe('No records')
    })
  })

  describe('passthrough / forwarding', () => {
    it('re-emits scroll-view scroll events', async () => {
      const { wrapper } = mountPaging({ auto: false })
      await wrapper.find('scroll-view').trigger('scroll', { detail: { scrollTop: 5 } })
      expect(wrapper.emitted('scroll')?.[0]?.[0]).toMatchObject({ detail: { scrollTop: 5 } })
    })

    it('forwards customClass and customStyle to the root', () => {
      const { wrapper } = mountPaging({ auto: false, customClass: 'my-list', customStyle: 'height: 50vh' })
      const root = wrapper.find('scroll-view')
      expect(root.classes()).toContain('my-list')
      expect(root.attributes('style')).toContain('height: 50vh')
    })
  })
})
