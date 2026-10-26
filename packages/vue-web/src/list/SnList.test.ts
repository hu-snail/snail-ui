import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnList from './SnList.vue'
import SnListItem from './SnListItem.vue'

/** Mount SnList through a wrapper component, mirroring real usage. */
function mountList(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnList, SnListItem },
      setup() {
        return () => h(SnList, props as never, slots as never)
      },
    }),
  )
}

function itemSlots(): Record<string, unknown> {
  return {
    default: () => [
      h(SnListItem, null, { default: () => '第一项' }),
      h(SnListItem, null, { default: () => '第二项' }),
      h(SnListItem, null, { default: () => '第三项' }),
    ],
  }
}

describe('SnList (AUI-WEB-DD-012)', () => {
  describe('rendering', () => {
    it('renders a medium list with items by default', () => {
      const w = mountList({}, itemSlots())
      const root = w.find('.sn-list')
      expect(root.element.tagName).toBe('UL')
      expect(root.classes()).toContain('sn-list--medium')
      expect(root.classes()).not.toContain('sn-list--bordered')
      const items = w.findAll('.sn-list-item')
      expect(items).toHaveLength(3)
      expect(items[0].find('.sn-list-item__main').text()).toBe('第一项')
    })

    it('renders the header and footer slots', () => {
      const w = mountList(
        {},
        { ...itemSlots(), header: () => '列表头', footer: () => '列表尾' },
      )
      expect(w.find('.sn-list__header').text()).toBe('列表头')
      expect(w.find('.sn-list__footer').text()).toBe('列表尾')
    })

    it('renders no header/footer without slots', () => {
      const w = mountList({}, itemSlots())
      expect(w.find('.sn-list__header').exists()).toBe(false)
      expect(w.find('.sn-list__footer').exists()).toBe(false)
    })
  })

  describe('prefix / suffix slots', () => {
    it('renders the prefix and suffix areas of an item', () => {
      const w = mountList(
        {},
        {
          default: () => [
            h(
              SnListItem,
              null,
              {
                prefix: () => '前缀',
                default: () => '内容',
                suffix: () => '后缀',
              },
            ),
          ],
        },
      )
      const item = w.find('.sn-list-item')
      expect(item.find('.sn-list-item__prefix').text()).toBe('前缀')
      expect(item.find('.sn-list-item__suffix').text()).toBe('后缀')
      expect(item.find('.sn-list-item__main').text()).toBe('内容')
    })

    it('renders no prefix/suffix area without slots', () => {
      const w = mountList(
        {},
        { default: () => [h(SnListItem, null, { default: () => '内容' })] },
      )
      const item = w.find('.sn-list-item')
      expect(item.find('.sn-list-item__prefix').exists()).toBe(false)
      expect(item.find('.sn-list-item__suffix').exists()).toBe(false)
    })
  })

  describe('modifiers', () => {
    it('toggles the bordered modifier', () => {
      const w = mountList({ bordered: true }, itemSlots())
      expect(w.find('.sn-list').classes()).toContain('sn-list--bordered')
    })

    it('toggles the hoverable and clickable modifiers', () => {
      const w = mountList({ hoverable: true, clickable: true }, itemSlots())
      const root = w.find('.sn-list')
      expect(root.classes()).toContain('sn-list--hoverable')
      expect(root.classes()).toContain('sn-list--clickable')
    })

    it('applies the size modifier classes', () => {
      for (const size of ['small', 'medium', 'large'] as const) {
        const w = mountList({ size })
        expect(w.find('.sn-list').classes()).toContain(`sn-list--${size}`)
      }
    })
  })

  describe('dividers', () => {
    it('renders a divider element on every item by default', () => {
      const w = mountList({}, itemSlots())
      expect(w.findAll('.sn-list-item__divider')).toHaveLength(3)
      expect(w.find('.sn-list').classes()).toContain('sn-list--show-divider')
    })

    it('renders no divider when show-divider is false', () => {
      const w = mountList({ showDivider: false }, itemSlots())
      expect(w.findAll('.sn-list-item__divider')).toHaveLength(0)
      expect(w.find('.sn-list').classes()).not.toContain('sn-list--show-divider')
    })

    it('keeps the default divider on an item rendered outside a list', () => {
      const w = mount(defineComponent({
        components: { SnListItem },
        setup() {
          return () => h(SnListItem, null, { default: () => '孤立项' })
        },
      }))
      expect(w.find('.sn-list-item__main').text()).toBe('孤立项')
      expect(w.find('.sn-list-item__divider').exists()).toBe(true)
    })
  })
})
