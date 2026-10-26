/**
 * sn-sidebar contract — shared types for `sn-sidebar` / `sn-sidebar-item`.
 *
 * The container provides this context through `provide()`; items read it with
 * `inject()` and derive their own active state. Mirrors the `sn-radio-types.ts`
 * pattern so all three pairs stay symmetric.
 */

import type { InjectionKey, Ref } from 'vue';

/** Value shared by the sidebar's selection and each item's `value`. */
export type SnSidebarValue = number | string;

/** Context injected by `SnSidebar` into child `SnSidebarItem` instances. */
export interface SnSidebarContext {
  /** Currently active value. */
  activeValue: Ref<SnSidebarValue>;
  /** Whether `value` is the current selection. */
  isActive: (value: SnSidebarValue) => boolean;
  /** Request a switch; the container runs `beforeChange` before committing. */
  select: (value: SnSidebarValue, label: string) => void;
}

export const SN_SIDEBAR_KEY: InjectionKey<SnSidebarContext> = Symbol('sn-sidebar');
