/**
 * AUI Event Binding (AUI-BINDING-003).
 *
 * Per AUI-WBS-v1.0.md §14, EventBinding resolves to a trigger name that the
 * renderer maps to a platform event listener. Phase 1 here is the dispatch
 * side: given a fired event, locate the matching UIBinding on a node, and
 * produce the action invocation (handled by Sub-task 8's ActionRegistry).
 *
 * The renderer feeds `dispatchEvent` its platform Event; Phase 1 accepts the
 * loose shape `{ type: string; target?: unknown }` so it stays framework-agnostic.
 */

import type { UIBinding, UIAction } from '@snui/protocol';
import type { BindingContext } from './expression.js';
import { resolveBinding } from './binding.js';
import { createAUIError } from './error.js';

export interface PlatformEventLike {
  readonly type: string;
  readonly target?: unknown;
  /** Optional raw value carried by the event (e.g. input change value). */
  readonly value?: unknown;
  /** AbortSignal tied to the platform event lifecycle. */
  readonly signal?: AbortSignal;
}

export interface EventBindingDispatch {
  readonly trigger: string;
  readonly value: unknown;
  readonly context: BindingContext;
}

export interface EventDispatchInput {
  readonly node: { readonly id: string; readonly events?: Readonly<Record<string, UIBinding>> };
  readonly event: PlatformEventLike;
  readonly context: BindingContext;
}

/**
 * Walk the node's `events` map and return every binding whose trigger matches
 * the fired event type. The renderer is expected to listen for the platform
 * event name (e.g. `change`) and pass `evt.type` in here.
 */
export function matchEventBindings(input: EventDispatchInput): readonly UIBinding[] {
  const events = input.node.events ?? {};
  const out: UIBinding[] = [];
  for (const [trigger, binding] of Object.entries(events)) {
    if (binding.kind !== 'event') {
      throw createAUIError({
        code: 'AUI_BINDING_EVENT_KIND_MISMATCH',
        message: `events["${trigger}"] must be an event binding (got kind "${binding.kind}")`,
        source: 'binding',
        severity: 'error',
      });
    }
    if ((binding as { trigger: string }).trigger === input.event.type) {
      out.push(binding);
    }
  }
  return out;
}

/**
 * Resolve the action invocation(s) for a fired event. The renderer receives
 * an array of `{ binding, value, context }` records; passing each to
 * `ActionRegistry.invoke()` is its responsibility (Sub-task 8).
 */
export function dispatchEvent(input: EventDispatchInput): readonly EventBindingDispatch[] {
  const matched = matchEventBindings(input);
  return matched.map((b) => ({
    trigger: (b as { trigger: string }).trigger,
    value: input.event.value,
    context: input.context,
  }));
}

/** Look up the UIAction that a particular event binding points to. */
export function resolveEventAction(
  input: EventDispatchInput,
  actions: readonly UIAction[],
): readonly UIAction[] {
  const events = input.node.events ?? {};
  const out: UIAction[] = [];
  // The events map shape is `{ [actionId]: EventBinding }`. When the binding's
  // trigger matches the fired event type, the map KEY is the action id to
  // invoke. Phase 1 contract: this is the convention from ButtonContract.
  for (const [actionId, binding] of Object.entries(events)) {
    if (binding.kind !== 'event') continue;
    if ((binding as { trigger: string }).trigger === input.event.type) {
      const action = actions.find((a) => a.id === actionId);
      if (action) out.push(action);
    }
  }
  return out;
}

/** Internal: expose resolveBinding for tests. */
export const __internal = { resolveBinding };