<script setup lang="ts">
/** Demo: sn-collapse — basic panels with title icons and one icon scale. */
import { ref } from 'vue';
import { CreditCard, FileText, Truck } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const open = ref(['a']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="open">
      <SnCollapseItem name="a" title="Shipping" :title-icon-data="Truck">
        <text class="sn-demo__body">SF Express, delivery in about 2 days.</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="Payment" :title-icon-data="CreditCard">
        <text class="sn-demo__body">WeChat Pay and Alipay are both supported.</text>
      </SnCollapseItem>
      <SnCollapseItem name="c" title="Invoice" :title-icon-data="FileText">
        <text class="sn-demo__body">Request an e-invoice once the order completes.</text>
      </SnCollapseItem>
    </SnCollapse>
    <text class="sn-demo__meta">Expanded: {{ open.join(', ') || 'none' }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__body {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
