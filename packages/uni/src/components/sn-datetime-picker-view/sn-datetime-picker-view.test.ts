/**
 * sn-datetime-picker-view unit tests — uni-end date / time roller body.
 *
 * Behaviour only (AGENTS.md §46): column sets per `type`, month-length
 * clamping, min / max bounds, the formatter / filter hooks, selection
 * writes and the exposed helpers. No rpx numbers in assertions.
 */

import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SnDatetimePickerView from './sn-datetime-picker-view.vue'

/**
 * Pin the viewport to the 750rpx design reference (375px) so the drag
 * engine's px → rpx fallback ratio is exactly 2 — drag assertions below read
 * in whole rows (44px = one 88rpx row) instead of depending on happy-dom's
 * default window width.
 */
beforeAll(() => {
  Object.defineProperty(globalThis, 'innerWidth', { value: 375, configurable: true, writable: true })
})

/** 2024-06-15 10:30:00 local time. */
const BASE = new Date(2024, 5, 15, 10, 30, 0).getTime()

function mountView(props: Record<string, unknown> = {}) {
  return mount(SnDatetimePickerView, {
    props: {
      modelValue: BASE,
      minDate: new Date(2020, 0, 1).getTime(),
      maxDate: new Date(2030, 11, 31, 23, 59, 59).getTime(),
      ...props,
    },
  })
}

const columnTypes = (w: ReturnType<typeof mount>) =>
  w.findAll('.sn-datetime-picker-view__column').length

const activeLabels = (w: ReturnType<typeof mount>) =>
  w.findAll('.sn-datetime-picker-view__item--active').map(item => item.text())

describe('sn-datetime-picker-view', () => {
  describe('column sets', () => {
    it('renders year / month / date / hour / minute for datetime', () => {
      expect(columnTypes(mountView())).toBe(5)
    })

    it('renders 3 columns for date', () => {
      expect(columnTypes(mountView({ type: 'date' }))).toBe(3)
    })

    it('renders 2 columns for year-month', () => {
      expect(columnTypes(mountView({ type: 'year-month' }))).toBe(2)
    })

    it('renders 1 column for year', () => {
      expect(columnTypes(mountView({ type: 'year' }))).toBe(1)
    })

    it('renders hour / minute for time', () => {
      const w = mountView({ type: 'time', modelValue: '10:30' })
      expect(columnTypes(w)).toBe(2)
      expect(activeLabels(w)).toEqual(['10', '30'])
    })

    it('adds the seconds column when useSecond is set', () => {
      expect(columnTypes(mountView({ useSecond: true }))).toBe(6)
    })
  })

  describe('selection display', () => {
    it('marks the selected rows active', () => {
      expect(activeLabels(mountView())).toEqual(['2024', '06', '15', '10', '30'])
    })

    it('formats month / date / time values with two digits', () => {
      const w = mountView({ modelValue: new Date(2024, 0, 5, 9, 8, 0).getTime() })
      expect(activeLabels(w)).toEqual(['2024', '01', '05', '09', '08'])
    })
  })

  describe('bounds', () => {
    it('limits the year column to the min / max years', () => {
      const w = mountView({
        type: 'year',
        minDate: new Date(2022, 0, 1).getTime(),
        maxDate: new Date(2024, 0, 1).getTime(),
      })
      const items = w.findAll('.sn-datetime-picker-view__item')
      expect(items).toHaveLength(3)
      expect(items[0]?.text()).toBe('2022')
      expect(items[2]?.text()).toBe('2024')
    })

    it('limits the day column to the month length', () => {
      const w = mountView({
        type: 'date',
        modelValue: new Date(2024, 1, 10).getTime(),
      })
      const dayColumn = w.findAll('.sn-datetime-picker-view__column')[2]
      // February 2024 has 29 days.
      expect(dayColumn?.findAll('.sn-datetime-picker-view__item')).toHaveLength(29)
    })

    it('drops days beyond the max date inside the max month', () => {
      const w = mountView({
        type: 'date',
        modelValue: new Date(2024, 5, 1).getTime(),
        minDate: new Date(2024, 0, 1).getTime(),
        maxDate: new Date(2024, 5, 10).getTime(),
      })
      const dayColumn = w.findAll('.sn-datetime-picker-view__column')[2]
      expect(dayColumn?.findAll('.sn-datetime-picker-view__item')).toHaveLength(10)
    })

    it('honours minHour / maxHour for the time type', () => {
      const w = mountView({ type: 'time', modelValue: '10:30', minHour: 8, maxHour: 18 })
      const hourColumn = w.findAll('.sn-datetime-picker-view__column')[0]
      const items = hourColumn?.findAll('.sn-datetime-picker-view__item') ?? []
      expect(items).toHaveLength(11)
      expect(items[0]?.text()).toBe('08')
    })
  })

  describe('selection writes', () => {
    it('emits a timestamp when a year is tapped', async () => {
      const w = mountView({ type: 'date' })
      await w.findAll('.sn-datetime-picker-view__column')[0]
        ?.findAll('.sn-datetime-picker-view__item')[0]?.trigger('tap')
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number
      expect(new Date(value).getFullYear()).toBe(2020)
    })

    it('emits an HH:mm string for the time type', async () => {
      const w = mountView({ type: 'time', modelValue: '10:30' })
      await w.findAll('.sn-datetime-picker-view__column')[0]
        ?.findAll('.sn-datetime-picker-view__item')[1]?.trigger('tap')
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['01:30'])
    })

    it('emits change with the value and the columns', async () => {
      const w = mountView({ type: 'date' })
      await w.findAll('.sn-datetime-picker-view__column')[1]
        ?.findAll('.sn-datetime-picker-view__item')[0]?.trigger('tap')
      const payload = w.emitted('change')?.[0]?.[0] as { value: number, columns: unknown[] }
      expect(typeof payload.value).toBe('number')
      expect(payload.columns).toHaveLength(3)
    })

    it('does not emit when the tapped row is already selected', async () => {
      const w = mountView({ type: 'date' })
      await w.findAll('.sn-datetime-picker-view__column')[2]
        ?.findAll('.sn-datetime-picker-view__item')[14]?.trigger('tap')
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('clamps the day when rolling into a shorter month', async () => {
      const w = mountView({
        type: 'date',
        modelValue: new Date(2024, 0, 31).getTime(),
      })
      await w.findAll('.sn-datetime-picker-view__column')[1]
        ?.findAll('.sn-datetime-picker-view__item')[1]?.trigger('tap')
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number
      expect(new Date(value).getMonth()).toBe(1)
      expect(new Date(value).getDate()).toBeLessThanOrEqual(29)
    })
  })

  describe('hooks', () => {
    it('applies the formatter to the labels', () => {
      const w = mountView({
        type: 'year',
        formatter: (type, value) => (type === 'year' ? `${value}!` : String(value)),
      })
      expect(w.find('.sn-datetime-picker-view__item--active').text()).toBe('2024!')
    })

    it('applies the filter to the column values', () => {
      const w = mountView({
        type: 'year',
        minDate: new Date(2020, 0, 1).getTime(),
        maxDate: new Date(2024, 0, 1).getTime(),
        filter: (_type, values) => values.filter(value => value % 2 === 0),
      })
      const items = w.findAll('.sn-datetime-picker-view__item')
      expect(items).toHaveLength(3)
      expect(items.map(item => item.text())).toEqual(['2020', '2022', '2024'])
    })

    it('applies the columnFormatter to the whole column', () => {
      const w = mountView({
        type: 'year',
        minDate: new Date(2020, 0, 1).getTime(),
        maxDate: new Date(2024, 0, 1).getTime(),
        columnFormatter: (_type, values) => values.slice(0, 2),
      })
      expect(w.findAll('.sn-datetime-picker-view__item')).toHaveLength(2)
    })
  })

  describe('touch', () => {
    it('emits pickstart / pickend', async () => {
      const w = mountView({ type: 'year' })
      const column = w.find('.sn-datetime-picker-view__column')
      await column.trigger('touchstart', { touches: [{ clientY: 100 }] })
      await column.trigger('touchend', { touches: [{ clientY: 100 }] })
      expect(w.emitted('pickstart')).toHaveLength(1)
      expect(w.emitted('pickend')).toHaveLength(1)
    })

    it('advances the selection when dragged far enough', async () => {
      const w = mountView({ type: 'year' })
      const column = w.find('.sn-datetime-picker-view__column')
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] })
      await column.trigger('touchend', { touches: [{ clientY: 250 }] })
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number
      expect(new Date(value).getFullYear()).toBe(2025)
    })
    it('reads the release point from changedTouches when touches is empty', async () => {
      // Regression: real `touchend` events carry an EMPTY `touches` array and
      // only `changedTouches` holds the point — the old read returned 0, so a
      // downward drag snapped the wheel to the LAST row instead of the first.
      const w = mountView({ type: 'year' })
      const column = w.find('.sn-datetime-picker-view__column')
      await column.trigger('touchstart', { touches: [{ clientY: 300, identifier: 1 }] })
      // Drag down well past the start: every momentum-free reading clamps to
      // the minimum year (2020), while the old y=0 bug landed on the maximum.
      await column.trigger('touchend', {
        touches: [],
        changedTouches: [{ clientY: 500, identifier: 1 }],
      })
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number
      expect(new Date(value).getFullYear()).toBe(2020)
    })
  })
  describe('exposed API', () => {
    it('getSelectedOptions returns one entry per column', () => {
      const w = mountView({ type: 'date' })
      const vm = w.vm as unknown as {
        getSelectedOptions(): Array<{ value: number, label: string }>
      }
      const options = vm.getSelectedOptions()
      expect(options).toHaveLength(3)
      expect(options[0]?.label).toBe('2024')
    })

    it('correctValue normalizes an out-of-range timestamp', () => {
      const w = mountView({ type: 'date' })
      const vm = w.vm as unknown as { correctValue(value: string | number): string | number }
      expect(typeof vm.correctValue(new Date(2024, 5, 15).getTime())).toBe('number')
    })

    it('correctValue normalizes a time string', () => {
      const w = mountView({ type: 'time' })
      const vm = w.vm as unknown as { correctValue(value: string | number): string | number }
      expect(vm.correctValue('9:5')).toBe('09:05')
    })
  })

  describe('desktop H5 mouse + wheel', () => {
    it('marks the root and columns for the mouse gesture path', () => {
      const w = mountView({ type: 'time' })
      expect(w.attributes('data-snui-mouse-gesture')).toBe('datetime-picker-view')
      const columns = w.findAll('.sn-datetime-picker-view__column')
      expect(columns[0]?.attributes('data-snui-column')).toBe('0')
      expect(columns[1]?.attributes('data-snui-column')).toBe('1')
    })

    it('selects a row from a mouse drag on the minute column', async () => {
      const w = mountView({ type: 'time', modelValue: '10:30' })
      const minute = w.findAll('.sn-datetime-picker-view__column')[1]?.element
      // One synchronous batch keeps the release inside the velocity window,
      // so the drag commits exactly the travelled rows.
      minute?.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientY: 300 }),
      )
      document.dispatchEvent(new MouseEvent('mousemove', { clientY: 256 }))
      document.dispatchEvent(new MouseEvent('mouseup', { clientY: 256 }))
      await nextTick()
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['10:31'])
    })

    it('advances the hour on a wheel notch', async () => {
      const w = mountView({ type: 'time', modelValue: '10:30' })
      const hour = w.findAll('.sn-datetime-picker-view__column')[0]?.element
      hour?.dispatchEvent(
        new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 }),
      )
      await nextTick()
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['11:30'])
    })

    it('stops the mouse listeners on unmount', () => {
      const w = mountView({ type: 'time', modelValue: '10:30' })
      const hour = w.findAll('.sn-datetime-picker-view__column')[0]?.element
      w.unmount()
      hour?.dispatchEvent(
        new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 }),
      )
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })
  })
})
