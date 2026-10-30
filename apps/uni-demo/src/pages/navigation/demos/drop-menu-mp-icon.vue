<script setup lang="ts">
/**
 * Demo: sn-drop-menu — 选项图标三种来源、优先级与选中态。
 *
 * 图标来源（优先级：对象 > 图片 > 名称）：
 *   - `option.iconData`：内置图标集对象（sn-icon-set 具名导入），零注册
 *   - `option.iconUrl`：图片地址，按 `<image>` 渲染
 *   - `option.icon`：名称解析链（内置目录 kebab 名零注册 / registerSnIcons 名）
 *
 * 选中态勾选走内置图标集，`icon-name` 可换（默认 `check`，示例用 `circle-check`）。
 * 图标尺寸统一走 `icon-size`：档位名映射 `--sn-mp-icon-size-*`，数字 / 任意长度原样透传。
 *
 * 预览专用：`custom-class="sn-demo-contained"` 把面板的定位上下文收在 demo 内。
 */
import { ref } from 'vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Star, Truck } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

// IconData 内联样板（lucide 路径数据，ISC）。
const FlameIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  ],
};

// 注册表轨道：注册后即可按图标名引用（registerSnIcons 幂等，合并注册）。
registerSnIcons({ 'drop-menu-flame': FlameIcon });

const byData = ref('hot');
const byName = ref('rate');
const byUrl = ref('brand');
const large = ref('hot');
const precedence = ref('all');

const dataOptions = [
  { label: '人气推荐', value: 'hot', tip: '综合销量', iconData: FlameIcon },
  { label: '精选好物', value: 'star', tip: '编辑推荐', iconData: Star },
  { label: '同城配送', value: 'city', tip: '最快 30 分钟', iconData: Truck },
];

const nameOptions = [
  { label: '高评分优先', value: 'rate', icon: 'star' },
  { label: '最新上架', value: 'new', icon: 'clock' },
  { label: '人气榜', value: 'hot', icon: 'drop-menu-flame' },
];

const urlOptions = [
  { label: '品牌专区', value: 'brand', iconUrl: 'https://picsum.photos/seed/snui-drop-menu/96' },
  { label: '纯文本项', value: 'plain' },
];

// 三源同传 → iconData 胜出（对象 > 图片 > 名称）。
const precedenceOptions = [
  {
    label: '对象优先',
    value: 'all',
    iconData: Star,
    iconUrl: 'https://picsum.photos/seed/snui-drop-menu-priority/96',
    icon: 'clock',
  },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">来源一：内置图标集对象（iconData，优先级最高）</text>
    <SnDropMenu v-model="byData" :options="dataOptions" custom-class="sn-demo-contained" />

    <text class="sn-demo__label">来源二：名称解析链（内置目录名 / 注册表名）</text>
    <SnDropMenu v-model="byName" :options="nameOptions" custom-class="sn-demo-contained" />

    <text class="sn-demo__label">来源三：图片地址（iconUrl，按 image 渲染）</text>
    <SnDropMenu v-model="byUrl" :options="urlOptions" custom-class="sn-demo-contained" />

    <text class="sn-demo__label">
      图标尺寸与勾选图标（icon-size="large" + icon-name="circle-check"）
    </text>
    <SnDropMenu
      v-model="large"
      :options="dataOptions"
      icon-size="large"
      icon-name="circle-check"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__label">优先级：三源同传时 iconData 胜出</text>
    <SnDropMenu v-model="precedence" :options="precedenceOptions" custom-class="sn-demo-contained" />

    <text class="sn-demo__meta">
      对象：{{ byData }} ／ 名称：{{ byName }} ／ 图片：{{ byUrl }}
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-demo :deep(.sn-drop-menu.sn-demo-contained) {
  position: relative;
}
</style>
