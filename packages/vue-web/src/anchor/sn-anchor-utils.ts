/**
 * Offset helpers for SnAnchor (AUI-WEB-NAV-007).
 *
 * Mirrors naive-ui `anchor/src/utils.ts` — measures an element relative to the
 * top of a scroll target so the active-link reduction can compare positions
 * without caring whether the target is the document or a nested container.
 */

export type OffsetTarget = Window | Document | HTMLElement

/**
 * The target's identity for offset purposes.
 *
 * Uses `nodeName === '#document'` rather than `instanceof Document` so the
 * measurement stays correct in a different realm (iframe, test DOM), matching
 * the guard SnBackTop uses.
 */
export function isDocumentLike(el: unknown): el is Document {
  return (el as Node | null)?.nodeName === '#document'
}

/**
 * Vertical offset and height of `el` relative to the top of `scrollTarget`.
 *
 * A window/document target contributes a zero baseline (its rect top is not
 * meaningful for a scrolled document); an element target subtracts its own
 * rect top so nested scroll containers are measured in the same space.
 */
export function getOffset(
  el: HTMLElement,
  scrollTarget: OffsetTarget,
): { top: number; height: number } {
  const { top: elTop, height } = el.getBoundingClientRect()
  const isElementTarget =
    scrollTarget instanceof HTMLElement && !isDocumentLike(scrollTarget)
  const scrollTargetTop = isElementTarget
    ? scrollTarget.getBoundingClientRect().top
    : 0
  return {
    top: elTop - scrollTargetTop,
    height,
  }
}
