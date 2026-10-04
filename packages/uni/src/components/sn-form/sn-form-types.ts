/**
 * sn-form contract — shared types for sn-form / sn-form-item.
 *
 * Mirror of packages/vue-web/src/form/sn-form-types.ts. Kept as a
 * duplicate (rather than a cross-package dep) per AGENTS.md §58 —
 * `packages/runtime` and `packages/uni` must not depend on each other
 * for shared protocol types.
 */

import type { InjectionKey, Ref } from 'vue'

export type FormFieldValue = string | number | boolean | null | undefined

export type FormRule =
  | { required: true; message: string }
  | { type: 'string' | 'number' | 'email' | 'url'; message: string }
  | { pattern: RegExp; message: string }
  | { minLength: number; maxLength: number; message: string }
  | { min: number; max: number; message: string }
  | { validator: (value: FormFieldValue) => boolean | string; message: string }
  | { asyncValidator: (value: FormFieldValue) => Promise<boolean | string>; message: string }

export type FormRules = Record<string, FormRule[]>

export interface FormContext {
  model: Record<string, unknown>
  rules: FormRules
  showMessage: boolean
  statusIcon: boolean
  labelPosition: 'left' | 'right' | 'top'
  labelWidth: number | string
  disabled: boolean

  /* ── wot-ui `wd-form` 1:1 parity fields ──────────────────────────────── */

  validateTrigger: 'blur' | 'change'
  resetOnChange: boolean
  errorType: 'message' | 'toast' | 'none'
  size: 'small' | 'medium' | 'large'
  valueAlign: 'left' | 'right'
  asteriskPosition: 'left' | 'right'
  hideAsterisk: boolean
  ellipsis: boolean
  border: boolean
  center: boolean
}

export interface FormItemHandle {
  prop: string
  validate(): Promise<boolean>
  resetField(): void
  clearValidate(): void
}

export const FORM_CONTEXT_KEY: InjectionKey<FormContext> = Symbol('sn-form-context')

export interface FormItemState {
  status: Ref<'default' | 'error' | 'warning'>
  message: Ref<string>
  handle: FormItemHandle
}

export const FORM_ITEM_STATE_KEY: InjectionKey<FormItemState> = Symbol('sn-form-item-state')

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