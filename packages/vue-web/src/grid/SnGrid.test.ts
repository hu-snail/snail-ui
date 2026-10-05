import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnGrid from './SnGrid.vue'

describe('SnGrid (AUI-WEB-LAYOUT-002)', () => {
  it('renders a grid with default 24 columns', () => {
    const w = mount(SnGrid)
    expect(w.classes()).toContain('sn-grid')
    expect(w.attributes('style')).toMatch(/grid-template-columns:\s*repeat\(24/)
  })

  it('honors custom cols (numeric)', () => {
    const w = mount(SnGrid, { props: { cols: 3 } })
    expect(w.attributes('style')).toMatch(/grid-template-columns:\s*repeat\(3/)
  })

  it('honors xGap and yGap as px numbers', () => {
    const w = mount(SnGrid, { props: { cols: 2, xGap: 16, yGap: 24 } })
    const style = w.attributes('style') ?? ''
    expect(style).toMatch(/column-gap:\s*16px/)
    expect(style).toMatch(/row-gap:\s*24px/)
  })

  it('honors xGap / yGap as string values', () => {
    const w = mount(SnGrid, { props: { xGap: '32', yGap: '8px' } })
    const style = w.attributes('style') ?? ''
    expect(style).toMatch(/column-gap:\s*32px/)
    expect(style).toMatch(/row-gap:\s*8px/)
  })

  it('falls back to 0px when xGap / yGap are empty', () => {
    const w = mount(SnGrid, { props: { xGap: '', yGap: '' } })
    const style = w.attributes('style') ?? ''
    expect(style).toMatch(/column-gap:\s*0px/)
    expect(style).toMatch(/row-gap:\s*0px/)
  })

  it('falls back to 24 columns when cols is invalid (0, negative, NaN)', () => {
    const w0 = mount(SnGrid, { props: { cols: 0 } })
    expect(w0.attributes('style')).toMatch(/repeat\(24/)

    const wNeg = mount(SnGrid, { props: { cols: -1 } })
    expect(wNeg.attributes('style')).toMatch(/repeat\(24/)

    const wStr = mount(SnGrid, { props: { cols: 'abc' as unknown as number } })
    expect(wStr.attributes('style')).toMatch(/repeat\(24/)
  })

  it('renders children inside the grid container', () => {
    const w = mount(SnGrid, {
      props: { cols: 2 },
      slots: { default: '<div>a</div><div>b</div>' },
    })
    expect(w.findAll('div').length).toBeGreaterThanOrEqual(2)
    expect(w.text()).toContain('a')
    expect(w.text()).toContain('b')
  })

  it('applies itemResponsive class when enabled', () => {
    const w = mount(SnGrid, { props: { itemResponsive: true } })
    expect(w.classes()).toContain('sn-grid--item-responsive')
  })
})