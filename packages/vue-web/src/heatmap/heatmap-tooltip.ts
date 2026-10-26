/**
 * SnHeatmap tooltip types + default content — internal to `src/heatmap/`.
 *
 * Mirrors the reference tooltip plumbing (naive-ui
 * `src/heatmap/src/Rect.tsx` + `interface.ts`): the `tooltip` prop accepts
 * `boolean | TooltipProps`; when truthy every rect is wrapped in an
 * uncontrolled hover tooltip, the default content is the date + value, and
 * the `tooltip` slot receives the cell's `DayRect`. `loading` cells skip
 * the tooltip entirely (reference `Rect.tsx` renders the bare trigger).
 *
 * The config below is the `TooltipProps` subset the reference actually
 * forwards per cell (placement / showArrow / delay come from
 * `TooltipProps`; style / class map onto SnTooltip `content-style` /
 * `content-class`, i.e. the popover body).
 */

import type { CSSProperties } from 'vue';
import type { SnTooltipPlacement } from '../tooltip/SnTooltip.vue';

/** Per-cell tooltip options (a `TooltipProps` subset, all optional). */
export interface SnHeatmapTooltipConfig {
  /** Popover placement. Default `'top'` (like the reference hover tooltip). */
  placement?: SnTooltipPlacement;
  /** Show the popover arrow. Mirrors `TooltipProps.showArrow`; maps onto the SnTooltip arrow prop. Default `true`. */
  showArrow?: boolean;
  /** Open/close delay in ms (SnTooltip `delay`). Default `100`. */
  delay?: number | [number, number];
  /** Inline style on the popover body (SnTooltip `content-style`). */
  style?: CSSProperties;
  /** Class on the popover body (SnTooltip `content-class`). */
  class?: string;
}

/** Tooltip slot parameter: 1:1 with the reference `DayRect` (`interface.ts`). */
export interface SnHeatmapTooltipDay {
  /** Millisecond timestamp carried through from the data item. */
  timestamp: number;
  /** Raw activity count (gap-filled cells are `0`). */
  value: number | null | undefined;
  /** Resolved cell color: the custom palette entry or the level's CSS variable. */
  color: string;
  /** Day of week, `0 = Sunday` (the reference `date-fns` convention). */
  dayOfWeek: number;
  /** Weekday row, 0 = first row (relative to `firstDayOfWeek`). */
  rowIndex: number;
  /** Week column index. */
  colIndex: number;
}

/** Local `YYYY-MM-DD` for the default tooltip content (the reference uses `toLocaleDateString()`, the docs contract pins the ISO-style zh format). */
export function formatHeatmapDate(timestamp: number): string {
  const d = new Date(timestamp);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${date}`;
}

/**
 * Default tooltip text: `YYYY-MM-DD：value`, or the bare date when the
 * cell has no value — same information as the reference `Rect.tsx`
 * default (`\`${date} ${value}\``) in the docs' zh rendering.
 */
export function defaultTooltipContent(
  day: Pick<SnHeatmapTooltipDay, 'timestamp' | 'value'>,
): string {
  const date = formatHeatmapDate(day.timestamp);
  return day.value !== null && day.value !== undefined ? `${date}：${day.value}` : date;
}
