/**
 * sn-tour contract — step shape + placement / missing-strategy enums.
 *
 * Lives outside the SFC because `<script setup>` cannot host an `export`.
 * Mirrors wd-tour's documented `TourStep` / `TourPlacement` / `MissingStrategy`
 * exactly.
 */

/** Where the panel sits relative to the highlighted element. */
export type TourPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right'

/** What to do when a step's target selector resolves to nothing. */
export type TourMissingStrategy = 'skip' | 'stop' | 'hide'

/** One guided step. */
export interface TourStep {
  /** Selector of the element to highlight (`#id` / `.class`). */
  element?: string
  /** Step copy. Rendered as rich text. */
  content?: string
  /** Per-step override of the highlight padding. */
  padding?: number
  /** Per-step override of the panel offset. */
  offset?: number
  /** Force a placement instead of letting the panel auto-pick one. */
  placement?: TourPlacement
}

/** Payload shared by the `prev` / `next` events. */
export interface TourNavPayload {
  /** Step index the navigation started from. */
  prevCurrent: number
  /** Step index after the navigation. */
  current: number
  /** Total step count. */
  total: number
  /** True when the tour is at the first step (the "in top" state). */
  isElementInTop: boolean
}
