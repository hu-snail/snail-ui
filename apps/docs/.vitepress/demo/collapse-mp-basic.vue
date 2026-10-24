<script setup lang="ts">
/** Demo: sn-collapse — 基础折叠面板。 */
import { ref } from 'vue'
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue'
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue'

const open = ref(['a'])
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="open">
      <SnCollapseItem name="a" title="配送方式">顺丰速运，预计 2 天送达。</SnCollapseItem>
      <SnCollapseItem name="b" title="支付方式">支持微信支付与支付宝。</SnCollapseItem>
      <SnCollapseItem name="c" title="发票信息">可在订单完成后申请电子发票。</SnCollapseItem>
    </SnCollapse>
    <text class="sn-demo__meta">已展开：{{ open.join('、') || '无' }}</text>
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
