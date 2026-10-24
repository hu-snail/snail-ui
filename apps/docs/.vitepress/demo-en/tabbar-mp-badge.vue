<script setup lang="ts">
/** Demo: sn-tabbar — badges, dot badges and the round shape. */
import { ref } from 'vue'
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue'
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue'

const active = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTabbar v-model="active" shape="round" bordered>
      <SnTabbarItem title="Messages" icon="Bell" :value="12" />
      <SnTabbarItem title="Alerts" icon="Heart" is-dot />
      <SnTabbarItem title="Mine" icon="User" :value="120" :max="99" />
    </SnTabbar>
    <text class="sn-demo__meta">A numeric badge above max renders 99+</text>
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
