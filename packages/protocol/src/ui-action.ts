import { z } from 'zod';

/**
 * AUI UIAction — declarative action reference embedded in a UISchema.
 *
 * Per AGENTS.md §21-22, Schema → Action ID only. The actual handler
 * (ActionDefinition) is registered in ActionRegistry at runtime
 * (AUI-ACTION-001..003 in `packages/runtime`). Schema does NOT carry
 * business functions.
 *
 * Per AGENTS.md §57 (AI Patch Boundary), the `ai` metadata describes
 * whether AI is allowed to auto-generate or invoke this action. AI must
 * never bypass the ActionRegistry to call services directly (§54).
 *
 * Field semantics:
 *   - id       — action identifier, matches `UIEventBinding.action` (dotted lowercase)
 *   - type     — canonical action kind (e.g. `submit`, `navigate`, `state-update`)
 *   - params   — payload hint (record); runtime ActionDefinition provides
 *                the authoritative Zod schema for validation
 *   - ai       — AI metadata: description, allowed flag, examples
 *
 * Forward references:
 *   - type canonical kinds → AUI-ACTION-001 (ActionRegistry)
 *   - params Zod schema  → AUI-ACTION-002 (per-action payload)
 *   - ai metadata        → AUI-AI (AI engine consumes)
 */

const ACTION_ID_RE = /^[a-z][a-z0-9_-]*(\.[a-z][a-z0-9_-]*)*$/;
const ACTION_TYPE_RE = /^[a-z][a-z0-9_-]*$/;

export const AIActionMetadataSchema = z
  .object({
    description: z.string().min(1).max(1024).optional(),
    allowed: z.boolean().optional(),
    examples: z.array(z.string()).optional(),
  })
  .strict();

export type AIActionMetadata = z.infer<typeof AIActionMetadataSchema>;

export const UIActionSchema = z
  .object({
    id: z
      .string()
      .min(1, 'action id must be a non-empty identifier')
      .regex(
        ACTION_ID_RE,
        'action id must be a dotted lowercase identifier (e.g. user.login)',
      ),

    type: z
      .string()
      .min(1, 'action type must be a non-empty identifier')
      .regex(
        ACTION_TYPE_RE,
        'action type must be a lowercase identifier (e.g. submit, navigate)',
      ),

    params: z.record(z.string(), z.unknown()).optional(),

    ai: AIActionMetadataSchema.optional(),
  })
  .strict();

export type UIAction = z.infer<typeof UIActionSchema>;