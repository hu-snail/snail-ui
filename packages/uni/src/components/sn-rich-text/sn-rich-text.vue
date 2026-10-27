<script setup lang="ts">
/**
 * SnRichText (uni-end) — HTML content renderer (AUI-MP-DS-006).
 *
 * Reference library: wot-ui `wd-rich-text`
 *   (https://wot-ui.cn/component/rich-text.html)
 * Per AGENTS.md §112 the prop / event / slot / method surface mirrors
 * wd-rich-text 1:1. The component is Human-designated (§112.4a) because the
 * machine-readable spec (`.ai/reference/wot-ui-api-spec.json`, wot-ui v2.3.2)
 * predates it; anything new added here MUST also be added to that rule.
 *
 * ## Why a parser instead of `v-html` / a single `<rich-text :nodes>`
 *
 * `v-html` does not exist on mini-program / App targets, and the platform
 * `rich-text` element cannot report image sizes, intercept links or host
 * media controls. Parsing into a node tree and rendering it with real
 * elements is what makes `image-click`, `link-click`, `media-*` and the
 * anchor methods possible at all — see sn-rich-text-parser.ts.
 *
 * ## State ownership
 *
 * The root owns: the parsed tree, the image list used for preview, the media
 * controller registry and the anchor request token. Nodes own their own
 * load / error / playback state (§20 State Boundary: local UI state stays
 * local).
 *
 * ## Dispose (AGENTS.md §41)
 *
 * Audio contexts live in the node components and are destroyed on unmount.
 * Video contexts are stateless handles — no listener is attached here, so
 * nothing leaks when the content is replaced.
 *
 * Per Spec-02 v1.1 §3 (end: mp), uni-side component CSS uses only
 * `--sn-mp-*` aliases (rpx units).
 *
 * Not responsible for:
 *   - 富文本编辑 — 用业务侧编辑器，产出 HTML 后交给本组件展示
 *   - Markdown 渲染 — 先转 HTML
 */

import { computed, getCurrentInstance, onUnmounted, provide, reactive, ref, watch } from 'vue';
import { INLINE_TAGS, parseRichText, RichTextParseError } from './sn-rich-text-parser';
import SnRichTextNode from './sn-rich-text-node.vue';
import SnImagePreview from '../sn-image-preview/sn-image-preview.vue';
import { RICH_TEXT_CONTEXT_KEY } from './sn-rich-text-context';
import type { RichTextNodeContext } from './sn-rich-text-context';
import type {
  RichTextAnchorRect,
  RichTextErrorEvent,
  RichTextHeading,
  RichTextImageClickEvent,
  RichTextImageInfo,
  RichTextImageLoadEvent,
  RichTextLinkClickEvent,
  RichTextLoadEvent,
  RichTextMediaController,
  RichTextMediaEvent,
  RichTextMediaTimeUpdateEvent,
  RichTextNode,
  RichTextParseResult,
  RichTextScrollToAnchorOptions,
} from './sn-rich-text-types';

defineOptions({ name: 'SnRichText' });

const props = withDefaults(
  defineProps<{
    /** HTML content to render. */
    content?: string;
    /** Placeholder image shown while a content image loads. */
    loadingImage?: string;
    /** Placeholder image shown after a content image fails. */
    errorImage?: string;
    /** Build the heading outline and enable anchor targeting. */
    enableAnchor?: boolean;
    /** Allow text selection where the platform supports it. */
    selectable?: boolean;
    /** Preview a standalone image on tap (built-in WeChat-style viewer). */
    previewImage?: boolean;
    /** Let the platform lazy-load content images. */
    lazyLoad?: boolean;
    /** Absolute HTTP(S) base used to resolve relative resource addresses. */
    baseUrl?: string;
    /** Accept ≤64KiB PNG/JPEG/GIF/WebP base64 images (never auto-previewed). */
    allowDataImage?: boolean;
    /** Per-tag default style overrides (`{ p: 'text-align:center' }`). */
    tagStyle?: Record<string, string>;
    /** Class-name to inline-style map for classes used inside the content. */
    classStyles?: Record<string, string>;
    /** Root custom class. */
    customClass?: string;
    /** Root custom inline style. */
    customStyle?: string;
  }>(),
  {
    content: '',
    loadingImage: '',
    errorImage: '',
    enableAnchor: false,
    selectable: false,
    previewImage: true,
    lazyLoad: false,
    baseUrl: '',
    allowDataImage: false,
    tagStyle: () => ({}),
    classStyles: () => ({}),
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** Parsing + node update finished (does not wait for media resources). */
  (e: 'load', payload: RichTextLoadEvent): void;
  /** Parse or resource error. */
  (e: 'error', payload: RichTextErrorEvent): void;
  /** A content image finished loading (once per image node). */
  (e: 'image-load', payload: RichTextImageLoadEvent): void;
  /** A standalone content image was tapped. */
  (e: 'image-click', payload: RichTextImageClickEvent): void;
  /** A link (or linked image) with a valid href was tapped. */
  (e: 'link-click', payload: RichTextLinkClickEvent): void;
  /** Media started playing. */
  (e: 'media-play', payload: RichTextMediaEvent): void;
  /** Media paused. */
  (e: 'media-pause', payload: RichTextMediaEvent): void;
  /** Media reached the end. */
  (e: 'media-ended', payload: RichTextMediaEvent): void;
  /** Media playback progress changed (seconds). */
  (e: 'media-timeupdate', payload: RichTextMediaTimeUpdateEvent): void;
}>();

defineSlots<{
  /** Rendered when the content is empty, filtered out, or failed to parse. */
  default?(): unknown;
}>();

/** Parsed tree; empty when the content is blank or failed to parse. */
const parsed = ref<RichTextParseResult>({ root: [], imageCount: 0, images: [] });

/** Media controllers registered by audio nodes (id → controller). */
const mediaControllers = new Map<string, RichTextMediaController>();

/** Token so a superseded anchor request can reject its promise. */
let anchorRequestToken = 0;

/** Guarded uni runtime access (absent in tests / non-uni hosts). */
interface SelectorQueryLike {
  in(component: unknown): SelectorQueryLike;
  select(selector: string): SelectorQueryLike;
  selectViewport(): SelectorQueryLike;
  boundingClientRect(callback: (rect: RichTextAnchorRect | null) => void): SelectorQueryLike;
  scrollOffset(callback: (offset: { scrollTop: number }) => void): SelectorQueryLike;
  exec(): void;
}

interface VideoContextLike {
  play(): void;
  pause(): void;
  seek(position: number): void;
}

interface UniHost {
  pageScrollTo?: (options: { scrollTop: number; duration: number }) => void;
  createSelectorQuery?: () => SelectorQueryLike;
  createVideoContext?: (id: string) => VideoContextLike;
}

function readUniHost(): UniHost | undefined {
  return (globalThis as { uni?: UniHost }).uni;
}

/** Component proxy, needed for `createSelectorQuery().in()`. */
const instance = getCurrentInstance();

/** Built-in image viewer — opened from content image taps. */
const previewRef = ref<InstanceType<typeof SnImagePreview> | null>(null);

/** Root class list. */
const rootClass = computed<string[]>(() => ['sn-rich-text', props.customClass]);

/** Root inline style (component variables can be overridden from outside). */
const rootStyle = computed<string>(() => props.customStyle);

/** True when there is nothing renderable — the default slot takes over. */
const isEmpty = computed<boolean>(() => parsed.value.root.length === 0);

/** Images that may join the native preview list. */
const previewableImages = computed<string[]>(() =>
  parsed.value.images.filter((image) => image.previewable).map((image) => image.previewSrc),
);

/** Look up display info for one image node. */
function imageInfoOf(node: RichTextNode): RichTextImageInfo | undefined {
  const index = node.imageIndex;
  if (index === undefined) return undefined;
  return parsed.value.images[index];
}

/** Re-parse whenever content or a parse-affecting option changes. */
watch(
  () => [props.content, props.baseUrl, props.allowDataImage] as const,
  () => {
    try {
      const result = parseRichText(props.content, {
        allowDataImage: props.allowDataImage,
        baseUrl: props.baseUrl,
      });
      parsed.value = result;
      emit('load', { imageCount: result.imageCount });
    } catch (error) {
      parsed.value = { root: [], imageCount: 0, images: [] };
      const message = error instanceof Error ? error.message : 'content parse failed';
      const code = error instanceof RichTextParseError ? error.code : 'PARSE_FAILED';
      emit('error', { source: 'parse', message, code });
    }
  },
  { immediate: true },
);

/** Link tap: report the href and let the host decide what to do. */
function onLinkTap(href: string): void {
  emit('link-click', { href });
}

/**
 * Image tap: a linked image reports `link-click` instead; otherwise the
 * image reports `image-click` and (when enabled) joins the native preview.
 */
function onImageTap(node: RichTextNode): void {
  const info = imageInfoOf(node);
  if (info === undefined) return;
  if (info.inLink) {
    emit('link-click', { href: node.linkHref ?? '' });
    return;
  }
  emit('image-click', { src: info.src, index: info.index });
  if (!props.previewImage || !info.previewable) return;
  const urls = previewableImages.value;
  if (urls.length === 0) return;
  // Open the built-in viewer at the tapped image (WeChat-style gestures).
  const startPosition = Math.max(0, urls.indexOf(info.previewSrc));
  previewRef.value?.open({ images: urls, startPosition });
}

/** Image loaded: forward the real pixel size to the host. */
function onImageLoad(node: RichTextNode, width: number, height: number): void {
  const info = imageInfoOf(node);
  if (info === undefined) return;
  emit('image-load', { src: info.src, index: info.index, width, height });
}

/** Image failed: a structured resource error (no retry loop, §85). */
function onImageError(node: RichTextNode): void {
  const info = imageInfoOf(node);
  if (info === undefined) return;
  emit('error', { source: 'image', src: info.src, index: info.index });
}

/** Media event fan-out (`play` / `pause` / `ended` / `timeupdate`). */
function onMediaEvent(node: RichTextNode, kind: string, detail: Record<string, unknown>): void {
  const media = node.media;
  if (media === undefined) return;
  if (kind === 'play') emit('media-play', { id: media.id, type: media.kind, src: media.src });
  else if (kind === 'pause')
    emit('media-pause', { id: media.id, type: media.kind, src: media.src });
  else if (kind === 'ended')
    emit('media-ended', { id: media.id, type: media.kind, src: media.src });
  else if (kind === 'timeupdate') {
    emit('media-timeupdate', {
      id: media.id,
      type: media.kind,
      src: media.src,
      currentTime: Number(detail.currentTime ?? 0),
      duration: Number(detail.duration ?? 0),
    });
  }
}

/** Media resource failure. */
function onMediaError(node: RichTextNode, message: string): void {
  const media = node.media;
  if (media === undefined) return;
  emit('error', { source: media.kind, src: media.src, message });
}

/** Audio nodes register their controller so the exposed methods can reach it. */
function registerMedia(controller: RichTextMediaController): void {
  mediaControllers.set(controller.id, controller);
}

function unregisterMedia(id: string): void {
  mediaControllers.delete(id);
}

/** Context handed to every node (props snapshot + handlers, kept in sync). */
const nodeContext = reactive<RichTextNodeContext>({
  selectable: props.selectable,
  enableAnchor: props.enableAnchor,
  tagStyle: props.tagStyle,
  classStyles: props.classStyles,
  loadingImage: props.loadingImage,
  errorImage: props.errorImage,
  lazyLoad: props.lazyLoad,
  onLinkTap,
  onImageTap,
  onImageLoad,
  onImageError,
  onMediaEvent,
  onMediaError,
  registerMedia,
  unregisterMedia,
});

provide(RICH_TEXT_CONTEXT_KEY, nodeContext);

/** Mirror prop changes into the provided context (nodes read it directly). */
watch(
  () => [
    props.selectable,
    props.enableAnchor,
    props.tagStyle,
    props.classStyles,
    props.loadingImage,
    props.errorImage,
    props.lazyLoad,
  ],
  () => {
    nodeContext.selectable = props.selectable;
    nodeContext.enableAnchor = props.enableAnchor;
    nodeContext.tagStyle = props.tagStyle;
    nodeContext.classStyles = props.classStyles;
    nodeContext.loadingImage = props.loadingImage;
    nodeContext.errorImage = props.errorImage;
    nodeContext.lazyLoad = props.lazyLoad;
  },
);

/** Text content of one subtree (used for heading labels and getText). */
function nodeText(node: RichTextNode): string {
  if (node.tag === 'text') return node.text ?? '';
  if (node.tag === 'br') return '\n';
  let out = '';
  for (const child of node.children) out += nodeText(child);
  return out;
}

/** Flatten the tree to plain text (paragraphs / breaks / alt text survive). */
function getText(): string {
  const parts: string[] = [];
  const walk = (nodes: RichTextNode[]): void => {
    for (const node of nodes) {
      if (node.tag === 'img') {
        const alt = node.attrs.alt ?? '';
        if (alt !== '') parts.push(alt);
        continue;
      }
      if (node.tag === 'video' || node.tag === 'audio') continue;
      const inline = INLINE_TAGS.has(node.tag);
      if (!inline && parts.length > 0) parts.push('\n');
      if (node.tag === 'text' || node.tag === 'br') parts.push(nodeText(node));
      else walk(node.children);
      if (!inline) parts.push('\n');
    }
  };
  walk(parsed.value.root);
  return parts
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Heading outline (empty unless `enable-anchor` is on). */
function getHeadings(): RichTextHeading[] {
  if (!props.enableAnchor) return [];
  const out: RichTextHeading[] = [];
  const walk = (nodes: RichTextNode[]): void => {
    for (const node of nodes) {
      const level = /^h([1-6])$/.exec(node.tag);
      if (level !== null && node.anchorId !== undefined) {
        out.push({ id: node.anchorId, level: Number(level[1]), text: nodeText(node).trim() });
      }
      walk(node.children);
    }
  };
  walk(parsed.value.root);
  return out;
}

/** True when the id resolves to a rendered anchor target. */
function hasAnchor(id: string): boolean {
  let found = false;
  const walk = (nodes: RichTextNode[]): void => {
    for (const node of nodes) {
      if (found) return;
      if (node.anchorId === id) {
        found = true;
        return;
      }
      walk(node.children);
    }
  };
  walk(parsed.value.root);
  return found;
}

/** Resolve the selector query rooted at this component (when supported). */
function createQuery(): SelectorQueryLike | undefined {
  const host = readUniHost();
  if (host?.createSelectorQuery === undefined) return undefined;
  const query = host.createSelectorQuery();
  if (instance !== null) return query.in(instance.proxy);
  return query;
}

/** Measure one anchor target; rejects when unknown or not rendered. */
function getAnchorRect(id: string): Promise<RichTextAnchorRect> {
  return new Promise<RichTextAnchorRect>((resolve, reject) => {
    if (!hasAnchor(id)) {
      reject(new Error(`anchor not found: ${id}`));
      return;
    }
    const query = createQuery();
    if (query === undefined) {
      reject(new Error('selector query is unavailable on this platform'));
      return;
    }
    query
      .select(`#sn-rt-a-${id}`)
      .boundingClientRect((rect) => {
        if (rect === null) {
          reject(new Error(`anchor is not rendered: ${id}`));
          return;
        }
        resolve(rect);
      })
      .exec();
  });
}

/** Measure target offset plus the current page scroll offset. */
function measureAnchor(id: string): Promise<{ top: number; scrollTop: number }> {
  return new Promise((resolve, reject) => {
    const query = createQuery();
    if (query === undefined) {
      reject(new Error('selector query is unavailable on this platform'));
      return;
    }
    query.select(`#sn-rt-a-${id}`).boundingClientRect((rect) => {
      if (rect === null) {
        reject(new Error(`anchor is not rendered: ${id}`));
        return;
      }
      const scrollQuery = createQuery();
      if (scrollQuery === undefined) {
        resolve({ top: rect.top, scrollTop: 0 });
        return;
      }
      scrollQuery
        .selectViewport()
        .scrollOffset((scroll) => {
          resolve({ top: rect.top, scrollTop: scroll.scrollTop });
        })
        .exec();
    });
    query.exec();
  });
}

/** Page-scroll to an anchor, with one layout-correction pass afterwards. */
async function scrollToAnchor(id: string, options?: RichTextScrollToAnchorOptions): Promise<void> {
  const offset = options?.offset ?? 0;
  const duration = options?.duration ?? 300;
  anchorRequestToken += 1;
  const token = anchorRequestToken;

  if (!hasAnchor(id)) throw new Error(`anchor not found: ${id}`);
  const first = await measureAnchor(id);
  if (token !== anchorRequestToken) throw new Error('anchor request superseded');
  const host = readUniHost();
  if (host?.pageScrollTo === undefined)
    throw new Error('page scroll is unavailable on this platform');
  const target = Math.max(0, first.scrollTop + first.top - offset);
  host.pageScrollTo({ scrollTop: target, duration });
  if (duration <= 0) return;

  await new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
  if (token !== anchorRequestToken) throw new Error('anchor request superseded');
  const corrected = await measureAnchor(id);
  if (token !== anchorRequestToken) throw new Error('anchor request superseded');
  const correctedTarget = Math.max(0, corrected.scrollTop + corrected.top - offset);
  if (Math.abs(correctedTarget - target) > 1) {
    host.pageScrollTo({ scrollTop: correctedTarget, duration: 0 });
  }
}

/** True when a media id is addressable and present in the content. */
function hasMedia(id: string): boolean {
  if (id === '') return false;
  if (mediaControllers.has(id)) return true;
  let found = false;
  const walk = (nodes: RichTextNode[]): void => {
    for (const node of nodes) {
      if (found) return;
      if (node.media !== undefined && node.media.id === id) {
        found = true;
        return;
      }
      walk(node.children);
    }
  };
  walk(parsed.value.root);
  return found;
}

/** Validate a seek target per the reference: finite and non-negative. */
function isValidSeek(seconds: number): boolean {
  return Number.isFinite(seconds) && seconds >= 0;
}

/** Send play to one media; true means the command was dispatched. */
function playMedia(id: string): boolean {
  if (!hasMedia(id)) return false;
  const controller = mediaControllers.get(id);
  if (controller !== undefined) return controller.play();
  const host = readUniHost();
  if (host?.createVideoContext === undefined) return false;
  host.createVideoContext(`sn-rt-video-${id}`).play();
  return true;
}

/** Pause one media (or every media when the id is omitted). */
function pauseMedia(id?: string): boolean {
  if (id !== undefined && id !== '') {
    if (!hasMedia(id)) return false;
    const controller = mediaControllers.get(id);
    if (controller !== undefined) return controller.pause();
    const host = readUniHost();
    if (host?.createVideoContext === undefined) return false;
    host.createVideoContext(`sn-rt-video-${id}`).pause();
    return true;
  }
  let dispatched = false;
  for (const controller of mediaControllers.values()) {
    if (controller.pause()) dispatched = true;
  }
  const host = readUniHost();
  const createVideoContext = host?.createVideoContext;
  if (createVideoContext !== undefined) {
    const walk = (nodes: RichTextNode[]): void => {
      for (const node of nodes) {
        if (node.media !== undefined && node.media.kind === 'video' && node.media.id !== '') {
          createVideoContext(`sn-rt-video-${node.media.id}`).pause();
          dispatched = true;
        }
        walk(node.children);
      }
    };
    walk(parsed.value.root);
  }
  return dispatched;
}

/** Move one media to `seconds` without starting playback. */
function seekMedia(id: string, seconds: number): boolean {
  if (!hasMedia(id) || !isValidSeek(seconds)) return false;
  const controller = mediaControllers.get(id);
  if (controller !== undefined) return controller.seek(seconds);
  const host = readUniHost();
  if (host?.createVideoContext === undefined) return false;
  host.createVideoContext(`sn-rt-video-${id}`).seek(seconds);
  return true;
}

/** Drop pending anchor requests on unmount (no dangling promise, §41). */
onUnmounted(() => {
  anchorRequestToken += 1;
  mediaControllers.clear();
});

defineExpose({
  getText,
  getHeadings,
  getAnchorRect,
  scrollToAnchor,
  playMedia,
  pauseMedia,
  seekMedia,
});
</script>

<template>
  <view
    class="sn-rich-text"
    :class="rootClass"
    :style="rootStyle === '' ? undefined : rootStyle"
    role="article"
  >
    <slot v-if="isEmpty" />
    <template v-else>
      <sn-rich-text-node v-for="(node, index) in parsed.root" :key="`root-${index}`" :node="node" />
    </template>
    <SnImagePreview ref="previewRef" />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units, AGENTS.md §112.5).
 *
 * The component-level variables below are the public style surface: they
 * default to token aliases, so dark mode follows `page.sn-theme-dark`
 * automatically, and consumers override them through `custom-style`. */

.sn-rich-text {
  --sn-mp-rich-text-color: var(--sn-mp-color-text-primary);
  --sn-mp-rich-text-font-size: var(--sn-mp-font-size-md);
  --sn-mp-rich-text-line-height: 1.7;
  --sn-mp-rich-text-link-color: var(--sn-mp-color-action-primary);
  --sn-mp-rich-text-video-height: 422rpx;
  --sn-mp-rich-text-image-state-min-height: 96rpx;
  --sn-mp-rich-text-image-state-color: var(--sn-mp-color-text-tertiary);
  --sn-mp-rich-text-image-state-bg: var(--sn-mp-color-background-soft);
  display: flex;
  flex-direction: column;
  color: var(--sn-mp-rich-text-color);
  font-size: var(--sn-mp-rich-text-font-size);
  line-height: var(--sn-mp-rich-text-line-height);
  word-break: break-word;
}
</style>
