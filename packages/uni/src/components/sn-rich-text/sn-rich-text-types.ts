/**
 * sn-rich-text types — public contract for the uni-end rich-text component.
 *
 * Reference library: wot-ui `wd-rich-text`
 *   (https://wot-ui.cn/component/rich-text.html)
 * Per AGENTS.md §112 the prop / event / method surface mirrors wd-rich-text
 * 1:1; the component was Human-designated after the machine spec
 * (.ai/reference/wot-ui-api-spec.json, wot-ui v2.3.2) was published, so the
 * mapping is registered in AGENTS.md §112.4a instead.
 *
 * The node model is the *parser output*: a filtered, sanitized tree — never
 * the raw HTML string. Everything downstream (renderer, getText, headings,
 * media registry) consumes these types only.
 */

/** Media element kinds embedded in the content. */
export type RichTextMediaKind = 'video' | 'audio';

/**
 * One sanitized node of the parsed content tree.
 *
 * `tag: 'text'` marks a decoded text run (`text` carries the characters,
 * `children` stays empty). Optional fields are assigned by the parser:
 * consumers must not mutate them.
 */
export interface RichTextNode {
  /** Lowercase tag name; `'text'` for text runs. Unknown tags are unwrapped. */
  tag: string;
  /** Sanitized attributes that survived the allowlist (may be empty). */
  attrs: Record<string, string>;
  /** Class tokens from the HTML `class` attribute (resolved via class-styles). */
  classes: string[];
  /** Sanitized inline style from the HTML `style` attribute ('' when none). */
  style: string;
  /** Child nodes; text runs have none. */
  children: RichTextNode[];
  /** Decoded characters for text runs. */
  text?: string;
  /** Document-order image index (0-based); present on `img` nodes only. */
  imageIndex?: number;
  /** Valid href of the nearest ancestor `a` ('' when the image is standalone). */
  linkHref?: string;
  /** Sanitized, unique anchor id; present on anchor target nodes only. */
  anchorId?: string;
  /** Media descriptor; present on `video` / `audio` nodes only. */
  media?: {
    kind: RichTextMediaKind;
    /** Addressable id ('' when the HTML id was missing, unsafe or duplicate). */
    id: string;
    /** Validated source ('' when filtered). */
    src: string;
    /** Validated poster URL ('' when absent or filtered). */
    poster: string;
  };
  /** List context; present on `li` nodes only. */
  list?: { ordered: boolean; index: number };
  /** Pre-computed table grid; present on `table` nodes only. */
  table?: RichTextTableMeta;
}

/** One cell of the pre-computed table grid (rowspan/colspan resolved). */
export interface RichTextTableCell {
  node: RichTextNode;
  /** Grid column the cell starts at (0-based). */
  col: number;
  /** Grid row the cell starts at (0-based). */
  row: number;
  /** Column span, clamped to 1–99. */
  colSpan: number;
  /** Row span, clamped to 1–99. */
  rowSpan: number;
  /** Explicit width from attributes ('' when auto). */
  width: string;
}

/** Pre-computed table layout consumed by the renderer. */
export interface RichTextTableMeta {
  /** Rows of cells; covered positions (rowspan/colspan) are omitted. */
  rows: RichTextTableCell[][];
  /** Total column count of the widest row. */
  columnCount: number;
  /** Column widths from col/colgroup/width attrs ('' = auto), index by column. */
  columnWidths: string[];
}

/** Display info for one content image, in document order. */
export interface RichTextImageInfo {
  /** Document-order index; equals the img node's `imageIndex`. */
  index: number;
  /** Display source ('' when the address was filtered). */
  src: string;
  /** Preview source — `original-src` when valid, else `src`. */
  previewSrc: string;
  /** Whether the image joins the native preview list. */
  previewable: boolean;
  /** Whether the image is wrapped by a valid link (tap → link-click only). */
  inLink: boolean;
}

/** Parse outcome handed to the renderer. */
export interface RichTextParseResult {
  /** Top-level nodes of the filtered tree (may be empty). */
  root: RichTextNode[];
  /** Number of image nodes in document order (includes filtered ones). */
  imageCount: number;
  /** Display info per image, index-aligned with `imageIndex`. */
  images: RichTextImageInfo[];
}

/** `load` event — parsing + node update finished (does not wait for media). */
export interface RichTextLoadEvent {
  imageCount: number;
}

/** `error` payload when HTML parsing or a limit fails. */
export interface RichTextParseErrorPayload {
  source: 'parse';
  message: string;
  code?: string;
}

/** `error` payload when a content image fails to load. */
export interface RichTextImageErrorPayload {
  source: 'image';
  src: string;
  index: number;
}

/** `error` payload when an embedded video / audio source fails. */
export interface RichTextMediaErrorPayload {
  source: RichTextMediaKind;
  src: string;
  message: string;
}

export type RichTextErrorEvent =
  | RichTextParseErrorPayload
  | RichTextImageErrorPayload
  | RichTextMediaErrorPayload;

/** `image-load` payload — a content image finished loading. */
export interface RichTextImageLoadEvent {
  src: string;
  index: number;
  width: number;
  height: number;
}

/** `image-click` payload — a standalone content image was tapped. */
export interface RichTextImageClickEvent {
  src: string;
  index: number;
}

/** `link-click` payload — a link (or linked image) with a valid href was tapped. */
export interface RichTextLinkClickEvent {
  href: string;
}

/** Common fields of `media-play` / `media-pause` / `media-ended`. */
export interface RichTextMediaEvent {
  id: string;
  type: RichTextMediaKind;
  src: string;
}

/** `media-timeupdate` payload — playback progress in seconds. */
export interface RichTextMediaTimeUpdateEvent {
  id: string;
  type: RichTextMediaKind;
  src: string;
  currentTime: number;
  duration: number;
}

/** One entry of the heading outline returned by `getHeadings()`. */
export interface RichTextHeading {
  id: string;
  level: number;
  text: string;
}

/** Rect returned by `getAnchorRect()`, in px (uni content-viewport coords). */
export interface RichTextAnchorRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Options of `scrollToAnchor()`. */
export interface RichTextScrollToAnchorOptions {
  /** Top gap reserved for the target, in px (default 0). */
  offset?: number;
  /** Scroll animation duration in ms (default 300). */
  duration?: number;
}

/** Controller one audio node registers so exposed methods can reach it. */
export interface RichTextMediaController {
  /** Addressable id ('' controllers are never registered). */
  id: string;
  play(): boolean;
  pause(): boolean;
  seek(seconds: number): boolean;
}

/** Methods exposed on the component instance (template ref). */
export interface RichTextInstance {
  /** Filtered plain text; paragraphs, breaks and image alt text survive. */
  getText(): string;
  /** Heading outline copy; empty when `enable-anchor` is off. */
  getHeadings(): RichTextHeading[];
  /** Rect of an anchor target; rejects when unknown, hidden or not rendered. */
  getAnchorRect(id: string): Promise<RichTextAnchorRect>;
  /** Page-scroll to an anchor; rejects on unknown id or superseded request. */
  scrollToAnchor(id: string, options?: RichTextScrollToAnchorOptions): Promise<void>;
  /** Send play to one media; true means the command was dispatched. */
  playMedia(id: string): boolean;
  /** Pause one media (or all when id omitted); true when any command dispatched. */
  pauseMedia(id?: string): boolean;
  /** Move one media to `seconds` without playing; true when dispatched. */
  seekMedia(id: string, seconds: number): boolean;
}
