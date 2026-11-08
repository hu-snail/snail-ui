/**
 * sn-picker-view-drag unit tests — the shared roller gesture engine.
 *
 * Behaviour only (AGENTS.md §46). The clock is injected so flick timing is
 * deterministic — no fake timers, no wall clock. Component-level gesture
 * coverage lives in `sn-picker-view.test.ts`.
 *
 * Untestable in happy-dom: real touch-gesture physics (multi-finger
 * interpolated moves, real scroll-view interplay) — the engine is driven with
 * synthetic single-point events; and mini-program hosts (`typeof document ===
 * 'undefined'` is only simulated for the one guard test below).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createRollerDrag, type RollerDragOptions } from './sn-picker-view-drag';

/**
 * Pin the viewport to the 750rpx design reference (375px) so the px → rpx
 * fallback ratio is exactly 2 — every px number below then reads in whole
 * rows (44px = one 88rpx row) instead of depending on happy-dom's default
 * window width.
 */
beforeAll(() => {
  Object.defineProperty(globalThis, 'innerWidth', {
    value: 375,
    configurable: true,
    writable: true,
  });
});

/** A touch event carrying only what the engine reads. */
function touchStart(y: number, identifier?: number): Event {
  return { touches: [{ clientY: y, identifier }] } as unknown as Event;
}

/** A real `touchend`: empty `touches`, the point lives in `changedTouches`. */
function touchEnd(y: number, identifier?: number): Event {
  return {
    touches: [],
    changedTouches: [{ clientY: y, identifier }],
  } as unknown as Event;
}

interface Harness {
  api: ReturnType<typeof createRollerDrag>;
  commits: Array<[number, number]>;
  starts: number[];
  ends: number[];
  tick(ms: number): void;
}

function mountEngine(overrides: Partial<RollerDragOptions> = {}): Harness {
  let clock = 0;
  const commits: Array<[number, number]> = [];
  const starts: number[] = [];
  const ends: number[] = [];
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
  });
  return {
    api,
    commits,
    starts,
    ends,
    tick(ms: number) {
      clock += ms;
    },
  };
}

describe('sn-picker-view-drag', () => {
  describe('release coordinate', () => {
    it('reads the release point from changedTouches when touches is empty', () => {
      const { api, commits } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      api.onTouchEnd(touchEnd(256), 0);
      // 44px up at the 375px reference viewport (1px = 2rpx) = exactly 1 row.
      expect(commits).toEqual([[0, 1]]);
    });

    it('ignores events without a touch point instead of jumping to y=0', () => {
      const { api, commits } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      api.onTouchMove({ touches: [] } as unknown as Event, 0);
      api.onTouchEnd({ touches: [] } as unknown as Event, 0);
      // The old engine returned 0 and snapped the wheel to a wild row.
      expect(commits).toEqual([]);
    });
  });

  describe('momentum', () => {
    it('projects a fast flick beyond the finger travel', () => {
      const { api, commits, tick } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      tick(20);
      api.onTouchMove(touchStart(280), 0);
      tick(10);
      // Finger travel alone is 25px (~0.57 rows); the flick projects ~2.7 more.
      api.onTouchEnd(touchEnd(275), 0);
      expect(commits).toEqual([[0, 3]]);
    });

    it('keeps only the dragged distance when the finger pauses', () => {
      const { api, commits, tick } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      tick(20);
      api.onTouchMove(touchStart(256), 0);
      tick(400);
      api.onTouchEnd(touchEnd(256), 0);
      expect(commits).toEqual([[0, 1]]);
    });

    it('caps the flick so it never runs away', () => {
      const { api, commits, tick } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      tick(20);
      api.onTouchMove(touchStart(120), 0);
      tick(10);
      api.onTouchEnd(touchEnd(110), 0);
      // Raw travel ≈ 190px (~4.3 rows) + capped projection (5 rows) — the
      // commit must stay inside the 8-row column.
      const row = commits[0]?.[1];
      expect(row).toBeLessThanOrEqual(7);
      expect(row).toBeGreaterThan(3);
    });
  });

  describe('anchoring', () => {
    it('commits mid-drag relative to the touch origin, not the live selection', () => {
      const { api, commits, tick } = mountEngine({ isImmediate: () => true });
      api.onTouchStart(touchStart(300), 0);
      tick(16);
      api.onTouchMove(touchStart(256), 0);
      expect(commits.at(-1)).toEqual([0, 1]);
      tick(16);
      // Roll the finger back down: the anchor is still row 0, so the engine
      // must return there (the old engine re-based and stayed on row 1).
      api.onTouchMove(touchStart(290), 0);
      expect(commits.at(-1)).toEqual([0, 0]);
    });

    it('does not commit while dragging unless immediateChange is set', () => {
      const { api, commits, tick } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      tick(16);
      api.onTouchMove(touchStart(200), 0);
      expect(commits).toEqual([]);
    });
  });

  describe('bounds', () => {
    it('damps the drag past the ends instead of stopping dead', () => {
      const { api } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      api.onTouchMove(touchStart(700), 0);
      // Base offset for row 0 is 220rpx; undamped would be 220 + 800 = 1020.
      expect(api.columnOffsetRpx(0)).toBe(220 + 800 * 0.35);
    });

    it('damps the drag past the last row from the bottom anchor', () => {
      // Anchor on the last row of the column and drag upwards past it.
      const { api } = mountEngine({ indexOf: () => 7 });
      api.onTouchStart(touchStart(300), 0);
      api.onTouchMove(touchStart(0), 0);
      // Base offset for row 7 is (2.5 − 7) × 88 = −396rpx; the 300px travel
      // is 600rpx raw, damped to 35% (undamped would be −996).
      expect(api.columnOffsetRpx(0)).toBe(-396 + -600 * 0.35);
    });

    it('skips a disabled row when the drag settles on it', () => {
      const { api, commits } = mountEngine({ isRowDisabled: (_c, row) => row === 1 });
      api.onTouchStart(touchStart(300), 0);
      api.onTouchEnd(touchEnd(256), 0);
      expect(commits).toEqual([[0, 2]]);
    });

    it('stays on the last row when the flick overshoots the end', () => {
      const { api, commits } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      api.onTouchEnd(touchEnd(0), 0);
      expect(commits).toEqual([[0, 7]]);
    });
  });

  describe('coordinate sources', () => {
    it('falls back to pageY when clientY is absent', () => {
      const { api, commits } = mountEngine();
      api.onTouchStart({ touches: [{ pageY: 300 }] } as unknown as Event, 0);
      api.onTouchEnd(
        {
          touches: [],
          changedTouches: [{ pageY: 256 }],
        } as unknown as Event,
        0,
      );
      expect(commits).toEqual([[0, 1]]);
    });

    it('reads uni legacy detail.y when no touch list is present', () => {
      const { api, commits } = mountEngine();
      api.onTouchStart({ detail: { y: 300 } } as unknown as Event, 0);
      api.onTouchEnd({ detail: { y: 256 } } as unknown as Event, 0);
      expect(commits).toEqual([[0, 1]]);
    });
  });

  describe('column guards', () => {
    it('ignores move events that target another column', () => {
      const { api, commits } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      // A move attributed to column 1 must not drag column 0's wheel…
      api.onTouchMove(touchStart(200), 1);
      expect(api.columnOffsetRpx(0)).toBe(220);
      // …while `touchend` — which the DOM fires on the touchstart element,
      // so its columnIndex is deliberately ignored — still settles the
      // gesture on the owning column.
      api.onTouchEnd(touchEnd(256), 0);
      expect(commits).toEqual([[0, 1]]);
    });

    it('ignores a touchstart on an empty column', () => {
      const { api, starts } = mountEngine({ lengthOf: () => 0 });
      api.onTouchStart(touchStart(300), 0);
      expect(starts).toEqual([]);
    });

    it('ignores a touchend with no running gesture', () => {
      const { api, commits, ends } = mountEngine();
      api.onTouchEnd(touchEnd(256), 0);
      expect(commits).toEqual([]);
      expect(ends).toEqual([]);
    });

    it('never commits when the column empties mid-gesture', () => {
      let length = 8;
      const { api, commits, ends } = mountEngine({ lengthOf: () => length });
      api.onTouchStart(touchStart(300), 0);
      length = 0;
      api.onTouchEnd(touchEnd(256), 0);
      expect(commits).toEqual([]);
      expect(ends).toHaveLength(1);
    });
  });

  describe('gesture hygiene', () => {
    it('ignores a second simultaneous finger', () => {
      const { api, starts } = mountEngine();
      const twoFingers = {
        touches: [{ clientY: 100 }, { clientY: 200 }],
      } as unknown as Event;
      api.onTouchStart(twoFingers, 0);
      expect(starts).toEqual([]);
    });

    it('suppresses the trailing tap after a real drag only', () => {
      const { api } = mountEngine();
      expect(api.shouldIgnoreTap()).toBe(false);
      api.onTouchStart(touchStart(300), 0);
      api.onTouchEnd(touchEnd(256), 0);
      expect(api.shouldIgnoreTap()).toBe(true);
      // A new gesture resets the guard.
      api.onTouchStart(touchStart(300), 0);
      expect(api.shouldIgnoreTap()).toBe(false);
    });

    it('emits pickstart on touchstart and pickend on touchend / cancel', () => {
      const { api, starts, ends } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      expect(starts).toHaveLength(1);
      api.onTouchCancel(0);
      expect(ends).toHaveLength(1);
    });

    it('returns to rest without committing when the touch is cancelled', () => {
      const { api, commits } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      api.onTouchMove(touchStart(256), 0);
      api.onTouchCancel(0);
      expect(commits).toEqual([]);
      expect(api.dragColumn.value).toBe(null);
    });

    it('scales the settle duration with the distance to the snapped row', () => {
      const { api } = mountEngine();
      api.onTouchStart(touchStart(300), 0);
      api.onTouchEnd(touchEnd(256), 0);
      const oneRow = api.snapDurationMs.value;
      api.onTouchStart(touchStart(300), 0);
      api.onTouchEnd(touchEnd(100), 0);
      const fiveRows = api.snapDurationMs.value;
      expect(fiveRows).toBeGreaterThan(oneRow);
    });
  });

  /* ── Desktop H5: mouse drag + wheel ─────────────────────────────────── */

  describe('mouse + wheel (desktop H5)', () => {
    /** Cleanups to run after each test. */
    const teardown: Array<() => void> = [];

    afterEach(() => {
      while (teardown.length > 0) teardown.pop()?.();
    });

    /** A root + `data-snui-column` column, as the SFC renders them. */
    function mountSurface(api: ReturnType<typeof createRollerDrag>): {
      column: HTMLElement;
      dispose: () => void;
    } {
      const root = document.createElement('div');
      const column = document.createElement('div');
      column.setAttribute('data-snui-column', '0');
      root.appendChild(column);
      document.body.appendChild(root);
      const disposeMouse = api.bindMouseGestures(root);
      const dispose = (): void => {
        disposeMouse();
        root.remove();
      };
      teardown.push(dispose);
      return { column, dispose };
    }

    /** Document-level observer for one event type; auto-removed. */
    function observeDefaultPrevented(type: string): () => boolean {
      let prevented = false;
      const listener = (event: Event): void => {
        prevented = event.defaultPrevented;
      };
      // Bubble phase, so the engine's root listener (dispatched first for a
      // bubbling event) has already run by the time this fires.
      document.addEventListener(type, listener);
      teardown.push(() => document.removeEventListener(type, listener));
      return () => prevented;
    }

    function mouseDown(el: Element, y: number, button = 0): void {
      el.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true, button, clientY: y }),
      );
    }

    function mouseMove(y: number): void {
      document.dispatchEvent(new MouseEvent('mousemove', { clientY: y }));
    }

    function mouseUp(y: number): void {
      document.dispatchEvent(new MouseEvent('mouseup', { clientY: y }));
    }

    function wheel(el: Element, deltaY: number): void {
      el.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY }));
    }

    it('commits from a mouse drag like a touch drag', () => {
      const { api, commits } = mountEngine();
      const surface = mountSurface(api);
      mouseDown(surface.column, 300);
      mouseMove(256);
      mouseUp(256);
      // 44px up at the 375px reference viewport = exactly one row.
      expect(commits).toEqual([[0, 1]]);
    });

    it('tracks the roller with the pointer while the button is down', () => {
      const { api } = mountEngine();
      const surface = mountSurface(api);
      mouseDown(surface.column, 300);
      mouseMove(256);
      // Base offset for row 0 is 220rpx; one row up subtracts 88rpx.
      expect(api.columnOffsetRpx(0)).toBe(220 - 88);
      mouseUp(256);
    });

    it('emits pickstart / pickend for a mouse drag', () => {
      const { api, starts, ends } = mountEngine();
      const surface = mountSurface(api);
      mouseDown(surface.column, 300);
      mouseMove(256);
      mouseUp(256);
      expect(starts).toHaveLength(1);
      expect(ends).toHaveLength(1);
    });

    it('does not commit a mouse click in place', () => {
      const { api, commits } = mountEngine();
      const surface = mountSurface(api);
      mouseDown(surface.column, 300);
      mouseUp(298);
      expect(commits).toEqual([]);
    });

    it('ignores non-left buttons and presses outside a column', () => {
      const { api, starts } = mountEngine();
      const surface = mountSurface(api);
      mouseDown(surface.column, 300, 2);
      mouseDown(surface.column.parentElement as Element, 300);
      expect(starts).toEqual([]);
    });

    it('prevents the default mousedown so the drag cannot select page text', () => {
      const { api } = mountEngine();
      const surface = mountSurface(api);
      const wasPrevented = observeDefaultPrevented('mousedown');
      mouseDown(surface.column, 300);
      mouseUp(300);
      expect(wasPrevented()).toBe(true);
    });

    it('suppresses the synthetic mouse event that follows a touch', () => {
      const { api, tick, starts } = mountEngine();
      const surface = mountSurface(api);
      api.onTouchStart(touchStart(300), 0);
      api.onTouchEnd(touchEnd(300), 0);
      tick(100);
      mouseDown(surface.column, 300);
      expect(starts).toHaveLength(1);
      tick(600);
      mouseDown(surface.column, 300);
      expect(starts).toHaveLength(2);
      mouseUp(300);
    });

    it('keeps dragging when the pointer merely crosses an element boundary', () => {
      const { api, commits, ends } = mountEngine();
      const surface = mountSurface(api);
      mouseDown(surface.column, 300);
      // Crossing rows fires element-level `mouseleave`s — they must not end
      // the gesture (the "滚轮拖不动" regression).
      surface.column.dispatchEvent(new MouseEvent('mouseleave', { cancelable: true }));
      mouseMove(256);
      expect(api.dragColumn.value).toBe(0);
      mouseUp(256);
      expect(commits).toEqual([[0, 1]]);
      expect(ends).toHaveLength(1);
    });

    it('cancels the drag when the pointer leaves the window', () => {
      const { api, commits, ends } = mountEngine();
      const surface = mountSurface(api);
      mouseDown(surface.column, 300);
      mouseMove(256);
      document.dispatchEvent(new MouseEvent('mouseleave', { cancelable: true }));
      expect(api.dragColumn.value).toBe(null);
      expect(ends).toHaveLength(1);
      mouseUp(256);
      expect(commits).toEqual([]);
    });

    it('stops responding after dispose', () => {
      const { api, commits, starts } = mountEngine();
      const surface = mountSurface(api);
      surface.dispose();
      mouseDown(surface.column, 300);
      wheel(surface.column, 100);
      expect(starts).toEqual([]);
      expect(commits).toEqual([]);
    });

    it('advances one row per wheel notch', () => {
      // `indexOf` must follow the host selection update between notches.
      let current = 0;
      const { api, commits } = mountEngine({ indexOf: () => current });
      const surface = mountSurface(api);
      wheel(surface.column, 100);
      current = 1;
      wheel(surface.column, 100);
      expect(commits).toEqual([
        [0, 1],
        [0, 2],
      ]);
    });

    it('scrolls back on a negative wheel notch', () => {
      const { api, commits } = mountEngine({ indexOf: () => 3 });
      const surface = mountSurface(api);
      wheel(surface.column, -100);
      expect(commits).toEqual([[0, 2]]);
    });

    it('skips a disabled row on wheel travel', () => {
      const { api, commits } = mountEngine({ isRowDisabled: (_c, row) => row === 1 });
      const surface = mountSurface(api);
      wheel(surface.column, 100);
      expect(commits).toEqual([[0, 2]]);
    });

    it('clamps at the column ends without committing', () => {
      const { api, commits } = mountEngine({ indexOf: () => 7 });
      const surface = mountSurface(api);
      wheel(surface.column, 100);
      wheel(surface.column, 300);
      expect(commits).toEqual([]);
    });

    it('accumulates fractional notches into whole rows', () => {
      const { api, commits } = mountEngine();
      const surface = mountSurface(api);
      wheel(surface.column, 60);
      expect(commits).toEqual([]);
      wheel(surface.column, 60);
      expect(commits).toEqual([[0, 1]]);
    });

    it('prevents the default page scroll on wheel', () => {
      const { api } = mountEngine();
      const surface = mountSurface(api);
      const wasPrevented = observeDefaultPrevented('wheel');
      wheel(surface.column, 100);
      expect(wasPrevented()).toBe(true);
    });

    it('returns an inert disposer without a document (mini-program host)', () => {
      vi.stubGlobal('document', undefined);
      try {
        const { api } = mountEngine();
        const dispose = api.bindMouseGestures({} as HTMLElement);
        expect(typeof dispose).toBe('function');
        expect(() => dispose()).not.toThrow();
      } finally {
        vi.unstubAllGlobals();
      }
    });

    it('ignores mouse input while the roller is disabled', () => {
      const { api, commits, starts } = mountEngine({ isDisabled: () => true });
      const surface = mountSurface(api);
      mouseDown(surface.column, 300);
      wheel(surface.column, 100);
      expect(starts).toEqual([]);
      expect(commits).toEqual([]);
    });

    it('ignores a mousedown while a touch gesture is running', () => {
      const { api, starts } = mountEngine();
      const surface = mountSurface(api);
      api.onTouchStart(touchStart(300), 0);
      mouseDown(surface.column, 300);
      expect(starts).toHaveLength(1);
      api.onTouchCancel(0);
    });

    it('cancels a running mouse drag when the window loses focus', () => {
      const { api, commits, ends } = mountEngine();
      const surface = mountSurface(api);
      mouseDown(surface.column, 300);
      window.dispatchEvent(new Event('blur'));
      expect(api.dragColumn.value).toBe(null);
      expect(ends).toHaveLength(1);
      mouseUp(256);
      expect(commits).toEqual([]);
    });

    it('ignores columns with a malformed data-snui-column marker', () => {
      const { api, starts } = mountEngine();
      const root = document.createElement('div');
      document.body.appendChild(root);
      const disposeMouse = api.bindMouseGestures(root);
      teardown.push(() => {
        disposeMouse();
        root.remove();
      });
      for (const marker of ['', 'x', '-1']) {
        const column = document.createElement('div');
        column.setAttribute('data-snui-column', marker);
        root.appendChild(column);
        mouseDown(column, 300);
        mouseUp(300);
        column.remove();
      }
      expect(starts).toEqual([]);
    });

    it('ignores a wheel event another handler already consumed', () => {
      const { api, commits } = mountEngine();
      const surface = mountSurface(api);
      const event = new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        deltaY: 100,
      });
      Object.defineProperty(event, 'defaultPrevented', { value: true });
      surface.column.dispatchEvent(event);
      expect(commits).toEqual([]);
    });

    it('ignores wheel notches while a drag is running', () => {
      const { api, commits } = mountEngine();
      const surface = mountSurface(api);
      mouseDown(surface.column, 300);
      wheel(surface.column, 100);
      expect(commits).toEqual([]);
      mouseUp(256);
    });

    it('scales line-mode wheel deltas (Firefox) into rows', () => {
      // 4 lines × 33px = 132px → one notch.
      const { api, commits } = mountEngine();
      const surface = mountSurface(api);
      surface.column.dispatchEvent(
        new WheelEvent('wheel', {
          bubbles: true,
          cancelable: true,
          deltaY: 4,
          deltaMode: 1,
        }),
      );
      expect(commits).toEqual([[0, 1]]);
    });

    it('resets the wheel accumulator after an idle gap', () => {
      const { api, commits, tick } = mountEngine();
      const surface = mountSurface(api);
      wheel(surface.column, 60);
      tick(300);
      // 60 + 60 would be one row, but the gap wipes the accumulator.
      wheel(surface.column, 60);
      expect(commits).toEqual([]);
    });
  });
});
