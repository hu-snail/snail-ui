/**
 * @snui/admin-layout — public entry (ADR-0006 + ADR-0008).
 *
 * Layout-only admin shells composed from @snui/vue-web. The package handles
 * layout concerns exclusively: area composition, shape switching, collapse
 * state, menu rendering + select events. Business (auth / requests / stores
 * / route registration) belongs to the host — see README「职责边界」.
 *
 * ## Layout styles (ADR-0008)
 *
 * | style      | entry                                  | component             |
 * | ---------- | -------------------------------------- | --------------------- |
 * | `standard` | `@snui/admin-layout/layouts/standard`  | `SnProLayout`         |
 * | `classic`  | `@snui/admin-layout/layouts/classic`   | `SnProLayoutClassic`  |
 * | `aurora`   | `@snui/admin-layout/layouts/aurora`    | `SnProLayoutAurora`   |
 *
 * Every style is a self-contained module that reuses the SAME shared pieces
 * (`SnProLogo` / `SnProSearch` / `SnProNotice` / `SnProUser` / menu helpers)
 * and ships its own stylesheet, so `import '@snui/admin-layout/layouts/<style>'`
 * + `<style>/style.css` loads only the chosen layout. This barrel keeps the
 * "import everything" path working (and stays the single package-entry
 * surface for hosts that want several styles at once).
 *
 * ## What is NOT here: the workbench
 *
 * `ProWorkbench` (the shared dashboard) lives at `@snui/admin-layout/workbench`
 * and is deliberately absent from this barrel: it depends on `@snui/echarts`, and
 * a host that only wants a layout shell should not be forced to ship a chart
 * engine (AGENTS.md §81). Import the subpath when you want it:
 *
 *   import { ProWorkbench } from '@snui/admin-layout/workbench';
 *   import '@snui/admin-layout/workbench/style.css';
 */

// ── Layout styles ────────────────────────────────────────────────────────
/** `standard` style — the four-shape shell (side / top / mix / dual). */
export { default as SnProLayout } from './pro-layout/SnProLayout.vue';
/** `classic` style — grouped sidebar + user card + content header. */
export { default as SnProLayoutClassic } from './pro-classic/SnProLayoutClassic.vue';
/** `aurora` style — full-bleed background + top bar + floating primary rail. */
export { default as SnProLayoutAurora } from './pro-aurora/SnProLayoutAurora.vue';

// ── Shared pieces (composed by every layout style) ───────────────────────
export { default as SnProLogo } from './pro-logo/SnProLogo.vue';
export { default as SnProSider } from './pro-sider/SnProSider.vue';
export { default as SnProHeader } from './pro-header/SnProHeader.vue';
export { default as SnProTabbar } from './pro-tabbar/SnProTabbar.vue';
export { default as SnProSettings } from './pro-settings/SnProSettings.vue';
export { default as SnProSearch } from './pro-search/SnProSearch.vue';
export { default as SnProNotice } from './pro-notice/SnProNotice.vue';
export { default as SnProUser } from './pro-user/SnProUser.vue';

// ── Menu helpers (pure functions over plain data) ────────────────────────
export {
  routesToMenuOptions,
  findTopAncestorKey,
  menuChildrenOf,
  menuPathTo,
  stripMenuChildren,
} from './menu/sn-admin-menu';
export { searchMenuOptions } from './menu/sn-menu-search';

// ── Types ────────────────────────────────────────────────────────────────
export type { RouteLike, RouteMetaLike, RoutesToMenuOptions } from './menu/sn-admin-menu';
export type { MenuSearchOptions, SnProMenuHit } from './menu/sn-menu-search';
export type {
  SnProLayoutMode,
  SnProTabType,
  SnProTabItem,
  SnProPrimaryColor,
  SnProSettingsLabels,
} from './pro-layout/sn-pro-layout-types';
export type { SnProLayoutClassicGeometry } from './pro-classic/sn-pro-classic-types';
export type {
  SnProLayoutAuroraBackground,
  SnProLayoutAuroraGeometry,
  SnProLayoutAuroraLocale,
  SnProLayoutAuroraLocaleLabels,
  SnProLayoutAuroraMode,
} from './pro-aurora/sn-pro-aurora-types';
export type { SnProNoticeItem } from './pro-notice/sn-pro-notice-types';
export type { SnProUserProfile } from './pro-user/sn-pro-user-types';

// ── Style helpers ────────────────────────────────────────────────────────
/** Background preset resolver of the `aurora` style (+ the variable names it writes). */
export {
  AURORA_BG_IMAGE_VAR,
  AURORA_GLOW_VARS,
  auroraBackgroundVars,
} from './pro-aurora/sn-pro-aurora-background';
