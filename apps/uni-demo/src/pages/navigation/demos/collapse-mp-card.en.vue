<script setup lang="ts">
/**
 * Demo: sn-collapse — card form with a title icon per card.
 *
 * - `card` on sn-collapse: the container goes transparent and the panels stack
 *   with a token gap; every panel paints its own radius / border / shadow and
 *   the shared divider steps aside so a card never doubles up
 * - title icon source one of three: a built-in set object (`titleIconData`),
 *   imported from sn-icon-set and passed as data — zero registration
 * - `iconSize` keeps the chevron and the title icon on one size tier
 * - a single panel can use `card` on its own, outside a card container
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
    <text class="sn-demo__label">Card form (collapse card, one card per panel)</text>
    <SnCollapse v-model="open" card icon-size="medium">
      <SnCollapseItem name="a" title="Delivery" :title-icon-data="Truck">
        <text class="sn-demo__body">SF Express, arriving in about 2 days with live tracking.</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="Payment" :title-icon-data="CreditCard">
        <text class="sn-demo__body">WeChat Pay and Alipay are supported; invoice details later.</text>
      </SnCollapseItem>
      <SnCollapseItem name="c" title="Invoice" :title-icon-data="FileText" icon-size="small">
        <text class="sn-demo__body">The e-invoice reaches your inbox within 24 hours.</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__label">Single card (collapse-item card, container stays flat)</text>
    <SnCollapse v-model="single">
      <SnCollapseItem name="m" title="Membership" :title-icon-data="Truck" card>
        <text class="sn-demo__body">Members get a free-shipping coupon every month.</text>
      </SnCollapseItem>
      <SnCollapseItem name="n" title="Shipping notes">
        <text class="sn-demo__body">A plain panel keeps the shared divider next to a card.</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__meta">Expanded: {{ open.join(', ') || 'none' }}</text>
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
