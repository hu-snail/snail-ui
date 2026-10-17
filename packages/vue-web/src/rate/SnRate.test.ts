/**
 * SnRate unit tests — web-end rating component.
 *
 * Tests cover behavior, not implementation detail (AGENTS.md §46):
 *   - click to rate (full + half)
 *   - clearable (click same value again → 0)
 *   - disabled / readonly suppress interaction
 *   - keyboard ArrowLeft / ArrowRight (±1, ±0.5 with allowHalf)
 *   - radiogroup / radio ARIA structure
 *   - count / size / custom star slot
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnRate from './SnRate.vue'

describe('SnRate', () => {
  it('renders 5 stars by default', () => {
    const wrapper = mount(SnRate)
    expect(wrapper.findAll('.sn-rate__item')).toHaveLength(5)
  })

  it('renders a custom count of stars', () => {
    const wrapper = mount(SnRate, { props: { count: 7 } })
    expect(wrapper.findAll('.sn-rate__item')).toHaveLength(7)
  })

  it('exposes a radiogroup with radio children', () => {
    const wrapper = mount(SnRate)
    expect(wrapper.attributes('role')).toBe('radiogroup')
    const items = wrapper.findAll('.sn-rate__item')
    expect(items.every(i => i.attributes('role') === 'radio')).toBe(true)
  })

  it('emits update:modelValue and change when a star is clicked', async () => {
    const wrapper = mount(SnRate, { props: { modelValue: 0 } })
    await wrapper.findAll('.sn-rate__item')[3].find('.sn-rate__full').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([4])
  })

  it('marks the matching radio as aria-checked', async () => {
    const wrapper = mount(SnRate, { props: { modelValue: 3 } })
    const items = wrapper.findAll('.sn-rate__item')
    expect(items[2].attributes('aria-checked')).toBe('true')
    expect(items[0].attributes('aria-checked')).toBe('false')
  })

  it('clips the fill overlay to the value', () => {
    const wrapper = mount(SnRate, { props: { modelValue: 3 } })
    const fills = wrapper.findAll('.sn-rate__fill')
    expect(fills[2].attributes('style')).toContain('100%')
    expect(fills[3].attributes('style')).toContain('0%')
  })

  it('supports half rating via the left hit zone', async () => {
    const wrapper = mount(SnRate, { props: { allowHalf: true, modelValue: 0 } })
    await wrapper.findAll('.sn-rate__item')[1].find('.sn-rate__half--left').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1.5])
  })

  it('supports half rating via the right hit zone', async () => {
    const wrapper = mount(SnRate, { props: { allowHalf: true, modelValue: 0 } })
    await wrapper.findAll('.sn-rate__item')[1].find('.sn-rate__half--right').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2])
  })

  it('keeps half-star layers fixed-size (no squashed/compressed star copies)', () => {
    // Regression: the hit zones are inline-flex, so without `flex: none` the
    // star SVGs flex-shrink to the 50%-wide zone and the half star renders
    // squashed and misaligned with the fill overlay. Every layer inside a
    // half item must carry the fixed-size `.sn-rate__star` class (width is
    // the star-size var), never a zone-derived size.
    const wrapper = mount(SnRate, { props: { allowHalf: true, modelValue: 3.5 } })
    const halfItem = wrapper.findAll('.sn-rate__item')[3]
    // Base layer: one same-size star per hit zone (2 zones), plus the filled
    // overlay reusing the same fixed-size star class — no scaled copy.
    expect(halfItem.findAll('.sn-rate__star--base')).toHaveLength(2)
    const zoneStars = [
      ...halfItem.findAll('.sn-rate__half .sn-rate__star'),
      halfItem.find('.sn-rate__star--filled'),
    ]
    for (const star of zoneStars) {
      expect(star.classes()).toContain('sn-rate__star')
    }
    // Fill overlay still clips to the half value.
    expect(halfItem.find('.sn-rate__fill').attributes('style')).toContain('width: 50%')
  })

  it('clears when the same value is clicked again and clearable is set', async () => {
    const wrapper = mount(SnRate, { props: { clearable: true, modelValue: 3 } })
    await wrapper.findAll('.sn-rate__item')[2].find('.sn-rate__full').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
  })

  it('does not clear on repeat click when clearable is false', async () => {
    const wrapper = mount(SnRate, { props: { clearable: false, modelValue: 3 } })
    await wrapper.findAll('.sn-rate__item')[2].find('.sn-rate__full').trigger('click')
    // No-op repeat click emits nothing (n-rate parity).
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('suppresses interaction when disabled', async () => {
    const wrapper = mount(SnRate, { props: { disabled: true, modelValue: 0 } })
    await wrapper.findAll('.sn-rate__item')[2].find('.sn-rate__full').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.classes()).toContain('sn-rate--disabled')
  })

  it('suppresses interaction when readonly', async () => {
    const wrapper = mount(SnRate, { props: { readonly: true, modelValue: 0 } })
    await wrapper.findAll('.sn-rate__item')[2].find('.sn-rate__full').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-readonly')).toBe('true')
    expect(wrapper.classes()).toContain('sn-rate--readonly')
  })

  it('increases the value with ArrowRight', async () => {
    const wrapper = mount(SnRate, { props: { modelValue: 2 } })
    await wrapper.findAll('.sn-rate__item')[1].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3])
  })

  it('decreases the value with ArrowLeft', async () => {
    const wrapper = mount(SnRate, { props: { modelValue: 2 } })
    await wrapper.findAll('.sn-rate__item')[1].trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1])
  })

  it('moves in 0.5 steps with ArrowLeft when allowHalf is set', async () => {
    const wrapper = mount(SnRate, { props: { allowHalf: true, modelValue: 2 } })
    await wrapper.findAll('.sn-rate__item')[1].trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1.5])
  })

  it('clamps keyboard navigation to 0 and count', async () => {
    const wrapper = mount(SnRate, { props: { modelValue: 0 } })
    await wrapper.findAll('.sn-rate__item')[0].trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    const full = mount(SnRate, { props: { modelValue: 5 } })
    await full.findAll('.sn-rate__item')[4].trigger('keydown', { key: 'ArrowRight' })
    expect(full.emitted('update:modelValue')).toBeUndefined()
  })

  it('ignores keyboard input when disabled', async () => {
    const wrapper = mount(SnRate, { props: { disabled: true, modelValue: 2 } })
    await wrapper.findAll('.sn-rate__item')[1].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('applies the size class', () => {
    const wrapper = mount(SnRate, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('sn-rate--large')
  })

  it('exposes the color prop as the --sn-rate-color variable', () => {
    const wrapper = mount(SnRate, {
      props: { color: 'var(--sn-web-color-feedback-warning)' },
    })
    expect(wrapper.attributes('style')).toContain('--sn-rate-color')
  })

  it('keeps a single tab stop at the active star', () => {
    const wrapper = mount(SnRate, { props: { modelValue: 3 } })
    const items = wrapper.findAll('.sn-rate__item')
    expect(items[2].attributes('tabindex')).toBe('0')
    expect(items[0].attributes('tabindex')).toBe('-1')
  })

  it('renders the custom icon slot instead of the built-in star', () => {
    const wrapper = mount(SnRate, {
      props: { modelValue: 2 },
      slots: {
        icon: '<i data-testid="custom-star" />',
      },
    })
    expect(wrapper.findAll('[data-testid="custom-star"]').length).toBe(5)
  })

  it('treats null modelValue as 0', () => {
    const wrapper = mount(SnRate, { props: { modelValue: null } })
    const fills = wrapper.findAll('.sn-rate__fill')
    expect(fills[0].attributes('style')).toContain('0%')
  })
})
