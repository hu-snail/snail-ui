import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnDivider from './SnDivider.vue'

describe('SnDivider (AUI-WEB-006)', () => {
  it('renders an empty horizontal separator by default', () => {
    const w = mount(SnDivider)
    expect(w.classes()).toContain('sn-divider')
    expect(w.classes()).toContain('sn-divider--horizontal')
    expect(w.classes()).toContain('sn-divider--margin-medium')
    expect(w.attributes('role')).toBe('separator')
    expect(w.attributes('aria-orientation')).toBe('horizontal')
  })

  it('applies vertical direction classes and aria', () => {
    const w = mount(SnDivider, { props: { direction: 'vertical' } })
    expect(w.classes()).toContain('sn-divider--vertical')
    expect(w.attributes('aria-orientation')).toBe('vertical')
  })

  it('adds dashed class when dashed=true', () => {
    const w = mount(SnDivider, { props: { dashed: true } })
    expect(w.classes()).toContain('sn-divider--dashed')
  })

  it('applies color override via inline style (no inline literal needed for token colors)', () => {
    const w = mount(SnDivider, { props: { color: '#ff5722' } })
    // We allow the user to pass any CSS color string; the bound style is
    // dynamic per-instance. Token-driven overrides should still happen
    // via CSS rules in the consuming app, not via the `color` prop.
    expect(w.attributes('style')).toContain('border-color')
  })

  it('renders the slot text only for horizontal dividers', () => {
    const w = mount(SnDivider, {
      slots: { default: 'OR' },
    })
    expect(w.classes()).toContain('sn-divider--with-text')
    expect(w.find('.sn-divider__text').exists()).toBe(true)
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