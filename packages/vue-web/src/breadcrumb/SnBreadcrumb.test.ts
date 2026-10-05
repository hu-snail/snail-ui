import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnBreadcrumb from './SnBreadcrumb.vue'
import SnBreadcrumbItem from './SnBreadcrumbItem.vue'

const renderItems = () => ({
  components: { SnBreadcrumb, SnBreadcrumbItem },
  template: `
    <SnBreadcrumb separator="/">
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/components">Components</SnBreadcrumbItem>
      <SnBreadcrumbItem>Card</SnBreadcrumbItem>
    </SnBreadcrumb>
  `,
})

describe('SnBreadcrumb (AUI-WEB-NAV-003)', () => {
  it('renders a nav with breadcrumb role', () => {
    const w = mount(SnBreadcrumb, { slots: { default: '<a>Home</a>' } })
    expect(w.element.tagName).toBe('NAV')
    expect(w.attributes('aria-label')).toBe('Breadcrumb')
  })

  it('renders the default separator', () => {
    const w = mount(SnBreadcrumb, { slots: { default: '<a>x</a><span>y</span>' } })
    expect(w.text()).toContain('/')
    expect(w.find('.sn-breadcrumb__separator').exists()).toBe(true)
  })

  it('honors a custom separator', () => {
    const w = mount(SnBreadcrumb, {
      props: { separator: '›' },
      slots: { default: '<a>x</a><span>y</span>' },
    })
    expect(w.find('.sn-breadcrumb__separator').text()).toBe('›')
  })

  it('renders one <li> per slot child', () => {
    const w = mount(renderItems())
    expect(w.findAll('li.sn-breadcrumb__item').length).toBe(3)
  })

  it('renders separators between siblings (n-1 separators for n items)', () => {
    const w = mount(renderItems())
    expect(w.findAll('.sn-breadcrumb__separator').length).toBe(2)
  })

  it('does not render a trailing separator after the last item', () => {
    const w = mount(renderItems())
    const lastItem = w.findAll('li.sn-breadcrumb__item').at(-1)!
    expect(lastItem.find('.sn-breadcrumb__separator').exists()).toBe(false)
  })

  it('renders SnBreadcrumbItem child as <a> when href is provided', () => {
    const w = mount(SnBreadcrumb, {
      slots: { default: '<a href="/x">x</a>' },
    })
    expect(w.find('a').attributes('href')).toBe('/x')
  })

  it('renders SnBreadcrumbItem child as <span> when no href', () => {
    const w = mount(SnBreadcrumb, {
      slots: { default: '<span>y</span>' },
    })
    expect(w.find('.sn-breadcrumb__item span').exists()).toBe(true)
    expect(w.find('.sn-breadcrumb__item a').exists()).toBe(false)
  })
})