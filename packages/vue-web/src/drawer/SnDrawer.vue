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
 *   onAfterEnter / onAfterLeave / 'onUpdate:show'.
 *
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
 *   <SnDrawer v-model:show="open" title="设置">…</SnDrawer>
 *   <SnDrawer v-model:show="open" placement="bottom" :height="300">…</SnDrawer>
 */

import {
  computed,
  onBeforeUnmount,
  provide,
  ref,
  watch,
  type CSSProperties,
} from 'vue'
import SnDrawerContent from './SnDrawerContent.vue'
import { SN_DRAWER_INJECTION_KEY, type SnDrawerApi } from './drawer-context'

defineOptions({ name: 'SnDrawer' })

/** `n-drawer` placement values. */
export type SnDrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

/** `n-drawer` displayDirective values. */
export type SnDrawerDisplayDirective = 'if' | 'show'

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
    to?: string | HTMLElement    /** `'if'` unmounts after leaving; `'show'` keeps the node. */
    displayDirective?: SnDrawerDisplayDirective
    /**
     * Accepted for API parity. Upstream swaps to a virtual scrollbar when
     * `false`; this version renders the native container either way but
     * still applies the `--native-scrollbar` class hook. See §112 markers.
     */
    nativeScrollbar?: boolean
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
    /** Title. Convenience pass-through to `<SnDrawerContent>`. */
    title?: string
    /** Show the header close button. Convenience pass-through. */
    closable?: boolean
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
    zIndex: undefined as any,
    onMaskClick: undefined as any,
    contentClass: undefined as any,
    contentStyle: undefined as any,
    onEsc: undefined as any,
    closeOnEsc: true,
    blockScroll: true,
    onAfterEnter: undefined as any,
    onAfterLeave: undefined as any,
    title: undefined as any,
    closable: true,
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

/** `width` only participates for horizontal placements — same as upstream. */
const styleWidth = computed(() =>
  isVertical.value ? '' : formatLength(props.width),
)

/** `height` only participates for vertical placements — same as upstream. */
const styleHeight = computed(() =>
  isVertical.value ? formatLength(props.height) : '',
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

/** Panel-level keydown — the wrapper only exists while the drawer is open. */
function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') handleEsc(e)
}

function handleAfterEnter(): void {
  emit('after-enter')
}

function handleAfterLeave(): void {
  displayed.value = false
  emit('after-leave')
}

/**
 * Pass-throughs for the built-in `<SnDrawerContent>` fallback. Narrowed to
 * definite values because the child's optional props reject an explicit
 * `undefined` under `exactOptionalPropertyTypes`.
 */
const fallbackTitle = computed(() => props.title ?? '')
const fallbackClosable = computed(() => props.closable === true)

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

onBeforeUnmount(() => {
  if (isScrollLocked && typeof document !== 'undefined') {
    document.documentElement.style.overflow = memoizedHtmlOverflow ?? ''
    isScrollLocked = false
  }
})
</script>

<template>
  <Teleport :to="to ?? 'body'" :disabled="to === undefined">
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
        @keydown="handleKeydown"
      >
        <Transition name="sn-drawer-fade">
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
          @after-enter="handleAfterEnter"
          @after-leave="handleAfterLeave"
        >
          <div
            v-if="displayDirective === 'show' ? displayed : show === true"
            v-show="displayDirective === 'show' ? show === true : true"
            data-snui-component="SnDrawer"
            class="sn-drawer"
            :class="[
              `sn-drawer--${placement}-placement`,
              nativeScrollbar && 'sn-drawer--native-scrollbar',
            ]"
            role="dialog"
            aria-modal="true"
            :style="mergedBodyStyle"
          >
            <div
              class="sn-drawer-content-wrapper"
              :class="contentClass"
              :style="contentStyle"
              role="none"
            >
              <slot>
                <SnDrawerContent :title="fallbackTitle" :closable="fallbackClosable" />
              </slot>
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

.sn-drawer-fade-enter-active,
.sn-drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sn-drawer-fade-enter-from,
.sn-drawer-fade-leave-to {
  opacity: 0;
}

.sn-drawer-slide-right-enter-active,
.sn-drawer-slide-right-leave-active,
.sn-drawer-slide-left-enter-active,
.sn-drawer-slide-left-leave-active {
  transition: transform 0.3s ease;
}

.sn-drawer-slide-right-enter-from,
.sn-drawer-slide-right-leave-to {
  transform: translateX(100%);
}

.sn-drawer-slide-left-enter-from,
.sn-drawer-slide-left-leave-to {
  transform: translateX(-100%);
}

.sn-drawer-slide-top-enter-active,
.sn-drawer-slide-top-leave-active,
.sn-drawer-slide-bottom-enter-active,
.sn-drawer-slide-bottom-leave-active {
  transition: transform 0.3s ease;
}

.sn-drawer-slide-top-enter-from,
.sn-drawer-slide-top-leave-to {
  transform: translateY(-100%);
}

.sn-drawer-slide-bottom-enter-from,
.sn-drawer-slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
