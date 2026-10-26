/**
 * sn-radio contract — shared types for `sn-radio` / `sn-radio-group`.
 *
 * The group provides this context through `provide()`; children read it with
 * `inject()` and fall back to their own props when a field is `undefined`
 * (wd-radio's documented "继承自 wd-radio-group" defaults).
 */

import type { InjectionKey, Ref } from 'vue'

/** Value type shared by the group's selection and each radio's `value`. */
export type SnRadioValue = string | number | boolean

/**
 * Group-level model type. `undefined` is the "nothing selected" sentinel —
 * wd-radio-group's default is unset, and `allowUncheck` needs a way to
 * express "back to unselected".
 */
export type SnRadioModelValue = SnRadioValue | undefined

/** Shape preset — mirrors `wd-radio` `type`. */
export type SnRadioType = 'circle' | 'dot' | 'square' | 'button'

/** Marker position relative to the label. */
export type SnRadioPlacement = 'left' | 'right'

/** Layout direction of the group's children. */
export type SnRadioDirection = 'horizontal' | 'vertical'

/** Context injected by `SnRadioGroup` into child `SnRadio` instances. */
export interface SnRadioGroupContext {
  /** Whether `value` is the currently selected entry. */
  isChecked: (value: SnRadioValue) => boolean
  /** Select `value` (or clear it when `allowUncheck` is on). */
  select: (value: SnRadioValue) => void
  /** Group-level disabled — ORs with the child's own `disabled`. */
  groupDisabled: Ref<boolean>
  /** Group-level readonly — ORs with the child's own `readonly`. */
  groupReadonly: Ref<boolean>
  /** Group-level shape preset. */
  groupType: Ref<SnRadioType>
  /** Group-level checked color (empty string = token default). */
  groupCheckedColor: Ref<string>
  /** Group-level unchecked color (empty string = token default). */
  groupUncheckedColor: Ref<string>
  /** Group-level marker placement. */
  groupPlacement: Ref<SnRadioPlacement>
  /** Group-level layout direction. */
  groupDirection: Ref<SnRadioDirection>
}

export const SN_RADIO_GROUP_KEY: InjectionKey<SnRadioGroupContext>
  = Symbol('sn-radio-group')
