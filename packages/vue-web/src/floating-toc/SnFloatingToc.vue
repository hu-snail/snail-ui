<script setup lang="ts">
/**
 * SnFloatingToc — a floating table of contents that tracks the scroll
 * position and expands into a section list (AUI-WEB-NAV-010).
 *
 * Reference library: HeroUI Pro `FloatingToc`
 *   (https://heroui.pro/docs/react/components/floating-toc)
 *
 * naive-ui has no equivalent, so per AGENTS.md §112.3a this is an additive AUI
 * component and mirrors the HeroUI Pro API 1:1 instead:
 *
 *   root    placement / triggerMode / open / defaultOpen / onOpenChange /
 *           openDelay / closeDelay
 *   Trigger no own props (native `span` attributes pass through)
 *   Bar     active / level
 *   Content offset / placement (auto-derived from the root)
 *   Item    active / level (native `button` attributes pass through)
 *
 * Deliberately additive props: `href` / `title` on Bar and Item (the HeroUI
 * React parts read the section from their React tree; Vue needs the bar to
 * carry it), `scrollContainer` (default: the sections' nearest scrollable
 * ancestor, else the document) and `bound` (active line, same name and
 * meaning as SnAnchor's).
 *
 * Behaviour:
 *   - Hover mode (default) opens after `openDelay` on pointer / focus entry
 *     and closes after `closeDelay` on exit; press mode toggles on click.
 *   - The active section is the last one whose top crossed `bound` — the same
 *     reduction SnAnchor uses, so both stay consistent on one page.
 *   - A capture-phase scroll listener sees nested scrollers, and an
 *     `IntersectionObserver` re-measures on layout changes that emit no
 *     scroll event (fonts, images, accordions).
 *   - Every listener, observer and timer is released on unmount
 *     (AGENTS.md §41 / §82).
 *
 * Usage:
 *   <SnFloatingToc placement="right">
 *     <SnFloatingTocTrigger>
 *       <SnFloatingTocBar href="#intro" title="Intro" />
 *       <SnFloatingTocBar href="#usage" title="Usage" :level="2" />
 *     </SnFloatingTocTrigger>
 *     <SnFloatingTocContent>
 *       <SnFloatingTocItem href="#intro" />
 *     </SnFloatingTocContent>
 *   </SnFloatingToc>
 */

import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import {
  snFloatingTocInjectionKey,
  type SnFloatingTocPreview,
  type SnFloatingTocSection,
} from './sn-floating-toc-context';
import {
  findActiveHref,
  measureOffset,
  readScrollTop,
  resolveScrollContainer,
  scrollToSection,
  type SectionOffset,
} from './sn-floating-toc-utils';

defineOptions({ name: 'SnFloatingToc' });

const props = withDefaults(
  defineProps<{
    /** Side of the page the TOC sits on. */
    placement?: 'left' | 'right';
    /** `hover` opens on pointer / focus entry; `press` toggles on click. */
    triggerMode?: 'hover' | 'press';
    /**
     * What resting the pointer on the rail does.
     *
     * `open` (default, HeroUI parity) expands the full panel after
     * `openDelay`. `preview` instead shows a title + summary card for the
     * single bar under the pointer and leaves the panel to click / keyboard —
     * the two are mutually exclusive so they never stack on screen.
     */
    hoverAction?: 'open' | 'preview';
    /** Controlled open state. Omit it to keep the TOC uncontrolled. */
    open?: boolean | undefined;
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean;
    /** Fired whenever the open state changes. */
    onOpenChange?: ((open: boolean) => void) | undefined;
    /** Delay before opening on hover / focus, in ms. */
    openDelay?: number;
    /** Delay before closing on exit, in ms. */
    closeDelay?: number;
    /** Scroll container (selector or element). Auto-detected when omitted. */
    scrollContainer?: string | HTMLElement | undefined;
    /** Distance in px between the container top and the active line. */
    bound?: number;
  }>(),
  {
    placement: 'right',
    triggerMode: 'hover',
    hoverAction: 'open',
    open: undefined,
    defaultOpen: false,
    onOpenChange: undefined,
    openDelay: 200,
    closeDelay: 300,
    scrollContainer: undefined,
    bound: 0,
  },
);

defineSlots<{
  /** Trigger + Content. */
  default?(): unknown;
}>();

// ---------- Open state ----------

const uncontrolledOpen = ref(props.defaultOpen);
const isOpen = computed(() => props.open ?? uncontrolledOpen.value);

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Run `callback` after `delay`, or synchronously at `delay <= 0`.
 *
 * A zero-delay `setTimeout` is a queued task, and a pointer that leaves in the
 * same task (the common case for a quick sweep across the rail, and for every
 * scripted enter + leave) would still see the open fire first — the panel
 * would pop open and immediately close. Zero means "now".
 */
function schedule(delay: number, callback: () => void): ReturnType<typeof setTimeout> | null {
  if (delay <= 0) {
    callback();
    return null;
  }
  return setTimeout(callback, delay);
}

function clearTimers(): void {
  if (openTimer !== null) clearTimeout(openTimer);
  if (closeTimer !== null) clearTimeout(closeTimer);
  openTimer = null;
  closeTimer = null;
}

function setOpen(next: boolean): void {
  clearTimers();
  if (next === isOpen.value) return;
  if (props.open === undefined) uncontrolledOpen.value = next;
  props.onOpenChange?.(next);
}

function requestOpen(): void {
  if (props.triggerMode === 'press') return;
  clearTimers();
  // Always arm the open timer, even while already open: the panels stay open
  // while the pointer is on the rail, and `pointerenter` fires again every
  // time the pointer re-enters (a pointer that swept across the rail fires
  // leave → enter → leave, and the stale leave timer must not win).
  openTimer = schedule(props.openDelay, () => setOpen(true));
}

function requestClose(): void {
  if (props.triggerMode === 'press') return;
  clearTimers();
  closeTimer = schedule(props.closeDelay, () => setOpen(false));
}

function triggerPointerEnter(): void {
  // Preview mode keeps the panel shut on hover: the bar card is the only
  // thing that should appear, so the two overlays never overlap.
  if (props.hoverAction === 'preview') return;
  requestOpen();
}

function triggerPointerLeave(): void {
  requestClose();
}

function toggleOpen(): void {
  setOpen(!isOpen.value);
}

function triggerActivate(): void {
  // In press mode, and in preview mode (where hovering never opened the
  // panel), a click is the only way to get the full list, so it toggles.
  if (props.triggerMode === 'press' || props.hoverAction === 'preview') {
    toggleOpen();
    return;
  }
  // Plain hover mode: the panel is normally already open by the time the
  // pointer lands, so a click confirms it instead of closing it.
  setOpen(true);
}

// A controlled `open` switch invalidates any pending timer: the delay that
// was scheduled against the old state would otherwise fire against the new.
watch(
  () => props.open,
  () => clearTimers(),
);

// ---------- Section registry + active tracking ----------

const sections = ref<readonly SnFloatingTocSection[]>([]);
const activeHref = ref<string | null>(null);

/** Bar under the pointer, surfaced as a title + summary card. */
const preview = ref<SnFloatingTocPreview | null>(null);

/** The panel and the preview both open away from the page edge. */
const panelSide = computed<'left' | 'right'>(() => (props.placement === 'left' ? 'right' : 'left'));

function showPreview(next: SnFloatingTocPreview): void {
  if (props.hoverAction !== 'preview') return;
  preview.value = next;
}

function hidePreview(): void {
  preview.value = null;
}

// The expanded panel already lists every section, so the single-bar preview
// would only repeat it — and it would flicker mid-transition.
watch(isOpen, (open) => {
  if (open) hidePreview();
});

let scrollTarget: HTMLElement | Document | null = null;
let intersectionObserver: IntersectionObserver | null = null;

function currentContainer(): HTMLElement | Document {
  return resolveScrollContainer(sections.value, props.scrollContainer);
}

function measureSections(): void {
  const container = currentContainer();
  const offsets: SectionOffset[] = [];
  for (const section of sections.value) {
    if (!section.element) continue;
    offsets.push({ href: section.href, ...measureOffset(section.element, container) });
  }
  activeHref.value = findActiveHref(offsets, readScrollTop(container), props.bound);
}

/** Re-measure when a section resizes — no scroll event fires for that. */
function observeSections(): void {
  if (typeof IntersectionObserver === 'undefined') return;
  intersectionObserver ??= new IntersectionObserver(() => measureSections(), {
    root: scrollTarget instanceof HTMLElement ? scrollTarget : null,
  });
  intersectionObserver.disconnect();
  for (const section of sections.value) {
    if (section.element) intersectionObserver.observe(section.element);
  }
}

/** Point the scroll listener at the container the sections live in. */
function attachScrollListener(): void {
  const target = currentContainer();
  if (target === scrollTarget) return;
  scrollTarget?.removeEventListener('scroll', measureSections, true);
  scrollTarget = target;
  // Capture phase: nested scroll containers do not bubble their scroll event
  // up to the document (same choice as SnAnchor).
  scrollTarget.addEventListener('scroll', measureSections, true);
}

function registerSection(section: SnFloatingTocSection): () => void {
  sections.value = [...sections.value, section];
  // Bars mount before their host sections are necessarily rendered, so the
  // first measurement runs after the current tick.
  void Promise.resolve().then(() => {
    attachScrollListener();
    measureSections();
    observeSections();
  });
  return () => unregisterSection(section.id);
}

function unregisterSection(id: symbol): void {
  sections.value = sections.value.filter((section) => section.id !== id);
  measureSections();
}

function activateSection(href: string): void {
  if (!href) return;
  // Highlight before the smooth scroll lands, so the bar responds instantly.
  activeHref.value = href;
  scrollToSection(href, currentContainer());
}

function moveActive(delta: 1 | -1): void {
  const list = sections.value.filter((section) => section.element);
  if (list.length === 0) return;
  const index = list.findIndex((section) => section.href === activeHref.value);
  const nextIndex = Math.min(list.length - 1, Math.max(0, index + delta));
  const next = list[nextIndex];
  if (next) activateSection(next.href);
}

onMounted(() => {
  attachScrollListener();
  measureSections();
  observeSections();
});

watch(
  () => props.scrollContainer,
  () => {
    scrollTarget?.removeEventListener('scroll', measureSections, true);
    scrollTarget = null;
    attachScrollListener();
    observeSections();
    measureSections();
  },
);

// AGENTS.md §41 / §82: release the listener, the observer and both timers.
onBeforeUnmount(() => {
  clearTimers();
  scrollTarget?.removeEventListener('scroll', measureSections, true);
  scrollTarget = null;
  intersectionObserver?.disconnect();
  intersectionObserver = null;
});

// ---------- Context ----------

provide(snFloatingTocInjectionKey, {
  placement: computed(() => props.placement),
  isOpen,
  activeHref: computed(() => activeHref.value),
  sections: computed(() => sections.value),
  registerSection,
  detachSection: unregisterSection,
  moveActive,
  activateSection,
  requestOpen,
  triggerPointerEnter,
  triggerPointerLeave,
  requestClose,
  setOpen,
  toggleOpen,
  triggerActivate,
  preview: computed(() => preview.value),
  showPreview,
  hidePreview,
});

defineExpose({
  /** `href` of the section currently in view. */
  activeHref: computed(() => activeHref.value),
  /** Open / close the content panel programmatically. */
  setOpen,
  /** Re-measure section offsets (e.g. after host-driven layout changes). */
  refresh: measureSections,
});
</script>

<template>
  <nav
    data-snui-component="floating-toc"
    class="sn-floating-toc"
    :data-placement="placement"
    :data-open="isOpen ? 'true' : 'false'"
    aria-label="Table of contents"
  >
    <slot />

    <!-- Single-bar preview: title + one-line summary while the pointer rests
         on a collapsed bar. `pointer-events: none` keeps it from stealing the
         hover that keeps it visible. -->
    <Transition name="sn-floating-toc-preview">
      <div
        v-if="preview"
        class="sn-floating-toc__preview"
        data-snui-component="floating-toc-preview"
        :data-side="panelSide"
        :style="{ top: `${preview.top}px` }"
        aria-hidden="true"
      >
        <p class="sn-floating-toc__preview-title">{{ preview.title }}</p>
        <p v-if="preview.summary" class="sn-floating-toc__preview-summary">
          {{ preview.summary }}
        </p>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only — enforced by
 * `pnpm snui token-check --dir packages/vue-web --end web`. */

.sn-floating-toc {
  /* HeroUI floating TOC surface variables. Defaults come from the library
   * tokens; a host retunes the TOC by overriding these on any ancestor. */
  --floating-toc-bar-width: 16px;
  --floating-toc-bar-active-width: 24px;
  --floating-toc-bar-height: 2px;
  --floating-toc-bar-level-step: 3px;
  --floating-toc-bar-gap: 12px;
  --floating-toc-item-indent: 0.75rem;
  --floating-toc-content-width: 224px;
  --floating-toc-preview-width: 232px;
  --floating-toc-color-bar: var(--sn-web-color-border-default);
  --floating-toc-color-active: var(--sn-web-color-action-primary);

  position: fixed;
  top: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  transform: translateY(-50%);
}

.sn-floating-toc[data-placement='right'] {
  right: var(--sn-web-spacing-6);
  flex-direction: row;
}

.sn-floating-toc[data-placement='left'] {
  left: var(--sn-web-spacing-6);
  flex-direction: row-reverse;
}

/* ---------- Single-bar hover preview ---------- */

.sn-floating-toc__preview {
  position: absolute;
  box-sizing: border-box;
  width: var(--floating-toc-preview-width);
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-3);
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-lg);
  background: var(--sn-web-color-background-elevated);
  box-shadow: var(--sn-web-shadow-md);
  transform: translateY(-50%);
  /* Purely informational: never intercept the pointer that shows it. */
  pointer-events: none;
}

.sn-floating-toc__preview[data-side='left'] {
  right: calc(100% + var(--sn-web-spacing-2));
}

.sn-floating-toc__preview[data-side='right'] {
  left: calc(100% + var(--sn-web-spacing-2));
}

.sn-floating-toc__preview-title {
  margin: 0;
  color: var(--sn-web-color-text-primary);
  font-family: var(--sn-web-font-family-body);
  font-size: var(--sn-web-font-size-sm);
  font-weight: var(--sn-web-font-weight-medium);
  line-height: var(--sn-web-font-line-height-normal);
}

.sn-floating-toc__preview-summary {
  display: -webkit-box;
  margin: var(--sn-web-spacing-1) 0 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--sn-web-color-text-secondary);
  font-family: var(--sn-web-font-family-body);
  font-size: var(--sn-web-font-size-xs);
  line-height: var(--sn-web-font-line-height-normal);
}

.sn-floating-toc-preview-enter-active,
.sn-floating-toc-preview-leave-active {
  transition: opacity 0.12s ease;
}

.sn-floating-toc-preview-enter-from,
.sn-floating-toc-preview-leave-to {
  opacity: 0;
}
</style>
