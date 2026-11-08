/**
 * sn-sidebar contract — shared types for `sn-sidebar` / `sn-sidebar-item`.
 *
 * The container provides this context through `provide()`; items read it with
 * `inject()` and derive their own active state. Mirrors the `sn-radio-types.ts`
 * pattern so all three pairs stay symmetric. It also carries the scroll-spy
 * anchor registry (`registerAnchor` / `unregisterAnchor`), the same
 * registration shape `sn-index-bar-types.ts` uses.
 */

import type { InjectionKey, Ref } from 'vue';

/** Value shared by the sidebar's selection and each item's `value`. */
export type SnSidebarValue = number | string;

/**
 * One item registered with the container for scroll linkage
 * (additive — AUI-OPT-08, AGENTS.md §112.3a).
 *
 * The container cannot read it off the slot's vnodes, so each item reports
 * itself the way `sn-index-anchor` reports to `sn-index-bar`. Getters, not
 * snapshots: props may change after registration.
 */
export interface SnSidebarAnchorEntry {
  /** Stable registration id. */
  uid: number;
  /** Resolve the entry's current value. */
  getValue: () => SnSidebarValue;
  /** Resolve the entry's linked content-section `id` (`''` when unlinked). */
  getAnchor: () => string;
  /** Resolve the entry's label, forwarded on the scroll-driven `change`. */
  getLabel: () => string;
}

/** Context injected by `SnSidebar` into child `SnSidebarItem` instances. */
export interface SnSidebarContext {
  /** Currently active value. */
  activeValue: Ref<SnSidebarValue>;
  /** Whether `value` is the current selection. */
  isActive: (value: SnSidebarValue) => boolean;
  /** Request a switch; the container runs `beforeChange` before committing. */
  select: (value: SnSidebarValue, label: string) => void;
  /** Register an item for scroll linkage. Internal to the pair. */
  registerAnchor: (entry: SnSidebarAnchorEntry) => void;
  /** Drop an item's registration when it unmounts. Internal to the pair. */
  unregisterAnchor: (uid: number) => void;
}

export const SN_SIDEBAR_KEY: InjectionKey<SnSidebarContext> = Symbol('sn-sidebar');
