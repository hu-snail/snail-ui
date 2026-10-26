/**
 * AUI Schema package — high-level API over `@snui/protocol`.
 *
 * Per WBS §10-12, this package owns:
 *   - AUI-SCHEMA-001: Zod schema source-of-truth (re-exported from protocol)
 *   - AUI-SCHEMA-002: Validator with stable error codes + path/source/severity
 *   - AUI-SCHEMA-003: Normalizer (deterministic + idempotent canonical form)
 *   - AUI-SCHEMA-004: Schema version compatibility checker
 *
 * The package is intentionally thin — Zod is the actual source of truth
 * (AGENTS.md §25); this layer adds cross-cutting concerns (structured error
 * shape, canonical serialization) without duplicating definitions.
 */

export {
  createValidator,
  UISchemaSchema,
  ERROR_CODE_NAMESPACE,
  type Validator,
  type ValidationResult,
  type SchemaValidationError,
  type SchemaErrorSource,
  type SchemaErrorSeverity,
  type UISchema,
} from './validator.js';

export {
  createNormalizer,
  type Normalizer,
} from './normalizer.js';

export {
  parseSchemaVersion,
  isCompatible,
  CURRENT_SCHEMA_VERSION,
  type SchemaVersion,
} from './version.js';