/**
 * sn-fab type contracts (pure ts module).
 *
 * Types live outside the SFC so the uni-x pipeline (ADR-0004) can ship a
 * deterministic import target on uni-app x — same pattern as sn-icon-types.
 */

import type { IconData } from '../sn-icon/sn-icon-types';

/**
 * Fan-mode action item (additive, AUI-OPT-19 — wd-fab has no structured
 * action model; the default slot stays the line-mode contract).
 */
export interface SnFabAction {
  /** Icon: built-in registry name or an inline IconData object. */
  icon: string | IconData;
  /** Optional label — turns the item into an icon+text pill. */
  text?: string;
  /** Icon tint (CSS color; prefer `var(--sn-mp-color-*)` tokens). */
  color?: string;
  /** Disabled item: dimmed, taps blocked. */
  disabled?: boolean;
}

/** Per-edge gap. Mirrors `wd-fab` `gap`. */
export interface SnFabGap {
  /** Distance from the top edge. */
  top?: number;
  /** Distance from the right edge. */
  right?: number;
  /** Distance from the bottom edge. */
  bottom?: number;
  /** Distance from the left edge. */
  left?: number;
}
