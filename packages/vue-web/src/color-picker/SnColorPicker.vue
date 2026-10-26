<template>
  <div
    ref="rootRef"
    :class="['sn-color-picker', `sn-color-picker--${size}`, {
      'sn-color-picker--disabled': disabled,
      'sn-color-picker--readonly': readonly,
      'sn-color-picker--focused': isFocused,
      'sn-color-picker--active': isPanelOpen,
    }, customClass]"
    :data-snui-component="'color-picker'"
    :data-size="size"
    :style="wrapperStyle || undefined"
  >
    <div
      class="sn-color-picker__selection"
      role="combobox"
      aria-haspopup="dialog"
      :aria-expanded="isPanelOpen ? 'true' : 'false'"
      :aria-controls="isPanelOpen ? panelId : undefined"
      :aria-label="ariaLabel || 'Color picker'"
      :aria-readonly="readonly ? 'true' : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :tabindex="isInteractive ? 0 : -1"
      @mousedown="onTriggerMouseDown"
      @click="onTriggerClick"
      @keydown="onTriggerKeyDown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <span
        class="sn-color-picker__trigger-swatch"
        :style="{ backgroundColor: triggerSwatchColor }"
      />
      <span v-if="hasModelValue" class="sn-color-picker__value">{{ displayValue }}</span>
      <span v-else class="sn-color-picker__placeholder">{{ placeholder }}</span>
    </div>

    <!-- Suffix: clear | arrow -->
    <div class="sn-color-picker__suffix">
      <button
        v-if="clearable && hasModelValue && isInteractive"
        type="button"
        class="sn-color-picker__clear"
        aria-label="Clear color"
        :tabindex="-1"
        @mousedown.prevent
        @click.stop="clearValue"
      >
        <SnIcon :icon="CloseIcon" :size="11" />
      </button>
      <span
        v-else
        class="sn-color-picker__arrow"
        :class="{ 'sn-color-picker__arrow--up': isPanelOpen }"
        aria-hidden="true"
      >
        <SnIcon :icon="ChevronDownIcon" :size="13" />
      </span>
    </div>

    <!-- Color panel — teleported to body -->
    <Teleport to="body">
      <Transition name="sn-pop">
        <div
          v-if="isPanelOpen"
          :id="panelId"
          ref="panelRef"
          :class="['sn-color-picker-panel', `sn-color-picker-panel--${placement}`]"
          :style="panelStyle"
          role="dialog"
          aria-label="Color picker panel"
          @mousedown.prevent
        >
          <div v-if="visibleModes.length > 1" class="sn-color-picker-panel__modes" role="tablist">
            <button
              v-for="mode in visibleModes"
              :key="mode"
              type="button"
              class="sn-color-picker-panel__mode"
              :class="{ 'sn-color-picker-panel__mode--active': mode === activeMode }"
              role="tab"
              :aria-selected="mode === activeMode ? 'true' : 'false'"
              @click="setActiveMode(mode)"
            >{{ mode.toUpperCase() }}</button>
          </div>

          <!-- SV square -->
          <div
            ref="svRef"
            class="sn-color-picker-panel__sv"
            :style="{ backgroundColor: hueBackground(draft.h) }"
            @pointerdown="onSvPointerDown"
          >
            <div
              ref="svHandleRef"
              class="sn-color-picker-panel__sv-handle"
              role="slider"
              aria-label="Saturation and value"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuetext="`S ${Math.round(draft.s)}%, V ${Math.round(draft.v)}%`"
              :tabindex="isInteractive ? 0 : -1"
              :style="{ left: `${draft.s}%`, top: `${100 - draft.v}%`, backgroundColor: previewColor }"
              @keydown="onHandleKeyDown($event, 'sv')"
            />
          </div>

          <!-- Hue + alpha rails -->
          <div class="sn-color-picker-panel__rails">
            <div
              ref="hueRef"
              class="sn-color-picker-panel__rail sn-color-picker-panel__hue"
              @pointerdown="onHuePointerDown"
            >
              <div
                class="sn-color-picker-panel__thumb"
                role="slider"
                aria-label="Hue"
                aria-valuemin="0"
                aria-valuemax="360"
                :aria-valuenow="Math.round(draft.h)"
                :tabindex="isInteractive ? 0 : -1"
                :style="{ left: `${(draft.h / 360) * 100}%` }"
                @keydown="onHandleKeyDown($event, 'h')"
              />
            </div>
            <div
              v-if="showAlpha"
              ref="alphaRef"
              class="sn-color-picker-panel__rail sn-color-picker-panel__alpha"
              :style="alphaRailStyle"
              @pointerdown="onAlphaPointerDown"
            >
              <div
                class="sn-color-picker-panel__thumb"
                role="slider"
                aria-label="Opacity"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-valuenow="Math.round(draft.a * 100)"
                :tabindex="isInteractive ? 0 : -1"
                :style="{ left: `${draft.a * 100}%` }"
                @keydown="onHandleKeyDown($event, 'a')"
              />
            </div>
          </div>

          <!-- Current color preview + mode text input -->
          <div class="sn-color-picker-panel__inputs">
            <span
              class="sn-color-picker-panel__preview"
              :style="{ backgroundColor: previewColor }"
              aria-hidden="true"
            />
            <input
              ref="inputRef"
              v-model="inputText"
              type="text"
              class="sn-color-picker-panel__input"
              aria-label="Color value"
              spellcheck="false"
              @keydown.enter.prevent="commitInput"
              @blur="commitInput"
            >
          </div>

          <!-- Swatches -->
          <div v-if="normalizedSwatches.length > 0" class="sn-color-picker-panel__swatches">
            <button
              v-for="swatch in normalizedSwatches"
              :key="swatch.value"
              type="button"
              class="sn-color-picker-panel__swatch"
              :style="{ backgroundColor: swatch.css }"
              :aria-label="`Select ${swatch.value}`"
              @click="selectSwatch(swatch.value)"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * SnColorPicker — web-end color picker component.
 *
 * Reference library: naive-ui `n-color-picker`
 *   (https://www.naiveui.com/zh-CN/light/components/color-picker)
 *
 * Parity (this version):
 *   - modelValue: CSS color string (`#rrggbb` internally lowercase; accepts
 *     `#rgb` / `#rrggbb` / `#rrggbbaa` / `rgb()` / `rgba()` / `hsl()` /
 *     `hsla()` — see sn-color-picker-types.ts). Output format follows the
 *     active mode tab + `showAlpha`.
 *   - modes: ('rgb' | 'hsl' | 'hex')[] panel tabs (default ['rgb', 'hex'])
 *   - showAlpha: alpha rail + rgba/hsla/8-digit-hex output
 *   - swatches: preset swatch row (hex strings; invalid entries dropped)
 *   - size(mini/tiny/small/medium/large) / disabled / readonly /
 *     clearable (restores the default color) / defaultShow (open on mount)
 *   - panel: Teleport + viewport flip (bottom preferred — the simplified
 *     popper strategy SnSelect / SnTimePicker document), SV square with
 *     draggable handle + hue rail + optional alpha rail + current-color
 *     preview + mode text input + swatch row
 *   - pointer drag: document-level pointerdown/move/up with
 *     onBeforeUnmount cleanup (§41/§42); update:modelValue fires live
 *     while dragging, change fires on pointer release
 *   - keyboard: panel handles are role=slider; ArrowLeft/Right/Up/Down
 *     step hue/saturation/value ±1 (Shift ±10); alpha rail Arrow ±0.01
 *   - events: update:modelValue, change, clear, focus, blur
 *
 * Not ported (out of scope, see ai-description.md): on-update:value-style
 * granular events, gradient mode, `on-complete` per-channel callbacks,
 * renderers, internal actions slot.
 *
 * Per AGENTS.md §30/31: props / events / a11y are declared below; CSS uses
 * `--sn-web-color-picker-*` aliases with `--sn-web-color-*` fallbacks only.
 * Swatch/preview colors are DATA (bound inline styles from the value /
 * swatches props), not stylesheet styling — allowed by the task brief.
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import SnIcon from '../icon/SnIcon.vue'
import { ChevronDownIcon, CloseIcon } from './sn-color-picker-icons'
import { useOverlayFollow } from '../_internal/use-overlay-follow'
import {
  clamp,
  formatHsl,
  formatHsla,
  formatRgb,
  formatRgba,
  hsvToRgb,
  hueBackground,
  parseColor,
  rgbToHex,
  rgbToHsl,
  rgbaToHex,
  rgbToHsv,
  type Hsva,
  type SnColorPickerMode,
  type SnColorPickerSize,
} from './sn-color-picker-types'

defineOptions({ name: 'SnColorPicker' })

const DEFAULT_COLOR = '#000000'

const props = withDefaults(
  defineProps<{
    /** Bound value: CSS color string, or null when empty. */
    modelValue?: string | null
    /** Edit modes offered as panel tabs. */
    modes?: SnColorPickerMode[]
    /** Alpha rail + rgba/hsla output. */
    showAlpha?: boolean
    /** Preset swatch row (hex strings; invalid entries are dropped). */
    swatches?: string[]
    /** Visual size preset. */
    size?: SnColorPickerSize
    /** Disables interaction. */
    disabled?: boolean
    /** Read-only — opens nothing, commits nothing. */
    readonly?: boolean
    /** Clear restores the default color (#000000) and emits `clear`. */
    clearable?: boolean
    /** Open the panel immediately on mount. */
    defaultShow?: boolean
    /** Empty-state text. */
    placeholder?: string
    /** Accessible name for the trigger (fallback: 'Color picker'). */
    ariaLabel?: string
    /** Class on the root wrapper. */
    customClass?: string
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>
  }>(),
  {
    modelValue: null,
    modes: () => ['rgb', 'hex'],
    showAlpha: false,
    swatches: () => [],
    size: 'medium',
    disabled: false,
    readonly: false,
    clearable: false,
    defaultShow: false,
    placeholder: 'Please pick a color',
    ariaLabel: '',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  /** v-model sync — live while dragging + on every commit. */
  (e: 'update:modelValue', value: string | null): void
  /** Value committed (pointer release, swatch, input, keyboard). */
  (e: 'change', value: string): void
  /** Clear button activated (modelValue already reset to the default). */
  (e: 'clear'): void
  /** Trigger gained focus. */
  (e: 'focus', event: FocusEvent): void
  /** Trigger lost focus. */
  (e: 'blur', event: FocusEvent): void
}>()

/* ─────────── Instance ids ─────────── */

let colorPickerInstanceSeed = 0
const instanceId = ++colorPickerInstanceSeed
const panelId = `sn-color-picker-panel-${instanceId}`

/* ─────────── State ─────────── */

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const svRef = ref<HTMLElement | null>(null)
const hueRef = ref<HTMLElement | null>(null)
const alphaRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const isPanelOpen = ref(false)
const isFocused = ref(false)
const activeMode = ref<SnColorPickerMode>('rgb')
/** Panel working color — HSV space (hue/sat/value/alpha). */
const draft = ref<Hsva>({ h: 0, s: 0, v: 0, a: 1 })
/** Mode text input buffer (committed on Enter / blur when parseable). */
const inputText = ref('')

const isInteractive = computed(() => !props.disabled && !props.readonly)
const hasModelValue = computed(() => props.modelValue !== null && props.modelValue !== '')

/** Mode tabs actually rendered (dedup, keep prop order). */
const visibleModes = computed<SnColorPickerMode[]>(() => {
  const seen = new Set<string>()
  return props.modes.filter((mode) => {
    if (seen.has(mode)) return false
    seen.add(mode)
    return true
  })
})

/** Swatches normalized: invalid entries dropped, css + hex kept. */
const normalizedSwatches = computed<Array<{ value: string; css: string }>>(() => {
  const out: Array<{ value: string; css: string }> = []
  for (const raw of props.swatches) {
    const parsed = parseColor(raw)
    if (parsed) out.push({ value: rgbToHex(parsed.r, parsed.g, parsed.b), css: raw })
  }
  return out
})

/* ─────────── Color derivation ─────────── */

const draftRgb = computed(() => hsvToRgb(draft.value.h, draft.value.s, draft.value.v))
const draftHsl = computed(() => {
  const hsl = rgbToHsl(draftRgb.value.r, draftRgb.value.g, draftRgb.value.b)
  return { ...hsl, a: draft.value.a }
})

/** Panel handle/preview color — opaque (the alpha rail shows alpha). */
const previewColor = computed(() => rgbToHex(draftRgb.value.r, draftRgb.value.g, draftRgb.value.b))

/** Format the draft per active mode + showAlpha. */
function formatDraft(mode: SnColorPickerMode): string {
  const { r, g, b } = draftRgb.value
  const a = draft.value.a
  const useA = props.showAlpha && a < 1
  if (mode === 'hex') return useA ? rgbaToHex(r, g, b, a) : rgbToHex(r, g, b)
  if (mode === 'rgb') return useA ? formatRgba(r, g, b, a) : formatRgb(r, g, b)
  const hsl = draftHsl.value
  return useA ? formatHsla(hsl.h, hsl.s, hsl.l, a) : formatHsl(hsl.h, hsl.s, hsl.l)
}

/** Model value normalized for the trigger display. */
const displayValue = computed<string>(() => {
  if (!hasModelValue.value) return ''
  const parsed = parseColor(props.modelValue ?? '')
  if (!parsed) return props.modelValue ?? ''
  return props.showAlpha
    ? rgbaToHex(parsed.r, parsed.g, parsed.b, parsed.a)
    : rgbToHex(parsed.r, parsed.g, parsed.b)
})

/** Trigger swatch background — the bound color, or the default when empty. */
const triggerSwatchColor = computed<string>(() => {
  if (hasModelValue.value) {
    const parsed = parseColor(props.modelValue ?? '')
    if (parsed) return rgbaToHex(parsed.r, parsed.g, parsed.b, parsed.a)
  }
  return DEFAULT_COLOR
})

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle
  return Object.entries(props.customStyle ?? {}).map(([k, v]) => `${k}:${v}`).join(';')
})

/** Alpha rail: current color fading to transparent (checker via CSS). */
const alphaRailStyle = computed(() => ({
  backgroundImage: `linear-gradient(to right, ${rgbaToHex(draftRgb.value.r, draftRgb.value.g, draftRgb.value.b, 0)}, ${rgbToHex(draftRgb.value.r, draftRgb.value.g, draftRgb.value.b)})`,
}))

/* ─────────── Draft <-> model sync ─────────── */

/** Initialize the draft + input from the bound value (null → default). */
function initDraftFromModel(): void {
  const parsed = parseColor(props.modelValue ?? '')
  const base = parsed ?? parseColor(DEFAULT_COLOR)
  if (!base) return
  const hsv = rgbToHsv(base.r, base.g, base.b)
  draft.value = { ...hsv, a: props.showAlpha ? base.a : 1 }
  inputText.value = formatDraft(activeMode.value)
}

/* ─────────── Commit ─────────── */

/** Live sync (dragging) — no `change` event. */
function emitLive(): void {
  emit('update:modelValue', formatDraft(activeMode.value))
}

/** Committed change — syncs v-model and fires `change`. */
function emitChange(): void {
  inputText.value = formatDraft(activeMode.value)
  const value = formatDraft(activeMode.value)
  emit('update:modelValue', value)
  emit('change', value)
}

/* ─────────── Panel positioning (simplified popper) ─────────── */

const PANEL_VIEWPORT_GAP = 4
const placement = ref<'bottom' | 'top'>('bottom')
const panelStyle = ref<Record<string, string>>({})

function repositionPanel(): void {
  const root = rootRef.value
  const panel = panelRef.value
  if (!root || !panel) return
  const rootRect = root.getBoundingClientRect()
  // offsetWidth/offsetHeight read the layout box, which the sn-pop enter
  // transform (scale 0.92) does not distort — getBoundingClientRect would
  // measure the scaled panel while the enter transition is running.
  const panelWidth = panel.offsetWidth
  const panelHeight = panel.offsetHeight
  const vw = window.innerWidth
  const vh = window.innerHeight

  const width = Math.max(rootRect.width, panelWidth)
  const left = Math.min(
    Math.max(PANEL_VIEWPORT_GAP, rootRect.left),
    Math.max(PANEL_VIEWPORT_GAP, vw - width - PANEL_VIEWPORT_GAP),
  )
  const roomBelow = vh - rootRect.bottom
  const roomAbove = rootRect.top
  const useTop = roomBelow < panelHeight && roomAbove > roomBelow
  placement.value = useTop ? 'top' : 'bottom'
  const top = useTop
    ? Math.max(PANEL_VIEWPORT_GAP, rootRect.top - panelHeight)
    : rootRect.bottom

  panelStyle.value = {
    position: 'fixed',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
    'min-width': `${Math.round(rootRect.width)}px`,
  }
}

/* Scroll/resize follow: while the panel is open, any scroll (page or a
 * nested scrollable ancestor) or viewport resize re-runs repositionPanel so
 * the fixed-position panel stays glued to the trigger instead of detaching. */
const followViewport = useOverlayFollow(rootRef, panelRef, repositionPanel, isPanelOpen)

/* ─────────── Pointer drag (document listeners, §41/§42) ─────────── */

type DragTarget = 'sv' | 'hue' | 'alpha'

interface DragState {
  target: DragTarget
  el: HTMLElement
}

let dragState: DragState | null = null

function railRatio(el: HTMLElement, event: PointerEvent): number {
  const rect = el.getBoundingClientRect()
  if (rect.width <= 0) return 0
  return clamp((event.clientX - rect.left) / rect.width, 0, 1)
}

function svApply(el: HTMLElement, event: PointerEvent): void {
  const rect = el.getBoundingClientRect()
  const x = rect.width > 0 ? clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100) : 0
  const y = rect.height > 0 ? clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100) : 0
  draft.value.s = x
  draft.value.v = 100 - y
  emitLive()
}

function onDocumentPointerMove(event: PointerEvent): void {
  if (!dragState) return
  if (dragState.target === 'sv') svApply(dragState.el, event)
  else if (dragState.target === 'hue') draft.value.h = railRatio(dragState.el, event) * 360
  else draft.value.a = railRatio(dragState.el, event)
  emitLive()
}

function onDocumentPointerUp(): void {
  if (!dragState) return
  dragState = null
  emitChange()
}

function startDrag(target: DragTarget, el: HTMLElement | null, event: PointerEvent): void {
  if (!isInteractive.value || !el) return
  event.preventDefault()
  dragState = { target, el }
  onDocumentPointerMove(event)
}

function onSvPointerDown(event: PointerEvent): void {
  startDrag('sv', svRef.value, event)
}

function onHuePointerDown(event: PointerEvent): void {
  startDrag('hue', hueRef.value, event)
}

function onAlphaPointerDown(event: PointerEvent): void {
  startDrag('alpha', alphaRef.value, event)
}

/* ─────────── Outside-click dismiss (§41/§42) ─────────── */

function onDocumentMouseDown(event: MouseEvent): void {
  if (!isPanelOpen.value) return
  const target = event.target as Node | null
  if (!target) return
  if (rootRef.value && rootRef.value.contains(target)) return
  if (panelRef.value && panelRef.value.contains(target)) return
  closePanel()
}

/* ─────────── Open / close ─────────── */

function openPanel(): void {
  if (!isInteractive.value || isPanelOpen.value) return
  isPanelOpen.value = true
  if (!visibleModes.value.includes(activeMode.value)) {
    activeMode.value = visibleModes.value[0] ?? 'rgb'
  }
  initDraftFromModel()
  void nextTick(() => {
    repositionPanel()
    followViewport.start()
    inputRef.value?.focus()
  })
}

function closePanel(): void {
  if (!isPanelOpen.value) return
  isPanelOpen.value = false
  followViewport.stop()
  dragState = null
}

/* ─────────── Interaction handlers ─────────── */

function setActiveMode(mode: SnColorPickerMode): void {
  if (!isInteractive.value || activeMode.value === mode) return
  activeMode.value = mode
  inputText.value = formatDraft(mode)
}

function selectSwatch(value: string): void {
  if (!isInteractive.value) return
  const parsed = parseColor(value)
  if (!parsed) return
  const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b)
  draft.value = { ...hsv, a: parsed.a }
  emitChange()
}

/** Enter/blur on the mode input — apply when parseable (and changed), revert otherwise. */
function commitInput(): void {
  if (!isInteractive.value) return
  const parsed = parseColor(inputText.value)
  if (parsed) {
    const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b)
    const next: Hsva = { ...hsv, a: parsed.a }
    const unchanged =
      next.h === draft.value.h && next.s === draft.value.s &&
      next.v === draft.value.v && next.a === draft.value.a
    if (unchanged) {
      // No-op confirm must not re-emit (SnTimePicker's Enter semantics).
      inputText.value = formatDraft(activeMode.value)
      return
    }
    draft.value = next
    emitChange()
  } else {
    inputText.value = formatDraft(activeMode.value)
  }
}

function clearValue(): void {
  if (!isInteractive.value) return
  emit('update:modelValue', DEFAULT_COLOR)
  emit('change', DEFAULT_COLOR)
  emit('clear')
  closePanel()
}

/* ─────────── Keyboard (panel handles) ─────────── */

/** Arrow step for hue / saturation / value (±1, Shift ±10) and alpha (±0.01). */
function onHandleKeyDown(event: KeyboardEvent, target: 'sv' | 'h' | 'a'): void {
  if (!isInteractive.value) return
  const step = event.shiftKey ? 10 : 1
  let handled = true
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      if (target === 'sv') draft.value.s = clamp(draft.value.s - step, 0, 100)
      else if (target === 'h') draft.value.h = clamp(draft.value.h - step, 0, 360)
      else draft.value.a = clamp(draft.value.a - step / 100, 0, 1)
      break
    case 'ArrowRight':
    case 'ArrowUp':
      if (target === 'sv') draft.value.s = clamp(draft.value.s + step, 0, 100)
      else if (target === 'h') draft.value.h = clamp(draft.value.h + step, 0, 360)
      else draft.value.a = clamp(draft.value.a + step / 100, 0, 1)
      break
    default:
      handled = false
  }
  if (!handled) return
  event.preventDefault()
  emitChange()
}

/* ─────────── Trigger events ─────────── */

function onTriggerMouseDown(event: MouseEvent): void {
  event.preventDefault()
}

function onTriggerClick(): void {
  if (!isInteractive.value) return
  if (isPanelOpen.value) closePanel()
  else openPanel()
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (!isInteractive.value) return
  switch (event.key) {
    case 'Enter':
    case ' ':
    case 'Spacebar':
      event.preventDefault()
      if (!isPanelOpen.value) openPanel()
      else closePanel()
      break
    case 'Escape':
      if (isPanelOpen.value) {
        event.preventDefault()
        closePanel()
      }
      break
    default:
      break
  }
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  emit('blur', event)
}

/* ─────────── Lifecycle (§41/§42) ─────────── */

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMouseDown)
  document.addEventListener('pointermove', onDocumentPointerMove)
  document.addEventListener('pointerup', onDocumentPointerUp)
  if (props.defaultShow) openPanel()
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMouseDown)
  document.removeEventListener('pointermove', onDocumentPointerMove)
  document.removeEventListener('pointerup', onDocumentPointerUp)
  followViewport.stop()
})

watch(() => props.modelValue, () => {
  // External value change while open — keep the panel in sync.
  if (isPanelOpen.value) initDraftFromModel()
})

watch(() => [props.modes, props.showAlpha], () => {
  // Modes / alpha surface changed under an open panel — re-clamp the tab.
  if (isPanelOpen.value && !visibleModes.value.includes(activeMode.value)) {
    activeMode.value = visibleModes.value[0] ?? 'rgb'
    inputText.value = formatDraft(activeMode.value)
  }
})
</script>

<style scoped>
.sn-color-picker {
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1;
}

.sn-color-picker__selection {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: var(--sn-web-color-picker-height, 34px);
  padding: 0 var(--sn-web-color-picker-padding-x, 10px);
  padding-right: calc(var(--sn-web-color-picker-padding-x, 10px) + 22px);
  width: var(--sn-web-color-picker-width, 100%);
  box-sizing: border-box;
  border: 1px solid var(--sn-web-color-picker-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-color-picker-radius, 6px);
  background-color: var(--sn-web-color-picker-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-color-picker-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  transition: border-color 0.18s ease-out, box-shadow 0.18s ease-out;
  outline: none;
}

.sn-color-picker__selection:focus-visible {
  border-color: var(--sn-web-color-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

.sn-color-picker--active .sn-color-picker__selection {
  border-color: var(--sn-web-color-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

/* Sizes */
.sn-color-picker--mini { --sn-web-color-picker-height: 22px; font-size: 11px; }
.sn-color-picker--tiny { --sn-web-color-picker-height: 24px; font-size: 12px; }
.sn-color-picker--small { --sn-web-color-picker-height: 28px; font-size: 13px; }
.sn-color-picker--medium { --sn-web-color-picker-height: 32px; font-size: 14px; }
.sn-color-picker--large { --sn-web-color-picker-height: 40px; font-size: 15px; }

.sn-color-picker__trigger-swatch {
  flex: none;
  width: var(--sn-web-color-picker-swatch-size, 16px);
  height: var(--sn-web-color-picker-swatch-size, 16px);
  border-radius: var(--sn-web-color-picker-swatch-radius, 4px);
  border: 1px solid var(--sn-web-color-picker-swatch-border, var(--sn-web-color-border-default));
  box-sizing: border-box;
}

.sn-color-picker__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
  font-variant-numeric: tabular-nums;
  text-transform: lowercase;
}

.sn-color-picker__placeholder {
  color: var(--sn-web-color-picker-placeholder-color, var(--sn-web-color-text-tertiary));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
}

/* Suffix */
.sn-color-picker__suffix {
  position: absolute;
  right: var(--sn-web-color-picker-suffix-right, 8px);
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.sn-color-picker__suffix > * {
  pointer-events: auto;
}

.sn-color-picker__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-color-picker-clear-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
}

.sn-color-picker__clear:hover {
  color: var(--sn-web-color-picker-clear-color-hover, var(--sn-web-color-text-primary));
  background-color: var(--sn-web-color-background-subtle);
}

.sn-color-picker__arrow {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-color-picker-arrow-color, var(--sn-web-color-text-tertiary));
  transition: transform 0.18s ease-out;
}

.sn-color-picker__arrow--up {
  transform: rotate(180deg);
}

/* Disabled / readonly */
.sn-color-picker--disabled .sn-color-picker__selection {
  cursor: not-allowed;
  background-color: var(--sn-web-color-picker-bg-disabled, var(--sn-web-color-background-subtle));
  color: var(--sn-web-color-picker-text-color-disabled, var(--sn-web-color-text-disabled));
  border-color: var(--sn-web-color-picker-border-color-disabled, var(--sn-web-color-border-subtle));
}

.sn-color-picker--readonly .sn-color-picker__selection {
  cursor: default;
  background-color: var(--sn-web-color-picker-bg-readonly, var(--sn-web-color-background-subtle));
}
</style>

<style scoped>
/* Color panel — teleported to body (same non-alias style-block convention
 * as the SnSelect menu / SnTimePicker panel). */
.sn-color-picker-panel {
  position: fixed;
  z-index: var(--sn-web-color-picker-panel-z-index, 1000);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-color-picker-panel-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--sn-web-color-picker-panel-radius, 3px);
  background-color: var(--sn-web-color-picker-panel-bg, var(--sn-web-color-background-elevated));
  /* naive-ui popover shadow — three faint layers, airy instead of heavy. */
  box-shadow: var(
    --sn-web-color-picker-panel-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
  font-family: inherit;
  font-size: var(--sn-web-color-picker-panel-font-size, 13px);
}

/* The panel drops from the trigger edge it is anchored to. */
.sn-color-picker-panel--bottom {
  transform-origin: center top;
}

.sn-color-picker-panel--top {
  transform-origin: center bottom;
}

/* sn-pop — naive fade-in-scale-up: enter rises into place, leave fades out. */
.sn-pop-enter-active {
  transition:
    opacity 0.18s cubic-bezier(0, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0, 0, 0.2, 1);
}

.sn-pop-leave-active {
  transition:
    opacity 0.15s cubic-bezier(0, 0, 0.2, 1),
    transform 0.15s cubic-bezier(0, 0, 0.2, 1);
}

.sn-pop-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.92);
}

.sn-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Mode tabs */
.sn-color-picker-panel__modes {
  display: inline-flex;
  gap: 2px;
}

.sn-color-picker-panel__mode {
  padding: 2px 8px;
  border: none;
  border-radius: var(--sn-web-color-picker-mode-radius, 4px);
  background: transparent;
  color: var(--sn-web-color-picker-mode-color, var(--sn-web-color-text-tertiary));
  font-size: 11px;
  font-family: inherit;
  cursor: pointer;
}

.sn-color-picker-panel__mode--active {
  color: var(--sn-web-color-picker-mode-color-active, var(--sn-web-color-action-primary));
  background-color: var(--sn-web-color-picker-mode-bg-active, var(--sn-web-color-action-primary-soft));
}

/* SV square */
.sn-color-picker-panel__sv {
  position: relative;
  height: var(--sn-web-color-picker-sv-size, 180px);
  border-radius: var(--sn-web-color-picker-sv-radius, 4px);
  background-image:
    linear-gradient(to top, rgb(0 0 0), rgb(0 0 0 / 0)),
    linear-gradient(to right, rgb(255 255 255), rgb(255 255 255 / 0));
  background-blend-mode: normal;
  touch-action: none;
  cursor: crosshair;
}

.sn-color-picker-panel__sv-handle {
  position: absolute;
  width: 14px;
  height: 14px;
  transform: translate(-50%, -50%);
  border: 2px solid var(--sn-web-color-picker-handle-border, rgb(255 255 255));
  border-radius: 50%;
  box-shadow: 0 0 2px rgb(0 0 0 / 0.5);
  cursor: grab;
  outline: none;
}

.sn-color-picker-panel__sv-handle:focus-visible,
.sn-color-picker-panel__thumb:focus-visible {
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

/* Rails */
.sn-color-picker-panel__rails {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sn-color-picker-panel__rail {
  position: relative;
  height: var(--sn-web-color-picker-rail-height, 12px);
  border-radius: var(--sn-web-color-picker-rail-radius, 6px);
  touch-action: none;
  cursor: pointer;
}

.sn-color-picker-panel__rail::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid var(--sn-web-color-picker-rail-border, rgb(0 0 0 / 0.06));
  box-sizing: border-box;
  pointer-events: none;
}

.sn-color-picker-panel__thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  border: 2px solid var(--sn-web-color-picker-handle-border, rgb(255 255 255));
  border-radius: 50%;
  box-shadow: 0 0 2px rgb(0 0 0 / 0.5);
  cursor: grab;
  outline: none;
}

/* Inputs */
.sn-color-picker-panel__inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sn-color-picker-panel__preview {
  flex: none;
  width: var(--sn-web-color-picker-preview-size, 24px);
  height: var(--sn-web-color-picker-preview-size, 24px);
  border-radius: var(--sn-web-color-picker-preview-radius, 4px);
  border: 1px solid var(--sn-web-color-picker-swatch-border, var(--sn-web-color-border-default));
  box-sizing: border-box;
}

.sn-color-picker-panel__input {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-color-picker-input-border, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-color-picker-input-radius, 4px);
  background-color: var(--sn-web-color-picker-input-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-color-picker-input-color, var(--sn-web-color-text-primary));
  font-size: 12px;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  outline: none;
}

.sn-color-picker-panel__input:focus-visible {
  border-color: var(--sn-web-color-action-primary);
}

/* Swatches */
.sn-color-picker-panel__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.sn-color-picker-panel__swatch {
  width: var(--sn-web-color-picker-swatch-size, 16px);
  height: var(--sn-web-color-picker-swatch-size, 16px);
  padding: 0;
  border: 1px solid var(--sn-web-color-picker-swatch-border, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-color-picker-swatch-radius, 4px);
  cursor: pointer;
}

.sn-color-picker-panel__swatch:hover {
  transform: scale(1.1);
}
</style>
