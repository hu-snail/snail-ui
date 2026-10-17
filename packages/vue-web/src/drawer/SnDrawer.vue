<script setup lang="ts">
/**
 * SnDrawer — slide-in side panel with a mask (AUI-WEB-FB-003).
 *
 * Reference library: naive-ui `n-drawer`
 *   (https://www.naiveui.com/zh-CN/light/components/drawer)
 * Per AGENTS.md §112, props + semantics mirror n-drawer 1:1.
 *
 * 1:1 parity (this version): show / width / height / placement /
 *   maskClosable / showMask / to / displayDirective / nativeScrollbar /
 *   zIndex / onMaskClick / contentClass / contentStyle / onEsc / closeOnEsc /
 *   blockScroll / onAfterEnter / onAfterLeave / 'onUpdate:show'.
 *
 *   Content is always supplied by the caller through the default slot,
 *   normally as a `<SnDrawerContent>`. Upstream `n-drawer` has no `title` /
 *   `closable` props either — those live on `n-drawer-content` — so
 *   SnDrawer deliberately declares no such shortcut. An empty default slot
 *   renders an empty panel, same as upstream.
 * Scope split vs upstream:
 *   Upstream splits the feature across `n-drawer` (teleport + mask +
 *   body wrapper + focus trap) and `n-drawer-content` (header / body /
 *   footer + close button). Both ship here as **SnDrawer** +
 *   **SnDrawerContent**, with `<SnDrawerContent>` finding its parent through
 *   `provide`/`inject` — same contract as upstream's `drawerInjectionKey`.
 *
 * Divergence from n-drawer (documented):
 *   - Upstream reads ~25 `--n-*` vars from a JS theme object; this library
 *     reads `--sn-web-drawer-*` from CSS, so the panel emits no inline theme
 *     style.
 *   - Upstream scrolls the body through `NScrollbar` when
 *     `nativeScrollbar={false}`. This version always uses the native
 *     scrollbar path and does not bundle a virtual scrollbar; the
 *     `nativeScrollbar` prop is accepted for API parity and gates the same
 *     CSS hook (`--native-scrollbar`) so callers can style it, but both
 *     values render the native container. See §112 future markers.
 *   - Upstream locks `<html>` scroll and traps focus via `vueuc`. This
 *     version locks scroll itself and leaves focus trapping to a later item
 *     (the same gap SnDialog records).
 *
 * Behaviour mirrors n-drawer:
 *   - `placement` positions the panel and picks which dimension
 *     `width`/`height` applies to: `left`/`right` use `width`, `top`/`bottom`
 *     use `height`. The other dimension is ignored.
 *   - `width`/`height` accept a number (px) or a CSS length string.
 *   - `showMask` defaults to `true`; `'transparent'` keeps the mask mounted
 *     (it still swallows clicks) but paints it invisible.
 *   - The mask closes the drawer when `maskClosable`, and `onMaskClick`
 *     always fires regardless.
 *   - `Escape` closes when `closeOnEsc`; `onEsc` always fires.
 *   - `displayDirective: 'if'` unmounts the panel after the leave
 *     transition; `'show'` keeps it in the DOM with `v-show`.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnDrawer v-model:show="open">
 *     <SnDrawerContent title="设置" closable>…</SnDrawerContent>
 *   </SnDrawer>
 *   <SnDrawer v-model:show="open" placement="bottom" :height="300">…</SnDrawer>
 */

import {
  computed,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  watch,
  type CSSProperties,
} from 'vue'
import { SN_DRAWER_INJECTION_KEY, type SnDrawerApi } from './drawer-context'

defineOptions({ name: 'SnDrawer' })

/** `n-drawer` placement values. */
export type SnDrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

/** `n-drawer` displayDirective values. */
export type SnDrawerDisplayDirective = 'if' | 'show'

/**
 * Subset of upstream's `ScrollbarProps` that has an effect on the native
 * scroll container this library renders. The virtual-scrollbar geometry
 * props (`size` / `railColor` / …) do not apply and are ignored.
 */
export interface SnDrawerScrollbarProps {
  /** When the scrollbar should be visible. Mirrors Scrollbar `trigger`. */
  trigger?: 'hover' | 'none'
  /** Allow horizontal scrolling. Mirrors Scrollbar `xScrollable`. */
  xScrollable?: boolean
  /** Fired on container scroll. Mirrors Scrollbar `onScroll`. */
  onScroll?: (e: Event) => void
}

const props = withDefaults(
  defineProps<{
    /** Visibility. Mirrors n-drawer `show`. */
    show?: boolean
    /** Panel width. Applies to `left`/`right`. Number is px. */
    width?: number | string
    /** Panel height. Applies to `top`/`bottom`. Number is px. */
    height?: number | string
    /** Which edge the panel slides in from. */
    placement?: SnDrawerPlacement
    /** Close the drawer when the mask is clicked. */
    maskClosable?: boolean
    /** Render the mask; `'transparent'` keeps it clickable but invisible. */
    showMask?: boolean | 'transparent'
    /** Teleport target. Mirrors n-drawer `to`. */
    to?: string | HTMLElement
    /** `'if'` unmounts after leaving; `'show'` keeps the node. */
    displayDirective?: SnDrawerDisplayDirective
    /**
     * Accepted for API parity. Upstream swaps to a virtual scrollbar when
     * `false`; this version renders the native container either way but
     * still applies the `--native-scrollbar` class hook. See §112 markers.
     */
    nativeScrollbar?: boolean
    /**
     * Fallback size used before any drag resize happens, and as the initial
     * value when neither `width` nor `height` is set. Number is px.
     * Mirrors n-drawer `defaultWidth` / `defaultHeight` (both 251 upstream).
     */
    defaultWidth?: number | string
    /** Vertical counterpart of `defaultWidth`. See above. */
    defaultHeight?: number | string
    /**
     * Let the user drag the inner edge to resize the panel. Upstream emits
     * `update:width` / `update:height` on drag, which the host binds back so
     * it owns the resulting size. Mirrors n-drawer `resizable`. Default false.
     */
    resizable?: boolean
    /** Upper drag bound, in px. Only meaningful with `resizable`. */
    maxWidth?: number
    /** Upper drag bound, in px. Only meaningful with `resizable`. */
    maxHeight?: number
    /** Lower drag bound, in px. Only meaningful with `resizable`. */
    minWidth?: number
    /** Lower drag bound, in px. Only meaningful with `resizable`. */
    minHeight?: number
    /**
     * Focus the first focusable element inside the panel once it opens.
     * Mirrors n-drawer `autoFocus`. Default true.
     */
    autoFocus?: boolean
    /**
     * Cycle Tab / Shift+Tab inside the panel so focus cannot escape to the
     * page behind the mask. Mirrors n-drawer `trapFocus`. Default true;
     * upstream force-disables it when `showMask` is `false`.
     */
    trapFocus?: boolean
    /**
     * Passed through to the scroll container. Upstream models a full virtual
     * scrollbar (`ScrollbarProps`); this version applies the scroll-related
     * subset (`trigger` / `xScrollable` / `onScroll`) and ignores the rest.
     */
    scrollbarProps?: SnDrawerScrollbarProps
    /** Stacking order of the overlay. */
    zIndex?: number
    /**
     * Called on mask click (fires before the close). Delivered through the
     * `mask-click` emit — Vue maps `mask-click` onto this prop name, so do not
     * call it manually after emitting or the handler runs twice.
     */
    onMaskClick?: (e: MouseEvent) => void
    /** Extra class on the scroll container. */
    contentClass?: string
    /** Extra style on the scroll container. */
    contentStyle?: string | CSSProperties
    /** Called on Escape (fires before the close). */
    onEsc?: () => void
    /** Close the drawer when Escape is pressed. */
    closeOnEsc?: boolean
    /** Lock `<html>` scroll while open. */
    blockScroll?: boolean
    /** Called after the enter transition finishes. */
    onAfterEnter?: () => void
    /** Called after the leave transition finishes. */
    onAfterLeave?: () => void
  }>(),
  {
    show: false,
    width: undefined as any,
    height: undefined as any,
    placement: 'right',
    maskClosable: true,
    showMask: true,
    to: undefined as any,
    displayDirective: 'if',
    nativeScrollbar: true,
    defaultWidth: 251,
    defaultHeight: 251,
    resizable: false,
    maxWidth: undefined as any,
    maxHeight: undefined as any,
    minWidth: undefined as any,
    minHeight: undefined as any,
    autoFocus: true,
    trapFocus: true,
    scrollbarProps: undefined as any,
    zIndex: undefined as any,
    onMaskClick: undefined as any,
    contentClass: undefined as any,
    contentStyle: undefined as any,
    onEsc: undefined as any,
    closeOnEsc: true,
    blockScroll: true,
    onAfterEnter: undefined as any,
    onAfterLeave: undefined as any,
  },
)

const emit = defineEmits<{
  /** Visibility changed. Mirrors n-drawer `onUpdate:show`. */
  (e: 'update:show', value: boolean): void
  /** Enter transition finished. */
  (e: 'after-enter'): void
  /** Leave transition finished. */
  (e: 'after-leave'): void
  /** Mask clicked. */
  (e: 'mask-click', event: MouseEvent): void
  /** Escape pressed. */
  (e: 'esc'): void
  /** Drag-resize produced a new width. Mirrors n-drawer `onUpdateWidth`. */
  (e: 'update:width', value: number): void
  /** Drag-resize produced a new height. Mirrors n-drawer `onUpdateHeight`. */
  (e: 'update:height', value: number): void
}>()

const slots = defineSlots<{
  /** Drawer content. Usually a `<SnDrawerContent>`. */
  default?(): unknown
}>()

/**
 * Kept mounted while the leave transition plays, so the exit animation has a
 * host. Mirrors upstream's `displayedRef` + `watchEffect(props.show)`.
 */
const displayed = ref(props.show === true)

watch(
  () => props.show,
  (value) => {
    if (value) displayed.value = true
  },
)

const isVertical = computed(
  () => props.placement === 'top' || props.placement === 'bottom',
)

/* ── Resize state ─────────────────────────────────────────────────────────
 * The host owns the committed size (it receives `update:width` /
 * `update:height`). While a drag is in flight we keep the live value locally
 * so the panel follows the pointer without waiting for a parent re-render.
 * `null` means "no drag yet" — the prop (or `defaultWidth` fallback) wins. */
const dragSize = ref<number | null>(null)

/** Committed size for the current axis, resolved from prop → default → none. */
const resolvedSize = computed<number | string | undefined>(() => {
  if (dragSize.value !== null) return dragSize.value
  const propValue = isVertical.value ? props.height : props.width
  if (propValue !== undefined) return propValue
  // `defaultWidth` / `defaultHeight` are the resize gesture's starting point.
  // Upstream only consults them when resizing is enabled — an unresizable
  // drawer with no explicit size must fall through to the stylesheet.
  if (!props.resizable) return undefined
  return isVertical.value ? props.defaultHeight : props.defaultWidth
})

/** `width` only participates for horizontal placements — same as upstream. */
const styleWidth = computed(() =>
  isVertical.value ? '' : formatLength(resolvedSize.value),
)

/** `height` only participates for vertical placements — same as upstream. */
const styleHeight = computed(() =>
  isVertical.value ? formatLength(resolvedSize.value) : '',
)

const mergedBodyStyle = computed(() => ({
  width: styleWidth.value,
  height: styleHeight.value,
}))

/** `'if'` → v-if semantics; `'show'` → keeps the node through `displayed`. */
const shouldRender = computed(
  () => props.displayDirective === 'show' || displayed.value || props.show === true,
)

const maskVisible = computed(() => props.show === true)

const isInvisibleMask = computed(() => props.showMask === 'transparent')

const containerStyle = computed(() =>
  props.zIndex === undefined ? undefined : { zIndex: props.zIndex },
)

/**
 * A number is a px length; a string is passed through untouched. An absent
 * value yields '' so the stylesheet default applies instead of an empty
 * inline declaration.
 */
function formatLength(value: number | string | undefined): string {
  if (value === undefined || value === '') return ''
  return typeof value === 'number' ? `${value}px` : value
}

function doUpdateShow(show: boolean): void {
  emit('update:show', show)
}

// Exposed to a descendant `<SnDrawerContent>` so its close button can ask
// this drawer to hide — the same contract as upstream's `drawerInjectionKey`.
provide<SnDrawerApi>(SN_DRAWER_INJECTION_KEY, { doUpdateShow })

// `emit('mask-click', e)` already routes into an `onMaskClick` prop (Vue maps
// `foo-bar` -> `onFooBar`), so the prop must NOT be invoked manually here —
// doing both fires the caller's handler twice.
function handleMaskClick(e: MouseEvent): void {
  if (props.maskClosable) {
    doUpdateShow(false)
  }
  emit('mask-click', e)
}

function handleEsc(e: KeyboardEvent): void {
  emit('esc')
  // `isComposing` guard: an Escape pressed to cancel IME composition must not
  // dismiss the drawer (upstream uses `useIsComposing` for the same reason).
  if (props.show === true && props.closeOnEsc && !e.isComposing) {
    doUpdateShow(false)
  }
}

function handleAfterEnter(): void {
  emit('after-enter')
}

function handleAfterLeave(): void {
  displayed.value = false
  emit('after-leave')
}

// ── Scroll lock ──────────────────────────────────────────────────────────
// Lock <html> while open and restore the *previous* inline value on release,
// so a pre-existing `overflow: hidden` set by the host is not clobbered.

let memoizedHtmlOverflow: string | null = null
let isScrollLocked = false

watch(
  () => props.blockScroll === true && props.show === true,
  (shouldLock) => {
    if (typeof document === 'undefined') return
    if (shouldLock && !isScrollLocked) {
      memoizedHtmlOverflow = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
      isScrollLocked = true
    } else if (!shouldLock && isScrollLocked) {
      document.documentElement.style.overflow = memoizedHtmlOverflow ?? ''
      isScrollLocked = false
    }
  },
  { immediate: true },
)

/* ── Drag resize ──────────────────────────────────────────────────────────
 * Enabled by `resizable`. The handle sits on the inner edge of the panel
 * (right edge for `left` placement, left edge for `right`, and the mirrored
 * pair for `top` / `bottom`). Pointer events are attached to the handle and
 * to `document` for the duration of the drag, so the pointer may leave the
 * panel without losing the gesture. */
const panelEl = ref<HTMLElement | null>(null)
const isDragging = ref(false)

/** In-flight drag origin: pointer position and panel size at pointerdown. */
let dragOrigin: { pointer: number; size: number } | null = null

/** Clamp a candidate size into the configured min / max bounds. */
function clampSize(size: number): number {
  const min = isVertical.value ? props.minHeight : props.minWidth
  const max = isVertical.value ? props.maxHeight : props.maxWidth
  let out = size
  if (isVertical.value) {
    if (typeof min === 'number') out = Math.max(min, out)
    if (typeof max === 'number') out = Math.min(max, out)
  }
  else {
    if (typeof min === 'number') out = Math.max(min, out)
    if (typeof max === 'number') out = Math.min(max, out)
  }
  return out
}

function onDragMove(e: PointerEvent): void {
  if (!dragOrigin) return
  const pointer = isVertical.value ? e.clientY : e.clientX
  // Which direction grows the panel depends on which edge it is anchored to.
  const growsWithPointer
    = props.placement === 'right' || props.placement === 'bottom'
  const delta = growsWithPointer
    ? dragOrigin.pointer - pointer
    : pointer - dragOrigin.pointer
  dragSize.value = clampSize(dragOrigin.size + delta)
}

function onDragEnd(): void {
  if (!dragOrigin) return
  dragOrigin = null
  isDragging.value = false
  document.removeEventListener('pointermove', onDragMove)
  document.removeEventListener('pointerup', onDragEnd)
  document.removeEventListener('pointercancel', onDragEnd)
  // Commit to the host — it owns the authoritative size.
  const size = dragSize.value
  if (typeof size === 'number') {
    if (isVertical.value) emit('update:height', size)
    else emit('update:width', size)
  }
}

function onDragStart(e: PointerEvent): void {
  if (!props.resizable) return
  const panel = panelEl.value
  if (!panel) return
  const rect = panel.getBoundingClientRect()
  dragOrigin = {
    pointer: isVertical.value ? e.clientY : e.clientX,
    size: isVertical.value ? rect.height : rect.width,
  }
  isDragging.value = true
  document.addEventListener('pointermove', onDragMove)
  document.addEventListener('pointerup', onDragEnd)
  document.addEventListener('pointercancel', onDragEnd)
}

/** Keyboard resize: arrow keys nudge by 16px, Home/End jump to min/max. */
function onDragKeydown(e: KeyboardEvent): void {
  if (!props.resizable) return
  const panel = panelEl.value
  if (!panel) return
  // Prefer the resolved size over a measurement: the panel may be mid-layout
  // (or, in a test environment, have a zeroed rect) while the committed size
  // is already known.
  const current = typeof resolvedSize.value === 'number'
    ? resolvedSize.value
    : (() => {
        const rect = panel.getBoundingClientRect()
        return isVertical.value ? rect.height : rect.width
      })()
  const step = 16
  const growKey = isVertical.value ? 'ArrowDown' : 'ArrowRight'
  const shrinkKey = isVertical.value ? 'ArrowUp' : 'ArrowLeft'
  let next: number | null = null
  if (e.key === growKey) next = current + step
  else if (e.key === shrinkKey) next = current - step
  else if (e.key === 'Home') next = clampSize(0)
  else if (e.key === 'End') {
    const bound = isVertical.value ? props.maxHeight : props.maxWidth
    if (typeof bound === 'number') next = bound
  }
  if (next === null) return
  e.preventDefault()
  const size = clampSize(next)
  dragSize.value = size
  if (isVertical.value) emit('update:height', size)
  else emit('update:width', size)
}

/* ── Focus management ─────────────────────────────────────────────────────
 * `autoFocus` moves focus to the first focusable node when the panel opens.
 * `trapFocus` keeps Tab cycling inside. Upstream force-disables the trap when
 * `showMask === false`, because there is no visual modal boundary to justify
 * stealing Tab — we mirror that. */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const isTrapFocusEnabled = computed(
  () => props.trapFocus && props.showMask !== false,
)

function focusableNodes(): HTMLElement[] {
  const panel = panelEl.value
  if (!panel) return []
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((el) => el.offsetParent !== null || el === document.activeElement)
}

/** Remember what had focus before opening so it can be restored on close. */
let previouslyFocused: HTMLElement | null = null

function handlePanelKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    handleEsc(e)
    return
  }
  if (e.key !== 'Tab' || !isTrapFocusEnabled.value) return
  const nodes = focusableNodes()
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  if (!first || !last) {
    // Nothing focusable inside — hold focus on the panel itself.
    e.preventDefault()
    return
  }
  const active = document.activeElement
  if (e.shiftKey) {
    if (active === first || active === panelEl.value) {
      e.preventDefault()
      last.focus()
    }
  }
  else if (active === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(
  () => props.show,
  async (open) => {
    if (typeof document === 'undefined') return
    if (open) {
      if (props.autoFocus) {
        previouslyFocused = document.activeElement as HTMLElement | null
        await nextTick()
        const [first] = focusableNodes()
        // Fall back to the panel itself so the trap has an anchor even when
        // the drawer carries no interactive content.
        ;(first ?? panelEl.value)?.focus()
      }
    }
    else if (previouslyFocused) {
      previouslyFocused.focus?.()
      previouslyFocused = null
    }
  },
)

onBeforeUnmount(() => {
  if (isScrollLocked && typeof document !== 'undefined') {
    document.documentElement.style.overflow = memoizedHtmlOverflow ?? ''
    isScrollLocked = false
  }
  // A drag in flight outlives the component otherwise — the document
  // listeners would keep firing against a detached panel.
  document.removeEventListener('pointermove', onDragMove)
  document.removeEventListener('pointerup', onDragEnd)
  document.removeEventListener('pointercancel', onDragEnd)
})
</script>

<template>
  <Teleport :to="to ?? 'body'">
    <div
      v-show="show === true"
      class="sn-drawer-container"
      :style="containerStyle"
      role="none"
    >
      <div
        v-if="shouldRender"
        class="sn-drawer-viewport"
        role="none"
        @keydown="handlePanelKeydown"
      >
        <Transition name="sn-fade" appear>
          <div
            v-if="showMask !== false && maskVisible"
            aria-hidden="true"
            class="sn-drawer-mask"
            :class="isInvisibleMask && 'sn-drawer-mask--invisible'"
            @click="handleMaskClick"
          />
        </Transition>

        <Transition
          :name="`sn-drawer-slide-${placement}`"
          appear
          @after-enter="handleAfterEnter"
          @after-leave="handleAfterLeave"
        >
          <div
            v-if="displayDirective === 'show' ? displayed : show === true"
            v-show="displayDirective === 'show' ? show === true : true"
            ref="panelEl"
            data-snui-component="SnDrawer"
            class="sn-drawer"
            :class="[
              `sn-drawer--${placement}-placement`,
              nativeScrollbar && 'sn-drawer--native-scrollbar',
              isDragging && 'sn-drawer--resizing',
            ]"
            role="dialog"
            aria-modal="true"
            :tabindex="isTrapFocusEnabled ? -1 : undefined"
            :style="mergedBodyStyle"
          >
            <div
              v-if="resizable"
              class="sn-drawer__resize-handle"
              :class="`sn-drawer__resize-handle--${placement}`"
              role="separator"
              :aria-orientation="isVertical ? 'horizontal' : 'vertical'"
              :aria-label="isVertical ? '拖拽调整高度' : '拖拽调整宽度'"
              :tabindex="0"
              @pointerdown="onDragStart"
              @keydown="onDragKeydown"
            />

            <div
              class="sn-drawer-content-wrapper"
              :class="contentClass"
              :style="contentStyle"
              role="none"
              :data-scroll-trigger="scrollbarProps?.trigger"
              :data-x-scrollable="scrollbarProps?.xScrollable || undefined"
              v-on="scrollbarProps?.onScroll ? { scroll: scrollbarProps.onScroll } : {}"
            >
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-drawer-container {
  position: fixed;
  inset: 0;
  /* Above page content by default; `zIndex` overrides this inline. Upstream
   * gets the same effect from `v-zindexable`. */
  z-index: 1000;
  pointer-events: none;
}

.sn-drawer-container > * {
  pointer-events: all;
}

.sn-drawer-viewport {
  position: absolute;
  inset: 0;
}

.sn-drawer-mask {
  position: absolute;
  inset: 0;
  background: var(--sn-web-drawer-mask-color);
}

.sn-drawer-mask--invisible {
  background: transparent;
}

.sn-drawer {
  position: absolute;
  box-sizing: border-box;
  word-break: break-word;
  line-height: var(--sn-web-drawer-line-height);
  background: var(--sn-web-drawer-color);
  color: var(--sn-web-drawer-text-color);
  box-shadow: var(--sn-web-drawer-box-shadow);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.sn-drawer-content-wrapper {
  box-sizing: border-box;
  height: 100%;
}

.sn-drawer--native-scrollbar .sn-drawer-content-wrapper {
  overflow: auto;
  height: 100%;
}

/* ── resize handle ──────────────────────────────────────────────────────
 * A thin grab strip on the inner edge. The visible line only appears on
 * hover / focus / active drag so the panel stays clean at rest. The hit
 * area is widened past the visual line via padding-box sizing. */

.sn-drawer__resize-handle {
  position: absolute;
  z-index: 1;
  background: transparent;
  border: none;
  padding: 0;
  touch-action: none;
}

.sn-drawer__resize-handle::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  background: var(--sn-web-drawer-resize-line-color, var(--sn-web-color-border-default));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.sn-drawer__resize-handle:hover::after,
.sn-drawer__resize-handle:focus-visible::after,
.sn-drawer--resizing .sn-drawer__resize-handle::after {
  opacity: 1;
}

.sn-drawer__resize-handle:focus-visible {
  outline: 2px solid var(--sn-web-color-action-primary);
  outline-offset: -2px;
}

/* Horizontal placements: vertical strip on the inner edge. */
.sn-drawer__resize-handle--left,
.sn-drawer__resize-handle--right {
  top: 0;
  bottom: 0;
  width: 12px;
  cursor: col-resize;
}
.sn-drawer__resize-handle--left { right: -6px; }
.sn-drawer__resize-handle--right { left: -6px; }

.sn-drawer__resize-handle--left::after,
.sn-drawer__resize-handle--right::after {
  width: 2px;
  height: 100%;
}

/* Vertical placements: horizontal strip on the inner edge. */
.sn-drawer__resize-handle--top,
.sn-drawer__resize-handle--bottom {
  left: 0;
  right: 0;
  height: 12px;
  cursor: row-resize;
}
.sn-drawer__resize-handle--top { bottom: -6px; }
.sn-drawer__resize-handle--bottom { top: -6px; }

.sn-drawer__resize-handle--top::after,
.sn-drawer__resize-handle--bottom::after {
  height: 2px;
  width: 100%;
}

/* Suppress the panel's own transition while dragging so the edge tracks
 * the pointer without lag. */
.sn-drawer--resizing {
  transition: none;
  user-select: none;
}

/* ── placement ──────────────────────────────────────────────────────── */

.sn-drawer--right-placement {
  top: 0;
  bottom: 0;
  right: 0;
  border-top-left-radius: var(--sn-web-drawer-radius);
  border-bottom-left-radius: var(--sn-web-drawer-radius);
}

.sn-drawer--left-placement {
  top: 0;
  bottom: 0;
  left: 0;
  border-top-right-radius: var(--sn-web-drawer-radius);
  border-bottom-right-radius: var(--sn-web-drawer-radius);
}

.sn-drawer--top-placement {
  top: 0;
  left: 0;
  right: 0;
  border-bottom-left-radius: var(--sn-web-drawer-radius);
  border-bottom-right-radius: var(--sn-web-drawer-radius);
}

.sn-drawer--bottom-placement {
  bottom: 0;
  left: 0;
  right: 0;
  border-top-left-radius: var(--sn-web-drawer-radius);
  border-top-right-radius: var(--sn-web-drawer-radius);
}

/* ── transitions ────────────────────────────────────────────────────── */

/* Mask: plain overlay fade, 200ms ease both ways (same curve family as the
 * dialog mask). The fade classes are shared under the `sn-fade` name so the
 * upcoming dialog overlay (FB-002) can reuse them. */

.sn-fade-enter-active,
.sn-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sn-fade-enter-from,
.sn-fade-leave-to {
  opacity: 0;
}

/* Panel: slides in from the placement edge while fading, on the same
 * decelerating bezier as the dialog pop. Enter (260ms) runs longer than
 * leave (200ms) so opening feels weighted and closing feels snappy. */

.sn-drawer-slide-right-enter-active,
.sn-drawer-slide-left-enter-active,
.sn-drawer-slide-top-enter-active,
.sn-drawer-slide-bottom-enter-active {
  transition:
    transform 0.26s cubic-bezier(0, 0, 0.2, 1),
    opacity 0.26s cubic-bezier(0, 0, 0.2, 1);
}

.sn-drawer-slide-right-leave-active,
.sn-drawer-slide-left-leave-active,
.sn-drawer-slide-top-leave-active,
.sn-drawer-slide-bottom-leave-active {
  transition:
    transform 0.2s cubic-bezier(0, 0, 0.2, 1),
    opacity 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.sn-drawer-slide-right-enter-from,
.sn-drawer-slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.sn-drawer-slide-left-enter-from,
.sn-drawer-slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.sn-drawer-slide-top-enter-from,
.sn-drawer-slide-top-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.sn-drawer-slide-bottom-enter-from,
.sn-drawer-slide-bottom-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
