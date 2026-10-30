/**
 * sn-sidebar scroll-spy support (additive — AUI-OPT-08, AGENTS.md §112.3a).
 *
 * Two halves, both free of Vue: the active-entry resolver that turns a scroll
 * position into the value of the section owning it, and the guarded `uni`
 * measurement adapter that maps content sections to side entries.
 *
 * ## Why the scroll position is a prop, not an internal listener
 *
 * A miniprogram page cannot read `window.scrollY`, and the scroll container
 * belongs to the host — the sidebar renders only the nav column. So the host
 * reports its position through `scrollTop` (a `scroll-view`'s `@scroll` or the
 * page's `onPageScroll`), the same contract `sn-backtop` uses, and this module
 * turns that number into an entry value. No listener is created, so there is
 * nothing to dispose on unmount (§41).
 *
 * ## Why offsets are measured relatively
 *
 * `uni.createSelectorQuery().selectAll()` returns viewport-relative rects, so
 * an absolute `top` depends on the current scroll offset. One call is a single
 * layout snapshot though: every section inside the same scroll content shifts
 * by the same amount, so the *differences* between rects are scroll-invariant.
 * Offsets are therefore stored relative to the highest measured section, which
 * makes a `scrollTop` counted from the scroll content origin directly
 * comparable.
 */

import type { SnSidebarValue } from './sn-sidebar-types';

/** One content section paired with the side entry that owns it. */
export interface SnSidebarAnchorRef {
  /** Value of the owning `sn-sidebar-item`. */
  value: SnSidebarValue;
  /** `id` of the content section the entry follows. */
  anchor: string;
}

/** One rect as returned by `selectAll(selector).fields({ id, rect })`. */
export interface SnSidebarMeasuredRect {
  /** Value of the section's `id` attribute. */
  id?: string | undefined;
  /** Viewport-relative top, in px. */
  top: number;
}

/** A section's top offset inside the scroll content, in px. */
export interface SnSidebarSectionOffset {
  /** Value of the owning `sn-sidebar-item`. */
  value: SnSidebarValue;
  /** Distance from the highest measured section, in px. */
  top: number;
}

/**
 * Pair measured rects with side entries and turn them into content-relative
 * offsets, ascending by position.
 *
 * Rects whose `id` matches no registered anchor are dropped, and each anchor is
 * used once — a duplicate `id` on the page never steals an entry from the first
 * match. Returns `[]` when nothing matches, which leaves the sidebar highlight
 * to user interaction alone.
 */
export function buildSectionOffsets(
  rects: readonly SnSidebarMeasuredRect[],
  refs: readonly SnSidebarAnchorRef[],
): SnSidebarSectionOffset[] {
  const valueByAnchor = new Map<string, SnSidebarValue>();
  for (const ref of refs) {
    if (ref.anchor !== '' && !valueByAnchor.has(ref.anchor)) {
      valueByAnchor.set(ref.anchor, ref.value);
    }
  }

  const matched: SnSidebarSectionOffset[] = [];
  const seen = new Set<string>();
  for (const rect of rects) {
    const id = rect.id;
    if (id === undefined || seen.has(id)) continue;
    const value = valueByAnchor.get(id);
    if (value === undefined) continue;
    seen.add(id);
    matched.push({ value, top: rect.top });
  }
  if (matched.length === 0) return [];

  const origin = Math.min(...matched.map((section) => section.top));
  return matched
    .map((section) => ({ value: section.value, top: section.top - origin }))
    .sort((left, right) => left.top - right.top);
}

/**
 * Resolve which entry owns `scrollTop`.
 *
 * `offsets` must be ascending by `top` (the order `buildSectionOffsets`
 * returns). The last section starting at or above `scrollTop + threshold` wins;
 * before the first boundary the first section is active and past the last one
 * the final section stays active, so the highlight never goes blank at either
 * end. A non-finite `threshold` is treated as `0`.
 */
export function resolveActiveSection(
  offsets: readonly SnSidebarSectionOffset[],
  scrollTop: number,
  threshold = 0,
): SnSidebarValue | undefined {
  const first = offsets[0];
  if (first === undefined) return undefined;

  const line = scrollTop + (Number.isFinite(threshold) ? threshold : 0);
  let active = first.value;
  for (const section of offsets) {
    if (section.top > line) break;
    active = section.value;
  }
  return active;
}

/** Options accepted by the query node's `fields()`. */
interface SidebarFieldsOptions {
  id: boolean;
  rect: boolean;
}

/** The slice of `uni.createSelectorQuery()` this module depends on. */
interface SidebarSelectorQuery {
  selectAll(selector: string): SidebarSelectorQuery;
  fields(
    options: SidebarFieldsOptions,
    callback: (rects: Array<SnSidebarMeasuredRect | null> | undefined) => void,
  ): SidebarSelectorQuery;
  exec(): void;
}

/** The `uni` global, narrowed to what a scroll-spy measurement needs. */
interface SidebarUniHost {
  createSelectorQuery?: (() => SidebarSelectorQuery) | undefined;
}

/** Keep only usable rects — hosts may return `null` for hidden nodes. */
function collectRects(
  rects: Array<SnSidebarMeasuredRect | null> | undefined,
): SnSidebarMeasuredRect[] {
  if (!Array.isArray(rects)) return [];
  return rects.filter(
    (rect): rect is SnSidebarMeasuredRect =>
      rect !== null && rect !== undefined && typeof rect.top === 'number',
  );
}

/**
 * Measure the content sections and hand their offsets to `onResult`.
 *
 * Reads the page-level selector query (the sections belong to the host page,
 * not to the sidebar), so `.in(component)` is deliberately not used. A host
 * without a usable selector query, or one that fails mid-call, is a no-op: the
 * sidebar keeps its previous offsets rather than taking the page down (§83).
 */
export function measureSectionOffsets(
  selector: string,
  refs: readonly SnSidebarAnchorRef[],
  onResult: (offsets: SnSidebarSectionOffset[]) => void,
): void {
  if (selector === '' || refs.length === 0) return;

  const host = (globalThis as { uni?: SidebarUniHost }).uni;
  if (typeof host?.createSelectorQuery !== 'function') return;

  try {
    host
      .createSelectorQuery()
      .selectAll(selector)
      .fields({ id: true, rect: true }, (rects) => {
        onResult(buildSectionOffsets(collectRects(rects), refs));
      })
      .exec();
  } catch {
    // A partially implemented selector query must not break the page.
  }
}
