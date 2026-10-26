<script setup lang="ts">
/**
 * SnSplitter — web-end splitter container (naive-ui n-splitter parity).
 *
 * Owns the percent size state of its descendant SnSplitterPanel children and
 * the drag / keyboard logic of the dividers between them. Panels register
 * through the injection context (splitter-context.ts); each panel renders its
 * own divider (except the first) as a sibling fragment node, so the flex row
 * is [panel][divider][panel][divider][panel] and percent widths stay exact
 * flex-item sizes.
 *
 * Per AGENTS.md §41/42 the document-level pointer listeners are detached on
 * drag end and on unmount. All colors flow through --sn-web-* tokens.
 */
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from 'vue'
import {
  SN_SPLITTER_INJECTION_KEY,
  SN_SPLITTER_KEYBOARD_STEP_PERCENT,
  parsePercentSize,
  round2,
} from './splitter-context'
import type {
  SnSplitterApi,
  SnSplitterBoundaryAria,
  SnSplitterPanelHandle,
  SnSplitterResizeState,
  SplitterPanelEntry,
} from './splitter-context'

defineOptions({ name: 'SnSplitter' })

const props = withDefaults(
  defineProps<{
    /** Split axis. Panels lay out in a row (horizontal) or column (vertical). */
    direction?: 'horizontal' | 'vertical'
    /** Disable all divider interaction. */
    disabled?: boolean
  }>(),
  {
    direction: 'horizontal',
    disabled: false,
  },
)

const emit = defineEmits<{
  /** A resize gesture finished (drag end / keyboard / dblclick). */
  (e: 'resize', state: SnSplitterResizeState): void
}>()

const isVertical = computed(() => props.direction === 'vertical')
const isDragging = ref(false)
const rootEl = ref<HTMLDivElement | null>(null)

// ---- registered panels ---------------------------------------------------

const entries = reactive<SplitterPanelEntry[]>([])
let nextPanelId = 1

function defaultOf(entry: SplitterPanelEntry): number | null {
  return parsePercentSize(entry.handle.props.defaultSize)
}

function minOf(entry: SplitterPanelEntry): number {
  return parsePercentSize(entry.handle.props.minSize) ?? 0
}

function maxOf(entry: SplitterPanelEntry): number {
  return parsePercentSize(entry.handle.props.maxSize) ?? 100
}

/** A collapsed panel's effective lower bound is 0, not its minSize. */
function effectiveMinOf(entry: SplitterPanelEntry): number {
  return entry.collapsed ? 0 : minOf(entry)
}

function isCollapsible(entry: SplitterPanelEntry): boolean {
  return entry.handle.props.collapsible === true
}

/** Nearest non-collapsed neighbor: next first, then previous. */
function donorIndexOf(index: number): number {
  for (let i = index + 1; i < entries.length; i += 1) {
    const candidate = entries[i]
    if (candidate && !candidate.collapsed) return i
  }
  for (let i = index - 1; i >= 0; i -= 1) {
    const candidate = entries[i]
    if (candidate && !candidate.collapsed) return i
  }
  return -1
}

/** Collapse to 0 and hand the freed percent to the nearest live neighbor. */
function collapseEntry(entry: SplitterPanelEntry): void {
  const donorIndex = donorIndexOf(entries.indexOf(entry))
  const donor = donorIndex >= 0 ? entries[donorIndex] : undefined
  if (donor) {
    // Collapse hands the freed percent to the neighbor; donor maxSize is a
    // resize constraint, not a layout one (naive-ui semantics), so the
    // absorption is intentionally not re-clamped.
    donor.size = round2(donor.size + entry.size)
  }
  entry.size = 0
  entry.collapsed = true
  entry.handle.emitCollapsed(true)
}

/** Restore defaultSize by taking percent from the nearest live neighbor. */
function expandEntry(entry: SplitterPanelEntry): void {
  entry.collapsed = false
  entry.handle.emitCollapsed(false)
  const donorIndex = donorIndexOf(entries.indexOf(entry))
  const donor = donorIndex >= 0 ? entries[donorIndex] : undefined
  if (!donor) return
  const pairSum = round2(entry.size + donor.size)
  const take = round2(
    Math.min(defaultOf(entry) ?? 50, maxOf(entry), Math.max(0, donor.size - minOf(donor))),
  )
  entry.size = take
  donor.size = round2(pairSum - take)
}

/** Equal-share unsized panels once every child has registered. */
function normalizeSizes(): void {
  const unsized = entries.filter((entry) => !entry.collapsed && defaultOf(entry) === null)
  const sized = entries.filter((entry) => !entry.collapsed && defaultOf(entry) !== null)
  let explicitSum = 0
  for (const entry of sized) {
    const explicit = defaultOf(entry)
    if (explicit !== null) explicitSum += explicit
  }
  const remaining = 100 - explicitSum
  if (explicitSum > 100) {
    // Over-subscribed defaults: scale them down proportionally to keep the
    // total at 100; unsized panels get nothing.
    const factor = 100 / explicitSum
    for (const entry of sized) {
      const explicit = defaultOf(entry)
      entry.size = explicit === null ? entry.size : round2(explicit * factor)
    }
    for (const entry of unsized) entry.size = 0
    return
  }
  for (const entry of sized) {
    const explicit = defaultOf(entry)
    if (explicit !== null) entry.size = explicit
  }
  const share = unsized.length > 0 ? remaining / unsized.length : 0
  for (const entry of unsized) entry.size = round2(share)
}

function registerPanel(handle: SnSplitterPanelHandle): { id: number; unregister: () => void } {
  const id = nextPanelId
  nextPanelId += 1
  const entry = reactive<SplitterPanelEntry>({
    id,
    handle,
    size: handle.props.collapsed === true ? 0 : (parsePercentSize(handle.props.defaultSize) ?? 50),
    collapsed: handle.props.collapsed === true,
  })
  entries.push(entry)
  const stopCollapsedWatch = watch(
    () => handle.props.collapsed,
    (next) => {
      // Idempotent sync: container-initiated changes already applied the
      // matching size, so the echoed v-model update is a no-op here.
      if (next === true && entry.size > 0) collapseEntry(entry)
      else if (next === false && entry.size === 0 && entry.collapsed) expandEntry(entry)
    },
  )
  return {
    id,
    unregister: () => {
      stopCollapsedWatch()
      const index = entries.findIndex((candidate) => candidate.id === id)
      if (index >= 0) entries.splice(index, 1)
    },
  }
}

// ---- size mutation -------------------------------------------------------

/**
 * Move the divider at `boundary` (between panels boundary-1 | boundary) by
 * `deltaPercent`, clamped to both panels' min/max. When a collapsible panel
 * is pushed below its minSize it snaps to collapsed (size 0) and the freed
 * percent goes to the panel being grown by the gesture.
 */
function applyDelta(boundary: number, deltaPercent: number): void {
  const before = entries[boundary - 1]
  const after = entries[boundary]
  if (!before || !after) return
  const pairSum = round2(before.size + after.size)
  const rawBefore = before.size + deltaPercent

  if (!before.collapsed && isCollapsible(before) && deltaPercent < 0 && rawBefore < minOf(before)) {
    before.size = 0
    before.collapsed = true
    after.size = pairSum
    before.handle.emitCollapsed(true)
    return
  }
  const rawAfter = round2(pairSum - rawBefore)
  if (!after.collapsed && isCollapsible(after) && deltaPercent > 0 && rawAfter < minOf(after)) {
    after.size = 0
    after.collapsed = true
    before.size = pairSum
    after.handle.emitCollapsed(true)
    return
  }

  const lower = Math.max(0, effectiveMinOf(before))
  const upper = Math.min(maxOf(before), pairSum - effectiveMinOf(after))
  const nextBefore = round2(Math.min(upper, Math.max(lower, rawBefore)))
  const nextAfter = round2(pairSum - nextBefore)

  // Dragging a collapsed panel's divider past 0 expands it again.
  if (before.collapsed && nextBefore > 0) {
    before.collapsed = false
    before.handle.emitCollapsed(false)
  }
  if (after.collapsed && nextAfter > 0) {
    after.collapsed = false
    after.handle.emitCollapsed(false)
  }

  before.size = nextBefore
  after.size = nextAfter
}

function emitResize(boundary: number): void {
  const before = entries[boundary - 1]
  const after = entries[boundary]
  if (!before || !after) return
  const beforeSize = round2(before.size)
  const afterSize = round2(after.size)
  emit('resize', {
    before: beforeSize,
    after: afterSize,
    beforeSize: `${beforeSize}%`,
    afterSize: `${afterSize}%`,
  })
}

// ---- pointer drag --------------------------------------------------------

interface DragState {
  boundary: number
  originPointer: number
  axisLength: number
}

let dragState: DragState | null = null

function onDocumentPointerMove(event: PointerEvent): void {
  if (!dragState) return
  const current = isVertical.value ? event.clientY : event.clientX
  const deltaPercent = ((current - dragState.originPointer) / dragState.axisLength) * 100
  applyDelta(dragState.boundary, deltaPercent)
}

function detachDragListeners(): void {
  document.removeEventListener('pointermove', onDocumentPointerMove)
  document.removeEventListener('pointerup', onDocumentPointerUp)
  document.removeEventListener('pointercancel', onDocumentPointerUp)
}

function onDocumentPointerUp(): void {
  if (!dragState) return
  const boundary = dragState.boundary
  dragState = null
  isDragging.value = false
  detachDragListeners()
  emitResize(boundary)
}

function onDividerPointerDown(boundary: number, event: PointerEvent): void {
  if (props.disabled) return
  const rect = rootEl.value?.getBoundingClientRect()
  if (!rect) return
  const axisLength = isVertical.value ? rect.height : rect.width
  if (axisLength <= 0) return
  event.preventDefault()
  dragState = {
    boundary,
    originPointer: isVertical.value ? event.clientY : event.clientX,
    axisLength,
  }
  isDragging.value = true
  document.addEventListener('pointermove', onDocumentPointerMove)
  document.addEventListener('pointerup', onDocumentPointerUp)
  document.addEventListener('pointercancel', onDocumentPointerUp)
}

// ---- keyboard ------------------------------------------------------------

function onDividerKeydown(boundary: number, event: KeyboardEvent): void {
  if (props.disabled) return
  const before = entries[boundary - 1]
  const after = entries[boundary]
  if (!before || !after) return
  const growKey = isVertical.value ? 'ArrowDown' : 'ArrowRight'
  const shrinkKey = isVertical.value ? 'ArrowUp' : 'ArrowLeft'
  let delta: number | null = null
  if (event.key === growKey) delta = SN_SPLITTER_KEYBOARD_STEP_PERCENT
  else if (event.key === shrinkKey) delta = -SN_SPLITTER_KEYBOARD_STEP_PERCENT
  else if (event.key === 'Home') delta = effectiveMinOf(before) - before.size
  else if (event.key === 'End') {
    delta = round2(before.size + after.size - effectiveMinOf(after)) - before.size
  } else return
  event.preventDefault()
  applyDelta(boundary, delta)
  emitResize(boundary)
}

// ---- dblclick restore ----------------------------------------------------

function onDividerDblClick(boundary: number): void {
  if (props.disabled) return
  const before = entries[boundary - 1]
  const after = entries[boundary]
  if (!before || !after) return
  if (before.collapsed || after.collapsed) {
    expandEntry(before.collapsed ? before : after)
  } else {
    // Restore both panels toward their defaults while preserving the pair's
    // current total, so the rest of the splitter is unaffected.
    const pairSum = round2(before.size + after.size)
    const beforeDefault = defaultOf(before) ?? 50
    const afterDefault = defaultOf(after) ?? 50
    const defaultsSum = beforeDefault + afterDefault
    const scale = defaultsSum > 0 ? pairSum / defaultsSum : 0
    const lower = Math.max(0, minOf(before))
    const upper = Math.min(maxOf(before), pairSum - minOf(after))
    const nextBefore = round2(Math.min(upper, Math.max(lower, beforeDefault * scale)))
    before.size = nextBefore
    after.size = round2(pairSum - nextBefore)
  }
  emitResize(boundary)
}

// ---- a11y ----------------------------------------------------------------

function getBoundaryAria(boundary: number): SnSplitterBoundaryAria | null {
  const before = entries[boundary - 1]
  const after = entries[boundary]
  if (!before || !after) return null
  const pairSum = round2(before.size + after.size)
  return {
    valueNow: round2(before.size),
    valueMin: round2(effectiveMinOf(before)),
    valueMax: round2(Math.min(maxOf(before), pairSum - effectiveMinOf(after))),
  }
}

const api: SnSplitterApi = {
  direction: computed(() => props.direction),
  isDisabled: computed(() => props.disabled),
  registerPanel,
  getEntry: (id) => entries.find((candidate) => candidate.id === id),
  indexOfPanel: (id) => entries.findIndex((candidate) => candidate.id === id),
  onDividerPointerDown,
  onDividerKeydown,
  onDividerDblClick,
  getBoundaryAria,
}
provide(SN_SPLITTER_INJECTION_KEY, api)

onMounted(() => {
  normalizeSizes()
})

onBeforeUnmount(() => {
  dragState = null
  isDragging.value = false
  detachDragListeners()
})
</script>

<template>
  <div
    ref="rootEl"
    :class="[
      'sn-splitter',
      {
        'sn-splitter--vertical': isVertical,
        'sn-splitter--disabled': disabled,
        'sn-splitter--dragging': isDragging,
      },
    ]"
    :data-snui-component="'splitter'"
  >
    <slot />
  </div>
</template>

<style scoped>
.sn-splitter {
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.sn-splitter--vertical {
  flex-direction: column;
}

/* While a drag gesture is live: no text selection anywhere in the splitter,
   and the grab cursor stays on even when the pointer leaves the divider. */
.sn-splitter--dragging {
  cursor: col-resize;
  user-select: none;
  -webkit-user-select: none;
}

.sn-splitter--vertical.sn-splitter--dragging {
  cursor: row-resize;
}
</style>
