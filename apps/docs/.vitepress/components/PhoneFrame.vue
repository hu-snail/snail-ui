<script setup lang="ts">
/**
 * PhoneFrame — mobile device surface for uni-app demos.
 *
 * ## Why
 *
 * uni-app components are mobile-first: they assume a 375-430px viewport, a
 * safe-area, a status bar and touch-sized hit targets. Rendering them in the
 * same full-width desktop card the web demos use flattens that context and
 * makes the two ends look interchangeable. This shell restores the mobile
 * context so `/components/uni/**` reads as a phone preview, visually distinct
 * from the web pages (which stay on the plain demo card).
 *
 * ## What it renders
 *
 *   - a bare screen surface: white, no bezel, large rounded corners
 *   - status bar (time / signal / wifi / battery) and home indicator
 *   - a dynamic island, so the surface reads as a modern phone
 *   - a navigation bar with the page title, as a mini program shows
 *   - a scrollable screen area that hosts the demo
 *
 * There is deliberately no device toolbar and no dark bezel ring: the panel
 * that hosts this frame *is* the phone. Chrome around the surface competes
 * with the component being documented, which is the thing under test.
 *
 * ## Dark mode
 *
 * The surface follows the docs site appearance via `--vp-c-bg` — white in the
 * light theme (the default look), the dark surface in the dark theme. The demo
 * content itself is driven by `--sn-mp-*` → `--aui-*`, which already flip under
 * `.dark`, so tokenized uni components stay legible either way. Hard-coding
 * white here would put dark-mode text on a white sheet.
 *
 * ## Why `<view>` / `<text>` get base styles here
 *
 * uni-app's `<view>` / `<text>` are custom elements in the browser and default
 * to `display: inline`. Inside the phone screen they must behave like the
 * uni runtime's block-level box model, otherwise flex children collapse. The
 * rules live in this component's unscoped block, scoped to `.sn-phone__screen`,
 * so they never leak into the rest of the docs site.
 */

import { computed, ref } from 'vue'

interface Props {
  /**
   * Navigation-bar title. A mini program page always shows one; leave empty
   * for a bare screen (inline single-demo previews).
   */
  title?: string
  /**
   * Screen height.
   *
   * `'auto'` lets the frame grow with its content up to the viewport (the
   * dock's stacked-page mode), while a number pins the screen to a fixed
   * height (the standalone device-simulator mode). `'auto'` is the default
   * because a preview that clips its own content is worse than one that is
   * slightly tall.
   */
  height?: number | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  height: 'auto',
})

/**
 * Screen corner radius. A current-generation phone is ~44px at this width;
 * the value is fixed because the surface no longer carries a device switcher.
 */
const SCREEN_RADIUS = 44

const screenStyle = computed(() => ({
  borderRadius: `${SCREEN_RADIUS}px`,
  // `height: 'auto'` is the dock's stacked-page mode: the screen takes its
  // content height but is capped by the dock's available space, and the inner
  // scroll area absorbs the overflow. A numeric height pins the screen.
  height: props.height === 'auto' ? undefined : `${props.height}px`,
}))

const scrollEl = ref<HTMLElement | null>(null)

/**
 * Scroll the screen so a section is at the top of the visible area.
 *
 * Exposed (via `defineExpose`) so a host can drive the device without reaching
 * into the DOM itself. The scroll is performed on the screen element, not
 * `scrollIntoView`, because the latter can scroll *ancestors* too — which
 * would move the whole docs page.
 */
function scrollToSection(id: string): void {
  const host = scrollEl.value
  if (host === null) return
  const target = host.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null
  if (target === null) return
  host.scrollTo({ top: target.offsetTop - 8, behavior: 'smooth' })
}

defineExpose({ scrollToSection })
</script>

<template>
  <div class="sn-phone">
    <div class="sn-phone__screen" :style="screenStyle">
      <!--
        Status bar: time on the left, indicators on the right. The centre is
        deliberately empty — that is where the dynamic island sits, and a title
        there would collide with it (and duplicate the navigation bar below).
      -->
      <div class="sn-phone__statusbar" aria-hidden="true">
        <span class="sn-phone__time">9:41</span>
        <span class="sn-phone__spacer" />
        <span class="sn-phone__indicators">
          <svg viewBox="0 0 18 12" class="sn-phone__signal" aria-hidden="true">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5" width="3" height="7" rx="1" />
            <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35" />
          </svg>
          <svg viewBox="0 0 16 12" class="sn-phone__wifi" aria-hidden="true">
            <path d="M8 11.2 5.6 8.4a3.6 3.6 0 0 1 4.8 0L8 11.2Z" />
            <path d="M8 6.6c-1.6 0-3.1.6-4.2 1.7l-1.2-1.3A7.6 7.6 0 0 1 8 4.8c2.1 0 4 .8 5.4 2.2l-1.2 1.3A5.9 5.9 0 0 0 8 6.6Z" />
            <path d="M8 2.4c-2.6 0-5 1-6.8 2.8L0 3.9A11.6 11.6 0 0 1 8 .6c3 0 5.8 1.2 8 3.3l-1.2 1.3A9.9 9.9 0 0 0 8 2.4Z" opacity="0.55" />
          </svg>
          <span class="sn-phone__battery">
            <span class="sn-phone__battery-fill" />
          </span>
        </span>
      </div>

      <div class="sn-phone__island" aria-hidden="true" />

      <!--
        Navigation bar. A mini program page always shows a title bar under the
        status bar, and the demo's own `<h1>` is exactly what it would display.
        Rendering it here makes the preview read as a real page instead of a
        bare scroll area.
      -->
      <div v-if="title" class="sn-phone__navbar">
        <span class="sn-phone__navbar-back" aria-hidden="true">
          <svg viewBox="0 0 24 24" class="sn-phone__navbar-icon">
            <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="sn-phone__navbar-title">{{ title }}</span>
        <span class="sn-phone__navbar-capsule" aria-hidden="true">
          <span class="sn-phone__navbar-dots">•••</span>
          <span class="sn-phone__navbar-divider" />
          <span class="sn-phone__navbar-target" />
        </span>
      </div>

      <div ref="scrollEl" class="sn-phone__scroll">
        <slot />
      </div>

      <div class="sn-phone__home" aria-hidden="true">
        <span class="sn-phone__home-bar" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * The frame is the surface: no bezel ring, no toolbar, no outer margin.
 *
 * Two layout modes share this shell:
 *   - inline (narrow viewport / dock closed): a centred, phone-width surface
 *     capped at 400px so it never stretches across the article column
 *   - docked (DemoDock): the host overrides `max-width`/`flex` and the surface
 *     fills the panel exactly
 */
.sn-phone {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

/* Screen: the actual viewport. White in the light theme, dark in the dark one. */
.sn-phone__screen {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: hidden;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  width: 100%;
  max-width: 100%;
  /*
   * Clip `position: fixed` overlays to the device.
   *
   * The uni overlay components (popup / dialog / keyboard / toast / notify…)
   * root at `position: fixed`, which is correct in a real miniprogram — the
   * host page IS the viewport. Inside the docs preview the browser viewport is
   * the whole page, so a `fixed` overlay would paint across the article.
   *
   * A `transform` on this element turns it into the containing block for fixed
   * descendants, so overlays resolve against the screen box instead of the
   * browser window — exactly the device behaviour, without touching the
   * library. `translateZ(0)` is the cheapest compositing-safe form and cannot
   * be overridden by demo styles the way `transform: none` could.
   *
   * `min-height: 0` (below) keeps the flex child shrinkable so content scrolls
   * inside the screen rather than pushing the panel open.
   */
  transform: translateZ(0);
  /*
   * Auto-height mode: the screen may shrink to the space its parent gives it.
   * Without `min-height: 0` a flex child refuses to go below its content size,
   * so the content would overflow the panel instead of scrolling inside it.
   */
  min-height: 0;
}

/*
 * Navigation bar — the title strip a mini program page always shows.
 *
 * Sits between the status bar and the scroll area and stays put while the
 * content scrolls, matching native behaviour.
 */
.sn-phone__navbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  height: 44px;
  padding: 0 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.sn-phone__navbar-back {
  position: absolute;
  left: 10px;
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-text-1);
}

.sn-phone__navbar-icon {
  width: 20px;
  height: 20px;
}

.sn-phone__navbar-title {
  max-width: 60%;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mini program "capsule": the ••• / ⊙ pill at the right of every nav bar. */
.sn-phone__navbar-capsule {
  position: absolute;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  color: var(--vp-c-text-2);
}

.sn-phone__navbar-dots {
  font-size: 10px;
  line-height: 1;
  letter-spacing: 0.5px;
}

.sn-phone__navbar-divider {
  width: 1px;
  height: 12px;
  background: var(--vp-c-divider);
}

.sn-phone__navbar-target {
  width: 12px;
  height: 12px;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  box-sizing: border-box;
}

.sn-phone__statusbar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 18px;
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: 0.01em;
}

.sn-phone__time {
  font-variant-numeric: tabular-nums;
}

.sn-phone__spacer {
  flex: 1 1 auto;
}

.sn-phone__indicators {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  fill: currentColor;
}

.sn-phone__signal {
  width: 15px;
  height: 10px;
}

.sn-phone__wifi {
  width: 14px;
  height: 10px;
}

.sn-phone__battery {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 10px;
  border: 1px solid currentColor;
  border-radius: 3px;
  opacity: 0.9;
}

.sn-phone__battery::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 3px;
  width: 2px;
  height: 4px;
  border-radius: 0 1px 1px 0;
  background: currentColor;
}

.sn-phone__battery-fill {
  position: absolute;
  inset: 1.5px;
  right: 5px;
  border-radius: 1px;
  background: currentColor;
}

/* Dynamic island — the one piece of hardware chrome the surface keeps. */
.sn-phone__island {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 96px;
  height: 24px;
  border-radius: 999px;
  background: #000;
  z-index: 2;
  pointer-events: none;
}

.dark .sn-phone__island {
  background: #000;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
}

/* Scroll host: the demo lives here, with mobile padding rhythm. */
.sn-phone__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 12px 16px 24px;
  scrollbar-width: thin;
}

.sn-phone__scroll::-webkit-scrollbar {
  width: 4px;
}

.sn-phone__scroll::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: var(--vp-c-divider);
}

.sn-phone__home {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  padding: 6px 0 8px;
}

.sn-phone__home-bar {
  width: 120px;
  height: 4px;
  border-radius: 999px;
  background: var(--vp-c-text-3);
  opacity: 0.5;
}
</style>

<style>
/*
 * uni-app element base styles, scoped to the phone screen.
 *
 * `<view>` and `<text>` are unknown elements in the browser: `view` renders
 * inline and `text` behaves like a span. uni-app's runtime treats both as
 * block-level boxes, so without this reset flex/grid layouts inside demos
 * collapse and every component looks 4px tall. Keeping the selectors under
 * `.sn-phone__screen` means nothing leaks to the web demos or the docs prose.
 */
.sn-phone__screen view {
  display: block;
  box-sizing: border-box;
}

.sn-phone__screen text {
  display: inline;
  box-sizing: border-box;
}

/*
 * `<scroll-view>` is a real scrolling container in uni-app: `scroll-y` makes it
 * a vertical scroller and components (calendar-view, index-bar, chat lists)
 * size it from the outside. The browser knows no such element, so without a
 * base rule it renders `display: inline; overflow: visible` and the panel grows
 * past the screen instead of scrolling inside it.
 */
.sn-phone__screen scroll-view {
  display: block;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.sn-phone__screen scroll-view::-webkit-scrollbar {
  display: none;
}

/*
 * `<image>`: uni's image is a sized box (object-fit via `mode`), and the
 * browser maps the tag to a plain `img` whose intrinsic 300×150 pre-load size
 * would break the layout.
 */
.sn-phone__screen image {
  display: block;
  box-sizing: border-box;
}

/*
 * The mouse→touch bridge turns drags into touch gestures; native text
 * selection would fight the gesture (a picker drag paints a blue selection).
 * A uni device has nothing to select on a drag, so the preview drops selection
 * inside the screen. Inputs stay usable.
 */
.sn-phone__screen {
  user-select: none;
  -webkit-user-select: none;
}

/*
 * Demo layout defaults.
 *
 * `<view>` is a block element (see the reset above), so a demo root needs no
 * help to stack its children vertically — and that is the correct default:
 * a mini program page reads top-down. The rules below only opt *into* a row
 * layout, which keeps the defaults out of the way of every demo that ships its
 * own scoped `flex-direction` / `gap`.
 *
 * History: an earlier version gave every `*-demo` root `display:flex;
 * flex-wrap:wrap` by default. That rule outranked the demos' own scoped styles
 * on specificity, so `.sn-demo--stack` and `.sn-demo--column` roots were
 * flattened into horizontal rows — the "messy layout" this fixes.
 */
.sn-phone__screen .sn-demo--column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.sn-phone__screen .sn-demo--stack {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

/* A row of buttons / tags: the one shape worth opting into explicitly. */
.sn-phone__screen .sn-demo--row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

/*
 * Legacy wrapper classes that genuinely want a wrapped row.
 *
 * The uni demos predate the `sn-demo` convention and each family ships its own
 * root class (`sn-button-demo`, `sn-input-demo`, …). Only the button/tag/badge
 * families are row-shaped; everything else manages its own layout, so this
 * list is explicit rather than a blanket `[class$='-demo']` match.
 */
.sn-phone__screen .sn-button-demo,
.sn-phone__screen .sn-tag-demo,
.sn-phone__screen .sn-badge-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

/* Column-shaped families. */
.sn-phone__screen .sn-form-demo,
.sn-phone__screen .sn-form-demo-grid,
.sn-phone__screen .sn-demo--chat-mp,
.sn-phone__screen .sn-demo--message-mp,
.sn-phone__screen .sn-fab-demo__stage {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

/* Full-bleed demos: the child owns the whole screen (index bar, sticky list). */
.sn-phone__screen .sn-demo--index,
.sn-phone__screen .sn-demo--scroll {
  display: block;
  width: 100%;
}
</style>
