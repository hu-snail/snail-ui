<script setup lang="ts">
/**
 * SnAvatar — web-end avatar (AUI-WEB-DS-001).
 *
 * Reference library: naive-ui `n-avatar`
 *   (https://www.naiveui.com/zh-CN/light/components/avatar)
 * Per AGENTS.md §112, props + semantics mirror n-avatar 1:1:
 *   size (number | 'small' | 'medium' | 'large') / src / color / objectFit /
 *   round / circle / onError.
 *
 * Documented divergences (not §112 violations):
 *   - `fallbackText` (text thumbnail) replaces `fallbackSrc`: when there is
 *     no image — missing `src` or a load error — the first available of
 *     default slot → `fallbackText` → `icon` → builtin person SVG renders.
 *   - `icon` resolves a SnIcon registry name; the `icon` slot replaces it.
 *   - `lazy` / `intersection-observer-options` are implemented on the same
 *     contract as SnImage (shared `_internal/lazy-visibility`): a plain
 *     `lazy` uses the native `loading="lazy"` attribute, and adding
 *     `intersection-observer-options` withholds the src until the avatar
 *     enters the viewport. While gated, the fallback content is rendered.
 *   - `imgProps` / `fallbackSrc` network options are still not implemented.
 *
 * ## Additive: presence status + corner badge (AUI 追加，n-avatar 没有此能力)
 *
 * Mirrors the uni-end `sn-avatar` additive contract (AGENTS.md §112.3a):
 *   - `status` paints an online / offline presence dot ('online' → success
 *     green, 'offline' → tertiary gray) with a surface-coloured separating
 *     ring; `statusPosition` moves it between the corners (default
 *     bottom-right). The dot is decorative (`aria-hidden`) — the state rides
 *     on the root `aria-label` so screen readers announce it.
 *   - `badgeIcon` paints a small round badge on a corner (default top-right,
 *     `badgePosition` overrides) holding a registered SnIcon glyph — e.g. a
 *     crown for a membership level. Badge defaults to the warning (gold)
 *     surface; also decorative.
 *   - When `color` is set, the fallback text / icon switches to the inverse
 *     text colour: coloured thumbnails stay readable instead of dark-on-dark.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnAvatar src="/a.png" />
 *   <SnAvatar fallback-text="张" size="large" circle />
 *   <SnAvatar icon="User" />
 */

import { computed, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import SnIcon from '../icon/SnIcon.vue';
import { useLocale } from '../locales/use-locale';
import { useLazyVisibility } from '../_internal/lazy-visibility';
import type { LazyVisibilityOptions } from '../_internal/lazy-visibility';

defineOptions({ name: 'SnAvatar' });

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

const props = withDefaults(
  defineProps<{
    /** Pixel size, or a named scale. Mirrors n-avatar `size`. */
    size?: number | 'small' | 'medium' | 'large';
    /** Image URL. */
    src?: string | undefined;
    /** Background color (any CSS color value). Mirrors n-avatar `color`. */
    color?: string | undefined;
    /** Image fit inside the box. Mirrors n-avatar `objectFit`. */
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    /** Pill-shaped corners. Mirrors n-avatar `round`. */
    round?: boolean;
    /** Circular. Mirrors n-avatar `circle`. */
    circle?: boolean;
    /** Text thumbnail shown when there is no image. */
    fallbackText?: string | undefined;
    /**
     * Truncation mode for `fallbackText` (additive):
     *   - 'full'     — render as-is (default);
     *   - 'surname'  — keep the first glyph（姓）;
     *   - 'last-two' — keep the last two glyphs（名字后两位）;
     *   - 'masked'   — keep the first glyph and mask the rest with `*`
     *                  (single-glyph names stay untouched).
     * Splitting is code-point based, so surrogate pairs stay intact.
     */
    textMode?: 'full' | 'surname' | 'last-two' | 'masked';
    /** SnIcon registry name for the placeholder glyph. */
    icon?: string | undefined;
    /**
     * Presence state painted as a corner dot (additive). `''` clears it.
     * Mirrors the uni-end `sn-avatar` `status` contract.
     */
    status?: 'online' | 'offline' | '';
    /** Corner for the presence dot (additive). Default bottom-right. */
    statusPosition?: 'top-right' | 'bottom-right';
    /**
     * SnIcon registry name painted as a round corner badge (additive) —
     * e.g. `Crown` for a membership level.
     */
    badgeIcon?: string | undefined;
    /** Corner for the badge (additive). Default top-right. */
    badgePosition?: 'top-right' | 'bottom-right';
    /** Load on viewport entry. Same contract as SnImage `lazy`. */
    lazy?: boolean;
    /** IntersectionObserver config for lazy loading (see SnImage). */
    intersectionObserverOptions?: LazyVisibilityOptions | undefined;
  }>(),
  {
    size: 'medium',
    src: undefined,
    color: undefined,
    objectFit: 'cover',
    round: false,
    circle: false,
    fallbackText: undefined,
    textMode: 'full',
    icon: undefined,
    status: '',
    statusPosition: 'bottom-right',
    badgeIcon: undefined,
    badgePosition: 'top-right',
    lazy: false,
    intersectionObserverOptions: undefined,
  },
);

const emit = defineEmits<{
  /** Image failed to load — also switches to the fallback content.
   * Mirrors n-avatar `onError`. */
  (e: 'error', event: Event): void;
}>();

defineSlots<{
  /** Custom avatar content — shown when there is no image. */
  default?(): unknown;
  /** Placeholder glyph — replaces `icon` / the builtin person SVG. */
  icon?(): unknown;
}>();

const hasLoadError = ref(false);

// A new src must clear the previous failure, or a retried URL stays hidden.
watch(
  () => props.src,
  () => {
    hasLoadError.value = false;
  },
);

function handleImageError(event: Event): void {
  hasLoadError.value = true;
  emit('error', event);
}

const hasImage = computed(() => props.src !== undefined && props.src !== '' && !hasLoadError.value);

const rootRef = ref<HTMLElement | null>(null);

// Shared lazy gate (`_internal/lazy-visibility`), same contract as SnImage:
// a plain `lazy` keeps the native loading="lazy" attribute, while adding
// `intersection-observer-options` withholds the src until the avatar scrolls
// into view. The fallback content is rendered while the gate is closed.
// The observer watches the always-mounted root box, never the <img> — that
// element only exists once the gate opens, so observing it would deadlock.
const { shouldLoad } = useLazyVisibility(
  rootRef,
  computed(() => props.intersectionObserverOptions),
  computed(() => props.lazy && props.intersectionObserverOptions !== undefined),
);

/** Native loading attribute — `lazy` only (observer mode is JS-gated). */
const loadingAttr = computed<'lazy' | 'eager'>(() =>
  props.lazy && !props.intersectionObserverOptions ? 'lazy' : 'eager',
);

/** The image is rendered only once its src is allowed to load. */
const showsImage = computed(() => hasImage.value && shouldLoad.value);

const rootStyle = computed<CSSProperties | undefined>(() => {
  if (props.color === undefined && typeof props.size !== 'number') return undefined;
  const style: CSSProperties = {};
  if (props.color !== undefined) style.background = props.color;
  if (typeof props.size === 'number') {
    style.width = `${props.size}px`;
    style.height = `${props.size}px`;
  }
  return style;
});

/* ─────────── Additive: presence status + corner badge ─────────── */

/** Whether a presence dot is painted (additive `status`). */
const hasStatus = computed<boolean>(() => props.status !== '');

/**
 * Spoken state for screen readers (AGENTS.md §52 — the dot itself is
 * decorative `aria-hidden`, so the state rides on the root label).
 */
const ariaLabel = computed<string | undefined>(() =>
  hasStatus.value ? locale.value.Avatar[props.status as 'online' | 'offline'] : undefined,
);

/** A coloured thumbnail (explicit `color`) speaks with inverse text. */
const colored = computed<boolean>(() => props.color !== undefined);

/* ─────────── Additive: fallbackText truncation mode ─────────── */

/**
 * Fallback text after `textMode` truncation. Splits by code point so emoji /
 * CJK extension-B surrogates are never cut in half.
 */
const displayText = computed<string>(() => {
  const text = props.fallbackText ?? '';
  if (props.textMode === 'full') return text;
  const glyphs = Array.from(text);
  if (glyphs.length === 0) return text;
  if (props.textMode === 'surname') return glyphs[0] ?? '';
  if (props.textMode === 'last-two') return glyphs.slice(-2).join('');
  // 'masked': keep the first glyph, one `*` per hidden glyph. A single-glyph
  // name has nothing to hide and stays readable.
  return (glyphs[0] ?? '') + '*'.repeat(glyphs.length - 1);
});
</script>

<template>
  <div
    ref="rootRef"
    data-snui-component="avatar"
    class="sn-avatar"
    :class="[
      typeof size === 'number' ? '' : `sn-avatar--${size}`,
      circle ? 'sn-avatar--circle' : '',
      round ? 'sn-avatar--round' : '',
      colored ? 'sn-avatar--colored' : '',
      hasStatus ? `sn-avatar--status-${status}` : '',
      hasStatus && statusPosition === 'top-right' ? 'sn-avatar--status-top' : '',
      badgeIcon !== undefined && badgePosition === 'bottom-right' ? 'sn-avatar--badge-bottom' : '',
    ]"
    :aria-label="ariaLabel"
    :style="rootStyle"
  >
    <img
      v-if="showsImage"
      class="sn-avatar__img"
      :src="src"
      :loading="loadingAttr"
      :style="{ objectFit }"
      @error="handleImageError"
    />
    <template v-else>
      <slot>
        <span v-if="fallbackText" class="sn-avatar__text">{{ displayText }}</span>
        <span v-else class="sn-avatar__icon" aria-hidden="true">
          <slot name="icon">
            <SnIcon v-if="icon" :name="icon" />
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            </svg>
          </slot>
        </span>
      </slot>
    </template>
    <!-- Presence dot (additive): decorative, the state rides on aria-label. -->
    <span v-if="hasStatus" class="sn-avatar__status" aria-hidden="true" />
    <!-- Corner badge (additive): decorative glyph, e.g. a membership crown. -->
    <span v-if="badgeIcon !== undefined" class="sn-avatar__badge" aria-hidden="true">
      <SnIcon :name="badgeIcon" />
    </span>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 3px;
  font-size: 14px;
  color: var(--sn-web-color-text-primary);
  background: var(--sn-web-color-background-subtle);
  white-space: nowrap;
  vertical-align: middle;
  /* The root cannot clip: it hosts the corner status dot / badge, which the
   * border radius would shave off. The image clips itself instead. */
}

.sn-avatar__img {
  display: block;
  width: 100%;
  height: 100%;
  /* The photo clips itself to the shape (the root cannot clip — it hosts the
   * corner overlays, see the root rule above). */
  border-radius: inherit;
}

/* Coloured thumbnails speak in inverse text: dark glyphs on a saturated
 * background are unreadable. */
.sn-avatar--colored {
  color: var(--sn-web-color-text-inverse);
}

/* Named scale (reference heights: 28 / 34 / 40 px). */
.sn-avatar--small {
  width: 28px;
  height: 28px;
}

.sn-avatar--medium {
  width: 34px;
  height: 34px;
}

.sn-avatar--large {
  width: 40px;
  height: 40px;
}

/* `circle` wins over `round` when both are set — declared after it. */
.sn-avatar--round {
  border-radius: 9999px;
}

.sn-avatar--circle {
  border-radius: 50%;
}

/* The glyph box is half the avatar; SnIcon's 1em wrapper must grow to it. */
.sn-avatar__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 50%;
}

.sn-avatar__icon > svg,
.sn-avatar__icon :deep(.sn-icon),
.sn-avatar__icon :deep(.sn-icon svg) {
  width: 100%;
  height: 100%;
}

/* The root no longer clips, so long thumbnails must ellipsize themselves. */
.sn-avatar__text {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Additive: presence status + corner badge ──────────────────────────── */

/* Anchored on the bottom-right corner like the uni-end badge layout; the
 * surface-coloured ring keeps it legible on top of a photo. */
.sn-avatar__status {
  position: absolute;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  border: 2px solid var(--sn-web-color-background-surface);
  border-radius: 50%;
  background-color: var(--sn-web-color-text-tertiary);
}

.sn-avatar--status-top .sn-avatar__status {
  top: 0;
  bottom: auto;
}

/* Presence colours: online green; offline keeps the tertiary gray default. */
.sn-avatar--status-online .sn-avatar__status {
  background-color: var(--sn-web-color-feedback-success);
}

/* The dot scales with the preset — a fixed dot covers half of a small head.
 * Numeric sizes keep the medium geometry. */
.sn-avatar--small .sn-avatar__status {
  width: 8px;
  height: 8px;
  border-width: 1.5px;
}

.sn-avatar--large .sn-avatar__status {
  width: 14px;
  height: 14px;
}

/* Badge: round gold disc holding the glyph (e.g. membership crown). */
.sn-avatar__badge {
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 2px solid var(--sn-web-color-background-surface);
  border-radius: 50%;
  background-color: var(--sn-web-color-feedback-warning);
  color: var(--sn-web-color-text-inverse);
}

.sn-avatar--badge-bottom .sn-avatar__badge {
  top: auto;
  bottom: 0;
}

.sn-avatar__badge :deep(.sn-icon),
.sn-avatar__badge :deep(.sn-icon svg) {
  width: 62%;
  height: 62%;
}

.sn-avatar--small .sn-avatar__badge {
  width: 12px;
  height: 12px;
}

.sn-avatar--large .sn-avatar__badge {
  width: 18px;
  height: 18px;
}
</style>
