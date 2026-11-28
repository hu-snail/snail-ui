/**
 * sn-slider-bar-drag unit tests — the shared pointer engine.
 *
 * Behaviour only (AGENTS.md §46): geometry mapping, the anchor rules that keep
 * the thumb under the finger, frame coalescing and the platform guards.
 * Component-level rendering stays in `sn-slider-bar.test.ts`.
 *
 * Untestable in happy-dom: real browser mouse capture (`bindMouse` is exercised
 * only for its `typeof document === 'undefined'` guard and its listener
 * bookkeeping) and native touch scrolling.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createSliderBarDrag, type SliderBarRect } from './sn-slider-bar-drag';

/** A 400 × 40 track starting at (50, 100) — every ratio below reads in px. */
const BOX: SliderBarRect = { left: 50, top: 100, width: 400, height: 40 };

/** Touch event carrying only what the engine reads. */
function touch(x: number, y: number): Event {
  return { touches: [{ clientX: x, clientY: y }] } as unknown as Event;
}

function touchEnd(x: number, y: number): Event {
  return { touches: [], changedTouches: [{ clientX: x, clientY: y }] } as unknown as Event;
}

interface Harness {
  api: ReturnType<typeof createSliderBarDrag>;
  moves: Array<[number, number]>;
  grabs: number[];
  settles: Array<[number, number | null]>;
  /** Run the pending animation frame. */
  flush(): void;
  setPercent(value: number): void;
}

function mountEngine(
  options: {
    vertical?: boolean;
    disabled?: boolean;
    percent?: number;
    nearest?: (ratio: number) => number;
    trackRect?: () => SliderBarRect | null;
  } = {},
): Harness {
  const moves: Array<[number, number]> = [];
  const grabs: number[] = [];
  const settles: Array<[number, number | null]> = [];
  let percent = options.percent ?? 50;
  const api = createSliderBarDrag({
    isDisabled: () => options.disabled === true,
    isVertical: () => options.vertical === true,
    knobPercentOf: () => percent,
    nearest: options.nearest ?? (() => 0),
    trackRect: options.trackRect,
    onGrab: (index) => grabs.push(index),
    onMove: (index, ratio) => moves.push([index, ratio]),
    onSettle: (index, ratio) => settles.push([index, ratio]),
  });
  return {
    api,
    moves,
    grabs,
    settles,
    flush: () => flushFrame(),
    setPercent: (value) => {
      percent = value;
    },
  };
}

/* A manual frame queue — `nextFrame` resolves `requestAnimationFrame` per call,
   so stubbing the global is enough to make coalescing deterministic. */
let frames: Array<() => void> = [];

function flushFrame(): void {
  const queue = frames;
  frames = [];
  for (const cb of queue) cb();
}

beforeAll(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
    frames.push(cb);
    return frames.length;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
});

afterEach(() => {
  frames = [];
  vi.unstubAllGlobals();
  vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
    frames.push(cb);
    return frames.length;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
});

describe('sn-slider-bar-drag', () => {
  it('jumps to the press point when the track is pressed', () => {
    const h = mountEngine();
    h.api.startFromTrack(touch(50 + 100, 120), BOX);
    // 100 / 400 = 25 % — committed immediately, before any move.
    expect(h.moves).toEqual([[0, 0.25]]);
    expect(h.grabs).toEqual([0]);
  });

  it('keeps the grab anchor on the knob instead of jumping to it', () => {
    const h = mountEngine({ percent: 50 });
    // Press 30 px left of the knob centre — the knob must not move yet.
    h.api.startFromKnob(touch(50 + 200 - 30, 120), 0, BOX);
    expect(h.moves).toEqual([]);
    // Dragging 40 px right moves the knob 40 / 400 = 10 %.
    h.api.move(touch(50 + 200 + 10, 120));
    h.flush();
    expect(h.moves).toHaveLength(1);
    expect(h.moves[0]?.[0]).toBe(0);
    expect(h.moves[0]?.[1]).toBeCloseTo(0.6, 6);
  });

  it('clamps the dragged ratio to the track', () => {
    const h = mountEngine({ percent: 90 });
    h.api.startFromKnob(touch(50 + 360, 120), 0, BOX);
    h.api.move(touch(50 + 900, 120));
    h.flush();
    h.api.move(touch(50 - 900, 120));
    h.flush();
    expect(h.moves).toEqual([
      [0, 1],
      [0, 0],
    ]);
  });

  it('coalesces a burst of moves into one commit per frame', () => {
    const h = mountEngine({ percent: 20 });
    h.api.startFromKnob(touch(50 + 80, 120), 0, BOX);
    h.api.move(touch(50 + 100, 120));
    h.api.move(touch(50 + 140, 120));
    h.api.move(touch(50 + 200, 120));
    expect(h.moves).toEqual([]); // nothing before the frame runs
    h.flush();
    expect(h.moves).toHaveLength(1);
    expect(h.moves[0]?.[1]).toBeCloseTo(0.5, 6); // last position wins
  });

  it('reports the released position and settles once', () => {
    const h = mountEngine({ percent: 10 });
    h.api.startFromKnob(touch(50 + 40, 120), 0, BOX);
    h.api.end(touchEnd(50 + 240, 120));
    expect(h.moves).toHaveLength(1);
    expect(h.moves[0]?.[1]).toBeCloseTo(0.6, 6);
    expect(h.settles).toEqual([[0, null]]);
    // a second release must not double-fire
    h.api.end(touchEnd(50 + 240, 120));
    expect(h.settles).toHaveLength(1);
  });

  it('drops the pending frame on cancel', () => {
    const h = mountEngine({ percent: 10 });
    h.api.startFromKnob(touch(50 + 40, 120), 0, BOX);
    h.api.move(touch(50 + 240, 120));
    h.api.cancel();
    h.flush();
    expect(h.moves).toEqual([]);
    expect(h.settles).toEqual([[0, null]]);
  });

  it('reads the vertical axis bottom-up', () => {
    const h = mountEngine({ vertical: true, percent: 50 });
    // Press at the track's vertical centre: (100 + 40 - 120) / 40 → already there.
    h.api.startFromKnob(touch(60, 120), 0, BOX);
    h.api.move(touch(60, 100)); // top edge → 1
    h.flush();
    expect(h.moves).toEqual([[0, 1]]);
    h.api.move(touch(60, 140)); // bottom edge → 0
    h.flush();
    expect(h.moves[1]).toEqual([0, 0]);
  });

  it('ignores every entry point while disabled', () => {
    const h = mountEngine({ disabled: true });
    h.api.startFromTrack(touch(50 + 100, 120), BOX);
    h.api.startFromKnob(touch(50 + 100, 120), 0, BOX);
    h.api.move(touch(50 + 300, 120));
    h.api.end(touchEnd(50 + 300, 120));
    expect(h.moves).toEqual([]);
    expect(h.grabs).toEqual([]);
    expect(h.settles).toEqual([]);
  });

  it('does nothing without a measured track box', () => {
    const h = mountEngine();
    h.api.startFromTrack(touch(50 + 100, 120), null);
    expect(h.moves).toEqual([]);
    expect(h.grabs).toEqual([]);
  });

  it('picks the knob the track press is nearest to', () => {
    const h = mountEngine({ nearest: (ratio) => (ratio < 0.5 ? 0 : 1) });
    h.api.startFromTrack(touch(50 + 380, 120), BOX);
    expect(h.grabs).toEqual([1]);
  });

  it('takes over a gesture whose release never arrived', () => {
    const h = mountEngine({ percent: 50 });
    h.api.startFromKnob(touch(50 + 200, 120), 0, BOX);
    h.api.move(touch(50 + 300, 120));
    h.flush();
    // No `end` — the press below must still grab instead of being ignored.
    h.api.startFromKnob(touch(50 + 100, 120), 0, BOX);
    expect(h.grabs).toEqual([0, 0]);
    h.api.move(touch(50 + 150, 120));
    h.flush();
    expect(h.moves).toHaveLength(2);
  });

  it('binds mouse handling only where a document exists', () => {
    const h = mountEngine();
    expect(h.api.draggedIndex()).toBeNull();
    // No root → inert, and the disposer is always callable.
    const dispose = h.api.bindMouse(null);
    expect(typeof dispose).toBe('function');
    dispose();
  });

  it('claims a desktop press by geometry, not by element refs', () => {
    const h = mountEngine({ trackRect: () => BOX });
    const dispose = h.api.bindMouse(null);
    const press = (x: number, y: number): MouseEvent =>
      new MouseEvent('mousedown', { clientX: x, clientY: y, button: 0, bubbles: true });

    // Outside the track box — another component's press, ignore it.
    document.dispatchEvent(press(600, 400));
    expect(h.grabs).toEqual([]);

    document.dispatchEvent(press(50 + 200, 120));
    expect(h.grabs).toEqual([0]);
    expect(h.moves).toEqual([[0, 0.5]]); // a track press jumps immediately

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50 + 300, clientY: 120 }));
    h.flush();
    expect(h.moves[1]?.[1]).toBeCloseTo(0.75, 6);

    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 50 + 300, clientY: 120 }));
    expect(h.settles).toEqual([[0, null]]);
    dispose();
  });
});
