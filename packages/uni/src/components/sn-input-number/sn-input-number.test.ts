/**
 * sn-input-number unit tests — uni-end numeric stepper.
 *
 * Behaviour only (AGENTS.md §46): clamping, step snapping, precision,
 * beforeChange veto (sync + async), allowNull, per-button disable flags and
 * the long-press timer teardown. No rpx numbers in assertions.
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SnInputNumber from './sn-input-number.vue'

function mountNumber(props: Record<string, unknown> = {}) {
  return mount(SnInputNumber, { props: { modelValue: 5, min: 0, max: 10, ...props } })
}

const lastValue = (w: ReturnType<typeof mountNumber>): unknown =>
  w.emitted('update:modelValue')?.at(-1)?.[0]

afterEach(() => {
  vi.useRealTimers()
})

describe('sn-input-number', () => {
  describe('structure', () => {
    it('renders the minus / plus buttons and the field', () => {
      const w = mountNumber()
      expect(w.find('.sn-input-number__minus').exists()).toBe(true)
      expect(w.find('.sn-input-number__plus').exists()).toBe(true)
      expect(w.find('.sn-input-number__field').exists()).toBe(true)
    })

    it('hides the field when withoutInput is set', () => {
      const w = mountNumber({ withoutInput: true })
      expect(w.find('.sn-input-number__field').exists()).toBe(false)
      expect(w.classes()).toContain('sn-input-number--without-input')
    })

    it('applies the theme class', () => {
      expect(mountNumber({ theme: 'outline' }).classes()).toContain('sn-input-number--outline')
      expect(mountNumber({ theme: 'primary' }).classes()).toContain('sn-input-number--primary')
    })

    it('applies the round class', () => {
      expect(mountNumber({ round: true }).classes()).toContain('sn-input-number--round')
    })

    it('shows the model value in the field', () => {
      const field = mountNumber({ modelValue: 7 }).find('.sn-input-number__field')
      expect((field.element as HTMLInputElement).value).toBe('7')
    })

    it('renders the placeholder', () => {
      const field = mountNumber({ modelValue: '', allowNull: true, placeholder: 'qty' })
        .find('.sn-input-number__field')
      expect(field.attributes('placeholder')).toBe('qty')
    })
  })

  describe('stepping', () => {
    it('emits update:modelValue + change on plus', async () => {
      const w = mountNumber({ modelValue: 5 })
      await w.find('.sn-input-number__plus').trigger('tap')
      await Promise.resolve()
      expect(lastValue(w)).toBe(6)
      expect(w.emitted('change')?.at(-1)).toEqual([{ value: 6 }])
    })

    it('emits update:modelValue on minus', async () => {
      const w = mountNumber({ modelValue: 5 })
      await w.find('.sn-input-number__minus').trigger('tap')
      await Promise.resolve()
      expect(lastValue(w)).toBe(4)
    })

    it('honours a custom step', async () => {
      const w = mountNumber({ modelValue: 5, step: 0.5, precision: 1 })
      await w.find('.sn-input-number__plus').trigger('tap')
      await Promise.resolve()
      expect(lastValue(w)).toBe(5.5)
    })

    it('clamps at max', async () => {
      const w = mountNumber({ modelValue: 10, max: 10 })
      await w.find('.sn-input-number__plus').trigger('tap')
      await Promise.resolve()
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('clamps at min', async () => {
      const w = mountNumber({ modelValue: 0, min: 0 })
      await w.find('.sn-input-number__minus').trigger('tap')
      await Promise.resolve()
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('marks the buttons disabled at the bounds', () => {
      const w = mountNumber({ modelValue: 0, min: 0 })
      expect(w.find('.sn-input-number__minus').attributes('aria-disabled')).toBe('true')
      expect(w.find('.sn-input-number__minus').attributes('tabindex')).toBe('-1')
    })

    it('snaps onto the step grid when stepStrictly is on', async () => {
      const w = mountNumber({ modelValue: 3, min: 0, max: 10, step: 4, stepStrictly: true })
      await w.find('.sn-input-number__plus').trigger('tap')
      await Promise.resolve()
      // 3 + 4 = 7 snaps onto the 0 / 4 / 8 grid → 8.
      expect(lastValue(w)).toBe(8)
    })

    it('keeps the precision digits', async () => {
      const w = mountNumber({ modelValue: 1.234, min: 0, max: 10, precision: 2 })
      await w.find('.sn-input-number__plus').trigger('tap')
      await Promise.resolve()
      expect(lastValue(w)).toBe(2.23)
    })
  })

  describe('disable flags', () => {
    it('blocks everything when disabled', async () => {
      const w = mountNumber({ disabled: true })
      await w.find('.sn-input-number__plus').trigger('tap')
      await w.find('.sn-input-number__minus').trigger('tap')
      await Promise.resolve()
      expect(w.emitted('update:modelValue')).toBeUndefined()
      expect(w.classes()).toContain('sn-input-number--disabled')
    })

    it('blocks only the plus button with disablePlus', async () => {
      const w = mountNumber({ disablePlus: true })
      await w.find('.sn-input-number__plus').trigger('tap')
      await Promise.resolve()
      expect(w.emitted('update:modelValue')).toBeUndefined()
      await w.find('.sn-input-number__minus').trigger('tap')
      await Promise.resolve()
      expect(lastValue(w)).toBe(4)
    })

    it('blocks only the minus button with disableMinus', async () => {
      const w = mountNumber({ disableMinus: true })
      await w.find('.sn-input-number__minus').trigger('tap')
      await Promise.resolve()
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('blocks the field when disableInput is set', async () => {
      const w = mountNumber({ disableInput: true })
      const field = w.find('.sn-input-number__field')
      expect(field.attributes('disabled')).toBeDefined()
    })
  })

  describe('beforeChange veto', () => {
    it('keeps the value when beforeChange returns false', async () => {
      const beforeChange = vi.fn(() => false)
      const w = mountNumber({ beforeChange })
      await w.find('.sn-input-number__plus').trigger('tap')
      await Promise.resolve()
      expect(beforeChange).toHaveBeenCalledWith(6)
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('keeps the value when the async beforeChange resolves false', async () => {
      const w = mountNumber({ beforeChange: async () => false })
      await w.find('.sn-input-number__plus').trigger('tap')
      await Promise.resolve()
      await Promise.resolve()
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('applies the change when beforeChange allows it', async () => {
      const w = mountNumber({ beforeChange: () => true })
      await w.find('.sn-input-number__plus').trigger('tap')
      await Promise.resolve()
      await Promise.resolve()
      expect(lastValue(w)).toBe(6)
    })
  })

  describe('field interaction', () => {
    it('commits the typed value on input', async () => {
      const w = mountNumber({ modelValue: 5 })
      await w.find('.sn-input-number__field').setValue('7')
      await Promise.resolve()
      expect(lastValue(w)).toBe(7)
    })

    it('does not commit out-of-range typing immediately', async () => {
      const w = mountNumber({ modelValue: 5, max: 10 })
      await w.find('.sn-input-number__field').setValue('99')
      await Promise.resolve()
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('clamps on blur', async () => {
      const w = mountNumber({ modelValue: 5, max: 10 })
      const field = w.find('.sn-input-number__field')
      await field.setValue('99')
      await field.trigger('blur')
      await Promise.resolve()
      await Promise.resolve()
      expect(lastValue(w)).toBe(10)
    })

    it('defers the commit until blur when immediateChange is off', async () => {
      const w = mountNumber({ modelValue: 5, immediateChange: false })
      const field = w.find('.sn-input-number__field')
      await field.setValue('8')
      expect(w.emitted('update:modelValue')).toBeUndefined()
      await field.trigger('blur')
      await Promise.resolve()
      await Promise.resolve()
      expect(lastValue(w)).toBe(8)
    })

    it('emits focus and blur payloads', async () => {
      const w = mountNumber({ modelValue: 5 })
      const field = w.find('.sn-input-number__field')
      await field.trigger('focus')
      await field.trigger('blur')
      expect(w.emitted('focus')?.[0]).toEqual([{ value: 5, height: 0 }])
      expect(w.emitted('blur')?.[0]).toEqual([{ value: 5 }])
    })
  })

  describe('allowNull', () => {
    it('keeps an empty value when allowNull is on', async () => {
      const w = mountNumber({ modelValue: 5, allowNull: true })
      await w.find('.sn-input-number__field').setValue('')
      await Promise.resolve()
      expect(lastValue(w)).toBe('')
    })

    it('refuses to clear when allowNull is off', async () => {
      const w = mountNumber({ modelValue: 5, allowNull: false })
      await w.find('.sn-input-number__field').setValue('')
      await Promise.resolve()
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('updateOnInit', () => {
    it('emits the corrected value on mount', () => {
      const w = mountNumber({ modelValue: 99, max: 10, updateOnInit: true })
      expect(lastValue(w)).toBe(10)
    })

    it('stays silent when updateOnInit is off', () => {
      const w = mountNumber({ modelValue: 99, max: 10, updateOnInit: false })
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('long press', () => {
    it('repeats the step while held and stops on release', async () => {
      vi.useFakeTimers()
      const w = mountNumber({ modelValue: 0, max: 100, longPress: true })
      await w.find('.sn-input-number__plus').trigger('touchstart')
      await vi.advanceTimersByTimeAsync(400)
      const emitted = w.emitted('update:modelValue')?.length ?? 0
      expect(emitted).toBeGreaterThan(0)
      await w.find('.sn-input-number__plus').trigger('touchend')
      const settled = w.emitted('update:modelValue')?.length ?? 0
      await vi.advanceTimersByTimeAsync(400)
      expect(w.emitted('update:modelValue')?.length ?? 0).toBe(settled)
    })

    it('clears the repeat timer on unmount', async () => {
      vi.useFakeTimers()
      const clearSpy = vi.spyOn(globalThis, 'clearInterval')
      const w = mountNumber({ modelValue: 0, max: 100, longPress: true })
      await w.find('.sn-input-number__plus').trigger('touchstart')
      await vi.advanceTimersByTimeAsync(200)
      expect(w.emitted('update:modelValue')?.length ?? 0).toBeGreaterThan(0)
      w.unmount()
      expect(clearSpy).toHaveBeenCalled()
      clearSpy.mockRestore()
    })

    it('does not repeat when longPress is off', async () => {
      vi.useFakeTimers()
      const w = mountNumber({ modelValue: 0, max: 100, longPress: false })
      await w.find('.sn-input-number__plus').trigger('touchstart')
      await vi.advanceTimersByTimeAsync(400)
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })
  })
})
