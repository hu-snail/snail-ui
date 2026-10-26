/**
 * Shared injection contract for SnSteps / SnStep (AUI-WEB-NAV-004).
 *
 * Mirrors naive-ui's `stepsInjectionKey` — the parent owns the flow state
 * (`current` / `status` / `size` / `vertical` / `contentPlacement`) and each
 * child reads it to derive its own status. Keeping this in a plain `.ts`
 * module (rather than inside SnSteps.vue) avoids a circular import between
 * the parent and the child.
 */
import type { InjectionKey, Ref } from 'vue';

export interface SnStepsContext {
  /** Active step index (1-based). */
  current: Ref<number | undefined>;
  /** Parent-level status for the current step. */
  status: Ref<'process' | 'finish' | 'error' | 'wait'>;
  /** Indicator size. */
  size: Ref<'small' | 'medium'>;
  /** Vertical layout flag. */
  vertical: Ref<boolean>;
  /** Title placement for the horizontal layout. */
  contentPlacement: Ref<'right' | 'bottom'>;
  /** Bubble a step click up to the parent's `update:current` emit. */
  onStepClick: (index: number) => void;
  /** Claim the next 1-based ordinal for a freshly mounted child step. */
  registerStep: () => number;
}

export const snStepsInjectionKey: InjectionKey<SnStepsContext> = Symbol('sn-steps');
