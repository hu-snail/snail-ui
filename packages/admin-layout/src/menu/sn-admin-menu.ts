/**
 * Menu building helpers for @snui/admin-layout — pure functions over plain data.
 *
 * Two supported menu sources (see README「菜单来源」):
 *   A. **Static routes** — `routesToMenuOptions()` reads a vue-router-style
 *      route table *structurally* (duck-typed `RouteLike`, no vue-router
 *      import): `RouteRecordRaw[]` and `router.options.routes` both satisfy
 *      it. Reads `meta.title` / `meta.icon` / `meta.hidden` / `meta.order`.
 *   B. **Dynamic backend menus** — the HOST maps API rows into
 *      `SnMenuOption[]` (that mapping is business logic and stays outside
 *      this package); the layout renders whatever options it receives and
 *      emits `select(key)` — navigation always happens in the host.
 *
 * Everything here is deterministic and side-effect-free so the mapping rules
 * are unit-testable without a router instance.
 */

import { markRaw } from 'vue';
import type { Component } from 'vue';
import type { SnMenuOption } from '@snui/vue-web';

/** Structural view of a route record's `meta` (duck-typed). */
export interface RouteMetaLike {
  /** Menu label. Routes without a usable string title become groups
   * (kept only when they still expose visible children). */
  title?: unknown;
  /** Icon name (resolved through `iconMap`) or an inline component. */
  icon?: unknown;
  /** Truthy hides the route (and its subtree) from menus. */
  hidden?: unknown;
  /** Numeric sibling sort key; missing sorts last, ties keep route order. */
  order?: unknown;
}

/** Structural view of a vue-router route record (duck-typed, no import). */
export interface RouteLike {
  name?: unknown;
  path?: unknown;
  meta?: RouteMetaLike;
  children?: RouteLike[];
}

export interface RoutesToMenuOptions {
  /** `meta.icon` string → icon component. Unmapped names render iconless. */
  iconMap?: Record<string, Component>;
  /** Skip routes marked `meta.hidden`. Default true. */
  skipHidden?: boolean;
  /** Stable-sort siblings by numeric `meta.order` (missing last). Default true. */
  sortByOrder?: boolean;
}

const ORDER_MISSING = Number.POSITIVE_INFINITY;

function orderOf(meta: RouteMetaLike | undefined): number {
  const value = meta?.order;
  return typeof value === 'number' && Number.isFinite(value) ? value : ORDER_MISSING;
}

function titleOf(meta: RouteMetaLike | undefined): string {
  const value = meta?.title;
  return typeof value === 'string' ? value : '';
}

function keyOf(route: RouteLike): string {
  if (typeof route.name === 'string' && route.name !== '') return route.name;
  if (typeof route.name === 'symbol') return route.name.description ?? String(route.name);
  if (typeof route.path === 'string' && route.path !== '') return route.path;
  return '';
}

function iconOf(meta: RouteMetaLike | undefined, iconMap: Record<string, Component> | undefined): unknown {
  const raw = meta?.icon;
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw === 'string') {
    const mapped = iconMap?.[raw];
    return mapped === undefined ? undefined : markRaw(mapped);
  }
  // Inline component passed straight through meta.icon.
  if (typeof raw === 'object' || typeof raw === 'function') return markRaw(raw as Component);
  return undefined;
}

function collect(
  routes: readonly RouteLike[],
  options: RoutesToMenuOptions,
  skipHidden: boolean,
): SnMenuOption[] {
  const entries: Array<{ option: SnMenuOption; order: number; index: number }> = [];
  routes.forEach((route, index) => {
    const meta = route.meta;
    if (skipHidden && meta?.hidden) return;

    const label = titleOf(meta);
    const children = route.children !== undefined ? collect(route.children, options, skipHidden) : [];
    // A titleless route is only worth keeping as a group when it still has
    // visible children (redirect-only parents collapse away).
    if (label === '' && children.length === 0) return;

    const option: SnMenuOption = { key: keyOf(route), label };
    const icon = iconOf(meta, options.iconMap);
    if (icon !== undefined) option.icon = icon;
    if (children.length > 0) option.children = children;
    entries.push({ option, order: orderOf(meta), index });
  });
  entries.sort((a, b) => a.order - b.order || a.index - b.index);
  return entries.map((entry) => entry.option);
}

/**
 * Route table → `SnMenuOption[]` (static-route menu source).
 *
 * Deterministic: hidden-subtree pruning, group collapsing (titleless parents
 * survive only with visible children) and stable `meta.order` sorting run at
 * every level, so calling twice on equal input yields deep-equal output.
 */
export function routesToMenuOptions(
  routes: readonly RouteLike[],
  options: RoutesToMenuOptions = {},
): SnMenuOption[] {
  return collect(routes, options, options.skipHidden ?? true);
}

/** Key of the top-level node that contains `key` (`key` itself if top-level);
 * null when absent. Drives mix/dual modes' "children of the active top item". */
export function findTopAncestorKey(
  options: readonly SnMenuOption[],
  key: string | number | null,
): string | number | null {
  if (key === null) return null;
  const walk = (nodes: readonly SnMenuOption[], topKey: string | number): string | number | undefined => {
    for (const node of nodes) {
      if (node.key === key) return topKey;
      if (node.children !== undefined) {
        const found = walk(node.children, topKey);
        if (found !== undefined) return found;
      }
    }
    return undefined;
  };
  for (const node of options) {
    if (node.key === key) return node.key;
    if (node.children !== undefined) {
      const found = walk(node.children, node.key);
      if (found !== undefined) return found;
    }
  }
  return null;
}

/** Direct children of `key` at any depth; empty array for leaves / misses. */
export function menuChildrenOf(options: readonly SnMenuOption[], key: string | number | null): SnMenuOption[] {
  if (key === null) return [];
  const walk = (nodes: readonly SnMenuOption[]): SnMenuOption[] | undefined => {
    for (const node of nodes) {
      if (node.key === key) return node.children ?? [];
      if (node.children !== undefined) {
        const found = walk(node.children);
        if (found !== undefined) return found;
      }
    }
    return undefined;
  };
  return walk(options) ?? [];
}

/** Ancestor chain (inclusive) from a top-level node down to `key`; empty when
 * absent. Labels of this path are the layout's auto-breadcrumb fallback. */
export function menuPathTo(options: readonly SnMenuOption[], key: string | number | null): SnMenuOption[] {
  if (key === null) return [];
  const walk = (nodes: readonly SnMenuOption[]): SnMenuOption[] | undefined => {
    for (const node of nodes) {
      if (node.key === key) return [node];
      if (node.children !== undefined) {
        const sub = walk(node.children);
        if (sub !== undefined) return [node, ...sub];
      }
    }
    return undefined;
  };
  return walk(options) ?? [];
}

/** Top-level copies without `children` — the dual mode's icon rail uses these
 * so the flyout popover of SnMenu's collapsed mode never fights the second
 * menu column. */
export function stripMenuChildren(options: readonly SnMenuOption[]): SnMenuOption[] {
  return options.map((node) => {
    const stripped: SnMenuOption = { key: node.key, label: node.label };
    if (node.icon !== undefined) stripped.icon = node.icon;
    if (node.disabled !== undefined) stripped.disabled = node.disabled;
    return stripped;
  });
}
