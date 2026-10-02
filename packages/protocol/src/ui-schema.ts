import { z } from 'zod';

/**
 * AUI UISchema — canonical top-level UI contract.
 *
 * Per AGENTS.md §25, Zod is the Source of Truth. The TypeScript type is
 * derived via `z.infer`. No hand-written interface duplicates this shape.
 *
 * Forward references — `root`, `state`, and `actions` use `z.unknown()`
 * placeholders. They will be replaced by concrete Zod schemas as sibling
 * tasks land:
 *   - `root`   → AUI-PROTOCOL-002 (UINode)
 *   - `actions` → AUI-PROTOCOL-004 (UIAction)
 *   - `state`  → future task
 *
 * Until replaced, these slots accept any JSON value. Downstream packages
 * MUST narrow these properties once the concrete types land.
 */

const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[\w.]+)?(?:\+[\w.]+)?$/;

export const UISchemaSchema = z.object({
  version: z
    .string()
    .regex(SEMVER_RE, 'Schema version must be semver (e.g. 1.0.0 or 1.0.0-rc.1)'),

  id: z.string().min(1, 'Schema id must be a non-empty string').optional(),

  root: z.unknown(),

  state: z.unknown().optional(),

  actions: z.array(z.unknown()).optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UISchema = z.infer<typeof UISchemaSchema>;

/** Stable JSON Schema identifier prefix for AUI UISchemas. */
export const UI_SCHEMA_TYPE = 'aui.page';

/** First released UISchema version (per Master Plan Phase 1 freeze). */
export const UI_SCHEMA_VERSION = '1.0.0';