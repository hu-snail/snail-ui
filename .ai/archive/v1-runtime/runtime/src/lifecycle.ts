/**
 * AUI Lifecycle (AUI-RUNTIME-003).
 *
 * Per AGENTS.md §41-42, every resource-creating object must have an explicit
 * lifecycle. Per §82 Memory Leak, every effect / event / observer / timer /
 * subscription / async task / worker must be tracked so `dispose()` stops it.
 *
 * Lifecycle phases:
 *   created  → mounted → updating → updated → unmounting → disposed
 *
 * Transitions are guarded; calling `mount()` after `dispose()` throws an
 * `AUI_LIFECYCLE_INVALID_TRANSITION` error.
 */

import { createAUIError, type AUIError } from './error.js';

export type LifecyclePhase =
  | 'created'
  | 'mounted'
  | 'updating'
  | 'updated'
  | 'unmounting'
  | 'disposed';

const VALID_TRANSITIONS: Readonly<Record<LifecyclePhase, readonly LifecyclePhase[]>> = {
  created: ['mounted', 'unmounting', 'disposed'],
  mounted: ['updating', 'unmounting', 'disposed'],
  updating: ['updated', 'unmounting', 'disposed'],
  updated: ['updating', 'unmounting', 'disposed'],
  unmounting: ['disposed'],
  disposed: [],
};

export interface Disposable {
  readonly disposed: boolean;
  dispose(): void;
}

/** A cleanup hook — called on runtime dispose. */
export type DisposeFn = () => void;

export interface LifecycleTracker {
  /** Current phase. */
  readonly phase: LifecyclePhase;
  /** Whether the tracker is disposed. */
  readonly disposed: boolean;
  /** Number of registered cleanup hooks (incl. internal ones). */
  readonly cleanupCount: number;
  /** Register a cleanup hook. Returns the same hook so callers can chain. */
  track<T>(handle: T, cleanup: (handle: T) => void): T;
  /** Run all cleanups in LIFO. Subsequent dispose() calls are no-ops. */
  dispose(): void;
  /** Transition to a new phase; throws on invalid transition. */
  transition(next: LifecyclePhase): void;
}

export function createLifecycleTracker(initial: LifecyclePhase = 'created'): LifecycleTracker {
  let phase: LifecyclePhase = initial;
  let disposed = false;
  const cleanups: DisposeFn[] = [];

  function transition(next: LifecyclePhase): void {
    if (disposed) {
      throw lifecycleError(`Cannot transition to "${next}" — already disposed`, phase);
    }
    const allowed = VALID_TRANSITIONS[phase];
    if (!allowed.includes(next)) {
      throw lifecycleError(`Invalid transition ${phase} → ${next}`, phase);
    }
    phase = next;
    if (next === 'disposed') {
      disposed = true;
    }
  }

  function dispose(): void {
    if (disposed) return;
    transition('disposed');
    while (cleanups.length > 0) {
      const fn = cleanups.pop();
      if (fn) {
        try {
          fn();
        } catch (cause) {
          // Swallow secondary errors so all cleanups still run; the primary
          // error (if any) is the one the user sees.
          if (typeof console !== 'undefined') {
            console.warn('[AUI] cleanup error:', cause);
          }
        }
      }
    }
  }

  function track<T>(handle: T, cleanup: (handle: T) => void): T {
    cleanups.push(() => cleanup(handle));
    return handle;
  }

  return {
    get phase() {
      return phase;
    },
    get disposed() {
      return disposed;
    },
    get cleanupCount() {
      return cleanups.length;
    },
    track,
    dispose,
    transition,
  };
}

function lifecycleError(message: string, currentPhase: LifecyclePhase): AUIError {
  return createAUIError({
    code: 'AUI_LIFECYCLE_INVALID_TRANSITION',
    message,
    hint: `Current phase is "${currentPhase}". See packages/runtime/src/lifecycle.ts for the valid transition map.`,
    source: 'runtime',
    severity: 'error',
  });
}