<script setup lang="ts">
/**
 * Demo: sn-collapse — accordion mode with title icons and a disabled panel.
 *
 * A disabled panel keeps the neutral icon colour and never reacts to taps.
 */
import { ref } from 'vue';
import { HelpCircle, Info, Lock } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const open = ref('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="open" accordion>
      <SnCollapseItem name="a" title="FAQ" :title-icon-data="HelpCircle">
        <text class="sn-demo__body">Only one panel stays open at a time.</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="Return policy" :title-icon-data="Info">
        <text class="sn-demo__body">7-day no-questions returns.</text>
      </SnCollapseItem>
      <SnCollapseItem name="c" title="Unavailable" :title-icon-data="Lock" disabled>
        <text class="sn-demo__body">This panel is disabled.</text>
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
