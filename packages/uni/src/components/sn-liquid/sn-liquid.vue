<script setup lang="ts">
/**
 * SnLiquid (uni-end) — 水波进度球（业务组件 AUI-BIZ-001）。
 *
 * Reference library: lime-ui `l-liquid`
 *   (https://limeuix.qcoon.cn/components/liquid)
 * Per AGENTS.md §112, prop semantics mirror the reference (percent / size /
 * duration / outline / radius / waveColor / innerColor / v-model:current),
 * renamed to repo conventions (customClass / customStyle). 波面用两个旋转的
 * 圆角方块模拟（transform-only 关键帧，App 端安全）；水位高度用 height
 * 过渡表达，百分比文字随过渡值同步。
 *
 * Per AGENTS.md §116.2: class 选择器、无伪类伪元素、文字显式 <text>。
 *
 * Not responsible for: 业务进度计算 —— 由宿主传入 percent。
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue';

defineOptions({ name: 'SnLiquid' });

const props = withDefaults(
  defineProps<{
    /** 进度百分比（0-100），超出范围会被夹取。 */
    percent?: number;
    /** 球体尺寸（rpx / px 长度字符串）。 */
    size?: string;
    /** 水位 / current 过渡时长（ms），0 表示立即到位。 */
    duration?: number;
    /** 是否显示外圈描边。 */
    outline?: boolean;
    /** 圆角（默认正圆）。 */
    radius?: string;
    /** 波浪颜色。 */
    waveColor?: string;
    /** 球内背景色（水面以上区域）。 */
    innerColor?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    percent: 0,
    size: '160rpx',
    duration: 500,
    outline: false,
    radius: '50%',
    waveColor: 'var(--sn-mp-color-action-primary)',
    innerColor: 'var(--sn-mp-color-action-primary-soft)',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:current', value: number): void;
}>();

defineSlots<{
  /** 球心自定义内容（默认渲染 `current%` 文字）。 */
  default?(): unknown;
}>();

const clampedPercent = computed(() => Math.min(100, Math.max(0, props.percent)));

/** 过渡中的水位（`v-model:current`），JS 缓动驱动以便文字与波浪同步。 */
const current = ref(clampedPercent.value);
let ticker: ReturnType<typeof setInterval> | null = null;

function stopTicker(): void {
  if (ticker !== null) {
    clearInterval(ticker);
    ticker = null;
  }
}

watch(
  clampedPercent,
  (target) => {
    stopTicker();
    const from = current.value;
    const delta = target - from;
    if (delta === 0 || props.duration <= 0) {
      current.value = target;
      emit('update:current', Math.round(target));
      return;
    }
    const startedAt = Date.now();
    ticker = setInterval(() => {
      const t = Math.min(1, (Date.now() - startedAt) / props.duration);
      const eased = 1 - Math.pow(1 - t, 3);
      current.value = from + delta * eased;
      emit('update:current', Math.round(current.value));
      if (t >= 1) stopTicker();
    }, 30);
  },
  { immediate: true },
);

onBeforeUnmount(stopTicker);

/** 解析长度字符串（数值 + 单位），供波浪几何计算。 */
function parseLength(input: string): { value: number; unit: string } {
  const match = /^(-?[\d.]+)(rpx|px|%)?$/.exec(input.trim());
  if (match === null) return { value: 160, unit: 'rpx' };
  return { value: Number(match[1]), unit: match[2] ?? 'rpx' };
}

const rootClass = computed(() => [
  'sn-liquid',
  { 'sn-liquid--outline': props.outline },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts = [
    `width: ${props.size}`,
    `height: ${props.size}`,
    `border-radius: ${props.radius}`,
    `background-color: ${props.innerColor}`,
  ];
  if (props.customStyle !== '') parts.push(props.customStyle);
  return parts.join('; ');
});

const waterStyle = computed(
  () =>
    `height: ${current.value}%; transition: height ${props.duration}ms cubic-bezier(0.33, 1, 0.68, 1)`,
);

/** 波浪块几何：宽度 / 高度 2×size，顶缘探出水面约 0.2×size 并绕中心旋转。 */
const frontWaveStyle = computed(() => {
  const { value, unit } = parseLength(props.size);
  return [
    `width: ${value * 2}${unit}`,
    `height: ${value * 2}${unit}`,
    `left: ${-value * 0.5}${unit}`,
    `top: ${-value * 0.2}${unit}`,
    `background-color: ${props.waveColor}`,
  ].join('; ');
});

const backWaveStyle = computed(() => {
  const { value, unit } = parseLength(props.size);
  return [
    `width: ${value * 2}${unit}`,
    `height: ${value * 2}${unit}`,
    `left: ${-value * 0.62}${unit}`,
    `top: ${-value * 0.26}${unit}`,
    `background-color: ${props.waveColor}`,
    'opacity: 0.45',
  ].join('; ');
});
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    role="img"
    :aria-label="`进度 ${Math.round(current)}%`"
  >
    <view class="sn-liquid__water" :style="waterStyle">
      <view class="sn-liquid__wave sn-liquid__wave--back" :style="backWaveStyle" />
      <view class="sn-liquid__wave sn-liquid__wave--front" :style="frontWaveStyle" />
    </view>
    <view class="sn-liquid__label">
      <slot>
        <text class="sn-liquid__text">{{ Math.round(current) }}%</text>
      </slot>
    </view>
  </view>
</template>

<style scoped>
.sn-liquid {
  position: relative;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  box-sizing: border-box;
}

.sn-liquid--outline {
  border: 6rpx solid var(--sn-mp-color-action-primary);
}

/* 水体：高度 = 水位百分比，波浪块从其顶缘向上探出（根节点圆角裁剪）。 */
.sn-liquid__water {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
}

.sn-liquid__wave {
  position: absolute;
  border-radius: 45%;
}

.sn-liquid__wave--front {
  animation: sn-liquid-spin 5s linear infinite;
}

.sn-liquid__wave--back {
  animation: sn-liquid-spin 8s linear infinite reverse;
}

.sn-liquid__label {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.sn-liquid__text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
}

@keyframes sn-liquid-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
