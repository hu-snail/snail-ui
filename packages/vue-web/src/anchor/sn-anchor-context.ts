/**
 * Shared injection contract for SnAnchor / SnAnchorLink (AUI-WEB-NAV-007).
 *
 * Mirrors naive-ui's `anchorInjectionKey`. The parent anchor collects the
 * hrefs and title elements of every registered link, observes the scroll
 * position, and owns the active href; each link reads that href to derive its
 * own active state and reports its title element back for rail positioning.
 *
 * Kept in a plain `.ts` module (rather than inside SnAnchor.vue) so that
 * SnAnchorLink can import the key without a circular import.
 */
import type { InjectionKey, Ref } from 'vue'

export interface SnAnchorContext {
  /** Currently active link href, or `null` when none is active. */
  activeHref: Ref<string | null>
  /** Scroll into view and mark `href` active. */
  setActiveHref: (href: string, transition?: boolean) => void
  /** Reposition the rail bar against `titleEl` (a link's `<a>` element). */
  updateBarPosition: (titleEl: HTMLElement, transition?: boolean) => void
  /** Hrefs of every mounted link, in mount order. */
  collectedLinkHrefs: string[]
  /** `<a>` elements of every mounted link, in mount order. */
  titleEls: HTMLElement[]
}

export const snAnchorInjectionKey: InjectionKey<SnAnchorContext> = Symbol(
  'sn-anchor',
)
