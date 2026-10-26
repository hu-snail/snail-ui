<script setup lang="ts">
/** Demo: sn-collapse — view-more mode (clamped to 2 lines). */
import { ref } from 'vue';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const expanded = ref(false);
const longText =
  'AUI is an AI-native multi-end UI framework. It treats the schema as the single ' +
  'source of truth and separates Protocol, Runtime and Renderer so one description ' +
  'runs on web, miniprogram and native app. Components only render and interact; ' +
  'business state belongs to the host AppBridge.';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="expanded" viewmore :line-num="2">
      <SnCollapseItem name="intro" title="About the framework">{{ longText }}</SnCollapseItem>
    </SnCollapse>
    <text class="sn-demo__meta">expanded = {{ expanded }}</text>
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
