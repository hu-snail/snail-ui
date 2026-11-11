<script setup lang="ts">
/**
 * SnSegment — web-end segmented control (AUI-WEB-SEGMENT-001).
 *
 * Reference library: heroui.pro `Segment`
 *   (https://heroui.pro/docs/react/components/segment)
 * Props + semantics mirror the reference 1:1 with one structural mapping:
 * heroui composes `Segment.Item` children / `Segment.Separator` elements,
 * here they flatten into the data-driven `options` array and the
 * `separators` switch (same rendering contract: separators are hidden
 * adjacent to the selected item).
 *
 * Registered AUI-additive capabilities (AGENTS.md §112.3a, absent upstream):
 *   - `ariaLabel` per option — icon-only items must stay announceable.
 *
 * Selection indicator: an absolutely-positioned thumb slides behind the
 * selected item. Geometry is measured from the item nodes (items are
 * content-sized, so widths differ between text and icon-only items); the
 * transition engages only after the first layout pass so mounting never
 * animates from (0, 0). The back-out curve matches the docs-site pills
 * (SnSidebarEndSwitch / SnDocPage demo switch) that this component replaces.
 *
 * A11y: WAI-ARIA radiogroup pattern — `role="radiogroup"` + `role="radio"`
 * + `aria-checked`, roving tabindex, Arrow keys cycle enabled items,
 * Home / End jump to the first / last enabled item.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnSegment v-model="tab" :options="[{ value: 'a', label: 'A' }]" />
 *   <SnSegment :options="[{ value: 'box', icon: Box, ariaLabel: 'Preview' }]" size="sm" />
 *   <SnSegment variant="ghost" separators :options="opts" />
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { SnSegmentKey, SnSegmentOption } from './sn-segment-types';

defineOptions({ name: 'SnSegment' });

const props = withDefaults(
  defineProps<{
    /** Selectable items (heroui `Segment.Item` list). */
    options: SnSegmentOption[];
    /** Selected key (v-model). Uncontrolled when omitted (heroui `selectedKey`). */
    modelValue?: SnSegmentKey | undefined;
    /** Initial key for the uncontrolled mode (heroui `defaultSelectedKey`). */
    defaultValue?: SnSegmentKey | undefined;
    /** Size preset (heroui `size`). */
    size?: 'sm' | 'md' | 'lg';
    /** Visual variant (heroui `variant`). */
    variant?: 'default' | 'ghost';
    /** Disable every item (heroui `isDisabled`). */
    disabled?: boolean;
    /**
     * Render dividers between adjacent unselected items (heroui
     * `Segment.Separator`; hidden adjacent to the selection).
     */
    separators?: boolean;
  }>(),
  {
    modelValue: undefined,
    defaultValue: undefined,
    size: 'md',
    variant: 'default',
    disabled: false,
    separators: false,
  },
);

const emit = defineEmits<{
  /** Selection change — supports v-model (heroui `onSelectionChange`). */
  (e: 'update:modelValue', key: SnSegmentKey): void;
  /** Selection change (non v-model listener, mirrors heroui naming). */
  (e: 'change', key: SnSegmentKey): void;
}>();

/* ---------- selection state (controlled / uncontrolled) ---------- */

const internalValue = ref<SnSegmentKey | undefined>(props.defaultValue);
const current = computed<SnSegmentKey | undefined>(() =>
  props.modelValue !== undefined ? props.modelValue : internalValue.value,
);

function isSelected(option: SnSegmentOption): boolean {
  return option.value === current.value;
}

/** Enabled (root not disabled + item not disabled) selectable options. */
const enabledOptions = computed(() =>
  props.options.filter((option) => !option.disabled),
);

function select(key: SnSegmentKey): void {
  if (props.disabled || key === current.value) return;
  if (props.options.find((option) => option.value === key)?.disabled) return;
  internalValue.value = key;
  emit('update:modelValue', key);
  emit('change', key);
}

/* ---------- sliding indicator (measured thumb) ---------- */

const rootRef = ref<HTMLElement | null>(null);
const itemRefs = new Map<SnSegmentKey, HTMLElement>();
const thumbX = ref(0);
const thumbWidth = ref(0);
/**
 * False until the first post-layout measurement — keeps the mounting frame
 * from animating the thumb in from (0, 0).
 */
const thumbReady = ref(false);

function setItemRef(key: SnSegmentKey): (el: unknown) => void {
  return (el: unknown) => {
    if (el instanceof HTMLElement) itemRefs.set(key, el);
    else itemRefs.delete(key);
  };
}

function measureThumb(): void {
  const key = current.value;
  const el = key === undefined ? undefined : itemRefs.get(key);
  if (!el) return;
  // Items are direct children of the (position: relative) root, so
  // offsetLeft / offsetWidth are already root-relative.
  thumbX.value = el.offsetLeft;
  thumbWidth.value = el.offsetWidth;
}

function scheduleMeasure(): void {
  void nextTick(measureThumb);
}

watch(() => [current.value, props.options.length], scheduleMeasure);

let resizeObserver: ResizeObserver | null = null;
onMounted(() => {
  scheduleMeasure();
  // First paint, then arm the transition so the initial position is applied
  // without animation.
  requestAnimationFrame(() => {
    thumbReady.value = true;
  });
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(measureThumb);
    if (rootRef.value) resizeObserver.observe(rootRef.value);
  }
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  itemRefs.clear();
});

/* ---------- radiogroup keyboard pattern ---------- */

function focusItem(key: SnSegmentKey): void {
  itemRefs.get(key)?.focus();
}

function moveSelection(step: 1 | -1 | 'first' | 'last'): void {
  const enabled = enabledOptions.value;
  if (enabled.length === 0) return;
  const index = enabled.findIndex((option) => option.value === current.value);
  let next: SnSegmentKey | undefined;
  if (step === 'first') next = enabled[0]?.value;
  else if (step === 'last') next = enabled[enabled.length - 1]?.value;
  else {
    // From an unselected state both directions land on the nearest end.
    const base = index === -1 ? (step === 1 ? -1 : 0) : index;
    next = enabled[(base + step + enabled.length) % enabled.length]?.value;
  }
  if (next === undefined) return;
  select(next);
  focusItem(next);
}

function handleKeydown(event: KeyboardEvent): void {
  if (props.disabled) return;
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      moveSelection(1);
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      moveSelection(-1);
      break;
    case 'Home':
      event.preventDefault();
      moveSelection('first');
      break;
    case 'End':
      event.preventDefault();
      moveSelection('last');
      break;
    default:
      break;
  }
}

/* ---------- roving tabindex ---------- */

/** Selected first; when the selection is missing (or disabled), the first
 * enabled item catches the tab stop instead. */
function tabIndexFor(option: SnSegmentOption): 0 | -1 {
  if (option.disabled) return -1;
  if (isSelected(option)) return 0;
  const selectedEnabled = props.options.some(
    (candidate) => candidate.value === current.value && !candidate.disabled,
  );
  if (selectedEnabled) return -1;
  return enabledOptions.value[0]?.value === option.value ? 0 : -1;
}

/* ---------- separators: hidden adjacent to the selected item ---------- */

function separatorVisible(index: number): boolean {
  const before = props.options[index - 1];
  const after = props.options[index];
  if (!before || !after) return false;
  return before.value !== current.value && after.value !== current.value;
}

function optionLabel(option: SnSegmentOption): string | undefined {
  return option.ariaLabel ?? option.label;
}
</script>

<template>
  <div
    ref="rootRef"
    data-snui-component="segment"
    class="sn-segment"
    :class="[
      `sn-segment--${size}`,
      `sn-segment--${variant}`,
      disabled ? 'sn-segment--disabled' : '',
      separators ? 'sn-segment--separators' : '',
    ]"
    role="radiogroup"
    :aria-disabled="disabled ? 'true' : undefined"
    @keydown="handleKeydown"
  >
    <span
      v-show="current !== undefined && thumbWidth > 0"
      class="sn-segment__thumb"
      :class="{ 'sn-segment__thumb--ready': thumbReady }"
      :style="{ transform: `translateX(${thumbX}px)`, width: `${thumbWidth}px` }"
      aria-hidden="true"
    />
    <template v-for="(option, index) in options" :key="option.value">
      <span
        v-if="separators && index > 0 && separatorVisible(index)"
        class="sn-segment__separator"
        aria-hidden="true"
      />
      <button
        :ref="setItemRef(option.value)"
        type="button"
        role="radio"
        class="sn-segment__item"
        :class="{
          'sn-segment__item--selected': isSelected(option),
          'sn-segment__item--disabled': option.disabled,
        }"
        :aria-checked="isSelected(option) ? 'true' : 'false'"
        :aria-label="optionLabel(option)"
        :tabindex="tabIndexFor(option)"
        :disabled="disabled || option.disabled || undefined"
        @click="select(option.value)"
      >
        <component :is="option.icon" v-if="option.icon" class="sn-segment__icon" />
        <span v-if="option.label !== undefined" class="sn-segment__label">{{ option.label }}</span>
      </button>
    </template>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-segment {
  /* Shell inset — shared by the root padding and the thumb top/bottom so
   * the thumb lines up with the items on every size. */
  --sn-segment-pad: 3px;

  position: relative;
  display: inline-flex;
  align-items: stretch;
  box-sizing: border-box;
  border-radius: 999px;
  background: var(--sn-web-color-background-subtle);
  white-space: nowrap;
}

/* ---------- sizes (heroui: sm 28 / md 32 / lg 40 total height) ---------- */

.sn-segment--sm {
  --sn-segment-pad: 2px;
  height: 28px;
}

.sn-segment--md {
  height: 32px;
}

.sn-segment--lg {
  height: 40px;
}

.sn-segment--sm,
.sn-segment--md,
.sn-segment--lg {
  padding: var(--sn-segment-pad);
}

/* ---------- sliding indicator ---------- */

.sn-segment__thumb {
  position: absolute;
  top: var(--sn-segment-pad);
  bottom: var(--sn-segment-pad);
  left: 0;
  border-radius: 999px;
  background: var(--sn-web-color-background-surface);
  box-shadow: 0 2px 8px rgb(15 23 42 / 0.12);
  pointer-events: none;
  will-change: transform, width;
}

/* Transition arms only after the first measurement (see thumbReady). */
.sn-segment__thumb--ready {
  transition:
    transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1),
    width 480ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ---------- items ---------- */

.sn-segment__item {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-sizing: border-box;
  border: 0;
  border-radius: 999px;
  background: transparent;
  font-family: inherit;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.sn-segment__item--selected {
  color: var(--sn-web-color-text-primary);
  font-weight: 600;
}

.sn-segment__item:focus-visible {
  outline: 2px solid var(--sn-web-color-action-primary);
  outline-offset: -2px;
}

/* Hover on unselected items (heroui: opacity reduction). */
.sn-segment__item:not(.sn-segment__item--selected):not(:disabled):hover {
  color: var(--sn-web-color-text-primary);
}

.sn-segment__item:disabled {
  cursor: not-allowed;
}

.sn-segment__item--disabled {
  opacity: 0.5;
}

.sn-segment__label {
  display: inline-flex;
  align-items: center;
}

.sn-segment__icon {
  flex: none;
  width: 14px;
  height: 14px;
}

/* Per-size type scale: heights 28 / 32 / 40 → 12 / 13 / 14 px text. */
.sn-segment--sm .sn-segment__item {
  padding: 0 10px;
  font-size: 12px;
}

.sn-segment--sm .sn-segment__icon {
  width: 12px;
  height: 12px;
}

.sn-segment--md .sn-segment__item {
  padding: 0 14px;
  font-size: 13px;
}

.sn-segment--lg .sn-segment__item {
  padding: 0 16px;
  font-size: 14px;
}

.sn-segment--lg .sn-segment__icon {
  width: 16px;
  height: 16px;
}

/* ---------- separators (between adjacent unselected items) ---------- */

.sn-segment__separator {
  flex: none;
  align-self: center;
  width: 1px;
  height: 60%;
  background: var(--sn-web-color-border-subtle);
}

/* ---------- disabled root ---------- */

.sn-segment--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.sn-segment--disabled .sn-segment__item {
  cursor: not-allowed;
}

/* ---------- ghost variant: transparent shell + accent indicator ---------- */

.sn-segment--ghost {
  background: transparent;
}

.sn-segment--ghost .sn-segment__thumb {
  background: var(--sn-web-color-action-primary-soft);
  box-shadow: none;
}

.sn-segment--ghost .sn-segment__item--selected {
  color: var(--sn-web-color-action-primary);
}
</style>
