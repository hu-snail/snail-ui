/**
 * sn-tabs contract — shared types for `sn-tabs` / `sn-tab`.
 *
 * The container provides this context through `provide()`; panes read it with
 * `inject()` and derive their own visibility. Registration order is DOM order,
 * which is what the index-based `v-model` resolves against.
 */

import type { InjectionKey, Ref } from 'vue'

/** Value shared by the container's selection and each pane's `name`. */
export type SnTabsValue = number | string

/** Active-bar style — mirrors `wd-tabs` `line-theme`. */
export type SnTabsLineTheme = 'normal' | 'text' | 'underline' | 'dot'

/** Scroll-navigation mode — mirrors `wd-tabs` `slidable`. */
export type SnTabsSlidable = 'auto' | 'always'

/** One registered pane. Getters keep the container's render reactive. */
export interface SnTabEntry {
  /** Stable registration id (DOM order). */
  uid: number
  /** Pane name, `undefined` when the pane relies on its index. */
  getName: () => SnTabsValue | undefined
  /** Pane title. */
  getTitle: () => string
  /** Pane disabled flag. */
  getDisabled: () => boolean
}

/** Context injected by `SnTabs` into child `SnTab` instances. */
export interface SnTabsContext {
  /** Currently active value (name or index). */
  activeValue: Ref<SnTabsValue>
  /** Whether the pane at `index` (or with `name`) is the active one. */
  isActive: (index: number, name: SnTabsValue | undefined) => boolean
  /** Register a pane; returns its index inside the container. */
  registerTab: (entry: SnTabEntry) => number
  /** Drop a pane when it unmounts. */
  unregisterTab: (uid: number) => void
}

export const SN_TABS_KEY: InjectionKey<SnTabsContext> = Symbol('sn-tabs')
