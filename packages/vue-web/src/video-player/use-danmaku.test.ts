import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  canEnterScrollLane,
  sortDanmus,
  lowerBoundTime,
  DanmakuEngine,
  DEFAULT_DANMAKU_OPTIONS,
} from './use-danmaku';
import type { SnVideoDanmu } from './video-player-types';

describe('canEnterScrollLane (equal-speed lane condition)', () => {
  it('accepts the first danmu in an empty lane', () => {
    expect(canEnterScrollLane(undefined, 1000, 100)).toBe(true);
  });

  it('accepts when the previous right edge has receded past the entry line', () => {
    // width 120px at 100px/s → needs 1.2s before the next spawn.
    const tail = { spawnAt: 0, width: 120 };
    expect(canEnterScrollLane(tail, 1100, 100)).toBe(false);
    expect(canEnterScrollLane(tail, 1200, 100)).toBe(true);
    expect(canEnterScrollLane(tail, 3000, 100)).toBe(true);
  });

  it('accepts immediately when the previous danmu was narrow', () => {
    const tail = { spawnAt: 0, width: 40 };
    expect(canEnterScrollLane(tail, 500, 100)).toBe(true);
  });

  it('accepts everything under a degenerate zero speed', () => {
    expect(canEnterScrollLane({ spawnAt: 0, width: 500 }, 0, 0)).toBe(true);
  });
});

describe('sortDanmus', () => {
  it('sorts by time and keeps insertion order for equal timestamps', () => {
    const items: SnVideoDanmu[] = [
      { text: 'c', time: 3 },
      { text: 'a', time: 1 },
      { text: 'd', time: 3 },
      { text: 'b', time: 2 },
    ];
    expect(sortDanmus(items).map((d) => d.text)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('does not mutate the input array', () => {
    const items: SnVideoDanmu[] = [
      { text: 'b', time: 2 },
      { text: 'a', time: 1 },
    ];
    sortDanmus(items);
    expect(items.map((d) => d.text)).toEqual(['b', 'a']);
  });
});

describe('lowerBoundTime', () => {
  const items = [
    { text: '0', time: 1 },
    { text: '1', time: 2 },
    { text: '2', time: 4 },
  ];

  it('finds the first item at or after t', () => {
    expect(lowerBoundTime(items, 0)).toBe(0);
    expect(lowerBoundTime(items, 2)).toBe(1);
    expect(lowerBoundTime(items, 3)).toBe(2);
    expect(lowerBoundTime(items, 4)).toBe(2);
    expect(lowerBoundTime(items, 5)).toBe(3);
  });
});

describe('DanmakuEngine (scheduling, no real canvas)', () => {
  /** happy-dom's canvas.getContext returns null — the engine must tolerate it. */
  let hostTime = 0;
  let hostPaused = false;
  let engine: DanmakuEngine;

  beforeEach(() => {
    hostTime = 0;
    hostPaused = false;
    const canvas = document.createElement('canvas');
    engine = new DanmakuEngine(canvas, {
      getTime: () => hostTime,
      isPaused: () => hostPaused,
    });
  });

  afterEach(() => {
    engine.destroy();
  });

  it('spawns items whose time the media clock has crossed, inside the window', () => {
    engine.setItems([
      { text: 'a', time: 1 },
      { text: 'b', time: 2 },
    ]);
    engine.tick(0);
    expect(engine.activeCount).toBe(0);

    hostTime = 1;
    engine.tick(16);
    expect(engine.activeCount).toBe(1);

    hostTime = 2;
    engine.tick(32);
    expect(engine.activeCount).toBe(2);
    expect(engine.nextItemTime).toBeNull();
  });

  it('drops items missed by more than the spawn window (no burst after a jump)', () => {
    engine.setItems([
      { text: 'early', time: 0 },
      { text: 'later', time: 6 },
    ]);
    hostTime = 5; // huge jump — the item at 0 is stale
    engine.tick(0);
    expect(engine.activeCount).toBe(0);
    expect(engine.nextItemTime).toBe(6);
  });

  it('seekTo re-anchors the pointer and clears the screen', () => {
    engine.setItems([
      { text: 'a', time: 1 },
      { text: 'b', time: 5 },
    ]);
    hostTime = 1;
    engine.tick(0);
    expect(engine.activeCount).toBe(1);

    engine.seekTo(4);
    expect(engine.activeCount).toBe(0);
    expect(engine.nextItemTime).toBe(5);

    hostTime = 5;
    engine.tick(16);
    expect(engine.activeCount).toBe(1);
  });

  it('send renders immediately at the media clock and is ephemeral', () => {
    hostTime = 3;
    engine.send('自己发的');
    engine.tick(0);
    expect(engine.activeCount).toBe(1);
    // Self danmus are not part of the timeline: seek back does not replay.
    engine.seekTo(0);
    expect(engine.activeCount).toBe(0);
    expect(engine.nextItemTime).toBeNull();
  });

  it('ignores blank sends', () => {
    engine.send('   ');
    engine.tick(0);
    expect(engine.activeCount).toBe(0);
  });

  it('freezes movement while paused (dt is not consumed)', () => {
    // Without a paint context we assert the observable contract instead:
    // paused frames still run (scheduling continues) but actives do not
    // expire for fixed-type danmus. Use a top danmu with a fixed life.
    engine.setItems([{ text: 'top', time: 0, type: 'top' }]);
    hostTime = 0;
    hostPaused = true;
    engine.tick(0);
    engine.tick(6000); // way past the 4.5s fixed life
    // Paused frames must NOT expire fixed danmus.
    expect(engine.activeCount).toBe(1);
    hostPaused = false;
    engine.tick(6100);
    // Now the fixed life has passed while unpaused → despawned.
    expect(engine.activeCount).toBe(0);
  });

  it('enforces the concurrent-danmu cap', () => {
    hostTime = 0;
    for (let i = 0; i < 150; i++) {
      engine.send(`danmu-${i}`);
    }
    expect(engine.activeCount).toBeLessThanOrEqual(120);
  });

  it('respects setOptions (defaults applied)', () => {
    expect(DEFAULT_DANMAKU_OPTIONS.traverseSeconds).toBe(9);
    engine.setOptions({ speed: 2 });
    engine.setOptions({ opacity: 0.5 });
    // No crash + still functional:
    engine.setItems([{ text: 'x', time: 0 }]);
    hostTime = 0;
    engine.tick(0);
    expect(engine.activeCount).toBe(1);
  });

  it('stops spawning after destroy', () => {
    engine.setItems([{ text: 'a', time: 0 }]);
    engine.destroy();
    hostTime = 1;
    engine.tick(0);
    expect(engine.activeCount).toBe(0);
  });

  it('accepts a mocked 2d context and issues draw calls', () => {
    const ops: string[] = [];
    const ctx = {
      clearRect: vi.fn(() => ops.push('clear')),
      fillText: vi.fn(() => ops.push('fill')),
      strokeText: vi.fn(),
      measureText: vi.fn((text: string) => ({ width: text.length * 10 })),
      setTransform: vi.fn(),
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      globalAlpha: 1,
      textAlign: 'left',
      textBaseline: 'middle',
      shadowColor: '',
      shadowBlur: 0,
    };
    const canvas = document.createElement('canvas');
    vi.spyOn(canvas, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    const painted = new DanmakuEngine(canvas, {
      getTime: () => hostTime,
      isPaused: () => hostPaused,
    });
    painted.resize(640, 360, 2);
    painted.setItems([{ text: 'hello', time: 0 }]);
    hostTime = 0;
    painted.tick(0);
    expect(ops).toContain('clear');
    expect(ctx.fillText).toHaveBeenCalledWith('hello', 640, expect.any(Number));
    // DPR transform applied to the backing store.
    expect(canvas.width).toBe(1280);
    expect(canvas.height).toBe(720);
    painted.destroy();
    vi.restoreAllMocks();
  });
});
