import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnCard from './sn-card.vue'

describe('sn-card (AUI-MP-BIZ-001)', () => {
  it('renders a region container by default', () => {
    const w = mount(SnCard)
    expect(w.classes()).toContain('sn-card')
    expect(w.attributes('role')).toBe('region')
  })

  it('does not render a title region when no title prop or slot is provided', () => {
    const w = mount(SnCard, { slots: { default: 'body' } })
    expect(w.find('.sn-card__title').exists()).toBe(false)
    expect(w.find('.sn-card__content').exists()).toBe(true)
  })

  it('renders the title region when title prop is provided', () => {
    const w = mount(SnCard, { props: { title: '今日推荐' } })
    expect(w.find('.sn-card__title').exists()).toBe(true)
    expect(w.text()).toContain('今日推荐')
  })

  it('renders the title slot when provided (overrides title prop)', () => {
    const w = mount(SnCard, {
      props: { title: 'fallback' },
      slots: { title: '<text>slot title</text>' },
    })
    expect(w.text()).toContain('slot title')
    expect(w.text()).not.toContain('fallback')
  })

  it('renders the footer region only when footer slot is provided', () => {
    const w = mount(SnCard, {
      slots: { footer: '<text>footer button</text>' },
    })
    expect(w.find('.sn-card__footer').exists()).toBe(true)
    expect(w.text()).toContain('footer button')
  })

  it('omits the footer region when no footer slot is provided', () => {
    const w = mount(SnCard)
    expect(w.find('.sn-card__footer').exists()).toBe(false)
  })

  it('applies sn-card--rectangle class when type="rectangle"', () => {
    const w = mount(SnCard, { props: { type: 'rectangle' } })
    expect(w.classes()).toContain('sn-card--rectangle')
  })

  it('does not apply rectangle class when type="" or type="default"', () => {
    const w1 = mount(SnCard, { props: { type: '' } })
    expect(w1.classes()).not.toContain('sn-card--rectangle')

    const w2 = mount(SnCard, { props: { type: 'default' } })
    expect(w2.classes()).not.toContain('sn-card--rectangle')
  })

  it('applies customClass to the root node', () => {
    const w = mount(SnCard, { props: { customClass: 'my-card' } })
    expect(w.classes()).toContain('my-card')
  })

  it('applies customTitleClass to the title region', () => {
    const w = mount(SnCard, {
      props: { title: 't', customTitleClass: 'my-title' },
    })
    expect(w.find('.sn-card__title').classes()).toContain('my-title')
  })

  it('applies customContentClass to the content region', () => {
    const w = mount(SnCard, {
      props: { customContentClass: 'my-content' },
      slots: { default: 'body' },
    })
    expect(w.find('.sn-card__content').classes()).toContain('my-content')
  })

  it('applies customFooterClass to the footer region', () => {
    const w = mount(SnCard, {
      props: { customFooterClass: 'my-footer' },
      slots: { footer: '<text>f</text>' },
    })
    expect(w.find('.sn-card__footer').classes()).toContain('my-footer')
  })

  it('applies customStyle as inline style on the root node', () => {
    const w = mount(SnCard, {
      props: { customStyle: 'background: #f0f0f0;' },
    })
    expect(w.attributes('style')).toContain('#f0f0f0')
  })
})