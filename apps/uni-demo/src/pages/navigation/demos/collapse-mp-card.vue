<script setup lang="ts">
/**
 * Demo: sn-collapse — 卡片形态（card）+ 卡片标题图标。
 *
 * - `card` 开在 sn-collapse 上：容器透明、面板之间走 token 间距，每个面板
 *   自带圆角 / 描边 / 阴影，共享分割线自动让位（不会叠两条线）
 * - 标题图标三种来源里的内置图标集对象（`titleIconData`）：sn-icon-set 具名
 *   导入后按对象传，零注册
 * - `iconSize` 统一卡片内箭头与标题图标的尺寸档位
 * - 单个面板也可用 `card` 脱离卡片容器单独成卡
 */
import { ref } from 'vue';
import { CreditCard, FileText, Truck } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const open = ref(['a']);
const single = ref([]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">卡片形态（collapse card，每个面板独立成卡）</text>
    <SnCollapse v-model="open" card icon-size="medium">
      <SnCollapseItem name="a" title="订单配送" :title-icon-data="Truck">
        <text class="sn-demo__body">顺丰速运，预计 2 天送达，可随时查看物流轨迹。</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="支付方式" :title-icon-data="CreditCard">
        <text class="sn-demo__body">支持微信支付与支付宝，开票信息可在订单完成后填写。</text>
      </SnCollapseItem>
      <SnCollapseItem name="c" title="发票信息" :title-icon-data="FileText" icon-size="small">
        <text class="sn-demo__body">电子发票在订单完成后 24 小时内推送至邮箱。</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__label">单面板成卡（collapse-item card，容器不分卡）</text>
    <SnCollapse v-model="single">
      <SnCollapseItem name="m" title="会员权益" :title-icon-data="Truck" card>
        <text class="sn-demo__body">会员每月可领取一张免运费券，自动叠加最优优惠。</text>
      </SnCollapseItem>
      <SnCollapseItem name="n" title="配送说明">
        <text class="sn-demo__body">普通面板保留共享分割线，与卡片面板混排也不叠线。</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__meta">已展开：{{ open.join('、') || '无' }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
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
