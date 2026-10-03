import type { ZodError, ZodType, ZodIssue } from 'zod';
import { UISchemaSchema, type UISchema } from '@snui/protocol';

/**
 * AUI Schema Validator — produces a stable ValidationResult with path/code/
 * hint/source/severity per AGENTS.md §12-13 contract.
 *
 * Per WBS AUI-SCHEMA-002 acceptance:
 *   - validate(schema): ValidationResult
 *   - errors include `path` / `code` / `message` / `hint` / `source` / `severity`
 *
 * Per AGENTS.md §28, structured error shape. Per §29, error codes must be
 * stable, searchable, statistical, usable by AI Repair.
 *
 * The validator is purely a thin wrapper around `UISchemaSchema.safeParse` —
 * it adds structured error shape and a stable error-code mapping without
 * diverging from the Zod Source of Truth (AGENTS.md §25).
 */

export type SchemaErrorSource =
  | 'schema'
  | 'component'
  | 'binding'
  | 'action'
  | 'runtime';

export type SchemaErrorSeverity = 'info' | 'warning' | 'error';

export interface SchemaValidationError {
  path: string;
  code: string;
  message: string;
  /**
   * Repair hint. May be omitted when no hint is known for the error code.
   * Field is `string | undefined` rather than `string?` so it composes with
   * `exactOptionalPropertyTypes: true` (AGENTS.md §12).
   */
  hint?: string | undefined;
  source: SchemaErrorSource;
  severity: SchemaErrorSeverity;
}

export interface ValidationResult {
  valid: boolean;
  errors: readonly SchemaValidationError[];
}

export interface Validator<T = UISchema> {
  validate(input: unknown): ValidationResult & { value?: T };
  /** Return the inferred Zod schema. */
  readonly schema: ZodType<T>;
}

const ISSUE_CODE_MAP: Readonly<Record<string, SchemaValidationError['code']>> = {
  invalid_type: 'SCHEMA_TYPE_INVALID',
  invalid_string: 'SCHEMA_STRING_INVALID',
  invalid_literal: 'SCHEMA_LITERAL_INVALID',
  invalid_enum_value: 'SCHEMA_ENUM_INVALID',
  unrecognized_keys: 'SCHEMA_UNKNOWN_KEY',
  invalid_union: 'SCHEMA_UNION_INVALID',
  invalid_union_discriminator: 'SCHEMA_DISCRIMINATOR_INVALID',
  invalid_arguments: 'SCHEMA_ARGUMENTS_INVALID',
  invalid_return_type: 'SCHEMA_RETURN_TYPE_INVALID',
  invalid_date: 'SCHEMA_DATE_INVALID',
  invalid_intersection_types: 'SCHEMA_INTERSECTION_INVALID',
  invalid_module: 'SCHEMA_MODULE_INVALID',
  too_big: 'SCHEMA_TOO_BIG',
  too_small: 'SCHEMA_TOO_SMALL',
  not_finite: 'SCHEMA_NOT_FINITE',
  custom: 'SCHEMA_CUSTOM_INVALID',
};

function inferSourceFromPath(path: ReadonlyArray<PropertyKey>): SchemaErrorSource {
  if (path.length === 0) return 'schema';
  const segments = path.map((p) => String(p));
  // Bindings/events can appear nested under component nodes (`root.bindings.*`);
  // check those before component-level classification so deep paths resolve to the
  // most specific source (AGENTS.md §83 Error Recovery — node-level vs component-level).
  if (segments.includes('bindings') || segments.includes('events')) return 'binding';
  if (segments.includes('actions')) return 'action';
  if (segments[0] === 'root') return 'component';
  return 'schema';
}

function inferHint(code: string, dottedPath: string): string | undefined {
  switch (code) {
    case 'SCHEMA_UNKNOWN_KEY':
      return `Remove unknown property at ${dottedPath} or update the schema to accept it.`;
    case 'SCHEMA_TYPE_INVALID':
      return `Expected a different type at ${dottedPath}; see Zod docs for the required shape.`;
    case 'SCHEMA_STRING_INVALID':
      return `String format invalid at ${dottedPath}; check regex / min / max constraints.`;
    default:
      return undefined;
  }
}

function mapZodIssue(issue: ZodIssue): SchemaValidationError {
  const code = ISSUE_CODE_MAP[issue.code] ?? `SCHEMA_${issue.code.toUpperCase()}`;
  const dotted = issue.path.join('.') || '(root)';
  const hint = inferHint(code, dotted);
  return {
    path: dotted,
    code,
    message: issue.message,
    ...(hint !== undefined ? { hint } : {}),
    source: inferSourceFromPath(issue.path),
    severity: 'error',
  };
}

export function createValidator<T = UISchema>(
  schema: ZodType<T> = UISchemaSchema as unknown as ZodType<T>,
): Validator<T> {
  return {
    schema,
    validate(input: unknown): ValidationResult & { value?: T } {
      const result = schema.safeParse(input);
      if (result.success) {
        return { valid: true, errors: [], value: result.data };
      }
      const errors: SchemaValidationError[] = result.error.issues.map(mapZodIssue);
      return { valid: false, errors };
    },
  };
}

/** Stable error code namespace prefix — handy for grep / AI Repair lookup. */
export const ERROR_CODE_NAMESPACE = 'SCHEMA_' as const;

/** Re-export the protocol schema so consumers don't import zod directly. */
export { UISchemaSchema, type UISchema };

/** Re-export internal Zod types for downstream consumers. */
export type { ZodError };