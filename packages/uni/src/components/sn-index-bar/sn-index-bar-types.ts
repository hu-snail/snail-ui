/**
 * sn-index-bar contract — shared types for `sn-index-bar` / `sn-index-anchor`.
 *
 * The bar provides this context through `provide()`; anchors read it with
 * `inject()` and report their index plus the DOM id the bar's `scroll-view`
 * should jump to. This keeps the jump path free of layout queries: uni's
 * `scroll-into-view` takes a node id, not an offset.
 */

import type { InjectionKey } from 'vue'

/** Value type shared by the bar's index and each anchor's `index`. */
export type SnIndexBarValue = string | number

/** One registered anchor, in DOM order. */
export interface SnIndexAnchorEntry {
  /** Stable registration id. */
  uid: number
  /** Anchor index character(s) — also the sidebar entry label. */
  getIndex: () => SnIndexBarValue
  /** DOM id of the anchor root, used as the `scroll-into-view` target. */
  getId: () => string
}

/** Context injected by `SnIndexBar` into child `SnIndexAnchor` instances. */
export interface SnIndexBarContext {
  /** Register an anchor; returns its index in DOM order. */
  registerAnchor: (entry: SnIndexAnchorEntry) => number
  /** Drop an anchor when it unmounts. */
  unregisterAnchor: (uid: number) => void
  /** Currently highlighted index (drives the sidebar active state). */
  activeIndex: () => SnIndexBarValue | undefined
}

export const SN_INDEX_BAR_KEY: InjectionKey<SnIndexBarContext> = Symbol('sn-index-bar')
