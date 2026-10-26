/**
 * sn-form validator (AUI-MP-004). Mirror of vue-web/sn-form-validator.
 */

import type { FormFieldValue, FormRule } from './sn-form-types'

export async function validateValue(
  value: FormFieldValue,
  rules: FormRule[],
): Promise<string> {
  for (const rule of rules) {
    const result = await runRule(value, rule)
    if (result !== '') return result
  }
  return ''
}

async function runRule(value: FormFieldValue, rule: FormRule): Promise<string> {
  if ('required' in rule) {
    if (rule.required && isEmpty(value)) return rule.message
    return ''
  }
  if ('type' in rule) {
    if (isEmpty(value)) return ''
    if (!matchesType(value, rule.type)) return rule.message
    return ''
  }
  if ('pattern' in rule) {
    if (isEmpty(value)) return ''
    if (typeof value !== 'string' || !rule.pattern.test(value)) return rule.message
    return ''
  }
  if ('minLength' in rule || 'maxLength' in rule) {
    if (isEmpty(value)) return ''
    const len = typeof value === 'string' ? value.length : String(value).length
    const r = rule as { minLength?: number; maxLength?: number; message: string }
    if (r.minLength !== undefined && len < r.minLength) return rule.message
    if (r.maxLength !== undefined && len > r.maxLength) return rule.message
    return ''
  }
  if ('min' in rule || 'max' in rule) {
    if (isEmpty(value)) return ''
    const n = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(n)) return rule.message
    const r = rule as { min?: number; max?: number; message: string }
    if (r.min !== undefined && n < r.min) return rule.message
    if (r.max !== undefined && n > r.max) return rule.message
    return ''
  }
  if ('validator' in rule) {
    const ret = rule.validator(value)
    if (ret === true) return ''
    if (ret === false) return rule.message
    return typeof ret === 'string' ? ret : rule.message
  }
  if ('asyncValidator' in rule) {
    const ret = await rule.asyncValidator(value)
    if (ret === true) return ''
    if (ret === false) return rule.message
    return typeof ret === 'string' ? ret : rule.message
  }
  return ''
}

function isEmpty(value: FormFieldValue): boolean {
  return value === undefined || value === null || value === '' ||
    (Array.isArray(value) && value.length === 0)
}

function matchesType(value: FormFieldValue, type: 'string' | 'number' | 'email' | 'url'): boolean {
  if (type === 'string') return typeof value === 'string'
  if (type === 'number') return typeof value === 'number' && !Number.isNaN(value)
  if (type === 'email') {
    return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }
  if (type === 'url') {
    try {
      new URL(value as string)
      return true
    } catch {
      return false
    }
  }
  return true
}