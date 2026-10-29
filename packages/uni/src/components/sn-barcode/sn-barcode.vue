<script setup lang="ts">
/**
 * SnBarcode (uni-end) — 条形码（业务组件 AUI-BIZ-002）。
 *
 * Reference library: lime-ui `l-barcode`
 *   (https://limeuix.qcoon.cn/components/barcode)
 * 对齐其格式与样式能力面：CODE128 / CODE39 / EAN13 / EAN8 / UPC / CODEBAR /
 * ITF 多格式、水平/垂直布局、lineColor / background / textAlign / margin /
 * 线条高度。命名取仓库惯例（customClass / customStyle）。
 *
 * ## 渲染与格式
 *
 * 条码用 **view 游程渲染**（无 canvas，双端安全）：编码器输出条/空游程，
 * 逐条渲染为着色 / 透明 view。编码表以 JsBarcode (MIT) 源码为准核对。
 * 未实现 / 非法输入走 `error` 事件，绝不输出错误条码。
 *
 * Per AGENTS.md §116.2: class 选择器、文字显式 <text>、无伪类。
 *
 * Not responsible for: 扫码识别、图片导出（宿主可对渲染结果截图）。
 */

import { computed, ref, watch } from 'vue';
import {
  encodeBarcode,
  SN_BARCODE_FORMAT_HINTS,
  type SnBarcodeEncoded,
  type SnBarcodeEncodeError,
  type SnBarcodeFormat,
} from './sn-barcode-types';

defineOptions({ name: 'SnBarcode' });

const props = withDefaults(
  defineProps<{
    /** 条码内容（校验位规则见各格式说明）。 */
    text?: string;
    /** 条码格式。 */
    format?: SnBarcodeFormat;
    /** 是否在条码旁显示文本。 */
    showText?: boolean;
    /** 布局方向：水平条码或垂直（旋转 90°）条码。 */
    layout?: 'horizontal' | 'vertical';
    /** 文本位置（沿布局轴）。 */
    textPosition?: 'bottom' | 'top';
    /** 条的颜色（同时作为文本色）。 */
    lineColor?: string;
    /** 背景色（默认透明）。 */
    background?: string;
    /** 单模块宽度（px）。 */
    moduleWidth?: number;
    /** 线条高度（rpx / px 长度字符串）。`lineLength` 的别名，后者优先。 */
    height?: string;
    /** 线条高度（lime-ui 命名）。优先于 `height`。 */
    lineLength?: string;
    /** 整体边距（CSS margin 值，如 `16rpx` / `8rpx 16rpx`）。 */
    margin?: string;
    /** 文本对齐。 */
    textAlign?: 'left' | 'center' | 'right';
    /** 文本字号（rpx / px 长度字符串）。 */
    fontSize?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    text: '',
    format: 'EAN13',
    showText: true,
    textPosition: 'bottom',
    lineColor: 'var(--sn-mp-color-text-primary)',
    background: 'transparent',
    moduleWidth: 2,
    height: '120rpx',
    lineLength: '',
    margin: '',
    textAlign: 'center',
    fontSize: '22rpx',
    customClass: '',
    customStyle: '',
    layout: 'horizontal',
  },
);
const emit = defineEmits<{
  (e: 'error', error: SnBarcodeEncodeError): void;
  (e: 'rendered', encoded: SnBarcodeEncoded): void;
}>();

const encoded = ref<SnBarcodeEncoded | null>(null);
const failure = ref<SnBarcodeEncodeError | null>(null);

watch(
  () => [props.text, props.format] as const,
  ([text, format]) => {
    if (text.trim().length === 0) {
      encoded.value = null;
      failure.value = {
        code: 'BARCODE_TEXT_INVALID',
        message: SN_BARCODE_FORMAT_HINTS[format] ?? `暂不支持格式 ${format}`,
      };
      emit('error', failure.value);
      return;
    }
    const result = encodeBarcode(format, text);
    encoded.value = result.encoded ?? null;
    failure.value = result.error ?? null;
    if (result.error !== undefined) emit('error', result.error);
    if (result.encoded !== undefined) emit('rendered', result.encoded);
  },
  { immediate: true },
);

const rootClass = computed(() => ['sn-barcode', props.customClass]);
const rootStyle = computed(() => {
  const parts = [] as string[];
  if (props.margin !== '') parts.push(`margin: ${props.margin}`);
  if (props.background !== 'transparent') parts.push(`background-color: ${props.background}`);
  if (props.customStyle !== '') parts.push(props.customStyle);
  return parts.join('; ');
});

const effectiveLength = computed(() => (props.lineLength !== '' ? props.lineLength : props.height));

const isVertical = computed(() => props.layout === 'vertical');

const barStyle = computed(() => (bar: boolean): string => {
  const moduleSize = `${Math.max(1, Math.round(props.moduleWidth))}px`;
  const parts = isVertical.value
    ? [`width: ${effectiveLength.value}`, `height: ${moduleSize}`]
    : [`width: ${moduleSize}`, `height: ${effectiveLength.value}`];
  if (bar) parts.push(`background-color: ${props.lineColor}`);
  return parts.join('; ');
});

const textStyle = computed(
  () =>
    `font-size: ${props.fontSize}; color: ${props.lineColor}; text-align: ${props.textAlign}; width: 100%`,
);
</script>

<template>
  <view :class="rootClass" :style="rootStyle" role="img" aria-label="barcode">
    <text
      v-if="showText && textPosition === 'top' && encoded !== null"
      class="sn-barcode__text"
      :style="textStyle"
    >
      {{ encoded.displayText }}
    </text>

    <view
      v-if="encoded !== null"
      :class="['sn-barcode__bars', isVertical ? 'sn-barcode__bars--vertical' : '']"
    >
      <view v-for="(run, index) in encoded.runs" :key="index" :style="barStyle(run.bar)" />
    </view>
    <view v-else class="sn-barcode__empty">
      <text class="sn-barcode__empty-text">{{ failure?.message ?? '' }}</text>
    </view>

    <text
      v-if="showText && textPosition === 'bottom' && encoded !== null"
      class="sn-barcode__text"
      :style="textStyle"
    >
      {{ encoded.displayText }}
    </text>
  </view>
</template>

<style scoped>
.sn-barcode {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.sn-barcode__bars {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.sn-barcode__bars--vertical {
  flex-direction: column;
}

.sn-barcode__text {
  margin-top: var(--sn-mp-spacing-1);
  font-family: monospace;
  line-height: 1.2;
}

.sn-barcode__empty {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 60rpx;
}

.sn-barcode__empty-text {
  color: var(--sn-mp-color-text-disabled);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
