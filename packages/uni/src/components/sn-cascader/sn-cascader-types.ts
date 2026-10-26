/**
 * sn-cascader — shared types (uni-end).
 */

/** One cascader node. Keys are resolved through the `*-key` props. */
export interface CascaderOption {
  [key: string]: unknown;
}

/** Value a cascader node can carry. */
export type CascaderValue = string | number;

/** Payload handed to `beforeConfirm`. */
export interface CascaderConfirmPayload {
  /** Leaf value (static mode) or the whole path (lazy mode). */
  value: CascaderValue | CascaderValue[];
  /** Selected node per level. */
  selectedOptions: CascaderOption[];
}

/**
 * Lazy-load hook. Call `resolve` with the children of `option` once they
 * arrive; the component then re-renders the next tab.
 */
export type CascaderLazyLoad = (
  option: CascaderOption,
  tabIndex: number,
  resolve: (children: CascaderOption[]) => void,
) => void;
