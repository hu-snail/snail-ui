<script setup lang="ts">
/**
 * SnAffix — pin an element to the viewport while scrolling (AUI-WEB-NAV-006).
 *
 * Reference library: naive-ui `n-affix`
 *   (https://www.naiveui.com/zh-CN/light/components/affix)
 * Per AGENTS.md §112, props + semantics mirror n-affix 1:1.
 *
 * 1:1 parity (this version): listenTo / top / bottom / triggerTop /
 *   triggerBottom / position / offsetTop (deprecated) / offsetBottom
 *   (deprecated) / target (deprecated). Slot: default.
 *
 * Behaviour mirrors n-affix:
 *   - `triggerTop` is the threshold at which the element begins to stick;
 *     `top` is the offset it sticks at. When only one is given the other
 *     is assumed equal, which is why the merged refs fall back to each
 *     other (`triggerTop ?? offsetTop ?? top`).
 *   - The same applies to the bottom pair.
 *   - Once affixed, the element stays affixed until the scroll position
 *     crosses back over the recorded trigger point — not merely until the
 *     rect leaves the threshold. This hysteresis is what stops jitter at
 *     the boundary.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnAffix :trigger-top="80" :top="80">
 *     <SnButton>固定在顶部</SnButton>
 *   </SnAffix>
 */

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({ name: 'SnAffix' })

/** Anything the affix can listen to for scroll events. */
export type SnAffixScrollTarget = Window | Document | HTMLElement

const props = withDefaults(
  defineProps<{
    /** Scroll container to observe. Defaults to `document`. */
    listenTo?:
      | string
      | SnAffixScrollTarget
      | (() => HTMLElement | Document)
    /** Offset from the viewport top when stuck. */
    top?: number
    /** Offset from the viewport bottom when stuck. */
    bottom?: number
    /** Scroll threshold that starts top-sticking. Falls back to `top`. */
    triggerTop?: number
    /** Scroll threshold that starts bottom-sticking. Falls back to `bottom`. */
    triggerBottom?: number
    /** `fixed` removes the element from flow; `absolute` keeps it in flow. */
    position?: 'fixed' | 'absolute'
    /** @deprecated Use `triggerTop` instead. Mirrors n-affix `offsetTop`. */
    offsetTop?: number
    /** @deprecated Use `triggerBottom` instead. Mirrors n-affix `offsetBottom`. */
    offsetBottom?: number
    /** @deprecated Use `listenTo` instead. Mirrors n-affix `target`. */
    target?: () => HTMLElement
  }>(),
  {
    listenTo: undefined as any,
    top: undefined as any,
    bottom: undefined as any,
    triggerTop: undefined as any,
    triggerBottom: undefined as any,
    position: 'fixed',
    // Deprecated props have no default value (undefined = "not provided").
    offsetTop: undefined as any,
    offsetBottom: undefined as any,
    target: undefined as any,
  },
)

defineSlots<{
  /** The element to affix. */
  default?(): unknown
}>()

// ---------- Deprecation warnings (mirrors n-affix dev warnings) ----------

if (
  props.target !== undefined ||
  props.offsetTop !== undefined ||
  props.offsetBottom !== undefined
) {
  // eslint-disable-next-line no-console
  console.warn(
    '[SnAffix] `target` / `offset-top` / `offset-bottom` are deprecated; ' +
      'use `listen-to` / `trigger-top` / `trigger-bottom` instead.',
  )
}

// ---------- State ----------

const selfRef = ref<Element | null>(null)
const stickToTop = ref(false)
const stickToBottom = ref(false)
/** Scroll positions at which each direction stops being affixed. Recorded
 *  when affixing starts, so the element un-affixes exactly at the point it
 *  affixed — this is the hysteresis that prevents boundary jitter. */
const topAffixedTriggerScrollTop = ref<number | null>(null)
const bottomAffixedTriggerScrollTop = ref<number | null>(null)

/** Exposed for testing / programmatic checks (mirrors n-affix `affixed`). */
const affixed = computed(() => stickToTop.value || stickToBottom.value)

/** Threshold at which top-sticking begins. */
const mergedTriggerTop = computed(
  () => props.triggerTop ?? props.offsetTop ?? props.top,
)
/** Offset applied while stuck to the top. */
const mergedTop = computed(
  () => props.top ?? props.triggerTop ?? props.offsetTop,
)
/** Offset applied while stuck to the bottom. */
const mergedBottom = computed(
  () => props.bottom ?? props.triggerBottom ?? props.offsetBottom,
)
/** Threshold at which bottom-sticking begins. */
const mergedTriggerBottom = computed(
  () => props.triggerBottom ?? props.offsetBottom ?? props.bottom,
)

let scrollTarget: SnAffixScrollTarget | null = null

// ---------- Geometry helpers (mirrors n-affix utils.ts) ----------

function getScrollTop(target: SnAffixScrollTarget): number {
  return target instanceof HTMLElement ? target.scrollTop : window.scrollY
}

function getRect(target: SnAffixScrollTarget): { top: number; bottom: number } {
  return target instanceof HTMLElement
    ? target.getBoundingClientRect()
    : { top: 0, bottom: window.innerHeight }
}

function resolveScrollTarget(): SnAffixScrollTarget | null {
  const { target: getTarget, listenTo } = props
  // `target` is the deprecated spelling of `listenTo`.
  if (getTarget) return getTarget()
  if (typeof listenTo === 'function') return listenTo()
  if (typeof listenTo === 'string') {
    return (document.querySelector(listenTo) as HTMLElement | null) ?? null
  }
  if (listenTo) return listenTo
  return document
}

// ---------- Scroll handling ----------

/**
 * Coalesce scroll events into one measurement per frame.
 *
 * Note: with a `Document` target we listen on `document` but must read
 * `window.scrollY` / `window.innerHeight` for geometry (`getRect`), which
 * matches n-affix. Scroll events on `document` do fire in browsers, so no
 * separate `window` listener is needed.
 */
let frameHandle: number | null = null

function handleScroll(): void {
  if (frameHandle !== null) return
  frameHandle = requestAnimationFrame(() => {
    frameHandle = null
    measure()
  })
}

function measure(): void {
  const selfEl = selfRef.value
  if (!scrollTarget || !selfEl) return

  const scrollTop = getScrollTop(scrollTarget)

  // Already affixed: only un-affix once the scroll position crosses back
  // over the recorded trigger point.
  if (affixed.value) {
    if (
      topAffixedTriggerScrollTop.value !== null &&
      scrollTop < topAffixedTriggerScrollTop.value
    ) {
      stickToTop.value = false
      topAffixedTriggerScrollTop.value = null
    }
    if (
      bottomAffixedTriggerScrollTop.value !== null &&
      scrollTop > bottomAffixedTriggerScrollTop.value
    ) {
      stickToBottom.value = false
      bottomAffixedTriggerScrollTop.value = null
    }
    return
  }

  const containerRect = getRect(scrollTarget)
  const affixRect = selfEl.getBoundingClientRect()
  const pxToTop = affixRect.top - containerRect.top
  const pxToBottom = containerRect.bottom - affixRect.bottom

  const triggerTop = mergedTriggerTop.value
  const triggerBottom = mergedTriggerBottom.value

  if (triggerTop !== undefined && pxToTop <= triggerTop) {
    stickToTop.value = true
    // Remember where to release: the scroll position offset by how far
    // past the threshold we already were.
    topAffixedTriggerScrollTop.value = scrollTop - (triggerTop - pxToTop)
  } else {
    stickToTop.value = false
    topAffixedTriggerScrollTop.value = null
  }

  if (triggerBottom !== undefined && pxToBottom <= triggerBottom) {
    stickToBottom.value = true
    bottomAffixedTriggerScrollTop.value = scrollTop + triggerBottom - pxToBottom
  } else {
    stickToBottom.value = false
    bottomAffixedTriggerScrollTop.value = null
  }
}

// ---------- Lifecycle ----------

function cleanup(): void {
  if (frameHandle !== null) {
    cancelAnimationFrame(frameHandle)
    frameHandle = null
  }
  if (scrollTarget) {
    scrollTarget.removeEventListener('scroll', handleScroll)
    scrollTarget = null
  }
}

function init(): void {
  scrollTarget = resolveScrollTarget()
  if (!scrollTarget) return
  scrollTarget.addEventListener('scroll', handleScroll)
  measure()
}

onMounted(init)
// Per AGENTS.md §41 + §82, every listener registered here is removed on
// unmount so a long-lived page cannot leak scroll handlers.
onBeforeUnmount(cleanup)

/** Positioning applied only while actually stuck. */
const mergedStyle = computed(() => {
  const style: Record<string, string> = {}
  if (
    stickToTop.value &&
    mergedTriggerTop.value !== undefined &&
    mergedTop.value !== undefined
  ) {
    style.top = `${mergedTop.value}px`
  }
  if (
    stickToBottom.value &&
    mergedTriggerBottom.value !== undefined &&
    mergedBottom.value !== undefined
  ) {
    style.bottom = `${mergedBottom.value}px`
  }
  return style
})

defineExpose({ affixed })
</script>

<template>
  <div
    ref="selfRef"
    data-snui-component="affix"
    class="sn-affix"
    :class="[
      affixed ? 'sn-affix--affixed' : '',
      position === 'absolute' ? 'sn-affix--absolute-positioned' : '',
    ]"
    :style="mergedStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-affix {
  /* Base state has no positioning; the wrapper is a plain in-flow box
   * until it sticks, which mirrors n-affix. */
  position: relative;
}

.sn-affix--affixed {
  position: fixed;
  /* Keep the stuck element from being clipped by a positioned ancestor's
   * stacking context. */
  z-index: 10;
}

.sn-affix--affixed.sn-affix--absolute-positioned {
  position: absolute;
}
</style>
