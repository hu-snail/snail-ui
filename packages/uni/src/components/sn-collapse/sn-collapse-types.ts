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
  /** True when the container is view-more mode. */
  viewmore: Ref<boolean>;
  /** Collapsed line count in view-more mode. */
  lineNum: Ref<number>;
  /** True when the whole container is open in view-more mode. */
  viewmoreExpanded: Ref<boolean>;
  /** Flip the whole container in view-more mode. */
  toggleViewmore: () => void;
  /** Card mode (additive): each panel paints its own rounded card. */
  card: Ref<boolean>;
  /** Container-level icon size, inherited by a panel whose own prop is unset. */
  iconSize: Ref<string | number | undefined>;
  /** Container-level icon colour, inherited by a panel whose own prop is unset. */
  iconColor: Ref<string>;
  /** Report a panel name so `toggleAll` can enumerate the panels. */
  registerName: (name: string, disabled?: boolean) => void;
  /** Drop a panel name when it unmounts. */
  unregisterName: (name: string) => void;
}

/**
 * Icon geometry contract for the collapse family (§112.5).
 *
 * The collapsed / expanded chevron and every title icon share one length token
 * so a panel never mixes two glyph scales: `--sn-mp-icon-size-medium` (32rpx)
 * pairs with the `--sn-mp-font-size-md` (28rpx) title line. Consumers override
 * it per instance with `iconSize`, or app-wide through the token itself.
 */
export const SN_COLLAPSE_ICON_SIZE = 'var(--sn-mp-icon-size-medium)';

/**
 * Default SVG stroke weight for the collapse glyphs.
 *
 * `--sn-mp-icon-stroke-width` is a raw design unit (`2`), and an SVG
 * presentation attribute cannot resolve `var()` — SnIcon forwards the value
 * verbatim into `stroke-width`. The constant therefore mirrors the token value
 * so a single number keeps every panel's glyph weight consistent.
 */
export const SN_COLLAPSE_ICON_STROKE_WIDTH = 2;

/**
 * Named size tiers → `--sn-mp-icon-size-*` tokens (no light-mode fallback
 * values, §112.5). Same table as sn-cell, so both components answer `tiny`
 * with the same geometry.
 */
const ICON_SIZE_TIERS: Readonly<Record<string, string>> = {
  tiny: 'var(--sn-mp-icon-size-tiny)',
  small: 'var(--sn-mp-icon-size-small)',
  medium: 'var(--sn-mp-icon-size-medium)',
  large: 'var(--sn-mp-icon-size-large)',
  xlarge: 'var(--sn-mp-icon-size-xlarge)',
};

/**
 * Resolve an `iconSize` prop value.
 *
 * Numbers stay px, tier names become their token, unknown strings pass through
 * (so `'2em'` / `'36rpx'` keep working), and an unset prop falls back to the
 * family default above.
 */
export function resolveSnCollapseIconSize(
  size: string | number | undefined,
  fallback: string = SN_COLLAPSE_ICON_SIZE,
): string | number {
  if (size === undefined) return fallback;
  if (typeof size === 'number') return size;
  return ICON_SIZE_TIERS[size] ?? size;
}

export const SN_COLLAPSE_KEY: InjectionKey<SnCollapseContext> = Symbol('sn-collapse');
