<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 细边框（`hairline`，全类型描边开关）。
 *
 * hairline 默认 true：default 类型显示灰细边框，语义类型以描边形态
 * 显示主题色；置 false 后全部类型去边框。加载态见「加载」模块。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">细边框（默认开启）：语义类型以描边形态显示主题色</text>
    <view class="sn-demo__row">
      <SnButton>默认按钮</SnButton>
      <SnButton variant="plain" type="primary">主要按钮</SnButton>
      <SnButton variant="plain" type="success">成功按钮</SnButton>
      <SnButton variant="plain" type="info">信息按钮</SnButton>
      <SnButton variant="plain" type="warning">警告按钮</SnButton>
      <SnButton variant="plain" type="danger">危险按钮</SnButton>
    </view>

    <text class="sn-demo__meta">去掉边框（hairline=false）：全部类型去描边</text>
    <view class="sn-demo__row">
      <SnButton :hairline="false">默认按钮</SnButton>
      <SnButton :hairline="false" variant="plain" type="primary">主要按钮</SnButton>
      <SnButton :hairline="false" variant="plain" type="success">成功按钮</SnButton>
      <SnButton :hairline="false" variant="plain" type="info">信息按钮</SnButton>
      <SnButton :hairline="false" variant="plain" type="warning">警告按钮</SnButton>
      <SnButton :hairline="false" variant="plain" type="danger">危险按钮</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
