/**
 * Public types of @snui/admin-layout — the admin shell contract (ADR-0006).
 *
 * The package is layout-only: every business concern (auth, requests,
 * stores, route registration) stays in the host. Menu navigation is
 * event-driven (`select`), never performed internally.
 */

/** Built-in layout shapes. `v-model:layout` for host-driven switchers. */
export type SnProLayoutMode = 'side' | 'top' | 'mix' | 'dual';

/** Visual style of the route tab bar — the SnTabs `type` surface. */
export type SnProTabType = 'line' | 'card' | 'bar' | 'segment' | 'chrome';

/** One visited-route entry of the tab bar. */
export interface SnProTabItem {
  /** Stable tab identity — usually the route name. */
  key: string;
  /** Label shown in the strip (host-localized). */
  label: string;
  /** `false` removes the close button (affix tabs like the dashboard).
   * Default `true`. */
  closable?: boolean;
}

/** Swatch for the settings panel's primary-color section. */
export interface SnProPrimaryColor {
  /** Stable preset id (host-owned). */
  id: string;
  /** CSS color for the swatch. */
  color: string;
}

/** Localized copy of the settings panel — the package stays i18n-free. */
export interface SnProSettingsLabels {
  title: string;
  layout: string;
  layoutSide: string;
  layoutTop: string;
  layoutMix: string;
  layoutDual: string;
  mode: string;
  light: string;
  dark: string;
  primary: string;
  tabStyle: string;
  tabLine: string;
  tabCard: string;
  tabBar: string;
  tabSegment: string;
  tabChrome: string;
}
