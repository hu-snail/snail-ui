<script setup lang="ts">
/** Demo: sn-collapse — view-more mode (clamped to 2 lines). */
import { ref } from 'vue';
import { FileText } from '@snui/uni-src/components/sn-icon/sn-icon-set';
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
      <SnCollapseItem name="intro" title="About the framework" :title-icon-data="FileText">
        <text class="sn-demo__body">{{ longText }}</text>
      </SnCollapseItem>
    </SnCollapse>
    <text class="sn-demo__meta">expanded = {{ expanded }}</text>
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
