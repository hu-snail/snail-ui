<script setup lang="ts">
/** Demo: sn-tabbar — basic tab bar with v-model. */
import { ref } from 'vue';
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';

const active = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTabbar v-model="active" bordered>
      <SnTabbarItem title="Home" icon="Home" />
      <SnTabbarItem title="Discover" icon="Search" />
      <SnTabbarItem title="Mine" icon="User" />
    </SnTabbar>
    <text class="sn-demo__meta">Active index: {{ active }}</text>
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
