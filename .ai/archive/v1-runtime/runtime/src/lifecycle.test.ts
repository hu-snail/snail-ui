import { describe, it, expect, vi } from 'vitest';
import { createLifecycleTracker, type LifecyclePhase } from './lifecycle.js';

describe('@snui/runtime — Lifecycle', () => {
  it('starts in created phase with empty cleanup list', () => {
    const t = createLifecycleTracker();
    expect(t.phase).toBe('created');
    expect(t.disposed).toBe(false);
    expect(t.cleanupCount).toBe(0);
  });

  it('walks through the happy path', () => {
    const t = createLifecycleTracker();
    t.transition('mounted');
    expect(t.phase).toBe('mounted');
    t.transition('updating');
    expect(t.phase).toBe('updating');
    t.transition('updated');
    expect(t.phase).toBe('updated');
    t.transition('unmounting');
    expect(t.phase).toBe('unmounting');
    t.transition('disposed');
    expect(t.phase).toBe('disposed');
  });

  it('runs tracked cleanups in LIFO order on dispose', () => {
    const t = createLifecycleTracker();
    const order: string[] = [];
    t.track('first', () => order.push('first'));
    t.track('second', () => order.push('second'));
    t.track('third', () => order.push('third'));
    t.dispose();
    expect(order).toEqual(['third', 'second', 'first']);
    expect(t.disposed).toBe(true);
  });

  it('dispose() is idempotent', () => {
    const t = createLifecycleTracker();
    let count = 0;
    t.track('x', () => count++);
    t.dispose();
    t.dispose();
    t.dispose();
    expect(count).toBe(1);
  });

  it('swallows cleanup errors so other cleanups still run', () => {
    const t = createLifecycleTracker();
    const log = vi.fn();
    t.track('a', () => {
      throw new Error('boom-a');
    });
    t.track('b', () => log('b'));
    t.track('c', () => {
      throw new Error('boom-c');
    });
    const origWarn = console.warn;
    console.warn = log;
    try {
      t.dispose();
    } finally {
      console.warn = origWarn;
    }
    expect(log).toHaveBeenCalledWith('[AUI] cleanup error:', expect.any(Error));
  });

  it('rejects invalid transitions', () => {
    const t = createLifecycleTracker();
    t.transition('mounted');
    t.transition('updating');
    t.transition('updated');
    expect(() => t.transition('mounted')).toThrow(/Invalid transition/);
  });

  it('cannot transition after dispose', () => {
    const t = createLifecycleTracker();
    t.dispose();
    expect(() => t.transition('mounted')).toThrow(/disposed/);
  });

  it('returns the same handle from track() so callers can chain', () => {
    const t = createLifecycleTracker();
    const handle = { id: 'h1' };
    const returned = t.track(handle, () => {});
    expect(returned).toBe(handle);
  });

  it('exposes the expected initial-phase override', () => {
    const t = createLifecycleTracker('mounted');
    expect(t.phase).toBe<LifecyclePhase>('mounted');
  });
});