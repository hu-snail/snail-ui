<script setup lang="ts">
/**
 * DemoModuleHead —— 组件页场景模块标题行：着色图标 chip +
 * 场景标题 + 场景徽标（演示工程组件规范视觉稿的分区头）。
 *
 * - 图标 / 着色由 `index` 在固定色环上轮转（6 组 tint），同一页多模块
 *   依次取色，视觉与组件规范稿的分区 chip 一致。
 * - 徽标（badge）展示场景 key（mono 小字，如 `form-type`），空串不渲染。
 * - 深色下 chip 用半透明 tint + 提亮前景，避免浅色底在暗色画布上眩光。
 *
 * 图标数据内联自 lucide（ISC，与 DemoPageShell 同源约定）。
 */
import { computed } from 'vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { useDemoUi } from '../state/demo-ui';

const props = withDefaults(
  defineProps<{
    /** 场景标题（调用方经 useDemoUi 的 t() 传入双语）。 */
    title: string;
    /** 场景徽标文案（场景 key）；空串不渲染。 */
    badge?: string;
    /** 模块序号（0 起），决定图标与 tint 色环轮转。 */
    index?: number;
  }>(),
  { badge: '', index: 0 },
);

const { isDark } = useDemoUi();

// lucide.dev — ISC license（Redistribution 说明见 sn-icon-set.ts 头注）
const ComponentIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    'M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z',
    'm12 2 3.5 3.5L12 9 8.5 5.5 12 2Z',
    'M12 15l3.5 3.5L12 22l-3.5-3.5L12 15Z',
    'M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z',
  ],
};
const RulerIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    'M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z',
    'm14.5 3.5 2 2',
    'm11.5 6.5 2 2',
    'm8.5 9.5 2 2',
    'm5.5 12.5 2 2',
  ],
};
const LayersIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M12 2 2 7l10 5 10-5-10-5Z', 'm2 17 10 5 10-5', 'm2 12 10 5 10-5'],
};
const ZapIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M13 2 3 14h9l-1 8 10-12h-9l1-8Z'],
};
const SlidersIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    'M21 4h-7',
    'M10 4H3',
    'M21 12h-9',
    'M8 12H3',
    'M21 20h-5',
    'M12 20H3',
    'M14 2v4',
    'M8 10v4',
    'M16 18v4',
  ],
};
const PaletteIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    'M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z',
    'M13.5 6.5h.01',
    'M17.5 10.5h.01',
    'M8.5 7.5h.01',
    'M6.5 12.5h.01',
  ],
};

const MODULE_ICONS: IconData[] = [
  ComponentIcon,
  RulerIcon,
  LayersIcon,
  ZapIcon,
  SlidersIcon,
  PaletteIcon,
];

/** 浅色 chip 用规范稿的 tint 底 + 深色字（blue/emerald/teal/indigo/amber/rose）。 */
const TINTS = [
  { bg: '#eff6ff', fg: '#2563eb', darkBg: 'rgba(59, 130, 246, 0.2)', darkFg: '#93b4f8' },
  { bg: '#ecfdf5', fg: '#059669', darkBg: 'rgba(16, 185, 129, 0.2)', darkFg: '#6ee7b7' },
  { bg: '#f0fdfa', fg: '#0d9488', darkBg: 'rgba(20, 184, 166, 0.2)', darkFg: '#5eead4' },
  { bg: '#eef2ff', fg: '#4f46e5', darkBg: 'rgba(99, 102, 241, 0.2)', darkFg: '#a5b4fc' },
  { bg: '#fffbeb', fg: '#d97706', darkBg: 'rgba(245, 158, 11, 0.2)', darkFg: '#fcd34d' },
  { bg: '#fff1f2', fg: '#e11d48', darkBg: 'rgba(244, 63, 94, 0.2)', darkFg: '#fda4af' },
] as const;

const step = computed(() => props.index % MODULE_ICONS.length);
const icon = computed(() => MODULE_ICONS[step.value] as IconData);
const tint = computed(() => TINTS[step.value]);
const chipStyle = computed(() =>
  isDark.value
    ? { background: tint.value.darkBg, color: tint.value.darkFg }
    : { background: tint.value.bg, color: tint.value.fg },
);
</script>

<template>
  <view class="demo-module-head">
    <view class="demo-module-head__icon" :style="chipStyle">
      <SnIcon :icon="icon" :size="14" />
    </view>
    <text class="demo-module-head__title">{{ title }}</text>
    <text v-if="badge !== ''" class="demo-module-head__badge">{{ badge }}</text>
  </view>
</template>

<style scoped>
.demo-module-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16rpx;
  padding-bottom: 24rpx;
}

.demo-module-head__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.demo-module-head__title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--demo-title);
}

.demo-module-head__badge {
  margin-left: auto;
  padding: 4rpx 12rpx;
  font-size: 20rpx;
  font-family: Menlo, Consolas, monospace;
  color: var(--demo-text-3);
  background: var(--demo-chip-bg);
  border: 1px solid var(--demo-chip-border);
  border-radius: 4rpx;
}
</style>
