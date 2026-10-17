/**
 * Shared types for SnUpload — internal to `src/upload/`.
 *
 * UploadFile state machine:
 *
 *   pending ──submit/customRequest──▶ uploading ──resolve──▶ done
 *                                        └──────reject─────▶ error
 *
 *   - pending → uploading: startUpload() (auto on add when defaultUpload,
 *     or manual via the exposed submit()).
 *   - Without a `customRequest` the component makes no network request:
 *     pending flips straight to done (local-state-only mode).
 *
 * Kept in a plain `.ts` module (same convention as sn-select-types.ts /
 * sn-checkbox-types.ts) so no shared wiring (install.ts / index.ts /
 * resolver.ts) is touched.
 */

/** Lifecycle status of one uploaded file entry. */
export type SnUploadStatus = 'pending' | 'uploading' | 'done' | 'error'

/** File list rendering style: plain rows vs rows with objectURL thumbnails. */
export type SnUploadListType = 'text' | 'image'

/** One file entry inside the component's list. */
export interface SnUploadFile {
  /** Unique id (module-level seed) — stable across re-renders. */
  id: string
  /** File name from the browser File. */
  name: string
  /** Size in bytes from the browser File. */
  size: number
  /** MIME type from the browser File ('' when unknown). */
  type: string
  /** The raw browser File (kept so a host upload driver can read it). */
  file: File
  /** Current state-machine status. */
  status: SnUploadStatus
  /**
   * objectURL created for `listType: 'image'` thumbnails. Created on accept,
   * revoked on remove and on unmount (AGENTS.md §41 dispose). Absent for
   * the `text` list type.
   *
   * `| undefined` per `exactOptionalPropertyTypes` — revoke clears it.
   */
  url?: string | undefined
}

/**
 * Custom upload driver. Resolve → the entry flips to `done`; reject →
 * `error`. Receives the live entry plus a snapshot of the current list.
 */
export type SnUploadCustomRequest = (
  file: SnUploadFile,
  fileList: SnUploadFile[],
) => Promise<void>

/**
 * Per-file gate. Return (or resolve) `true` to accept the file into the
 * list, `false` (or a throw) to keep it out entirely.
 */
export type SnUploadBeforeUpload = (
  file: SnUploadFile,
) => boolean | Promise<boolean>
