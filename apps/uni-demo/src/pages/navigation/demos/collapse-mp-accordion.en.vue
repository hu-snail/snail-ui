<script setup lang="ts">
/**
 * Demo: sn-collapse — English shadow of collapse-mp-accordion.
 *
 * accordion turns v-model into a string and keeps one panel open at a time.
 */
import { ref } from 'vue';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const open = ref('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="open" accordion>
      <SnCollapseItem name="a" title="FAQ">
        <text class="sn-demo__body"
          >Only one panel stays open at a time. Tapping the open header collapses it; tapping
          another header switches the active panel — ideal for FAQs and settings groups.</text
        >
      </SnCollapseItem>
      <SnCollapseItem name="b" title="Return policy">
        <text class="sn-demo__body"
          >7-day no-questions returns. Items must be unused and in their original packaging; refunds
          go back to the original payment method within 1-3 business days after the warehouse
          receives them.</text
        >
      </SnCollapseItem>
    </SnCollapse>
    <text class="sn-demo__meta">Currently open: {{ open || 'none' }}</text>
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
