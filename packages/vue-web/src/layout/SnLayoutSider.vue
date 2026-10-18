<script setup lang="ts">
/**
 * SnLayoutSider — web-end layout sidebar column (AUI-WEB-LAYOUT-006).
 *
 * Reference library: naive-ui `n-layout-sider`
 *   (https://www.naiveui.com/zh-CN/light/components/layout)
 * Per AGENTS.md §112, props + semantics mirror n-layout-sider 1:1 for the
 * declared surface: width (272) / collapsedWidth / collapsed
 * (v-model:collapsed) / collapseMode ('transform' | 'width') / showTrigger
 * / bordered / reverse / position.
 *
 * Collapse model (matches n-layout-sider box semantics):
 *   - the root `<aside>` always declares `width: {width}px`; when collapsed
 *     it is clamped by `max-width: {collapsedWidth}px` (animated 0.2s), so
 *     the flex row reclaims the space in BOTH modes
 *   - collapseMode 'transform': the inner content keeps `min-width:
 *     {width}px` (DOM layout preserved) and slides out via
 *     `translateX(∓(width - collapsedWidth))`, leaving a collapsedWidth-wide
 *     strip visible on the trigger side
 *   - collapseMode 'width': no min-width / translate — the content reflows
 *     as the box narrows (width animation)
 *
 * Simplified vs naive (intentional v0.1 scope cut, see ai-description.md):
 *   - showTrigger accepts boolean | 'arrow-circle' | 'bar' (type parity)
 *     but all truthy values render the same built-in inline-SVG arrow
 *     trigger
 *   - breakpoint / collapse / extend / inverted / scrollbar props not
 *     implemented; only `update:collapsed` is emitted
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 */

import { computed, inject, ref } from 'vue'
import type { CSSProperties } from 'vue'
import { SN_LAYOUT_KEY } from './sn-layout-types'
import type { SnLayoutPosition, SnLayoutStyleValue } from './sn-layout-types'

defineOptions({ name: 'SnLayoutSider' })

// Reference: naive-ui layoutSiderProps
//   (https://github.com/tusen-ai/naive-ui/blob/main/src/layout/src/LayoutSider.tsx)
// Prop names match n-layout-sider 1:1; defaults follow the task contract
// (collapsedWidth 64). `bordered` matches naive's Boolean shorthand (false).
const props = withDefaults(
  defineProps<{
    /** Sider width (px, or any CSS length). Default 272. Mirrors
     * n-layout-sider `width`. */
    width?: number | string
    /** Width (px) when collapsed. Default 64. Mirrors n-layout-sider
     * `collapsed-width`. */
    collapsedWidth?: number
    /** Controlled collapsed state (v-model:collapsed). When omitted the
     * sider manages its own state seeded by `defaultCollapsed` (mirrors
     * naive's `collapsed: undefined` + `default-collapsed` model). */
    collapsed?: boolean | undefined
    /** Uncontrolled initial collapsed state. Default false. */
    defaultCollapsed?: boolean
    /** Collapse animation mode: 'transform' keeps the inner DOM and slides
     * it out; 'width' animates the layout width. Default 'transform'.
     * Mirrors n-layout-sider `collapse-mode`. */
    collapseMode?: 'transform' | 'width'
    /** Show the built-in collapse trigger. Mirrors n-layout-sider
     * `show-trigger` (boolean | 'arrow-circle' | 'bar'); every truthy value
     * renders the same built-in arrow trigger. Default false. */
    showTrigger?: boolean | 'arrow-circle' | 'bar'
    /** Show the 1px divider on the content-facing edge. Default false
     * (matches naive's Boolean shorthand). */
    bordered?: boolean
    /** Place the sider on the right side of the layout row. Default false. */
    reverse?: boolean
    /** Absolute positioning inside the nearest positioned ancestor (the
     * SnLayout root). Mirrors n-layout-sider `position`. Default 'static'. */
    position?: SnLayoutPosition
  }>(),
  {
    width: 272,
    collapsedWidth: 64,
    // Explicit undefined default defeats Vue's Boolean casting (absent
    // Boolean prop → false), keeping `collapsed` uncontrolled when omitted.
    // Mirrors naive-ui's `collapsed: { default: undefined }`.
    collapsed: undefined,
    defaultCollapsed: false,
    collapseMode: 'transform',
    showTrigger: false,
    bordered: false,
    reverse: false,
    position: 'static',
  },
)

const emit = defineEmits<{
  /** v-model:collapsed sync — fired by the built-in trigger click. */
  (e: 'update:collapsed', collapsed: boolean): void
}>()

defineSlots<{
  /** Sider body (menus, panels…). Rendered inside the scrollable content. */
  default?(): unknown
}>()

const layout = inject(SN_LAYOUT_KEY, null)

/* ─────────── collapsed state (controlled + uncontrolled) ─────────── */
const uncontrolledCollapsed = ref(props.defaultCollapsed)
const isCollapsed = computed(() => props.collapsed ?? uncontrolledCollapsed.value)

function handleTriggerClick(): void {
  const next = !isCollapsed.value
  uncontrolledCollapsed.value = next
  emit('update:collapsed', next)
}

/* ─────────── width resolution ─────────── */
/** px string for width; non-numeric CSS lengths pass through unchanged. */
const widthCss = computed<string>(() => {
  const n = Number(props.width)
  if (Number.isFinite(n) && n >= 0) return `${n}px`
  if (typeof props.width === 'string' && props.width.length > 0) return props.width
  return '272px'
})

/** Numeric width (needed for the transform shift); null for %-style. */
const widthNum = computed<number | null>(() => {
  const n = Number(props.width)
  return Number.isFinite(n) && n > 0 ? n : null
})

const collapsedWidthPx = computed<number>(() => {
  const n = Number(props.collapsedWidth)
  return Number.isFinite(n) && n >= 0 ? n : 64
})

/* ─────────── root box style ───────────
 * width stays declared; max-width clamps to collapsedWidth when collapsed
 * (n-layout-sider box semantics, animated 0.2s). */
const rootStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    width: widthCss.value,
    maxWidth: isCollapsed.value ? `${collapsedWidthPx.value}px` : widthCss.value,
    transition: 'max-width 0.2s ease',
    overflow: 'hidden',
  }
  if (props.position === 'absolute') {
    style.position = 'absolute'
    style.top = '0'
    style.bottom = '0'
    if (props.reverse) {
      style.right = '0'
    } else {
      style.left = '0'
    }
  }
  return style
})

const injectedSiderStyle = computed<SnLayoutStyleValue | undefined>(
  () => layout?.siderStyle.value,
)

/* ─────────── inner content style ───────────
 * transform mode: min-width preserves the DOM layout; the collapsed strip
 * is revealed by sliding the content toward the trigger edge. */
const contentStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
  }
  if (props.collapseMode === 'transform') {
    style.minWidth = widthCss.value
    const shift = collapsedShiftCss.value
    if (shift !== null) {
      style.transform = isCollapsed.value ? shift : 'translateX(0px)'
      style.transition = 'transform 0.2s ease'
    }
  }
  return style
})

/** Slide distance: ∓(width - collapsedWidth). Left placement slides left
 * (right strip visible); reverse slides right (left strip visible). */
const collapsedShiftCss = computed<string | null>(() => {
  if (props.collapseMode !== 'transform') return null
  const w = widthNum.value
  if (w === null) return null
  const distance = w - collapsedWidthPx.value
  return `translateX(${props.reverse ? distance : -distance}px)`
})

/* ─────────── trigger arrow orientation ───────────
 * The arrow points toward the space the sider expands into: flipped when
 * (collapsed XOR reverse). */
const arrowFlipped = computed(() => isCollapsed.value !== props.reverse)
const arrowStyle = computed<CSSProperties>(() => ({
  transform: arrowFlipped.value ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s ease',
}))
</script>

<template>
  <aside
    :class="[
      'sn-layout-sider',
      reverse ? 'sn-layout-sider--right' : 'sn-layout-sider--left',
      bordered ? 'sn-layout-sider--bordered' : '',
      isCollapsed ? 'sn-layout-sider--collapsed' : '',
      position === 'absolute' ? 'sn-layout-sider--absolute' : '',
    ]"
    :style="[rootStyle, injectedSiderStyle]"
  >
    <div class="sn-layout-sider__content" :style="contentStyle">
      <slot />
    </div>
    <button
      v-if="showTrigger"
      type="button"
      class="sn-layout-sider__trigger"
      :class="reverse
        ? 'sn-layout-sider__trigger--left-edge'
        : 'sn-layout-sider__trigger--right-edge'"
      :aria-expanded="!isCollapsed"
      aria-label="Toggle sidebar"
      @click="handleTriggerClick"
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        :style="arrowStyle"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  </aside>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-layout-sider {
  position: relative; /* anchors the built-in trigger */
  flex-shrink: 0;
  box-sizing: border-box;
}

/* Divider on the content-facing edge (bordered). */
.sn-layout-sider--left.sn-layout-sider--bordered {
  border-right: 1px solid var(--sn-web-color-border-default);
}
.sn-layout-sider--right.sn-layout-sider--bordered {
  border-left: 1px solid var(--sn-web-color-border-default);
}

.sn-layout-sider__trigger {
  position: absolute;
  top: 50%;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 50%;
  background: var(--sn-web-color-background-elevated);
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
  transform: translateY(-50%);
}
.sn-layout-sider__trigger--right-edge {
  right: 4px;
}
.sn-layout-sider__trigger--left-edge {
  left: 4px;
}
.sn-layout-sider__trigger:hover {
  color: var(--sn-web-color-text-primary);
}
.sn-layout-sider__trigger:focus-visible {
  outline: var(--sn-web-focus-ring);
  outline-offset: 2px;
}
</style>
