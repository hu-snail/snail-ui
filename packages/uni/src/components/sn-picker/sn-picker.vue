<script setup lang="ts">
/**
 * sn-picker (uni-end) — bottom-sheet picker wrapper around sn-picker-view.
 *
 * Reference library: wot-ui `wd-picker`
 *   (https://wot-ui.cn/component/picker.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-picker 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-picker/sn-picker.vue
 * → auto-registered as `<sn-picker>` in any .vue that uses it.
 *
 * ## Composition
 *
 * The roller body lives in `sn-picker-view`; the sheet chrome (mask, toolbar,
 * title, cancel / confirm) is composed here on top of `sn-popup`. The wrapper
 * owns the *draft* selection: rolling the wheel only mutates the draft, and
 * `v-model` is written on confirm — that is wd-picker's default
 * (`immediateChange: false`). With `immediateChange: true` every roll writes
 * `v-model` straight through.
 *
 * ## Documented divergence
 *
 * `root-portal` is not implemented — uni-app miniprograms have no portal host
 * (same divergence as `sn-popup`, documented on its docs page).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 滚轮本体 — 用 sn-picker-view
 *   - 日期时间列 — 用 sn-datetime-picker
 *   - 弹层定位 / 动画 — 用 sn-popup
 */

import { computed, ref, watch } from 'vue';
import SnPopup from '../sn-popup/sn-popup.vue';
import SnPickerView from '../sn-picker-view/sn-picker-view.vue';
import type {
  NormalizedPickerOption,
  PickerColumn,
  PickerOption,
  PickerValue,
} from '../sn-picker-view/sn-picker-view-types';

defineOptions({ name: 'SnPicker' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-picker` 1:1 surface ─────────────────────────────────── */

    /** Confirmed value per column (`v-model`). */
    modelValue?: PickerValue[];
    /** Sheet visibility (`v-model:visible`). */
    visible?: boolean;
    /** Columns, or the option tree when `cascade` is set. */
    columns?: PickerColumn[];
    /** Treat `columns` as a nested option tree. */
    cascade?: boolean;
    /** Toolbar title. Empty = no title row. */
    title?: string;
    /** Cancel button label. */
    cancelButtonText?: string;
    /** Confirm button label. */
    confirmButtonText?: string;
    /** Option key holding the value. */
    valueKey?: string;
    /** Option key holding the label. */
    labelKey?: string;
    /** Option key holding the children (cascade mode). */
    childrenKey?: string;
    /** Row height in px design units. */
    itemHeight?: number;
    /** Number of visible rows. */
    visibleItemCount?: number;
    /**
     * Veto hook for confirm. Returning `false` (or resolving `false`) keeps
     * the sheet open and the model untouched.
     */
    beforeConfirm?:
      | ((payload: {
          value: PickerValue[];
          selectedItems: Array<PickerOption | PickerValue>;
        }) => boolean | Promise<boolean>)
      | undefined;
    /** Tapping the mask closes the sheet. */
    closeOnClickModal?: boolean;
    /** Stacking level. */
    zIndex?: number;
    /** Pad the sheet for the device safe area. */
    safeAreaInsetBottom?: boolean;
    /** Write `v-model` on every roll instead of only on confirm. */
    immediateChange?: boolean;
    /**
     * Wheel 风格（additive，AGENTS.md §112.3a）：转发给 `sn-picker-view`，
     * 选中行渲染圆角胶囊高亮带 + 远行淡出。
     */
    wheel?: boolean;
    /**
     * 高亮带形态（additive）：`shared`（默认）横跨全部列一整条带；
     * `perColumn` 每列一条。转发给 `sn-picker-view`。
     */
    wheelBand?: 'shared' | 'perColumn';
    /**
     * 滑动短震动（additive，AGENTS.md §112.3a）：转发给 `sn-picker-view`，
     * 滑动经过每一行档位时触发 `uni.vibrateShort({ type: 'light' })`。
     */
    vibrateShort?: boolean;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the sheet. */
    customStyle?: string;
    /**
     * Accepted for wot-ui parity, NOT implemented — miniprogram has no portal
     * host, so the layer cannot leave the page's document flow.
     */
    rootPortal?: boolean;
    /** Class forwarded to the roller body. */
    customViewClass?: string;
  }>(),
  {
    modelValue: () => [],
    visible: false,
    columns: () => [],
    cascade: false,
    title: '',
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    valueKey: 'value',
    labelKey: 'label',
    childrenKey: 'children',
    itemHeight: 44,
    visibleItemCount: 6,
    beforeConfirm: undefined,
    closeOnClickModal: true,
    zIndex: 15,
    safeAreaInsetBottom: true,
    immediateChange: false,
    wheel: false,
    wheelBand: 'shared',
    vibrateShort: false,
    customClass: '',
    customStyle: '',
    rootPortal: false,
    customViewClass: '',
  },
);

defineSlots<{
  /**
   * Custom row content (additive) — forwarded to `sn-picker-view`.
   * Scope: `{ option, active, distance, columnIndex, index }`.
   */
  option?(scope: {
    option: NormalizedPickerOption;
    active: boolean;
    distance: number;
    columnIndex: number;
    index: number;
  }): unknown;
  /**
   * Custom wheel band paint (additive) — forwarded to `sn-picker-view`.
   * Scope: `{ mode, columnIndex }`.
   */
  band?(scope: { mode: 'shared' | 'perColumn'; columnIndex: number }): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: PickerValue[]): void;
  (e: 'update:visible', value: boolean): void;
  (
    e: 'confirm',
    payload: { value: PickerValue[]; selectedItems: Array<PickerOption | PickerValue> },
  ): void;
  (e: 'cancel'): void;
  (e: 'open'): void;
}>();

/** Draft selection while the sheet is open. */
const draft = ref<PickerValue[]>(props.modelValue.slice());

/**
 * Roller controller — `getSelectedOptions()` reflects the value actually bound
 * into the roller, so a confirm without a preceding roll still reports the
 * selected items (the old tracked `lastSelectedItems` stayed empty until the
 * first interaction and contradicted `value` in the confirm payload).
 */
const viewRef = ref<InstanceType<typeof SnPickerView> | null>(null);

watch(
  () => props.modelValue,
  (value) => {
    if (props.immediateChange) return;
    draft.value = value.slice();
  },
  { deep: true },
);

watch(
  () => props.visible,
  (value) => {
    if (!value) return;
    draft.value = props.modelValue.slice();
    emit('open');
  },
);

/** Value bound into the roller — the draft, or the model in immediate mode. */
const viewValue = computed<PickerValue[]>(() =>
  props.immediateChange ? props.modelValue : draft.value,
);

function onViewChange(payload: {
  selectedValues: PickerValue[];
  selectedOptions: Array<PickerOption | PickerValue>;
}): void {
  if (!props.immediateChange) {
    draft.value = payload.selectedValues.slice();
    return;
  }
  emit('update:modelValue', payload.selectedValues.slice());
}

function requestClose(): void {
  emit('update:visible', false);
}

function onCancel(): void {
  emit('cancel');
  requestClose();
}

async function onConfirm(): Promise<void> {
  const value = viewValue.value.slice();
  const items = viewRef.value?.getSelectedOptions() ?? [];
  if (props.beforeConfirm) {
    const verdict = await props.beforeConfirm({ value, selectedItems: items });
    if (verdict === false) return;
  }
  if (!props.immediateChange) emit('update:modelValue', value);
  emit('confirm', { value, selectedItems: items });
  requestClose();
}

/** Class applied to the popup root — the sheet chrome lives in the slot. */
const popupClass = computed(() => ['sn-picker-popup', props.customClass].filter(Boolean).join(' '));

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
    @update:model-value="emit('update:visible', $event)"
  >
    <view class="sn-picker" :data-snui-component="'picker'">
      <view class="sn-picker__toolbar">
        <view
          class="sn-picker__action sn-picker__cancel"
          role="button"
          :aria-label="props.cancelButtonText"
          @tap="onCancel"
          ><text>{{ props.cancelButtonText }}</text></view
        >
        <text v-if="props.title" class="sn-picker__title">{{ props.title }}</text>
        <view
          class="sn-picker__action sn-picker__confirm"
          role="button"
          :aria-label="props.confirmButtonText"
          @tap="onConfirm"
          >{{ props.confirmButtonText }}</view
        >
      </view>

      <SnPickerView
        ref="viewRef"
        :class="viewClass"
        :model-value="viewValue"
        :columns="props.columns"
        :cascade="props.cascade"
        :value-key="props.valueKey"
        :label-key="props.labelKey"
        :children-key="props.childrenKey"
        :item-height="props.itemHeight"
        :visible-item-count="props.visibleItemCount"
        :immediate-change="props.immediateChange"
        :wheel="props.wheel"
        :wheel-band="props.wheelBand"
        :vibrate-short="props.vibrateShort"
        @change="onViewChange"
      >
        <!-- uvue: 无参 v-bind="obj" 不支持 → 逐字段显式绑定；$slots.xxx 守卫
             必须保留——无条件透传会让 picker-view 的 $slots.option 恒为 true，
             mp 端 fallback 编译（$slots.x ? slot : text）走空 slot 出口，行
             内容全空（微信小程序实测回归）。 -->
        <template v-if="$slots.option" #option="scope"
          ><slot
            name="option"
            :option="scope.option"
            :active="scope.active"
            :distance="scope.distance"
            :column-index="scope.columnIndex"
            :index="scope.index"
        /></template>
        <template v-if="$slots.band" #band="scope"
          ><slot name="band" :mode="scope.mode" :column-index="scope.columnIndex"
        /></template>
      </SnPickerView>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-picker {
  display: block;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

.sn-picker__toolbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88rpx;
  padding: 0 var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-picker__title {
  flex: 1 1 auto;
  text-align: center;
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-picker__action {
  flex: 0 0 auto;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-text-secondary);
}

.sn-picker__confirm {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

/* Doodle skin — hand-drawn toolbar rule. */
.snui-skin-doodle .sn-picker__toolbar {
  border-bottom-width: 4rpx;
  border-bottom-color: var(--sn-mp-color-text-primary);
}
</style>
