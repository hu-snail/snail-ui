<script setup lang="ts">
/** Demo: sn-tabs — 底部条样式与禁用页签。 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const active = ref(1);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTabs v-model="active" line-theme="underline" sticky>
      <SnTab title="推荐" :name="0">推荐内容</SnTab>
      <SnTab title="关注" :name="1">关注内容</SnTab>
      <SnTab title="停用" :name="2" disabled>不可点击</SnTab>
    </SnTabs>
    <text class="sn-demo__meta">line-theme=underline + sticky；第三个页签 disabled</text>
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
