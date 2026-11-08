<script setup lang="ts">
/**
 * sn-datetime-picker (uni-end) — bottom-sheet date / time picker.
 *
 * Reference library: wot-ui `wd-datetime-picker`
 *   (https://wot-ui.cn/component/datetime-picker.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-datetime-picker 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-datetime-picker/sn-datetime-picker.vue
 * → auto-registered as `<sn-datetime-picker>` in any .vue that uses it.
 *
 * ## Composition
 *
 * The roller lives in `sn-datetime-picker-view`; the sheet chrome (mask,
 * toolbar, title, cancel / confirm) is composed here on top of `sn-popup`.
 * The wrapper owns the *draft* value — rolling only mutates the draft and
 * `v-model` is written on confirm, which is wd-datetime-picker's default
 * (`immediateChange: false`).
 *
 * ## Header contract
 *
 * Three fixed slots — leading 取消 / centred 标题 / trailing 确认, both actions plain
 * `<text>` (no icon glyphs, §113). The title slot owns the free space, so 确认 stays
 * flush right with or without a title; the toolbar renders no other children (a
 * stray text node would be a fourth flex item under `space-between`).
 *
 * ## Documented divergences
 *
 *   - `root-portal` is declared and forwarded to `sn-popup`, but has no visual
 *     effect: uni-app miniprograms have no portal host (same divergence as
 *     `sn-popup`).
 *   - `toggle` is emitted only for range mode, and `display-format-tab-label`
 *     only formats range tabs; this build ships the single-value mode, so both
 *     exist in the type surface but never fire. Documented as 「未实现」 on the
 *     docs page.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 滚筒本体 — 用 sn-datetime-picker-view
 *   - 弹层定位 / 动画 — 用 sn-popup
 */

import { computed, ref, watch } from 'vue';
import SnPopup from '../sn-popup/sn-popup.vue';
import SnDatetimePickerView from '../sn-datetime-picker-view/sn-datetime-picker-view.vue';
import type {
  DateTimeColumnType,
  DateTimeType,
} from '../sn-datetime-picker-view/sn-datetime-picker-view-utils';

/**
 * Range-mode tab identifier handed to `displayFormatTabLabel`
 * (`wd-datetime-picker` `DatetimePickerDisplayFormatTabLabel`).
 */
type DateTimeTab = 'start' | 'end';

defineOptions({ name: 'SnDatetimePicker' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-datetime-picker` 1:1 surface ────────────────────────── */

    /** Bound value — a timestamp, or `HH:mm[:ss]` for `type: 'time'`. */
    modelValue?: string | number | undefined;
    /** Sheet visibility (`v-model:visible`). */
    visible?: boolean;
    /** Column set. */
    type?: DateTimeType;
    /** Toolbar title. */
    title?: string;
    /** Cancel button label. */
    cancelButtonText?: string;
    /** Confirm button label. */
    confirmButtonText?: string;
    /** Tapping the mask closes the sheet. */
    closeOnClickModal?: boolean;
    /** Pad the sheet for the device safe area. */
    safeAreaInsetBottom?: boolean;
    /** Row height in px design units. */
    itemHeight?: number;
    /** Number of visible rows. */
    visibleItemCount?: number;
    /** Option key holding the value (parity). */
    valueKey?: string;
    /** Option key holding the label (parity). */
    labelKey?: string;
    /** Minimum date (timestamp). */
    minDate?: number | undefined;
    /** Maximum date (timestamp). */
    maxDate?: number | undefined;
    /** Minimum hour. */
    minHour?: number;
    /** Maximum hour. */
    maxHour?: number;
    /** Minimum minute. */
    minMinute?: number;
    /** Maximum minute. */
    maxMinute?: number;
    /** Show the seconds column. */
    useSecond?: boolean;
    /** Minimum second. */
    minSecond?: number;
    /** Maximum second. */
    maxSecond?: number;
    /** Custom label formatter. */
    formatter?: ((type: DateTimeColumnType, value: number) => string) | undefined;
    /** Filter which values appear in a column. */
    filter?: ((type: DateTimeColumnType, values: number[]) => number[]) | undefined;
    /** Veto hook for confirm. */
    beforeConfirm?: ((value: string | number) => boolean | Promise<boolean>) | undefined;
    /** Stacking level. */
    zIndex?: number;
    /** Write `v-model` on every roll instead of only on confirm. */
    immediateChange?: boolean;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the sheet. */
    customStyle?: string;
    /**
     * Accepted for wot-ui parity, NOT implemented — miniprogram has no portal
     * host, so the layer cannot leave the page's document flow. Forwarded to
     * `sn-popup`, which declares the same parity-only prop.
     */
    rootPortal?: boolean;
    /** Class forwarded to the roller body. */
    customViewClass?: string;
    /**
     * Range-mode tab label formatter (`display-format-tab-label`). Declared
     * for parity; this build ships the single-value mode only, so there are no
     * tabs and the hook never runs. Documented as 「未实现」.
     */
    displayFormatTabLabel?: ((tab: DateTimeTab) => string) | undefined;
    /**
     * 农历滚筒（additive，AGENTS.md §112.3a）：转发给 `sn-datetime-picker-view`。
     * 年列干支（甲辰年）、月列正月…腊月（含闰X月）、日列初一…三十；
     * `v-model` 仍为公历时间戳。`type: 'time'` 下无效果。
     */
    lunar?: boolean;
  }>(),
  {
    modelValue: undefined,
    visible: false,
    type: 'datetime',
    title: '',
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    closeOnClickModal: true,
    safeAreaInsetBottom: true,
    itemHeight: 44,
    visibleItemCount: 6,
    valueKey: 'value',
    labelKey: 'label',
    minDate: undefined,
    maxDate: undefined,
    minHour: 0,
    maxHour: 23,
    minMinute: 0,
    maxMinute: 59,
    useSecond: false,
    minSecond: 0,
    maxSecond: 59,
    formatter: undefined,
    filter: undefined,
    beforeConfirm: undefined,
    zIndex: 15,
    immediateChange: false,
    customClass: '',
    customStyle: '',
    rootPortal: false,
    customViewClass: '',
    displayFormatTabLabel: undefined,
    lunar: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', payload: { value: string | number }): void;
  (e: 'change', payload: { value: string | number }): void;
  (e: 'cancel'): void;
  (e: 'open'): void;
}>();

/** Draft value while the sheet is open. */
const draft = ref<string | number | undefined>(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    if (props.immediateChange) return;
    draft.value = value;
  },
);

watch(
  () => props.visible,
  (value) => {
    if (!value) return;
    draft.value = props.modelValue;
    emit('open');
  },
);

/** Value bound into the roller. */
const viewValue = computed<string | number | undefined>(() =>
  props.immediateChange ? props.modelValue : draft.value,
);

function onViewChange(payload: { value: string | number }): void {
  if (!props.immediateChange) {
    draft.value = payload.value;
    emit('change', payload);
    return;
  }
  emit('update:modelValue', payload.value);
  emit('change', payload);
}

function requestClose(): void {
  emit('update:visible', false);
}

function onCancel(): void {
  emit('cancel');
  requestClose();
}

async function onConfirm(): Promise<void> {
  const value = viewValue.value;
  if (value === undefined) {
    requestClose();
    return;
  }
  if (props.beforeConfirm) {
    const verdict = await props.beforeConfirm(value);
    if (verdict === false) return;
  }
  if (!props.immediateChange) emit('update:modelValue', value);
  emit('confirm', { value });
  requestClose();
}

const popupClass = computed(() =>
  ['sn-datetime-picker-popup', props.customClass].filter(Boolean).join(' '),
);

/** Forwarded to sn-popup — a string, so `exactOptionalPropertyTypes` stays happy. */
const rootStyle = computed(() => props.customStyle);

const viewClass = computed(() => props.customViewClass);
</script>

<template>
  <SnPopup
    :model-value="props.visible"
    position="bottom"
    round
    :z-index="props.zIndex"
    :close-on-click-modal="props.closeOnClickModal"
    :safe-area-inset-bottom="props.safeAreaInsetBottom"
    :custom-class="popupClass"
    :custom-style="rootStyle"
    :root-portal="props.rootPortal"
    @update:model-value="emit('update:visible', $event)"
  >
    <view class="sn-datetime-picker" :data-snui-component="'datetime-picker'">
      <!-- Header = cancel / title / confirm, fixed order so 确认 sits flush right.
           All three children are elements: a stray text node would become an
           anonymous flex item and shift the confirm off the edge. -->
      <view class="sn-datetime-picker__toolbar">
        <view
          class="sn-datetime-picker__action sn-datetime-picker__cancel"
          role="button"
          :aria-label="props.cancelButtonText"
          hover-class="sn-datetime-picker__action--pressed"
          @tap="onCancel"
        >
          <text class="sn-datetime-picker__action-text">{{ props.cancelButtonText }}</text>
        </view>
        <view class="sn-datetime-picker__title-slot">
          <text v-if="props.title" class="sn-datetime-picker__title">{{ props.title }}</text>
        </view>
        <view
          class="sn-datetime-picker__action sn-datetime-picker__confirm"
          role="button"
          :aria-label="props.confirmButtonText"
          hover-class="sn-datetime-picker__action--pressed"
          @tap="onConfirm"
        >
          <text class="sn-datetime-picker__action-text">{{ props.confirmButtonText }}</text>
        </view>
      </view>

      <SnDatetimePickerView
        :class="viewClass"
        :model-value="viewValue"
        :type="props.type"
        :item-height="props.itemHeight"
        :visible-item-count="props.visibleItemCount"
        :value-key="props.valueKey"
        :label-key="props.labelKey"
        :min-date="props.minDate"
        :max-date="props.maxDate"
        :min-hour="props.minHour"
        :max-hour="props.maxHour"
        :min-minute="props.minMinute"
        :max-minute="props.maxMinute"
        :use-second="props.useSecond"
        :min-second="props.minSecond"
        :max-second="props.maxSecond"
        :formatter="props.formatter"
        :filter="props.filter"
        :immediate-change="props.immediateChange"
        :lunar="props.lunar"
        @change="onViewChange"
      />
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-datetime-picker {
  display: block;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

.sn-datetime-picker__toolbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88rpx;
  padding: 0 var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

/* Title slot owns the free space, so the actions never move and 确认 stays flush
   right even when no title is given. */
.sn-datetime-picker__title-slot {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.sn-datetime-picker__title {
  overflow: hidden;
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Text-only actions (§113). 88rpx matches the toolbar so the full row is tappable. */
.sn-datetime-picker__action {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  min-height: 88rpx;
  padding: 0 var(--sn-mp-spacing-2);
  color: var(--sn-mp-color-text-secondary);
}

.sn-datetime-picker__action-text {
  font-size: var(--sn-mp-font-size-md);
}

/* Press feedback rides hover-class (§116.2 — App has no :active pseudo). */
.sn-datetime-picker__action--pressed {
  opacity: 0.6;
}

.sn-datetime-picker__confirm {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

/* Doodle skin — hand-drawn toolbar rule. */
.snui-skin-doodle .sn-datetime-picker__toolbar {
  border-bottom-width: 4rpx;
  border-bottom-color: var(--sn-mp-color-text-primary);
}
</style>
