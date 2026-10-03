/**
 * AUI Schema Version — semver compatibility helper per WBS AUI-SCHEMA-004
 * + AGENTS.md §48.
 *
 * Rules:
 *   - Patch (x.y.Z): always compatible (additive, no breaking change)
 *   - Minor (x.Y.0): compatible within same major (new fields / nodes OK)
 *   - Major (X.0.0): BREAKING — caller must opt in explicitly
 *
 * This module is the single source of truth for "is schema version X
 * accepted by runtime version Y" decisions.
 */

export interface SchemaVersion {
  major: number
  minor: number
  patch: number
  raw: string
}

const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)(?:-[\w.]+)?(?:\+[\w.]+)?$/

export function parseSchemaVersion(raw: string): SchemaVersion | null {
  const m = SEMVER_RE.exec(raw)
  if (!m) return null
  return {
    major: Number.parseInt(m[1]!, 10),
    minor: Number.parseInt(m[2]!, 10),
    patch: Number.parseInt(m[3]!, 10),
    raw,
  }
}

export function isCompatible(
  schemaVersion: string,
  runtimeVersion: string,
  options: { allowMajor?: boolean } = {},
): { compatible: boolean; reason?: string } {
  const sv = parseSchemaVersion(schemaVersion)
  const rv = parseSchemaVersion(runtimeVersion)
  if (!sv) return { compatible: false, reason: `schema version "${schemaVersion}" is not semver` }
  if (!rv) return { compatible: false, reason: `runtime version "${runtimeVersion}" is not semver` }
  if (sv.major !== rv.major) {
    if (options.allowMajor) {
      return { compatible: true }
    }
    return {
      compatible: false,
      reason: `major version mismatch (schema ${sv.major} vs runtime ${rv.major}); opt-in via allowMajor`,
    }
  }
  if (sv.minor > rv.minor) {
    return {
      compatible: false,
      reason: `schema minor (${sv.minor}) > runtime minor (${rv.minor}); runtime too old`,
    }
  }
  return { compatible: true }
}

/** Current canonical schema version — must match @snui/protocol UI_SCHEMA_VERSION. */
export const CURRENT_SCHEMA_VERSION = '1.0.0' as const