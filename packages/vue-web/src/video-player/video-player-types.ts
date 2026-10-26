/**
 * SnVideoPlayer — shared types (web end, AUI-additive component).
 *
 * Reference library: **NONE**. Neither naive-ui nor any mainstream web UI
 * library ships a video player, so per AGENTS.md §112 this component is a
 * registered AUI-additive capability (see AGENTS.md §112.3a): the API model
 * follows this repo's own conventions (controlled/uncontrolled pair,
 * `update:*` events, `--sn-web-*` tokens) with feature naming benchmarked
 * against mainstream video players (B 站 / 西瓜播放器).
 */

/** One selectable quality track for a progressive (MP4/WebM) ladder. */
export interface SnVideoQuality {
  /** Menu label, e.g. `'1080P'`. */
  label: string;
  /** Stable identity used for `v-model:quality`-style selection. */
  value: string | number;
  /** Media URL for this track. */
  src: string;
  /** Optional MIME hint forwarded to `<source type>`. */
  type?: string;
}

/** Danmaku (bullet comment) item. */
export interface SnVideoDanmu {
  /** Optional stable identity (used as the render key). */
  id?: string | number;
  /** Text content — rendered on the canvas as-is. */
  text: string;
  /** Appearance time in seconds from the start of the media. */
  time: number;
  /** Any CSS color. Defaults to white. */
  color?: string;
  /** Movement mode. Defaults to `'scroll'` (right → left). */
  type?: SnDanmuType;
  /** Marks a locally-sent danmu (highlighted by the renderer). */
  self?: boolean;
}

export type SnDanmuType = 'scroll' | 'top' | 'bottom';

/**
 * A quality entry reported by a source bridge (e.g. HLS levels parsed from
 * the manifest). Identity + label only — the bridge itself owns the media.
 */
export interface SnBridgeQuality {
  /** Opaque id passed back to `handle.selectQuality(id)`. */
  id: string | number;
  /** Menu label, e.g. `'1080P'`. */
  label: string;
}

/**
 * The currently active source handed to a bridge. `value` / `label` carry
 * the matching `SnVideoQuality` entry when the source came from the
 * `qualities` ladder, and are `undefined` for the plain `src` prop.
 */
export interface SnBridgeSource {
  src: string;
  type?: string;
  value?: string | number;
  label?: string;
}

export interface SnVideoSourceBridgeContext {
  /** The player's own `<video>` element. */
  video: HTMLVideoElement;
  /** The source the bridge is expected to load. */
  source: SnBridgeSource;
  /**
   * Report the quality ladder discovered from the stream (call whenever it
   * changes, e.g. after `MANIFEST_PARSED`). Replaces — not merges — the
   * previous list; an empty list clears the quality menu.
   */
  setQualities(list: SnBridgeQuality[]): void;
  /** Report whether the stream is live (overrides duration sniffing). */
  setIsLive(live: boolean): void;
  /** Surface a bridge-side failure to the player's error state. */
  reportError(err: unknown): void;
}

export interface SnVideoSourceBridgeHandle {
  /** Must release every resource (loader instance, listeners, …). */
  destroy(): void;
  /**
   * Switch the active level for bridge-managed qualities. Only called with
   * ids previously reported through `setQualities`.
   */
  selectQuality?(id: string | number): void;
}

/**
 * Plugin boundary for third-party streaming formats (HLS / DASH / FLV…).
 *
 * The player ships **no** streaming library: a bridge is a plain function
 * the host provides, typically closing over `hls.js` or `dash.js` imported
 * from the host app (see the docs guide for a copy-paste hls.js bridge and
 * installation instructions).
 *
 * Return `null`/`undefined` to decline the source — the player then falls
 * back to native playback (`video.src`), which covers Safari's built-in
 * HLS support.
 */
export type SnVideoSourceBridge = (
  ctx: SnVideoSourceBridgeContext,
) => SnVideoSourceBridgeHandle | null | void;

/** playbackRate presets offered in the settings menu. */
export const VIDEO_RATE_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
