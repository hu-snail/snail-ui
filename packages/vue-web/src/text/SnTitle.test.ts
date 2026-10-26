import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnTitle from './SnTitle.vue'

describe('SnTitle (AUI-WEB-TY-002)', () => {
  it('renders an h1 by default', () => {
    const w = mount(SnTitle, { slots: { default: '标题' } })
    expect(w.element.tagName).toBe('H1')
    expect(w.classes()).toContain('sn-title')
    expect(w.classes()).toContain('sn-title--level-1')
    expect(w.text()).toBe('标题')
  })

  it('renders the h1-h6 element for every level', () => {
    for (const level of [1, 2, 3, 4, 5, 6] as const) {
      const w = mount(SnTitle, { props: { level } })
      expect(w.element.tagName).toBe(`H${level}`)
      expect(w.classes()).toContain(`sn-title--level-${level}`)
    }
  })

  it('forwards the semantic type to SnText', () => {
    const w = mount(SnTitle, { props: { level: 2, type: 'primary' } })
    expect(w.classes()).toContain('sn-text--primary')
    expect(w.classes()).not.toContain('sn-text--default')
  })

  it('forwards the depth scale to SnText', () => {
    const w = mount(SnTitle, { props: { depth: '3' } })
    expect(w.classes()).toContain('sn-text--depth-3')
  })

  it('forwards strike-through via text-decoration', () => {
    const w = mount(SnTitle, { props: { delete: true } })
    expect(w.attributes('style')).toContain('text-decoration: line-through')
  })
})
