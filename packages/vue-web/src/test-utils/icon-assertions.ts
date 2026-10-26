/**
 * Shared icon rendering assertions for vue-web component tests.
 *
 * ## Why this exists
 *
 * `SnIcon` renders a `.sn-icon--missing` placeholder (with NO inner `<svg>`)
 * whenever neither `icon` nor `name` resolves to a component. That makes a
 * misspelled or simply wrong prop name fail *silently*: the icon is invisible
 * in the browser, but the DOM still contains a `.sn-icon` element, so a naive
 * `expect(wrapper.find('.sn-icon').exists()).toBe(true)` passes.
 *
 * That is exactly how nine `:component="X"` misuses — `SnIcon` accepts `icon`,
 * not `component` — shipped in SnDialog / SnAlert / SnStep / SnBackTop /
 * SnDrawerContent while every test stayed green.
 *
 * Every test that asserts an icon is present must therefore assert on the
 * rendered `<svg>`, not on the wrapper span. Use `expectIconRendered` below.
 *
 * See AGENTS.md §112 (reference-library parity) and §113 (icons go through
 * SnIcon).
 */

import { expect } from 'vitest'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'

type WrapperLike = VueWrapper<unknown> | DOMWrapper<Element>

/**
 * Assert that `selector` matched an element containing a *real* icon svg —
 * i.e. SnIcon resolved a component and rendered it, rather than falling back
 * to the unregistered-icon placeholder.
 *
 * @param wrapper  Vue wrapper or DOM wrapper to query within.
 * @param selector CSS selector for the icon host (the element that wraps, or
 *                 is, `<SnIcon>`). Defaults to the first `.sn-icon`.
 */
export function expectIconRendered(
  wrapper: WrapperLike,
  selector = '.sn-icon',
): void {
  const host = wrapper.find(selector)
  expect(host.exists(), `expected an icon host at "${selector}"`).toBe(true)
  expect(
    host.classes(),
    `icon at "${selector}" fell back to the unregistered placeholder`,
  ).not.toContain('sn-icon--missing')
  expect(
    host.find('svg').exists(),
    `icon at "${selector}" rendered no <svg> body`,
  ).toBe(true)
}

/**
 * Assert that an icon host exists but is the unregistered placeholder.
 * Used to prove the diagnostic path still works.
 */
export function expectIconMissing(wrapper: WrapperLike, selector = '.sn-icon'): void {
  const host = wrapper.find(selector)
  expect(host.exists(), `expected an icon host at "${selector}"`).toBe(true)
  expect(host.classes()).toContain('sn-icon--missing')
}

/**
 * Scan a wrapper's whole subtree for unresolved SnIcon placeholders.
 *
 * Use this as a cheap global guard in component tests: a component that is
 * supposed to draw one or more icons should never leave a placeholder behind.
 * The optional `label` is only used to make the failure message readable.
 */
export function expectNoMissingIcons(wrapper: WrapperLike, label?: string): void {
  const missing = wrapper.findAll('.sn-icon--missing')
  expect(
    missing.length,
    `${label ?? 'component'} left ${missing.length} unresolved SnIcon placeholder(s)`,
  ).toBe(0)
}
