<script setup lang="ts">
/** Demo: sn-cell — card form (card: the whole group renders as ONE rounded card). */
import { Camera, CreditCard, Gift, Truck, Wallet } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">Card group (sn-cell-group card — one card, inner hairlines)</text>
    <SnCellGroup title="Quick actions" card>
      <SnCell title="Scan" :prefix-icon-data="Camera" is-link />
      <SnCell title="Pay & collect" :prefix-icon-data="CreditCard" is-link />
      <SnCell title="Card wallet" :prefix-icon-data="Wallet" is-link />
    </SnCellGroup>

    <text class="sn-demo__label">Standalone card rows (sn-cell card, no group needed)</text>
    <view class="sn-demo__cards">
      <SnCell title="Membership" value="Perks" :prefix-icon-data="Gift" card is-link />
      <SnCell title="Delivery" value="In transit" :prefix-icon-data="Truck" card is-link />
    </view>
  </view>
</template>

<style scoped>
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
