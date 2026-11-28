<script setup lang="ts">
/**
 * Demo: sn-cell — 卡片形态（card：整组一张卡）。
 *
 * 上：sn-cell-group card 模式，整组渲染为一张圆角卡片（token 圆角 / 描边 /
 * 阴影），行间以内嵌分割线分开；下：sn-cell card 脱离分组单独成卡，间距由
 * 外层用同一 token 保持一致。
 */
import {
  Camera,
  CreditCard,
  Gift,
  Truck,
  Wallet,
} from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column sn-demo--card">
    <text class="sn-demo__label">分组卡片（sn-cell-group card，整组一张卡，行间内嵌分割线）</text>
    <SnCellGroup title="快捷入口" card>
      <SnCell title="扫一扫" :prefix-icon-data="Camera" is-link />
      <SnCell title="收付款" :prefix-icon-data="CreditCard" is-link />
      <SnCell title="卡包" :prefix-icon-data="Wallet" is-link />
    </SnCellGroup>

    <text class="sn-demo__label">独立卡片行（sn-cell card，脱离分组单独成卡）</text>
    <view class="sn-demo__cards">
      <SnCell title="会员中心" value="开通权益" :prefix-icon-data="Gift" card is-link />
      <SnCell title="配送状态" value="运输中" :prefix-icon-data="Truck" card is-link />
    </view>
  </view>
</template>

<style scoped>
/* 通栏页里只有卡片形态保留左右外间距：信息行贴边铺满整行，卡片浮在画布上。 */
.sn-demo--card {
  padding: 0 var(--sn-mp-spacing-4);
  box-sizing: border-box;
}

.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__cards {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
