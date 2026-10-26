import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnComment from './SnComment.vue'

/** Mount SnComment through a wrapper component, mirroring real usage. */
function mountComment(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnComment },
      setup() {
        return () => h(SnComment, props as never, slots as never)
      },
    }),
  )
}

describe('SnComment', () => {
  describe('rendering', () => {
    it('should render author / datetime / content props into their structure slots', () => {
      const w = mountComment({
        author: '苏格拉底',
        datetime: '1 小时前',
        content: '评论正文',
        avatar: 'https://picsum.photos/id/1011/64/64',
      })
      expect(w.find('.sn-comment__author').text()).toBe('苏格拉底')
      expect(w.find('.sn-comment__datetime').text()).toBe('1 小时前')
      expect(w.find('.sn-comment__content').text()).toBe('评论正文')
      const avatarImg = w.find('.sn-comment__avatar img')
      expect(avatarImg.exists()).toBe(true)
      expect(avatarImg.attributes('src')).toBe('https://picsum.photos/id/1011/64/64')
    })

    it('should render no avatar column without the avatar prop or slot', () => {
      const w = mountComment({ author: '作者', content: '正文' })
      expect(w.find('.sn-comment__avatar').exists()).toBe(false)
      // The main column still renders with the comment body.
      expect(w.find('.sn-comment__content').text()).toBe('正文')
    })

    it('should render no title row without author or datetime', () => {
      const w = mountComment({ content: '正文' })
      expect(w.find('.sn-comment__title').exists()).toBe(false)
      expect(w.find('.sn-comment__content').exists()).toBe(true)
    })

    it('should treat an empty-string prop as absent like the reference', () => {
      const w = mountComment({ author: '', content: '正文' })
      expect(w.find('.sn-comment__author').exists()).toBe(false)
      expect(w.find('.sn-comment__title').exists()).toBe(false)
    })
  })

  describe('slots', () => {
    it('should render the avatar slot as the avatar column content', () => {
      const w = mountComment(
        { author: '作者', content: '正文' },
        { avatar: () => '头像节点' },
      )
      expect(w.find('.sn-comment__avatar').text()).toBe('头像节点')
      expect(w.find('.sn-comment__avatar img').exists()).toBe(false)
    })

    it('should render the avatar slot over the avatar prop', () => {
      const w = mountComment(
        { avatar: 'https://picsum.photos/id/1011/64/64', content: '正文' },
        { avatar: () => '槽位头像' },
      )
      expect(w.find('.sn-comment__avatar').text()).toBe('槽位头像')
      expect(w.find('.sn-comment__avatar img').exists()).toBe(false)
    })

    it('should render the author / datetime / content slots over same-name props', () => {
      const w = mountComment(
        {
          author: 'prop 作者',
          datetime: 'prop 时间',
          content: 'prop 正文',
        },
        {
          author: () => 'slot 作者',
          datetime: () => 'slot 时间',
          content: () => 'slot 正文',
        },
      )
      expect(w.find('.sn-comment__author').text()).toBe('slot 作者')
      expect(w.find('.sn-comment__datetime').text()).toBe('slot 时间')
      expect(w.find('.sn-comment__content').text()).toBe('slot 正文')
    })

    it('should render the actions slot as an action list', () => {
      const w = mountComment(
        { content: '正文' },
        {
          actions: () => ['赞同 83', '回复'].map((text) =>
            h('span', { class: 'demo-action' }, text),
          ),
        },
      )
      const actions = w.findAll('.sn-comment__actions .demo-action')
      expect(actions).toHaveLength(2)
      expect(actions[0].text()).toBe('赞同 83')
      expect(actions[1].text()).toBe('回复')
    })

    it('should render no actions row without the actions slot', () => {
      const w = mountComment({ content: '正文' })
      expect(w.find('.sn-comment__actions').exists()).toBe(false)
    })
  })

  describe('align', () => {
    it('should emit no right alignment classes for the default left align', () => {
      const w = mountComment(
        { author: '作者', datetime: '1 小时前', content: '正文' },
        { actions: () => '操作' },
      )
      expect(w.find('.sn-comment__title--right').exists()).toBe(false)
      expect(w.find('.sn-comment__actions--right').exists()).toBe(false)
    })

    it('should right-align both rows when align is "right"', () => {
      const w = mountComment(
        { author: '作者', datetime: '1 小时前', content: '正文', align: 'right' },
        { actions: () => '操作' },
      )
      expect(w.find('.sn-comment__title').classes()).toContain('sn-comment__title--right')
      expect(w.find('.sn-comment__actions').classes()).toContain('sn-comment__actions--right')
    })

    it('should right-align only the actions row for the object form', () => {
      const w = mountComment(
        {
          author: '作者',
          datetime: '1 小时前',
          content: '正文',
          align: { actions: 'right' },
        },
        { actions: () => '操作' },
      )
      expect(w.find('.sn-comment__title--right').exists()).toBe(false)
      expect(w.find('.sn-comment__actions').classes()).toContain('sn-comment__actions--right')
    })

    it('should right-align only the datetime row for the object form', () => {
      const w = mountComment(
        {
          author: '作者',
          datetime: '1 小时前',
          content: '正文',
          align: { datetime: 'right' },
        },
        { actions: () => '操作' },
      )
      expect(w.find('.sn-comment__title').classes()).toContain('sn-comment__title--right')
      expect(w.find('.sn-comment__actions--right').exists()).toBe(false)
    })

    it('should keep unspecified object keys left-aligned', () => {
      const w = mountComment({
        author: '作者',
        datetime: '1 小时前',
        content: '正文',
        align: {},
      })
      expect(w.find('.sn-comment__title--right').exists()).toBe(false)
    })
  })

  describe('nesting', () => {
    it('should render nested comments inside the nested container', () => {
      const w = mountComment(
        { author: '苏格拉底', content: '主评论' },
        {
          default: () =>
            h(SnComment, { author: '柏拉图', content: '回复内容' }),
        },
      )
      const nested = w.find('.sn-comment__nested')
      expect(nested.exists()).toBe(true)
      // The reply is a full SnComment living under the parent's main column,
      // which indents it past the parent avatar.
      const nestedComment = nested.find('.sn-comment__body')
      expect(nestedComment.exists()).toBe(true)
      expect(nestedComment.text()).toContain('回复内容')
      expect(nested.find('.sn-comment__author').text()).toBe('柏拉图')
    })

    it('should render no nested container without the default slot', () => {
      const w = mountComment({ author: '作者', content: '正文' })
      expect(w.find('.sn-comment__nested').exists()).toBe(false)
    })
  })
})
