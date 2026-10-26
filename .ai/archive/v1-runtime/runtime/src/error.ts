/**
 * AUI Error System (AUI-RUNTIME-004).
 *
 * Per AGENTS.md §28, every Runtime error must be structured with code / path /
 * message / hint / source / severity / cause. Per §29, error codes must be
 * stable, searchable, statistical, and consumable by AI Repair.
 *
 * Errors are framework-agnostic — they MUST NOT carry references to Vue /
 * DOM / platform objects. The platform layer maps AUIError to host errors
 * (e.g. console.error / Sentry / Reporter).
 */

/** Stable AUI error code namespace prefix. */
export const ERROR_CODE_NAMESPACE = 'AUI_' as const;

export type AUIErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

export type AUIErrorSource = 'schema' | 'runtime' | 'binding' | 'action' | 'component' | 'platform';

export interface AUIError {
  /** Stable, grep-friendly error code (e.g. `AUI_RUNTIME_DISPOSED`). */
  readonly code: string;
  /** Optional JSON-Pointer style path (e.g. `/root/children/0`). */
  readonly path?: string | undefined;
  /** Human-readable message. MUST NOT include secrets (AGENTS.md §66). */
  readonly message: string;
  /** Optional repair hint. */
  readonly hint?: string | undefined;
  /** Which subsystem produced the error. */
  readonly source: AUIErrorSource;
  /** Severity — info / warning / error / fatal. */
  readonly severity: AUIErrorSeverity;
  /** Original cause (chain). */
  readonly cause?: unknown;
}

export interface CreateAUIErrorInput {
  code: string;
  message: string;
  path?: string | undefined;
  hint?: string | undefined;
  source?: AUIErrorSource | undefined;
  severity?: AUIErrorSeverity | undefined;
  cause?: unknown;
}

/**
 * Build an AUIError with the supplied fields. `code` is auto-prefixed with
 * `AUI_` if the caller omits it. Throws when `message` is empty (redaction
 * guard against silent errors — AGENTS.md §83 error recovery).
 */
export function createAUIError(input: CreateAUIErrorInput): AUIError {
  if (!input.message || input.message.trim() === '') {
    throw new Error('createAUIError requires a non-empty message');
  }
  if (!/^[A-Z][A-Z0-9_]*$/.test(input.code.replace(/^AUI_/, ''))) {
    throw new Error(`AUIError code "${input.code}" must be UPPER_SNAKE_CASE`);
  }
  const code = input.code.startsWith(`${ERROR_CODE_NAMESPACE}`) ? input.code : `${ERROR_CODE_NAMESPACE}${input.code}`;
  const err: AUIError = {
    code,
    message: input.message,
    source: input.source ?? 'runtime',
    severity: input.severity ?? 'error',
    ...(input.path !== undefined ? { path: input.path } : {}),
    ...(input.hint !== undefined ? { hint: input.hint } : {}),
    ...(input.cause !== undefined ? { cause: input.cause } : {}),
  };
  return Object.freeze(err);
}

/** Type-guard: is the value an AUIError? */
export function isAUIError(value: unknown): value is AUIError {
  if (value === null || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.code === 'string'
    && typeof v.message === 'string'
    && typeof v.source === 'string'
    && typeof v.severity === 'string';
}

/** Convert any thrown value into an AUIError. */
export function toAUIError(value: unknown, fallbackCode = 'UNCAUGHT'): AUIError {
  if (isAUIError(value)) return value;
  if (value instanceof Error) {
    return createAUIError({
      code: fallbackCode,
      message: value.message,
      hint: 'Original error was not an AUIError; converted at runtime boundary.',
      source: 'runtime',
      cause: value,
    });
  }
  return createAUIError({
    code: fallbackCode,
    message: typeof value === 'string' ? value : 'Unknown runtime error',
    source: 'runtime',
    cause: value,
  });
}