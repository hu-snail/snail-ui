/**
 * AUI Runtime (AUI-RUNTIME-001) — the framework-agnostic schema interpreter.
 *
 * Per AGENTS.md §18, Runtime does NOT do business work. It wires schema →
 * state → binding → action → registry → component → theme → lifecycle →
 * error → inspection.
 *
 * Per AGENTS.md §16 (Schema First) and §17 (Protocol framework agnostic), the
 * Runtime sits between the Protocol (Zod schemas) and the Renderer (vue-web /
 * uni). The Renderer implements the actual DOM/uni-app rendering; the
 * Runtime exposes mount/update/unmount/dispose hooks for the Renderer to
 * subscribe to.
 *
 * Phase 1 keeps Reactive integration behind a plain `state` Record. Reactive
 * adapter (AUI-REACTIVE-001) wires in during Sub-task 6.
 */

import type { UISchema, UIAction } from '@snui/protocol';
import { createValidator, type ValidationResult } from '@snui/schema';
import { resolveEnvironment, type TokenBinding, type TokenEnvironment } from '@snui/tokens';

import { createLifecycleTracker, type LifecycleTracker } from './lifecycle.js';
import {
  type RuntimeActionRegistry,
  type RuntimeComponentRegistry,
  type RuntimeContext,
  type TokenEnvironmentLike,
} from './context.js';
import { type PlatformAdapter } from './platform.js';
import { createAUIError, type AUIError } from './error.js';

export interface RuntimeHooks {
  /** Called once during createRuntime, before mount. */
  onCreate?(runtime: AUIRuntime): void;
  /** Called on each successful mount. */
  onMount?(target: unknown, runtime: AUIRuntime): void;
  /** Called when the schema is updated (after re-validation). */
  onUpdate?(schema: UISchema, runtime: AUIRuntime): void;
  /** Called during unmount, before dispose. */
  onUnmount?(runtime: AUIRuntime): void;
}

export interface CreateRuntimeInput {
  readonly schema: UISchema;
  readonly registry: RuntimeComponentRegistry;
  readonly actionRegistry: RuntimeActionRegistry;
  readonly tokens: TokenEnvironment;
  readonly platform: PlatformAdapter;
  /** Optional initial state Record. Merged with schema.state. */
  readonly initialState?: Record<string, unknown>;
  /** Optional initial props Record. */
  readonly initialProps?: Record<string, unknown>;
  /** Optional hooks. */
  readonly hooks?: RuntimeHooks;
  /** External AbortSignal (e.g. host page lifecycle). */
  readonly signal?: AbortSignal;
}

/** Public Runtime facade. */
export interface AUIRuntime {
  readonly context: RuntimeContext;
  readonly hooks: RuntimeHooks;
  readonly lifecycle: LifecycleTracker;
  /** Current schema (mutable reference; update() replaces it). */
  readonly schema: UISchema;
  /** Mount to a renderer-supplied target. Idempotent guard via phase. */
  mount(target: unknown): void;
  /** Swap in a new schema (re-validate then transition). */
  update(schema: UISchema): ValidationResult;
  /** Tear down. Safe to call multiple times. */
  unmount(): void;
  /** Alias for unmount — provided for symmetry with AGENTS.md §41. */
  dispose(): void;
  /** Last known token bindings (the resolved CSS variable table). */
  readonly tokenBindings: readonly TokenBinding[];
}

export function createRuntime(input: CreateRuntimeInput): AUIRuntime {
  const validator = createValidator();
  const initialValidation = validator.validate(input.schema);
  if (!initialValidation.valid) {
    throw createAUIError({
      code: 'AUI_RUNTIME_SCHEMA_INVALID',
      message: 'createRuntime received an invalid UISchema',
      hint: initialValidation.errors.map((e) => `[${e.code}] ${e.path}: ${e.message}`).join('; '),
      source: 'runtime',
      severity: 'error',
      cause: initialValidation.errors,
    });
  }

  const tracker = createLifecycleTracker('created');

  let currentSchema: UISchema = input.schema;
  let currentTarget: unknown = null;
  let currentActions: UIAction[] = currentSchema.actions ?? [];

  const tokenEnvironment: TokenEnvironmentLike = {
    theme: { name: input.tokens.theme.name },
    style: { name: input.tokens.style.name },
    density: { name: input.tokens.density.name },
  };

  const ctx: RuntimeContext = {
    schema: currentSchema,
    state: { ...input.initialState, ...(currentSchema.state ?? {}) },
    props: { ...(input.initialProps ?? {}), ...(currentSchema.metadata ?? {}) },
    get actions(): UIAction[] {
      return currentActions;
    },
    registry: input.registry,
    actionRegistry: input.actionRegistry,
    tokens: tokenEnvironment,
    platform: input.platform,
    runtime: {
      get target() {
        return currentTarget;
      },
      get phase() {
        return tracker.phase;
      },
      dispose: (): void => {
        tracker.dispose();
      },
    },
    signal: input.signal ?? new AbortController().signal,
  };

  if (input.signal) {
    const onAbort = (): void => {
      tracker.dispose();
    };
    input.signal.addEventListener('abort', onAbort);
    tracker.track(onAbort, (handle) => {
      input.signal?.removeEventListener('abort', handle);
    });
  }

  const tokenBindings = resolveEnvironment(input.tokens);
  const hooks = input.hooks ?? {};

  const runtime: AUIRuntime = {
    context: ctx,
    hooks,
    lifecycle: tracker,
    get schema() {
      return currentSchema;
    },
    tokenBindings,
    mount(target: unknown): void {
      if (tracker.disposed) {
        throw createAUIError({
          code: 'AUI_RUNTIME_DISPOSED',
          message: 'Cannot mount a disposed runtime',
          source: 'runtime',
          severity: 'fatal',
        });
      }
      if (tracker.phase !== 'created') {
        throw createAUIError({
          code: 'AUI_RUNTIME_ALREADY_MOUNTED',
          message: `Cannot mount — runtime is already in phase "${tracker.phase}"`,
          source: 'runtime',
          severity: 'error',
        });
      }
      currentTarget = target;
      transitionTo('mounted');
      hooks.onMount?.(target, runtime);
    },
    update(schema: UISchema): ValidationResult {
      const r = validator.validate(schema);
      if (!r.valid) {
        return r;
      }
      const prevPhase = tracker.phase;
      if (prevPhase === 'mounted') {
        transitionTo('updating');
        currentSchema = schema;
        currentActions = schema.actions ?? [];
        transitionTo('updated');
      } else if (prevPhase === 'updated') {
        transitionTo('updating');
        currentSchema = schema;
        currentActions = schema.actions ?? [];
        transitionTo('updated');
      } else if (prevPhase === 'created') {
        currentSchema = schema;
        currentActions = schema.actions ?? [];
      }
      hooks.onUpdate?.(schema, runtime);
      return r;
    },
    unmount(): void {
      if (tracker.disposed) return;
      const prevPhase = tracker.phase;
      if (prevPhase === 'mounted' || prevPhase === 'updated' || prevPhase === 'updating') {
        transitionTo('unmounting');
        hooks.onUnmount?.(runtime);
      }
      tracker.dispose();
    },
    dispose(): void {
      runtime.unmount();
    },
  };

  function transitionTo(next: Parameters<typeof tracker.transition>[0]): void {
    try {
      tracker.transition(next);
    } catch (cause) {
      const err = cause as AUIError;
      throw err.code ? err : createAUIError({
        code: 'AUI_RUNTIME_TRANSITION_FAILED',
        message: `Runtime transition failed: ${(cause as Error)?.message ?? cause}`,
        source: 'runtime',
        cause,
      });
    }
  }

  hooks.onCreate?.(runtime);
  return runtime;
}