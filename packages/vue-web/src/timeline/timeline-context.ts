/**
 * Shared injection contract for SnTimeline / SnTimelineItem
 * (AUI-WEB-DD-020).
 *
 * Mirrors the sn-steps-context.ts pattern: the timeline owns the shared
 * layout config (`direction` / `mode` / `labelPosition` / `size` /
 * `iconSize`) plus an item registry so items know their index (the
 * `alternate` mode alternates content sides by parity). Keeping this in a
 * plain `.ts` module avoids a circular import between the parent and the
 * child. `undefined` from `inject` means the item was rendered outside a
 * timeline — it then degrades with the default config instead of throwing.
 */
import type { ComputedRef, InjectionKey, Ref } from 'vue';

export type SnTimelineItemPlacement = 'left' | 'right';
export type SnTimelineSize = 'medium' | 'large';
export type SnTimelineItemType = 'default' | 'success' | 'info' | 'warning' | 'error';
export type SnTimelineLineType = 'default' | 'dashed' | 'dotted';
export type SnTimelineDirection = 'vertical' | 'horizontal';
/**
 * Container `mode`: which side of the axis the content sits on, or
 * `alternate` to flip sides per item. Vertical mode reads left / right;
 * horizontal mode reads top / bottom (off-axis values are normalized by
 * the container).
 */
export type SnTimelineMode = 'left' | 'right' | 'top' | 'bottom' | 'alternate';
/** `mode` after direction normalization (vertical: left/right/alternate; horizontal: top/bottom/alternate). */
export type SnTimelineResolvedMode = 'left' | 'right' | 'top' | 'bottom' | 'alternate';
/**
 * Where item labels render: across the axis from the content (`relative`,
 * default) or on the content side next to the rail (`same`).
 */
export type SnTimelineLabelPosition = 'same' | 'relative';
/** Node fill style: filled dot (`solid`) or ring (`hollow`). */
export type SnTimelineDotType = 'solid' | 'hollow';
/** Side of the axis the item content renders on. */
export type SnTimelineItemSide = 'left' | 'right' | 'top' | 'bottom';
/** Item `position` override inside `mode="alternate"`. */
export type SnTimelineItemPosition = 'left' | 'right' | 'top' | 'bottom';

export interface SnTimelineContext {
  /** Layout axis. */
  direction: Ref<SnTimelineDirection>;
  /** Resolved content side / alternation (per direction). */
  mode: Ref<SnTimelineResolvedMode>;
  /** Where item labels render. */
  labelPosition: Ref<SnTimelineLabelPosition>;
  /** Title scale of the items. */
  size: Ref<SnTimelineSize>;
  /** Node/icon edge length in px (parent `icon-size`). */
  iconSize: Ref<number | undefined>;
  /**
   * Register an item so it learns its index (`alternate` parity).
   * Registration happens at item setup; the container re-indexes
   * reactively when items mount / unmount.
   */
  registerItem: () => {
    id: number;
    index: ComputedRef<number>;
    unregister: () => void;
  };
}

export const SN_TIMELINE_INJECTION_KEY: InjectionKey<SnTimelineContext> = Symbol('sn-timeline');
