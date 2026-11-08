<script setup lang="ts">
/**
 * Demo: sn-drop-menu — 向上 / 向下两种展开方向对比。
 *
 * - `direction="down"`（默认）：面板从菜单栏下沿展开，箭头静止朝下、展开后翻转朝上
 * - `direction="up"`：面板从菜单栏上沿展开，箭头静止朝上、展开后翻转朝下
 * - 两种方向的蒙层都锚定在面板对侧：向下展开铺在菜单栏下方，向上展开铺在菜单栏上方
 *
 * 选项图标走内置图标集对象（sn-icon-set 具名导入），零注册。
 *
 * 预览专用：`custom-class="sn-demo-contained"` 把面板的定位上下文收在 demo 内。
 */
import { ref } from 'vue';
import { ArrowDown, Clock, Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

const downValue = ref('default');
const upValue = ref('default');

const options = [
  { label: '综合排序', value: 'default', tip: '推荐', iconData: Star },
  { label: '价格从低到高', value: 'price-asc', iconData: ArrowDown },
  { label: '最新上架', value: 'newest', iconData: Clock },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">向下展开（direction="down"，默认）</text>
    <SnDropMenu v-model="downValue" :options="options" custom-class="sn-demo-contained" />

    <text class="sn-demo__label">向上展开（direction="up"）</text>
    <SnDropMenu
      v-model="upValue"
      :options="options"
      direction="up"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__meta">向下：{{ downValue }} ／ 向上：{{ upValue }}</text>
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
