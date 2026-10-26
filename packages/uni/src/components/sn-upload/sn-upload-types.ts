/**
 * sn-upload — shared types (uni-end).
 */

/** Accepted file category. */
export type UploadFileType = 'image' | 'video' | 'media' | 'file' | 'all';

/** Where the picker may read from. */
export type UploadSourceType = 'album' | 'camera';

/** Image sizing for the picker. */
export type UploadSizeType = 'original' | 'compressed';

/** Camera to open by default. */
export type UploadCameraType = 'back' | 'front';

/** Upload lifecycle state of one file. */
export type UploadStatusType = 'pending' | 'loading' | 'success' | 'fail';

/**
 * One file in the list.
 *
 * `uid` is the only required field — everything else is filled in by the
 * picker / uploader as the file progresses.
 */
export interface UploadFileItem {
  /** Stable identity inside the list. */
  uid: number;
  /** Local path (mini-program temp path) or the resolved remote URL. */
  url?: string;
  /** Thumbnail path (video / media). */
  thumb?: string;
  /** File name. */
  name?: string;
  /** Lifecycle state. */
  status?: UploadStatusType;
  /** Byte size. */
  size?: number;
  /** Upload progress 0–100. */
  percent?: number;
  /** Backend response body. */
  response?: string | Record<string, unknown>;
}

/** Payload of the `change` event. */
export interface UploadChangeEvent {
  /** Full list after the change. */
  fileList: UploadFileItem[];
}

/** Payload of the `remove` event. */
export interface UploadRemoveEvent {
  /** Removed entry. */
  file: UploadFileItem;
  /** Remaining list. */
  fileList: UploadFileItem[];
}

/** Payload of the `oversize` event. */
export interface UploadOversizeEvent {
  /** Rejected file. */
  file: UploadFileItem;
  /** Configured byte ceiling. */
  maxSize: number;
}

/** Payload of the `progress` event. */
export interface UploadProgressEvent {
  /** File being uploaded. */
  file: UploadFileItem;
  /** Progress 0–100. */
  percent: number;
}

/** Payload of the `success` event. */
export interface UploadSuccessEvent {
  /** Uploaded file. */
  file: UploadFileItem;
  /** Backend response body. */
  response: string | Record<string, unknown>;
}

/** Payload of the `fail` event. */
export interface UploadErrorEvent {
  /** Failed file. */
  file: UploadFileItem;
  /** Error detail. */
  error: unknown;
}
