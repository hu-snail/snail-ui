import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnDivider from './sn-divider.vue'

describe('sn-divider (AUI-MP-005)', () => {
  it('renders an empty horizontal separator by default', () => {
    const w = mount(SnDivider)
    expect(w.classes()).toContain('sn-divider')
    expect(w.classes()).toContain('sn-divider--horizontal')
    expect(w.classes()).toContain('sn-divider--hairline')
    expect(w.classes()).toContain('sn-divider--margin-medium')
    expect(w.attributes('role')).toBe('separator')
    expect(w.attributes('aria-orientation')).toBe('horizontal')
  })

  it('applies vertical direction classes and aria', () => {
    const w = mount(SnDivider, { props: { direction: 'vertical' } })
    expect(w.classes()).toContain('sn-divider--vertical')
    expect(w.attributes('aria-orientation')).toBe('vertical')
  })

  it('removes hairline class when hairline=false', () => {
    const w = mount(SnDivider, { props: { hairline: false } })
    expect(w.classes()).not.toContain('sn-divider--hairline')
  })

  it('adds dashed class and inline border-style when dashed=true', () => {
    const w = mount(SnDivider, { props: { dashed: true } })
    expect(w.classes()).toContain('sn-divider--dashed')
    expect(w.attributes('style')).toContain('dashed')
  })

  it('renders the slot text only for horizontal dividers', () => {
    const w = mount(SnDivider, {
      slots: { default: 'OR' },
    })
    expect(w.classes()).toContain('sn-divider--with-text')
    expect(w.text()).toBe('OR')
  })

  it('omits the slot wrapper for vertical direction', () => {
    const w = mount(SnDivider, {
      props: { direction: 'vertical' },
      slots: { default: 'OR' },
    })
    expect(w.find('.sn-divider__text').exists()).toBe(false)
  })
})