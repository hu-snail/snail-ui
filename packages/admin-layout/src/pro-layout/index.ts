/**
 * `standard` layout style entry of @snui/admin-layout.
 *
 * Import just this style (instead of the package barrel) to ship only the
 * four-shape shell:
 *
 *   import { SnProLayout } from '@snui/admin-layout/layouts/standard';
 *   import '@snui/admin-layout/layouts/standard/style.css';
 */

export { default as SnProLayout } from './SnProLayout.vue';
export type {
  SnProLayoutMode,
  SnProPrimaryColor,
  SnProSettingsLabels,
  SnProTabItem,
  SnProTabType,
} from './sn-pro-layout-types';
