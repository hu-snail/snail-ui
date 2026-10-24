<script setup lang="ts">
/** Demo: sn-tabs — bar styles and a disabled tab. */
import { ref } from 'vue'
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue'
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue'

const active = ref(1)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTabs v-model="active" line-theme="underline" sticky>
      <SnTab title="For you" :name="0">For you content</SnTab>
      <SnTab title="Following" :name="1">Following content</SnTab>
      <SnTab title="Disabled" :name="2" disabled>Not tappable</SnTab>
    </SnTabs>
    <text class="sn-demo__meta">line-theme=underline with sticky; the third tab is disabled</text>
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
