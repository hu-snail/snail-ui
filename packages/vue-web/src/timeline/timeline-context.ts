/**
 * Shared injection contract for SnTimeline / SnTimelineItem
 * (AUI-WEB-DD-020).
 *
 * Mirrors the sn-steps-context.ts pattern: the timeline owns the shared
 * layout config (`horizontal` / `itemPlacement` / `size` / `iconSize`)
 * and each item reads it to position its rail. Keeping this in a plain
 * `.ts` module avoids a circular import between the parent and the child.
 * `undefined` from `inject` means the item was rendered outside a
 * timeline — it then degrades with the default config instead of
 * throwing.
 */
import type { InjectionKey, Ref } from 'vue'

export type SnTimelineItemPlacement = 'left' | 'right'
export type SnTimelineSize = 'medium' | 'large'
export type SnTimelineItemType =
  | 'default'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
export type SnTimelineLineType = 'default' | 'dashed'

export interface SnTimelineContext {
  /** Lay items out horizontally. */
  horizontal: Ref<boolean>
  /** Which side the rail sits on (vertical mode only). */
  itemPlacement: Ref<SnTimelineItemPlacement>
  /** Title scale of the items. */
  size: Ref<SnTimelineSize>
  /** Node/icon edge length in px (parent `icon-size`). */
  iconSize: Ref<number | undefined>
}

export const SN_TIMELINE_INJECTION_KEY: InjectionKey<SnTimelineContext> =
  Symbol('sn-timeline')
