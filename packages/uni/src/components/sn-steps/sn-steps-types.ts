/**
 * sn-steps contract — shared types for `sn-steps` / `sn-step`.
 *
 * The container owns `active` / `vertical` / `dot` / `space` / `alignCenter`;
 * steps read them through `provide`/`inject` and only fall back when their own
 * `status` is unset — wd-step's documented "status 默认由 active 推导" rule.
 */

import type { InjectionKey, Ref } from 'vue'

/** Step state. `wait` / `process` / `finished` / `error`. */
export type SnStepStatus = 'wait' | 'process' | 'finished' | 'error'

/** Context injected by `SnSteps` into child `SnStep` instances. */
export interface SnStepsContext {
  /** Index of the active step. */
  active: Ref<number>
  /** Vertical layout flag. */
  vertical: Ref<boolean>
  /** Dot-indicator flag. */
  dot: Ref<boolean>
  /** Custom spacing between steps (empty = auto). */
  space: Ref<string>
  /** Center the horizontal steps. */
  alignCenter: Ref<boolean>
  /** Register a step; returns its index in DOM order. */
  registerStep: (uid: number) => number
  /** Drop a step when it unmounts. */
  unregisterStep: (uid: number) => void
  /** Total registered steps (drives "is this the last one"). */
  stepCount: Ref<number>
}

export const SN_STEPS_KEY: InjectionKey<SnStepsContext> = Symbol('sn-steps')
