/**
 * SnIcon unit tests — web-end icon component (AUI-WEB-002).
 *
 * Tests cover behavior, not implementation detail (AGENTS.md §46):
 *   - renders passed icon component (direct usage, tree-shakeable)
 *   - resolves icon by name from registry (string-keyed usage)
 *   - renders placeholder when neither icon nor name resolves
 *   - aria-hidden is set on the wrapper
 *   - size / color / strokeWidth / absoluteStrokeWidth forwarded correctly
 *   - registerSnIcons is idempotent and merges into the registry
 *   - clearSnIcons empties the registry
 *
 * No real lucide-vue-next import here — we use a tiny fake icon
 * component so the suite does not pull in the full icon set (and so
 * we don't depend on a specific lucide version).
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnIcon from './SnIcon.vue'
import {
  registerSnIcons,
  clearSnIcons,
  resolveIconByName,
  type IconComponent,
} from './sn-icon-registry'

/** Tiny fake icon: renders an <svg> with the size as a data attribute. */
function makeFakeIcon(testid: string): IconComponent {
  return defineComponent({
    name: testid,
    props: {
      size: { type: [Number, String], default: 16 },
      color: { type: String, default: 'currentColor' },
      strokeWidth: { type: [Number, String], default: 2 },
      absoluteStrokeWidth: { type: Boolean, default: false },
      defaultClass: { type: String, default: undefined },
    },
    render() {
      // `this` is the component instance proxy with declared props.
      const ctx = this as unknown as {
        size: number | string
        color: string
        strokeWidth: number | string
        absoluteStrokeWidth: boolean
      }
      return h('svg', {
        'data-testid': testid,
        'data-size': String(ctx.size),
        'data-color': ctx.color,
        'data-stroke-width': String(ctx.strokeWidth),
        'data-absolute-stroke-width': String(ctx.absoluteStrokeWidth),
      })
    },
  })
}

describe('SnIcon — direct icon prop', () => {
  it('renders the passed icon component', () => {
    const ChevronRight = makeFakeIcon('chevron-right')
    const wrapper = mount(SnIcon, { props: { icon: ChevronRight } })
    expect(wrapper.find('[data-testid="chevron-right"]').exists()).toBe(true)
  })

  it('forwards size prop', () => {
    const Search = makeFakeIcon('search')
    const wrapper = mount(SnIcon, { props: { icon: Search, size: 24 } })
    expect(wrapper.find('[data-size="24"]').exists()).toBe(true)
  })

  it('forwards color prop', () => {
    const Bell = makeFakeIcon('bell')
    const wrapper = mount(SnIcon, { props: { icon: Bell, color: '#ff0000' } })
    expect(wrapper.find('[data-color="#ff0000"]').exists()).toBe(true)
  })

  it('forwards strokeWidth prop', () => {
    const Star = makeFakeIcon('star')
    const wrapper = mount(SnIcon, { props: { icon: Star, strokeWidth: 1.5 } })
    expect(wrapper.find('[data-stroke-width="1.5"]').exists()).toBe(true)
  })

  it('forwards absoluteStrokeWidth prop', () => {
    const Heart = makeFakeIcon('heart')
    const wrapper = mount(SnIcon, {
      props: { icon: Heart, strokeWidthAbsolute: true },
    })
    expect(wrapper.find('[data-absolute-stroke-width="true"]').exists()).toBe(true)
  })

  it('sets aria-hidden on the wrapper', () => {
    const Trash = makeFakeIcon('trash')
    const wrapper = mount(SnIcon, { props: { icon: Trash } })
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('uses default size of 16', () => {
    const Plus = makeFakeIcon('plus')
    const wrapper = mount(SnIcon, { props: { icon: Plus } })
    expect(wrapper.find('[data-size="16"]').exists()).toBe(true)
  })

  it('uses default color of currentColor', () => {
    const Minus = makeFakeIcon('minus')
    const wrapper = mount(SnIcon, { props: { icon: Minus } })
    expect(wrapper.find('[data-color="currentColor"]').exists()).toBe(true)
  })
})

describe('SnIcon — registry (name) lookup', () => {
  beforeEach(() => {
    clearSnIcons()
  })

  it('resolves icon by name from the registry', () => {
    const Search = makeFakeIcon('search')
    registerSnIcons({ Search })
    const wrapper = mount(SnIcon, { props: { name: 'Search' } })
    expect(wrapper.find('[data-testid="search"]').exists()).toBe(true)
  })

  it('renders placeholder when name is not registered', () => {
    const wrapper = mount(SnIcon, { props: { name: 'NotRegistered' } })
    expect(wrapper.find('.sn-icon--missing').exists()).toBe(true)
    expect(wrapper.find('[data-testid="search"]').exists()).toBe(false)
  })

  it('registerSnIcons merges into the registry (idempotent)', () => {
    const A = makeFakeIcon('a')
    const B = makeFakeIcon('b')
    registerSnIcons({ A })
    registerSnIcons({ B })
    expect(resolveIconByName('A')).toBe(A)
    expect(resolveIconByName('B')).toBe(B)
  })

  it('registerSnIcons overwrites a previously registered name', () => {
    const A1 = makeFakeIcon('a1')
    const A2 = makeFakeIcon('a2')
    registerSnIcons({ A: A1 })
    registerSnIcons({ A: A2 })
    expect(resolveIconByName('A')).toBe(A2)
  })

  it('clearSnIcons empties the registry', () => {
    const X = makeFakeIcon('x')
    registerSnIcons({ X })
    expect(resolveIconByName('X')).toBe(X)
    clearSnIcons()
    expect(resolveIconByName('X')).toBeUndefined()
  })

  it('icon prop takes precedence over name lookup', () => {
    const Registered = makeFakeIcon('registered')
    const Override = makeFakeIcon('override')
    registerSnIcons({ Registered })
    const wrapper = mount(SnIcon, {
      props: { icon: Override, name: 'Registered' },
    })
    expect(wrapper.find('[data-testid="override"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="registered"]').exists()).toBe(false)
  })
})

describe('SnIcon — missing / error states', () => {
  it('renders placeholder when neither icon nor name is provided', () => {
    const wrapper = mount(SnIcon, {})
    expect(wrapper.find('.sn-icon--missing').exists()).toBe(true)
  })

  it('placeholder has role="img" with an aria-label', () => {
    const wrapper = mount(SnIcon, {})
    const missing = wrapper.find('.sn-icon--missing')
    expect(missing.attributes('role')).toBe('img')
    expect(missing.attributes('aria-label')).toBe('icon not registered')
  })
})