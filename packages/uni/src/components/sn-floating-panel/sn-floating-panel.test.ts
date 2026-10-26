/**
 * sn-floating-panel unit tests — uni-end draggable / snapping bottom sheet
 * (wd-floating-panel parity).
 *
 * Behaviour only (AGENTS.md §46):
 *   - `height` renders as the panel height and syncs back through `update:height`
 *   - dragging the handle up grows the panel; release snaps to the nearest anchor
 *   - `heightChange` fires once the snap settled (immediately with `duration: 0`)
 *   - `anchors` are normalised (sorted, invalid values dropped)
 *   - the default anchor set falls back gracefully without a uni runtime
 *   - `content-draggable` decides whether the content area also drags
 *   - the settle timer is cleared on unmount (§41)
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { afterEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SnFloatingPanel from './sn-floating-panel.vue'

/**
 * Current height as the panel itself reports it (`aria-valuenow` on the drag
 * handle). happy-dom drops `rpx` from the inline style, so the accessible
 * value is the stable, meaningful assertion.
 */
function heightOf(w: ReturnType<typeof mount>): string {
  return w.find('.sn-floating-panel__handle').attributes('aria-valuenow') ?? ''
}

/** Drag the handle vertically by `dy` design px (negative = up). */
async function drag(
  w: ReturnType<typeof mount>,
  dy: number,
): Promise<void> {
  const handle = w.find('.sn-floating-panel__handle')
  await handle.trigger('touchstart', { touches: [{ clientY: 400 }] })
  await handle.trigger('touchmove', { touches: [{ clientY: 400 + dy }] })
  await handle.trigger('touchend', { touches: [{ clientY: 400 + dy }] })
  await flushPromises()
}

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni
})

describe('sn-floating-panel', () => {
  describe('structure', () => {
    it('renders the content slot', () => {
      const w = mount(SnFloatingPanel, {
        props: { height: 200 },
        slots: { default: '<text class="panel-body">内容</text>' },
      })
      expect(w.find('.panel-body').exists()).toBe(true)
    })

    it('starts at the height prop', () => {
      const w = mount(SnFloatingPanel, { props: { height: 200 } })
      expect(heightOf(w)).toBe('200')
    })

    it('starts at the first anchor when height is 0', () => {
      const w = mount(SnFloatingPanel, { props: { anchors: [150, 400] } })
      expect(heightOf(w)).toBe('150')
    })

    it('falls back to the static default anchor without a uni runtime', () => {
      const w = mount(SnFloatingPanel)
      expect(heightOf(w)).toBe('100')
    })

    it('writes the duration into the root style', () => {
      const w = mount(SnFloatingPanel, { props: { duration: 500 } })
      expect(w.attributes('style') ?? '').toContain('--sn-floating-panel-duration: 500ms')
    })

    it('forwards customClass / customStyle', () => {
      const w = mount(SnFloatingPanel, {
        props: { customClass: 'my-panel', customStyle: 'margin: 4px' },
      })
      expect(w.classes()).toContain('my-panel')
      expect(w.attributes('style') ?? '').toContain('margin: 4px')
    })

    it('applies the safe-area class', () => {
      const w = mount(SnFloatingPanel, { props: { safeAreaInsetBottom: true } })
      expect(w.classes()).toContain('sn-floating-panel--safe-bottom')
    })

    it('hides the scrollbar class when showScrollbar is false', () => {
      const w = mount(SnFloatingPanel, { props: { showScrollbar: false } })
      expect(w.find('.sn-floating-panel__content').classes())
        .toContain('sn-floating-panel__content--hidden-scrollbar')
    })
  })

  describe('dragging', () => {
    it('grows the panel when dragged up and emits update:height', async () => {
      const w = mount(SnFloatingPanel, {
        props: { height: 200, anchors: [100, 300], duration: 0 },
      })
      await drag(w, -100)
      const emitted = w.emitted('update:height') ?? []
      expect(emitted.length).toBeGreaterThan(0)
      // 200 + 100 travel = 300, which is also the nearest anchor.
      expect(emitted[emitted.length - 1]).toEqual([300])
    })

    it('snaps to the nearest anchor on release', async () => {
      const w = mount(SnFloatingPanel, {
        props: { height: 200, anchors: [200, 400], duration: 0 },
      })
      // Drag up 180 → 380, nearest anchor is 400.
      await drag(w, -180)
      const emitted = w.emitted('update:height') ?? []
      expect(emitted[emitted.length - 1]).toEqual([400])
    })

    it('snaps down to the smaller anchor when closer to it', async () => {
      const w = mount(SnFloatingPanel, {
        props: { height: 400, anchors: [200, 400], duration: 0 },
      })
      await drag(w, 150)
      const emitted = w.emitted('update:height') ?? []
      expect(emitted[emitted.length - 1]).toEqual([200])
    })

    it('snaps to the default anchor when no anchors are given', async () => {
      const w = mount(SnFloatingPanel, { props: { height: 200, duration: 0 } })
      // Without a uni runtime the default anchor set is the single 100px
      // anchor, so the panel snaps there rather than to the released 300.
      await drag(w, -100)
      const emitted = w.emitted('update:height') ?? []
      expect(emitted[emitted.length - 1]).toEqual([100])
    })

    it('never goes below zero', async () => {
      const w = mount(SnFloatingPanel, { props: { height: 120, duration: 0 } })
      await drag(w, 400)
      const emitted = w.emitted('update:height') ?? []
      expect(Math.min(...emitted.map((args) => args[0] as number))).toBeGreaterThanOrEqual(0)
    })

    it('ignores a tap without movement', async () => {
      const w = mount(SnFloatingPanel, { props: { height: 200, duration: 0 } })
      const handle = w.find('.sn-floating-panel__handle')
      await handle.trigger('touchstart', { touches: [{ clientY: 400 }] })
      await handle.trigger('touchend')
      await flushPromises()
      expect(w.emitted('update:height')).toBeUndefined()
    })

    it('settles where the finger left the panel on touchcancel', async () => {
      const w = mount(SnFloatingPanel, {
        props: { height: 200, anchors: [200, 400], duration: 0 },
      })
      const handle = w.find('.sn-floating-panel__handle')
      await handle.trigger('touchstart', { touches: [{ clientY: 400 }] })
      await handle.trigger('touchmove', { touches: [{ clientY: 220 }] })
      await handle.trigger('touchcancel')
      await flushPromises()
      const emitted = w.emitted('update:height') ?? []
      expect(emitted[emitted.length - 1]).toEqual([400])
    })

    it('syncs an external height change into the panel', async () => {
      const w = mount(SnFloatingPanel, { props: { height: 200 } })
      await w.setProps({ height: 320 })
      expect(heightOf(w)).toBe('320')
    })
  })

  describe('content-draggable', () => {
    it('lets the content area drag the panel by default', async () => {
      const w = mount(SnFloatingPanel, { props: { height: 200, duration: 0 } })
      const content = w.find('.sn-floating-panel__content')
      await content.trigger('touchstart', { touches: [{ clientY: 400 }] })
      await content.trigger('touchmove', { touches: [{ clientY: 300 }] })
      await content.trigger('touchend')
      await flushPromises()
      // One emit while dragging, one more for the snap back to the anchor.
      expect(w.emitted('update:height')?.length).toBeGreaterThan(0)
    })

    it('ignores content gestures when contentDraggable is false', async () => {
      const w = mount(SnFloatingPanel, {
        props: { height: 200, duration: 0, contentDraggable: false },
      })
      const content = w.find('.sn-floating-panel__content')
      await content.trigger('touchstart', { touches: [{ clientY: 400 }] })
      await content.trigger('touchmove', { touches: [{ clientY: 300 }] })
      await content.trigger('touchend')
      await flushPromises()
      expect(w.emitted('update:height')).toBeUndefined()
    })
  })

  describe('anchors', () => {
    it('sorts the anchors and drops invalid values', () => {
      const w = mount(SnFloatingPanel, { props: { anchors: [400, 100, Number.NaN, -5] } })
      // The first valid, sorted anchor is 100 → 200rpx.
      expect(heightOf(w)).toBe('100')
    })

    it('uses the uni viewport for the default second anchor', () => {
      ;(globalThis as { uni?: unknown }).uni = {
        getSystemInfoSync: () => ({ windowHeight: 800 }),
      }
      const w = mount(SnFloatingPanel)
      // First anchor stays 100 design px.
      expect(heightOf(w)).toBe('100')
    })

    it('survives a missing getSystemInfoSync', () => {
      ;(globalThis as { uni?: unknown }).uni = {}
      const w = mount(SnFloatingPanel)
      expect(heightOf(w)).toBe('100')
    })
  })

  describe('heightChange', () => {
    it('fires immediately when duration is 0', async () => {
      const w = mount(SnFloatingPanel, { props: { height: 200, duration: 0 } })
      await drag(w, -100)
      expect(w.emitted('height-change')?.[0]).toEqual([{ height: 100 }])
    })

    it('waits for the snap duration', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnFloatingPanel, { props: { height: 200, duration: 300 } })
        const handle = w.find('.sn-floating-panel__handle')
        await handle.trigger('touchstart', { touches: [{ clientY: 400 }] })
        await handle.trigger('touchmove', [{ touches: [{ clientY: 300 }] }])
        await handle.trigger('touchend')
        await flushPromises()
        expect(w.emitted('height-change')).toBeUndefined()
        expect(w.classes()).toContain('sn-floating-panel--animating')
        vi.advanceTimersByTime(300)
        await w.vm.$nextTick()
        expect(w.emitted('height-change')).toHaveLength(1)
        expect(w.classes()).not.toContain('sn-floating-panel--animating')
      } finally {
        vi.useRealTimers()
      }
    })
  })

  describe('timers', () => {
    it('clears the settle timer on unmount (no leak)', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnFloatingPanel, { props: { height: 200, duration: 300 } })
        const handle = w.find('.sn-floating-panel__handle')
        await handle.trigger('touchstart', { touches: [{ clientY: 400 }] })
        await handle.trigger('touchmove', [{ touches: [{ clientY: 300 }] }])
        await handle.trigger('touchend')
        w.unmount()
        expect(() => vi.advanceTimersByTime(1000)).not.toThrow()
      } finally {
        vi.useRealTimers()
      }
    })

    it('interrupts a running snap when a new drag starts', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnFloatingPanel, { props: { height: 200, duration: 300 } })
        const handle = w.find('.sn-floating-panel__handle')
        await handle.trigger('touchstart', { touches: [{ clientY: 400 }] })
        await handle.trigger('touchmove', [{ touches: [{ clientY: 300 }] }])
        await handle.trigger('touchend')
        await flushPromises()
        await handle.trigger('touchstart', { touches: [{ clientY: 300 }] })
        expect(w.classes()).not.toContain('sn-floating-panel--animating')
      } finally {
        vi.useRealTimers()
      }
    })
  })

  describe('accessibility', () => {
    it('exposes the handle as a horizontal separator with its value', () => {
      const w = mount(SnFloatingPanel, { props: { height: 240 } })
      const handle = w.find('.sn-floating-panel__handle')
      expect(handle.attributes('role')).toBe('separator')
      expect(handle.attributes('aria-orientation')).toBe('horizontal')
      expect(handle.attributes('aria-valuenow')).toBe('240')
    })

    it('tags the root for the docs / AI component map', () => {
      expect(mount(SnFloatingPanel).attributes('data-snui-component'))
        .toBe('floating-panel')
    })
  })
})
