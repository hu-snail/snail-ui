/**
 * Checkbox group provide/inject contract — internal to `src/checkbox/`.
 *
 * Kept inside the checkbox folder so no shared wiring (install.ts /
 * index.ts / resolver.ts) is touched; the key mirrors the string-key
 * convention used by tabs (`'sn-tabs-active-value'`).
 */

import type { InjectionKey, Ref } from 'vue'

/** Value type shared by group options and checkbox `value` props. */
export type SnCheckboxValue = string | number | boolean

/** Shape accepted by `SnCheckboxGroup`'s `options` prop entries. */
export interface SnCheckboxGroupOption {
  label?: string
  value: SnCheckboxValue
  disabled?: boolean
}

/** Context injected by SnCheckboxGroup into child SnCheckbox instances. */
export interface SnCheckboxGroupContext {
  /** Reactive selected value list (group-level v-model). */
  selectedValues: Ref<SnCheckboxValue[]>
  /** Group-level disabled flag — ORs with the child's own `disabled`. */
  groupDisabled: Ref<boolean>
  /** Group size preset; wins over the child's own `size`. */
  groupSize: Ref<'mini' | 'tiny' | 'small' | 'medium' | 'large' | undefined>
  /** Toggle one child's membership in the selection. */
  toggleValue: (value: SnCheckboxValue, nextChecked: boolean) => void
  /** Whether the child is registered inside a group. */
  isInsideGroup: true
}

export const SN_CHECKBOX_GROUP_KEY: InjectionKey<SnCheckboxGroupContext>
  = Symbol('sn-checkbox-group')
