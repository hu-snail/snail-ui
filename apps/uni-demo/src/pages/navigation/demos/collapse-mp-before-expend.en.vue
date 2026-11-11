<script setup lang="ts">
/**
 * Demo: sn-collapse — English shadow of collapse-mp-before-expend.
 *
 * `before-expend` runs before expanding (receives `name`); returning `false` vetoes it.
 */
import { ref } from 'vue';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const open = ref(['a']);
const attempts = ref(0);

/** Block the first two expand attempts. */
function beforeExpend(): boolean {
  attempts.value += 1;
  return attempts.value > 2;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCollapse v-model="open">
      <SnCollapseItem name="a" title="Shipping" :before-expend="beforeExpend">
        <text class="sn-demo__body">SF Express, delivery in 2 days.</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="Payment">
        <text class="sn-demo__body">WeChat Pay and Alipay are supported.</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__meta"
      >before-expend blocked {{ Math.min(attempts, 2) }} times; open:
      {{ open.join(', ') || 'none' }}</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
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
