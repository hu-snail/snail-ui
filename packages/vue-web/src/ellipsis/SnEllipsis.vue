<script setup lang="ts">
/**
 * SnEllipsis — web-end text ellipsis with overflow tooltip (AUI-WEB-DD-025).
 *
 * Reference library: naive-ui `n-ellipsis`
 *   (https://www.naiveui.com/zh-CN/light/components/ellipsis)
 * Per AGENTS.md §112, props + semantics mirror n-ellipsis 1:1:
 *   expandTrigger ('click' | 'none') / lineClamp (row count) / tooltip
 *   (boolean | tooltip-props object) / width (number | 'screen').
 *   Slot: default (text content).
 *
 * Documented divergences (not §112 violations):
 *   - The tooltip object form accepts a documented subset of SnTooltip
 *     props (see SnEllipsisTooltipOptions); `disabled` is owned by the
 *     overflow detection and cannot be overridden through it.
 *   - Overflow is re-measured on mount, on window resize, via a
 *     ResizeObserver on the text box (where available), and on prop /
 *     expand changes. Slot content swaps that do not change the box size
 *     are picked up by the next resize pass only.
 *   - No config-provider / RTL integration (web-end v3 has no provider
 *     yet).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnEllipsis style="max-width: 200px">很长的一段文本……</SnEllipsis>
 *   <SnEllipsis :line-clamp="2" expand-trigger="click">多行文本……</SnEllipsis>
 */

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
} from 'vue';
import SnTooltip from '../tooltip/SnTooltip.vue';

defineOptions({ name: 'SnEllipsis' });

/**
 * Documented subset of SnTooltip props accepted through the object form
 * of `tooltip`. Values are forwarded 1:1 to the embedded SnTooltip.
 */
export interface SnEllipsisTooltipOptions {
  /** Tooltip body; defaults to the full slot text. */
  content?: string;
  placement?:
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'bottom-start'
    | 'bottom'
    | 'bottom-end'
    | 'left-start'
    | 'left'
    | 'left-end';
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  delay?: number | [number, number];
  duration?: number;
  arrow?: boolean;
  zIndex?: number;
  raw?: boolean;
  animated?: boolean;
  keepAliveOnHover?: boolean;
  overlap?: boolean;
  width?: number | 'trigger';
  to?: string | HTMLElement | false;
  displayDirective?: 'if' | 'show';
  contentClass?: string;
  contentStyle?: CSSProperties;
}

const props = withDefaults(
  defineProps<{
    /**
     * Whether clicking the text toggles the expanded state.
     * Mirrors n-ellipsis `expandTrigger`. Default 'none'.
     */
    expandTrigger?: 'click' | 'none';
    /** Row count before clamping. 1 = single line. Mirrors n-ellipsis `lineClamp`. Default 1. */
    lineClamp?: number;
    /**
     * Show a tooltip with the full text when the content overflows.
     * `true` uses the defaults; an object forwards SnTooltip props.
     * Mirrors n-ellipsis `tooltip`. Default true.
     */
    tooltip?: boolean | SnEllipsisTooltipOptions;
    /** Box width; a number is px, 'screen' is 100vw. Mirrors n-ellipsis `width`. */
    width?: number | 'screen' | undefined;
  }>(),
  {
    expandTrigger: 'none',
    lineClamp: 1,
    tooltip: true,
    width: undefined,
  },
);

defineSlots<{
  /** Text content that gets clamped. Mirrors n-ellipsis `default`. */
  default?(): unknown;
}>();

/* ─────────── Overflow detection ─────────── */

const expanded = ref(false);
const overflow = ref(false);
const fullText = ref('');
const contentEl = ref<HTMLElement | null>(null);

function measure(): void {
  const el = contentEl.value;
  if (!el) return;
  fullText.value = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  if (expanded.value) {
    overflow.value = false;
    return;
  }
  if (props.lineClamp > 1) {
    overflow.value = el.scrollHeight - el.clientHeight > 1;
  } else {
    overflow.value = el.scrollWidth - el.clientWidth > 1;
  }
}

function onWindowResize(): void {
  measure();
}

/* Per AGENTS.md §41: the observer + listener are torn down on unmount. */
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  measure();
  window.addEventListener('resize', onWindowResize);
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => measure());
    if (contentEl.value) resizeObserver.observe(contentEl.value);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

watch([() => props.lineClamp, () => props.width], () => {
  void nextTick().then(measure);
});

watch(expanded, () => {
  void nextTick().then(measure);
});

/* ─────────── Styling ─────────── */

const rootStyle = computed<CSSProperties | undefined>(() => {
  if (props.width === undefined) return undefined;
  return {
    width: props.width === 'screen' ? '100vw' : `${props.width}px`,
  };
});

const contentStyle = computed<CSSProperties | undefined>(() => {
  if (expanded.value) return undefined;
  if (props.lineClamp > 1) {
    return {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: props.lineClamp,
      overflow: 'hidden',
      wordBreak: 'break-word',
    };
  }
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
});

/* ─────────── Expand on click ─────────── */

function onContentClick(): void {
  if (props.expandTrigger !== 'click') return;
  expanded.value = !expanded.value;
}

/* ─────────── Tooltip passthrough ─────────── */

const tooltipEnabled = computed(() => props.tooltip !== false);

const tooltipOptions = computed<SnEllipsisTooltipOptions>(() =>
  typeof props.tooltip === 'object' ? props.tooltip : {},
);

const tooltipContent = computed(() => tooltipOptions.value.content ?? fullText.value);

/** The bubble only opens for genuinely overflowing (and collapsed) text. */
const tooltipDisabled = computed(() => !overflow.value || expanded.value);
</script>

<template>
  <span
    data-snui-component="ellipsis"
    class="sn-ellipsis"
    :class="{
      'sn-ellipsis--expanded': expanded,
      'sn-ellipsis--click': expandTrigger === 'click',
    }"
    :style="rootStyle"
  >
    <SnTooltip
      v-if="tooltipEnabled"
      v-bind="tooltipOptions"
      :content="tooltipContent"
      :disabled="tooltipDisabled"
    >
      <span
        ref="contentEl"
        class="sn-ellipsis__content"
        :style="contentStyle"
        @click="onContentClick"
        ><slot
      /></span>
    </SnTooltip>
    <span
      v-else
      ref="contentEl"
      class="sn-ellipsis__content"
      :style="contentStyle"
      @click="onContentClick"
      ><slot
    /></span>
  </span>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-ellipsis {
  display: block;
  min-width: 0;
}

.sn-ellipsis--click .sn-ellipsis__content {
  cursor: pointer;
}

/*
 * The embedded tooltip wraps the text in its own trigger span, which is
 * `display: inline-flex` and would defeat the width-constrained clamp —
 * force it back to a full-width block.
 */
.sn-ellipsis :deep(.sn-tooltip-trigger) {
  display: block;
  width: 100%;
}

.sn-ellipsis__content {
  min-width: 0;
}
</style>
