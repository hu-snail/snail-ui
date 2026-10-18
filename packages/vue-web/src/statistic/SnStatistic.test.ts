import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnStatistic from './SnStatistic.vue'

/** Mount SnStatistic through a wrapper component, mirroring real usage. */
function mountStatistic(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnStatistic },
      setup() {
        return () => h(SnStatistic, props as never, slots as never)
      },
    }),
  )
}

describe('SnStatistic (AUI-WEB-DD-016)', () => {
  describe('rendering', () => {
    it('renders label and value with the component marker', () => {
      const w = mountStatistic({ label: '统计数据', value: 99 })
      const root = w.find('.sn-statistic')
      expect(root.attributes('data-snui-component')).toBe('statistic')
      expect(root.find('.sn-statistic__label').text()).toBe('统计数据')
      expect(root.find('.sn-statistic__content').text()).toBe('99')
    })

    it('renders a zero value — 0 is a valid value, not "absent"', () => {
      const w = mountStatistic({ label: '余额', value: 0 })
      expect(w.find('.sn-statistic__content').text()).toBe('0')
    })

    it('accepts a string value', () => {
      const w = mountStatistic({ label: '版本', value: 'v3.0.0' })
      expect(w.find('.sn-statistic__content').text()).toBe('v3.0.0')
    })

    it('omits the label block when no label prop or slot is given', () => {
      const w = mountStatistic({ value: 1 })
      expect(w.find('.sn-statistic__label').exists()).toBe(false)
    })

    it('renders prefix and suffix spans around the content', () => {
      const w = mountStatistic(
        { label: '进度', value: 99 },
        {
          prefix: () => '￥',
          suffix: () => '/ 100',
        },
      )
      expect(w.find('.sn-statistic__prefix').text()).toBe('￥')
      expect(w.find('.sn-statistic__content').text()).toBe('99')
      expect(w.find('.sn-statistic__suffix').text()).toBe('/ 100')
    })

    it('omits prefix / suffix spans when the slots are absent', () => {
      const w = mountStatistic({ label: '进度', value: 99 })
      expect(w.find('.sn-statistic__prefix').exists()).toBe(false)
      expect(w.find('.sn-statistic__suffix').exists()).toBe(false)
    })
  })

  describe('slots', () => {
    it('uses the default slot as the value when no value prop is passed', () => {
      const w = mountStatistic({ label: '活跃用户' }, { default: () => '1,234,123' })
      expect(w.find('.sn-statistic__content').exists()).toBe(true)
      expect(w.find('.sn-statistic__content').text()).toBe('1,234,123')
    })

    it('gives the value prop precedence over the default slot', () => {
      const w = mountStatistic(
        { label: '活跃用户', value: 42 },
        { default: () => '1,234,123' },
      )
      expect(w.find('.sn-statistic__content').text()).toBe('42')
    })

    it('renders the label slot when no label prop is passed', () => {
      const w = mountStatistic({}, { label: () => '来自插槽' })
      expect(w.find('.sn-statistic__label').text()).toBe('来自插槽')
    })

    it('gives the label prop precedence over the label slot', () => {
      const w = mountStatistic(
        { label: 'prop 文本' },
        { label: () => '来自插槽' },
      )
      expect(w.find('.sn-statistic__label').text()).toBe('prop 文本')
    })
  })

  describe('tabularNums', () => {
    it('applies tabular-nums via inline style when tabular-nums is set', () => {
      const w = mountStatistic({ label: '数值', value: 1234, tabularNums: true })
      const value = w.find('.sn-statistic__value')
      expect(value.attributes('style')).toContain('font-variant-numeric: tabular-nums')
    })

    it('does not set the inline style by default', () => {
      const w = mountStatistic({ label: '数值', value: 1234 })
      expect(w.find('.sn-statistic__value').attributes('style')).toBeUndefined()
    })
  })
})
