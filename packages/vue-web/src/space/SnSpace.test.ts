import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnSpace from './SnSpace.vue'

describe('SnSpace (AUI-WEB-LAYOUT-003)', () => {
  it('renders a horizontal flex container with medium gap by default', () => {
    const w = mount(SnSpace)
    expect(w.classes()).toContain('sn-space')
    const style = w.attributes('style') ?? ''
    expect(style).toMatch(/display:\s*flex/)
    expect(style).toMatch(/flex-direction:\s*row/)
    expect(style).toMatch(/row-gap:\s*var\(--sn-web-space-gap-medium,\s*12px\)/)
    expect(style).toMatch(/column-gap:\s*var\(--sn-web-space-gap-medium,\s*12px\)/)
    // n-space: wrap defaults to true, horizontal stays wrap.
    expect(style).toMatch(/flex-wrap:\s*wrap/)
    // n-space: justify 'start' → flex-start; align unset → no align-items.
    expect(style).toMatch(/justify-content:\s*flex-start/)
    expect(style).not.toMatch(/align-items/)
  })

  it('renders children as direct flex items (no wrapper divs)', () => {
    const w = mount(SnSpace, {
      slots: { default: '<div>a</div><div>b</div>' },
    })
    expect(w.text()).toContain('a')
    expect(w.text()).toContain('b')
    // Container + 2 children only — gap keeps the DOM flat.
    expect(w.findAll('div')).toHaveLength(3)
  })

  it('resolves numeric size to px gap on both axes', () => {
    const w = mount(SnSpace, { props: { size: 24 } })
    const style = w.attributes('style') ?? ''
    expect(style).toMatch(/row-gap:\s*24px/)
    expect(style).toMatch(/column-gap:\s*24px/)
  })

  it('maps size presets to --sn-web-space-gap-* tokens (8/12/16 fallbacks)', () => {
    const small = mount(SnSpace, { props: { size: 'small' } })
    expect(small.attributes('style')).toMatch(
      /column-gap:\s*var\(--sn-web-space-gap-small,\s*8px\)/,
    )
    const large = mount(SnSpace, { props: { size: 'large' } })
    expect(large.attributes('style')).toMatch(
      /row-gap:\s*var\(--sn-web-space-gap-large,\s*16px\)/,
    )
  })

  it('maps [horizontal, vertical] tuple to column-gap / row-gap', () => {
    const w = mount(SnSpace, { props: { size: [4, 8] } })
    const style = w.attributes('style') ?? ''
    expect(style).toMatch(/column-gap:\s*4px/)
    expect(style).toMatch(/row-gap:\s*8px/)
  })

  it('falls back to medium preset on invalid size values', () => {
    const badPreset = mount(SnSpace, {
      props: { size: 'huge' as unknown as number },
    })
    const badStyle = badPreset.attributes('style') ?? ''
    expect(badStyle).toMatch(/row-gap:\s*var\(--sn-web-space-gap-medium,\s*12px\)/)

    const nanTuple = mount(SnSpace, {
      props: { size: [Number.NaN, 8] },
    })
    const nanStyle = nanTuple.attributes('style') ?? ''
    expect(nanStyle).toMatch(/column-gap:\s*var\(--sn-web-space-gap-medium,\s*12px\)/)
    expect(nanStyle).toMatch(/row-gap:\s*8px/)
  })

  it('vertical stacks in a column and forces nowrap (n-space semantics)', () => {
    const w = mount(SnSpace, { props: { vertical: true } })
    expect(w.classes()).toContain('sn-space--vertical')
    const style = w.attributes('style') ?? ''
    expect(style).toMatch(/flex-direction:\s*column/)
    // n-space: `!wrap || vertical` → nowrap, even with wrap=true.
    expect(style).toMatch(/flex-wrap:\s*nowrap/)
  })

  it('wrap=false forces nowrap on horizontal layout', () => {
    const w = mount(SnSpace, { props: { wrap: false } })
    expect(w.classes()).toContain('sn-space--nowrap')
    expect(w.attributes('style')).toMatch(/flex-wrap:\s*nowrap/)
  })

  it('normalizes justify start/end to flex-start/flex-end (n-space semantics)', () => {
    const start = mount(SnSpace, { props: { justify: 'start' } })
    expect(start.attributes('style')).toMatch(/justify-content:\s*flex-start/)

    const end = mount(SnSpace, { props: { justify: 'end' } })
    expect(end.attributes('style')).toMatch(/justify-content:\s*flex-end/)

    const between = mount(SnSpace, { props: { justify: 'space-between' } })
    expect(between.attributes('style')).toMatch(/justify-content:\s*space-between/)
  })

  it('applies align to align-items', () => {
    const w = mount(SnSpace, { props: { align: 'center' } })
    expect(w.attributes('style')).toMatch(/align-items:\s*center/)

    const stretch = mount(SnSpace, { props: { align: 'stretch' } })
    expect(stretch.attributes('style')).toMatch(/align-items:\s*stretch/)
  })

  it('renders as inline-flex when inline is true', () => {
    const w = mount(SnSpace, { props: { inline: true } })
    expect(w.classes()).toContain('sn-space--inline')
    expect(w.attributes('style')).toMatch(/display:\s*inline-flex/)
  })

  it('appends customClass and customStyle to the container', () => {
    const w = mount(SnSpace, {
      props: { customClass: 'my-stack', customStyle: { width: '100%' } },
    })
    expect(w.classes()).toContain('my-stack')
    expect(w.attributes('style')).toMatch(/width:\s*100%/)
  })
})
