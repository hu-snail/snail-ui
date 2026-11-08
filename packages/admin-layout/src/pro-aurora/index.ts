/**
 * `aurora` layout style entry of @snui/admin-layout.
 *
 * Import just this style (instead of the package barrel) to ship only the
 * top-bar + floating-rail shell:
 *
 *   import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora';
 *   import '@snui/admin-layout/layouts/aurora/style.css';
 */

export { default as SnProLayoutAurora } from './SnProLayoutAurora.vue';

/**
 * Background preset resolver + the CSS variable names it writes.
 *
 * Exported because they ARE the override contract: a host can call
 * `auroraBackgroundVars()` itself (custom preset), or re-point
 * `--sn-pro-aurora-glow-*` / `--sn-pro-aurora-bg-image` from any ancestor.
 */
export {
  AURORA_BG_IMAGE_VAR,
  AURORA_GLOW_VARS,
  auroraBackgroundVars,
} from './sn-pro-aurora-background';

export type {
  SnProLayoutAuroraBackground,
  SnProLayoutAuroraGeometry,
  SnProLayoutAuroraLocale,
  SnProLayoutAuroraLocaleLabels,
  SnProLayoutAuroraMode,
  SnProNoticeItem,
  SnProUserProfile,
} from './sn-pro-aurora-types';
