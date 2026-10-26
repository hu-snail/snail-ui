<script setup lang="ts">
/**
 * SnBackTop — floating "scroll back to top" button (AUI-WEB-NAV-008).
 *
 * Reference library: naive-ui `n-back-top`
 *   (https://www.naiveui.com/zh-CN/light/components/back-top)
 * Per AGENTS.md §112, props + semantics mirror n-back-top 1:1.
 *
 * 1:1 parity (this version): show (v-model:show) / right / bottom / to /
 *   visibilityHeight / listenTo / target (deprecated) / onShow
 *   (deprecated) / onHide (deprecated) / onUpdate:show. Slot: default
 *   (replaces the built-in arrow icon).
 *
 * Behaviour mirrors n-back-top:
 *   - The button appears once the scroll position reaches
 *     `visibilityHeight` (default 180).
 *   - Visibility is uncontrolled by default; passing `show` makes it
 *     controlled, and `update:show` fires on change.
 *   - The scroll container is auto-detected from the nearest scrollable
 *     ancestor; `listenTo` overrides it.
 *   - Clicking scrolls the container back to `top: 0` with smooth behaviour.
 *
 * Divergence from n-back-top (documented, not a §112 violation):
 *   - Uses the `ChevronsUp` lucide icon rather than naive-ui's inlined
 *     `BackTopIcon` SVG, matching this library's icon policy (the same
 *     choice SnAlert makes for its type icons).
 *   - Rendered inline; naive-ui teleports to `to` via `VLazyTeleport` in
 *     production builds. The `to` prop is accepted for API parity.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnBackTop :right="40" :bottom="40" :visibility-height="200" />
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLocale } from '../locales/use-locale'
import { ChevronsUp } from 'lucide-vue-next'
import SnIcon from '../icon/SnIcon.vue'

defineOptions({ name: 'SnBackTop' })

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale()

const props = withDefaults(
  defineProps<{
    /** Controlled visibility. When omitted the component manages it
     *  itself from the scroll position (`v-model:show`). */
    show?: boolean
    /** Distance from the viewport right edge. */
    right?: string | number
    /** Distance from the viewport bottom edge. */
    bottom?: string | number
    /** Element to render the button into. Accepted for API parity. */
    to?: HTMLElement | string
    /** Scroll distance after which the button appears. */
    visibilityHeight?: number
    /** Scroll container. Auto-detected when omitted. */
    listenTo?:
      | string
      | HTMLElement
      | Document
      | (() => HTMLElement | Document)
    /** @deprecated Use `listenTo` instead. Mirrors n-back-top `target`. */
    target?: () => HTMLElement
    /** Called with the new visibility (mirrors `onUpdate:show`). */
    onUpdateShow?: (value: boolean) => void
    /** @deprecated Use `onUpdate:show` instead. Mirrors n-back-top `onShow`. */
    onShow?: () => void
    /** @deprecated Use `onUpdate:show` instead. Mirrors n-back-top `onHide`. */
    onHide?: () => void
  }>(),
  {
    show: undefined as any,
    right: 40,
    bottom: 40,
    to: 'body',
    visibilityHeight: 180,
    listenTo: undefined as any,
    target: undefined as any,
    onUpdateShow: undefined as any,
    onShow: undefined as any,
    onHide: undefined as any,
  },
)

defineSlots<{
  /** Custom button content — replaces the built-in arrow icon. */
  default?(): unknown
}>()

// ---------- Deprecation warnings (mirrors n-back-top dev warnings) ----------

if (
  props.target !== undefined ||
  props.onShow !== undefined ||
  props.onHide !== undefined
) {
  // eslint-disable-next-line no-console
  console.warn(
    '[SnBackTop] `target` / `on-show` / `on-hide` are deprecated; use ' +
      '`listen-to` / `on-update:show` instead.',
  )
}

// ---------- State ----------

/** Inner element that is always rendered so the scroll container can be
 *  detected from its ancestors — mirrors n-back-top's placeholder. */
const placeholderRef = ref<HTMLElement | null>(null)

/** Uncontrolled visibility, driven by the scroll position. */
const uncontrolledShow = ref(false)

/** Effective visibility: `show` prop wins when provided. */
const mergedShow = computed(() =>
  props.show === undefined ? uncontrolledShow.value : props.show,
)

/** Whether the first geometry pass has completed. Guards `update:show` so
 *  it does not fire for the initial state. */
let domInfoReady = false

let scrollElement: HTMLElement | Document | null = null
let listenerRegistered = false

// ---------- Positioning ----------

function formatLength(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

const style = computed(() => ({
  right: formatLength(props.right),
  bottom: formatLength(props.bottom),
}))

// ---------- Scroll container resolution ----------

function isScrollable(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el)
  return /(auto|scroll|overlay)/.test(style.overflowY)
}

/** Walk up from the placeholder to the first scrollable ancestor. */
function getScrollParent(el: HTMLElement | null): HTMLElement | Document | null {
  let node: HTMLElement | null = el?.parentElement ?? null
  while (node) {
    if (node === document.body || node === document.documentElement) {
      return document
    }
    if (isScrollable(node)) return node
    node = node.parentElement
  }
  return document
}

function resolveScrollElement(): HTMLElement | Document | null {
  // `target` is the deprecated spelling of `listenTo`.
  if (props.target) return props.target()

  const { listenTo } = props
  if (typeof listenTo === 'function') return listenTo()
  if (typeof listenTo === 'string') {
    return document.querySelector<HTMLElement>(listenTo)
  }
  if (listenTo) return listenTo

  return getScrollParent(placeholderRef.value)
}

// ---------- Scroll handling ----------

/**
 * Whether the resolved container is a `Document`.
 *
 * Uses `nodeName` rather than `instanceof Document`: this component may be
 * mounted in a different realm (iframe, test DOM), where a `Document` from
 * that realm fails an `instanceof` check against the host's constructor.
 * Mirrors naive-ui's own `isDocument()` helper.
 */
function isDocumentLike(el: unknown): el is Document {
  return (el as Node | null)?.nodeName === '#document'
}

function readScrollTop(): number {
  if (!scrollElement) return 0
  return isDocumentLike(scrollElement)
    ? document.documentElement.scrollTop || window.scrollY
    : scrollElement.scrollTop
}

function handleScroll(): void {
  const scrollTop = readScrollTop()
  const next = scrollTop >= props.visibilityHeight
  uncontrolledShow.value = next
  if (!domInfoReady) {
    // Defer so the initial measurement does not emit `update:show`.
    void Promise.resolve().then(() => {
      domInfoReady = true
    })
  }
}

/** Resolve the element that actually scrolls back to the top. */
function resolveScrollTarget(): HTMLElement | null {
  return isDocumentLike(scrollElement) ? document.documentElement : scrollElement
}

function handleClick(): void {
  resolveScrollTarget()?.scrollTo({ top: 0, behavior: 'smooth' })
}

// ---------- Controlled-mode sync ----------

watch(mergedShow, (value) => {
  if (!domInfoReady) return
  props.onUpdateShow?.(value)
  // Deprecated callbacks mirror n-back-top: `onShow` fires on becoming
  // visible, `onHide` on every change (matching the upstream quirk).
  if (value) props.onShow?.()
  props.onHide?.()
})

// ---------- Lifecycle ----------

function init(): void {
  if (listenerRegistered) return
  listenerRegistered = true

  scrollElement = resolveScrollElement()
  if (!scrollElement) return

  scrollElement.addEventListener('scroll', handleScroll)
  handleScroll()
}

onMounted(init)
// Per AGENTS.md §41 + §82 the scroll listener is always removed on unmount.
onBeforeUnmount(() => {
  if (!listenerRegistered || !scrollElement) return
  scrollElement.removeEventListener('scroll', handleScroll)
  scrollElement = null
  listenerRegistered = false
})

defineExpose({
  /** Programmatically scroll the container back to the top. */
  scrollToTop: handleClick,
})
</script>

<template>
  <!-- Placeholder: never visible, but gives us a DOM anchor for detecting
       the nearest scrollable ancestor (mirrors n-back-top). -->
  <div ref="placeholderRef" class="sn-back-top-placeholder" style="display: none" aria-hidden="true" />

  <Transition name="sn-back-top-fade">
    <button
      v-if="mergedShow"
      type="button"
      data-snui-component="back-top"
      class="sn-back-top"
      :aria-label="locale.BackTop.backToTop"
      :style="style"
      @click="handleClick"
    >
      <slot>
        <SnIcon :icon="ChevronsUp" />
      </slot>
    </button>
  </Transition>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-back-top {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 22px;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
  box-shadow: var(--sn-web-card-shadow);
  transition:
    box-shadow 0.2s ease,
    color 0.2s ease;
}

.sn-back-top:hover {
  color: var(--sn-web-color-action-primary-hover);
  box-shadow: 0 4px 12px 0 color-mix(in srgb, var(--sn-web-color-text-primary) 18%, transparent);
}

.sn-back-top:active {
  color: var(--sn-web-color-action-primary);
  box-shadow: 0 4px 12px 0 color-mix(in srgb, var(--sn-web-color-text-primary) 18%, transparent);
}

.sn-back-top:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: 2px;
}

/* ---------- Fade transition ---------- */

.sn-back-top-fade-enter-active,
.sn-back-top-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.sn-back-top-fade-enter-from,
.sn-back-top-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
