/**
 * sn-steps contract — shared types for `sn-steps` / `sn-step`.
 *
 * The container owns `active` / `vertical` / `dot` / `space` / `alignCenter`;
 * steps read them through `provide`/`inject` and only fall back when their own
 * `status` is unset — wd-step's documented "status 默认由 active 推导" rule.
 *
 * Additive (AUI-OPT-09, AGENTS.md §112.3a):
 *   - the container also owns the connector line style (`connector`), so every
 *     step renders the same line type;
 *   - this module owns the step glyph size scale (`resolveSnStepIconSize`), so
 *     the custom icon, the status glyphs and the number share one tier.
 */

import type { InjectionKey, Ref } from 'vue';

/** Step state. `wait` / `process` / `finished` / `error`. */
export type SnStepStatus = 'wait' | 'process' | 'finished' | 'error';

/**
 * Connector line style between two steps.
 *
 * Additive (AUI-OPT-09): the line is a real element drawn with `border-style`
 * (see `sn-step.vue`) — dashed / dotted never need a pseudo-element, so
 * miniprogram / uvue stay on the supported side of AGENTS.md §116.
 */
export type SnStepConnector = 'solid' | 'dashed' | 'dotted';

/** Default glyph scale inside an indicator — the family icon tier. */
const SN_STEP_ICON_SIZE = 'var(--sn-mp-icon-size-medium)';

/** Named size tiers → `--sn-mp-icon-size-*` tokens (no light-mode fallback). */
const ICON_SIZE_TIERS: Readonly<Record<string, string>> = {
  tiny: 'var(--sn-mp-icon-size-tiny)',
  small: 'var(--sn-mp-icon-size-small)',
  medium: 'var(--sn-mp-icon-size-medium)',
  large: 'var(--sn-mp-icon-size-large)',
  xlarge: 'var(--sn-mp-icon-size-xlarge)',
};

/**
 * Resolve an `iconSize` prop to a CSS length.
 *
 * Numbers stay px; tier names map to their token; unknown strings pass through
 * unchanged (an explicit `32rpx` / `1.2em` still works).
 */
export function resolveSnStepIconSize(
  size: string | number | undefined,
  fallback: string = SN_STEP_ICON_SIZE,
): string | number {
  if (size === undefined) return fallback;
  if (typeof size === 'number') return size;
  return ICON_SIZE_TIERS[size] ?? size;
}

/** Context injected by `SnSteps` into child `SnStep` instances. */
export interface SnStepsContext {
  /** Index of the active step. */
  active: Ref<number>;
  /** Vertical layout flag. */
  vertical: Ref<boolean>;
  /** Dot-indicator flag. */
  dot: Ref<boolean>;
  /** Custom spacing between steps (empty = auto). */
  space: Ref<string>;
  /** Center the horizontal steps. */
  alignCenter: Ref<boolean>;
  /** Connector line style shared by every step (additive). */
  connector: Ref<SnStepConnector>;
  /** Register a step; returns its index in DOM order. */
  registerStep: (uid: number) => number;
  /** Drop a step when it unmounts. */
  unregisterStep: (uid: number) => void;
  /** Total registered steps (drives "is this the last one"). */
  stepCount: Ref<number>;
}

export const SN_STEPS_KEY: InjectionKey<SnStepsContext> = Symbol('sn-steps');
