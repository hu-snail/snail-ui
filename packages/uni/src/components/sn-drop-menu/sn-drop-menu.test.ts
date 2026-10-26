/**
 * sn-drop-menu unit tests — uni-end filter bar (wd-drop-menu parity).
 *
 * Behaviour only (AGENTS.md §46):
 *   - the bar toggles the panel; `open` / `opened` / `close` / `closed` fire
 *   - `before-toggle` returning false blocks the toggle, async included
 *   - a row tap emits `update:modelValue` + `change` with `{ value, selectedItem }`
 *   - `valueKey` / `labelKey` / `tipKey` remap the option fields
 *   - `title` overrides the selected label; `disabled` blocks every tap
 *   - the scrim honours `modal` / `closeOnClickModal`
 *   - the transition timer is cleared on unmount (§41)
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SnDropMenu from './sn-drop-menu.vue'

/**
 * Drain both queues.
 *
 * `duration: 0` still schedules a `setTimeout(0)` for the transition
 * callback, and `flushPromises()` only drains microtasks — the macrotask that
 * emits `opened` / `closed` never runs without this. Awaiting a real
 * timeout keeps the test on real timers (no fake-timer bookkeeping) and is the
 * smallest fix for a correct component.
 */
async function flushAll(): Promise<void> {
  await flushPromises()
  // Under fake timers a real `setTimeout` never resolves, so advance the fake
  // clock instead — the tests that assert timer ordering install fake timers
  // themselves and expect to control every tick.
  if (vi.isFakeTimers()) {
    vi.advanceTimersByTime(0)
  } else {
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
  await flushPromises()
}

const options = [
  { label: '综合排序', value: 'default', tip: '推荐' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '销量优先', value: 'sales', disabled: true },
]

describe('sn-drop-menu', () => {
  describe('structure', () => {
    it('renders the placeholder while nothing is selected', () => {
      const w = mount(SnDropMenu, { props: { options } })
      expect(w.find('.sn-drop-menu__label').text()).toBe('请选择')
      expect(w.find('.sn-drop-menu__label').classes()).toContain('sn-drop-menu__label--placeholder')
    })

    it('renders the selected option label', () => {
      const w = mount(SnDropMenu, { props: { options, modelValue: 'price-asc' } })
      expect(w.find('.sn-drop-menu__label').text()).toBe('价格从低到高')
    })

    it('prefers the title over the selected label', () => {
      const w = mount(SnDropMenu, {
        props: { options, modelValue: 'price-asc', title: '排序方式' },
      })
      expect(w.find('.sn-drop-menu__label').text()).toBe('排序方式')
    })

    it('renders no panel while closed', () => {
      const w = mount(SnDropMenu, { props: { options } })
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(false)
    })

    it('renders one row per option once open, with the tip line', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      expect(w.findAll('.sn-drop-menu__option')).toHaveLength(3)
      expect(w.find('.sn-drop-menu__option-tip').text()).toBe('推荐')
    })

    it('marks the selected row active and renders its check glyph', async () => {
      const w = mount(SnDropMenu, {
        props: { options, modelValue: 'price-asc', duration: 0 },
      })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      const rows = w.findAll('.sn-drop-menu__option')
      expect(rows[1]!.classes()).toContain('sn-drop-menu__option--active')
      expect(w.findAll('.sn-drop-menu__option-check')).toHaveLength(1)
    })

    it('applies the direction class and forwards customClass / customStyle', () => {
      const w = mount(SnDropMenu, {
        props: { direction: 'up', customClass: 'my-menu', customStyle: 'margin: 4px' },
      })
      expect(w.classes()).toContain('sn-drop-menu--up')
      expect(w.classes()).toContain('my-menu')
      expect(w.attributes('style') ?? '').toContain('margin: 4px')
    })

    it('writes zIndex and duration into the root style', () => {
      const w = mount(SnDropMenu, { props: { zIndex: 30, duration: 400 } })
      const style = w.attributes('style') ?? ''
      expect(style).toContain('z-index: 30')
      expect(style).toContain('--sn-drop-menu-duration: 400ms')
    })

    it('forwards customPopupClass / customPopupStyle / popupHeight to the panel', async () => {
      const w = mount(SnDropMenu, {
        props: {
          options,
          duration: 0,
          customPopupClass: 'my-popup',
          customPopupStyle: 'padding: 2px',
          popupHeight: '300px',
        },
      })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      const panel = w.find('.sn-drop-menu__popup')
      expect(panel.classes()).toContain('my-popup')
      const style = panel.attributes('style') ?? ''
      expect(style).toContain('height: 300px')
      expect(style).toContain('padding: 2px')
    })
  })

  describe('field keys', () => {
    it('remaps the option fields through valueKey / labelKey / tipKey', async () => {
      const custom = [{ name: '自定义', id: 7, note: '说明' }]
      const w = mount(SnDropMenu, {
        props: {
          options: custom,
          modelValue: 7,
          labelKey: 'name',
          valueKey: 'id',
          tipKey: 'note',
          duration: 0,
        },
      })
      expect(w.find('.sn-drop-menu__label').text()).toBe('自定义')
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      expect(w.find('.sn-drop-menu__option-tip').text()).toBe('说明')
    })
  })

  describe('interaction', () => {
    it('opens on a bar tap and emits open / opened', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      expect(w.emitted('open')).toHaveLength(1)
      expect(w.emitted('opened')).toHaveLength(1)
      expect(w.classes()).toContain('sn-drop-menu--open')
    })

    it('closes on a second bar tap and emits close / closed', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      expect(w.emitted('close')).toHaveLength(1)
      expect(w.emitted('closed')).toHaveLength(1)
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(false)
    })

    it('ignores the bar tap while disabled', async () => {
      const w = mount(SnDropMenu, { props: { options, disabled: true, duration: 0 } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      expect(w.emitted('open')).toBeUndefined()
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(false)
      expect(w.find('.sn-drop-menu__bar').attributes('aria-disabled')).toBe('true')
    })

    it('emits update:modelValue and change with the picked option', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      await w.findAll('.sn-drop-menu__option')[1]!.trigger('tap')
      await flushPromises()
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['price-asc'])
      expect(w.emitted('change')?.[0]).toEqual([
        { value: 'price-asc', selectedItem: options[1] },
      ])
    })

    it('closes after a row is picked', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      await w.findAll('.sn-drop-menu__option')[0]!.trigger('tap')
      await flushPromises()
      expect(w.emitted('close')).toHaveLength(1)
    })

    it('ignores taps on a disabled row', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      const row = w.findAll('.sn-drop-menu__option')[2]!
      await row.trigger('tap')
      await flushPromises()
      expect(w.emitted('change')).toBeUndefined()
      expect(row.attributes('aria-disabled')).toBe('true')
    })

    it('closes on a scrim tap', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      await w.find('.sn-drop-menu__modal').trigger('tap')
      await flushPromises()
      expect(w.emitted('close')).toHaveLength(1)
    })

    it('keeps the menu open on a scrim tap when closeOnClickModal is false', async () => {
      const w = mount(SnDropMenu, {
        props: { options, duration: 0, closeOnClickModal: false },
      })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      await w.find('.sn-drop-menu__modal').trigger('tap')
      await flushPromises()
      expect(w.emitted('close')).toBeUndefined()
    })

    it('renders no scrim when modal is false', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0, modal: false } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      expect(w.find('.sn-drop-menu__modal').exists()).toBe(false)
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(true)
    })
  })

  describe('before-toggle guard', () => {
    it('blocks opening when the guard returns false', async () => {
      const beforeToggle = vi.fn(() => false)
      const w = mount(SnDropMenu, { props: { options, duration: 0, beforeToggle } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      expect(beforeToggle).toHaveBeenCalledWith({ status: true })
      expect(w.emitted('open')).toBeUndefined()
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(false)
    })

    it('opens when the guard resolves true asynchronously', async () => {
      const beforeToggle = vi.fn(async () => true)
      const w = mount(SnDropMenu, { props: { options, duration: 0, beforeToggle } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      expect(w.emitted('open')).toHaveLength(1)
      expect(w.find('.sn-drop-menu__popup').exists()).toBe(true)
    })

    it('blocks closing when the guard returns false', async () => {
      const beforeToggle = vi.fn(({ status }: { status: boolean }) => status)
      const w = mount(SnDropMenu, { props: { options, duration: 0, beforeToggle } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      expect(beforeToggle).toHaveBeenCalledWith({ status: false })
      expect(w.emitted('close')).toBeUndefined()
      expect(w.classes()).toContain('sn-drop-menu--open')
    })
  })

  describe('timers', () => {
    it('keeps the panel mounted until the duration elapses', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnDropMenu, { props: { options, duration: 200 } })
        await w.find('.sn-drop-menu__bar').trigger('tap')
        await flushAll()
        expect(w.emitted('opened')).toBeUndefined()
        vi.advanceTimersByTime(200)
        expect(w.emitted('opened')).toHaveLength(1)

        await w.find('.sn-drop-menu__bar').trigger('tap')
        await flushAll()
        expect(w.find('.sn-drop-menu__popup').exists()).toBe(true)
        expect(w.emitted('closed')).toBeUndefined()
        vi.advanceTimersByTime(200)
        await w.vm.$nextTick()
        expect(w.emitted('closed')).toHaveLength(1)
        expect(w.find('.sn-drop-menu__popup').exists()).toBe(false)
      } finally {
        vi.useRealTimers()
      }
    })

    it('clears the pending transition timer on unmount (no leak)', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnDropMenu, { props: { options, duration: 200 } })
        await w.find('.sn-drop-menu__bar').trigger('tap')
        await flushAll()
        w.unmount()
        expect(() => vi.advanceTimersByTime(1000)).not.toThrow()
      } finally {
        vi.useRealTimers()
      }
    })
  })

  describe('accessibility', () => {
    it('marks the bar as an expanded button', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } })
      const bar = w.find('.sn-drop-menu__bar')
      expect(bar.attributes('role')).toBe('button')
      expect(bar.attributes('aria-expanded')).toBe('false')
      await bar.trigger('tap')
      await flushPromises()
      expect(w.find('.sn-drop-menu__bar').attributes('aria-expanded')).toBe('true')
    })

    it('marks option rows with a menuitem role', async () => {
      const w = mount(SnDropMenu, { props: { options, duration: 0 } })
      await w.find('.sn-drop-menu__bar').trigger('tap')
      await flushAll()
      expect(w.findAll('.sn-drop-menu__option')[0]!.attributes('role')).toBe('menuitem')
    })

    it('tags the root for the docs / AI component map', () => {
      expect(mount(SnDropMenu).attributes('data-snui-component')).toBe('drop-menu')
    })
  })
})
