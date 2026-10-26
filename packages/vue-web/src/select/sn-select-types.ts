/**
 * Shared types for SnSelect / SnOption — internal to `src/select/`.
 *
 * Mirrors naive-ui `n-select`'s option contract (label / value / disabled /
 * children grouping) with `labelField` / `valueField` / `childrenField`
 * remapping, plus raw-value options (`options: ['a', 'b']`).
 *
 * Kept in a plain `.ts` module (same convention as sn-checkbox-types.ts /
 * sn-radio-types.ts) so no shared wiring (install.ts / index.ts /
 * resolver.ts) is touched.
 */

import type { InjectionKey, Ref } from 'vue'

/** Value type selectable inside SnSelect — mirrors naive-ui SelectOption value. */
export type SnSelectValue = string | number | boolean

/** Visual size preset (AUI convention adds `mini` below naive's `tiny`). */
export type SnSelectSize = 'mini' | 'tiny' | 'small' | 'medium' | 'large'

/** Validation-driven visual status. */
export type SnSelectStatus = 'default' | 'error' | 'warning'

/**
 * Raw entry accepted by the `options` prop: either a bare value
 * (`'a'` / `1` / `true`) or an object whose fields are read through
 * `labelField` / `valueField` / `childrenField`.
 */
export type SnSelectOptionInput = SnSelectValue | Record<string, unknown>

/** Normalized leaf option (selectable row). */
export interface SnSelectLeafOption {
  kind: 'leaf'
  /** Stable per-render key (index-based, guarantees uniqueness). */
  key: string
  label: string
  value: SnSelectValue
  disabled: boolean
}

/** Normalized group node (non-selectable header + child leaves). */
export interface SnSelectGroupOption {
  kind: 'group'
  key: string
  label: string
  children: SnSelectLeafOption[]
}

/** A node in the normalized menu tree. */
export type SnSelectMenuNode = SnSelectLeafOption | SnSelectGroupOption

/**
 * Custom filter for `filterable` mode. Receives the raw query text and
 * each normalized leaf; return true to keep the leaf visible.
 * Mirrors naive-ui's `filter` prop signature.
 */
export type SnSelectFilter = (pattern: string, option: SnSelectLeafOption) => boolean

/**
 * Menu context injected by SnSelect into SnOption rows (internal).
 * Mirrors the checkbox-group injection convention — the parent owns all
 * state; the row only reports clicks / hover and reads derived flags.
 */
export interface SnSelectMenuContext {
  /** Values currently selected (single selection still uses a 1-length view). */
  selectedValues: Ref<ReadonlyArray<SnSelectValue>>
  /** Keyboard / hover highlight target (`aria-activedescendant` source). */
  pendingValue: Ref<SnSelectValue | null>
  /** Select-level disabled flag. */
  menuDisabled: Ref<boolean>
  /** Select size preset — rows shrink with the trigger. */
  menuSize: Ref<SnSelectSize>
  /** Stable DOM id for one row (drives aria-activedescendant). */
  optionId: (value: SnSelectValue) => string
  /** Row membership test against `selectedValues`. */
  isOptionSelected: (value: SnSelectValue) => boolean
  /** Commit a row selection (click or Enter). */
  chooseOption: (value: SnSelectValue) => void
  /** Move the highlight to a row (hover). */
  setPending: (value: SnSelectValue) => void
}

/** Injection key for the select menu context (internal). */
export const SN_SELECT_MENU_KEY: InjectionKey<SnSelectMenuContext>
  = Symbol('sn-select-menu')

/**
 * Default filter — case-insensitive substring match on the label.
 * Kept exported for tests and for consumers that want to compose on it.
 */
export function defaultSelectFilter(pattern: string, option: SnSelectLeafOption): boolean {
  if (pattern === '') return true
  return option.label.toLowerCase().includes(pattern.toLowerCase())
}
