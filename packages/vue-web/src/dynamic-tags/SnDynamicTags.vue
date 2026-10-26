<script setup lang="ts">
/**
 * SnDynamicTags — web-end dynamic tags component.
 *
 * Reference library: naive-ui `n-dynamic-tags`
 *   (https://www.naiveui.com/zh-CN/light/components/dynamic-tags)
 * Props + semantics mirror n-dynamic-tags 1:1 (inputProps simplified to
 * a `placeholder` prop; tags always render as pill-shaped `n-tag type`
 * capsules per the AUI simplification).
 *
 * Interaction (naive parity):
 *   - tag list + trailing「add」trigger button (inline + SVG)
 *   - click the trigger → inline input appears, auto-focused
 *   - Enter commits (trim, non-empty only) and keeps the input open
 *   - Esc cancels; blur commits then closes (naive blur-submit semantics)
 *
 * Per AGENTS.md §30/31: props / events / slots / tokens / accessibility
 * declared below; CSS uses `--sn-web-dynamic-tags-*` aliases falling back
 * to `--sn-web-color-*` only (0 color literals).
 */

import { computed, nextTick, ref, useSlots, type ComponentPublicInstance } from 'vue';

defineOptions({ name: 'SnDynamicTags' });

/** Tag value — naive n-dynamic-tags accepts string | number. */
type SnDynamicTagValue = string | number;

const props = withDefaults(
  defineProps<{
    /** Bound tag array (`v-model`). Emits the complete array on change. */
    modelValue?: SnDynamicTagValue[];
    /** Show the × close button on each tag. Mirrors n-dynamic-tags `closable`. */
    closable?: boolean;
    /** Disables interaction — no trigger, no close buttons. */
    disabled?: boolean;
    /** Read-only — tags visible, no adding / removing. */
    readonly?: boolean;
    /** Visual size preset. Mirrors n-dynamic-tags `size`. */
    size?: 'small' | 'medium' | 'large';
    /** Max tag count — the add trigger hides once reached. */
    max?: number;
    /**
     * How the inline input opens. `click` — only the trigger button opens
     * it; `focus` — clicking anywhere on the component opens it.
     * Mirrors n-dynamic-tags `trigger` (naive default: click).
     */
    trigger?: 'click' | 'focus';
    /** Placeholder for the inline input (simplified `inputProps`). */
    placeholder?: string;
  }>(),
  {
    modelValue: () => [],
    closable: true,
    disabled: false,
    readonly: false,
    size: 'medium',
    trigger: 'click',
    placeholder: '',
  },
);

const emit = defineEmits<{
  /** v-model sync — always the complete next array. */
  (e: 'update:modelValue', value: SnDynamicTagValue[]): void;
  /** Tags array changed (add / remove). Naive `on-change` payload. */
  (e: 'change', value: SnDynamicTagValue[]): void;
  /** A tag was added. Naive `on-add` payload. */
  (e: 'add', value: SnDynamicTagValue): void;
  /** A tag was removed. Naive `on-remove` payload. */
  (e: 'remove', value: SnDynamicTagValue): void;
  /** A tag was clicked. */
  (e: 'click', value: SnDynamicTagValue, event: MouseEvent): void;
}>();

defineSlots<{
  /** Custom inline input (replaces the native input). Scoped: value / placeholder / confirm / cancel / setValue. */
  input?(scoped: {
    value: string;
    placeholder: string;
    confirm: () => void;
    cancel: () => void;
    setValue: (v: string) => void;
  }): unknown;
  /** Custom tag rendering. Scoped: label / index. */
  tag?(scoped: { label: SnDynamicTagValue; index: number }): unknown;
  /** Custom add-trigger content (replaces the default + SVG). */
  trigger?(): unknown;
  /** Empty state when there are no tags. */
  empty?(): unknown;
}>();

const slots = useSlots();

/** True while the inline input is open. */
const isAdding = ref(false);

/** In-flight input text. */
const inputValue = ref('');

const nativeInput = ref<HTMLInputElement | null>(null);

/** Template ref binder — VNodeRef-compatible function form (vue-tsc). */
function setNativeInput(el: Element | ComponentPublicInstance | null): void {
  nativeInput.value = el as HTMLInputElement | null;
}

const isInteractive = computed(() => !props.disabled && !props.readonly);

/** At (or beyond) the max cap — the trigger hides and commits are rejected. */
const isAtMax = computed(() => props.max !== undefined && props.modelValue.length >= props.max);

/** The add trigger renders only when interactive and below max. */
const triggerVisible = computed(() => isInteractive.value && !isAtMax.value);

/** Effective tags array — prop wins (controlled), else empty. */
const tags = computed<SnDynamicTagValue[]>(() => props.modelValue ?? []);

/** Slot-bound placeholder — always a concrete string (vue-tsc checks slot
 * props against the declared `string`, while the prop itself stays
 * optional under exactOptionalPropertyTypes). */
const inputPlaceholder = computed<string>(() => props.placeholder ?? '');

const classList = computed(() => [
  'sn-dynamic-tags',
  `sn-dynamic-tags--${props.size}`,
  {
    'sn-dynamic-tags--disabled': props.disabled,
    'sn-dynamic-tags--readonly': props.readonly,
    'sn-dynamic-tags--adding': isAdding.value,
  },
]);

function startAdd(): void {
  if (!isInteractive.value || isAtMax.value) return;
  isAdding.value = true;
  inputValue.value = '';
  nextTick(() => {
    nativeInput.value?.focus();
  });
}

/**
 * Commit the in-flight text: trim, ignore empty, append. `keepOpen` keeps
 * the input open for continued entry (Enter path, naive semantics); blur
 * passes `false` — commit then close. Closes anyway once max is hit.
 */
function confirmInput(keepOpen = true): void {
  const value = inputValue.value.trim();
  if (value !== '' && !isAtMax.value) {
    const next = [...props.modelValue, value];
    emit('update:modelValue', next);
    emit('change', next);
    emit('add', value);
    inputValue.value = '';
    if (!keepOpen || (props.max !== undefined && next.length >= props.max)) {
      closeInput();
    }
  } else if (value === '') {
    // Empty commit just closes the input (naive blur-with-empty behavior).
    closeInput();
  }
}

/** Cancel — discard the in-flight text and close the input. */
function cancelInput(): void {
  inputValue.value = '';
  closeInput();
}

function closeInput(): void {
  isAdding.value = false;
  inputValue.value = '';
}

function onInputKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault();
    confirmInput();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    cancelInput();
  }
}

/** Blur submits (naive parity): non-empty text commits, then closes. */
function onInputBlur(): void {
  if (inputValue.value.trim() !== '') {
    confirmInput(false);
  } else {
    closeInput();
  }
}

function onNativeInput(event: Event): void {
  inputValue.value = (event.target as HTMLInputElement).value;
}

function removeTag(index: number): void {
  if (!isInteractive.value) return;
  const value = props.modelValue[index];
  if (value === undefined) return;
  const next = props.modelValue.filter((_, i) => i !== index);
  emit('update:modelValue', next);
  emit('change', next);
  emit('remove', value);
}

function onTagClick(value: SnDynamicTagValue, event: MouseEvent): void {
  emit('click', value, event);
}

/**
 * `trigger="focus"` — clicking anywhere on the component root opens the
 * inline input. Tag / close-button clicks stop propagation so they keep
 * their own semantics.
 */
function onRootClick(): void {
  if (props.trigger === 'focus') startAdd();
}
</script>

<template>
  <div
    :class="classList"
    :data-snui-component="'dynamic-tags'"
    :data-size="size"
    @click="onRootClick"
  >
    <slot v-if="tags.length === 0 && !isAdding" name="empty" />

    <span
      v-for="(tag, index) in tags"
      :key="`${index}-${String(tag)}`"
      class="sn-dynamic-tags__tag"
      @click.stop="onTagClick(tag, $event)"
    >
      <slot name="tag" :label="tag" :index="index">{{ tag }}</slot>
      <button
        v-if="closable && isInteractive"
        type="button"
        class="sn-dynamic-tags__close"
        :aria-label="`Remove ${String(tag)}`"
        @click.stop="removeTag(index)"
      >
        <svg
          viewBox="0 0 24 24"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>

    <template v-if="isAdding">
      <slot
        name="input"
        :value="inputValue"
        :placeholder="inputPlaceholder"
        :confirm="confirmInput"
        :cancel="cancelInput"
        :set-value="
          (v: string) => {
            inputValue = v;
          }
        "
      >
        <input
          :ref="setNativeInput"
          class="sn-dynamic-tags__input"
          type="text"
          :value="inputValue"
          :placeholder="inputPlaceholder"
          @input="onNativeInput"
          @keydown="onInputKeydown"
          @blur="onInputBlur"
        />
      </slot>
    </template>

    <button
      v-else-if="triggerVisible"
      type="button"
      class="sn-dynamic-tags__trigger"
      aria-label="Add tag"
      @click.stop="startAdd"
    >
      <slot name="trigger">
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </slot>
    </button>
  </div>
</template>

<style scoped>
.sn-dynamic-tags {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sn-web-dynamic-tags-gap, 6px);
  font-family: inherit;
  line-height: 1.2;
  color: var(--sn-web-dynamic-tags-text-color, var(--sn-web-color-text-primary));
}

/* Tag pill — capsule radius per the n-tag `type` reference. */
.sn-dynamic-tags__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 var(--sn-web-dynamic-tags-tag-padding-x, 8px);
  border-radius: var(--sn-web-dynamic-tags-tag-radius, 999px);
  background-color: var(
    --sn-web-dynamic-tags-tag-bg,
    var(--sn-web-color-background-soft, var(--sn-web-color-background-subtle))
  );
  color: var(--sn-web-dynamic-tags-tag-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  user-select: none;
  transition:
    background-color 0.15s ease-out,
    color 0.15s ease-out;
}

.sn-dynamic-tags__tag:hover {
  background-color: var(--sn-web-dynamic-tags-tag-bg-hover, var(--sn-web-color-background-overlay));
}

/* Close (×) button inside a tag. */
.sn-dynamic-tags__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-dynamic-tags-close-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
  line-height: 1;
}

.sn-dynamic-tags__close:hover {
  color: var(--sn-web-dynamic-tags-close-color-hover, var(--sn-web-color-text-primary));
  background-color: var(
    --sn-web-dynamic-tags-close-bg-hover,
    var(--sn-web-color-background-overlay)
  );
}

/* Add trigger — pill button with the + glyph. */
.sn-dynamic-tags__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--sn-web-dynamic-tags-trigger-padding-x, 10px);
  border: 1px dashed
    var(--sn-web-dynamic-tags-trigger-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-dynamic-tags-trigger-radius, 999px);
  background-color: transparent;
  color: var(--sn-web-dynamic-tags-trigger-color, var(--sn-web-color-text-secondary));
  cursor: pointer;
  line-height: 1;
  transition:
    border-color 0.15s ease-out,
    color 0.15s ease-out;
}

.sn-dynamic-tags__trigger:hover {
  border-color: var(
    --sn-web-dynamic-tags-trigger-border-color-hover,
    var(--sn-web-color-action-primary)
  );
  color: var(--sn-web-dynamic-tags-trigger-color-hover, var(--sn-web-color-action-primary));
}

.sn-dynamic-tags__trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring);
}

/* Inline input — same pill silhouette as the tags. */
.sn-dynamic-tags__input {
  border: 1px solid
    var(--sn-web-dynamic-tags-input-border-color, var(--sn-web-color-action-primary));
  border-radius: var(--sn-web-dynamic-tags-input-radius, 999px);
  background-color: var(--sn-web-dynamic-tags-input-bg, var(--sn-web-color-background-surface));
  color: inherit;
  font: inherit;
  padding: 0 var(--sn-web-dynamic-tags-input-padding-x, 8px);
  outline: none;
  min-width: var(--sn-web-dynamic-tags-input-min-width, 100px);
}

.sn-dynamic-tags__input::placeholder {
  color: var(--sn-web-dynamic-tags-placeholder-color, var(--sn-web-color-text-tertiary));
  opacity: 1;
}

/* Sizes — height tiers mirror the SnInput scale for small/medium/large. */
.sn-dynamic-tags--small {
  font-size: 13px;
}
.sn-dynamic-tags--small .sn-dynamic-tags__tag {
  height: 24px;
}
.sn-dynamic-tags--small .sn-dynamic-tags__trigger {
  height: 24px;
}
.sn-dynamic-tags--small .sn-dynamic-tags__input {
  height: 24px;
}

.sn-dynamic-tags--medium {
  font-size: 14px;
}
.sn-dynamic-tags--medium .sn-dynamic-tags__tag {
  height: 28px;
}
.sn-dynamic-tags--medium .sn-dynamic-tags__trigger {
  height: 28px;
}
.sn-dynamic-tags--medium .sn-dynamic-tags__input {
  height: 28px;
}

.sn-dynamic-tags--large {
  font-size: 15px;
}
.sn-dynamic-tags--large .sn-dynamic-tags__tag {
  height: 32px;
}
.sn-dynamic-tags--large .sn-dynamic-tags__trigger {
  height: 32px;
}
.sn-dynamic-tags--large .sn-dynamic-tags__input {
  height: 32px;
}

/* Disabled — visual only (trigger + close buttons are not rendered). */
.sn-dynamic-tags--disabled {
  color: var(--sn-web-dynamic-tags-text-color-disabled, var(--sn-web-color-text-disabled));
  cursor: not-allowed;
}

.sn-dynamic-tags--disabled .sn-dynamic-tags__tag {
  cursor: not-allowed;
  color: var(--sn-web-dynamic-tags-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-dynamic-tags--readonly {
  cursor: default;
}
</style>
