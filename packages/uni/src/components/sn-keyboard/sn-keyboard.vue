<script setup lang="ts">
/**
 * sn-keyboard (uni-end) — on-screen keypad (numeric / car plate / custom).
 *
 * Reference library: wot-ui `wd-keyboard`
 *   (https://wot-ui.cn/component/keyboard.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-keyboard 1:1 except
 * for the documented omission. Anything new added here MUST also be added to
 * the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-keyboard/sn-keyboard.vue
 * → auto-registered as `<sn-keyboard>` in any .vue that uses it.
 *
 * ## Documented omission
 *
 * `root-portal` is not implemented (uni-app miniprograms have no portal host
 * — same divergence as `sn-popup`). `hideOnClickOutside` is honoured as
 * "render a scrim that closes the keyboard on tap"; there is no document-level
 * listener, so nothing leaks (§41).
 *
 * ## Layout
 *
 * - `default`: 3×4 numeric grid (`1`–`9`, bottom row = extra key / collapse
 *   glyph, `0`, delete). An unsupplied `extraKey` slot renders the
 *   collapse-to-system glyph, which closes the panel — the bottom row is
 *   always three equal keys, never a wide `0` or a hole.
 * - `car`: province abbreviation → letter/digit plate, 10 keys per row, with
 *   the language key at the head of the last row and delete at its tail. The
 *   trailing short row keeps `flex: 1` keys, so it stretches instead of
 *   leaving a ragged hole.
 * - `custom`: the same numeric grid with a right-hand action column split in
 *   two halves — delete on top, close below. Empty extra-key slots render the
 *   collapse glyph as well; the column is always full.
 *
 * `maxlength` caps the value; the delete key removes one character and emits
 * `delete`. Holding the delete key repeats (`REPEAT_DELAY` → `REPEAT_INTERVAL`);
 * both timers are cleared on release, on close and on unmount (§41).
 *
 * ## Visual system
 *
 * Sheet = `background-subtle` (grey), keys = `background-elevated` (white) —
 * the iOS keypad read. The header keeps the elevated surface, so the toolbar
 * separates from the key field by value instead of by a hairline. Press
 * feedback rides uni `hover-class` (§116.2 — App end has no `:active`).
 * Geometry is exposed as component-local custom properties
 * (`--sn-keyboard-*`), so a host can retune key height / gap / radius from
 * `custom-class` without a new prop.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 输入框本体 — 用 sn-input / sn-code-input
 *   - 车牌业务校验 — 由宿主处理
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue';
import SnPopup from '../sn-popup/sn-popup.vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import {
  Backspace as BackspaceIcon,
  ChevronDown as ChevronDownIcon,
  Keyboard as KeyboardCollapseIcon,
} from '../sn-icon/sn-icon-set';
import {
  COLLAPSE_KEY,
  DELETE_VALUE,
  KEY_PRESSED,
  buildCarRows,
  buildDigitRows,
  createDeleteHold,
} from './sn-keyboard-keys';
import type { CarKeyboardLang, KeyboardKey, KeyboardMode } from './sn-keyboard-types';

defineOptions({ name: 'SnKeyboard' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-keyboard` 1:1 surface ───────────────────────────────── */

    /** Visibility (`v-model:visible`). */
    visible?: boolean;
    /** Current value (`v-model`). */
    modelValue?: string;
    /** Keyboard title. */
    title?: string;
    /** Layout preset. */
    mode?: KeyboardMode;
    /** Stacking level. */
    zIndex?: number;
    /** Maximum value length. */
    maxlength?: number;
    /** Render the delete key (default / car layouts). */
    showDeleteKey?: boolean;
    /** Shuffle the digit keys. */
    randomKeyOrder?: boolean;
    /** Close button label (header, or the custom-mode action column). */
    closeText?: string;
    /** Delete key label. */
    deleteText?: string;
    /** Show a spinner in the close button while pending. */
    closeButtonLoading?: boolean;
    /** Render an opaque scrim. */
    modal?: boolean;
    /** Tapping outside the panel closes the keyboard. */
    hideOnClickOutside?: boolean;
    /** Intercept touchmove on the scrim so the page behind cannot scroll. */
    lockScroll?: boolean;
    /** Pad the keyboard for the device safe area. */
    safeAreaInsetBottom?: boolean;
    /** Extra key(s) appended to the digit grid. */
    extraKey?: string | string[] | undefined;
    /** Car-plate language (`v-model:car-lang`, `mode: 'car'`). */
    carLang?: CarKeyboardLang;
    /** Auto-switch the car language once the province is picked. */
    autoSwitchLang?: boolean;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the panel. */
    customStyle?: string;
    /**
     * Accepted for wot-ui parity, NOT implemented — miniprogram has no portal
     * host, so the panel cannot leave the page's document flow. Forwarded to
     * `sn-popup`, which declares the same parity-only prop.
     */
    rootPortal?: boolean;
  }>(),
  {
    visible: false,
    modelValue: '',
    title: '',
    mode: 'default',
    zIndex: 100,
    maxlength: Number.POSITIVE_INFINITY,
    showDeleteKey: true,
    randomKeyOrder: false,
    closeText: '',
    deleteText: '',
    closeButtonLoading: false,
    modal: false,
    hideOnClickOutside: true,
    lockScroll: true,
    safeAreaInsetBottom: true,
    extraKey: undefined,
    carLang: 'zh',
    autoSwitchLang: false,
    customClass: '',
    customStyle: '',
    rootPortal: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:visible', value: boolean): void;
  (e: 'update:carLang', value: CarKeyboardLang): void;
  (e: 'input', key: string): void;
  (e: 'delete'): void;
  (e: 'close'): void;
}>();

/* ── Key data ──────────────────────────────────────────────────────────── */

/** Extra keys normalized to an array. */
const extraKeys = computed<string[]>(() => {
  const value = props.extraKey;
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
});

/** Digit rows for the default / custom layouts (3 columns). */
const digitRows = computed<KeyboardKey[][]>(() =>
  buildDigitRows({
    mode: props.mode,
    extraKeys: extraKeys.value,
    showDeleteKey: props.showDeleteKey,
    randomKeyOrder: props.randomKeyOrder,
  }),
);

/** Car-plate rows for the current language (10 keys per row). */
const carRows = computed<string[][]>(() => buildCarRows(props.carLang));

const rootClass = computed(() =>
  [
    'sn-keyboard',
    `sn-keyboard--${props.mode}`,
    props.safeAreaInsetBottom ? 'sn-keyboard--safe' : '',
    props.customClass,
  ]
    .filter(Boolean)
    .join(' '),
);

/** sn-popup takes a string, so the class list is joined here. */
const popupClass = computed(() =>
  ['sn-keyboard-popup', `sn-keyboard-popup--${props.mode}`, props.customClass]
    .filter(Boolean)
    .join(' '),
);

/**
 * `custom-style` styles the popup panel. The panel's generic bottom-sheet
 * padding is neutralised here — the key field paints edge to edge and owns its
 * own safe-area inset (`.sn-keyboard--safe`), otherwise the grey field would
 * float inside a white gutter.
 */
const rootStyle = computed(() => ['padding: 0', props.customStyle].filter(Boolean).join('; '));

/* ── Interaction ───────────────────────────────────────────────────────── */

function close(): void {
  emit('update:visible', false);
  emit('close');
}

function writeValue(next: string): void {
  emit('update:modelValue', next);
}

function onKeyTap(key: KeyboardKey): void {
  if (key.value === DELETE_VALUE) {
    onDeleteTap();
    return;
  }
  if (key.value === COLLAPSE_KEY.value) {
    close();
    return;
  }
  if (key.value === '') return;
  if (props.modelValue.length >= props.maxlength) return;
  emit('input', key.value);
  writeValue(props.modelValue + key.value);
}

function onScrimTap(): void {
  if (!props.hideOnClickOutside) return;
  close();
}

function onTouchMove(event: Event): void {
  if (!props.lockScroll) return;
  event.preventDefault();
  event.stopPropagation();
}

/* ── Delete key: hold to repeat ────────────────────────────────────────── */

const deleteHold = createDeleteHold(
  () => props.modelValue.length > 0,
  () => {
    emit('delete');
    writeValue(props.modelValue.slice(0, -1));
  },
);

function onDeleteTap(): void {
  // `touchend` fires before `tap`: a completed hold has already deleted, so the
  // tap would otherwise eat one extra character.
  if (deleteHold.consumeTap()) return;
  if (props.modelValue.length === 0) return;
  emit('delete');
  writeValue(props.modelValue.slice(0, -1));
}

function onKeyTouchStart(key: KeyboardKey): void {
  if (key.value !== DELETE_VALUE || !props.showDeleteKey) return;
  deleteHold.start();
}

function onKeyTouchEnd(): void {
  deleteHold.end();
}

watch(
  () => props.visible,
  (visible) => {
    if (!visible) deleteHold.clear();
  },
);

onBeforeUnmount(deleteHold.clear);

/* ── Car language switch ───────────────────────────────────────────────── */

/**
 * Once a Chinese province character is typed, the plate switches to the
 * letter / digit layout — that is wd-keyboard's `auto-switch-lang` contract.
 */
watch(
  () => props.modelValue,
  (value) => {
    if (props.mode !== 'car' || !props.autoSwitchLang) return;
    if (props.carLang !== 'zh') return;
    if (value.length !== 1) return;
    emit('update:carLang', 'en');
  },
);

/** Manual language toggle (header button + the last-row plate key). */
function toggleLang(): void {
  emit('update:carLang', props.carLang === 'zh' ? 'en' : 'zh');
}

const closeLabel = computed(() => props.closeText || '完成');
const deleteLabel = computed(() => props.deleteText || '删除');
/** Collapse-glyph key — the "yield back to the system input" affordance. */
const collapseLabel = 'collapse';
/** Header toggle label — the language you would switch *to*. */
const langLabel = computed(() => (props.carLang === 'zh' ? 'EN' : '中'));
/** Plate key label — same intent, spelled the way plate keyboards do. */
const plateLangLabel = computed(() => (props.carLang === 'zh' ? 'ABC' : '中'));
</script>

<template>
  <SnPopup
    :model-value="props.visible"
    position="bottom"
    round
    :z-index="props.zIndex"
    :modal="props.modal || props.hideOnClickOutside"
    :close-on-click-modal="props.hideOnClickOutside"
    :safe-area-inset-bottom="props.safeAreaInsetBottom"
    :custom-class="popupClass"
    :custom-style="rootStyle"
    :root-portal="props.rootPortal"
    @update:model-value="emit('update:visible', $event)"
    @click-modal="onScrimTap"
  >
    <view :class="rootClass" :data-snui-component="'keyboard'" @touchmove="onTouchMove">
      <view class="sn-keyboard__header">
        <view class="sn-keyboard__header-slot">
          <view
            v-if="props.mode === 'car'"
            class="sn-keyboard__lang"
            role="button"
            aria-label="switch language"
            hover-class="sn-keyboard__lang--pressed"
            @tap="toggleLang"
            ><text>{{ langLabel }}</text></view
          >
        </view>

        <text class="sn-keyboard__title">{{ props.title }}</text>

        <view class="sn-keyboard__header-slot sn-keyboard__header-slot--end">
          <view
            class="sn-keyboard__close"
            role="button"
            :aria-label="closeLabel"
            :aria-busy="props.closeButtonLoading ? 'true' : undefined"
            hover-class="sn-keyboard__close--pressed"
            @tap="close"
          >
            <view v-if="props.closeButtonLoading" class="sn-keyboard__spinner" aria-hidden="true" />
            <text v-if="props.closeText" class="sn-keyboard__close-text">{{
              props.closeText
            }}</text>
            <view v-else-if="!props.closeButtonLoading" class="sn-keyboard__close-chip">
              <SnIcon :icon="ChevronDownIcon" :size="26" />
            </view>
          </view>
        </view>
      </view>

      <!-- Default / custom: numeric grid -->
      <view v-if="props.mode !== 'car'" class="sn-keyboard__grid">
        <view class="sn-keyboard__keys">
          <view v-for="(row, rowIndex) in digitRows" :key="rowIndex" class="sn-keyboard__row">
            <view
              v-for="(key, keyIndex) in row"
              :key="`${rowIndex}-${keyIndex}`"
              :class="[
                'sn-keyboard__key',
                key.value === DELETE_VALUE ? 'sn-keyboard__key--delete' : '',
              ]"
              role="button"
              :aria-label="
                key.value === DELETE_VALUE
                  ? deleteLabel
                  : key.value === COLLAPSE_KEY.value
                    ? collapseLabel
                    : key.text
              "
              :style="key.span !== undefined && key.span > 1 ? { flexGrow: key.span } : undefined"
              :hover-class="KEY_PRESSED"
              @tap="onKeyTap(key)"
              @touchstart="onKeyTouchStart(key)"
              @touchend="onKeyTouchEnd"
              @touchcancel="onKeyTouchEnd"
            >
              <SnIcon
                v-if="key.value === DELETE_VALUE"
                class="sn-keyboard__key-icon"
                :icon="BackspaceIcon"
                :size="40"
              />
              <SnIcon
                v-else-if="key.value === COLLAPSE_KEY.value"
                class="sn-keyboard__key-icon"
                :icon="KeyboardCollapseIcon"
                :size="36"
              />
              <text v-else-if="key.text" class="sn-keyboard__key-text">{{ key.text }}</text>
            </view>
          </view>
        </view>

        <!-- Custom mode: right-hand action column -->
        <view v-if="props.mode === 'custom'" class="sn-keyboard__aside">
          <view
            class="sn-keyboard__aside-key sn-keyboard__aside-key--close"
            role="button"
            :aria-label="closeLabel"
            hover-class="sn-keyboard__aside-key--pressed"
            @tap="close"
            ><text>{{ closeLabel }}</text></view
          >
          <view
            v-if="props.showDeleteKey"
            class="sn-keyboard__aside-key sn-keyboard__aside-key--delete"
            role="button"
            :aria-label="deleteLabel"
            hover-class="sn-keyboard__aside-key--pressed"
            @tap="onDeleteTap"
            @touchstart="deleteHold.start"
            @touchend="onKeyTouchEnd"
            @touchcancel="onKeyTouchEnd"
          >
            <SnIcon :icon="BackspaceIcon" :size="40" />
          </view>
        </view>
      </view>

      <!-- Car plate layout -->
      <view v-else class="sn-keyboard__car">
        <view v-for="(row, rowIndex) in carRows" :key="rowIndex" class="sn-keyboard__car-row">
          <view
            v-if="rowIndex === carRows.length - 1"
            class="sn-keyboard__key sn-keyboard__key--fn"
            role="button"
            aria-label="switch language"
            :hover-class="KEY_PRESSED"
            @tap="toggleLang"
            ><text>{{ plateLangLabel }}</text></view
          >
          <view
            v-for="key in row"
            :key="key"
            class="sn-keyboard__key sn-keyboard__key--car"
            role="button"
            :aria-label="key"
            :hover-class="KEY_PRESSED"
            @tap="onKeyTap({ text: key, value: key })"
            ><text>{{ key }}</text></view
          >
          <view
            v-if="rowIndex === carRows.length - 1 && props.showDeleteKey"
            class="sn-keyboard__key sn-keyboard__key--car sn-keyboard__key--delete"
            role="button"
            :aria-label="deleteLabel"
            :hover-class="KEY_PRESSED"
            @tap="onDeleteTap"
            @touchstart="deleteHold.start"
            @touchend="onKeyTouchEnd"
            @touchcancel="onKeyTouchEnd"
          >
            <SnIcon :icon="BackspaceIcon" :size="36" />
          </view>
        </view>
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/**
 * uni side: --sn-mp-* aliases only (rpx units).
 * Geometry hooks (`--sn-keyboard-*`) are component-local and may be re-pointed
 * by the host from `custom-class` without touching this file.
 */

.sn-keyboard {
  --sn-keyboard-key-height: 104rpx;
  --sn-keyboard-car-key-height: 84rpx;
  --sn-keyboard-gap: 12rpx;
  --sn-keyboard-car-gap: 8rpx;
  --sn-keyboard-padding: 16rpx;
  --sn-keyboard-key-radius: var(--sn-mp-radius-xl);

  display: block;
  overflow: hidden;
  border-top-left-radius: var(--sn-mp-radius-xl);
  border-top-right-radius: var(--sn-mp-radius-xl);
  /* Grey sheet — the white key plates read as raised on it. */
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

/* The popup panel is padded for generic sheets; the key field is edge to edge,
 * so the device inset is reintroduced here instead. */
.sn-keyboard--safe {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* ── Header ────────────────────────────────────────────────────────────── */

.sn-keyboard__header {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 96rpx;
  padding: 0 var(--sn-mp-spacing-3);
  /* Elevated surface: the toolbar separates from the grey field by value, not
   * by a hairline the miniprogram renderer would round away. */
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-keyboard__header-slot {
  display: flex;
  align-items: center;
  flex: 0 0 132rpx;
  min-width: 0;
}

.sn-keyboard__header-slot--end {
  justify-content: flex-end;
}

.sn-keyboard__title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-keyboard__lang,
.sn-keyboard__close {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 64rpx;
  padding: 0 var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-md);
  /* Primary action: "done" reads as a text button, not a filled plate. */
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-keyboard__lang {
  min-width: 96rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-keyboard__close {
  min-width: 88rpx;
}

.sn-keyboard__close-text {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
}

/* Icon-only close: the reference header wears the chevron in a circular
 * sunken chip, separating it from the elevated toolbar by value. */
.sn-keyboard__close-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
}

.sn-keyboard__lang--pressed,
.sn-keyboard__close--pressed {
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-keyboard__spinner {
  width: 26rpx;
  height: 26rpx;
  border: 4rpx solid var(--sn-mp-color-action-primary);
  border-top-color: transparent;
  border-radius: var(--sn-mp-radius-full);
  animation: sn-keyboard-spin 0.8s linear infinite;
}

@keyframes sn-keyboard-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Numeric grid ──────────────────────────────────────────────────────── */

.sn-keyboard__grid {
  display: flex;
  align-items: stretch;
  gap: var(--sn-keyboard-gap);
  padding: var(--sn-keyboard-padding);
  padding-bottom: calc(var(--sn-keyboard-padding) + var(--sn-mp-spacing-1));
}

.sn-keyboard__keys {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--sn-keyboard-gap);
  min-width: 0;
}

.sn-keyboard__row {
  display: flex;
  gap: var(--sn-keyboard-gap);
}

.sn-keyboard__key {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  box-sizing: border-box;
  min-width: 0;
  height: var(--sn-keyboard-key-height);
  border-radius: var(--sn-keyboard-key-radius);
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-2xl);
  font-weight: var(--sn-mp-font-weight-medium);
  line-height: 1;
  /* Sub-pixel lift — the only depth cue, so keys stay flat at rest. */
  box-shadow: var(--sn-mp-shadow-xs);
  transition:
    background-color 120ms ease,
    transform 120ms ease;
}

.sn-keyboard__key-text {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}

/* Pressed: the plate sinks back into the sheet and drops its shadow. */
.sn-keyboard__key--pressed {
  background-color: var(--sn-mp-color-background-subtle);
  box-shadow: none;
  transform: scale(0.97);
}

.sn-keyboard__key--delete {
  color: var(--sn-mp-color-text-secondary);
}

.sn-keyboard__key-icon {
  display: block;
}

/* ── Custom-mode action column ─────────────────────────────────────────── */

/* Two halves, no gutter: delete owns the top half, close the bottom half.
 * The reference plate keypads never leave an empty cell in this column. */
.sn-keyboard__aside {
  display: flex;
  flex: 0 0 176rpx;
  flex-direction: column;
  gap: var(--sn-keyboard-gap);
}

.sn-keyboard__aside-key {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  box-sizing: border-box;
  border-radius: var(--sn-keyboard-key-radius);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
  transition:
    opacity 120ms ease,
    transform 120ms ease;
}

.sn-keyboard__aside-key--close {
  order: 2;
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  box-shadow: var(--sn-mp-shadow-xs);
}

.sn-keyboard__aside-key--delete {
  order: 1;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-secondary);
  box-shadow: var(--sn-mp-shadow-xs);
}

.sn-keyboard__aside-key--pressed {
  opacity: 0.82;
  transform: scale(0.97);
}

/* ── Car plate grid ────────────────────────────────────────────────────── */

.sn-keyboard__car {
  display: flex;
  flex-direction: column;
  gap: var(--sn-keyboard-car-gap);
  padding: var(--sn-keyboard-padding);
  padding-bottom: calc(var(--sn-keyboard-padding) + var(--sn-mp-spacing-1));
}

.sn-keyboard__car-row {
  display: flex;
  gap: var(--sn-keyboard-car-gap);
}

.sn-keyboard__key--car {
  height: var(--sn-keyboard-car-key-height);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
}

/* Plate language key — a function key, so it sits in the sheet, not above it. */
.sn-keyboard__key--fn {
  flex: 0 0 auto;
  width: 96rpx;
  height: var(--sn-keyboard-car-key-height);
  background-color: var(--sn-mp-color-background-sunken);
  color: var(--sn-mp-color-text-secondary);
  box-shadow: none;
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-medium);
}

/* Doodle skin — hand-drawn key plates. */
.snui-skin-doodle .sn-keyboard__key,
.snui-skin-doodle .sn-keyboard__aside-key {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
  background-color: var(--sn-mp-color-background-elevated);
}
</style>
