<script setup lang="ts">
/**
 * SnAutoComplete — web-end autocomplete input (naive-ui 1:1 parity).
 *
 * Reference library: naive-ui `n-auto-complete`
 *   (https://www.naiveui.com/zh-CN/light/components/auto-complete)
 * Props + semantics mirror n-auto-complete 1:1.
 *
 * Independent implementation (NOT built on SnInput internals — mirrors the
 * SnInputNumber approach) with visual tokens aligned to SnInput
 * (`--sn-web-input-*`, `sn-auto-complete--{size}`) and dropdown tokens
 * under `--sn-web-auto-complete-*`.
 *
 * Per AGENTS.md §30/31: contract declared via defineProps / defineEmits /
 * defineSlots + CSS variables. a11y: input `role="combobox"` +
 * `aria-expanded` + `aria-activedescendant`, panel `role="listbox"` with
 * `role="option"` children.
 */

import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  useSlots,
  watch,
} from 'vue'
import { XIcon } from '../icon/sn-input-icons'
import SnIcon from '../icon/SnIcon.vue'
import { useOverlayFollow } from '../_internal/use-overlay-follow'
import {
  type SnAutoCompleteGetShow,
  type SnAutoCompleteOptionLabel,
  type SnAutoCompleteRawOption,
} from './sn-auto-complete-types'

defineOptions({ name: 'SnAutoComplete' })

const props = withDefaults(
  defineProps<{
    /** Bound value (`v-model`). */
    modelValue?: string
    /** Static candidate list. Ignored when `getShow` is provided. */
    options?: SnAutoCompleteRawOption[]
    /** Placeholder text. */
    placeholder?: string
    /** Show the clear (×) button when the field has a non-empty value. */
    clearable?: boolean
    /** Disables interaction (typing, selecting, clearing). */
    disabled?: boolean
    /** Read-only — value visible, not editable, no dropdown. */
    readonly?: boolean
    /** Visual size preset. */
    size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large'
    /** Visual status. Drives border color. */
    status?: 'default' | 'error' | 'warning'
    /** Blur the input after an option is selected (naive `blur-after-select`). */
    blurAfterSelect?: boolean
    /**
     * Dynamically compute the candidate list from the current value
     * (naive `get-show`). Wins over the static `options` prop.
     */
    getShow?: SnAutoCompleteGetShow
    /** Native ARIA label. */
    ariaLabel?: string
  }>(),
  {
    modelValue: '',
    options: () => [],
    placeholder: '',
    clearable: false,
    disabled: false,
    readonly: false,
    size: 'medium',
    status: 'default',
    blurAfterSelect: false,
    ariaLabel: '',
  },
)

const emit = defineEmits<{
  /** v-model sync. Fired on every keystroke and on selection / clear. */
  (e: 'update:modelValue', value: string): void
  /** Naive `on-update:value` alias — same payload as update:modelValue. */
  (e: 'update:value', value: string): void
  /** Value committed (selection / clear). */
  (e: 'change', value: string): void
  /** An option was picked from the dropdown (click or Enter). */
  (e: 'select', value: string): void
  /** Native focus. */
  (e: 'focus', event: FocusEvent): void
  /** Native blur. */
  (e: 'blur', event: FocusEvent): void
  /** Every input keystroke (naive `on-input`). */
  (e: 'search', value: string): void
}>()

defineSlots<{
  /** Empty-state content for the dropdown (default: "no data" text). */
  empty?(): unknown
}>()

const slots = useSlots()

/* ------------------------------------------------------------------ *
 * Option normalization
 * ------------------------------------------------------------------ */

/** A normalized candidate ready for rendering / selection. */
interface NormalizedOption {
  /** Flat display text (segments joined with a space). */
  text: string
  /** Value committed on selection. */
  value: string
  /** Label segments — each matched independently for highlight. */
  segments: string[]
  disabled: boolean
  /** Stable DOM id for aria-activedescendant. */
  id: string
}

let optionIdSeed = 0

function toSegments(label: SnAutoCompleteOptionLabel | undefined, fallback: string): string[] {
  if (label === undefined || label === null) return [fallback]
  if (Array.isArray(label)) {
    const flat = label.filter((s) => typeof s === 'string' && s.length > 0)
    return flat.length > 0 ? flat : [fallback]
  }
  return [String(label)]
}

function normalizeOption(raw: SnAutoCompleteRawOption): NormalizedOption | null {
  const idx = optionIdSeed++
  if (typeof raw === 'string') {
    return {
      text: raw,
      value: raw,
      segments: [raw],
      disabled: false,
      id: `sn-auto-complete-option-${idx}`,
    }
  }
  if (raw === null || raw === undefined) return null
  const segments = toSegments(raw.label, raw.value ?? '')
  const text = segments.join(' ')
  return {
    text,
    value: raw.value !== undefined && raw.value !== null ? String(raw.value) : text,
    segments,
    disabled: raw.disabled === true,
    id: `sn-auto-complete-option-${idx}`,
  }
}

/**
 * Active candidate list: `getShow` wins over the static `options` prop
 * (naive semantics — when getShow is provided, options is ignored).
 */
const activeOptions = computed<NormalizedOption[]>(() => {
  const rawList = props.getShow !== undefined
    ? props.getShow(props.modelValue)
    : props.options
  return rawList
    .map(normalizeOption)
    .filter((o): o is NormalizedOption => o !== null)
})

/* ------------------------------------------------------------------ *
 * Open / highlight state
 * ------------------------------------------------------------------ */

const isFocused = ref(false)
/** Dropdown visibility — only meaningful while focused (naive shows on input/focus). */
const isMenuOpen = ref(false)
/** Index of the keyboard-highlighted option (-1 = none). */
const activeIndex = ref(-1)

const isInteractive = computed(() => !props.disabled && !props.readonly)

/** Open the dropdown and reset the highlight. */
function openMenu(): void {
  if (!isInteractive.value) return
  isMenuOpen.value = true
  activeIndex.value = -1
  void nextTick(() => {
    repositionMenu()
    followViewport.start()
  })
}

function closeMenu(): void {
  isMenuOpen.value = false
  followViewport.stop()
  activeIndex.value = -1
}

const showMenu = computed(() =>
  isMenuOpen.value && activeOptions.value.length > 0,
)

/** Show the empty slot / text when open with zero candidates. */
const showEmpty = computed(() =>
  isMenuOpen.value && activeOptions.value.length === 0,
)

/** Currently highlighted option (or null). */
const activeOption = computed<NormalizedOption | null>(() => {
  const i = activeIndex.value
  if (i < 0 || i >= activeOptions.value.length) return null
  const found: NormalizedOption | undefined = activeOptions.value[i]
  return found ?? null
})

/** aria-activedescendant on the input — points at the highlighted option. */
const ariaActiveDescendant = computed<string | undefined>(() =>
  activeOption.value !== null ? activeOption.value.id : undefined,
)

/** Reset the highlight whenever the candidate list changes underneath. */
watch(activeOptions, () => {
  activeIndex.value = -1
})

/* ------------------------------------------------------------------ *
 * Input handling
 * ------------------------------------------------------------------ */

function emitValue(next: string): void {
  emit('update:modelValue', next)
  emit('update:value', next)
}

function onInput(event: Event): void {
  if (!isInteractive.value) return
  const target = event.target as HTMLInputElement
  emitValue(target.value)
  emit('search', target.value)
  openMenu()
}

function onFocus(event: FocusEvent): void {
  if (props.disabled) return
  isFocused.value = true
  emit('focus', event)
  openMenu()
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  closeMenu()
  emit('blur', event)
}

function onClear(event: MouseEvent): void {
  if (!isInteractive.value) return
  event.stopPropagation()
  emitValue('')
  emit('change', '')
  openMenu()
}

const clearVisible = computed(() =>
  props.clearable && isInteractive.value && props.modelValue.length > 0,
)

/* ------------------------------------------------------------------ *
 * Keyboard navigation — ArrowUp/Down highlight, Enter selects, Esc closes
 * ------------------------------------------------------------------ */

function isSelectableIndex(i: number): boolean {
  if (i < 0 || i >= activeOptions.value.length) return false
  const candidate: NormalizedOption | undefined = activeOptions.value[i]
  return candidate !== undefined && !candidate.disabled
}

function onKeydown(event: KeyboardEvent): void {
  if (!isInteractive.value) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (!showMenu.value) return
    event.preventDefault()
    const count = activeOptions.value.length
    if (count === 0) return
    // Step by 1, skipping disabled options; wrap around at both ends.
    const dir = event.key === 'ArrowDown' ? 1 : -1
    // Start "before the list" for ArrowUp so none(-1) wraps to the last
    // option, mirroring naive's menu behavior.
    let i = dir === 1 ? activeIndex.value : (activeIndex.value < 0 ? count : activeIndex.value)
    for (let step = 0; step < count; step++) {
      i = (i + dir + count) % count
      if (isSelectableIndex(i)) break
    }
    if (isSelectableIndex(i)) activeIndex.value = i
  } else if (event.key === 'Enter') {
    if (!showMenu.value || activeOption.value === null) return
    event.preventDefault()
    selectOption(activeOption.value)
  } else if (event.key === 'Escape') {
    if (isMenuOpen.value) event.preventDefault()
    closeMenu()
  }
}

/* ------------------------------------------------------------------ *
 * Selection
 * ------------------------------------------------------------------ */

const inputId = useId()
const inputEl = ref<HTMLInputElement | null>(null)

function selectOption(option: NormalizedOption): void {
  if (option.disabled) return
  emitValue(option.value)
  emit('change', option.value)
  emit('select', option.value)
  closeMenu()
  if (props.blurAfterSelect) {
    nextTick(() => {
      inputEl.value?.blur()
    })
  }
}

/** Hover moves the highlight too (naive behavior). */
function onOptionEnter(i: number): void {
  if (isSelectableIndex(i)) activeIndex.value = i
}

/* ------------------------------------------------------------------ *
 * Outside-click close — document listener with unmount cleanup
 * (AGENTS.md §42 / §82)
 * ------------------------------------------------------------------ */

function onDocumentPointerdown(event: PointerEvent): void {
  const target = event.target as Node | null
  if (target === null) return
  const root = rootEl.value
  if (root !== null && root.contains(target)) return
  closeMenu()
}

const rootEl = ref<HTMLElement | null>(null)

document.addEventListener('pointerdown', onDocumentPointerdown)

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerdown)
})

/* ------------------------------------------------------------------ *
 * Panel placement + scroll follow — the dropdown is absolutely positioned
 * (glued to the field by the browser), so "reposition" only maintains the
 * flip placement: drop below the field when the viewport has room, flip
 * above when it doesn't (the --flip class; the page scrolling changes the
 * room, so placement is re-derived on scroll/resize while open).
 * ------------------------------------------------------------------ */

const menuEl = ref<HTMLElement | null>(null)
const isFlipped = ref(false)

function repositionMenu(): void {
  const root = rootEl.value
  const menu = menuEl.value
  if (root === null || menu === null) return
  const rootRect = root.getBoundingClientRect()
  const roomBelow = window.innerHeight - rootRect.bottom
  const roomAbove = rootRect.top
  isFlipped.value = roomBelow < menu.offsetHeight && roomAbove > roomBelow
}

/** Scroll/resize follow while the dropdown is open (useOverlayFollow). */
const followViewport = useOverlayFollow(rootEl, menuEl, repositionMenu, isMenuOpen)

/* ------------------------------------------------------------------ *
 * Highlight — naive's nested-label highlight semantics, simplified to
 * substring containment matching per segment (per task spec).
 * ------------------------------------------------------------------ */

/** One renderable chunk of a segment: matched (highlighted) or plain. */
interface LabelChunk {
  text: string
  matched: boolean
}

/**
 * Split a segment into matched / plain chunks against the query.
 * Containment match (case-sensitive), simplified from naive's matcher.
 */
function splitSegment(segment: string, query: string): LabelChunk[] {
  if (query.length === 0) return [{ text: segment, matched: false }]
  const chunks: LabelChunk[] = []
  let rest = segment
  while (rest.length > 0) {
    const hit = rest.indexOf(query)
    if (hit < 0) {
      chunks.push({ text: rest, matched: false })
      break
    }
    if (hit > 0) chunks.push({ text: rest.slice(0, hit), matched: false })
    chunks.push({ text: query, matched: true })
    rest = rest.slice(hit + query.length)
  }
  return chunks
}

/**
 * Highlight query — the value the user typed. Uses the current modelValue
 * (the input text) so both `options` and `getShow` flows highlight.
 */
const highlightQuery = computed(() => props.modelValue)

const renderedOptions = computed(() =>
  activeOptions.value.map((option) => ({
    ...option,
    chunkedSegments: option.segments.map(
      (segment) => splitSegment(segment, highlightQuery.value),
    ),
  })),
)

/* ------------------------------------------------------------------ *
 * ARIA / classes
 * ------------------------------------------------------------------ */

const ariaInvalid = computed(() =>
  props.status === 'error' ? 'true' : undefined,
)

const classList = computed(() => [
  'sn-auto-complete',
  `sn-auto-complete--${props.size}`,
  {
    'sn-auto-complete--disabled': props.disabled,
    'sn-auto-complete--readonly': props.readonly,
    [`sn-auto-complete--status-${props.status}`]: props.status !== 'default',
    'sn-auto-complete--with-clear': clearVisible.value,
    'sn-auto-complete--menu-open': isMenuOpen.value,
  },
])

// useId import lives in the <script setup> block above.
</script>


<template>
  <div
    ref="rootEl"
    :class="classList"
    :data-snui-component="'auto-complete'"
    :data-size="size"
    :data-status="status"
  >
    <input
      :id="inputId"
      ref="inputEl"
      class="sn-auto-complete__native"
      type="text"
      role="combobox"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-label="ariaLabel"
      :aria-invalid="ariaInvalid"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      :aria-autocomplete="'list'"
      :aria-controls="isMenuOpen ? `${inputId}-menu` : undefined"
      :aria-activedescendant="ariaActiveDescendant"
      autocomplete="off"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
    >

    <span v-if="clearVisible" class="sn-auto-complete__clear">
      <button
        type="button"
        class="sn-auto-complete__clear-btn"
        aria-label="Clear input"
        @click="onClear"
      >
        <SnIcon :icon="XIcon" :size="10" />
      </button>
    </span>

    <!-- Dropdown panel: absolutely positioned below the field (flips up when
         there is no room below — placement derived by repositionMenu). -->
    <Transition name="sn-pop">
      <div
        v-if="showMenu || showEmpty"
        :id="`${inputId}-menu`"
        ref="menuEl"
        class="sn-auto-complete__menu"
        :class="{ 'sn-auto-complete__menu--flip': isFlipped }"
        role="listbox"
        :aria-label="ariaLabel || 'Suggestions'"
      >
        <div v-if="showEmpty" class="sn-auto-complete__empty">
          <slot name="empty">No data</slot>
        </div>
        <template v-else>
          <div
            v-for="(option, i) in renderedOptions"
            :key="option.id"
            :id="option.id"
            class="sn-auto-complete__option"
            :class="{ 'sn-auto-complete__option--active': i === activeIndex }"
            role="option"
            :aria-selected="i === activeIndex ? 'true' : 'false'"
            :aria-disabled="option.disabled ? 'true' : undefined"
            :data-disabled="option.disabled"
            @mouseenter="onOptionEnter(i)"
            @mousedown.prevent
            @click="selectOption(option)"
          >
            <template v-for="(chunks, si) in option.chunkedSegments" :key="si">
              <span
                v-for="(chunk, ci) in chunks"
                :key="ci"
                :class="chunk.matched ? 'sn-auto-complete__option-hl' : ''"
              >{{ chunk.text }}</span>
              <span v-if="si < option.chunkedSegments.length - 1" class="sn-auto-complete__option-sep">&nbsp;</span>
            </template>
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.sn-auto-complete {
  display: inline-flex;
  align-items: center;
  position: relative;
  padding: 0 var(--sn-web-auto-complete-padding-x, var(--sn-web-input-padding-x, 10px));
  border: 1px solid var(--sn-web-auto-complete-border-color, var(--sn-web-input-border-color, var(--sn-web-color-border-subtle)));
  border-radius: var(--sn-web-auto-complete-radius, var(--sn-web-input-radius, 6px));
  background-color: var(--sn-web-auto-complete-bg, var(--sn-web-input-bg, var(--sn-web-color-background-surface)));
  color: var(--sn-web-auto-complete-text-color, var(--sn-web-input-text-color, var(--sn-web-color-text-primary)));
  font-family: inherit;
  line-height: 1;
  transition: border-color 0.18s ease-out, box-shadow 0.18s ease-out;
  box-sizing: border-box;
}

.sn-auto-complete:focus-within {
  border-color: var(--sn-web-auto-complete-border-color-focus, var(--sn-web-input-border-color-focus, var(--sn-web-color-action-primary)));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, rgba(22, 119, 255, 0.15));
}

/* Sizes — mirror SnInput presets. */
.sn-auto-complete--mini { height: 22px; font-size: 11px; }
.sn-auto-complete--tiny { height: 24px; font-size: 12px; }
.sn-auto-complete--small { height: 28px; font-size: 13px; }
.sn-auto-complete--medium { height: 32px; font-size: 14px; }
.sn-auto-complete--large { height: 40px; font-size: 15px; }

/* Status */
.sn-auto-complete--status-error {
  border-color: var(--sn-web-color-feedback-danger);
}
.sn-auto-complete--status-error:focus-within {
  border-color: var(--sn-web-color-feedback-danger);
  box-shadow: 0 0 0 3px var(--sn-web-color-feedback-danger-soft, rgba(255, 77, 79, 0.15));
}
.sn-auto-complete--status-warning {
  border-color: var(--sn-web-color-feedback-warning);
}
.sn-auto-complete--status-warning:focus-within {
  border-color: var(--sn-web-color-feedback-warning);
  box-shadow: 0 0 0 3px var(--sn-web-color-feedback-warning-soft, rgba(250, 173, 20, 0.15));
}

/* States */
.sn-auto-complete--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.sn-auto-complete--disabled .sn-auto-complete__native {
  cursor: not-allowed;
}
.sn-auto-complete--readonly .sn-auto-complete__native {
  cursor: default;
}

/* Native input fills the row */
.sn-auto-complete__native {
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1.4;
  padding: 0;
}

.sn-auto-complete__native::placeholder {
  color: var(--sn-web-auto-complete-placeholder-color, var(--sn-web-input-placeholder-color, var(--sn-web-color-text-tertiary)));
  opacity: 1;
}

/* Clear button */
.sn-auto-complete__clear {
  display: inline-flex;
  align-items: center;
}

.sn-auto-complete__clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--sn-web-auto-complete-clear-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
  padding: 0 4px;
}

.sn-auto-complete__clear-btn:hover {
  color: var(--sn-web-auto-complete-clear-color-hover, var(--sn-web-color-text-primary));
}

/* Dropdown panel — absolutely positioned, bottom by default. */
.sn-auto-complete__menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--sn-web-auto-complete-menu-gap, 4px);
  max-height: var(--sn-web-auto-complete-menu-max-height, 240px);
  overflow-y: auto;
  padding: var(--sn-web-auto-complete-menu-padding, 4px) 0;
  border-radius: var(--sn-web-auto-complete-menu-radius, 3px);
  background-color: var(--sn-web-auto-complete-menu-bg, var(--sn-web-color-background-elevated));
  border: 1px solid var(--sn-web-auto-complete-menu-border-color, rgba(0, 0, 0, 0.06));
  /* naive-ui popover shadow — three faint layers, airy instead of heavy. */
  box-shadow: var(
    --sn-web-auto-complete-menu-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
  z-index: var(--sn-web-auto-complete-menu-z-index, 100);
}

/* The panel drops from the trigger edge it is anchored to. */
.sn-auto-complete__menu {
  transform-origin: center top;
}

/* Flip-up variant (no room below) — flipped by the JS placement check. */
.sn-auto-complete__menu--flip {
  top: auto;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: var(--sn-web-auto-complete-menu-gap, 4px);
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

/* Options */
.sn-auto-complete__option {
  padding: var(--sn-web-auto-complete-option-padding-y, 6px)
    var(--sn-web-auto-complete-option-padding-x, 10px);
  font-size: inherit;
  line-height: 1.4;
  color: var(--sn-web-auto-complete-option-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}

.sn-auto-complete__option:hover,
.sn-auto-complete__option--active {
  background-color: var(--sn-web-auto-complete-option-bg-active, var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04)));
  color: var(--sn-web-auto-complete-option-text-color-active, var(--sn-web-color-action-primary));
}

.sn-auto-complete__option[data-disabled='true'] {
  cursor: not-allowed;
  color: var(--sn-web-auto-complete-option-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-auto-complete__option[data-disabled='true']:hover,
.sn-auto-complete__option[data-disabled='true'].sn-auto-complete__option--active {
  background-color: transparent;
  color: var(--sn-web-auto-complete-option-text-color-disabled, var(--sn-web-color-text-disabled));
}

/* Highlighted (matched) segment chunk */
.sn-auto-complete__option-hl {
  color: var(--sn-web-auto-complete-highlight-color, var(--sn-web-color-action-primary));
  font-weight: var(--sn-web-auto-complete-highlight-weight, 600);
}

/* Empty state */
.sn-auto-complete__empty {
  padding: var(--sn-web-auto-complete-empty-padding, 12px) 0;
  text-align: center;
  font-size: inherit;
  color: var(--sn-web-auto-complete-empty-color, var(--sn-web-color-text-tertiary));
}
</style>
