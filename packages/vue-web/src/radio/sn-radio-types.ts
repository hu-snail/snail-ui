/**
 * Shared types + injection contract for SnRadio / SnRadioButton /
 * SnRadioGroup (AUI-WEB-RADIO-001).
 *
 * Mirrors naive-ui's radio injection contract — the group owns the
 * `modelValue` / `name` / `size` / `status` / `disabled` state and each
 * child radio reads it to derive its own checked / interactive state.
 * Keeping this in a plain `.ts` module avoids a circular import between
 * parent and child SFCs.
 */
import type { InjectionKey, Ref } from 'vue';

/** Radio value type — string / number / boolean, like naive-ui. */
export type SnRadioValue = string | number | boolean;

/** Visual size preset shared by radio + group. */
export type SnRadioSize = 'mini' | 'tiny' | 'small' | 'medium' | 'large';

/** Validation-driven visual status. */
export type SnRadioStatus = 'default' | 'error' | 'warning';

/** Option shape for the group's `options` prop (naive-ui parity). */
export interface SnRadioOption {
  label?: string;
  value?: SnRadioValue;
  disabled?: boolean;
  readonly?: boolean;
  size?: SnRadioSize;
  status?: SnRadioStatus;
}

export interface SnRadioGroupContext {
  /** Group's bound value — the child compares its `checkedValue` against it. */
  modelValue: Ref<SnRadioValue | null>;
  /** Shared native `name` so browser arrow-key navigation works. */
  name: Ref<string | undefined>;
  /** Group-level size, overridable per radio. */
  size: Ref<SnRadioSize>;
  /** Group-level status, overridable per radio. */
  status: Ref<SnRadioStatus>;
  /** Group-level disabled, OR-ed with the child's own `disabled`. */
  disabled: Ref<boolean>;
  /** Bubble a radio activation up to the group's `update:modelValue` emit. */
  onChange: (value: SnRadioValue) => void;
}

export const snRadioGroupInjectionKey: InjectionKey<SnRadioGroupContext> = Symbol('sn-radio-group');
