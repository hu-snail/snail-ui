/**
 * sn-paging browser-host gesture fallback (uni-end, internal).
 *
 * Where a real uni runtime exists (MP / App / uni-h5) the pull-to-refresh and
 * scroll-to-bottom detection belong to `scroll-view` itself and this module is
 * never wired up. But when the component renders as an inert custom element —
 * the docs browser preview — neither the native refresher nor
 * `@scrolltolower` exists, so this module restores both gestures with plain
 * DOM listeners on the scroll host:
 *
 *   - pull-to-refresh: touch drag below the top (scrollTop <= 0), damped and
 *     clamped, reported through `onPull` while dragging; releasing past the
 *     threshold fires `onRefreshArm`.
 *   - load-more: a native `scroll` listener comparing geometry against the
 *     lower threshold.
 *
 * All DOM access lives behind the `typeof document` guard at the entry point
 * so the uni-x transform only ever sees optional calls (§116.2). The returned
 * dispose function removes every listener (§41/§42).
 */

export interface BrowserPagingGestureOptions {
  /** Whether the refresher gesture is currently enabled (prop-driven). */
  isRefresherEnabled: () => boolean
  /** Arming pull distance in px (prop-driven). */
  refresherThreshold: () => number
  /** Distance from the bottom that fires load-more, in px (prop-driven). */
  lowerThreshold: () => number
  /** A query is in flight — dragging must not stack another one. */
  isBusy: () => boolean
  /** Drag distance update while pulling; `0` snaps back. */
  onPull: (distance: number) => void
  /** Released past the threshold — host starts the refresh query. */
  onRefreshArm: () => void
  /** Scrolled near the bottom — host loads the next page. */
  onReachBottom: () => void
}

/** Damping applied to the finger travel; keeps the pull feeling heavier. */
const PULL_DAMPING = 0.6
/** Pull travel is clamped to this multiple of the arming threshold. */
const PULL_MAX_RATIO = 1.6

/**
 * Install the fallback gestures on `el`. Returns a dispose function; returns
 * `null` when DOM APIs are unavailable (non-browser host).
 */
export function createBrowserPagingGesture(
  el: HTMLElement,
  options: BrowserPagingGestureOptions,
): (() => void) | null {
  if (typeof document === 'undefined') return null

  let startY = 0
  let armed = false
  let lastPull = 0

  const onTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0]
    if (!touch) return
    armed = options.isRefresherEnabled() && !options.isBusy() && el.scrollTop <= 0
    startY = touch.clientY
  }

  const onTouchMove = (event: TouchEvent): void => {
    if (!armed) return
    const touch = event.touches[0]
    if (!touch) return
    const dy = touch.clientY - startY
    const threshold = options.refresherThreshold()
    lastPull = Math.max(0, Math.min(dy * PULL_DAMPING, threshold * PULL_MAX_RATIO))
    options.onPull(lastPull)
    if (lastPull > 0 && event.cancelable) event.preventDefault()
  }

  const onTouchEnd = (): void => {
    if (!armed) return
    armed = false
    const armedNow = lastPull >= options.refresherThreshold()
    lastPull = 0
    options.onPull(0)
    if (armedNow) options.onRefreshArm()
  }

  const onScroll = (): void => {
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    if (distanceFromBottom <= options.lowerThreshold()) options.onReachBottom()
  }

  /* Touch listeners need `preventDefault` authority while dragging. */
  el.addEventListener('touchstart', onTouchStart, { passive: true })
  el.addEventListener('touchmove', onTouchMove, { passive: false })
  el.addEventListener('touchend', onTouchEnd, { passive: true })
  el.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
    el.removeEventListener('touchend', onTouchEnd)
    el.removeEventListener('scroll', onScroll)
  }
}
