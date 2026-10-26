/**
 * AUI Action Registry + Handler (AUI-ACTION-001/002).
 *
 * Per AGENTS.md §22 + AUI-WBS-v1.0.md §19:
 *   - Schema → action id → ActionRegistry → Host Service
 *   - Schema MUST NOT call business services directly (§21)
 *   - All actions resolve through ActionRegistry (§22)
 *   - Handlers receive a typed ActionContext (state, props, args, bridge,
 *     signal) and return ActionResult (sync or async)
 *   - AbortSignal honored so sub-actions can be cancelled (§40)
 *
 * The registry is the ONLY allowed indirection between a UISchema action id
 * and the implementation. AppBridge (separate module) provides the host
 * capabilities (router / notify / storage / analytics / event / abortSignal).
 */

import type { UIAction } from '@snui/protocol';
import type { AppBridgeLike } from './app-bridge.js';
import { createAUIError, type AUIError } from './error.js';

/** Read-only view of the runtime context the handler can read. */
export interface ActionContext {
  readonly state: Record<string, unknown>;
  readonly props: Record<string, unknown>;
  readonly bridge: AppBridgeLike;
  /** Runtime's bind to dispose its own resources. */
  readonly signal: AbortSignal;
}

/** Standardized return shape. */
export type ActionResult = void | unknown;

export type ActionHandler<TRaw = unknown> = (
  context: ActionContext,
  params: TRaw,
) => ActionResult | Promise<ActionResult>;

/** Handler entry — wraps the user handler with metadata. */
export interface ActionHandlerEntry {
  readonly id: string;
  readonly version: string;
  /** Raw handler — receives unknown params; type-narrowing is the handler's job. */
  readonly handle: ActionHandler<unknown>;
}

export interface ActionRegistry {
  register(id: string, handler: ActionHandler, opts?: { version?: string }): ActionHandlerEntry;
  resolve(id: string): ActionHandlerEntry | undefined;
  has(id: string): boolean;
  remove(id: string): boolean;
  list(): readonly string[];
  /**
   * Execute the registered handler for `action`. Wraps every call in a fresh
   * AbortSignal scoped to the runtime so handlers can short-circuit on cancel.
   */
  execute(input: ActionInvokeInput): Promise<ActionResult>;
}

export interface ActionInvokeInput {
  readonly action: UIAction;
  readonly context: ActionContext;
  readonly args?: Readonly<Record<string, unknown>>;
}

function buildContext(input: ActionInvokeInput, bridge: AppBridgeLike): ActionContext {
  return {
    state: input.context.state,
    props: input.context.props,
    bridge,
    signal: input.context.signal,
  };
}

function callHandler(
  entry: ActionHandlerEntry,
  ctx: ActionContext,
  params: unknown,
): Promise<ActionResult> {
  try {
    const out = entry.handle(ctx, params);
    if (out && typeof (out as Promise<unknown>).then === 'function') {
      return (out as Promise<ActionResult>).catch((cause) => {
        throw createAUIError({
          code: 'AUI_ACTION_HANDLER_REJECTED',
          message: `Action "${entry.id}" handler rejected`,
          source: 'action',
          severity: 'error',
          cause,
        });
      });
    }
    return Promise.resolve(out as ActionResult);
  } catch (cause) {
    return Promise.reject(
      createAUIError({
        code: 'AUI_ACTION_HANDLER_THREW',
        message: `Action "${entry.id}" handler threw synchronously`,
        source: 'action',
        severity: 'error',
        cause,
      }),
    );
  }
}

export interface CreateActionRegistryOptions {
  readonly bridge?: AppBridgeLike;
}

export function createActionRegistry(options: CreateActionRegistryOptions = {}): ActionRegistry {
  const entries = new Map<string, ActionHandlerEntry>();
  const bridge: AppBridgeLike = options.bridge ?? {};

  return {
    register(id, handler, opts) {
      if (!/^[a-z][a-z0-9-]*$/.test(id)) {
        throw createAUIError({
          code: 'AUI_ACTION_INVALID_ID',
          message: `Action id "${id}" must be lowercase kebab (^[a-z][a-z0-9-]*$)`,
          source: 'action',
          severity: 'error',
        });
      }
      const entry: ActionHandlerEntry = {
        id,
        version: opts?.version ?? '0.1.0',
        handle: handler as ActionHandler<unknown>,
      };
      entries.set(id, entry);
      return entry;
    },

    resolve(id) {
      return entries.get(id);
    },

    has(id) {
      return entries.has(id);
    },

    remove(id) {
      return entries.delete(id);
    },

    list() {
      return [...entries.keys()];
    },

    async execute(input) {
      const entry = entries.get(input.action.id);
      if (!entry) {
        throw createAUIError({
          code: 'AUI_ACTION_NOT_REGISTERED',
          message: `No handler registered for action "${input.action.id}"`,
          source: 'action',
          severity: 'error',
          hint: `Registered: ${[...entries.keys()].join(', ') || '(none)'}`,
        });
      }
      // Per AGENTS.md §40, honor the runtime's AbortSignal.
      if (input.context.signal.aborted) {
        throw createAUIError({
          code: 'AUI_ACTION_ABORTED',
          message: `Action "${input.action.id}" aborted before execution`,
          source: 'action',
          severity: 'info',
        });
      }
      const ctx = buildContext(input, bridge);
      const params = {
        ...(input.action.params ?? {}),
        ...(input.args ?? {}),
      };
      return callHandler(entry, ctx, params);
    },
  };
}

/** Convenience: `ActionResult` + `ActionContext` + `ActionHandler` re-exports. */
export type { AUIError };