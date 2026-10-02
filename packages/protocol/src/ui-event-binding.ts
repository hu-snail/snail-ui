import { z } from 'zod';

/**
 * AUI UIEventBinding — declarative wiring from a component DOM event → action id.
 *
 * Per AGENTS.md §21-22, Schema MUST NOT call services directly. Schema references
 * an action id only; ActionRegistry resolves the actual handler at runtime.
 *
 * The trigger list is the canonical event catalog shared by vue-web and uni
 * renderers. Renderer-specific events (e.g. platform-only lifecycle hooks) must
 * NOT appear here — use capability fallbacks instead.
 */

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

export const UIEventBindingSchema = z
  .object({
    trigger: z.enum(TRIGGER_ENUM),

    action: z
      .string()
      .min(1, 'action id must be a non-empty identifier')
      .regex(/^[a-z][a-z0-9_-]*(\.[a-z][a-z0-9_-]*)*$/, 'action id must be a dotted lowercase identifier'),
  })
  .strict();

export type UIEventBinding = z.infer<typeof UIEventBindingSchema>;