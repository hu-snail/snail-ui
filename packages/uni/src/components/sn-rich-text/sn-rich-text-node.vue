<script setup lang="ts">
/**
 * SnRichTextNode (uni-end) — one parsed node renderer for `sn-rich-text`.
 *
 * Reference library: wot-ui `wd-rich-text`
 *   (https://wot-ui.cn/component/rich-text.html)
 *
 * Internal part, not part of the package barrel: `sn-rich-text` renders its
 * tree by recursing through this component, so every content node gets a real
 * element instead of an opaque `v-html` blob. That is what makes image
 * preview, link taps, media control and anchors possible at all.
 *
 * ## Why provide/inject instead of props
 *
 * The tree is arbitrarily deep; threading a dozen callbacks through every
 * level would bloat the prop surface and drift from the root's props. The
 * root provides one context object (props snapshot + handlers) and every node
 * injects it — depth-independent and stable (§14 internal API).
 *
 * ## uni-app / uni-app x constraints (AGENTS.md §116.2)
 *
 * - Class selectors only; no pseudo-classes/elements (press states would need
 *   `hover-class`, which rich text does not expose).
 * - Text always lives inside `<text>`; inline runs are grouped per parent so
 *   nested `<text>` carries emphasis instead of relying on inheritance.
 * - `@click` (never `@tap`); no `position: sticky`; no DOM access.
 */

import { computed, inject, onUnmounted, reactive, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import { INLINE_TAGS } from './sn-rich-text-parser';
import { normalizeSizeAttr, resolveNodeStyle } from './sn-rich-text-node-style';
import { RICH_TEXT_CONTEXT_KEY, RICH_TEXT_NOOP_CONTEXT } from './sn-rich-text-context';
import type { RichTextNodeContext } from './sn-rich-text-context';
import type { RichTextNode, RichTextTableMeta } from './sn-rich-text-types';

defineOptions({ name: 'SnRichTextNode' });


const props = defineProps<{
  /** Node to render (its children recurse back into this component). */
  node: RichTextNode;
}>();

const ctx: RichTextNodeContext = inject(RICH_TEXT_CONTEXT_KEY, RICH_TEXT_NOOP_CONTEXT);

/**
 * Newline character rendered for `br` nodes. Written through `fromCharCode` so
 * the SFC template never contains an escape sequence the parsers could
 * mis-tokenize (and so mini-program compilers keep the literal newline).
 */
const breakText = String.fromCharCode(10);

/** Image load state, local to this node instance (no shared registry). */
type ImageState = 'loading' | 'loaded' | 'error';
interface AudioState {
  playing: boolean;
}

/** Which inline tags render as styled text runs. */
const INLINE_CLASS: Record<string, string> = {
  strong: 'sn-rich-text--strong',
  b: 'sn-rich-text--strong',
  em: 'sn-rich-text--italic',
  i: 'sn-rich-text--italic',
  u: 'sn-rich-text--underline',
  s: 'sn-rich-text--strike',
  del: 'sn-rich-text--strike',
  strike: 'sn-rich-text--strike',
  ins: 'sn-rich-text--underline',
  code: 'sn-rich-text--code',
  small: 'sn-rich-text--small',
  mark: 'sn-rich-text--mark',
  sub: 'sn-rich-text--sub',
  sup: 'sn-rich-text--sup',
};

/** Block tags that get a dedicated class (default typography lives in CSS). */
const BLOCK_CLASS: Record<string, string> = {
  h1: 'sn-rich-text--h1',
  h2: 'sn-rich-text--h2',
  h3: 'sn-rich-text--h3',
  h4: 'sn-rich-text--h4',
  h5: 'sn-rich-text--h5',
  h6: 'sn-rich-text--h6',
  p: 'sn-rich-text--p',
  blockquote: 'sn-rich-text--quote',
  pre: 'sn-rich-text--pre',
  ul: 'sn-rich-text--list',
  ol: 'sn-rich-text--list',
  li: 'sn-rich-text--list-item',
  figure: 'sn-rich-text--figure',
  figcaption: 'sn-rich-text--caption',
  hr: 'sn-rich-text--hr',
};

/** One inline run inside a grouped `<text>` (text run or inline element). */
interface InlineRun {
  key: string;
  node: RichTextNode;
  text: string;
  classes: string[];
  style: string;
  isLink: boolean;
  isBreak: boolean;
}

/** Runs of one table cell (inline children only; images stay in the cell text). */
function cellRuns(node: RichTextNode): InlineRun[] {
  return node.children
    .filter((child) => isInline(child) && !isMedia(child))
    .map((child, index) => toRun(child, `cell-${index}`));
}

/** A block segment: either a grouped inline run set or a nested node. */
type Segment =
  | { kind: 'inline'; key: string; runs: InlineRun[] }
  | { kind: 'node'; key: string; node: RichTextNode };

const imageState = ref<ImageState>(props.node.attrs.src === '' ? 'error' : 'loading');
const audioState = reactive<AudioState>({ playing: false });

/** Media ids get a stable element id so `createVideoContext` can find them. */
const mediaElementId = computed<string>(() => {
  const media = props.node.media;
  if (media === undefined || media.id === '') return '';
  return `sn-rt-${media.kind}-${media.id}`;
});

/** Anchor element id (prefixed so content ids cannot collide with page ids). */
const anchorElementId = computed<string>(() => {
  const anchorId = props.node.anchorId;
  if (anchorId === undefined || !ctx.enableAnchor) return '';
  return `sn-rt-a-${anchorId}`;
});

/** True for inline nodes (rendered as `<text>` runs). */
function isInline(node: RichTextNode): boolean {
  return INLINE_TAGS.has(node.tag) || node.tag === 'text';
}

/** True for media nodes (own branches, never inline runs). */
function isMedia(node: RichTextNode): boolean {
  return node.tag === 'img' || node.tag === 'video' || node.tag === 'audio';
}

/** Class list for one inline run. */
function runClasses(node: RichTextNode): string[] {
  const classes: string[] = ['sn-rich-text__run'];
  if (node.tag === 'a') classes.push('sn-rich-text--link');
  const mapped = INLINE_CLASS[node.tag];
  if (mapped !== undefined) classes.push(mapped);
  return classes;
}

/** Resolve the inline style chain for one node. */
function nodeStyle(node: RichTextNode): string {
  return resolveNodeStyle(node, ctx.tagStyle, ctx.classStyles);
}

/** Build one inline run from a node (text content flattened). */
function toRun(node: RichTextNode, key: string): InlineRun {
  return {
    key,
    node,
    text: node.tag === 'text' ? (node.text ?? '') : flattenText(node),
    classes: runClasses(node),
    style: nodeStyle(node),
    isLink: node.tag === 'a' && (node.attrs.href ?? '') !== '',
    isBreak: node.tag === 'br',
  };
}

/** Flatten an inline subtree to its text (br becomes a newline). */
function flattenText(node: RichTextNode): string {
  if (node.tag === 'text') return node.text ?? '';
  if (node.tag === 'br') return '\n';
  let out = '';
  for (const child of node.children) out += flattenText(child);
  return out;
}

/**
 * Split children into render segments: consecutive inline nodes group into a
 * single `<text>` so they flow as one paragraph line; block/media nodes break
 * the group and render as their own element.
 */
const segments: ComputedRef<Segment[]> = computed(() => {
  const out: Segment[] = [];
  let runs: InlineRun[] = [];
  let runSeq = 0;
  const flush = (): void => {
    if (runs.length === 0) return;
    out.push({ kind: 'inline', key: `i-${runSeq}`, runs });
    runSeq += 1;
    runs = [];
  };
  props.node.children.forEach((child, index) => {
    if (isInline(child) && !isMedia(child)) {
      runs.push(toRun(child, `${index}`));
      return;
    }
    flush();
    out.push({ kind: 'node', key: `n-${index}`, node: child });
  });
  flush();
  return out;
});

/** Marker text for a list item (bullet or ordinal). */
const listMarker = computed<string>(() => {
  const list = props.node.list;
  if (list === undefined) return '';
  return list.ordered ? `${list.index}. ` : '· ';
});

/** Root class list for a block node. */
const blockClass = computed<string[]>(() => {
  const classes: string[] = ['sn-rich-text__block', `sn-rich-text__block--${props.node.tag}`];
  const mapped = BLOCK_CLASS[props.node.tag];
  if (mapped !== undefined) classes.push(mapped);
  return classes;
});

/** Root style for a block node (tag/class/inline chain + explicit sizing). */
const blockStyle = computed<string>(() => {
  const parts: string[] = [];
  const resolved = nodeStyle(props.node);
  if (resolved !== '') parts.push(resolved);
  const width = normalizeSizeAttr(props.node.attrs.width ?? '');
  if (width !== '' && props.node.tag === 'img') parts.push(`width:${width}`);
  return parts.join(';');
});

/** Image style: explicit height wins, otherwise width-fixed scaling. */
const imageStyle = computed<string>(() => {
  const parts: string[] = [];
  const resolved = nodeStyle(props.node);
  if (resolved !== '') parts.push(resolved);
  const width = normalizeSizeAttr(props.node.attrs.width ?? '');
  const height = normalizeSizeAttr(props.node.attrs.height ?? '');
  if (width !== '') parts.push(`width:${width}`);
  if (height !== '') parts.push(`height:${height}`);
  return parts.join(';');
});

/** `widthFix` keeps the aspect ratio when only a width is declared. */
const imageMode = computed<string>(() =>
  normalizeSizeAttr(props.node.attrs.height ?? '') === '' ? 'widthFix' : 'scaleToFill',
);

/** Alt text doubles as the failure placeholder (mirrors the reference). */
const imageAlt = computed<string>(() => props.node.attrs.alt ?? '');

/** Placeholder shown while loading / after a failure. */
const imagePlaceholder = computed<string>(() => {
  if (imageState.value === 'loading' && ctx.loadingImage !== '') return ctx.loadingImage;
  if (imageState.value === 'error' && ctx.errorImage !== '') return ctx.errorImage;
  return '';
});

/** Media src (validated by the parser). */
const mediaSrc = computed<string>(() => props.node.media?.src ?? '');

/** Audio label: the HTML title, else the address tail. */
const audioTitle = computed<string>(() => {
  const title = props.node.attrs.title ?? '';
  if (title !== '') return title;
  const src = mediaSrc.value;
  const cut = src.lastIndexOf('/');
  return cut === -1 ? src : src.slice(cut + 1);
});

/** Reset the image state when the address changes (content re-parsed). */
watch(
  () => props.node.attrs.src ?? '',
  (src) => {
    imageState.value = src === '' ? 'error' : 'loading';
  },
);

/** Reset audio state when the source changes. */
watch(
  () => mediaSrc.value,
  () => {
    audioState.playing = false;
    audioState.playing = false;
  },
);

/**
 * Inner audio context is created lazily on first play and destroyed with the
 * node (AGENTS.md §41/§82 — no dangling resources after unmount).
 */
interface InnerAudioLike {
  src: string;
  play(): void;
  pause(): void;
  seek(position: number): void;
  destroy(): void;
  onPlay(callback: () => void): void;
  onPause(callback: () => void): void;
  onEnded(callback: () => void): void;
  onError(callback: (error: { errMsg?: string }) => void): void;
  onTimeUpdate(callback: (result: { currentTime: number; duration: number }) => void): void;
}

interface AudioHost {
  createInnerAudioContext?: () => InnerAudioLike;
}

let audioContext: InnerAudioLike | undefined;

function readAudioHost(): AudioHost | undefined {
  return (globalThis as { uni?: AudioHost }).uni;
}

/** Lazily create + wire the audio context; undefined when unsupported. */
function ensureAudioContext(): InnerAudioLike | undefined {
  if (audioContext !== undefined) return audioContext;
  const host = readAudioHost();
  if (host?.createInnerAudioContext === undefined) return undefined;
  const created = host.createInnerAudioContext();
  created.src = mediaSrc.value;
  created.onPlay(() => {
    audioState.playing = true;
    ctx.onMediaEvent(props.node, 'play', {});
  });
  created.onPause(() => {
    audioState.playing = false;
    ctx.onMediaEvent(props.node, 'pause', {});
  });
  created.onEnded(() => {
    audioState.playing = false;
    ctx.onMediaEvent(props.node, 'ended', {});
  });
  created.onError((error) => {
    audioState.playing = false;
    ctx.onMediaError(props.node, error.errMsg ?? 'audio error');
  });
  created.onTimeUpdate((result) => {
    ctx.onMediaEvent(props.node, 'timeupdate', {
      currentTime: result.currentTime,
      duration: result.duration,
    });
  });
  audioContext = created;
  return audioContext;
}

/** Audio controller exposed to the root's media methods. */
function playAudio(): boolean {
  const context = ensureAudioContext();
  if (context === undefined) return false;
  context.play();
  return true;
}

function pauseAudio(): boolean {
  if (audioContext === undefined) return false;
  audioContext.pause();
  return true;
}

function seekAudio(seconds: number): boolean {
  const context = ensureAudioContext();
  if (context === undefined) return false;
  context.seek(seconds);
  return true;
}

/** Register the audio controller once the node mounts (root methods need it). */
if (props.node.tag === 'audio' && (props.node.media?.id ?? '') !== '') {
  const id = props.node.media?.id ?? '';
  ctx.registerMedia({ id, play: playAudio, pause: pauseAudio, seek: seekAudio });
  onUnmounted(() => {
    ctx.unregisterMedia(id);
    if (audioContext !== undefined) {
      audioContext.destroy();
      audioContext = undefined;
    }
  });
} else {
  onUnmounted(() => {
    if (audioContext !== undefined) {
      audioContext.destroy();
      audioContext = undefined;
    }
  });
}

/** Toggle audio playback from the in-content button. */
function onAudioToggle(): void {
  if (audioState.playing) pauseAudio();
  else playAudio();
}

/** Image finished loading: report size, then emit the load event. */
function onImageLoad(event: Event): void {
  imageState.value = 'loaded';
  const detail = (event as { detail?: { width?: number; height?: number } }).detail;
  ctx.onImageLoad(props.node, Number(detail?.width ?? 0), Number(detail?.height ?? 0));
}
/** Image failed: swap to the placeholder and report. */
function onImageError(): void {
  imageState.value = 'error';
  ctx.onImageError(props.node);
}

/** Tap on an image: links win over preview, per the reference semantics. */
function onImageTap(): void {
  if (imageState.value === 'error') return;
  ctx.onImageTap(props.node);
}

/** Tap on a link run. */
/** Inline run tap: links navigate, everything else is inert. */
function onRunTap(run: InlineRun): void {
  if (!run.isLink) return;
  const href = run.node.attrs.href ?? '';
  if (href !== '') ctx.onLinkTap(href);
}

/** Video events bubble to the root with normalized detail. */
function onVideoEvent(kind: string, event: Event): void {
  const detail = (event as { detail?: Record<string, unknown> }).detail ?? {};
  ctx.onMediaEvent(props.node, kind, detail);
}

/** Video failure. */
function onVideoError(event: Event): void {
  const detail = (event as { detail?: { errMsg?: string } }).detail;
  ctx.onMediaError(props.node, detail?.errMsg ?? 'video error');
}

/** Table layout: column widths resolved into flex bases. */
const tableMeta = computed<RichTextTableMeta | undefined>(() => props.node.table);

/** Cell style: explicit width wins, otherwise the span-weighted grow fills. */
function cellStyle(colSpan: number, width: string): string {
  const parts: string[] = [`flex-grow:${colSpan}`, 'flex-shrink:1'];
  if (width !== '') parts.push(`flex-basis:${width}`, `width:${width}`);
  return parts.join(';');
}
</script>

<template>
  <view class="sn-rich-text__node">
    <view
      v-if="node.tag === 'br'"
      class="sn-rich-text__break"
    >
      <text class="sn-rich-text__break-text">{{ breakText }}</text>
    </view>

    <view
      v-else-if="node.tag === 'hr'"
      class="sn-rich-text__hr"
      :class="blockClass"
    />

    <view
      v-else-if="node.tag === 'img'"
      class="sn-rich-text__image-wrap"
      :id="anchorElementId"
    >
      <image
        v-if="imageState !== 'error' && imagePlaceholder === ''"
        class="sn-rich-text__image"
        :src="node.attrs.src"
        :mode="imageMode"
        :style="imageStyle"
        :lazy-load="ctx.lazyLoad"
        @click="onImageTap"
        @load="onImageLoad"
        @error="onImageError"
      />
      <image
        v-else-if="imagePlaceholder !== ''"
        class="sn-rich-text__image"
        :src="imagePlaceholder"
        mode="widthFix"
        :style="imageStyle"
        @click="onImageTap"
      />
      <view
        v-else
        class="sn-rich-text__image-fallback"
        @click="onImageTap"
      >
        <text class="sn-rich-text__image-fallback-text">{{ imageAlt === '' ? '×' : imageAlt }}</text>
      </view>
    </view>

    <view
      v-else-if="node.tag === 'video'"
      class="sn-rich-text__video"
      :id="anchorElementId"
    >
      <video
        v-if="mediaSrc !== ''"
        class="sn-rich-text__video-player"
        :id="mediaElementId"
        :src="mediaSrc"
        :poster="node.attrs.poster === '' ? undefined : node.attrs.poster"
        :controls="true"
        :loop="node.attrs.loop === ''"
        @play="onVideoEvent('play', $event)"
        @pause="onVideoEvent('pause', $event)"
        @ended="onVideoEvent('ended', $event)"
        @timeupdate="onVideoEvent('timeupdate', $event)"
        @error="onVideoError"
      />
      <view v-else class="sn-rich-text__media-fallback">
        <text class="sn-rich-text__media-fallback-text">视频地址无效</text>
      </view>
    </view>

    <view
      v-else-if="node.tag === 'audio'"
      class="sn-rich-text__audio"
      :id="anchorElementId"
    >
      <view class="sn-rich-text__audio-button" @click="onAudioToggle">
        <text class="sn-rich-text__audio-button-text">{{ audioState.playing ? '暂停' : '播放' }}</text>
      </view>
      <text class="sn-rich-text__audio-title">{{ audioTitle }}</text>
    </view>

    <view
      v-else-if="node.tag === 'table' && tableMeta !== undefined"
      class="sn-rich-text__table"
      :id="anchorElementId"
    >
      <scroll-view class="sn-rich-text__table-scroll" :scroll-x="true">
        <view class="sn-rich-text__table-body">
          <view
            v-for="(row, rowIndex) in tableMeta.rows"
            :key="`row-${rowIndex}`"
            class="sn-rich-text__table-row"
          >
            <view
              v-for="(cell, cellIndex) in row"
              :key="`cell-${rowIndex}-${cellIndex}`"
              class="sn-rich-text__table-cell"
              :class="{ 'sn-rich-text__table-cell--header': cell.node.tag === 'th' }"
              :style="cellStyle(cell.colSpan, cell.width)"
            >
              <text
                v-for="(run, runIndex) in cellRuns(cell.node)"
                :key="`cell-run-${rowIndex}-${cellIndex}-${runIndex}`"
                :class="run.classes"
                :style="run.style === '' ? undefined : run.style"
                :selectable="ctx.selectable"
                @click="onRunTap(run)"
              >{{ run.text }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view
      v-else
      class="sn-rich-text__container"
      :class="blockClass"
      :id="anchorElementId"
      :style="blockStyle === '' ? undefined : blockStyle"
    >
      <view
        v-for="segment in segments"
        :key="segment.key"
        class="sn-rich-text__segment"
      >
        <text
          v-if="segment.kind === 'inline'"
          class="sn-rich-text__line"
          :selectable="ctx.selectable"
        >
          <text v-if="listMarker !== ''" class="sn-rich-text__marker">{{ listMarker }}</text>
          <text
            v-for="run in segment.runs"
            :key="run.key"
            :class="run.classes"
            :style="run.style === '' ? undefined : run.style"
            :selectable="ctx.selectable"
            @click="onRunTap(run)"
          >{{ run.isBreak ? breakText : run.text }}</text>
        </text>
        <sn-rich-text-node
          v-else
          :node="segment.node"
        />
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units, AGENTS.md §112.5). */

/* ── Block container ───────────────────────────────────────────────────── */

.sn-rich-text__container {
  display: flex;
  flex-direction: column;
}

.sn-rich-text__segment {
  display: flex;
  flex-direction: column;
}

.sn-rich-text__line {
  display: block;
  color: var(--sn-mp-rich-text-color);
  font-size: var(--sn-mp-rich-text-font-size);
  line-height: var(--sn-mp-rich-text-line-height);
  word-break: break-word;
}

/* ── Default tag typography (tag-style / class-styles / inline win) ────── */

.sn-rich-text--p {
  margin: var(--sn-mp-spacing-3) 0;
}

.sn-rich-text--h1 {
  margin: var(--sn-mp-spacing-4) 0 var(--sn-mp-spacing-3);
  font-size: var(--sn-mp-font-size-2xl);
  font-weight: var(--sn-mp-font-weight-bold);
  color: var(--sn-mp-rich-text-color);
}

.sn-rich-text--h2 {
  margin: var(--sn-mp-spacing-4) 0 var(--sn-mp-spacing-3);
  font-size: var(--sn-mp-font-size-xl);
  font-weight: var(--sn-mp-font-weight-bold);
  color: var(--sn-mp-rich-text-color);
}

.sn-rich-text--h3 {
  margin: var(--sn-mp-spacing-3) 0 var(--sn-mp-spacing-2);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-rich-text-color);
}

.sn-rich-text--h4 {
  margin: var(--sn-mp-spacing-3) 0 var(--sn-mp-spacing-2);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-rich-text-color);
}

.sn-rich-text--h5 {
  margin: var(--sn-mp-spacing-2) 0;
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-rich-text-color);
}

.sn-rich-text--h6 {
  margin: var(--sn-mp-spacing-2) 0;
  font-size: var(--sn-mp-font-size-xs);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-secondary);
}

.sn-rich-text--quote {
  margin: var(--sn-mp-spacing-3) 0;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  border-left: var(--sn-mp-spacing-1) solid var(--sn-mp-color-border-default);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
}

.sn-rich-text--pre {
  margin: var(--sn-mp-spacing-3) 0;
  padding: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
  font-family: 'Courier New', monospace;
}

.sn-rich-text--list {
  margin: var(--sn-mp-spacing-2) 0;
}

.sn-rich-text--list-item {
  flex-direction: row;
  align-items: flex-start;
}

.sn-rich-text--figure {
  margin: var(--sn-mp-spacing-3) 0;
}

.sn-rich-text--caption {
  margin: var(--sn-mp-spacing-2) 0;
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-rich-text__marker {
  color: var(--sn-mp-rich-text-color);
  font-size: inherit;
  line-height: inherit;
}

/* ── Inline runs ───────────────────────────────────────────────────────── */

.sn-rich-text__run {
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}

.sn-rich-text--strong {
  font-weight: var(--sn-mp-font-weight-bold);
}

.sn-rich-text--italic {
  font-style: italic;
}

.sn-rich-text--underline {
  text-decoration: underline;
}

.sn-rich-text--strike {
  text-decoration: line-through;
}

.sn-rich-text--code {
  padding: 0 var(--sn-mp-spacing-1);
  border-radius: var(--sn-mp-radius-xs);
  background-color: var(--sn-mp-color-background-soft);
  font-family: 'Courier New', monospace;
}

.sn-rich-text--small {
  font-size: var(--sn-mp-font-size-sm);
}

.sn-rich-text--mark {
  background-color: var(--sn-mp-color-feedback-warning-soft);
}

.sn-rich-text--sub {
  font-size: var(--sn-mp-font-size-xs);
  vertical-align: sub;
}

.sn-rich-text--sup {
  font-size: var(--sn-mp-font-size-xs);
  vertical-align: super;
}

.sn-rich-text--link {
  color: var(--sn-mp-rich-text-link-color);
  text-decoration: underline;
}

/* ── Images ────────────────────────────────────────────────────────────── */

.sn-rich-text__image-wrap {
  display: flex;
  flex-direction: column;
  margin: var(--sn-mp-spacing-3) 0;
}

.sn-rich-text__image {
  display: block;
  width: 100%;
}

.sn-rich-text__image-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--sn-mp-rich-text-image-state-min-height);
  padding: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-rich-text-image-state-bg);
}

.sn-rich-text__image-fallback-text {
  color: var(--sn-mp-rich-text-image-state-color);
  font-size: var(--sn-mp-font-size-sm);
}

/* ── Media ─────────────────────────────────────────────────────────────── */

.sn-rich-text__video {
  margin: var(--sn-mp-spacing-3) 0;
}

.sn-rich-text__video-player {
  width: 100%;
  height: var(--sn-mp-rich-text-video-height);
}

.sn-rich-text__audio {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  margin: var(--sn-mp-spacing-3) 0;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
}

.sn-rich-text__audio-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
}

.sn-rich-text__audio-button-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-rich-text__audio-title {
  flex: 1;
  color: var(--sn-mp-rich-text-color);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-rich-text__media-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-rich-text-image-state-bg);
}

.sn-rich-text__media-fallback-text {
  color: var(--sn-mp-rich-text-image-state-color);
  font-size: var(--sn-mp-font-size-sm);
}

/* ── Table ─────────────────────────────────────────────────────────────── */

.sn-rich-text__table {
  margin: var(--sn-mp-spacing-3) 0;
}

.sn-rich-text__table-scroll {
  width: 100%;
  white-space: nowrap;
}

.sn-rich-text__table-body {
  display: flex;
  flex-direction: column;
}

.sn-rich-text__table-row {
  display: flex;
  flex-direction: row;
}

.sn-rich-text__table-cell {
  display: flex;
  flex-direction: column;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-width: 1px;
  border-style: solid;
  border-color: var(--sn-mp-color-border-default);
  word-break: break-word;
}

.sn-rich-text__table-cell--header {
  background-color: var(--sn-mp-color-background-subtle);
  font-weight: var(--sn-mp-font-weight-semibold);
}

/* ── Misc ──────────────────────────────────────────────────────────────── */

.sn-rich-text__hr {
  height: 1px;
  margin: var(--sn-mp-spacing-4) 0;
  background-color: var(--sn-mp-color-border-subtle);
}

.sn-rich-text__break {
  display: flex;
}

.sn-rich-text__break-text {
  font-size: inherit;
  line-height: inherit;
}
</style>

