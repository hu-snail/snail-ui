import { z } from 'zod';

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
 * Forward references — `bindings` / `events` / `style` / `accessibility` /
 * `capability` use `z.unknown()` placeholders. Replaced by sibling tasks:
 *   - bindings      → AUI-PROTOCOL-003 (UIBinding)
 *   - events        → AUI-PROTOCOL-003 (UIEventBinding)
 *   - accessibility → AUI-PROTOCOL-005 (UIAccessibility)
 *   - capability    → AUI-PROTOCOL-006 (UICapability)
 *   - style         → future task
 */

export type UINode = {
  readonly id: string;
  readonly type: string;
  props?: Record<string, unknown> | undefined;
  children?: UINode[] | undefined;
  bindings?: Record<string, unknown> | undefined;
  events?: Record<string, unknown> | undefined;
  style?: unknown | undefined;
  accessibility?: unknown | undefined;
  capability?: unknown | undefined;
};

export const UINodeSchema: z.ZodType<UINode> = z.lazy(() =>
  z
    .object({
      id: z.string().min(1, 'UINode id must be a non-empty string'),

      type: z.string().min(1, 'UINode type must be a non-empty string'),

      props: z.record(z.string(), z.unknown()).optional(),

      children: z.array(UINodeSchema).optional(),

      bindings: z.record(z.string(), z.unknown()).optional(),

      events: z.record(z.string(), z.unknown()).optional(),

      style: z.unknown().optional(),

      accessibility: z.unknown().optional(),

      capability: z.unknown().optional(),
    })
    .strict(),
);