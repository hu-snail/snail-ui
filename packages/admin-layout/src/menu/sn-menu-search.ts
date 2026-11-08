/**
 * Menu search for @snui/admin-layout — pure functions over plain data.
 *
 * Backs the generic search component (`SnProSearch`) and is usable on its own:
 * the host can run the same match rule for its own palette / command bar and
 * stay in sync with the layout's search box.
 *
 * Semantics (kept deliberately small and deterministic, AGENTS.md §27):
 *   - a node is a hit when the trimmed, case-insensitive query is a substring
 *     of its own label **or** of any ancestor label on its trail — so typing a
 *     group's name ("系统") surfaces every navigable leaf under it;
 *   - by default only **leaves** (nodes without children) are returned, because
 *     in this package a group row is not navigable (`SnMenu` expands groups and
 *     never emits `select` for them). `includeGroups` opts back in;
 *   - disabled nodes are never returned (they cannot be activated) but their
 *     subtree is still walked, so a disabled group does not hide its children;
 *   - results are in depth-first document order (siblings keep their input
 *     order), capped by `maxResults`;
 *   - an empty / whitespace-only query returns `[]` — never "everything".
 *
 * Everything here is side-effect-free, so the rules are unit-testable without
 * mounting a component.
 */

import type { SnMenuOption } from '@snui/vue-web';

/** One search hit: the matched node plus its ancestor trail (for display). */
export interface SnProMenuHit {
  /** Matched node key — the value handed to `select` / `router.push`. */
  key: string | number;
  /** Matched node label. */
  label: string;
  /** Ancestor trail, inclusive of the matched node (`[系统管理, 用户管理]`). */
  path: SnMenuOption[];
}

/** Tuning knobs of {@link searchMenuOptions}. */
export interface MenuSearchOptions {
  /** Stop after this many hits. Default 10. `<= 0` yields `[]`. */
  maxResults?: number;
  /** Include group rows (nodes with children) as hits. Default false. */
  includeGroups?: boolean;
  /**
   * Extra predicate applied to a matched hit (receives the raw query, not the
   * normalized one). Runs before `maxResults` counting, so a filtered-out hit
   * never consumes a slot.
   */
  filter?: (query: string, hit: SnProMenuHit) => boolean;
}

const DEFAULT_MAX_RESULTS = 10;

/** Trimmed, lower-cased query — the only normalization applied. */
function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

/** Case-insensitive substring test against a node's label. */
function labelContains(node: SnMenuOption, needle: string): boolean {
  return typeof node.label === 'string' && node.label.toLowerCase().includes(needle);
}

/**
 * Search a menu tree.
 *
 * Deterministic: equal `(options, query, config)` always yields deep-equal
 * output, so the search box and any host-side palette agree by construction.
 */
export function searchMenuOptions(
  options: readonly SnMenuOption[],
  query: string,
  config: MenuSearchOptions = {},
): SnProMenuHit[] {
  const needle = normalizeQuery(query);
  const maxResults = config.maxResults ?? DEFAULT_MAX_RESULTS;
  if (needle === '' || maxResults <= 0) return [];

  const includeGroups = config.includeGroups ?? false;
  const filter = config.filter;
  const hits: SnProMenuHit[] = [];

  const visit = (nodes: readonly SnMenuOption[], trail: readonly SnMenuOption[]): void => {
    for (const node of nodes) {
      if (hits.length >= maxResults) return;
      const path = [...trail, node];
      const children = node.children ?? [];
      const isGroup = children.length > 0;

      // Disabled rows stay unsearchable, but a disabled *group* must not hide
      // its children — hence the check lives here and not around the descent.
      if ((includeGroups || !isGroup) && node.disabled !== true) {
        const matched = path.some((step) => labelContains(step, needle));
        if (matched) {
          const hit: SnProMenuHit = { key: node.key, label: node.label, path };
          if (filter === undefined || filter(query, hit)) {
            hits.push(hit);
            if (hits.length >= maxResults) return;
          }
        }
      }

      if (isGroup) visit(children, path);
    }
  };

  visit(options, []);
  return hits;
}
