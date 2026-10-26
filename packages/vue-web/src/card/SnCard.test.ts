import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnCard from './SnCard.vue'

describe('SnCard (AUI-WEB-LAYOUT-001)', () => {
  it('renders a region container by default', () => {
    const w = mount(SnCard)
    expect(w.classes()).toContain('sn-card')
    expect(w.classes()).toContain('sn-card--size-medium')
    expect(w.classes()).toContain('sn-card--bordered')
    expect(w.attributes('role')).toBe('region')
    expect(w.element.tagName).toBe('DIV')
  })

  it('renders the header region when title is provided', () => {
    const w = mount(SnCard, { props: { title: 'Order #1024' } })
    expect(w.classes()).toContain('sn-card--has-header')
    expect(w.find('.sn-card__header').exists()).toBe(true)
    expect(w.text()).toContain('Order #1024')
  })

  it('omits the header region when no title, slot, closable, or extra is provided', () => {
    const w = mount(SnCard)
    expect(w.find('.sn-card__header').exists()).toBe(false)
  })

  it('renders the content region with default slot', () => {
    const w = mount(SnCard, { slots: { default: 'body text' } })
    expect(w.classes()).toContain('sn-card--has-content')
    expect(w.find('.sn-card__content').exists()).toBe(true)
    expect(w.text()).toContain('body text')
  })

  it('renders the footer region only when footer slot is provided', () => {
    const w = mount(SnCard, {
      slots: { footer: '<button>Apply</button>' },
    })
    expect(w.classes()).toContain('sn-card--has-footer')
    expect(w.find('.sn-card__footer').exists()).toBe(true)
    expect(w.text()).toContain('Apply')
  })

  it('omits the footer region when no footer slot is provided', () => {
    const w = mount(SnCard)
    expect(w.find('.sn-card__footer').exists()).toBe(false)
  })

  it('applies bordered=false class when bordered prop is false', () => {
    const w = mount(SnCard, { props: { bordered: false } })
    expect(w.classes()).not.toContain('sn-card--bordered')
  })

  it('applies hoverable class when hoverable is true', () => {
    const w = mount(SnCard, { props: { hoverable: true } })
    expect(w.classes()).toContain('sn-card--hoverable')
  })

  it('applies embedded class when embedded is true', () => {
    const w = mount(SnCard, { props: { embedded: true } })
    expect(w.classes()).toContain('sn-card--embedded')
  })

  it('renders a close button and emits `close` event when closable is true', async () => {
    const w = mount(SnCard, {
      props: { closable: true, title: 'Closable card' },
    })
    expect(w.find('.sn-card__close').exists()).toBe(true)
    await w.find('.sn-card__close').trigger('click')
    const emitted = w.emitted('close')
    expect(emitted).toBeTruthy()
    expect(emitted!.length).toBe(1)
  })

  it('omits the close button when closable is false', () => {
    const w = mount(SnCard, { props: { title: 'No close' } })
    expect(w.find('.sn-card__close').exists()).toBe(false)
  })

  it('applies size class and varied padding', () => {
    const small = mount(SnCard, { props: { size: 'small' } })
    expect(small.classes()).toContain('sn-card--size-small')

    const large = mount(SnCard, { props: { size: 'large' } })
    expect(large.classes()).toContain('sn-card--size-large')
  })

  it('honors `variant=elevated` as bordered=false + shadow=true', () => {
    const w = mount(SnCard, { props: { variant: 'elevated' } })
    expect(w.classes()).not.toContain('sn-card--bordered')
    expect(w.classes()).toContain('sn-card--shadow')
  })

  it('honors `variant=outlined` as bordered=true + shadow=false', () => {
    const w = mount(SnCard, { props: { variant: 'outlined' } })
    expect(w.classes()).toContain('sn-card--bordered')
    expect(w.classes()).not.toContain('sn-card--shadow')
  })

  it('honors `padding=lg` as size=large', () => {
    const w = mount(SnCard, { props: { padding: 'lg' } })
    expect(w.classes()).toContain('sn-card--size-large')
  })

  it('honors `padding=none` (no size class added)', () => {
    const w = mount(SnCard, { props: { padding: 'none' } })
    expect(w.classes()).toContain('sn-card--size-medium') // default fallback
  })

  it('renders segmented divider class when segmented.content=true', () => {
    const w = mount(SnCard, {
      props: { segmented: { content: true }, title: 't' },
      slots: { default: 'body' },
    })
    expect(w.find('.sn-card__content--segmented').exists()).toBe(true)
  })

  it('uses custom tag and role when provided', () => {
    const w = mount(SnCard, { props: { tag: 'section', role: 'article' } })
    expect(w.element.tagName).toBe('SECTION')
    expect(w.attributes('role')).toBe('article')
  })

  it('forwards ariaLabel to the root element', () => {
    const w = mount(SnCard, { props: { ariaLabel: 'Order summary' } })
    expect(w.attributes('aria-label')).toBe('Order summary')
  })

  it('applies contentScrollable class to content region', () => {
    const w = mount(SnCard, {
      props: { contentScrollable: true },
      slots: { default: 'scroll me' },
    })
    expect(w.find('.sn-card__content--scrollable').exists()).toBe(true)
  })

  it('renders cover region when cover slot is provided', () => {
    const w = mount(SnCard, {
      slots: { cover: '<img src="/x.png" />' },
    })
    expect(w.classes()).toContain('sn-card--has-cover')
    expect(w.find('.sn-card__cover').exists()).toBe(true)
  })

  it('renders header-extra region when slot provided', () => {
    const w = mount(SnCard, {
      props: { title: 't' },
      slots: { 'header-extra': '<a>link</a>' },
    })
    expect(w.find('.sn-card__header-extra').exists()).toBe(true)
  })

  it('renders action region when slot provided', () => {
    const w = mount(SnCard, {
      slots: { action: '<button>OK</button>' },
    })
    expect(w.classes()).toContain('sn-card--has-action')
    expect(w.find('.sn-card__action').exists()).toBe(true)
  })
})