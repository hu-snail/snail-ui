/**
 * Shared types for SnSegment (AUI-WEB-SEGMENT-001).
 *
 * Mirrors the heroui `Segment` API (https://heroui.pro/docs/react/components/segment)
 * flattened from its `Segment.Item` children composition into a data-driven
 * `options` prop — matching the `options` convention of SnCheckboxGroup /
 * SnRadioGroup and staying AI-Patch friendly.
 */
import type { Component } from 'vue';

/** Selected key type — string / number, like heroui `Key`. */
export type SnSegmentKey = string | number;

/** Visual size preset (heroui `size`). */
export type SnSegmentSize = 'sm' | 'md' | 'lg';

/** Visual variant (heroui `variant`). */
export type SnSegmentVariant = 'default' | 'ghost';

/** One selectable segment (heroui `Segment.Item` props). */
export interface SnSegmentOption {
  /** Unique stable key — the value emitted on selection. */
  value: SnSegmentKey;
  /** Item label. Omit for an icon-only item (theme-switcher style). */
  label?: string;
  /** Leading icon component (lucide-vue-next icons work directly). */
  icon?: Component;
  /** Disable this single item (heroui per-item `isDisabled`). */
  disabled?: boolean;
  /**
   * Accessible name for the item. Defaults to `label`; required for
   * icon-only items (no label) so screen readers announce something.
   */
  ariaLabel?: string;
}
