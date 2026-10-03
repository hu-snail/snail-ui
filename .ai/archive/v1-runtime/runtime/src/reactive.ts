/**
 * AUI Reactive Adapter (AUI-REACTIVE-001/002/003).
 *
 * Per AGENTS.md §19 + AUI-WBS-v1.0.md §13, Phase 1 reuses `@vue/reactivity`
 * behind a thin `ReactiveAdapter` interface. The Runtime + Renderer talk to
 * this adapter only — they MUST NOT import `@vue/reactivity` directly, so
 * Phase 2/3 renderers can swap engines without rewriting consumers.
 *
 * The adapter tracks every effect / subscription so a single `dispose()` call
 * tears the whole tree down (AGENTS.md §41 Memory Leak + §82 cleanup).
 */

import { computed, effect, ref, type ComputedRef, type Ref } from '@vue/reactivity';

/**
 * Internal alias — `Ref<T>` in @vue/reactivity has a complex UnwrapRef generic
 * that confuses TS when mixing with custom mapped types. We use `RawRef<T>`
 * (an alias for `Ref<T>`) at the implementation boundary and explicitly cast
 * back to T at the read site — the runtime contract is `cell.value` returns T.
 */
type RawRef<T> = Ref<T>;

/** A reactive handle — read `value`, subscribe to changes. */
export interface ReactiveValue<T> {
  readonly value: T;
  /** Returns an unsubscribe function. */
  subscribe(fn: (next: T) => void): () => void;
}

/** A stop-handle returned from `effect` / `subscribe`. */
export type StopHandle = () => void;

export interface ReactiveAdapter {
  /**
   * Wrap a value in a reactive cell. `value` is the initial cell content;
   * consumers read it via `value.value` and subscribe via `.subscribe`.
   */
  createState<T>(value: T): ReactiveValue<T>;
  /**
   * Create a lazily-evaluated computed cell. The getter runs the first time
   * `.value` is read AND every time any dependency changes (cache invalidates
   * automatically via @vue/reactivity).
   */
  computed<T>(getter: () => T): ReactiveValue<T>;
  /**
   * Run a side-effect that re-runs whenever any reactive dependency it
   * touched changes. Returns a stop-handle.
   */
  effect(fn: () => void): StopHandle;
  /** Tear down every effect / subscription registered with this adapter. */
  dispose(): void;
  /** Number of registered stop-handles (test inspection). */
  readonly cleanupCount: number;
}

interface ReactiveImplOptions {
  /** When true, eagerly evaluates the getter to surface errors. */
  readonly eagerComputed?: boolean;
}

class VueReactiveAdapter implements ReactiveAdapter {
  private readonly cleanups: StopHandle[] = [];

  createState<T>(value: T): ReactiveValue<T> {
    // @vue/reactivity's `ref<T>(value)` returns `Ref<UnwrapRef<T>, ...>`. Our
    // public contract is that `value` reads back as T (no auto-unwrap magic).
    // The cast below recovers the cleaner `Ref<T>` shape internally.
    const cell = ref(value) as unknown as RawRef<T>;
    return this.wrapCell<T>(cell);
  }

  computed<T>(getter: () => T): ReactiveValue<T> {
    const c: ComputedRef<T> = computed(getter);
    return this.wrapCell<T>(c as unknown as RawRef<T>);
  }

  effect(fn: () => void): StopHandle {
    const stop: StopHandle = effect(fn);
    this.cleanups.push(stop);
    return stop;
  }

  dispose(): void {
    while (this.cleanups.length > 0) {
      const stop = this.cleanups.pop();
      if (stop) {
        try {
          stop();
        } catch {
          // Swallow secondary errors — same discipline as LifecycleTracker.
        }
      }
    }
  }

  get cleanupCount(): number {
    return this.cleanups.length;
  }

  private wrapCell<T>(cell: RawRef<T>): ReactiveValue<T> {
    // Closure capture of `this` is what no-this-alias complains about; using
    // an arrow function lets us keep the same instance reference without
    // aliasing `this` to a local variable.
    const cleanups = this.cleanups;
    return {
      get value(): T {
        // Cast needed: @vue/reactivity's Ref<T>.value has UnwrapRef<T>, not T.
        // Our public contract documents `value` as T.
        return cell.value as T;
      },
      subscribe(fn: (next: T) => void): () => void {
        const stop: StopHandle = effect(() => {
          fn(cell.value as T);
        });
        cleanups.push(stop);
        return stop;
      },
    };
  }
}

/** Create a default Vue-based reactive adapter. */
export function createReactiveAdapter(_options: ReactiveImplOptions = {}): ReactiveAdapter {
  void _options;
  return new VueReactiveAdapter();
}

/**
 * Internal class — exported only for tests that want to assert on the
 * implementation identity.
 */
export const __internal = { VueReactiveAdapter };