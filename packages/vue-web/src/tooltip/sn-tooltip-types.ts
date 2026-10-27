/**
 * Shared types for SnTooltip — internal to `src/tooltip/`.
 *
 * Placement follows Arco Design's 12-direction naming (`top` / `tl` / `tr`
 * / `bottom` / `bl` / `br` / `left` / `lt` / `lb` / `right` / `rt` /
 * `rb`); the legacy naive-ui values (`top-start` / …) normalize internally
 * as deprecated aliases so existing consumers keep working.
 */

/** Canonical Arco-style 12 directions + legacy naive-ui aliases. */
export type SnTooltipPlacement =
  // Arco style — canonical
  | 'top'
  | 'tl'
  | 'tr'
  | 'bottom'
  | 'bl'
  | 'br'
  | 'left'
  | 'lt'
  | 'lb'
  | 'right'
  | 'rt'
  | 'rb'
  // Legacy naive-ui style — deprecated aliases, normalized internally
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';

/** A placement resolved into its layout axis + cross-axis alignment. */
export interface ParsedTooltipPlacement {
  side: 'top' | 'right' | 'bottom' | 'left';
  align: 'start' | 'center' | 'end';
}

/**
 * Normalize any accepted placement value into (side, align). The Arco
 * two-letter codes map letter 1 → side, letter 2 → the bubble edge that
 * aligns with the trigger (`tl` = top + Left edges flush → start,
 * `lb` = left + Bottom edges flush → end). Deterministic + pure (§27).
 */
export function parseTooltipPlacement(placement: string): ParsedTooltipPlacement {
  switch (placement) {
    case 'tl':
      return { side: 'top', align: 'start' };
    case 'tr':
      return { side: 'top', align: 'end' };
    case 'bl':
      return { side: 'bottom', align: 'start' };
    case 'br':
      return { side: 'bottom', align: 'end' };
    case 'lt':
      return { side: 'left', align: 'start' };
    case 'lb':
      return { side: 'left', align: 'end' };
    case 'rt':
      return { side: 'right', align: 'start' };
    case 'rb':
      return { side: 'right', align: 'end' };
    default: {
      // Legacy `-start` / `-end` suffixes and the bare centre values.
      const [sideRaw, alignRaw] = placement.split('-');
      const side =
        sideRaw === 'top' || sideRaw === 'bottom' || sideRaw === 'left' || sideRaw === 'right'
          ? sideRaw
          : 'top';
      const align = alignRaw === 'start' || alignRaw === 'end' ? alignRaw : 'center';
      return { side, align };
    }
  }
}
