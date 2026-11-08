<script setup lang="ts">
/**
 * SnFloatingTocBar — one horizontal indicator line in the collapsed rail
 * (AUI-WEB-NAV-010).
 *
 * Reference library: HeroUI Pro `FloatingToc.Bar`.
 *
 * The `href` / `title` props are AUI additions: the HeroUI React version
 * reads the section from its own React tree, which in Vue would need one
 * provider per section. Here the bar *is* the section registration — it
 * carries the link target, the label shown in the panel, and it resolves the
 * DOM anchor the root measures. The visual stays 1:1: bars grow from the
 * placement edge, shrink per level through `--floating-toc-level`, and widen
 * + accent when `active` (or when the root reports the section in view).
 */

import { computed, inject, onBeforeUnmount, onMounted } from 'vue';
import { snFloatingTocInjectionKey, type SnFloatingTocSection } from './sn-floating-toc-context';
import { clampLevel, hrefToId } from './sn-floating-toc-utils';

defineOptions({ name: 'SnFloatingTocBar', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** Highlights this bar as the currently active section. */
    active?: boolean | undefined;
    /** Nesting depth (1 = top-level). Deeper levels render shorter bars. */
    level?: number;
    /** Section anchor (`'#intro'`) this bar points at. */
    href?: string;
    /** Label shown for this section in the expanded panel. */
    title?: string;
    /**
     * One-line summary for the hover preview. When omitted it is derived from
     * the section element's text (collapsed whitespace, first 120 characters),
     * so a plain heading + paragraph page needs no extra wiring.
     */
    summary?: string;
  }>(),
  {
    active: undefined,
    level: 1,
    href: '',
    title: '',
    summary: '',
  },
);

defineSlots<{ default?(): unknown }>();

const context = inject(snFloatingTocInjectionKey, null);
if (!context) {
  throw new Error('[SnFloatingTocBar] must be used inside <SnFloatingToc>.');
}

/**
 * Identity of this bar inside the root's section registry.
 *
 * A module counter, not `useId()`: `useId()` allocates per *instance* and is
 * re-evaluated when the component re-renders, which handed the root a new
 * entry object on every measurement and made the bars mount/unmount on each
 * scroll tick. The counter is monotonic and cheap, and the value never reaches
 * the DOM, so it cannot cause a hydration mismatch.
 */
let nextBarIndex = 0;
const id = Symbol(nextBarIndex++);

const level = computed(() => clampLevel(props.level));

/** `active` prop wins; otherwise the root decides from the scroll position. */
const isActive = computed(() => props.active ?? context?.activeHref.value === props.href);

/** The section element, resolved from the document rather than the TOC
 *  subtree: sections are usually page headings the host renders elsewhere. */
const element = computed(() => {
  const domId = hrefToId(props.href);
  return domId ? document.getElementById(domId) : null;
});

/** Longest auto-derived summary, in characters. */
const SUMMARY_MAX_LENGTH = 120;

/**
 * Explicit `summary`, else the section element's own text.
 *
 * Taking the first 120 characters of the section is what makes the preview
 * useful without a second source of truth: the host already wrote the section
 * body, and the preview only needs its opening line.
 */
const summary = computed(() => {
  if (props.summary) return props.summary;
  const text = element.value?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  if (!text) return '';
  return text.length > SUMMARY_MAX_LENGTH ? `${text.slice(0, SUMMARY_MAX_LENGTH)}…` : text;
});

/** The registry entry. Fields are getters so it can be registered once and
 *  still answer with live values — the root only reads it during measurement
 *  and observation, never stores a snapshot. */
const entry: SnFloatingTocSection = {
  get href() {
    return props.href;
  },
  get title() {
    return props.title;
  },
  get summary() {
    return summary.value;
  },
  get level() {
    return level.value;
  },
  get element() {
    return element.value;
  },
  activate: () => context?.activateSection(props.href),
  id,
};

let unregister: (() => void) | null = null;

onMounted(() => {
  unregister = context?.registerSection(entry) ?? null;
});

// AGENTS.md §41: the bar leaves the registry (and the observer) on unmount.
// `href` needs no re-registration: the entry above reads it live.
onBeforeUnmount(() => {
  unregister?.();
});

function scrollToSection(): void {
  context?.activateSection(props.href);
}

function handlePointerEnter(event: PointerEvent): void {
  const host = event.currentTarget as HTMLElement;
  // `offsetTop` is measured against the nearest positioned ancestor, which is
  // the fixed root, so the card lines up with this bar without extra math.
  context?.showPreview({
    title: props.title,
    summary: summary.value,
    top: host.offsetTop + host.offsetHeight / 2,
  });
}

function handlePointerLeave(): void {
  context?.hidePreview();
}
</script>

<template>
  <span
    v-bind="$attrs"
    class="sn-floating-toc__bar"
    data-snui-component="floating-toc-bar"
    :data-active="isActive ? 'true' : 'false'"
    :data-level="level"
    :style="{ '--floating-toc-level': level }"
    aria-hidden="true"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
    @click.stop="scrollToSection"
  >
    <slot />
  </span>
</template>

<style scoped>
.sn-floating-toc__bar {
  position: relative;
  display: block;
  flex: none;
  box-sizing: border-box;
  width: calc(
    var(--floating-toc-bar-width) - (var(--floating-toc-level, 1) - 1) *
      var(--floating-toc-bar-level-step)
  );
  height: var(--floating-toc-bar-height);
  cursor: pointer;
}

.sn-floating-toc__bar::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--sn-web-radius-full);
  background: var(--floating-toc-color-bar);
  transition:
    background-color 0.2s ease,
    width 0.2s ease;
}

/* Bars grow from the placement edge: flush right when the TOC is on the
 * right, flush left when it is on the left, so widening never pushes the rail
 * into the page. */
.sn-floating-toc__trigger[data-placement='right'] .sn-floating-toc__bar::after {
  right: 0;
}

.sn-floating-toc__trigger[data-placement='left'] .sn-floating-toc__bar::after {
  left: 0;
}

.sn-floating-toc__bar[data-active='true']::after {
  width: var(--floating-toc-bar-active-width);
  background: var(--floating-toc-color-active);
}

.sn-floating-toc__bar:hover::after {
  background: var(--floating-toc-color-active);
}
</style>
