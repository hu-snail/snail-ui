import { UISchemaSchema, type UISchema } from '@snui/protocol';
import type { ZodType } from 'zod';

/**
 * AUI Schema Normalizer — fills defaults and canonicalizes shape so that
 *   normalize(normalize(schema)) === normalize(schema)
 * per WBS AUI-SCHEMA-003 acceptance (deterministic + idempotent).
 *
 * Per AGENTS.md §13:
 *   - Deterministic: same input always produces same output
 *   - Pure: no side effects
 *   - Idempotent: re-running produces no further change
 *
 * The normalizer is intentionally a thin pass over the protocol schema's
 * own defaults (Zod `.default(...)`) plus deterministic field ordering
 * (object key sort). It does NOT introduce new defaults or transform
 * semantics — those belong to component contracts (AUI-CONTRACT-002).
 */

export interface Normalizer<T = UISchema> {
  normalize(input: T): T;
  /** Same as normalize but accepts `unknown` input, validating first. */
  normalizeUnknown(input: unknown): T;
  /** Return the canonical JSON-serializable form. */
  canonicalize(input: T): string;
}

const SEMVER_KEYS: ReadonlyArray<keyof UISchema> = [
  'version',
  'id',
  'root',
  'state',
  'actions',
  'metadata',
];

/** Canonical sort: schema declaration order, then alphabetical fallback. */
function canonicalKeyOrder<T extends Record<string, unknown>>(input: T): T {
  if (input === null || typeof input !== 'object') return input;
  if (Array.isArray(input)) return input.map(canonicalKeyOrder) as unknown as T;
  const out: Record<string, unknown> = {};
  const seen = new Set<string>();
  for (const key of SEMVER_KEYS) {
    if (key in input) {
      out[key] = canonicalKeyOrder((input as Record<string, unknown>)[key as string] as Record<string, unknown>);
      seen.add(key as string);
    }
  }
  const remaining = Object.keys(input)
    .filter((k) => !seen.has(k))
    .sort();
  for (const key of remaining) {
    out[key] = canonicalKeyOrder((input as Record<string, unknown>)[key] as Record<string, unknown>);
  }
  return out as T;
}

export function createNormalizer<T extends Record<string, unknown> = UISchema>(
  schema: ZodType<T> = UISchemaSchema as unknown as ZodType<T>,
): Normalizer<T> {
  return {
    normalize(input) {
      // Zod `.default(...)` already fills missing fields with declared defaults;
      // parse → canonicalize-key-order is sufficient for Phase 1.
      const parsed = schema.parse(input);
      return canonicalKeyOrder(parsed);
    },

    normalizeUnknown(input) {
      return this.normalize(schema.parse(input) as T);
    },

    canonicalize(input) {
      return JSON.stringify(canonicalKeyOrder(input));
    },
  };
}