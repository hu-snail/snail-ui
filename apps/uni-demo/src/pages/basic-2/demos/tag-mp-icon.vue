<script setup lang="ts">
/**
 * Demo: sn-tag (uni-end) — 图标三轨：内置目录名 / IconData 对象 / iconUrl 位图。
 *
 * 内置目录名（kebab-case）无需注册直接解析；`IconData` 对象从
 * sn-icon-set 具名导入后直接传入（tree-shaking 友好）；`iconUrl` 渲染
 * `<image>`，尺寸与图标档位 token 对齐。优先级：插槽 > iconUrl > 对象 /
 * 目录名 > cssIcon 字体图标。
 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';
import { Gift, Truck } from '@snui/uni-src/components/sn-icon/sn-icon-set';

/** 位图图标：与矢量图标共用同一组尺寸档位。 */
const brandLogo = 'https://picsum.photos/seed/snui-tag-brand/48/48';
const badgeShot = 'https://picsum.photos/seed/snui-tag-shot/48/48';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">内置目录名，无需注册</text>
    <view class="sn-demo__row">
      <SnTag type="success" variant="light" icon="check">已校验</SnTag>
      <SnTag type="warning" variant="light" icon="clock">待处理</SnTag>
      <SnTag type="default" variant="light" icon="bell">提醒</SnTag>
    </view>

    <text class="sn-demo__meta">IconData 对象，具名导入免注册</text>
    <view class="sn-demo__row">
      <SnTag type="pink" variant="light" :icon="Gift">礼品卡</SnTag>
      <SnTag type="primary" variant="light" :icon="Truck">次日达</SnTag>
    </view>

    <text class="sn-demo__meta">iconUrl 位图图标（尺寸随图标档位）</text>
    <view class="sn-demo__row">
      <SnTag :icon-url="brandLogo">品牌合作</SnTag>
      <SnTag size="small" :icon-url="badgeShot">勋章</SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  align-items: flex-start;
}

.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  align-items: center;
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
