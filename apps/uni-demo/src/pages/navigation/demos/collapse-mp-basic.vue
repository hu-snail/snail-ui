<script setup lang="ts">
/**
 * Demo: sn-collapse — 基础折叠面板（标题图标 + 统一图标几何）。
 *
 * 标题图标走内置图标集对象（`titleIconData`，sn-icon-set 具名导入），
 * 箭头与标题图标共享同一个 `--sn-mp-icon-size-*` 尺寸 token。
 */
import { ref } from 'vue';
import { CreditCard, FileText, Truck } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const open = ref(['a']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="open">
      <SnCollapseItem name="a" title="配送方式" :title-icon-data="Truck">
        <text class="sn-demo__body">顺丰速运，预计 2 天送达。</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="支付方式" :title-icon-data="CreditCard">
        <text class="sn-demo__body">支持微信支付与支付宝。</text>
      </SnCollapseItem>
      <SnCollapseItem name="c" title="发票信息" :title-icon-data="FileText">
        <text class="sn-demo__body">可在订单完成后申请电子发票。</text>
      </SnCollapseItem>
    </SnCollapse>
    <text class="sn-demo__meta">已展开：{{ open.join('、') || '无' }}</text>
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
