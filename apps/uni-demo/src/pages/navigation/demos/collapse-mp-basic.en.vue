<script setup lang="ts">
/** Demo: sn-collapse — basic collapsible panels. */
import { ref } from 'vue';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const open = ref(['a']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="open">
      <SnCollapseItem name="a" title="Shipping"
        >SF Express, delivery in about 2 days.</SnCollapseItem
      >
      <SnCollapseItem name="b" title="Payment"
        >WeChat Pay and Alipay are both supported.</SnCollapseItem
      >
      <SnCollapseItem name="c" title="Invoice"
        >Request an e-invoice once the order completes.</SnCollapseItem
      >
    </SnCollapse>
    <text class="sn-demo__meta">Expanded: {{ open.join(', ') || 'none' }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
