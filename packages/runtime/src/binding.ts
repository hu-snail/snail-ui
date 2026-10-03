/**
 * AUI Binding Resolver (AUI-BINDING-001/002/003).
 *
 * Per AGENTS.md §24, binding can only reference state / props / computed /
 * context. NO window / document / globalThis / process / filesystem / network
 * unless explicitly exposed as a Host Capability.
 *
 * `resolveBinding` synchronously walks the binding against a BindingContext.
 * For state / prop / computed / expression bindings this is enough — the
 * reactive subscription (Phase 2 renderer integration) listens to changes in
 * the underlying cells separately.
 *
 * Event bindings resolve to a trigger description that the renderer maps to
 * a DOM / uni-app event listener.
 */

import type {
  UIBinding,
  StateBinding,
  ComputedBinding,
  PropBinding,
  EventBinding,
  ExpressionBinding,
} from '@snui/protocol';
import { createAUIError, type AUIError } from './error.js';
import { compileExpression, type BindingContext } from './expression.js';

export interface ResolvedBinding<T = unknown> {
  readonly kind: UIBinding['kind'];
  readonly value: T;
}

export interface BindingResolveOptions {
  readonly signal?: AbortSignal;
  /** Extra args surfaced as `args.*` in expressions (per AGENTS.md §24). */
  readonly args?: Readonly<Record<string, unknown>>;
}

function pathSegments(s: string): readonly string[] {
  return s.split('.');
}

function readDottedPath(root: unknown, path: readonly string[]): unknown {
  let cur: unknown = root;
  for (const seg of path) {
    if (cur === null || cur === undefined) return undefined;
    cur = (cur as Record<string, unknown>)[seg];
  }
  return cur;
}

function stateBinding(b: StateBinding, ctx: BindingContext): unknown {
  return readDottedPath(ctx.state, pathSegments(b.path));
}

function computedBinding(b: ComputedBinding, ctx: BindingContext): unknown {
  const cell = ctx.computed[b.name];
  if (cell === undefined) {
    throw createAUIError({
      code: 'AUI_BINDING_COMPUTED_MISSING',
      message: `computed binding references missing computed cell "${b.name}"`,
      source: 'binding',
      severity: 'error',
      hint: `Register the computed cell via createRuntime({ computed: { ${b.name}: ... } }) before resolving.`,
    });
  }
  // ctx.computed may hold a raw value OR a ReactiveValue<T> (when the runtime
  // has a reactive adapter wired in). Detect the latter by duck-typing for
  // a `value` getter; raw values just read as themselves.
  if (typeof cell === 'object' && cell !== null && 'value' in (cell as Record<string, unknown>)) {
    return (cell as { value: unknown }).value;
  }
  return cell;
}

function propBinding(b: PropBinding, ctx: BindingContext): unknown {
  // path looks like "props.foo.bar" — drop the "props." prefix.
  if (!b.path.startsWith('props.')) {
    throw createAUIError({
      code: 'AUI_BINDING_PROP_INVALID',
      message: `prop binding path must start with "props."`,
      source: 'binding',
      severity: 'error',
      path: b.path,
    });
  }
  return readDottedPath(ctx.props, pathSegments(b.path.slice('props.'.length)));
}

function eventBinding(b: EventBinding): { kind: 'event'; trigger: string } {
  return { kind: 'event', trigger: b.trigger };
}

function expressionBinding(b: ExpressionBinding, ctx: BindingContext): unknown {
  const compiled = compileExpression(b.expr);
  return compiled.evaluate(ctx);
}

export function resolveBinding<T = unknown>(
  binding: UIBinding,
  ctx: BindingContext,
  options: BindingResolveOptions = {},
): ResolvedBinding<T> {
  switch (binding.kind) {
    case 'state':
      return { kind: 'state', value: stateBinding(binding, ctx) as T };
    case 'computed':
      return { kind: 'computed', value: computedBinding(binding, ctx) as T };
    case 'prop':
      return { kind: 'prop', value: propBinding(binding, ctx) as T };
    case 'event':
      return eventBinding(binding) as unknown as ResolvedBinding<T>;
    case 'expression': {
      void options.args;
      return { kind: 'expression', value: expressionBinding(binding, ctx) as T };
    }
    default: {
      const _exhaustive: never = binding;
      void _exhaustive;
      throw createAUIError({
        code: 'AUI_BINDING_UNKNOWN_KIND',
        message: `Unknown binding kind`,
        source: 'binding',
        severity: 'error',
      });
    }
  }
}

export type {
  UIBinding,
  StateBinding,
  ComputedBinding,
  PropBinding,
  EventBinding,
  ExpressionBinding,
};
export type { BindingContext, AUIError };