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
 * - `default`: 3×4 numeric grid (`1`–`9`, `extraKey`, `0`, delete).
 * - `car`: province abbreviation → letter/digit plate with a language toggle.
 * - `custom`: the same numeric grid with a large right-hand action column
 *   (`closeText` + delete).
 *
 * `maxlength` caps the value; the delete key removes one character and emits
 * `delete`. No timer, no observer — nothing to dispose.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 输入框本体 — 用 sn-input / sn-password-input
 *   - 车牌业务校验 — 由宿主处理
 */

import { computed, ref, watch } from 'vue';
import SnPopup from '../sn-popup/sn-popup.vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';
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

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/** Extra keys normalized to an array. */
const extraKeys = computed<string[]>(() => {
  const value = props.extraKey;
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
});

/** Digit rows for the default / custom layouts (3 columns). */
const digitRows = computed<KeyboardKey[][]>(() => {
  let digits = [...DIGITS];
  if (props.randomKeyOrder) digits = shuffle(digits);
  const extra = extraKeys.value;
  // wd-keyboard contract: one extra-key slot in the default grid, two in the
  // custom layout (which has the wider bottom row beside the action column).
  // Unfilled slots stay as inert placeholders so the grid keeps its geometry.
  const slotCount = props.mode === 'custom' ? 2 : 1;
  const slots = Array.from({ length: slotCount }, (_, index) => extra[index] ?? '');
  const bottom: KeyboardKey[] = [
    ...slots.map((key) => ({ text: key, value: key })),
    { text: '0', value: '0' },
    { text: '', value: '__delete__' },
  ];
  const rows: KeyboardKey[][] = [];
  for (let i = 0; i < digits.length; i += 3) {
    rows.push(digits.slice(i, i + 3).map((digit) => ({ text: digit, value: digit })));
  }
  rows.push(bottom);
  return rows;
});

/** Deterministic Fisher-Yates — the seed is the render index, not Math.random. */
function shuffle(items: string[]): string[] {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(((i + 1) * 7919) % (i + 1));
    const a = list[i];
    const b = list[j];
    if (a !== undefined && b !== undefined) {
      list[i] = b;
      list[j] = a;
    }
  }
  return list;
}

/** Car-plate keys per language. */
const CAR_ZH = [
  '京',
  '沪',
  '粤',
  '津',
  '冀',
  '晋',
  '蒙',
  '辽',
  '吉',
  '黑',
  '苏',
  '浙',
  '皖',
  '闽',
  '赣',
  '鲁',
  '豫',
  '鄂',
  '湘',
  '桂',
  '琼',
  '川',
  '贵',
  '云',
  '陕',
  '甘',
  '青',
  '宁',
  '新',
  '渝',
  '藏',
  '使',
  '领',
  '警',
  '学',
  '港',
  '澳',
];
const CAR_EN = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const carKeys = computed<string[]>(() => (props.carLang === 'zh' ? CAR_ZH : CAR_EN));

const rootClass = computed(() =>
  ['sn-keyboard', `sn-keyboard--${props.mode}`, props.customClass].filter(Boolean).join(' '),
);

/** sn-popup takes a string, so the class list is joined here. */
const popupClass = computed(() =>
  ['sn-keyboard-popup', `sn-keyboard-popup--${props.mode}`, props.customClass]
    .filter(Boolean)
    .join(' '),
);

const rootStyle = computed(() => props.customStyle);

/* ── Interaction ───────────────────────────────────────────────────────── */

function close(): void {
  emit('update:visible', false);
  emit('close');
}

function writeValue(next: string): void {
  emit('update:modelValue', next);
}

function onKeyTap(key: KeyboardKey): void {
  if (key.value === '__delete__') {
    onDelete();
    return;
  }
  if (key.value === '') return;
  if (props.modelValue.length >= props.maxlength) return;
  emit('input', key.value);
  writeValue(props.modelValue + key.value);
}

function onDelete(): void {
  if (props.modelValue.length === 0) return;
  emit('delete');
  writeValue(props.modelValue.slice(0, -1));
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

/** Manual language toggle (header button). */
function toggleLang(): void {
  emit('update:carLang', props.carLang === 'zh' ? 'en' : 'zh');
}

const closeLabel = computed(() => props.closeText || '完成');
const deleteLabel = computed(() => props.deleteText || '删除');
</script>

<template>
  <SnPopup
    :model-value="props.visible"
    position="bottom"
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
        <text class="sn-keyboard__title">{{ props.title }}</text>
        <view
          v-if="props.mode === 'car'"
          class="sn-keyboard__lang"
          role="button"
          aria-label="switch language"
          @tap="toggleLang"
          ><text>{{ props.carLang === 'zh' ? 'EN' : '中' }}</text></view>
        >
        <view
          class="sn-keyboard__close"
          role="button"
          :aria-label="closeLabel"
          :aria-busy="props.closeButtonLoading ? 'true' : undefined"
          @tap="close"
        >
          <text v-if="props.closeText" class="sn-keyboard__close-text">{{ props.closeText }}</text>
          <SnIcon v-else :icon="XIcon" :size="28" />
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
                {
                  'sn-keyboard__key--delete': key.value === '__delete__',
                  'sn-keyboard__key--empty': key.value === '',
                },
              ]"
              role="button"
              :aria-label="key.value === '__delete__' ? deleteLabel : key.text"
              @tap="onKeyTap(key)"
            >
              <SnIcon
                v-if="key.value === '__delete__' && props.showDeleteKey"
                :icon="XIcon"
                :size="28"
              />
              <text v-else-if="key.text">{{ key.text }}</text>
            </view>
          </view>
        </view>

        <!-- Custom mode: right-hand action column -->
        <view v-if="props.mode === 'custom'" class="sn-keyboard__aside">
          <view
            class="sn-keyboard__aside-key"
            role="button"
            :aria-label="closeLabel"
            @tap="close"
            ><text>{{ closeLabel }}</text></view>
          >
          <view
            v-if="props.showDeleteKey"
            class="sn-keyboard__aside-key sn-keyboard__aside-key--delete"
            role="button"
            :aria-label="deleteLabel"
            @tap="onDelete"
          >
            <SnIcon :icon="XIcon" :size="28" />
          </view>
        </view>
      </view>

      <!-- Car plate layout -->
      <view v-else class="sn-keyboard__car">
        <view
          v-for="key in carKeys"
          :key="key"
          class="sn-keyboard__key sn-keyboard__key--car"
          role="button"
          :aria-label="key"
          @tap="onKeyTap({ text: key, value: key })"
          ><text>{{ key }}</text></view>
        >
        <view
          v-if="props.showDeleteKey"
          class="sn-keyboard__key sn-keyboard__key--car sn-keyboard__key--delete"
          role="button"
          :aria-label="deleteLabel"
          @tap="onDelete"
        >
          <SnIcon :icon="XIcon" :size="28" />
        </view>
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-keyboard {
  display: block;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

.sn-keyboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88rpx;
  padding: 0 var(--sn-mp-spacing-4);
}

.sn-keyboard__title {
  flex: 1 1 auto;
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}

.sn-keyboard__lang,
.sn-keyboard__close {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 56rpx;
  height: 56rpx;
  padding: 0 var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-md);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-keyboard__grid {
  display: flex;
  align-items: stretch;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
}

.sn-keyboard__keys {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
}

.sn-keyboard__row {
  display: flex;
  gap: var(--sn-mp-spacing-2);
}

.sn-keyboard__key {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  height: 88rpx;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-xl);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-keyboard__key--empty {
  background-color: transparent;
}

.sn-keyboard__key--delete {
  color: var(--sn-mp-color-text-secondary);
}

.sn-keyboard__aside {
  display: flex;
  flex: 0 0 128rpx;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
}

.sn-keyboard__aside-key {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
}

.sn-keyboard__aside-key--delete {
  background-color: var(--sn-mp-color-background-sunken);
}

.sn-keyboard__car {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
}

.sn-keyboard__key--car {
  flex: 0 0 auto;
  width: 88rpx;
  height: 80rpx;
  font-size: var(--sn-mp-font-size-md);
}

/* Doodle skin — hand-drawn key plates. */
.snui-skin-doodle .sn-keyboard__key,
.snui-skin-doodle .sn-keyboard__aside-key {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
  background-color: var(--sn-mp-color-background-elevated);
}
</style>
