/**
 * Public types of the SnProNotice piece (@snui/admin-layout).
 *
 * Plain `.ts` module (repo convention) so hosts can type their notification
 * payload without importing the SFC.
 */

/** One notification row. */
export interface SnProNoticeItem {
  /** Stable identity — carried into the `select` payload. */
  key: string | number;
  /** Row title. */
  label: string;
  /** Secondary line (summary / body preview). */
  description?: string | undefined;
  /** Right-aligned timestamp text (the package does not format dates). */
  time?: string | undefined;
}
