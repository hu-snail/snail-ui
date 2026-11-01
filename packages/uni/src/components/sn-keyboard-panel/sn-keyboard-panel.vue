<script setup lang="ts">
/**
 * sn-keyboard-panel (uni-end) — embedded keypad view (no popup).
 *
 * **additive** — wot-ui has no panel variant of `wd-keyboard`; this is an AUI
 * addition (registered in AGENTS.md §112.3a). It reuses the exact key-model of
 * `sn-keyboard` (`sn-keyboard-keys.ts`), minus the sheet machinery: no popup,
 * no scrim, no visible/close props. Embed it in a page, a custom container or
 * under an input row when the host owns the presentation chrome.
 *
 * ## Contract
 *
 * - Same layout presets and bottom-row rule as `sn-keyboard`: an unsupplied
 *   `extraKey` slot renders the collapse glyph; here tapping it emits
 *   `collapse` (there is no sheet to close — the host decides what to do,
 *   e.g. hide its own container or yield back to the system input).
 * - Same `v-model` / `maxlength` / hold-to-repeat delete contract.
 * - Header renders only when it has content: a `title` or the car-plate
 *   language toggle (`mode: 'car'`). There is no close button — the host owns
 *   dismissal.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 输入框本体 — 用 sn-input / sn-code-input
 *   - 面板的显隐与定位 — 由宿主容器决定
 */

import { computed, onBeforeUnmount, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import {
  Backspace as BackspaceIcon,
  Keyboard as KeyboardCollapseIcon,
} from '../sn-icon/sn-icon-set';
import {
  COLLAPSE_KEY,
  DELETE_VALUE,
  KEY_PRESSED,
  buildCarRows,
  buildDigitRows,
  createDeleteHold,
} from '../sn-keyboard/sn-keyboard-keys';
import type { CarKeyboardLang, KeyboardKey, KeyboardMode } from '../sn-keyboard/sn-keyboard-types';

defineOptions({ name: 'SnKeyboardPanel' });

const props = withDefaults(
  defineProps<{
    /** Current value (`v-model`). */
    modelValue?: string;
    /** Layout preset. */
    mode?: KeyboardMode;
    /** Maximum value length. */
    maxlength?: number;
    /** Render the delete key (default / car layouts). */
    showDeleteKey?: boolean;
    /** Shuffle the digit keys. */
    randomKeyOrder?: boolean;
    /** Extra key(s) appended to the digit grid. */
    extraKey?: string | string[] | undefined;
    /** Car-plate language (`v-model:car-lang`, `mode: 'car'`). */
    carLang?: CarKeyboardLang;
    /** Auto-switch the car language once the province is picked. */
    autoSwitchLang?: boolean;
    /** Optional header title; the header renders only when it has content. */
    title?: string;
    /** Delete key label (aria). */
    deleteText?: string;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: '',
    mode: 'default',
    maxlength: Number.POSITIVE_INFINITY,
    showDeleteKey: true,
    randomKeyOrder: false,
    extraKey: undefined,
    carLang: 'zh',
    autoSwitchLang: false,
    title: '',
    deleteText: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:carLang', value: CarKeyboardLang): void;
  (e: 'input', key: string): void;
  (e: 'delete'): void;
  /** The collapse glyph key was tapped — hide the host container / yield input. */
  (e: 'collapse'): void;
}>();

/* ── Key data (shared with sn-keyboard) ────────────────────────────────── */

const extraKeys = computed<string[]>(() => {
  const value = props.extraKey;
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
});

const digitRows = computed<KeyboardKey[][]>(() =>
  buildDigitRows({
    mode: props.mode,
    extraKeys: extraKeys.value,
    showDeleteKey: props.showDeleteKey,
    randomKeyOrder: props.randomKeyOrder,
  }),
);

const carRows = computed<string[][]>(() => buildCarRows(props.carLang));

const rootClass = computed(() =>
  ['sn-keyboard-panel', `sn-keyboard-panel--${props.mode}`, props.customClass]
    .filter(Boolean)
    .join(' '),
);

/* ── Interaction ───────────────────────────────────────────────────────── */

function writeValue(next: string): void {
  emit('update:modelValue', next);
}

function onKeyTap(key: KeyboardKey): void {
  if (key.value === DELETE_VALUE) {
    onDeleteTap();
    return;
  }
  if (key.value === COLLAPSE_KEY.value) {
    emit('collapse');
    return;
  }
  if (key.value === '') return;
  if (props.modelValue.length >= props.maxlength) return;
  emit('input', key.value);
  writeValue(props.modelValue + key.value);
}

/* ── Delete key: hold to repeat (shared contract) ──────────────────────── */

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

onBeforeUnmount(deleteHold.clear);

/* ── Car language switch ───────────────────────────────────────────────── */

watch(
  () => props.modelValue,
  (value) => {
    if (props.mode !== 'car' || !props.autoSwitchLang) return;
    if (props.carLang !== 'zh') return;
    if (value.length !== 1) return;
    emit('update:carLang', 'en');
  },
);

function toggleLang(): void {
  emit('update:carLang', props.carLang === 'zh' ? 'en' : 'zh');
}

const deleteLabel = computed(() => props.deleteText || '删除');
const collapseLabel = 'collapse';
/** Header toggle label — the language you would switch *to*. */
const langLabel = computed(() => (props.carLang === 'zh' ? 'EN' : '中'));
/** Plate key label — same intent, spelled the way plate keyboards do. */
const plateLangLabel = computed(() => (props.carLang === 'zh' ? 'ABC' : '中'));

/** The header only renders when it has content to show. */
const hasHeader = computed(() => props.title !== '' || props.mode === 'car');
</script>

<template>
  <view
    :class="rootClass"
    :style="props.customStyle"
    role="group"
    aria-label="keyboard"
    :data-snui-component="'keyboard-panel'"
  >
    <view v-if="hasHeader" class="sn-keyboard-panel__header">
      <view class="sn-keyboard-panel__header-slot">
        <view
          v-if="props.mode === 'car'"
          class="sn-keyboard-panel__lang"
          role="button"
          aria-label="switch language"
          hover-class="sn-keyboard-panel__lang--pressed"
          @tap="toggleLang"
          ><text>{{ langLabel }}</text></view
        >
      </view>
      <text class="sn-keyboard-panel__title">{{ props.title }}</text>
      <view class="sn-keyboard-panel__header-slot sn-keyboard-panel__header-slot--end" />
    </view>

    <!-- Default / custom: numeric grid -->
    <view v-if="props.mode !== 'car'" class="sn-keyboard-panel__grid">
      <view class="sn-keyboard-panel__keys">
        <view v-for="(row, rowIndex) in digitRows" :key="rowIndex" class="sn-keyboard-panel__row">
          <view
            v-for="(key, keyIndex) in row"
            :key="`${rowIndex}-${keyIndex}`"
            :class="[
              'sn-keyboard-panel__key',
              key.value === DELETE_VALUE ? 'sn-keyboard-panel__key--delete' : '',
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
              class="sn-keyboard-panel__key-icon"
              :icon="BackspaceIcon"
              :size="40"
            />
            <SnIcon
              v-else-if="key.value === COLLAPSE_KEY.value"
              class="sn-keyboard-panel__key-icon"
              :icon="KeyboardCollapseIcon"
              :size="36"
            />
            <text v-else-if="key.text" class="sn-keyboard-panel__key-text">{{ key.text }}</text>
          </view>
        </view>
      </view>

      <!-- Custom mode: right-hand action column (delete on top, close below) -->
      <view v-if="props.mode === 'custom'" class="sn-keyboard-panel__aside">
        <view
          class="sn-keyboard-panel__aside-key sn-keyboard-panel__aside-key--close"
          role="button"
          aria-label="collapse"
          hover-class="sn-keyboard-panel__aside-key--pressed"
          @tap="emit('collapse')"
          ><text>收起</text></view
        >
        <view
          v-if="props.showDeleteKey"
          class="sn-keyboard-panel__aside-key sn-keyboard-panel__aside-key--delete"
          role="button"
          :aria-label="deleteLabel"
          hover-class="sn-keyboard-panel__aside-key--pressed"
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
    <view v-else class="sn-keyboard-panel__car">
      <view v-for="(row, rowIndex) in carRows" :key="rowIndex" class="sn-keyboard-panel__car-row">
        <view
          v-if="rowIndex === carRows.length - 1"
          class="sn-keyboard-panel__key sn-keyboard-panel__key--fn"
          role="button"
          aria-label="switch language"
          :hover-class="KEY_PRESSED"
          @tap="toggleLang"
          ><text>{{ plateLangLabel }}</text></view
        >
        <view
          v-for="key in row"
          :key="key"
          class="sn-keyboard-panel__key sn-keyboard-panel__key--car"
          role="button"
          :aria-label="key"
          :hover-class="KEY_PRESSED"
          @tap="onKeyTap({ text: key, value: key })"
          ><text>{{ key }}</text></view
        >
        <view
          v-if="rowIndex === carRows.length - 1 && props.showDeleteKey"
          class="sn-keyboard-panel__key sn-keyboard-panel__key--car sn-keyboard-panel__key--delete"
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
</template>

<style scoped>
/**
 * Same visual system as sn-keyboard (grey sheet + white plates) but a
 * standalone view: the sheet rounds on every corner and the host owns the
 * placement. Geometry hooks reuse the `--sn-keyboard-*` names so one override
 * retunes both components.
 */
.sn-keyboard-panel {
  --sn-keyboard-key-height: 104rpx;
  --sn-keyboard-car-key-height: 84rpx;
  --sn-keyboard-gap: 12rpx;
  --sn-keyboard-car-gap: 8rpx;
  --sn-keyboard-padding: 16rpx;
  --sn-keyboard-key-radius: var(--sn-mp-radius-xl);

  display: block;
  overflow: hidden;
  border-radius: var(--sn-mp-radius-xl);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

/* ── Header ────────────────────────────────────────────────────────────── */

.sn-keyboard-panel__header {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 96rpx;
  padding: 0 var(--sn-mp-spacing-3);
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-keyboard-panel__header-slot {
  display: flex;
  align-items: center;
  flex: 0 0 132rpx;
  min-width: 0;
}

.sn-keyboard-panel__header-slot--end {
  justify-content: flex-end;
}

.sn-keyboard-panel__title {
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

.sn-keyboard-panel__lang {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 64rpx;
  padding: 0 var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-md);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-keyboard-panel__lang--pressed {
  background-color: var(--sn-mp-color-background-subtle);
}

/* ── Numeric grid ──────────────────────────────────────────────────────── */

.sn-keyboard-panel__grid {
  display: flex;
  align-items: stretch;
  gap: var(--sn-keyboard-gap);
  padding: var(--sn-keyboard-padding);
  padding-bottom: calc(var(--sn-keyboard-padding) + var(--sn-mp-spacing-1));
}

.sn-keyboard-panel__keys {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--sn-keyboard-gap);
  min-width: 0;
}

.sn-keyboard-panel__row {
  display: flex;
  gap: var(--sn-keyboard-gap);
}

.sn-keyboard-panel__key {
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
  box-shadow: var(--sn-mp-shadow-xs);
  transition:
    background-color 120ms ease,
    transform 120ms ease;
}

.sn-keyboard-panel__key-text {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}

.sn-keyboard-panel__key--pressed {
  background-color: var(--sn-mp-color-background-subtle);
  box-shadow: none;
  transform: scale(0.97);
}

.sn-keyboard-panel__key--delete {
  color: var(--sn-mp-color-text-secondary);
}

.sn-keyboard-panel__key-icon {
  display: block;
}

/* ── Custom-mode action column ─────────────────────────────────────────── */

.sn-keyboard-panel__aside {
  display: flex;
  flex: 0 0 176rpx;
  flex-direction: column;
  gap: var(--sn-keyboard-gap);
}

.sn-keyboard-panel__aside-key {
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

.sn-keyboard-panel__aside-key--close {
  order: 2;
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  box-shadow: var(--sn-mp-shadow-xs);
}

.sn-keyboard-panel__aside-key--delete {
  order: 1;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-secondary);
  box-shadow: var(--sn-mp-shadow-xs);
}

.sn-keyboard-panel__aside-key--pressed {
  opacity: 0.82;
  transform: scale(0.97);
}

/* ── Car plate grid ────────────────────────────────────────────────────── */

.sn-keyboard-panel__car {
  display: flex;
  flex-direction: column;
  gap: var(--sn-keyboard-car-gap);
  padding: var(--sn-keyboard-padding);
  padding-bottom: calc(var(--sn-keyboard-padding) + var(--sn-mp-spacing-1));
}

.sn-keyboard-panel__car-row {
  display: flex;
  gap: var(--sn-keyboard-car-gap);
}

.sn-keyboard-panel__key--car {
  height: var(--sn-keyboard-car-key-height);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-keyboard-panel__key--fn {
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
.snui-skin-doodle .sn-keyboard-panel__key,
.snui-skin-doodle .sn-keyboard-panel__aside-key {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
  background-color: var(--sn-mp-color-background-elevated);
}
</style>
