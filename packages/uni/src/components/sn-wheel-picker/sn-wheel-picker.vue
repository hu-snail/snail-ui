<script setup lang="ts">
/**
 * sn-wheel-picker (uni-end) — inline wheel-style roller picker.
 *
 * Reference library: wot-ui `wd-picker-view`
 *   (https://wot-ui.cn/component/picker-view.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-picker-view 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-wheel-picker/sn-wheel-picker.vue
 * → auto-registered as `<sn-wheel-picker>` in any .vue that uses it.
 *
 * ## Composition (AGENTS.md §104 — no re-implemented roller)
 *
 * A thin preset over `sn-picker-view`: the wheel style (rounded pill selection
 * band + distance fade) and the slide haptic are switched on — `wheel: true`
 * fixed, `vibrateShort` defaulting to true (overridable). The roller body,
 * cascade derivation and gesture math stay in `sn-picker-view` /
 * `sn-picker-view-drag`; this component only presets the look and forwards the
 * full contract (props / events / exposed API).
 *
 * wot-ui has no wheel-styled picker — this is an AUI-additive component
 * (AGENTS.md §112.3a), built for the iOS-style wheel surfaces in the design
 * specs (year roller, duration roller, multi-column time roller).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 弹层 / 工具栏 — 用 sn-picker（`wheel` + `vibrateShort` 同样适用）
 *   - 日期列生成 — 用 sn-datetime-picker（`wheel` 同样适用）
 */

import { ref } from 'vue';
import SnPickerView from '../sn-picker-view/sn-picker-view.vue';
import type {
  NormalizedPickerOption,
  PickerColumn,
  PickerOption,
  PickerValue,
  PickerViewChangePayload,
} from '../sn-picker-view/sn-picker-view-types';

defineOptions({ name: 'SnWheelPicker' });

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

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-picker-view` 1:1 surface ────────────────────────────── */

    /** Selected value per column (`v-model`). */
    modelValue?: PickerValue[];
    /** Columns, or the option tree when `cascade` is set. */
    columns?: PickerColumn[];
    /** Row height in px design units (converted to rpx for layout). */
    itemHeight?: number;
    /** Number of visible rows; must be odd so a row can sit in the middle. */
    visibleItemCount?: number;
    /** Option key holding the value. */
    valueKey?: string;
    /** Option key holding the visible label. */
    labelKey?: string;
    /** Option key holding the children (cascade mode only). */
    childrenKey?: string;
    /** Emit `change` while dragging instead of only on release. */
    immediateChange?: boolean;
    /** Treat `columns` as a nested option tree. */
    cascade?: boolean;
    /** Disables the whole roller. */
    disabled?: boolean;
    /**
     * 高亮带形态（additive，`wheel` 固定开启）：`shared`（默认）横跨全部列
     * 一整条带；`perColumn` 每列一条。
     */
    wheelBand?: 'shared' | 'perColumn';
    /**
     * 滑动短震动（additive，AGENTS.md §112.3a）：默认开启——滑动经过每一行
     * 档位触发 `uni.vibrateShort({ type: 'light' })`，App / 小程序生效，H5
     * 静默跳过；点选与程序赋值不震动。传 false 关闭。
     */
    vibrateShort?: boolean;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: () => [],
    columns: () => [],
    itemHeight: 44,
    visibleItemCount: 6,
    valueKey: 'value',
    labelKey: 'label',
    childrenKey: 'children',
    immediateChange: false,
    cascade: false,
    disabled: false,
    wheelBand: 'shared',
    vibrateShort: true,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: PickerValue[]): void;
  (e: 'change', payload: PickerViewChangePayload): void;
  (e: 'pickstart'): void;
  (e: 'pickend'): void;
}>();

/** Roller controller — the exposed API delegates here. */
const viewRef = ref<InstanceType<typeof SnPickerView> | null>(null);

function onViewChange(payload: PickerViewChangePayload): void {
  emit('update:modelValue', payload.selectedValues.slice());
  emit('change', payload);
}

defineExpose({
  getSelectedValues: (): PickerValue[] => viewRef.value?.getSelectedValues() ?? [],
  getSelectedOptions: (): Array<PickerOption | PickerValue> =>
    viewRef.value?.getSelectedOptions() ?? [],
  getSelectedLabels: (): string[] => viewRef.value?.getSelectedLabels() ?? [],
  getSelectedIndex: (): number[] => viewRef.value?.getSelectedIndex() ?? [],
  getColumnsData: (): NormalizedPickerOption[][] => viewRef.value?.getColumnsData() ?? [],
  getColumnData: (columnIndex: number): NormalizedPickerOption[] =>
    viewRef.value?.getColumnData(columnIndex) ?? [],
  getColumnIndex: (): number[] => viewRef.value?.getColumnIndex() ?? [],
  resetColumns: (): void => viewRef.value?.resetColumns(),
});
</script>

<template>
  <SnPickerView
    ref="viewRef"
    :model-value="props.modelValue"
    :columns="props.columns"
    :item-height="props.itemHeight"
    :visible-item-count="props.visibleItemCount"
    :value-key="props.valueKey"
    :label-key="props.labelKey"
    :children-key="props.childrenKey"
    :cascade="props.cascade"
    :disabled="props.disabled"
    :immediate-change="props.immediateChange"
    :wheel="true"
    :wheel-band="props.wheelBand"
    :vibrate-short="props.vibrateShort"
    :custom-class="props.customClass"
    :custom-style="props.customStyle"
    @update:model-value="emit('update:modelValue', $event)"
    @change="onViewChange"
    @pickstart="emit('pickstart')"
    @pickend="emit('pickend')"
  >
    <!-- uvue: 无参 v-bind="obj" 不支持 → 逐字段显式绑定；$slots.xxx 守卫
         仅约束 H5/App——mp 端 uni 运行时对 u-s 声明的插槽恒提供真值，
         二级作用域插槽转发在 mp-weixin 编译为 wx:for 出口且内容错位
         （uni-app x mp alpha 缺陷），条件编译跳过，mp 端回落 label
         fallback + CSS 变量漆面（显式退化，AGENTS.md §85）。 -->
    <!-- #ifndef MP-WEIXIN -->
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
    <!-- #endif -->
  </SnPickerView>
</template>
