<script setup lang="ts">
/**
 * Demo: sn-tabs — English shadow of tabs-mp-disabled.
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const disabledActive = ref(0);
const disabledHits = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTabs v-model="disabledActive" @disabled="disabledHits += 1">
      <SnTab title="For you" :name="0">For you content</SnTab>
      <SnTab title="Following" :name="1">Following content</SnTab>
      <SnTab title="Disabled" :name="2" disabled
        >Not tappable — a tap only emits the disabled event</SnTab
      >
    </SnTabs>

    <text class="sn-demo__meta">
      The disabled event fired {{ disabledHits }} time(s); active tab: {{ disabledActive }}
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  align-items: stretch;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
