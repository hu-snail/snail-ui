/**
 * AUI RuntimeContext (AUI-RUNTIME-002).
 *
 * Per WBS §12, RuntimeContext bundles the per-runtime working set so they don't
 * have to be threaded through every internal call. Contexts are created once
 * per runtime instance and disposed with it.
 *
 * Per AGENTS.md §18 Runtime does NOT own business services, login, ordering,
 * payment, CRM, ERP, databases, business stores, or permission systems. Only
 * schema / state / binding / action / component / theme / lifecycle / error /
 * inspection.
 */

import type { UISchema, UIAction } from '@snui/protocol';
import type { PlatformAdapter } from './platform.js';

/**
 * Component contract registry — a minimal adapter interface for the Runtime.
 * The full ComponentRegistry lives in @snui/vue-web; the runtime only needs
 * `resolve(type)` to look up a component by `UINode.type`.
 */
export interface RuntimeComponentRegistry {
  resolve(type: string): RuntimeComponentEntry | undefined;
  has(type: string): boolean;
  list(): readonly string[];
}

/**
 * Component contract entry — what the Runtime needs to drive a single
 * component instance. Renderers register concrete implementations via
 * `registry.register({ contract, instance })`.
 */
export interface RuntimeComponentEntry {
  readonly name: string;
  readonly version: string;
  readonly propsSchema?: unknown;
  /** Optional factory: build a component instance bound to a node. */
  readonly create?: (input: RuntimeComponentInput) => RuntimeComponentInstance;
}

export interface RuntimeComponentInput {
  readonly node: unknown;
  readonly context: RuntimeContext;
  readonly props: unknown;
}

export interface RuntimeComponentInstance {
  update?(props: unknown): void;
  dispose?(): void;
}

/** Action resolver — the concrete registry lives in @snui/runtime/actions. */
export interface RuntimeActionRegistry {
  resolve(id: string): RuntimeActionHandler | undefined;
  has(id: string): boolean;
}

export type RuntimeActionHandler = (input: RuntimeActionInput) => unknown | Promise<unknown>;

export interface RuntimeActionInput {
  readonly action: UIAction;
  readonly context: RuntimeContext;
  readonly args?: Readonly<Record<string, unknown>>;
  readonly signal: AbortSignal;
}

/** The Theme / Style / Density environment (already resolved). */
export interface TokenEnvironmentLike {
  readonly theme: { readonly name: string };
  readonly style: { readonly name: string };
  readonly density: { readonly name: string };
}

export interface RuntimeContext {
  readonly schema: UISchema;
  readonly state: Record<string, unknown>;
  readonly props: Record<string, unknown>;
  readonly actions: UIAction[];
  readonly registry: RuntimeComponentRegistry;
  readonly actionRegistry: RuntimeActionRegistry;
  readonly tokens: TokenEnvironmentLike;
  readonly platform: PlatformAdapter;
  readonly runtime: RuntimeLike;
  readonly signal: AbortSignal;
}

/** Minimal lifecycle view (resolved at createRuntime time). */
export interface RuntimeLike {
  /** Currently mounted target — null when not mounted. */
  readonly target: unknown;
  /** Current lifecycle phase. */
  readonly phase: string;
  /** Dispose chain — call to tear everything down. */
  dispose(): void;
}

/** Helper for emitting a typed AUIError context-relative. */
export function createContextError(message: string, ctx: { schema?: UISchema }, source: 'schema' | 'runtime' | 'binding' | 'action' | 'component' | 'platform'): {
  code: string;
  message: string;
  source: 'schema' | 'runtime' | 'binding' | 'action' | 'component' | 'platform';
  severity: 'error';
  hint: string | undefined;
} {
  return {
    code: 'AUI_RUNTIME_CONTEXT_ERROR',
    message,
    source,
    severity: 'error',
    hint: ctx.schema ? `Schema version: ${ctx.schema.version}` : undefined,
  };
}