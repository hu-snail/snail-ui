<script setup lang="ts">
/**
 * Demo: sn-cell-group — 无边框形态（:border="false"）。
 *
 * `border` 默认 true：卡片 / 插入组画容器描边，普通组画上下边线；置 false
 * 后只保留圆角 / 阴影与行间分割线，适合嵌在自带分隔的页面里。
 */
import { Camera, CreditCard, Wallet } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">卡片组去描边（sn-cell-group card :border="false"）</text>
    <SnCellGroup title="快捷入口" card :border="false">
      <SnCell title="扫一扫" :prefix-icon-data="Camera" is-link />
      <SnCell title="收付款" :prefix-icon-data="CreditCard" is-link />
      <SnCell title="卡包" :prefix-icon-data="Wallet" is-link />
    </SnCellGroup>

    <text class="sn-demo__label">插入组去描边（sn-cell-group insert :border="false"）</text>
    <SnCellGroup title="最近使用" insert :border="false">
      <SnCell title="扫一扫" :prefix-icon-data="Camera" is-link />
      <SnCell title="卡包" :prefix-icon-data="Wallet" is-link />
    </SnCellGroup>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
