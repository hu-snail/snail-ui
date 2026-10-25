/**
 * sn-picker-view-drag unit tests — the shared roller gesture engine.
 *
 * Behaviour only (AGENTS.md §46). The clock is injected so flick timing is
 * deterministic — no fake timers, no wall clock. Component-level gesture
 * coverage lives in `sn-picker-view.test.ts`.
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { createRollerDrag, type RollerDragOptions } from './sn-picker-view-drag'

/**
 * Pin the viewport to the 750rpx design reference (375px) so the px → rpx
 * fallback ratio is exactly 2 — every px number below then reads in whole
 * rows (44px = one 88rpx row) instead of depending on happy-dom's default
 * window width.
 */
beforeAll(() => {
  Object.defineProperty(globalThis, 'innerWidth', { value: 375, configurable: true, writable: true })
})

/** A touch event carrying only what the engine reads. */
function touchStart(y: number, identifier?: number): Event {
  return { touches: [{ clientY: y, identifier }] } as unknown as Event
}

/** A real `touchend`: empty `touches`, the point lives in `changedTouches`. */
function touchEnd(y: number, identifier?: number): Event {
  return {
    touches: [],
    changedTouches: [{ clientY: y, identifier }],
  } as unknown as Event
}

interface Harness {
  api: ReturnType<typeof createRollerDrag>
  commits: Array<[number, number]>
  starts: number[]
  ends: number[]
  tick(ms: number): void
}

function mountEngine(overrides: Partial<RollerDragOptions> = {}): Harness {
  let clock = 0
  const commits: Array<[number, number]> = []
  const starts: number[] = []
  const ends: number[] = []
  const api = createRollerDrag({
    isDisabled: () => false,
    itemRpx: () => 88,
    visibleCount: () => 6,
    indexOf: () => 0,
    lengthOf: () => 8,
    isRowDisabled: () => false,
    isImmediate: () => false,
    commit: (columnIndex, rowIndex) => commits.push([columnIndex, rowIndex]),
    onStart: () => starts.push(0),
    onEnd: () => ends.push(0),
    now: () => clock,
    ...overrides,
  })
  return {
    api,
    commits,
    starts,
    ends,
    tick(ms: number) {
      clock += ms
    },
  }
}

describe('sn-picker-view-drag', () => {
  describe('release coordinate', () => {
    it('reads the release point from changedTouches when touches is empty', () => {
      const { api, commits } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      api.onTouchEnd(touchEnd(256), 0)
      // 44px up at the 375px reference viewport (1px = 2rpx) = exactly 1 row.
      expect(commits).toEqual([[0, 1]])
    })

    it('ignores events without a touch point instead of jumping to y=0', () => {
      const { api, commits } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      api.onTouchMove({ touches: [] } as unknown as Event, 0)
      api.onTouchEnd({ touches: [] } as unknown as Event, 0)
      // The old engine returned 0 and snapped the wheel to a wild row.
      expect(commits).toEqual([])
    })
  })

  describe('momentum', () => {
    it('projects a fast flick beyond the finger travel', () => {
      const { api, commits, tick } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      tick(20)
      api.onTouchMove(touchStart(280), 0)
      tick(10)
      // Finger travel alone is 25px (~0.57 rows); the flick projects ~2.7 more.
      api.onTouchEnd(touchEnd(275), 0)
      expect(commits).toEqual([[0, 3]])
    })

    it('keeps only the dragged distance when the finger pauses', () => {
      const { api, commits, tick } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      tick(20)
      api.onTouchMove(touchStart(256), 0)
      tick(400)
      api.onTouchEnd(touchEnd(256), 0)
      expect(commits).toEqual([[0, 1]])
    })

    it('caps the flick so it never runs away', () => {
      const { api, commits, tick } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      tick(20)
      api.onTouchMove(touchStart(120), 0)
      tick(10)
      api.onTouchEnd(touchEnd(110), 0)
      // Raw travel ≈ 190px (~4.3 rows) + capped projection (5 rows) — the
      // commit must stay inside the 8-row column.
      const row = commits[0]?.[1]
      expect(row).toBeLessThanOrEqual(7)
      expect(row).toBeGreaterThan(3)
    })
  })

  describe('anchoring', () => {
    it('commits mid-drag relative to the touch origin, not the live selection', () => {
      const { api, commits, tick } = mountEngine({ isImmediate: () => true })
      api.onTouchStart(touchStart(300), 0)
      tick(16)
      api.onTouchMove(touchStart(256), 0)
      expect(commits.at(-1)).toEqual([0, 1])
      tick(16)
      // Roll the finger back down: the anchor is still row 0, so the engine
      // must return there (the old engine re-based and stayed on row 1).
      api.onTouchMove(touchStart(290), 0)
      expect(commits.at(-1)).toEqual([0, 0])
    })

    it('does not commit while dragging unless immediateChange is set', () => {
      const { api, commits, tick } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      tick(16)
      api.onTouchMove(touchStart(200), 0)
      expect(commits).toEqual([])
    })
  })

  describe('bounds', () => {
    it('damps the drag past the ends instead of stopping dead', () => {
      const { api } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      api.onTouchMove(touchStart(700), 0)
      // Base offset for row 0 is 220rpx; undamped would be 220 + 800 = 1020.
      expect(api.columnOffsetRpx(0)).toBe(220 + 800 * 0.35)
    })

    it('skips a disabled row when the drag settles on it', () => {
      const { api, commits } = mountEngine({ isRowDisabled: (_c, row) => row === 1 })
      api.onTouchStart(touchStart(300), 0)
      api.onTouchEnd(touchEnd(256), 0)
      expect(commits).toEqual([[0, 2]])
    })

    it('stays on the last row when the flick overshoots the end', () => {
      const { api, commits } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      api.onTouchEnd(touchEnd(0), 0)
      expect(commits).toEqual([[0, 7]])
    })
  })

  describe('gesture hygiene', () => {
    it('ignores a second simultaneous finger', () => {
      const { api, starts } = mountEngine()
      const twoFingers = {
        touches: [{ clientY: 100 }, { clientY: 200 }],
      } as unknown as Event
      api.onTouchStart(twoFingers, 0)
      expect(starts).toEqual([])
    })

    it('suppresses the trailing tap after a real drag only', () => {
      const { api } = mountEngine()
      expect(api.shouldIgnoreTap()).toBe(false)
      api.onTouchStart(touchStart(300), 0)
      api.onTouchEnd(touchEnd(256), 0)
      expect(api.shouldIgnoreTap()).toBe(true)
      // A new gesture resets the guard.
      api.onTouchStart(touchStart(300), 0)
      expect(api.shouldIgnoreTap()).toBe(false)
    })

    it('emits pickstart on touchstart and pickend on touchend / cancel', () => {
      const { api, starts, ends } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      expect(starts).toHaveLength(1)
      api.onTouchCancel(0)
      expect(ends).toHaveLength(1)
    })

    it('returns to rest without committing when the touch is cancelled', () => {
      const { api, commits } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      api.onTouchMove(touchStart(256), 0)
      api.onTouchCancel(0)
      expect(commits).toEqual([])
      expect(api.dragColumn.value).toBe(null)
    })

    it('scales the settle duration with the distance to the snapped row', () => {
      const { api } = mountEngine()
      api.onTouchStart(touchStart(300), 0)
      api.onTouchEnd(touchEnd(256), 0)
      const oneRow = api.snapDurationMs.value
      api.onTouchStart(touchStart(300), 0)
      api.onTouchEnd(touchEnd(100), 0)
      const fiveRows = api.snapDurationMs.value
      expect(fiveRows).toBeGreaterThan(oneRow)
    })
  })
})
