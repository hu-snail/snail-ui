/**
 * @snui/admin-layout — public entry (ADR-0006).
 *
 * Layout-only admin shell composed from @snui/vue-web. The package handles
 * layout concerns exclusively: area composition, shape switching, collapse
 * state, menu rendering + select events. Business (auth / requests / stores
 * / route registration) belongs to the host — see README「职责边界」and
 * src/pro-layout/ai-description.md.
 */
export { default as SnProLayout } from './pro-layout/SnProLayout.vue';
export { default as SnProLogo } from './pro-logo/SnProLogo.vue';
export { default as SnProSider } from './pro-sider/SnProSider.vue';
export { default as SnProHeader } from './pro-header/SnProHeader.vue';

export {
  routesToMenuOptions,
  findTopAncestorKey,
  menuChildrenOf,
  menuPathTo,
  stripMenuChildren,
} from './menu/sn-admin-menu';
export type {
  RouteLike,
  RouteMetaLike,
  RoutesToMenuOptions,
} from './menu/sn-admin-menu';

export type { SnProLayoutMode } from './pro-layout/sn-pro-layout-types';
