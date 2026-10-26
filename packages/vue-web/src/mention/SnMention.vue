<script setup lang="ts">
/**
 * SnMention — web-end mention input (naive-ui 1:1 parity).
 *
 * Reference library: naive-ui `n-mention`
 *   (https://www.naiveui.com/zh-CN/light/components/mention)
 * Props + semantics mirror n-mention's main surface.
 *
 * Parity (this version):
 *   - modelValue (string) / options (string | { label, value? })
 *   - delimiter: string (default '@') or array of strings (each simplified
 *     to its last character — n-mention keys off the char before the caret)
 *   - placeholder / disabled / readonly / size / status
 *   - type='text' | 'textarea'
 *   - events: update:modelValue, change, select, focus, blur
 *   - slot: empty
 *   - trigger: typing a delimiter opens the panel; the text after the
 *     delimiter (up to the caret) filters the options live
 *   - keyboard: ArrowUp/Down highlight, Enter/Tab select, Esc closes;
 *     selection replaces the trigger word (delimiter + query) with
 *     delimiter + value
 *   - panel: Teleported to body, fixed positioning, viewport flip
 *   - a11y: input role=combobox + aria-expanded + aria-activedescendant,
 *     panel role=listbox with role=option rows
 *
 * Per AGENTS.md §30/31: contract declared via defineProps / defineEmits /
 * defineSlots + CSS variables (`--sn-web-mention-*` component tokens with
 * `--sn-web-color-*` semantic fallbacks).
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { type SnMentionOption, type SnMentionRawOption } from './sn-mention-types';
import { useOverlayFollow } from '../_internal/use-overlay-follow';

defineOptions({ name: 'SnMention' });

const props = withDefaults(
  defineProps<{
    /** Bound value (`v-model`). */
    modelValue?: string;
    /** Static candidate list. */
    options?: SnMentionRawOption[];
    /**
     * Trigger character(s). A string delimiter uses its last character as
     * the trigger char (n-mention semantics); an array accepts any of the
     * entries' last characters (each simplified to a single char).
     */
    delimiter?: string | string[];
    /** Placeholder text. */
    placeholder?: string;
    /** Disables interaction (typing, selecting). */
    disabled?: boolean;
    /** Read-only — value visible, not editable, no panel. */
    readonly?: boolean;
    /** Visual size preset. */
    size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large';
    /** Visual status. Drives border color. */
    status?: 'default' | 'error' | 'warning';
    /** Input variant: single-line text or multi-line textarea. */
    type?: 'text' | 'textarea';
    /** Rows for `type="textarea"`. */
    rows?: number;
    /** Native ARIA label. */
    ariaLabel?: string;
  }>(),
  {
    modelValue: '',
    options: () => [],
    delimiter: '@',
    placeholder: '',
    disabled: false,
    readonly: false,
    size: 'medium',
    status: 'default',
    type: 'text',
    rows: 3,
    ariaLabel: '',
  },
);

const emit = defineEmits<{
  /** v-model sync. Fired on every keystroke and on selection. */
  (e: 'update:modelValue', value: string): void;
  /** Value committed (selection). */
  (e: 'change', value: string): void;
  /** An option was picked from the panel (click / Enter / Tab). */
  (e: 'select', option: SnMentionOption): void;
  /** Native focus. */
  (e: 'focus', event: FocusEvent): void;
  /** Native blur. */
  (e: 'blur', event: FocusEvent): void;
}>();

defineSlots<{
  /** Empty-state content for the panel (default: "No data" text). */
  empty?(): unknown;
}>();

/* ------------------------------------------------------------------ *
 * Delimiter handling
 * ------------------------------------------------------------------ */

/**
 * Trigger characters — every delimiter entry is simplified to its last
 * character (n-mention keys off the char immediately before the caret).
 */
const triggerChars = computed<string[]>(() => {
  const raw = props.delimiter;
  const list = Array.isArray(raw) ? raw : [raw];
  const chars: string[] = [];
  for (const entry of list) {
    if (entry.length === 0) continue;
    const char = entry[entry.length - 1];
    if (char !== undefined && !chars.includes(char)) chars.push(char);
  }
  return chars;
});

/** The delimiter rendered back into the text on selection. */
function delimiterFor(char: string): string {
  const raw = props.delimiter;
  const list = Array.isArray(raw) ? raw : [raw];
  for (const entry of list) {
    if (entry.length > 0 && entry[entry.length - 1] === char) return entry;
  }
  return char;
}

/* ------------------------------------------------------------------ *
 * Option normalization
 * ------------------------------------------------------------------ */

/** A normalized candidate ready for rendering / selection. */
interface NormalizedOption {
  /** Display label. */
  label: string;
  /** Text committed on selection (without the delimiter). */
  value: string;
  disabled: boolean;
  /** Stable DOM id for aria-activedescendant. */
  id: string;
}

let optionIdSeed = 0;

function normalizeOption(raw: SnMentionRawOption): NormalizedOption | null {
  const idx = optionIdSeed++;
  if (typeof raw === 'string') {
    if (raw.length === 0) return null;
    return {
      label: raw,
      value: raw,
      disabled: false,
      id: `sn-mention-option-${idx}`,
    };
  }
  if (raw === null || raw === undefined) return null;
  const label = raw.label;
  const value = raw.value !== undefined && raw.value !== null ? String(raw.value) : label;
  return {
    label,
    value,
    disabled: raw.disabled === true,
    id: `sn-mention-option-${idx}`,
  };
}

/** All normalized candidates (unfiltered). */
const normalizedOptions = computed<NormalizedOption[]>(() =>
  props.options.map(normalizeOption).filter((o): o is NormalizedOption => o !== null),
);

/** Options filtered by the current query (case-insensitive containment). */
const filteredOptions = computed<NormalizedOption[]>(() => {
  const query = triggerQuery.value;
  if (query.length === 0) return normalizedOptions.value;
  const lowered = query.toLowerCase();
  return normalizedOptions.value.filter((option) => option.label.toLowerCase().includes(lowered));
});

/* ------------------------------------------------------------------ *
 * Trigger-word detection
 * ------------------------------------------------------------------ */

/** One active trigger occurrence found by scanning up to the caret. */
interface TriggerState {
  /** The delimiter character that started this trigger. */
  char: string;
  /** Start index of the delimiter in the current value. */
  start: number;
  /** Text typed after the delimiter (up to the caret). */
  query: string;
}

const inputId = useId();
const inputEl = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);

/**
 * Scan the value up to the caret for a trigger char followed by a
 * word-ish query. The trigger word ends at the caret; text after the caret
 * (or a whitespace before the caret) invalidates it.
 */
function detectTrigger(): TriggerState | null {
  const el = inputEl.value;
  if (el === null) return null;
  const value = el.value;
  const caret = el.selectionStart ?? value.length;
  const chars = triggerChars.value;
  if (chars.length === 0) return null;
  // Walk back from the caret; stop at the first whitespace.
  let i = caret;
  while (i > 0) {
    const prev = value[i - 1];
    if (prev === undefined || /\s/.test(prev)) break;
    if (chars.includes(prev)) {
      // A trigger char is itself a word boundary — the word it starts
      // must not be preceded by another non-space char? n-mention accepts
      // it anywhere; we do too (e.g. "(@foo" triggers on '@').
      return { char: prev, start: i - 1, query: value.slice(i, caret) };
    }
    i -= 1;
  }
  return null;
}

/** Current trigger state (null = panel closed source). */
const triggerState = ref<TriggerState | null>(null);
/** Text typed after the delimiter while the trigger is active. */
const triggerQuery = ref('');
/** Panel visibility. */
const isMenuOpen = ref(false);
/** Index of the keyboard-highlighted option (-1 = none). */
const activeIndex = ref(-1);

const isInteractive = computed(() => !props.disabled && !props.readonly);

const showMenu = computed(() => isMenuOpen.value && filteredOptions.value.length > 0);

/** Show the empty slot / text when open with zero candidates. */
const showEmpty = computed(() => isMenuOpen.value && filteredOptions.value.length === 0);

/** Currently highlighted option (or null). */
const activeOption = computed<NormalizedOption | null>(() => {
  const i = activeIndex.value;
  if (i < 0 || i >= filteredOptions.value.length) return null;
  const found: NormalizedOption | undefined = filteredOptions.value[i];
  return found ?? null;
});

/** aria-activedescendant — points at the highlighted option. */
const ariaActiveDescendant = computed<string | undefined>(() =>
  activeOption.value !== null ? activeOption.value.id : undefined,
);

/** Reset the highlight whenever the candidate list changes underneath. */
watch(filteredOptions, () => {
  activeIndex.value = -1;
});

/** Re-detect the trigger from the DOM value + caret and sync panel state. */
function refreshTrigger(): void {
  if (!isInteractive.value) {
    triggerState.value = null;
    isMenuOpen.value = false;
    return;
  }
  const state = detectTrigger();
  triggerState.value = state;
  if (state === null) {
    isMenuOpen.value = false;
    triggerQuery.value = '';
  } else {
    triggerQuery.value = state.query;
    isMenuOpen.value = true;
  }
}

function closeMenu(): void {
  isMenuOpen.value = false;
  followViewport.stop();
  triggerState.value = null;
  triggerQuery.value = '';
  activeIndex.value = -1;
}

/* ------------------------------------------------------------------ *
 * Input handling
 * ------------------------------------------------------------------ */

function emitValue(next: string): void {
  emit('update:modelValue', next);
}

function onInput(event: Event): void {
  if (!isInteractive.value) return;
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  // The DOM element is the source of truth for caret-aware filtering —
  // sync the model from the element, then detect the trigger word.
  emitValue(target.value);
  refreshTrigger();
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true;
  if (props.disabled) return;
  emit('focus', event);
  // Right after a selection the input is programmatically (re)focused with
  // the caret moved past the inserted mention — that focus must not
  // re-detect the freshly inserted "@user" as a new trigger word.
  if (suppressFocusRefresh) {
    suppressFocusRefresh = false;
    return;
  }
  // A focused field whose value already carries an open trigger word
  // (caret inside it) re-opens the panel.
  refreshTrigger();
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false;
  closeMenu();
  emit('blur', event);
}

/** Skip the next model-watch re-detect after a selection committed. */
let suppressModelWatch = false;
/** Skip the next focus-triggered refresh after a selection committed. */
let suppressFocusRefresh = false;

/** Keep the internal state honest when the model changes from outside. */
watch(
  () => props.modelValue,
  () => {
    if (suppressModelWatch) {
      suppressModelWatch = false;
      return;
    }
    // nextTick: the DOM value binding (`:value`) must settle first so
    // detectTrigger reads the same text the user sees.
    void nextTick(() => {
      if (isFocused.value) refreshTrigger();
    });
  },
);

const isFocused = ref(false);

/* ------------------------------------------------------------------ *
 * Keyboard navigation
 * ------------------------------------------------------------------ */

function isSelectableIndex(i: number): boolean {
  if (i < 0 || i >= filteredOptions.value.length) return false;
  const candidate: NormalizedOption | undefined = filteredOptions.value[i];
  return candidate !== undefined && !candidate.disabled;
}

function onKeydown(event: KeyboardEvent): void {
  if (!isInteractive.value) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (!showMenu.value) return;
    event.preventDefault();
    const count = filteredOptions.value.length;
    if (count === 0) return;
    const dir = event.key === 'ArrowDown' ? 1 : -1;
    // Start "before the list" for ArrowUp so none(-1) wraps to the last
    // option, mirroring naive's menu behavior.
    let i = dir === 1 ? activeIndex.value : activeIndex.value < 0 ? count : activeIndex.value;
    for (let step = 0; step < count; step++) {
      i = (i + dir + count) % count;
      if (isSelectableIndex(i)) break;
    }
    if (isSelectableIndex(i)) activeIndex.value = i;
  } else if (event.key === 'Enter' || event.key === 'Tab') {
    if (!showMenu.value || activeOption.value === null) return;
    event.preventDefault();
    selectOption(activeOption.value);
  } else if (event.key === 'Escape') {
    if (isMenuOpen.value) event.preventDefault();
    closeMenu();
  }
}

/* ------------------------------------------------------------------ *
 * Selection — replace the trigger word with delimiter + value
 * ------------------------------------------------------------------ */

function selectOption(option: NormalizedOption): void {
  if (option.disabled) return;
  const el = inputEl.value;
  const state = triggerState.value;
  if (el === null || state === null) return;
  const value = el.value;
  const caret = el.selectionStart ?? value.length;
  // Replace from the delimiter through the caret (the typed query),
  // keeping any text after the caret intact.
  const replacement = `${delimiterFor(state.char)}${option.value}`;
  const next = value.slice(0, state.start) + replacement + value.slice(caret);
  // Mark this emit as self-originated so the model watcher does not
  // re-detect the freshly inserted "@user" as a new trigger word.
  suppressModelWatch = true;
  emitValue(next);
  emit('change', next);
  emit('select', { label: option.label, value: option.value });
  closeMenu();
  // Move the caret after the inserted mention and keep focus (naive keeps
  // the input focused so typing can continue). The focus event fires with
  // the caret still at the old position, so refresh-on-focus is
  // suppressed for this one tick.
  void nextTick(() => {
    const focusEl = inputEl.value;
    if (focusEl === null) return;
    const pos = state.start + replacement.length;
    suppressFocusRefresh = true;
    focusEl.focus();
    focusEl.setSelectionRange(pos, pos);
    // Belt and braces: if focus was already on the element (no focus event
    // fired), the suppress flag would leak — consume it explicitly.
    if (suppressFocusRefresh) suppressFocusRefresh = false;
  });
}

/** Hover moves the highlight too (naive behavior). */
function onOptionEnter(i: number): void {
  if (isSelectableIndex(i)) activeIndex.value = i;
}

/* ------------------------------------------------------------------ *
 * Panel positioning — Teleport + fixed coords + viewport flip
 * (same simplified strategy as SnSelect; no full popper)
 * ------------------------------------------------------------------ */

const PANEL_VIEWPORT_GAP = 4;
const menuId = `${inputId}-menu`;
const menuEl = ref<HTMLElement | null>(null);
const placement = ref<'bottom' | 'top'>('bottom');
const menuStyle = ref<Record<string, string>>({});

function repositionMenu(): void {
  const root = rootEl.value;
  const menu = menuEl.value;
  if (root === null || menu === null) return;
  const rootRect = root.getBoundingClientRect();
  // offsetWidth/offsetHeight read the layout box, which the sn-pop enter
  // transform (scale 0.92) does not distort — getBoundingClientRect would
  // measure the scaled panel while the enter transition is running.
  const menuWidth = menu.offsetWidth;
  const menuHeight = menu.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const width = Math.max(rootRect.width, menuWidth);
  const left = Math.min(
    Math.max(PANEL_VIEWPORT_GAP, rootRect.left),
    Math.max(PANEL_VIEWPORT_GAP, vw - width - PANEL_VIEWPORT_GAP),
  );

  // Bottom preferred; flip up when the viewport lacks room below but has
  // room above.
  const roomBelow = vh - rootRect.bottom;
  const roomAbove = rootRect.top;
  const useTop = roomBelow < menuHeight && roomAbove > roomBelow;
  placement.value = useTop ? 'top' : 'bottom';

  const top = useTop ? Math.max(PANEL_VIEWPORT_GAP, rootRect.top - menuHeight) : rootRect.bottom;

  menuStyle.value = {
    position: 'fixed',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
    'min-width': `${Math.round(rootRect.width)}px`,
  };
}

watch(isMenuOpen, (open) => {
  if (open) {
    void nextTick(() => {
      repositionMenu();
      followViewport.start();
    });
  }
});

watch(filteredOptions, () => {
  if (isMenuOpen.value) void nextTick(() => repositionMenu());
});

/* ------------------------------------------------------------------ *
 * Outside-click close — document listener with unmount cleanup
 * (AGENTS.md §42 / §82)
 * ------------------------------------------------------------------ */

const rootEl = ref<HTMLElement | null>(null);

function onDocumentPointerdown(event: PointerEvent): void {
  if (!isMenuOpen.value) return;
  const target = event.target as Node | null;
  if (target === null) return;
  if (rootEl.value !== null && rootEl.value.contains(target)) return;
  if (menuEl.value !== null && menuEl.value.contains(target)) return;
  closeMenu();
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerdown);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerdown);
  followViewport.stop();
});

/* Scroll/resize follow: while the panel is open, any scroll (page or a
 * nested scrollable ancestor) or viewport resize re-runs repositionMenu so
 * the fixed-position panel stays glued to the input instead of detaching.
 * Declared after rootEl/menuEl exist; closeMenu/open-watch reference it at
 * call time. */
const followViewport = useOverlayFollow(rootEl, menuEl, repositionMenu, isMenuOpen);

/* ------------------------------------------------------------------ *
 * ARIA / classes
 * ------------------------------------------------------------------ */

const ariaInvalid = computed(() => (props.status === 'error' ? 'true' : undefined));

const classList = computed(() => [
  'sn-mention',
  `sn-mention--${props.size}`,
  {
    'sn-mention--disabled': props.disabled,
    'sn-mention--readonly': props.readonly,
    'sn-mention--textarea': props.type === 'textarea',
    [`sn-mention--status-${props.status}`]: props.status !== 'default',
    'sn-mention--menu-open': isMenuOpen.value,
  },
]);
</script>

<template>
  <div
    ref="rootEl"
    :class="classList"
    :data-snui-component="'mention'"
    :data-size="size"
    :data-status="status"
  >
    <textarea
      v-if="type === 'textarea'"
      :id="inputId"
      ref="inputEl"
      class="sn-mention__native"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :aria-label="ariaLabel"
      :aria-invalid="ariaInvalid"
      role="combobox"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      :aria-autocomplete="'list'"
      :aria-controls="isMenuOpen ? menuId : undefined"
      :aria-activedescendant="ariaActiveDescendant"
      autocomplete="off"
      @input="onInput"
      @focus="
        isFocused = true;
        onFocus($event);
      "
      @blur="
        isFocused = false;
        onBlur($event);
      "
      @keydown="onKeydown"
    />
    <input
      v-else
      :id="inputId"
      ref="inputEl"
      class="sn-mention__native"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-label="ariaLabel"
      :aria-invalid="ariaInvalid"
      role="combobox"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      :aria-autocomplete="'list'"
      :aria-controls="isMenuOpen ? menuId : undefined"
      :aria-activedescendant="ariaActiveDescendant"
      autocomplete="off"
      @input="onInput"
      @focus="
        isFocused = true;
        onFocus($event);
      "
      @blur="
        isFocused = false;
        onBlur($event);
      "
      @keydown="onKeydown"
    />

    <!-- Candidate panel: Teleported to body, fixed positioning with
         viewport flip (placement class is informational; coords come from
         the reposition pass). -->
    <Teleport to="body">
      <Transition name="sn-pop">
        <div
          v-if="showMenu || showEmpty"
          :id="menuId"
          ref="menuEl"
          :class="['sn-mention__menu', `sn-mention__menu--${placement}`]"
          :style="menuStyle"
          role="listbox"
          :aria-label="ariaLabel || 'Suggestions'"
        >
          <div v-if="showEmpty" class="sn-mention__empty">
            <slot name="empty">No data</slot>
          </div>
          <template v-else>
            <div
              v-for="(option, i) in filteredOptions"
              :key="option.id"
              :id="option.id"
              class="sn-mention__option"
              :class="{ 'sn-mention__option--active': i === activeIndex }"
              role="option"
              :aria-selected="i === activeIndex ? 'true' : 'false'"
              :aria-disabled="option.disabled ? 'true' : undefined"
              :data-disabled="option.disabled"
              @mouseenter="onOptionEnter(i)"
              @mousedown.prevent
              @click="selectOption(option)"
            >
              {{ option.label }}
            </div>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.sn-mention {
  display: inline-flex;
  align-items: center;
  position: relative;
  padding: 0 var(--sn-web-mention-padding-x, var(--sn-web-input-padding-x, 10px));
  border: 1px solid var(--sn-web-mention-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-mention-radius, var(--sn-web-input-radius, 6px));
  background-color: var(--sn-web-mention-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-mention-text-color, var(--sn-web-color-text-primary));
  font-family: inherit;
  line-height: 1;
  transition:
    border-color 0.18s ease-out,
    box-shadow 0.18s ease-out;
  box-sizing: border-box;
}

.sn-mention:focus-within {
  border-color: var(--sn-web-mention-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px
    var(--sn-web-mention-focus-ring, var(--sn-web-focus-ring, rgba(22, 119, 255, 0.15)));
}

/* Textarea variant: align top, grow vertically. */
.sn-mention--textarea {
  align-items: flex-start;
}

.sn-mention--textarea .sn-mention__native {
  resize: vertical;
  padding: var(--sn-web-mention-textarea-padding-y, 6px) 0;
  line-height: 1.4;
}

/* Sizes — mirror SnInput presets. */
.sn-mention--mini {
  height: 22px;
  font-size: 11px;
}
.sn-mention--tiny {
  height: 24px;
  font-size: 12px;
}
.sn-mention--small {
  height: 28px;
  font-size: 13px;
}
.sn-mention--medium {
  height: 32px;
  font-size: 14px;
}
.sn-mention--large {
  height: 40px;
  font-size: 15px;
}

/* Textarea sizes: height driven by rows, only font-size scales. */
.sn-mention--textarea.sn-mention--mini {
  height: auto;
}
.sn-mention--textarea.sn-mention--tiny {
  height: auto;
}
.sn-mention--textarea.sn-mention--small {
  height: auto;
}
.sn-mention--textarea.sn-mention--medium {
  height: auto;
}
.sn-mention--textarea.sn-mention--large {
  height: auto;
}

/* Status */
.sn-mention--status-error {
  border-color: var(--sn-web-color-feedback-danger);
}

.sn-mention--status-error:focus-within {
  border-color: var(--sn-web-color-feedback-danger);
  box-shadow: 0 0 0 3px var(--sn-web-mention-focus-ring-error, rgba(255, 77, 79, 0.15));
}

.sn-mention--status-warning {
  border-color: var(--sn-web-color-feedback-warning);
}

.sn-mention--status-warning:focus-within {
  border-color: var(--sn-web-color-feedback-warning);
  box-shadow: 0 0 0 3px var(--sn-web-mention-focus-ring-warning, rgba(250, 173, 20, 0.15));
}

/* States */
.sn-mention--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.sn-mention--disabled .sn-mention__native {
  cursor: not-allowed;
}

.sn-mention--readonly .sn-mention__native {
  cursor: default;
}

/* Native input / textarea fills the row */
.sn-mention__native {
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

.sn-mention__native::placeholder {
  color: var(--sn-web-mention-placeholder-color, var(--sn-web-color-text-tertiary));
  opacity: 1;
}

/* Candidate panel — fixed coords set from the reposition pass. */
.sn-mention__menu {
  position: fixed;
  max-height: var(--sn-web-mention-menu-max-height, 240px);
  overflow-y: auto;
  padding: var(--sn-web-mention-menu-padding, 4px) 0;
  border-radius: var(--sn-web-mention-menu-radius, 3px);
  background-color: var(--sn-web-mention-menu-bg, var(--sn-web-color-background-elevated));
  border: 1px solid var(--sn-web-mention-menu-border-color, rgba(0, 0, 0, 0.06));
  /* naive-ui popover shadow — three faint layers, airy instead of heavy. */
  box-shadow: var(
    --sn-web-mention-menu-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
  z-index: var(--sn-web-mention-menu-z-index, 100);
}

/* The panel drops from the trigger edge it is anchored to. */
.sn-mention__menu--bottom {
  transform-origin: center top;
}

.sn-mention__menu--top {
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
.sn-mention__option {
  padding: var(--sn-web-mention-option-padding-y, 6px) var(--sn-web-mention-option-padding-x, 10px);
  font-size: inherit;
  line-height: 1.4;
  color: var(--sn-web-mention-option-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}

.sn-mention__option:hover,
.sn-mention__option--active {
  background-color: var(
    --sn-web-mention-option-bg-active,
    var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04))
  );
  color: var(--sn-web-mention-option-text-color-active, var(--sn-web-color-action-primary));
}

.sn-mention__option[data-disabled='true'] {
  cursor: not-allowed;
  color: var(--sn-web-mention-option-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-mention__option[data-disabled='true']:hover,
.sn-mention__option[data-disabled='true'].sn-mention__option--active {
  background-color: transparent;
  color: var(--sn-web-mention-option-text-color-disabled, var(--sn-web-color-text-disabled));
}

/* Empty state */
.sn-mention__empty {
  padding: var(--sn-web-mention-empty-padding, 12px) 0;
  text-align: center;
  font-size: inherit;
  color: var(--sn-web-mention-empty-color, var(--sn-web-color-text-tertiary));
}
</style>
