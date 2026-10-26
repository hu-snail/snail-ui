/**
 * Shared types for SnDropdown — internal to `src/dropdown/`.
 *
 * Mirrors naive-ui `n-dropdown`'s DropdownOption contract (key / label /
 * disabled / icon / children + `type: 'divider'` separators). Kept in a
 * plain `.ts` module (same convention as sn-select-types.ts /
 * sn-checkbox-types.ts) so no shared wiring (install.ts / index.ts /
 * resolver.ts) is touched.
 */

/** Identifier emitted by `select` — mirrors naive-ui DropdownOption key. */
export type SnDropdownKey = string | number

/** Visual size preset for the panel (naive `size`). */
export type SnDropdownSize = 'small' | 'medium' | 'large'

/**
 * Panel placement relative to the trigger — the six bottom/top presets of
 * naive `placement`. The vertical half flips when the viewport lacks room;
 * the alignment suffix survives the flip (bottom-start → top-start).
 */
export type SnDropdownPlacement =
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'top'
  | 'top-start'
  | 'top-end'

/** What gesture opens the menu (naive `trigger`). Keyboard always works. */
export type SnDropdownTrigger = 'click' | 'hover'

/**
 * Raw entry accepted by the `options` prop — mirrors naive-ui DropdownOption:
 * action rows and separators, mixed in one array.
 */
export interface SnDropdownOption {
  /** `'divider'` renders a separator row instead of an action. */
  type?: 'divider' | undefined
  /** Stable identifier carried into the `select` event payload. */
  key: SnDropdownKey
  /** Row label. Defaults to `String(key)` when omitted. */
  label?: string | undefined
  /** Disabled rows are unclickable and skipped by keyboard navigation. */
  disabled?: boolean | undefined
  /** Leading icon — any Vue component (SnMenu `icon` convention). */
  icon?: unknown
  /** One right-slide submenu level (deeper levels are ignored). */
  children?: SnDropdownOption[] | undefined
}

/** Normalized action row. */
export interface SnDropdownItemNode {
  kind: 'item'
  /** Index within its own level (stable v-for anchor + DOM id source). */
  index: number
  key: SnDropdownKey
  label: string
  disabled: boolean
  icon: unknown
  /** The consumer's original object — emitted verbatim by `select`. */
  raw: SnDropdownOption
  /** Normalized children (one nesting level). */
  children: SnDropdownMenuNode[]
  hasChildren: boolean
}

/** Normalized separator row. */
export interface SnDropdownDividerNode {
  kind: 'divider'
  index: number
  key: SnDropdownKey
}

/** A node in the normalized menu tree. */
export type SnDropdownMenuNode = SnDropdownItemNode | SnDropdownDividerNode

/**
 * Normalize the `options` prop into menu nodes — deterministic, pure,
 * idempotent (AGENTS.md §27). Only the top level expands `children`; a
 * deeper `children` array is ignored (one submenu level, documented).
 */
export function normalizeDropdownOptions(
  options: readonly SnDropdownOption[],
  depth: number = 0,
): SnDropdownMenuNode[] {
  return options.map((raw, index) => {
    if (raw.type === 'divider') {
      return {
        kind: 'divider' as const,
        index,
        key: raw.key ?? `sn-dropdown-divider-${index}`,
      }
    }
    const children = depth === 0 && Array.isArray(raw.children)
      ? normalizeDropdownOptions(raw.children, 1)
      : []
    return {
      kind: 'item' as const,
      index,
      key: raw.key,
      label: raw.label ?? String(raw.key),
      disabled: raw.disabled === true,
      icon: raw.icon,
      raw,
      children,
      hasChildren: children.some(node => node.kind === 'item'),
    }
  })
}
