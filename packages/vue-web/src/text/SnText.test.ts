import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnText from './SnText.vue'

describe('SnText (AUI-WEB-TY-001)', () => {
  it('renders inline text in a span by default', () => {
    const w = mount(SnText, { slots: { default: '普通文字' } })
    expect(w.element.tagName).toBe('SPAN')
    expect(w.classes()).toContain('sn-text')
    expect(w.classes()).toContain('sn-text--default')
    expect(w.text()).toBe('普通文字')
  })

  it('renders the element chosen by tag', () => {
    for (const [tag, tagName] of [
      ['p', 'P'],
      ['blockquote', 'BLOCKQUOTE'],
      ['h1', 'H1'],
      ['h6', 'H6'],
    ] as const) {
      const w = mount(SnText, { props: { tag }, slots: { default: 'x' } })
      expect(w.element.tagName).toBe(tagName)
    }
  })

  it('applies the type modifier class for every semantic type', () => {
    for (const type of ['primary', 'info', 'success', 'warning', 'error'] as const) {
      const w = mount(SnText, { props: { type } })
      expect(w.classes()).toContain(`sn-text--${type}`)
    }
  })

  it('applies the depth scale for the default type', () => {
    for (const depth of ['1', '2', '3'] as const) {
      const w = mount(SnText, { props: { depth } })
      expect(w.classes()).toContain(`sn-text--depth-${depth}`)
    }
  })

  it('ignores depth when a semantic type is set', () => {
    // n-text only applies depth to the default type; a colored text keeps
    // its type color.
    const w = mount(SnText, { props: { type: 'primary', depth: '1' } })
    expect(w.classes()).not.toContain('sn-text--depth-1')
    expect(w.classes()).toContain('sn-text--primary')
  })

  it('marks strong, italic and code text', () => {
    const strong = mount(SnText, { props: { strong: true } })
    expect(strong.classes()).toContain('sn-text--strong')

    const italic = mount(SnText, { props: { italic: true } })
    expect(italic.classes()).toContain('sn-text--italic')

    const code = mount(SnText, { props: { code: true } })
    expect(code.classes()).toContain('sn-text--code')
  })

  it('underlines text via text-decoration', () => {
    const w = mount(SnText, { props: { underline: true } })
    expect(w.attributes('style')).toContain('text-decoration: underline')
  })

  it('strikes through text via text-decoration', () => {
    const w = mount(SnText, { props: { delete: true } })
    expect(w.attributes('style')).toContain('text-decoration: line-through')
  })

  it('combines underline and delete into one text-decoration value', () => {
    // text-decoration is not additive across declarations — the two flags
    // must merge, or one silently wins.
    const w = mount(SnText, { props: { underline: true, delete: true } })
    expect(w.attributes('style')).toContain('text-decoration: underline line-through')
  })

  it('greys out disabled text', () => {
    const w = mount(SnText, { props: { disabled: true } })
    expect(w.classes()).toContain('sn-text--disabled')
  })

  it('merges customClass and customStyle onto the rendered element', () => {
    const w = mount(SnText, {
      props: { customClass: 'my-text', customStyle: 'letter-spacing: 2px' },
    })
    expect(w.classes()).toContain('my-text')
    expect(w.attributes('style')).toContain('letter-spacing: 2px')
  })
})
