/**
 * sn-rich-text node context — the provide/inject contract between the root
 * component and its recursive node renderer.
 *
 * Reference library: wot-ui `wd-rich-text`
 *   (https://wot-ui.cn/component/rich-text.html)
 *
 * Lives in its own module because a `<script setup>` block cannot carry ES
 * module exports: both the key and the interface are shared by two SFCs.
 */

import type { RichTextMediaController, RichTextNode } from './sn-rich-text-types';

/**
 * Context shared with every node; provided by `sn-rich-text`.
 * Handlers are no-ops when a node is mounted standalone (defensive default).
 */
export interface RichTextNodeContext {
  selectable: boolean;
  enableAnchor: boolean;
  tagStyle: Record<string, string>;
  classStyles: Record<string, string>;
  loadingImage: string;
  errorImage: string;
  lazyLoad: boolean;
  onLinkTap(href: string): void;
  onImageTap(node: RichTextNode): void;
  onImageLoad(node: RichTextNode, width: number, height: number): void;
  onImageError(node: RichTextNode): void;
  onMediaEvent(node: RichTextNode, kind: string, detail: Record<string, unknown>): void;
  onMediaError(node: RichTextNode, message: string): void;
  registerMedia(controller: RichTextMediaController): void;
  unregisterMedia(id: string): void;
}

/** Context key — a symbol keeps it private to this component pair. */
export const RICH_TEXT_CONTEXT_KEY = Symbol('sn-rich-text-context');

/** Safe default so a node never crashes when the root is missing. */
export const RICH_TEXT_NOOP_CONTEXT: RichTextNodeContext = {
  selectable: false,
  enableAnchor: false,
  tagStyle: {},
  classStyles: {},
  loadingImage: '',
  errorImage: '',
  lazyLoad: false,
  onLinkTap: () => undefined,
  onImageTap: () => undefined,
  onImageLoad: () => undefined,
  onImageError: () => undefined,
  onMediaEvent: () => undefined,
  onMediaError: () => undefined,
  registerMedia: () => undefined,
  unregisterMedia: () => undefined,
};
