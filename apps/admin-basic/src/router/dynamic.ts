/**
 * Menu-tree → router/nav mapping — pure functions over the backend
 * `MenuItem[]` so they're unit-testable without a router instance.
 */
import type { RouteMeta, RouteRecordRaw } from 'vue-router';
import type { Component } from 'vue';
import { markRaw } from 'vue';
import type { MenuItem } from '../api/types';
import { MenuIcon } from './menu-icons';

/**
 * Dynamic view registry: backend sends a stable `key`, the template owns
 * the code-split import. A menu entry without a registered view is skipped
 * (logged in dev) rather than crashing registration.
 */
export const VIEW_COMPONENTS: Record<string, () => Promise<Component>> = {
  home: () => import('../views/home/HomeView.vue'),
  'docs-getting-started': () => import('../views/docs/GettingStartedView.vue'),
  'docs-request': () => import('../views/docs/RequestGuideView.vue'),
  'docs-router': () => import('../views/docs/RouterGuideView.vue'),
  'docs-theme': () => import('../views/docs/ThemeGuideView.vue'),
  'docs-i18n': () => import('../views/docs/I18nGuideView.vue'),
};

export interface NavOption {
  key: string;
  label: string;
  icon?: Component;
  children?: NavOption[];
}

/** Flatten the tree into route records (paths are absolute). */
export function menuToRoutes(nodes: MenuItem[], parentI18nKey?: string): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];
  for (const node of nodes) {
    const view = node.path !== undefined ? VIEW_COMPONENTS[node.key] : undefined;
    if (view !== undefined && node.path !== undefined) {
      const meta: RouteMeta = { i18nKey: node.i18nKey };
      if (parentI18nKey !== undefined) meta.parentI18nKey = parentI18nKey;
      if (node.icon !== undefined) meta.icon = node.icon;
      routes.push({
        path: node.path,
        name: node.key,
        component: view,
        meta,
      });
    }
    if (node.children !== undefined) {
      routes.push(...menuToRoutes(node.children, node.i18nKey));
    }
  }
  return routes;
}

/** Build SnMenu options; labels go through `t(i18nKey)` for live relabeling. */
export function menuToNavOptions(
  nodes: MenuItem[],
  translate: (key: string) => string,
): NavOption[] {
  return nodes.map((node) => {
    const option: NavOption = {
      key: node.key,
      label: translate(node.i18nKey),
    };
    const iconComponent = node.icon === undefined ? undefined : MenuIcon[node.icon];
    if (iconComponent !== undefined) option.icon = markRaw(iconComponent);
    if (node.children !== undefined && node.children.length > 0) {
      option.children = menuToNavOptions(node.children, translate);
    }
    return option;
  });
}
