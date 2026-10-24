/**
 * sn-calendar-view unit tests — uni-end month-grid calendar body.
 *
 * Behaviour only (AGENTS.md §46): month block generation, weekday rotation,
 * single / range / multiple selection writes, disabled bounds, the formatter
 * hook and the switch-mode navigation. No rpx numbers in assertions.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnCalendarView from './sn-calendar-view.vue'

const JUNE_15 = new Date(2024, 5, 15).getTime()

function mountView(props: Record<string, unknown> = {}) {
  return mount(SnCalendarView, {
    props: {
      minDate: new Date(2024, 5, 1).getTime(),
      maxDate: new Date(2024, 5, 30).getTime(),
      ...props,
    },
  })
}

const dayCells = (w: ReturnType<typeof mount>) =>
  w.findAll('.sn-calendar-view__day').filter(cell => !cell.classes().includes('sn-calendar-view__day--filler'))

describe('sn-calendar-view', () => {
  describe('structure', () => {
    it('renders one month block per month in range', () => {
      const w = mountView({
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      })
      expect(w.findAll('.sn-calendar-view__month')).toHaveLength(3)
    })

    it('renders the weekday headers starting on Sunday by default', () => {
      const w = mountView()
      expect(w.findAll('.sn-calendar-view__week').map(t => t.text())).toEqual(
        ['日', '一', '二', '三', '四', '五', '六'],
      )
    })

    it('rotates the weekday headers for firstDayOfWeek', () => {
      const w = mountView({ firstDayOfWeek: 1 })
      expect(w.findAll('.sn-calendar-view__week').map(t => t.text())).toEqual(
        ['一', '二', '三', '四', '五', '六', '日'],
      )
    })

    it('renders every day of the month', () => {
      expect(dayCells(mountView())).toHaveLength(30)
    })

    it('renders the month title when showPanelTitle is on', () => {
      expect(mountView().find('.sn-calendar-view__month-title').text()).toBe('2024 年 6 月')
      expect(mountView({ showPanelTitle: false }).find('.sn-calendar-view__month-title').exists())
        .toBe(false)
    })

    it('pads the grid with filler cells to whole weeks', () => {
      const w = mountView()
      expect(w.findAll('.sn-calendar-view__day').length % 7).toBe(0)
    })

    it('applies the type class', () => {
      expect(mountView({ type: 'daterange' }).classes()).toContain('sn-calendar-view--daterange')
    })
  })

  describe('single selection', () => {
    it('marks the selected day', () => {
      const w = mountView({ modelValue: JUNE_15 })
      const active = w.find('.sn-calendar-view__day--selected')
      expect(active.text()).toBe('15')
      expect(active.attributes('aria-selected')).toBe('true')
    })

    it('emits a timestamp when a day is tapped', async () => {
      const w = mountView()
      await dayCells(w)[10]?.trigger('tap')
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number
      expect(new Date(value).getDate()).toBe(11)
    })

    it('applies defaultTime to the emitted timestamp', async () => {
      const w = mountView({ defaultTime: '09:30:00' })
      await dayCells(w)[10]?.trigger('tap')
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number
      const d = new Date(value)
      expect(d.getHours()).toBe(9)
      expect(d.getMinutes()).toBe(30)
    })

    it('emits change alongside update:modelValue', async () => {
      const w = mountView()
      await dayCells(w)[10]?.trigger('tap')
      expect(w.emitted('change')).toHaveLength(1)
    })
  })

  describe('range selection', () => {
    it('marks the start and end days', () => {
      const w = mountView({
        type: 'daterange',
        modelValue: [new Date(2024, 5, 5).getTime(), new Date(2024, 5, 20).getTime()],
      })
      expect(w.findAll('.sn-calendar-view__day--start')).toHaveLength(1)
      expect(w.findAll('.sn-calendar-view__day--end')).toHaveLength(1)
    })

    it('marks the days in between as middle', () => {
      const w = mountView({
        type: 'daterange',
        modelValue: [new Date(2024, 5, 5).getTime(), new Date(2024, 5, 10).getTime()],
      })
      // 6, 7, 8, 9 → four middle days.
      expect(w.findAll('.sn-calendar-view__day--middle')).toHaveLength(4)
    })

    it('starts a new range when the second endpoint is already set', async () => {
      const w = mountView({
        type: 'daterange',
        modelValue: [new Date(2024, 5, 5).getTime(), new Date(2024, 5, 20).getTime()],
      })
      await dayCells(w)[9]?.trigger('tap')
      expect((w.emitted('update:modelValue')?.[0]?.[0] as number[])).toHaveLength(1)
    })

    it('orders the endpoints when tapped backwards', async () => {
      const w = mountView({
        type: 'daterange',
        modelValue: [new Date(2024, 5, 20).getTime()],
      })
      await dayCells(w)[4]?.trigger('tap')
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number[]
      expect(new Date(value[0] ?? 0).getDate()).toBe(5)
      expect(new Date(value[1] ?? 0).getDate()).toBe(20)
    })

    it('refuses a range wider than maxRange', async () => {
      const w = mountView({
        type: 'daterange',
        maxRange: 3,
        modelValue: [new Date(2024, 5, 1).getTime()],
      })
      await dayCells(w)[14]?.trigger('tap')
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('allows the same day when allowSameDay is set', async () => {
      const w = mountView({
        type: 'daterange',
        allowSameDay: true,
        modelValue: [new Date(2024, 5, 10).getTime()],
      })
      await dayCells(w)[9]?.trigger('tap')
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number[]
      expect(value[0]).toBe(value[1])
    })

    it('renders the range prompt hint when maxRange is set', () => {
      const w = mountView({ type: 'daterange', maxRange: 7, rangePrompt: 'too far' })
      expect(w.find('.sn-calendar-view__hint').text()).toBe('too far')
    })
  })

  describe('multiple selection', () => {
    it('adds a day to the selection', async () => {
      const w = mountView({ type: 'dates', modelValue: [] })
      await dayCells(w)[4]?.trigger('tap')
      expect((w.emitted('update:modelValue')?.[0]?.[0] as number[])).toHaveLength(1)
    })

    it('removes an already selected day', async () => {
      const w = mountView({
        type: 'dates',
        modelValue: [new Date(2024, 5, 5).getTime()],
      })
      await dayCells(w)[4]?.trigger('tap')
      expect(w.emitted('update:modelValue')?.[0]?.[0]).toEqual([])
    })

    it('marks selected days', () => {
      const w = mountView({
        type: 'dates',
        modelValue: [new Date(2024, 5, 5).getTime(), new Date(2024, 5, 9).getTime()],
      })
      expect(w.findAll('.sn-calendar-view__day--selected')).toHaveLength(2)
    })
  })

  describe('bounds + formatter', () => {
    it('disables days before minDate', () => {
      const w = mountView({
        minDate: new Date(2024, 5, 10).getTime(),
        maxDate: new Date(2024, 5, 30).getTime(),
      })
      const disabled = dayCells(w).filter(cell => cell.classes().includes('sn-calendar-view__day--disabled'))
      expect(disabled).toHaveLength(9)
    })

    it('does not emit for a disabled day', async () => {
      const w = mountView({
        minDate: new Date(2024, 5, 10).getTime(),
        maxDate: new Date(2024, 5, 30).getTime(),
      })
      await dayCells(w)[0]?.trigger('tap')
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('applies the formatter text / topInfo / bottomInfo', () => {
      const w = mountView({
        formatter: day => (day.text === '15'
          ? { text: 'Fifteenth', topInfo: 'today', bottomInfo: 'mid' }
          : undefined),
      })
      const cell = w.findAll('.sn-calendar-view__day').find(c => c.text().includes('Fifteenth'))
      expect(cell).toBeTruthy()
      expect(cell?.text()).toContain('today')
    })

    it('lets the formatter disable a day', async () => {
      const w = mountView({ formatter: day => (day.text === '15' ? { disabled: true } : undefined) })
      const disabled = w.findAll('.sn-calendar-view__day--disabled')
      expect(disabled.length).toBeGreaterThan(0)
    })
  })

  describe('switch modes', () => {
    it('renders every month in none mode', () => {
      const w = mountView({
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      })
      expect(w.findAll('.sn-calendar-view__month')).toHaveLength(3)
    })

    it('renders a single month plus controls in month mode', () => {
      const w = mountView({
        switchMode: 'month',
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      })
      expect(w.findAll('.sn-calendar-view__month')).toHaveLength(1)
      expect(w.find('.sn-calendar-view__controls').exists()).toBe(true)
    })

    it('advances the active month with the next control', async () => {
      const w = mountView({
        switchMode: 'month',
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      })
      await w.find('.sn-calendar-view__control--next').trigger('tap')
      expect(w.find('.sn-calendar-view__month-title').text()).toBe('2024 年 6 月')
    })

    it('shows the next-year control only in year-month mode', () => {
      const w = mountView({ switchMode: 'year-month' })
      expect(w.find('.sn-calendar-view__control--next-year').exists()).toBe(true)
      expect(mountView({ switchMode: 'month' }).find('.sn-calendar-view__control--next-year').exists())
        .toBe(false)
    })
  })

  describe('exposed API', () => {
    it('shiftMonth / shiftYear / jumpToToday do not throw', () => {
      const w = mountView({
        switchMode: 'year-month',
        minDate: new Date(2023, 0, 1).getTime(),
        maxDate: new Date(2025, 11, 31).getTime(),
      })
      const vm = w.vm as unknown as {
        shiftMonth(delta: number): void
        shiftYear(delta: number): void
        jumpToToday(): void
      }
      expect(() => { vm.shiftMonth(1) }).not.toThrow()
      expect(() => { vm.shiftYear(1) }).not.toThrow()
      expect(() => { vm.jumpToToday() }).not.toThrow()
    })
  })

  /* ── wd-calendar-view parity props (declared, no time roller) ────────── */

  it('accepts the time-roller parity props without changing the month grid', () => {
    const w = mountView({
      type: 'datetime',
      timeFilter: (type: string) => type !== 'second',
      timeItemHeight: 48,
      timeVisibleItemCount: 5,
      hideSecond: true,
    })
    expect(dayCells(w)).toHaveLength(30)
    expect(w.findAll('.sn-calendar-view__month')).toHaveLength(1)
  })
})
