/**
 * Shared types for SnPopselect — internal to `src/popselect/`.
 *
 * Mirrors naive-ui `n-popselect`'s option contract. The raw `options`
 * entry shape is the same `SnSelectOptionInput` accepted by SnSelect —
 * re-exported here instead of redefined (AGENTS.md §25: no double
 * definitions). Kept in a plain `.ts` module (same convention as
 * sn-select-types.ts / sn-dropdown-types.ts) so no shared wiring
 * (install.ts / index.ts / resolver.ts) is touched.
 */

import type { VNodeChild } from 'vue'
import type { SnSelectValue, SnSelectOptionInput } from '../select/sn-select-types'

export type { SnSelectValue, SnSelectOptionInput }

/** Value accepted / emitted by `value` / `update:value`. */
export type SnPopselectValue = SnSelectValue | SnSelectValue[] | null

/** Normalized selectable row. */
export interface SnPopselectLeafOption {
  kind: 'leaf'
  /** Stable per-render key (index-based, guarantees uniqueness). */
  key: string
  label: string
  value: SnSelectValue
  disabled: boolean
}

/** Normalized group header (non-selectable). */
export interface SnPopselectGroupOption {
  kind: 'group'
  key: string
  label: string
  children: SnPopselectLeafOption[]
}

/** A node in the normalized menu tree. */
export type SnPopselectMenuNode = SnPopselectLeafOption | SnPopselectGroupOption

/**
 * naive `render-label` signature. Receives the normalized leaf (label /
 * value / disabled resolved) and whether it is currently selected.
 */
export type SnPopselectRenderLabel = (
  option: SnPopselectLeafOption,
  selected: boolean,
) => VNodeChild

/**
 * naive `render-option` signature — wraps the default rendered node.
 */
export type SnPopselectRenderOption = (info: {
  node: VNodeChild
  option: SnPopselectLeafOption
  selected: boolean
}) => VNodeChild

/** Flat row model for the template: a group header or a selectable leaf. */
export interface SnPopselectRowGroup {
  kind: 'group'
  key: string
  label: string
}
export interface SnPopselectRowLeaf {
  kind: 'leaf'
  key: string
  leaf: SnPopselectLeafOption
}
export type SnPopselectRow = SnPopselectRowGroup | SnPopselectRowLeaf

/** Coerce one raw entry into its label / value / disabled fields. */
function readOptionFields(raw: SnSelectOptionInput, index: number): {
  label: string
  value: SnSelectValue
  disabled: boolean
} {
  if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') {
    return { label: String(raw), value: raw, disabled: false }
  }
  const obj = raw
  const labelRaw: unknown = obj['label']
  const valueRaw: unknown = obj['value']
  const disabledRaw: unknown = obj['disabled']
  const value: SnSelectValue
    = typeof valueRaw === 'string' || typeof valueRaw === 'number' || typeof valueRaw === 'boolean'
      ? valueRaw
      : index
  return {
    label: labelRaw === undefined || labelRaw === null ? String(value) : String(labelRaw),
    value,
    disabled: disabledRaw === true,
  }
}

/**
 * Normalize the `options` prop into menu nodes — deterministic, pure,
 * idempotent (AGENTS.md §27). One `children` level expands into a group
 * header + leaf rows, mirroring SnSelect's grouped menu.
 */
export function normalizePopselectOptions(
  options: readonly SnSelectOptionInput[],
): SnPopselectMenuNode[] {
  const out: SnPopselectMenuNode[] = []
  options.forEach((raw, index) => {
    if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') {
      out.push({
        kind: 'leaf',
        key: `${index}`,
        ...readOptionFields(raw, index),
      })
      return
    }
    const childrenRaw: unknown = raw['children']
    const fields = readOptionFields(raw, index)
    if (Array.isArray(childrenRaw) && childrenRaw.length > 0) {
      out.push({
        kind: 'group',
        key: `g-${index}`,
        label: fields.label,
        children: (childrenRaw as SnSelectOptionInput[]).map((childRaw, childIndex) => ({
          kind: 'leaf' as const,
          key: `${index}-${childIndex}`,
          ...readOptionFields(childRaw, childIndex),
        })),
      })
      return
    }
    out.push({ kind: 'leaf', key: `${index}`, ...fields })
  })
  return out
}

/** Flatten menu nodes into rows for rendering (groups become headers). */
export function toPopselectRows(nodes: readonly SnPopselectMenuNode[]): SnPopselectRow[] {
  const rows: SnPopselectRow[] = []
  for (const node of nodes) {
    if (node.kind === 'group') {
      rows.push({ kind: 'group', key: `row-${node.key}`, label: node.label })
      for (const leaf of node.children) {
        rows.push({ kind: 'leaf', key: `row-${leaf.key}`, leaf })
      }
    }
    else {
      rows.push({ kind: 'leaf', key: `row-${node.key}`, leaf: node })
    }
  }
  return rows
}
