import { z } from 'zod';

/**
 * AUI UIBinding — declarative reference from a UI property to runtime context.
 *
 * Per AGENTS.md §24, Binding can ONLY reference controlled contexts:
 *   state, props, computed, context. NO direct window/document/process/filesystem/network.
 * Per AGENTS.md §23, NO eval / new Function / dynamic code execution.
 *   Expression bindings are parsed + validated + sandboxed at runtime
 *   (this schema only validates shape; runtime semantics in AUI-RUNTIME-001..006).
 *
 * 5 binding kinds (discriminated by `kind`):
 *   - state      — local runtime state, dotted path (e.g. `local.form.email`)
 *   - computed   — entry in the runtime's computed registry
 *   - prop       — parent node's prop, dotted path prefixed with `props.`
 *   - event      — event binding trigger (e.g. on change of input value)
 *   - expression — runtime-validated expression (sandboxed DSL)
 *
 * Forward references:
 *   - state / computed / prop resolvers → AUI-RUNTIME-001..006
 *   - event triggers → AUI-WEB-003 / AUI-UNI-003 (renderer-defined event catalog)
 *   - expression parser → AUI-RUNTIME-006 (expression engine)
 */

const DOTTED_PATH_RE = /^[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*$/;

const IDENT_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

const PROP_PATH_RE = /^props(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+$/;

const TRIGGER_ENUM = [
  'click',
  'change',
  'input',
  'submit',
  'focus',
  'blur',
  'mount',
  'unmount',
] as const;

export const StateBindingSchema = z
  .object({
    kind: z.literal('state'),
    path: z
      .string()
      .regex(
        DOTTED_PATH_RE,
        'state path must be a dotted identifier (e.g. local.form.email)',
      ),
  })
  .strict();

export type StateBinding = z.infer<typeof StateBindingSchema>;

export const ComputedBindingSchema = z
  .object({
    kind: z.literal('computed'),
    name: z.string().regex(IDENT_RE, 'computed name must be a JavaScript identifier'),
  })
  .strict();

export type ComputedBinding = z.infer<typeof ComputedBindingSchema>;

export const PropBindingSchema = z
  .object({
    kind: z.literal('prop'),
    path: z
      .string()
      .regex(
        PROP_PATH_RE,
        'prop path must start with "props." (e.g. props.title)',
      ),
  })
  .strict();

export type PropBinding = z.infer<typeof PropBindingSchema>;

export const EventBindingSchema = z
  .object({
    kind: z.literal('event'),
    trigger: z.enum(TRIGGER_ENUM),
  })
  .strict();

export type EventBinding = z.infer<typeof EventBindingSchema>;

export const ExpressionBindingSchema = z
  .object({
    kind: z.literal('expression'),
    expr: z
      .string()
      .min(1, 'expression cannot be empty')
      .max(1024, 'expression too long (max 1024 chars)'),
  })
  .strict();

export type ExpressionBinding = z.infer<typeof ExpressionBindingSchema>;

export const UIBindingSchema = z.discriminatedUnion('kind', [
  StateBindingSchema,
  ComputedBindingSchema,
  PropBindingSchema,
  EventBindingSchema,
  ExpressionBindingSchema,
]);

export type UIBinding = z.infer<typeof UIBindingSchema>;