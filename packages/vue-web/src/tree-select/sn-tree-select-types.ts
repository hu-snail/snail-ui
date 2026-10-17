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

import type { InjectionKey, Ref } from 'vue'

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

/**
 * Menu context injected by SnTreeSelect into SnTreeNode rows (internal).
 * Mirrors the SnSelect / SnOption injection convention — the parent owns
 * all state; the row only reports clicks / hover and reads derived flags.
 */
export interface SnTreeSelectMenuContext {
  /** Values currently selected (single selection still uses a 1-length view). */
  selectedValues: Ref<ReadonlyArray<SnTreeSelectValue>>
  /** Keyboard / hover highlight target key (`aria-activedescendant` source). */
  pendingKey: Ref<string | null>
  /** TreeSelect-level disabled flag. */
  menuDisabled: Ref<boolean>
  /** TreeSelect size preset — rows shrink with the trigger. */
  menuSize: Ref<SnTreeSelectSize>
  /** Whether the trigger runs in multiple mode (check marks per row). */
  isMultiple: boolean
  /** Stable DOM id for one row (drives aria-activedescendant). */
  nodeId: (node: SnTreeSelectNode) => string
  /** Expansion test for a parent node (leaves are never expanded). */
  isNodeExpanded: (node: SnTreeSelectNode) => boolean
  /** Row membership test against `selectedValues`. */
  isNodeSelected: (value: SnTreeSelectValue) => boolean
  /** Commit a row selection (click or Enter). */
  chooseNode: (value: SnTreeSelectValue) => void
  /** Toggle a parent's expand state. */
  toggleExpand: (node: SnTreeSelectNode) => void
  /** Move the highlight to a row (hover / click). */
  setPending: (key: string) => void
}

/** Injection key for the tree select menu context (internal). */
export const SN_TREE_SELECT_MENU_KEY: InjectionKey<SnTreeSelectMenuContext>
  = Symbol('sn-tree-select-menu')
