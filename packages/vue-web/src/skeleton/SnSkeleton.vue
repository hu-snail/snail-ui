<script setup lang="ts">
/**
 * SnSkeleton — placeholder block shown while content loads (AUI-WEB-FB-007).
 *
 * Reference library: naive-ui `n-skeleton`
 *   (https://www.naiveui.com/zh-CN/light/components/skeleton)
 * Per AGENTS.md §112, props + semantics mirror n-skeleton 1:1.
 *
 * 1:1 parity (this version): text / round / circle / height / width / size /
 *   repeat / animated / sharp.
 *
 * Behaviour mirrors n-skeleton:
 *   - `width` / `height` accept numbers (treated as px) or any CSS length.
 *   - `circle` forces a square footprint and `border-radius: 50%`; when only
 *     one of width/height is given the other falls back to it, then to the
 *     `size` tier height.
 *   - `round` (pill) beats `sharp`; `sharp` means "leave the radius alone",
 *     so it only ever *unsets* the token radius.
 *   - `text` makes the block `inline-block` with a `-0.125em` baseline shift,
 *     so it drops into a line of text without breaking the line box.
 *   - `repeat` renders N sibling blocks, each its own element.
 *
 * Divergence from n-skeleton (documented):
 *   - Upstream emits `--n-color-start` / `--n-color-end` / `--n-bezier` per
 *     instance. This library reads the `--sn-web-skeleton-*` token block in
 *     CSS instead, so the inline style only carries geometry.
 *   - The `repeat` branch returns a fragment upstream (`<>{...}</>`); here the
 *     wrapper is a plain element with `display: contents` so a single-root
 *     template still yields sibling blocks without an extra layout box.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnSkeleton height="24px" width="60%" />
 *   <SnSkeleton circle :height="48" />
 *   <SnSkeleton repeat="3" height="1em" :sharp="false" />
 */

import { computed } from 'vue';

defineOptions({ name: 'SnSkeleton' });

const props = withDefaults(
  defineProps<{
    /** Render as an inline text placeholder. Mirrors n-skeleton `text`. */
    text?: boolean;
    /** Fully rounded ends (pill). Mirrors n-skeleton `round`. */
    round?: boolean;
    /** Circular block; width and height are forced equal. Mirrors `circle`. */
    circle?: boolean;
    /** Block height — number is px. Mirrors n-skeleton `height`. */
    height?: string | number;
    /** Block width — number is px. Mirrors n-skeleton `width`. */
    width?: string | number;
    /** Height tier used when no explicit height/width is given. */
    size?: 'small' | 'medium' | 'large';
    /** Number of sibling blocks to render. Mirrors n-skeleton `repeat`. */
    repeat?: number;
    /** Run the shimmer animation. Mirrors n-skeleton `animated`. */
    animated?: boolean;
    /** Keep square corners (unset the token radius). Mirrors `sharp`. */
    sharp?: boolean;
  }>(),
  {
    text: false,
    round: false,
    circle: false,
    height: undefined as any,
    width: undefined as any,
    size: undefined as any,
    repeat: 1,
    animated: true,
    sharp: true,
  },
);

/** Height tier tokens, mirroring upstream's `createKey('height', size)`. */
const SIZE_HEIGHT: Record<'small' | 'medium' | 'large', string> = {
  small: 'var(--sn-web-skeleton-height-small)',
  medium: 'var(--sn-web-skeleton-height-medium)',
  large: 'var(--sn-web-skeleton-height-large)',
};

/** Upstream `pxfy()` — pass CSS lengths through untouched. */
function toLength(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

const sizeHeight = computed(() => (props.size === undefined ? undefined : SIZE_HEIGHT[props.size]));

/** `repeat` is 1-indexed in spirit; anything below 1 renders one block. */
const repeatCount = computed(() => (props.repeat > 1 ? Math.floor(props.repeat) : 1));

const blockStyle = computed(() => {
  const tierHeight = sizeHeight.value;
  // Circle squares the footprint: an explicit width acts as the height too,
  // and vice versa, before falling back to the size tier.
  const mergedWidth = props.circle ? (props.width ?? props.height ?? tierHeight) : props.width;
  const mergedHeight = (props.circle ? (props.width ?? props.height) : props.height) ?? tierHeight;

  return {
    display: props.text ? 'inline-block' : '',
    verticalAlign: props.text ? '-0.125em' : '',
    borderRadius: props.circle
      ? '50%'
      : props.round
        ? '4096px'
        : props.sharp
          ? ''
          : 'var(--sn-web-skeleton-radius)',
    // Leave the property absent rather than empty: an empty inline value would
    // override the `1em` / `100%` defaults in the stylesheet.
    ...(toLength(mergedWidth) === undefined ? {} : { width: toLength(mergedWidth) }),
    ...(toLength(mergedHeight) === undefined ? {} : { height: toLength(mergedHeight) }),
    animation: props.animated ? '' : 'none',
  };
});
</script>

<template>
  <div data-snui-component="SnSkeleton" class="sn-skeleton-group">
    <div
      v-for="n in repeatCount"
      :key="n"
      data-snui-component="SnSkeleton"
      class="sn-skeleton"
      :class="{ 'sn-skeleton--text': text }"
      :style="blockStyle"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

/* Transparent to layout: the wrapper exists only to hold the repeated
 * blocks, mirroring upstream's fragment return. */
.sn-skeleton-group {
  display: contents;
}

.sn-skeleton {
  height: 1em;
  width: 100%;
  background-color: var(--sn-web-skeleton-color);
  transition:
    background-color 0.3s ease,
    border-radius 0.3s ease;
  animation: sn-skeleton-loading 2s infinite cubic-bezier(0.36, 0, 0.64, 1);
}

@keyframes sn-skeleton-loading {
  0% {
    background-color: var(--sn-web-skeleton-color);
  }
  40% {
    background-color: var(--sn-web-skeleton-color-end);
  }
  80% {
    background-color: var(--sn-web-skeleton-color);
  }
  100% {
    background-color: var(--sn-web-skeleton-color);
  }
}
</style>
