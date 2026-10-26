/**
 * sn-collapse contract — shared types for `sn-collapse` / `sn-collapse-item`.
 *
 * The container owns the bound value; items read it through `provide`/`inject`
 * and report their own name. The three upstream modes share one bound-value
 * shape:
 *
 *   normal     → `string[]`  (many panels open)
 *   accordion  → `string`    (one panel open)
 *   viewmore   → `boolean`   (one body, collapsed to `lineNum` lines)
 *
 * Keeping that union in one type is what lets `v-model` stay a single prop
 * across all three modes, exactly as wd-collapse documents it.
 */

import type { InjectionKey, Ref } from 'vue';

/** Bound value for any of the three modes. */
export type SnCollapseModelValue = string | string[] | boolean;

/** Veto hook run before a panel opens. */
export type SnCollapseItemBeforeExpand = (name: string) => boolean | Promise<boolean>;

/** Options accepted by `toggleAll`. */
export interface SnCollapseToggleAllOptions {
  /** `true` opens everything, `false` closes everything, omit to flip each. */
  expanded?: boolean;
  /** Skip disabled panels while toggling. */
  skipDisabled?: boolean;
}

/** Context injected by `SnCollapse` into child `SnCollapseItem` instances. */
export interface SnCollapseContext {
  /** Whether the panel named `name` is open. */
  isExpanded: (name: string) => boolean;
  /** Toggle the panel named `name`. */
  toggle: (name: string) => void;
  /** True when the container is in accordion mode. */
  accordion: Ref<boolean>;
  /** True when the container is in view-more mode. */
  viewmore: Ref<boolean>;
  /** Collapsed line count in view-more mode. */
  lineNum: Ref<number>;
  /** True when the whole container is open in view-more mode. */
  viewmoreExpanded: Ref<boolean>;
  /** Flip the whole container in view-more mode. */
  toggleViewmore: () => void;
  /** Report a panel name so `toggleAll` can enumerate the panels. */
  registerName: (name: string, disabled?: boolean) => void;
  /** Drop a panel name when it unmounts. */
  unregisterName: (name: string) => void;
}

export const SN_COLLAPSE_KEY: InjectionKey<SnCollapseContext> = Symbol('sn-collapse');
