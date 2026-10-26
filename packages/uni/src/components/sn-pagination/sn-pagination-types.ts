/**
 * sn-pagination contract — slot scope shared by the four pagination slots.
 *
 * Lives outside the SFC because `<script setup>` cannot host an `export`.
 * The shape mirrors wd-pagination's documented slot parameters exactly, so a
 * custom button receives the same data the built-in one uses.
 */

/** Scope handed to `prev` / `size` / `next` / `message`. */
export interface PaginationSlotScope {
  /** Current page (already clamped into range). */
  modelValue: number;
  /** Resolved page count (`total` + `pageSize` wins over `totalPage`). */
  totalPageNum: number;
  /** Total record count as passed in. */
  total: number;
  /** Page size as passed in. */
  pageSize: number;
}
