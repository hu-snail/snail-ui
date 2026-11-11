<script setup lang="ts">
/** Demo: sn-navbar — 左右插槽（#left / #right）。 */
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Bell, Settings } from '@snui/uni-src/components/sn-icon/sn-icon-set';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnNavbar title="自定义插槽">
      <template #left>
        <SnIcon :icon="Settings" :size="36" />
      </template>
      <template #right>
        <SnIcon :icon="Bell" :size="36" />
      </template>
    </SnNavbar>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
