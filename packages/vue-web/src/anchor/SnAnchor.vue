<script setup lang="ts">
/**
 * SnAnchor — in-page navigation that tracks the scroll position
 * (AUI-WEB-NAV-007).
 *
 * Reference library: naive-ui `n-anchor`
 *   (https://www.naiveui.com/zh-CN/light/components/anchor)
 * Per AGENTS.md §112, props + semantics mirror n-anchor 1:1.
 *
 * 1:1 parity (this version): type / showRail / showBackground / bound /
 *   internalScrollable / ignoreGap / offsetTarget / affix (plus the full
 *   affix prop set, forwarded to SnAffix) / slot default.
 *
 * Behaviour mirrors n-anchor:
 *   - The active link is the last link whose section top has reached `bound`
 *     (i.e. crossed the top of the scroll target); `ignoreGap` extends that to
 *     sections scrolled entirely out of view.
 *   - The rail is a thin vertical line with a bar that slides to the active
 *     link's title.
 *   - `showBackground` draws a wider highlight behind the active link, sized
 *     from the anchor's left edge to the link's right edge.
 *   - Clicking a link scrolls its section into view and marks it active,
 *     suppressing the scroll handler so the jump does not flicker the rail.
 *   - The scroll listener is registered in the capture phase so it also sees
 *     scrolls from nested containers.
 *
 * Divergence from n-anchor (documented):
 *   - `internalScrollable` does not wrap the content in an `NScrollbar`; this
 *     library has no scrollbar component yet, so the prop is accepted for API
 *     parity and the content renders in normal flow. Recorded as a §112
 *     future marker.
 *   - `n-anchor` also runs its measurement on `onFontsReady` (via vooks).
 *     Web fonts can reflow sections, so a `document.fonts.ready` hook is used
 *     when available, with a no-op fallback.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnAnchor :bound="14">
 *     <SnAnchorLink title="简介" href="#intro" />
 *     <SnAnchorLink title="用法" href="#usage" />
 *   </SnAnchor>
 */

import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, toRef, watch } from 'vue'
import SnAffix from '../affix/SnAffix.vue'
import { snAnchorInjectionKey } from './sn-anchor-context'
import { getOffset, isDocumentLike, type OffsetTarget } from './sn-anchor-utils'

defineOptions({ name: 'SnAnchor' })

const props = withDefaults(
  defineProps<{
    /** `rail` shows a vertical rail with a sliding bar; `block` is a plain
     *  list. Mirrors n-anchor `type`. */
    type?: 'block' | 'rail'
    /** Show the rail (ignored when `type` is `block`). Mirrors `showRail`. */
    showRail?: boolean
    /** Show the highlight behind the active link. Mirrors `showBackground`. */
    showBackground?: boolean
    /** Distance from the scroll target top at which a section becomes
     *  active. Mirrors n-anchor `bound`. */
    bound?: number
    /** Accept for API parity; content is rendered in normal flow. */
    internalScrollable?: boolean
    /** Keep the previous link active while a section is scrolled out of
     *  view, instead of activating the fully-scrolled-past link. */
    ignoreGap?: boolean
    /** Element used to measure section offsets. Defaults to `document`. */
    offsetTarget?: string | OffsetTarget | (() => HTMLElement)
    /** Wrap the anchor in SnAffix so it stays in view. Mirrors `affix`. */
    affix?: boolean
    /** Forwarded to SnAffix when `affix` is true. */
    listenTo?:
      | string
      | HTMLElement
      | Document
      | (() => HTMLElement | Document)
    /** Forwarded to SnAffix when `affix` is true. */
    top?: number
    /** Forwarded to SnAffix when `affix` is true. */
    bottom?: number
    /** Forwarded to SnAffix when `affix` is true. */
    triggerTop?: number
    /** Forwarded to SnAffix when `affix` is true. */
    triggerBottom?: number
    /** @deprecated Use `triggerTop` / `triggerBottom`. Forwarded to SnAffix. */
    offsetTop?: number
    /** @deprecated Use `triggerTop` / `triggerBottom`. Forwarded to SnAffix. */
    offsetBottom?: number
  }>(),
  {
    type: 'rail',
    showRail: true,
    showBackground: true,
    bound: 12,
    internalScrollable: false,
    ignoreGap: false,
    offsetTarget: undefined as any,
    affix: false,
    listenTo: undefined as any,
    top: undefined as any,
    bottom: undefined as any,
    triggerTop: undefined as any,
    triggerBottom: undefined as any,
    offsetTop: undefined as any,
    offsetBottom: undefined as any,
  },
)

defineSlots<{
  /** `SnAnchorLink` children. */
  default?(): unknown
}>()

const propsRef = props

interface LinkInfo {
  top: number
  height: number
  href: string
}

const selfRef = ref<HTMLElement | null>(null)
const barRef = ref<HTMLElement | null>(null)
const slotRef = ref<HTMLElement | null>(null)
const activeHrefRef = ref<string | null>(null)

const collectedLinkHrefs: string[] = []
const titleEls: HTMLElement[] = []

/** Suppresses the scroll handler while a link-triggered jump is settling. */
let skipScrollHandling = false

const isBlockType = computed(() => props.type === 'block')
const mergedShowRail = computed(() => !isBlockType.value && props.showRail)

// ---------- Rail positioning ----------

/** Kill transitions for one frame so programmatic jumps do not animate. */
function disableTransitionOneTick(): void {
  const barEl = barRef.value
  const slotEl = slotRef.value
  if (barEl) barEl.style.transition = 'none'
  if (slotEl) slotEl.style.transition = 'none'
  for (const titleEl of titleEls) titleEl.style.transition = 'none'

  void nextTick(() => {
    const nextBarEl = barRef.value
    const nextSlotEl = slotRef.value
    if (nextBarEl) {
      void nextBarEl.offsetWidth
      nextBarEl.style.transition = ''
    }
    if (nextSlotEl) {
      void nextSlotEl.offsetWidth
      nextSlotEl.style.transition = ''
    }
    for (const titleEl of titleEls) {
      void titleEl.offsetWidth
      titleEl.style.transition = ''
    }
  })
}

/** Move the rail bar (and highlight) onto `titleEl`. */
function updateBarPosition(titleEl: HTMLElement, transition = true): void {
  const barEl = barRef.value
  const slotEl = slotRef.value
  const selfEl = selfRef.value
  if (!selfEl || !barEl) return

  if (!transition) {
    barEl.style.transition = 'none'
    if (slotEl) slotEl.style.transition = 'none'
  }

  const { offsetHeight, offsetWidth } = titleEl
  const { top: linkTitleClientTop, left: linkTitleClientLeft } =
    titleEl.getBoundingClientRect()
  const { top: anchorClientTop, left: anchorClientLeft } =
    selfEl.getBoundingClientRect()
  const offsetTop = linkTitleClientTop - anchorClientTop
  const offsetLeft = linkTitleClientLeft - anchorClientLeft

  barEl.style.top = `${offsetTop}px`
  barEl.style.height = `${offsetHeight}px`
  if (slotEl) {
    slotEl.style.top = `${offsetTop}px`
    slotEl.style.height = `${offsetHeight}px`
    slotEl.style.maxWidth = `${offsetWidth + offsetLeft}px`
  }

  // Force a reflow so the position is committed before transitions resume.
  void barEl.offsetHeight
  if (slotEl) void slotEl.offsetHeight

  if (!transition) {
    barEl.style.transition = ''
    if (slotEl) slotEl.style.transition = ''
  }
}

// ---------- Scroll handling ----------

let currentThrottleTimerId: ReturnType<typeof setTimeout> | undefined
let hasTrailingThrottledTask = false
let isInThrottledPeriod = false

/** Trailing-edge throttle at 128ms, mirroring n-anchor. */
function handleScroll(): void {
  if (isInThrottledPeriod) {
    hasTrailingThrottledTask = true
    return
  }
  if (skipScrollHandling) return

  handleScrollImmediate(true)
  isInThrottledPeriod = true
  clearTimeout(currentThrottleTimerId)
  currentThrottleTimerId = setTimeout(() => {
    isInThrottledPeriod = false
    if (hasTrailingThrottledTask) {
      hasTrailingThrottledTask = false
      handleScroll()
    }
  }, 128)
}

/** Resolve the offset target prop into a concrete target. */
function resolveOffsetTarget(): OffsetTarget | null {
  const { offsetTarget } = propsRef
  if (typeof offsetTarget === 'function') return offsetTarget()
  if (typeof offsetTarget === 'string') {
    return document.querySelector<HTMLElement>(offsetTarget)
  }
  if (offsetTarget) return offsetTarget
  return document
}

/** Extract the element id from an `href` such as `#intro`, or `null`. */
function parseSectionId(href: string, anchored: boolean): string | null {
  const match = anchored ? /^#([^#]+)$/.exec(href) : /#([^#]+)$/.exec(href)
  return match?.[1] ?? null
}

/** Measure every section and pick the active link. */
function handleScrollImmediate(transition = true): void {
  const links: LinkInfo[] = []
  const offsetTarget = resolveOffsetTarget()

  for (const href of collectedLinkHrefs) {
    const id = parseSectionId(href, false)
    if (!id) continue
    const linkEl = document.getElementById(id)
    if (linkEl && offsetTarget) {
      const { top, height } = getOffset(linkEl, offsetTarget)
      links.push({ top, height, href })
    }
  }

  links.sort((a, b) => {
    // Ascending top; on a tie the shorter section wins.
    if (a.top > b.top) return 1
    if (a.top === b.top && a.height < b.height) return -1
    return -1
  })

  const currentActiveHref = activeHrefRef.value
  const { bound, ignoreGap } = propsRef

  const activeLink = links.reduce<LinkInfo | null>((prevLink, link) => {
    if (link.top + link.height < 0) {
      // Fully scrolled past the top.
      return ignoreGap ? link : prevLink
    }
    if (link.top <= bound) {
      if (prevLink === null) return link
      if (link.top === prevLink.top) {
        return link.href === currentActiveHref ? link : prevLink
      }
      return link.top > prevLink.top ? link : prevLink
    }
    return prevLink
  }, null)

  if (!transition) disableTransitionOneTick()
  activeHrefRef.value = activeLink ? activeLink.href : null
}

/** Jump to `href`'s section and mark it active. */
function setActiveHref(href: string, transition = true): void {
  const id = parseSectionId(href, true)
  if (!id) return
  const linkEl = document.getElementById(id)
  if (!linkEl) return

  skipScrollHandling = true
  activeHrefRef.value = href
  linkEl.scrollIntoView()
  if (!transition) disableTransitionOneTick()
  hasTrailingThrottledTask = false
  setTimeout(() => {
    skipScrollHandling = false
  }, 0)
}

provide(snAnchorInjectionKey, {
  activeHref: activeHrefRef,
  setActiveHref,
  updateBarPosition,
  collectedLinkHrefs,
  titleEls,
})

// Clear the highlight width when nothing is active (mirrors n-anchor).
watch(activeHrefRef, (value) => {
  if (value === null) {
    const slotEl = slotRef.value
    if (slotEl && !isBlockType.value) slotEl.style.maxWidth = '0'
  }
})

// ---------- Lifecycle ----------

function measureFromHash(): void {
  setActiveHref(window.location.hash)
  handleScrollImmediate(false)
}

onMounted(() => {
  document.addEventListener('scroll', handleScroll, true)
  measureFromHash()

  // Web fonts can reflow sections after first paint, so re-measure once they
  // are ready (mirrors n-anchor's `onFontsReady`).
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
  fonts?.ready?.then(() => {
    measureFromHash()
  })
})

// Per AGENTS.md §41 + §82 both the listener and the pending throttle are
// always released on unmount.
onBeforeUnmount(() => {
  clearTimeout(currentThrottleTimerId)
  document.removeEventListener('scroll', handleScroll, true)
})

defineExpose({
  /** Scroll to and activate the link matching `href`. */
  scrollTo: setActiveHref,
})

/** Affix props forwarded to the wrapping SnAffix. */
const affixProps = computed(() => ({
  listenTo: props.listenTo,
  top: props.top,
  bottom: props.bottom,
  triggerTop: props.triggerTop,
  triggerBottom: props.triggerBottom,
  offsetTop: props.offsetTop,
  offsetBottom: props.offsetBottom,
}))

const anchorClasses = computed(() => [
  isBlockType.value ? 'sn-anchor--block' : '',
  mergedShowRail.value ? 'sn-anchor--show-rail' : '',
])

const barClasses = computed(() =>
  activeHrefRef.value !== null ? 'sn-anchor-rail__bar--active' : '',
)
</script>

<template>
  <SnAffix v-if="affix" v-bind="affixProps">
    <div
      ref="selfRef"
      class="sn-anchor"
      data-snui-component="anchor"
      :class="anchorClasses"
    >
      <div
        v-if="mergedShowRail && showBackground"
        ref="slotRef"
        class="sn-anchor-link-background"
      />
      <div v-if="mergedShowRail" class="sn-anchor-rail">
        <div ref="barRef" class="sn-anchor-rail__bar" :class="barClasses" />
      </div>
      <slot />
    </div>
  </SnAffix>

  <div
    v-else
    ref="selfRef"
    class="sn-anchor"
    data-snui-component="anchor"
    :class="anchorClasses"
  >
    <div
      v-if="mergedShowRail && showBackground"
      ref="slotRef"
      class="sn-anchor-link-background"
    />
    <div v-if="mergedShowRail" class="sn-anchor-rail">
      <div ref="barRef" class="sn-anchor-rail__bar" :class="barClasses" />
    </div>
    <slot />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-anchor {
  position: relative;
  box-sizing: border-box;
}

.sn-anchor--show-rail {
  padding-left: 16px;
}

/* ---------- Rail ---------- */

.sn-anchor-rail {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  border-radius: 2px;
  background: var(--sn-web-color-border-default);
}

.sn-anchor-rail__bar {
  position: absolute;
  left: 0;
  width: 2px;
  border-radius: 2px;
  background: transparent;
  transition:
    top 0.2s ease,
    height 0.2s ease;
}

.sn-anchor-rail__bar--active {
  background: var(--sn-web-color-action-primary);
}

/* ---------- Active-link highlight ---------- */

.sn-anchor-link-background {
  position: absolute;
  right: 0;
  left: 0;
  border-radius: 4px;
  background: var(--sn-web-color-background-surface-hover);
  transition:
    top 0.2s ease,
    height 0.2s ease,
    max-width 0.2s ease;
}

.sn-anchor--block .sn-anchor-link-background {
  right: 0;
}
</style>
