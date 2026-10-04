/**
 * SnForm contract — shared types for SnForm / SnFormItem.
 *
 * Lives in its own module so the `<script setup>` blocks of the Vue
 * SFCs do not need to declare `export` (which the Vue SFC compiler
 * rejects inside `<script setup>`).
 */

import type { InjectionKey, Ref } from 'vue'

/**
 * Field value type. A form model is a flat or nested record of these.
 */
export type FormFieldValue = string | number | boolean | null | undefined

/**
 * Rule kinds supported by the Phase 1 validator.
 *
 * Each rule has a `message` — the string the FormItem shows on failure.
 * Rules are pure data; the validator function lives in
 * `sn-form-validator.ts` (same package, sibling to this file).
 */
export type FormRule =
  | { required: true; message: string }
  | { type: 'string' | 'number' | 'email' | 'url'; message: string }
  | { pattern: RegExp; message: string }
  | { minLength: number; maxLength: number; message: string }
  | { min: number; max: number; message: string }
  | { validator: (value: FormFieldValue) => boolean | string; message: string }
  | { asyncValidator: (value: FormFieldValue) => Promise<boolean | string>; message: string }

/**
 * Map of field-name → rules[]. Keys must match the `prop` prop on the
 * SnFormItem that consumes them.
 */
export type FormRules = Record<string, FormRule[]>

/**
 * Validation context shared from SnForm → SnFormItem via provide/inject.
 * The injection key keeps the API typed through the boundary.
 */
export interface FormContext {
  /** Reactive model the FormItem reads from (parent owns it). */
  model: Record<string, unknown>
  /** Resolved rules for the whole form. FormItem may merge its own rules on top. */
  rules: FormRules
  /** Show validation messages (false = silent, used for ARIA-only validation). */
  showMessage: boolean
  /** Status icon shown next to the message (false = text only). */
  statusIcon: boolean
  /** Label position inherited from parent SnForm. */
  labelPosition: 'left' | 'right' | 'top'
  /** Label width inherited from parent SnForm. */
  labelWidth: number | string
  /** Form-wide disabled flag. */
  disabled: boolean
}

/**
 * Imperative handle exposed by a FormItem. Form aggregates these so
 * `SnForm.validate()` can iterate without going through DOM lookups.
 */
export interface FormItemHandle {
  prop: string
  /** Run validation, return true if passes. Updates internal status. */
  validate(): Promise<boolean>
  /** Reset the field value to its initial captured value. */
  resetField(): void
  /** Clear any active error / warning status. */
  clearValidate(): void
}

/**
 * Injection key for SnForm → SnFormItem.
 */
export const FORM_CONTEXT_KEY: InjectionKey<FormContext> = Symbol('sn-form-context')

/**
 * FormItem's reactive state surfaced to the parent. Form aggregates them
 * for imperative `validate()` / `resetFields()` calls.
 */
export interface FormItemState {
  status: Ref<'default' | 'error' | 'warning'>
  message: Ref<string>
  /** Read by Form to decide whether to bubble the field's status up. */
  handle: FormItemHandle
}

export const FORM_ITEM_STATE_KEY: InjectionKey<FormItemState> = Symbol('sn-form-item-state')

/**
 * Helper: resolve a property path like 'user.email' on a model.
 * Returns undefined when any segment is missing.
 */
export function getByPath(model: Record<string, unknown>, path: string): FormFieldValue {
  const parts = path.split('.')
  let cur: unknown = model
  for (const part of parts) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[part]
  }
  return cur as FormFieldValue
}

export function setByPath(model: Record<string, unknown>, path: string, value: FormFieldValue): void {
  const parts = path.split('.')
  if (parts.length === 0) return
  let cur: Record<string, unknown> = model
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]!
    if (cur[part] === null || cur[part] === undefined || typeof cur[part] !== 'object') {
      cur[part] = {}
    }
    cur = cur[part] as Record<string, unknown>
  }
  const last = parts[parts.length - 1]!
  cur[last] = value
}