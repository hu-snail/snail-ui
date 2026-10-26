/**
 * SnTreeSelect shared types — internal to `src/tree-select/`.
 *
 * Mirrors naive-ui `n-tree-select`'s tree option contract (label / key |
 * value / disabled / children) with `labelField` / `keyField` /
 * `childrenField` remapping.
 *
 * Kept in a plain `.ts` module (same convention as sn-select-types.ts /
 * sn-mention-types.ts) so no shared wiring (install.ts / index.ts /
 * resolver.ts) is touched.
 */

/** Value type selectable inside SnTreeSelect — naive tree keys are string | number. */
export type SnTreeSelectValue = string | number

/** Visual size preset (AUI convention adds `mini` below naive's `tiny`). */
export type SnTreeSelectSize = 'mini' | 'tiny' | 'small' | 'medium' | 'large'

/** Validation-driven visual status. */
export type SnTreeSelectStatus = 'default' | 'error' | 'warning'

/**
 * Raw entry accepted by the `options` prop: an object whose fields are read
 * through `labelField` / `keyField` (fallback `value`) / `childrenField`.
 */
export type SnTreeSelectOptionInput = Record<string, unknown>

/**
 * A normalized tree node (deterministic, pure output of normalization).
 * Both leaves and parents are selectable — parent selection commits the
 * parent's own value, no cascade.
 */
export interface SnTreeSelectNode {
  /** Stable per-render key (path-based, guarantees uniqueness). */
  key: string
  /** Display label. */
  label: string
  /** Committed value. */
  value: SnTreeSelectValue
  /** Node-level disabled (selection + toggling blocked, children still render). */
  disabled: boolean
  /** Depth in the tree (0 = root level) — drives indent. */
  depth: number
  /** Normalized children (undefined / empty for leaves). */
  children: SnTreeSelectNode[] | undefined
  /** Keys of ancestor nodes (root-first, excluding self). */
  parentKeys: string[]
}

/** Default filter — case-insensitive substring match on the label. */
export function defaultTreeSelectFilter(pattern: string, label: string): boolean {
  if (pattern === '') return true
  return label.toLowerCase().includes(pattern.toLowerCase())
}
