/**
 * sn-search unit tests — uni-end search field (AUI-MP-007).
 *
 * Behaviour only (AGENTS.md §46). No rpx numbers in assertions —
 * happy-dom discards lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnSearch from './sn-search.vue'

describe('sn-search', () => {
  describe('controlled value', () => {
    it('renders the modelValue', () => {
      const wrapper = mount(SnSearch, { props: { modelValue: 'aui' } })
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('aui')
    })

    it('emits update:modelValue and change on input', async () => {
      const wrapper = mount(SnSearch, { props: { modelValue: '' } })
      await wrapper.find('input').setValue('query')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['query'])
      expect(wrapper.emitted('change')?.at(-1)).toEqual(['query'])
    })

    it('works uncontrolled', async () => {
      const wrapper = mount(SnSearch)
      await wrapper.find('input').setValue('x')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['x'])
    })
  })

  describe('placeholder', () => {
    it('defaults to the wd-search placeholder', () => {
      const wrapper = mount(SnSearch)
      expect(wrapper.find('input').attributes('placeholder')).toBe('搜索')
    })

    it('forwards a custom placeholder and placeholderLeft', () => {
      const wrapper = mount(SnSearch, {
        props: { placeholder: 'Search products', placeholderLeft: true },
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Search products')
      expect(wrapper.classes()).toContain('sn-search--placeholder-left')
    })

    it('forwards placeholderStyle / placeholderClass', () => {
      const wrapper = mount(SnSearch, {
        props: { placeholderStyle: 'color: red;', placeholderClass: 'ph' },
      })
      const input = wrapper.find('input')
      expect(input.attributes('placeholder-style')).toBe('color: red;')
      expect(input.attributes('placeholder-class')).toBe('ph')
    })
  })

  describe('search / cancel events', () => {
    it('emits search with the current value on confirm', async () => {
      const wrapper = mount(SnSearch, { props: { modelValue: 'abc' } })
      await wrapper.find('input').trigger('confirm')
      expect(wrapper.emitted('search')?.at(-1)).toEqual(['abc'])
    })

    it('renders the cancel text and emits cancel when tapped', async () => {
      const wrapper = mount(SnSearch, { props: { modelValue: 'abc' } })
      expect(wrapper.find('.sn-search__cancel-text').text()).toBe('取消')
      await wrapper.find('.sn-search__cancel').trigger('tap')
      expect(wrapper.emitted('cancel')?.at(-1)).toEqual(['abc'])
    })

    it('forwards cancelTxt', () => {
      const wrapper = mount(SnSearch, { props: { cancelTxt: 'Cancel' } })
      expect(wrapper.find('.sn-search__cancel-text').text()).toBe('Cancel')
    })

    it('hides the cancel text when hideCancel is set', () => {
      const wrapper = mount(SnSearch, { props: { hideCancel: true } })
      expect(wrapper.find('.sn-search__cancel').exists()).toBe(false)
      expect(wrapper.classes()).toContain('sn-search--hide-cancel')
    })
  })

  describe('clearable', () => {
    it('shows the clear button only when there is a value', () => {
      expect(mount(SnSearch, { props: { modelValue: 'x' } })
        .find('.sn-search__clear').exists()).toBe(true)
      expect(mount(SnSearch, { props: { modelValue: '' } })
        .find('.sn-search__clear').exists()).toBe(false)
    })

    it('clears the value and emits clear / change', async () => {
      const wrapper = mount(SnSearch, { props: { modelValue: 'abc' } })
      await wrapper.find('.sn-search__clear-btn').trigger('tap')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
      expect(wrapper.emitted('change')?.at(-1)).toEqual([''])
      expect(wrapper.emitted('clear')).toHaveLength(1)
    })
  })

  describe('disabled', () => {
    it('applies the disabled attribute and class', () => {
      const wrapper = mount(SnSearch, { props: { disabled: true } })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('sn-search--disabled')
    })

    it('blocks input while disabled', async () => {
      const wrapper = mount(SnSearch, { props: { disabled: true, modelValue: '' } })
      await wrapper.find('input').setValue('nope')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('blocks search / cancel / clear while disabled', async () => {
      const wrapper = mount(SnSearch, { props: { disabled: true, modelValue: 'abc' } })
      await wrapper.find('input').trigger('confirm')
      expect(wrapper.emitted('search')).toBeUndefined()
      expect(wrapper.find('.sn-search__cancel').exists()).toBe(false)
      expect(wrapper.find('.sn-search__clear').exists()).toBe(false)
    })

    it('emits click on the root only while disabled', async () => {
      const disabled = mount(SnSearch, { props: { disabled: true } })
      await disabled.trigger('click')
      expect(disabled.emitted('click')).toHaveLength(1)

      const enabled = mount(SnSearch)
      await enabled.trigger('click')
      expect(enabled.emitted('click')).toBeUndefined()
    })
  })

  describe('variant', () => {
    it('defaults to the plain variant', () => {
      expect(mount(SnSearch).classes()).toContain('sn-search--plain')
    })

    it('applies the filled variant class', () => {
      expect(mount(SnSearch, { props: { variant: 'filled' } }).classes())
        .toContain('sn-search--filled')
    })

    it('applies the light variant class', () => {
      expect(mount(SnSearch, { props: { variant: 'light' } }).classes())
        .toContain('sn-search--light')
    })
  })

  describe('focus / blur / maxlength', () => {
    it('emits focus and blur and toggles the focused class', async () => {
      const wrapper = mount(SnSearch)
      await wrapper.find('input').trigger('focus')
      expect(wrapper.emitted('focus')).toHaveLength(1)
      expect(wrapper.classes()).toContain('sn-search--focused')
      await wrapper.find('input').trigger('blur')
      expect(wrapper.emitted('blur')).toHaveLength(1)
      expect(wrapper.classes()).not.toContain('sn-search--focused')
    })

    it('forwards maxlength as a number even when given a string', () => {
      const wrapper = mount(SnSearch, { props: { maxlength: '20' } })
      expect(wrapper.find('input').attributes('maxlength')).toBe('20')
    })

    it('sets role="search" on the root', () => {
      expect(mount(SnSearch).attributes('role')).toBe('search')
    })
  })

  describe('slots + forwarding', () => {
    it('renders prefix / input-suffix / suffix slots', () => {
      const wrapper = mount(SnSearch, {
        slots: {
          prefix: '<view data-testid="prefix">p</view>',
          'input-suffix': '<view data-testid="inner">i</view>',
          suffix: '<view data-testid="suffix">s</view>',
        },
      })
      expect(wrapper.find('[data-testid="prefix"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="inner"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="suffix"]').exists()).toBe(true)
    })

    it('forwards customClass / customStyle / customInputClass', () => {
      const wrapper = mount(SnSearch, {
        props: {
          customClass: 'my-search',
          customStyle: 'padding: 4px;',
          customInputClass: 'my-input',
        },
      })
      expect(wrapper.classes()).toContain('my-search')
      expect(wrapper.attributes('style')).toContain('padding: 4px')
      expect(wrapper.find('input').classes()).toContain('my-input')
    })
  })
})
