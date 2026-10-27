<script setup lang="ts">
/**
 * sn-search (uni-end) — search field for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-search`
 *   (https://wot-ui.cn/component/search.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-search 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-search/sn-search.vue
 * → auto-registered as `<sn-search>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic — the actual query
 * runs in the host app behind the `search` event.
 *
 * Not responsible for:
 *   - 搜索结果列表 — 用 sn-list / sn-card
 *   - 输入校验 — 用 sn-form-item
 */

import { computed, markRaw, ref, useSlots } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { Search as SearchIcon, X as XIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnSearch' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-search` 1:1 surface ─────────────────────────────────── */

    /** Bound query text (v-model). */
    modelValue?: string;
    /** Class on the inner native `<input>`. */
    customInputClass?: string;
    /** Placeholder text. wd-search defaults to `搜索`. */
    placeholder?: string;
    /** Text of the right-hand cancel button. */
    cancelTxt?: string;
    /** Visual variant: `plain` (bordered), `filled` (tinted) or `light`. */
    variant?: 'plain' | 'filled' | 'light';
    /** Hide the right-hand cancel text entirely. */
    hideCancel?: boolean;
    /** Disables interaction; a tap on the root still emits `click`. */
    disabled?: boolean;
    /** Max character length. `-1` means unlimited. */
    maxlength?: number | string;
    /** Left-align the placeholder instead of centering it. */
    placeholderLeft?: boolean;
    /** Focus the field on mount. */
    focus?: boolean;
    /** Refocus the field after the clear button is tapped. */
    focusWhenClear?: boolean;
    /** Inline style declarations for the placeholder pseudo-element. */
    placeholderStyle?: string;
    /** Class applied to the placeholder pseudo-element. */
    placeholderClass?: string;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string;
  }>(),
  {
    modelValue: '',
    customInputClass: '',
    placeholder: '搜索',
    cancelTxt: '取消',
    variant: 'plain',
    hideCancel: false,
    disabled: false,
    maxlength: -1,
    placeholderLeft: false,
    focus: false,
    focusWhenClear: false,
    placeholderStyle: '',
    placeholderClass: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync — fired on every keystroke. */
  (e: 'update:modelValue', value: string): void;
  /** Value changed (alias of `update:modelValue` for form integration). */
  (e: 'change', value: string): void;
  /** Soft-keyboard confirm / search button tapped. */
  (e: 'search', value: string): void;
  /** Right-hand cancel button tapped. */
  (e: 'cancel', value: string): void;
  /** The × clear button was tapped. */
  (e: 'clear'): void;
  /** Field focused. */
  (e: 'focus', event: Event): void;
  /** Field blurred. */
  (e: 'blur', event: Event): void;
  /** Root tapped while `disabled` — the only way to observe the blocked state. */
  (e: 'click', event: Event): void;
}>();

const slots = useSlots();

const nativeValue = computed<string>(() => props.modelValue ?? '');
const isFocused = ref(false);
const isInteractive = computed(() => !props.disabled);

/** The × button only exists while there is something to clear. */
const clearVisible = computed(() => isInteractive.value && nativeValue.value.length > 0);

/** Cancel text visibility — `hideCancel` wins, and it hides while disabled. */
const cancelVisible = computed(() => !props.hideCancel && isInteractive.value);

/**
 * Left search glyph / clear glyph — frozen `IconData` records from the
 * sn-icon shortcut set. `markRaw` keeps SnIcon from proxying them.
 */
const searchIcon = markRaw(SearchIcon);
const clearIcon = markRaw(XIcon);

function onInput(event: Event): void {
  if (!isInteractive.value) return;
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('change', target.value);
}

function onFocus(event: Event): void {
  isFocused.value = true;
  emit('focus', event);
}

function onBlur(event: Event): void {
  isFocused.value = false;
  emit('blur', event);
}

function onSearch(event: Event): void {
  if (!isInteractive.value) return;
  void event;
  emit('search', nativeValue.value);
}

function onClear(): void {
  if (!isInteractive.value) return;
  emit('update:modelValue', '');
  emit('change', '');
  emit('clear');
  /* Re-focusing is a no-op on uni-end (the soft keyboard is dismissed on
   * blur); consumers that need it call .focus() from the `clear` listener on
   * their own ref. `focusWhenClear` stays declared for wd-search parity. */
}

function onCancel(): void {
  if (!isInteractive.value) return;
  emit('cancel', nativeValue.value);
}

function onClickRoot(event: Event): void {
  if (!props.disabled) return;
  emit('click', event);
}

const classList = computed(() => [
  'sn-search',
  `sn-search--${props.variant}`,
  {
    'sn-search--disabled': props.disabled,
    'sn-search--focused': isFocused.value,
    'sn-search--placeholder-left': props.placeholderLeft,
    'sn-search--hide-cancel': props.hideCancel,
    'sn-search--with-clear': clearVisible.value,
  },
  props.customClass,
]);

const wrapperStyle = computed(() => props.customStyle || undefined);

/** Placeholder styling is a native attribute — App has no `::placeholder`
 * (§116.2). The default keeps the token color the CSS rule used to provide. */
const DEFAULT_PLACEHOLDER_STYLE =
  'color: var(--sn-mp-color-input-placeholder); opacity: 1';
const placeholderStyleAttr = computed(
  () => props.placeholderStyle || DEFAULT_PLACEHOLDER_STYLE,
);
</script>

<template>
  <view
    :class="classList"
    :style="wrapperStyle"
    :data-snui-component="'search'"
    :data-variant="variant"
    role="search"
    @click="onClickRoot"
  >
    <view v-if="slots.prefix" class="sn-search__prefix">
      <slot name="prefix" />
    </view>

    <view class="sn-search__field">
      <view class="sn-search__icon" aria-hidden="true">
        <SnIcon :icon="searchIcon" :size="32" />
      </view>

      <input
        class="sn-search__native"
        :class="[placeholderClass, customInputClass]"
        type="text"
        confirm-type="search"
        :value="nativeValue"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyleAttr"
        :placeholder-class="placeholderClass || undefined"
        :disabled="disabled"
        :maxlength="typeof maxlength === 'number' ? maxlength : Number(maxlength)"
        :focus="focus"
        :aria-label="placeholder"
        :aria-disabled="disabled ? 'true' : undefined"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onSearch"
      />

      <view v-if="slots['input-suffix']" class="sn-search__input-suffix">
        <slot name="input-suffix" />
      </view>

      <view v-if="clearVisible" class="sn-search__clear" aria-hidden="true">
        <view
          class="sn-search__clear-btn"
          aria-label="Clear search"
          :tabindex="isInteractive ? 0 : -1"
          @tap.stop="onClear"
        >
          <SnIcon :icon="clearIcon" :size="32" />
        </view>
      </view>
    </view>

    <view v-if="cancelVisible" class="sn-search__cancel" @tap.stop="onCancel">
      <text class="sn-search__cancel-text">{{ cancelTxt }}</text>
    </view>

    <view v-if="slots.suffix" class="sn-search__suffix">
      <slot name="suffix" />
    </view>
  </view>
</template>

<style scoped>
/**
 * Geometry in rpx (750 design canvas). Colors come exclusively from
 * `--sn-mp-*` tokens so the `.sn-theme-dark` block flips the whole surface.
 */
.sn-search {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  font-family: inherit;
  box-sizing: border-box;
}

/* Variant surfaces — `plain` is the bordered default, `filled` a tinted
 * block, `light` the lightest of the three (wot-ui parity). */
.sn-search--plain {
  background-color: var(--sn-mp-color-background-surface);
}
.sn-search--filled {
  background-color: var(--sn-mp-color-background-soft);
}
.sn-search--light {
  background-color: var(--sn-mp-color-background-subtle);
}

/* Field — the pill-shaped input container. */
.sn-search__field {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
  flex: 1 1 auto;
  min-width: 0;
  height: 64rpx;
  padding: 0 var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-input-bg);
  border: 2rpx solid var(--sn-mp-color-input-border);
  box-sizing: border-box;
  transition: border-color 0.18s ease-out;
}

.sn-search--filled .sn-search__field,
.sn-search--light .sn-search__field {
  border-color: transparent;
  background-color: var(--sn-mp-color-background-soft);
}

.sn-search--focused .sn-search__field {
  border-color: var(--sn-mp-color-input-border-focus);
}

.sn-search__icon {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  color: var(--sn-mp-color-text-secondary);
}

.sn-search__native {
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--sn-mp-color-input-text);
  font: inherit;
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  padding: 0;
  text-align: center;
}

/* wd-search centers the placeholder by default; `placeholderLeft` opts out. */
.sn-search--placeholder-left .sn-search__native {
  text-align: left;
}

/* Placeholder styling rides `placeholder-style` (native attribute): App has no
 * `::placeholder` pseudo-element (§116.2). */

.sn-search__input-suffix,
.sn-search__prefix,
.sn-search__suffix {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  color: var(--sn-mp-color-text-secondary);
}

.sn-search__clear {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}

.sn-search__clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-secondary);
  line-height: 1;
  cursor: pointer;
}

/* Cancel text on the right. */
.sn-search__cancel {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  padding: 0 4rpx;
  cursor: pointer;
}

.sn-search__cancel-text {
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-action-primary);
  white-space: nowrap;
}

.sn-search--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Doodle skin — hand-drawn outline on the field. */
.snui-skin-doodle .sn-search__field {
  border-width: 4rpx;
  border-style: solid;
  border-color: var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-md);
  font-weight: 600;
}
.snui-skin-doodle .sn-search__cancel-text {
  font-weight: 700;
}
</style>
