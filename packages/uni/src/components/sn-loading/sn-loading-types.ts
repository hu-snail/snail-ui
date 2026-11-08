/**
 * sn-loading shared types (uni-end, internal).
 *
 * Extracted so sibling components (e.g. sn-paging's refresher loading-type
 * prop) can reference the exact spinner contract without duplicating the
 * union (AGENTS.md §25).
 */

/** Spinner shape. Mirrors `wd-loading` `type`. */
export type LoadingType = 'circular' | 'spinner' | 'dots' | 'wave';

/** Layout direction of spinner + text. Mirrors `wd-loading` `direction`. */
export type LoadingDirection = 'vertical' | 'horizontal';
