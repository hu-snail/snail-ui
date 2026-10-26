/**
 * sn-picker-view — shared types (uni-end).
 *
 * Lives beside the SFC because `<script setup>` cannot export values; the
 * picker wrapper (`sn-picker`) imports these so the pair shares one contract.
 */

/** Value a single picker option can carry. */
export type PickerValue = string | number;

/**
 * Raw option object. Keys are user-defined and resolved through
 * `valueKey` / `labelKey` / `childrenKey`, mirroring wot-ui's
 * `PickerOption` contract.
 */
export interface PickerOption {
  [key: string]: unknown;
}

/** One column: primitives or option objects (or a mix). */
export type PickerColumn = Array<PickerValue | PickerOption>;

/** Option after key resolution — what the roller renders. */
export interface NormalizedPickerOption {
  /** Resolved `valueKey` (falls back to the option itself for primitives). */
  value: PickerValue;
  /** Resolved `labelKey`, stringified for rendering. */
  label: string;
  /** Resolved `disabled` flag. */
  disabled: boolean;
  /** Original option (object or primitive) — echoed back on `change`. */
  raw: PickerOption | PickerValue;
}

/** Payload of the `change` event (mirrors wd-picker-view). */
export interface PickerViewChangePayload {
  /** Selected value per column. */
  selectedValues: PickerValue[];
  /** Selected raw option per column. */
  selectedOptions: Array<PickerOption | PickerValue>;
  /** Selected label per column. */
  selectedLabels: string[];
  /** Selected index per column. */
  selectedIndexes: number[];
  /** Column whose selection the user just changed. */
  columnIndex: number;
}
