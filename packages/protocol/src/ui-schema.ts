import { z } from 'zod';
import { UINodeSchema } from './ui-node.js';
import { UIActionSchema } from './ui-action.js';

/**
 * AUI UISchema — canonical top-level UI contract.
 *
 * Per AGENTS.md §25, Zod is the Source of Truth. The TypeScript type is
 * derived via `z.infer`. No hand-written interface duplicates this shape.
 *
 * Consolidated forward references (AUI-PROTOCOL-CONSOLIDATE-001):
 *   - `root`    → UINodeSchema (replaces forward ref from AUI-PROTOCOL-002)
 *   - `actions` → UIActionSchema[] (replaces forward ref from AUI-PROTOCOL-004)
 *
 * Remaining placeholders (kept as `z.unknown()` until their tasks land):
 *   - `state`   → UIStateSchema (future task — not in P0 / P1 WBS yet)
 */

const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[\w.]+)?(?:\+[\w.]+)?$/;

export const UISchemaSchema = z.object({
  version: z
    .string()
    .regex(SEMVER_RE, 'Schema version must be semver (e.g. 1.0.0 or 1.0.0-rc.1)'),

  id: z.string().min(1, 'Schema id must be a non-empty string').optional(),

  root: UINodeSchema,

  state: z.unknown().optional(),

  actions: z.array(UIActionSchema).optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UISchema = z.infer<typeof UISchemaSchema>;

/** Stable JSON Schema identifier prefix for AUI UISchemas. */
export const UI_SCHEMA_TYPE = 'aui.page';

/** First released UISchema version (per Master Plan Phase 1 freeze). */
export const UI_SCHEMA_VERSION = '1.0.0';