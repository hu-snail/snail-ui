import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnThing from './SnThing.vue'

/** Mount SnThing through a wrapper component, mirroring real usage. */
function mountThing(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnThing },
      setup() {
        return () => h(SnThing, props as never, slots as never)
      },
    }),
  )
}

describe('SnThing (AUI-WEB-DD-018)', () => {
  describe('rendering', () => {
    it('renders title / description / content from props', () => {
      const w = mountThing({
        title: '标题',
        description: '描述',
        content: '正文',
      })
      expect(w.find('.sn-thing__title').text()).toBe('标题')
      expect(w.find('.sn-thing__description').text()).toBe('描述')
      expect(w.find('.sn-thing__content').text()).toBe('正文')
    })

    it('renders the title-extra prop in the header extra area', () => {
      const w = mountThing({ title: '标题', titleExtra: '附加' })
      expect(w.find('.sn-thing__extra').text()).toBe('附加')
    })

    it('renders no header/description without props or slots', () => {
      const w = mountThing({ content: '正文' })
      expect(w.find('.sn-thing__title').exists()).toBe(false)
      expect(w.find('.sn-thing__description').exists()).toBe(false)
    })
  })

  describe('slots', () => {
    it('renders the header slot over the title prop', () => {
      const w = mountThing(
        { title: 'prop 标题' },
        { header: () => 'slot 标题' },
      )
      expect(w.find('.sn-thing__title').text()).toBe('slot 标题')
    })

    it('renders the header-extra slot over the title-extra prop', () => {
      const w = mountThing(
        { title: '标题', titleExtra: 'prop 附加' },
        { 'header-extra': () => 'slot 附加' },
      )
      expect(w.find('.sn-thing__extra').text()).toBe('slot 附加')
    })

    it('renders the description slot over the description prop', () => {
      const w = mountThing(
        { title: '标题', description: 'prop 描述' },
        { description: () => 'slot 描述' },
      )
      expect(w.find('.sn-thing__description').text()).toBe('slot 描述')
    })

    it('renders the default slot over the content prop', () => {
      const w = mountThing(
        { title: '标题', content: 'prop 正文' },
        { default: () => 'slot 正文' },
      )
      expect(w.find('.sn-thing__content').text()).toBe('slot 正文')
    })

    it('renders the footer and action areas', () => {
      const w = mountThing(
        { title: '标题' },
        { footer: () => '尾部', action: () => '操作' },
      )
      expect(w.find('.sn-thing__footer').text()).toBe('尾部')
      expect(w.find('.sn-thing__action').text()).toBe('操作')
    })
  })

  describe('avatar layout', () => {
    it('keeps the avatar beside the header column by default', () => {
      const w = mountThing(
        { title: '标题' },
        { avatar: () => '头像', default: () => '正文' },
      )
      const wrapper = w.find('.sn-thing__avatar-header-wrapper')
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.sn-thing__avatar').text()).toBe('头像')
      // The avatar stays inside the main column.
      expect(w.find('.sn-thing__main .sn-thing__avatar').exists()).toBe(true)
    })

    it('moves the avatar out when content-indented is set', () => {
      const w = mountThing(
        { title: '标题', contentIndented: true },
        { avatar: () => '头像', default: () => '正文' },
      )
      expect(w.find('.sn-thing__avatar-header-wrapper').exists()).toBe(false)
      const avatar = w.find('.sn-thing__avatar')
      expect(avatar.exists()).toBe(true)
      // The avatar leads the root, before the main column.
      expect(avatar.classes()).toContain('sn-thing__avatar')
      expect(w.find('.sn-thing__title').text()).toBe('标题')
    })

    it('omits the avatar area without the avatar slot', () => {
      const w = mountThing({ title: '标题' })
      expect(w.find('.sn-thing__avatar').exists()).toBe(false)
      // The reference keeps the (empty) header wrapper when a title exists.
      expect(w.find('.sn-thing__avatar-header-wrapper').find('.sn-thing__avatar').exists()).toBe(false)
    })
  })

  describe('style pass-through', () => {
    it('applies description-style / content-style and classes', () => {
      const w = mountThing({
        title: '标题',
        description: '描述',
        content: '正文',
        descriptionStyle: 'color: rgb(1, 2, 3)',
        descriptionClass: 'my-desc',
        contentStyle: 'font-weight: 700',
        contentClass: 'my-content',
      })
      const desc = w.find('.sn-thing__description')
      expect(desc.classes()).toContain('my-desc')
      expect(desc.attributes('style')).toContain('color')
      const content = w.find('.sn-thing__content')
      expect(content.classes()).toContain('my-content')
      expect(content.attributes('style')).toContain('font-weight')
    })
  })
})
