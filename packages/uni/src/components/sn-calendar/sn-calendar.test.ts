/**
 * sn-calendar unit tests — uni-end calendar sheet.
 *
 * Behaviour only (AGENTS.md §46): the draft vs immediate write paths, the
 * confirm / cancel contract, the beforeConfirm veto, the shortcut chips and
 * the panel wiring. No rpx numbers in assertions.
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SnCalendar from './sn-calendar.vue'

const JUNE_15 = new Date(2024, 5, 15).getTime()

function mountCalendar(props: Record<string, unknown> = {}) {
  return mount(SnCalendar, {
    props: {
      visible: true,
      minDate: new Date(2024, 5, 1).getTime(),
      maxDate: new Date(2024, 5, 30).getTime(),
      ...props,
    },
  })
}

const dayCells = (w: ReturnType<typeof mount>) =>
  w.findAll('.sn-calendar-view__day')
    .filter(cell => !cell.classes().includes('sn-calendar-view__day--filler'))

describe('sn-calendar', () => {
  describe('structure', () => {
    it('renders the title and the confirm button', () => {
      const w = mountCalendar()
      expect(w.find('.sn-calendar__title').text()).toBe('选择日期')
      expect(w.find('.sn-calendar__confirm').text()).toBe('确定')
    })

    it('honours a custom title and confirm label', () => {
      const w = mountCalendar({ title: 'Pick a day', confirmText: 'OK' })
      expect(w.find('.sn-calendar__title').text()).toBe('Pick a day')
      expect(w.find('.sn-calendar__confirm').text()).toBe('OK')
    })

    it('hides the confirm button when showConfirm is off', () => {
      expect(mountCalendar({ showConfirm: false }).find('.sn-calendar__confirm').exists()).toBe(false)
    })

    it('renders the calendar panel body', () => {
      expect(mountCalendar().find('.sn-calendar-view').exists()).toBe(true)
    })

    it('stays out of the tree while invisible', () => {
      expect(mountCalendar({ visible: false }).find('.sn-calendar').exists()).toBe(false)
    })

    it('renders both footer slots', () => {
      const w = mountCalendar()
      expect(w.find('.sn-calendar__footer-left').exists()).toBe(true)
      expect(w.find('.sn-calendar__footer-right').exists()).toBe(true)
    })
  })

  describe('confirm / cancel', () => {
    it('writes v-model on confirm (deferred mode)', async () => {
      const w = mountCalendar()
      await dayCells(w)[9]?.trigger('tap')
      expect(w.emitted('update:modelValue')).toBeUndefined()
      await w.find('.sn-calendar__confirm').trigger('tap')
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number
      expect(new Date(value).getDate()).toBe(10)
    })

    it('emits confirm with the drafted value', async () => {
      const w = mountCalendar()
      await dayCells(w)[9]?.trigger('tap')
      await w.find('.sn-calendar__confirm').trigger('tap')
      const payload = w.emitted('confirm')?.[0]?.[0] as { value: number }
      expect(new Date(payload.value).getDate()).toBe(10)
    })

    it('closes after confirm', async () => {
      const w = mountCalendar()
      await w.find('.sn-calendar__confirm').trigger('tap')
      expect(w.emitted('update:visible')?.[0]).toEqual([false])
    })

    it('emits change on every tap without writing the model', async () => {
      const w = mountCalendar()
      await dayCells(w)[9]?.trigger('tap')
      expect(w.emitted('change')).toHaveLength(1)
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('writes the model immediately in immediateChange mode', async () => {
      const w = mountCalendar({ immediateChange: true })
      await dayCells(w)[9]?.trigger('tap')
      expect(w.emitted('update:modelValue')).toHaveLength(1)
    })

    it('keeps the sheet open when beforeConfirm returns false', async () => {
      const w = mountCalendar({ beforeConfirm: () => false })
      await w.find('.sn-calendar__confirm').trigger('tap')
      await Promise.resolve()
      expect(w.emitted('confirm')).toBeUndefined()
      expect(w.emitted('update:visible')).toBeUndefined()
    })

    it('passes the draft into beforeConfirm', async () => {
      const beforeConfirm = vi.fn(() => true)
      const w = mountCalendar({ beforeConfirm })
      await dayCells(w)[9]?.trigger('tap')
      await w.find('.sn-calendar__confirm').trigger('tap')
      await Promise.resolve()
      expect(beforeConfirm).toHaveBeenCalledTimes(1)
      const value = beforeConfirm.mock.calls[0]?.[0] as number
      expect(new Date(value).getDate()).toBe(10)
    })

    it('reverts the draft on cancel', async () => {
      const w = mountCalendar({ modelValue: JUNE_15 })
      await dayCells(w)[4]?.trigger('tap')
      await w.find('.sn-calendar__cancel').trigger('tap')
      expect(w.emitted('cancel')).toHaveLength(1)
      expect(w.emitted('update:modelValue')).toBeUndefined()
      expect(w.find('.sn-calendar-view__day--selected').text()).toBe('15')
    })

    it('emits open when visibility flips on', async () => {
      const w = mountCalendar({ visible: false })
      await w.setProps({ visible: true })
      expect(w.emitted('open')).toHaveLength(1)
    })
  })

  describe('shortcuts', () => {
    it('renders one chip per shortcut', () => {
      const w = mountCalendar({ shortcuts: [{ text: 'Today', days: 0 }, { text: 'Week', days: -7 }] })
      expect(w.findAll('.sn-calendar__shortcut')).toHaveLength(2)
    })

    it('writes the preset value on chip tap', async () => {
      const w = mountCalendar({
        shortcuts: [{ text: 'Fixed', value: JUNE_15 }],
      })
      await w.find('.sn-calendar__shortcut').trigger('tap')
      await w.find('.sn-calendar__confirm').trigger('tap')
      expect(w.emitted('update:modelValue')?.[0]?.[0]).toBe(JUNE_15)
    })

    it('computes a relative day offset', async () => {
      const w = mountCalendar({ shortcuts: [{ text: 'Yesterday', days: -1 }] })
      await w.find('.sn-calendar__shortcut').trigger('tap')
      await w.find('.sn-calendar__confirm').trigger('tap')
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number
      const expected = new Date()
      expected.setHours(0, 0, 0, 0)
      expected.setDate(expected.getDate() - 1)
      expect(value).toBe(expected.getTime())
    })

    it('wraps the shortcut value in an array for range types', async () => {
      const w = mountCalendar({
        type: 'daterange',
        shortcuts: [{ text: 'Fixed', value: JUNE_15 }],
      })
      await w.find('.sn-calendar__shortcut').trigger('tap')
      await w.find('.sn-calendar__confirm').trigger('tap')
      expect(w.emitted('update:modelValue')?.[0]?.[0]).toEqual([JUNE_15, JUNE_15])
    })

    it('invokes onShortcutsClick with the tapped chip', async () => {
      const onShortcutsClick = vi.fn()
      const shortcut = { text: 'Fixed', value: JUNE_15 }
      const w = mountCalendar({ shortcuts: [shortcut], onShortcutsClick })
      await w.find('.sn-calendar__shortcut').trigger('tap')
      expect(onShortcutsClick).toHaveBeenCalledWith(shortcut)
    })
  })

  describe('panel wiring', () => {
    it('forwards the type to the panel', () => {
      expect(mountCalendar({ type: 'daterange' }).find('.sn-calendar-view').classes())
        .toContain('sn-calendar-view--daterange')
    })

    it('forwards showPanelTitle', () => {
      expect(mountCalendar({ showPanelTitle: false }).find('.sn-calendar-view__month-title').exists())
        .toBe(false)
    })

    it('closes on mask tap when closeOnClickModal is on', async () => {
      const w = mountCalendar()
      await w.find('.sn-popup__modal').trigger('tap')
      expect(w.emitted('update:visible')?.[0]).toEqual([false])
    })

    it('stays open on mask tap when closeOnClickModal is off', async () => {
      const w = mountCalendar({ closeOnClickModal: false })
      await w.find('.sn-popup__modal').trigger('tap')
      expect(w.emitted('update:visible')).toBeUndefined()
    })
  })
})
