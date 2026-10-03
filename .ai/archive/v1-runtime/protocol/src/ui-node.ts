import { z } from 'zod';
import { UIBindingSchema, type UIBinding } from './ui-binding.js';
import { UIEventBindingSchema, type UIEventBinding } from './ui-event-binding.js';
import { UIAccessibilitySchema, type UIAccessibility } from './ui-accessibility.js';
import { UICapabilitySchema, type UICapability } from './ui-capability.js';

/**
 * AUI UINode — the recursive UI tree element.
 *
 * Per AGENTS.md §25, the Zod schema (`UINodeSchema`) is the Source of Truth
 * at runtime; the `UINode` type is a structural mirror. They MUST stay in
 * sync.
 *
 * Why a manual recursive type alias instead of `z.infer<typeof UINodeSchema>`?
 * `z.infer<typeof UINodeSchema>` + `const UINodeSchema: z.ZodType<UINode>` is a
 * TS-level circular reference (`UINode` depends on `UINodeSchema`'s type,
 * which depends on `UINode`). Zod's documented pattern is to declare the
 * recursive type manually and annotate the schema with `z.ZodType<T>`.
 *
 * Consolidated forward references (AUI-PROTOCOL-CONSOLIDATE-001):
 *   - `bindings`      → Record<string, UIBinding>     (AUI-PROTOCOL-003)
 *   - `events`        → Record<string, UIEventBinding> (AUI-PROTOCOL-003)
 *   - `accessibility` → UIAccessibility                (AUI-PROTOCOL-005)
 *   - `capability`    → UICapability                   (AUI-PROTOCOL-006)
 *
 * Remaining placeholder:
 *   - `style`         → future task (UIStyle — not in P0/P1 WBS)
 */

export type UINode = {
  readonly id: string;
  readonly type: string;
  props?: Record<string, unknown> | undefined;
  children?: UINode[] | undefined;
  bindings?: Record<string, UIBinding> | undefined;
  events?: Record<string, UIEventBinding> | undefined;
  style?: unknown | undefined;
  accessibility?: UIAccessibility | undefined;
  capability?: UICapability | undefined;
};

// Lazy recursive schema — children is UINode[] which requires the schema to
// exist before the call site, hence `z.lazy`.
export const UINodeSchema: z.ZodType<UINode> = z.lazy(() =>
  z
    .object({
      id: z.string().min(1, 'UINode id must be a non-empty string'),

      type: z.string().min(1, 'UINode type must be a non-empty string'),

      props: z.record(z.string(), z.unknown()).optional(),

      children: z.array(UINodeSchema).optional(),

      bindings: z.record(z.string(), UIBindingSchema).optional(),

      events: z.record(z.string(), UIEventBindingSchema).optional(),

      style: z.unknown().optional(),

      accessibility: UIAccessibilitySchema.optional(),

      capability: UICapabilitySchema.optional(),
    })
    .strict(),
);