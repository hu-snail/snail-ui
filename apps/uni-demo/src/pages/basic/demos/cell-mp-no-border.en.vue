<script setup lang="ts">
/**
 * Demo: sn-cell-group — no border (`:border="false"`).
 *
 * `border` defaults to true: card / insert groups draw a container outline
 * and plain groups draw top / bottom rules. Turning it off keeps radius,
 * shadow and inner dividers — useful inside pages that bring their own
 * separators.
 */
import { Camera, CreditCard, Wallet } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">Card group without outline (sn-cell-group card :border="false")</text>
    <SnCellGroup title="Quick actions" card :border="false">
      <SnCell title="Scan" :prefix-icon-data="Camera" is-link />
      <SnCell title="Pay &amp; collect" :prefix-icon-data="CreditCard" is-link />
      <SnCell title="Card wallet" :prefix-icon-data="Wallet" is-link />
    </SnCellGroup>

    <text class="sn-demo__label">Insert group without outline (sn-cell-group insert :border="false")</text>
    <SnCellGroup title="Recent" insert :border="false">
      <SnCell title="Scan" :prefix-icon-data="Camera" is-link />
      <SnCell title="Card wallet" :prefix-icon-data="Wallet" is-link />
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
