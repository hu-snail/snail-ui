/**
 * Shared types for SnDragSort — internal to `src/drag-sort/`.
 *
 * **Explicit divergence from naive-ui** (AGENTS.md §112): naive-ui has no
 * drag-sortable list. The prop surface follows the near-universal sortable
 * convention (vuedraggable / dnd-kit / @dnd-kit-svelte): items in, reordered
 * array out via v-model, an optional grip handle, and per-item `disabled`.
 * Kept in a plain `.ts` module (same convention as sn-dropdown-types.ts)
 * so no shared wiring (install.ts / index.ts / resolver.ts) is touched.
 */

/** Stable identity of a sortable row (same contract as `options[].key`). */
export type SnDragSortKey = string | number;

/** Layout axis of the sortable list. */
export type SnDragSortDirection = 'vertical' | 'horizontal';

/**
 * Raw entry accepted by the `items` prop. `key` is required (stable v-for
 * anchor + reorder bookkeeping); every other field is consumer data that
 * flows through the scoped `item` slot untouched.
 */
export type SnDragSortItem = {
  /** Stable identifier — survives reorders unchanged. */
  key: SnDragSortKey;
  /**
   * A locked row: it cannot be dragged and cannot be displaced by a drag
   * (rows reorder around it, never through it).
   */
  disabled?: boolean | undefined;
} & Record<string, unknown>;

/** Payload of the `sort` event — the move that was committed. */
export interface SnDragSortEvent {
  /** Index the dragged row started from (in the pre-move order). */
  from: number;
  /** Index it landed on (in the post-move order). */
  to: number;
}

/**
 * Normalize the `items` prop into row views — deterministic, pure,
 * idempotent (AGENTS.md §27). The returned objects share identity with the
 * consumer's items (no cloning) so the scoped slot receives the originals.
 */
export function normalizeDragSortItems(
  items: readonly SnDragSortItem[],
): Array<{ item: SnDragSortItem; key: SnDragSortKey; disabled: boolean }> {
  return items.map((item) => ({
    item,
    key: item.key,
    disabled: item.disabled === true,
  }));
}
