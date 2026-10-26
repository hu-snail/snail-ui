<script setup lang="ts">
/** Demo: sn-collapse — accordion mode and a disabled panel. */
import { ref } from 'vue';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const open = ref('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="open" accordion>
      <SnCollapseItem name="a" title="FAQ">Only one panel stays open at a time.</SnCollapseItem>
      <SnCollapseItem name="b" title="Return policy">7-day no-questions returns.</SnCollapseItem>
      <SnCollapseItem name="c" title="Unavailable" disabled>This panel is disabled.</SnCollapseItem>
    </SnCollapse>
    <text class="sn-demo__meta">Currently open: {{ open || 'none' }}</text>
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
